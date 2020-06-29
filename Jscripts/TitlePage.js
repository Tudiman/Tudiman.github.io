GiveItAll.TitlePageScriptLoader = function() {

    let sfxAudioFiles = [];
    sfxAudioFiles.push(new Audio("Resources/Audio/MenuConfirm.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/Wrong.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/MenuClick.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/MenuSong.mp3"));

    let MenuSong;

    GiveItAll.MediaLoader(sfxAudioFiles, TitlePageScript);

    function TitlePageScript() {

        let titleChars = "Precision:Extreme".split("");

        let tagNameInfo;

        let player;

        $("<div id='FirstPage'>" +
            "<h1 id='LoadTitle'></h1>" +
            "<p id='pressAnyButton'>Apasa orice buton pentru a incepe</p>" +
            "<div id='gamerCont'>" +
            "<label for='gamerTag' id='gamerLabel'>Gamer Tag-ul : </label>" +
            "<input type='text' id='gamerTag'>" +
            "</div>" +
            "</div>")
            .appendTo(document.body);

        setTimeout(function () {
            $(FirstPage).css({
                opacity: 1
            })
        }, 1000);

        let text = "";

        for (let i = 0; i < 10; i++) {
            setTimeout(function () {

                text += titleChars[i];

                $(LoadTitle).text(text);

            }, 2500 + i * 30);
        }
        for (let i = 10; i < 17; i++) {
            setTimeout(function () {

                text += titleChars[i];

                $(LoadTitle).text(text);

            }, 3000 + i * 30);
        }

        function loadHandler(e) {

            MenuSong = GiveItAll.playSound(sfxAudioFiles[3].src,"bgm");
            e.preventDefault();

            $(window).off("keydown", loadHandler);

            $(pressAnyButton).css({
                opacity: 0,
                top: "95%",
                transition: "all 0.5s"
            });
            setTimeout(function () {
                $(pressAnyButton).remove();
            }, 500);
            $(LoadTitle).css({
                top: "10%"
            });
            setTimeout(function () {

                $(gamerCont).css({
                    display: "block",
                    height: "5vw",
                    width: "auto",
                })

                gamerTag.focus();

            }, 200);
        }

        setTimeout(function () {

            $(document.documentElement).focus();

            $(pressAnyButton).css({
                opacity: 1
            })

            $(window).keydown(loadHandler);

        }, 4500);

        $(gamerTag).change(function () {

            let regex = /^[a-zA-Z][a-zA-Z0-9]{2,11}$/i;

            if (gamerTag.value.match(regex)) {

                GiveItAll.playSound(sfxAudioFiles[0].src,"sfx");
                player = gamerTag.value;

                if (tagNameInfo !== undefined) {
                    tagNameInfo.remove();
                }

                $(gamerCont).css({
                    opacity: 0,
                });
                setTimeout(function () {

                    $(gamerCont).remove();
                    $("<div id='MainMenu'>" +
                        "<div class='MainMenuItem' id='Start'>Start joc</div>" +
                        "<div class='MainMenuItem' id='Instr'>Instructiuni</div>" +
                        "<div class='MainMenuItem' id='Options'>Optiuni</div>" +
                        "<div class='MainMenuItem' id='Leaderboard'>Leaderboard</div>" +
                        "<div class='MainMenuItem' id='TitleReturn'>Inapoi la Title Screen</div>" +
                        "</div>")
                        .appendTo(FirstPage);
                    setTimeout(function () {
                        $(MainMenu).css({
                            opacity: 1
                        })
                    }, 5);

                    $(".MainMenuItem").mouseenter(function(){

                        GiveItAll.playSound(sfxAudioFiles[2].src,"sfx");

                    })

                    $(Start).click(function () {

                        GiveItAll.playSound(sfxAudioFiles[0].src,"sfx");
                        setTimeout(GiveItAll.ArenaScriptLoader, 1000, player);

                        MenuSong.pause();

                        sfxAudioFiles = undefined;

                        $(FirstPage).remove();

                    });

                    $(Instr).click(function () {

                        GiveItAll.InstrPageScriptLoader();

                    });

                    $(Options).click(function () {

                        GiveItAll.OptionsPageScriptLoader(MenuSong);

                    });

                    $(Leaderboard).click(function () {
                        setTimeout(function(){MenuSong.play()}, 500);
                        GiveItAll.LeaderboardPageScriptLoader(player);

                    })

                    $(TitleReturn).click(function () {

                        MenuSong.pause();

                        setTimeout(GiveItAll.TitlePageScriptLoader, 1000);

                        sfxAudioFiles = undefined;

                        $(FirstPage).remove();

                    })

                }, 1000);

            }
            else {

                GiveItAll.playSound(sfxAudioFiles[1].src, "sfx");

                $(gamerTag).css({
                    background: "red",
                    transition: "all 0s"
                });
                setTimeout(function () {
                    $(gamerTag).css({
                        background: "navajowhite",
                        transition: "all 0.5s"
                    });
                }, 100);

                if (tagNameInfo === undefined) {
                    tagNameInfo = $("<p id='tagInfo'>Sunt permise doar litere si cifre.<br/>" +
                        "Primul caracter trebuie sa fie litera.<br/>" +
                        "Maxim 12 caractere.</p>")
                        .appendTo($(gamerCont));
                }

            }

        })
    }
}