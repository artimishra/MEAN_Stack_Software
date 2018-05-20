var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose")
    
var app = express();

mongoose.connect("mongodb://localhost/Guru");

app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"Be Good",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine','ejs');

app.use(express.static(__dirname+'/public'));
//
app.use(passport.initialize());
app.use(passport.session());
// 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
    res.render("landing");
});
app.get("/landing", function(req, res){
    res.render("landing");
});

app.get("/home",isLoggedIn, function(req, res){
    res.render("home");
});

// Auth Routes

app.get("/register", function(req, res){
    res.render("register");
});
//handling user sign up
app.post("/register", function(req, res){
User.register(new User({username:req.body.username}),req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render('register');
        } //user stragety
        passport.authenticate("local")(req, res, function(){
            res.redirect("/home"); //once the user sign up
       }); 
    });
});

// Login Routes
app.get("/forgot", function(req, res){
    res.render("forgot");
    
});
app.post("/forgot", function(req, res){
    res.redirect("/");
    
});



app.get("/login", function(req, res){
    res.render("login");
})

// middleware
app.post("/login", passport.authenticate("local",{
    successRedirect:"/home",
    failureRedirect:"/login"
}),function(req, res){
    res.send("User is "+ req.user.id);
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//	attendance marking
app.get("/attendance", function(req, res, next){
	res.render("attendance");
});



//post method to add data to db
app.post("/faculty",function(req, res, next){
	//res.send("You hit the post route");
	//get the data from faculty array and add to it
	var name = req.body.name;
	var department = req.body.department;
	var newFaculty = {name: name, department: department};
	//faculty.push(newFaculty);
	Faculty.create(newFaculty, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			//redirect to faculty page
			res.redirect("/faculty");
		}
	});
});



//form for adding faculty
app.get("/faculty/newFaculty", function(req, res, next){
	res.render("newFaculty.ejs");
});

// adding route to view specific faculty
app.get("/faculty/:id", function(req, res, next){
	res.send("Show specific faculty");
});

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server started");
});

// Faculty.create(
// {
// 	name: "Yogita",
// 	department: "IT"
// }, function(err, Faculty){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log("Newly created faculty");
// 		console.log(Faculty);
// 	}
// }
// );

// var faculty = [
// 		{name: "Govind" , department: "IT"},
// 		{name: "Dalgade", department: "CS"}
// 	];


//landing on faculty form
// app.get("/faculty", function(req, res, next){
// 	Faculty.find({},function(err, allFaculty){
// 		if(err){
// 			console.log(err);
// 		}
// 		else{
// 			res.render("faculty",{faculty:allFaculty});
// 		}
// 	});
// });

//facReg.create({
// 	name: "Yogita",
// 	pass: "rgit123"
// }, function(err, facReg){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("newlyCreated faculty");
// 		console.log(facReg);
// 	}
// }
// );