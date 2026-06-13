(function () {
    window.initMoviePlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var trigger = document.getElementById(options.triggerId);
        var shell = document.getElementById(options.shellId);
        var source = options.source;
        var started = false;
        var hls = null;

        if (!video || !source) {
            return;
        }

        var attach = function () {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return Promise.resolve();
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                video._hls = hls;
                return new Promise(function (resolve) {
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        resolve();
                    });
                });
            }
            video.src = source;
            return Promise.resolve();
        };

        var start = function () {
            if (started) {
                video.play();
                return;
            }
            started = true;
            attach().then(function () {
                if (trigger) {
                    trigger.classList.add('is-hidden');
                }
                video.play();
            }).catch(function () {
                if (trigger) {
                    trigger.classList.remove('is-hidden');
                }
                started = false;
            });
        };

        if (trigger) {
            trigger.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                start();
            });
        }

        if (shell) {
            shell.addEventListener('click', function (event) {
                if (!started && event.target !== video) {
                    start();
                }
            });
        }

        video.addEventListener('play', function () {
            if (trigger) {
                trigger.classList.add('is-hidden');
            }
        });
    };
})();
