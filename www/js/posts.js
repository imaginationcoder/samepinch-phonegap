function getPosts(){
    $.ajax({
        url: window.api_url+'posts',
        type: 'post',
        data: {
            'command' :"all",
            'access_token':  localStorage['access_token'],
            'body': {
                "post_count": 0,
                "last_modified":"",
                "step":"",//# next or new
                "etag":""
            }
        },
        beforeSend: function () {
            $('.loading_indicator').css('display', 'inline-block');
        },
        success: function (data) {
            var source = $("#posts-template").html();
            var template = Handlebars.compile(source);
            $('#posts-list').prepend(template(data.body));
            singlePostClick() // enable js for single post click
            $('.loading_indicator').css('display', 'none');
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            errorDialog('Error',error_obj.message)
        }
    })
}


function singlePostClick(){
    $('.single-post').on('click', function (e) {
        e.preventDefault()
        alert($(this).data('uid'))
        sessionStorage.setItem('post-uid', $(this).data('uid'))
        window.location.href = 'post-show.html'
    })
}

function singlePostReady(){
    $.ajax({
        url: window.api_url+'posts/'+sessionStorage['post-uid'],
        type: 'post',
        data: {
            'command' :"show",
            'access_token':  localStorage['access_token']
        },
        beforeSend: function () {
            $('.loading_indicator').css('display', 'inline-block');
        },
        success: function (data) {
            var source = $("#single-post-template").html();
             var template = Handlebars.compile(source);
             $('#post').html(template(data.body));
          //  sessionStorage.removeItem('post-uid')
            $('.loading_indicator').css('display', 'none');
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            errorDialog('Error',error_obj.message)
        }
    })
}