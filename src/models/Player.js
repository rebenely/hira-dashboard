var m = require("mithril")
var Player = {
  uri: "http://192.168.1.5:8081/",
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
      if(Player.list[maxInd].total_correct/Player.list[maxInd].total_item < Player.list[i].total_correct/Player.list[i].total_item) {
        maxInd = i;
      }
    }
    return Player.list[maxInd]
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
