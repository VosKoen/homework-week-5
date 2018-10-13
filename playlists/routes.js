const { Router } = require("express");
const Playlist = require("./model");
const auth = require("../auth/middleware");

const router = new Router();

router.post("/playlists", auth, (req, res, next) => {
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
  Playlist.findAll(
    {
    where: {
      userId: req.user.id
  }})
    .then(playlists => {
      res.send({ playlists });
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
      return res.send(playlist);
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
        res.send({
          message: `Playlist was deleted`
        })
      );
    })
    .catch(error => next(error));
});

module.exports = router;
