/*
author: guanqi;
date: 2019.4.4;
comment: 我的js
*/
apiready = function() {



    // 操作内容
    var meItems = $api.domAll('.msg-block-item'); // 个人信息下方导航
    var noLoginBlock = $api.dom('.no-login-block'); //登录框
    var noLoginBtns = $api.domAll('.no-login-btn'); //登录注册按钮
    var userViews = $api.domAll('.user-view'); // 用户可见的区域

    //用户显示内容
    var userAvator = $api.dom('#avator');
    var userTitle = $api.dom('#user-title');
    var sign = $api.dom('.me-sign-show');

    //获取登录信息
    var userInfo = $api.getStorage('userInfo');

    //登录后显示导航
    if (userInfo) {
        //登录后获取用户信息
        getUser();
        //显示信息
        for (var i = 0; i < userViews.length; i++) {
            $api.removeCls(userViews[i], 'hide');
        }
        $api.removeCls(noLoginBlock, 'show');
        //下拉刷新
        pullUpdateData('#fff', 500, getUser);
        //
        //获取ip
        getIpStatus();
    } else {
        $api.addCls(noLoginBlock, 'show');
    }

    //未登录跳转登录或者注册页面
    var userUrls = [{
        name: 'login',
        url: '../login/index.html',
        params: {
            from: 'me',
            status: 'no-login'
        }
    }, {
        name: 'register',
        url: '../register/index.html',
        params: {
            from: 'me',
            status: 'no-reg'
        }
    }];
    for (var i = 0; i < noLoginBtns.length; i++) {
        noLoginBtns[i].index = i;
        noLoginBtns[i].onclick = function() {
            openFrameSet(userUrls[this.index].name, userUrls[this.index].url, userUrls[this.index].params);
        }
    }


    //登录后跳转导航页面
    var meUrls = [{
        name: 'profile',
        url: './profile.html'
    }, {
        name: 'personal',
        url: './personal.html'
    }, {
        name: 'article',
        url: './article.html'
    }, {
        name: 'set',
        url: './set.html'
    }, ];
    for (var i = 0; i < meItems.length; i++) {
        meItems[i].index = i;
        meItems[i].onclick = function() {
            openFrameSet(meUrls[this.index].name, meUrls[this.index].url, meUrls[this.index].params);
        }
    }

    function getUser() {
        apiAjax($gurl.userset + userInfo.userId, 'GET', userInfo.id, false, false, function(res) {
            if (res) {
                userAvator.src = res.avator;
                userTitle.innerText = res.username;
                sign.innerText = res.sign;
                //存上用户基本信息
                $api.setStorage('userInfo', {
                    userId: res.id,
                    username: res.username,
                    sign: res.sign,
                    avator: res.avator,
                    mobile: res.mobile,
                    email: res.email,
                });
            }
        })
    }

    //获取网络状态
    function getIpStatus () {
      var networkAddress = api.require('networkAddress');
      networkAddress.get(function(ret){
        if(ret) {
          var ipaddr = ret.address;
          updateUserInfo(ipaddr);
        }
      });
    }

    //更新用户信息
    function updateUserInfo(ipaddr) {
        var data = {
          values: {
            ipaddr: ipaddr
          }
        }
        apiAjax($gurl.userset + userInfo.userId, 'PUT', data, false, userInfo.id, function(res) {
            if (res && res.id) {
                console.log('ipok');
            }
        })
    }

};
