var mongoose=require('mongoose'),
	Campground=require("./models/campground");
	Comment=require("./models/comment");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

var data= [
			{
				title:"Bhujiyo",
				image:"https://s3.amazonaws.com/imagescloud/images/medias/camping/camping-tente.jpg",
				description:"Bhuj ki shaan"
			},
			{
				title:"Girnar",
				image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
				description:"Saurashtra ki shaan"
			},
			{
				title:"Chotila",
				image:"https://www.tourismsaskatchewan.com/-/media/saskparks/header-images/camping.ashx",
				description:"Ahmedabad ki shaan"
			}
		];

function seedDB(){
	Campground.deleteMany({},function(err,removed){
		if(err){
			console.log(err);
		}else{
			console.log("Removed Camps");
			Comment.deleteMany({},function(err,rem){
				if(err){
					console.log(err);
				}else{
					data.forEach(function(dat){
						Campground.create(dat,function(err,camp){
							if(err){
								console.log(err);
							}else{
								console.log("Campground Created");
								Comment.create({
									text:"This is a good place but would be better if internet was there",
									author:"Jigs"
								},function(err,comment){
									if(err){
										console.log(err);
									}else{
										camp.comments.push(comment);
										camp.save();
										console.log("Comment Added");
									}
								})
							}
						});
					});	
				}
			});
		}
	});
}

module.exports= seedDB;