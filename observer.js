/* global chrome */

function emmitNotify (title) {
  if (!chrome || !chrome.runtime) return
  chrome.runtime.sendMessage(chrome.runtime.id, {
    send: 'notify',
    title: title
  }, function (response) {
    console.log(response.message)
  })
}

var lastTitle
var target = document.querySelector('head > title')

var observer = new window.MutationObserver(
  function (mutations) {
    var title
    mutations.forEach(
      function (mutation) {
        title = mutation.target.textContent.trim()
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
        if (title === lastTitle) return
        emmitNotify(title)
        lastTitle = title
      }
    )
  }
)

observer.observe(target, {
  subtree: true,
  characterData: true,
  childList: true
})
