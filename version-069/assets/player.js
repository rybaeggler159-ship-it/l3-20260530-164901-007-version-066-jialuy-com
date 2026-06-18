(function () {
  var video = document.querySelector("[data-stream]");
  var button = document.querySelector("[data-play-start]");
  var hls = null;
  var ready = false;

  if (!video) {
    return;
  }

  function hideButton() {
    if (button) {
      button.classList.add("is-hidden");
    }
  }

  function playVideo() {
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  function bindSource() {
    var source = video.getAttribute("data-stream");
    if (!source || ready) {
      return;
    }

    ready = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      playVideo();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        playVideo();
      });
      hls.on(window.Hls.Events.ERROR, function (eventName, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
      playVideo();
      return;
    }

    video.src = source;
    playVideo();
  }

  function start() {
    bindSource();
    hideButton();
    playVideo();
  }

  if (button) {
    button.addEventListener("click", start);
  }

  video.addEventListener("play", hideButton);
  video.addEventListener("playing", hideButton);
  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
