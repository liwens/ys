/*
 * 手机端的评论页代码
 * */

//手机端加载评论
function mobileCommentLoading() {
//	$(".backIndex").html(sessionStorage.nowClickAid);
	//获取当前点击的aid
	var aid = sessionStorage.nowClickAid;
	//根据aid加载评论
	require_comment(aid);
	$("#comment-input").attr({"placeholder":"回复：", "disabled":false});
	mobileLoadingCommentContent(aid)
	//手机端加载当前评论aid内容
	function mobileLoadingCommentContent(aid) {
       $.ajax({
            type: 'GET',
            url: 'php/mobile_load_comment_content.php?require=mobileContent&aid='+aid,            
            dataType: 'json',		
            success : function(data){
            	if(data.success) {
            		var textContent = publishTextTemplet(data);
            		$(".lists").html(textContent);
            	}          	
            },
            error :function(data) {
            	alert("手机端加载评论文章失败");
            }
		})
    }
	//为发送评论按钮绑定发送评论事件
	sendComment(aid);
}
mobileCommentLoading();
