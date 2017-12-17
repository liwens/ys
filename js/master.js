//记录头像是否
sessionStorage.avatarChange = false;

//互动的提醒数量
sessionStorage.interactiveMsgNum = 0;

//系统提醒的数量
sessionStorage.systemMsgNum = 0;


//记录发帖模块是否被打开的标记，避免重复生成地图
sessionStorage.publishLoadMapSign = "false";

//读取cookie，自动登录
function autoLogin() {
	//判断是否有登陆
	//没有登录的情况,nowLoginUid 没有存储为undefined ,但本地存有cookie，才会自动登录。
	if(sessionStorage.nowLoginUid == undefined && getCookieValue("userName")){
		var userName = getCookieValue("userName");
			userPass = getCookieValue("userPass");
			console.log(unescape(userName))
		if(userName != undefined && userPass != undefined){
			login(unescape(userName),userPass,callback);
			function callback(img) {
				$("#headImg").attr("src",sessionStorage.userAvaterUrl);	
				$(".header-login").addClass("hidden");
				$(".header-login-ed").removeClass("hidden");
			}		
		}	
	}
	//没有nowLoginUid,也没有cookie, 啥也不干
	else if(sessionStorage.nowLoginUid == undefined && !getCookieValue("userName")){}
	//已经登录，更新页面信息
	else{		
		$("#headImg").attr("src",sessionStorage.userAvaterUrl);
		$(".header-login").addClass("hidden");
		$(".header-login-ed").removeClass("hidden");		
	}
	if(sessionStorage.avatarChange == true) {
		$("#headImg").attr("src",sessionStorage.userAvaterUrl);
	}
}


//检测是否有登陆，没有登陆就转跳到登录页
//如果没有登录，就会返回false,否则返回true
function checkLogin(){
	//没有登录的情况
	console.log(sessionStorage.nowLoginUid);
	if(sessionStorage.nowLoginUid == undefined) {
		$(".tip-suspended-layer").fadeIn();
		$(".tip-suspended-text").html("请登录");
		setTimeout(function() {
			self.location = "login.html";
			$(".tip-suspended-layer").fadeOut();
			$(".tip-suspended-text").html("");
		},3000);	
//		return false;
		returnValue = false;
	}else{
		return true;
	}
}

	var editor = null;
//PC端生成文本编辑器
function createEditor() {

	loadEditorJSFile();
	function loadEditorJSFile() {
		var bodyWidth = document.documentElement.clientWidth;
		if(bodyWidth > 768){
			$.getScript("js/wangEditor.js",function() {
				wangEditor.config.mapAk = 'hCBcm8H8opRLdC0f6OibbGavC0pne1uc';
				//调用编辑器
				editor = new wangEditor('editorBody');
			     editor.config.menus = $.map(wangEditor.config.menus, function(item, key) {
			          if (item === 'insertcode') {//清除代码输入
			              return null;
			          }
			          if (item === 'fullscreen') {//清除全屏
			              return null;
			          }
			          return item;
			      });		
			      editor.config.uploadImgUrl = 'php/publishImg.php';
			     editor.config.uploadParams = {
					require:"publish_img"
			    };
			    editor.config.mapAk = "hCBcm8H8opRLdC0f6OibbGavC0pne1uc";					   
				editor.create();	
			})					
		}
	}
}

//首页帖子类型的显示和隐藏
function toggleType() {
	$(".toggle-type").on("click",function() {
		$(".index-main-nav").slideToggle();
	})
}

//show.bs.modal 这是bootstrap的模态框打开事件，当模态框打开就会触发。
//打开模态框后，定位并加载百度地图
function openPublishModal() {
	$("#publish").on("show.bs.modal",function() {
		//检查是否登录
		if(!checkLogin()){
			return;
		}
		$(this).css({
			width:"auto",
			//模态框居中
			 'margin-left':function() {
		                        return -($(this).find(".modal-content").width() / 2);
		                   }		
		});  
		if(sessionStorage.publishLoadMapSign == "false"){
			$(".map-container").css("visibility","hidden");
			//使用百度地图api获取经纬度，并转成详细的地址
			getsite("site","mapshow");			
		}
	})
}

/* 下拉栏方法
 *接受 ：targeteEle:要绑定目标对象   必须 jquery对象
 * 		dropdownEle:显示下拉栏ele  必须 jquey对象
 * 		event: 事件，必须 字符串 如 click
 * 		callback可选
 * */
