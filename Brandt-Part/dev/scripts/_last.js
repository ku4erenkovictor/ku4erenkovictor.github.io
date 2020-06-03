/*
 * Custom scripts
 */

(function ($) {

	initCustomForms();
  initSlider();

})(jQuery);

function initCustomForms() {
   var select = $('.custom-sel'); 
   
   jcf.setOptions('Select', {
      wrapNative: false,
      wrapNativeOnMobile: false
   });

   jcf.replace(select);
}

function initSlider() {
   $('.slider').slick({
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    infinite: true
  });
}