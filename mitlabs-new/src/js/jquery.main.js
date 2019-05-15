$(document).ready(function(){
	$('.goto').click(function(){
		$('html, body').animate({scrollTop: $($(this).attr('href')).offset().top}, {queue:false, duration: 700});
		return false;
	});
	
	initNav();

	$(document).ready(function(){
		$('form').validation();
	});
});

function initNav () {
	$('#header:has(#nav)').each(function(){
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
				});
			}
			else{
				box.slideUp(500, function(){
					hold.removeClass('open');
					//wrap.css({height: 'auto'});
				});
				$('body').css({overflow: 'visible'});
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
			}
		});

		$(window).bind('resize', function(){
			if(hold.hasClass('open')){
				//wrap.css({height: hold.outerHeight()+box.outerHeight()});
			}
		});
	});
}

/**
		jQuery validation v1.0.0
 **/

;(function( $ ){
	
	/**
	 * Private methods 
	 */
	var _checkFields = function(data, withClass){
		data.valid = true;
		if(withClass) data.form.find('.'+data.errorClass+', .'+data.validClass).removeClass(data.errorClass+' '+data.validClass);
		data.form.find('[data-required]').filter(':visible').not(':disabled').each(function(){
			if(data.reg[$(this).data('required')] == undefined && data.func[$(this).data('required')] == undefined){
				$.error( 'Validate for data-required="' +  $(this).data('required') + '" does not exist on jQuery.validation' );
			}
			else{
				if(data.reg[$(this).data('required')] != undefined){
					if (!data.reg[$(this).data('required')].test($(this).val()) || $(this).val() == $(this).attr('placeholder')) _addError($(this), data, withClass);
					else _addValid($(this), data, withClass);
				}
				if(data.func[$(this).data('required')] != undefined){
					if (!data.func[$(this).data('required')](data, $(this)) ) _addError($(this), data, withClass);
					else _addValid($(this), data, withClass);
				}
			}
		});
		return !data.valid;
	},
	
	_addError = function(el, data, withClass){
		data.valid = false;
		if (withClass) {
			el.addClass(data.errorClass);
			data.onAddClass(el, data.errorClass);
		}
	},
	
	_addValid = function(el, data, withClass){
		if (withClass) {
			el.addClass(data.validClass);
			data.onAddClass(el, data.validClass);
		}
	},

	/**
	 * Public methods 
	 */
	
	methods = {
		init : function( options ) {
			return this.each(function(){
				var $this = $(this);
				$this.data('validation', jQuery.extend(true, {}, defaults, options));
				var data = $this.data('validation');
				data.reg = data.reg;
				data.form = $this;
				data.submit = data.form.find(data.submitBtn);
				
				data.submit.click(function(){
					if(_checkFields(data, true)) {
						return data.onError(data);
					}
					return data.onValid(data);
				});
			});
		},
		option: function(name, element){
			if(typeof element != 'object') element = this.eq(0);
			var $this = this.filter(element),
			data = $this.data('validation');
			if(!data) return this;
			
			return data[name];
		},
		destroy : function( ) {
			return this.each(function(){
				var $this = $(this),
				data = $this.data('validation');
				
				data.form.find('*').unbind('.validation');
				data.validation.remove();
				$this.removeData('validation');
			});
		}
	},
	
	/**
	 * Default params
	 */
	
	defaults = {
		errorClass: 'error',
		validClass: 'valid',
		dasableClass: 'disabled',
		submitBtn: 'input[type=submit], button[type=submit]',
		reg: {
			empty: /\S/,
			email: /^[_.0-9a-z-]+@([0-9a-z][0-9a-z-]+.)+[a-z]{2,4}$/,
			phone: /^([0-9][\-\.\s]{0,1}){7,}$/,
			number: /^[0-9]+$/,
			select: /([^\-]{1})$/,
			card: /^[0-9]{4}[\-\.\s]{0,1}[0-9]{4}[\-\.\s]{0,1}[0-9]{4}[\-\.\s]{0,1}[0-9]{4}$/
		},
		func: {
			checkbox: function (data, el) {
				return el.is(':checked');
			},
			radio: function (data, el) {
				return $('input:radio[name='+el.attr('name')+']').filter(':checked').length > 0;
			},
			equal: function (data, el) {
				return !data.reg.empty.test(el.val()) || !data.reg.empty.test($($(this).data('equal')).val()) || $this.val() != $($(this).data('equal')).val();
			}
		},
		onAddClass: function(el, className){
			$(el).parent().addClass(className);
		},
		onValid: function(){},
		onError: function(){return false;}
	};
	
	$.fn.validation = function( method ) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			if ( typeof method === 'object' || ! method ) {
				return methods.init.apply( this, arguments );
			} else {
				$.error( 'Method ' +  method + ' does not exist on jQuery.validation' );
			}
		}
	};
	
})( jQuery );
