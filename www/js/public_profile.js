$('#Profile-page .profile-name-profile').html(sessionStorage['profile_name'])
// sessionStorage.removeItem('profile_name')

// get Profile info by uid after that remove from session
$.ajax({
    url: window.api_url+'users/'+sessionStorage['profile_uid'],
    type: 'post',
    data: {
        'command' : 'public_profile',
        'access_token':  localStorage['access_token'],
    },
    beforeSend: function () { },
    success: function (data) {
        img = ''
        body = data.body
        $('#Profile-page .profile-name-profile').html(body.full_name)
        if(body.photo){
            p_img = $('<img>')
            p_img.attr('src',body.photo)
            img +=  "<div class='profilepic-img'>"
            img +=  '<img src='+ body.photo +' alt=""/>'
            img +=  "</div>"
        } else{
            img += "<div class='profilepic-placeholder'>"
            img +=   body.fname.substr(0, 1).toUpperCase() +""+body.lname.substr(0, 1).toUpperCase()
            img += "</div>"
        }

        $('#Profile-page #profile-pic-image').html(img)
        $('.follow-or-unfollow-user').attr('data-uid',body.uid)
        if(body.follow== false){
            $('.follow-or-unfollow-user').html('<button class="btn-normal">follow</button>')
            $('.follow-or-unfollow-user').removeClass('unfollow')
            $('.follow-or-unfollow-user').addClass('follow')
        }else if(body.follow == true){
            $('.follow-or-unfollow-user').html('<button class="btn-normal">un follow</button>')
            $('.follow-or-unfollow-user').removeClass('follow')
            $('.follow-or-unfollow-user').addClass('unfollow')
        }

    },
    error: function(xhr,textStatus,errorThrown ) {
        var error_obj = $.parseJSON(xhr.responseText)
        console.log(error_obj)
        hideAjaxSpinner()
        errorDialog('Error',error_obj.message)
    }
})



// invoke posts by user
$.ajax({
    url: window.api_url+'posts',
    type: 'post',
    data: {
        'command' :"filter",
        'access_token':  localStorage['access_token'],
        'body': {
            "post_count": 0,
            "last_modified":"",
            "step":"",//# next or new
            "etag":"",
            "key": sessionStorage['profile_uid'] ,
            "by": 'user'
        }
    },
    beforeSend: function () {
        $('.load-up-posts').show()
    },
    success: function (data) {
        var source = $("#posts-template").html();
        var template = Handlebars.compile(source);
        body = data.body
        $('.posts-list').prepend(template(body));
        $('.load-up-posts').hide()
        singlePostClickEvents() // enable js for single post click
    },
    error: function(xhr,textStatus,errorThrown ) {
        var error_obj = $.parseJSON(xhr.responseText)
        console.log(error_obj)
        errorDialog('Error',error_obj.message)
        $('.load-up-posts').hide()
    }
})

$('.follow-or-unfollow-user').on('click',function(){
    command =  ($(this).hasClass('follow')) ? 'follow' : 'unfollow'
    $.ajax({
        url: window.api_url+'users/'+$(this).data('uid'),
        type: 'post',
        data: {
            'command' : command,
            'access_token':  localStorage['access_token']
        },
        beforeSend: function () {
            showAjaxSpinner()
        },
        success: function (data) {
            if(command == 'follow'){
                $('.follow-or-unfollow-user').html('<button class="btn-normal">un follow</button>')
                $('.follow-or-unfollow-user').removeClass('follow')
                $('.follow-or-unfollow-user').addClass('unfollow')
            }else{
                $('.follow-or-unfollow-user').html('<button class="btn-normal">follow</button>')
                $('.follow-or-unfollow-user').removeClass('unfollow')
                $('.follow-or-unfollow-user').addClass('follow')
            }
            hideAjaxSpinner()
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            errorDialog('Error',error_obj.message)
            $('.load-up-posts').hide()
        }
    })

})