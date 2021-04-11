/*
author: guanqi;
date: 2019.4.11;
comment: 图片js
*/
apiready = function() {


    //获取参数
    var imgs = api.pageParam.imgs;

    //获取元素
    var myPic = $api.dom('.my-pic-box');

    //显示 图片
    showAllPic();

    function showAllPic() {
        var str = '';
        for (item of imgs) {
            str += `<li class="item ${item.index == 0 ? 'active' : ''}"><img class="item-img" src="${item}" /></li>`;
        }
        myPic.innerHTML = str;
    }

}
