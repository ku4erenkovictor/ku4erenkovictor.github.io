if (window.addEventListener)
	window.addEventListener("load", init, false);
else if (window.attachEvent)
	window.attachEvent("onload", init);
function init()
{
	initLinks();
	initElements();
	$('.load').click(function(){
		paginator(this);
		return false;
	});
}
function getAmount(value)
{
	var amount=parseFloat(document.getElementById('total').innerHTML);
	amount+=value;
	document.getElementById('total').innerHTML=amount;
}
function initElements()
{
	var _elem=document.getElementsByTagName('input');
	for(var i = 0; i < _elem.length; i++)
	{
		if(_elem[i].name=="cbx[]")
		{
			_elem[i].onchange=function()
			{
				var value=parseFloat(document.getElementById("price"+this.value).innerHTML);
				if(!this.checked)
				{
					value=value*(-1);
				}
				getAmount(value);
			};
		}
		if(_elem[i].name == "orderAdd")
		{
			_elem[i].onclick=function()
			{
				var tbl = document.getElementById('ticketDetailTable');
				if(tbl)
				{
					var objRow = document.createElement("tr");
					var objCell1 = document.createElement("td");
					var objCell2 = document.createElement("td");
					objCell1.innerHTML = document.getElementById('order').options[document.getElementById('order').selectedIndex].innerHTML;
					objCell2.innerHTML ='<a href="#">remove</a>';
					objRow.appendChild(objCell1);
					objRow.appendChild(objCell2);
					var tmpRow = tbl.tBodies[0].getElementsByTagName("tr")[tbl.tBodies[0].getElementsByTagName("tr").length-1];
					tbl.tBodies[0].replaceChild(objRow, tbl.tBodies[0].getElementsByTagName("tr")[tbl.tBodies[0].getElementsByTagName("tr").length-1]);
					tbl.tBodies[0].appendChild(tmpRow);
					//.replace(/fromAccountId=[\d]+/, 'fromAccountId=' + accId);
					getHttpRequest('ticketdetails.html?ajax', 'tid=' + document.getElementById('tid').value + '&oid=' + document.getElementById('order').value);
				}
				return false;
			}
		}
		if(_elem[i].className.indexOf("file-input-area") != -1)
		{
			var _file_input = _elem[i];
			_file_input._fake_file_input = _elem[i].parentNode.parentNode.getElementsByTagName('input')[1];
			_file_input._fake_file_input.readOnly = true;
			_file_input.onchange = function()
			{
				this._fake_file_input.value = this.value;
			}
		}
		if(_elem[i].id=="input-submit-portfolio")
		{
			_elem[i].onclick = function(){
				var params = '';
				var chk = document.getElementsByTagName("INPUT");
				for(var j = 0; j < chk.length; j++)
				{
					if(chk[j].id.indexOf('chp_') != -1)
					{
						params += chk[j].id.split('_')[1] + '-' + (chk[j].checked ? '1' : '0') + ',';
					}
				}
				params = params.substring(0, params.length - 1);
				document.getElementById('uip').value = params;
				document.getElementById('uip-form').submit();
				return false;
			}
		}
		if(_elem[i].name=="upload_template")
		{
			_elem[i].onchange=function()
			{
				if(this.checked)
				{
					document.getElementById("template").style.display='';
				}
				else
				{
					document.getElementById("template").style.display='none';
				}
			};
		}
	}
	var sel_all_btn = document.getElementById('grid-view-get-all');
	if(sel_all_btn)
	{
		sel_all_btn.onclick=function()
		{
			var fieldList = document.getElementsByClassName('grid-view-sel-element');
			for (var i = 0; i<fieldList.length;i++)
			{
				if(this.checked)
				{
				  fieldList[i].checked=true;
				}
				else
				{
				  fieldList[i].checked=false;
				}
			}
		};
	}
	var gv_name = document.getElementById('gv-name');
	if(gv_name)
	{
		var action_buttons = document.getElementsByClassName('gridview-def-action-buttons');
		if (action_buttons.length)
		{
			for (var i = 0; i<action_buttons.length;i++)
			{
				action_buttons[i].onclick = function()
				{
					return gvAddSelectedElements(this);
				}
			}  
		}
		var search_panel_show = getCookie('search_panel_show' + gv_name.value);
		if(!search_panel_show)
		{
			var row = document.getElementById('dgsr');
			row.setAttribute('class','hidden');
		}
		else
		{
			var row = document.getElementById('dgsr');
			row.removeAttribute('class');
		}
		var search_button = document.getElementById('gridview-def-action-buttons-search');
		if(search_button)
		{
			search_button.onclick = function()
			{
				var gv_name = document.getElementById('gv-name');
				var state_var_name = 'search_panel_show' + gv_name.value;
				var row = document.getElementById('dgsr');
				if(row)
				{
					if (!row.getAttribute('class'))
					{
						setCookie(state_var_name, '');
						row.setAttribute('class', 'hidden');
					}
					else 
					{
						setCookie(state_var_name, true);
						row.removeAttribute('class');
					}
				}
				return false;	  
			}
		}
	}
}
function getCookie(name)
{
    var start = document.cookie.indexOf(name+"=");
    var len = start+name.length+1;
    if ((!start) && (name != document.cookie.substring(0,name.length))) return null;
    if (start == -1) return null;
    var end = document.cookie.indexOf(";",len);
    if (end == -1) end = document.cookie.length;
    return unescape(document.cookie.substring(len,end));
}
function setCookie(name, value, expires, path, domain, secure)
{
    document.cookie = name + "=" +escape(value) +
        ( (expires) ? ";expires=" + expires.toGMTString() : "") +
        ( (path) ? ";path=" + path : "") +
        ( (domain) ? ";domain=" + domain : "") +
        ( (secure) ? ";secure" : "");
}
function initLinks()
{
	var _a = document.getElementsByTagName('a');
	for(var i = 0; i < _a.length; i++)
	{
		if(_a[i].className == 'toggleh')
		{
			_a[i].onclick = function()
			{
				var el = document.getElementById(this.id + 'Toggle');
				if(el)
				{
					if(el.style.display == 'none')
					{
						el.style.display = 'table';
						this.style.textDecoration = 'none';
					}
					else
					{
						el.style.display = 'none';
						this.style.textDecoration = 'underline';
					}
				}
				return false;
			}
		}
		if(_a[i].innerHTML == 'remove')
		{
			_a[i].onclick = function()
			{
				getHttpRequest('ticketdetails.html?ajax', this.rel);
				var objRow = this.parentNode.parentNode;
				var tbl = document.getElementById('ticketDetailTable');
				if(objRow && tbl)
				{
					tbl.tBodies[0].removeChild(objRow);
				}
				return false;
			}
		}
	}
}

