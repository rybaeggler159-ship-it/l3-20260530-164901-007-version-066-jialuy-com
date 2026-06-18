(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var showSlide = function (next) {
      if (!slides.length) {
        return;
      }
      current = (next + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        slide.classList.toggle('active', index === current);
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle('active', index === current);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
  scopes.forEach(function (scope) {
    var input = scope.querySelector('[data-search-input]');
    var buttonWrap = scope.querySelector('[data-filter-buttons]');
    var active = 'all';
    var host = scope.parentElement || document;
    var cards = Array.prototype.slice.call(host.querySelectorAll('[data-movie-card]'));
    var apply = function () {
      var term = input ? input.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-genre') || ''
        ].join(' ').toLowerCase();
        var cat = card.getAttribute('data-category') || '';
        var matchedText = !term || text.indexOf(term) !== -1;
        var matchedCat = active === 'all' || cat === active;
        card.hidden = !(matchedText && matchedCat);
      });
    };
    if (input) {
      input.addEventListener('input', apply);
    }
    if (buttonWrap) {
      buttonWrap.addEventListener('click', function (event) {
        var target = event.target.closest('[data-filter-value]');
        if (!target) {
          return;
        }
        active = target.getAttribute('data-filter-value') || 'all';
        Array.prototype.slice.call(buttonWrap.querySelectorAll('[data-filter-value]')).forEach(function (btn) {
          btn.classList.toggle('active', btn === target);
        });
        apply();
      });
    }
  });
})();
