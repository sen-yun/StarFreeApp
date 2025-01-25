<template>
	<view class="buyvippage" :class="$store.state.AppStyle" style="height: 100vh;">
		<view class="header" :style="[{height:CustomBar*2 + 'rpx'}]" :class="scrollTop>40?'bg-white color-black':'color-white'">
			<view class="cu-bar" :style="{'height': CustomBar*2 + 'rpx','padding-top':StatusBar*2 + 'rpx'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back" :class="scrollTop>40?'color-black':'color-white'"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar*2 + 'rpx'}]"
					:class="scrollTop>40?'color-black':'color-white'">
					VIP特权
				</view>
				<view class="action">
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'rpx 20rpx 0rpx 20rpx'}]"></view>
		<view>
			<view class="page">
				<view class="user">
					<view :style="style"
						style="width: 110rpx;height: 110rpx;background-size: cover;border-radius: 50%;" />
					<view class="user-info-vip">
						<text>{{name}}</text>
						<block v-if="isvip==1">
							<text v-if="vip==1">您已开通永久会员</text>
							<text v-else>到期：{{formatDate(vip)}}</text>
						</block>
						<block v-else>
							<text>您还未开通会员</text>
						</block>
						<view class="vip-icon tn-icon-vip-text"></view>

					</view>

				</view>

				<view class="content">
					<view class="title">会员套餐</view>
					<view class="option" style="font-family: 'D-DIN';" v-if="vipTypeList.length>0">
						<view v-for="(v, k) in vipTypeList"
							:class="'option-item ' + (k === current ? 'option-selected' : '')" :key="k"
							@click="change(k)">
							<text class="option-item-time">{{v.name}}</text>
							<view class="option-item-price"><text>{{v.price}}</text><text>{{currencyName}}</text></view>
							<text class="option-item-tip">{{v.intro}}</text>
							<view class="option-item-tag" v-if="v.giftDay>0">额外赠送{{v.giftDay}}天</view>
						</view>
					</view>
					<view class="option" v-else>
						暂无套餐，请在后台VIP套餐中添加
					</view>
					<block v-if="vipTypeList.length>0">
					<block v-if="isvip==1">
						<view class="button" v-if="vip==1">
							<text>无需开通</text>
							<text>正在享受永久会员权益</text>
							
						</view>
						<view class="button" v-else  @click="toBuyVIPpackage(vipTypeList[current].id)">
							<text style="font-family: 'D-DIN';">立即续费{{vipTypeList[current].name}}套餐</text>
						</view>
					</block>
					<block v-else>
					
					<view class="button" @click="toBuyVIPpackage(vipTypeList[current].id)">
						<text style="font-family: 'D-DIN';">立即开通{{vipTypeList[current].name}}套餐</text>
					</view>
					</block>
					</block>
					<view class="title">会员权益</view>
					<view class="advantage">
						<view class="advantage-item" v-if="zktext!='无折扣'">
							<view class="advantage-item-icon tn-icon-cart"></view>
							<view class="advantage-item-text">
								<text>整站折扣</text>
								<text>整站购物{{zktext}}</text>
							</view>
						</view>
						<view class="advantage-item" v-for="(v,k) in advantages" :key="k">
							<view class="advantage-item-icon" :class="'tn-icon-'+v.icon"></view>
							<view class="advantage-item-text">
								<text>{{v.name}}</text>
								<text>{{v.desc}}</text>
							</view>
						</view>
					</view>
					<view class="title" style="color: #777; font-size: 28rpx;">会员说明</view>
					<view class="notice">
						<text v-html="viptext"></text>
						<text>以及享受以后更新的所有特权...</text>
					</view>
				</view>
			</view>
			
		</view>
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../static/loading.gif"></image>
			</view>
		</view>
	</view>
</template>



