const m = require("mithril").default

module.exports = {
    view: function(vnode) {
      return m("div.layout", [
           m("header", [
               m("a[href='/home']", {class: "button", oncreate: m.route.link}, "Home"),
               m("a[href='/list']", {class: "button", oncreate: m.route.link}, "Players")
           ]),
           m("div.container", vnode.children)
       ])
    }
}
