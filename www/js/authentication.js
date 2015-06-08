// Registration --------------
function registerUser(){
    // merge form data with device-info
    var body_params = $.extend({}, $('#signup-form').serializeHash(), {device_token: device_token,platform: device.platform})
    console.log(body_params)
    $.ajax({
        url: window.api_url+'users',
        type: 'post',
        data: {
            'command' :"create",
            'access_token':  localStorage['access_token'],
            'body': body_params
        },
        beforeSend: function () {  showAjaxSpinner()  },
        success: function (data) {
            body = data.body
            localStorage.setItem('current_user',JSON.stringify(body))
            // replace access token with verified
            localStorage.setItem('access_token',body.access_token)
            // successDialog('Success',JSON.stringify(data))
            hideAjaxSpinner()
            window.location.href = 'index.html'
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            hideAjaxSpinner()
            errorDialog('Error',error_obj.message)
        }
    })
}

// SignIn--------------
function signInUser(){
    var body_params = $.extend({}, $('#signin-form').serializeHash(), {device_token: device_token,platform: device.platform})
    $.ajax({
        url: window.api_url+'users',
        type: 'post',
        data: {
            'command' :"signIn",
            'access_token':  localStorage['access_token'],
            'body':  body_params
        },
        beforeSend: function () {  showAjaxSpinner()  },
        success: function (data) {
            // replace access token with verified
            body = data.body
            localStorage.setItem('current_user',JSON.stringify(body))
            // replace access token with verified
            localStorage.setItem('access_token',body.access_token)
            hideAjaxSpinner()
            window.location.href = 'index.html'
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            hideAjaxSpinner()
            errorDialog('Error',error_obj.message)
        }
    })
}

// SignOut--------------
function signOutUser(){
    // getAccessToken() // get new access_token
    $.ajax({
        url: window.api_url+'users',
        type: 'post',
        data: {
            'command' :"signOut",
            'access_token':  localStorage['access_token'],
            'body': {
                "device_token": device_token,
                "platform": device.platform
            }
        },
        beforeSend: function () { showAjaxSpinner()  },
        success: function (data) {
            // remove current_user and access_token
            localStorage.removeItem('current_user')
            localStorage.removeItem('access_token')
           // getAccessToken()// then get new access_token
           // successDialog('Success',data.message)
            hideAjaxSpinner()
            // window.location.href = 'signin.html'
            //$('.login-navbar #sign-out').hide()
            //$('.login-navbar #sign-in').show()
            window.location.href = 'index.html'
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            hideAjaxSpinner()
            errorDialog('Error',error_obj.message)
        }
    })
}

$(document).on('ready',function(){
    // signUp ----------------------------------------------
    $('#signup-form #btn-submit-signup').on('click',function(e){
        e.preventDefault()
       form=  $('#signup-form')
        fname = form.find('input[name="fname"]').val()
        lname = form.find('input[name="lname"]').val()
        email = form.find('input[name="email"]').val()
        psd = form.find('input[name="password"]').val()
        psd_con = form.find('input[name="password_confirmation"]').val()
        terms = form.find('input[name="terms"]')
        if(fname =='' || lname == '' || email == '' || psd == '' || psd_con == '' || (!terms.is(':checked'))){
            errorDialog('Error','All fields are required')
        }else{
            registerUser()
        }
    })

    // signIn -----------------------------------------------
    $('#signin-form #btn-submit-signin').on('click',function(e){
        e.preventDefault()
        signInUser()
    })

    // signOut ----------------------------------------------
    $('.login-navbar #sign-out').on('click',function(e){
        e.preventDefault()
        signOutUser()
    })

    $('#sign-out').on('click',function(e){
        e.preventDefault()
        signOutUser()
    })
})

