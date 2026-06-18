(function () {
  var navButton = document.querySelector("[data-nav-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (navButton && mobileNav) {
    navButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  document.querySelectorAll("[data-search-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      var input = form.querySelector("input[name='q']");
      if (!input) {
        return;
      }
      var value = input.value.trim();
      if (value) {
        event.preventDefault();
        window.location.href = "search.html?q=" + encodeURIComponent(value);
      }
    });
  });

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var thumbs = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-thumb]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
      thumbs.forEach(function (thumb, i) {
        thumb.classList.toggle("active", i === current);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        startTimer();
      });
    });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        showSlide(Number(thumb.getAttribute("data-hero-thumb")) || 0);
        startTimer();
      });
    });

    hero.addEventListener("mouseenter", stopTimer);
    hero.addEventListener("mouseleave", startTimer);
    showSlide(0);
    startTimer();
  }

  var filterList = document.querySelector("[data-filter-list]");
  var pageSearch = document.querySelector("[data-page-search]");
  var regionFilter = document.querySelector("[data-filter-region]");
  var typeFilter = document.querySelector("[data-filter-type]");
  var yearFilter = document.querySelector("[data-filter-year]");
  var result = document.querySelector("[data-filter-result]");

  if (filterList) {
    var cards = Array.prototype.slice.call(filterList.querySelectorAll(".movie-card"));

    function fillSelect(select, values) {
      if (!select) {
        return;
      }
      values.forEach(function (value) {
        if (!value) {
          return;
        }
        var option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    }

    function uniqueValues(name) {
      var map = {};
      cards.forEach(function (card) {
        var value = card.getAttribute(name) || "";
        if (value) {
          map[value] = true;
        }
      });
      return Object.keys(map).sort(function (a, b) {
        return a.localeCompare(b, "zh-CN");
      });
    }

    function setInitialQuery() {
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");
      if (query && pageSearch) {
        pageSearch.value = query;
      }
    }

    function applyFilters() {
      var query = pageSearch ? pageSearch.value.trim().toLowerCase() : "";
      var region = regionFilter ? regionFilter.value : "";
      var type = typeFilter ? typeFilter.value : "";
      var year = yearFilter ? yearFilter.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var content = (card.getAttribute("data-search") || "").toLowerCase();
        var matchesQuery = !query || content.indexOf(query) !== -1;
        var matchesRegion = !region || card.getAttribute("data-region") === region;
        var matchesType = !type || card.getAttribute("data-type") === type;
        var matchesYear = !year || card.getAttribute("data-year") === year;
        var isVisible = matchesQuery && matchesRegion && matchesType && matchesYear;

        card.classList.toggle("is-hidden", !isVisible);
        if (isVisible) {
          visible += 1;
        }
      });

      if (result) {
        result.textContent = visible > 0 ? "匹配到 " + visible + " 部影片" : "未找到匹配影片";
      }
    }

    fillSelect(regionFilter, uniqueValues("data-region"));
    fillSelect(typeFilter, uniqueValues("data-type"));
    fillSelect(yearFilter, uniqueValues("data-year").sort().reverse());
    setInitialQuery();

    [pageSearch, regionFilter, typeFilter, yearFilter].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });

    applyFilters();
  }
})();
