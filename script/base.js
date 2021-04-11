/*
author: guanqi;
date: 2019.4.3;
comment: 通用js
*/

//正则验证
//验证用户名称
var userReg = /[a-zA-Z0-9\u4E00-\u9FA5\s\S]{2,11}/;
//验证用户密码
var pwdReg = /^[a-zA-Z0-9.-_]{5,19}$/;
//验证手机号
var phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
//验证邮箱
var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
//qq号码
var qqReg = /[1-9][0-9]{4,}/;
/*
name: 切换选项卡
params: {
btns: 选项卡全部按钮,
contents: 选项卡切换的内容,
actcls: 切换的样式,
setfn: 数组格式，切换的函数
}
*/
function toggleNav(btns, contents, actcls, setfn) {
    for (var i = 0; i < btns.length; i++) {
        btns[i].index = i;
        btns[i].onclick = function() {
            for (var j = 0; j < btns.length; j++) {
                $api.removeCls(contents[j], actcls);
            }
            $api.addCls(contents[this.index], actcls);
            if (setfn.length > 0) {
                for (var i = 0; i < setfn.length; i++) {
                    setfn[i](this.index);
                }
            }
        }
    }
}

function toggleTab(btns, actcls) {
    for (var i = 0; i < btns.length; i++) {
        btns[i].index = i;
        btns[i].onclick = function() {
            for (var j = 0; j < btns.length; j++) {
                $api.removeCls(btns[j], actcls);
            }
            $api.addCls(this, actcls);
        }
    }
}

// 日期排序
function dateSortUp(a, b) {
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
}

function dateSortDown(a, b) {
    return Date.parse(a.createdAt) - Date.parse(b.createdAt);
}

//数组去重
function unique(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        var len = arr.length;
        while (len > i) {
            if (arr[i].user_id == arr[len].user_id) {
                res.push(arr[len]);
            }
            len--;
        }
    }
    return res;
}

//数组嵌套对象去重

function uniqObj(data, name) {
    var dataArr = [];
    var dataObj = {};
    for (var i = 0; i < data.length; i++) {
        var item = data[i][name];
        if (!dataObj[item]) {
            dataArr.push(data[i]);
            dataObj[item] = true;
        }
    }
    return dataArr;
}

/*
name: 打开页面
params: {
name: 页面名称,
url: 页面路径,
params: 页面参数,
}
*/

// 打开主页面
function openMainSet(name, url, params) {
    api.openWin({
        name: name,
        url: url,
        pageParam: params || {}
    });
}

//关闭主页面，返回主页面
function backMain() {
    api.closeWin();

}

// 打开子级页面
function openFrameSet(name, url, params) {
    api.openFrame({
        name: name,
        url: url,
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: api.winHeight
        },
        bounces: false,
        bgColor: '#e3e3e3',
        vScrollBarEnabled: false,
        hScrollBarEnabled: true,
        pageParam: params,
        reload: true,
        animation: {
            type: "movein",
            subType: "from_right",
            duration: 300
        }
    });
}
//关闭子级页面，返回上级页
function backPrev(pageName) {
    api.closeFrame({
        name: pageName || ''
    });
}

// 显示loading
function showProgress() {
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '玩命加载中...',
        text: '先喝杯茶...',
        modal: true
    });
}

// 隐藏loading
function hideProgress() {
    setTimeout(function() {
        api.hideProgress();
    }, 1000);
}

// 检测登录状态
function checkLoginStatus() {
    var userInfo = $api.getStorage('userInfo');
    if (!userInfo) {
        api.confirm({
            title: '用户登录',
            msg: '你还没有登录，现在就走起吗?',
            buttons: ['确定', '取消']
        }, function(ret, err) {
            if (ret) {
                if (ret.buttonIndex == 1) {
                    openFrameSet('login', '../login/index.html');
                }
            } else {
                //  alert( JSON.stringify( err ) );
            }
        });

    }
}

