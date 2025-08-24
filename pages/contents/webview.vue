<template>
	<view class="post" :style="{'background-color':'#f6f6f6','min-height':'auto'}">
		<view class="header" :style="[{height:CustomBar + 'px'},{top:jpHeight + 'px'}]">
			<view class="cu-bar" :class="'bg-white'" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px','background-color':'#ffffff'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					{{name}}
				</view>
				
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<web-view :src="url"  @message="onMessage"></web-view>
	</view>
</template>

<script>
	var wv;
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
				AppStyle:this.$store.state.AppStyle,
				showHeader:true,
				afterHeaderOpacity: 1,//不透明度
				headerPosition: 'fixed',
				headerTop:null,
				statusTop:null,
				url:'',
				name:'',
				curHeight:0,
				jpHeight:0,
				screenHeight:0,
				postheight:0,
				title: "",
				progress: false
				
			}
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		onShow(){
			var that = this;
			
		},
		onHide() {
			var that = this;
			clearInterval(that.editInterval);
			that.editInterval= null;
		},
		onLoad(res) {
			var that = this;
			that.title = res.title;
			var url=res.url;
			var name=res.name;
			var token=res.token;
			var type=res.type;
			that.name = name
			that.url=url+'&type='+type;
			// #ifdef APP-PLUS
			var currentWebview = that.$scope.$getAppWebview();
			that.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			setTimeout(function() {
				
			    wv = currentWebview.children()[0]
			    wv.setStyle({
					top:uni.getSystemInfoSync().statusBarHeight + 44 ,
					height:uni.getSystemInfoSync().windowHeight - 44 - uni.getSystemInfoSync().statusBarHeight,
				})
			}, 300); //如果是页面初始化调用时，需要延时一下
			// #endif
			
			
		},
		methods: {
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			onMessage(e) {
				var that = this;
				  if (e.detail.data[0].type == "back") {
					that.back();
				  }
			}
			
		
			
		}
	}
</script>

<style>
page{
	overflow: hidden;
}
.post{
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
}
</style>
