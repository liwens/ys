/* 登录和注册的js代码
 */
//响应式导航条切换
mobileMenuToggle()

var registerFlag = {//用于验证输入信息是否 完成了正确的输入
	account : false,
	password : false,
	checkPassword : false,
	email : false,
	captcha : false
};
//账号输入框失焦事件，ajax验证数据库中没有相同账号，接收服务器回传的json数据
$("#js-register-account").blur(function() {
	var ele = $("#js-register-account"), //输入框
		tips = $(".js-account-tips") ? $(".js-account-tips") : null,  //提示栏
		vallen = ele.val().length;//文本框长度，用于判断输入长度
	if(vallen == 0 && tips.length < 1){//提示没有输入
		$('<span class="input-group-addon tips-danger js-account-tips" >请输入账号</span>').insertAfter(ele);	
		return;
	}else if(vallen > 2 && vallen < 20){//输入合格，清除提示
		if(tips){
			tips.remove();
		}
	}else if(vallen > 20 && tips.length < 1) {//账号长度低于2，超出20
		$('<span class="input-group-addon tips-danger js-account-tips" >账号长度在2-20位间</span>').insertAfter(ele);
		return;
	}
	$.ajax({
		type:"GET",//设置GET方法
		url:"php/register.php?require=accountCheck&account=" + $("#js-register-account").val(),//传送值
		dataType:"json",//会自动解析json字符串
		success:function(data) {
			if(data.success) {//如果输入的账号没有被注册，显示可用成功
					registerFlag.account = true;
					console.log(registerFlag)				
				if(tips.length > 0){
					tips.remove();	//清除错误信息
				}
			}else{
				//错误信息插入
				registerFlag.account = false;				
				if(tips.length < 1){
					$('<span class="input-group-addon tips-danger js-account-tips" >' +data.info+ '</span>').insertAfter(ele);			
				}
			}
		},
		// 如果返回json字符串为success.false,则说明数据库中已经有相同的账号。
		error:function(jqXHR){				
			$("#account").html("发生错误" + jqXHR.status);		
		}		
	})
})

//验证密码的位数
$("#js-register-password").blur(function() {
	var ele = $("#js-register-password"),
		tips = $(".js-password-tips") ? $(".js-password-tips") : null,	
		pwdLength = $("#js-register-password").val().length;
	if(pwdLength < 6 || pwdLength > 20){//不符合
			registerFlag.password = false;		
		if(tips.length < 1){
			$('<span class="input-group-addon tips-danger js-password-tips" >密码长度应在6-20位间</span>').insertAfter(ele);		
		}
	}else{
		registerFlag.password = true;		
		if(tips.length > 0){//符合。清除提示
			tips.remove();
		}
	}	
})

//验证前后密码是否一致
$("#js-password-check").blur(function() {
	var pwdcheck = $("#js-password-check"),
		pwd = $("#js-register-password"),
		tips = $(".js-password-check-tips") ? $(".js-password-check-tips") : null;
	if(pwdcheck.val() === pwd.val()){//符合，清除提示
		registerFlag.checkPassword = true;		
		if(tips.length > 0){
			tips.remove();
		}
	}else{
		registerFlag.checkPassword = false;		
		if(tips.length < 1){//不符合
			$('<span class="input-group-addon tips-danger js-password-check-tips" >前后不一致</span>').insertAfter(pwdcheck)
		}
	}
})

//验证邮箱
$("#js-register-email").blur(function() {
	var email = $("#js-register-email"),
		tips = $(".js-email-tips"),
		reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	if(reg.test(email.val())){
		registerFlag.email = true;		
		if(tips.length > 0){
			tips.remove();
		}
	}else{
		registerFlag.email = false;		
		if(tips.length < 1){
			$('<span class="input-group-addon tips-danger js-email-tips" >请输入正确的邮箱</span>').insertAfter(email);
		}
	}
})

//刷新验证码,并清空验证本文以及提示
$("#js-captcha-img").click(function() {
	$(this).attr("src","php/captcha.php");
	var captcha = $("#js-captcha"),
		tips = $(".js-captcha-tips") ? $(".js-captcha-tips") : null;
	if(tips.length > 0){
		tips.remove();
	}
	captcha.val("");
})

//验证验证码
$("#js-captcha").bind("input propertychange", function() {
	var tips = $(".js-captcha-tips"),
		valuelen = $(this).val().trim().length,
		captcha = $("#js-captcha");
	if(valuelen !== 4){return};//输入不到4位，就return	
	$.ajax({
		type:"GET",
		url:"php/register.php?require=captcha&captchaStr=" + $("#js-captcha").val(),//require:captcha 来判断这个请求，captchaStrs储存用户输入的验证码
		dataType:"json",
		success:function(data) {
			registerFlag.captcha = true;
			if(data.success){
				if(tips.length > 0){
					tips.remove();
				}
			}else{					
				registerFlag.captcha = false;
				if(tips.length < 1){
					$('<span class="input-group-addon tips-danger js-captcha-tips">' +data.info+ '</span>').insertAfter(captcha);
				}
			}
		},		
	})	
})
$("input:radio[name = 'sex']").change(function() {
	var val=$('input:radio[name="sex"]:checked').val();
})

//检查用户是否已经同意注册协议，和隐私保护
	$("#register-agree").click(function() {
		if($("#register-agree").is(":checked")){
			$("#register-submit").attr({"disabled":false, "title":""});
		}else{
			$("#register-submit").attr({"disabled":true, "title":"请同意注册协议和隐私保护"});
		}		
	})
	
