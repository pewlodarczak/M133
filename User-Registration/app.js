const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./models/user");
      imgModel              =  require("./models/images");

	  require('dotenv/config');

var fs = require('fs');
var path = require('path');

var loggedinUser;

//Connecting database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
	console.log(`Connected to ${process.env.MONGO_URL}`)
    mongoose.use
});

app.use(require("express-session")({
    secret:"password",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}));

passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded(
      { extended:true }
))

//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

//const { populate } = require('./models/user');

// Schritt 5 - Set up multer um upload files zu speichern
var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });

//=======================
//      R O U T E S
//=======================
app.get("/", (req,res) =>{
    res.render("home");
})

app.get("/welcomeuser",isLoggedIn ,async(req,res) => {
	if(req.user){
        let user = await User.findOne({username: req.user.username});
		loggedinUser = user.username;
        res.render('welcomeuser', {loggedinUser});
    } else {
	    res.render('welcomeuser2');
    }
})

app.get('/uploadImages', isLoggedIn, (req, res) => {
	imgModel.find({}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			res.render('uploadImages', { items: items });
		}
	});
});

app.post('/', upload.single('image'), (req, res, next) => {
	console.log(req.name)
	var obj = {
		name: req.body.name,
		desc: req.body.desc,
		userid: loggedinUser,
		img: {
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
			contentType: 'image/png'
		}
	}
	imgModel.create(obj, (err, item) => {
		if (err) {
			console.log(err);
		}
		else {
			// item.save();
			//res.redirect('/');
			res.redirect('uploadImages');
		}
	});
});

app.get('/userimages', (req, res) => {
	imgModel.find({'userid': loggedinUser}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			res.render('displayImg', { items: items });
		}
	});
});

app.get('/userprofile', async(req, res) => {
	let user = await User.findOne({username: req.user.username});
	User.find({}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			res.render('userprofile', { user });
		}
	});
});

//Auth Routes
app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/welcomeuser",
	failureRedirect: "/login"
}), function (req, res) {

});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
    
    User.register(new User({username: req.body.username,phone:req.body.phone,telephone: req.body.telephone}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/login");
    })    
    })
})

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.use(express.static(__dirname));

//Listen On Server
app.listen(process.env.PORT ||3000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log(`Server Started At Port ${process.env.PORT}`);
    }
});