/*
author: guanqi;
date: 2019.4.4;
comment: 我的设置js
*/
apiready = function() {

    //获取元素
    var setItems = $api.domAll('.msg-item-must');
    var userView = $api.domAll('.user-view');
    var logoutBtn = $api.dom('#logout-btn');
    var userDel = $api.dom('#user-del');
    var userInfo = $api.getStorage('userInfo');

    //判断账号是否登录
    if (userInfo) {
        for (var i = 0; i < userView.length; i++) {
            $api.removeCls(userView[i], 'hide');
        }

    }

    var setUrls = [{
        name: 'system',
        url: './system.html'
    }, {
        name: 'author',
        url: './author.html'
    }, {
        name: 'password',
        url: './password.html'
    }, {
        name: 'fixpwd',
        url: './fixpwd.html'
    }, ];
    for (var i = 0; i < setItems.length; i++) {
        setItems[i].index = i;
        setItems[i].onclick = function() {
            openFrameSet(setUrls[this.index].name, setUrls[this.index].url);
        }
    }

    //注销账号
    userDel.onclick = function() {
        var result = confirm('你确定要注销账号?');
        if (result) {
            apiAjax($gurl.userset + userInfo.userId, 'DELETE', {}, false, userInfo.id, function(res) {
              if(res) {
                api.toast({
                    msg: '注销成功！',
                    duration: 2000,
                    location: 'bottom'
                });
                $api.clearStorage('userInfo');
                openFrameSet('register', '../register/index.html');
              } else {
                api.toast({
                    msg: '注销失败！',
                    duration: 2000,
                    location: 'bottom'
                });
              }
            })

        }
    }

    //退出登录
    logoutBtn.onclick = function() {
        var result = confirm('你确定要退出登录?');
        if (result) {
            $api.rmStorage('userInfo');
            openFrameSet('login', '../login/index.html', {
                from: 'set',
                status: 'logout'
            });
        }
    }
};
