(function (window) {
	function Progress($progressBar, $progressLine, $progressDot) {
		return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
	}
	Progress.prototype = {
		constructor: Progress,
		init: function ($progressBar, $progressLine, $progressDot) {
			this.$progressBar = $progressBar; 
			this.$progressLine = $progressLine;
			this.$progressDot = $progressDot;
		},
		isMove:false,
		progressClick:function(callBack){
			var $this = this; //谁调用这个方法，this就是谁，此时的this是progress 
			// 监听背景的点击
			this.$progressBar.click(function(event){
				// 获取背景默认距离窗口的位置
				var normalLeft = $(this).offset().left; // 此时的this是progressBar
				// 获取点击的位置距离窗口的位置
				var eventLeft = event.pageX;
				// 设置前景的宽度
				$this.$progressLine.css("width", eventLeft - normalLeft);
				// 设置小圆点的位置
				$this.$progressDot.css("left", eventLeft - normalLeft);
				
				// 计算进度条的比例
				var value = (eventLeft - normalLeft) / $(this).width();
				callBack(value);
			})
		},
		progressMove:function(callBack){
			var $this = this;
			// 获取背景距离窗口默认的位置
			var normalLeft = this.$progressBar.offset().left;
			var eventLeft; //点击的位置距离窗口的位置
			// 获取进度条的宽度
			var barWidth = this.$progressBar.width();
			// 1.监听鼠标的按下
			this.$progressBar.mousedown(function(){
				// 2.监听鼠标的移动
				$(document).mousemove(function(event){
					$this.isMove = true;
					// 获取点击的位置距离窗口的位置
					eventLeft = event.pageX;
					var offset = eventLeft - normalLeft;
					if (offset >= 0 && offset <= barWidth){
						// 设置前景的宽度
						$this.$progressLine.css("width", offset);
						$this.$progressDot.css("left", offset);
					}
					/* // 计算进度条的比例
					var value = (eventLeft - normalLeft) / $(this).width();;
					callBack(value); */
				})

			})
			// 3.监听鼠标的弹起
			$(document).mouseup(function () {
				$(document).off("mousemove");
				this.isMove=false;
				// 计算进度条的比例
				var value = (eventLeft - normalLeft) / $this.$progressBar.width();;
				callBack(value);
			})
		},
		setProgress:function(value){
			if(this.isMove) return;
			if(value < 0 || value > 100) return;
			this.$progressLine.css({
				width:value+"%"
			});
			this.$progressDot.css({
				left: value + "%"
			});
		}
	}
	Progress.prototype.init.prototype = Progress.prototype;
	window.Progress = Progress;
})(window);