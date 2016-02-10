/* global Utils */

var response = {}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.playing) {
    console.log(Manifest.name + ': ' + request.playing)
    sendResponse("Aba notificada.")
  }
});