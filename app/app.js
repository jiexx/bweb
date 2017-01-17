(function () {

    var ctrlHome = function(response, realView) {
        if(!$.rogerIsLogined()) {
            $('#log').html('').html('<a href="#/login">登陆</a>');
        }else {
            $.rogerTrigger($('#log'), '#/loginopt');
        }
    };
    var ctrlLogin = function(response, realView) {

    };
    var ctrlLoginOpt = function(response, realView) {

    };


    $.rogerRouter({
        '#/':  							    {view:'home.html',										rootrest:'/home',						ctrl: ctrlHome},
        '#/login':							{fragment:'login.html',									rootrest:null, 						ctrl: ctrlLogin},
        '#/loginopt':						{fragment:'login-options.html',							rootrest:null, 						ctrl: ctrlLoginOpt}
    });

})();