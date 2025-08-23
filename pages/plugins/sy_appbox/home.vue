<template>
	<view class="user" :style="{'background-color':'#f6f6f6','min-height':'auto'}">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					软件库
				</view>
				<view class="action" style="font-size: 36rpx;">
					<text class="tn-icon-search header-icon" @tap="toSearch"></text>
					<text class="tn-icon-folder-upload margin-left-lg header-icon" @tap="toUpload"></text>
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<block v-if="isLoading==1">
		<view class="data-box bg-white">
			<swiper class="custom-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500"
				:circular="true" :radius="true" indicator-active-color="#ffffff" @change="swiperChange">
				<swiper-item v-for="(item, index) in appswiperList" :key="index" @click="swiperclick(index)">
					<view class="swiper-item">
						<view class="swiper-bg">
							<image class="bg-image" :src="item.url" mode="aspectFill"></image>
							<view class="dark-overlay"></view>
						</view>
						<view class="swiper-content">
							<view class="app-info">
								<image class="app-icon" :src="item.url" mode="aspectFill"></image>
								<view class="app-text">
									<text class="app-name">{{item.title}}</text>
									<view class="app-rating">
										<tn-rate v-model="item.scoreNum" :count="5" :allowHalf="true" :disabled="true"
											:size="28" activeColor="#57d1b1" inactiveColor="#cecece"
											activeIcon="star-fill" inactiveIcon="star" :gutter="10"></tn-rate>
									</view>
									<text class="app-desc">{{item.intro}}</text>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="bg-white" v-if="appTopOf==1">
			<view style="display: flex;justify-content: space-between;">
				<view style="padding: 20rpx;font-weight: bold">小编推荐</view>
			</view>
			<tn-scroll-list :indicator="true">
				<view class="tn-flex">
					<view class="tn-flex-1" v-for="(item, index) in appiconimg" :key="index"
						style="margin: 20rpx 10rpx 0rpx 10rpx;padding: 20rpx 10rpx;">
						<view class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center"
							style="width: 140rpx;" @tap="toAppInfo(item.id)">
							<view class="icon5__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur"
								:style="'background-image: url(' + item.logo + ')'" style="background-size:100% 100%;">
							</view>
							<view class="tn-color-black tn-text-center">
								<text class="tn-text-ellipsis tn-text-ellipsis2">{{item.name}}</text>
							</view>
							<view class="tn-color-black tn-text-center tn-margin-top-sm">
								<text class="down-button">立即下载</text>
							</view>
						</view>
					</view>
				</view>
			</tn-scroll-list>
		</view>

		<view class="bg-white margin-top-sm">
			<view class="filter-bar">
				<view class="filter-item" @tap="showOrderPicker">
					<text>{{orderText}}</text>
					<text class="cuIcon-unfold"></text>
				</view>
				<view class="filter-item" @tap="showTypeFilter">
					<text>{{typeText}}</text>
					<text class="cuIcon-unfold"></text>
				</view>
			</view>

			<block v-if="applist.length>0">
				<view class="loading-container" v-if="apploading">
					<u-loading mode="circle" size="36"></u-loading>
				</view>
				<block v-else>
					<view class="app-box" style="padding: 20rpx;" v-for="(item, index) in applist" :key="index">
						<view class="app-box-body" @tap="toAppInfo(item.id)">
							<view class="app-box-logo">
								<u-image :src="item.logo" width="110rpx" height="110rpx" mode="aspectFill"
									:lazy-load="true" :fade="true" duration="450" border-radius="28rpx">
									<u-loading slot="loading"></u-loading>
								</u-image>
							</view>
							<view class="app-box-content">
								<view class="app-box-title text-cut">{{item.name}}</view>
								<view class="app-box-info">
									<text :style="{color: item.tagInfo.color}"
										:class="item.score>=3?'tn-icon-star-fill':'tn-icon-star'"></text>
									<text :style="{color: item.tagInfo.color}">{{item.score}}</text>
									<text>{{item.size}}</text>
									<text>v{{item.version}}</text>
									<text :class="item.system=='ios'?'tn-icon-iphone':''"></text>
								</view>
								<view class="app-box-tags">
									<text class="app-tag"
										:style="{backgroundColor: item.tagInfo.color}">{{item.tagInfo.text}}</text>
									<text v-for="(category, idx) in item.sortJson" :key="idx"
										class="app-category-tag">{{category.name}}</text>
								</view>
							</view>
						</view>
						<view class="app-box-down" @tap="toAppInfo(item.id)">下载</view>
					</view>
				</block>
			</block>
			<block v-else>
				<view class="margin-top-sm">
					<u-empty text="暂无数据" mode="data" icon-size="100" font-size="24"></u-empty>
				</view>
			</block>

			<view class="load-more" @tap="loadMore" v-if="dataLoad&&applist.length>0">
				<text>{{moreText}}</text>
			</view>
		</view>
		</block>
		<u-picker v-model="showOrder" :show="showOrder" :columns="[orderOptions]" @confirm="confirmOrder"
			@cancel="cancelOrder" mode="selector" :range="orderOptions" range-key="text"></u-picker>

		<u-popup v-model="showType" mode="bottom" :mask-close-able="true" :safe-area-inset-bottom="true"
			@close="showType = false">
			<view class="filter-popup">
				<view class="filter-title">选择类型</view>
				<view class="filter-options">
					<view class="filter-option" v-for="(type, index) in typeOptions" :key="index"
						:class="{'active': selectedType === type.value}" @tap="selectType(type.value)">
						{{type.label}}
					</view>
				</view>
				<view class="filter-buttons">
					<view class="btn-reset" @tap="resetType">重置</view>
					<view class="btn-confirm" @tap="confirmType">确定</view>
				</view>
			</view>
		</u-popup>
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../../static/loading.gif"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		localStorage
	} from '../../../js_sdk/mp-storage/mp-storage/index.js'
	
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar: this.StatusBar + this.CustomBar,
				AppStyle: this.$store.state.AppStyle,
				userInfo: null,
				token: "",
				isLoading: 0,
				appswiperList: [],
				appiconimg: [],
				applist: [],
				appTopOf: 1,
				page: 1,
				apploading: false,
				dataLoad: true,
				moreText: "加载更多",
				isLoad: 0,

				showOrder: false,
				orderOptions: [{
					text: '最新投稿',
					value: 'created'
				},
				{
					text: '好评如潮',
					value: 'score'
				},
				{
					text: '讨论火热',
					value: 'commentsNum'
				},
				{
					text: '随便看看',
					value: 'random'
				}],
				selectedOrder: 'created',
				orderText: '最新投稿',

				showSystem: false,
				systemOptions: [
				{
					label: 'iOS',
					value: 'ios'
				}],
				selectedSystem: '',
				systemText: '系统',

				showType: false,
				typeOptions: [{
					label: '全部',
					value: ''
				},
				{
					label: '搬运',
					value: '1'
				},
				{
					label: '原创',
					value: '2'
				},
				{
					label: '金标',
					value: '3'
				},
				{
					label: '官方',
					value: '4'
				}],
				tagMap: {
					1: {
						text: '搬运',
						color: '#7c72ff'
					},
					2: {
						text: '原创',
						color: '#19be6b'
					},
					3: {
						text: '金标',
						color: '#ff6600'
					},
					4: {
						text: '官方',
						color: '#2979ff'
					}
				},
				selectedType: '',
				typeText: '类型'
			};
		},
		onPullDownRefresh() {
			var that = this;
			that.page = 1;
			that.isLoading = 0;
			that.getAppSwiperList();
			that.getTopAppList();
			that.getAppList();
			var timer = setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000)
		},
		onReachBottom() {
			var that = this;
			if (that.isLoad == 0) {
				that.loadMore();
			}
		},
		onShow() {
			
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			if (localStorage.getItem('userinfo')) {
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
			}
			if (localStorage.getItem('token')) {
			
				that.token = localStorage.getItem('token');
			}
			this.getAppSwiperList();
			this.getTopAppList();
			this.getAppList();
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			toSearch() {
				uni.navigateTo({
					url: '/pages/contents/search'
				});
			},
			toUpload() {
				if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
					uni.showToast({
						title: "请先登录哦",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: '/pages/plugins/sy_appbox/post'
				});
			},
			getAppSwiperList() {
				var that = this;
				var data = {
					isswiper: '1'
				};

				uni.request({
					url: that.$API.PluginLoad('sy_appbox'),
					data: {
						"action": "getAppList",
						"getapp_page": 1,
						"getapp_limit": 20,
						"getapp_order": "created",
						"getapp_if": JSON.stringify(that.$API.removeObjectEmptyKey(data))
					},
					method: 'GET',
					dataType: "json",
					success(res) {
						if (res.data.code == 200) {
							const list = res.data.data || [];
							that.appswiperList = list.map(item => {
								return {
									id: item.id,
									type: 'image',
									url: item.logo,
									title: item.name.length > 10 ? item.name.substring(0,10) + '...' : item.name,
									score: item.score,
									scoreNum: Number(item.score),
									intro: (item.versionInfo || '').length > 10 ? (item.versionInfo || '').substring(0,10) + '...' : (item.versionInfo || '')
								};
							});
							localStorage.setItem('appswiperList', JSON.stringify(that.appswiperList));
						}
						that.isLoading = 1;
					},
					fail(error) {
						console.log(error);
						uni.showToast({
							title: "网络开小差了",
							icon: 'none'
						});
						that.isLoading = 1;
					}
				});
			},
			getTopAppList() {
				var that = this;
				var data = {
					istop: '1'
				};
				uni.request({
					url: that.$API.PluginLoad('sy_appbox'),
					data: {
						"action": "getAppList",
						"getapp_page": 1,
						"getapp_limit": 10,
						"getapp_order": "created",
						"getapp_if": JSON.stringify(that.$API.removeObjectEmptyKey(data))
					},
					method: 'GET',
					dataType: "json",
					success(res) {
						if (res.data.code == 200) {
							that.appiconimg = res.data.data;
						}
					},
					fail(error) {
						console.log(error);
						uni.showToast({
							title: "网络开小差了",
							icon: 'none'
						});
					}
				});
			},
			getAppList(isPage) {
				var that = this;
				if (that.apploading) return;
				if (!isPage) {
					that.apppage = 1;
					that.dataLoad = true;
					that.apploading = true;
				}
				var page = that.page;
				if (isPage) {
					page++;
				}
				var data = {
					type: that.selectedType,
					system: that.selectedSystem,
				};
				uni.request({
					url: that.$API.PluginLoad('sy_appbox'),
					data: {
						"action": "getAppList",
						"getapp_page": page,
						"getapp_limit": 10,
						"getapp_order": that.selectedOrder,
						"getapp_if": JSON.stringify(that.$API.removeObjectEmptyKey(data))
					},
					method: 'GET',
					dataType: "json",
					success(res) {
						if (res.data.code == 200) {
							const data = res.data.data || [];
							const list = data.map(item => {
								return {
									...item,
									tagInfo: that.tagMap[item.type] || {
										text: '未知',
										color: '#999'
									},
									size: that.formatSize(item.size)
								};
							});
							that.isLoad = 0;
							if (isPage) {
								if (data.length < 1) {
									that.moreText = "没有更多数据了";
								}
								that.applist = [...that.applist, ...list];
								that.page = page;
							} else {
								that.applist = list;
								that.page = 1;
							}
						}
						that.apploading = false;
					},
					fail(error) {
						that.apploading = false;
						console.log(error);
						uni.showToast({
							title: "网络开小差了",
							icon: 'none'
						});
					}
				});
			},
			formatSize(size) {
				if (!size) {
					return '未知大小';
				}
				if (size >= 1024 * 1024) {
					return (size / (1024 * 1024)).toFixed(1) + 'Gb';
				} else if (size >= 1024) {
					return (size / 1024).toFixed(1) + 'Mb';
				} else {
					return size + 'Kb';
				}
			},
			loadMore() {
				this.moreText = "努力加载中...";
				this.isLoad = 1;
				this.getAppList(true);
			},
			showOrderPicker() {
				this.showOrder = true;
			},
			confirmOrder(e) {
				const selectedOption = this.orderOptions[e[0]];
				if (selectedOption) {
					this.selectedOrder = selectedOption.value;
					this.orderText = selectedOption.text;
					this.showOrder = false;
					this.page = 1;
					this.getAppList(false);
				}
			},
			cancelOrder() {
				this.showOrder = false;
			},
			showSystemFilter() {
				this.showSystem = true;
			},
			selectSystem(value) {
				this.selectedSystem = value;
			},
			resetSystem() {
				this.selectedSystem = '';
				this.systemText = '系统';
				this.showSystem = false;
				this.getAppList(false);
			},
			confirmSystem() {
				const option = this.systemOptions.find(item => item.value === this.selectedSystem);
				this.systemText = option ? option.label : '系统';
				this.showSystem = false;
				this.page = 1;
				this.getAppList(false);
			},
			showTypeFilter() {
				this.showType = true;
			},
			selectType(value) {
				this.selectedType = value;
			},
			resetType() {
				this.selectedType = '';
				this.typeText = '类型';
				this.showType = false;
				this.getAppList(false);
			},
			confirmType() {
				const option = this.typeOptions.find(item => item.value === this.selectedType);
				this.typeText = option ? option.label : '类型';
				this.showType = false;
				this.page = 1;
				this.getAppList(false);
			},
			toAppInfo(id) {
				uni.navigateTo({
					url: './info?id=' + id
				});
			},
			swiperclick(index) {
				const item = this.appswiperList[index];
				this.toAppInfo(item.id);
			},
			swiperChange(e) {
				this.current = e.detail.current;
			}
		},
	};
