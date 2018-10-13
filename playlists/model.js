const Sequelize = require("sequelize");
const sequelize = require("../db");

const Playlist = sequelize.define(
  "playlists",
  {
    name: {
      type: Sequelize.STRING,
      field: "name",
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "playlists"
  }
);

module.exports = Playlist;
