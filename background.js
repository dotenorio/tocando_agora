/* global chrome */

function getTabs () {
  chrome.tabs.query({url: [
    '*://*.deezer.com/*',
    '*://*.youtube.com/*',
    '*://*.spotify.com/*',
    '*://play.google.com/music/*'
  ]}, function (tabs) {
    if (tabs.length > 0) {
      tabs.forEach(function (tab) {
        var audible = tab.audible ? 'tocando' : 'pronta'
        console.log('Uma aba ' + audible + ': ' + tab.title + ' (' + tab.url + ').')
        chrome.tabs.executeScript(tab.id, {file: 'observer.js'})
        chrome.pageAction.show(tab.id)
      })
    } else {
      console.log('Nenhuma aba tocando.')
    }
  })
}

getTabs()

chrome.tabs.onUpdated.addListener(function () {
  getTabs()
})

var manifest = chrome.runtime.getManifest()

function onNotify (title, url, id) {
  var contextMessage = ''
  var regexYoutube = new RegExp('youtube.com')
  var regexDeezer = new RegExp('deezer.com')
  var regexSpotify = new RegExp('spotify.com')
  var regexGooglePlayMusic = new RegExp('play.google.com')
  if (regexYoutube.test(url)) {
    var regexYoutubeWatch = new RegExp('youtube.com.*watch')
    if (!regexYoutubeWatch.test(url)) {
      console.log('Não é uma página de vídeo do Youtube.')
      return
    }
    contextMessage = 'YouTube'
  } else if (regexDeezer.test(url)) {
    contextMessage = 'Deezer'
  } else if (regexSpotify.test(url)) {
    contextMessage = 'Spotify'
  } else if (regexGooglePlayMusic.test(url)) {
    var splitGooglePlayMusic = title.split(' - ')
    if (splitGooglePlayMusic.length < 2 || splitGooglePlayMusic[1].trim() == 'Single') {
      console.log('Google Play Música não está tocando.')
      return
    }
    contextMessage = 'Google Play Music'
  }
  chrome.notifications.create(title + '_-_' + id, {
    title: manifest.name,
    message: title,
    contextMessage: contextMessage,
    type: 'basic',
    iconUrl: 'icon_notification.png',
    isClickable: true
  }, function () {
    console.log('Notificação disparada..')
  })
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log()
    var send = request.send
    var log
    if (!send) {
      log = 'Não existe uma mensagem válida.'
    } else if (!sender.tab) {
      log = 'Não foi uma aba que enviou essa mensagem.'
    } else if (noNotify.indexOf(sender.tab.id) !== -1) {
      log = 'As notificações desta aba estão desabilitadas.'
    }
    if (log) {
      console.log(log)
      return sendResponse({message: log})
    }
    var url = sender.tab.url
    var title = request.title || sender.tab.title
    var id = sender.tab.id
    console.log('Recebido da url: ' + url + '.')
    if (request.send === 'notify') {
      onNotify(title, url, id)
      return sendResponse({message: manifest.name + ': ' + title.trim() + '.'})
    }
  }
)

var noNotify = []

chrome.pageAction.onClicked.addListener(function (tab) {
  var indexOf = noNotify.indexOf(tab.id)
  var message = ' notificações para a aba ' + tab.title + '.'
  var icon
  if (indexOf === -1) {
    noNotify.push(tab.id)
    icon = 'icon_pageaction_inactive.png'
    console.log('Desabilitando' + message)
  } else {
    noNotify.splice(indexOf, 1)
    icon = 'icon_pageaction_active.png'
    console.log('Habilitando' + message)
  }
  chrome.pageAction.setIcon({
    tabId: tab.id,
    path: icon
  })
})

chrome.notifications.onClicked.addListener(function (notificationId) {
  console.log('Clique da notificação recebido.')
  var tabId = notificationId.split('_-_')
  console.log(tabId);
  tabId = parseInt(tabId[1], 10)
  chrome.tabs.update(tabId, {active: true}, function (tab) {
    console.log('Ativando aba..')
    var windowId = tab.windowId
    chrome.windows.update(windowId, {focused: true}, function () {
      console.log('Focando janela..')
      chrome.notifications.clear(notificationId, function () {
        console.log('Notificação fechada.')
      })
    })
  })
})
