---
---
// Direct to search result page
jQuery(function() {
	$('#search').submit(function(e) {
		// stop the form from doing its default behavior
		e.preventDefault();

		// set the query, and go to the search page with our query URL
		document.location.href=
            location.protocol
            + "//" + location.host
            + '{{ site.baseurl }}/search?q='+$("#search-box").val();
	});
});
