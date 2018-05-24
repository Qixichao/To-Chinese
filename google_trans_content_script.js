// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Search the text nodes for a US-style mailing address.

let transTarget = '';
let sourcelang = '';
var transTxt;
var TxtX;
var TxtY;
var targetDiv;

var b = function (a, b) {
    for (var d = 0; d < b.length - 2; d += 3) {
        var c = b.charAt(d + 2),
            c = "a" <= c ? c.charCodeAt(0) - 87 : Number(c),
            c = "+" == b.charAt(d + 1) ? a >>> c : a << c;
        a = "+" == b.charAt(d) ? a + c & 4294967295 : a ^ c
    }
    return a
}

var tk =  function (a,TKK) {
    for (var e = TKK.split("."), h = Number(e[0]) || 0, g = [], d = 0, f = 0; f < a.length; f++) {
        var c = a.charCodeAt(f);
        128 > c ? g[d++] = c : (2048 > c ? g[d++] = c >> 6 | 192 : (55296 == (c & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(f + 1) & 64512) ? (c = 65536 + ((c & 1023) << 10) + (a.charCodeAt(++f) & 1023), g[d++] = c >> 18 | 240, g[d++] = c >> 12 & 63 | 128) : g[d++] = c >> 12 | 224, g[d++] = c >> 6 & 63 | 128), g[d++] = c & 63 | 128)
    }
    a = h;
    for (d = 0; d < g.length; d++) a += g[d], a = b(a, "+-a^+6");
    a = b(a, "+-3^+b+-f");
    a ^= Number(e[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return a.toString() + "." + (a ^ h)
}

function createXmlHttp() {
	if (window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else {
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
}

function writeSource() {
	if (xmlHttp.readyState == 4) {
		htmlSource = xmlHttp.responseText;
		split_TKK=htmlSource.split('TKK');
		TKK_code=split_TKK[1].substring(7,split_TKK[1].indexOf(');')-1).replace(/\\x3d/g,'=').replace(/\\x27/g,'\'');
		//eval('2+2');
		TKK=eval(TKK_code);
		token_key=tk(transTxt, TKK);
		url='https://translate.google.com/translate_a/single?client=t&sl='+sourcelang+'&tl='+transTarget+'&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&source=btn&ssel=6&tsel=3&kc=0&tk='+ token_key +'&q=' + transTxt;
		createXmlHttp();
		xmlHttp.open("GET", url, true);
		xmlHttp.withCredentials = true;
		xmlHttp.onreadystatechange = function(){if (xmlHttp.readyState == 4) {
      try{
        targetDiv = document.createElement('div');
        var resultJson = JSON.parse(xmlHttp.responseText);
        displayInfo(resultJson[0][0][0], '', TxtX, TxtY);
      }catch(e){
        displayInfo('Internal Error.', '', TxtX, TxtY)
      }
    }}
		xmlHttp.send();
	} else {
		console.log("XmlHttp error.");
	}
}

function displayInfo(message, style, x, y){
  var transInfoDiv = document.getElementById('transInfoDiv');
  if (transInfoDiv === null){
    transInfoDiv = document.createElement('div');
    transInfoDiv.setAttribute('id', 'transInfoDiv');
    transInfoDiv.style.cssText = 'margin: 4px; position: absolute; z-index: 900; background-color: #EEEEEE; font-family: Trebuchet, Arial, sans-serif; font-weight: bold; border: 1px solid #999999;';
    document.body.appendChild(transInfoDiv);
  }
  var transInfoDiv = document.getElementById('transInfoDiv');
  transInfoDiv.style.left = x+'px';
  transInfoDiv.style.top = y+'px';
  transInfoDiv.style.display = '';
  transInfoDiv.innerHTML = message;
}

document.onmousedown = function cancelTip(e){
  var transInfoDiv = document.getElementById('transInfoDiv');
  if (transInfoDiv != null){
    transInfoDiv.style.display = 'none';
  }
}

document.onmouseup = function selcetText(e){

  TxtX = e.clientX;
  TxtY = e.clientY;
	chrome.storage.local.get(['transTarget'], function(value){
    transTarget = value.transTarget;
  })
  if (transTarget!=''){
  	sourcelang='en';
  } else {
  	return ;
  }
	if(document.selection){
		transTxt = document.selection.createRange().text
	}else{
		transTxt = window.getSelection()+'';
	}
	if(transTxt){
		//document.getElementById("source").value = "Loading...";
    displayInfo('Loading', '', TxtX, TxtY);
		url = "https://translate.google.com"
		createXmlHttp();
		xmlHttp.open("GET", url, true);
		xmlHttp.withCredentials = true;
		xmlHttp.onreadystatechange = writeSource;
		xmlHttp.send();
	}
}
