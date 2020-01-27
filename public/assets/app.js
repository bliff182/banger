$(document).ready(() => {
	// Grab the articles as a json
	$.getJSON("/articles", data => {
		for (let i = 0; i < data.length; i++) {
			if (data[i].summary) {
				$("#articles").append(
					`<div class='article' data-id='${data[i]._id}'>
						<h4 class='headline'><a class='article-url' href='${data[i].url}' target='_blank'>${data[i].headline}</a></h4>
						<p class='summary'>${data[i].summary}</p><br />
						<button type='button' class='btn btn-success' data-id='${data[i]._id}' data-toggle='modal' data-target='#commentModal' id='comment-btn'>View Comments</button>
					</div>
					<br />`
				);
			} else {
				$("#articles").append(
					`<div class='article' data-id='${data[i]._id}'>
						<h4 class='headline'><a class='article-url' href='${data[i].url}' target='_blank'>${data[i].headline}</a></h4>
						<br />
						<button type='button' class='btn btn-success' data-id='${data[i]._id}' data-toggle='modal' data-target='#commentModal' id='comment-btn'>View Comments</button>
					</div>
					<br />`
				);
			}
		}

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
				// url: "/articles/" + thisId
			}).then(data => {
				$("#commentModalLabel").text(data.headline);

				// Adding a textarea to modal
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
				// If there's a note in the article
				if (data.note) {
					// Prepend comment in modal
					$(".modal-body").prepend(`<div class="card" style="width: 18rem;">
						<div class="card-body">
						<h5 class="card-title">${data.note.title}</h5>
						<p class="card-text">${data.note.body}</p>
						</div>
						</div>
						<br />`);
				} else {
					$(".modal-body").prepend(`<p>No comments yet for this article</p>`);
				}
			});
		});
	});

	// When you click the savenote button
	$(document).on("click", "#savenote", function() {
		let thisId = $(this).attr("data-id");

		// Run a POST request to change the note, using what's entered in the inputs
		$.ajax({
			method: "POST",
			url: `/articles/${thisId}`,
			data: {
				// Value taken from title input
				title: $("#commentTitle").val(),
				// Value taken from note textarea
				body: $("#commentTextarea").val()
			}
		}).then(data => {
			console.log(data);
			$("#notes").empty();
		});
		$("#titleinput").val("");
		$("#bodyinput").val("");
	});
});
