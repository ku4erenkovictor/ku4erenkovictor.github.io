;
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
    var CountTo = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, CountTo.DEFAULTS, this.dataOptions(), options);
        this.init();
    };
    CountTo.DEFAULTS = {
        from: 0,
        to: 0,
        speed: 1000,
        refreshInterval: 100,
        decimals: 0,
        formatter: formatter,
        onUpdate: null,
        onComplete: null
    };
    CountTo.prototype.init = function () {
        this.value = this.options.from;
        this.loops = Math.ceil(this.options.speed / this.options.refreshInterval);
        this.loopCount = 0;
        this.increment = (this.options.to - this.options.from) / this.loops;
    };
    CountTo.prototype.dataOptions = function () {
        var options = {
            from: this.$element.data('from'),
            to: this.$element.data('to'),
            speed: this.$element.data('speed'),
            refreshInterval: this.$element.data('refresh-interval'),
            decimals: this.$element.data('decimals')
        };
        var keys = Object.keys(options);
        for (var i in keys) {
            var key = keys[i];
            if (typeof (options[key]) === 'undefined') {
                delete options[key];
            }
        }
        return options;
    };
    CountTo.prototype.update = function () {
        this.value += this.increment;
        this.loopCount++;
        this.render();
        if (typeof (this.options.onUpdate) == 'function') {
            this.options.onUpdate.call(this.$element, this.value);
        }
        if (this.loopCount >= this.loops) {
            clearInterval(this.interval);
            this.value = this.options.to;
            if (typeof (this.options.onComplete) == 'function') {
                this.options.onComplete.call(this.$element, this.value);
            }
        }
    };
    CountTo.prototype.render = function () {
        var formattedValue = this.options.formatter.call(this.$element, this.value, this.options);
        this.$element.text(formattedValue);
    };
    CountTo.prototype.restart = function () {
        this.stop();
        this.init();
        this.start();
    };
    CountTo.prototype.start = function () {
        this.stop();
        this.render();
        this.interval = setInterval(this.update.bind(this), this.options.refreshInterval);
    };
    CountTo.prototype.stop = function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    };
    CountTo.prototype.toggle = function () {
        if (this.interval) {
            this.stop();
        } else {
            this.start();
        }
    };

    function formatter(value, options) {
        return value.toFixed(options.decimals);
    }
    $.fn.countTo = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('countTo');
            var init = !data || typeof (option) === 'object';
            var options = typeof (option) === 'object' ? option : {};
            var method = typeof (option) === 'string' ? option : 'start';
            if (init) {
                if (data) data.stop();
                $this.data('countTo', data = new CountTo(this, options));
            }
            data[method].call(data);
        });
    };
}));

$(document).ready(function () {

    initOpenClose();
    stickyHeader();
    cloneMobile();
    calc();
    moveHexagon();
    initScrollCounter();

    $(".btn").click(function (e) {
        e.preventDefault();
        var n = $(this).parent().find("input.order-call").val();
        return !1 === /^\+38\x20\(\d\d\d\)\x20\d\d\d\-\d\d\-\d\d$/gi.test(n) ? $(this).parent().find("input.order-call").css("color", "red") : $(this).parent().submit(), !1
    });

    $(".order-call").keypress(function (e) {
        var that = $(this);
        var no = numbersonly(this, e);
        if (no == 13) {
            $(".btn").trigger("click");
            return true;
        }
        setTimeout(function () {
            retel(that, no);
        }, 10);
        if (that.val().length >= 19 && no != 8) return false;
        if (no == 8 && that.val().length == 5) return false;
        return no;
    }).bind("focus click", function (e) {
        if ($(this).val().length < 1) $(this).val('+38 (');
    });

    $(".back-to-bottom").on("click", function (e) {
        $("html,body").animate({
            scrollTop: $(".main").offset().top
        }, 500)
    });

    var swiper = new Swiper('.reviews-container', {
        slidesPerView: 1,
        loop: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
    });

    var loadBtn = $('.projects .to-Order .btn'),
        container = $('.projects .projects-content'),
        counter = 1;
    var loadMoreObj = {
        init: function () {
            this.addClicHandler(counter);
        },
        addClicHandler: function (counter) {
            var $this = this;
            loadBtn.on({
                click: function (e) {
                    e.preventDefault();
                    $this.sendGet('/load-more.html?page=' + counter).done(function (resp) {
                        if (!resp.next) {
                            loadBtn.hide();
                        }
                        resp.html.forEach(function (item) {
                            container.append(item);
                        });
                    }).fail(function (resp) {
                        console.log(resp);
                    }).always(function (resp) {
                        container.find('.projects-item').each(function (_, item) {
                                $(item).show();
                            })
                            ++counter;
                    });
                }
            });
        },
        sendGet: function (url) {
            return $.get(url);
        }
    }
    loadMoreObj.init();
});

