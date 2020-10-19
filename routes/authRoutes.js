const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
// const { useScreens } = require("react-native-screens");

// const isAuthenticated = require("../middleware/isAuthenticated");
// const noModification = require("../middleware/noModification");

router.post("/signup", async (req, res) => {
  try {
    const token = uid2(64);
    const salt = uid2(64);
    const hash = SHA256(req.body.password + salt).toString(encBase64);

    // L'email existe-til déjà dans la BDD ?
    const alreadyExist = await User.findOne({ email: req.body.email });
    if (alreadyExist) {
      res.json({ message: "email already exist" });
    } else {
      if (req.body.password && req.body.email) {
        const newUser = new User({
          email: req.body.email,
          token: token,
          salt: salt,
          hash: hash,
          pseudo: req.body.pseudo,
        });
        await newUser.save();
        console.log(newUser);
        res.json({
          // newUser,
          _id: newUser._id,
          token: newUser.token,
          pseudo: newUser.pseudo,
        });
      } else {
        res.json({ message: "Missing information" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Post request for login

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
      // vérif du mot de passe
      if (
        SHA256(req.body.password + user.salt).toString(encBase64) === user.hash
      ) {
        res.json({
          // user,
          _id: user._id,
          token: user.token,
          pseudo: user.pseudo
        });
      } else {
        res.json({ message: "Access denied" });
      }
    } else {
      res.json({ message: "User not found" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

//User update picture

// router.put(
//   "/user/upload_picture/:id",
//   // [noModification, isAuthenticated],
//   async (req, res) => {
//     if (req.files.picture) {
//       try {
//         const user = await User.findById(req.params.id);

//         if (user) {
//           if (String(user._id) === String(req.user._id)) {
//             if (!user.account.photo) {
//               const newObj = {};

//               await cloudinary.uploader.upload(
//                 req.files.picture.path,

//                 {
//                   folder: "airbnb/" + req.params.id,
//                 },

//                 async function (error, result) {
//                   newObj.url = result.secure_url;
//                   newObj.picture_id = result.public_id;

//                   await User.findByIdAndUpdate(req.params.id, {
//                     "account.photo": newObj,
//                   });
//                 }
//               );
//             } else {
//               const newObj = {};

//               await cloudinary.uploader.upload(
//                 req.files.picture.path,

//                 { public_id: user.account.photo.picture_id },

//                 async function (error, result) {
//                   newObj.url = result.secure_url;
//                   newObj.picture_id = result.public_id;

//                   await User.findByIdAndUpdate(req.params.id, {
//                     "account.photo": newObj,
//                   });
//                 }
//               );
//             }

//             const userUpdated = await User.findById(req.params.id);

//             res.json({
//               account: userUpdated.account,
//               _id: userUpdated._id,
//               email: userUpdated.email,
//               rooms: userUpdated.rooms,
//             });
//           } else {
//             res.status(401).json({ error: "Unauthorized" });
//           }
//         } else {
//           res.status(400).json({ error: "User not found" });
//         }
//       } catch (error) {
//         res.status(400).json({ error: error.message });
//       }
//     } else {
//       res.status(400).json({ error: "Missing picture" });
//     }
//   }
// );






// router.get("/users", async (req, res) => {
//   try {
//     const users = await User.find()
//     res.json(users)
//   } catch (error) {
//     res.json({message: error.message})
//   }
// })
module.exports = router;
