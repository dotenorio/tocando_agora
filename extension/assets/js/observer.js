/* global Utils */

var lastTitle
var target = document.querySelector('head > title')
var url = document.location.href

var observer = new window.MutationObserver(
  function (mutations) {
    var title
    mutations.forEach(
      function (mutation) {
        title = Utils.treatTitle(mutation.target.textContent.trim())
        if (title === lastTitle) return
        lastTitle = title
        var contextMessage = Utils.contextMessage(url, title)
        if (!title || !contextMessage) return
        Utils.emmitNotification(title, contextMessage)
      }
    )
  }
)

observer.observe(target, {
  subtree: true,
  characterData: true,
  childList: true
})
