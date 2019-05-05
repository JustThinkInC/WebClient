const mysql = require('mysql');

const state = {
    pool: null
};

exports.connect = function (done) {
  state.pool = mysql.createPool({
      user: "gkh36",
      password: "97337761",
      database: "gkh36",
      host: "mysql3.csse.canterbury.ac.nz"
  });
  done();
};

exports.get = function () {
    return state.pool;
};
