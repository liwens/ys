/*
 *设置页的js代码
 * */


//判断是否有登录
$(function() {
	if(sessionStorage.nowLoginUid == undefined){
		$(".tip-suspended-layer").fadeIn();
		$(".tip-suspended-text").html("未登录");
		setTimeout(function() {
			self.location = "login.html";
			$(".tip-suspended-layer").fadeOut();
			$(".tip-suspended-text").html("");
		},2000)		
		return;
	}
	$('.personal-head img').attr('src',sessionStorage.userAvaterUrl);//个人信息头像
	$(".setting-head-img img").attr('src',sessionStorage.userAvaterUrl);//侧栏头像
	$("#headImg").attr('src',sessionStorage.userAvaterUrl);//头部导航条头像	
})

//更新提示数量，显示或隐藏呼吸灯
setBreathMsg();

//响应式导航条切换
mobileMenuToggle();

//设置页 上传头像
function loadingHead() {	
	var headImgEle = document.querySelector(".personal-head");
 		//做个下简易的验证  大小 格式 
	$('#avatarInput').on('change', function(e) {
		var filemaxsize = 1024 * 5;//5M
		var target = $(e.target);
		var Size = target[0].files[0].size / 1024;
		if(Size > filemaxsize) {
			alert('图片过大，请重新选择!');
			$(".avatar-wrapper").childre().remove;
			return false;
		}
		if(!this.files[0].type.match(/image.*/)) {
			alert('请选择正确的图片!')
		} else {
			var filename = document.querySelector("#avatar-name");
			var texts = document.querySelector("#avatarInput").value;
			var teststr = texts; 
			testend = teststr.match(/[^\\]+\.[^\(]+/i); //直接完整文件名的
			filename.innerHTML = testend;
		}
	
	});

	$(".avatar-save").on("click", function() {
		var img_lg = document.getElementById('imageHead');
		// 截图小的显示框内的内容
		html2canvas(img_lg, {
			allowTaint: true,
			taintTest: false,
			onrendered: function(canvas) {
				canvas.id = "mycanvas";
				//生成base64图片数据
				var dataUrl = canvas.toDataURL("image/jpeg");
				var newImg = document.createElement("img");
				newImg.src = dataUrl;
				imagesAjax(dataUrl)
			}
		});
	})
	
	function imagesAjax(src) {
		console.log(src)
		var data = {};
//		var pos = src.indexOf("4")+2;
//		////去掉Base64:开头的标识字符
//		src = src.substring(pos,src.length-pos);
		data.imgbaseUrl = encodeURI(src);
		data.uid = sessionStorage.nowLoginUid;
		data.require = "changeHeadImg";
		$.ajax({
			url: "php/setting.php",
			data: data,
			type: "POST",
			dataType: 'json',
			success: function(data) {
				if(data.success) {
					$('.personal-head img').attr('src',data.url);//个人信息头像
					$(".setting-head-img img").attr('src',data.url);//侧栏头像
					$("#headImg").attr('src',data.url);//头部导航条头像
					sessionStorage.userAvaterUrl = data.url;				
					sessionStorage.avatarChange = true;
				}
			}
		});
	}
}
loadingHead();

//设置页，请求个人信息，包括uid,用户名，性别，学校
var settinginfoAsk  = function() {
	$(".setting-uid").html(sessionStorage.nowLoginUid);
	$(".setting-username").html(sessionStorage.nowLoginUsername);
}
settinginfoAsk();

