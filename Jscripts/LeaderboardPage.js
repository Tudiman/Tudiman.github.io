GiveItAll.LeaderboardPageScriptLoader = function(player) {

    let sfxAudioFiles = [new Audio("../Resources/Audio/ArenaArrow.wav")];
    sfxAudioFiles.push(new Audio("../Resources/Audio/MenuClick.wav"));

    GiveItAll.MediaLoader(sfxAudioFiles, LeaderboardPageScript, player);

    function LeaderboardPageScript(player) {

        GiveItAll.playSound(sfxAudioFiles[0].src,"sfx");

        let LBSearchOpen = 0;
        let LBFilterOpen = 0;
        let LBDurFilterOpen = 0;
        let LBDiffFilterOpen = 0;
        let DurCheck = 3;
        let LBSearchResultsFound;

        $("<div id='LBWrapper'>" +
            "<button class='LBButton' id='LBFilter'>Cautare avansata</button>" +
            "<button class='LBButton' id='LBDurationFilter'>Filtreaza durata</button>" +
            "<div class='LBIndFilterCont' id='LBDurFilterCont'>" +
            "<div class='LBIndDurFilterCont'>" +
            "<input type='checkbox' class='LBCheck' value='30000' checked>" +
            "<label for='30000'>30s</label>" +
            "</div>" +
            "<div class='LBIndDurFilterCont'>" +
            "<input type='checkbox' class='LBCheck' value='60000' checked>" +
            "<label for='60000'>60s</label>" +
            "</div>" +
            "<div class='LBIndDurFilterCont'>" +
            "<input type='checkbox' class='LBCheck' value='120000' checked>" +
            "<label for='120000'>120s</label>" +
            "</div>" +
            "</div>" +
            "<button class='LBButton' id='LBDifficultyFilter'>Filtreaza nivelurile</button>" +
            "<div class='LBIndFilterCont' id='LBDiffFilterCont'>" +
            "<div class='LBIndDiffFilterCont'>" +
            "<input type='checkbox' class='LBCheck' value='1' checked>" +
            "<label for='1'>1</label>" +
            "</div>" +
            "<div class='LBIndDiffFilterCont'>" +
            "<input type='checkbox' class='LBCheck' value='2' checked>" +
            "<label for='2'>2</label>" +
            "</div>" +
            "<div class='LBIndDiffFilterCont'>" +
            "<input type='checkbox' class='LBCheck' value='3' checked>" +
            "<label for='3'>3</label>" +
            "</div>" +
            "<div class='LBIndDiffFilterCont'>" +
            "<input type='checkbox' class='LBCheck' value='4' checked>" +
            "<label for='4'>4</label>" +
            "</div>" +
            "<div class='LBIndDiffFilterCont'>" +
            "<input type='checkbox' class='LBCheck' value='5' checked>" +
            "<label for='5'>5</label>" +
            "</div>" +
            "</div>" +
            "<div id='FlexCont'>" +
            "<div class='LevelFlexCont' id='LFCont1'>" +
            "<div class='TimeFlexDiv TFDiv1'>30s</div>" +
            "<div class='TimeFlexDiv TFDiv2'>60s</div>" +
            "<div class='TimeFlexDiv TFDiv3'>120s</div>" +
            "</div>" +
            "<div class='LevelFlexCont' id='LFCont2'>" +
            "<div class='TimeFlexDiv TFDiv1'>30s</div>" +
            "<div class='TimeFlexDiv TFDiv2'>60s</div>" +
            "<div class='TimeFlexDiv TFDiv3'>120s</div>" +
            "</div>" +
            "<div class='LevelFlexCont' id='LFCont3'>" +
            "<div class='TimeFlexDiv TFDiv1'>30s</div>" +
            "<div class='TimeFlexDiv TFDiv2'>60s</div>" +
            "<div class='TimeFlexDiv TFDiv3'>120s</div>" +
            "</div>" +
            "<div class='LevelFlexCont' id='LFCont4'>" +
            "<div class='TimeFlexDiv TFDiv1'>30s</div>" +
            "<div class='TimeFlexDiv TFDiv2'>60s</div>" +
            "<div class='TimeFlexDiv TFDiv3'>120s</div>" +
            "</div>" +
            "<div class='LevelFlexCont' id='LFCont5'>" +
            "<div class='TimeFlexDiv TFDiv1'>30s</div>" +
            "<div class='TimeFlexDiv TFDiv2'>60s</div>" +
            "<div class='TimeFlexDiv TFDiv3'>120s</div>" +
            "</div>" +
            "</div>" +
            "<div id='SearchMenu'>" +
            "<button class='LBButton' id='LBSearch'>Cauta un GamerTag</button>" +
            "<input type='text' class='LBButton' id='LBInput'>" +
            "<button class='LBButton' id='LBSelf'>Cauta-te pe tine</button>" +
            "</div>" +
            "</div>")
            .appendTo(document.body);

        setTimeout(function () {
            $(LBWrapper).css({
                transform: "scale(1,1)"
            })
        }, 5);

        $(LBFilter).click(function () {

            if (LBFilterOpen === 0) {

                $(LBDurationFilter).css({
                    transform: "translateY(-50%) scaleX(1)",
                    left: "20%"
                });

                $(LBDifficultyFilter).css({
                    transform: "translateY(-50%) scaleX(1)",
                    left: "60%"
                });

                $(LBFilter).text("Inchide");

                LBFilterOpen = 1;
            }
            else {

                if (LBDurFilterOpen === 0) {

                    $(LBDurationFilter).css({
                        transform: "translateY(-50%) scaleX(0)",
                        left: "30%"
                    });

                }
                else {

                    $(LBDurFilterCont).css({
                        transform: "scaleY(0)",
                        top: "11.5%"
                    });

                    LBDurFilterOpen = 0;

                    setTimeout(function () {
                        $(LBDurationFilter).css({
                            transform: "translateY(-50%) scaleX(0)",
                            left: "30%"
                        });
                    }, 500);

                }
                if (LBDiffFilterOpen === 0) {

                    $(LBDifficultyFilter).css({
                        transform: "translateY(-50%) scaleX(0)",
                        left: "50%"
                    });

                }
                else {

                    $(LBDiffFilterCont).css({
                        transform: "scaleY(0)",
                        top: "11.5%"
                    });

                    LBDiffFilterOpen = 0;

                    setTimeout(function () {
                        $(LBDifficultyFilter).css({
                            transform: "translateY(-50%) scaleX(0)",
                            left: "50%"
                        });
                    }, 500);

                }

                $(LBFilter).text("Cautare avansata");

                LBFilterOpen = 0;

            }
        });

        $(LBDurationFilter).click(function () {

            if (LBDurFilterOpen === 0) {

                $(LBDurFilterCont).css({
                    transform: "scaleY(1)",
                    top: "13%"
                });

                LBDurFilterOpen = 1;

            }
            else {

                $(LBDurFilterCont).css({
                    transform: "scaleY(0)",
                    top: "11.5%"
                });

                LBDurFilterOpen = 0;

            }
        });

        $(".LBCheck").change(function () {

            if (this.checked) {

                if (this.value < 10) {

                    let RemVal = document.getElementById(`LFCont${this.value}`);

                    $(RemVal).css({
                        display: "flex",
                        width: "18%",
                        "border-width": "5px",
                        margin: "0 1% 0 1%"
                    });

                }
                else {

                    DurCheck++;

                    let RemIndex = this.value === "30000" ? 1 : (this.value === "60000" ? 2 : 3);

                    $(`.TFDiv${RemIndex}`).css({
                        height: 0,
                        "border-width": 0
                    });

                    setTimeout(function () {

                        $(`.TFDiv${RemIndex}`).css({
                            display: "flex",
                            height: `${100 / DurCheck}%`,
                            "border-width": "5px"
                        });
                        $(".TimeFlexDiv").css({
                            height: `${100 / DurCheck}%`
                        });
                        $(".LevelFlexCont").css({
                            height: `${100 / (4 - DurCheck)}%`,
                            "border-width": "5px"
                        });

                    }, 5);

                }
            }
            else {

                if (this.value < 10) {

                    let RemVal = document.getElementById(`LFCont${this.value}`);

                    $(RemVal).css({
                        width: 0,
                        "border-width": 0,
                        margin: 0
                    });
                    setTimeout(function () {
                        $(RemVal).css({
                            display: "none"
                        })
                    }, 500);
                }
                else {

                    DurCheck--;

                    let RemIndex = this.value === "30000" ? 1 : (this.value === "60000" ? 2 : 3);

                    if (DurCheck) {
                        $(".TimeFlexDiv").css({
                            height: `${100 / DurCheck}%`,
                        });
                        $(".LevelFlexCont").css({
                            height: `${100 / (4 - DurCheck)}%`
                        });
                    }
                    else {
                        $(".LevelFlexCont").css({
                            height: 0,
                            "border-width": 0,
                        });
                    }
                    $(`.TFDiv${RemIndex}`).css({
                        height: 0,
                        "border-width": 0,
                    });
                    setTimeout(function () {
                        $(`.TFDiv${RemIndex}`).css({
                            display: "none"
                        });
                    }, 500)

                }
            }
        });

        $(LBDifficultyFilter).click(function () {

            if (LBDiffFilterOpen === 0) {

                $(LBDiffFilterCont).css({
                    transform: "scaleY(1)",
                    top: "13%"
                });

                LBDiffFilterOpen = 1;

            }
            else {

                $(LBDiffFilterCont).css({
                    transform: "scaleY(0)",
                    top: "11.5%"
                });

                LBDiffFilterOpen = 0;

            }
        });

        $(LBSearch).click(function () {

            if (LBSearchOpen === 0) {

                $(LBSelf).add(LBInput).css({
                    height: "33.33%",
                    padding: "2%",
                    "border-width": "2px"
                });

                $(LBSearch).text("Anuleaza");

                LBSearchOpen = 1;
            }
            else {

                LBSearchOpen = 0;

                $(LBSelf).add(LBInput).css({
                    height: 0,
                    padding: 0,
                    "border-width": 0
                });

                $(LBSearch).text("Cauta un GamerTag");

                if ($(LBSearch).text() === "Anuleaza")
                    LBInput.value = "";
                else {

                    LBSearchResultsFound = 0;

                    let regex = new RegExp(`^(${LBInput.value})\\|(\\d+)\\|(\\d)$`);

                    let matches = [], match, dur, diff;
                    for (let i = 0; i < 5; i++) {
                        matches.push([]);
                        for (let j = 0; j < 3; j++)
                            matches[i].push(0);
                    }

                    for (let key in localStorage) {

                        if ((match = regex.exec(key)) !== null) {

                            dur = match[2];
                            if (dur === "30000")
                                dur = 0;
                            else if (dur === "60000")
                                dur = 1;
                            else if (dur === "120000")
                                dur = 2;
                            else continue;
                            diff = match[3] - 1;

                            matches[diff][dur] = localStorage.getItem(match[0]);

                            LBSearchResultsFound = 1;
                        }
                    }

                    $("<div id='BlackScreen'></div>").appendTo(LBWrapper);

                    setTimeout(function () {
                        $(BlackScreen).css("opacity", 0.7);
                    }, 5);

                    $("<div id='LBSearchResults'></div>").appendTo(LBWrapper);

                    if (LBSearchResultsFound) {

                        $(LBSearchResults).css({
                            display: "block"
                        })

                        for (let i = 0; i < 5; i++) {
                            $(`<div class='LBSearchResultsRow' data-level=${i}></div>`).appendTo(LBSearchResults);
                        }

                        $(".LBSearchResultsRow").each(function (i, e) {
                            $(e).css({
                                background: `url("../Resources/Back${i + 1}.jpg") bottom/cover`,
                            });
                            for (let j = 0; j < 3; j++)
                                $(`<div class='LBSearchResultsCol' data-level=${j}>${matches[i][j]}</div>`)
                                    .appendTo(e);
                        })

                    }
                    else {

                        $(LBSearchResults).css({
                            display: "flex"
                        })
                        $(LBSearchResults).text("Nu s-a gasit Gamer Tag-ul in baza de date.");

                    }
                    $("<button id='LBListBack'><i class='material-icons'>clear</i></button>")
                        .css({
                            top: "calc(25% + 5px)",
                            left: "calc(25% + 5px)"
                        })
                        .click(function () {
                            $(LBListBack).remove();
                            $(LBSearchResults).remove();
                            $(BlackScreen).css("opacity", 0);
                            setTimeout(function () {
                                $(BlackScreen).remove();
                            }, 200);
                        }).appendTo(LBWrapper);

                }
            }
        })

        $(".LevelFlexCont").click(function (e) {

            if ($(this).text().match(/^\d/)) {

                $("<div id='BlackScreen'></div>").appendTo(LBWrapper);

                setTimeout(function () {
                    $(BlackScreen).css("opacity", 0.7);
                }, 5);

                let LevelReg = /\d/i;
                let Dur = parseInt($(e.target).text()) * 1000;
                let Diff = parseInt(this.id.match(LevelReg)[0]);

                function compareFn(a, b) {

                    return Number(b[1]) - Number(a[1]);

                }

                let regex = new RegExp(`^(\\w+)\\|(${Dur})\\|(${Diff})$`);
                let matches = [], match;

                for (let key in localStorage) {
                    if ((match = regex.exec(key)) !== null && Number(match[2]) === Dur && Number(match[3]) === Diff) {
                        matches.push([match, localStorage.getItem(match[0])]);
                    }
                }

                matches.sort(compareFn);

                $("<ul id='LBList'></ul>").appendTo(LBWrapper);

                for (let i = 0; i < matches.length; i++) {
                    $(`<li class="LBListItem">${i + 1} : ${matches[i][0][1]}<br/>${matches[i][1]}</li>`)
                        .appendTo(LBList);
                }
                $("<button id='LBListBack'><i class='material-icons'>clear</i></button>")
                    .click(function () {
                        $(LBListBack).remove();
                        $(LBList).remove();
                        $(BlackScreen).css("opacity", 0);
                        setTimeout(function () {
                            $(BlackScreen).remove();
                        }, 200);
                    }).appendTo(LBWrapper);


            }
        });

        $(LBInput).keyup(function () {

            let regex = /^[a-zA-Z][a-zA-Z0-9]{2,11}$/i;

            if (LBInput.value.match(regex)) {
                $(LBSearch).text("Cauta");
            }
            else {
                $(LBSearch).text("Anuleaza");
            }

        })

        $(LBSelf).click(function () {

            LBInput.value = player;
            $(LBSearch).text("Cauta").trigger("click");

        })

        $("<button id='LBClose'><i class='material-icons'>clear</i></button>")
            .click(function () {

                $(LBWrapper).css({
                    transform: "scale(0,0)",
                    transition: "all 0.2s"
                })
                setTimeout(function () {

                    sfxAudioFiles = undefined;

                    $(LBWrapper).remove();
                }, 200);
            })
            .appendTo(LBWrapper);

        $(".LBButton").mouseenter(function(){

            GiveItAll.playSound(sfxAudioFiles[1].src,"sfx");

        })
    }
}