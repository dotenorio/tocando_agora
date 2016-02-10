/* global chrome */

function verifyYoutubeWatch (url) {
  var regexYoutubeWatch = new RegExp('youtube.com.*watch')
  if (!regexYoutubeWatch.test(url)) {
    console.log('ERRO! Não é uma página de vídeo do Youtube.')
    return
  }
  return true
}

function verifySplitGooglePlayMusic (title) {
  var splitGooglePlayMusic = title.split(' - ')
  if (splitGooglePlayMusic.length < 2 || splitGooglePlayMusic[1].trim() === 'Single') {
    console.log('ERRO! Google Play Música não está tocando.')
    return
  }
  return true
}

function loadRegex () {
  return {
    Youtube: new RegExp('youtube.com'),
    Deezer: new RegExp('deezer.com'),
    Spotify: new RegExp('spotify.com'),
    GooglePlayMusic: new RegExp('play.google.com')
  }
}

var Manifest = chrome.runtime.getManifest()

var Utils = {
  self: Utils,
  treatTitle: function (title) {
    if (title[0] === '\u25B6') title = title.substr(2, title.length)
    var titleReturn = [
      'YouTube',
      'Spotify',
      'Spotify Web Player',
      'Spotify Web Player - Spotify',
      'Google Play Music',
      'Google Play Música'
    ]
    if (titleReturn.indexOf(title) !== -1) return
    title = title.replace(/- (YouTube|Spotify|Google Play Music|Google Play Música)/i, '')
    return title
  },
  contextMessage: function (url, title) {
    var contextMessage
    var regex = loadRegex()
    if (regex.Youtube.test(url)) {
      if (!verifyYoutubeWatch(url)) return
      contextMessage = 'YouTube'
    } else if (regex.Deezer.test(url)) {
      contextMessage = 'Deezer'
    } else if (regex.Spotify.test(url)) {
      contextMessage = 'Spotify'
    } else if (regex.GooglePlayMusic.test(url)) {
      if (!verifySplitGooglePlayMusic(title)) return
      contextMessage = 'Google Play Music'
    }
    return contextMessage
  },
  createNotification: function (title, id, contextMessage) {
    if (noNotify.indexOf(id) !== -1) {
      console.log('As notificações desta aba estão desabilitadas.')
      return
    }
    chrome.notifications.create(title + '_-_' + id, {
      title: Manifest.name,
      message: title,
      contextMessage: contextMessage,
      type: 'basic',
      iconUrl: 'assets/img/icon_notification.png',
      isClickable: true
    }, function () {
      console.log('Notificação disparada.')
      Utils.sendMessageToTab(id, title)
    })
  },
  getTabs: function () {
    var urls = Manifest.permissions.slice(0)
    urls.splice(0, 2)
    chrome.tabs.query({url: urls}, function (tabs) {
      if (tabs.length > 0) {
        tabs.forEach(function (tab) {
          var audible = tab.audible ? 'tocando' : 'pronta'
          console.log('Uma aba ' + audible + ': ' + tab.title + ' (' + tab.url + ').')
          chrome.tabs.executeScript(tab.id, {file: 'assets/js/utils.js'})
          chrome.tabs.executeScript(tab.id, {file: 'assets/js/observer.js'})
          chrome.pageAction.show(tab.id)
          var parser = document.createElement('a')
          parser.href = tab.url
          registeredUrls[tab.id] = parser.hostname
        })
      } else {
        console.log('Nenhuma aba tocando.')
      }
    })
  },
  titleChanged: function (tab) {
    title = Utils.treatTitle(tab.title.trim())
    var contextMessage = Utils.contextMessage(tab.url, title)
    if (!title || !contextMessage) return
    Utils.createNotification(title, tab.id, contextMessage)   
  },
  sendMessageToTab: function (id, title) {
    chrome.tabs.sendMessage(id, {playing: title}, function(response) {
      console.log(response);
    });
  }
}
