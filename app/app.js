(function () {

    var ctrlHome = function(response, realView) {
        if(!$.rogerIsLogined()) {
            $('#log').html('').html('<a href="#/login">登陆</a>');
        }else {
            var user = $.rogerGetLoginUser();
            $('#log').html('');
            $.rogerTrigger($('#login'), '#/opts');
        }
    };
    var ctrlLogin = function(response, realView) {
        $('#login').rogerSubmit('/login', function (respJSON) {
            if (!respJSON.error) {
                respJSON.message = JSON.parse(respJSON.message);
                if(respJSON.message && respJSON.message.UserID > 0) {
                    $.rogerSetLoginUser(JSON.stringify(respJSON.message));
                    $.rogerLocation('#/');
                }
            }else {
                $('#message').html(respJSON.message);
            }
        });
        $('.getCaptcha').rogerOnceClick(null, function () {
            var i = parseInt($('.getCaptcha span')[0].innerHTML);
            if(i>0) {
                $('#message').html("请等待"+(i)+"秒再获取验证码");
                return;
            }
            var counter = 60;
            var inter = setInterval(function() {
                if (counter == 60) {
                    var phone = $('#tab2 input[name="loginName"]')[0].value;
                    $.rogerPost('/sms/get', {mobile: phone}, function (respJSON) {
                        $('#message').html(respJSON.message);
                    });
                    $('.getCaptcha').html('').html('<span class="btn btn-default disabled">60</span>');
                }
                counter--;
                if (counter >= 0) {
                    $('.getCaptcha').html('').html('<span class="btn btn-default disabled">'+counter+'</span>');
                }
                if (counter <= 0) {
                    $('.getCaptcha').html('').html('<span class="btn btn-default glyphicon glyphicon-refresh"></span>');
                    clearInterval(inter);
                }
            }, 1000);
        });
    };
    var ctrlLoginOpt = function(response, realView) {
        $('#log').html('<a href="#" class="trigger"><img src="'+user.pic+'" class="img-circle" sytle="width:60px"></img></a>');
        $('#log>.trigger').popover({
            html : true,
            content: function() {
                return $("#opts").html();
            }
        });
    };


    $.rogerRouter({
        '#/':  							    {view:'home.html',										rootrest:'/home',						ctrl: ctrlHome},
        '#/login':							{fragment:'login.html',									                     					ctrl: ctrlLogin},
        '#/opts':						    {fragment:'user-opts.html',							  	                    					ctrl: ctrlLoginOpt},

    });

})();