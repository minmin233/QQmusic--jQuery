$(function () {
	// 0.自定义滚动条
	$(".content_list").mCustomScrollbar();

	var $audio = $("audio");
	var player = new Player($audio);
	var lyric; // 歌词对象
	var progress;
	var voiceProgress;

	// 1.加载歌曲列表
	getPlayerList();
	function getPlayerList() {
		// 可以加载本地文件，也可以加载网络文件
		$.ajax({
			url: "./source/musiclist.json",
			dataType: "json",
			success: function (data) {
				player.musicLists = data;
				// 遍历获取到的数据创建每一条音乐
				$.each(data, function (index, ele) {
					var $item = createMusicItem(index, ele);
					var $musicList = $(".content_list ul");
					$musicList.append($item);
				});
				initMusicInfo(data[0]);
				initLyricInfo(data[0]);
			},
			error: function (e) {
				console.log(e);
			}
		});
	}

	// 2.初始化歌曲信息
	function initMusicInfo(music) {
		$(".song_info_pic img").attr("src", music.cover);
		$(".song_info_name a").text(music.name);
		$(".song_info_singer a").text(music.singer);
		$(".song_info_ablum a").text(music.ablum);

		$(".music_progress_name").text(music.name + " / " + music.singer);
		$(".music_progress_time").text("00:00 / " + music.time);

		$(".mask_bg").css("background", "url('" + music.cover + "')");
	}

	// 3.初始化歌词信息
	function initLyricInfo(music){
		lyric = new Lyric(music.link_lrc);
		var $lyricContainer = $(".song_lyric");
		// 清空上一首歌曲的歌词
		$lyricContainer.html("");
		lyric.loadLyric(function(){
			// 创建歌词列表
			$.each(lyric.lyrics,function(index,ele){
				var $item = $("<li>"+ ele +"</li>");
				$lyricContainer.append($item);
			})
		});
	}

	// 4.初始化进度条
	initProgres();
	function initProgres(){
		var $progressBar = $(".music_progress_bar");
		var $progressLine = $(".music_progress_line");
		var $progressDot = $(".music_progress_dot");
		progress = new Progress($progressBar, $progressLine, $progressDot);
		progress.progressClick(function (value) {
			player.musicSeekTo(value);
		});
		progress.progressMove(function (value) {
			player.musicSeekTo(value);
		});

		var $voiceBar = $(".music_voice_bar");
		var $voiceLine = $(".music_voice_line");
		var $voiceDot = $(".music_voice_dot");
		voiceProgress = new Progress($voiceBar, $voiceLine, $voiceDot);
		voiceProgress.progressClick(function (value) {
			player.musicVoiceSeekTo(value);
		});
		voiceProgress.progressMove(function (value) {
			player.musicVoiceSeekTo(value);
		});
	}
	
	// 5.初始化事件监听
	initEvents();
	function initEvents(){
		// 1.监听子菜单的移入移出事件
		$(".content_list").delegate(".list_music", "mouseenter", function () {
			// 显示子菜单
			$(this).find(".list_menu").stop().fadeIn(100);
			$(this).find(".list_time a").stop().fadeIn(100);
			// 隐藏时长
			$(this).find(".list_time span").stop().fadeOut(100);
		});
		$(".content_list").delegate(".list_music", "mouseleave", function () {
			// 隐藏子菜单
			$(this).find(".list_menu").stop().fadeOut(100);
			$(this).find(".list_time a").stop().fadeOut(100);
			// 显示时长
			$(this).find(".list_time span").stop().fadeIn(100);
		});

		// 2.监听复选框的点击事件
		$(".content_list").delegate(".list_check", "click", function () {
			$(this).toggleClass("list_checked");
		});

		var $musicPlay = $(".music_play"); // 底部播放按钮
		// 3.监听子菜单播放按钮的点击
		$(".content_list").delegate(".list_menu_play", "click", function () {
			var $music = $(this).parents(".list_music"); // 当前点击的音乐
			// 3.1.切换播放图标
			$(this).toggleClass("list_menu_play1");

			// 3.2.复原其他的播放图标
			$(this).parents(".list_music").siblings().find(".list_menu_play").removeClass("list_menu_play1");

			// 3.3.同步底部播放按钮
			if ($(this).attr("class").indexOf("list_menu_play1") != -1) {
				// 当前子菜单是播放状态
				$musicPlay.addClass("music_play1");
				// 让文字高亮
				$(this).parents(".list_music").find("div").css("color", "#fff");
				// 还原其他文字
				$(this).parents(".list_music").siblings().find("div").css("color", "rgba(255,255,255,0.5)");
			} else {
				// 当前子菜单不是播放状态
				$musicPlay.removeClass("music_play1");
				// 让文字不高亮
				$(this).parents(".list_music").find("div").css("color", "rgba(255,255,255,0.5)");
			}

			// 3.4.切换序号的状态
			$(this).parents(".list_music").find(".list_number").toggleClass("list_number1");
			// 3.4.还原其他序号的状态
			$(this).parents(".list_music").siblings().find(".list_number").removeClass("list_number1");

			// 3.5 播放音乐
			player.playMusic($music.get(0).index, $music.get(0).music);

			// 3.6 切换歌曲信息
			initMusicInfo($music.get(0).music);
			// 3.7 切换歌词信息
			initLyricInfo($music.get(0).music);
		})

		// 4.监听底部控制区域播放按钮的点击
		$musicPlay.click(function(){
			// 判断是否播放过音乐
			if(player.currentIndex == -1){
				// 没有播放过音乐
				$(".list_music").eq(0).find(".list_menu_play").trigger("click");
			} else {
				$(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
			}
		})
		// 5.监听底部控制区域上一首按钮的点击
		$(".music_pre").click(function () {
			$(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
		})
		// 6.监听底部控制区域下一首按钮的点击
		$(".music_next").click(function () {
			$(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
		})

		// 7.监听删除按钮的点击
		$(".content_list").delegate(".list_menu_del","click",function(){
			// 找到被点击的音乐
			var $item = $(this).parents(".list_music");
			// 判断删除的是否是当前正在播放的音乐
			if($item.get(0).index == player.currentIndex){
				$(".music_next").trigger("click");
			}
			$item.remove();
			player.changeMusicLists($item.get(0).index);
			// 重新排序
			$(".list_music").each(function(index,ele){
				ele.index = index;
				$(ele).find(".list_number").text(index + 1);
			})
		})

		// 8.监听播放的进度
		player.musicTimeUpdate(function (currentTime, duration, timeStr){
			// 同步时间
			$(".music_progress_time").text(timeStr);
			// 计算播放比例
			var value = (currentTime / duration) * 100;
			// 同步进度条
			// 在监听播放进度的时候会不断修改进度条，拖动的时候也不断修改进度条，冲突
			// 所以拖动的时候会一直回弹
			progress.setProgress(value);//小圆点不对 改样式 子绝父相

			// 实现歌词同步
			var index = lyric.currentIndex(currentTime);
			var $item = $(".song_lyric li").eq(index);
			$item.addClass("cur");
			$item.siblings().removeClass("cur");
			//歌词滚动
			if(index <= 2) return;
			$(".song_lyric").css({
				marginTop:((-index + 2) * 30)
			})
		})

		// 9.监听声音按钮的点击
		$(".music_voice_icon").click(function(){
			// 切换图标
			$(this).toggleClass("music_voice_icon1");
			// 声音切换
			if ($(this).attr("class").indexOf("music_voice_icon1") != -1){
				// 声音关闭
				player.musicVoiceSeekTo(0);
			} else{
				player.musicVoiceSeekTo(1);
			}
		});
		
	}

	// 定义一个方法创建一条音乐
	function createMusicItem(index, music){
		var $item = $(`<li class="list_music">
								<div class="list_check"><i></i></div>
								<div class="list_number">`+ (index+1) + `</div>
								<div class="list_name">`+ music.name +`
									<div class="list_menu">
										<a href="javascript:;" title="播放" class="list_menu_play"></a>
										<a href="javascript:;" title="添加"></a>
										<a href="javascript:;" title="下载"></a>
										<a href="javascript:;" title="分享"></a>
									</div>
								</div>
								<div class="list_singer">`+ music.singer +`</div>
								<div class="list_time">
									<span>` + music.time + `</span>
									<a href="javascript:;" title="删除" class="list_menu_del"></a>
								</div>
							</li>`);
		$item.get(0).index = index; // 拿到原生的li中歌曲的索引
		$item.get(0).music = music; // 拿到原生的li中的歌曲
		return $item;
	}

	
});