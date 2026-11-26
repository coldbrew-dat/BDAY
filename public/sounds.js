(function () {
    const STARTUP_FILE = "/audio/win7-startup.wav";
    const POP_FILE = "/audio/balloon-pop.mp3";
    const MEOW_FILE = "/audio/meow.wav";
    const SHUTDOWN_FILE = "/audio/win7-shutdown.wav";

    let clickCtx = null;

    function playFile(src) {
        const audio = new Audio(src);
        audio.preload = "auto";
        audio.play().catch(function () {});
    }

    function playClick() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!clickCtx) clickCtx = new AudioContext();
        if (clickCtx.state === "suspended") clickCtx.resume();

        const now = clickCtx.currentTime;
        const oscillator = clickCtx.createOscillator();
        const gain = clickCtx.createGain();
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(1100, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
        oscillator.connect(gain);
        gain.connect(clickCtx.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.05);
    }

    const sfx = {
        click: playClick,
        startup: function () { playFile(STARTUP_FILE); },
        pop: function () { playFile(POP_FILE); },
        meow: function () { playFile(MEOW_FILE); },
        shutdown: function () { playFile(SHUTDOWN_FILE); }
    };

    window.sfx = sfx;

    // Startup audio waits for the first interaction because browsers block autoplay.
    let unlocked = false;
    function firstTouch() {
        if (unlocked) return;
        unlocked = true;
        if (document.body.hasAttribute("data-startup")) sfx.startup();
    }

    document.addEventListener("pointerdown", firstTouch);
    document.addEventListener("keydown", firstTouch);

    // Clicks are intentionally limited to controls. Page/window transitions add no sound.
    document.addEventListener("click", function (e) {
        const target = e.target.closest("button, a, summary, .desktop-icon");
        if (!target) return;
        if (target.id === "shutdownButton" || target.id === "menuShutdown") return;
        sfx.click();
    });
})();
