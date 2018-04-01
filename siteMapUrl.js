// Modify this value to point to your own site map;
const siteMapUrl = 'site/sitemap.json';

/**===========================================================================
 * Do not modify after this line
 * ===========================================================================*/
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = siteMapUrl;
} else {
    if (typeof define === 'function' && define.amd) {
        define([], () => {
            return siteMapUrl;
        });
    } else {
        window.siteMapUrl = siteMapUrl;
    }
}