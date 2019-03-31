var m = require("mithril")
var Player = {
  current: {},
  list: [],
  loadList: function () {
    return m.request({
      method: "GET",
      url: "http://rem-rest-api.herokuapp.com/api/users",
      withCredentials: true,
      background: true
    })
    .then(function(result) {
      Player.list = result.data
      m.redraw()
    })
  },
  load: function (username) {
    console.log(username)
    Player.current.username = username
  }
}

module.exports = Player
