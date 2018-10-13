const { Router } = require("express");
const Song = require("./model");
const Playlist = require("../playlists/model");
const auth = require("../auth/middleware");
const Artist = require("../artists/model")

const router = new Router();

router.get("/playlists/:id/songs", auth, (req, res, next) => {
  Playlist.findById(req.params.id).then(playlist => {
    if (!playlist || playlist.userId !== req.user.id)
      return res.status(404).send({
        message: `Playlist does not exist for this user`
      });
    return Song.findAll({
      where: {
        playlistId: req.params.id
      },
      include: [Artist]
    })
      .then(songs => {
        if (!songs) {
          return res.status(404).send({
            message: `Songs could not be retrieved`
          });
        }
        res.status(200).send({ songs });
      })
      .catch(error => next(error));
  });
});

router.post("/playlists/:id/songs", auth, (req, res, next) => {
  if (!req.body.title)
    return res.status(422).send({
      message: `Song cannot be saved without a title`
    });

  if (!req.body.album)
    return res.status(422).send({
      message: `Song cannot be saved without an album`
    });

  if (!req.body.artist)
    return res.status(422).send({
      message: `Song cannot be saved without an artist`
    });

  req.body.playlistId = req.params.id;

  Playlist.findById(req.params.id).then(playlist => {
    if (!playlist || playlist.userId !== req.user.id)
      return res.status(404).send({
        message: `Playlist does not exist for this user`
      });

    return Artist.findOne({
      where: {
        name: req.body.artist
      }
    })
      .then(artist => {
        if (artist)
          return Song.create({
            ...req.body,
            artistId: artist.id
          });
        return Artist.create({ name: req.body.artist }).then(artist =>
          Song.create({
            ...req.body,
            artistId: artist.id
          })
        );
      })
      .then(song => {
        if (!song) {
          return res.status(422).send({
            message: `Song cannot be saved`
          });
        }
        return res.status(201).send(song);
      })
      .catch(error => next(error));
  });
});

router.put("/playlists/:idPlaylist/songs/:idSong", auth, (req, res, next) => {
  Playlist.findById(req.params.idPlaylist)
    .then(playlist => {
      if (!playlist || playlist.userId !== req.user.id)
        return res.status(404).send({
          message: `Playlist does not exist for this user`
        });
      return Song.findById(req.params.idSong);
    })
    .then(song => {
      if (!song || song.playlistId !== parseInt(req.params.idPlaylist)) {
        return res.status(404).send({
          message: `Song not found on this playlist`
        });
      }

      return Playlist.findById(req.body.playlistId);
    })
    .then(playlist => {
      if (!playlist || playlist.userId !== req.user.id)
        return res.status(404).send({
          message: `The target playlist does not exist for this user`
        });

      return Song.findById(req.params.idSong);
    })
    .then(song => song.update(req.body))
    .then(song => res.status(200).send(song))
    .catch(error => next(error));
});

router.delete(
  "/playlists/:idPlaylist/songs/:idSong",
  auth,
  (req, res, next) => {
    Playlist.findById(req.params.idPlaylist)
      .then(playlist => {
        if (!playlist || playlist.userId !== req.user.id)
          return res.status(404).send({
            message: `Playlist does not exist for this user`
          });
        return Song.findById(req.params.idSong)
          .then(song => {
            if (!song || song.playlistId !== parseInt(req.params.idPlaylist)) {
              return res.status(404).send({
                message: `Song not found on this playlist`
              });
            }
            return song.destroy().then(() =>
              res.status(204).send({
                message: `Song was deleted`
              })
            );
          })
          .catch(error => next(error));
      })
      .catch(error => next(error));
  }
);

module.exports = router;
