<template>
	<view
	:style="{'background-color':'#f6f6f6','min-height':'auto'}">
		<!-- 头部导航栏 -->
		<view class="header" v-if="tabCurTab==1" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="goBack">
					<text class="cuIcon-back back-icon"></text>
				</view>
				<!-- 分类滚动容器 -->
				<view class="category-container" v-if="curType === 'home'">
					<scroll-view class="category-scroll-header" scroll-x show-scrollbar="false">
						<view class="category-list-header">
							<view 
								class="category-item-header" 
								:class="{active: currentCategory === 'all'}"
								@tap="selectCategory('all')"
							>
								<text class="category-text">最新</text>
							</view>
							<view 
								class="category-item-header" 
								:class="{active: currentCategory === 'recommend'}"
								@tap="selectCategory('recommend')"
								v-if="showRecommend"
							>
								<text class="category-text">推荐</text>
							</view>
							<view 
								class="category-item-header" 
								:class="{active: currentCategory === 'hot'}"
								@tap="selectCategory('hot')"
							>
								<text class="category-text">热门</text>
							</view>
							<view 
								class="category-item-header" 
								v-for="category in categoryList" 
								:key="category.id"
								:class="{active: currentCategory === category.id}"
								@tap="selectCategory(category.id)"
							>
								<text class="category-icon" :class="category.icon" v-if="category.icon"></text>
								<text class="category-text">{{category.name}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- 其他页面标题 -->
				<view class="content text-bold" v-else :style="[{top:StatusBar + 'px'}]">
					{{ getPageTitle() }}
				</view>
				<view class="action">
					<!-- 占位 -->
				</view>
			</view>
		</view>
		<view v-if="tabCurTab==1" :style="[{padding:NavBar + 'px 0px 0px 0px'}]"></view>

		<view class="content-wrapper">
			<home-component v-show="curType=='home'" :curPage="0" v-if="tabCurTab==1" ref="homeComponent"></home-component>
		</view>



		<!-- 加载状态 -->
		<view class="loading" v-if="tabCurTab==0">
			<view class="loading-main">
				<image src="../../../static/loading.gif"></image>
				<text>正在加载短视频中...</text>
			</view>
		</view>
	</view>
</template>

<script>
import {
	localStorage
} from '../../../js_sdk/mp-storage/mp-storage/index.js'


// 导入现有页面作为组件
import HomeComponent from './home.vue'

export default {
	
	components: {
		HomeComponent
	},
	data() {
		return {
			// 安全区域相关
			StatusBar: 0,
			CustomBar: 0,
			NavBar: 0,
			safeAreaBottom: 0, // 底部安全区域高度

			curType: "home",
			tabCurTab: 0, // 0: 加载中, 1: 已加载
			curPage: 0,
			userInfo: null,
			token: "",
			// 分类相关
			categoryList: [],
			currentCategory: 'all',
			showRecommend: false
		};
	},
	onLoad(options) {
		// 初始化安全区域
		this.initSafeArea();
		this.initializeApp();
	},
	onShow() {
		setTimeout(() => {
			uni.$emit('onShow', this.curPage);
		}, 200);
	},
	onHide() {
	},
	onUnload() {
	},
	onPullDownRefresh() {
		// 触发下拉刷新事件
		uni.$emit('onPullDownRefresh', this.curPage);
		// 1秒后停止刷新
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onReachBottom() {
		// 触发上拉加载更多事件
		uni.$emit('onReachBottom', this.curPage);
	},
	methods: {
		initSafeArea() {
			this.StatusBar = this.$store ? (this.$store.state.StatusBar || 0) : (Vue.prototype.StatusBar || 0);
			this.CustomBar = this.$store ? (this.$store.state.CustomBar || 0) : (Vue.prototype.CustomBar || 0);
			
			if (!this.StatusBar || !this.CustomBar) {
				const systemInfo = uni.getSystemInfoSync();
				this.StatusBar = systemInfo.statusBarHeight || 0;
				// #ifndef MP
				if (systemInfo.platform == 'android') {
					this.CustomBar = this.StatusBar + 50;
				} else {
					this.CustomBar = this.StatusBar + 45;
				}
				// #endif
				
				// #ifdef MP-WEIXIN
				let custom = wx.getMenuButtonBoundingClientRect();
				this.CustomBar = custom.bottom + custom.top - this.StatusBar;
				// #endif
				
				// #ifdef MP-ALIPAY
				this.CustomBar = this.StatusBar + systemInfo.titleBarHeight;
				// #endif
				
				// #ifdef MP-QQ || MP-BAIDU || MP-TOUTIAO
				this.CustomBar = this.StatusBar + 45;
				// #endif
			}
			
			// 设置导航栏总高度
			// #ifdef APP-PLUS || MP
			this.NavBar = this.CustomBar;
			// #endif
			// #ifndef APP-PLUS || MP
			this.NavBar = this.StatusBar + this.CustomBar;
			// #endif
			
			// 获取底部安全区域高度
			const systemInfo = uni.getSystemInfoSync();
			this.safeAreaBottom = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0;
		},

		// 初始化应用
		initializeApp() {
			// 获取用户信息
			if (localStorage.getItem('userinfo')) {
				this.userInfo = JSON.parse(localStorage.getItem('userinfo'));
			}
			if (localStorage.getItem('token')) {
				this.token = localStorage.getItem('token');
			}

			// 获取分区列表
			this.getCategoryList();
			// 获取视频设置
			this.getVideoSettings();

			// 设置加载完成状态
			setTimeout(() => {
				this.tabCurTab = 1;

				this.$nextTick(() => {
					setTimeout(() => {
						this.selectCategory('all');
					}, 100);
				});
				
				// 触发首次显示事件
				setTimeout(() => {
					uni.$emit('onShow', this.curPage);
				}, 200);
			}, 500);
		},



		// 返回上一页
		goBack() {
			uni.navigateBack({
				delta: 1
			});
		},

		// 获取页面标题
		getPageTitle() {
			switch(this.curType) {
				case 'home':
					return '短视频';
				default:
					return '短视频';
			}
		},

		// 处理搜索
		handleSearch() {
			// 通知首页组件显示搜索
			if (this.$refs.homeComponent && this.$refs.homeComponent.showSearch) {
				this.$refs.homeComponent.showSearch();
			}
		},

		// 选择分区
		selectCategory(categoryId) {
			this.currentCategory = categoryId;
			// 通知首页组件切换分区
			if (this.$refs.homeComponent && this.$refs.homeComponent.selectCategory) {
				this.$refs.homeComponent.selectCategory(categoryId);
			}
		},

		// 获取分区列表
		getCategoryList() {
			const that = this;
			uni.request({
				url: that.$API.PluginLoad('xqy_video'),
				data: {
					action: 'getCategoryList',
					plugin: 'xqy_video',
					type: 'all',
					limit: 50
				},
				method: 'GET',
				success: function(res) {
					if (res.data && res.data.code === 200) {
						that.categoryList = res.data.data || [];
					}
				},
				fail: function(err) {
				}
			});
		},

		getVideoSettings() {
			const that = this;
			const requestData = {
				action: 'getVideoSettings',
				plugin: 'xqy_video',
				token: that.token
			};
			uni.request({
				url: that.$API.PluginLoad('xqy_video'),
				data: requestData,
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				success: function(res) {
					if (res.data.code === 200) {
						const settings = res.data.data;
						that.showRecommend = settings.show_recommend == 1 || settings.show_recommend === '1';
					}
				},
				fail: function(err) {
					that.showRecommend = false;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 999;
	background-color: #ffffff;
	border-bottom: 1px solid #e5e5e5;
}

.cu-bar {
	display: flex;
	align-items: center;
	position: relative;
	padding: 0 30rpx;
	box-sizing: border-box;
}

.cu-bar .action {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.cu-bar .content {
	flex: 1;
	text-align: center;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	font-size: 32rpx;
	color: #333333;
}

.back-icon {
	font-size: 36rpx;
	color: #333333;
}

.search-icon {
	font-size: 36rpx;
	color: #333333;
}

/* 分类滚动容器 */
.category-container {
	flex: 1;
	margin: 0 20rpx;
	position: relative;
}

.category-scroll-header {
	white-space: nowrap;
	height: 60rpx;
}

.category-list-header {
	display: flex;
	gap: 20rpx;
	align-items: center;
	height: 100%;
}

.category-item-header {
	display: flex;
	align-items: center;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	background: #f8f8f8;
	transition: all 0.3s ease;
	flex-shrink: 0;
	white-space: nowrap;
	height: 44rpx;
	box-sizing: border-box;

	&.active {
		background: #FF6B6B;
		color: #fff;

		.category-text {
			color: #fff;
		}

		.category-icon {
			color: #fff !important;
		}
	}

	&:active {
		transform: scale(0.95);
	}

	.category-icon {
		font-size: 24rpx;
		margin-right: 6rpx;
	}

	.category-text {
		font-size: 24rpx;
		color: #333;
		font-weight: 500;
	}
}

.loading {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #f6f6f6;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.loading-main {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
}

.loading-main image {
	width: 80rpx;
	height: 80rpx;
}

.loading-main text {
	font-size: 28rpx;
	color: #666666;
}

.content-wrapper {
	min-height: 100vh;
	box-sizing: border-box;
}


</style>