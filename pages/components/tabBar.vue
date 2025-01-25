<template>

	<view class="tabbar" :style="{'padding-bottom': paddingBottomHeight + 'upx'}">
		<view class="tabbar-operate-bg" :class="isPost?'show':''" @tap="isPost=false"></view>
		<view class="tabbar-operate" :class="isPost?'show':''">
			<view class="tabbar-operate-main padding-xl flex justify-center"
				style="width: 100%;display: flex; justify-content: center; align-items: flex-end;">
				<view class="text-white tn-flex-1" @tap="postSpace(1)" style="width: 110rpx; height: 110rpx;">
					<text
						style="display: inline-block; border-radius: 20rpx;  width: 100rpx;height: 100rpx;">
						<image src="../../static/page/square/photo.png" mode="widthFix">
					</text>
					<view>发帖</view>
				</view>


				<view class="text-white tn-flex-1" @tap="postSpace(5)"
					style="border-radius: 20rpx; width: 110rpx; height: 110rpx;">
					<text
						style="display: inline-block; border-radius: 20rpx;  width: 100rpx;height: 100rpx;">
						<image src="../../static/page/square/shop.png" mode="widthFix">

					</text>
					<view>商品</view>


					</image>
				</view>
			</view>
		</view>
		<block v-for="(item, index) in list" :key="index">

			<view class="tabbar-item animation-reverse" @tap="tabbarChange(item.path)">
				<image class="item-img" :src="item.icon_a" v-if="current == index"></image>
				<image class="item-img" :src="item.icon" v-else></image>
				<view class="item-name" :class="{'tabbarActive': current == index}" v-if="item.text">{{item.text}}
				</view>
			</view>
			<view class="tabbar-item addPost" v-if="index==1" @tap="isPost=!isPost">
				<view class="addPost-main">
					<view class="addPost-i">
						<text class="cuIcon-add"></text>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		localStorage
	} from '../../js_sdk/mp-storage/mp-storage/index.js'
	export default {

		props: {
			current: Number
		},
		data() {
			return {
				isPost: false,
				paddingBottomHeight: 0, //苹果X以上手机底部适配高度
				list: [{
					text: '首页',
					icon: '/static/tabbar/home.png', //未选中图标
					icon_a: '/static/tabbar/home_cur.png', //选中图片
					path: "/pages/home/home", //页面路径
				}, {
					text: '广场',
					icon: '/static/tabbar/square.png',
					icon_a: '/static/tabbar/square_cur.png',
					path: "/pages/home/square",
				}, {
					text: '消息',
					icon: '/static/tabbar/find.png',
					icon_a: '/static/tabbar/find_cur.png',
					path: '/pages/home/find',
				}, {
					text: '我的',
					icon: '/static/tabbar/user.png',
					icon_a: '/static/tabbar/user_cur.png',
					path: "/pages/home/user",
				}, ]
			};
		},
		created() {
			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
					model.forEach(item => {
						//适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
						if (res.model.indexOf(item) != -1 && res.model.indexOf('iPhone') != -1) {
							that.paddingBottomHeight = 40;
						}
					})
				}
			});
		},
		methods: {
			
			postSpace(type) {
				var that = this;
				if (type == 1) {
					uni.navigateTo({
						url: '/pages/user/post?isSpace=1'
					});
				} else if (type == 5) {
					uni.navigateTo({
						url: '/pages/user/addshop?isSpace=1'
					});
				} else {
					uni.navigateTo({
						url: '/pages/space/post?type=' + type
					});
				}


			},
			tabbarChange(path) {
				this.isPost = false;
				uni.switchTab({
					url: path
				})
			},
			toLink(text) {
				var that = this;

				if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
					uni.showToast({
						title: "请先登录哦",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: text
				});
			},
		}
	};
</script>

<style>
	.tabbarActive {
		color: #3cc9a4 !important;
	}

	.tabbar view {
		overflow: initial;
		display: block;
	}

	.tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 990;
		overflow: initial;
		display: block;
		width: 100%;
		height: 100upx;
		/* background-color: #ffffff; */
		/* border-top: solid 1px #f6f6f6; */
		box-sizing: border-box;
	}

	.tabbar-item {
		display: block;
		height: 100upx;
		float: left;
		background: #fff;
		width: calc(25% - 32upx);
		text-align: center;
		height: 100upx;
		overflow: hidden;
		border: none;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.tabbar-item .item-img {
		width: 46upx;
		height: 46upx;
		display: block;

		margin: 0 auto;
		margin-top: 10upx;
		text-align: center;
	}

	.tabbar-item .item-name {
		font-size: 24upx;
		margin-top: 4upx;
		color: grey;
	}

	.tabbar-item.addPost {
		width: 120upx;
		height: 120upx;
		padding: 0;
		position: relative;

		overflow: initial;
	}

	.tabbar-item.addPost .addPost-main {
		position: absolute;
		top: -30upx;
		background-color: #fff;
		width: 100%;
		height: 100%;
		padding: 10upx;
		border-radius: 50%;
		border: solid 1px #f9f9f9;
	}

	.addPost-i {
		background-color: #3cc9a4;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		line-height: 95upx;
		text-align: center;
		font-size: 70upx;
		color: #fff;
		font-weight: bold;
	}

	.tabbar-operate {
		position: fixed;
		z-index: -20;
		bottom: -200upx;
		width: 100%;
		left: 0;
		padding: 0upx 30upx;
		box-sizing: border-box;
		text-align: center;
		transition: 0.3s all;
	}

	.tabbar-operate.show {
		bottom: 140upx;
	}

	.tabbar-operate-main {
		width: 100%;
		height: 200upx;
		/* margin-bottom: 20upx; */
		/* border-radius: 40upx; */
		padding-top: 18upx;
		/* background: #fff; */
		/* box-shadow: 0px 0px 10upx rgba(0, 0, 0, 0.2); */
		overflow: hidden;
	}

	.tabbar-operate-main>view {
		width: 33.33%;
		float: left;
	}

	.tabbar-operate-main .index-sort-text {
		font-size: 28upx;
		font-weight: bold;
	}

	.tabbar-operate-bg {
		position: fixed;
		background-color: #000;
		width: 100%;
		height: 100vh;
		opacity: 0;
		z-index: -30;
		left: 0px;
		top: 0px;
		transition: 0.2s all;
		visibility: hidden;
	}

	.tabbar-operate-bg.show {
		opacity: 0.3;
		visibility: visible;
	}
</style>