function getHttpRequest(url, params, _onload)
{
	var httpRequest = false;
	if (window.XMLHttpRequest) 
	{
		httpRequest = new XMLHttpRequest();
		if (httpRequest.overrideMimeType) 
		{
			httpRequest.overrideMimeType('text/xml');
		}
	}
	else if (window.ActiveXObject) 
	{
		try 
		{
			httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} 
		catch (e)
		{
			try
			{
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e) 
			{
			}
		}
	}

	if (!httpRequest)
	{
		alert('Unfortunatelly you browser doesn\'t support this feature.');
		return false;
	}


	httpRequest.onreadystatechange = function()
	{
		if (httpRequest.readyState == 4)
		{
			if (httpRequest.status == 200)
			{
				if(elem_main = document.getElementById("xhtml_tmp"))
				{												
					elem_main.innerHTML = httpRequest.responseText;
					if(_onload)
					{
						eval(_onload);
					}
					else
					{
						process_responce(elem_main);
						if(httpRequest.responseText.length > 0)
						{
							init();
						}
					}
					elem_main.innerHTML = '';

				}
			}
			else
			{
				alert('There was a problem with the request.(Code: ' + httpRequest.status + ')');
			}
		}
	};
	
	if(params == undefined || params == null)
	{
		httpRequest.open('GET', url, true);
		httpRequest.send(null);
	}
	else
	{
		httpRequest.open('POST', url, true);
		httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		httpRequest.setRequestHeader("Content-length", params.length);		
		httpRequest.setRequestHeader("Connection", "close");
		httpRequest.send(params);
	}
}

