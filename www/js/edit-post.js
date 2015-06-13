getFavoriteGroups('edit-post')
$('#btn-edit-post').on('click',function(e) {
    e.preventDefault()
    content = $('#add-post-form').find('input[name="content"]')
    if (localStorage['current_user']) {
        if(content.val() == '') {
            errorDialog('Error', 'Please enter text')
            //   $('#post-content-text').focus()
        }else if($('input[type=checkbox]:checked').length == 0){
            errorDialog('Error', 'Please select atleast one tag')
        }
        else{
            // get checked tags
            var tagsArray = $("#add-post-form input:checkbox:checked").map(function(){
                return $(this).val();
            }).get(); ;
            var body_params = $.extend({}, $('#add-post-form').serializeHash())
            body_params['tags_array'] = tagsArray
            $.ajax({
                url: window.api_url + 'posts/'+post.uid,
                type: 'post',
                data: {
                    'command': "update",
                    'access_token': localStorage['access_token'],
                    'body': body_params
                },
                beforeSend: function () {
                    showAjaxSpinner();
                },
                success: function (data) {
                    hideAjaxSpinner();
                    window.location.href = 'post-show.html'
                },
                error: function (xhr, textStatus, errorThrown) {
                    var error_obj = $.parseJSON(xhr.responseText)
                    console.log(error_obj)
                    errorDialog('Error', error_obj.message)
                    hideAjaxSpinner();
                }
            })
        }
    }else {
        window.location.href = 'signin.html'
    }
})