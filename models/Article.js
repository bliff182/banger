const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
// This is similar to a Sequelize model
const ArticleSchema = new Schema({
	// `headline` is required, cannot repeat within the db, and of type String
	headline: {
		type: String,
		unique: true,
		required: true
	},
	// `summary` is of type String but not required
	summary: {
		type: String
		// unique: true
		// required: true
	},
	// `url` is required and of type String
	url: {
		type: String,
		unique: true,
		required: true
	},
	// `note` is an object that stores a Note id
	// The ref property links the ObjectId to the Note model
	// This allows us to populate the Article with an associated Note
	note: [
		{
			type: Schema.Types.ObjectId,
			ref: "Note"
		}
	]
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
