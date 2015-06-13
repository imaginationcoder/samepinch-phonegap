$(document).ready(function() {
    // Enable navMenu if user logged in
    if(localStorage['current_user']){
        current_user = JSON.parse(localStorage.getItem('current_user'))
       // console.log(current_user)
        var myNavMenuList="";
        myNavMenuList += "<nav id=\"myNavmenu\" class=\"navmenu navmenu-default navmenu-fixed-left offcanvas\" role=\"navigation\">";
        myNavMenuList += "        <a class=\"navmenu-brand\" href=\"edit-profile.html\">"
        if(current_user.photo){
            myNavMenuList += "           <img src="+current_user.photo+">"

        }else{
            myNavMenuList += "<div class='profilepic-placeholder'>";
            myNavMenuList += current_user.fname.substr(0, 1).toUpperCase() +""+current_user.lname.substr(0, 1).toUpperCase()
            myNavMenuList += "</div>"
        }
        myNavMenuList += "               <br>"+current_user.fname+" "
        myNavMenuList += "                 "+current_user.lname
        myNavMenuList += "                <\/a>";
        myNavMenuList += "        <ul class=\"nav navmenu-nav\">";
        myNavMenuList += "            <li><a href=\"#\" id=\"offcanvas-wall\"> <img src=\"img/menu-home.png\" width=\"26\" height=\"26\" alt=\"\"\/>  Wall<\/a><\/li>";
        myNavMenuList += "            <li><a href=\"add-post.html\"> <img src=\"img/icon-createpost.png\" width=\"26\" height=\"26\" alt=\"\"\/>  Create Post<\/a><\/li>";
        myNavMenuList += "            <li><a href=\"settings.html\"> <img src=\"img/menu-settings.png\" width=\"26\" height=\"26\" alt=\"\"\/>  Settings<\/a><\/li>";
        myNavMenuList += "            <li><a href=\"manage-tags.html\"> <img src=\"img/icon-menu-mtags.png\" width=\"26\" height=\"26\" alt=\"\"\/>  Manage Tags<\/a><\/li>";
        myNavMenuList += "            <li><a href=\"about.html\"> <img src=\"img/icon-menu-about.png\" width=\"26\" height=\"26\" alt=\"\"\/>  About<\/a><\/li>";
        myNavMenuList += "            <li id=\"sign-out\"><a href=\"#\"> <img src=\"img/menu-logout.png\" width=\"26\" height=\"26\" alt=\"\"\/> Logout<\/a><\/li>";
        myNavMenuList += "        <\/ul>";
        myNavMenuList += "    <\/nav>";

        $('#btnMyNavMenu').show()
        $('#navbar').append(myNavMenuList)
        //TODO enable if same as in IOS app
      //  $('#myNavmenu').offcanvas({autohide:true, toggle:faldse})
    }else{
        //var btnSignIn="";
        //btnSignIn += "<a class=\"pull-right\" href=\"signin.html\"><img width=\"26\" height=\"26\" alt=\"\" src=\"img/icon-createpost.png\"><\/a>";
        //$('#rightMenu').prepend(btnSignIn)
        $('#btnMyNavMenu').hide()
    }


    $("#search-toggle-btn").click(function() {
        $(".search-bar").show();
    })
    $(".search-bar").click(function() {
        $(".search-ph").hide();
        $(".search-textfield").show();
    })

    $('#menu-add-post').on('click',function(){
        if(localStorage['current_user']){
            window.location.href = 'add-post.html'
        }else{
            window.location.href = 'signin.html'
        }
    })

    $('#offcanvas-wall').on('click',function(e){
        e.preventDefault()
        $('#myNavmenu').offcanvas('hide')
    })

})


