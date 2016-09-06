var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
	author: String,
	upvotes: {type: number, default: 0},
	post: { type:mongoose.Schema.Types.ObjectId, ref: 'Post'} // The ref option is what tells mongoose which model to use during population
});

// assign custom methods to model
CommentSchema.methods.upvote = function(cb) {
	this.upvotes += 1;
	this.save(cb);
};

mongoose.model('Comment', CommentSchema);