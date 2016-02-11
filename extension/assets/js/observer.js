/* global Manifest, chrome */

console.log(Manifest.name + ': Observer carregado.')

chrome.runtime.sendMessage({})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.playing) {
    console.log(Manifest.name + ': ' + request.playing)
    sendResponse('Aba notificada.')
  }
})
