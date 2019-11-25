function tabs(parent, link) {
	var tabsBlock = document.querySelector(parent),
	tabsLink = document.querySelectorAll(link),
	defaultActiveTab = 0,
	objectId = attrLink();
	if (tabsBlock == undefined) return;

	activeLink(defaultActiveTab);
	showTabs(defaultActiveTab);

	tabsBlock.addEventListener('click', clickLInk);

	function showTabs(activeItem) {

		for (var i = 0; i < objectId.length; i++) {
			var tabsFind = document.querySelector(objectId[i]);
			tabsFind.style.cssText += 'display: none;';
		}
		if (typeof activeItem == 'number') {
			document.querySelector(objectId[activeItem]).style.cssText += 'display: block;';
		}
	}

	function activeLink(activeLink) {

		for (var i = 0; i < tabsLink.length; i++) {
			tabsLink[i].classList.remove('active');
		}

		if (typeof activeLink == 'number') {
			tabsLink[activeLink].classList.add('active')
		}
	}

	function attrLink() {
		var idObject = [];

		for (var i = 0; i < tabsLink.length; i++) {
			var href = tabsLink[i].getAttribute('href');
			idObject.push(href);
		}
		return idObject;

	}

	function clickLInk(e) {
		e.preventDefault();
		var target = e && e.target || e.srcElement;

		if (target.tagName != 'A') return;

		var targetAttr = target.getAttribute('href');

		activeLink();
		showTabs();
		target.classList.add('active');
		document.querySelector(targetAttr).style.cssText += 'display: block;';

		$('.masonry').masonry({
			columnWidth: '.masonry__item',
			itemSelector: '.masonry__item'
		});
	}
}