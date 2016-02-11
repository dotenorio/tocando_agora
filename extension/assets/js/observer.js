/* global Utils */

var response = {}

console.log(Manifest.name + ': Observer carregado.')

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.playing) {
    console.log(Manifest.name + ': ' + request.playing)
    sendResponse("Aba notificada.")
  }
});