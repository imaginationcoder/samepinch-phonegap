function getPosts(){
    if(localStorage.getItem('default_posts')){
        posts = JSON.parse(localStorage.getItem('default_posts'))
        var source = $("#posts-template").html();
        var template = Handlebars.compile(source);
        $('#posts-list').prepend(template(posts));
        singlePostClickEvents()
        $("time.timeago").timeago();
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
            // when redirected here to after creating a post
            if(sessionStorage['after-add-post']){
                $('.load-up-posts').show()
                // then remove
                sessionStorage.removeItem('after-add-post')
            }

        },
        success: function (data) {
            var source = $("#posts-template").html();
            var template = Handlebars.compile(source);
            body = data.body
            localStorage.setItem('default_posts',JSON.stringify(body))
            $('#posts-list').prepend(template(body));
            singlePostClickEvents() // enable js for single post click
            $('.load-up-posts').hide()
            $("time.timeago").timeago();
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            errorDialog('Error',error_obj.message)
            $('.load-up-posts').hide()
        }
    })
}


function singlePostClickEvents(){
    $('.single-post').on('click', function (e) {
        e.preventDefault()
        //  alert($(this).data('uid'))
        sessionStorage.setItem('post_uid', $(this).data('uid'))
        window.location.href = 'post-show.html'
    })

    profileAvatarClick()

    $('.single-post .single-tag').on('click',function(e){
        e.stopPropagation()
        sessionStorage.setItem('tag_name',$(this).data('name'))
        window.location.href = 'tag-view.html'
    })


}

function singlePostShowReady(){

    $.ajax({
        url: window.api_url+'posts/'+sessionStorage['post_uid'],
        type: 'post',
        data: {
            'command' :"show",
            'access_token':  localStorage['access_token']
        },
        beforeSend: function () {
            // showAjaxSpinner()
        },
        success: function (data) {
            var source = $("#single-post-template").html();
            var template = Handlebars.compile(source);
            body = data.body
            //save obj for further comminication edit etc
            $('#post').html(template(body))//.hide().fadeIn('slow');
            $('#comment-form').find('input[name="post_id"]').val(sessionStorage['post_uid'])
            if(data.body.can){
                sessionStorage.setItem('current_post',JSON.stringify({content: body.content,uid: body.uid,tags: body.tags,anonymous: body.anonymous}))
                if($.inArray('edit',data.body.can) != -1){
                    $('#edit-post-nav').html('<span class="glyphicon glyphicon-pencil back pull-right edit-post"></span>')
                    $('.edit-post').attr('data-uid',data.body.uid)
                }
            }
          //  hideAjaxSpinner()
            $('.loading-content').hide()
            $("time.timeago").timeago();
            upDownVotePost()
            commentReady() //invoke comment section for after
            editComment()
            singlePostShowClickEvents()
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            errorDialog('Error',error_obj.message)
           // hideAjaxSpinner()
            $('.loading-content').hide()
        }
    })
}

function profileAvatarClick(){
    $('.profile-avatar').on('click',function(e){
        e.stopPropagation()
        if($(this).hasClass('anonymous')){
            e.preventDefault()
        }else{
            sessionStorage.setItem('profile_uid',$(this).data('uid'))
            sessionStorage.setItem('profile_name',$(this).data('name'))
            window.location.href = 'public-profile.html'
        }
    })
}

function singlePostShowClickEvents(){
    profileAvatarClick()
    $('.post-show .single-tag').on('click',function(e){
        e.stopPropagation()
        sessionStorage.setItem('tag_name',$(this).data('name'))
        window.location.href = 'tag-view.html'
    })

    $('.edit-post').on('click',function(e){
        e.preventDefault()
        sessionStorage.setItem('post_uid',$(this).data('uid'))
        window.location.href = 'edit-post.html'
    })
}


