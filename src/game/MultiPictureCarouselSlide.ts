class MultiPictureCarouselSlide extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	public lastBtn: eui.Button;

	public nextBtn: eui.Button;

	public scroller: eui.Scroller;

	public group: eui.Group;

	/**滚动项数量*/

	public itemNum: number;

	/**单个滚动项长度*/

	public itemSize: number;

	/**当前滚动到第几项 0表示第1项*/

	public curItemCount: number = 0;

	/**滚动时间*/

	public delayScroll: number = 250;

	/**触摸起始位置*/

	private touchStartPos: number;

	/**当前触摸位置和起始触摸位置距离*/

	private touchDist: number = 0;

	/**滚动中*/

	private bScrolling: Boolean = false;

	private avater: eui.Image[] =[];
	protected childrenCreated(): void {
		super.childrenCreated();


		for(let i = 1; i <= 22; i++){
			this.avater[i] = new eui.Image();
			this.avater[i].source = RES.getRes("601"+Util.PrefixInteger(i,2)+"_png");
			this.avater[i].width = 256;
			this.avater[i].height = 224;
			// this.avater[i].anchorOffsetX = this.avater[i].width *.5;
			// this.avater[i].anchorOffsetY = this.avater[i].height *.5;
			this.group.addChild(this.avater[i]);

		}

		//获得滚动数量

		this.itemNum = this.group.numChildren;

		//获得滚动的单个尺寸, 加上水平布局设置的间隙(6)
		
		this.itemSize = this.group.getChildAt(0).width + 6;

		//自定义滑动距离
		this.touchDist = 50;

		//允许拉到边界后回弹

		this.scroller.bounces = true;

		//调节滑动结束时滚出的速度。等于0时，没有滚动动画

		this.scroller.throwSpeed = 0;

		//监听ui事件改变

		//改变开始

		this.scroller.addEventListener(eui.UIEvent.CHANGE_START, this.onChangStarHandler, this);

		//改变结束

		this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this.onChangEndHandler, this);

		//监听点击事件

		this.nextBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scrollToNext, this);

		this.lastBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scrollTolast, this);
	}

	// 	通过代码获取和控制滚动的位置 ：

	// Scroller.viewport.scrollV 纵向滚动的位置
	// Scroller.viewport.scrollH 横向滚动的位置
	// Scroller.height 是滚动区域的高度，这个值是固定的
	// Scroller.viewport.contentHeight 是滚动内容的高度，这个值是固定的
	// 改变这2个值，就可以改变滚动的位置。

	//拖动开始

	private onChangStarHandler() {

		//滚动条的水平坐标起始点

		this.touchStartPos = this.scroller.viewport.scrollH;

	}

	//拖动结束

	private onChangEndHandler() {

		//防点击触发changeend

		if (this.touchStartPos == -1) {

			return;

		}

		//dict是拖动结束后的滚动条水平坐标减去拖动前的滚动条水平坐标

		let dict: number = this.scroller.viewport.scrollH - this.touchStartPos;

		if (dict > this.touchDist) {

			//播放下一个图片

			this.scrollToNext();

		} else if (dict < -this.touchDist) {

			//播放上一个图片

			this.scrollTolast();
 
		} else {
			this.scroller.viewport.scrollH = this.curItemCount * this.itemSize;
		}

		//防止dict=0也就是点击鼠标的时候,发生位移

		this.touchStartPos = -1;

	}

	//滑到下一项

	private scrollToNext() {

		let item: number = this.curItemCount;

		//是否是最后一项

		if (item < this.itemNum - 1) {

			item++;

		}

		this.scrollToItem(item);

	}

	//滑到上一项

	private scrollTolast() {

		var item: number = this.curItemCount;

		//是否是第一项

		if (item > 0) {

			item--;

		}

		this.scrollToItem(item);

	}

	private scrollToItem(item) {

		//如果是滚动中则直接跳出

		if (this.bScrolling) {

			return;

		}

		if (item >= 0 && item < this.itemNum) {

			//滑动中状态

			this.bScrolling = true;

			//更新滑动到了第几项

			this.curItemCount = item;

			//先删除滚动条的动画

			egret.Tween.removeTweens(this.scroller.viewport);

			//创建滚动条的新动画

			egret.Tween.get(this.scroller.viewport).to({ scrollH: item * this.itemSize, ease: egret.Ease.quadOut }, this.delayScroll);

			egret.Tween.get(this.scroller.viewport).wait(this.delayScroll).call(() => {

				this.bScrolling = false;

			})
		}
	}
}