function headDropdown(targetEle,dropdownEle,event,callback) {
	targetEle.on(event,function(e) {
//		e.preventDefault();
		dropdownEle.slideToggle("fast");
		dropdownEle.bind("mouseleave",function() {
			$(this).slideUp()
		})
		//判断回调函数是否存在
		if(typeof(callback) == "function") {
			callback();
		}
	});	
}


//获取地址，更新dom
//接受：地名类名，地图容器id,
var getsite = function(siteNameClass,targetID){
	var map = new BMap.Map(targetID);
	var point = new BMap.Point(116.331398,39.897445);
	map.centerAndZoom(point,15);
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		console.log(r)
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			var mk = new BMap.Marker(r.point);
			map.addOverlay(mk);
			map.panTo(r.point);
			mk.enableDragging();//标注可拖拽
			var str = "当前位置";
			mk.setTitle(("title","标注可拖拽"));
			map.enableScrollWheelZoom(true);		
			//为标注添加拖拽监听事件，
			//标注拖拽后，过去标注的位置，并更新内容
			mk.addEventListener("dragend",function dragend() {
				var p = mk.getPosition();       //获取marker的位置
				updateSiteName(siteNameClass,p);//更新地址名称
			})
			
			$(".map-container").css({"display":"none","visibility":"visible"});
			var latlon = r.point.lat+','+r.point.lng;

		    var url = "http://api.map.baidu.com/geocoder/v2/?ak=hCBcm8H8opRLdC0f6OibbGavC0pne1uc&callback=renderReverse&location="+latlon+"&output=json&pois=0";   
		    $.ajax({    
		        type: "GET",    
		        dataType: "jsonp",    
		        url: url,   
		        beforeSend: function(){   
		            $("."+siteNameClass).html('正在定位...');   
		        },   
		        success: function (json) { 
		        	console.log(json);
		        	//将经纬度以dataset形式写在模态框的地址处。
		        	 $("."+siteNameClass).html(json.result.formatted_address).attr("data-latlng",json.result.location.lat+", "+json.result.location.lng);
		        },   
		        error: function (XMLHttpRequest, textStatus, errorThrown) {    
            $("."+siteNameClass).html(latlon+"地址位置获取失败,错误信息:XMLHttpRequest:"+XMLHttpRequest + " textStatus:" + " errorThrown:" +errorThrown);    
		        }   
		    })		
		    sessionStorage.publishLoadMapSign = "true";
		}else if(this.getStats() == BMAP_STATUS_UNKNOWN_LOCATION){
			alert("定位结果未知");
		}else if(this.getStats() == BMAP_STATUS_PERMISSION_DENIED){
			alert("定位没有权限");
		}else if(this.getStats() == BMAP_STATUS_SERVICE_UNAVAILABLE){
			alert("服务不可用");
		}else if(this.getStats() == BMAP_STATUS_TIMEOUT){
			alert("定位超时");
		}else {
			alert('failed'+this.getStatus());
		}        
	},{enableHighAccuracy: true})	
}


