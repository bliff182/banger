const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Scraping tools
// Axios is a promise-bassed http library, similar to jQuery's Ajax method
// It works on both the client and the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// A GET route for scraping The Onion website
app.get("/scrape", (req, res) => {
	// First, we grab the body of the html with axios
	axios.get("https://www.theonion.com/").then(response => {
		// Then, we load that into cheerio and save it to $ for a shorthand selector (jQuery style)
		let $ = cheerio.load(response.data);

		// Now, we grab every article tag and do the following
		$("article").each((i, element) => {
			// Save an empty result object
			let result = {};

			// Grab the text of the h4 and p tags nested in the article, as well as the href of the nested link
			// Save them as properties of the result object
			result.headline = $(element)
				.find("h4")
				.text()
				.trim();
			result.summary = $(element)
				.find("p")
				.text()
				.trim();
			result.url = $(element)
				.find("a")
				.attr("href");

			// If there are defined headlines and urls within the article tag, create a new Article using the 'result' object built from scraping
			// Not requiring summary because there are a lot of articles without one
			// if (result.headline && result.summary && result.url) {
			if (result.headline && result.url) {
				db.Article.create(result)
					.then(dbArticle => {
						// View the added result in the console
						console.log(dbArticle);
					})
					.catch(err => {
						// If an error occurred, log it
						console.log(err);
					});
			}
		});

		// Send a message to the client
		res.send("Scraped.");
	});
});

// Route for getting all Articles from the db
app.get("/articles", (req, res) => {
	// Grab every document in the Articles collection
	db.Article.find({})
		.then(dbArticle => {
			// If we were able to successfully find Articles, send them back to the client
			res.json(dbArticle);
		})
		.catch(err => {
			res.json(err);
		});
});

// Route for grabbing a specific Article by id, and populate it with its note
app.get("/articles/:id", (req, res) => {
	// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	db.Article.findOne({ _id: req.params.id })
		// ...and populate all of the notes associated with it
		.populate("note")
		.then(dbArticle => {
			// If we were able to successfully find an Article with the given id, send it back to the client
			res.json(dbArticle);
		})
		.catch(err => {
			res.json(err);
		});
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", (req, res) => {
	// Create a new note and pass the req.body to the entry
	db.Note.create(req.body)
		.then(dbNote => {
			// push note to array, rather than overwriting existing note
			return db.Article.findOneAndUpdate(
				{ _id: req.params.id },
				{ $push: { note: dbNote._id } },
				{ new: true }
			);
		})
		.then(dbArticle => {
			// If we were able to successfully update an Article, send it back to the client
			res.json(dbArticle);
		})
		.catch(err => {
			res.json(err);
		});
});

// Route to delete a Note
app.delete("/notes/:id", (req, res) => {
	db.Note.findOneAndRemove({ _id: req.params.id }, err => {
		if (err) return handleError(err);
	})
		.then(dbNote => {
			return dbArticle.findOneandUpdate(
				{ note: dbNote._id },
				{ $pull: { note: dbNote._id } },
				{ new: true }
			);
		})
		.then(dbArticle => {
			res.json(dbArticle);
		})
		.catch(err => {
			res.json(err);
		});
});

app.listen(PORT, () => {
	console.log(`App running on port ${PORT}!`);
});
