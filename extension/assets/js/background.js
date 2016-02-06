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
})

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    var log
    var send = request.send
    var url = sender.tab.url
    var title = request.title || sender.tab.title
    var contextMessage = request.contextMessage || sender.tab.contextMessage
    var id = sender.tab.id

    console.log()
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
    console.log('Recebido da url: ' + url + '.')
    if (request.send === 'notify') {
      Utils.createNotification(title, id, contextMessage)
      return sendResponse({message: Manifest.name + ': ' + title.trim() + '.'})
    }
  }
)

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
