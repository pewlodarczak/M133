const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  imgModel = require("./models/images"),
  User = require("./models/user"),
  Product = require("./models/product"),
  { body, validationResult } = require("express-validator");

require("dotenv/config");

var fs = require("fs");
var util = require("util");
var path = require("path");
var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
var log_stdout = process.stdout;

const ROLE = {
  ADMIN: "admin",
  BASIC: "user",
};

//Connecting database
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("connected to " + process.env.MONGO_URL);
    mongoose.use;
  }
);

app.use(
  require("express-session")({
    secret: "password", //decode or encode session
    resave: false,
    saveUninitialized: false,
  })
);

passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

//const { populate } = require('./models/user');

// Schritt 5 - Set up multer um upload files zu speichern
var multer = require("multer");
const { ObjectId } = require("bson");
const { object } = require("webidl-conversions");
const { Console } = require("console");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

//=======================
//      R O U T E S
//=======================
app.get("/", (req, res) => {
  Product.find({}, (err, Products) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    }
    if (Products) {
      console.log(Products);
      res.render("index", { DisplayProducts: Products });
    }
  });
});
app.post("/", (req, res) => {
  Product.find({ name: req.body.textfield }, (err, FilteredProducts) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    }
    if (FilteredProducts) {
      console.log(req.body.textfield);

      res.render("index", { DisplayProducts: FilteredProducts });
    }
  });
});

app.get("/userprofile", isLoggedIn, (req, res) => {
  res.render("userprofile");
});

app.get("/uploadImages", isLoggedIn, (req, res) => {
  imgModel.find({}, (err, items) => {
    if (err) {
      //console.log('storing ERROR')
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      //res.render('imagesPage', { items: items });
      res.render("uploadImages", { items: items });
    }
  });
});

app.post("/", upload.single("product"), (req, res, next) => {
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  imgModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      //res.redirect('/');
      res.redirect("uploadImages");
    }
  });
});

app.get("/", (req, res) => {
  imgModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.render("uploadImages", { items: items });
    }
  });
});

app.get("/userimages", (req, res) => {
  imgModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.render("displayImg", { items: items });
    }
  });
});

app.get("/newproduct", (req, res) => {
  res.render("newproduct");
});

app.post("/newproduct", upload.single("image"), (req, res, next) => {
  var obj = {
    name: req.body.name,
    price: req.body.desc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  Product.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      //res.redirect('/');
      res.redirect("uploadImages");
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/index", (req, res) => {
  Product.find({}, (err, Products) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    }
    if (Products) {
      console.log(Products);
      res.render("index", { DisplayProducts: Products });
    }
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

app.get("/register", (req, res) => {
  res.render("register");
});

app.post(
  "/register",
  body("password").isLength({ min: 8 }),
  body("phone").isInt(),
  (req, res) => {
    const errors = validationResult(req);
    if(req.body.password.length <= 8) {
      console.log("Password must be at least 8 characters");
      res.redirect("/register");
    } else
  
    if (!errors.isEmpty()) {
      console.log(errors);
      res.redirect("/register");
    }
    User.register(
      new User({ username: req.body.email, phone: req.body.phone }),
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.render("register");
        }
        console.log("registered");
        res.redirect("/login");
        passport.authenticate("local")(req, res, function () {
          console.log("auth");
          res.redirect("/login");
        });
      }
    );
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/admin", isLoggedIn, authRole(ROLE.ADMIN), (req, res) => {
  User.find({}, (err, Users) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    }
    if (Users) {
      console.log("Users count : " + User.length);
      res.render("admindashboard", { usersArray: Users });
    }
  });
});

app.post("/deleteuser"),
  (req, res, next) => {
    User.findByIdAndRemove({ _id: req.body.usertodelete })
      .exec()
      .then((doc) => {
        if (!doc) {
          return res.status(404).end();
        }
        return res.status(204).end();
      });
  };
app.post("/changeuser"),
  (req, res, next) => {
    console.log(req.body.userType);
    if (req.body.userType === "user") {
      User.findByIdAndUpdate(req.session.passport.user, {
        $set: {
          userType: "admin",
        },
      });
    } else {
      User.findByIdAndUpdate(req.session.passport.user, {
        $set: {
          userType: "user",
        },
      });
    }
    res.render("admindashboard");
  };
app.post("/searchuser", (req, res) => {
  if (req.body.usertextfield.length === 0) {
    User.find({}, (err, Users) => {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred", err);
      }
      if (Users) {
        console.log("Users count : " + User.length);
        res.render("admindashboard", { usersArray: Users });
      }
    });
  } else {
    User.find({ username: req.body.usertextfield }, (err, FilteredUsers) => {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred", err);
      }
      if (FilteredUsers) {
        console.log(req.body.usertextfield);
        console.log(FilteredUsers);

        res.render("admindashboard", { usersArray: FilteredUsers });
      }
    });
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function authRole(rolealout) {
  return (req, res, next) => {
    //role ['admin','guide'].role=user
    console.log(req.User);
    if (rolealout !== req.user.userType) {
      console.log("You do not have permission to perform this action", 403);
      res.send("You do not have permission to perform this action");
    } else {
      next();
    }
  };
}

app.use(express.static(__dirname));

//Listen On Server
app.listen(process.env.PORT || 3000, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started At Port " + process.env.PORT);
  }
});
