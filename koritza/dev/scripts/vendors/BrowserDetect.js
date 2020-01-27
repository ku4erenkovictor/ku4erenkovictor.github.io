


/*
 * Browser Detect script
 */
function initBrowserDetect(addVersionOS, addBrowserMinorVersion) {
	window.BrowserDetect = (function() {
		// script settings
		var options = {
			osVersion: addVersionOS,
			minorBrowserVersion: addBrowserMinorVersion
		};

		// browser data
		var browserData = {
			browsers: {
				edge: uaMatch(/ Edge\/([0-9\.]*)/),
				chrome: uaMatch(/Chrome\/([0-9\.]*)/),
				firefox: uaMatch(/Firefox\/([0-9\.]*)/),
				safari: uaMatch(/Version\/([0-9\.]*).*Safari/),
				opera: uaMatch(/Opera\/.*Version\/([0-9\.]*)/, /Opera\/([0-9\.]*)/),
				msie: uaMatch(/MSIE ([0-9\.]*)/, /Trident.*rv:([0-9\.]*)/)
			},
			engines: {
				edgehtml: uaContains(' Edge\/'),
				webkit: uaContains('AppleWebKit'),
				trident: uaMatch(/(MSIE|Trident)/),
				gecko: uaContains('Gecko'),
				presto: uaContains('Presto')
			},
			platforms: {
				win: uaMatch(/Windows NT ([0-9\.]*)/),
				mac: uaMatch(/Mac OS X ([0-9_\.]*)/),
				linux: uaContains('X11', 'Linux')
			}
		};

		// perform detection
		var ua = navigator.userAgent;
		var detectData = {
			platform: detectItem(browserData.platforms),
			browser: detectItem(browserData.browsers),
			engine: detectItem(browserData.engines)
		};

		// private functions
		function uaMatch() {
			var regs = Array.prototype.slice.apply(arguments);
			return function() {
				for (var i = 0, result; i < regs.length; i++) {
					result = regs[i].exec(ua);
					if (result) {
						return result[1];
					}
				}
			};
		}
		function uaContains(word) {
			var words = Array.prototype.slice.apply(arguments);
			return function() {
				for(var i = 0; i < words.length; i++) {
					if(ua.indexOf(words[i]) < 0) {
						return;
					}
				}
				return true;
			};
		}
		function detectItem(items) {
			var detectedItem = null, itemName, detectValue;
			for(itemName in items) {
				if(items.hasOwnProperty(itemName)) {
					detectValue = items[itemName]();
					if(detectValue) {
						return {
							name: itemName,
							value: detectValue
						};
					}
				}
			}
		}

		// add classes to root element
		(function() {
			// helper functions
			var addClass = function(cls) {
				var html = document.documentElement;
				html.className += (html.className ? ' ' : '') + cls;
			};
			var getVersion = function(ver) {
				return typeof ver === 'string' ? ver.replace(/\./g, '_') : 'unknown';
			};

			// add classes
			if(detectData.platform) {
				addClass(detectData.platform.name);
				if(options.osVersion) {
					addClass(detectData.platform.name + '-' + getVersion(detectData.platform.value));
				}
			}
			if(detectData.engine) {
				addClass(detectData.engine.name);
			}
			if(detectData.browser) {
				addClass(detectData.browser.name);
				addClass(detectData.browser.name + '-' + parseInt(detectData.browser.value, 10));
				if(options.minorBrowserVersion) {
					addClass(detectData.browser.name + '-' + getVersion(detectData.browser.value));
				}
			}
		}());

		// export detection information
		return detectData;
	}());
}
