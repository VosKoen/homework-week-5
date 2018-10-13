const { Router } = require("express");
const Artist = require("./model");
const Song = require('../songs/model');
const auth = require("../auth/middleware");

const router = new Router();

router.get("/artists", auth, (req, res, next) => {
  Artist.findAll({
    include: [Song]
  })
    .then(artists => {
      if (!artists) {
        return res.status(404).send({
          message: `This artist has no songs`
        });
      }
      res.status(200).send({ artists });
    })
    .catch(error => next(error));
});

module.exports = router;
