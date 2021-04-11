/*
author: guanqi;
date: 2019.4.7;
comment: 搜索
*/
apiready = function() {


    //获取元素
    var historyNum = $api.dom('.history-num');
    var keywordIpt = $api.dom('.search-box');
    var searchBtn = $api.dom('.search-btn');
    var historyText = $api.dom('.history-text');

    var indexBottom = $api.dom('#index-bottom'); //底部线
    var noData = $api.dom('#no-data'); //没有数据
    var tmlTemp = $api.dom('#tmlTemp'); //渲染列表
    var listdata = $api.dom('#listdata');
    var listArr = []; // 请求数据返回

    //搜索历史元素
    var noCache = $api.dom('.no-cache');
    var searchCache = $api.dom('.search-cache');
    var cacheArr = [];
    var keyword = '';
    var searchCacheItems = $api.domAll('.search-cache-item');

    //请求
    getHistory();
    $api.addEvt(searchBtn, 'click', getSearchArticle, false);

    //获取文章
    function getSearchArticle() {
        keyword = keywordIpt.value;
        if (keyword == '') {
            api.toast({
                msg: '请输入搜索内容!',
                duration: 2000,
                location: 'bottom'
            });

            return false;
        }
        showProgress();
        apiAjax($gurl.article + '?filter={"where":{"article_title":"' + keyword + '","is_private":"false"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                hideProgress(); // 隐藏loading
                listArr = res.sort(dateSortUp);
                historyNum.innerText = listArr.length;
                for (let i = 0; i < listArr.length; i++) {
                    let item = listArr[i];
                    for (var key in item) {
                        item.arttime = item.createdAt.toString().slice(0, 10);
                        item.read_num = item.read_num > 9999 ? (parseFloat(item.read_num / 10000)).toFixed(1) + 'w' : item.read_num;
                        item.good_num = item.good_num > 9999 ? (parseFloat(item.good_num / 10000)).toFixed(1) + 'w' : item.good_num;
                        item.reply_num = item.reply_num > 9999 ? (parseFloat(item.reply_num / 10000)).toFixed(1) + 'w' : item.reply_num;
                    }
                }
                var tmlabc = doT.template(tmlTemp.innerHTML);
                listdata.innerHTML = tmlabc(listArr);
                listArr = null;
                if (res.length <= 0) {
                    listdata.innerHTML = '';
                    $api.removeCls(noData, 'hide');
                } else {
                    $api.addCls(noData, 'hide');
                }
                if (res.length > 10) {
                    $api.removeCls(indexBottom, 'hide');
                } else {
                    $api.addCls(indexBottom, 'hide');
                }
                $api.removeCls(historyText, 'hide');
                saveHistory();
            }
        })
    }


    //搜索记录
    function saveHistory() {
        var now = Date.parse(new Date());
        var isSame = false;
        for (item of cacheArr) {
            if (keyword == item.name) {
                isSame = true;
            }
        }
        if (isSame) {
            return false;
        }
        cacheArr.unshift({
            id: now,
            name: keyword
        });
        $api.setStorage('history', cacheArr);
        getHistory();
    }

    //显示记录
    function getHistory() {
        var hArr = $api.getStorage('history');
        if(hArr) {
          var hstr = '';
          for (item of hArr) {
              hstr += `<li class="search-cache-item">${item.name}</li>`
          }
          if (hArr.length > 0) {
              $api.addCls(noCache, 'hide');
              $api.removeCls(searchCache, 'hide');
              searchCache.innerHTML = hstr;
          } else {
              $api.removeCls(noCache, 'hide');
              $api.addCls(searchCache, 'hide');
          }
        }

    }

}

function openInfoWin(id, from) {
    openFrameSet('article', './me/detail.html', {
        artId: id,
        from: 'search'
    });
}
