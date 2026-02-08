document.addEventListener('DOMContentLoaded', function () {
    console.log('[Header.js] Initializing scroll listener...');

    var nav = document.getElementById('navbar');

    // Fallback if nav is not found immediately (e.g., dynamic loading)
    if (!nav) {
        console.warn('[Header.js] Navbar not found on DOMContentLoaded. Retrying in 500ms...');
        setTimeout(function () {
            nav = document.getElementById('navbar');
            if (nav) initScroll();
        }, 500);
    } else {
        initScroll();
    }

    function initScroll() {
        console.log('[Header.js] Navbar found. Attaching scroll event.');

        function handleScroll() {
            var scrollY = window.scrollY || window.pageYOffset;

            if (scrollY > 40) {
                if (!nav.classList.contains('scrolled')) {
                    nav.classList.add('scrolled');
                    // console.log('Scrolled: ADDED');
                }
            } else {
                if (nav.classList.contains('scrolled')) {
                    nav.classList.remove('scrolled');
                    // console.log('Scrolled: REMOVED');
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Run once on init to catch page refresh state
        handleScroll();
    }
});
