/* global chrome, notification, async */

function verifyYoutubeWatch (url) {
  var regexYoutubeWatch = new RegExp('youtube.com.*watch')
  if (!regexYoutubeWatch.test(url)) {
    console.log('ERRO! Não é uma página de vídeo do Youtube.')
    return
  }
  return true
}

function verifySplitGooglePlayMusic (title) {
  if (!title) return
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
    Spotify: new RegExp('open.spotify.com'),
    GooglePlayMusic: new RegExp('play.google.com')
  }
}

var noNotify = []

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
      'Google Play Música',
      'Deezer'
    ]
    if (titleReturn.indexOf(title) !== -1) return
    title = title.replace(/- (YouTube|Spotify|Google Play Music|Google Play Música)/i, '')
    title = title.replace(/^\([0-9]\)\s/, '')
    return title
  },
  setNotificationMessage: function (url, title) {
    var notificationMessage
    var regex = loadRegex()
    if (regex.Youtube.test(url)) {
      if (!verifyYoutubeWatch(url)) return
      notificationMessage = 'YouTube'
    } else if (regex.Deezer.test(url)) {
      notificationMessage = 'Deezer'
    } else if (regex.Spotify.test(url)) {
      notificationMessage = 'Spotify'
    } else if (regex.GooglePlayMusic.test(url)) {
      if (!verifySplitGooglePlayMusic(title)) return
      notificationMessage = 'Google Play Music'
    }
    return notificationMessage
  },
  setNotificationOptions: function (title, id, message, callback) {
    var options = {
      title: title,
      message: message,
      contextMessage: Manifest.name,
      type: 'basic',
      iconUrl: 'assets/img/icon_' + message.toLowerCase().replace(/\s/g, '') + '_notification.png',
      isClickable: true
    }

    var splitTitle = title.split(' · ')
    if (splitTitle.length < 2) {
      splitTitle = title.split(' - ')
    }

    if (splitTitle.length >= 2) {
      options.title = splitTitle[0]
      options.message = splitTitle[1].split(' [')[0]
      options.contextMessage = Manifest.name
      callback(options)
    } else if (message === 'YouTube') {
      Utils.sendMessageToTab(id, 'dom', 'yt-user-info', function (response) {
        options.message = response
        callback(options)
      })
    } else {
      callback(options)
    }
  },
  createNotification: function (title, id, message) {
    if (noNotify.indexOf(id) !== -1) {
      console.log('As notificações desta aba estão desabilitadas.')
      return
    }
    async.waterfall([
      function (callback) {
        Utils.setNotificationOptions(title, id, message, function (options) {
          callback(null, options)
        })
      },
      function (options, callback) {
        chrome.notifications.create(title + '_-_' + id, options, function () {
          console.log('Notificação disparada.')
          Utils.sendMessageToTab(id, 'playing', title)
        })
      }
    ])
  },
  titleChanged: function (tab) {
    var title = Utils.treatTitle(tab.title.trim())
    var message = Utils.setNotificationMessage(tab.url, title)
    if (!title || !message) {
      delete notification[tab.title]
      return
    }
    Utils.createNotification(title, tab.id, message)
  },
  sendMessageToTab: function (id, action, value, callback) {
    var options = {}
    options[action] = value
    chrome.tabs.sendMessage(id, options, function (response) {
      if (response) {
        console.log('Resposta: ' + response)
        if (callback) callback(response)
      } else {
        console.log('Aba não notificada.')
      }
    })
  },
  isGooglePlayMusic: function (url) {
    var regex = loadRegex()
    if (regex.GooglePlayMusic.test(url)) {
      return true
    }
  },
  isSpotify: function (url, title) {
    var regex = loadRegex()
    if (regex.Spotify.test(url) && title.split(' · ').length >= 2) {
      return true
    }
  }
}
