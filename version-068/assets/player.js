import { H as Hls } from './hls-dru42stk.js';

(function () {
  function bindPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.player-start');
    var src = shell.getAttribute('data-video-src');
    var ready = false;
    var hls = null;

    if (!video || !src) {
      return;
    }

    function requestPlay() {
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    function load() {
      if (ready) {
        requestPlay();
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', requestPlay, { once: true });
      } else if (Hls && Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, requestPlay);
        shell._hls = hls;
      } else {
        video.src = src;
        video.addEventListener('loadedmetadata', requestPlay, { once: true });
      }

      if (button) {
        button.classList.add('hidden');
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        load();
      });
    }

    video.addEventListener('click', load);
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('hidden');
      }
    });
  }

  document.querySelectorAll('.player-shell').forEach(bindPlayer);
})();
