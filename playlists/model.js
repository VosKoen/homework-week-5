const Sequelize = require("sequelize");
const sequelize = require("../db");
const Song = require("../songs/model");

const Playlist = sequelize.define(
  "playlists",
  {
    name: {
      type: Sequelize.STRING,
      field: "name",
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER,
      field: "user_id"
    }
  },
  {
    timestamps: false,
    tableName: "playlists"
  }
);

Playlist.hasMany(Song);
module.exports = Playlist;
