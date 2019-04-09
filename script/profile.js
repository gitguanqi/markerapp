/*
author: guanqi;
date: 2019.4.7;
comment: 我的主页详情
*/

var isLoginUser = true;

apiready = function() {

    //获取元素
    var indexBottom = $api.dom('#index-bottom'); //底部线
    var noData = $api.dom('#no-data'); //没有数据
    var tmlTemp = $api.dom('#tmlTemp'); //渲染列表
    var listdata = $api.dom('#listdata');
    var listArr = []; // 请求数据返回

    //获取登录信息
    var userInfo = $api.getStorage('userInfo');
    var userId = userInfo.userId;

    //获取个人信息
    var profileTitle = $api.dom('.profile-title');
    var profileDes = $api.dom('.profile-des');
    var articleNum = $api.dom('.profile-num');
    var focus = $api.dom('.focus');
    var articleReply = $api.dom('.article_reply');
    var refreshPage = $api.dom('.refresh-page');

    //获取页面参数
    var from = api.pageParam.from; //来自哪里
    var userIdDetail = api.pageParam.id;
    var userIdPro = '';
    userIdPro = userId;


    //判断哪里来
    if ((from == 'detail' || 'good_list' || 'reply_list') && userIdDetail) {
        profileTitle.innerText = 'loading';
        profileDes.innerText = 'loading';
        userIdPro = userIdDetail;
        isLoginUser = false;
        refreshPageSet();
    } else if (from == 'edit') {
        userIdPro = userId;
        isLoginUser = true;
        refreshPageSet();
    } else {
        isLoginUser = true;
        refreshPageSet();
    }

    //刷新页面
    $api.addEvt(refreshPage, 'click', refreshPageSet, false);

    function refreshPageSet() {
        showProgress(); // 显示loading
        getUserInfo(userIdPro); //获取用户信息
        getArticleNum(userIdPro); //获取文章数量
        getFocusNum(userIdPro); //获取关注数量
        getReplyNum(userIdPro); //获取评论数量
        getArticle(userIdPro, 'start'); //获取文章信息
        hideProgress();
    }

    //获取基本信息
    //获取个人信息
    function getUserInfo(id) {
        apiAjax($gurl.userset + id, 'GET', {}, false, false, function(res) {
            if (res && res.id) {
                profileTitle.innerText = res.username;
                profileDes.innerText = res.sign;
            }
        })
    }

    //获取文章
    function getArticle(id, loadType) {
        if (loadType == 'start') {
            showProgress(); // 显示loading
        }
        apiAjax($gurl.article + '?filter={"where":{"user_id":"' + id + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                if (loadType == 'start') {
                    hideProgress(); // 隐藏loading
                }
                if (res.length === 0) {
                    listdata.innerHTML = '';
                    $api.addCls(noData, 'show');
                }
                if (res.length > 10) {
                    $api.addCls(indexBottom, 'show');
                }
                listArr = res.sort(dateSortUp);
                for (let i = 0; i < listArr.length; i++) {
                    let item = listArr[i];
                    for (var key in item) {
                        item.createdAt = item.createdAt.toString().slice(0, 10);
                        item.read_num = item.read_num > 9999 ? (parseFloat(item.read_num / 10000)).toFixed(1) + 'w' : item.read_num;
                        item.good_num = item.good_num > 9999 ? (parseFloat(item.good_num / 10000)).toFixed(1) + 'w' : item.good_num;
                        item.reply_num = item.reply_num > 9999 ? (parseFloat(item.reply_num / 10000)).toFixed(1) + 'w' : item.reply_num;
                    }
                }
                var tmlabc = doT.template(tmlTemp.innerHTML);
                listdata.innerHTML = tmlabc(listArr);
                listArr = null;
            }
        })
    }

    //获取文章数
    function getArticleNum(id) {
        apiAjax($gurl.article + '?filter={"where":{"user_id":"' + id + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                articleNum.innerText = res.length > 0 ? res.length : 0;
            }
        });
    }

    //获取关注数
    function getFocusNum(id) {
        apiAjax($gurl.focus + '?filter={"where":{"user_id":"' + id + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                focus.innerText = res.length > 0 ? res.length : 0;
            }
        });
    }

    //获取评论数
    function getReplyNum(id) {
        apiAjax($gurl.reply + '?filter={"where":{"user_id":"' + id + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                articleReply.innerText = res.length > 0 ? res.length : 0;
            }
        });
    }
}


//文章操作
function openInfoWin(id) {
    if (isLoginUser) {
        api.actionSheet({
                title: '文章操作',
                cancelTitle: '取消操作',
                // destructiveTitle: '删除文章',
                buttons: ['查看文章', '修改文章', '删除文章']
            },
            function(ret, err) {
                var index = ret.buttonIndex;
                if (index == 1) {
                    openFrameSet('detail', './detail.html', {
                        artId: id,
                        from: 'profile'
                    });
                }
                if (index == 2) {
                    openFrameSet('article', './article.html', {
                        id: id,
                        from: 'edit'
                    });
                }
                if (index == 3) {
                    var result = confirm('你确定要删除吗?');
                    if (result) {
                        delArticle(id);
                    }
                }
            });
    } else {
        api.actionSheet({
                title: '文章操作',
                cancelTitle: '取消操作',
                // destructiveTitle: '删除文章',
                buttons: ['查看文章']
            },
            function(ret, err) {
                var index = ret.buttonIndex;
                if (index == 1) {
                    openFrameSet('detail', './detail.html', {
                        artId: id,
                        from: 'profile'
                    });
                }
            });
    }
}

function delArticle(id) {
    apiAjax($gurl.article + '/' + id, 'DELETE', {}, false, false, function(res) {
        if (res) {
            api.toast({
                msg: '文章删除成功，手动刷新试试~',
                duration: 2000,
                location: 'bottom'
            });
        }
    })
}