//更新地图，
//siteNameEle:位置名字的元素，position：位置信息
function updateSiteName(siteNameEle,position){
	 var latlon = position.lat + "," + position.lng;
	 var url = "http://api.map.baidu.com/geocoder/v2/?ak=hCBcm8H8opRLdC0f6OibbGavC0pne1uc&callback=renderReverse&location="+latlon+"&output=json&pois=0";  
 	 $.ajax({    
        type: "GET",    
        dataType: "jsonp",    
        url: url,   
        beforeSend: function(){   
            $("."+siteNameEle).html('正在定位...');   
        },   
        success: function (json) { 
        	console.log(json);
        	$("."+siteNameEle).html(json.result.formatted_address).attr("data-latlng",json.result.location.lat+", "+json.result.location.lng);
        	 
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {    
            $("."+siteNameEle).html(latlon+"地址位置获取失败"+"XMLHttpRequest:"+XMLHttpRequest + " textStatus:" + " errorThrown:" +errorThrown);    
        }   
	})
}

//点击确认发帖按钮时，发帖
function publish() {
	$(".public-submit").bind("click",function() {
		var data = {
			requeir : "publish",  //请求说明。
		 	content : editor.$txt.html(),      			//正文内容
			type : $("#publish-title-type").attr("data-titletype") || "t1",// 类型
			sitename : $(".site").text(),				// 定位地名
			site_latlng : $(".site").attr("data-latlng"),//经纬度
			uid : sessionStorage.nowLoginUid               //用户uid
		}
	//	if(data.content == "");
	 	 $.ajax({    
	        type: "POST",    
	        dataType: "json",    
	        url: "php/publish.php",  
	        data:data,
	        success:function(data) {
	        	if(data.success){
	        		//pc端发帖
	        		if($(document).width() > 768){
						$(".tip-suspended-layer").fadeIn();
						$(".tip-suspended-text").html(data.info);
						setTimeout(function() {
							$(".tip-suspended-layer").fadeOut();
							$(".tip-suspended-text").html("");
							//关闭模态框
							$("#publish").modal("hide");
						},2000)	
							//将返回的数据。更新页面。。。
							var textContent = publishTextTemplet(data);
							$(".lists").prepend(textContent);							     
	                        articleLick();
	                        //评论的逻辑
	                        comment();
	                        //显示地图的逻辑
	                        hoverShowMap();							
	        		}else{
	        			//移动端发帖成功跳转到首页
	        			alert("发布成功！准备跳转到首页")
	        			self.location = "index.html";
	        			
	        		}
	
		        }else{
					$(".tip-suspended-layer").fadeIn();
					$(".tip-suspended-text").html(data.info);
					setTimeout(function() {
						$(".tip-suspended-layer").fadeOut();
						$(".tip-suspended-text").html("");
					},2000)	        		
		        }
		    },
		    error:function(error){
		    	alert("发布失败");
		    	alert(error);
		    }
		})
	})
}

//发布内容模板
//接收数据对象，返回拼接好的字符串
function publishTextTemplet(data) {
	var len = data.lists.length,
		i = 0,
		textContent = "";
	for(i; i < len; i++) {
        textContent +=  '<div class="article-term" data-aid= "' + data.lists[i].aid + '" data-username='+data.lists[i].username+'>' +
                		'<div class="article-preview-top">' +
                		'<img src="' + data.lists[i].avatarUrl + '" alt="" class="article-header-img"/>' +
						'<span class="article-preview-username">'+data.lists[i].username+'</span>' +
						'<span class="article-preview-time">'+ getDateDiff(data.lists[i].time)+'</span>' +
					'</div>'+							
					'<div class="article-preview-content">' + data.lists[i].content + '</div>' +
					'<hr />' +
					'<div class="article-preview-bottom">' + 
						'<div class="article-bottom-container">' +
							'<a href="javascript:;" class="dingwei js-dingwei" data-latlng="'+ data.lists[i].site_latlng+'"><i class="iconfont icon-dingwei"></i>'+data.lists[i].site+'</a>' +						
							'<div class="interaction">' + 
								'<div class="article-preview-comment">' +
									'<i class="iconfont icon-pinglun1"></i>' +
									'<span class="article-preview-comment-num">'+data.lists[i].comment+'</span>' +
								'</div>' +
								'<div class="article-preview-dianzan" data-checked="no">' +	
									'<i class="iconfont icon-dianzan-copy"></i>' +
									'<span class="article-preview-dianzan-num">'+data.lists[i].zan+'</span>' +
								'</div>' +									
							'</div>' +
						'</div>'	 +
					'</div>' +					
				'</div>';		
	}
	return textContent;
}

//发帖模块，地图显示隐藏
function publishMapHide() {
	$(".site").on("click",function() {
		$(".map-container").slideToggle();
	})	
}

//发帖模块，标签切换
function publishTabSwitch(){
	$(".publish-title-dropdown-menu>li>a").on("click",function() {
		$("#publish-title-type").html($(this).text()).attr("data-titleType",$(this).attr("data-titleType"));
	})	
}



//定位地名不准，手动输入的逻辑
function handReviseSiteName() {
	$("#js-site-change-bt").on("click",function() {
		var flag = $(this).attr("data-flag"),
			site = $(".site"),
			input = $(".js-site-change-input");
		if(flag == 0){
			site.css("display","none");
			input.css("display","inline-block").val(site.text());
			latlng = site.attr("data-latlng");
			$(this).attr("data-flag","1");
		}else{
			site.html(input.val()).css("display","inline-block");
			input.val("").css("display","none");
			$(this).attr("data-flag","0");
		}
	})
}

//首页的内容加载
function indexLoadContent(articleType){
    var counter = 0;
    // 每页展示4个
    var num = 4;
    var pageStart = 0,pageEnd = 0;
    //清空列表内容

    $(".index-article-preview").html("").append("<div class='lists'></div>");
    // dropload
    $('.index-article-preview').dropload({
        scrollArea : window,
//      distance : 500,
        loadDownFn : function(me){
            $.ajax({
                type: 'GET',
                url: 'php/require_content.php?require=content&type='+articleType,            
                dataType: 'json',
                success: function(data){
                	console.dir(data)
                    var result = '';
                    counter++;
                    pageEnd = num * counter;
                    pageStart = pageEnd - num;
                    for(var i = pageStart; i < pageEnd; i++){
                        result +=  '<div class="article-term" data-username='+data.lists[i].username+'>' +
		                        		'<div class="article-preview-top">' +
		                        		'<img src="' + data.lists[i].avatarUrl + '" alt="" class="article-header-img"/>' +
										'<span class="article-preview-username">'+data.lists[i].username+'</span>' +
										'<span class="article-preview-time">'+getDateDiff(data.lists[i].time)+'</span>' +
									'</div>'+							
									'<div class="article-preview-content">' + data.lists[i].content + '</div>' +
									'<hr />' +
									'<div class="article-preview-bottom">' + 
										'<div class="article-bottom-container">' +
											'<a href="javascript:;" class="dingwei js-dingwei" data-latlng="'+ data.lists[i].site_latlng+'"><i class="iconfont icon-dingwei"></i>'+data.lists[i].site+'</a>' +						
											'<div class="interaction">' + 
												'<div class="article-preview-comment" data-aid= "' + data.lists[i].aid + '">' +
													'<i class="iconfont icon-pinglun1"></i>' +
													'<em class="article-preview-comment-num">'+data.lists[i].comment+'</em>' +
												'</div>' +
												'<div class="article-preview-dianzan" data-checked="no" data-aid= "' + data.lists[i].aid + '">' +	
													'<i class="iconfont icon-dianzan-copy"></i>' +
													'<em class="article-preview-dianzan-num">'+data.lists[i].zan+'</em>' +
												'</div>' +									
											'</div>' +
										'</div>'	 +
									'</div>' +					
								'</div>';
                                    
                        if((i + 1) >= data.lists.length){
                            // 锁定
                            me.lock();
                            // 无数据
                            me.noData();
                            break;
                        }
                    }
                    //为了测试，延迟1秒加载
                    setTimeout(function(){
                        $('.lists').append(result);
                       $(":root").css("overflow","visible");
                       $("body").css("overflow","visible");
//						document.body.style = "overflow:visible";
                        // 每次数据加载完，必须重置
                        me.resetload();
                        //点赞的逻辑
                        articleLick();
                        //评论的逻辑
                        comment();
                        //显示地图的逻辑
                        hoverShowMap();
                    },1000);
                },
                error: function(xhr, type){
                    alert('Ajax error!');
                    // 即使加载出错，也得重置				
                    me.resetload();
                }
            });
        }
    });
}


//根据滚轮值，动态设置评论区的top值
function setcommentTop() {
	//获取屏幕宽度，小屏不需要控制评论区top值
	var bodyWidth = $(document).width(),
		banner = $(".indexBanner").height(),
		head = $(".header"),
		headHight = head.height();
		//首页 滚动滚轮，评论区的高度设置
		$(window).scroll(function() {
			var s = $(document).scrollTop();
			var tab = $(".index-main").height();	
			if(bodyWidth > 768){
				if(s < banner + tab - headHight){
					head.addClass("header-opacity");
					$(".index-article-comment").css("top",( banner + tab -$(document).scrollTop() + 10));
				}else{
					head.removeClass("header-opacity");
					$(".index-article-comment").css("top",headHight + 5);
				}	
			}else if(bodyWidth < 768) {
				if(s > (banner -headHight)){
					head.removeClass("header-opacity");
				}else{
					head.addClass("header-opacity");
				}
			}
		})		

}

//文章的点赞
function articleLick() {
	$(".article-preview-dianzan").on("click",function(){
		if(!checkLogin()){
			return;
		}
		var that = $(this);	
		
		//获取文章aid
		if($(this).attr("data-checked") == "yes"){ return};
		var thisAid = $(this).attr("data-aid");
		console.log($(this).parentsUntil(".lists"))
		$.ajax({
			type:"get",
			dataType:"json",
			url:"php/article_like.php?require=articleLike&aid="+thisAid+"&uid="+sessionStorage.nowLoginUid,
			success:function(data) {
				if(data.success){
					that.find(".article-preview-dianzan-num").html(data.lick_num)
						   .end().addClass("highlight-color").attr("data-checked","yes");						   
				}
			}
		})
	});
}


//点击评论按钮的逻辑
function comment() {
	console.log($(".article-preview-comment"))
	$(".article-preview-comment").on("click",function() {	
		var bodyWidth =  document.documentElement.clientWidth,
//			aid = $(this).parentsUntil($(".lists"))[3].getAttribute("data-aid");
			aid = $(this).attr("data-aid");
			//记录当前点击评论按钮的文章aid，
			sessionStorage.nowClickAid = aid;
		if(bodyWidth < 768) {
			//如果宽度小于768，将不再执行下面的代码，而转跳到手机评论页
			self.location  = "mobile_comment.html";
			mobileCommentLoading();
			return;
		}
		
		var username = $(this).parentsUntil($(".lists"))[3].getAttribute("data-username");		
		//输入框可用
		$("#comment-input").attr({"placeholder":"回复：" + username, "disabled":false});
		
		//发送评论方法
		sendComment(aid);
		
		//加载内容
		require_comment(aid);
	})
}


//发送评论，由comment() 调用。
//接受aid， 字符串  必须
function sendComment(aid) {
	var input = $("#comment-input"),
		bt = $(".js-send-comment-bt"),
		showArea = $(".index-article-comment-area"),
		uid = sessionStorage.nowLoginUid,
		name = sessionStorage.nowLoginUsername;
	//解绑
	$(".js-send-comment-bt").off();
	//绑定点击事件
	bt.on("click",function() {
		//如果为空，不发送
		if(input.val()==""){
			alert("输入不能为空");
			return;
		}		
		$.ajax({
			type:"post",
			dataType:"json",
			url:"php/send_comment.php",
			data:{
				require:"send_comment",
				aid : aid,//文章id
				uid : uid,//用户uid
				username : name, //用户名
				content : input.val(), // 回复内容				
			},
			beforeSend: function () {
                bt.button("发送中");
        	},
			success:function(data) {
				console.log(data)
				if(data.success){
			    	var result =
			    	'<div class="comment-item" >' +
			    		'<img src="' + data.lists[0].comment_user_avatar + '" alt="" class="comment-avatar"/>' +		    		
			    		'<div class="comment-details">' + 
			    			'<div class="comment-details-head">' + 
			    				'<div class="comment-username">'+ data.lists[0].comment_username+'</div>' +
			    				'<div class="comment-time">'+ getDateDiff(data.lists[0].comment_time) +'</div>' +
			    				'<div class="comment-floor">' + data.lists[0].comment_floor +'F</div>' +
			    			'</div>' +
			    			'<div class="comment-content">' + data.lists[0].comment_content + '</div>' +
			    			'<div class="comment-like" data-comment-id="'+data.lists[0].comment_id+'">' +
			    				'<i class="iconfont icon-dianzan-copy"></i>支持' +
			    				'<em class="comment-like-num">' + data.lists[0].comment_lick_num + '</em>'+
			    			'</div>' +
			    		'</div>' +
			    	'</div>';
					showArea.prepend(result);
					//调用点赞
					commentLike();
				}
			}			
		})
	})
}


//评论点赞。
function commentLike() {
	$(".comment-like").on("click",function() {
		var commentId = $(this).attr("data-comment-id");
		console.log(commentId);
		var that = $(this);
		if($(this).attr("data-clicked") == "yes") {return};
		$.ajax({
			type:"GET",
			dataType:"json",
			url:"php/comment_like.php?require=comment_like&comment_id="+commentId+"&uid="+sessionStorage.nowLoginUid, 		
			success:function(data) {
				if(data.success){
//					$(".comment-like-num").html("(" + data.commentLikeNum + ")");
					that.find(".comment-like-num").html("(" + data.commentLikeNum + ")")
						.end().addClass("highlight-color").attr("data-clicked","yes");	
				}
			},
		    error:function(error){
		    	alert("评论点赞失败");
		    	alert(error);
		    }
		})
	})
}

//加载评论内容由comment（）  调用
function require_comment(aid) {
	$.ajax({
		type:"GET",		
		dataType:"json",
		url:"php/require_comment.php?require=require_comment&aid="+aid,
//			url:"js/json/comment.json",	
		success:function(data) {
//			if(data.success){
				var i = 0,
					len = data.lists.length,
					result = "";
				for(i; i < len; i++){
			    	result +=
			    	'<div class="comment-item" >' +
			    		'<img src="' + data.lists[i].comment_user_avatar + '" alt="" class="comment-avatar"/>' +		    		
			    		'<div class="comment-details">' + 
			    			'<div class="comment-details-head">' + 
			    				'<div class="comment-username">'+ data.lists[i].comment_username+'</div>' +
			    				'<div class="comment-time">'+ getDateDiff(data.lists[i].comment_time) +'</div>' +
			    				'<div class="comment-floor">' + data.lists[i].comment_floor +'F</div>' +
			    			'</div>' +
			    			'<div class="comment-content">' + data.lists[i].comment_content + '</div>' +
			    			'<div class="comment-like" data-comment-id="'+data.lists[i].comment_id+'">' +
			    				'<i class="iconfont icon-dianzan-copy"></i>支持' +
			    				'<em class="comment-like-num">(' + data.lists[i].comment_lick_num + ')</em>'+
			    			'</div>' +
			    		'</div>' +
			    	'</div>';						
				}
				//更新评论区dom
				$(".index-article-comment-area").html(result);
				commentLike();
//			}else{
//				alert("加载评论失败");
//			}
		}
	});
}



//帖子地址处悬浮鼠标，显示地图
function hoverShowMap() {
	$(".article-preview-bottom").on("mousemove",function(event) {
		//获取定位地名的元素
		var sitecon = $(this).find(".js-dingwei");
		var site_latlng = sitecon[0].getAttribute("data-latlng");
		var cut = site_latlng.indexOf(",");
		//纬度
		var site_lat = Number(site_latlng.substring(0,cut));
		//经度
		var site_lng = Number(site_latlng.substring(cut+1,site_latlng.length-1));
		
			//x最小点：left 值
			//x最大点：top 值
			//y最小点 ：left + width;
			//y最大点： top + height;
		pos = {
			xMin : getElementLeft(sitecon[0]),
			yMin : getElementTop(sitecon[0]),
			xMax: getElementLeft(sitecon[0]) + sitecon[0].clientWidth,
			yMax : getElementTop(sitecon[0]) + sitecon[0].clientHeight
		}
		if(event.pageX > pos.xMin && event.pageX < pos.xMax){
			//范围在X和Y坐标之间。显示地图展示层
			if(event.pageY > pos.yMin && event.pageY < pos.yMax){
				//显示地图并设置位置。
				$(".article-map-container").show().css({"left":(event.pageX - 66) + "px","top":event.pageY+"px"})
				if($(".article-map-container").attr("data-created") == "false"){
					//调用createMap 生成地图
					createMap("article-map-show",site_lng, site_lat,function() {
						$(".article-map-container").attr("data-created","true");
					});					
				}				
				
			}else{
				//符合X范围，但不在Y坐标范围，隐藏地图展示层	
				$(".article-map-container").hide().attr("data-created","false");
			}		
		}else{
				//不在X坐标范围。也不再Y坐标范围，隐藏地图展示层	
				$(".article-map-container").hide().attr("data-created","false");			
		}
		
		//网页元素的绝对位置，指该元素的左上角相对于整张网页左上角的坐标。这个绝对位置要通过计算才能得到。
		//首先，每个元素都有offsetTop和offsetLeft属性，表示该元素的左上角与父容器（offsetParent对象） 
		//左上角的距离。所以，只需要将这两个值进行累加，就可以得到该元素的绝对坐标。
		//来自阮一峰博客  http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html
		
		
		function getElementLeft(element) {
			var actualLeft = element.offsetLeft;
			var current = element.offsetParent;
			while (current !== null){
				actualLeft += current.offsetLeft;
				current = current.offsetParent;
			}
			return actualLeft;
		}
		function getElementTop(element){
			var actualTop = element.offsetTop;
			var current = element.offsetParent;
			while (current !== null){
				actualTop += current.offsetTop;	
				current = current.offsetParent;	
			}
			return actualTop;
		}
	})
}

/*
 * 生成地图，要先在页面引入百度地图ak，否则无效。
 * 参数：container 地图容器id 必须，id字符串
 * 	 	 latlng： 经纬度， 必须，字符串
 * 返回值：无
 * */
function createMap(containerID, site_lng, site_lat,callback) {
	var map = new BMap.Map(containerID);      // 创建Map实例
	var point = new BMap.Point(site_lng, site_lat); // 创建点坐标
    map.centerAndZoom(point,15);                 // 初始化地图,设置中心点坐标和地图级别。
    var marker = new BMap.Marker(point);  // 创建标注
    map.addOverlay(marker);               // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放	
    if(typeof(callback) == "function") {
    	callback();
    }
}


//转换时间，几小时前，几分钟前。超过1天前的，直接原样返回
//接受 时间字符串 
function getDateDiff(dateTimeStamp){
	console.log(dateTimeStamp);
	var strtime = dateTimeStamp;
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;	
	var now = new Date().getTime();
	//Date.parse 把字符串转换为时间戳
	var diffValue = now - Date.parse(dateTimeStamp);
	if(diffValue < 0){
	 //若日期不符则弹出窗口告之
	 //alert("结束日期不能小于开始日期！");
	 }
		var monthC =diffValue/month;
		var weekC =diffValue/(7*day);
		var dayC =diffValue/day;
		var hourC =diffValue/hour;
		var minC =diffValue/minute;
	if(monthC>=1){
		result = strtime;
	 }
	 else if(weekC>=1){
		result = strtime;
	 }
	 else if(dayC>=1){
		 result=parseInt(dayC) +"天前";
	 }
	 else if(hourC>=1){
		 result=parseInt(hourC) +"小时前";
	 }
	 else if(minC>=1){
		 result=parseInt(minC) +"分钟前";
	 }else
		 result="刚刚";
	return result;
}		

//keys名，kesy值，存储天数，路径(可以用斜杠)
function addCookie(name,value,days,path){
	var name = escape(name);
	var value = escape(value);
	var expires = new Date();
	//以毫秒为单位，+ 1小时360万毫秒，* 24小时为1天
	expires.setTime(expires.getTime() + days * 3600000 * 24);
	//path=/，表示cookie能在整个网站下使用，path=/temp，表示cookie只能在temp目录下使用  
	path = path == "" ? "" :";path=" + path;
	//GMT(Greenwich Mean Time)是格林尼治平时，现在的标准时间，协调世界时是UTC  
    //参数days只能是数字型  
    var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();
    document.cookie = name + "=" + value + _expires + path; 
}

/**获取cookie的值，根据cookie的键获取值**/  
// 查询并返回cookie的值
function getCookieValue(name){  
    //用处理字符串的方式查找到key对应value  
    var name = escape(name);  
    //读cookie属性，这将返回文档的所有cookie  
    var allcookies = document.cookie;         
    //查找名为name的cookie的开始位置  
    name += "=";  
    var pos = allcookies.indexOf(name);      
    //如果找到了具有该名字的cookie，那么提取并使用它的值  
    if (pos != -1){                                             //如果pos值为-1则说明搜索"version="失败  
        var start = pos + name.length;                  //cookie值开始的位置  
        var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie  
        var value = allcookies.substring(start,end); //提取cookie的值  
        return (value);                           //对它解码        
    }else{  //搜索失败，返回空字符串  
        return false;  
    }  
} 

/**根据cookie的键，删除cookie，其实就是设置其失效**/ 
function deleteCookie(name,path){    
    var name = escape(name);  
    var expires = new Date(0);  
    path = path == "" ? "" : ";path=" + path;
    document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;  
}


/*
 * 登录函数
 * 接受 username 用户名， userpass：密码类型都为字符串,callback :回调函数
 * 返回 无
 * */
function login(username,userpass,callback) {
//	var callback = callback;
	$.ajax({
		type:"POST",
		url:"php/login_check.php",
		dataType:"json",
		data:{
			require:"login",     //请求类型，登录
			account : username,  //账号
			password: userpass//密码
		},
		success:function(data) {
			if(data.success == true){
				// 账号密码保存到cookie,用于下次访问时，直接登陆
				if(Storage){
					//用sessionStorage存储用户uid，以及用户名，以判断当前登录用户
					sessionStorage.nowLoginUid = data.uid;		
					sessionStorage.nowLoginUsername = data.username;		
					sessionStorage.userAvaterUrl = data.avatarUrl;
					//设置提醒数量
					sessionStorage.systemMsgNum = data.systemMsgNum;
					sessionStorage.interactiveMsgNum = data.interactiveMsgNum;
					//更新提示数量，显示或隐藏呼吸灯
					setBreathMsg();					

					callback();
					//缓存头像
//					(function(url, callback) { 
//						userAvatar = new Image(); //创建一个Image对象，实现图片的预下载 
//						userAvatar.src = url; 
//						userAvaterH = userAvatar;
//						console.log(userAvatar);
//						if (userAvatar.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数 
//							callback(userAvatar); 
////							sessionStorage.nowLoginUsername = userAvatar.src;
//
//							alert("缓存过，不需加载");
//							return; // 直接返回，不用再处理onload事件 
//						} 
//						userAvatar.onload = function () { //图片下载完毕时异步调用callback函数。 
////							callback.call(img);//将回调函数的this替换为Image对象 
//							callback(userAvatar); 
//							sessionStorage.nowLoginUsername = userAvatar.src;
//							alert("加载完毕")
//						}; 
//					})(data.avatarUrl,callback); 
				}	
				console.log("已登录：" +sessionStorage.nowLoginUsername);
				//执行回调函数
				if(typeof(callback) == "function") {
					callback();
				};
			}else{
				$(".tip-suspended-layer").fadeIn();
				$(".tip-suspended-text").html("<strong>"+ data.info +"</strong>");
				setTimeout(function() {
					$(".tip-suspended-layer").fadeOut();
				},2000)
			}
			
		},
		error:function(jqXHR) {
			return (jqXHR.msg);
		}
	})		
}

function IndexmobileMenuToggle() {
	//响应式导航条切换
	$(".js-menu-xs-bt").on("click",function() {
		$(".js-menu-xs").slideToggle();
		if($(".header").hasClass("header-opacity")){
			$(".header").removeClass("header-opacity");
		}else{
			$(".header").addClass("header-opacity");
		}		
		$(this).find("i").toggleClass("menu-bt-checked");
	})
}

function mobileMenuToggle(){
	$(".js-menu-xs-bt").on("click",function() {
		$(".js-menu-xs").slideToggle();
		$(this).find("i").toggleClass("menu-bt-checked");
	})
}

/* 各页头部用户信息处 触发下拉 开始*/
//提醒，下拉条
headDropdown($("#js-header-remind-a, .header-remind"),$("#js-header-remind"),"click");

//个人信息 下拉栏
headDropdown($(".js-header-avatar"),$(".userinfo"),"click",function callback(){
	$(".userinfo-name").html(sessionStorage.nowLoginUsername);
	$(".userinfo-avatar").attr("src",sessionStorage.userAvaterUrl);
	//点击退出账号的逻辑
	$(".userinfo-exit").on("click",function exit() {
		//删除sessionStorage信息
		sessionStorage.removeItem("userAvaterUrl");
		sessionStorage.removeItem("nowLoginUid");
		sessionStorage.removeItem("nowLoginUsername");
		//切换头部信息
		$(".header-login").removeClass("hidden");
		$(".header-login-ed").addClass("hidden");
		deleteCookie("userName","/");
		deleteCookie("userPass","/");
	})
})

/* 各页头部用户信息处 触发下拉 结束*/


//显示提醒呼吸灯，并设置提醒数字
function setBreathMsg() {
	var interNum = sessionStorage.interactiveMsgNum;
	var sysNum = sessionStorage.systemMsgNum;
	console.log(interNum);
//	显示呼吸灯
	if(interNum > 0 || sysNum >0){
		$(".breath").addClass("show");
	}else{
		$(".breath").removeClass("show");
		return;
	}
	if(interNum > 0) {
		$(".interactive-reminder-num").html("(" + interNum + ")");
	}else{
		$(".interactive-reminder-num").html("");
	}
	if(sysNum > 0) {
		$(".system-reminder-num").html(sysNum);
	}else{
		$(".system-reminder-num").html("");
	}
}


