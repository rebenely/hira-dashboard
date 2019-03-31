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
        m("div", {class: "card fluid"}, [
          m("div.section", [
            m("h1", Player.current.username)
          ]),
          m("div.section", [
            m("div.row", [
              m("div.col-sm-3", [
                  m("p", "Completion : 69%"),
                  m("p", "Assistance Usage: 87%"),
              ]),
              m("div.col-sm-3", [
                  m("p", "Sessions : 420"),
                  m("p", "Time Utilization: 69%"),
              ]),

              m("div.col-sm-3", [
                  m("p", "Review Count: 2"),
                  m("p", "Overall Dungeon Accuracy: 69%"),
              ]),

              m("div.col-sm-3", [
                  m("p", "Unskipped Items: 87%"),
                  m("p[style=color: green;]", "SRL Score: 6969"),
              ]),

            ]),
            m("div.row", [



            ]),

          ])
        ])
      ]),
      m("div.col-sm-6", [
        m("h1", Player.current.username)
      ])
    ])
  }
}
