// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';
//An Alarm delay of less than the minimum 1 minute will fire
// in approximately 1 minute incriments if released
//document.getElementById('Chinese').addEventListener('click', toTranslate);
//document.getElementById('English').addEventListener('click', toTranslate);
//chrome.browserAction.setBadgeText({text: 'OFF'});
console.log('event: '+document.getElementById('transSwitch').checked);
//console.log('flag: '+transFlag);
//document.getElementById('transSwitch').checked = transFlag;
try{
  chrome.storage.local.get(['transTarget'], function(value) {
    if(value.transTarget == 'zh-CN'){
      document.getElementById('transSwitch').checked = true;
      console.log('storage: '+true);
    }else{
      document.getElementById('transSwitch').checked = false;
      console.log('storage: '+false);
    }
  });
}catch(e){
  document.getElementById('transSwitch').checked = false;
  console.log('storage: '+false);
}
document.getElementById('transSwitch').addEventListener('click', function(e){
  let transFlag = document.getElementById('transSwitch').checked;
  console.log(transFlag);
  if(transFlag){
    document.getElementById('transSwitch').checked = true;
    transFlag = true;
    chrome.browserAction.setBadgeText({text: 'ON'});
    chrome.runtime.sendMessage({'transTarget': 'zh-CN'});
  }else{
    document.getElementById('transSwitch').checked = false;
    transFlag = false;
    chrome.browserAction.setBadgeText({text: 'OFF'});
    chrome.runtime.sendMessage({'transTarget': ''});
  }
  //window.close();
});
