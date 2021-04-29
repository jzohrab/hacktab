import { Application } from './js/app.js'
import { ApplicationController } from './js/appcontroller.js'
import { Tabselector } from './js/tabselector.js'
import { Scribe } from './js/scribe.js'
import { VextabScribe } from './js/vextabscribe.js'
import { Fretboard } from '@moonwave99/fretboard.js';

// All functions have "window." due to hint:
// https://stackoverflow.com/questions/57602686/
//   javascript-function-wont-trigger-when-called-in-html-file-during-parcel-build


window.onloadBody = function() {
  // In prod, hide dev tools.
  // there is probably a much better way to do this,
  // but this is fine for now.
  if (process.env.NODE_ENV === 'development') {
    const el = document.getElementById('devControls')
    if (el) {
      el.style.display = 'block';
    }
  }
  window.openTab('btnVextab', 'finalvextab')

  // TODO - note that startRecord creates new instances ... shouldn't, though.
  window.app = new Application({})
  window.appcontroller = new ApplicationController(window.app)
}


const enableButtons = function(hsh) {
  const es = Object.entries(hsh)
  for (var i = 0; i < es.length; i++) {
    const e = es[i]
    document.getElementById(e[0]).disabled = !e[1]
  }
}


/** Start the application */
window.startRecord = function() {
  // TODO - move these options to start() ?
  const minfret = document.getElementById('minFret').value || 0
  const maxfret = document.getElementById('maxFret').value || 12
  const vextabopts = document.getElementById('vextabopts').value || null
  const opts = { min: minfret, max: maxfret, vextabopts: vextabopts }
  window.app = new Application(opts)
  window.appcontroller = new ApplicationController(window.app)
  window.appcontroller.start()
  enableButtons({ btnStart: false, btnStop: true })
}

window.printRecord = function() {
  let ts = tabselector || { currNote: '(not editing)' }
  const output = [
    `VEXTAB: ${window.app.vextab()}`,
    `APP CURSOR: ${window.app.cursor}`,
    `TABSEL CURSOR: ${ts.currNote}`,
    `LINE:<br /><pre>${JSON.stringify(window.app.line, null, 2)}</pre>`,
  ]
  const display = document.getElementById('recorded')
  display.innerHTML = '<br />' + output.join("<hr />")
}

/** Hack helper during dev, add a random frequency. */
window.addRandom = function() {
  var count = window. prompt("Number of notes to add:", 5)
  count = parseInt(count, 10)
  startRecord()
  for (var i = 0; i < count; i++) {
    const freq = Math.floor(Math.random() * 50) + 200
    window.appcontroller.app.add_frequency(freq)
  }
}

// TODO get rid of this?
var tabselector = null

/** Stop the application and scrolling */
window.stopRecord = function() {
  window.appcontroller.stop()
  enableButtons({ btnStop: false })
  tabselector = new Tabselector(window.app, window.renderTab)
  tabselector.init()
}


/** Remove keyboard listener. */
window.stopEditing = function() {
  if (!tabselector)
    return
  tabselector.stop()
}

/** Toggle tabs.
 * ref https://www.w3schools.com/howto/howto_js_tabs.asp
 */
window.openTab = function(btnName, tabName) {
  // Get all elements with class="tabcontent" and hide them
  var tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  var tablinks = document.getElementsByClassName("tablinks");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  document.getElementById(btnName).className += " active";
}


/** Get tab */
window.renderTab = function() {
  const scribe = new Scribe(window.app.strings.length)
  const tabout = scribe.tab(window.app.line).
        map(a => a.join('<br />')).
        join('<br /><br /><br />')
  const tabdest = document.getElementById('tabdest')
  tabdest.innerHTML = tabout

  window.appcontroller.writeVextab()
  enableButtons({ btnCopy: true })
}


window.copyTab = function() {
  var copyText = document.getElementById("tabdest")
  var textArea = document.createElement("textarea")
  textArea.value = copyText.innerHTML.
    replace(/<br>/g, '\n').
    replace(/<br \/>/g, '\n')
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand("Copy")
  textArea.remove()
  document.getElementById("copied").style.display = 'inline'
}
