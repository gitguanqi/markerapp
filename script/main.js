/*
author: guanqi;
date: 2019.4.4;
comment: 首页js
*/
apiready = function() {
    //首页元素
    var indexBottom = $api.dom('#index-bottom'); //底部线
    var noData = $api.dom('#no-data'); //没有数据
    var tmlTemp = $api.dom('#tmlTemp'); //渲染列表
    var listdata = $api.dom('#listdata');
    var listArr = []; // 请求数据返回

    //请求列表数据
    reqList('start');

    function reqList(loadType) {
        if (loadType == 'start') {
            showProgress(); // 显示loading
        }
        apiAjax($gurl.article, 'get', {}, false, false, function(res) {
            if(res) {
                if(res.length === 0) {
                  $api.addCls(noData, 'show');
                }
                if(res.length > 10) {
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
                if (loadType == 'start') {
                    hideProgress(); // 隐藏loading
                }
                var tmlabc = doT.template(tmlTemp.innerHTML);
                listdata.innerHTML = tmlabc(listArr);
                listArr = null;
            }
        })
    }

    //下拉刷新
    pullUpdateData('#fff', 500, [reqList]);
};

function openInfoWin(id,from){
   openFrameSet('article','./me/detail.html',{artId: id, from: 'index'});
}
