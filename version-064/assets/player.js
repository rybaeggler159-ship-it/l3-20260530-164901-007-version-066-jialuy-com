(function (global) {
  global.setupPlayer = function (videoId, layerId, source) {
    var video = document.getElementById(videoId);
    var layer = document.getElementById(layerId);
    if (!video || !source) {
      return;
    }
    var ready = false;
    var hls = null;
    var attach = function () {
      if (ready) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (global.Hls && global.Hls.isSupported()) {
        hls = new global.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    };
    var start = function () {
      attach();
      if (layer) {
        layer.classList.add('is-hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    };
    if (layer) {
      layer.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      if (layer) {
        layer.classList.add('is-hidden');
      }
    });
    global.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})(window);