<script>
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
				viptext: "",
				isLoading: 0,
				vipTypeList: [{
					name: ''
				}],
				advantages: [{
						icon: 'eye',
						name: '专享内容',
						desc: '可查看VIP内容'
					},
					{
						icon: 'vip',
						name: '尊贵铭牌',
						desc: '会员尊贵标识'
					},
					{
						icon: 'identity',
						name: '昵称高亮',
						desc: '会员昵称高亮'
					},
					{
						icon: 'moments',
						name: '会员专区',
						desc: '解锁会员分类'
					},
					{
						icon: 'eye-close',
						name: '发布特权',
						desc: '发布可设置会员可见'
					},
					{
						icon: 'music-fill',
						name: '发布特权',
						desc: '发布可插入音乐'
					},
					{
						icon: 'more-horizontal',
						name: '更多特权',
						desc: '随着更新解锁更多'
					}
				],
				current: 0, // 当前选中套餐下标
				token: "",
				avatar: "",
				name: "",
				vipDiscount: 0,
				scrollTop: 0,
				vipPrice: 0,
				vipDay: 0,
				scale: 0,
				zktext: "",
				currencyName: "",
				assets: "",
				style: "",
				isvip: 0,
				vip: 0,
			}
		},
		onPageScroll(res) {
			var that = this;
			that.scrollTop = res.scrollTop;
		},
		onLoad() {
			var that = this;
			
			that.getset();
			that.getVipInfo();
			that.getVipTypeList();

		},
		onShow() {
			var that = this;
			// #ifdef APP-PLUS
			that.initStatusBarStyle();
			// #endif
			if (localStorage.getItem('userinfo')) {
				var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.token = userInfo.token;
				that.avatar = userInfo.avatar;
				that.style = "background-image:url(" + userInfo.avatar + ");"
				if (userInfo.screenName) {
					that.name = userInfo.screenName;
				} else {
					that.name = userInfo.name;
				}
			} else {
				uni.showToast({
					title: "请先登录",
					icon: 'none',
					duration: 1000,
					position: 'bottom',
				});
			}
			that.userStatus();

		},
		methods: {
			getVipTypeList() {
				var that = this;
				that.$Net.request({
					url: that.$API.vipTypeListStar(),
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							that.vipTypeList = res.data.vip
						}
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
						
					},
					fail: function(res) {
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			// #ifdef APP-PLUS
			initStatusBarStyle() {
				var that = this;
				if (uni.getSystemInfoSync().platform === 'android') {
					plus.navigator.setStatusBarStyle('light'); // Android 平台
				} else {
					plus.navigator.setStatusBarStyle('light'); // iOS 平台

				}

			},
			onPageScroll(event) {
				this.scrollTop = event.scrollTop;
				if (this.scrollTop > 40) {
					if (uni.getSystemInfoSync().platform === 'android') {
						plus.navigator.setStatusBarStyle('dark'); // Android 平台
					} else {
						plus.navigator.setStatusBarStyle('dark'); // iOS 平台
					}
				} else {
					if (uni.getSystemInfoSync().platform === 'android') {
						plus.navigator.setStatusBarStyle('light'); // Android 平台
					} else {
						plus.navigator.setStatusBarStyle('light'); // iOS 平台
					}
				}
			},
			// #endif
			getVipInfo() {
				var that = this;
				that.$Net.request({
					url: that.$API.getVipInfo(),
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							that.vipDiscount = res.data.data.vipDiscount;
							if (res.data.data.vipDiscount == '1.0') {
								that.zktext = '无折扣'
							} else if (res.data.data.vipDiscount == '0.0') {
								that.zktext = '免费'
							} else {
								that.zktext = (Number(res.data.data.vipDiscount) * 10).toString() + '折';
							}
							that.vipPrice = res.data.data.vipPrice;
							that.scale = res.data.data.scale;
							that.vipDay = res.data.data.vipDay;
						}
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			getset() {
				var that = this;
				uni.request({
					url: that.$API.SMset(),
					method: 'GET',
					dataType: "json",
					success(res) {
						that.currencyName = res.data.assetsname;
						that.viptext = res.data.viptext;
					},
					fail(error) {
						console.log(error);
					}
				})
			},
			toBuyVIPpackage(id) {
				var that = this;
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				} else {
					uni.showToast({
						title: "请先登录",
						icon: 'none',
						duration: 1000,
						position: 'bottom',
					});
				}
				var data = {
					"id": id,
					"token": token
				}
				uni.showModal({
					title: '确定要购买该套餐吗',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: "加载中"
							});

							that.$Net.request({
								url: that.$API.buyVIPpackage(),
								data: data,
								header: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								method: "get",
								dataType: 'json',
								success: function(res) {
									setTimeout(function() {
										uni.hideLoading();
									}, 1000);
									uni.showToast({
										title: res.data.msg,
										icon: 'none'
									})
									if (res.data.msg == "当前资产不足，请充值") {
										uni.navigateTo({
											url: '/pages/user/userrecharge'
										});
									}
									if (res.data.code == 1) {

										var timer = setTimeout(function() {
											that.back();
											clearTimeout('timer')
										}, 1000)
									}

								},
								fail: function(res) {
									setTimeout(function() {
										uni.hideLoading();
									}, 1000);
									uni.showToast({
										title: "网络开小差了哦",
										icon: 'none'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});


			},
			userStatus() {
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
						if (res.data.code == 1) {
							that.assets = res.data.data.assets;
							// that.points = res.data.data.points;
							that.vip = res.data.data.vip;
							that.isvip = res.data.data.isvip;
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络开小差了哦",
							icon: 'none'
						})
					}
				})
			},
			formatDate(datetime) {
				var datetime = new Date(parseInt(datetime * 1000));
				// 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
				var year = datetime.getFullYear(),
					month = ("0" + (datetime.getMonth() + 1)).slice(-2),
					date = ("0" + datetime.getDate()).slice(-2),
					hour = ("0" + datetime.getHours()).slice(-2),
					minute = ("0" + datetime.getMinutes()).slice(-2);
				//second = ("0" + date.getSeconds()).slice(-2);
				// 拼接
				var result = year + "-" + month + "-" + date + " " + hour + ":" + minute;
				// 返回
				return result;
			},
			change(k) {
				this.current = k;
			},
			pay() {
				console.log(`点击支付`, this.options[this.current])
			}
		},


	}
</script>

<style lang="scss" scoped>
	.buyvippage {
		background: linear-gradient(to bottom right, #4A4A67, #696985, #53536B);
		/* 渐变背景，色系与原色相近 */
	}

	.page {
		width: 100vw;
		padding-top: 50rpx;

		.user {
			display: flex;
			align-items: center;
			background: #F9D7B2;
			width: 700rpx;
			margin: auto;
			box-sizing: border-box;
			padding: 0 30rpx;
			border-radius: 20rpx 20rpx 0 0;
			height: 160rpx;

			image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}

			.user-info-vip {
				height: 90rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				padding-left: 15rpx;

				text {
					&:nth-child(1) {
						font-weight: bold;
					}

					&:nth-child(2) {
						font-size: 28rpx;
						color: #777;
					}
				}
			}
		}

		.content {
			background: #fff;
			border-radius: 20rpx 20rpx 0 0;
			padding: 20rpx;
			box-sizing: border-box;
			width: 100vw;

			.title {
				font-weight: bold;
				height: 80rpx;
				line-height: 80rpx;
			}

			.option {
				display: flex;
				flex-wrap: wrap;
				/* 支持换行 */

				.option-item {
					width: 30%;
					/* 将宽度调整为 30% */
					margin: 10rpx;
					/* 增加底部间距，避免项目之间过于紧凑 */
					height: 280rpx;
					box-sizing: border-box;
					border: 2upx solid #999;
					border-radius: 15rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					position: relative;
					padding: 14rpx;

					&:active {
						background: #FFF6ED;
						border-color: #f5984a;
					}

					.option-item-time {
						font-weight: bold;
						font-size: 28rpx;
						color: #555;
					}

					.option-item-price {
						font-weight: bold;
						margin: 20rpx 0;

						text {
							&:nth-child(1) {
								font-size: 46rpx;
							}
						}
					}

					.option-item-tip {
						font-size: 24rpx;
						color: #999;
						text-align: center;
					}

					.option-item-tag {
						position: absolute;
						left: -5rpx;
						top: -10rpx;
						font-weight: bold;
						font-size: 24rpx;
						padding: 5rpx 10rpx;
						border-radius: 12rpx;
						background: red;
						color: #fff;
					}
				}

				.option-selected {
					background: #FFF6ED;
					border-color: #f5984a;

					.option-item-price {
						color: #333;
					}
				}
			}


			.button {
				background: #F9D7B2;
				height: 100rpx;
				border-radius: 50rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-top: 30rpx;

				&:active {
					background: #ceb295;
				}

				text {
					&:nth-child(1) {
						font-weight: bold;
						color: #333;
						line-height: 1.5;
					}

					&:nth-child(2) {
						color: #555;
						font-size: 28rpx;
					}
				}
			}

			.agreement {
				font-size: 28rpx;
				text-align: center;
				margin-top: 20rpx;
				color: #f5984a;

				&:active {
					color: #9c602f;
				}
			}

			.advantage {
				display: flex;
				flex-wrap: wrap;

				.advantage-item {
					display: flex;
					width: 350rpx;
					margin-bottom: 20rpx;
					margin-top: 20rpx;

					.advantage-item-icon {
						border: 2upx solid #F9D7B2;
						border-radius: 50%;
						width: 70rpx;
						height: 70rpx;
						color: #f5984a;
						font-size: 40rpx;
						display: flex;
						justify-content: center;
						align-items: center;


						text {
							margin: 10rpx;
							width: 50rpx;
							height: 50rpx;
						}
					}

					.advantage-item-text {
						display: flex;
						flex-direction: column;
						justify-content: center;
						margin-left: 15rpx;

						text {
							&:nth-child(1) {
								font-size: 28rpx;
								color: #f5984a;
							}

							&:nth-child(2) {
								font-size: 24rpx;
								color: #888;
							}
						}
					}
				}
			}

			.notice {
				display: flex;
				flex-direction: column;

				text {
					font-size: 24rpx;
					color: #888;
					margin-bottom: 10rpx;
				}
			}
		}
	}

	.vip-icon {
		position: absolute;
		// #ifdef H5 || MP
		top: 80rpx;
		// #endif
		// #ifdef APP-PLUS
		top: 140rpx;
		// #endif
		right: 50rpx;
		z-index: 100;
		font-size: 200rpx;
		font-style: italic;
		background-color: #53536b;
		-webkit-background-clip: text;
		color: transparent;

		/* 浮雕效果 */
		text-shadow: -6rpx -4rpx 4rpx rgba(255, 255, 255, 0.22);
		;
	}

	.color-black {
		color: #000;
	}

	.color-white {
		color: #fff;
	}
</style>