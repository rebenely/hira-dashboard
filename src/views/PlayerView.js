const m = require('mithril').default
var Player = require("../models/Player")

var FilteredPages = {
  controller : function(){
    this.filter = ''
    this.index  = 0
  },

  view : function( ctrl, pageLength, items ){
    return m( '.FilteredPages',
      m( 'input', {
        value : ctrl.filter,
        oninput : function(){
          ctrl.filter = this.value
          ctrl.index  = 0
        }
      } ),

      m( 'p',
        m( 'a', {
          innerHTML : 'Back',
          onclick   : function(){
            if( ctrl.index > 0 )
              ctrl.index--
          }
        } ),

        ' ',

        m( 'a', {
          innerHTML : 'Next',
          onclick   : function(){
            var newIndex = ctrl.index + 1

            if( newIndex < items / pageLength )
              ctrl.index = newIndex
          }
        } )
      ),

      m( '.page',
        items
          // Filter the items according to your requirements
          .filter( function( item ){ return item.includes( ctrl.filter ) } )
          // Paginate the filtered list using our reducer
          .reduce( paginate, [] )
          // Take the page at the current index
          [ ctrl.index ]
            // Map over the items on this page
            .map( function( item ){
              // Produce a view for each item
              return m( 'p', item )
            } )
      )
    )
  }
}

