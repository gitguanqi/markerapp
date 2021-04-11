/*
author: guanqi;
date: 2019.4.10;
comment: 意见反馈js
*/
apiready = function() {

    //获取元素
    var questionTitle = $api.dom('.que-title');
    var questionType = $api.dom('.que-type');
    var questionOther = $api.dom('.que-other');
    var questionTypeOther = $api.dom('.que-type-other');
    var questionType = $api.dom('.que-type');
    var questionContent = $api.dom('.que-content');
    var saveQue = $api.dom('.save-que');
    var questionTip = $api.dom('.que-tip');
    var userInfo = $api.getStorage('userInfo');

    //密码提示
    $api.addEvt(questionTip, 'click', queTipCon, false);

    function queTipCon() {
        api.alert({
            title: '意见反馈',
            msg: '请您把使用过程中遇到的问题告诉我们，以便更好的改进产品。',
        }, function(ret, err) {
            if (ret) {
                //  alert( JSON.stringify( ret ) );
            } else {
                //  alert( JSON.stringify( err ) );
            }
        });

    }

    //获取建议和答案
    $api.addEvt(saveQue, 'click', getQueAns, false);

    function getQueAns() {
        var title = questionTitle.value;
        var type = questionType.value;
        var content = questionContent.value;
        var other = questionTypeOther.value;
        var ftype = '';
        if (title == '') {
            api.toast({
                msg: '请输入标题!',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (type == '') {
            api.toast({
                msg: '请选择类型!',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (type == '其他' && other == '') {
            api.toast({
                msg: '请输入你认为的类型!',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (content == '') {
            api.toast({
                msg: '请输入内容!',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (type == '其他') {
            ftype = other
        } else {
            ftype = type;
        }
        var data = {
            values: {
                user_id: userInfo.userId,
                title: title,
                type: ftype,
                content: content
            }
        }
        saveUserQue(data);
    }

    //选择类型
    $api.addEvt(questionType, 'change', showOther, false);

    function showOther(e) {
        var e = e || window.event;
        if (e.target.value == '其他') {
            $api.css(questionType, 'disabled');
            $api.removeCls(questionOther, 'hide');
        } else {
            $api.addCls(questionOther, 'hide');
        }
    }

    //保存建议
    function saveUserQue(data) {
        apiAjax($gurl.feedback, 'POST', data, false, false, function(res) {
            if (res && res.id) {
                api.toast({
                    msg: '提交成功!',
                    duration: 2000,
                    location: 'bottom'
                });
                questionTitle.value = '';
                questionType.value = '';
                questionContent.value = '';
                questionTypeOther.value = '';
                api.closeFrame({
                    name: 'feedback'
                });

            } else {
                api.toast({
                    msg: '提交失败!',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        });
    }

}
