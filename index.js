var express    =require('express'),
	app        =express(),
	bodyParser =require('body-parser'),
	mongoose   =require('mongoose'),
	passport   =require('passport'),
	flash	   =require('connect-flash'),
	methodOverride=require('method-override'),
	LocalStrategy=require('passport-local'),
	Campground =require("./models/campground"),
	Comment	   =require('./models/comment'),
	User	   =require('./models/user'),
	seedDB	   =require("./seedDB");

// seedDB(); //seed the database

var commentRoutes=require("./routes/comment"),
	campRoutes=require("./routes/campground"),
	indexRoutes=require("./routes/index_auth");


//MongoDB Setup
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://jigar:jigarsoni@yelpcamp-shard-00-00-vpwtg.mongodb.net:27017,yelpcamp-shard-00-01-vpwtg.mongodb.net:27017,yelpcamp-shard-00-02-vpwtg.mongodb.net:27017/test?ssl=true&replicaSet=yelpcamp-shard-0&authSource=admin&retryWrites=true&w=majority").
	catch(error => console.log(error));

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("content"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT configs
app.use(require('express-session')({
	secret:"This is my yelpcamp site developed by jigar",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use("/camps/:id/comments",commentRoutes);
app.use("/camps",campRoutes);
app.use("/",indexRoutes);




app.listen(process.env.PORT,process.env.IP);
