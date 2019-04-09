/*
author: guanqi;
date: 2019.4.6;
comment: 用户登录
*/
apiready = function() {

    // 注册验证
    var username = $api.dom('.username'); // 用户昵称
    var password = $api.dom('.password'); // 密码
    var getpwd = $api.dom('.getpwd'); // 是否记住密码
    var loginBtn = $api.dom('.login-btn'); // 登录按钮
    var gotodo = $api.dom('.gotodo'); //到注册页


    //记住密码
    var remeInfo = $api.getStorage('remeInfo');
    var from = api.pageParam.from;
    var status = api.pageParam.status;
    if(remeInfo && from == 'set' && status == 'logout') {
      username.value = remeInfo.username;
      password.value = remeInfo.password;
      getpwd.checked = true;
    }

    $api.addEvt(loginBtn, 'click', startLogin, false);

    function startLogin() {
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

        var data = {
            values: {
                username: username.value,
                password: password.value
            }
        }

        //记住密码
        if(getpwd.checked) {
          $api.setStorage('remeInfo',{
            username: username.value,
            password: password.value
          });
        } else {
          $api.rmStorage('remeInfo');
        }

        userLogin(data);

    }

    //用户登录

    function userLogin(data) {
        apiAjax($gurl.login, 'POST', data, false, false, function(res) {
            if (res && res.id) {
                api.toast({
                    msg: '账号登录成功！',
                    duration: 2000,
                    location: 'bottom'
                });
                $api.setStorage('userInfo', {
                  userId: res.userId,
                  id: res.id
                });
                username.value = '';
                password.value = '';
                setTimeout(function() {
                    openFrameSet('index','../../index.html');
                },500);
            } else {
                api.toast({
                    msg: '用户名或密码错误！',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        })
    }

    //到注册页面
    $api.addEvt(gotodo, 'click', goRegPage, false);

    function goRegPage() {
        openFrameSet('register', '../register/index.html');
    }

}
