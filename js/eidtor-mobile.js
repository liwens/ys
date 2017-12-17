/*
 * 接受文本域的字符串，将回车替换成 "<br />"
 * 接受 字符串
 * 返回 字符串
 * */
//var regText = function(str) {
//	var regRN = /\n/g;
//	return str.replace(regRN,"<br />");
//}
$(function () {
    // ___E 三个下划线
    editor = new ___E('editor-mobile-area');
    editor.init();
});
getsite("site","mapshow");

//点击确认发帖按钮时，发帖
publish();

//发帖模块，地图显示隐藏
publishMapHide();

//定位地名不准，手动输入的逻辑
handReviseSiteName() 

