const m = require("mithril").default
var PlayerList = require("./views/PlayerList")
var PlayerView = require("./views/PlayerView")
var Layout = require("./views/Layout")
var Home = require("./views/Home")
m.route(document.body, "/home", {
    "/list": {
      render: function() {
           return m(Layout, m(PlayerList))
       }
    },
    "/home": {
      render: function() {
           return m(Layout, m(Home))
       }
    },
    "/player/:username": {
      render: function(vnode) {
           return m(Layout, m(PlayerView, vnode.attrs))
       }
    }
})
