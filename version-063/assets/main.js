(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-main-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var card = hero.querySelector('[data-hero-card]');
    var image = hero.querySelector('[data-hero-image]');
    var title = hero.querySelector('[data-hero-title]');
    var text = hero.querySelector('[data-hero-text]');
    var genre = hero.querySelector('[data-hero-genre]');
    var year = hero.querySelector('[data-hero-year]');
    var link = hero.querySelector('[data-hero-link]');
    var thumbs = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-thumb]'));
    if (!card || !image || !title || !text || !genre || !year || !link || thumbs.length === 0) {
      return;
    }
    var active = 0;
    var apply = function (index) {
      active = index;
      var item = thumbs[index];
      image.src = item.getAttribute('data-image');
      image.alt = item.getAttribute('data-title');
      title.textContent = item.getAttribute('data-title');
      text.textContent = item.getAttribute('data-text');
      genre.textContent = item.getAttribute('data-genre');
      year.textContent = item.getAttribute('data-year');
      link.href = item.getAttribute('href');
      card.href = item.getAttribute('href');
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle('is-active', thumbIndex === index);
      });
    };
    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('mouseenter', function () {
        apply(index);
      });
      thumb.addEventListener('focus', function () {
        apply(index);
      });
    });
    window.setInterval(function () {
      apply((active + 1) % thumbs.length);
    }, 5200);
  }

  function setupFiltering() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function (scope) {
      var input = scope.querySelector('[data-search-input]');
      var select = scope.querySelector('[data-filter-select]');
      var empty = scope.querySelector('[data-empty-message]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
      var run = function () {
        var query = input ? input.value.trim().toLowerCase() : '';
        var selected = select ? select.value : '';
        var shown = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-search') || '').toLowerCase();
          var genre = card.getAttribute('data-genre') || '';
          var passQuery = !query || text.indexOf(query) !== -1;
          var passGenre = !selected || genre.indexOf(selected) !== -1;
          var visible = passQuery && passGenre;
          card.classList.toggle('hidden', !visible);
          if (visible) {
            shown += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', shown === 0);
        }
      };
      if (input) {
        input.addEventListener('input', run);
      }
      if (select) {
        select.addEventListener('change', run);
      }
    });
  }

  function setupPlayer() {
    var box = document.querySelector('[data-player]');
    if (!box) {
      return;
    }
    var video = box.querySelector('video');
    var overlay = box.querySelector('.player-overlay');
    var src = box.getAttribute('data-src');
    var hlsInstance = null;
    if (!video || !src) {
      return;
    }
    var attach = function () {
      if (video.getAttribute('data-ready') === '1') {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
      } else {
        video.src = src;
      }
      video.setAttribute('data-ready', '1');
    };
    var play = function () {
      attach();
      video.controls = true;
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    };
    if (overlay) {
      overlay.addEventListener('click', play);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    setupNavigation();
    setupHero();
    setupFiltering();
    setupPlayer();
  });
})();
