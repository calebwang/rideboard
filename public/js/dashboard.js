$(document).ready(function() {
	resize();	

	$( ".draggable" ).sortable({
            connectWith: ".draggable",
            revert: 200,
            update: function(event, ui) {
            	console.log('resize');
            	resize();
              var driver_name = ui.item.parentsUntil('.driver-pool')[1].attributes[1].nodeValue;
              var rider_name = ui.item[0].textContent.split(' ')[0];
              var eventPath = event.currentTarget.location.pathname;
              var myData = {
                  'rider_name': rider_name,
                  'driver': driver_name
              };
              console.log(myData)
              $.ajax({
                  url     : eventPath + '/updateRider',
                  type    : 'put',
                  dataType: 'json',
                  data    : myData,
                  success : function( data ) {
                               console.log(data);
                  },
                  error   : function( xhr, err ) {
                               alert('Error');     
                  }
              });    
            }
    });
});

function resize() {
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
		var seats = parseInt($(this).attr('data-li-seats'),10);
		var passengers = $(this).children('.passengers').children('.rider').length+1;
		console.log(passengers);
		if (index < cutoff) {
			$(this).css('bottom', bottoms);
			$(this).css('left', index*upperDiv);
			$(this).css('width', upperDiv);
		} else {
			$(this).css('top', tops);
			$(this).css('left', (index-cutoff)*lowerDiv);
			$(this).css('width', lowerDiv);
		}
		console.log(bottoms*passengers/seats);
		console.log(seats);
		$(this).css('height', bottoms*passengers/seats);
		$(this).css('margin-left', 28);
	});
}
