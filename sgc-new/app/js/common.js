$(document).ready(function(){

	initNav();

	function initNav () {
		$('#nav').each(function(){
			var hold = $(this);
			var link = hold.find('.toogle-menu');
			var box = hold.find('.nav-holder');
			var wrap = $('#wrapper');
			var links = hold.find('.goto')
			
			link.click(function(){
				if(!hold.hasClass('open')){
					setTimeout(function(){
						hold.addClass('open');
					}, 50);
					box.slideDown(500, function () {
						//wrap.css({height: hold.outerHeight()+box.outerHeight()});
						$('body').css({overflow: 'hidden'});
						$('.block-main').css({filter: 'blur(5px)'});
					});
				}
				else{
					box.slideUp(500, function(){
						hold.removeClass('open');
						//wrap.css({height: 'auto'});
					});
					$('body').css({overflow: 'visible'});
					$('.block-main').css({filter: 'blur(0px)'});
				}

				return false;
			});

			links.on('click', function	(){
				$(window).trigger('closeNav')
			})

			$(window).bind('closeNav', function(){
				if(hold.hasClass('open')){
					box.slideUp(500, function(){
						hold.removeClass('open');
					});
					$('body').css({overflow: 'visible'});
					$('.block-main').css({filter: 'blur(0px)'});
				}
			});

			$(window).bind('resize', function(){
				if(hold.hasClass('open')){
					//wrap.css({height: hold.outerHeight()+box.outerHeight()});
				}
			});
		});
	}
 
});