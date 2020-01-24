const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

const PORT = 3000;

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

mongoose.connect(MONGODB_URI);

app.get('/scrape', (req, res) => {
	axios.get('https://www.theonion.com/').then(response => {
		let $ = cheerio.load(response.data);
		$('article').each((i, element) => {
			let result = {};

			result.headline = $(element)
				.find('h4')
				.text()
				.trim();
			result.summary = $(element)
				.find('p')
				.text()
				.trim();
			result.url = $(element)
				.find('a')
				.attr('href');

			// if (result.headline && result.summary && result.url) {
			if (result.headline && result.url) {
				db.Article.create(result)
					.then(dbArticle => {
						console.log(dbArticle);
					})
					.catch(err => {
						console.log(err);
					});
			}

			// db.Article.create(result)
			// 	.then(dbArticle => {
			// 		console.log(dbArticle);
			// 	})
			// 	.catch(err => {
			// 		console.log(err);
			// 	});
		});
		res.send('Scraped.');
	});
});

app.get('/articles', (req, res) => {
	db.Article.find({})
		.then(dbArticle => {
			res.json(dbArticle);
		})
		.catch(err => {
			res.json(err);
		});
});

app.get('/aritcles/:id', (req, res) => {
	db.Article.findOne({ _id: req.params.id })
		.populate('note')
		.then(dbArticle => {
			res.json(dbArticle);
		})
		.catch(err => {
			res.json(err);
		});
});

app.post('/articles/:id', (req, res) => {
	db.Note.create(req.body)
		.then(dbNote => {
			return dbArticle.findOneAndUpdate(
				{ _id: req.params.id },
				{ node: dbNote._id },
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

// Start the server
app.listen(PORT, () => {
	console.log(`App running on port ${PORT}!`);
});