function process_responce(tmp)
{
	
	var nodes = tmp.getElementsByTagName("div");
	for (var i=0; i < nodes.length; i++)
	{
		if(nodes[i].id == "js2run")
		{
			eval(nodes[i].innerHTML);			
		}
		else
		{			
			var new_id = nodes[i].id.replace(new RegExp("-tmp"), "");
			if(new_id.length > 0)
			{
				var somediv = document.getElementById(new_id);
				if(somediv)
				{
					somediv.value = nodes[i].innerHTML;
				}
			}
		}
	}
	var nodes = tmp.getElementsByTagName("textarea");
	for (var i=0; i < nodes.length; i++)
	{
		var new_id = nodes[i].id.replace(new RegExp("-tmp"), "");
		if(new_id.length > 0)
		{
			var somediv = document.getElementById(new_id);
			if(somediv)
			{
				somediv.innerHTML = nodes[i].innerHTML;
			}
		}
	}
	tmp.innerHTML = '';
}
function updateNewCell(str1, str2)
{
	var tbl = document.getElementById('ticketDetailTable');
	if(tbl)
	{
		var itemNo = tbl.tBodies[0].getElementsByTagName("tr").length - 2;
		if(itemNo > 0)
		{
			tbl.tBodies[0].getElementsByTagName("tr")[itemNo].getElementsByTagName("td")[0].innerHTML = str1;
			tbl.tBodies[0].getElementsByTagName("tr")[itemNo].getElementsByTagName("td")[1].innerHTML = str2;
		}
	}
}
function gvAddSelectedElements(btn)
{
	var selFields = gvGetSelectedFields();
	if (!selFields.length) return false;
	  
	var resUrl = '';
	for(var i =0;i<selFields.length;i++)
	{
		var idHidden = document.createElement('input');
		idHidden.setAttribute('name','id_list['+selFields[i].id+']');
		idHidden.setAttribute('type','hidden');
		idHidden.setAttribute('value',selFields[i].id.split('_')[1]);
		btn.form.appendChild(idHidden);
	}
	return true;
}

function paginator(a)
{
	var pd = $(a).parent().parent().parent();
	$.get(a.href
	)
	.success(function(data) {
				try{
					pd.html(data);
					$('.load').click(function(){
						paginator(this);
						return false;
					});
					$(".choose").click(function(){
										$("#popup_" + this.href.split("#")[1]).fadeIn(500);
										return false;
					});
					$(".popup-close").click(function(){
						$(this).parent().parent().fadeOut(500);
						return false;
					});
					$(".e2").click(function(){
						if($(this).parents("#popup_front").length != 0)
							$("#front_image_id").val(this.href.split("#")[1]);	
						else
							$("#back_image_id").val(this.href.split("#")[1]);	
						$(".global-popup").fadeOut(500);
						return false;
					});
				}
				catch(e)
				{}
		   })
	.error(function() {
						alert("Error");
		   });
	return false;
}

function gvGetSelectedFields()
{
	var fieldList = document.getElementsByClassName('grid-view-sel-element');
	var res = new Array();
	
	for (var i = 0; i<fieldList.length;i++)
	{
		if (fieldList[i].checked) res.push(fieldList[i]);
	}
	return res;
}