$(document).ready(function() {
	resize();	

	$( ".draggable" ).sortable({
            connectWith: ".draggable",
            revert: 200,
            update: function(event, ui) {
            	resize();
              if (ui.item.parent().hasClass('passengers')) {
                var driver_name = ui.item.parentsUntil('.driver-pool')[1].attributes[1].nodeValue;
                var rider_name = ui.item[0].textContent.split(' ')[0];
                var eventPath = event.currentTarget.location.pathname;
                console.log(ui.item.parent())
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
                                 console.log('Error');     
                    }
                });    
              }

            	if(ui.item.parent().hasClass('delete')){
            		(ui.item.hide());
                var eventPath = event.currentTarget.location.pathname;
                var rider_name = ui.item[0].textContent.split(' ')[0];
                var myData = {
                    'rider_name': rider_name,
                };
                $.ajax({
                    url     : eventPath + '/deleteRider',
                    type    : 'delete',
                    dataType: 'json',
                    data    : myData,
                    success : function( data ) {
                                 console.log(data);
                    },
                    error   : function( xhr, err ) {
                                 console.log('Error');     
                    }
                }); 
            	}

            	var grandParent = ui.item.parent().parent();
            	if (grandParent.hasClass('car')) {
            		console.log(grandParent.attr('data-li-seats')-1);
            		console.log(ui.item.siblings().length);
            		if (grandParent.attr('data-li-seats')-1 == ui.item.siblings().length) {
            			$(this).sortable('cancel');
            			$('.full-car').show();
            		}
            	}
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
		if (index < cutoff) {
			$(this).css('bottom', bottoms);
			$(this).css('left', index*upperDiv);
			$(this).css('width', upperDiv);
			setColor($(this), index);
		} else {
			$(this).css('top', tops);
			$(this).css('left', (index-cutoff)*lowerDiv);
			$(this).css('width', lowerDiv);
			setColor($(this), index+1);
		}
		$(this).css('height', bottoms*passengers/seats);
		$(this).css('margin-left', 28);
	});
}

function setColor(item, index){
	switch(index%4)
	{
		case 0:
			item.addClass('color1');
			break;
		case 1:
			item.addClass('color2');
			break;
		case 2:
			item.addClass('color3');
			break;
		case 3:
			item.addClass('color4');
			break;
	}
}
