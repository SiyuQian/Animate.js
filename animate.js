/**
 * Animate.js - JavaScript plugin for animate integration by using animate.css
 */
if (typeof jQuery === 'undefined') {
    throw new Error('Auto animation\'s JavaScript requires jQuery. jQuery must be included before Auto animation\'s JavaScript.')
}

(function($){
    "use strict";

    const defaults = {
        wait: 200,
        selector: '[data-animation-class]'
    };

    function Animate(options) {
        this.settings = extend(defaults, options || {});
        this.elements = document.querySelectorAll(this.settings.selector);
        this.observer = null;
        this.init();
    }

    /**
    * Merge two or more objects. Returns a new object.
    * @private
    * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
    * @param {Object}   objects  The objects to merge together
    * @returns {Object}          Merged values of defaults and options
    */
    const extend = function ()  {
        let extended = {};
        let deep = false;
        let i = 0;
        let length = arguments.length;
        /* Check if a deep merge */
        if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
            deep = arguments[0];
            i++;
        }
        /* Merge the object into the extended object */
        let merge = function (obj) {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    /* If deep merge and property is an object, merge properties */
                    if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };
        /* Loop through each object and conduct a merge */
        for (; i < length; i++) {
            let obj = arguments[i];
            merge(obj);
        }
        return extended;
    };

    Animate.prototype = {
        init: function() {
            let self = this;
            // Browser does not support the observer object
            if (!IntersectionObserver) {
                return this;
            }

            this.observer = new IntersectionObserver(function(entries){
                console.log('xxxxx');
            });

            this.elements.forEach(function(element) {
                self.observer.observe(element);
            });
        },
        addAnimateClass: function (object) {
            const compulsory = 'animated';
            var animateClass = $(object).data('animation-class');
            var animateDuration = $(object).data('animation-duration');
            // element is on the screen
            if ($(object).isOnScreen()) {
                // run animate when element shows up on current screen
                $(object).addClass(animateClass);
            } else {
                // element not on the screen
                // clear animate when element leave the current screen
                $(object).removeClass(animateClass);
            }
        },
        isOnScreen: function() {
            var height = this.outerHeight();
            var width = this.outerWidth();

            if(!width || !height){
                return false;
            }

            var win = $(window);

            var viewport = {
                top : win.scrollTop(),
                left : win.scrollLeft()
            };

            viewport.right = viewport.left + win.width();
            viewport.bottom = viewport.top + win.height();

            var bounds = this.offset();
            bounds.right = bounds.left + width;
            bounds.bottom = bounds.top + height;

            var showing = {
                top : viewport.bottom - bounds.top,
                left: viewport.right - bounds.left,
                bottom: bounds.bottom - viewport.top,
                right: bounds.right - viewport.left
            };

            if (typeof test == 'function') {
                return test(showing);
            }

            return showing.top > 0
            && showing.left > 0
            && showing.right > 0
            && showing.bottom > 0;
        }
    };

    if (jQuery) {
        const $ = jQuery;
        $.fn.animate = function (options) {
            options = options || {};
            options.selector = options.selector || "[data-animation-class]";
            new Animate(options);
            return this;
        };
    }
}(jQuery));