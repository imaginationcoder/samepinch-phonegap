function getPosts(){
    if(localStorage.getItem('default_posts')){
        posts = JSON.parse(localStorage.getItem('default_posts'))
        var source = $("#posts-template").html();
        var template = Handlebars.compile(source);
        $('#posts-list').prepend(template(posts));
        singlePostClickEvents()
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

    $('.single-post .profile-avatar').on('click',function(e){
        e.stopPropagation()
        if($(this).hasClass('anonymous')){
            e.preventDefault()
        }else{
            alert('Under development')
        }
    })

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
            showAjaxSpinner()
        },
        success: function (data) {
            var source = $("#single-post-template").html();
            var template = Handlebars.compile(source);

            $('#post').html(template(data.body));
            $('#comment-form').find('input[name="post_id"]').val(sessionStorage['post_uid'])

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
            hideAjaxSpinner()
            upDownVotePost()
            commentReady() //invoke comment section for after
            singlePostShowClickEvents()
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            errorDialog('Error',error_obj.message)
            hideAjaxSpinner()
        }
    })
}

function singlePostShowClickEvents(){

    $('.post-show .profile-avatar').on('click',function(e){
        e.stopPropagation()
        if($(this).hasClass('anonymous')){
            e.preventDefault()
        }else{
            alert('Under development')
        }
    })

    $('.post-show .single-tag').on('click',function(e){
        e.stopPropagation()
        sessionStorage.setItem('tag_name',$(this).data('name'))
        window.location.href = 'tag-view.html'
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
function getFavoriteGroups(){
    $.ajax({
        url: window.api_url+'groups',
        type: 'post',
        data: {
            'command' :"favourites",
            'access_token':  localStorage['access_token'],
        },
        beforeSend: function () { showAjaxSpinner();  },
        success: function (data) {
            var source = $("#get-tags-template").html();
            var template = Handlebars.compile(source);
            // $('#comments').append(template(data.body));
            $("#add-post-tags").html(template(data.body))//.hide().fadeIn();
            hideAjaxSpinner()
            addPostReady() // invoke add post ready
            // check tag if user comes from tag list posts and click on add-post button
            if(sessionStorage['tag_name']){
                $(":checkbox[value="+sessionStorage['tag_name']+"]").parents('li:first').trigger( "click" );
                //sessionStorage.removeItem('tag_name')
            }
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            hideAjaxSpinner()
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
