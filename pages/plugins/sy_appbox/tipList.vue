<template>
	<view class="user" :style="{'background-color':'#f6f6f6','min-height':'auto'}">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					应用打赏记录
				</view>
				<view class="action">
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>

		<view class="cu-list menu-avatar userList" style="margin-top: 20upx;">
			<view class="no-data" v-if="userList.length==0">
				<text class="cuIcon-text"></text>暂时没有数据
			</view>
			<view class="cu-item" v-for="(item,index) in userList" :key="index">
				<view class="cu-avatar round lg" :style="item.style"></view>
				<view class="content">
					<view class="text-grey">
						<text class="text-black text-bold">{{item.userInfo.name}}</text>
						<text class="margin-left-sm">
							打赏了
							<text class="text-red">{{item.num}}</text>
							{{currencyName}}
						</text>
						<!--  #ifdef H5 || APP-PLUS -->
						<block v-if="item.isvip>0">
							<block v-if="item.vip==1">
								<text class="isVIP bg-gradual-red">VIP</text>
							</block>
							<block v-else>
								<text class="isVIP bg-yellow">VIP</text>
							</block>
						</block>
						<!--  #endif -->
					</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut">
							<text class="text-gray">{{formatDate(item.created)}}</text>
						</view>
					</view>
				</view>
				<view class="action goUserIndex" @tap="toUserContents(item.userInfo)">
					<view class="cu-btn bg-gradual-orange" style="font-size: 26upx;height: 55upx;border-radius: 100upx;">主页</view>
				</view>
			</view>
			<view class="load-more" @tap="loadMore" v-if="hasMore">
				<text>{{moreText}}</text>
			</view>
		</view>
		
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../../static/loading.gif"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { localStorage } from '../../../js_sdk/mp-storage/mp-storage/index.js'
	
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar: this.StatusBar + this.CustomBar,
				AppStyle: this.$store.state.AppStyle,
				userList: [],
				page: 1,
				limit: 15,
				moreText: "加载更多",
				isLoad: 0,
				isLoading: 0,
				hasMore: true,
				currencyName: "",
				aid: 0
			}
		},
		onPullDownRefresh() {
			this.page = 1;
			this.getUserList(false);
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			if (this.hasMore && !this.isLoad) {
				this.loadMore();
			}
		},
		onLoad(options) {
			if (options.id) {
				this.aid = options.id;
				this.getUserList(false);
			}
			this.getSystemConfig();
		},
		methods: {
			// 获取系统配置
			getSystemConfig() {
				this.$Net.request({
					url: this.$API.SMset(),
					method: 'GET',
					success: (res) => {
						this.currencyName = res.data.assetsname;
					}
				});
			},
			
			// 返回上一页
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			
			// 加载更多
			loadMore() {
				if(this.isLoad) return;
				this.moreText = "正在加载中...";
				this.isLoad = 1;
				this.getUserList(true);
			},
			
			// 获取打赏列表
			getUserList(isPage) {
				const page = isPage ? this.page + 1 : 1;
				
				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getTipList',
						aid: this.aid,
						page: page,
						limit: this.limit
					},
					success: (res) => {
						this.isLoad = 0;
						if (res.data.code === 200) {
							const list = res.data.data.tips;
							this.hasMore = res.data.data.hasMore;
							
							if (list && list.length > 0) {
								const formattedList = list.map(item => ({
									...item,
									style: `background-image:url(${item.userInfo.avatar});`
								}));
								
								if (isPage) {
									this.page++;
									this.userList = [...this.userList, ...formattedList];
								} else {
									this.userList = formattedList;
								}
								this.moreText = "加载更多";
							} else {
								this.moreText = "没有更多数据了";
							}
						} else {
							uni.showToast({
								title: res.data.msg || '获取数据失败',
								icon: 'none'
							});
						}
						setTimeout(() => {
							this.isLoading = 1;
						}, 300);
					},
					fail: () => {
						this.isLoad = 0;
						this.moreText = "加载更多";
						setTimeout(() => {
							this.isLoading = 1;
						}, 300);
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					}
				});
			},
			
			// 跳转到用户主页
			toUserContents(userInfo) {
				uni.navigateTo({
					url: '/pages/contents/userinfo?title=' + userInfo.name + "的信息" + 
						"&name=" + userInfo.name + 
						"&uid=" + userInfo.uid + 
						"&avatar=" + encodeURIComponent(userInfo.avatar)
				});
			},
			
			// 格式化日期
			formatDate(timestamp) {
				const date = new Date(timestamp * 1000);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hour = String(date.getHours()).padStart(2, '0');
				const minute = String(date.getMinutes()).padStart(2, '0');
				return `${year}-${month}-${day} ${hour}:${minute}`;
			}
		}
	}
</script>

<style lang="scss" scoped>
.user {
	min-height: 100vh;
	
	.no-data {
		text-align: center;
		color: #999;
		padding: 30rpx;
		font-size: 28rpx;
		
		.cuIcon-text {
			margin-right: 10rpx;
		}
	}
	
	.load-more {
		text-align: center;
		padding: 20rpx;
		color: #666;
		font-size: 26rpx;
	}
	
	.isVIP {
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 50rpx;
		color: #fff;
		margin-left: 10rpx;
	}
	
	.loading {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: #fff;
		z-index: 9999;
		
		.loading-main {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			
			image {
				width: 200rpx;
				height: 200rpx;
			}
		}
	}
}
</style>