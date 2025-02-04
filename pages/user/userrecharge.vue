<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					{{assetsname}}充值
				</view>
				<view class="action">
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>

		<view class="buy">
			<view class="title">
				<text class="text">余额：</text>
				<text class="num text-bold">{{assets}}</text>
				<text class="tn-icon-money text-bold" style="margin-left: 5rpx;"></text>
			</view>
			<view class="number">
				<view class="list">
					<view :class="cur == index ? 'item real' : 'item'" v-for="(item, index) in list" :key="index"
						@click="pick(index)">
						<view class="card" v-if="index !== 6&&index !== 7">
							<view class="top">
								<text>{{item.number*scale}}</text>
								<text style="font-size: 20rpx;">{{assetsname}}</text>
							</view>
							<text class="money">{{ item.money }}<text style="margin-left: 6rpx;">元</text></text>
						</view>
						<view class="card" :class="{'custom-selected': cur === 6, 'custom-default': cur !== 6}"
							v-if="index===6">
							<view class="top">
								<text>自定义</text>
							</view>
							<view style="display: flex;align-items: center;" v-if="cur === 6">
								<input class="money-input" type="number" maxlength="6" v-model="num" placeholder="输入金额" @click.stop />
								<view>元</view>
							</view>
						</view>
						<view v-if="index === 6" class="recommend">
							<text>不低于￥1</text>
						</view>
						<view class="card" :class="{'custom-selected': cur === 6, 'custom-default': cur !== 6}"
							v-if="index===7">
							<view class="top">
								<text>兑换码</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="tip">
				<text class="titl">充值须知</text>
				<view>
					<text>1、人民币和{{assetsname}}的充值比例为1:{{scale}}</text>
				</view>
				<view>
					<text>2、{{assetsname}}为本平台的虚拟货币，交易后无法退款。</text>
				</view>
				<view>
					<text>3、请在网络状态良好的情况下进行充值，为了保证充值顺利，请耐心等待充值。</text>
				</view>
				<view>
					<text>4、前往钱包的收支记录，可查询充值订单详情和消费详情，若充值失败请凭订单号联系客服。</text>
				</view>
				<view>
					<text>5、在支付过程中遇到任何问题，请联系官方客服。</text>
				</view>
			</view>
			<view style="padding-top: 180rpx;">
			</view>
			<view class="recharge-buttom-box" style="padding: 30rpx;">
				<view class="buttom-left" style="display: flex;flex-direction: column;font-family: 'D-DIN';">
					<view class="buttom-left">
						<view class="buttom-left-info">付款金额</view>
						<view class="buttom-left-money-two">
							<block v-if="num == ''">
								0
							</block>
							<block v-else>
								{{num}}
							</block>
							<text class="buttom-left-money-two-icon" style="margin-left: 6rpx;">元</text>
						</view>
					</view>
					<view class="buttom-left" style="margin-top: 18rpx;">
						<view class="buttom-left-info">实际到账</view>
						<view class="buttom-left-money-two">{{num*scale}}<text class="buttom-left-money-two-icon"
								style="margin-left: 6rpx;">{{assetsname}}</text></view>
					</view>
				</view>
				<view class="buttom-right" @click="okEvent">
					立即充值
				</view>
			</view>
			<tn-modal v-model="kmshow" :custom="true" :zIndex="1000" :showCloseBtn="true" :maskCloseable="false">
				<view class="custom-modal-content">
					<view class="tn-icon tn-icon-about-fill"></view>
					<view class="text text-bold">卡密兑换</view>
					<input class="cdk-input" type="text" v-model="cdknum" placeholder="输入卡密" @click.stop />
					<view class="tip" style="padding: 0;height: auto;margin-bottom: 30rpx;">
						<view>
							<text>注意事项：</text><text v-html="cztext3"></text>
						</view>
					</view>
					<view style="display: flex;justify-content: space-between;">
						<button class="bg-black" style="width: 100%;font-size: 28rpx;border-radius: 50px;"
							@tap="tokenPay">立即兑换</button>
					</view>
				</view>
			</tn-modal>
			<tn-modal v-model="payshow" :custom="true" :zIndex="1000" :showCloseBtn="true" :maskCloseable="false">
				<view class="custom-modal-content">
					<view class="tn-icon tn-icon-about-fill"></view>
					<view class="text text-bold">选择充值方式</view>
					<view class="pay-box" :class="payType=='0'?'pay-box-check':''" v-if="czof1==1"
						style="display: flex;align-items: center;" @tap="toPayType(0)">
						<text class="tn-icon-payment-alipay" style="margin-right: 10rpx;color: #009fe8"></text>
						<text>支付宝</text>
					</view>
					<view class="pay-box" :class="payType=='1'?'pay-box-check':''" v-if="czof2==1"
						style="display: flex;align-items: center;" @tap="toPayType(1)">
						<text class="tn-icon-payment-wechat" style="margin-right: 10rpx;color: #15ba11;"></text>
						<text>微信支付</text>
					</view>

					<block v-if="czof4==1">
						<hr class="hr-solid-content" data-content=" 易支付 ">
						<view style="width: 100%;display: flex;justify-content: space-between;">
							<view class="pay-box-e" :class="epaycur=='1'?'pay-box-check':''"
								style="display: flex;align-items: center;width: 30%;" @tap="toPayType(3,0)">
								<text class="tn-icon-payment-alipay" style="margin-right: 6rpx;color: #009fe8;"></text>
								<text>支付宝</text>
							</view>
							<view class="pay-box-e" :class="epaycur=='2'?'pay-box-check':''"
								style="display: flex;align-items: center;width: 30%;" @tap="toPayType(3,1)">
								<text class="tn-icon-payment-wechat" style="margin-right: 6rpx;color: #15ba11;"></text>
								<text>微信</text>
							</view>
							<view class="pay-box-e" :class="epaycur=='3'?'pay-box-check':''"
								style="display: flex;align-items: center;width: 30%;" @tap="toPayType(3,2)">
								<text class="tn-icon-qq" style="margin-right: 6rpx;color: rgb(11,178,255);"></text>
								<text>QQ</text>
							</view>
						</view>
					</block>

					<button class="bg-black" style="width: 100%;font-size: 28rpx;border-radius: 100rpx;"
						@tap="pay">确定</button>

				</view>
			</tn-modal>
			<tn-modal v-model="topayshow" :custom="true" :zIndex="1000" :showCloseBtn="true" :maskCloseable="false">
				<view class="custom-modal-content">
					<view class="tn-icon tn-icon-about-fill"></view>
					<view class="data-box userrecharge">
						<view class="userrecharge-code" style="border: none;">
							<image :src="codeImg"></image>
						</view>
						<view class="tip" style="padding: 0;height: auto;margin-bottom: 30rpx;">
							<view class="titl">注意事项：</view>
							<view>
								<block v-if="payType==0">
									<text v-html="cztext1"></text>
								</block>
								<block v-if="payType==1">
									<text v-html="cztext2"></text>
								</block>
							</view>
						</view>
						<view class="userrecharge-btn">
							<view style="display: flex;justify-content: space-between;">
								<button class="bg-black"
									style="width: 100%;font-size: 28rpx;margin-right: 30rpx;border-radius: 50px;"
									@tap="dtImg">保存二维码</button>
								<button class="bg-black" style="width: 100%;font-size: 28rpx;border-radius: 50px;"
									v-if="payType=='0'" @tap="toAlipay()">打开支付宝</button>
								<button class="bg-black" style="width: 100%;font-size: 28rpx;border-radius: 50px;"
									v-if="payType=='1'" @tap="toWxpay()">打开微信</button>
							</view>
						</view>
					</view>
				</view>
			</tn-modal>
			<tn-modal v-model="epayshow" :custom="true" :zIndex="1000" :showCloseBtn="true" :maskCloseable="false">
				<view class="custom-modal-content">
					<view class="tn-icon tn-icon-about-fill"></view>
					<view class="data-box userrecharge">
						<view class="userrecharge-code" style="border: none;">
							<image :src="ePayCodeImg"></image>
						</view>
						<view class="tip" style="padding: 0;height: auto;margin-bottom: 30rpx;">
							<view class="titl">注意事项：</view>
							<view>
								<text v-html="cztext4"></text>
							</view>
						</view>
						<view class="userrecharge-btn">
							<view style="display: flex;justify-content: space-between;">
								<button class="bg-black"
									style="width: 100%;font-size: 28rpx;margin-right: 30rpx;border-radius: 50px;"
									@tap="ToCopy(ePayUrl)">复制链接</button>
								<button class="bg-black" style="width: 100%;font-size: 28rpx;border-radius: 50px;"
									@tap="goPayUrl(ePayUrl)">立即跳转</button>
							</view>
						</view>
					</view>
				</view>
			</tn-modal>
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
				ePayUrl: "",
				ePayCodeImg: "",
				userInfo: null,
				token: "",
				isLoading: 0,
				payType: 4,
				isToPay: 0,
				num: "1",
				ePayType: "alipay",
				toEpayType: false,
				epayshow: false,
				czof1: 0,
				czof2: 0,
				czof3: 0,
				czof4: 0,
				cdknum: "",
				cztext1: "",
				cztext2: "",
				cztext3: "",
				cztext4: "",
				codeImg: '',
				alipayUrl: "",
				wxpayUrl: "",
				assetsname: "",
				vipDiscount: 0,
				assets: "",
				epaycur: 0,
				kmshow: false,
				vipPrice: 0,
				scale: 0,
				modalName: null,
				payshow: false,
				topayshow: false,
				cur: 0,
				list: [{
						number: '1',
						money: '1',
					},
					{
						number: '6',
						money: '6',
					},
					{
						number: '12',
						money: '12',
					},
					{
						number: '30',
						money: '30',
					},
					{
						number: '68',
						money: '68',
					},
					{
						number: '128',
						money: '128',
					},
					{
						number: '自定义',
						money: '自定义',
					},
					{
						number: '卡密',
						money: '卡密',
					}
				],
			};
		},
		onShow() {
			var that = this;
			// #ifdef APP-PLUS

			plus.navigator.setStatusBarStyle("dark")

			// #endif
			if (localStorage.getItem('userinfo')) {

				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.userInfo.style = "background-image:url(" + that.userInfo.avatar + ");"
			}
			if (localStorage.getItem('token')) {

				that.token = localStorage.getItem('token');
			}
			that.userStatus();
			that.getVipInfo();
			that.getset();
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
		},
		methods: {
			pay() {
				var that = this;
				if (!that.isPositiveInteger(that.num) || that.num == '') {
					uni.showToast({
						title: "充值金额不能含小数",
						icon: 'none'
					});
					return false;
				}
				if (that.num < 1) {
					uni.showToast({
						title: "最低充值金额1元",
						icon: 'none'
					});
					return false;
				}
				if (that.payType == 4) {
					uni.showToast({
						title: "请选择支付方式",
						icon: 'none'
					});
					return false;
				}
				if (that.payType == 0) {
					that.aliPay();
				}
				if (that.payType == 1) {
					that.wxPay();
				}
				if (that.payType == 3) {
					that.toEpay();
				}
			},
			isPositiveInteger(s) {
				var re = /^[0-9]+$/;
				return re.test(s)
			},
			toEpay() {
				var that = this;
				var type = that.ePayType;
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				if (!that.isPositiveInteger(that.num) || that.num == '') {
					uni.showToast({
						title: "充值金额只能为正整数",
						icon: 'none'
					});
					return false;
				}
				if (that.num < 1) {
					uni.showToast({
						title: "最低充值金额1元",
						icon: 'none'
					});
					return false;
				}
				var data = {
					"money": that.num,
					"device": "mobile",
					"type": type,
					"token": token
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					url: that.$API.EPayStar(),
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
						if (res.data.code == 1) {
							var payapi = res.data.payapi;
							var payurl = "";
							if (res.data.data.payurl) {
								payurl = res.data.data.payurl;
								var prefix = payurl.substring(0, 2);
								if (prefix == "./") {
									payurl = payurl.replace("./", "");
									payurl = payapi + payurl;
								}
							}
							if (res.data.data.qrcode) {
								payurl = res.data.data.qrcode;
							}

							that.ePayCodeImg = that.$API.qrCodeStar() + "?codeContent=" + payurl;
							that.ePayUrl = payurl;
							that.epayshow = true;
							that.payshow = false;

						} else {
							if (res.data.msg == "接口请求异常，请联系管理员") {
								uni.showToast({
									title: '支付接口配置异常',
									icon: 'none'
								})
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}

						}


					},
					fail: function(res) {
						setTimeout(function() {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络不太好哦",
							icon: 'none'
						})
					}
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			setEPayType(text) {
				var that = this;
				that.ePayType = text;
				that.toEpayType = false;
			},
			aliPay() {
				var that = this;

				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				var data = {
					"num": that.num,
					"token": token
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					url: that.$API.scancodePayStar(),
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
						if (res.data.code == 1) {
							var url = res.data.data;
							that.alipayUrl = "alipays://platformapi/startapp?appId=20000067&url=" + encodeURI(
								url);
							that.codeImg = that.$API.qrCodeStar() + "?codeContent=" + url;
							that.isToPay = 1;
							that.payshow = false;
							that.topayshow = true;

							that.toAlipay();

						}
						if (res.data.msg == "接口请求异常，请联系管理员") {
							uni.showToast({
								title: '支付接口配置异常',
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}


					},
					fail: function(res) {
						setTimeout(function() {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "支付接口配置异常",
							icon: 'none'
						})
					}
				})
			},
			goBuyCode(url) {
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
				// #ifdef MP-WEIXIN
				uni.showToast({
					title: "小程序无法转跳",
					icon: 'none'
				})
				// #endif
			},
			wxPay() {
				var that = this;

				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				var data = {
					"price": that.num,
					"token": token
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					url: that.$API.WxPayStar(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						console.log(JSON.stringify(res));
						setTimeout(function() {
							uni.hideLoading();
						}, 1000);
						if (res.data.code == 1) {
							var url = res.data.data.data;
							that.wxpayUrl = url;
							that.codeImg = that.$API.qrCodeStar() + "?codeContent=" + url;
							that.isToPay = 1;
							that.payshow = false;
							that.topayshow = true;
							that.toWxpay();
						}
						if (res.data.msg == "接口请求异常，请联系管理员") {
							uni.showToast({
								title: '支付接口配置异常',
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
						//console.log(JSON.stringify(data.data))

					},
					fail: function(res) {
						setTimeout(function() {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "支付接口配置异常",
							icon: 'none'
						})
					}
				});
			},
			getset() {
				var that = this;
				uni.request({
					url: that.$API.SMchongzhiset(),
					method: 'GET',
					dataType: "json",
					success(res) {
						that.assetsname = res.data.assetsname;
						that.czof1 = res.data.czof1;
						that.czof2 = res.data.czof2;
						that.czof3 = res.data.czof3;
						that.czof4 = res.data.czof4;
						that.cztext1 = res.data.cztext1;
						that.cztext2 = res.data.cztext2;
						that.cztext3 = res.data.cztext3;
						that.cztext4 = res.data.cztext4;
					},
					fail(error) {
						console.log(error);
					}
				})
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
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "支付接口配置异常",
							icon: 'none'
						})
					}
				})
			},
			toPayType(i, k) {
				var that = this;
				if (i != 3) {
					that.payType = i;
					that.epaycur = 0;
					that.isToPay = 0;
					that.topayshow = false;
					that.codeImg = "";

				} else {
					if (k == 0) {
						that.setEPayType('alipay');
						that.epaycur = 1;
					}
					if (k == 1) {
						that.setEPayType('wxpay');
						that.epaycur = 2;
					}
					if (k == 2) {
						that.setEPayType('qqpay');
						that.epaycur = 3;
					}
					that.payType = i;
					that.isToPay = 0;
					that.codeImg = "";
					that.topayshow = false;
				}

			},
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
							that.vipPrice = res.data.data.vipPrice;
							that.scale = res.data.data.scale;
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
			okEvent() {
				var that = this;
				that.payType = 4;
				that.epaycur = 0;
				that.payshow = true;

			},
			goPayUrl(text) {
				var that = this;
				// #ifdef APP-PLUS
				plus.runtime.openURL(text)
				// #endif
				// #ifdef H5
				window.open(text)
				// #endif
			},
			ToCopy(text) {
				var that = this;
				// #ifdef APP-PLUS
				uni.setClipboardData({
					data: text,
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: "复制成功"
						})
					}
				});
				// #endif
				// #ifdef H5 
				let textarea = document.createElement("textarea");
				textarea.value = text;
				textarea.readOnly = "readOnly";
				document.body.appendChild(textarea);
				textarea.select();
				textarea.setSelectionRange(0, text.length);
				uni.showToast({ //提示
					title: "复制成功"
				})
				var result = document.execCommand("copy")
				textarea.remove();

				// #endif
			},
			toAlipay() {
				var that = this;
				var url = that.alipayUrl;
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			toWxpay() {
				var that = this;
				var url = that.wxpayUrl;
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
				// #ifdef MP
				that.dtImg();
				// #endif
			},
			dtImg() {
				var that = this;
				var url = that.codeImg;
				// #ifdef APP-PLUS
				uni.downloadFile({
					url: url,
					success: (res) => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									if (that.payType == 1) {
										uni.showToast({
											title: "微信不支持相册识别支付，请通过正常扫码完成。",
											icon: "none"
										});
									} else {
										uni.showToast({
											title: "保存成功",
											icon: "none"
										});
									}

								},
								fail: function() {
									uni.showToast({
										title: "保存失败，请稍后重试",
										icon: "none"
									});
								}
							});
						}
					}
				})
				// #endif
				// #ifdef H5
				uni.showToast({
					title: "请长按二维码图片保存",
					icon: "none"
				});
				// #endif
			},
			tokenPay() {
				var that = this;
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				if (that.cdknum == "") {
					uni.showToast({
						title: "请输入充值码！",
						icon: 'none'
					})
					return false;
				}
				var data = {
					"key": that.cdknum,
					"token": token
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					url: that.$API.tokenPayList(),
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
						if (res.data.code == 1) {

							that.kmshow = false;
							that.cdknum = '';
						}


					},
					fail: function(res) {
						setTimeout(function() {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络不太好哦",
							icon: 'none'
						})
					}
				})
			},
			pick(index) {
				this.cur = index;
				if (index !== 6 && index !== 7) {
					this.num = this.list[index].money; // Set num to selected predefined value
				} else if (index == 6) {
					this.num = ''; // Clear num for custom input
				} else if (index == 7&&this.czof3!=1) {
					this.num = '';
					uni.showToast({
						title: "兑换码充值已关闭",
						icon: 'none'
					})
				}  else if (index == 7&&this.czof3==1) {
					this.num = '';
					this.kmshow = true;
				} 
			},
		},
	};
