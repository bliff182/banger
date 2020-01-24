$(document).ready(() => {
	// Grab the articles as a json
	$.getJSON("/articles", data => {
		for (let i = 0; i < data.length; i++) {
			if (data[i].summary) {
				$("#articles").append(
					`<div class='article' data-id='${data[i]._id}'><p class='headline'>${data[i].headline}</p><p class='summary'>${data[i].summary}</p><a href='${data[i].url}' target=_'blank'>Link to Article</a></div><br />`
				);
			} else {
				$("#articles").append(
					`<div class='article' data-id='${data[i]._id}'><p class='headline'>${data[i].headline}</p><a href='${data[i].url}' target='_blank'>Link to Article</a></div><br />`
				);
			}
		}

		// Whenever someone clicks an `.article` class div
		// $(document).on('click', '.article', () => {
		// ^^ This doesn't work when arrow function is used ^^
		$(document).on("click", ".article", function() {
			$("#notes").empty();

			// Save the data-id from the clicked div
			let thisId = $(this).attr("data-id");
			// console.log(thisId);

			// Now make an ajax call for the Article
			$.ajax({
				method: "GET",
				url: `/articles/${thisId}`
				// url: "/articles/" + thisId
			}).then(data => {
				console.log(data);
				$("#notes").append(`<h2>${data.headline}</h2`);
				$("#notes").append('<input id="titleinput" name="title" >');
				$("#notes").append('<textarea id="bodyinput" name="body"></textarea>');
				$("#notes").append(
					`<button data-id='${data._id}' id='savenote'>Save Note</button>`
				);
				// If there's a note in the article
				if (data.note) {
					$("#titleinput").val(data.note.title);
					$("#bodyinput").val(data.note.body);
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
			// url: "/articles/" + thisId,
			data: {
				// Value taken from title input
				title: $("#titleinput").val(),
				// Value taken from note textarea
				body: $("#bodyinput").val()
			}
		}).then(data => {
			console.log(data);
			$("#notes").empty();
		});
		$("#titleinput").val("");
		$("#bodyinput").val("");
	});
});
