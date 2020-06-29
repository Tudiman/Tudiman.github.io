GiveItAll.QTEScriptLoader = function(player, targetScore, timer, difficulty) {

    let sfxAudioFiles = [];
    sfxAudioFiles.push(new Audio("Resources/Audio/MultBarDown.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/MultBarUp.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/MultBarLevelUp.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/CountDown.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/CountDownGo.mp3"));
    sfxAudioFiles.push(new Audio("Resources/Audio/CountDownGo2.mp3"));
    sfxAudioFiles.push(new Audio(`Resources/Audio/Song${difficulty}.mp3`));

    GiveItAll.MediaLoader(sfxAudioFiles, QTEScript, player, targetScore, timer, difficulty);

    function QTEScript(player, targetScore, timer, difficulty) {

        let QTESong = GiveItAll.playSound(sfxAudioFiles[6].src,"bgm");

        let $mainFrame = $("<svg width='80vw' height='90%' viewBox='-40 0 180 100'></svg>").appendTo($("body"))
            .attr("id", "svg");

        let score = 0;
        let __timeout, __scoreModif, __rhythm;
        let timeoutO, scoreModifO, rhythmO;
        let startTime;

        let multBarProg = ["lightseagreen", "yellow", "orange", "red", "purple", "blue", "darkblue", "black"];

        $(document.body)
            .append(`<div id='scoreTable'><div id='scoreBar'></div>
    <p class="score" id="ownScore">Scor : 0</p><p class="score" id="targetScore">Obiectiv : ${targetScore}</p></div>`)
            .append(`<div id='multTable'><div id='multBase'></div><div id='multBar'></div>
    <p id='multBonus'>Bonus : X1.00</p></div>`)
            .append(`<div id="timeTable"><p id="time">Timp ramas : ${timer / 1000}</p></div>`)
            .append("<ul id='QTELB'><li id='LBHeader'>Leader Board</li></ul>");

        function compareFn(a, b) {

            return Number(b[1]) - Number(a[1]);

        }

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

        function drawTable(preventQTE) {

            let ratio = __scoreModif / scoreModifO;

            if(!preventQTE)
                recursiveGeneration(performance.now() - startTime, timer);

            if (ratio === 1)
                GiveItAll.playSound(sfxAudioFiles[0].src,"sfx", 0.5);
            else if (Math.floor(ratio / 1.05) < Math.floor(ratio) && Math.floor(ratio / 1.05) > 1)
                GiveItAll.playSound(sfxAudioFiles[2].src,"sfx", 0.5);
            else
                GiveItAll.playSound(sfxAudioFiles[1].src,"sfx", 0.5);

            $(multBase).css("background", multBarProg[Math.floor(ratio - 1)]);

            $(multBar).css({
                background: multBarProg[Math.floor(ratio)],
                width: `${(ratio - Math.floor(ratio)) * 100}%`
            });

            $(multBonus).text("Bonus : X" + ratio.toFixed(2));

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

        function QTEK(charset, timeout) {

            let input = charset.split("")[Math.floor(Math.random() * 9)];

            let $qte = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "circle")).children(":last")
                .attr({
                    cx: Math.floor(Math.random() * 170) - 35,
                    cy: Math.floor(Math.random() * 90) + 5,
                    r: 4,
                    fill: `rgb(${Math.random() * 255},${Math.random() * 255},${100 + Math.random() * 155})`,
                    stroke: "black",
                    "stroke-width": 0.5
                });
            // let start = performance.now();
            // requestAnimationFrame(function animate(time){
            //     let timeFragment = (time - start) / 500;
            //     $qte.css({
            //         transform:`scale(${1 + timeFragment},${1 + timeFragment})`
            //     });
            //     if(timeFragment < 1)
            //         requestAnimationFrame(animate);
            // });
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

            let remover = setTimeout(function () {
                $qte.remove();
                $qteT.remove();
                __timeout = timeoutO;
                __scoreModif = scoreModifO;
                __rhythm = rhythmO;

                drawTable();

                $(window).off("keypress", context.uniqueKeypressHandler);
            }, timeout);

            let context = {};
            context.uniqueKeypressHandler = function (event) {
                if (event.key.toLowerCase() !== input.toLowerCase()) {
                    return;
                }
                $qte.remove();
                $qteT.remove();

                score += Math.ceil(1000 * __scoreModif);

                __rhythm *= 0.95;
                __timeout *= 0.95;
                __scoreModif *= 1.05;

                drawTable();

                $(window).off("keypress", context.uniqueKeypressHandler);
                clearTimeout(remover);
            };

            $(window).keypress(context.uniqueKeypressHandler);
        }

        function QTEHv(stackSize, timeout) {

            function plantHoverable(order, firstX, firstY, firstColor, jointLength) {

                let secondX = Math.floor(Math.random() * 2 * jointLength) - jointLength;

                let secondY = Math.floor(Math.sqrt(Math.pow(jointLength, 2) - Math.pow(secondX, 2)))
                    * [-1, 1][Math.round(Math.random())];

                secondX += firstX;
                if (secondX > 135 || secondX < -35)
                    secondX = (secondX - firstX) * (-1) + firstX;

                secondY += firstY;
                if (secondY > 95 || secondY < 5)
                    secondY = (secondY - firstY) * (-1) + firstY;

                let quickTimeout = timeout / 2;
                if (order === 1)
                    quickTimeout = timeout;
                let remover = setTimeout(function () {

                    $qte.remove();
                    $qteT.remove();
                    __timeout = timeoutO;
                    __scoreModif = scoreModifO;
                    __rhythm = rhythmO;

                    drawTable();

                    if (order < stackSize) {
                        $qte2.remove();
                        $qteT2.remove();
                        $joint.remove();
                    }
                }, quickTimeout);

                let context = {};
                context.uniqueHoverHandler = function () {

                    score += Math.ceil(400 * __scoreModif);

                    __rhythm *= 0.98;
                    __timeout *= 0.98;
                    __scoreModif *= 1.02;

                    drawTable(order !== stackSize);

                    $qte.remove();
                    $qteT.remove();
                    if (order < stackSize) {
                        $qte2.remove();
                        $qteT2.remove();
                        $joint.remove();
                        plantHoverable(order + 1, parseInt($qte2.attr("cx")), parseInt($qte2.attr("cy")),
                            $qte2.attr("fill"), jointLength);
                    }
                    clearTimeout(remover);
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
                            fill: `rgb(${Math.random() * 255},${Math.random() * 255},${100 + Math.random() * 155})`,
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
                        fill: firstColor,
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
                `rgb(${Math.random() * 255},${Math.random() * 255},${100 + Math.random() * 155})`
                , Math.floor(Math.random() * 15) + 10);

        }

        function QTEH(timeout) {

            let remover = setTimeout(function () {
                $qte.remove();
                $track.remove();
                __timeout = timeoutO;
                __scoreModif = scoreModifO;
                __rhythm = rhythmO;

                drawTable();

                $mainFrame.off("mousemove", context.uniqueSliderHandler);
            }, timeout);

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

                        score += Math.ceil(1500 * __scoreModif);

                        __rhythm *= 0.95;
                        __timeout *= 0.95;
                        __scoreModif *= 1.05;

                        drawTable();

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

                        score += Math.ceil(1500 * __scoreModif);

                        __rhythm *= 0.95;
                        __timeout *= 0.95;
                        __scoreModif *= 1.05;

                        drawTable();

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

                        score += Math.ceil(1500 * __scoreModif);

                        __rhythm *= 0.95;
                        __timeout *= 0.95;
                        __scoreModif *= 1.05;

                        drawTable();

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

                        score += Math.ceil(1500 * __scoreModif);

                        __rhythm *= 0.95;
                        __timeout *= 0.95;
                        __scoreModif *= 1.05;

                        drawTable();

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

            let $qte = $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "circle")).children(":last")
                .attr({
                    cx: Math.floor(Math.random() * 170) - 35,
                    cy: Math.floor(Math.random() * 90) + 5,
                    r: 4,
                    fill: `rgb(${Math.random() * 255},${Math.random() * 255},${100 + Math.random() * 155})`,
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
            timeout = 1500,
            scoreModif = 1,
            charset = "QWEASDZXC",
            stackSize = 5
        }) {

            if (argument.match(/k(ey)?/i)) {
                QTEK(charset, timeout, scoreModif);
            }
            else if (argument.match(/(hover)|(hv)/i)) {
                QTEHv(stackSize, timeout, scoreModif);
            }
            else if (argument.match(/h(old)?/i)) {
                QTEH(timeout, scoreModif);
            }
        }

        function showStartSequence() {

            setTimeout(function () {

                GiveItAll.playSound(sfxAudioFiles[3].src,"sfx", 0.5);

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

                setTimeout(function () {

                    $seq.text("2");

                    GiveItAll.playSound(sfxAudioFiles[3].src,"sfx", 0.5);

                }, 1000);

                setTimeout(function () {

                    $seq.attr({
                        x: 45
                    })
                        .text("1");

                    GiveItAll.playSound(sfxAudioFiles[3].src,"sfx", 0.5);

                }, 2000);

                setTimeout(function () {

                    $seq.attr({
                        x: 33
                    })
                        .text("GO!");

                    GiveItAll.playSound(sfxAudioFiles[5].src,"sfx", 0.5);

                }, 3000);

                setTimeout(function () {

                    $seq.remove();

                }, 4000);

            }, 1000);

        }

        function recursiveGeneration(startTime, duration) {
            if (startTime >= duration)
                return;
            let choices = ["h", "hv", "k"];
            let choice = choices[Math.floor(Math.random() * 3)];

            setTimeout(function () {
                quicktimeEvent(choice, {__timeout, __scoreModif});

            }, __rhythm);


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

            __timeout = timeoutO;
            __scoreModif = scoreModifO;
            __rhythm = rhythmO;

            recursiveGeneration(performance.now() - startTime + __rhythm, duration);

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

            setTimeout(function () {
                generateQTE(timer, difficulty);

                let countDown;

                let gameStart = performance.now();

                let timerInterval = setInterval(function () {

                    countDown = timer - performance.now() + gameStart;
                    $(time).text("Timp ramas : " + Math.abs((countDown / 1000)).toFixed(2));

                }, 5);

                let finalCountdown;

                setTimeout(function () {

                    finalCountdown = setInterval(function () {

                        GiveItAll.playSound(sfxAudioFiles[3].src,"sfx", 0.5);

                    }, 1000);

                }, timer - 4000);

                setTimeout(function () {

                    clearInterval(finalCountdown);

                }, timer);


                setTimeout(function () {

                    GiveItAll.playSound(sfxAudioFiles[4].src,"sfx", 0.5);

                    clearInterval(timerInterval);
                }, timer);

            }, 5000);

        }

        prepareGame(difficulty);
        setTimeout(function () {

            QTESong.pause();

            $(document.body).children(":not('script')").remove();
            GiveItAll.GameEndScriptLoader(player, score, targetScore, timer, difficulty, QTESong);

            sfxAudioFiles = undefined;

        }, timer + 7000);
    }
}