/*
 * Holds all js functions for invoking API
 *
 */
// Constants ------------------------------------------------

var env = 'dev';
//var env = 'local';
//var env = 'prod';
if(env == 'prod'){
    window.auth_url = 'https://msocl.herokuapp.com/users/auth/'
    window.api_url = 'https://msocl.herokuapp.com/api/'
    window.app_client_id = '3e0786a2f258e6f9b08250dbd7f35010480988e0d3d1ef373b79e07884be79f9'
    window.app_client_secret = '813c95cc2eb6c0cf4f49d30d0add0c6fc3ea82863d30507beb6733c0e643927c'
    // comment below for apk generation
    // var device = {model: 'XT1033', platform: 'Android',version: '5.0.2',uuid: 'dd46057341bf77df',cordova: '3.7.0'}
}else if(env=='dev'){
    window.auth_url = 'http://localhost:3000/users/auth/'
    window.api_url = 'http://localhost:3000/api/'
    window.app_client_id = '3e0786a2f258e6f9b08250dbd7f35010480988e0d3d1ef373b79e07884be79f9'
    window.app_client_secret = '813c95cc2eb6c0cf4f49d30d0add0c6fc3ea82863d30507beb6733c0e643927c'
    // for prod same will get from plugin
    var device = {model: 'XT1033', platform: 'Android',version: '5.0.2',uuid: 'dd46057341bf77df',cordova: '3.7.0'}
}
else{
    window.auth_url = 'http://localhost:3000/users/auth/'
    window.api_url = 'http://localhost:3000/api/'
    window.app_client_id = 'ac26e3f23c6fbd9df027d6201741524547169a5da22ca3030348fef41358d502'
    window.app_client_secret = '694457fa756a3b08bd5f2f76a1d0e883c9c4589c66091017d950418fc8681e6b'
    // for prod same will get from plugin
    var device = {model: 'XT1033', platform: 'Android',version: '5.0.2',uuid: 'dd46057341bf77df',cordova: '3.7.0'}

}

//TODO replace device_token with plugin
var device_token = 'sample-android-device-token-123456'

localStorage.setItem('device_token',device_token)

/*
 *  LocalStorage List =>
 *   1) device_token
 *
 * Session Storage :
 *  1) current_user => {email,fname,lname,photo,uid}
 *  2) access_token
 *
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
    if(typeof(localStorage.getItem('access_token')) == "undefined" || localStorage.getItem('access_token') == null || localStorage.getItem('access_token') == '') {
        $.ajax({
            url: window.api_url + 'clients/token',
            type: 'post',
            data: {
                'grant_type': "client_credentials", 'client_id': window.app_client_id,
                'client_secret': window.app_client_secret, 'scope': "imsocl"
            },
            beforeSend: function () {
                console.log('getting access_token..')
            },
            success: function (data) {
                localStorage.setItem('access_token', data.access_token)
                console.log('got the token..')
                // successDialog('Success',JSON.stringify(data))
                getPosts() // invoke posts
            },
            error: function (xhr, textStatus, errorThrown) {
                var error_obj = $.parseJSON(xhr.responseText)
                console.log(error_obj)
                errorDialog(error_obj.error, error_obj.error_description)
            }
        })
    }else{
        getPosts()
    }
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
        title: "Your Device Info",
        message: content,
        buttons: {
            danger: {
                label: "Ok",
                className: "btn-success"
            }
        }
    });
}
window.addEventListener('load', function() {
    console.log('invoked fastclick')
    new FastClick(document.body);
}, false);



// get access token if not present
window.addEventListener('load', function() {
    // sessionStorage.clear();
    // localStorage.clear();
  //  getAccessToken()
})

function showAjaxSpinner(){
    spinner = new Spinner({color:'#000000', lines: 12,top: '40%'}).spin(document.body);
    $("body").css({"opacity": "0.5"});
}

function hideAjaxSpinner(){
    spinner.stop();
    $("body").removeAttr('style');
}


