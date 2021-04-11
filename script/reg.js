/*
author: guanqi;
date: 2019.4.6;
comment: 用户注册
*/
apiready = function() {

    // 注册验证
    var username = $api.dom('.username'); // 用户名
    var password = $api.dom('.password'); // 密码
    var againPwd = $api.dom('.again-pwd'); // 确认密码
    var loginBtn = $api.dom('.login-btn'); // 注册按钮
    var gotodo = $api.dom('.gotodo'); //到登录页

    //用户信息验证
    $api.addEvt(loginBtn, 'click', loginSub, false);

    function loginSub() {
        if (!userReg.test(username.value)) {
            api.toast({
                msg: '用户昵称应为2-12位数字、字母或者中文！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (!pwdReg.test(password.value)) {
            api.toast({
                msg: '密码应为6-20位数字、字母或者.-_符合！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (!againPwd.value) {
            api.toast({
                msg: '确认密码不能为空！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (againPwd.value !== password.value) {
            api.toast({
                msg: '两次密码不一致，请重新输入！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        var data = {
            values: {
                username: username.value,
                password: password.value,
                avator: '../../image/logo.png',
                sign: '你身边的博客~',
                type: '注册用户'
            }
        }

        //请求接口
        createUser(data);
    }

    //创建用户
    function createUser(data) {
        apiAjax($gurl.adduser, 'POST', data, false, false, function(res) {
            if (res && res.id) {
                api.toast({
                    msg: '恭喜你，注册成功！',
                    duration: 2000,
                    location: 'bottom'
                });
                setTimeout(function() {
                    openFrameSet('login', '../login/index.html');
                }, 1000)
                username.value = '';
                password.value = '';
                againPwd.value = '';
            } else {
                api.toast({
                    msg: '账号已存在！',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        })
    }

    //到登录页面
    $api.addEvt(gotodo, 'click', goLoginPage, false);

    function goLoginPage() {
        username.value = '';
        password.value = '';
        againPwd.value = '';
        openFrameSet('login', '../login/index.html');
    }


}
