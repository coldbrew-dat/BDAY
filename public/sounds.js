(function () {
    // Real Windows 98 sound-scheme files.
    const STARTUP_FILE = "/audio/win98-startup.wav";
    const CLICK_FILE = "/audio/win98-click.wav";
    const SHUTDOWN_FILE = "/audio/win98-shutdown.wav";

    function playFile(src) {
        const audio = new Audio(src);
        audio.preload = "auto";
        audio.play().catch(function () {});
    }

    const sfx = {
        click: function () {
            playFile(CLICK_FILE);
        },
        startup: function () {
            playFile(STARTUP_FILE);
        },
        shutdown: function () {
            playFile(SHUTDOWN_FILE);
        }
    };

    window.sfx = sfx;

    // Browsers require the first interaction before audio can play.
    let unlocked = false;
    function firstTouch() {
        if (unlocked) return;
        unlocked = true;
        if (document.body.hasAttribute("data-startup")) sfx.startup();
    }

    document.addEventListener("pointerdown", firstTouch);
    document.addEventListener("keydown", firstTouch);

    // Use the real Windows 98 menu-command sound for interface clicks.
    document.addEventListener("click", function (e) {
        const target = e.target.closest("button, a, summary, .desktop-icon");
        if (!target) return;

        if (target.id === "menuShutdown") {
            sfx.shutdown();
            return;
        }

        if (!document.body.hasAttribute("data-startup") || unlocked) {
            sfx.click();
        }
    });
})();
