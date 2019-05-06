const m = require('mithril').default
var Player = require("../models/Player")

module.exports = {
  oninit: Player.loadList,
  view: function() {
    return m("div[style=margin: auto]", {class: "row"}, renderPlayers(Player.list))
  }
}

function renderPlayers(list) {

  if (list.length > 0) {
    return list.map(function(user) {
        return m("div[style=margin: 10px 5px;]", {class :"card small"}, [
           m("div.section[style=cursor:pointer;]", {href: "/player/" + user.username, oncreate: m.route.link},[
             m("h5",  user.username)
           ]),
           m("div.section", [
             m("div.row", [
               m("div.col-sm-7", [
                     m("p", "Completion:"),
               ]),
               m("div.col-sm-5", [
                     m("p",((user.story/40.0)*100 > 100 ? 100 : (user.story/40.0)*100).toString() +"%"),
               ]),
             ]),
             m("div.row", [
               m("div.col-sm-7", [
                     m("p", "Sessions:"),
               ]),
               m("div.col-sm-5", [
                     m("p", user.session - 1),
               ]),
             ]),
             m("div.row", [
               m("div.col-sm-7", [
                     m("p", "Total Playtime:"),
               ]),
               m("div.col-sm-5", [
                     m("p", Math.floor(user.total_playtime / 3600) + "h" + (user.total_playtime/60 % 60 ? Math.round(user.total_playtime/60 % 60) : '00') + 'm'),
               ]),
             ]),

           ])
        ])
    })
  } else {
    return m("div.row[style=margin: 0 auto; padding: 90px 50%;text-align: center;display: inline-block;]", [
        m("div.spinner"),
        m("h3", "Loading"),
        m("h6", "or no data captured yet...")
    ])
  }
}
