const path = require("path");

const home = (req, res) => {
  return res.sendFile(path.join(`${__dirname}/upload.html`));
};

module.exports = {
  getHome: home
};