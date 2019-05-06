var m = require("mithril")
var moment = require("moment")
var Player = {
  uri: "http://hira-gumagana.herokuapp.com/",
  current: {},
  list: [],
  pageChars: [],
  getAllSrl: function() {
    var ac = 0; //Accuracy vs Character
    var ru = 0; //Review Utilization
    var sc = 0; //Schedule Compliance
    for (let i = 0; i < Player.list.length; i++){
      Player.list[i].pe = 0;
      Player.list[i].hs = 0;
      Player.list[i].es = 0;
      Player.list[i].tm = 0;

      if(Player.list[i].total_items != 0){
          Player.list[i].accuracy = Player.list[i].total_correct/Player.list[i].total_items;
      } else {
          Player.list[i].accuracy = 0;
      }

      //Time vs Acuracy
      value = ((Player.list[i].total_pattern_C)/(Player.list[i].total_pattern_C+Player.list[i].total_pattern_D))
      Player.list[i].pe += isNaN(value) || !isFinite(value) ? 0 : value*.4

      value = 0;

      //Accuracy vs Character
      for (let j = 0; j < Player.list[i].encounters.length; j++){
        value += Player.list[i].encounters[j].accuracy;
      }
      value/=Player.list[i].encounters.length;
      Player.list[i].pe += isNaN(value) || !isFinite(value) ? 0 : value*.3

      //Unskipped Items
      value = ((Player.list[i].total_items-Player.list[i].total_skips)/(Player.list[i].total_items))
      Player.list[i].pe += isNaN(value) || !isFinite(value) ? 0 : value*.3

      Player.list[i].pe *= 25


      //Review Count
      value = 0;
      if(Player.list[i].review_count < (Player.list[i].schedule.length +  Math.ceil(Player.list[i].schedule.length/2))|| Player.list[i].schedule.length == 0){
        value = Player.list[i].total_correct/Player.list[i].total_items;
      }
      else{
        value = 1;
      }

      Player.list[i].hs += isNaN(value) || !isFinite(value) ? 0 : value*.5

      //Assistance Usage
      value = 0;
      if(typeof Player.list[i].dungeon_runs != "undefined"){
        for (let j = 0; j < Player.list[i].dungeon_runs.length ; j++){
          if(Player.list[i].dungeon_runs[j].total_items-Player.list[i].dungeon_runs[j].total_correct <= 1){
            value+=1
          }
          else if(Player.list[i].dungeon_runs[j].total_perks != 0){
            value+=1
          }
        }
        value/=Player.list[i].dungeon_runs.length
      }
      Player.list[i].hs += isNaN(value) || !isFinite(value) ? 0 : value*.5

      Player.list[i].hs *= 25


      //Idle + Distraction Time vs Playing Time
      value = (Player.list[i].total_playtime-Player.list[i].total_idle-Player.list[i].total_distracted)/(Player.list[i].total_playtime)
      Player.list[i].es += isNaN(value) || !isFinite(value) ? 0 : value

      Player.list[i].es *= 25;

      //Cramming Tendency
      //Manually got from the raw dataset (form and MongoDB database) 
      notcrammed = ['miikaaachuu','bloodlustaxe','Bugs','Zenith09','oneeyedkid','weetitit','MeWantPizza','RoguMogu','Deanne','mrs. captain america <3','Kristan Gabay','ed','aemaranon','eury','pinathbutter','Yanfrey']
      value = (notcrammed.includes(Player.list[i].username)? .5 : 0) + (Player.list[i].story > 24 ? .25 : 0 ) + (Player.list[i].story >= 40 ? .25 : 0 ) 

      Player.list[i].tm += value*.5

      //Schedule Compliance
      value = 0;
      let j = 0;
      for( j = 0 ; j < Player.list[i].schedule.length ; j++){
        if (Player.list[i].schedule[j].submitted != undefined){
          let overtime = moment(Player.list[i].schedule[j].submitted).diff(moment(Player.list[i].schedule[j].deadline), 'minutes');
          if( overtime <= 0){
            value+=.11
          }
        }
        else{
          break;
        }
      }
      value = (value == .99 ? 1 : value)
      Player.list[i].tm += isNaN(value) || !isFinite(value) ? 0 : value*.5

      Player.list[i].tm *= 25;
    }
    Player.list.sort((a,b)=>{
      return b.accuracy - a.accuracy
    })
  },
  loadList: function () {
    return m.request({
      method: "GET",
      url: Player.uri + "api/players",
      withCredentials: false,
      background: true
    })
    .then(function(result) {
      Player.list = result.players
      Player.getAllSrl()
      m.redraw()
    })
  },
  getTopPlayerAccuracy: function () {
    var maxInd = 0;
    var valuemaxInd = 0;
    var valuei = 0;
    for(let i = 0; i < Player.list.length; i++){
      valuemaxInd = Player.list[maxInd].total_correct/Player.list[maxInd].total_items;
      valuei = Player.list[i].total_correct/Player.list[i].total_items
      if( (isNaN(valuemaxInd) || !isFinite(valuemaxInd) ? 0 : valuemaxInd) < (isNaN(valuei) || !isFinite(valuei) ? 0 : valuei)) {
        maxInd = i;
      }
    }
    return Player.list[maxInd]
  },
  getTopPlayerSRL: function () {
    var maxInd = 0;
    for(let i = 0; i < Player.list.length; i++){
      if(Player.list[maxInd].pe + Player.list[maxInd].hs + Player.list[maxInd].es + Player.list[maxInd].tm < Player.list[i].pe + Player.list[i].hs + Player.list[i].es + Player.list[i].tm) {
        maxInd = i;
      }
    }
    return Player.list[maxInd]
  },
  getPlayerCompleted: function () {
    finished = [];
    for(let i = 0 ; i < Player.list.length ; i++){
      if(Player.list[i].date_finished!=undefined){
        finished.push(Player.list[i])
      }
    }
    finished.sort((a,b)=>{
      return moment(a.date_finished).diff(moment(b.date_finished),"seconds")
    })
    return finished;
  },
  load: function (username) {
    var found = false;

    if(Player.list.length > 0) {
      for(let i = 0; i < Player.list.length; i++) {
        if(Player.list[i].username === username) {
          Player.current = Player.list[i]
          found = true
          m.redraw()
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
