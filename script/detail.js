/*
author: guanqi;
date: 2019.4.7;
comment: 文章详情
*/

apiready = function() {

    //获取文章id、来源
    var from = api.pageParam.from;
    var articleId = api.pageParam.artId;

    //获取登录用户信息
    var userInfo = $api.getStorage('userInfo');
    var userId = userInfo.userId;
    var replyUserName = userInfo.username;
    var replyUserAvator = userInfo.avator;
    var articleAuthorId = '';

    //获取文章元素
    var authorName = $api.dom('.article-author-name');
    var authorImg = $api.dom('.article-author-img');
    var artDate = $api.dom('.article-author-date');
    var artReadNum = $api.dom('.article-author-num');
    var artTitle = $api.dom('.article-title-show');
    var artContent = $api.dom('.article-detail-content');

    //关注元素
    var articleFocus = $api.dom('.article-author-status');

    //评论元素
    var newReplyContent = $api.dom('.new-reply-content');
    var articleReplyIpt = $api.dom('.article-reply');
    var articleReplyBtn = $api.dom('.article-reply-btn');

    //评论显示元素
    var noData = $api.dom('#no-data'); //没有数据
    var tmlTempReply = $api.dom('#tmlTempReply'); //渲染列表
    var listdataReply = $api.dom('#reply_data');
    var listReplyArr = []; // 请求数据返回
    var replynum = 0;

    //点赞元素
    var articleGood = $api.dom('.article-good');
    var goodnum = 0;

    //分享元素
    var articleShare = $api.dom('.article-share');
    var shareTitle = '';
    var shareArticleAuthorName = '';

    //请求
    getArticle(articleId); //获取文章内容
    showReplyContent(); //显示评论内容


    //获取文章
    function getArticle(id) {
        showProgress();
        apiAjax($gurl.article + '/' + id, 'GET', {}, false, false, function(res) {
            if (res && res.id) {
                var artTime = res.createdAt.slice(0, 19).split('T');
                artDate.innerText = artTime[0] + '  ' + artTime[1];
                artTitle.innerText = res.article_title;
                shareTitle = res.article_title;
                artContent.innerHTML = res.article_content;
                goodnum = res.good_num == null ? 0 : parseInt(res.good_num);
                replynum = res.reply_num == null ? 0 : parseInt(res.reply_num);
                articleAuthorId = res.user_id;
                //获取用户信息
                getUser(res.user_id);
                //获取阅读数量
                var readnum = res.read_num == null ? 0 : res.read_num;
                var updata = {
                    values: {
                        read_num: readnum + 1
                    }
                }
                updateArticleRead(updata); //更新文章阅读数量
                searchUserFocusStatus(res.user_id); //显示关注内容
                hideProgress();
            }
        })
    }

    //获取用户信息
    function getUser(id) {
        apiAjax($gurl.userset + id, 'GET', {}, false, false, function(res) {
            if (res) {
                authorImg.src = res.avator || '../../image/logo.png';
                authorName.innerText = res.username || '博客之家';
                shareArticleAuthorName = res.username;
            }
        })
    }

    //修改文章阅读数量
    function updateArticleRead(data) {
        apiAjax($gurl.article + '/' + articleId, 'PUT', data, false, false, function(res) {
            if (res && res.id) {
                artReadNum.innerText = res.read_num;
            }
        })
    }

    //关注作者
    $api.addEvt(articleFocus, 'click', getUserFocusStatus, false);

    //查询关注状态
    function searchUserFocusStatus(artAuthorId) {
      if(userId == artAuthorId) {
          $api.addCls(articleFocus, 'hide');
      } else {
        apiAjax($gurl.focus, 'GET', {}, false, false, function(res) {
            if (res) {
              var focusStatus = '';
              for (var i = 0; i < res.length; i++) {
                if(res[i].focus_user_id == userId && res[i].author_id == articleAuthorId) {
                  focusStatus = 1;
                  break;
                }
              }
              if(focusStatus == 1) {
                articleFocus.innerText = '已关注';
              }
            }
        })
      }
    }

    //查询关注状态
    function getUserFocusStatus() {
        apiAjax($gurl.focus + '?filter={"where":{"author_id":"' + articleAuthorId + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                if (res.length <= 0) {
                    articleFocusSet(1);
                } else {
                    var isFocus = false;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].focus_user_id === userId) {
                            isFocus = true;
                            break;
                        }
                        if (isFocus) {
                            break;
                        }
                    }
                    if (isFocus) {
                        api.toast({
                            msg: '您已经关注该作者!',
                            duration: 2000,
                            location: 'bottom'
                        });
                    } else {
                        articleFocusSet(1);
                    }
                }

            }
        })
    }

    //提交关注状态
    function articleFocusSet(type) {
        var data = {
            values: {
                focus_type: type,
                focus_user_id: userId,
                author_id: articleAuthorId
            }
        }
        apiAjax($gurl.focus, 'POST', data, false, false, function(res) {
            if (res && res.id) {
                api.toast({
                    msg: '关注成功!',
                    duration: 2000,
                    location: 'bottom'
                });
                articleFocus.innerText = '已关注';
            }
        })
    }

    //获取评论内容
    $api.addEvt(articleReplyBtn, 'click', getReplyCon, false);

    function getReplyCon() {
        if (articleReplyIpt.value == '') {
            api.toast({
                msg: '请输入评论内容！',
                duration: 2000,
                location: 'bottom'
            });
            return false;
        }
        var data = {
            values: {
                article_id: articleId,
                reply_content: articleReplyIpt.value,
                reply_user_id: userId,
                author_id: articleAuthorId
            }
        }
        addArticleReply(data);
    }

    //提交评论内容
    function addArticleReply(data) {
        apiAjax($gurl.reply, 'POST', data, false, false, function(res) {
            if (res && res.id) {
                api.toast({
                    msg: '评论提交成功!',
                    duration: 2000,
                    location: 'bottom'
                });
                articleReplyIpt.value = '';
                updateArticleReplyNum();
                showReplyContent();
            }
        })
    }

    //更新文章评论数量
    function updateArticleReplyNum() {
        var data = {
            values: {
                reply_num: replynum + 1
            }
        }
        apiAjax($gurl.article + '/' + articleId, 'PUT', data, false, false, function(res) {
            if (res && res.id) {

            }
        })
    }

    //显示评论内容
    function showReplyContent() {
        apiAjax($gurl.reply + '?filter={"where":{"article_id":"' + articleId + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                if (res.length <= 0) {
                    listdataReply.innerHTML = '';
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
                id: allArtReply[i].reply_user_id
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
                        if (allArtReply[i].reply_user_id == res[j].id) {
                            var artTime = allArtReply[i].createdAt.slice(0, 19).split('T');
                            artTimeRes = artTime[0] + '  ' + artTime[1];
                            allArtReplyResult.push({
                                reply_user_avator: res[j].avator,
                                reply_user_name: res[j].username,
                                artTimeRes: artTimeRes,
                                reply_content: allArtReply[i].reply_content
                            });
                        }
                    }
                }
                listReplyArr = allArtReplyResult.sort(dateSortUp);
                var tmlabc = doT.template(tmlTempReply.innerHTML);
                listdataReply.innerHTML = tmlabc(listReplyArr);
                listReplyArr = null;
            }
        })
    }


    //点赞
    $api.addEvt(articleGood, 'click', getUserGoodRecord, false);

    //查询点赞记录
    function getUserGoodRecord() {
        apiAjax($gurl.good + '?filter={"where":{"article_id":"' + articleId + '"}}', 'GET', {}, false, false, function(res) {
            if (res) {
                var updata = {
                    values: {
                        good_num: goodnum + 1
                    }
                }
                var isGood = false; //是否点过
                if (res === []) {
                    updateArticleGoodNum(updata);
                } else {
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].good_user_id === userId) {
                            isGood = true;
                            break;
                        }
                        if (isGood) {
                            break;
                        }
                    }
                    if (isGood) {
                        api.toast({
                            msg: '您已经点过了!',
                            duration: 2000,
                            location: 'bottom'
                        });
                    } else {
                        updateArticleGoodNum(updata);
                    }
                }
            }
        })
    }

    //更新文章点赞数量
    function updateArticleGoodNum(data) {
        apiAjax($gurl.article + '/' + articleId, 'PUT', data, false, false, function(res) {
            if (res && res.id) {
                addGoodNum();
            }
        })
    }


    //添加点赞记录
    function addGoodNum() {
        var data = {
            values: {
                article_id: articleId,
                good_user_id: userId,
                author_id: articleAuthorId
            }
        }
        apiAjax($gurl.good, 'POST', data, false, false, function(res) {
            if (res && res.id) {
                api.toast({
                    msg: '谢谢您的点赞!',
                    duration: 2000,
                    location: 'bottom'
                });
                articleGood.innerHTML = '<i class="iconfont">&#xe635;</i>';
            }
        })
    }

    //分享文章
    $api.addEvt(articleShare, 'click', articleShareSet, false);

    //查询点赞记录
    function articleShareSet() {
        var sharedModule = api.require('shareAction');
        var shareContent = '您的好友' + replyUserName + '感觉' + shareArticleAuthorName + '写的这篇《' + shareTitle + '》文章不错,快下载博客之家App体验一下吧!';
        sharedModule.share({
            text: shareContent,
            type: 'text'
        });
        addShareNum(shareContent);
    }

    //添加分享记录
    function addShareNum(shareContent) {
        var data = {
            values: {
                article_id: articleId,
                share_content: shareContent,
                share_user_id: userId,
                author_id: articleAuthorId
            }
        }
        apiAjax($gurl.share, 'POST', data, false, false, function(res) {
            if (res && res.id) {
                console.log('share succ!');
            }
        })
    }

    //点击到主页
    $api.addEvt(authorImg, 'click', goMyPage, false);

    function goMyPage() {
        openFrameSet('profile', './profile.html', {
            from: 'detail',
            id: articleAuthorId
        });
    }

}
