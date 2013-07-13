$(document).ready(function() {
	var height = $('.driver-pool').height();
	var width = $('.driver-pool').width();
	var navH = $('.navbar').height();

	var tops = height/2 + navH;
	var bottoms = height/2

	var cars = $('.car').length;

	var cutoff, upperDiv, lowerDiv;

	if (cars % 2 == 0){
		cutoff = cars/2;
		upperDiv = width/cutoff;
		lowerDiv = width/cutoff;
	} else {
		cutoff = (cars+1)/2;
		upperDiv = width/(cutoff);
		lowerDiv = width/(cutoff-1);
	}

	$('.car').each(function(index, value) {
		var id = '#' + $(this).attr('id');
		var seats = parseInt($(id).attr('data-li-seat'),10);
		var passengers = $(id).children('.passengers').children('rider').length+1;
		if (index < cutoff) {
			$(id).css('bottom', bottoms);
			$(id).css('left', index*upperDiv);
			$(id).css('width', upperDiv);
		} else {
			$(id).css('top', tops);
			$(id).css('left', (index-cutoff)*lowerDiv);
			$(id).css('width', lowerDiv);
		}
		$(id).css('height', bottoms*passengers/seats);
	});


	//possible layout dimensions


	//create possible car
});