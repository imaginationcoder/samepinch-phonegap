
function commentReady(){
    // send function
    upDownVoteComment()
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

    $('.comment-as-user').on('click',function(e){
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

    $('.comment-as-ananymous').on('click',function(e){
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
    $('#switch-comment-as').on('click',function(e){
        if(!localStorage['current_user']){
            window.location.href = 'signin.html'
        }
    })

    // edit comment
    $('.edit-comment').on('click',function(e){
        e.preventDefault()
        alert('Under development')
    })

    // flag comment
    $('.flag-comment').on('click',function(e){
        e.preventDefault()
        alert('Under development')
    })
}


function upDownVoteComment(){
    $('.up-down-vote-comment').on('click',function(e){
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





