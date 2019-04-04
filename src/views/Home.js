const m = require('mithril').default
var Player = require("../models/Player")

module.exports = {
  oninit: Player.loadList,
  onupdate: Player.getAllSrl,
  view: function() {
    return m("div[style='text-align:center;margin: auto;padding: 70px 0;']", [
      m("h1[style='font-size:4rem']", "Welcome to Hira Dashboard!"),
      renderPlayerCount(Player.list),
      renderBestAccuracy(Player.getTopPlayerAccuracy()),
      renderBestSRL(Player.getTopPlayerSRL()),
      renderFinishedList(Player.getPlayerCompleted()),
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
function renderBestSRL(playa) {
  if(playa != undefined) {
    return m("h1[style='font-size:3rem']", [
       m("span[style=color: lightblue;cursor:pointer;]", {href: "/player/" + playa.username, oncreate: m.route.link}, playa.username),
       " leads the SRL ranking!"
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
        m("h3", "Loading"),
        m("h6", "or no data captured yet...")
    ])
  }
}

function TryChart() {
  var barChart
  console.log(Player.list.sort(
    function(a,b){
      return (isNaN(b.total_correct/b.total_items)||!isFinite(b.total_correct/b.total_items)? 0 : b.total_correct/b.total_items) - (isNaN(a.total_correct/a.total_items)||!isFinite(a.total_correct/a.total_items)? 0 : a.total_correct/a.total_items)  
    }
  ).map(a => (isNaN(a.total_correct/a.total_items)||!isFinite(a.total_correct/a.total_items)? 0 : a.total_correct/a.total_items)))
  return {
      oncreate: function(vnode) {
          // Initialize 3rd party lib here

          barChart = new Chart(vnode.dom, {
              type: 'bar',
              data: {
                  labels: Player.list.sort(
                    function(a,b){
                      return (isNaN(b.total_correct/b.total_items)||!isFinite(b.total_correct/b.total_items)? 0 : b.total_correct/b.total_items) - (isNaN(a.total_correct/a.total_items)||!isFinite(a.total_correct/a.total_items)? 0 : a.total_correct/a.total_items)  
                    }
                  ).map(a => a.username),
                  datasets: [{
                    backgroundColor: 'rgba(66, 194, 244, 1)',
                    borderColor:'rgba(66, 194, 244, 2)',
                    label: "Accuracy (%)",
                    data: Player.list.sort(
                      function(a,b){
                        return (isNaN(b.total_correct/b.total_items)||!isFinite(b.total_correct/b.total_items)? 0 : b.total_correct/b.total_items) - (isNaN(a.total_correct/a.total_items)||!isFinite(a.total_correct/a.total_items)? 0 : a.total_correct/a.total_items)  
                      }
                    ).map(a => (isNaN(a.total_correct/a.total_items)||!isFinite(a.total_correct/a.total_items)? 0 : (a.total_correct/a.total_items)*100))
                  },{
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor:'rgba(255, 99, 132, 2)',
                    label: "SRL Score",
                    data: Player.list.sort(
                      function(a,b){
                        return (isNaN(b.total_correct/b.total_items)||!isFinite(b.total_correct/b.total_items)? 0 : b.total_correct/b.total_items) - (isNaN(a.total_correct/a.total_items)||!isFinite(a.total_correct/a.total_items)? 0 : a.total_correct/a.total_items)  
                      }
                    ).map(a => (a.pe+a.hs+a.es+a.tm))
                  }]
              },
              options: {
                title: {
                  display: true,
                  text: 'Accuracy vs Srl Score'
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

function renderFinishedUsers (finished, row) {
  console.log(finished)
  if (finished.length > 0){
    return finished.map(function(a, index) {
      return  [m("div.col-sm-1[style=text-align: right;]", [m("p", (index*8)+row)]),
            m("div.col-sm-1[style=padding-right: 0;text-align: left;]", [m("p", a.username)])]
    })
  }
}

function renderFinishedList(finished) {
  return m("div.section", {class: "card fluid"}, [
      m("h2", "Players who have accomplished the game. (Ranked by date finished)"),
      m("div.row",[ //row 1
      renderFinishedUsers(
        finished.reduce((output,cur,index,)=>{
          if(index%8==0){
            output.push(cur)
          }
          return output
        }, [])
      ,1)]),
      m("div.row",[ //row 2
      renderFinishedUsers(
        finished.reduce((output,cur,index,)=>{
          if(index%8==1){
            output.push(cur)
          }
          return output
        }, [])
      ,2)]),
      m("div.row",[// row 3
      renderFinishedUsers(
        finished.reduce((output,cur,index,)=>{
          if(index%8==2){
            output.push(cur)
          }
          return output
        }, [])
      ,3)]),
      m("div.row",[// row 4
      renderFinishedUsers(
        finished.reduce((output,cur,index,)=>{
          if(index%8==3){
            output.push(cur)
          }
          return output
        }, [])
      ,4)]),
      m("div.row",[// row 5
      renderFinishedUsers(
        finished.reduce((output,cur,index,)=>{
          if(index%8==4){
            output.push(cur)
          }
          return output
        }, [])
      ,5)]),
      m("div.row",[// row 6
      renderFinishedUsers(
        finished.reduce((output,cur,index,)=>{
          if(index%8==5){
            output.push(cur)
          }
          return output
        }, [])
      ,6)]),
      m("div.row",[// row 7
      renderFinishedUsers(
        finished.reduce((output,cur,index,)=>{
          if(index%8==6){
            output.push(cur)
          }
          return output
        }, [])
      ,7)]),
      m("div.row",[// row 8
      renderFinishedUsers(
        finished.reduce((output,cur,index,)=>{
          if(index%8==7){
            output.push(cur)
          }
          return output
        }, [])
      ,8)]),
    ])
}


function renderSRLChart(playas) {
  if(playas.length > 0) {
      //Player.getAllSrl();
      return m("div.section", [
      m("div[style=padding: 10px 0px]", {class: "card fluid"}, [
        m("div.section", [
          m("h1", "SRL of All Players")
        ]),
        m("div.section", [
          m(TryChart),
        ]),
      ])
    ])
  }
}