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

  var indexBottom = $api.dom('#index-bottom'); //底部线
  var noData = $api.dom('#no-data'); //没有数据
  var tmlTemp = $api.dom('#tmlTemp'); //渲染列表
  var listdata = $api.dom('#listdata');
  var listArr = []; // 请求数据返回

  //请求
  $api.addEvt(searchBtn, 'click', getSearchArticle, false);


  //获取文章
  function getSearchArticle() {
      var keyword = keywordIpt.value;
      if(keyword == '') {
        api.toast({
            msg: '请输入搜索内容!',
            duration: 2000,
            location: 'bottom'
        });

        return false;
      }
      showProgress();
      apiAjax($gurl.article + '?filter={"where":{"article_title":"' + keyword + '"}}', 'GET', {}, false, false, function(res) {
          if (res) {
              hideProgress(); // 隐藏loading
              if (res.length === 0) {
                  listdata.innerHTML = '';
                  $api.addCls(noData, 'show');
              }
              if (res.length > 10) {
                  $api.addCls(indexBottom, 'show');
              }
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
          }
      })
  }


}

function openInfoWin(id,from){
   openFrameSet('article','../me/detail.html',{artId: id, from: 'search'});
}
