(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-menu]");

    if (menuButton && menu) {
      menuButton.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    var carousel = document.querySelector("[data-hero-carousel]");

    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
      var current = 0;
      var timer = null;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        if (timer || slides.length <= 1) {
          return;
        }
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (!timer) {
          return;
        }
        window.clearInterval(timer);
        timer = null;
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          stop();
          start();
        });
      });

      carousel.addEventListener("mouseenter", stop);
      carousel.addEventListener("mouseleave", start);
      start();
    }

    function applyFilters(target) {
      if (!target) {
        return;
      }

      var input = document.querySelector('[data-search-input][data-target="#' + target.id + '"]');
      var activeButton = document.querySelector('[data-filter-button].is-active[data-target="#' + target.id + '"]');
      var query = input ? input.value.trim().toLowerCase() : "";
      var filter = activeButton ? activeButton.getAttribute("data-filter-value") : "all";
      var cards = Array.prototype.slice.call(target.querySelectorAll("[data-movie-card]"));

      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.textContent
        ].join(" ").toLowerCase();
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchFilter = filter === "all" || text.indexOf(filter.toLowerCase()) !== -1;
        card.hidden = !(matchQuery && matchFilter);
      });
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-search-input]")).forEach(function (input) {
      var target = document.querySelector(input.getAttribute("data-target"));
      input.addEventListener("input", function () {
        applyFilters(target);
      });
    });

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-button]")).forEach(function (button) {
      button.addEventListener("click", function () {
        var target = document.querySelector(button.getAttribute("data-target"));
        var group = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button][data-target="' + button.getAttribute("data-target") + '"]'));
        group.forEach(function (item) {
          item.classList.remove("is-active");
        });
        button.classList.add("is-active");
        applyFilters(target);
      });
    });
  });
})();