</script>

<style lang="scss" scoped>

	.user {
		background-color: #f6f6f6;
		color: #333333;
	}

	.recharge-buttom-box {
		position: fixed;
		bottom: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 80rpx;
		padding-top: 20rpx;
		border-top: 4rpx dashed #e9e9e9;
		box-sizing: border-box;
		background-color: #fff;

		.buttom-left {
			font-size: 28rpx;
			display: flex;

			.buttom-left-money {
				font-weight: bold;
				font-size: 40rpx;
				margin-left: 20rpx;
				line-height: 38rpx;
			}

			.buttom-left-money::first-letter {
				font-weight: normal;
				font-size: 28rpx;
			}

			.buttom-left-money-two {
				font-weight: bold;
				font-size: 40rpx;
				margin-left: 20rpx;
				line-height: 38rpx;
			}

			.buttom-left-money-two-icon {
				font-weight: normal;
				font-size: 28rpx;
			}
		}

		.buttom-right {
			padding: 16rpx 58rpx;
			background: #333;
			color: #fff;
			border-radius: 50rpx;
			font-size: 28rpx;
			font-weight: bold;
		}
	}

	.buy {
		width: 100%;
		height: 100%;

		.title {
			display: flex;
			align-items: flex-end;
			padding: 42rpx 0 20rpx 50rpx;
			background-color: #ffffff;

			>image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 6rpx;
			}

			>text {
				font-size: 28rpx;
				color: #666666;
				line-height: 40rpx;
			}

			.num {
				font-family: 'D-DIN';
				font-size: 32rpx;
			}
		}

		.number {
			width: 100%;
			background-color: #ffffff;
			margin-top: 18rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.list {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 38rpx 40rpx 66rpx 40rpx;

				.item {
					width: 194rpx;
					height: 194rpx;
					background: #ffffff;
					box-shadow: 0rpx 0rpx 2rpx 0rpx #00000080;
					border-radius: 20rpx;
					margin-bottom: 44rpx;
					display: flex;

					.card {
						width: 194rpx;
						height: 194rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;

						.top {
							display: flex;
							align-items: center;
							padding: 0px 22rpx 22rpx 22rpx;

							>text {
								font-size: 32rpx;
								font-family: 'D-DIN';
								font-weight: 600;
								color: #666666;
								line-height: 44rpx;
								margin-right: 6rpx;
							}

							>image {
								width: 30rpx;
								height: 30rpx;
							}
						}

						.money {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;
							font-family: 'D-DIN';
							line-height: 34rpx;
							margin-top: 12rpx;
						}
					}

					.recommend {
						width: 112rpx;
						height: 36rpx;
						background: #e83a30;
						border-radius: 12rpx;
						position: absolute;
						text-align: center;
						margin-top: -18rpx;


						>text {
							font-size: 20rpx;
							font-weight: 500;
							color: #fff;
							line-height: 36rpx;
						}
					}
				}

				.real {
					background: #fff4e8;
					border: 2rpx solid #ffb469;
				}
				&:after {
					content: '';
					width: 194rpx;
				}
			}

			.sure {
				width: 582rpx;
				height: 80rpx;
				background: #ff6a5f;
				border-radius: 40rpx;
				text-align: center;

				>text {
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 600;
					color: #ffffff;
					line-height: 80rpx;
				}
			}
		}

		.tip {
			height: 394rpx;
			background: #ffffff;
			margin-top: 18rpx;
			padding: 40rpx;

			.titl {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 600;
				color: #666666;
				line-height: 40rpx;
				margin-bottom: 6rpx;
			}

			>view {
				>text {
					font-size: 22rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					color: #999999;
					line-height: 32rpx;
				}

				&:nth-child(2) {
					>text:nth-child(2) {
						color: #333333;
					}
				}

				&:nth-child(5) {
					>text:nth-child(2) {
						color: #ff6a5f;
						font-weight: 600;
						border-bottom: 2rpx solid #ff6a5f;
					}
				}
			}
		}
	}

	.money-input {
		width: 126rpx;
		height: 50rpx;
		border-bottom: 1rpx solid #ccc;
		padding: 10rpx;
		font-size: 24rpx;
		color: #666;
		text-align: center;
		margin-top: 10rpx;
	}

	.cdk-input {
		width: 100%;
		height: 54rpx;
		border-bottom: 1rpx solid #4d4d4d;
		padding: 10rpx;
		font-size: 24rpx;
		color: #666;
		margin-top: 30rpx;
		margin-bottom: 15rpx;
	}

	.pay-box {
		width: 100%;
		padding: 20rpx;
		display: flex;
		justify-content: center;
		border: 2rpx solid #ababab;
		margin: 30rpx 0 30rpx 0;
		border-radius: 29rpx;
	}

	.pay-box-e {
		width: 100%;
		padding: 20rpx 15rpx;
		display: flex;
		justify-content: center;
		border: 2rpx solid #ababab;
		margin: 30rpx 0 30rpx 0;
		border-radius: 29rpx;
	}

	.pay-box-check {
		background: #fff4e8;
		border: 2rpx solid #ffb469;
	}

	.hr-solid-content {
		color: #a2a9b6;
		border: 0;
		font-size: 12px;
		padding: 1em 0;
		position: relative;
	}

	.hr-solid-content::before {
		content: attr(data-content);
		position: absolute;
		padding: 0 1ch;
		line-height: 1px;
		border: solid #d0d0d5;
		border-width: 0 9vw;
		width: fit-content;
		/* for IE浏览器 */
		white-space: nowrap;
		left: 50%;
		transform: translateX(-50%);
	}
</style>