/*
name: 下拉刷新
params: {
bgColor:背景颜色,
time: 延迟时间,
loadimg： 加载图片，数组格式
reqFn：请求方法
}
*/
function pullUpdateData(bgColor, time, reqFn) {
    api.setCustomRefreshHeaderInfo({
        bgColor: bgColor,
        isScale: true,
        loadAnimInterval: time,
        image: {
            pull: [
                'widget://image/loading_more2.gif'
            ],
            load: [
                'widget://image/loading_more2.gif'
            ]
        }
    }, function() {
        //下拉刷新被触发，自动进入加载状态，使用 api.refreshHeaderLoadDone() 手动结束加载中状态
        //下拉刷新被触发，使用 api.refreshHeaderLoadDone() 结束加载中状态
        //多个调用
        for (var i = 0; i < reqFn.length; i++) {
            reqFn[i]();
        }
        setTimeout(function() {
            api.refreshHeaderLoadDone();
        }, 1000);
    });
}

/*
name: 哈希加密算法SHA1
params: {
msg: 字符串名称
}
*/
function SHA1(msg) {

    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };

    function lsb_hex(val) {
        var str = "";
        var i;
        var vh;
        var vl;

        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };

    function cvt_hex(val) {
        var str = "";
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };


    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    msg = Utf8Encode(msg);

    var msg_len = msg.length;

    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
            break;

        case 2:
            i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
            break;

        case 3:
            i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) word_array.push(0);

    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);


    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {

        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;

    }

    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();

}

/*
name: Ajax操作方法
params: {
url: 请求地址,
method： 请求方法 GET获取查询,POST创建，PUT更新，DELETE删除
data: post请求数据json,
isCache: 是否缓存,
authorizationId： 权限id,
callback: 成功和失败回调函数
}
*/
function apiAjax(url, method, data, isCache, authorizationId, callback) {
    //检测网络类型
    var isNetWork = checkNetWork();
    if (!isNetWork) {
        api.alert({
            title: '网络未连接',
            msg: '请尝试联网，以便使用APP!',
        }, function(ret, err) {
            if (ret) {
                //  alert( JSON.stringify( ret ) );
            } else {
                //  alert( JSON.stringify( err ) );
            }
        });
        hideProgress();
        return false;
    }
    var appId = 'A6009705455336';
    var appKey = 'CE308D1D-B967-061F-4A67-C06B53D2094D';
    var now = Date.now();
    var appKey = SHA1(appId + 'UZ' + appKey + 'UZ' + now) + '.' + now;
    var headers = {
        "X-APICloud-AppId": appId,
        "X-APICloud-AppKey": appKey
    }
    if (authorizationId) {
        headers = {
            "X-APICloud-AppId": appId,
            "X-APICloud-AppKey": appKey,
            "authorization": authorizationId
        }
    }
    api.ajax({
        url: url,
        method: method,
        data: data,
        cache: isCache,
        "headers": headers
    }, function(ret, err) {
        if (ret) {
            callback(ret);
            // alert('成功结果：'+ JSON.stringify(ret));
        } else {
            callback(err);
            // alert('失败结果：'+ JSON.stringify(err));
        }
    });
}

//联网判断
function checkNetWork() {
    var isNet = false;
    if (api.connectionType == 'none' || api.connectionType == 'unknown') {
        isNet = false;
    } else {
        isNet = true;
    }
    return isNet;
}

//请求
function reqNews(url, method, data) {
    var data = data || '';
    return new Promise(function(resolve, reject) {
        if (!url && !(typeof url == 'string')) {
            throw new Error('SysantaxError: this get request must had url!');
        }
        var xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open(method, url, true);
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    var resJson = {
                        code: this.status,
                        response: JSON.parse(this.responseText)
                    }
                    reject(resJson, this)
                }
            }
        }
        xhr.send(data);
    })
}

// 内置游览器
function openBrowserUrl(links) {
    var browser = api.require('webBrowser');
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function(e) {
            var e = e || window.event;
            e.preventDefault();
            browser.open({
                url: this.href,
                bg: '#0e52b8',
                textColor: '#fff',
                color: '#2e6bc7'
            });
        }, false);
    }
}
