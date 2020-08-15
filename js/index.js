$(function () {
	// 0.自定义滚动条
	$(".content_list").mCustomScrollbar();
	// 1.监听子菜单的移入移出事件
	$(".content_list").delegate(".list_music","mouseenter",function(){
		// 显示子菜单
		$(this).find(".list_menu").stop().fadeIn(100);
		$(this).find(".list_time a").stop().fadeIn(100);
		// 隐藏时长
		$(this).find(".list_time span").stop().fadeOut(100);
	});
	$(".content_list").delegate(".list_music","mouseleave",function(){
		// 隐藏子菜单
		$(this).find(".list_menu").stop().fadeOut(100);
		$(this).find(".list_time a").stop().fadeOut(100);
		// 显示时长
		$(this).find(".list_time span").stop().fadeIn(100);
	});

	// 2.监听复选框的点击事件
	$(".content_list").delegate(".list_check","click",function(){
		$(this).toggleClass("list_checked");
	});

	// 添加子菜单播放按钮的监听
	var $musicPlay = $(".music_play");
	// 点击播放按钮
	$(".content_list").delegate(".list_menu_play","click",function(){
		var $music = $(this).parents(".list_music"); // 当前点击的音乐
		// console.log($music.get(0).index);
		// console.log($music.get(0).music);

		// 1.切换播放图标
		$(this).toggleClass("list_menu_play1");
		// 2.复原其他的播放图标
		$(this).parents(".list_music").siblings().find(".list_menu_play").removeClass("list_menu_play1");
		// 3.同步底部播放按钮
		if ($(this).attr("class").indexOf("list_menu_play1") != -1){
			// 当前子菜单是播放状态
			$musicPlay.addClass("music_play1");
			// 让文字高亮
			$(this).parents(".list_music").find("div").css("color","#fff");
			// 还原其他文字
			$(this).parents(".list_music").siblings().find("div").css("color", "rgba(255,255,255,0.5)");
		}else{
			// 当前子菜单不是播放状态
			$musicPlay.removeClass("music_play1");
			// 让文字不高亮
			$(this).parents(".list_music").find("div").css("color", "rgba(255,255,255,0.5)");
		}
		// 4.切换序号的状态
		$(this).parents(".list_music").find(".list_number").toggleClass("list_number1");
		// 4.还原其他序号的状态
		$(this).parents(".list_music").siblings().find(".list_number").removeClass("list_number1");

		// 5.播放歌曲
		playMusic($music.get(0).index, $music.get(0).music);
		
	})

	// 播放歌曲
	var $audio = $("audio"); // jq对象
	var audio = $audio.get(0); // 原生DOM
	function playMusic(index, music) {
		if (this.currentIndex == index) {
			// 同一首音乐
			if (audio.paused) {
				audio.play();

			} else {
				audio.pause();
			}
		} else {
			// 不是同一首
			$audio.attr("src", music.link_url);
			audio.play();
			this.currentIndex = index;
		}
	}

	// 加载歌曲列表
	getPlayerList();
	function getPlayerList(){
		// 可以加载本地文件，也可以加载网络文件
		$.ajax({
			url:"./source/musiclist.json",
			dataType:"json",
			success:function(data){
				// 遍历获取到的数据创建每一条音乐
				$.each(data,function(index,ele){
					var $item = createMusicItem(index,ele);
					var $musicList = $(".content_list ul");
					$musicList.append($item);
				})
			},
			error:function(e){
				console.log(e);
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
									<a href="javascript:;" title="删除"></a>
								</div>
							</li>`);
		$item.get(0).index = index; // 拿到原生的li中歌曲的索引
		$item.get(0).music = music; // 拿到原生的li中的歌曲
		return $item;
	}
});