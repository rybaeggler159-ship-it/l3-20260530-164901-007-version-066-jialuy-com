function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
}

function initMobileMenu() {
    var button = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (!button || !panel) {
        return;
    }
    button.addEventListener('click', function () {
        panel.classList.toggle('open');
    });
}

function initHero() {
    var slides = selectAll('[data-hero-slide]');
    var dots = selectAll('[data-hero-dot]');
    if (!slides.length || !dots.length) {
        return;
    }
    var current = 0;
    var timer = null;
    function show(index) {
        current = index;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === index);
        });
    }
    function next() {
        show((current + 1) % slides.length);
    }
    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            show(index);
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(next, 5200);
        });
    });
    timer = window.setInterval(next, 5200);
}

function initFilters() {
    selectAll('.filter-search').forEach(function (input) {
        var section = input.closest('section') || document;
        var cards = selectAll('.movie-card', section);
        input.addEventListener('input', function () {
            var value = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-region')
                ].join(' ').toLowerCase();
                card.classList.toggle('hidden-card', value && haystack.indexOf(value) === -1);
            });
        });
    });
}

function initGlobalSearch() {
    var form = document.querySelector('.global-search');
    if (!form || !window.MovieSearchItems) {
        return;
    }
    var input = form.querySelector('input');
    var results = form.querySelector('.search-results');
    function render() {
        var value = input.value.trim().toLowerCase();
        if (!value) {
            results.classList.remove('open');
            results.innerHTML = '';
            return;
        }
        var matched = window.MovieSearchItems.filter(function (item) {
            return [item.title, item.year, item.genre, item.region].join(' ').toLowerCase().indexOf(value) !== -1;
        }).slice(0, 12);
        results.innerHTML = matched.map(function (item) {
            return '<a href="' + item.url + '"><span>' + item.title + '<small> · ' + item.genre + '</small></span><small>' + item.year + '</small></a>';
        }).join('');
        results.classList.toggle('open', matched.length > 0);
    }
    input.addEventListener('input', render);
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        render();
    });
}

function initMoviePlayer(url) {
    var video = document.getElementById('moviePlayer');
    var button = document.getElementById('moviePlayButton');
    if (!video || !button || !url) {
        return;
    }
    var loaded = false;
    function start() {
        if (!loaded) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
            loaded = true;
        }
        button.classList.add('hidden');
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }
    button.addEventListener('click', start);
    video.addEventListener('click', function () {
        if (!loaded) {
            start();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHero();
    initFilters();
    initGlobalSearch();
});
