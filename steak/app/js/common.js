$(document).ready(function(){

	$('.box-slider').slick({
		arrows: true,
  		dots: true
	});

	$('.products-slider').slick({
		arrows: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		responsive: [
	    	{
	      		breakpoint: 768,
	      		settings: {
	        		slidesToShow: 2,
	      		}
	    	},
	    	{
	      		breakpoint: 540,
	      		settings: {
	        		slidesToShow: 1,
	      		}
	    	}
	  	]
	});

	$('.product-slider').slick({
		arrows: true,
		slidesToShow: 1,
		slidesToScroll: 1
	});

});
