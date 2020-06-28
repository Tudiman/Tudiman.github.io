GiveItAll.GameEndScriptLoader = function(player, score, target, duration, difficulty) {

    let results = localStorage.getItem(`${player}|${duration}|${difficulty}`);

    if (results === null || results < score)
        localStorage.setItem(`${player}|${duration}|${difficulty}`, score);

    let endText;

    if (target)
        endText = score > target ? "Felicitari!" : "Din pacate nu ti-ai atins targetul!";
    else
        endText = "Felicitari!";

    $(`<div id="endPage"><h1 id='endTitle'>${endText}</h1>
<p id="endScore">Scor final : ${score}, durata : ${duration / 1000}s</p>
<div class="endButton" id="resetButton">Joaca din nou</div>
<div class="endButton" id="targetChange">Schimba targetul</div>
<input type="text" id="targetInput">
<ul id="lTarget"></ul>
<div class="targetButton" id="targetConfirm">Confirma</div>
<div class="targetButton" id="targetCancel">Anuleaza</div>
<div class="endButton" id="levelChange">Schimba nivelul</div>
<div class="endButton" id="leaderboard">Leaderboard</div>
<div class="endButton" id="startButton">Du-te la Title Screen</div>
</div>`).appendTo(document.body);

    $(endPage).css({
        'background-image': `url("../Resources/Back${difficulty}.jpg")`,
        'background-position': "center",
        'background-size': 'cover',
        width: '100%',
        height: '100vh'
    });

    setTimeout(function () {

        $(resetButton).css({
            display: 'flex',
            width: "25%",
            height: "10%",
            padding: "5px",
        })

    }, 400);

    setTimeout(function () {

        $(targetChange).css({
            display: 'flex',
            width: "25%",
            height: "10%",
            padding: "5px",
        })

    }, 550);

    setTimeout(function () {

        $(levelChange).css({
            display: 'flex',
            width: "25%",
            height: "10%",
            padding: "5px",
        })

    }, 700);

    setTimeout(function () {

        $(leaderboard).css({
            display: 'flex',
            width: "25%",
            height: "10%",
            padding: "5px",
        })

    }, 850);

    setTimeout(function () {

        $(startButton).css({
            display: 'flex',
            width: "25%",
            height: "10%",
            padding: "5px",
        })

    }, 1000);

    function compareFn(a, b) {

        return Number(b[1]) - Number(a[1]);

    }

    let regex = new RegExp(`^(\\w+)\\|(${duration})\\|(${difficulty})$`);
    let matches = [], match;

    for (let key in localStorage) {
        if ((match = regex.exec(key)) !== null && Number(match[2]) === duration && Number(match[3]) === difficulty) {
            matches.push([match, localStorage.getItem(match[0])]);
        }
    }

    matches.sort(compareFn);

    let length = matches.length > 5 ? 5 : matches.length;

    for (let i = 0; i < length; i++) {
        $(`<li>${matches[i][0][1]} : ${matches[i][1]}</li>`)
            .click(function () {
                new Audio("../Resources/Audio/MenuConfirm.wav").play();
                setTimeout(GiveItAll.QTEScriptLoader, 1000, player, matches[i][1], duration, difficulty);
                $(endPage).remove();
            })
            .appendTo($(lTarget));
    }

    $(resetButton).click(function () {

        new Audio("../Resources/Audio/MenuConfirm.wav").play();

        setTimeout(GiveItAll.QTEScriptLoader, 1000, player, target, duration, difficulty);

        $(endPage).remove();

    })

    $(window).keypress(function (e) {

        if (e.key.toLowerCase() === "r") {

            new Audio("../Resources/Audio/MenuConfirm.wav").play();

            $(window).off("keypress");

            $(resetButton).trigger("click");

        }

    })

    $(targetChange).click(function () {

        new Audio("../Resources/Audio/ArenaEnter.wav").play();

        $(targetInput).css({
            display: "block",
            width: "25%",
        });
        setTimeout(function () {
            $(lTarget).css({
                display: "flex",
                height: `${length * 8}%`
            })
        }, 500)
        $("#lTarget li").css({
            height: `${100 / length}%`
        })
        $(".targetButton").css({
            display: "flex"
        })

    })

    $(targetConfirm).click(function () {

        if (isNaN(targetInput.value)) {

            new Audio("../Resources/Audio/Wrong.wav").play();

            $(targetConfirm).css({
                transition:"all 0s"
            }).addClass("wrong");
            setTimeout(function () {
                $(targetConfirm).css({
                    transition:"all 0.5s"
                }).removeClass("wrong")
            }, 100);
        }
        else {

            new Audio("../Resources/Audio/MenuConfirm.wav").play();

            if (targetInput.value !== "")
                setTimeout(GiveItAll.QTEScriptLoader, 1000, player, parseFloat(targetInput.value), duration, difficulty);
            else
                setTimeout(GiveItAll.QTEScriptLoader, 1000, player, 0, duration, difficulty);
            $(endPage).remove();

        }
    });

    $(targetCancel).click(function () {

        new Audio("../Resources/Audio/ArenaMenu.wav").play();

        setTimeout(function () {
            $(targetInput).css({
                width: 0
            })
            setTimeout(function () {
                $(targetInput).css({
                    display: "none"
                }).prop("value", "");
            }, 500);
        }, 500);
        $(".targetButton").css({
            display: "none"
        });
        $(lTarget).css({
            height: 0
        })
    });

    $(levelChange).click(function () {

        new Audio("../Resources/Audio/MenuConfirm.wav").play();

        setTimeout(GiveItAll.ArenaScriptLoader, 1000, player);

        $(endPage).remove();

    })

    $(leaderboard).click(function () {

        GiveItAll.LeaderboardPageScriptLoader(player);

    })

    $(startButton).click(function(){

        new Audio("../Resources/Audio/MenuConfirm.wav").play();

        setTimeout(GiveItAll.TitlePageScriptLoader, 1000);

        $(endPage).remove();

    })

}
