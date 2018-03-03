if (typeof jQuery === 'undefined') {
    throw new Error('Auto animation\'s JavaScript requires jQuery. jQuery must be included before Auto animation\'s JavaScript.')
}
(function($){
/**
* Tests if a node is positioned within the current viewport.
* It does not test any other type of "visibility", like css display,
* opacity, presence in the dom, etc - it only considers position.
*
* By default, it tests if at least 1 pixel is showing, regardless of
* orientation - however an optional argument is accepted, a callback
* that is passed the number of pixels visible on each edge - the return
* (true of false) of that callback is used instead.
*/
$.fn.isOnScreen = function(test){
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

    if(typeof test == 'function') {
        return test(showing);
    }

    return showing.top > 0
    && showing.left > 0
    && showing.right > 0
    && showing.bottom > 0;
};

$.fn.autoAnimate = function(options) {
    var animate = function (elements) {
        $(elements).each(function(index){
            var animateClass = $(this).data('animation-class') + ' animated';
            var animateDuration = $(this).data('animation-duration');
            // element is on the screen
            if ($(this).isOnScreen()) {
                // run animate when element shows up on current screen
                $(this).addClass(animateClass);
            } else {
                // element not on the screen
                // clear animate when element leave the current screen
                $(this).removeClass(animateClass);
            }
        });
    }

    // get all elements have animation class attribute
    var elements = $(this).find('*').filter(function(){
        var result = [],
            self = this,
            regex = new RegExp("data-animation-class");
        $.each(this.attributes, function(){
            if (regex.test(this.name)) {
                result.push(self);
            }
        });
        return result;
    });

    var self = this;

    // use underscore's throttle function
    // limit the max excution times of the scroll events triggered per second
    function throttle(elements, fn, wait) {
        var time = Date.now();
        return function() {
            if ((time + wait - Date.now()) < 0) {
                fn(elements);
                time = Date.now();
            }
        }
    }

    $(window).scroll(throttle(elements, animate, 200));
    return this;
};
}(jQuery));