const { Router } = require("express");
const User = require("./model");
const bcrypt = require("bcrypt");

const router = new Router();

router.post("/users", (req, res, next) => {
  if (!req.body.email || !req.body.password || !req.body.password_confirmation)
    return res.status(422).send({
      message: `Please provide an e-mail address, a password and password confirmation identical to the password.`
    });

  if (req.body.password !== req.body.password_confirmation)
    return res.status(422).send({
      message: `Password confirmation does not match the field password. Please correct and try again.`
    });

  const user = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };

  User.create(user)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: `User does not exist`
        });
      }
      return res.status(201).send(user);
    })
    .catch(error => next(error));
});

module.exports = router;
