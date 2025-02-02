<template>
	<view class="user" :class="AppStyle">
		<!-- 顶部导航 -->
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					管理控制台
				</view>
				<view class="action"></view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<!-- 该项目为开源项目，请尊重作者劳动成果 -->
		<!-- 允许用于合法的商业运营用途，但请保留版权信息。-->
		<!-- 数据统计卡片 -->
		<view class="data-box manage-data">
			<view class="user-data grid col-4">
				<view class="user-data-box">
					<view class="user-data-value">{{allData.allContents}}</view>
					<view class="user-data-title">总帖子</view>
				</view>
				<view class="user-data-box">
					<view class="user-data-value">{{allData.allComments}}</view>
					<view class="user-data-title">总评论</view>
				</view>
				<view class="user-data-box" v-if="group=='administrator'">
					<view class="user-data-value">{{allData.allShop}}</view>
					<view class="user-data-title">商品数</view>
				</view>
				<view class="user-data-box" v-if="group=='administrator'">
					<view class="user-data-value">{{allData.allUsers}}</view>
					<view class="user-data-title">用户数</view>
				</view>
			</view>
		</view>
		<!-- 该项目为开源项目，请尊重作者劳动成果 -->
		<!-- 允许用于合法的商业运营用途，但请保留版权信息。-->
		<!-- 警告提示 -->
		<view class="warning-box">
			<text class="cuIcon-warn margin-right-xs"></text>
			<text>请注意！请遵守社区规定进行审核管理，违规操作将取消职位！</text>
		</view>
		<!-- 内容管理 -->
		<view class="data-box">
			<view class="module-title">数据管理</view>
			<view class="index-sort grid col-5">
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/contents')">
							<view class="index-sort-i">
								<text class="cuIcon-text"></text>
							</view>
							<view class="index-sort-text">帖子管理</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box" v-if="group=='administrator'">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/metas')">
							<view class="index-sort-i">
								<text class="cuIcon-text"></text>
							</view>
							<view class="index-sort-text">分类管理</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/comments')">
							<view class="index-sort-i">
								<text class="cuIcon-favorfill"></text>
							</view>
							<view class="index-sort-text">评论管理</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/space')">
							<view class="index-sort-i">
								<text class="cuIcon-new"></text>
							</view>
							<view class="index-sort-text">动态管理</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/shop')">
							<view class="index-sort-i">
								<text class="cuIcon-shop"></text>
							</view>
							<view class="index-sort-text">商品管理</view>
						</view>
					</waves>
				</view>
			</view>
		</view>
		<!-- 该项目为开源项目，请尊重作者劳动成果 -->
		<!-- 允许用于合法的商业运营用途，但请保留版权信息。-->
		<!-- 运营管理 -->
		<view class="data-box" v-if="group=='administrator'">
			<view class="module-title">运营管理</view>
			<view class="index-sort grid col-4">
				
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/banuser')">
							<view class="index-sort-i">
								<text class="cuIcon-warnfill"></text>
							</view>
							<view class="index-sort-text">用户封禁</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/ads')">
							<view class="index-sort-i">
								<text class="cuIcon-read"></text>
							</view>
							<view class="index-sort-text">广告管理</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/invitation')">
							<view class="index-sort-i">
								<text class="cuIcon-friendadd"></text>
							</view>
							<view class="index-sort-text">邀请管理</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/endException')">
							<view class="index-sort-i">
								<text class="cuIcon-paintfill"></text>
							</view>
							<view class="index-sort-text">解除限制</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/clean')">
							<view class="index-sort-i">
								<text class="cuIcon-file"></text>
							</view>
							<view class="index-sort-text">数据清理</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box" v-if="group=='administrator'">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/userClean')">
							<view class="index-sort-i">
								<text class="cuIcon-file"></text>
							</view>
							<view class="index-sort-text">用户清理</view>
						</view>
					</waves>
				</view>
				
			</view>
		</view>
		<!-- 该项目为开源项目，请尊重作者劳动成果 -->
		<!-- 允许用于合法的商业运营用途，但请保留版权信息。-->
		<!-- 管理模块 -->
		<view class="data-box" v-if="group=='administrator'">
			<view class="module-title">系统管理</view>
			<view class="index-sort grid col-4">
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/users')">
							<view class="index-sort-i">
								<text class="cuIcon-friend"></text>
							</view>
							<view class="index-sort-text">用户管理</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/giftVIP')">
							<view class="index-sort-i">
								<text class="cuIcon-vip"></text>
							</view>
							<view class="index-sort-text">特权赠送</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/chat')">
							<view class="index-sort-i">
								<text class="cuIcon-weixin"></text>
							</view>
							<view class="index-sort-text">群聊管理</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/senduser')">
							<view class="index-sort-i">
								<text class="cuIcon-light"></text>
							</view>
							<view class="index-sort-text">消息推送</view>
						</view>
					</waves>
				</view>
			</view>
		</view>

		
		<!-- 该项目为开源项目，请尊重作者劳动成果 -->
		<!-- 允许用于合法的商业运营用途，但请保留版权信息。-->
		<!-- 财务模块 -->
		<view class="data-box" v-if="group=='administrator'">
			<view class="module-title">财务管理</view>
			<view class="index-sort grid col-4">
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/finance')">
							<view class="index-sort-i">
								<text class="cuIcon-vipcard"></text>
							</view>
							<view class="index-sort-text">财务中心</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/recharge')">
							<view class="index-sort-i">
								<text class="cuIcon-pay"></text>
							</view>
							<view class="index-sort-text">快捷充扣</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/withdraw')">
							<view class="index-sort-i">
								<text class="cuIcon-moneybag"></text>
							</view>
							<view class="index-sort-text">提现审核</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toLink('/pages/manage/tokenpay')">
							<view class="index-sort-i">
								<text class="cuIcon-ticket"></text>
							</view>
							<view class="index-sort-text">卡密管理</view>
						</view>
					</waves>
				</view>
			</view>
		</view>
		<!-- 该项目为开源项目，请尊重作者劳动成果 -->
		<!-- 允许用于合法的商业运营用途，但请保留版权信息。-->
		<view class="data-box">
			<view class="starFree-Info">
				<view class="starFree-title">—— StarFree开源论坛 ——</view>
				<view class="starFree-name">用户交流群 1021506674</view>
				<view class="starFree-name">开源作者森云</view>
			</view>
		</view>
	</view>
