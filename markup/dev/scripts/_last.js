/*
 * Custom scripts
 */
(function ($) {
    initNav()
    moveHexagon();
    initScrollCounter();
    scrollToSection();
    scrollBtnTop();
    openModal();
    //closeModal()
    validationForm();
    createCustomSelect();
})(jQuery);

function initNav() { 
    var mainNav = new MobNav({
        menu: '.menu', 
        opener: '.btn-mobile',
        activeClass: 'menu-active',
    });
}

function moveHexagon() {
    if ('ontouchstart' in window == false) {
        $('body').mousemove(function (e) {
            var moveX = (e.pageX * -1 / 60);
            var moveY = (e.pageY * -1 / 60);
            $('.hero-decor')
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

function scroll(event) {
    event.preventDefault();

    let id = $(this).attr('href'),
        top = $(id).offset().top;

    $('body,html').animate({scrollTop: top}, 1500);
}

function scrollToSection() {
    $(".arrow-down").on("click", scroll);
    $(".menu").on("click", "a.anchor", scroll);

    $(".menu").on("click", "a.anchor", function () {
        MobNav.close();
        $(".menu-list__link").removeClass("menu-list__link-active");
        $(this).addClass("menu-list__link-active");
    });
}

function scrollBtnTop() {
    let btnTop = $('.arrow-up');

    $(document).scroll(function (event) {
        let heightScroll = $(this).scrollTop();

        if (heightScroll > 900) {
            btnTop.removeClass('hidden');
        } else {
            btnTop.addClass('hidden');
        }
    });

    btnTop.on("click", scroll);
}

function openModal() {
    let btnOpenCollection = document.getElementsByClassName('btn-open');
    let modal = document.querySelector('.modal');

    function clickBtnOpen(event) {
        modal.classList.add('show');
        document.body.classList.add('open-modal')
    }

    Array.prototype.slice.call(btnOpenCollection).forEach(function (btn) {
      return btn.addEventListener('click', clickBtnOpen);
    });
}

/*function closeModal() {
    let btnCloseCollection = document.getElementsByClassName('btn-close');
    let modal = document.querySelector('.modal');

    function clickBtnClose(event) {
        modal.classList.remove('show');
        document.body.classList.remove('open-modal')
    }

    Array.from(btnCloseCollection).forEach(
        btn => btn.addEventListener('click', clickBtnClose)
    )
}*/

function validationForm() {
    let form = $('.validate-form');
    let input = form.find('input');
    let btnCollection = document.getElementsByClassName('btn-close');
    let modal = document.querySelector('.modal');
    let checkRes;

    input.keyup(function (e) {
        checkInputs(e);
    });

    Array.prototype.slice.call(btnCollection).forEach(function (btn) {
      return btn.addEventListener('click', function (e) {
        checkInputs(e);

        if (checkRes) {
          modal.classList.remove('show');
          document.body.classList.remove('open-modal');
        }
      });
    });

    function checkInputs(event) {
        checkRes = true;
        $(event.target).parents('.validate-form').find('input').each(function (i, item) {
            //console.log(item);
            let data = item.getAttribute('type');

            switch (data) {
                case 'text':
                    var x = item.value.search(/^[a-zA-Zа-яА-Я]+$/);
                    checkValidation(x, item);
                    break;

                case 'phone':
                    var y = item.value.search(/[0-9]/);
                    item.value.length < 10 ? y = -1 : y;
                    checkValidation(y, item);
                    break;
            }
        });
        addAttrBtn(event);
    }

    function checkValidation(val, item) {
        if (val !== 0) {
            checkRes = false;
            $(item).addClass('error');

        } else if (val === 0) {
            $(item).removeClass('error');

        }
    }

    function addAttrBtn(event) {
        var targetBtn = $(event.target).parents('.validate-form').find('button');

        if (checkRes) {
            targetBtn.prop('disabled', false);
        } else {
            targetBtn.prop('disabled', true)
        }
    }
}

function createCustomSelect() {
    var x, i, j, selElem, a, b, c;

    x = document.getElementsByClassName("custom-select");
    for (i = 0; i < x.length; i++) {
        selElem = x[i].getElementsByTagName("select")[0];

        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElem.options[selElem.selectedIndex].innerHTML;
        x[i].appendChild(a);

        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 1; j < selElem.length; j++) {

            c = document.createElement("DIV");
            c.innerHTML = selElem.options[j].innerHTML;
            c.addEventListener("click", function(e) {

                var y, i, k, s, h;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                h = this.parentNode.previousSibling;
                for (i = 0; i < s.length; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        for (k = 0; k < y.length; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function(e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }
    function closeAllSelect(elem) {

        var x, y, i, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        for (i = 0; i < y.length; i++) {
            if (elem == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < x.length; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }

    document.addEventListener("click", closeAllSelect);
}