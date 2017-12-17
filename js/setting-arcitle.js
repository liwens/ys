//if(!checkLogin()){
//	return;
//}
//检查是否有登录
checkLogin()
/*加载头像*/
$(".setting-head-img img").attr('src',sessionStorage.userAvaterUrl);//侧栏头像
$("#headImg").attr('src',sessionStorage.userAvaterUrl);//头部导航条头像	

//我的帖子页，内容加载
$(function(){
    var counter = 0;
    // 每页展示4个
    var num = 4;
    var pageStart = 0,pageEnd = 0;
    var uid = sessionStorage.nowLoginUid;
    // dropload
    $('.js-myArticle').dropload({
        scrollArea : window,
        distance : 0,
        loadDownFn : function(me){
            $.ajax({
                type: 'GET',
                url: 'php/require_content.php?uid=' + uid,
//				url:"json/content.json",        
                dataType: 'json',
                success: function(data){
                	if(data.lists.length == 0){
                		$('.js-myArticle').html("没有数据，快去发布心声吧");
                		return;
                	}
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
												'<div class="article-delete" title="删除文章" data-aid="'+data.lists[i].aid +'">' +
													'<span class="iconfont icon-x1"></span>' +														
												'</div>' +	
												'<div class="article-preview-comment" data-aid="' + data.lists[i].aid + '">' +
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
                        $('.myArticle-lists').append(result);
                        // 每次数据加载完，必须重置
                        me.resetload();
                        //点赞的逻辑
//                      articleLick();
                        //评论的逻辑
                        comment();
                        //显示地图的逻辑
                        hoverShowMap();
                    	deleteArticle();
                    	preventActive("article-preview-dianzan");
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
});

//响应式导航条切换
mobileMenuToggle();

	settingcommentTop()
//设置页 滚动滚轮，评论区的高度设置
function settingcommentTop() {
		//获取屏幕宽度，小屏不需要控制评论区top值
	var bodyWidth = $(document).width();
	if(bodyWidth > 768){
		//首页 滚动滚轮，评论区的高度设置
		$(window).scroll(function() {
			var  h2 = $(".page-header").height(),						
				s = $(document).scrollTop(),
				head = $(".header"),
				headHight = $(".header").height();
			if(s < 130 - headHight){
				$(".index-article-comment").css("top",( 130 -$(document).scrollTop() +40));
			}else{
				$(".index-article-comment").css("top",headHight + 5);
			}			
		})		
	}
}

//点击删除文章按钮，传送aid到后台来删除对应文章
function deleteArticle() {
	$(".article-delete").on("click",function(event) {
		var that = $(this);
		var aid = $(this).attr("data-aid");
		$.ajax({
			type : "GET",
			dataType : "json",
			url : "php/delete_article.php?require=deleteArticle&deleteAid=" + aid,
			success : function() {
				alert("删除成功");
				that.parents(".article-term").remove();
			},
			error : function() {
			alert("删除文章出问题了，稍后再试");
			}
		})
	})
}


//$(".js-myCommentBt").on("click",function() {
//	loadMyComment();
//})
////请求我 评论过的文章 
//function loadMyComment() {
////	$(".js-myCommentBt").on("click",function() {
//	    var counter = 0;
//	    // 每页展示4个
//	    var num = 4;
//	    var pageStart = 0,pageEnd = 0;
//	    var uid = sessionStorage.nowLoginUid;
//	    // dropload
//	    $('.js-myArticle').dropload({
//	        scrollArea : window,
//	        distance : 0,
//	        loadDownFn : function(me){
//	            $.ajax({
//	                type: 'GET',
//		            url: 'php/myComment.php?uid=' + uid, 
//	                dataType: 'json',
//	                success: function(data){
//	                    var result = '';
//	                    counter++;
//	                    pageEnd = num * counter;
//	                    pageStart = pageEnd - num;
//	                    for(var i = pageStart; i < pageEnd; i++){
//	                        result +=  '<div class="article-term" data-username='+data.lists[i].username+'>' +
//			                        		'<div class="article-preview-top">' +
//			                        		'<img src="' + data.lists[i].avatarUrl + '" alt="" class="article-header-img"/>' +
//											'<span class="article-preview-username">'+data.lists[i].username+'</span>' +
//											'<span class="article-preview-time">'+getDateDiff(data.lists[i].time)+'</span>' +
//										'</div>'+							
//										'<div class="article-preview-content">' + data.lists[i].content + '</div>' +
//										'<hr />' +
//										'<div class="article-preview-bottom">' + 
//											'<div class="article-bottom-container">' +
//												'<a href="javascript:;" class="dingwei js-dingwei" data-latlng="'+ data.lists[i].site_latlng+'"><i class="iconfont icon-dingwei"></i>'+data.lists[i].site+'</a>' +						
//												'<div class="interaction">' + 
//													'<div class="article-preview-comment" data-aid="' + data.lists[i].aid + '">' +
//														'<i class="iconfont icon-pinglun1"></i>' +
//														'<span class="article-preview-comment-num">'+data.lists[i].comment+'</span>' +
//													'</div>' +
//													
//													'<div class="article-preview-dianzan" data-checked="no">' +	
//														'<i class="iconfont icon-dianzan-copy"></i>' +
//														'<span class="article-preview-dianzan-num">'+data.lists[i].zan+'</span>' +
//													'</div>' +						
//												'</div>' +
//											'</div>'	 +
//										'</div>' +					
//									'</div>';
//	                                    
//	                        if((i + 1) >= data.lists.length){
//	                            // 锁定
//	                            me.lock();
//	                            // 无数据
//	                            me.noData();
//	                            break;
//	                        }
//	                    }
//	                    //为了测试，延迟1秒加载
//	                    setTimeout(function(){
//	                        $('.myComment-lists').append(result);
//	                        // 每次数据加载完，必须重置
//	                        me.resetload();
//	                        //点赞的逻辑
//	                       	articleLick();
//	                        //评论的逻辑
//	                        comment();
//	                        //显示地图的逻辑
//	                        hoverShowMap();
//	                    },1000);
//	                },
//	                error: function(xhr, type){
//	                    alert('Ajax error!');
//	                    // 即使加载出错，也得重置				
//	                    me.resetload();
//	                }
//	            });
//	        }
//	    });	
////	})	
//}

//我的帖子，禁止点赞
//接受 类名  字符串  必须
function preventActive(ele) {
	$("."+ele).on("click",function() {
		alert("不可以给自己点赞哦！(´･ω･`)")
	})
}

