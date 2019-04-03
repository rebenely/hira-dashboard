const m = require('mithril').default
var Player = require("../models/Player")

module.exports = {
  oninit: Player.loadList,
  oncreate: Player.getAllSrl,
  onupdate: Player.getAllSrl,
  view: function() {
    return m("div[style='text-align:center;margin: auto;padding: 70px 0;']", [
      m("h1[style='font-size:4rem']", "Welcome to Hira Dashboard!"),
      renderPlayerCount(Player.list),
      renderBestAccuracy(Player.getTopPlayerAccuracy()),
      renderBestProgress(Player.getTopPlayerProgress()),
      renderSRLChart(Player.list)
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

function BarChart(playas) {
  var barChart
  return {
      oncreate: function(vnode) {
          // Initialize 3rd party lib here

          barChart = new Chart(vnode.dom, {
              type: 'bar',
              data: {
                  labels: playas.map(a => a.username),
                  datasets: [{
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                    ],
                      label: "Dungeon Runs",
                      data: playas.map(a => (a.pe+a.hs+a.es+a.tm))
                  }]
              },
              options: {
                title: {
                  display: true,
                  text: 'Pattern'
                }
              }
          });
          m.redraw()
      },
      onremove: function() {
          // Cleanup 3rd party lib on removal
          barChart.destroy()
      },
      view: function() {
          return m('canvas#bah2", "lmao"rChart')
      }
  }
}

function renderSRLChart(playas) {
  if(playas.length > 0) {
      
      console.log(playas.map(a => a.username))
      console.log(playas.map(b => b.pe))
      console.log("==========================")
      console.log(playas)
      console.log("---------------------------")
      return m("div.section", [
      m("div[style=padding: 10px 0px]", {class: "card fluid"}, [
        m("div.section", [
          m("h1", "SRL of All Players")
        ]),
        m("div.section", [
          m("h2", "lmao"),
        ]),
      ])
    ])
  }
}