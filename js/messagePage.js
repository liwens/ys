//检查是否有登录
checkLogin()
/*加载头像*/
$(".setting-head-img img").attr('src',sessionStorage.userAvaterUrl);//侧栏头像
$("#headImg").attr('src',sessionStorage.userAvaterUrl);//头部导航条头像	

//更新提示数量，显示或隐藏呼吸灯
setBreathMsg();

//响应式导航条切换
mobileMenuToggle();

//请求提醒数量
function requireMsg() {
	var uid = sessionStorage.nowLoginUid;
	$.ajax({
		type:"get",
		url:"php/interactiveMessage.php?uid="+uid,
//		url:"json/msg.json",
		dataType:"json",
		success: function(data) {
			if(data.success){
				if(data.lists.length == 0){
					$(".msg-box").html("没有提醒！");
					return
				}
				var textContent = "",
					i = 0,
					len = data.lists.length;
					//如果返回的controlType 为0，为评论，1为点赞
					type = "",
					//加粗的标签，如果返回的readed 为0， 不加粗，1 加粗
					strongprevLabel = "",
					strongAfterLabel = "";
				for(i; i<len; i++){
					type = data.lists[i].controlType ==  0 ? "评论" : "点赞"; 
					strongprevLabel = data.lists[i].readed == 0 ? "" : "<strong>";
					strongAfterLabel = data.lists[i].readed == 0 ? "" : "</strong>";
					textContent += 
						'<div class="msg-list">' + 
							'<img src="'+ data.lists[i].avatarUrl +'" alt="" class="msg-avatar"/>' +
							'<span class="message-time">'+ data.lists[i].controlTime +'</span>' +																
							'<div class="message-content">'+ strongprevLabel + data.lists[i].userName +" "+ type +' 了你在 '+ data.lists[i].articlePublishTime +' 发布的心声' + strongAfterLabel+'</div>' +					
						'</div>' 
				}
				$(".msg-box").html(textContent);
				//重置提醒数量
				sessionStorage.interactiveMsgNum = 0;
			}
		},
		error:function() {
			alert("信息请求出错了");
		}
	});	
}
requireMsg();
