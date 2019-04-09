/*
author: guanqi;
date: 2019.4.7;
comment: 点赞
*/
apiready = function() {

    //获取元素
    var goodNum = $api.dom('.focus-list-num');
    var indexBottom = $api.dom('#index-bottom'); //底部线
    var noData = $api.dom('#no-data'); //没有数据
    var tmlTemp = $api.dom('#tmlTemp'); //渲染列表
    var listdata = $api.dom('#good-list');
    var listArr = []; // 请求数据返回

    //登录信息
    var userInfo = $api.getStorage('userInfo');
    var userId = userInfo.userId;

    //请求
    getGoodPerson();


    //获取内容
    function getGoodPerson() {
        apiAjax($gurl.good + '?filter={"where":{"good_user_id":"' + userId + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                if (res.length <= 0) {
                    listdata.innerHTML = '';
                    return false;
                } else {
                    getGoodUserInfo(res);
                }

            }
        })
    }

    //批量获取用户信息
    function getGoodUserInfo(res) {
        var allArtGood = res;
        goodNum.innerText = allArtGood.length;
        var requestUserArr = [];
        for (var i = 0; i < allArtGood.length; i++) {
            requestUserArr.push({
                id: allArtGood[i].author_id
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
                var allArtGoodResult = [];
                for (var i = 0; i < allArtGood.length; i++) {
                    for (var j = 0; j < res.length; j++) {
                        if (allArtGood[i].author_id == res[j].id) {
                            var artTime = allArtGood[i].createdAt.slice(0, 19).split('T');
                            artTimeRes = artTime[0] + '  ' + artTime[1];
                            allArtGoodResult.push({
                                good_user_id: res[j].id,
                                good_user_avator: res[j].avator,
                                good_user_name: res[j].username,
                                artTimeRes: artTimeRes
                            });
                        }
                    }
                }
                listArr = allArtGoodResult.sort(dateSortUp);
                var tmlabc = doT.template(tmlTemp.innerHTML);
                listdata.innerHTML = tmlabc(listArr);
                listArr = null;
            }
        })
    }

}

//点击到主页
function goPage(id) {
    openFrameSet('profile', '../me/profile.html', {
        from: 'good_list',
        id: id
    });
}
