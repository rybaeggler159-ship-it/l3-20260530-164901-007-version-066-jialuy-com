(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");

        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var current = 0;
            var timer = null;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === current);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    show(Number(dot.getAttribute("data-hero-dot")) || 0);
                    start();
                });
            });

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    start();
                });
            }

            hero.addEventListener("mouseenter", stop);
            hero.addEventListener("mouseleave", start);
            start();
        }

        var searchInput = document.querySelector("[data-search-input]");
        var filterGrid = document.querySelector("[data-filter-grid]");

        if (searchInput && filterGrid) {
            var cards = Array.prototype.slice.call(filterGrid.querySelectorAll("[data-filter-card]"));
            var countTarget = document.querySelector("[data-visible-count]");
            var noResults = document.querySelector("[data-no-results]");
            var regionFilter = document.querySelector("[data-filter-region]");
            var typeFilter = document.querySelector("[data-filter-type]");
            var yearFilter = document.querySelector("[data-filter-year]");

            function normalize(value) {
                return String(value || "").trim().toLowerCase();
            }

            function applyFilters() {
                var query = normalize(searchInput.value);
                var region = normalize(regionFilter && regionFilter.value);
                var type = normalize(typeFilter && typeFilter.value);
                var year = normalize(yearFilter && yearFilter.value);
                var visible = 0;

                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags")
                    ].join(" "));
                    var matched = true;

                    if (query && text.indexOf(query) === -1) {
                        matched = false;
                    }
                    if (region && normalize(card.getAttribute("data-region")) !== region) {
                        matched = false;
                    }
                    if (type && normalize(card.getAttribute("data-type")) !== type) {
                        matched = false;
                    }
                    if (year && normalize(card.getAttribute("data-year")) !== year) {
                        matched = false;
                    }

                    card.classList.toggle("is-hidden", !matched);
                    if (matched) {
                        visible += 1;
                    }
                });

                if (countTarget) {
                    countTarget.textContent = visible;
                }
                if (noResults) {
                    noResults.classList.toggle("is-visible", visible === 0);
                }
            }

            [searchInput, regionFilter, typeFilter, yearFilter].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", applyFilters);
                    control.addEventListener("change", applyFilters);
                }
            });
        }
    });
})();
