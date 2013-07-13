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

    $('#dialogModal').on('submit', 'form#newUserForm', function() {            
        $.ajax({
            url     : $(this).attr('action'),
            type    : $(this).attr('method'),
            dataType: 'json',
            data    : $(this).serialize(),
            success : function( data ) {
                         console.log(data);
            },
            error   : function( xhr, err ) {
                         alert('Error');     
            }
        });    
        var data = $(this).serializeArray();
        var username = data[0].value;
        var phone = data[1].value;
        $('.rider-pool').append(
          "<div class=rider><span>" + username + "</span><span>" + phone + "</span></div>"
        );
        return false;
    });
});
