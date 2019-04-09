/*
author: guanqi;
date: 2019.4.5;
comment: 消息js
*/
apiready = function() {
    var msgItems = $api.domAll('.msg-item');
    var msgUrls = [{
        name: 'focus',
        url: './focus.html'
    }, {
        name: 'good',
        url: './good.html'
    }, {
        name: 'reply',
        url: './reply.html'
    }, ];
    for (var i = 0; i < msgItems.length; i++) {
        msgItems[i].index = i;
        msgItems[i].onclick = function() {
            openFrameSet(msgUrls[this.index].name, msgUrls[this.index].url);
        }
    }
};
