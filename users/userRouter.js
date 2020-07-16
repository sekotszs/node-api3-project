const express = require("express");

const router = express.Router();

const db = require("./userDb");
const postdb = require("../posts/postDb");

router.post("/", validateUser, (req, res) => {
  db.insert(req.body)
    .then((result) => {
      res.status(201).send();
    })
    .catch((error) => {
      res
        .status(500)
        .JSON({ message: "There was an error connecting to the database" });
    });
});

router.post("/:id/posts", validateUser, validateUserId, (req, res) => {
  const newPost = req.body;
  newPost.user_id = Number(req.params.id);
  postdb
    .insert(newPost)
    .then((result) => {
      res.status(201).send();
    })
    .catch((error) => {
      res
        .status(500)
        .JSON({ message: "There was an error connecting to the database" });
    });
});

router.get("/", (req, res) => {
  db.get()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res
        .status(500)
        .JSON({ message: "There was an error connecting to the database" });
    });
});

router.get("/:id", changeID, validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  db.getUserPosts(Number(req.params.id))
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "error connecting to database" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  db.remove(Number(req.params.id))
    .then((result) => {
      if (result === 1) {
        res.status(204).send();
      } else {
        res
          .status(500)
          .JSON({ message: "There was an error deleting the user" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .JSON({ message: "There was an error connecting to the database" });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  db.update(Number(req.params.id), req.body)
    .then((result) => {
      if (result === 1) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "There was an error updating record" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .JSON({ message: "There was an error connecting to the database" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  db.getById(req.id)
    .then((result) => {
      if (result) {
        req.user = result;
        next();
      } else {
        res.status(400).JSON({ message: "Invalid user ID" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .JSON({ message: "There was an error connecting to the database" });
    });
}

function validateUser(req, res, next) {
  if (JSON.stringify(req.body) === "{}") {
    return res.status(400).JSON({ message: "There is missing user data." });
  }
  if (!req.body.name) {
    return res.status(400).json({ message: "Missing the required name field" });
  }
  next();
}

function validatePost(req, res, next) {
  if (JSON.stringify(req.body) === "{}") {
    return res.status(400).JSON({ message: "There is missing post data." });
  }
  if (!req.body.text) {
    return res.status(400).JSON({ message: "Missing the required text field" });
  }
  next();
}

function changeID(req, res, next) {
  req.id = Number(req.params.id);
  next();
}

module.exports = router;
