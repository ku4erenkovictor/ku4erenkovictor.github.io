/*
 * Custom scripts
 */

(function ($) {

    scrollClickMouseLink();
    initMobileNav();
    initPopups();
    initAccordion();
    validatePopupForm();
    initStickyScrollBlock();
    // initSendTicket();
    initBrowserDetect(false, true);

})(jQuery);

function scrollClickMouseLink() {
    var mouseLink = $('.mouse__link');
    if (mouseLink.length > 0) {
        mouseLink.click(function (e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(".home-services").offset().top
            }, 2000);
        });
    }
}

function validatePopupForm() {
    initValidation({
        form: '.popap-form form'
    });
    initValidation({
        form: '.footer-info-top__column.callback form',
    });
    initValidation({
        form: '#form-question',
    });
}


$('.head-slider').slick({
    infinite: true,
    dots: true,
    arrows: false,
    autoplay: true,
    vertical: true,
    adaptiveHeight: true,
    verticalSwiping: true
});

$('.home-news-inner').slick({
    infinite: true,
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
    {
        breakpoint: 1140,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 2
        }
    },
    {
        breakpoint: 575,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
    }
    ]
});

window.addEventListener('DOMContentLoaded', function () {

    setTimeout(function () {
        $('.home-gallery-inner').masonry({
            columnWidth: '.home-gallery__item',
            itemSelector: '.home-gallery__item',
            percentPosition: true,
                // gutter: 10,
                horizontalOrder: false
            });
        $('.masonry').masonry({
            columnWidth: '.masonry__item',
            itemSelector: '.masonry__item'
        });
    }, 50);


});

(function () {
    var activeWidth = document.body.clientWidth,
    status = false;
    if (activeWidth < 767) {
        status = true;
    }
    add(status);
    function add(status) {
        if (status) {
            setTimeout(function () {
                $('.home-gallery-inner').masonry({
                    columnWidth: '.home-gallery__item',
                    itemSelector: '.home-gallery__item',
                    percentPosition: true,
                    horizontalOrder: false
                });
            }, 1000)
        }
    }
})();

// mobile menu init
function initMobileNav() {
    ResponsiveHelper.addRange({
        '..1023': {
            on: function () {
                jQuery('.header-top').mobileNav({
                    menuActiveClass: 'nav-active',
                    menuOpener: '.mobi-arrows__item'
                });
            },
            off: function () {
                jQuery('.header-top').mobileNav('destroy');
            }
        }
    });
}

// popups init
function initPopups() {
    ResponsiveHelper.addRange({
        '320..': {
            on: function () {
                jQuery('.overlay').contentPopup({
                    mode: 'click',
                    popup: '.popap-form',
                    btnOpen: '.sign-up',
                    btnClose: '.popap-form__close',
                    openClass: 'overlay-active',
                    hideOnClickLink: 'overlay-active'
                });
            },
            off: function () {
                jQuery('.overlay').contentPopup('destroy');
            }
        }
    });
}

tabs('.tabs', '.tabs-list__link');

// accordion menu init
function initAccordion() {
    jQuery('.service-block').slideAccordion({
        opener: '.service-block__link',
        slider: '.service-block__description',
        animSpeed: 300
    });
}

function initSendTicket() {
    jQuery('.callback__field button').click(function () {
        jQuery.post(
            'process-message.html',
            {
                phone: jQuery('.callback__field_greed input').val(),
                token: jQuery('.callback__field input[name=token]').val()
            }
            ).done(function (data) {
                alert(data);
                jQuery('.callback__field_greed input').val('');
            });
            return false;
        });

    jQuery('.popap-form__field_btn button').click(function () {
        jQuery.post(
            'process-message.html',
            {
                phone: jQuery('.popap-form__field_input input[name=phone]').val(),
                name: jQuery('.popap-form__field_input input[name=name]').val(),
                token: jQuery('.popap-form__field_btn input[name=token]').val()
            }
            ).done(function (data) {
                if (data == '10') {
                    jQuery('.popap-form').html('<h2 class="popap-form__title">Спасибо. Мы Вам перезвоним!</h2><span class="popap-form__close icon-cancel"></span>');
                    initPopups();
                }
                else {
                    jQuery('.popap-form h2').html(data);
                }
            });
            return false;
        });
}