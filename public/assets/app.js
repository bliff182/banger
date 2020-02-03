function renderArticles(data) {
	// Loop through articles collection and append headline, summary, and url to #articles div
	for (let i = 0; i < data.length; i++) {
		$("#articles").append(
			`<div class='article' data-id='${data[i]._id}'>
				<h4 class='headline'>
				<a class='article-url' href='${data[i].url}' target='_blank'>${data[i].headline}</a>
				</h4>
				<p class='summary'>${data[i].summary}</p>
				<button type='button' class='btn btn-success' data-id='${data[i]._id}' data-toggle='modal' data-target='#commentModal' id='comment-btn'>View Comments</button>`
		);
	}
}

function renderModal(data) {
	$("#commentModalLabel").text(data.headline);
	$(".modal-body").append(
		`<form>
		<div class='form-group'>
		<input type='text' class='form-control' id='commentTitle' placeholder='Comment title'>
		</div>
		<div class='form-group'>
		<textarea class='form-control' id='commentTextarea' rows='3' placeholder='Leave a comment!'></textarea>
		</div>
		</form>`
	);
	// If there's a note in the article, display it
	if (data.note.length > 0) {
		for (let i = 0; i < data.note.length; i++) {
			$(".modal-body").prepend(
				`<div class='card'>
				<div class='card-body'>
				<h5 class='card-title'>${data.note[i].title}</h5>
				<p class='card-text'>${data.note[i].body}</p>
				<button class='btn btn-danger' data-dismiss='modal' id='deleteNote' data-id='${data.note[i]._id}'>&times;</button>
				</div>
				</div>
				<br />`
			);
		}
	} else {
		$(".modal-body").prepend("<p>No comments yet for this article.</p>");
	}
}

$(document).ready(function() {
	// Append existing articles on page load
	$.getJSON("/articles/", data => renderArticles(data));

	$("#scrapeBtn").on("click", function() {
		// Empty div so articles don't stack
		$("#articles").empty();
		$.get("/scrape/").then(function() {
			// Grab the articles as a json
			$.getJSON("/articles/", data => renderArticles(data));
		});
	});

	// $(document).on('click', '#comment-btn', () => {
	// ^^ This doesn't work when arrow function is used ^^
	$(document).on("click", "#comment-btn", function() {
		$(".modal-body").empty();

		// Save the data-id from the clicked div
		let thisId = $(this).attr("data-id");
		// assign same data-id to #savenote button to use later
		$("#savenote").attr("data-id", thisId);

		// Now make an ajax call for the Article
		$.ajax({
			method: "GET",
			url: `/articles/${thisId}`
		}).then(data => {
			renderModal(data);
		});
	});

	// When you click the savenote button
	$(document).on("click", "#savenote", function() {
		let thisId = $(this).attr("data-id");
		let commentTitle = $("#commentTitle").val();
		let commentBody = $("#commentTextarea").val();

		// Run a POST request to change the note, using what's entered in the inputs
		$.ajax({
			method: "POST",
			url: `/articles/${thisId}`,
			data: {
				// Value taken from title input
				title: commentTitle,
				// Value taken from note textarea
				body: commentBody
			}
		}).then(data => {
			console.log(data);
		});
	});

	// Deleting a note
	$(document).on("click", "#deleteNote", function() {
		let thisId = $(this).attr("data-id");
		$.ajax({
			method: "DELETE",
			url: `/notes/${thisId}`
		}).then(function() {
			console.log(`Deleted note with ID ${thisId}`);
		});
	});
});
