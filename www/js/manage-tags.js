function getAllTagsToManage(){
    $.ajax({
        url: window.api_url+'groups',
        type: 'post',
        data: {
            'command' :"all",
            'access_token':  localStorage['access_token'],
        },
        beforeSend: function () {
           // showAjaxSpinner();
        },
        success: function (data) {
            // favorites
            var fav_source = $("#favourites-tags-template").html();
            var fav_template = Handlebars.compile(fav_source);
            $("#manageTags .tags-list").append(fav_template(data.body))//.hide().fadeIn();
            // recommended
            var rec_source = $("#recommended-tags-template").html();
            var rec_template = Handlebars.compile(rec_source);
            $("#manageTags .tags-list").append(rec_template(data.body))//.hide().fadeIn();
            // bind all click events
           // hideAjaxSpinner()
            $('.loading-content').hide()
            bindManageTagClicks()
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

function bindManageTagClicks(){
    $("#manageTags ul.tags-list li").click(function(e) {
        e.stopPropagation();
        tag =  $(this).find(".tagname")
        command = tag.hasClass('tagname-active') ? 'unfollow' : 'follow'
        $this = $(this)
        $.ajax({
            url: window.api_url+'groups/'+$(this).data('uid'),
            type: 'post',
            data: {
                'command' : command,
                'access_token':  localStorage['access_token'],
            },
            beforeSend: function () {
                if(tag.hasClass('tagname-active')){
                    tag.removeClass("tagname-active");
                    $this.find('input').prop('checked',false);
                }else{
                    tag.addClass("tagname-active");
                    $this.find('input').prop('checked',true);
                }
            },
            success: function (data) {
                // do something
            },
            error: function(xhr,textStatus,errorThrown ) {
                var error_obj = $.parseJSON(xhr.responseText)
                console.log(error_obj)
                hideAjaxSpinner()
                errorDialog('Error',error_obj.message)
            }
        })

    });

    $("#manageTags ul.tags-list li .css-label").click(function(e) {
        $(this).parents('li:first').trigger( "click" );
        return false;
    });
}
