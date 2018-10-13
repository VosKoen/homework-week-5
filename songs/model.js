const Sequelize = require("sequelize");
const sequelize = require("../db");
const Playlist = require("../playlists/model");
const Artist = require("../artists/model")

const Song = sequelize.define(
  "songs",
  {
    title: {
      type: Sequelize.STRING,
      field: "title",
      allowNull: false
    },
    // artist: {
    //   type: Sequelize.STRING,
    //   field: "artist",
    //   allowNull: false
    // },
    album: {
      type: Sequelize.STRING,
      field: "album",
      allowNull: false
    },
    playlistId: {
      type: Sequelize.INTEGER,
      field: "playlist_id"
    },
    artistId: {
      type: Sequelize.INTEGER,
      field: "artist_id"
    }
  },
  {
    timestamps: false,
    tableName: "songs"
  }
);

//Song.hasOne(Artist);

module.exports = Song;
