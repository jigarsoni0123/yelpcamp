var express=require('express');
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleWares=require("../middleware");

//COMMENTS ROUTES//
router.get("/new",middleWares.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err,camp){
		if(err){
			req.flash("error",err.message);
			res.redirect("/camps");
		}else{
			res.render("comments/new_form",{camp:camp});	
		}
	});
});

router.post("/",middleWares.isLoggedIn ,function(req,res){
	Campground.findById(req.params.id,function(err,camp){
		if(err){
			req.flash("error",err.message);
			res.redirect("/camps");
		}else{
			Comment.create(req.body.comment,function(err,comm){
				if(err){
					req.flash("error",err.message);
					res.redirect("/camps");
				}else{
					comm.author.id=req.user._id;
					comm.author.username=req.user.username;
					comm.save();
					camp.comments.push(comm);
					camp.save();
					req.flash("success","Comment added");
					res.redirect("/camps/"+req.params.id);	
				}
			});
		}
	});		
});


//EDIT ROUTE
router.get("/:comments_id/edit",middleWares.checkCommentOwner,function(req,res){
	Comment.findById(req.params.comments_id,function(err,comm){
		if(err){
			req.flash("error",err.message);
		}else{
			res.render("comments/edit_comment",{camp_id:req.params.id,fcomm:comm});	
		}
	});
});

//UPDATE ROUTE
router.put("/:comments_id",middleWares.checkCommentOwner,function(req,res){
	Comment.findByIdAndUpdate(req.params.comments_id,req.body.comment,function(err,resu){
		if(err){
			req.flash("error",err.message);
			res.redirect("/camps/"+req.params.id);
		}else{
			req.flash("success","Comment updated");
			res.redirect("/camps/"+req.params.id);
		}
	})
});


//DESTROY ROUTE
router.delete("/:comments_id",middleWares.checkCommentOwner,function(req,res){
	Comment.findByIdAndDelete(req.params.comments_id,function(err,result){
		req.flash("success","Comment removed");
		res.redirect("back");
	});
});

module.exports=router;