function getPosts(){
    if(localStorage.getItem('default_posts')){
        posts = JSON.parse(localStorage.getItem('default_posts'))
        var source = $("#posts-template").html();
        var template = Handlebars.compile(source);
        $('#posts-list').prepend(template(posts));
    }

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
          // show up spinner only if user visited first time
          if(!localStorage.getItem('default_posts')){
              $('.load-up-posts').show()
          }
        },
        success: function (data) {
            var source = $("#posts-template").html();
            var template = Handlebars.compile(source);
            body = data.body
            localStorage.setItem('default_posts',JSON.stringify(body))
            $('#posts-list').prepend(template(body));
            singlePostClick() // enable js for single post click
            $('.load-up-posts').hide()
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            errorDialog('Error',error_obj.message)
            $('.load-up-posts').hide()
        }
    })
}


function singlePostClick(){
    $('.single-post').on('click', function (e) {
        e.preventDefault()
      //  alert($(this).data('uid'))
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
            $('.loading_indicator').css('display', 'block');
        },
        success: function (data) {
            var source = $("#single-post-template").html();
            var template = Handlebars.compile(source);

            $('#post').html(template(data.body));

            //TODO place images
            /*str = $('.post-content').text()
             //alert(str.match(/\::(.*?)\::/))
             // alert(str.match("::(.*)::"))
             console.log(str.match("::(.*)::"))
             $.each(str.match("::(.*)::"), function(ix, val) {
             val = $.trim(val); //remove \r|\n
             if (val !== "")
             alert(ix);
             alert(val);
             });
             */
            commentReady() //invoke comment section for after
            $('.loading_indicator').css('display', 'none');
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            errorDialog('Error',error_obj.message)
            $('.loading_indicator').css('display', 'none');
        }
    })
}

function commentReady(){
    // toggle Comment As
    $('.comment-as').on('click',function(e){
        e.preventDefault()
        console.log(localStorage['current_user'])
        if(localStorage['current_user']){
            comment_as = $(this).data('value')
            ipt_comment_as = $('#comment-form').find('input[name="anonymous"]')
            if(comment_as == 'anonymous'){
                $('#btn-send-comment').text('as anonymous')
                ipt_comment_as.val(true);
            }else{
                $('#btn-send-comment').text('as user')
                ipt_comment_as.val(false);
            }
        }else{
            window.location.href = 'signin.html'
        }
    })


    // send function
    $('#btn-send-comment').on('click',function(e) {
        e.preventDefault()
        comment_text = $('#comment-form').find('input[name="text"]')
        if (localStorage['current_user']) {
            if(comment_text.val() == '') {
                errorDialog('Error', 'Please enter comment')
            }else{
                var body_params = $.extend({}, $('#comment-form').serializeHash())
                $.ajax({
                    url: window.api_url + 'comments',
                    type: 'post',
                    data: {
                        'command': "create",
                        'access_token': localStorage['access_token'],
                        'body': body_params
                    },
                    beforeSend: function () {
                        $('.loading_indicator').css('display', 'block');
                    },
                    success: function (data) {
                        var source = $("#single-comment-template").html();
                        var template = Handlebars.compile(source);
                        // $('#comments').append(template(data.body));
                        $("#comments .comment:last").after(template(data.body)).hide().fadeIn();
                        //clear input
                        comment_text.val('')
                        $('.loading_indicator').css('display', 'none');
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var error_obj = $.parseJSON(xhr.responseText)
                        console.log(error_obj)
                        errorDialog('Error', error_obj.message)
                        $('.loading_indicator').css('display', 'none');
                    }
                })
            }

        }else {
            window.location.href = 'signin.html'
        }
    })
}
