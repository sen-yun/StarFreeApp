<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					{{assetsname}}提现
				</view>
				<view class="action" @tap="userwithdrawlist">
					<text class="cuIcon-list"></text>
				</view>
			</view>
		</view>
		<view :style="{'padding':NavBar + 'px 10px 0px 10px'}"></view>
		<view class="withdraw-container">
			<view class="assets-card">
				<view class="assets-title">当前可用{{assetsname}}</view>
				<view class="assets-amount">{{assets}}</view>
			</view>
			
			<view class="form-section">
				<view class="cu-form-group">
					<view class="title">提现{{assetsname}}</view>
					<input 
						class="amount-input"
						placeholder="请输入提现数量" 
						name="input" 
						type="number" 
						v-model="num"
					/>
				</view>
			</view>

			<view class="action-buttons">
				<button class="withdraw-btn" @tap="userwithdraw">立即提现</button>
				<button class="setting-btn" @tap="topay">收款码设置</button>
			</view>

			<view class="notice-section">
				<view class="notice-title">
					<text class="cuIcon-info"></text>
					提现须知
				</view>
				<view class="notice-item">
					<text class="dot"></text>
					提现申请将在<text class="highlight">24小时</text>内审核并打款
				</view>
				<view class="notice-item">
					<text class="dot"></text>
					提现比例 1:<text class="highlight">{{scale}}</text>，最低提现<text class="highlight">{{tixianed}}</text>{{assetsname}}
				</view>
				<view class="notice-item">
					<text class="dot"></text>
					手续费率：<text class="highlight">{{tixiansx}}%</text>
				</view>
				<view class="notice-item">
					<text class="dot"></text>
					审核期间不会扣除{{assetsname}}
				</view>
			</view>
		</view>

		<!--  #ifdef MP -->
		<view class="float-button" @tap="userwithdraw">
			<text class="cuIcon-upload"></text>
		</view>
		<!--  #endif -->
	</view>
</template>

<script>
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
			AppStyle:this.$store.state.AppStyle,
				tixiansx:"",
				num:"",
				assetsname:"",
				modalName:null,
				tixianed:1000,
				token:'',
				assets:"",
				scale:0,
				
			}
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		onShow(){
			var that = this;
			this.getset();
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			that.userStatus();
			that.getVipInfo();
		},
		onLoad() {
			var that = this;
			this.getset();
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
		},
		methods: {
			getset() {
			  var that = this;
			      uni.request({
			        url:that.$API.SMset(),
			        method:'GET',
			        dataType:"json",
			        success(res) {
					  that.tixianed = res.data.tixianed;
					  that.assetsname = res.data.assetsname;
					  that.tixiansx = res.data.tixiansx;
			        },
			        fail(error) {
			          console.log(error);
			        }
			      })
			},
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			userwithdrawlist(){
				var that = this;
				
				uni.navigateTo({
					url: '/pages/user/userwithdrawlist'
				});
			},
			userStatus() {
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				that.$Net.request({
					
					url: that.$API.userStatus(),
					data:{
						"token":token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						
						if(res.data.code==1){
							that.assets = res.data.data.assets;
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
			userwithdraw() {
				var that = this;
				if(that.num==""){
					uni.showToast({
					    title:"请完成表单输入",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				if(Number(that.num)<Number(that.tixianed)){
					uni.showToast({
					    title:"最低提现"+that.tixianed+that.assetsname,
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"num":that.num,
					"token":token,
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.userWithdraw(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res))
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if(res.data.code==1){
							
							var timer = setTimeout(function() {
								that.back();
							}, 1000)
							
						}
					},
					fail: function(res) {
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络不太好哦",
							icon: 'none'
						})
						uni.stopPullDownRefresh()
					}
				})
			},
			topay(){
				uni.navigateTo({
				    url: '/pages/user/pay'
				});
			},
			getVipInfo(){
				var that = this;
				that.$Net.request({
					url: that.$API.getVipInfo(),
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.scale=res.data.data.scale;
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
		}
	}
</script>

<style>
.withdraw-container {
	padding: 20rpx;
}

.assets-card {
	background: linear-gradient(135deg, #4B7BEC, #3867D6);
	padding: 40rpx;
	border-radius: 16rpx;
	color: #fff;
	margin: 30rpx 0;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.assets-title {
	font-size: 28rpx;
	opacity: 0.9;
}

.assets-amount {
	font-size: 48rpx;
	font-weight: bold;
	margin-top: 20rpx;
}

.form-section {
	background: #fff;
	border-radius: 16rpx;
	margin: 30rpx 0;
	padding: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.cu-form-group {
	padding: 20rpx;
	border: none;
}

.amount-input {
	font-size: 32rpx;
}

.action-buttons {
	margin: 40rpx 0;
}

.withdraw-btn {
	background: #4B7BEC;
	color: #fff;
	padding: 25rpx;
	border-radius: 12rpx;
	font-size: 32rpx;
	margin-bottom: 20rpx;
	transition: all 0.3s;
}

.withdraw-btn:active {
	transform: scale(0.98);
}

.setting-btn {
	background: #fff;
	color: #4B7BEC;
	border: 2rpx solid #4B7BEC;
	padding: 25rpx;
	border-radius: 12rpx;
	font-size: 32rpx;
}

.notice-section {
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-top: 40rpx;
}

.notice-title {
	font-size: 30rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	color: #2d3436;
}

.notice-item {
	font-size: 26rpx;
	color: #636e72;
	margin: 16rpx 0;
	display: flex;
	align-items: flex-start;
}

.dot {
	width: 12rpx;
	height: 12rpx;
	background: #4B7BEC;
	border-radius: 50%;
	margin: 12rpx 16rpx 0 0;
}

.highlight {
	color: #4B7BEC;
	font-weight: bold;
	margin: 0 4rpx;
}

.float-button {
	position: fixed;
	right: 40rpx;
	bottom: 40rpx;
	width: 100rpx;
	height: 100rpx;
	background: #4B7BEC;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 40rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.2);
	transition: all 0.3s;
}

.float-button:active {
	transform: scale(0.95);
}
</style>
