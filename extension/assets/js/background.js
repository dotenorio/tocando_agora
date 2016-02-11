/* global chrome, Utils, Manifest, async */

var noNotify = []
var lastTitle = []

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.title) {
    // Deezer feelings
    if (changeInfo.title.split(' - ').length <= 1 || (
      lastTitle[tab.id] &&
      changeInfo.title.indexOf(lastTitle[tab.id]) !== -1 &&
      lastTitle[tab.id] != changeInfo.title
    )) {
      return
    }
    lastTitle[tab.id] = changeInfo.title
    // end Deezer feelings
    Utils.titleChanged(tab) 
  }
})

chrome.pageAction.onClicked.addListener(function (tab) {
  var indexOf = noNotify.indexOf(tab.id)
  var message = ' notificações para a aba ' + tab.title + '.'
  var icon
  if (indexOf === -1) {
    noNotify.push(tab.id)
    icon = 'assets/img/icon_pageaction_inactive.png'
    console.log('Desabilitando' + message)
  } else {
    noNotify.splice(indexOf, 1)
    icon = 'assets/img/icon_pageaction_active.png'
    console.log('Habilitando' + message)
  }
  chrome.pageAction.setIcon({
    tabId: tab.id,
    path: icon
  })
})

chrome.notifications.onClicked.addListener(function (notificationId) {
  console.log('Clique da notificação recebido.')
  async.waterfall([
    function (callback) {
      callback(null, parseInt(notificationId.split('_-_')[1], 10))
    },
    function (tabId, callback) {
      chrome.tabs.update(tabId, {active: true}, function (tab) {
        console.log('Ativando aba..')
        callback(null, tab.windowId)
      })
    },
    function (windowId, callback) {
      chrome.windows.update(windowId, {focused: true}, function () {
        console.log('Focando janela..')
        callback(null)
      })
    }
  ], function () {
    chrome.notifications.clear(notificationId, function () {
      console.log('Notificação fechada.')
    })
  })
})
