const Sequelize = require("sequelize");
const sequelize = require("../db");
const Song = require("../songs/model");

const Artist = sequelize.define(
  "artists",
  {
    name: {
      type: Sequelize.STRING,
      field: "name",
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "artists"
  }
);

//Artist.hasMany(Song);

module.exports = Artist;
