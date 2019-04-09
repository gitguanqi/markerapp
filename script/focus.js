/*
author: guanqi;
date: 2019.4.7;
comment: 关注
*/
apiready = function() {

    //获取元素
    var focusNum = $api.dom('.focus-list-num');
    var indexBottom = $api.dom('#index-bottom'); //底部线
    var noData = $api.dom('#no-data'); //没有数据
    var tmlTemp = $api.dom('#tmlTemp'); //渲染列表
    var listdata = $api.dom('#focus-list');
    var listArr = []; // 请求数据返回

    //登录信息
    var userInfo = $api.getStorage('userInfo');
    var userId = userInfo.userId;

    //请求
    getFocusPerson();


    //获取内容
    function getFocusPerson() {
        apiAjax($gurl.focus + '?filter={"where":{"focus_user_id":"' + userId + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                if (res.length <= 0) {
                    listdata.innerHTML = '';
                    return false;
                } else {
                    getFocusUserInfo(res);
                }

            }
        })
    }

    //批量获取用户信息
    function getFocusUserInfo(res) {
        var allArtFocus = res;
        focusNum.innerText = allArtFocus.length;
        var requestUserArr = [];
        for (var i = 0; i < allArtFocus.length; i++) {
            requestUserArr.push({
                id: allArtFocus[i].author_id
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
                var allArtFocusResult = [];
                for (var i = 0; i < allArtFocus.length; i++) {
                    for (var j = 0; j < res.length; j++) {
                        if (allArtFocus[i].author_id == res[j].id) {
                            var artTime = allArtFocus[i].createdAt.slice(0, 19).split('T');
                            artTimeRes = artTime[0] + '  ' + artTime[1];
                            allArtFocusResult.push({
                                focus_user_avator: res[j].avator,
                                focus_user_name: res[j].username,
                                artTimeRes: artTimeRes
                            });
                        }
                    }
                }
                listArr = allArtFocusResult.sort(dateSortUp);
                var tmlabc = doT.template(tmlTemp.innerHTML);
                listdata.innerHTML = tmlabc(listArr);
                listArr = null;
            }
        })
    }

}
