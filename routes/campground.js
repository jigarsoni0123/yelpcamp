var express=require('express');
var router=express.Router();
var Campground=require("../models/campground");
var middleWares=require("../middleware");

//CAMPGROUND Routes

//INDEX ROUTE
router.get("/",function(req,res){
	Campground.find({},function(err,allCamps){
		if(err){
			req.flash("error",err.message);
		}else {
			// console.log(allCamps);
			res.render("campground/campground",{array:allCamps});		
		}
	})
});


//CREATE ROUTE
router.post("/",function(req,res){
	var name=req.body.names;
	var img=req.body.images;
	var desc=req.body.description;
	Campground.create({
		title:name,
		image:img,
		description:desc
	},function(err,resu){
		if(err){
			req.flash("error",err.message);
			res.redirect("/camps");
		}else{
			resu.author.id=req.user._id;
			resu.author.username=req.user.username;
			resu.save();
			req.flash("success","Campground added");
			res.redirect("/camps");	
		}
	});
});


//NEW ROUTE
router.get("/new",middleWares.isLoggedIn, function(req,res){
	res.render("campground/new_form");
});


//SHOW ROUTE
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
		if(err){
			req.flash("error",err.message);
			res.redirect("/camps")
		}else{
			// console.log(foundCamp);
			res.render("campground/show",{camp:foundCamp});
		}
	});
});

//EDIT ROUTE
router.get("/:id/edit", middleWares.checkCampgroundOwner, function(req,res){
	Campground.findById(req.params.id,function(err,fCamp){
		res.render("campground/edit_camp",{foundCamp:fCamp});	
	});		
});

//UPDATE ROUTE
router.put("/:id",middleWares.checkCampgroundOwner,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.camps,function(err,updatedCamp){
		if(err){
			req.flash("error",err.message);
			res.redirect("/camps");
		}else{
			req.flash("success","Campground Updated");
			res.redirect("/camps/"+req.params.id);
		}
	});
});


//DESTROY ROUTE
router.delete("/:id",middleWares.checkCampgroundOwner,function(req,res){
	Campground.findByIdAndDelete(req.params.id,function(err,resu){
		if(err){
			console.log(err);
			res.redirect("/camps/"+req.params.id);
		}else{
			req.flash("success","Campground Removed");
			res.redirect("/camps");
		}
	});
});


module.exports=router;

 