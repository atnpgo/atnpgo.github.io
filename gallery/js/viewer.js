/*
 * _____/\\\\\\\\\_____/\\\\\\\\\\\\\\\__/\\\\\_____/\\\__/\\\\\\\\\\\\\_______/\\\\\\\\\\\\_______/\\\\\______        
 *  ___/\\\\\\\\\\\\\__\///////\\\/////__\/\\\\\\___\/\\\_\/\\\/////////\\\___/\\\//////////______/\\\///\\\____       
 *   __/\\\/////////\\\_______\/\\\_______\/\\\/\\\__\/\\\_\/\\\_______\/\\\__/\\\_______________/\\\/__\///\\\__      
 *    _\/\\\_______\/\\\_______\/\\\_______\/\\\//\\\_\/\\\_\/\\\\\\\\\\\\\/__\/\\\____/\\\\\\\__/\\\______\//\\\_     
 *     _\/\\\\\\\\\\\\\\\_______\/\\\_______\/\\\\//\\\\/\\\_\/\\\/////////____\/\\\___\/////\\\_\/\\\_______\/\\\_    
 *      _\/\\\/////////\\\_______\/\\\_______\/\\\_\//\\\/\\\_\/\\\_____________\/\\\_______\/\\\_\//\\\______/\\\__   
 *       _\/\\\_______\/\\\_______\/\\\_______\/\\\__\//\\\\\\_\/\\\_____________\/\\\_______\/\\\__\///\\\__/\\\____  
 *        _\/\\\_______\/\\\_______\/\\\_______\/\\\___\//\\\\\_\/\\\_____________\//\\\\\\\\\\\\/_____\///\\\\\/_____ 
 *         _\///________\///________\///________\///_____\/////__\///_______________\////////////_________\/////_______
 */

/* global lightbox, Promise */

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

