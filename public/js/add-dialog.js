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
                         alert('Submitted');
            },
            error   : function( xhr, err ) {
                         alert('Error');     
            }
        });    
        return false;
    });
});
