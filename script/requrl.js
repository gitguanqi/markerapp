/*
author: guanqi;
date: 2019.4.5;
comment: 请求接口地址
*/
(function(window) {
    var g = {};
    var pub = 'https://d.apicloud.com/mcm/api'; //请求
    g.pub = pub;
    g.file = 'http://d.apicloud.com/mcm/api/file'; //上传文件
    g.batch = 'https://d.apicloud.com/mcm/api/batch'; // 批量操作
    g.info = {
            'name': 'gurl',
            'des': 'ajax request url',
            'version': 'v0.0.1'
        }
        //用户管理
        //1.新增用户POST
    g.adduser = pub + '/user';
    //2.登录POST
    g.login = pub + '/user/login';
    //3.登出POST
    g.logout = pub + '/user/logout';
    //4.发送验证邮件POST
    g.verifyemail = pub + '/user/verifyEmail';
    //5.密码重置POST
    g.resetpwd = pub + '/user/resetRequest';
    //6.获取用户GET、更改用户信息PUT、删除用户DELETE
    g.userset = pub + '/user/'; // 加<objectId>
    //7.创建角色POST
    g.addrole = pub + '/role/';
    //8.获取角色GET、更改角色信息PUT、删除角色DELETE
    g.roleset = pub + '/role/'; // 加<objectId>

    //9.用户关联角色
    g.uroleadd = pub + '/_user/';

    //文章相关api
    g.article = pub + '/article_list';

    //关注相关api
    g.focus = pub + '/user_focus';

    //评论相关api
    g.reply = pub + '/article_reply';

    //点赞相关api
    g.good = pub + '/article_good';

    //点赞相关api
    g.share = pub + '/article_share';

    //密码问题
    g.que = pub + '/pwd_question';

    //用户密码问题
    g.pwd = pub + '/pwd_set';

    // 意见反馈
    g.feedback = pub + '/feedback';

    //新闻
    g.news = 'http://api.dagoogle.cn/news/nlist';

    g.newsinfo = 'http://api.dagoogle.cn/news/ndetail';

    //挂载到window
    window.$gurl = g;
})(window)