</template>

<script>
	import waves from '@/components/xxley-waves/waves.vue';
	import {
		localStorage
	} from '../../js_sdk/mp-storage/mp-storage/index.js'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar: this.StatusBar + this.CustomBar,
				AppStyle: this.$store.state.AppStyle,
				uid: 0,
				userInfo: null,
				token: "",
				allData: {
				      allContents: 0,
				      allComments: 0, 
				      allShop: 0,
				      allUsers: 0
				    },
				group: "",
				// 该项目为开源项目，请尊重作者劳动成果 
				// 允许用于合法的商业运营用途，但请保留版权信息。
				infoone: "",
				infotwo: "",
				myPurviewList: [],
				isModerator: false,
				myPurview: 0,
			}
		},
		computed: {
			// 该项目为开源项目，请尊重作者劳动成果 
			// 允许用于合法的商业运营用途，但请保留版权信息。
			infooneDecoded() {
				try {
					return decodeURIComponent(escape(window.atob(this.infoone)));
				} catch (e) {
					return this.infoone;
				}
			},
			infotwoDecoded() {
				try {
					return decodeURIComponent(escape(window.atob(this.infotwo)));
				} catch (e) {
					return this.infotwo;
				}
			}
		},
		onPullDownRefresh() {
			var that = this;

		},
		onShow() {
			var that = this;
			// #ifdef APP-PLUS

			//plus.navigator.setStatusBarStyle("dark")

			// #endif
			if (localStorage.getItem('userinfo')) {

				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.userInfo.style = "background-image:url(" + that.userInfo.avatar + ");";
				that.group = that.userInfo.group;
			}
			if (localStorage.getItem('token')) {

				that.token = localStorage.getItem('token');
				that.getallData();
			}

			that.userPurview();
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
		},
		methods: {
			// 该项目为开源项目，请尊重作者劳动成果 
			// 允许用于合法的商业运营用途，但请保留版权信息。
			getUser(data) {
				var that = this;
				localStorage.setItem('getuid', data.uid);
				that.back();
			},
			back() {
				uni.navigateBack({
					delta: 1
				});
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
			getallData() {
				var that = this;
				that.$Net.request({

					url: that.$API.allData(),
					data: {
						"token": that.token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							that.allData = res.data.data;
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦",
							icon: 'none'
						})
					}
				})
			},

			toView2(url) {
				var that = this;
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif

			},
			toUrl(url) {
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			toMetas(){
				var that = this;
				uni.navigateTo({
					url: '/pages/manage/metas'
				});
			},
			userPurview() {
				var that = this;
				that.$Net.request({

					url: that.$API.userStatus(),
					data: {
						"token": that.token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 0) {

							if (that.userInfo != null) {
								that.isLoginShow = true;
							}
							localStorage.removeItem('userinfo');
							localStorage.removeItem('token');

							that.userInfo = null;
						} else {

							if (localStorage.getItem('userinfo')) {

								var userInfo = JSON.parse(localStorage.getItem('userinfo'));
								if (userInfo.screenName) {
									that.name = userInfo.screenName;
								} else {
									that.name = userInfo.name;
								}
								if (res.data.data.customize) {
									userInfo.customize = res.data.data.customize;
								}
								if (res.data.data.lv) {
									userInfo.lv = res.data.data.lv;
								}
								if (res.data.data.isvip) {
									userInfo.isvip = res.data.data.isvip;
								}
								if (res.data.data.vip) {
									userInfo.vip = res.data.data.vip;
								}
								if (res.data.data.experience) {
									userInfo.experience = res.data.data.experience;
								}
								localStorage.setItem('userinfo', JSON.stringify(userInfo));
								// if(res.data.data.avatar){
								// 	that.userInfo = res.data.data.avatar;
								// }

							}

						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦",
							icon: 'none'
						})
					}
				})
			},
		},
		components: {
			waves
		}
	}
