(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(text) {
    return String(text || '').toLowerCase().trim();
  }

  function setupHeader() {
    var menuButton = document.querySelector('[data-mobile-menu]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    var searchButton = document.querySelector('[data-search-toggle]');
    var searchPanel = document.querySelector('[data-header-search]');

    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    if (searchButton && searchPanel) {
      searchButton.addEventListener('click', function () {
        searchPanel.classList.toggle('is-open');
        var input = searchPanel.querySelector('input');
        if (input) {
          input.focus();
        }
      });
    }
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = selectAll('.hero-slide', hero);
    var dots = selectAll('.hero-dot', hero);
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }

  function setupFilters() {
    var panels = selectAll('[data-filter-panel]');

    panels.forEach(function (panel) {
      var input = panel.querySelector('[data-filter-input]');
      var category = panel.querySelector('[data-filter-category]');
      var year = panel.querySelector('[data-filter-year]');
      var cards = selectAll('.movie-card[data-search]', document);
      var empty = document.querySelector('[data-empty-state]');

      function apply() {
        var q = normalize(input ? input.value : '');
        var categoryValue = category ? category.value : '';
        var yearValue = year ? year.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute('data-search'));
          var cardCategory = card.getAttribute('data-category') || '';
          var cardYear = card.getAttribute('data-year') || '';
          var matchedText = !q || haystack.indexOf(q) !== -1;
          var matchedCategory = !categoryValue || cardCategory === categoryValue;
          var matchedYear = !yearValue || cardYear === yearValue;
          var matched = matchedText && matchedCategory && matchedYear;
          card.classList.toggle('hidden-by-filter', !matched);
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      if (input) {
        input.addEventListener('input', apply);
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');
        if (initialQuery) {
          input.value = initialQuery;
        }
      }
      if (category) {
        category.addEventListener('change', apply);
      }
      if (year) {
        year.addEventListener('change', apply);
      }
      apply();
    });
  }

  window.initializeMoviePlayer = function (videoId, coverId, buttonId, messageId, videoUrl) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var button = document.getElementById(buttonId);
    var message = document.getElementById(messageId);
    var hlsInstance = null;
    var ready = false;

    function showMessage(text) {
      if (message) {
        message.textContent = text;
        message.classList.add('is-visible');
      }
    }

    function prepare() {
      if (ready || !video) {
        return;
      }
      ready = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(videoUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          } else {
            showMessage('视频加载失败，请刷新页面重试');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
      } else {
        showMessage('视频加载失败，请更换浏览器重试');
      }
    }

    function start() {
      prepare();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var playAction = video.play();
      if (playAction && playAction.catch) {
        playAction.catch(function () {
          showMessage('点击视频区域即可继续播放');
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', start);
    }
    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        start();
      });
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupHeader();
    setupHero();
    setupFilters();
  });
})();
