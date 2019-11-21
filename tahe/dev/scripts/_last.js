/*
 * Custom scripts
 */
(function ($) {

    initNav();
    initSlick();
    initValidation({form: '.mailing-form'});
    initValidation({form: '.form'});
    initScrollTop();
    initSkrollr();
    initTabs()
    initOpenClose();
    rspHelper();
    jcf.replaceAll();

})(jQuery);

function initNav() { 
    var mainNav = new MobNav({
        menu: '.box-menu', 
        opener: '.btn-menu',
        activeClass: 'menu-active',
    });
}

function initSlick(){
    $('.menu-gallery').slick({
        dots: true,
        arrows: false,
        slidesToShow: 5,
        slidesToScroll: 5
    });

    $('.banner-gallery').slick({
        dots: true,
        arrows: true,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 4000
    });

    $('.products-gallery').slick({
        dots: true,
        arrows: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    });

    $('.slide-gallery').slick({
        dots: false,
        arrows: false,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 5000,
        infinite: true,
        fade: true,
        cssEase: 'linear'
    });

    $('.product-gallery__hold').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.gallery-thumbnails'
    });

    $('.gallery-thumbnails').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: '.product-gallery__hold',
      dots: false,
      arrows: false,
      centerMode: false,
      focusOnSelect: true
    });
}

function initScrollTop() {

    var btn = document.querySelector('.btn-top');

    if(btn != null){

        winHeight = window.innerHeight;
        window.addEventListener('scroll', setState)

        function setState() {
            if (window.scrollY > winHeight / 2) {
                btn.style.opacity = '1';
            } else if (window.scrollY < winHeight / 2) {
                btn.style.opacity = '0';
            }
        };

        btn.addEventListener('click', function(){
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        });
    }
}

function initSkrollr() {
    window.onload = function() {
        var scrollParallax = skrollr.init(); 
        
        if (scrollParallax.isMobile()) { 
            scrollParallax.destroy();
        }
    }
}

function initTabs() {
    jQuery('.tabs').tabset({
        activeClass: 'active',
        tabLinks: 'a',
        addToParent: true,
        defaultTab: true
    });
}

function initOpenClose() {
    $('.categories').openClose({
        activeClass: '',
        opener: '.categories-title',
        slider: '.categories-list',
        animSpeed: 400,
        effect: 'slide'
    });
}

function rspHelper() {
    ResponsiveHelper.addRange({
        '1024..': {
            on: function () {
                $('.nav').stickyScrollBlock({
                    setBoxHeight: true,
                    activeClass: 'fixed-position',
                    positionType: 'fixed'
                });

                $('.production').openClose("destroy");

                $('.categories-list').removeClass("js-slide-hidden");
            }
        },
        '..1024': {
            on: function () {
                $('.nav').stickyScrollBlock("destroy");
                
                $('.production').openClose({
                    activeClass: 'production-active',
                    opener: '.production-title',
                    slider: '.production-box',
                    animSpeed: 400,
                    effect: 'slide'
                });

                $('.categories-list').addClass("js-slide-hidden");
            }
        }
    });
}