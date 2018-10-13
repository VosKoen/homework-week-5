const { Router } = require("express");
const Song = require("./model");
const Playlist = require("../playlists/model");
const auth = require("../auth/middleware");

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
      }
    })
      .then(songs => {
        if (!songs) {
          return res.status(404).send({
            message: `Songs could not be retrieved`
          });
        }
        res.send({ songs });
      })
      .catch(error => next(error));
  });
});

router.post("/playlists/:id/songs", auth,(req, res, next) => {
  req.body.playlistId = req.params.id;
  Playlist.findById(req.params.id).then(playlist => {
    if (!playlist || playlist.userId !== req.user.id)
      return res.status(404).send({
        message: `Playlist does not exist for this user`
      });
    return Song.create(req.body)
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

module.exports = router;
