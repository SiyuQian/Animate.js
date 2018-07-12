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
        selector: '[data-animate]'
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
                entries.forEach(function(entry) {
                    if (entry.intersectionRatio > 0) {
                        // Load Animate
                        self.animate(entry.target);
                        // Unobserve the item
                        self.observer.unobserve(entry.target);
                    }
                });
            });

            this.elements.forEach(function(element) {
                self.observer.observe(element);
            });
        },
        animate: function(element) {
            // required class
            element.classList.add('animated');
            element.classList.add(element.dataset.animate);
            element.style.WebkitTransition = element.dataset.duration;
            element.style.MozTransition = element.dataset.duration;
        }
    };

    if (jQuery) {
        const $ = jQuery;
        $.fn.animate = function (options) {
            options = options || {};
            options.selector = options.selector || "[data-animate]";
            new Animate(options);
            return this;
        };
    }
}(jQuery));