var m = require("mithril")
var moment = require("moment")
var Player = {
  uri: "http://hira-gumagana.herokuapp.com/",
  current: {},
  list: [],
  pageChars: [],
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
      Player.list[i].pe = 0;
      Player.list[i].hs = 0;
      Player.list[i].es = 0;
      Player.list[i].tm = 0;
      
      console.log(Player.list[i])

      //Time vs Acuracy
      value = ((Player.list[i].total_pattern_B+Player.list[i].total_pattern_C)/(Player.list[i].total_items-Player.list[i].total_pattern_A))
      Player.list[i].pe += isNaN(value) ? 0 : value*.3
      value = 0;

      //Acuracy vs Character
      for (let j = 0; j < Player.list[i].encounters.length; j++){
        value += Player.list[i].encounters[j].accuracy;
      }
      value/=Player.list[i].encounters.length;
      Player.list[i].pe += isNaN(value) || !isFinite(value) ? 0 : value*.35 

      //Unskipped Items
      value = ((Player.list[i].total_items-Player.list[i].total_skips)/(Player.list[i].total_items))
      Player.list[i].pe += isNaN(value) || !isFinite(value) ? 0 : value*.35

      Player.list[i].pe *= 25

      value = 0;
      if(Player.list[i].review_count < Player.list[i].schedule.length){
        value = Player.list[i].total_correct/Player.list[i].total_items;
      }
      else{
        value = 1;
      }

      Player.list[i].hs += isNaN(value) || !isFinite(value) ? 0 : value*.5

      //Assistance Usage
      value =(Player.list[i].total_playtime-Player.list[i].total_idle-Player.list[i].total_distracted)/(Player.list[i].total_playtime)
      Player.list[i].hs += isNaN(value) || !isFinite(value) ? 0 : value*.5
      
      Player.list[i].hs *= 25


      //Idle + Distraction Time vs Playing Time 
      value = (Player.list[i].total_playtime-Player.list[i].total_idle-Player.list[i].total_distracted)/(Player.list[i].total_playtime)
      Player.list[i].es += isNaN(value) || !isFinite(value) ? 0 : value
      
      Player.list[i].es *= 25;

      //Progress
      value = Player.list[i].story*.01
      Player.list[i].tm += isNaN(value) || !isFinite(value) ? 0 : value*.35

      //Time Utilization
      value =(Player.list[i].total_items-Player.list[i].total_pattern_D-Player.list[i].total_skips-Player.list[i].total_no_answer)/(Player.list[i].total_items)
      Player.list[i].tm += isNaN(value) || !isFinite(value) ? 0 : value*.3

      //Schedule Compliance
      value = 0;
      let j = 0;
      for( j = 0 ; j < Player.list[i].schedule.length ; j++){
        if (Player.list[i].schedule[j].submitted != undefined){
          let overtime = moment(Player.list[i].schedule[j].submitted).diff(moment(Player.list[i].schedule[j].deadline), 'minutes');
          if( overtime < 30){
            if(overtime >= 0 ){
              value+=(1-((.1)*(overtime/3)))
            }
            else{
              value+=1
            }
          }
        }
        else{
          break;
        }
      }
      //pagnatapos
      //may butal
      //di tapos walang butal 
      value = value/j
      Player.list[i].tm += isNaN(value) || !isFinite(value) ? 0 : value*.35

      Player.list[i].tm *= 25;
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
  },
}


module.exports = Player