//确认注册，把表单信息提交后台进行注册
$("#register-submit").click(function() {
	//校验所有信息是否填写，否则不能点击，
	console.log(registerFlag);
	for(var option in registerFlag){
		if(registerFlag[option] == false){
			var tip = $(".tip-suspended-layer")[0];
			tip.style.display = "block";//显示悬浮提示层
			tip.classList.add("alert-danger");
			$(".tip-suspended-text").html("请检查表单，你有未填写的表单");
			tip.style.marginLeft = (-130) + "px"; // 让提示层居中
			setTimeout(function() {//3秒后隐藏提示层
				tip.style.display = "none";
				tip.classList.remove("alert-danger");
				tip.style.marginLeft = (0) + "px";
				$(".tip-suspended-text").html("");
			},3000)
			return;			
		}
	}
	$.ajax({
		type:"POST",
		url:"php/register.php",
		dataType:"json",
		data:{
			require:"register",   //请求类型
			account:$("#js-register-account").val(),  //账号
			password:$("#js-register-password").val(),//密码
			email:$("#js-register-email").val(),  //邮箱
			sex:$("input:radio[name='sex']:checked").val()//性别
		},
		success:function(data) {
			if(data.success){
			var tip = $(".tip-suspended-layer")[0];
			tip.style.display = "block";//显示悬浮提示层
			tip.classList.add("alert-success");
			$(".tip-suspended-text").html("注册成功！你是第" + data.number + "个注册用户");
			tip.style.marginLeft = (-130) + "px"; // 让提示层居中
			setTimeout(function() {//3秒后隐藏提示层
				tip.style.display = "none";
				tip.classList.remove("alert-success");
				tip.style.marginLeft = (0) + "px";
				$(".tip-suspended-text").html("");
				self.location = "login.html";
			},3000)
			}
		},
		
		error:function(jqXHR) {
			alert(jqXHR.status);
		}
	})
})

//判断登录页账号文本框是否有输入
$("#js-login-account").blur(function() {
	var ele = $("#js-login-account"), //输入框
		tips = $(".js-account-tips") ? $(".js-account-tips") : null,  //提示栏
		vallen = ele.val().length;//文本框长度，用于判断输入长度
	if(vallen == 0 && tips.length < 1){//提示没有输入
		$('<span class="input-group-addon tips-danger js-account-tips" >请输入账号</span>').insertAfter(ele);	
		return;	
	}else{
		tips.remove();
	}
})

//登陆
$("#login-submit").click(function() {
	if(!registerFlag.captcha){
		var captchaInput = $("#js-captcha");
		return;
	}
	function callback() {
		//判断记住密码有没有被勾选。有则账号密码记录到cookie中
		if($("#login-remender").is(":checked")){
	        addCookie("userName",$("#js-login-account").val(),30,"/");  
	        addCookie("userPass",$("#js-login-password").val(),30,"/");  
		}else{
			//如果没有勾选记住密码，就清除cookie
			deleteCookie("userName","/");
			deleteCookie("userPass","/");
		}		
	    $(".tip-suspended-layer").fadeIn();
		$(".tip-suspended-text").html("登录成功，即将转跳.").fadeIn();
	//	显示提示
		setTimeout(function() {
			//隐藏警告
			$(".tip-suspended-layer").fadeOut();		
			self.location = 'index.html';
		},2000)			
	}	
	//调用登录方法，并传送参数
	login($("#js-login-account").val(),$("#js-login-password").val(),callback);

	
//	$.ajax({
//		type:"POST",
//		url:"php/login_check.php",
//		dataType:"json",
//		data:{
//			require:"login",     //请求类型，登录
//			account: $("#js-login-account").val(),  //账号
//			password: $("#js-login-password").val() //密码
//		},
//		success:function(data) {

//				// 账号密码保存到cookie,用于下次访问时，直接登陆
//				if($("#login-remender").is(":checked")){
//			        addCookie("userName",$("#js-login-account").val(),30,"/");  
//			        addCookie("userPass",$("#js-login-password").val(),30,"/");  
//
//				}else{
//					//如果没有勾选记住密码，就清除cookie
//					deleteCookie("userName","/");
//					deleteCookie("userPass","/");
//				}
//				if(Storage){
//					//用sessionStorage存储用户uid，以及用户名，以判断当前登录用户
//					sessionStorage.nowLoginUid = data.uid;		
//					sessionStorage.nowLoginUsername = data.username;
//					console.log( "uid:" +　sessionStorage.nowLoginUid);
//					console.log("name:" +sessionStorage.nowLoginUsername);
//				}				
//		        $(".tip-suspended-layer").fadeIn();
//				$(".tip-suspended-text").html("登录成功，即将转跳").fadeIn();
////				显示警告
//				setTimeout(function() {
//					//隐藏警告
//					$(".tip-suspended-layer").fadeOut();
//					//页面转跳
//					self.location='index.html'; 
//				},2000)
//			}else{
//				$(".tip-suspended-layer").fadeIn();
//				$(".tip-suspended-text").html("<strong>"+ data.msg +"</strong>")
//			}								
//		},
//		error:function(jqXHR) {
//			// alert(jqXHR.status);
//			alert("错误");
//			alert(jqXHR.msg);
//		}
//	})		
})		

