$(document).ready(function() {
    // Enable navMenu if user logged in
    if(localStorage['current_user']){
        console.log(localStorage.getItem('current_user'))
        var btnMyNavMenu="";
        btnMyNavMenu += "<button type=\"button\" class=\"navbar-toggle mytoggle-menu\" data-toggle=\"offcanvas\" data-target=\"#myNavmenu\" data-canvas=\"body\">";
        btnMyNavMenu += "                        <span class=\"icon-bar\"><\/span>";
        btnMyNavMenu += "                        <span class=\"icon-bar\"><\/span>";
        btnMyNavMenu += "                        <span class=\"icon-bar\"><\/span>";
        btnMyNavMenu += "                    <\/button>";


        var myNavMenuList="";
        myNavMenuList += "<nav id=\"myNavmenu\" class=\"navmenu navmenu-default navmenu-fixed-left offcanvas\" role=\"navigation\">";
        myNavMenuList += "        <a class=\"navmenu-brand\" href=\"#\"><img src=\"img\/new\/profile-img.png\"  alt=\"\"\/><br>  Johnson<\/a>";
        myNavMenuList += "        <ul class=\"nav navmenu-nav\">";
        myNavMenuList += "            <li><a href=\"#\"> <img src=\"img\/new\/menu-home.png\" width=\"26\" height=\"26\" alt=\"\"\/>  Wall<\/a><\/li>";
        myNavMenuList += "            <li><a href=\"#\"> <img src=\"img\/new\/icon-createpost.png\" width=\"26\" height=\"26\" alt=\"\"\/>  Create Post<\/a><\/li>";
        myNavMenuList += "            <li><a href=\"#\"> <img src=\"img\/new\/menu-settings.png\" width=\"26\" height=\"26\" alt=\"\"\/>  Settings<\/a><\/li>";
        myNavMenuList += "            <li><a href=\"#\"> <img src=\"img\/new\/icon-menu-mtags.png\" width=\"26\" height=\"26\" alt=\"\"\/>  Manage Tags<\/a><\/li>";
        myNavMenuList += "            <li><a href=\"#\"> <img src=\"img\/new\/icon-menu-about.png\" width=\"26\" height=\"26\" alt=\"\"\/>  About<\/a><\/li>";
        myNavMenuList += "            <li id=\"sign-out\"><a href=\"#\"> <img src=\"img\/new\/menu-logout.png\" width=\"26\" height=\"26\" alt=\"\"\/> Logout<\/a><\/li>";
        myNavMenuList += "        <\/ul>";
        myNavMenuList += "    <\/nav>";

        $('#btnMyNavMenu').html(btnMyNavMenu)
        $('#navbar').append(myNavMenuList)
        $('#myNavmenu').offcanvas({autohide:true, toggle:false})
    }else{
        var btnSignIn="";
        btnSignIn += "<a class=\"pull-right\" href=\"signin.html\"><img width=\"26\" height=\"26\" alt=\"\" src=\"img\/new\/icon-createpost.png\"><\/a>";
        $('#rightMenu').prepend(btnSignIn)
    }


    $("#search-toggle-btn").click(function() {
        $(".search-bar").show();
    })
    $(".search-bar").click(function() {
        $(".search-ph").hide();
        $(".search-textfield").show();
    })

})