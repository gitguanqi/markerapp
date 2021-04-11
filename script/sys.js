/*
author: guanqi;
date: 2019.4.4;
comment: 我的设置js
*/
apiready = function() {

    //获取元素
    var systemVersion = $api.dom('.me-system-version');

    systemVersion.innerText = '当前版本:' + api.appVersion;

};
