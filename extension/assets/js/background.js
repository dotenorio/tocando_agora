/* global chrome, Utils, Manifest, async */

var registeredUrls = []
var noNotify = []

Utils.getTabs()

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    if (changeInfo.url.indexOf(registeredUrls[tab.id]) === -1) {
      Utils.getTabs()
    }
  }
  if (changeInfo.title) {
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
