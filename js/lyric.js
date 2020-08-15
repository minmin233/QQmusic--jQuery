(function (window) {
	function Lyric(path) {
		return new Lyric.prototype.init(path);
	}
	Lyric.prototype = {
		constructor: Lyric,
		init: function (path) {
			this.path = path;
		},
		times:[],// 保存时间
		lyrics:[],// 保存歌词
		index:-1,
		loadLyric:function(callBack){
			var $this = this;
			$.ajax({
				url: $this.path,
				dataType: "text",
				success: function (data) {
					$this.parseLyric(data);
					callBack();
				},
				error: function (e) {
					console.log(e);
				}
			})
		},
		parseLyric:function(data){
			var $this = this;
			// 清空上一首歌曲的歌词信息
			$this.times = [];
			$this.lyrics = [];
			var array = data.split("\n");
			var timeReg = /\[(\d*:\d*\.\d*)\]/;
				// 遍历取出每一条歌词
			$.each(array,function(index,ele){
				// 处理歌词
				var lrc = ele.split("]")[1];
				// 排除没有歌词的
				if(lrc.length <= 1) return true;
				$this.lyrics.push(lrc);

				// 用正则表达式匹配时间 [00:00.92]
				var res = timeReg.exec(ele);
				if(res == null) return true;
				var timeStr = res[1]; // 00:00.92
				var res1 = timeStr.split(":");
				var min = parseInt(res1[0]) * 60; // 分钟 - 秒
				var sec = parseFloat(res1[1]); // 秒
				var time = parseFloat(Number(min + sec).toFixed(2));// 保留两位小数
				$this.times.push(time);
			})
			/* console.log($this.lyrics);
			console.log($this.times); */
		},
		currentIndex:function(currentTime){
			console.log(currentTime);
			if(currentTime >= this.times[0]){
				this.index ++;
				this.times.shift(); // 删除数组最前面的一个元素
			}
			return this.index;
		}
	}
	Lyric.prototype.init.prototype = Lyric.prototype;
	window.Lyric = Lyric;
})(window);