</script>

<style lang="scss" scoped>
	@import "styles/home.scss";

	.icon5__item--icon {
		width: 100rpx;
		height: 100rpx;
	}

	.down-button {
		border-radius: 40rpx;
		background-color: #3cc9a4;
		padding: 10rpx 20rpx;
		color: white;
		font-size: 24rpx;
	}

	.app-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.app-box-body {
		flex: 1;
		display: flex;
		margin-right: 20rpx;
		min-width: 0;
		align-items: center;
	}

	.app-box-logo {
		width: 110rpx;
		height: 110rpx;
		flex-shrink: 0;
	}

	.app-box-content {
		flex: 1;
		margin-left: 20rpx;
		min-width: 0;
	}

	.app-box-title {
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 8rpx;
		width: 400rpx;
	}

	.app-box-info {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 8rpx;

		text {
			margin-right: 10rpx;
		}
	}

	.app-box-down {
		background-color: #3cc9a4;
		color: #fff;
		padding: 10rpx 30rpx;
		border-radius: 100rpx;
		white-space: nowrap;
	}

	.app-box-tags {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		font-size: 28rpx;
	}

	.app-tag {
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		color: #ffffff;
		margin-right: 12rpx;
		font-size: 24rpx;
	}

	.app-category-tag {
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		background-color: #f5f5f5;
		color: #666666;
		margin-right: 12rpx;
		font-size: 24rpx;
	}

	.filter-bar {
		display: flex;
		padding: 20rpx;
		border-bottom: 1px solid #f5f5f5;
	}

	.filter-item {
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		color: #333;
	}

	.filter-item .cuIcon-unfold {
		margin-left: 4rpx;
		font-size: 24rpx;
		color: #999;
	}

	.filter-popup {
		background: #fff;
		padding: 30rpx;
		border-radius: 20rpx 20rpx 0 0;
	}

	.filter-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
	}

	.filter-options {
		display: flex;
		flex-wrap: wrap;
	}

	.filter-option {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 1px solid #eee;
		border-radius: 30rpx;
		margin: 0 20rpx 20rpx 0;
		font-size: 28rpx;

		&.active {
			background: #3cc9a4;
			color: #fff;
			border-color: #3cc9a4;
		}
	}

	.filter-buttons {
		display: flex;
		margin-top: 40rpx;
	}
	.tn-text-ellipsis2 {
		width: 140rpx; 
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}
	.btn-reset,
	.btn-confirm {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		margin: 0 20rpx;
		font-size: 30rpx;
	}

	.btn-reset {
		background: #f5f5f5;
		color: #666;
	}

	.btn-confirm {
		background: #3cc9a4;
		color: #fff;
	}

	.custom-swiper {
		height: 360rpx;
		margin: 20rpx;
		border-radius: 32rpx;
		overflow: hidden;

		.swiper-item {
			position: relative;
			width: 100%;
			height: 100%;
			border-radius: 32rpx;
			overflow: hidden;

			.swiper-bg {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;
				border-radius: 32rpx;

				.bg-image {
					position: absolute;
					top: -20%;
					left: -20%;
					width: 140%;
					height: 140%;
					filter: blur(5px);
					transform: scale(1.5);
					opacity: 0.8;
				}

				.dark-overlay {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%);
					border-radius: 32rpx;
					backdrop-filter: blur(5px);
				}
			}

			.swiper-content {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				padding: 40rpx;
				z-index: 1;

				.app-info {
					display: flex;
					align-items: center;

					.app-icon {
						width: 120rpx;
						height: 120rpx;
						border-radius: 24rpx;
						box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.3);
					}

					.app-text {
						margin-left: 24rpx;

						.app-name {
							display: block;
							font-size: 32rpx;
							font-weight: bold;
							color: #ffffff;
							margin-bottom: 8rpx;
							text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.4);
						}

						.app-desc {
							display: block;
							font-size: 24rpx;
							color: rgba(255,255,255,0.8);
							width: 400rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							text-shadow: 0 1rpx 4rpx rgba(0,0,0,0.2);
						}
					}
				}
			}
		}
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;
	}

	.load-more {
		text-align: center;
		padding: 20rpx 0;
		color: #999;
		font-size: 28rpx;
	}
</style>