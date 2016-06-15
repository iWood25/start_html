$(function () {
	// init carousel
	$('[data-js=carousel]').slick({
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: false,
		dots: true
	});

	// scrolling page to the top
	$('[data-js="scrollToTop"]').click(function () {
		$.scrollTo($('body'), 1500);
	})

	// add active class to list element
	var listElements = $('[data-js=list] li');

	listElements.on('click', function () {
		listElements.removeClass('active');
		$(this).addClass('active');
	})
});

$(window).load(function () {
	// init image gallery
	$('.gallery').masonry();
})

