$(document).ready(function() {
    $('#add-passenger').click(function() {
        $('#dialogModal').modal('show');
    });
    $('#dialog-close').click(function() {
        $('#dialogModal').modal('hide');
    });
    
    $('#dialog-save').click(function() {
        $('#dialogModal').modal('hide');
    });

    $('#dialog-close2').click(function() {
        $('#dialogModal2').modal('hide');
    });
    
    $('#dialog-save2').click(function() {
        $('#dialogModal2').modal('hide');
    });

    $('#seats-input').hide();

    if ($('#isDriver').val() === 'Yes') {
        $('#seats-input').show();
    }

    $('#isDriver').change(function() {
        $('#seats-input').hide();
        if ($(this).val() === 'Yes') {
            $('#seats-input').show();
        }
    });

    $('#seats-input2').hide();

    if ($('#isDriver2').val() === 'Yes') {
        $('#seats-input2').show();
    }

    $('#isDriver2').change(function() {
        $('#seats-input2').hide();
        if ($(this).val() === 'Yes') {
            $('#seats-input2').show();
        }
    });

    $( ".rider" ).on('click', function() {
        $('#dialogModal2').modal('show');
        $('#name2').val($('span:first', this).text());
        $('#location2').val($('span:nth-child(4)', this).text());
        $('#phone2').val($('span:nth-child(2)', this).text());
    });

    $('#dialogModal2').on('submit', 'form#updateRider', function() {            
        $.ajax({
            url     : $(this).attr('action'),
            type    : $(this).attr('method'),
            dataType: 'json',
            data    : $(this).serialize(),
            success : function( data ) {
                         console.log(data);
                         $(this)[0].reset();
            },
            error   : function( xhr, err ) {
                         console.log('Error');     
            }
        });
        return false;
    });    

    $('#dialogModal').on('submit', 'form#newUserForm', function() {            
        $.ajax({
            url     : $(this).attr('action'),
            type    : $(this).attr('method'),
            dataType: 'json',
            data    : $(this).serialize(),
            success : function( data ) {
                         console.log(data);
                        $(this)[0].reset();
            },
            error   : function( xhr, err ) {
                         console.log('Error');     
            }
        });    
        var data = $(this).serializeArray();
        var username = data[0].value;
        var phone = data[1].value;
        var loc = data[2].value;
        console.log('data');
        console.log(data);
        if (data[3].value === 'No') {
          $('.rider-pool').append(
            "<div class=rider><span>" + username + "</span><span style=\"float: right; margin-right: 10px\">" + phone + "</span><br><span>"+loc+"</span></div>"
          );
        }
        if (data[3].value === 'Yes') {
          var seats = data[4].value;
            $('.driver-pool').append(
                '<div data-li-seats="' + seats +  '" driverName="' + username + '" class="car">' +
                  '<div class="driver">' + 
                    '<p>Driver: ' + username + '</p>' + 
                    '<p>Total Seats: ' + seats + '</p>' + 
                  '</div>' + 
                  '<div class="passengers draggable">Passengers:' + 
                  '</div>' + 
                '</div>'
            );
        resize();
        }
    });
});