function upDownVotePost(){
    $('.up-down-vote-post').on('click',function(e){
        e.preventDefault()
        if (localStorage['current_user']) {
        target = $(this)
        command = target.hasClass('viewPostLikeActive') ? 'undoVoting' : 'upvote'
        $.ajax({
            url: window.api_url+'posts/'+$(this).data('id'),
            type: 'post',
            data: {
                'command' : command,
                'access_token':  localStorage['access_token'],
            },
            beforeSend: function () {
                if(command == 'undoVoting'){
                    target.removeClass('viewPostLikeActive')
                    target.addClass('viewPostLike')
                }else{
                    target.removeClass('viewPostLike')
                    target.addClass('viewPostLikeActive')
                }
                showAjaxSpinner();
            },
            success: function (data) {
               if(command == 'undoVoting'){
                   $("#post-upvote-count").text(parseInt($("#post-upvote-count").text()) - 1);
               }else{
                   $("#post-upvote-count").text(parseInt($("#post-upvote-count").text()) + 1);
               }
                hideAjaxSpinner();
            },
            error: function(xhr,textStatus,errorThrown ) {
                var error_obj = $.parseJSON(xhr.responseText)
                console.log(error_obj)
                hideAjaxSpinner()
                errorDialog('Error',error_obj.message)
            }
        })
        }else{
            window.location.href = 'signin.html'
        }
    })

}

//to add post
function getFavoriteGroups(from){
    $.ajax({
        url: window.api_url+'groups',
        type: 'post',
        data: {
            'command' :"favourites",
            'access_token':  localStorage['access_token'],
        },
        beforeSend: function () {
           // showAjaxSpinner();
        },
        success: function (data) {
            var source = $("#get-tags-template").html();
            var template = Handlebars.compile(source);
            // $('#comments').append(template(data.body));
            $("#add-post-tags").html(template(data.body))//.hide().fadeIn();
            //hideAjaxSpinner()
            $('.loading-content').hide()
            addPostReady() // invoke add post ready
            // check tag if user comes from tag list posts and click on add-post button
            if(sessionStorage['tag_name']){
                $(':checkbox[value="' + sessionStorage['tag_name'] + '"]').parents('li:first').trigger( "click" );
                sessionStorage.removeItem('tag_name')
            }
            if(from == 'edit-post'){
                post = JSON.parse(sessionStorage.getItem('current_post'))
                tags = post.tags
                if(post.anonymous == false){
                    $('.post-as-user').trigger('click');
                }
                $('#post-content-text').val(post.content)
                jQuery.each( tags, function( i, val ) {
                    $(':checkbox[value="' + val + '"]').parents('li:first').trigger( "click" );
                });
            }

        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
           // hideAjaxSpinner()
            $('.loading-content').hide()
            errorDialog('Error',error_obj.message)
        }
    })
}


