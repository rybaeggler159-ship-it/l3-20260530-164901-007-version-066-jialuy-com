import { H as Hls } from "./hls-dru42stk.js";

export function initMoviePlayer(source) {
    var video = document.querySelector('[data-player="movie"]');
    var cover = document.querySelector("[data-player-cover]");
    var hls = null;
    var attached = false;
    var ready = false;
    var waitingToPlay = false;

    if (!video || !source) {
        return;
    }

    function playNow() {
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {
                video.controls = true;
            });
        }
    }

    function attachSource() {
        if (attached) {
            return;
        }
        attached = true;
        video.controls = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            ready = true;
            return;
        }

        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                ready = true;
                if (waitingToPlay) {
                    waitingToPlay = false;
                    playNow();
                }
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal || !hls) {
                    return;
                }
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                    return;
                }
                if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                    return;
                }
                hls.destroy();
            });
        }
    }

    function startPlayback() {
        attachSource();
        if (cover) {
            cover.classList.add("is-hidden");
        }
        if (ready || !hls) {
            playNow();
        } else {
            waitingToPlay = true;
        }
    }

    if (cover) {
        cover.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            startPlayback();
        }
    });

    video.addEventListener("play", function () {
        if (cover) {
            cover.classList.add("is-hidden");
        }
    });
}
