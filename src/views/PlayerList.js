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
    console.log('ay wow')
    return list.map(function(user) {
        return m("div[style=margin: 10px 5px;]", {class :"card small"}, [
           m("div.section[style=cursor:pointer;]", {href: "/player/" + user.firstName, oncreate: m.route.link},[
             m("h5",  user.firstName + " " + user.lastName)
           ]),
           m("div.section", [
             m("p", "Completion : 69%")
           ])
        ])
    })
  } else {
    console.log('ay wow')
    return m("h3[style=margin: auto; padding: 70px 0;]", "Loading hehe")
  }
}
