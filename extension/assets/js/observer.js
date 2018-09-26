console.log(Manifest.name + ': Observer carregado.')

chrome.runtime.sendMessage({})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.playing) {
    console.log(Manifest.name + ': ' + request.playing)
    sendResponse('Aba notificada.')
  }
  if (request.dom === 'get-user-info') {
    console.log(Manifest.name + ': DOM "' + request.dom + '"')
    sendResponse(document.getElementById('owner-name').childNodes[0].text)
  }
  if (request.dom === 'get-artist-info') {
    console.log(Manifest.name + ': DOM "' + request.dom + '"')
    sendResponse(document.querySelectorAll('.ytmusic-player-bar yt-formatted-string')[1].getAttribute('title').split(' • ')[0])
  }
})
