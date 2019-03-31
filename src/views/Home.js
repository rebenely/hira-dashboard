const m = require('mithril').default

module.exports = {
  view: function() {
    return m("div[style='text-align:center;margin: auto;padding: 70px 0;']", [
      m("h1[style='font-size:4rem']", "Welcome to Hira Dashboard!"),
      m("div.section", [
        m("h2", "There are currently n players registered"),
        m("h2", "with a total of n sessions.")
      ])

    ])
  }
}
