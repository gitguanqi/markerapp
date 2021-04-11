/*
author: guanqi;
date: 2019.4.9;
comment: 修改密码js
*/
apiready = function() {

    //获取元素
    var pwdTip = $api.dom('.pwd-tip');
    var questionLogin = $api.dom('.question-login');
    var questionOne = $api.dom('.question-one');
    var questionTwo = $api.dom('.question-two');
    var saveQue = $api.dom('.save-que');
    var questionTitle = $api.dom('.question-title');
    var questionAnswer = $api.dom('.question-answer');
    var questionTip = $api.dom('.question-tip');
    var newPwd = $api.dom('.new-pwd');
    var conPwd = $api.dom('.con-pwd');
    var fixPwd = $api.dom('.fix-pwd');
    var getUser = $api.dom('.get-user');
    var usernameLogin = $api.dom('.username-login');
    var userQueArr = [];
    var userInfo = $api.getStorage('userInfo');
    var userId = '';
    var focusListTitle = $api.dom('.focus-list-title');

    //密码提示
    $api.addEvt(pwdTip, 'click', pwdTipCon, false);

    //页面参数
    var pageParam = api.pageParam;

    function pwdTipCon() {
        api.alert({
            title: '密码修改功能',
            msg: '输入任意一个问题的答案即可修改密码。',
        }, function(ret, err) {
            if (ret) {
                //  alert( JSON.stringify( ret ) );
            } else {
                //  alert( JSON.stringify( err ) );
            }
        });

    }

    if (userInfo) {
        userId = userInfo.userId;
    }

    if (pageParam.from == 'login' && pageParam.status == 'fixpwd') {
        focusListTitle.innerText = '找回密码';
        $api.addCls(questionOne, 'hide');
        $api.addCls(questionTwo, 'hide');
        $api.addEvt(getUser, 'click', getUserInfo, false);
        getUserInfo();
    } else {
        focusListTitle.innerText = '修改密码';
        $api.addCls(questionLogin, 'hide');
        $api.addCls(questionTwo, 'hide');
        searchUserQue();
    }

    //获取用户信息
    function getUserInfo() {
        if (usernameLogin.value == '') {
            api.toast({
                msg: '请输入用户名!',
                duration: 2000,
                location: 'bottom'
            });
        } else {
            apiAjax($gurl.userset, 'GET', {}, false, false, function(res) {
                if (res) {
                    var id = '';
                    for (var i = 0; i < res.length; i++) {
                        if (usernameLogin.value == res[i].username) {
                            id = res[i].id;
                        }
                    }
                    if (id) {
                        userId = id;
                        searchUserQue();
                    } else {
                        api.toast({
                            msg: '用户不存在!',
                            duration: 2000,
                            location: 'bottom'
                        });
                    }
                }
            })
        }

    }


    //查询问题
    function searchUserQue() {
        apiAjax($gurl.pwd + '?filter={"where":{"user_id":"' + userId + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                if (res == '' || res == undefined || res == null) {
                    api.toast({
                        msg: '请先设置密码问题。',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                } else {
                    if (res[0]) {
                        showProgress();
                        $api.addCls(questionLogin, 'hide');
                        $api.removeCls(questionOne, 'hide');
                        $api.addCls(questionTwo, 'hide');
                        getAllQue(res[0].question);
                    }
                }
            }
        });
    }

    //获取用户问题
    function getAllQue(que) {
        var queArr = [];
        for (var i = 0; i < que.length; i++) {
            queArr.push({
                id: que[i].qid
            });
        }
        var data = {
            values: {
                queArr
            }
        }
        apiAjax($gurl.que, 'GET', {}, false, false, function(res) {
            if (res) {
                var nameArr = [];
                for (var i = 0; i < res.length; i++) {
                    if (que[0].qid === res[i].id) {
                        nameArr.push({
                            id: res[i].id,
                            name: res[i].name,
                            answer: que[0].answer,
                            tip: que[0].tip
                        })
                    }
                    if (que[1].qid === res[i].id) {
                        nameArr.push({
                            id: res[i].id,
                            name: res[i].name,
                            answer: que[1].answer,
                            tip: que[1].tip
                        })
                    }
                    if (que[2].qid === res[i].id) {
                        nameArr.push({
                            id: res[i].id,
                            name: res[i].name,
                            answer: que[2].answer,
                            tip: que[2].tip
                        })
                    }
                }
                userQueArr = nameArr;
                showAllQue(userQueArr);
            }
        });
    }

    //显示问题
    function showAllQue(userQueArr) {
        var qstr = '';
        for (item of userQueArr) {
            qstr += `<option class="option-block" value="${item.id}">${item.name}</option>`;
        }
        questionTitle.innerHTML = qstr;
        showTip(0);
        hideProgress();
    }

    //改变提示
    $api.addEvt(questionTitle, 'change', changeTip, false);

    function changeTip() {
        for (item of userQueArr) {
            if (questionTitle.value == item.id) {
                questionTip.value = item.tip;
            }
        }
    }

    //显示提示
    function showTip(num) {
        questionTip.value = userQueArr[num].tip;
    }

    //获取问题和答案
    $api.addEvt(saveQue, 'click', getQueAns, false);

    function getQueAns() {
        var rightAns = '';
        var title = questionTitle.value;
        var answer = questionAnswer.value;
        if (answer == '') {
            api.toast({
                msg: '请输入答案!',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        for (item of userQueArr) {
            if (title == item.id) {
                rightAns = item.answer;
            }
        }
        if (answer !== rightAns) {
            api.toast({
                msg: '答案错误!',
                duration: 2000,
                location: 'bottom'
            });
        } else {
            $api.addCls(questionOne, 'hide');
            $api.removeCls(questionTwo, 'hide');
        }
    }

    //修改密码
    //用户信息验证
    $api.addEvt(fixPwd, 'click', fixPwdSet, false);

    function fixPwdSet() {
        if (!pwdReg.test(newPwd.value)) {
            api.toast({
                msg: '密码应为6-20位数字、字母或者.-_符合！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (!conPwd.value) {
            api.toast({
                msg: '确认密码不能为空！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (conPwd.value !== newPwd.value) {
            api.toast({
                msg: '两次密码不一致，请重新输入！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        var data = {
            values: {
                password: newPwd.value
            }
        }

        //请求接口
        updateUser(data);
    }

    //保存密码
    function updateUser(data) {
        apiAjax($gurl.userset + userId, 'PUT', data, false, false, function(res) {
            if (res && res.id) {
                api.toast({
                    msg: '恭喜你，密码修改成功！',
                    duration: 2000,
                    location: 'bottom'
                });
                $api.rmStorage('userInfo');
                setTimeout(function() {
                    openFrameSet('login', '../login/index.html');
                }, 1000)
                newPwd.value = '';
                conPwd.value = '';
            }
        })
    }
}
