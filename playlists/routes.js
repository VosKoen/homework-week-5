const { Router } = require("express");
const Playlist = require("./model");
const auth = require("../auth/middleware");

const router = new Router();

router.post("/playlists", auth, (req, res, next) => {
  if (!req.body.name)
    return res.status(422).send({
      message: `Playlist cannot be saved without a name`
    });

  req.body.userId = req.user.id;

  Playlist.create(req.body)
    .then(playlist => {
      if (!playlist) {
        return res.status(422).send({
          message: `Playlist cannot be saved`
        });
      }
      return res.status(201).send(playlist);
    })
    .catch(error => next(error));
});

router.get("/playlists", auth, (req, res, next) => {
  Playlist.findAll({
    where: {
      userId: req.user.id
    }
  })
    .then(playlists => {
      if (!playlists) {
        return res.status(404).send({
          message: `This user has no playlists`
        });
      }
      res.status(200).send({ playlists });
    })
    .catch(error => next(error));
});

router.get("/playlists/:id", auth, (req, res, next) => {
  Playlist.findById(req.params.id)
    .then(playlist => {
      if (!playlist || playlist.userId !== req.user.id) {
        return res.status(404).send({
          message: `Playlist does not exist for this user`
        });
      }
      return res.status(200).send(playlist);
    })
    .catch(error => next(error));
});

router.delete("/playlists/:id", auth, (req, res, next) => {
  Playlist.findById(req.params.id)
    .then(playlist => {
      if (!playlist || playlist.userId !== req.user.id) {
        return res.status(404).send({
          message: `Playlist does not exist for this user`
        });
      }
      return playlist.destroy().then(() =>
        res.status(204).send({
          message: `Playlist was deleted`
        })
      );
    })
    .catch(error => next(error));
});

module.exports = router;
