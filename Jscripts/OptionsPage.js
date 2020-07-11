GiveItAll.OptionsPageScriptLoader = function(...songs) {

    let sfxAudioFiles = [];
    sfxAudioFiles.push(new Audio("Resources/Audio/MenuClick.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/MenuConfirm.wav"));
    sfxAudioFiles.push(new Audio("Resources/Audio/ArenaArrow.wav"));

    GiveItAll.MediaLoader(sfxAudioFiles, OptionsPageScript, songs);

    function OptionsPageScript(songs) {

        GiveItAll.playSound(sfxAudioFiles[2].src,"sfx");

        $("<div id='OptionsWrapper'>" +
            "<div class='VolumeWrapper' id='OVW'>" +
            "<label for='OverallVolume'>Volum total</label>" +
            "<input type='range' id='OverallVolume' min='0' max='100' step='0.1'" +
            "</div>" +
            "<div class='VolumeWrapper' id='BVW'>" +
            "<label for='BGMVolume'>Volumul melodiilor</label>" +
            "<input type='range' id='BGMVolume' min='0' max='100' step='0.1'" +
            "</div>" +
            "<div class='VolumeWrapper' id='SVW'>" +
            "<label for='SFXVolume'>Volumul efectelor</label>" +
            "<input type='range' id='SFXVolume' min='0' max='100' step='0.1'" +
            "</div>" +
            "</div>").appendTo(document.body);

        setTimeout(function () {

            $(OptionsWrapper).css({
                transform: "scale(1,1)"
            })

        }, 5);

        $(".VolumeWrapper").mouseenter(function(){

            GiveItAll.playSound(sfxAudioFiles[0].src,"sfx");

        })

        $("<button id='OClose'><i class='material-icons'>clear</i></button>")
            .click(function () {

                $(OptionsWrapper).css({
                    transform: "scale(0,0)",
                    transition: "all 0.2s"
                });
                setTimeout(function () {

                    $(OptionsWrapper).remove();
                }, 200);
            })
            .appendTo(OptionsWrapper);

        $(OverallVolume).prop("value", parseFloat(localStorage.getItem("overallVolume")) * 100)
            .change(function () {
                localStorage.setItem("overallVolume", parseFloat(OverallVolume.value) / 100);
                GiveItAll.playSound(sfxAudioFiles[1].src,"sfx");
                for(let song of songs) {
                    song.volume = localStorage.getItem("overallVolume") * localStorage.getItem(`${song.type}Volume`);
                }

            });
        $(BGMVolume).prop("value", parseFloat(localStorage.getItem("bgmVolume")) * 100)
            .change(function () {

                localStorage.setItem("bgmVolume", parseFloat(BGMVolume.value) / 100);
                GiveItAll.playSound(sfxAudioFiles[1].src,"sfx");
                for(let song of songs) {
                    song.volume = localStorage.getItem("overallVolume") * localStorage.getItem(`${song.type}Volume`);
                }
            });
        $(SFXVolume).prop("value", parseFloat(localStorage.getItem("sfxVolume")) * 100)
            .change(function () {

                localStorage.setItem("sfxVolume", parseFloat(SFXVolume.value) / 100);
                GiveItAll.playSound(sfxAudioFiles[1].src,"sfx");
                for(let song of songs) {
                    song.volume = localStorage.getItem("overallVolume") * localStorage.getItem(`${song.type}Volume`);
                }
            });
    }
}