</script>

<style>
.user {
    background-color: #f5f6fa;
    min-height: 100vh;
}

.header {
    background: #fff;
    position: fixed;
    width: 100%;
    z-index: 99;
}

.header .cu-bar {
    background: transparent !important;
}

.data-box {
    background: #fff;
    border-radius: 16rpx;
    margin: 20rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.manage-data {
    position: relative;
    z-index: 2;
}

.user-data {
    padding-top: 0rpx;
    margin-top: 0rpx;
    display: flex;
    justify-content: space-between;
}

.user-data-box {
    text-align: center;
    padding: 20rpx;
}

.user-data-value {
    font-size: 36rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 10rpx;
}

.user-data-title {
    font-size: 24rpx;
    color: #666;
}

.data-box-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
    color: #333;
}

.data-box-title .cuIcon-titles {
    margin-right: 10rpx;
    color: #4b6cb7;
}

.index-sort {
    padding: 20rpx 0;
}


.index-sort-main {
    background: #fff;
    border-radius: 12rpx;
    text-align: center;
    transition: all 0.3s;
}

.index-sort-main:active {
    transform: scale(0.95);
}

.index-sort-i {
    width: 80rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 50%;
    margin: 0 auto 15rpx;
    color: #fff;
    font-size: 40rpx;
    background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
}

.index-sort-text {
    font-size: 26rpx;
    color: #333;
}

/* 模块分类样式 */
.module-section {
    margin-top: 30rpx;
}

.module-title {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
    padding-left: 20rpx;
    border-left: 6rpx solid #4b6cb7;
}

/* 警告提示框样式 */
.warning-box {
    background: #fff5f5;
    border-left: 6rpx solid #ff4757;
    padding: 20rpx;
    margin: 20rpx;
    border-radius: 8rpx;
}

.warning-box text {
    color: #ff4757;
    font-size: 26rpx;
}

/* 底部信息样式 */
.starFree-Info {
    text-align: center;
    padding: 40rpx 0;
}

.starFree-title {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
}

.starFree-name {
    font-size: 24rpx;
    color: #999;
}
</style>