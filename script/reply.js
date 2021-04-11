/*
author: guanqi;
date: 2019.4.7;
comment: 评论
*/
apiready = function() {

    //获取元素
    var replyNum = $api.dom('.focus-list-num');
    var indexBottom = $api.dom('#index-bottom'); //底部线
    var noData = $api.dom('#no-data'); //没有数据
    var tmlTemp = $api.dom('#tmlTemp'); //渲染列表
    var listdata = $api.dom('#reply-list');
    var listArr = []; // 请求数据返回

    //登录信息
    var userInfo = $api.getStorage('userInfo');

    checkLoginStatus();

    //请求
    if (userInfo) {
        var userId = userInfo.userId;
        getReplyPerson();
    }


    //获取内容
    function getReplyPerson() {
        showProgress();
        apiAjax($gurl.reply + '?filter={"where":{"reply_user_id":"' + userId + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                if (res.length <= 0) {
                    hideProgress();
                    listdata.innerHTML = '';
                    return false;

                } else {
                    getReplyUserInfo(res);
                }

            }
        })
    }

    //批量获取用户信息
    function getReplyUserInfo(res) {
        var allArtReply = res;
        var requestUserArr = [];
        for (var i = 0; i < allArtReply.length; i++) {
            requestUserArr.push({
                id: allArtReply[i].author_id
            });
        }
        var data = {
                values: {
                    requestUserArr
                }
            }
            //获取用户信息
        apiAjax($gurl.userset, 'GET', data, false, false, function(res) {
            if (res) {
                var allArtReplyResult = [];
                for (var i = 0; i < allArtReply.length; i++) {
                    for (var j = 0; j < res.length; j++) {
                        if (allArtReply[i].author_id == res[j].id) {
                            var artTime = allArtReply[i].createdAt.slice(0, 19).split('T');
                            artTimeRes = artTime[0] + '  ' + artTime[1];
                            allArtReplyResult.push({
                                reply_user_id: res[j].id,
                                reply_user_avator: res[j].avator,
                                reply_user_name: res[j].username,
                                artTimeRes: artTimeRes
                            });
                        }
                    }
                }
                listArr = allArtReplyResult.sort(dateSortUp);
                listArr = uniqObj(listArr, 'reply_user_id');
                for (var i = 0; i<listArr.length;i++) {
                  if(listArr[i].reply_user_id == userId) {
                      listArr.splice(i,1);
                  }
                }
                replyNum.innerText = listArr.length;
                var tmlabc = doT.template(tmlTemp.innerHTML);
                listdata.innerHTML = tmlabc(listArr);
                listArr = null;
                hideProgress();
            }
        })
    }

}

//点击到主页
function goPage(id) {
    openFrameSet('profile', '../me/profile.html', {
        from: 'reply_list',
        id: id
    });
}
