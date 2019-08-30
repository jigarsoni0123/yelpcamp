var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleWare={};

middleWare.isLoggedIn=function(req,res,next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("error","Please login first");
		res.redirect("/login");
	};


middleWare.checkCampgroundOwner= function(req,res,next){
		if(req.isAuthenticated()){
			Campground.findById(req.params.id,function(err,fCamp){
				if(err){
					req.flash("error","Error occured");_
					res.redirect("back");
				}else{
					if(req.user._id.equals(fCamp.author.id)){
						next();
					}else{
						req.flash("error","Please login first");
						res.redirect("back");
					}
				}	
			});		
		}else{
			req.flash("error","Please login first");
			res.redirect("back");
		}
	};

middleWare.checkCommentOwner=function(req,res,next){
		if(req.isAuthenticated()){
			Comment.findById(req.params.comments_id,function(err,fComm){
				if(err){
					req.flash("error","Error occured");_
					res.redirect("back");
				}else{
					if(req.user._id.equals(fComm.author.id)){
						next();
					}else{
						req.flash("error","Please login first");
						res.redirect("back");
					}
				}	
			});		
		}else{
			req.flash("error","Please login first");
			res.redirect("back");
		}
	};
module.exports=middleWare;
