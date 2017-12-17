		var Li_carousel = function(option) {
			this.imgurls = option.imgurls;//图片路径
			this.hrefs = option.hrefs;//超链接路径，必须，没有请写#
			this.targetDom = option.targetDom;//容器
			this.callback =  typeof option.callbacks == "function" ? option.callback : false;//回调函数
			this.timer = null;//定时器
			this.timerSlide = null;
			this.timerY = null;
			this.timeSpan = option.timeSpan ? option.timeSpan : 3000;//播放时间间隔
			this.imglen = this.imgurls.length;//传入图片的数量
			this.controlPosition =option.controlPosition ? "li-control-position-" +　option.controlPosition : "li-control-position-middle";
				this.autoPlayIndex = 0;//自动轮播索引值
				this.toggle = option.toggleType && option.toggleType.toLowerCase() == "y" ? this.toggleY : this.toggleZ;//切换的形式 
				this.flag = true;				
				this.init();
			}
			
			Li_carousel.prototype = {
				init : function() {					
					this.renderImg();
					this.renderControl();
					this.mouse();
					this.autoPlay();
					this.setWidth();
					this.mouseOut();
					
				},
				//渲染图片
				renderImg : function(){
					var imgContainer = document.createElement("ul");
					var i = 0;
					imgContainer.className = "li-carousel-container";
					for(i; i < this.imglen; i++){
						var li = document.createElement("li");
						i == 0 ? li.className = "li-active-img":{};
						if(this.toggle === this.toggleZ){
							li.style.display = "none";
						}						
						var a = document.createElement("a");
						a.style.backgroundImage = "url('" + this.imgurls[i] + "')";
						a.href = this.hrefs[i];
						li.appendChild(a);   
						imgContainer.appendChild(li);						
					}
					this.targetDom.appendChild(imgContainer);
				},
				//渲染控制按钮
				renderControl : function() {
					var i = 0,
						ul = document.createElement("ul");
						ul.className = "li-control-bt " + this.controlPosition;

					for(i; i < this.imglen; i++){
						var bt = document.createElement("li");
						i == 0 ? bt.className = "li-active-bt" : {};
						ul.appendChild(bt);
					}
					this.targetDom.appendChild(ul);
					//判断是否middle，是就给他的marginLeft设置宽度负值的一半，达到居中效果。
					if(/middle/.test(this.controlPosition)){
						ul.style.marginLeft = -(ul.clientWidth / 2) + "px";
					}					
				},
				//鼠标悬停的逻辑，获取索引值，并clear定时器
				mouse : function() {
					var bts = document.querySelectorAll(".li-control-bt li"),
					i = 0,
					that = this;
					for(i; i < that.imglen; i++){					
						//闭包获取正确的索引值。
						(function(i){
							bts[i].onmouseover = function() {
								clearInterval(that.timerY);
								clearInterval(that.timer);
								that.autoPlayIndex = i;						
								that.toggle(i);
								that.btsToggle(i);
							}
						})(i);
					}
				},
				/*
				 * 鼠标移开按钮，恢复定时器
				 */
				mouseOut : function() {
					var bts = document.querySelectorAll(".li-control-bt li"),
					that = this,
					i = 0;
					for(i; i < this.imglen; i++){
						bts[i].onmouseout = function() {
							that.autoPlay();
						}
					}
				},
				/*
				 * 接受：索引值，数字
				 * 根据索引值，切换对应的项目类名
				 * */
				toggleZ : function(index) {
					//z
					var img = document.querySelectorAll(".li-carousel-container li"),
						imgSibilings = this.sibilings(img[index]),
						len = imgSibilings.length;				
					img[index].className = "li-active-img";	
//					this.btsToggle(index);
					for(var i = 0; i < len; i++) {
						imgSibilings[i].className = "";
					}					
				},
				toggleY : function(index) {
					//y
//					clearInterval(this.timerY);
					var bts = document.querySelectorAll(".li-control-bt li"),
						img = document.querySelectorAll(".li-carousel-container li");
						var domWidth = this.targetDom.clientWidth;
						this.slide(-(domWidth * index));
	
				},
				autoPlay : function() {
					window.clearInterval(this.timer);
					var that = this;
					this.timer = setInterval(function() {
						that.autoPlayIndex = ( that.autoPlayIndex + 1) % that.imglen;
						that.toggle(that.autoPlayIndex);	
						that.btsToggle(that.autoPlayIndex);
					},that.timeSpan)
				},
				slide : function(value) {
					window.clearInterval(this.timerSlide);
					var container = document.querySelector(".li-carousel-container"),
					that = this;
					console.log("自动" + this.autoPlayIndex);					
					if(this.autoPlayIndex == 0) {
						container.style.left = (this.targetDom.clientWidth) + "px";
					}
					this.timerSlide = setInterval(function() {
				        var speed=(value-container.offsetLeft)/5;				        
				       speed=speed>0?Math.ceil(speed):Math.floor(speed);
//				       console.log("off: " + container.offsetLeft + "value:" + value);
				        if(container.offsetLeft==value)
				        {				        	
				            window.clearInterval(that.timerSlide);
				        }
				        else{
				            container.style.left=container.offsetLeft+speed+'px';
				        }						
					},30)	
					
				},
				
				btsToggle : function(index) {
					var bts = document.querySelectorAll(".li-control-bt li"),
						btSibilings = this.sibilings(bts[index]),
						len = btSibilings.length;
					bts[index].className = "li-active-bt";
					for(var i = 0; i < len; i++) {
						btSibilings[i].className = "";
					}						
				},

				setWidth : function() {
					var width = this.targetDom.clientWidth;
					document.querySelector(".li-carousel-container").style.width = width * this.imglen + "px";
					var imgs = document.querySelectorAll(".li-carousel-container li");
					for(var i = 0; i < this.imglen; i++) {
						imgs[i].style.width = width + "px";
					}
				},
				/* 
				 * 返回节点的兄弟节点
				 * 接受 元素节点
				 * 返回 装有兄弟节点的数组
				 * */
				sibilings :function(dom){
					var child = dom.parentNode.childNodes;
					var sibilings = [],len = child.length;
					for(var i = 0; i < len; i++){
						if(child[i] != dom){
							sibilings.push(child[i]);
						}
					}
					return sibilings;					
				},

				//模拟事件
				trigger : function(elem,type) {
					if(document.createEvent){
						var event = document.createEvent("HTMLEvents");
						event.initEvent(type,true,false);
						console.log(elem)
						elem.dispatchEvent(event);
						
						
					}else{
						elem.fireEvent("on" + type);
					}
				}
			}