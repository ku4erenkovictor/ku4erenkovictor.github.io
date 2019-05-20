$(document).ready(function(){			
	
	jcf.replaceAll();

	$('.tabs').tabs();

	OpenBox2({
		wrap: '.box-categories',
		link: '.box-categories__title',
		box: '.box-categories__list',
		openClass: 'box-categories__active'
	});

	OpenBox2({
		wrap: '.box-filter',
		link: '.box-filter__title',
		box: '.box-filter__wrap',
		openClass: 'box-filter__active'
	});

	OpenBox2({
		wrap: '.box-filter__hold',
		link: '.box-filter__more',
		box: '.box-filter__wrap',
		openClass: 'box-filter__hold-active'
	});

	$(".range-slider").ionRangeSlider({
        type: "double",
        grid: false,
        min: 0,
        max: 1000,
        from: 38.72,
        to: 971.67,
        prefix: "",
        step: 0.1,
        onChange: function (data) {
            $(".box-range__input-from").val("$ " +data.from);
            $(".box-range__input-to").val("$ " +data.to);
            $(".irs-from").addClass("irs-active");
            $(".irs-to").addClass("irs-active");
            
        },
        onFinish: function (data) {
            $(".irs-from").removeClass("irs-active");
            $(".irs-to").removeClass("irs-active");
        },
    });

    $(".sing-in__btn").on("click", function(){
        $(".sing-in__modal").arcticmodal()
    });

    $('.list-grid__item').on("click", function(){
    	$('.list-grid__item').removeClass("list-grid__item-active");
        $(this).addClass("list-grid__item-active");
    });

    $(".btn-filters").on("click", function(){
        $(".main-holder").addClass("main__active");
    });

    $(".overlay-close").on("click", function(){
        $(".main-holder").removeClass("main__active");
    });

});

function OpenBox2(obj){
	$(obj.wrap).each(function(){
		var hold = $(this);
		var link = hold.find(obj.link);
		var box = hold.find(obj.box);
		var w = obj.w;
		var close = hold.find(obj.close);
		link.click(function(){
			if (!hold.hasClass(obj.openClass)) {
				hold.addClass(obj.openClass);
			}
			else {
				hold.removeClass(obj.openClass);
			}
			return false;
		});
		close.click(function(){
			hold.removeClass(obj.openClass);
			return false;
		});
	});
}