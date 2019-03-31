const m = require('mithril').default
var Player = require("../models/Player")

module.exports = {
  oninit: function(vnode) {
    console.log('ay', vnode.attrs)
    Player.load(vnode.attrs.username)
  },
  view: function() {
    return m("div", {class: "row"}, [
      m("div.col-sm-6", [
        m("h1", Player.current.username)
      ]),
      m("div.col-sm-6", [
        m("h1", Player.current.username)
      ])
    ])
  }
}
