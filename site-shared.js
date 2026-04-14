(function () {
    window.trackSiteEvent = function trackSiteEvent(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params || {});
        }
    };

    document.addEventListener(
        'click',
        function (event) {
            var a = event.target.closest && event.target.closest('a[href]');
            if (!a || !a.getAttribute('href')) return;
            var href = a.getAttribute('href');
            if (href === '#' || href === '') return;
            if (href.indexOf('mailto:') === 0) {
                trackSiteEvent('link_click', { link_type: 'mailto', link_url: href });
            } else if (href.indexOf('tel:') === 0) {
                trackSiteEvent('link_click', { link_type: 'tel', link_url: href });
            } else {
                try {
                    var u = new URL(a.href, window.location.href);
                    if (u.origin !== window.location.origin) {
                        trackSiteEvent('outbound_link_click', {
                            link_url: u.href,
                            link_text: (a.textContent || '').trim().slice(0, 120)
                        });
                    } else {
                        trackSiteEvent('link_click', {
                            link_type: 'internal',
                            link_url: u.pathname + u.search + u.hash
                        });
                    }
                } catch (e) {
                    /* ignore invalid href */
                }
            }
        },
        true
    );
})();
