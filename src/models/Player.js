var m = require("mithril")
var moment = require("moment")
var Player = {
  uri: "http://hira-gumagana.herokuapp.com/",
  current: {},
  list: [],
  loadList: function () {
    return m.request({
      method: "GET",
      url: Player.uri + "api/players",
      withCredentials: false,
      background: true
    })
    .then(function(result) {
      console.log(result)
      Player.list = result.players
      m.redraw()
    })
  },
  getTopPlayerAccuracy: function () {
    var maxInd = 0;
    for(let i = 0; i < Player.list.length; i++){
      if(Player.list[maxInd].total_correct/Player.list[maxInd].total_items < Player.list[i].total_correct/Player.list[i].total_items) {
        maxInd = i;
      }
    }
    return Player.list[maxInd]
  },
  getAllSrl: function() {
    var ac = 0; //Accuracy vs Character
    var ru = 0; //Review Utilization
    var sc = 0; //Schedule Compliance
    for (let i = 0; i < Player.list.length; i++){
      //AvC
      for (let j = 0; j < Player.list[i].encounters.length; j++){
        ac += Player.list[i].encounters[j].accuracy;
      }
      ac/=Player.list[i].encounters.length;

      Player.list[i].pers = (
        //Time vs Accuracy 
          (.3*((Player.list[i].total_pattern_B+Player.list[i].total_pattern_C)/(Player.list[i].total_items-Player.list[i].total_pattern_A))) +
        //Accuracy vs Character
          (.35*ac) +
        //Unskipped Items
          (.35*((Player.list[i].total_items-Player.list[i].total_skips)/(Player.list[i].total_items)))
      )*25;

      //RU
      if(Player.list[i].review_count < Player.list[i].schedule.length){
        ru = Player.list[i].total_correct/Player.list[i].total_items;
      }
      else{
        ru = 1;
      }

      Player.list[i].hs = (
        //Review Utilization
          (.5*(ru)) +
        //Assistance Usage
          (.5*((Player.list[i].total_correct)/(Player.list[i].total_correct +Player.list[i].total_possible_correct)))
      )*25;

      Player.list[i].es = (
        //Idle + Distraction vs Playing Time
        (Player.list[i].total_playtime-Player.list[i].total_idle-Player.list[i].total_distracted)/(Player.list[i].total_playtime)
      )*25

      for(let j = 0 ; j < Player.list[i].schedule.length ; j++){
        if (Player.list[i].schedule[j].submitted != undefined){
          if(moment(Player.list[i].schedule[j].submitted).diff(moment(Player.list[i].schedule[j].deadline), 'minutes') < 30){
            if(moment(Player.list[i].schedule[j].submitted).diff(moment(Player.list[i].schedule[j].deadline), 'minutes') >= 0 ){

            }
          }
        }
        else{

        }
      }

      Player.list[i].tm = (
        //Progress
        (.35*(Player.list[i].story*.01)) +
        //Time Utilization
        (.30*((Player.list[i].total_items-Player.list[i].total_pattern_D-total_skips)/(Player.list[i].total_items))) +
        //Schedule Compliance 
        (.35*()())
      )
    }
  },
  getTopPlayerProgress: function () {
    var maxInd = 0;
    for(let i = 0; i < Player.list.length; i++){
      if(Player.list[maxInd].story < Player.list[i].story) {
        maxInd = i;
      }
    }
    return Player.list[maxInd]
  },
  load: function (username) {
    var found = false;

    if(Player.list.length > 0) {
      for(let i = 0; i < Player.list.length; i++) {
        if(Player.list[i].username === username) {
          Player.current = Player.list[i]
          found = true
          m.redraw()
          console.log('found me')
        }
      }
    } else {
      Player.current = undefined
    }

    if(!found) {
      Player.current = undefined
    }
  }
}

module.exports = Player
