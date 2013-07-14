resize();
$(document).ready(function() {
	resize();	
	setSeats();

	$(".assign").on('click', function() {
		assign();
	});

	$( ".draggable" ).sortable({
            connectWith: ".draggable",
            revert: 200,
            helper: 'clone',
            start: function(event, ui) {
            	ui.item.bind("click.prevent",
                	function(event) { event.preventDefault(); });
        	},
        	stop: function(event, ui) {
            	setTimeout(function(){ui.item.unbind("click.prevent");}, 300);
        	},
            update: function(event, ui) {
            	resize();
            	setSeats();
              if (ui.item.parent().hasClass('passengers')) {
                var driver_name = ui.item.parentsUntil('.driver-pool')[1].attributes[1].nodeValue;
                var rider_name = ui.item[0].attributes[1].nodeValue;
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
                                 console.log('Error');     
                    }
                });    
              }

            	else if(ui.item.parent().hasClass('delete')){
            		(ui.item.hide());
                var eventPath = event.currentTarget.location.pathname;
                var rider_name = ui.item[0].attributes[1].nodeValue;
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
              else { 
                var driver_name = ''; 
                var rider_name = ui.item[0].attributes[1].nodeValue;
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
	var width = $('.driver-pool').width();
	var navH = $('.navbar').height();

	var tops = height/2 + navH +20;
	var bottoms = height/2 -20;

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
			$(this).css('bottom', bottoms+41);
			$(this).css('left', index*upperDiv-15);
			$(this).css('width', upperDiv-10);
			$(this).css('border-top-left-radius', '5px');
			$(this).css('border-top-right-radius', '5px');
			setColor($(this), index);
		} else {
			$(this).css('top', tops);
			$(this).css('left', (index-cutoff)*lowerDiv-15);
			$(this).css('width', lowerDiv-10);
			$(this).css('border-bottom-right-radius', '5px');
			$(this).css('border-bottom-left-radius', '5px');
			setColor($(this), index+3);
		}
		$(this).css('height', bottoms*passengers/seats+15);
		$(this).css('margin-left', 28);
	});
}

function setSeats() {
	$('.car').each(function () {
		var num = $(this).attr('data-li-seats')-1-$(this).children('.passengers').children('.rider').length;
		$(this).children('.driver').children().children('.available').html(num);
		if (num == 0) {
			$(this).css('opacity', '0.4');
		} else {
			$(this).css('opacity', '1');
		}
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

function assign() {
	var people = $('.rider-pool').children('.people').children('.rider');
	var cars = $('.car');
	people.each(function () {
		var person = $(this);
		cars.each(function() {
			console.log($(this).children('.driver').children().children('.available')[0].textContent);
			if ($(this).children('.driver').children().children('.available')[0].textContent > 0) {
				manuallyAddToCar($(this), person);
				setSeats();
			}
		});
	});
	resize();
}

function manuallyAddToCar(car, person) {
	car.children('.passengers').append(person);
	var driver_name = car.attr('driverName');
    var rider_name = $.trim(jQuery(person).children('.username')[0].textContent);
    var eventPath = location.pathname;
    var myData = {
        'rider_name': rider_name,
        'driver': driver_name
    };
    console.log(myData)

    $.ajax({
     	url: eventPath + '/updateRider',
        type: 'put',
        dataType: 'json',
        data: myData,
        success: function( data ) {
            console.log(data);
        },
        error   : function( xhr, err ) {
            console.log('Error');     
        }
    });
    setSeats();
}

$(window).load(function() {
  resize();
});
