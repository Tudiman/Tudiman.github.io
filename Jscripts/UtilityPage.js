if(localStorage.getItem("overallVolume") === null)
    localStorage.setItem("overallVolume", 1);
if(localStorage.getItem("sfxVolume") === null)
    localStorage.setItem("sfxVolume", 1);
if(localStorage.getItem("bgmVolume") === null)
    localStorage.setItem("bgmVolume", 1);

GiveItAll.MediaLoader = function(Files, callback, ...args) {

    let LoadCounter = 0;

    Files.forEach(function (e) {

        $(e).on("loadeddata", function () {

            LoadCounter++;

            if (LoadCounter === Files.length) {
                callback(...args);
            }
        });

    });

};

GiveItAll.playSound = function(src, type, volume) {

    let audio = document.createElement("audio");
    audio.src = src;
    audio.type = type;
    audio.volume = localStorage.getItem("overallVolume") * localStorage.getItem(`${type}Volume`) * (volume || 1);
    const playPromise = audio.play();
    if (playPromise !== null){
        playPromise.catch(() => {
            $("<input type='text'>").appendTo(document.documentElement).focus().remove();
            audio.play(); })
    }

    audio.onended = function(){
        if(audio !== undefined)
            audio.remove();
    }

    return audio;

};

GiveItAll.stringifyMap = function(map) {
    return JSON.stringify(Array.from(map.entries()));
};
GiveItAll.parseMap = function(string) {
    return new Map(JSON.parse(string));
};
