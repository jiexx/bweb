(function () {

    var ctrlHome = function(response, realView) {
        if(!$.rogerIsLogined()) {
            $('#log').html('').html('<a href="#/login">登陆</a>');
        }else {
            var user = $.rogerGetLoginUser();
            $('#log').html('').html('<a href="javascript:void(0)"><img src="'+user.pic+'" class="img-circle" sytle="width:60px"></a>');
            $.rogerTrigger($('#opt'), '#/opts');
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
        $('#log > a').popover({
            html : true,
            content: function() {
                return $("#user-opts").html();
            }
        });
    };
    var ctrlDealList = function(response, realView) {

    };
    var initDealNew = function(params){
        var usr =$.rogerGetLoginUser();
        return {
            DealInfo:{
                name:'', creator_id:usr.id, price:0,show:0,
                Picture: [],
                Label:[],
                Description: []
            },
            IMGHOST:$.rogerImgHost()
        };
    };
    var ctrlDealNew = function(Deal, realView) {
        $('img[name="needPrefix"]').each(function () {
            var src = $(this).attr('src');
            if (src.indexOf('group1') > -1) {
                $(this).attr('src', Deal.IMGHOST + src);
            }
        })
        Deal.createPicture = function (Deal, Description) {
            Description.push({description: null, pic: null, enable: true});
            $.rogerRefresh(Plan);
        };
        Deal.createDescription = function (Deal, PlanShort) {
            Description.push({description: 'desc', pic: null, enable: false});
            $.rogerRefresh(Plan);
        };


        $('#save').rogerOnceClick(Deal, function (e) {
            if (!Deal.DealInfo.id) {
                var data = {DealInfo: e.data.DealInfo};
                $.rogerPost('/new/deal', data, function (respJSON) {
                    $.rogerNotice({Message: '发布成功'});
                });
            } else {
                var data = {PlanInfo: e.data.PlanInfo};
                data.PlanInfo.Summary._PlanLabels = data.PlanInfo.Summary.PlanLabels.join();
                data.PlanInfo.PlanPriceBase = data.PlanInfo.AdultPrice;
                $.rogerPost('/delete/deal', {PlanID: data.PlanInfo.PlanID}, function (respJSON) {
                    $.rogerPost('/new/deal', data, function (respJSON) {
                        $.rogerNotice({Message: '发布成功'});
                    });
                });
            }
        });
    };

    $.rogerRouter({
        '#/':  							    {view:'home.html',										rootrest:'/home',					   ctrl: ctrlHome},
        '#/login':							{fragment:'login.html',									                     			       ctrl: ctrlLogin},
        '#/opts':						    {fragment:'user-opts.html',							  	                    				   ctrl: ctrlLoginOpt},
        '#/dealnew':                      {fragment: 'fragment/deal-edit.html',                 init: initDealNew,                      ctrl: ctrlDealNew},
        '#/dealedit':                     {fragment: 'fragment/deal-edit.html',                 rootrest:'/deal/edit',              ctrl: ctrlDealNew},
        '#/deallist':                     {view: 'deal-list.html',                                rootrest:'/deal/list',               ctrl: ctrlDealList}
    });

})();