GiveItAll.QTEScriptLoader = function(player, targetScore, timer, difficulty) {

    let sfxAudioFiles = [];
    sfxAudioFiles.push(new Audio("Resources/Audio/MultBarDown.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/MultBarUp.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/MultBarLevelUp.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/CountDown.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/CountDownGo.mp3"));
    sfxAudioFiles.push(new Audio("Resources/Audio/CountDownGo2.mp3"));
    sfxAudioFiles.push(new Audio(`Resources/Audio/Song${difficulty}.mp3`));
    sfxAudioFiles.push(new Audio("Resources/Audio/MenuConfirm.wav"));

    GiveItAll.MediaLoader(sfxAudioFiles, QTEScript, player, targetScore, timer, difficulty);

    function QTEScript(player, targetScore, timer, difficulty) {

        let QTESong = GiveItAll.playSound(sfxAudioFiles[6].src,"bgm");

        let $mainFrame = $("<svg width='80vw' height='90%' viewBox='-40 0 180 100'></svg>").appendTo($("body"))
            .attr("id", "svg");

        let $defs = $(document.createElementNS("http://www.w3.org/2000/svg", "defs"))
            .appendTo($mainFrame);

        let $grad = $(document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"))
            .attr({
                id: "grad",
                x1: "35%",
                y1: "-20%",
                x2: "100%",
                y2: "100%"
            })
            .appendTo($defs);
        let $stop1 = $(document.createElementNS("http://www.w3.org/2000/svg", "stop"))
            .attr({
                offset: "0%",
                style: "stop-color:rgb(0,0,0);stop-opacity:1"
            })
            .appendTo($grad);
        let $stop2 = $(document.createElementNS("http://www.w3.org/2000/svg", "stop"))
            .attr({
                offset: "50%",
                style: "stop-color:rgb(0,0,0);stop-opacity:1"
            })
            .appendTo($grad);
        let $stop3 = $(document.createElementNS("http://www.w3.org/2000/svg", "stop"))
            .attr({
                offset: "100%",
                style: "stop-color:rgb(0,0,0);stop-opacity:1"
            })
            .appendTo($grad);

        let score = 0;
        let timeoutO, scoreModifO, rhythmO;
        let startTime;
        let combo;
        let remover, hvremover = [], spawnTimeout, durationTimeout, countdownsTimeout = [], timerInterval;

        let multBarProg = ["lightseagreen", "yellow", "orange", "red", "purple", "blue", "darkblue", "black"];
        let baseComboHue = {
            r: 20,
            g: 20,
            b: 156
        };

        $(document.body)
            .append(`<div id='scoreTable'><div id='scoreBar'></div>
    <p class="score" id="ownScore">Scor : 0</p><p class="score" id="targetScore">Obiectiv : ${targetScore}</p></div>`)
            .append(`<div id='buttonsCont'><span class="material-icons" id="refresh">refresh </span>
    <span class="material-icons" id="back">arrow_back_ios </span></div>`)
            .append(`<div id='multTable'><div id='multBase'></div><div id='multBar'></div>
    <p id='multBonus'>Bonus : X1.00</p></div>`)
            .append(`<div id="timeTable"><p id="time">Timp ramas : ${timer / 1000}</p></div>`)
            .append("<ul id='QTELB'><li id='LBHeader'>Leader Board</li></ul>");

        function compareFn(a, b) {
            return Number(b[1]) - Number(a[1]);
        }

        function clearScreen() {

            QTESong.pause();
            $(window).off("keypress");
            $(window).off("mouseenter");
            $(window).off("mousemove");
            $(window).off("mousedown");
            $(document.body).children(":not('script')").remove();
            GiveItAll.playSound(sfxAudioFiles[7].src,"sfx");
            sfxAudioFiles = undefined;

        }

        function clearTimeouts() {
            clearTimeout(remover);
            for(let timeout of hvremover)
                clearTimeout(timeout);
            clearTimeout(spawnTimeout);
            clearTimeout(durationTimeout);
            for(let timeout of countdownsTimeout)
                clearTimeout(timeout);
            clearTimeout(timerInterval);
        }

        $(refresh).click(function(){
            clearTimeouts();
            clearScreen();
            setTimeout(GiveItAll.QTEScriptLoader, 1000, player, targetScore, timer, difficulty);
        });

        $(back).click(function(){
            clearTimeouts();
            clearScreen();
            setTimeout(GiveItAll.ArenaScriptLoader, 1000, player);
        });

        let regex = new RegExp(`^(\\w+)\\|(${timer})\\|(${difficulty})$`);
        let matches = [], match;

        for (let key in localStorage) {
            if ((match = regex.exec(key)) !== null && Number(match[2]) === timer && Number(match[3]) === difficulty) {
                matches.push([match, localStorage.getItem(match[0])]);
            }
        }

        matches.sort(compareFn);

        let length = matches.length > 5 ? 5 : matches.length;

        for (let i = 0; i < length; i++) {
            $(`<li>${i + 1} : ${matches[i][0][1]}<br/>${matches[i][1]}</li>`)
                .appendTo($(QTELB));
        }

        if (targetScore === 0) {
            $(document.getElementById("targetScore")).css("display", "none");
            $(scoreBar).css("height", "100%");
        }

        function generateColor(base, step) {
            let steps = {
                r: (255 - base.r) / 4,
                g: (255 - base.g) / 4,
                b: (255 - base.b) / 4,
            };
            return {
                left: `rgb(${base.r + steps.r * step}, ${base.g}, ${base.b + steps.b * step})`,
                middle: `rgb(${base.r * 2 + 10 * step}, ${base.g * 2 + 10 * step}, 255)`,
                right: `rgb(${base.r}, ${base.g + steps.g * step}, ${base.b + steps.b * step})`

            }
        }

        function drawTable(modifier, preventQTE) {

            let ratio = combo;

            if(!preventQTE)
                recursiveGeneration(performance.now() - startTime, timer);

            if (ratio === 1)
                GiveItAll.playSound(sfxAudioFiles[0].src,"sfx", 0.35);
            else if (Math.floor(ratio / modifier) < Math.floor(ratio))
                GiveItAll.playSound(sfxAudioFiles[2].src,"sfx", 0.35);
            else
                GiveItAll.playSound(sfxAudioFiles[1].src,"sfx", 0.35);

            let baseStep = Math.floor(ratio - 1);
            let barStep = Math.floor(ratio);
            let baseColor = generateColor(baseComboHue, baseStep);
            let barColor = generateColor(baseComboHue, barStep);


            if ($(multBonus).text() !== "Bonus : X5.00" && Math.floor(ratio / modifier) < Math.floor(ratio)) {
                $(multBar).css({
                    background: `linear-gradient(155deg, ${baseColor.left} ${20 - 5 * baseStep}%,
                ${baseColor.middle} 50%, ${baseColor.right} ${80 + 5 * baseStep}%)`,
                    transition: "all 0.2s linear",
                    width: `100%`
                });

                setTimeout(function () {
                    $(multBase).css("background", `linear-gradient(155deg, ${baseColor.left} ${20 - 5 * baseStep}%,
                    ${baseColor.middle} 50%, ${baseColor.right} ${80 + 5 * baseStep}%)`);
                    $(multBar).css({
                        transition: "all 0s",
                        display: "none",
                        width: `0%`
                    });
                }, 202);

                setTimeout(function () {
                    $(multBase).css("background", `linear-gradient(155deg, ${baseColor.left} ${20 - 5 * baseStep}%,
                        ${baseColor.middle} 50%, ${baseColor.right} ${80 + 5 * baseStep}%)`);

                    $(multBar).css({
                        background: `linear-gradient(155deg, ${barColor.left} ${20 - 5 * barStep}%,
                            ${barColor.middle} 50%, ${barColor.right} ${80 + 5 * barStep}%)`,
                        transition: "all 0.2s",
                        display: "block",
                        width: `${(ratio - Math.floor(ratio)) * 100}%`
                    });
                    let brightness = "1." + Math.floor(125 * ratio);
                    $(multTable).css("filter", `brightness(${brightness})`);

                    $(multBonus).text("Bonus : X" + ratio.toFixed(2));
                }, 210);
            }
            else {
                $(multBase).css("background", `linear-gradient(155deg, ${baseColor.left} ${20 - 5 * baseStep}%,
                    ${baseColor.middle} 50%, ${baseColor.right} ${80 + 5 * baseStep}%)`);

                $(multBar).css({
                    background: `linear-gradient(155deg, ${barColor.left} ${20 - 5 * barStep}%,
                        ${barColor.middle} 50%, ${barColor.right} ${80 + 5 * barStep}%)`,
                    transition: "all 0.2s",
                    display: "block",
                    width: `${(ratio - Math.floor(ratio)) * 100}%`
                });
                let brightness = "1." + Math.floor(125 * ratio);
                $(multTable).css("filter", `brightness(${brightness})`);

                $(multBonus).text("Bonus : X" + ratio.toFixed(2));
            }

            $(ownScore).text("Scor : " + score);

            let scoreRatio = 0;
            if (targetScore) {
                scoreRatio = score / targetScore;
            }
            if (scoreRatio < 1 && targetScore)
                $(scoreBar).css({
                    height: `${scoreRatio * 100}%`
                });
            else {
                $(document.getElementById("targetScore")).css("display", "none");
                $(scoreBar).css({
                    height: "100%"
                })
            }

        }

        function QTEK(charset) {

            let input = charset.split("")[Math.floor(Math.random() * 9)];

            let color = `rgb(${Math.random() * 255},${Math.random() * 255},${100 + Math.random() * 155})`;
            $($stop1).attr("style", `stop-color:${color};stop-opacity:1`);
            $($stop2).attr("style", `stop-color:rgb(235,235,235);stop-opacity:1`);
            $($stop3).attr("style", `stop-color:${color};stop-opacity:1`);

            let $qte = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "circle")).children(":last")
                .attr({
                    cx: Math.floor(Math.random() * 170) - 35,
                    cy: Math.floor(Math.random() * 90) + 5,
                    r: 4,
                    fill: "url(#grad)",
                    stroke: "black",
                    "stroke-width": 0.5
                });

            let $qteT = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "text")).children(":last")
                .attr({
                    x: $qte.attr("cx"),
                    y: $qte.attr("cy"),
                    "font-family": "Lato",
                    "font-size": 6,
                    fill: "white",
                    stroke: "black",
                    "stroke-width": 0.15,
                    "text-anchor": "middle",
                    "alignment-baseline": "middle"
                })
                .text(input);

            remover = setTimeout(function () {
                $qte.remove();
                $qteT.remove();
                combo = 1;

                drawTable();

                $(window).off("keypress", context.uniqueKeypressHandler);
            }, timeoutO / Math.sqrt(combo));

            let context = {};
            context.uniqueKeypressHandler = function (event) {
                if (event.key.toLowerCase() !== input.toLowerCase()) {
                    return;
                }
                $qte.remove();
                $qteT.remove();

                score += Math.ceil(1000 * scoreModifO * combo);

                combo = Math.min(5, combo * 1.15);

                drawTable(1.15);

                $(window).off("keypress", context.uniqueKeypressHandler);
                clearTimeout(remover);
            };

            $(window).keypress(context.uniqueKeypressHandler);
        }

        function QTEHv(stackSize) {

            let color = `rgb(${Math.random() * 255},${Math.random() * 255},${100 + Math.random() * 155})`;
            $($stop1).attr("style", `stop-color:${color};stop-opacity:1`);
            $($stop2).attr("style", `stop-color:rgb(235,235,235);stop-opacity:1`);
            $($stop3).attr("style", `stop-color:${color};stop-opacity:1`);

            function plantHoverable(order, firstX, firstY, jointLength) {

                let secondX = Math.floor(Math.random() * 2 * jointLength) - jointLength;

                let secondY = Math.floor(Math.sqrt(Math.pow(jointLength, 2) - Math.pow(secondX, 2)))
                    * [-1, 1][Math.round(Math.random())];

                secondX += firstX;
                if (secondX > 135 || secondX < -35)
                    secondX = (secondX - firstX) * (-1) + firstX;

                secondY += firstY;
                if (secondY > 95 || secondY < 5)
                    secondY = (secondY - firstY) * (-1) + firstY;

                let quickTimeout = timeoutO / combo / 1.5;
                if (order === 1)
                    quickTimeout = timeoutO / combo;
                hvremover[order - 1] = setTimeout(function () {

                    $qte.remove();
                    $qteT.remove();
                    combo = 1;

                    drawTable();

                    if (order < stackSize) {
                        $qte2.remove();
                        $qteT2.remove();
                        $joint.remove();
                    }
                }, quickTimeout);

                let context = {};
                context.uniqueHoverHandler = function () {

                    score += Math.ceil(400 * scoreModifO * combo);

                    combo = Math.min(5, combo * 1.03);

                    drawTable(1.03, order !== stackSize);

                    $qte.remove();
                    $qteT.remove();
                    if (order < stackSize) {
                        $qte2.remove();
                        $qteT2.remove();
                        $joint.remove();
                        plantHoverable(order + 1, parseInt($qte2.attr("cx")), parseInt($qte2.attr("cy")), jointLength);
                    }
                    clearTimeout(hvremover[order - 1]);
                };

                let $joint, $qte2, $qteT2;

                if (order < stackSize) {
                    $joint = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "line")).children(":last")
                        .attr({
                            x1: firstX,
                            y1: firstY,
                            x2: secondX,
                            y2: secondY,
                            stroke: "white",
                            "stroke-width": 0.3
                        })
                        .css({
                            opacity: 0.8
                        });

                    $qte2 = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "circle")).children(":last")
                        .attr({
                            cx: secondX,
                            cy: secondY,
                            r: 4,
                            fill: "url(#grad)",
                            stroke: "black",
                            "stroke-width": 0.5
                        });

                    $qteT2 = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "text")).children(":last")
                        .attr({
                            x: secondX,
                            y: secondY,
                            "font-size": 6,
                            "font-family": "Sarabun",
                            "font-weight": "bold",
                            fill: "white",
                            stroke: "black",
                            "stroke-width": 0.1,
                            "text-anchor": "middle",
                            "alignment-baseline": "middle"
                        })
                        .text(order + 1);
                }

                let $qte = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "circle")).children(":last")
                    .attr({
                        cx: firstX,
                        cy: firstY,
                        r: 4,
                        fill: "url(#grad)",
                        stroke: "black",
                        "stroke-width": 0.5
                    });

                let $qteT = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "text")).children(":last")
                    .attr({
                        x: firstX,
                        y: firstY,
                        "font-size": 6,
                        "font-family": "Sarabun",
                        "font-weight": "bold",
                        fill: "white",
                        stroke: "black",
                        "stroke-width": 0.1,
                        "text-anchor": "middle",
                        "alignment-baseline": "middle"
                    })
                    .text(order);

                $mainFrame.children(":gt(-3)").mouseenter(context.uniqueHoverHandler);

            }

            plantHoverable(1, Math.floor(Math.random() * 170) - 35, Math.floor(Math.random() * 90) + 5,
                Math.floor(Math.random() * 15) + 10);

        }

        function QTEH() {

            remover = setTimeout(function () {
                $qte.remove();
                $track.remove();
                combo = 1;

                drawTable();

                $mainFrame.off("mousemove", context.uniqueSliderHandler);
            }, timeoutO / combo);

            let context = {};
            context.uniqueSliderHandler = function (e) {

                let svg = document.getElementsByTagName("svg")[0];
                let point = svg.createSVGPoint();
                point.x = e.clientX;
                point.y = e.clientY;

                let svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());

                if ((rotVal <= 45 || rotVal >= 315) && svgPoint.x >= originalX) {
                    $qte.attr({
                        cx: svgPoint.x,
                        cy: originalY + (svgPoint.x - originalX) * Math.tan(rotVal * Math.PI / 180)
                    });
                    if (svgPoint.x >= originalX + (35 * Math.cos(rotVal * (Math.PI / 180)))) {
                        let finalX = originalX + (35 * Math.cos(rotVal * (Math.PI / 180)));
                        $qte.attr({
                            cx: finalX,
                            cy: originalY + (finalX - originalX) * Math.tan(rotVal * Math.PI / 180)
                        });

                        score += Math.ceil(1500 * scoreModifO * combo);

                        combo = Math.min(5, combo * 1.15);

                        drawTable(1.15);

                        $mainFrame.off("mousemove", context.uniqueSliderHandler);
                        $qte.off("mousedown");
                        clearTimeout(remover);
                        setTimeout(function () {
                            $qte.remove();
                            $track.remove();
                        }, 150);
                    }
                }

                else if (rotVal >= 135 && rotVal <= 225 && svgPoint.x <= originalX) {
                    $qte.attr({
                        cx: svgPoint.x,
                        cy: originalY - (originalX - svgPoint.x) * Math.tan(rotVal * Math.PI / 180)
                    });
                    if (svgPoint.x <= originalX + (35 * Math.cos(rotVal * (Math.PI / 180)))) {
                        let finalX = originalX + (35 * Math.cos(rotVal * (Math.PI / 180)));
                        $qte.attr({
                            cx: finalX,
                            cy: originalY - (originalX - finalX) * Math.tan(rotVal * Math.PI / 180)
                        });

                        score += Math.ceil(1500 * scoreModifO * combo);

                        combo = Math.min(5, combo * 1.15);

                        drawTable(1.15);

                        $mainFrame.off("mousemove", context.uniqueSliderHandler);
                        $qte.off("mousedown");
                        clearTimeout(remover);
                        setTimeout(function () {
                            $qte.remove();
                            $track.remove();
                        }, 150);
                    }
                }

                else if (rotVal >= 45 && rotVal <= 135 && svgPoint.y >= originalY) {
                    $qte.attr({
                        cx: originalX + (svgPoint.y - originalY) / Math.tan(rotVal * Math.PI / 180),
                        cy: svgPoint.y
                    });

                    if (svgPoint.y >= originalY + (35 * Math.sin(rotVal * Math.PI / 180))) {
                        let finalY = originalY + (35 * Math.sin(rotVal * Math.PI / 180));
                        $qte.attr({
                            cx: originalX + (finalY - originalY) / Math.tan(rotVal * Math.PI / 180),
                            cy: finalY
                        });

                        score += Math.ceil(1500 * scoreModifO * combo);

                        combo = Math.min(5, combo * 1.15);

                        drawTable(1.15);

                        $mainFrame.off("mousemove", context.uniqueSliderHandler);
                        $qte.off("mousedown");
                        clearTimeout(remover);
                        setTimeout(function () {
                            $qte.remove();
                            $track.remove();
                        }, 150);
                    }
                }

                else if (rotVal >= 225 && rotVal <= 315 && svgPoint.y <= originalY) {
                    $qte.attr({
                        cx: originalX - (originalY - svgPoint.y) / Math.tan(rotVal * Math.PI / 180),
                        cy: svgPoint.y
                    });

                    if (svgPoint.y <= originalY + (35 * Math.sin(rotVal * Math.PI / 180))) {
                        let finalY = originalY + (35 * Math.sin(rotVal * Math.PI / 180));
                        $qte.attr({
                            cx: originalX - (originalY - finalY) / Math.tan(rotVal * Math.PI / 180),
                            cy: finalY
                        });

                        score += Math.ceil(1500 * scoreModifO * combo);

                        combo = Math.min(5, combo * 1.15);

                        drawTable(1.15);

                        $mainFrame.off("mousemove", context.uniqueSliderHandler);
                        $qte.off("mousedown");
                        clearTimeout(remover);
                        setTimeout(function () {
                            $qte.remove();
                            $track.remove();
                        }, 150);
                    }
                }

            };

            let color = `rgb(${Math.random() * 255},${Math.random() * 255},${100 + Math.random() * 155})`;
            $($stop1).attr("style", `stop-color:${color};stop-opacity:1`);
            $($stop2).attr("style", `stop-color:rgb(235,235,235);stop-opacity:1`);
            $($stop3).attr("style", `stop-color:${color};stop-opacity:1`);

            let $qte = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "circle")).children(":last")
                .attr({
                    cx: Math.floor(Math.random() * 170) - 35,
                    cy: Math.floor(Math.random() * 90) + 5,
                    r: 4,
                    fill: "url(#grad)",
                    stroke: "black",
                    "stroke-width": 0.5
                }).remove();

            let $track = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "path"))
                .children(":last")
                .attr({
                    d: `M${$qte.attr("cx")} ${$qte.attr("cy") - 5} 
                h 35 
                a 1 1 0 0 1 0 10
                h -35
                a 1 1 0 0 1 0 -10
                M${$qte.attr("cx")} ${$qte.attr("cy")}
                h 35Z`,
                    fill: $qte.attr("fill"),
                    "fill-opacity": "0.3",
                    stroke: "black",
                    "stroke-width": 0.5,

                });

            let rotVal = Math.floor(Math.random() * 360);

            if (rotVal > 90 && rotVal < 270 && $qte.attr("cx") - 45 <= -35) {
                rotVal = (540 - rotVal) % 360;
            }
            else if ((rotVal > 270 || rotVal < 90) && parseInt($qte.attr("cx")) + 45 >= 135) {
                rotVal = (rotVal + 2 * (360 + 90 - rotVal) % 360) % 360;
            }

            if (rotVal > 0 && rotVal < 180 && parseInt($qte.attr("cy")) + 45 >= 100) {
                rotVal = rotVal + 2 * (180 - rotVal);
            }
            else if (rotVal > 180 && $qte.attr("cy") - 45 <= 0) {
                rotVal = rotVal - 2 * (rotVal - 180);
            }

            $track.attr({
                transform: `rotate(${rotVal}, ${$qte.attr("cx")}, ${$qte.attr("cy")})`
            });

            $qte.appendTo($mainFrame);

            let modifCheck = 0;
            let originalX;
            let originalY;

            $qte.mousedown(function () {

                if (modifCheck === 0) {
                    modifCheck = 1;
                    originalX = parseFloat($qte.css("cx"));
                    originalY = parseFloat($qte.css("cy"));
                }

                $mainFrame.mousemove(context.uniqueSliderHandler);

                $mainFrame.mouseup(function () {
                    $mainFrame.off("mousemove", context.uniqueSliderHandler);
                    $mainFrame.off("mouseup");
                })
            });
        }

        function quicktimeEvent(argument, {
            charset = "QWEASDZXC",
            stackSize = 5
        } = {}) {

            if (argument.match(/k(ey)?/i)) {
                QTEK(charset);
            }
            else if (argument.match(/(hover)|(hv)/i)) {
                QTEHv(stackSize);
            }
            else if (argument.match(/h(old)?/i)) {
                QTEH();
            }
        }

        function showStartSequence() {

            countdownsTimeout[0] = setTimeout(function () {

                GiveItAll.playSound(sfxAudioFiles[3].src,"sfx", 0.35);

                let $seq = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "text"))
                    .children(":last")
                    .attr({
                        x: 42,
                        y: 25,
                        fill: "#0b1e3d",
                        stroke: "white",
                        "stroke-width": 0.4,
                        "font-size": 20,
                        "font-family": "Orbitron"
                    }).text("3");

                countdownsTimeout[1] = setTimeout(function () {

                    $seq.text("2");

                    GiveItAll.playSound(sfxAudioFiles[3].src,"sfx", 0.35);

                }, 1000);

                countdownsTimeout[2] = setTimeout(function () {

                    $seq.attr({
                        x: 45
                    })
                        .text("1");

                    GiveItAll.playSound(sfxAudioFiles[3].src,"sfx", 0.35);

                }, 2000);

                countdownsTimeout[3] = setTimeout(function () {

                    $seq.attr({
                        x: 33
                    })
                        .text("GO!");

                    GiveItAll.playSound(sfxAudioFiles[5].src,"sfx", 0.35);

                }, 3000);

                countdownsTimeout[4] = setTimeout(function () {

                    $seq.remove();

                }, 4000);

            }, 1000);

        }

        function recursiveGeneration(startTime, duration) {
            if (startTime >= duration)
                return;
            let choices = ["h", "hv", "k"];
            let choice = choices[Math.floor(Math.random() * choices.length)];

            spawnTimeout = setTimeout(function () {
                quicktimeEvent(choice);

            }, rhythmO / Math.sqrt(combo));


        }

        function generateQTE(duration, difficulty) {

            if (difficulty === 1) {
                timeoutO = 4000;
                scoreModifO = 0.4;
                rhythmO = 2000;
            }
            if (difficulty === 2) {
                timeoutO = 3200;
                scoreModifO = 0.6;
                rhythmO = 1600;
            }
            if (difficulty === 3) {
                timeoutO = 2800;
                scoreModifO = 1;
                rhythmO = 1400;
            }
            if (difficulty === 4) {
                timeoutO = 2200;
                scoreModifO = 2;
                rhythmO = 1100;
            }
            if (difficulty === 5) {
                timeoutO = 1200;
                scoreModifO = 3;
                rhythmO = 600;
            }

            startTime = performance.now();

            combo = 1;

            recursiveGeneration(performance.now() - startTime, duration);

        }

        function prepareGame(difficulty) {

            $mainFrame.css({
                "background-image": `url("Resources/TranspBack${difficulty}.jpg")`,
                "background-position": "center",
            });

            /*let rhythm;
            if (difficulty === 1)
                rhythm = 500;
            else if (difficulty === 2)
                rhythm = 400;
            else if (difficulty === 3)
                rhythm = 250;
            else if (difficulty === 4)
                rhythm = 200;
            else
                rhythm = 130;

            if (difficulty < 3)
                GiveItAll.DancerScriptLoader($mainFrame, "black", rhythm, timer, 5000);
            else if (difficulty < 5)
                GiveItAll.DancerScriptLoader($mainFrame, "white", rhythm, timer, 5000);*/

            showStartSequence();

            countdownsTimeout[5] = setTimeout(function () {
                generateQTE(timer, difficulty);

                let countDown;

                let gameStart = performance.now();

                timerInterval = setInterval(function () {

                    countDown = timer - performance.now() + gameStart;
                    $(time).text("Timp ramas : " + Math.abs((countDown / 1000)).toFixed(2));

                }, 5);

                let finalCountdown;

                countdownsTimeout[6] = setTimeout(function () {

                    finalCountdown = setInterval(function () {

                        GiveItAll.playSound(sfxAudioFiles[3].src,"sfx", 0.35);

                    }, 1000);

                }, timer - 4000);

                countdownsTimeout[7] = setTimeout(function () {

                    clearInterval(finalCountdown);

                }, timer);


                countdownsTimeout[8] = setTimeout(function () {

                    GiveItAll.playSound(sfxAudioFiles[4].src,"sfx", 0.35);

                    clearInterval(timerInterval);
                }, timer);

            }, 5000);

        }

        prepareGame(difficulty);
        durationTimeout = setTimeout(function () {

            clearTimeouts();
            clearScreen();
            setTimeout(GiveItAll.GameEndScriptLoader, 1000, player, score, targetScore, timer, difficulty, QTESong);
        }, timer + 7000);
    }
}