/*
author: guanqi;
date: 2019.4.7;
comment: 个人信息js
*/
apiready = function() {

    //获取元素
    var avator = $api.byId('avator'); // 头像
    var username = $api.byId('username'); // 用户名称
    var sign = $api.byId('sign'); // 用户签名
    var mobile = $api.byId('mobile'); // 用户手机号
    var email = $api.byId('email'); // 用户邮箱
    var myName = $api.dom('.myname'); //显示内容
    var mySign = $api.dom('.mysign'); //显示内容
    var myPhone = $api.dom('.myphone'); //显示内容
    var myEmail = $api.dom('.myemail'); //显示内容

    //模态框
    var commonModal = $api.dom('.common-modal'); //模态框
    var modalTitle = $api.dom('.modal-title'); // 标题
    var modalIpt = $api.dom('.modal-ipt'); //输入框
    var saveInfo = $api.dom('.modal-set-save'); // 保存信息
    var cancelInfo = $api.dom('.modal-set-cancel'); // 取消

    //获取登录信息
    var userInfo = $api.getStorage('userInfo');

    //调用用户信息
    getUserInfo();

    //显示标题
    var showTitle = '';

    //修改昵称
    $api.addEvt(username, 'click', updateUsername, false);

    function updateUsername() {
        //显示模态框
        $api.removeCls(commonModal, 'hide');
        modalTitle.innerText = '修改昵称';
        modalIpt.value = myName.innerText;
        showTitle = '我的昵称';
    }

    //修改签名
    $api.addEvt(sign, 'click', updateUsersign, false);

    function updateUsersign() {
        //显示模态框
        $api.removeCls(commonModal, 'hide');
        modalTitle.innerText = '修改个性签名';
        modalIpt.value = mySign.innerText;
        showTitle = '个性签名';
    }

    //修改手机号
    $api.addEvt(mobile, 'click', updateUsermobile, false);

    function updateUsermobile() {
        //显示模态框
        $api.removeCls(commonModal, 'hide');
        modalTitle.innerText = '修改手机号';
        modalIpt.value = myPhone.innerText;
        showTitle = '手机号';
    }

    //修改邮箱
    $api.addEvt(email, 'click', updateUseremail, false);

    function updateUseremail() {
        //显示模态框
        $api.removeCls(commonModal, 'hide');
        modalTitle.innerText = '修改邮箱';
        modalIpt.value = myEmail.innerText;
        showTitle = '邮箱';
    }

    //保存
    $api.addEvt(saveInfo, 'click', saveInfoSet, false);

    function saveInfoSet() {
        var uval = modalIpt.value;
        var ureg;
        var uname;
        switch (showTitle) {
            case '我的昵称':
                ureg = userReg;
                uname = 'username';
                break;
            case '个性签名':
                ureg = userReg;
                uname = 'sign';
                break;
            case '手机号':
                ureg = phoneReg;
                uname = 'mobile';
                break;
            case '邮箱':
                ureg = emailReg;
                uname = 'email';
                break;
            default:
                break;
        }
        if (uval == '') {
            api.toast({
                msg: showTitle + '不能为空！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (!ureg.test(uval)) {
            api.toast({
                msg: showTitle + '格式不正确！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }

        // 更新信息
        var udata = {};
        udata[uname] = uval;
        updateUserInfo(udata);


    }

    //取消
    $api.addEvt(cancelInfo, 'click', cancelInfoSet, false);

    function cancelInfoSet() {
        $api.addCls(commonModal, 'hide');
    }

    //获取个人信息
    function getUserInfo() {
        apiAjax($gurl.userset + userInfo.userId, 'GET', {}, false, userInfo.id, function(res) {
            if (res) {
                myName.innerText = res.username;
                mySign.innerText = res.sign;
                myPhone.innerText = res.mobile;
                myEmail.innerText = res.email;
            }
        })
    }

    //更新用户信息
    function updateUserInfo(udata) {
        var userInfo = $api.getStorage('userInfo');
        var data = {
            values: udata
        }
        apiAjax($gurl.userset + userInfo.userId, 'PUT', data, false, userInfo.id, function(res) {
            if (res && res.id) {
                api.toast({
                    msg: '修改成功！',
                    duration: 2000,
                    location: 'bottom'
                });
                cancelInfoSet();
                getUserInfo();
            } else {
                api.toast({
                    msg: '修改失败！',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        })
    }

    $api.addEvt(avator, 'click', updateUserAvator, false);

    // 选择头像
    function updateUserAvator() {
        api.actionSheet({
            title: '选择',
            cancelTitle: '取消',
            buttons: ['拍照', '相册']
        }, function(ret, err) {
            if (ret) {
                var sourceTypes = [
                    'camera',
                    'album'
                ];
                if (ret.buttonIndex == (sourceTypes.length + 1)) {
                    return;
                }
                api.getPicture({
                    sourceType: sourceTypes[ret.buttonIndex - 1],
                    allowEdit: true,
                    quality: 50, // 指定图片质量
                    targetWidth: 100, // 指定图片宽度
                    targetHeight: 100 // 指定图片宽度
                }, function(ret, err) {
                    if (ret) {
                        if (ret.data !== '') {
                            uploadAtavar(ret.data);
                        }
                    }
                });
            }
        });
    }

    //上传头像
    function uploadAtavar(avatarUrl) {
        var data = {
            values: {
                filename: 'avator'
            },
            files: {
                file: avatarUrl
            }
        }
        apiAjax($gurl.file, 'post', data, false, false, function(res) {
            var updata = {
                avator: res.url
            }
            if (res) {
                updateUserInfo(updata);
            }

        })
    }

}