function PieChart() {
    var piechart
    return {
        oncreate: function(vnode) {
            Player.current.exs_time = Player.current.total_playtime - Math.round(Player.current.total_battle_time) - Player.current.total_distracted - Player.current.total_idle
            // Initialize 3rd party lib here
            pieChart = new Chart(vnode.dom, {
                type: 'doughnut',
                data: {
                      datasets: [{
                          label: "Time Usage",
                          data: [Math.round(Player.current.total_battle_time), Player.current.total_distracted, Player.current.total_idle],
                          backgroundColor: [
                              'rgba(255, 99, 132, 0.7)',
                              'rgba(54, 162, 235, 0.7)',
                              'rgba(255, 206, 86, 0.7)',
                          ],
                          borderColor: [
                            'rgba(255, 99, 132, 1.4)',
                            'rgba(54, 162, 235, 1.4)',
                            'rgba(255, 206, 86, 1.4)',
                          ],
                      }],
                      labels: [
                          'Battle',
                          'Distracted',
                          'Idle'
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

          radarChart = new Chart(vnode.dom, {
              type: 'radar',
              data: {
                  labels: ['Persistence','Help-Seeking', 'Environment Structuring', 'Time Management'],
                  datasets: [{
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(66, 247, 81, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(66, 247, 81, 1)',
                    ],
                      label: "Your Skill",
                      data: [Player.current.pe, Player.current.hs, Player.current.es, Player.current.tm]
                  }]
              },
              options: {
                title: {
                  display: true,
                  text: 'SRL Skills'
                }
              }
          });
          m.redraw()
      },
      onremove: function() {
          // Cleanup 3rd party lib on removal
          radarChart.destroy()
      },
      view: function() {
          return m('canvas#radarChart')
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
                    labels: ['Fast-Correct', 'Slow-Correct', 'Slow-Incorrect', 'Fast-Incorrect'],
                    datasets: [{
                      backgroundColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 2)',
                        'rgba(54, 162, 235, 2)',
                        'rgba(255, 206, 86, 2)',
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
            lineChart = new Chart(vnode.dom, {
                type: 'line',
                data: {
                  labels: Player.current.schedule.map(a => a.submitted!=undefined ? a.submitted : a.deadline ),
                  datasets: [{
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                      label: "Accuracy",
                      data: Player.current.schedule.map(a=> a.accuracy!=undefined ? a.accuracy : 0 )
                  }
                  ]
                },
                options: {
                  title: {
          					display: true,
          					text: 'Accuracy per Dungeon'
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
    if(Player.list.length == 0) {
      Player.loadList()
      m.redraw()
    }
    Player.load(vnode.attrs.username)
  },
  oncreate: function(vnode) {
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
    Player.getAllSrl();
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
                    m("h2[style=color: green; text-align: right;]", {class:"tooltip bottom", "aria-label": "LA Score"}, (Player.current.pe + Player.current.hs + Player.current.es + Player.current.tm).toFixed(2)),
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
                      m("p", Player.current.session),
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
                      m("p", "Skipped Items:"),
                ]),
                m("div.col-sm-3", [
                      m("p", Player.current.total_skips == undefined ? 0 : Player.current.total_skips ),
                ]),
              ]),
              m("div.row", [
                m("div.col-sm-9", [
                      m("p", "Overall Accuracy:"),
                ]),
                m("div.col-sm-3", [
                      m("p", (isNaN(Player.current.total_correct/Player.current.total_items) || !isFinite(Player.current.total_correct/Player.current.total_items) || Player.current.total_correct/Player.current.total_items == undefined ? 0 : Math.round((Player.current.total_correct*100)/Player.current.total_items )).toString() + "%"),
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
                  m("small[style=text-align: center;]","Does not necessarily show all time usage but proportions")
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
              m("h1", "Accuracy per Dungeon")
            ]),
            m("div.section", [
              m(LineChart),
            ]),
          ]),

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
    return m("div.row[style=margin: 0 auto; padding: 90px 50%;text-align: center;display: inline-block;]", [
        m("div.spinner"),
        m("h3", "Loading"),
        m("h6", "or no data captured yet...")
    ])
  }


}

function renderCharacters(list) {

  if (list.length > 0) {
    return m("div", [
      list.slice(0, 13).map(function(chara) {
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
      }),
      m("label[style=cursor:pointer;text-align:center;margin: auto;]", {"for": "modal-control", "class": "button"}, "Show All"),
      m("input[style=cursor:pointer;]", {"type": "checkbox", "class": "modal", "id": "modal-control"}),
      m("div.row", [
        m("div.card", [
          m("label.modal-close", {"for": "modal-control"}),
          m("h3", "Character Accuracy"),
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
            list.map(function(chara) {
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
            }),
          ])
        ])

      ]),
    ])

  } else {
    return m("div.row[style=margin: 0 auto; padding: 20px 30%;text-align: center;display: inline-block;]", [
        m("div.spinner"),
        m("h3", "Loading"),
        m("h6", "or no data captured yet...")
    ])
  }
}

function renderDungeons(list) {

  if (list.length > 0) {
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
    return m("div.row[style=margin: 0 auto; padding: 20px 30%;text-align: center;display: inline-block;]", [
        m("div.spinner"),
        m("h3", "Loading"),
        m("h6", "or no data captured yet...")
    ])
  }
}

var FilteredPages = {
  controller : function(){
    this.filter = ''
    this.index  = 0
  },

  view : function( ctrl, pageLength, items ){
    return m( '.FilteredPages',
      m( 'input', {
        value : ctrl.filter,
        oninput : function(){
          ctrl.filter = this.value
          ctrl.index  = 0
        }
      } ),

      m( 'p',
        m( 'a', {
          innerHTML : 'Back',
          onclick   : function(){
            if( ctrl.index > 0 )
              ctrl.index--
          }
        } ),

        ' ',

        m( 'a', {
          innerHTML : 'Next',
          onclick   : function(){
            var newIndex = ctrl.index + 1

            if( newIndex < items / pageLength )
              ctrl.index = newIndex
          }
        } )
      ),

      m( '.page',
        items
          // Filter the items according to your requirements
          .filter( function( item ){ return item.includes( ctrl.filter ) } )
          // Paginate the filtered list using our reducer
          .reduce( paginate, [] )
          // Take the page at the current index
          [ ctrl.index ]
            // Map over the items on this page
            .map( function( item ){
              // Produce a view for each item
              return m( 'p', item )
            } )
      )
    )
  }
}
