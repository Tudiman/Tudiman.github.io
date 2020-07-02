GiveItAll.InstrPageScriptLoader = function() {

    let sfxAudioFiles = [new Audio("Resources/Audio/ArenaArrow.wav")];

    let videoFiles = [];
    videoFiles.push($("<video src='Resources/TrackVideo.mp4'></video>"));
    videoFiles.push($("<video src='Resources/MultBarUp.mp4'></video>"));
    videoFiles.push($("<video src='Resources/MultBarDown.mp4'></video>"));

    videoFiles.concat(sfxAudioFiles);

    GiveItAll.MediaLoader(videoFiles, InstrPageScript);

    function InstrPageScript() {

        GiveItAll.playSound(sfxAudioFiles[0].src, "sfx");

        $("<div id='InstrWrapper'>" +
            "<div class='InstrDiv' id='QTEDiv'>" +
            "<p class='InstrDesc'>Sunt trei tipuri de evenimente</p>" +
            "<div class='QTEIndDiv' id='LetterDiv'>" +
            "<img src='Resources/Letter.png'><p class='QTEDesc'>-litera<br/><br/>-trebuie sa apesi pe tasta desenata in cerc, doar QWE ASD ZXC</p>" +
            "</div>" +
            "<div class='QTEIndDiv' id='TrackDiv'>" +
            "<div><video src='Resources/TrackVideo.mp4' muted loop autoplay></video></div>" +
            "<p class='QTEDesc'>-traseu<br/><br/>-trebuie sa duci mouse-ul pe fiecare componenta din traseu," +
            " in ordinea indicata pe numarul din fiecare cerc, cinci in total</p>" +
            "</div>" +
            "<div class='QTEIndDiv' id='SliderDiv'>" +
            "<img src='Resources/Slider.png'><p class='QTEDesc'>-slider<br/><br/>-trebuie sa apesi cu mouse-ul pe cerc si sa il tragi in capatul" +
            " opus al slider-ului</p>" +
            "</div>" +
            "</div>" +
            "<div class='InstrDiv' id='BarDiv'>" +
            "<p class='InstrDesc'>Cum functioneaza multiplierul</p>" +
            "<p class='BarDesc'>Multiplierul afecteaza frecventa de aparitie a evenimentelor," +
            " durata dupa care dispar evenimentele si numarul de puncte primit la fiecare eveniment completat.</p>" +
            "<img src='Resources/MultBar.png'><p class='BarDesc'>Initial, multiplierul este 1.</p>" +
            "<div><video src='Resources/MultBarUp.mp4' muted loop autoplay></video></div><p class='BarDesc'>Dupa un eveniment completat, multiplierul creste.<br/>Drept urmare, evenimentele apar mai des," +
            " stau mai putin, si ofera mai multe puncte.</p>" +
            "<div><video src='Resources/MultBarDown.mp4' muted loop autoplay></video></div>" +
            "<p class='BarDesc'>Daca ratezi un eveniment, multiplierul se intoarce la 1.</p>" +
            "<p class='BarDesc'>Daca vrei scoruri mari, tine multiplierul cat mai sus," +
            " dar nu uita ca un multiplier mai mare inseamna dificultate marita a jocului</p>" +
            "</div>" +
            "<div class='InstrDiv' id='LevelDiv'>" +
            "<p class='InstrDesc'>Sunt cinci nivele</p>" +
            "<div id='LevelsDiv'>" +
            "<img src='Resources/Back1.jpg'>" +
            "<img src='Resources/Back2.jpg'>" +
            "<img src='Resources/Back3.jpg'>" +
            "<img src='Resources/Back4.jpg'>" +
            "</div>" +
            "<p class='LevelsDesc'>O data cu cresterea dificultatii, creste si punctajul obtinut," +
            " dar evenimentele apar mai des si dispar mai repede.</p>" +
            "<div id='SpecialLevel'><img id='SpecialLevelImg' src='Resources/Back5.jpg'></div>" +
            "<p class='LevelsDesc'>Nivelul 5 este unul special. Desi intre celelalte niveluri" +
            " exista o diferenta moderata in dificultate si este posibila trecerea de la un nivel" +
            " la urmatorul fara prea mare efort, nivelul 5 are caracter special si este mult mai dificil decat nivelul 4.</p>" +
            "</div>" +
            "<div id='InstrBackButton'><i class='material-icons InstrBack'>clear</i></div>" +
            "</div>")
            .appendTo(document.body);

        setTimeout(function () {
            $(InstrWrapper).css({
                transform: "scale(1,1)"
            });
        }, 5);

        $(InstrBackButton).click(function () {

            $(InstrWrapper).css({
                transition: "all 0.2s",
                transform: "scale(0,0)"
            });
            setTimeout(function () {

                videoFiles = undefined;
                sfxAudioFiles = undefined;
                $(InstrWrapper).remove();
            }, 200)
        });
    }
}
