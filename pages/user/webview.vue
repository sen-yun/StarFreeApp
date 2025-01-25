<template>
	<view>
	<view class="header" :style="[{height:CustomBar + 'px'}]">
		
		<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
			<view class="action">
				<text class="cuIcon-back" @tap="back"></text>
			</view>
			<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
				{{title}}
			</view>
			<view class="action">
				
			</view>
		</view>
	</view>
	
	<view :style="[{padding:CustomBar + 'px 10px 0px 10px'}]"></view>


		<view>
				<web-view :webview-styles="{ position: 'absolute', top: '15px' }" :src="fullUrl"></web-view>
			</view>
			
	</view>
</template>

<script> 
	export default {
		props: {
			url: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				showHeader: true,
				afterHeaderOpacity: 1,
				headerPosition: 'fixed',
				headerTop: null,
				statusTop: null,
				title: "",
				webviewStyles: {
					progress: false
				},
			}
		}, 
		onLoad(res) {
			var that = this;
			that.title = res.title;
			var name = res.name;
			var id = res.id;
			var cid = res.cid;
			var token = res.token;
			var url = res.url;
			that.fullUrl = url + '?name=' + name + '&id=' + id + '&cid=' + cid + '&token=' + token;
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>

<style>
</style>
