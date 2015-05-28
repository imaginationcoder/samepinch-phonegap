/*
 * Holds all js functions for invoking API
 *
 */
// Constants ------------------------------------------------
//window.api_url = 'http://localhost:3000/api/' //local
window.api_url = 'https://msocl.herokuapp.com/api/' //dev
//window.app_client_id = 'ac26e3f23c6fbd9df027d6201741524547169a5da22ca3030348fef41358d502' // local
window.app_client_id = '3e0786a2f258e6f9b08250dbd7f35010480988e0d3d1ef373b79e07884be79f9' // msocl.herokuapp.com
//window.app_client_secret = '694457fa756a3b08bd5f2f76a1d0e883c9c4589c66091017d950418fc8681e6b' // local
window.app_client_secret = '813c95cc2eb6c0cf4f49d30d0add0c6fc3ea82863d30507beb6733c0e643927c'// msocl.herokuapp.com
//window.access_token = '06ed54ba10d4a78be290c36e5c3dfbcbcf22d74c43e59648157f479d298d14d8'


/*
* LocalStorage List => ['access_token','user_uid']
* */

// bootbox error dialog
function errorDialog(title,msg){
    bootbox.dialog({
        message: msg,
        title: title,
        buttons: {
            danger: {
                label: "Ok",
                className: "btn-danger"
            }
        }
    });
}
// success dialog
function successDialog(title,msg){
    bootbox.dialog({
        message: msg,
        title: title,
        buttons: {
            danger: {
                label: "Ok",
                className: "btn-success"
            }
        }
    });
}



// Get access token
function getAccessToken() {
    $.ajax({
        url: window.api_url + 'clients/token',
        type: 'post',
        data: {
            'grant_type': "client_credentials", 'client_id': window.app_client_id,
            'client_secret': window.app_client_secret, 'scope': "imsocl"
        },
        beforeSend: function () { },
        success: function (data) {
            console.log('success..')
            console.log(data.access_token)
            // save access_token for further requests..
           // localStorage.clear()
            localStorage.removeItem('access_token')
            localStorage.setItem('access_token',data.access_token)
            successDialog('Success',JSON.stringify(data))
        },
        error: function (xhr, textStatus, errorThrown) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            errorDialog(error_obj.error,error_obj.error_description)
        }
    })
}
$(document).on('ready',function(){
   // getAccessToken()
   // resgistration()
})


// Registration --------------
function registerUser(){
    $.ajax({
        url: window.api_url+'users',
        type: 'post',
        data: {
            'command' :"create",
            'access_token':  localStorage.getItem('access_token'),
            'body': {
                "phno":"9290459254",
                "fname":"Api",
                "lname":"Test1",
                "email":"apitest1@test.com",
                "password":"123456",
                "password_confirmation":"123456",
                "key":"",
                "postal_code":"",
                "device_token":"",
                "platform": "android"
            }
        },
        beforeSend: function () { },
        success: function (data) {
            // replace access token with verified
            body = data.body
            console.log(body.access_token)
            localStorage.setItem('access_token',body.access_token)
            localStorage.setItem('user_uid',body.uid)
            successDialog('Success',JSON.stringify(data))
            // redirect to after sign in page
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
                errorDialog('Error',error_obj.message)
        }
    })
}


// SignIn--------------
function signInUser(){
   // getAccessToken() // get new access_token
    $.ajax({
        url: window.api_url+'users',
        type: 'post',
        data: {
            'command' :"signIn",
            'access_token':  localStorage.getItem('access_token'),
            'body': {
                "email":"apitest1@test.com",
                "password":"123456",
                "device_token":"",
                "platform": "android"
            }
        },
        beforeSend: function () { },
        success: function (data) {
            // replace access token with verified
            body = data.body
            localStorage.setItem('access_token',body.access_token)
            localStorage.setItem('user_uid',body.uid)
            successDialog('Success',JSON.stringify(data))
            // redirect to after sign in page
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            errorDialog('Error',error_obj.message)
        }
    })
}


// Get device Info
function getDeviceInfo(){
    d_model = device.model//'model1'
    d_cordova = device.cordova //'cordova 1'
    d_platform = device.platform
    d_uuid =  device.uuid
    d_version = device.version
    var content="";
    content += "<div>";
    content += "<strong>Device Model:</strong>    "+ d_model +"<br/>";
    content += "<strong>Device Cordova:</strong>  "+ d_cordova +"<br/>";
    content += "<strong>Device Platform:</strong> "+ d_platform +"<br/>";
    content += "<strong>Device UUID:</strong>     "+ d_uuid +"<br/>";
    content += "<strong>Device Version:</strong>  "+ d_version +"<br/>";
    content += "<\/div>";
    bootbox.dialog({
        title: "Device Info",
        message: content,
        buttons: {
            danger: {
                label: "Ok",
                className: "btn-success"
            }
        }
    });
}


