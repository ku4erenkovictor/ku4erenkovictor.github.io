function initGridView()
{
  var sel_all_btn = document.getElementById('grid-view-get-all');
  sel_all_btn.onclick=function()
  {
    var fieldList = document.getElementsByClassName('grid-view-sel-element');
    for (var i = 0; i<fieldList.length;i++)
    {
      fieldList[i].checked=true;
    }
  };
  
  
  var sel_all_btn = document.getElementById('grid-view-clear-all');
  sel_all_btn.onclick=function()
  {
    var fieldList = document.getElementsByClassName('grid-view-sel-element');
    for (var i = 0; i<fieldList.length;i++)
    {
      fieldList[i].checked=false;
    }
  };
  
  var print_btn = document.getElementById('grid-view-print');
  print_btn.onclick = function()
  {
	  showPopupWaiting();
	  
	  var sel_fields = gvGetSelectedFields();
	  if(sel_fields.length == 1)
	  {
		  gvAddSelectedElements(this);
		  return true;
	  }
	  var params = '';
	  for (var i=0;i<sel_fields.length;i++)
	  {
		  params += 'id_list['+sel_fields[i].id+']='+sel_fields[i].id+'&';
	  }	  
	  getHttpRequest('?gv_show=pdf_info',params,'','',
			function(response)
			{
		  		var res;
		  		eval('res = '+response);
		  		var pagesCnt = res.pages_cnt;
		  		var file_name = res.file_name;
		  		var msg = '';
		  		if (pagesCnt>1)
		  		{
		  			msg = 'You have '+pagesCnt+' pages'+'<br />Are you sure you want to print?';
		  		}
		  		else 
		  		{
		  			msg = 'You have '+pagesCnt+' page'+'<br />Are you sure you want to print?';
		  		}
		  		showPopupChoice(msg,'printSelected('+file_name+')','Print');
		  	});
	  return false;
  }
  
  
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
  
  var search_button = document.getElementById('gridview-def-action-buttons-search');
  var gv_name = document.getElementById('gv-name');
  
  
  var search_panel_show = getCookie('search_panel_show'+gv_name.value);
  
  if(!search_panel_show)
  {
	  var row = document.getElementById('gv-search-row');
	  row.setAttribute('class','hidden');
  }
  else
  {
	  var row = document.getElementById('gv-search-row');
	  row.removeAttribute('class');
  }
  

  search_button.onclick=function ()
  {
	  var gv_name = document.getElementById('gv-name');
	  var state_var_name = 'search_panel_show'+gv_name.value;
	  var row = document.getElementById('gv-search-row');
	  if (!row.getAttribute('class'))
	  {
		  setCookie(state_var_name,'',expires);
		  row.setAttribute('class','hidden');
	  }
	  else 
	  {
		  setCookie(state_var_name,true,expires);
		  row.removeAttribute('class');
	  }

	  return false;	  
  }
}

function printSelected(file_name)
{
	if (file_name)
	{
		document.location += '?gv_show='+file_name;
		return false;
	}
	
	if (file_name) return false;
	var print_btn = document.getElementById('grid-view-print');
	gvAddSelectedElements(print_btn);
	print_btn.form.submit();
}

function showPopupChoice(content,onContinue,continueName)
{
	closePopup();
	if (!continueName) continueName = 'Continue';

	var popupMainContainer = document.createElement('div');
	popupMainContainer.setAttribute('id','idPopupContainer');
	popupMainContainer.setAttribute('class','popupMainContainer');
	
	var popup = document.createElement('div');
	popup.setAttribute('class','popupContainer');
	popupMainContainer.appendChild(popup);
	
	var divButtons = document.createElement('div');
	divButtons.setAttribute('class','popupContainerButtons');
	popup.appendChild(divButtons);		
	
	var divMessage = document.createElement('div');
	divMessage.setAttribute('class','popupContainerMessage');
	divMessage.innerHTML = content;
	popup.appendChild(divMessage);
	
	
	var btnClose = document.createElement('input');
	btnClose.setAttribute('type','button');
	btnClose.setAttribute('value','Close');
	btnClose.setAttribute('onclick','closePopup()');
	divButtons.appendChild(btnClose);
	
	var btnContinue = document.createElement('input');
	btnContinue.setAttribute('type','button');
	if (onContinue)
	{
		btnContinue.setAttribute('onclick',onContinue);
	}
	else
	{
		btnContinue.setAttribute('onclick','closePopup()');
	}
	
	btnContinue.setAttribute('value',continueName);
	divButtons.appendChild(btnContinue);
	document.body.appendChild(popupMainContainer);
}

function showPopupWaiting()
{
	closePopup();

	var popupMainContainer = document.createElement('div');
	popupMainContainer.setAttribute('id','idPopupContainer');
	popupMainContainer.setAttribute('class','popupMainContainer');
	
	var img = document.createElement('img');
	img.setAttribute('src','/images/ajax-loader.gif');
	img.setAttribute('class','waitingImg');
	popupMainContainer.appendChild(img);
	
	document.body.appendChild(popupMainContainer);
}

function closePopup()
{
	var popup = document.getElementById('idPopupContainer');
	if (popup)
	{
		popup.remove();
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
		idHidden.setAttribute('value',selFields[i].id);
		btn.form.appendChild(idHidden);
	}
	return true;
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

if (window.addEventListener)
	window.addEventListener("load", initGridView, false);
else if (window.attachEvent)
	window.attachEvent("onload", initGridView);