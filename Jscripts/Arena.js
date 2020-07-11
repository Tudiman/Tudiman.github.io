GiveItAll.ArenaScriptLoader = function(player) {

    let sfxAudioFiles = [];
    sfxAudioFiles.push(new Audio("Resources/Audio/ArenaArrow.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/ArenaEnter.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/ArenaMenu.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/MenuConfirm.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/Wrong.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/MenuClick.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/ArenaSong.mp3"));

    GiveItAll.MediaLoader(sfxAudioFiles, ArenaScript, player);

    function ArenaScript(player) {

        let ArenaSong = GiveItAll.playSound(sfxAudioFiles[6].src,"bgm");
        let OBTargetActive = false;
        let targetScore = 0, duration = 0;
        let currentLevel = 1;

        let $arenaScreen = $("<div id='arenaScreen'>" +
            "<h2 id='arenaTitle'>Alege nivelul!</h2>" +
            "<div id='levelScreen'></div>" +
            "<div class='TitleReturnButton' id='TitleReturnButton'>" +
            "<i class='material-icons returnIcon'>keyboard_arrow_left</i>" +
            "Inapoi la Title Screen</div>" +
            "</div>" +
            "<div id='readyButton'>Alege</div>")
            .appendTo(document.body);

        $(levelScreen)
            .append("<div class='indLevelScreen' id='level1screen'><h3 class='levelName'>Sala de dans</h3>" +
                "<div class='levelBg' id='level1bg'></div>" +
                "<p class='levelDesc'>Cel mai usor nivel. De abia te-ai apucat de dans si ai foarte multe de invatat, asa ca treci la treaba.<br/>" +
                "Recomandat pentru cei cu doua maini stangi. Nu c-ar fi ceva in neregula cu asta...</p>" +
                "</div>")

            .append("<div class='indLevelScreen' id='level2screen'><h3 class='levelName'>Spatele blocului</h3>" +
                "<div class='levelBg' id='level2bg'></div>" +
                "<p class='levelDesc'>Este timpul sa le arati prietenilor tai ce ai invatat la sala. Nu te face de ras!<br/>" +
                "Recomandat celor ce vor sa se distreze si copiilor mici.</p>" +
                "</div>")

            .append("<div class='indLevelScreen' id='level3screen'><h3 class='levelName'>Tunelul de la metrou</h3>" +
                "<div class='levelBg' id='level3bg'></div>" +
                "<p class='levelDesc'>Prietenii tai te considera un dansator bun? Ramane de vazut ce au de zis oamenii in trecere despre asta...<br/>" +
                "Recomandat oamenilor care au mai jucat acest joc si nu s-au facut de ras.</p>" +
                "</div>")

            .append("<div class='indLevelScreen' id='level4screen'><h3 class='levelName'>Discoteca</h3>" +
                "<div class='levelBg' id='level4bg'></div>" +
                "<p class='levelDesc'>E momentul. Ai demonstrat ca te pricepi la dans, iar in acest moment toti vor sa te vada dansand in centru. Sari pe ei!<br/>" +
                "Recomandat celor dedicati. Cafeaua de dimineata ajuta.</p>" +
                "</div>")

            .append("<div class='indLevelScreen' id='level5screen'><h3 class='levelName'>Scena</h3>" +
                "<div class='levelBg' id='level5bg'></div>" +
                "<p class='levelDesc'>Toata lumea te priveste. Ai muncit din greu si este momentul sa le demonstrezi tuturor ca esti campion. Bafta.<br/>" +
                "Nu recomand acest nivel. Incearca-l o data si du-te inapoi la nivelul 4 sa te simti din nou bun.</p>" +
                "</div>");

        $("<div id='optionsMenu'>" +
            "<div class='OptionsButton' id='OBTarget'>Alege un target</div>" +
            "<div id='TargetCont'>" +
            "<input type='text' id='TargetInput'>" +
            "</div>" +
            "<div class='OptionsButton' id='OBDuration'>Alege durata</div>" +
            "<ul id='radioCont'>" +
            "<li><input type='radio' name='durationRadio' value='30000'><label for='30000'>30s</label></li>" +
            "<li><input type='radio' name='durationRadio' value='60000'><label for='60000'>60s</label></li>" +
            "<li><input type='radio' name='durationRadio' value='120000'><label for='120000'>120s</label></li>" +
            "</ul>" +
            "<div class='OptionsButton' id='OBConfirm'>Start</div>" +
            "<div class='OptionsButton' id='OBCancel'>Anuleaza</div>" +
            "</div>")
            .appendTo($(arenaScreen));

        let $svg = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
            .attr({
                id: "arenaSvg",
                viewBox: "0 0 100 100"
            })
            .appendTo($arenaScreen);

        let $defs = $(document.createElementNS("http://www.w3.org/2000/svg", "defs"))
            .appendTo($svg);

        let $leftGrad = $(document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"))
            .attr({
                id: "leftGrad",
                x1: "55%",
                y1: "-15%",
                x2: "100%",
                y2: "100%"
            })
            .appendTo($defs);
        let $lstop1 = $(document.createElementNS("http://www.w3.org/2000/svg", "stop"))
            .attr({
                    offset: "25%",
                style: "stop-color:rgb(255,0,0);stop-opacity:1"
            })
            .appendTo($leftGrad);
        let $lstop2 = $(document.createElementNS("http://www.w3.org/2000/svg", "stop"))
            .attr({
                offset: "50%",
                style: "stop-color:rgb(235,235,235);stop-opacity:1"
            })
            .appendTo($leftGrad);
        let $lstop3 = $(document.createElementNS("http://www.w3.org/2000/svg", "stop"))
            .attr({
                offset: "75%",
                style: "stop-color:rgb(255,0,0);stop-opacity:1"
            })
            .appendTo($leftGrad);

        let $rightGrad = $(document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"))
            .attr({
                id: "rightGrad",
                x1: "55%",
                y1: "-25%",
                x2: "100%",
                y2: "90%"
            })
            .appendTo($defs);
        let $rstop1 = $(document.createElementNS("http://www.w3.org/2000/svg", "stop"))
            .attr({
                offset: "25%",
                style: "stop-color:rgb(255,0,0);stop-opacity:1"
            })
            .appendTo($rightGrad);
        let $rstop2 = $(document.createElementNS("http://www.w3.org/2000/svg", "stop"))
            .attr({
                offset: "50%",
                style: "stop-color:rgb(235,235,235);stop-opacity:1"
            })
            .appendTo($rightGrad);
        let $rstop3 = $(document.createElementNS("http://www.w3.org/2000/svg", "stop"))
            .attr({
                offset: "75%",
                style: "stop-color:rgb(255,0,0);stop-opacity:1"
            })
            .appendTo($rightGrad);


        let $lArrow = $(document.createElementNS("http://www.w3.org/2000/svg", "path"))
            .attr({
                d: "M-425 50 l30 -50 v100 l-30 -50Z",
                fill: "grey",
                stroke: "black"
            })
            .click(lArrowHandler)
            .appendTo($svg);

        let $rArrow = $(document.createElementNS("http://www.w3.org/2000/svg", "path"))
            .attr({
                d: "M525 50 l-30 -50 v100 l30 -50Z",
                fill: "url(#rightGrad)",
                stroke: "black"
            })
            .click(rArrowHandler)
            .appendTo($svg);

        function lArrowHandler() {

            GiveItAll.playSound(sfxAudioFiles[0].src, "sfx");

            if (currentLevel === 1)
                return false;

            if (currentLevel === 5) {
                $rArrow.attr("fill", "url(#rightGrad)");
            }

            let current = document.getElementById(`level${currentLevel}screen`);
            let previous = document.getElementById(`level${--currentLevel}screen`);

            $(current).css({
                left: "100%"
            });
            $(previous).css({
                left: "0%"
            });

            if (currentLevel === 1)
                $lArrow.attr("fill", "grey");

        }

        function rArrowHandler() {

            GiveItAll.playSound(sfxAudioFiles[0].src, "sfx");

            if (currentLevel === 5)
                return false;

            if (currentLevel === 1)
                $lArrow.attr("fill", "url(#leftGrad)");

            let current = document.getElementById(`level${currentLevel}screen`);
            let next = document.getElementById(`level${++currentLevel}screen`);

            $(current).css({
                left: "-100%"
            });
            $(next).css({
                left: "0%"
            });

            if (currentLevel === 5)
                $rArrow.attr("fill", "grey");
        }

        function keydownHandler(e) {

            if (e.keyCode === 37) {

                lArrowHandler();

            }

            if (e.keyCode === 39) {

                rArrowHandler();

            }

        }

        setTimeout(function () {

            $(window).keydown(keydownHandler);

        }, 500)

        function readyButtonHandler() {

            GiveItAll.playSound(sfxAudioFiles[1].src, "sfx");

            $("<div id='blackscreen'></div>").css({
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                background: "black",
                opacity: 0,
                "transition-property": "all",
                "transition-duration": " 0.2s",
                "z-index": 1
            }).appendTo($(arenaScreen));
            setTimeout(function () {
                $(blackscreen).css("opacity", 0.9);
            }, 5);

            $(optionsMenu).css({
                display: "block",
                height: "20%",
                width: '25vw'
            })
        }

        $(readyButton).click(readyButtonHandler);

        function OBTargetVerify(who) {

            if (isNaN(TargetInput.value)) {

                GiveItAll.playSound(sfxAudioFiles[4].src,"sfx");

                $(OBTarget).css({
                    transition: "all 0s"
                }).addClass("wrong");
                setTimeout(function () {
                    $(OBTarget).css({
                        transition: "all 0.5s"
                    }).removeClass("wrong")
                }, 100);
                $(OBConfirm).trigger("displayCheck", [0]);
                return false;
            }
            targetScore = $(TargetInput).prop("value");

            $(OBConfirm).trigger("displayCheck", [1]);

            $(TargetCont).css({
                width: 0
            })
            setTimeout(function () {
                $(TargetCont).css({
                    display: "none"
                })
            }, 500);
            setTimeout(function(){OBTargetActive = false;}, 100);
        }

        $(OBTarget).click(function () {

            if(OBTargetActive === false) {
                GiveItAll.playSound(sfxAudioFiles[2].src, "sfx");

                $(TargetCont).css({
                    display: "block",
                    width: "10vw"
                })
                OBTargetActive = true;
            }
            else OBTargetVerify();
        })

        $(TargetInput).change(OBTargetVerify);

        $(OBDuration).click(function () {

            GiveItAll.playSound(sfxAudioFiles[2].src, "sfx");

            $(radioCont).css({
                display: "block",
                width: "25%"
            })

        })

        $(radioCont).children().click(function () {

            GiveItAll.playSound(sfxAudioFiles[2].src, "sfx");

            $(radioCont).children().css("background", "linear-gradient(90deg, #1CB5E0 0%, #000851 100%);");

            $(this).children("input").prop("checked", "checked");

            duration = parseInt($(this).children("input").prop("value"));

            $(OBConfirm).trigger("displayCheck", [1]);

            setTimeout(function () {

                $(radioCont).css("width", 0);

                setTimeout(function () {
                    $(radioCont).css("display", "none");
                }, 500);

            }, 300)

        })

        $(OBConfirm).on("displayCheck", function (e, choice) {

            if (choice) {

                if (duration)

                    $(OBConfirm).css({
                        display: "flex",
                        height: "33.3%"
                    });

            }

            else {

                $(OBConfirm).css({
                    height: 0
                });
                setTimeout(function () {
                    $(OBConfirm).css({
                        display: "none"
                    });
                }, 400);
            }

        })

        $(OBConfirm).click(function () {

            ArenaSong.pause();

            GiveItAll.playSound(sfxAudioFiles[3].src, "sfx");

            targetScore = Number(targetScore);

            if (targetScore)
                setTimeout(GiveItAll.QTEScriptLoader, 1000, player, targetScore, duration, currentLevel);
            else
                setTimeout(GiveItAll.QTEScriptLoader, 1000, player, 0, duration, currentLevel);

            sfxAudioFiles = undefined;

            $arenaScreen.remove();
            $(window).off("keydown", keydownHandler);
        });

        $(OBCancel).click(function () {

            GiveItAll.playSound(sfxAudioFiles[2].src, "sfx");

            $(blackscreen).css("opacity", 0);
            setTimeout(function () {
                $(blackscreen).remove();
            }, 200);

            $(optionsMenu).css({
                display: "none",
                height: 0,
                width: 0
            });

        });

        $(TitleReturnButton).click(function () {

            ArenaSong.pause();

            setTimeout(GiveItAll.TitlePageScriptLoader, 1000);

            sfxAudioFiles = undefined;

            $arenaScreen.remove();

            $(window).off("keydown", keydownHandler);

        });

        setTimeout(function () {

            $(arenaScreen).css("opacity", 1);
            $(readyButton).css("opacity", 1);
        }, 5);

        $(readyButton).mouseenter(function(){

            GiveItAll.playSound(sfxAudioFiles[5].src,"sfx");

        });

        $(".OptionsButton").mouseenter(function(){

            GiveItAll.playSound(sfxAudioFiles[5].src,"sfx");

        })
    }
}