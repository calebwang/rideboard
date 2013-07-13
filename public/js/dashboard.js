$(document).ready(function() {
	var height = $('.driver-pool').height();
	var width = $('.driver-pool').width() - 20;
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
			$(this).css('bottom', bottoms);
			$(this).css('left', index*upperDiv);
			$(this).css('width', upperDiv);
		} else {
			$(this).css('top', tops);
			$(this).css('left', (index-cutoff)*lowerDiv);
			$(this).css('width', lowerDiv);
		}
		$(this).css('height', bottoms*passengers/seats);
		$(this).css('margin-left', 28);
	});


	//possible layout dimensions


	//create possible car
});
