const m = require('mithril').default
var Player = require("../models/Player")

function PieChart() {
    var piechart
    return {
        oncreate: function(vnode) {
            Player.current.exs_time = Player.current.total_playtime - Math.round(Player.current.total_battle_time) - Player.current.total_distracted - Player.current.total_idle
            console.log(Player.current.exs_time)
            // Initialize 3rd party lib here
            pieChart = new Chart(vnode.dom, {
                type: 'doughnut',
                data: {
                      datasets: [{
                          label: "Time Usage",
                          data: [Math.round(Player.current.total_battle_time), Player.current.total_distracted, Player.current.total_idle, Player.current.exs_time],
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
                      }],
                      labels: [
                          'Battle',
                          'Distracted',
                          'Idle',
                          'Misc'
                      ],

                },
                options: {
                  title: {
          					display: true,
          					text: 'Time Spent'
          				},
                }
            });
            m.redraw()
        },
        onremove: function() {
            // Cleanup 3rd party lib on removal
            pieChart.destroy()
        },
        view: function() {
            return m('canvas#pieChart')
        }
    }
}

function RadarChart() {
    var RadarChart
    return {
      oncreate: function(vnode) {
          // Initialize 3rd party lib here

          barChart = new Chart(vnode.dom, {
              type: 'radar',
              data: {
                  labels: ['Persistence','Help-Seeking', 'Environment Structuring', 'Time Management'],
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
                      data: [Player.current.total_pattern_A, Player.current.total_pattern_B, Player.current.total_pattern_C, Player.current.total_pattern_D]
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
          return m('canvas#barChart')
      }
  }
}

function BarChart() {
    var barChart
    return {
        oncreate: function(vnode) {
            // Initialize 3rd party lib here

            barChart = new Chart(vnode.dom, {
                type: 'bar',
                data: {
                    labels: ['A', 'B', 'C', 'D'],
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
                        data: [Player.current.total_pattern_A, Player.current.total_pattern_B, Player.current.total_pattern_C, Player.current.total_pattern_D]
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
            return m('canvas#barChart')
        }
    }
}


function LineChart() {
    var lineChart
    return {
        oncreate: function(vnode) {
            // Initialize 3rd party lib here
            var scheds = []
            for ( let i = 0; i < Player.current.schedule.length; i++) {
              scheds.push(Player.current.schedule[i].deadline)
            }
            lineChart = new Chart(vnode.dom, {
                type: 'line',
                data: {
                    labels: [new Date().toLocaleString(), new Date("July 21, 1983 01:15:00").toLocaleString(), new Date("July 21, 1983 01:15:00").toLocaleString(), new Date("July 21, 1983 01:15:00").toLocaleString(), new Date("July 21, 1983 01:15:00").toLocaleString(), new Date("July 21, 1983 01:15:00").toLocaleString(), new Date("July 21, 1983 01:15:00").toLocaleString(), new Date("July 21, 1983 01:15:00").toLocaleString(), new Date().toLocaleString(), new Date().toLocaleString(), new Date().toLocaleString(), new Date().toLocaleString(),new Date().toLocaleString()],
                    datasets: [{
                        label: "Accuracy",
                        data: [85, 68, 97, 100, 76, 85, 85, 75, 85, 85, 75, 85, 75]
                    },
                    {
                        label: "SRL Score",
                        data: [5, 8, 7, 5, 2, 6, 17, 1, 85, 85, 75, 85, 75]
                    }
                  ]
                },
                options: {
                  title: {
          					display: true,
          					text: 'Accuracy vs SRL'
          				}
                }
            });
            m.redraw()
        },
        onremove: function() {
            // Cleanup 3rd party lib on removal
            lineChart.destroy()
        },
        view: function() {
            return m('canvas#lineChart')
        }
    }
}


module.exports = {
  oninit: function(vnode) {
    console.log('ay', vnode.attrs)
    if(Player.list.length == 0) {
      Player.loadList()
      m.redraw()
    }
    Player.load(vnode.attrs.username)
  },
  onupdate: function(vnode) {
    if(Player.current == undefined) {
        Player.load(vnode.attrs.username)
    }
  },
  view: function() {
    return m("div", renderPage(Player.current))
  }
}
function renderPage(obj) {
  if(obj) {
    return m("div", [
      m("div.row", [
        m("div.col-sm-4", [
          m("div", {class: "card fluid"}, [
            m("div.section", [
                m("div.row", [
                  m("div.col-sm-9", [
                    m("h1", Player.current.username),
                  ]),
                  m("div.col-sm-3", [
                    m("h2[style=color: green; text-align: right;]", {class:"tooltip bottom", "aria-label": "LA Score"}, 6969),
                  ])
                ])
            ]),
            m("div.section", [
              m("div.row", [
                m("div.col-sm-9", [
                      m("p", "Completion:"),
                ]),
                m("div.col-sm-3", [
                      m("p", ((Player.current.story/40.0)*100 > 100 ? 100 : (Player.current.story/40.0)*100).toString() +"%"),
                ]),
              ]),
              m("div.row", [
                m("div.col-sm-9", [
                      m("p", "Sessions:"),
                ]),
                m("div.col-sm-3", [
                      m("p", Player.current.session-1),
                ]),
              ]),
              m("div.row", [
                m("div.col-sm-9", [
                      m("p", "Review Count:"),
                ]),
                m("div.col-sm-3", [
                      m("p", Player.current.review_count),
                ]),
              ]),
              m("div.row", [
                m("div.col-sm-9", [
                      m("p", "Unskipped Items:"),
                ]),
                m("div.col-sm-3", [
                      m("p", Player.current.total_items - Player.current.total_skips),
                ]),
              ]),
              m("div.row", [
                m("div.col-sm-9", [
                      m("p", "Assistance Usage:"),
                ]),
                m("div.col-sm-3", [
                      m("p", Math.round((Player.current.total_correct/(Player.current.total_correct + Player.current.total_possible_correct)) * 100).toString() + "%"),
                ]),
              ]),
              m("div.row", [
                m("div.col-sm-9", [
                      m("p", "Time Utilization:"),
                ]),
                m("div.col-sm-3", [
                      m("p", Math.round(((Player.current.total_items-Player.current.total_pattern_D)/(Player.current.total_items)) * 100).toString() + "%"),
                ]),
              ]),
              m("div.row", [
                m("div.col-sm-9", [
                      m("p", "Overall Accuracy:"),
                ]),
                m("div.col-sm-3", [
                      m("p", Math.round(((Player.current.total_correct)/(Player.current.total_items)) * 100).toString() + "%"),
                ]),
              ]),

              ]),

            ])
          ]),
        m("div.col-sm-8", [
          m("div.row", [
            m("div.col-sm-6", [
              m("div", {class: "card fluid"}, [
                m("div.section", [
                  m("h1", "Time Usage"),
                ]),
                m("div.section", [
                  m(PieChart),
                ]),
                m("div.section", [
                  m("small[style=text-align: center;]","Misc due to timeout counters")
                ]),
              ])
            ]),
            m("div.col-sm-6", [
              m("div", {class: "card fluid"}, [
                m("div.section", [
                  m("h1", "Persistence"),
                ]),
                m("div.section", [
                  m(BarChart),
                ]),
                m("div.section", [
                  m("small[style=text-align: center;]","Patterns are defined in the paper")
                ]),
              ])
            ])
          ])
        ]),
      ]),

      m("div.row", [
        m("div.col-sm-3", [
            m("div[style=padding: 10px 0px]", {class: "card fluid"}, [
              m("div.section", [
                m("h1", "Character Accuracy")
              ]),
              m("div.section", [
                m("div.row", [
                  m("div.col-sm-4", [
                        m("p[style=font-weight:bold;]", "Character"),
                  ]),
                  m("div.col-sm-4", [
                        m("p[style=font-weight:bold;]", "Encounters"),
                  ]),
                  m("div.col-sm-4", [
                        m("p[style=font-weight:bold;]", "Accuracy"),
                  ]),
                ]),
                renderCharacters(Player.current.encounters)
              ])
            ])
        ]),
        m("div.col-sm-4", [
          m("div[style=padding: 10px 0px]", {class: "card fluid"}, [
            m("div.section", [
              m("h1", "Dungeon Schedule")
            ]),
            m("div.section", [
              m("div.row", [
                m("div.col-sm-4", [
                      m("p[style=font-weight:bold;]", "Dungeon"),
                ]),
                m("div.col-sm-4", [
                      m("p[style=font-weight:bold;]", "Deadline"),
                ]),
                m("div.col-sm-4", [
                      m("p[style=font-weight:bold;]", "Submitted"),
                ]),
              ]),
              renderDungeons(Player.current.schedule)
            ]),
          ])
        ]),
        m("div.col-sm-5", [
          m("div[style=padding: 10px 0px]", {class: "card fluid"}, [
            m("div.section", [
              m("h1", "SRL vs Accuracy per Dungeon")
            ]),
            m("div.section", [
              m(LineChart),
            ]),
          ])
        ]),
        m("div.col-sm-5", [
          m("div[style=padding: 10px 0px]", {class: "card fluid"}, [
            m("div.section", [
              m("h1", "Skills")
            ]),
            m("div.section", [
              m(RadarChart),
            ]),
          ])
        ]),


    ])
  ])
  } else {
    console.log('ay wow')
    return m("div.row[style=margin: 0 auto; padding: 90px 50%;text-align: center;display: inline-block;]", [
        m("div.spinner"),
        m("h3", "Loading hehe")
    ])
  }


}

function renderCharacters(list) {

  if (list.length > 0) {
    console.log('ay wow!')
    return list.map(function(chara) {
        return m("div.row", [
          m("div.col-sm-4", [
                m("p", chara.character),
          ]),
          m("div.col-sm-4", [
                m("p", chara.total),
          ]),
          m("div.col-sm-4", [
                m("p",  Math.round(chara.accuracy*100)),
          ]),
        ])
    })
  } else {
    console.log('ay wow')
    return m("div.row[style=margin: 0 auto; padding: 90px 50%;text-align: center;display: inline-block;]", [
        m("div.spinner"),
        m("h3", "Loading hehe")
    ])
  }
}

function renderDungeons(list) {

  if (list.length > 0) {
    console.log('ay wow!')
    return list.map(function(item) {
        return m("div.row", [
          m("div.col-sm-4", [
                m("p", item.dungeon),
          ]),
          m("div.col-sm-4", [
                m("p", item.deadline),
          ]),
          m("div.col-sm-4", [
                m("p", item.submitted != undefined ? item.submitted : '-'),
          ]),
        ])
    })
  } else {
    console.log('ay wow')
    return m("div.row[style=margin: 0 auto; padding: 90px 50%;text-align: center;display: inline-block;]", [
        m("div.spinner"),
        m("h3", "Loading hehe")
    ])
  }
}
