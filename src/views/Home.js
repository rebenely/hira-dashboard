const m = require('mithril').default
var Player = require("../models/Player")

module.exports = {
  oninit: Player.loadList,
  view: function() {
    return m("div[style='text-align:center;margin: auto;padding: 70px 0;']", [
      m("h1[style='font-size:4rem']", "Welcome to Hira Dashboard!"),
      renderPlayerCount(Player.list),
      renderBestAccuracy(Player.getTopPlayerAccuracy()),
      renderBestProgress(Player.getTopPlayerProgress()),

    ])
  }
}

function renderBestAccuracy(playa) {
  if(playa != undefined) {
    return m("h1[style='font-size:3rem']", [
       m("span[style=color: lightblue;cursor:pointer;]", {href: "/player/" + playa.username, oncreate: m.route.link}, playa.username),
       " leads the accuracy ranking!"
    ])
  }
}
function renderBestProgress(playa) {
  if(playa != undefined) {
    return m("h1[style='font-size:3rem']", [
       m("span[style=color: lightblue;cursor:pointer;]", {href: "/player/" + playa.username, oncreate: m.route.link}, playa.username),
       " leads the completion ranking!"
    ])
  }
}

function renderPlayerCount(playas) {
  if(playas.length > 0) {
    return   m("div.section", [
        m("h2", "There are currently " + playas.length + " players registered"),
      ])
  } else {
    return m("div.row[style=margin: 0 auto; padding: 50px 0%;text-align: center;display: inline-block;]", [
        m("div.spinner"),
        m("h3", "Loading hehe")
    ])
  }
}
