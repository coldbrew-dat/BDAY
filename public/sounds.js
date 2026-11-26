(function () {
    // OPTIONAL: to use your own files, upload them to public/ and set the names here
    // e.g. const STARTUP_FILE = "/startup.mp3";
    const STARTUP_FILE = "";
    const CLICK_FILE = "";
    const SHUTDOWN_FILE = "";

    let ctx = null;

    function getCtx() {
        if (!ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            ctx = new AC();
        }
        if (ctx.state === "suspended") ctx.resume();
        return ctx;
    }

    function tone(freq, start, dur, type, vol) {
        const c = getCtx();
        if (!c) return;
        const t = c.currentTime + start;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = type || "sine";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(t);
        osc.stop(t + dur + 0.05);
    }

    function playFile(src) {
        const a = new Audio(src);
        a.play().catch(function () {});
    }

    const sfx = {
        click: function () {
            if (CLICK_FILE) return playFile(CLICK_FILE);
            tone(1300, 0, 0.05, "square", 0.04);
        },
        startup: function () {
            if (STARTUP_FILE) return playFile(STARTUP_FILE);
            // rising chime
            [[523, 0], [659, 0.22], [784, 0.44], [1047, 0.66]].forEach(function (n) {
                tone(n[0], n[1], 1.6 - n[1], "sine", 0.1);
                tone(n[0] * 2, n[1], 1.0 - n[1] / 2, "triangle", 0.03);
            });
        },
        shutdown: function () {
            if (SHUTDOWN_FILE) return playFile(SHUTDOWN_FILE);
            // falling chime
            [[1047, 0], [784, 0.25], [659, 0.5], [523, 0.75]].forEach(function (n) {
                tone(n[0], n[1], 1.4, "sine", 0.1);
            });
        }
    };
    window.sfx = sfx;

    // first tap unlocks audio, and plays the startup sound on pages marked data-startup
    let unlocked = false;
    function firstTouch() {
        if (unlocked) return;
        unlocked = true;
        getCtx();
        if (document.body.hasAttribute("data-startup")) sfx.startup();
    }
    document.addEventListener("pointerdown", firstTouch);
    document.addEventListener("keydown", firstTouch);

    // click sound on anything clickable
    document.addEventListener("click", function (e) {
        if (e.target.closest("button, a, summary, .desktop-icon")) {
            if (!document.body.hasAttribute("data-startup") || unlocked) sfx.click();
        }
    });
})();
