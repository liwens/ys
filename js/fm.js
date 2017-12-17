function fm($,window,document){
    function Music() {
        this._init();
    }

    Music.prototype = {

        _init: function() {
            var _this = this;
            //alert(_this.readChannel("channel_id"));
            this.dom();
            this.getSong(_this.readChannel("channel_id"));
            this.getChannel();
            this.bindEvent();
            this.voice();
            this.accordion();
        },
		
        dom: function() {
            this.w = $(window).innerWidth();
            this.h = $(window).innerHeight();
            this.play = true;
            this.player = $("#player");
            this.canNextPlay = true;
            this.$channel_title = $(".channel-title span");
            this.$lrc_main = $(".lrc-main");
        },
        
        bindEvent: function() {
            var _this = this;
            var controlPlay = false;
            var voiceOff = false;

            //播放暂停
            $(".item-play a").on("click", function() {
                $(".pause-mask").toggle();
                if (!controlPlay) {
                	$(".play-no").show();
                	$(".play-yes").hide();
                    _this.player[0].pause();
                    $(this).addClass("pause").removeClass('play');
                    controlPlay = !controlPlay;
                } else {
                	$(".play-no").hide();
                	$(".play-yes").show();
                    _this.player[0].play();
                    $(this).addClass("play").removeClass('pause');
                    controlPlay = !controlPlay;
                }
            });

            //自动播放
            this.player.on("ended", function() {
                console.log("播放完成");
                $(".item-next a").trigger("click");
            });

            //设置音量
            $(".voice-progress").on("click", function(e) {
                var x = e.pageX - $(this)[0].getBoundingClientRect().left;
                var percent = x / $(this).width()
                $(this).find("span").css({ width: percent * 100 + "%" });
                _this.player[0].volume = percent;
                _this.sendChannel("voice", percent);
            });

            //下一首
            $(".item-next a").on("click", function() {
                if (_this.canNextPlay) {
                    _this.getSong($(".channel-title").attr("data-channels"));
                }
            });

            //快进
            $(".song-progress").on("click", function(e) {
                var play = e.pageX - $(this)[0].getBoundingClientRect().left;
                var percent = play / $(this).width();
                $(this).find("span").css({ width: Math.floor(percent * 100) + "%" })
                var totalTime = _this.player[0].duration;
                _this.player[0].currentTime = Math.floor(percent * totalTime);
            });

            //静音
            $(".voice a").on("click", function() {
                if (!voiceOff) {
                    $(this).css({ backgroundPosition: "-708px 0" });
                    _this.player[0].muted = true;
                    voiceOff = !voiceOff;
                } else {
                    $(this).css({ backgroundPosition: "-684px 0" });
                    _this.player[0].muted = false;
                    voiceOff = !voiceOff;
                }
            });

            //切换播放界面
            $("#fm").css({
                height: _this.h
            });

            $(".btn-change").on("click", function() {
            	
                $(this).hide();
//              $(".fm-body").animate({ top: "-100%" });
//              $(".fm-channel").animate({ left: 0 });
				$(".fm-channel").slideToggle();
                $(".btn-back").show();
            });

            $(".btn-back").on("click", function() {
                $(this).hide();
                $(".fm-channel").slideToggle();
//              $(".fm-body").animate({ left: 0 });
//              $(".fm-channel").animate({ top: "100%" });
                $(".btn-change").show();
            })
        },

        //获取音乐
        getSong: function(channel) {
            var _this = this;
            _this.canNextPlay = false;
            $.ajax({
                url: "http://api.jirengu.com/fm/getSong.php",
                type: "get",
                dataType: "json",
                data: {
                    channel: channel || "public_shiguang_jingdianlaoge",
                    'version': 100,
                    type: "n",
                },
                success: function(data) {

                    var data = data.song[0];
                    _this.player.attr("src", data.url);
                    if (data.picture) {
                        $(".song-img img").attr("src", data.picture);
                    }

                    //设置音乐名称
                    $(".song-name").text(data.title);
                    //艺术家
                    $(".song-author").text(data.artist);

                    _this.$channel_title.text(_this.readChannel("channel_text") || "经典老歌");
                    _this.$channel_title.parent().attr("data-channels", _this.readChannel("channel_id") || "public_shiguang_jingdianlaoge");

                    document.title = data.title + " - " + data.artist + " - 正在播放";
                    //控制音乐相关;
                    _this.player.on("canplay", function() {
                        _this.canNextPlay = true;
                        //初始化音乐时间
                        var time = _this.player[0].duration;
                        var currentTime, mm, ss;
                        mm = Math.floor(time / 60);
                        mm = mm < 10 ? "0" + mm : mm;
                        ss = Math.floor(time % 60);
                        ss = ss < 10 ? "0" + ss : ss;
                        $(".total-time").text(mm + ":" + ss);
                    });

                    //获取歌词
                    _this.getLrc(data.sid);
                }
            });
        },

        //获取频道
        getChannel: function() {
            var _this = this;
            $.ajax({
                url: "http://api.jirengu.com/fm/getChannels.php",
                dataType: "json",
                success: function(data) {
                    var data = data.channels ? data.channels : [],
                        html = "",
                        num = 5,
                        length = data.length,
                        rows = Math.floor(length / 5); //8
                    //渲染频道列表
                    for (var k = 0; k < num; k++) {
                        html = "";
                        for (var i = rows * k; i < (rows * (k + 1)); i++) {
                            html += '<dd class="channel-dd" data-channels="' + data[i].channel_id + '">' + data[i].name + '</dd>';
                        }
                        $(".dl-" + k).append(html);
                    }

                    //选专辑
                    $(".channel-dd").click(function() {
                        var channels = $(this).attr("data-channels"),
                            text = $(this).text();
                        $(".channel-dd").removeClass('active').find("span").remove();
                        $(this).addClass('active').append("<span>");
                        _this.$channel_title.text(text).attr({ "data-channels": channels });
                        _this.getSong($(this).attr("data-channels"));
                        //存储频道信息
                        _this.sendChannel("channel_text", text);
                        _this.sendChannel("channel_id", channels);
                    });

                    //遍历默认频道
                    $(".channel-dd").each(function() {
                        console.log(_this.$channel_title.text());
                        if ($(this).text() == _this.$channel_title.text()) {
                            $(this).addClass('active').append($("<span>"));
                        }
                    })
                }
            })
        },

        //获取歌词
        getLrc: function(sid) {
            var _this = this;
            $.ajax({
                url: "http://api.jirengu.com/fm/getLyric.php",
                dataType: "json",
                data: {
                    sid: sid
                },
                success: function(data) {
                    _this.readLrc(data.lyric);

                    //播放进度
                    _this.player.off("timeupdate").on("timeupdate", function() {
                        var currentTime = _this.player[0].currentTime;
                        var time = _this.player[0].duration;
                        $(".progress-time").css({ width: Math.floor((currentTime / time) * 100) + '%' });
                        var mm = Math.floor(currentTime / 60);
                        var ss = Math.floor(currentTime % 60);
                        mm = mm < 10 ? "0" + mm : mm;
                        ss = ss < 10 ? "0" + ss : ss;
                        $(".play-time").text(mm + ":" + ss);
                        _this.lrcMove(currentTime);
                    });
                }
            })
        },

        //解析歌词
        readLrc: function(lrc) {
            this.$lrc_main.empty();
            var reg1 = /\[\d\d\:\d\d(\.|\:)\d\d\]/g,
                reg2 = /\[\w+\:/g,
                reg3 = /\]/g,
                ul = "<ul>",
                mm, ss;
            lrcArr = lrc.split("\n");
            for (var i = 0; i < lrcArr.length; i++) {
                mm = parseInt(lrcArr[i].slice(1, 3));
                ss = parseInt(lrcArr[i].slice(4, 6));
                if (isNaN(mm)) {
                    continue;
                }
                lrcArr[i] = lrcArr[i].replace(reg1, "");
                lrcArr[i] = lrcArr[i].replace(reg2, "");
                lrcArr[i] = lrcArr[i].replace(reg3, "");
                ul += '<li data-lrcs="' + (mm * 60 + ss) + '">' + lrcArr[i] + '</li>';
            }
            ul += "</ul>";
            this.$lrc_main.append(ul);
        },

        //歌词运动
        lrcMove: function(currentTime) {
            var _this = this;
            $(".lrc ul li").each(function(index, el) {
                var self = $(this);
                var time = Math.floor(_this.player[0].duration);
                if (Math.floor(currentTime) == $(this).attr("data-lrcs")) {
                    $(".lrc ul li").removeClass('active');
                    $(this).addClass("active");
                    if ($(this).index() >= 6 && (time - Math.floor(currentTime)) > 15) {
                        $(".lrc ul").animate({ top: -$(".lrc ul li").height() * (self.index() - 6) });
                    }
                }
            });
        },

        //本地存储；
        sendChannel: function(key, value) {
            localStorage.setItem(key, value);
        },

        //读取存储
        readChannel: function(key) {
            return localStorage.getItem(key);

        },

        //读取音量
        voice: function() {
            var percent = this.readChannel("voice");
            percent = percent && percent > 0 ? percent : 0.6;
            this.player[0].volume = percent;
            $(".voice-setting").css({ width: percent * 100 + "%" });
        },
        //频道手风琴
        accordion: function() {
	 		var dl = $(".fm-channels").find("dt");
			dl.on("click",function() {
					$(this).siblings("dd").slideDown();
					$(this).parent().siblings("dl").find("dd").slideUp();	
			})       	
        }
    }
    //生成一个实例
    new Music();
}