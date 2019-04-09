/*
author: guanqi;
date: 2019.4.4;
comment: 初始化js
*/
apiready = function() {
    //输出Log，Log将显示在APICloud Studio控制台
    console.log("Hi,welcomt to Blog Home!");

    var header = $api.dom('header'); // 获取 header 标签元素
    var footer = $api.dom('footer'); // 获取 footer 标签元素

    // 1.修复开启沉浸式效果带来的顶部Header与手机状态栏重合的问题，最新api.js方法已支持适配iPhoneX；
    // 2.默认已开启了沉浸式效果 config.xml中 <preference name="statusBarAppearance" value="true"/>
    // 3.沉浸式效果适配支持iOS7+，Android4.4+以上版本
    // var headerH = $api.fixStatusBar(header);
    // 最新api.js为了适配iPhoneX增加的方法，修复底部Footer部分与iPhoneX的底部虚拟横条键重叠的问题；
    // var footerH = $api.fixTabBar(footer);

    //联网判断
    api.addEventListener({
        name: 'online'
    }, function(ret, err) {
        if (ret) {
            console.log('您已连接网络');
        }
        if(err) {
          api.toast({
              msg: '请检测网络状态！',
              duration: 2000,
              location: 'bottom'
          });
        }

    });


    //页面菜单
    var allMenu = $api.domAll('.menu li');
    var navTitle = $api.domAll('.nav-inner li');
    // 首页图标
    var iconNormal = ['&#xe677;', '&#xe60d;', '&#xe641;', '&#xe606;'];
    var iconActive = ['&#xe61e;', '&#xe632;', '&#xe624;', '&#xe630;'];

    //初始化页面
    openNemWin(0);
    $api.addCls(navTitle[0], 'active');
    allMenu[0].innerHTML = '<i class="iconfont">' + iconActive[0] + '</i>';

    //点击切换导航
    toggleNav(allMenu, navTitle, 'active', [changeIcon, openNemWin]);

    //切换图标
    function changeIcon(index) {
        for (var i = 0; i < allMenu.length; i++) {
            if (i !== index) {
                allMenu[i].innerHTML = '<i class="iconfont">' + iconNormal[i] + '</i>';
            }
        }
        allMenu[index].innerHTML = '<i class="iconfont">' + iconActive[index] + '</i>';
    }

    //打开新窗口
    function openNemWin(index) {
        // 首页页面路径
        var winArr = [{
            name: 'home',
            url: './html/main.html'
        }, {
            name: 'search',
            url: './html/search/index.html'
        }, {
            name: 'message',
            url: './html/message/index.html'
        }, {
            name: 'me',
            url: './html/me/index.html'
        }]
        api.openFrame({
            name: winArr[index].name,
            url: winArr[index].url,
            rect: {
                x: 0,
                y: 55,
                // marginTop: headerH, // main页面距离win顶部的高度
                marginBottom: 44, // main页面距离win底部的高度
                w: 'auto', // main页面的宽度 自适应屏幕宽度
                h: 'auto'
            },
            reload: true,
            bounces: true,
            bgColor: '#f8f8f8',
            vScrollBarEnabled: false,
            hScrollBarEnabled: true
        });
    }

};
