/* global chrome */

function verifyYoutubeWatch (url) {
  var regexYoutubeWatch = new RegExp('youtube.com.*watch')
  if (!regexYoutubeWatch.test(url)) {
    console.log(Manifest.name + ': ERRO! Não é uma página de vídeo do Youtube.')
    return
  }
  return true
}

function verifySplitGooglePlayMusic (title) {
  var splitGooglePlayMusic = title.split(' - ')
  if (splitGooglePlayMusic.length < 2 || splitGooglePlayMusic[1].trim() === 'Single') {
    console.log(Manifest.name + ': ERRO! Google Play Música não está tocando.')
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
  emmitNotification: function (title, contextMessage) {
    if (!chrome || !chrome.runtime) return
    chrome.runtime.sendMessage(chrome.runtime.id, {
      send: 'notify',
      title: title,
      contextMessage: contextMessage
    }, function (response) {
      console.log(response.message)
    })
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
    chrome.notifications.create(title + '_-_' + id, {
      title: Manifest.name,
      message: title,
      contextMessage: contextMessage,
      type: 'basic',
      iconUrl: 'assets/img/icon_notification.png',
      isClickable: true
    }, function () {
      console.log('Notificação disparada..')
    })
  }
}
