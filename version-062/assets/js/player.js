(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var video = document.querySelector("[data-player-video]");
    var button = document.querySelector("[data-play-button]");

    if (!video) {
      return;
    }

    var stream = video.getAttribute("data-stream");
    var prepared = false;
    var hls = null;
    var requested = false;

    function begin() {
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    function prepare() {
      if (prepared || !stream) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        prepared = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (requested) {
            begin();
          }
        });
        window.addEventListener("pagehide", function () {
          if (hls) {
            hls.destroy();
          }
        });
        prepared = true;
        return;
      }

      video.src = stream;
      prepared = true;
    }

    function play() {
      requested = true;
      prepare();
      begin();
      if (button) {
        button.classList.add("is-hidden");
      }
    }

    prepare();

    if (button) {
      button.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });

    video.addEventListener("pause", function () {
      if (button && video.currentTime === 0) {
        button.classList.remove("is-hidden");
      }
    });
  });
})();
