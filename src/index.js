import { Application } from './js/app.js'
import { Tabselector } from './js/tabselector.js'
import { Scribe } from './js/scribe.js'

// All functions have "window." due to hint:
// https://stackoverflow.com/questions/57602686/
//   javascript-function-wont-trigger-when-called-in-html-file-during-parcel-build

/**  sample code only
window.listNeckStrings = function() {
  const n = new GuitarNeck()
  alert(n.listStrings())
}
*/

/** Start the application */
window.startRecord = function() {
  if (window.app) {
    return
  }
  window.app = new Application()
  window.app.start()
}

window.printRecord = function() {
  const content = JSON.stringify(window.app.notes)
  const display = document.getElementById('recorded')
  display.innerHTML = content
}

window.onloadBody = function() {
  // In prod, hide dev tools.
  // there is probably a much better way to do this,
  // but this is fine for now.
  if (process.env.NODE_ENV !== 'development') {
    document.getElementById('btnAddRandom').style.display = 'none';
  }
}

/** Hack helper during dev, add a random frequency. */
window.addRandom = function() {
  startRecord()
  const freq = Math.floor(Math.random() * 200) + 200
  const n = {
    name: '?', value: '?', cents: 0, octave: 0, frequency: freq, standard: freq
  }
  window.app.update(n)
}


// Thanks to https://stackoverflow.com/questions/49968622/auto-scroll-a-horizontal-div
// for rawtab autoscroll

var autoscrollInterval = null

window.addEventListener('load', () => {
  const rawtabContainer = document.getElementById('rawtabcontainer')
  const rawtabScrollWidth = rawtabContainer.scrollWidth

  autoscrollInterval = self.setInterval(() => {
    if (rawtabContainer.scrollLeft !== rawtabScrollWidth) {
      rawtabContainer.scrollTo(rawtabContainer.scrollLeft + 1, 0)
    }
  }, 15)
})


var tabselector = null

/** Stop the application */
window.stopRecord = function() {
  window.clearInterval(autoscrollInterval)
  const rawtabContainer = document.getElementById('rawtabcontainer')
  rawtabContainer.scrollTo(0,0)
  tabselector = new Tabselector(window.app.strings.length, window.app.notes.length)
  tabselector.init()
}


/** Get tab */
window.getTab = function() {
  const rawtab = window.app.rawtabdata()
  // console.log(rawtab)
  const strings = tabselector.strings
  const result = []
  for (var i = 0; i < rawtab.length; i++) {
    const s = strings[i]
    let curr = {}
    switch (s.type) {
    case 'chord':
      curr = result[result.length - 1]
      break
    case 'tone':
      result.push(curr)
      break
    default:
      throw `Bad type ${s.type}`
    }
    curr[s.string] = rawtab[i][s.string]
  }
  window.alert(JSON.stringify(result))
  // TODO - create arrayscribe, write out data

  const scribe = new Scribe(window.app.strings.length)
  const scribetab = scribe.tab(result)
  const tabout = scribetab.map(a => a.join('<br />')).join('<br /><br /><br />')
  const tabdest = document.getElementById('tabdest')
  tabdest.innerHTML = tabout
}