function initOpenClose() {
    $('.column-grid-row').openClose({
        activeClass: 'active',
        opener: '[data-opener]',
        slider: '[data-slide]',
        animSpeed: 400,
        effect: 'slide'
    });
}

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("back-btn").style.opacity = "1";
    } else {
        document.getElementById("back-btn").style.opacity = "0";
    }
}

function topFunction() {
    $('html, body').stop().animate({
        scrollTop: 0
    }, 500);
}

function stickyHeader() {
    var hs = document.querySelector(".header-inner-static");
    if (!hs) {
        var headroom = new Headroom(document.querySelector(".header-inner"), {
            "tolerance": 5,
            "classes": {
                "initial": "animated",
                "pinned": "slideDown",
                "unpinned": "slideUp"
            },
        });
    } else {
        var headroom = new Headroom(hs, {
            "offset": 139
        });
    }
    headroom.init();
}

function numbersonly(myfield, e) {
    var key;
    var keychar;
    if (window.event) {
        key = window.event.keyCode;
    } else if (e) {
        key = e.which;
    } else {
        return true;
    }
    keychar = String.fromCharCode(key);
    if (iscontrolkey(key)) return key;
    else if ((("0123456789.").indexOf(keychar) > -1)) return true;
    else return false;
}

function iscontrolkey(key) {
    if (key == 13 || key == 36) return true;
    if (key == 8 || key == 117) return 8;
    return false;
}

function retel(input, no) {
    var cv = input.val();
    if (cv.length == 8) cv += ') ';
    if (cv.length == 9) cv = cv.slice(0, -2);
    if ((cv.length == 16 || cv.length == 13) && no) {
        if (no != 8) cv = cv + '-';
        else
            cv = cv.slice(0, -1);
    }
    var nv = "+38 (";
    for (var i = 5; i < cv.length; i++) {
        if (i > 18) break;
        if (i == 8) nv += ')';
        else if (i == 9) {
            nv += ' ';
        } else if (i == 13 || i == 16) {
            nv += '-';
        } else if (("0123456789.").indexOf(cv.charAt(i)) > -1) {
            nv += cv.charAt(i);
        }
    }
    input.val(nv);
}

function calc() {
    var resize = [],
        item = document.querySelector('.header-inner'),
        holder = document.querySelector('.header');
    heightCalc();
    resize.push(heightCalc);

    function heightCalc() {
        var cHeight = $(item).outerHeight();
        $(holder).css({
            height: cHeight
        });
    }
    $(window).on('resize orientationchange', function () {
        resize.forEach(function (fn) {
            fn();
        });
    });
};

function cloneMobile() {
    $('.block-lang').clone().appendTo('.mobile-menu__inner');
    $('.btn-application').clone().appendTo('.mobile-menu__inner');
    $('.header-list').clone().appendTo('.mobile-menu__inner');
    $('.phone').clone().appendTo('.mobile-menu__inner');
}

function moveHexagon() {
    if ('ontouchstart' in window == false) {
        $('body').mousemove(function (e) {
            var moveX = (e.pageX * -1 / 60);
            var moveY = (e.pageY * -1 / 60);
            $('.header-decor')
                .css(
                    'background-position',
                    ''+moveX+'px '+moveY+'px'
                );
        });
    }
}

function createProgressBar() {
    let radius = $(".circle").attr("r");
    let progressbar_length;
    let circumference = (2 * radius * 22 / 7);

    $("circle1").css("stroke-dasharray", "0," + circumference);

    $('.rate').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 2500,
            easing: 'swing',
            step: function (now) {
                let rate = Math.ceil(now);
                progressbar_length = parseInt(circumference * (rate / 100));
                $(".circle").css("stroke-dasharray", progressbar_length + "," + circumference);
                $(this).text(rate);
            }
        });
    });

    function printCounter(elemTag) {
        let elem = elemTag;

        if (elemTag) {
            let number = elem.getAttribute('data-number');
            let index = 0;

            function counter(index) {
                index++;

                setTimeout(
                    function () {
                        index < number ? counter(index) : null;
                        elem.textContent = index
                    }, 2 * index
                )
            }

            counter(index)
        }
    }
    
    printCounter(document.querySelector('.number1'));
    printCounter(document.querySelector('.number2'));
    printCounter(document.querySelector('.number3'));
}

function initScrollCounter() {
    let elem = document.getElementById('progressbar');
    let a = 0;

    if (elem) {
        $(window).on("load scroll", function (event) {
            let oTop = $('.progressbar').offset().top - window.innerHeight;
            if (a === 0 && $(window).scrollTop() > oTop) {
                createProgressBar();
                a = 1;
            }
        });
    }
}