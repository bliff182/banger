$(document).ready(() => {
	// Grab the articles as a json
	$.getJSON('/articles', data => {
		for (let i = 0; i < data.length; i++) {
			if (data[i].summary) {
				$('#articles').append(
					`<div class='article' data-id=${data[i]._id}><p class='article-content'>${data[i].headline}<br />${data[i].url}<br />${data[i].summary}</p></div`
				);
			} else {
				$('#articles').append(
					`<div class='article' data-id=${data[i]._id}><p class='article-content'>${data[i].headline}<br />${data[i].url}</p></div>`
				);
			}

			// $('#articles').append(
			// 	`<div class='article' data-id=${data[i]._id}><p class='article-title>${data[i].headline}<br />${data[i].url}</p></div>`
			// );
			// if (data[i].summary) {
			// 	$('#articles').append(
			// 		`<p class='summary'>Summary: ${data[i].summary}</p>`
			// 	);
			// }
		}
	});
});
