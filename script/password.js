/*
author: guanqi;
date: 2019.4.9;
comment: 密码js
*/
apiready = function() {

    //获取元素
    var pwdTip = $api.dom('.pwd-tip');
    var saveQue = $api.dom('.save-que');
    var questionTitle = $api.dom('.question-title');
    var questionAnswer = $api.dom('.question-answer');
    var questionTip = $api.dom('.question-tip');
    var allQueArr = [];
    var userQue = [];
    var queCount = 0;
    var userInfo = $api.getStorage('userInfo');

    //密码提示
    $api.addEvt(pwdTip, 'click', pwdTipCon, false);

    function pwdTipCon() {
        api.alert({
            title: '密码设置功能',
            msg: '输入三个问题和答案以及提示，方便找回和修改密码。',
        }, function(ret, err) {
            if (ret) {
                //  alert( JSON.stringify( ret ) );
            } else {
                //  alert( JSON.stringify( err ) );
            }
        });

    }

    getAllQue();

    //获取用户问题
    function getAllQue() {
        apiAjax($gurl.que, 'GET', {}, false, false, function(res) {
            if (res) {
                allQueArr = res;
                showAllQue(allQueArr);
            }
        });
    }

    //显示问题
    function showAllQue(allQueArr) {
        var qstr = '';
        for (item of allQueArr) {
            qstr += `<option class="option-block" value="${item.id}">${item.name}</option>`;
        }
        questionTitle.innerHTML = qstr;
    }

    //获取问题和答案
    $api.addEvt(saveQue, 'click', getQueAns, false);

    function getQueAns() {
        var isSame = false;
        var title = questionTitle.value;
        var answer = questionAnswer.value;
        var tip = questionTip.value;
        if (answer == '') {
            api.toast({
                msg: '请输入答案!',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (tip == '') {
            api.toast({
                msg: '请输入提示!',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        queCount += 1;
        if (queCount === 2) {
            api.toast({
                msg: '亲，最后一个问题了!',
                duration: 2000,
                location: 'bottom'
            });
            saveQue.value = '保存设置';
        }
        if (queCount < 4) {
            for (item of userQue) {
                if (title == item.question) {
                    isSame = true;
                }
            }
            if (!isSame) {
                userQue.push({
                    qid: title,
                    answer: answer,
                    tip: tip,
                })
                questionAnswer.value = '';
                questionTip.value = '';
            } else {
                api.toast({
                    msg: '亲,这个问题已填写过了!',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        }
        if (queCount >= 3) {
            var data = {
                values: {
                    user_id: userInfo.userId,
                    question: userQue
                }
            }
            searchUserQue(data);
        }
    }

    //查询问题
    function searchUserQue(sdata) {
        var gdata = {
            values: {
                user_id: userInfo.userId
            }
        }
        apiAjax($gurl.pwd + '?filter={"where":{"user_id":"' + userInfo.userId + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                if (res == []) {
                    saveUserQue(false, sdata, 'POST');
                } else {
                    var isHas = false;
                    var hasId = '';
                    for (item of res) {
                        if (userInfo.userId == item.user_id) {
                            isHas = true;
                            hasId = item.id;
                        }
                    }
                    if (isHas) {
                        saveUserQue(hasId, sdata, 'PUT');
                    } else {
                        saveUserQue(false, sdata, 'POST');
                    }
                }
            }
        });
    }

    //保存问题
    function saveUserQue(hasId, data, method) {
        var purl = '';
        if (hasId) {
            purl = $gurl.pwd + '/' + hasId;
        } else {
            purl = $gurl.pwd;
        }
        apiAjax(purl, method, data, false, false, function(res) {
            if (res && res.id) {
                api.toast({
                    msg: '问题保存成功!',
                    duration: 2000,
                    location: 'bottom'
                });
                queCount = 0;
                setTimeout(function() {
                    openFrameSet('set', './set.html');
                }, 1000);
            } else {
                api.toast({
                    msg: '问题保存失败!',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        });
    }

}