lightbox.option({
    resizeDuration: 200,
    onNavigate: function (index) {

        if ($('.lb-image').height() < $(window).innerHeight() - 80) {
            $('.lb-image').css('height', $(window).innerHeight() - 80);
            $('.lb-image').css('width', '');
            setTimeout(function () {
                $('.lb-outerContainer').css('height', $(window).innerHeight() - 90);
            }, 400);


            if ($('.lb-image').width() > $(window).innerWidth() - 80) {
                $('.lb-image').css('max-width', $(window).innerWidth() - 80);
                $('.lb-image').css('height', '');
            }
        }



        if (index === $('.card').length - 1) {
            app.loadPage(true);
        }
    }
});
var app = {
    content: $('#content'),
    subreddit: null,
    token: null,
    loading: false,
    showInterval: null,
    cardTemplate: Handlebars.compile('<div class="col-6 col-md-4 col-lg-3 card" style="align-items: center;justify-content: center;"><a href="{{url}}" data-lightbox="gallery" data-title="{{title}}"><img class="img-fluid" alt="{{title}}" src="{{url}}"><p class="card-text" style="text-align: center;">{{title}}</p></a></div>'),
    isValidLink: function (link) {

        if (link.toLowerCase().endsWith('.gifv') || link.toLowerCase().endsWith('.html') || link.toLowerCase().endsWith('.htm')) {
            return false;
        } else if (link.toLowerCase().startsWith('https://gfycat.com/')) {
            return false;
        } else if (link.toLowerCase().startsWith('https://www.youtube.com/')) {
            return false;
        } else if (link.toLowerCase().startsWith('https://twitter.com/')) {
            return false;
        } else if (!(link.toLowerCase().startsWith('https:') || link.toLowerCase().startsWith('http:'))) {
            return false;
        }
        return true;
    },
    getImgurImg: function (url, callback) {

        var id = url.substring(url.lastIndexOf('/') + 1);
        if (id.lastIndexOf('.') > -1) {
            id = id.substring(0, id.lastIndexOf('.'));
        }
        $.getJSON('https://api.imgur.com/3/image/' + id, function (data) {
            callback(data.data.link);
        }).fail(function () {
            $.getJSON('https://api.imgur.com/3/gallery/' + id, function (data) {
                callback(data.data.images[0].link);
            }).fail(function () {
                callback(url);
            });
        });
    },
    extractImageUrl: function (url, callback) {
        $.get(url, function (data) {
            try {
                var $dom = $(data);
                callback($dom.find('img').first().attr('src'));
            } catch (ex) {
                console.log(url);
            }

        }).fail(function () {
            callback(null);
        });
    },
    fixImageUrl: function (source, callback) {
        var target = source;
        if (!(target.toLowerCase().endsWith('.png')
                || target.toLowerCase().endsWith('.jpg')
                || target.toLowerCase().endsWith('.jpeg')
                || target.toLowerCase().endsWith('.jfif')
                || target.toLowerCase().endsWith('.jfi')
                || target.toLowerCase().endsWith('.gif'))) {
            if (target.indexOf('imgur.com') !== -1) {
                if (target.charAt(target.length - 2) !== '?') {
                    app.getImgurImg(target, function (url) {
                        callback(url);
                    });
                } else {
                    callback(target);
                }

            } else if (target.indexOf('flickr.com') !== -1) {
                app.extractImageUrl(target, function (url) {
                    callback(url);
                });
            } else if (target.startsWith('https://pbs.twimg.com/media/') || target.startsWith('https://i.reddituploads.com/')) {
                callback(target);
            } else if (target.indexOf('.jpg') !== -1 || target.indexOf('.png') !== -1) {
                callback(target);
            } else {
                console.log(target);
                callback(null);
            }
        } else {
            callback(target);
        }
    },
    getPageLinks: function (url, callback, startToken) {
        $.getJSON(url + '.json' + (_.isString(startToken) ? '?after=' + startToken : ''), function (data) {
            var urls = [];
            var promises = [];
            _.each(data.data.children, function (child) {
                promises.push(new Promise(function (resolve) {

                    if (app.isValidLink(child.data.url)) {
                        app.fixImageUrl(child.data.url, function (url) {
                            if (_.isNull(url)) {
                                resolve(url);
                            } else {
                                resolve({
                                    title: child.data.title,
                                    url: url
                                });
                            }
                        });
                    } else {
                        resolve(null);
                    }
                }));
            });
            Promise.all(promises).then(function (values) {
                _.each(values, function (value) {
                    if (!_.isNull(value)) {
                        urls.push(value);
                    }
                });
                callback(urls, data.data.after);
            });
        });
    },
    onImgError: function () {
        $(this).parents('.card').remove();
        if ($('#lightbox').is(':visible')) {
            lightbox.start($('a[href="' + $('.lb-image').attr('src') + '"]'));
        }

    },
    loadPage: function (autoload) {
        app.loading = true;
        app.getPageLinks('https://www.reddit.com' + app.subreddit, function (links, tok) {
            app.token = tok;
            var $last = $('.card a').last();
            _.each(links, function (link) {
                var $card = $(app.cardTemplate(link));
                $card.find('img').on("error", app.onImgError);
                app.content.append($card);
            });
            if (autoload === true) {
                lightbox.start($last);
            }
            app.loading = false;
        }, app.token);
    },
    startSlideshow: function () {
        if ($('#lightbox').is(':visible')) {
            app.showInterval = setInterval(function () {
                lightbox.changeImage(lightbox.currentImageIndex + 1);
            }, 2500);
        }
    },
    stopSlideshow: function () {
        clearInterval(app.showInterval);
        app.showInterval = null;
    },
    init: function () {
        $('#btn-slideshow').click(function () {
            if (_.isNull(app.showInterval)) {
                app.startSlideshow();
            } else {
                app.stopSlideshow();
            }
        });
        $('#load-subreddit').submit(function (e) {
            e.preventDefault();

            app.token = null;
            app.subreddit = null;
            app.content.empty();

            var sub = $('#load-subreddit').find('input').val();
            if (!sub.startsWith('/r/')) {
                sub = '/r/' + sub;
            }

            if (!sub.endsWith('/')) {
                sub += '/';
            }
            app.subreddit = sub;
            app.loadPage(false);
            $('#btn-slideshow').show();
            $(window).scroll(function () {
                if (($(window).scrollTop() + $(window).height()) > ($(document).height() - $(window).innerHeight()) && !app.loading) {
                    app.loadPage(false);
                }
            });
        });
    }
};
$(document).ready(app.init);