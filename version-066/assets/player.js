(function () {
  window.initMoviePlayer = function (src) {
    var video = document.querySelector("[data-movie-video]");
    var cover = document.querySelector("[data-player-cover]");
    var button = document.querySelector("[data-play-button]");
    var hlsInstance = null;
    var mounted = false;

    if (!video || !src) {
      return;
    }

    function mount() {
      if (mounted) {
        return;
      }
      mounted = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
      } else {
        video.src = src;
      }
    }

    function hideCover() {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    }

    function play() {
      mount();
      hideCover();
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", play);
    }

    if (cover) {
      cover.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", hideCover);

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
