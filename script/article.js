/*
author: guanqi;
date: 2019.4.7;
comment: 写文章
*/
apiready = function() {

    //获取元素
    var articleTitle = $api.dom('.write-title'); //文章标题
    var articleContent = $api.dom('.article-content'); //文章内容
    var saveBtn = $api.dom('.write-save-btn'); //保存按钮
    var articlePreview = $api.dom('.article-preview');
    var userInfo = $api.getStorage('userInfo');
    var mkToHtmlCon = '';

    //来源id
    var artId = api.pageParam.id;
    var from = api.pageParam.from;

    if (from == 'edit') {
      getArticle(artId);
    }

    //点击保存
    $api.addEvt(saveBtn, 'click', saveArticle, false);

    function saveArticle() {
        if (!userReg.test(articleTitle.value)) {
            api.toast({
                msg: '请输入文章标题！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        if (!userReg.test(articleContent.value)) {
            api.toast({
                msg: '请输入文章内容！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        var data = {
            values: {
                user_id: userInfo.userId,
                article_title: articleTitle.value,
                article_summary: articlePreview.innerText.slice(0,60),
                article_content: mkToHtmlCon
            }
        }

        //新建文章
        if(from && from == 'edit') {
          updateArticle(artId,data);
        } else {
          createArticle(data);
        }

    }


    //新建文章
    function createArticle(data) {
        apiAjax($gurl.article, 'POST', data, false, false, function(res) {
            if (res && res.id) {
                api.toast({
                    msg: '文章保存成功！',
                    duration: 2000,
                    location: 'bottom'
                });
                articleTitle.value = '';
                articleContent.value = '';
                articlePreview = '';
                mkToHtmlCon = '';
                openFrameSet('detail', './detail.html', {
                    artId: res.id,
                    from: 'edit'
                });
            }
        })
    }

    //查看文章
    function getArticle (id) {
      apiAjax($gurl.article + '/' + id,'GET',{},false,false,function(res){
        if(res && res.id) {
          articleTitle.value = res.article_title;
          articleContent.innerText = res.article_content;
        }
      })
    }

    //修改文章
    function updateArticle (id,data) {
      apiAjax($gurl.article + '/' + id, 'PUT', data, false, false, function(res) {
          if (res && res.id) {
              api.toast({
                  msg: '文章保存成功！',
                  duration: 2000,
                  location: 'bottom'
              });
              articleTitle.value = '';
              articleContent.value = '';
              articlePreview = '';
              mkToHtmlCon = '';
              openFrameSet('profile', './profile.html', {
                  from: 'edit'
              });
          }
      })
    }

    //文章转换
    $api.addEvt(articleContent, 'input', mkToHtml, false);

    function mkToHtml () {
        mkToHtmlCon = marked(articleContent.value);
        articlePreview.innerHTML = mkToHtmlCon;
    }

}
