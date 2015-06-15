
function commentReady(){
    // send function
    upDownVoteComment()
    $('#btn-send-comment').unbind().bind('click',function(e) {
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
                        showAjaxSpinner();
                    },
                    success: function (data) {
                        var source = $("#single-comment-template").html();
                        var template = Handlebars.compile(source);
                        $(template(data.body)).appendTo('#all-comments').hide().fadeIn(2000);
                        // $("html,body").animate({scrollTop: $('ul#all-comments li:last').offset().top - 30});
                        comment_text.val('')//clear input
                        hideAjaxSpinner();
                        upDownVoteComment()
                        editComment()
                        $("time.timeago").timeago();
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


    // set comment as user
    if(localStorage['current_user']){
        current_user = JSON.parse(localStorage.getItem('current_user'))
        if(current_user.photo){
            str = "<a href='#'>Comment as "+ current_user.fname +"<img src='"+ current_user.photo +"' alt=''> </a>"
            $('.comment-as-user').html(str)
        } else{
            str ="<div class='profilepic-placeholder'>"
            str += current_user.fname.substr(0, 1).toUpperCase() +""+current_user.lname.substr(0, 1).toUpperCase()
            str ="</div>"
            $('.comment-as-user').html(str)
        }
        $('.comment-as-ananymous').html('')

    }

    $('.comment-as-user').unbind().bind('click',function(e){
        current_user = JSON.parse(localStorage.getItem('current_user'))
        if(current_user.photo){
            var img = $('<img alt="">');
            img.attr('src', current_user.photo);
            $('#comment-as-picture').html(img)
        }else{
            name ="<div class='profilepic-placeholder'>"
            name += current_user.fname.substr(0, 1).toUpperCase() +""+current_user.lname.substr(0, 1).toUpperCase()
            name ="</div>"
            $('#comment-as-picture').html(name)
        }
        str = "<a href='#'>Comment as anonymous <img alt='' src='img/ananymous-placeholder.png'> </a>"
        $('.comment-as-ananymous').html(str)
        $(this).html('')
        $('#comment-form').find('input[name="anonymous"]').val(false);

    })

    $('.comment-as-ananymous').unbind().bind('click',function(e){
        current_user = JSON.parse(localStorage.getItem('current_user'))
        var img = $('<img alt="" src="img/ananymous-placeholder.png">');
        $('#comment-as-picture').html(img)
        if(current_user.photo){
            str = "<a href='#'>Comment as "+ current_user.fname +"<img src='"+ current_user.photo +"' alt=''> </a>"
            $('.comment-as-user').html(str)
        } else{
            str ="<div class='profilepic-placeholder'>"
            str += current_user.fname.substr(0, 1).toUpperCase() +""+current_user.lname.substr(0, 1).toUpperCase()
            str ="</div>"
            $('.comment-as-user').html(str)
        }
        $(this).html('')
        $('#comment-form').find('input[name="anonymous"]').val(true);
    })


    // redirect to signin if current user present and clicks on comment as or navigation
    $('#switch-comment-as').unbind().bind('click',function(e){
        if(!localStorage['current_user']){
            window.location.href = 'signin.html'
        }
    })

    //Edit comment -------------------------------*****-----------------------------------------------------------------




    // flag comment
    $('.flag-comment').unbind().bind('click',function(e){
        e.preventDefault()
        alert('Under development')
    })


}


function editComment(){

    $('.edit-post-comment').unbind().bind('click',function(e){
        e.preventDefault() 
        $('#viewPost').removeClass('display-block').addClass('display-none')
        $('#editComment').removeClass('display-none').addClass('display-block')
        $('#edit-comment-form').find('input[name="anonymous"]').val($(this).data('anonymous'));
        $('#edit-comment-form').find('input[name="comment_id"]').val($(this).data('uid'));
        $('.edit-comment-textarea').val($(this).data('text'));
    })

    $('#edit-comment-back').unbind().bind('click',function(e){
        e.preventDefault()
        $('#editComment').removeClass('display-block').addClass('display-none')
        $('#viewPost').removeClass('display-none').addClass('display-block')
    })

    if(localStorage['current_user']){
        current_user = JSON.parse(localStorage.getItem('current_user'))
        if(current_user.photo){
            str = "<a href='#'>Comment as "+ current_user.fname +"<img src='"+ current_user.photo +"' alt=''> </a>"
            $('.edit-comment-as-user').html(str)
        } else{
            str ="<div class='profilepic-placeholder'>"
            str += current_user.fname.substr(0, 1).toUpperCase() +""+current_user.lname.substr(0, 1).toUpperCase()
            str ="</div>"
            $('.edit-comment-as-user').html(str)
        }
        $('.edit-comment-as-ananymous').html('')

    }

    $('.edit-comment-as-user').unbind().bind('click',function(e){
        current_user = JSON.parse(localStorage.getItem('current_user'))
        if(current_user.photo){
            var img = $('<img alt="">');
            img.attr('src', current_user.photo);
            $('#edit-comment-as-picture').html(img)
        }else{
            name ="<div class='profilepic-placeholder'>"
            name += current_user.fname.substr(0, 1).toUpperCase() +""+current_user.lname.substr(0, 1).toUpperCase()
            name ="</div>"
            $('#edit-comment-as-picture').html(name)
        }
        str = "<a href='#'>Comment as anonymous <img alt='' src='img/ananymous-placeholder.png'> </a>"
        $('.edit-comment-as-ananymous').html(str)
        $(this).html('')
        $('#edit-comment-form').find('input[name="anonymous"]').val(false);

    })

    $('.edit-comment-as-ananymous').unbind().bind('click',function(e){
        current_user = JSON.parse(localStorage.getItem('current_user'))
        var img = $('<img alt="" src="img/ananymous-placeholder.png">');
        $('#edit-comment-as-picture').html(img)
        if(current_user.photo){
            str = "<a href='#'>Comment as "+ current_user.fname +"<img src='"+ current_user.photo +"' alt=''> </a>"
            $('.edit-comment-as-user').html(str)
        } else{
            str ="<div class='profilepic-placeholder'>"
            str += current_user.fname.substr(0, 1).toUpperCase() +""+current_user.lname.substr(0, 1).toUpperCase()
            str ="</div>"
            $('.edit-comment-as-user').html(str)
        }
        $(this).html('')
        $('#edit-comment-form').find('input[name="anonymous"]').val(true);
    })


    // redirect to signin if current user present and clicks on comment as or navigation
    $('#switch-edit-comment-as').unbind().bind('click',function(e){
        if(!localStorage['current_user']){
            window.location.href = 'signin.html'
        }
    })

    $('#btn-send-edit-comment').unbind().bind('click',function(e) {
        e.preventDefault()
        comment_text = $('#edit-comment-form').find('input[name="text"]')
        comment_id = $('#edit-comment-form').find('input[name="comment_id"]').val();
        if (localStorage['current_user']) {
            if(comment_text.val() == '') {
                errorDialog('Error', 'Please enter comment')
            }else{
                var body_params = $.extend({}, $('#edit-comment-form').serializeHash())
                $.ajax({
                    url: window.api_url + 'comments/'+comment_id,
                    type: 'post',
                    data: {
                        'command': "update",
                        'access_token': localStorage['access_token'],
                        'body': body_params
                    },
                    beforeSend: function () { showAjaxSpinner(); },
                    success: function (data) {

                        body = data.body
                        commenter = body.commenter
                        tagert = $('#comment-'+body.uid)
                        upDownVoteComment()
                        str = ''
                        if(body.anonymous==true){
                            str += "<div class='profilepic-placeholder profile-avatar anonymous'> <img src='img/ananymous-placeholder.png' alt=''/></div>"
                        }else{
                            if(commenter.photo){
                                str += "<img class='profile-avatar' src='"+ commenter.photo +"' alt=''></img>"
                            }else{
                                str ="<div class='profilepic-placeholder profile-avatar'>"
                                str += commenter.fname.substr(0, 1).toUpperCase() +""+commenter.lname.substr(0, 1).toUpperCase()
                                str ="</div>"
                            }
                        }
                        tagert.find('.profilepic-img').html(str)
                        tagert.find('.comment-text').html(body.text)
                        //tagert.find('.edit-post-comment').attr('data-text',body.text)
                        //tagert.find('.edit-post-comment').attr('data-anonymous',body.anonymous)

                        $('#edit-comment-form').find('input[name="anonymous"]').val(body.anonymous);
                        $('.edit-comment-textarea').val(body.text);


                        $('#editComment').removeClass('display-block').addClass('display-none')
                        $('#viewPost').removeClass('display-none').addClass('display-block')
                        hideAjaxSpinner();
                        commentReady()
                        tagert.hide().fadeIn('slow')

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

function upDownVoteComment(){
    $('.up-down-vote-comment').unbind().bind('click',function(e){
        e.preventDefault()
        $this = $(this)
        if (localStorage['current_user']) {
            target = $(this)
            command = target.hasClass('upvoted') ? 'undoVoting' : 'upvote'
            count_obj = $('.comment-upvote-count-'+$(this).data('id'))

            $.ajax({
                url: window.api_url+'comments/'+$(this).data('id'),
                type: 'post',
                data: {
                    'command' : command,
                    'access_token':  localStorage['access_token'],
                },
                beforeSend: function () {
                    showAjaxSpinner();
                },
                success: function (data) {
                    if(command == 'undoVoting'){
                        count_obj.text(parseInt(count_obj.text()) - 1);
                        $this.removeClass('upvoted')
                        $this.text('Like')
                    }else{
                        count_obj.text(parseInt(count_obj.text()) + 1);
                        $this.addClass('upvoted')
                        $this.text('Undo Like')
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