function addPostReady(){
    //$('#post-content-text').focus()
    $("#addPost ul.tags-list li").click(function(e) {
        e.stopPropagation();
        tag =  $(this).find(".tagname")
        if(tag.hasClass('tagname-active')){
            tag.removeClass("tagname-active");
            $(this).find('input').prop('checked',false);
        }else{
            tag.addClass("tagname-active");
            $(this).find('input').prop('checked',true);
        }
    });

    $("#addPost ul.tags-list li .css-label").click(function(e) {
        $(this).parents('li:first').trigger( "click" );
        return false;
    });
    if(localStorage['current_user']){
        current_user = JSON.parse(localStorage.getItem('current_user'))
        if(current_user.photo){
            str = "<a href='#'>Post as "+ current_user.fname +"<img src='"+ current_user.photo +"' alt=''> </a>"
            $('.post-as-user').html(str)
        } else{
            str ="<div class='profilepic-placeholder'>"
            str += current_user.fname.substr(0, 1).toUpperCase() +""+current_user.lname.substr(0, 1).toUpperCase()
            str ="</div>"
            $('.post-as-user').html(str)
        }
        $('.post-as-ananymous').html('')

    }
    $('.post-as-user').on('click',function(e){
        current_user = JSON.parse(localStorage.getItem('current_user'))
        if(current_user.photo){
            var img = $('<img alt="">');
            img.attr('src', current_user.photo);
            $('#post-as-picture').html(img)
        }else{
            name ="<div class='profilepic-placeholder'>"
            name += current_user.fname.substr(0, 1).toUpperCase() +""+current_user.lname.substr(0, 1).toUpperCase()
            name ="</div>"
            $('#post-as-picture').html(name)
        }
        str = "<a href='#'>Post as anonymous <img alt='' src='img/ananymous-placeholder.png'> </a>"
        $('.post-as-ananymous').html(str)
        $(this).html('')
        $('#add-post-form').find('input[name="anonymous"]').val(false);
    })

    $('.post-as-ananymous').on('click',function(e){
        current_user = JSON.parse(localStorage.getItem('current_user'))
        var img = $('<img alt="" src="img/ananymous-placeholder.png">');
        $('#post-as-picture').html(img)
        if(current_user.photo){
            str = "<a href='#'>Post as "+ current_user.fname +"<img src='"+ current_user.photo +"' alt=''> </a>"
            $('.post-as-user').html(str)
        } else{
            str ="<div class='profilepic-placeholder'>"
            str += current_user.fname.substr(0, 1).toUpperCase() +""+current_user.lname.substr(0, 1).toUpperCase()
            str ="</div>"
            $('.post-as-user').html(str)
        }
        $(this).html('')
        $('#add-post-form').find('input[name="anonymous"]').val(true);
    })

    // redirect to signin if current user present and clicks on comment as or navigation
    $('#switch-post-as').on('click',function(e){
        if(!localStorage['current_user']){
            window.location.href = 'signin.html'
        }
    })

    $('#btn-send-post').on('click',function(e) {
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
                    url: window.api_url + 'posts',
                    type: 'post',
                    data: {
                        'command': "create",
                        'access_token': localStorage['access_token'],
                        'body': body_params
                    },
                    beforeSend: function () {
                        showAjaxSpinner();
                    },
                    success: function (data) {
                        hideAjaxSpinner();
                        sessionStorage.setItem('after-add-post',true)
                        window.location.href = 'index.html'
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
}

function getPostsByTag(){

    $('#Tagview-page .add-post').on('click',function(e){
        e.preventDefault();
        if(localStorage['current_user']){
            window.location.href = 'add-post.html'
        }else{
            window.location.href = 'signin.html'
        }
    })
    // set tag name
    $('#Tagview-page #tag-name').html(sessionStorage['tag_name'])

    // invoke posts by tag
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
                "key": sessionStorage['tag_name'].substring(1), // remove first char(#)
                "by": 'tag'
            }
        },
        beforeSend: function () {
            $('.load-up-posts').show()
        },
        success: function (data) {
            var source = $("#posts-template").html();
            var template = Handlebars.compile(source);
            body = data.body
            //set tag image
            tag_img = $('<img>')
            tag_img.attr('src',body.tag.image)
            $('#Tagview-page #tag-image').html(tag_img)
            $('.posts-list').prepend(template(body));
            $('.load-up-posts').hide()
            singlePostClickEvents() // enable js for single post click
            $("time.timeago").timeago();
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            errorDialog('Error',error_obj.message)
            $('.load-up-posts').hide()
        }
    })
}

function getFavouritePosts(){

    $('#btn-favourite-posts').on('click',function(e){
        e.preventDefault()
        if(localStorage['current_user']){
            if($(this).hasClass('fav-active')){
                $(this).removeClass('fav-active')
                getPosts()
            }else{
                $(this).addClass('fav-active')
                if(localStorage.getItem('favourite_posts')){
                    $('#posts-list').html('')
                    posts = JSON.parse(localStorage.getItem('favourite_posts'))
                    var source = $("#posts-template").html();
                    var template = Handlebars.compile(source);
                    $('#posts-list').prepend(template(posts));
                    singlePostClickEvents()
                    $("time.timeago").timeago();
                }
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
                            "key": '', // remove first char(#)
                            "by": 'favourites'
                        }
                    },
                    beforeSend: function () {
                        if(!localStorage.getItem('favourite_posts')){
                            $('.load-up-posts').show()
                        }
                    },
                    success: function (data) {
                        var source = $("#posts-template").html();
                        var template = Handlebars.compile(source);
                        body = data.body
                        localStorage.setItem('favourite_posts',JSON.stringify(body))
                        $('#posts-list').prepend(template(body));
                        singlePostClickEvents() // enable js for single post click
                        $('.load-up-posts').hide()
                        $("time.timeago").timeago();
                    },
                    error: function(xhr,textStatus,errorThrown ) {
                        var error_obj = $.parseJSON(xhr.responseText)
                        console.log(error_obj)
                        errorDialog('Error',error_obj.message)
                        $('.load-up-posts').hide()
                    }
                })
            }
        }else{
            window.location.href = 'signin.html'
        }
    })
}
