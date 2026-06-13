(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('.site-search').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                if (input) {
                    input.focus();
                }
            }
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var activate = function (index) {
            current = index;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
            var active = slides[index];
            var poster = document.querySelector('[data-hero-poster]');
            var title = document.querySelector('[data-hero-title]');
            var line = document.querySelector('[data-hero-line]');
            var link = document.querySelector('[data-hero-link]');
            var category = document.querySelector('[data-hero-category]');
            if (active) {
                if (poster) {
                    poster.setAttribute('src', active.getAttribute('data-poster'));
                    poster.setAttribute('alt', active.getAttribute('data-title'));
                }
                if (title) {
                    title.textContent = active.getAttribute('data-title');
                }
                if (line) {
                    line.textContent = active.getAttribute('data-line');
                }
                if (link) {
                    link.setAttribute('href', active.getAttribute('data-url'));
                }
                if (category) {
                    category.setAttribute('href', active.getAttribute('data-category-url'));
                    category.textContent = active.getAttribute('data-category-name');
                }
            }
        };
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                activate(i);
            });
        });
        if (slides.length > 1) {
            setInterval(function () {
                activate((current + 1) % slides.length);
            }, 5200);
        }
        activate(0);
    }

    var filterPanel = document.querySelector('[data-filter-panel]');
    if (filterPanel) {
        var input = filterPanel.querySelector('[data-filter-input]');
        var typeSelect = filterPanel.querySelector('[data-filter-type]');
        var regionSelect = filterPanel.querySelector('[data-filter-region]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
        var empty = document.querySelector('[data-empty-result]');
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        if (input && initialQuery) {
            input.value = initialQuery;
        }
        var apply = function () {
            var q = input ? input.value.trim().toLowerCase() : '';
            var type = typeSelect ? typeSelect.value : '';
            var region = regionSelect ? regionSelect.value : '';
            var shown = 0;
            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-search') || '').toLowerCase();
                var matchText = !q || haystack.indexOf(q) !== -1;
                var matchType = !type || card.getAttribute('data-type') === type;
                var matchRegion = !region || (card.getAttribute('data-region') || '').indexOf(region) !== -1;
                var ok = matchText && matchType && matchRegion;
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    shown += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', shown === 0);
            }
        };
        [input, typeSelect, regionSelect].forEach(function (el) {
            if (el) {
                el.addEventListener('input', apply);
                el.addEventListener('change', apply);
            }
        });
        apply();
    }
})();
