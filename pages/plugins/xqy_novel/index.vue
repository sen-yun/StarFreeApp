<template>
	<view style="background-color:#f6f6f6;min-height:100vh">
		<!-- 头部导航栏 -->
		<view class="header" v-if="tabCurTab==1" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="goBack">
					<text class="cuIcon-back back-icon"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					{{ getPageTitle() }}
				</view>
				<view class="action" @tap="handleRightAction">
					<text class="edit-text" v-if="curType === 'bookshelf' && isEditMode !== undefined">{{ isEditMode ? '完成' : '编辑' }}</text>
				</view>
			</view>
		</view>
		<view v-if="tabCurTab==1" :style="[{padding:NavBar + 'px 0px 0px 0px'}]"></view>

		<view class="content-wrapper" :style="{'padding-bottom': (120 + safeAreaBottom) + 'rpx'}">
			<home-component v-show="curType=='home'" :curPage="0" v-if="tabCurTab==1" ref="homeComponent"></home-component>
			<bookshelf-component v-show="curType=='bookshelf'" :curPage="1" v-if="tabCurTab==1" ref="bookshelfComponent"></bookshelf-component>
		</view>

		<!-- 底部导航栏 -->
		<view class="novel-tabbar" v-if="tabCurTab==1" :style="{'margin-bottom': safeAreaBottom + 'px'}">
			<block v-for="(item, index) in list" :key="index">
				<view class="tabbar-item" @tap="tabbarChange(item.type,index)">
					<view class="tab-icon">
						<text class="tab-icon-text" :class="item.icon + (curType == item.type ? ' active' : '')"></text>
					</view>
					<view class="tab-text" :class="{'active': curType == item.type}">
						{{item.text}}
					</view>
				</view>
			</block>
		</view>

		<!-- 加载状态 -->
		<view class="loading" v-if="tabCurTab==0">
			<view class="loading-main">
				<image src="../../../static/loading.gif"></image>
				<text>正在加载小说中...</text>
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
import BookshelfComponent from './bookshelf.vue'

export default {
	
	components: {
		HomeComponent,
		BookshelfComponent
	},
	data() {
		return {
			// 安全区域相关
			StatusBar: 0,
			CustomBar: 0,
			NavBar: 0,
			safeAreaBottom: 0, // 底部安全区域高度
			// 底部导航配置
			list: [{
				text: '首页',
				icon: 'tn-icon-home-fill',
				type: "home",
			}, {
				text: '书架',
				icon: 'tn-icon-book',
				type: "bookshelf",
			}],
			curType: "home",
			tabCurTab: 0, // 0: 加载中, 1: 已加载
			curPage: 0,
			userInfo: null,
			token: "",
			// 头部导航相关
			isEditMode: false // 书架编辑模式状态
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
		uni.$emit('onPullDownRefresh', this.curPage);
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onReachBottom() {
		uni.$emit('onReachBottom', this.curPage);
	},
	// APP端返回键处理
	// #ifdef APP-PLUS
	// onBackPress() {
	// 	return false;
	// },
	// #endif
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

			// 设置加载完成状态
			setTimeout(() => {
				this.tabCurTab = 1;
				
				// 触发首次显示事件
				setTimeout(() => {
					uni.$emit('onShow', this.curPage);
				}, 200);
			}, 500);
		},

		// 底部导航切换
		tabbarChange(type, index) {
			// 如果点击的是当前页面，不进行切换
			if (this.curType === type) {
				return;
			}

			// 更新当前页面状态
			this.curPage = index;
			this.curType = type;
			// 重置编辑模式状态
			this.isEditMode = false;

			// 触发页面显示事件
			setTimeout(() => {
				uni.$emit('onShow', index);
			}, 200);
		},

		// 返回上一页
		goBack() {
			// 直接使用uni.navigateBack，不添加额外逻辑避免递归
			uni.navigateBack({
				delta: 1
			});
		},

		// 获取页面标题
		getPageTitle() {
			switch(this.curType) {
				case 'home':
					return '小说世界';
				case 'bookshelf':
					return '我的书架';
				default:
					return '小说插件';
			}
		},



		// 处理右侧按钮点击
		handleRightAction() {
			switch(this.curType) {
				case 'bookshelf':
					// 切换编辑模式
					this.toggleEditMode();
					break;
				default:
					break;
			}
		},

		// 切换书架编辑模式
		toggleEditMode() {
			this.isEditMode = !this.isEditMode;
			// 通知书架组件切换编辑模式
			if (this.$refs.bookshelfComponent && this.$refs.bookshelfComponent.toggleEditMode) {
				this.$refs.bookshelfComponent.toggleEditMode();
			}
		},

		// 处理搜索
		handleSearch() {
			// 跳转到搜索页面
			uni.navigateTo({
				url: '/pages/contents/search?type=7'
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

.header-icon {
	font-size: 36rpx;
	color: #333333;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
}

.edit-text {
	font-size: 28rpx;
	color: #007AFF;
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

/* 内容包装器 */
.content-wrapper {
	min-height: 100vh;
	box-sizing: border-box;
}

/* 底部导航栏样式 */
.novel-tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background-color: #ffffff;
	border-top: 1rpx solid #e5e5e5;
	display: flex;
	align-items: center;
	justify-content: space-around;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
	z-index: 1000;
}



.tabbar-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;
	height: 100%;
	position: relative;
	transition: all 0.3s ease;
}

.tabbar-item:active {
	transform: scale(0.95);
}

.tab-icon {
	margin-bottom: 8rpx;
}

.tab-icon-text {
	font-size: 44rpx;
	color: #999999;
	transition: color 0.3s;
}

.tab-icon-text.active {
	color: #3cc9a4;
}

.tab-text {
	font-size: 22rpx;
	color: #999999;
	transition: color 0.3s;
}

.tab-text.active {
	color: #3cc9a4;
	font-weight: bold;
}


</style>