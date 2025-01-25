<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					用户登录
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="t-login">
		<view class="t-b">Hi，欢迎回来~</view>
		</view>
		<view class="user-form">
			<form>
				<view class="cu-form-group">
					<input name="input" placeholder="账号" v-model="userName"></input>
				</view>
				<view class="cu-form-group">
					<input name="input" placeholder="密码" type="password" v-model="password"></input>
				</view>
				<view class="user-btn flex flex-direction">
					<button class="cu-btn bg-blue margin--sm lg" @tap="login">立即登录</button>
					<button class="cu-btn line-blue margin-tb-sm lg" @tap="toRegister">注册账号</button>
				</view>
			</form>
		</view>

		<!-- #ifdef APP-PLUS -->
		<view class="api-login" :class="[
			{'grid col-1': (qqlogin + wxlogin + wblogin) === 1},
			{'grid col-2': (qqlogin + wxlogin + wblogin) === 2}, 
			{'grid col-3': (qqlogin + wxlogin + wblogin) === 3}
		]">
		
		
			<view class="api-login-box" @tap="toQQlogin" v-if="qqlogin==1">
				<image src="../../static/icon_qq.png"></image>
			</view>
			<view class="api-login-box" @tap="toWXlogin" v-if="wxlogin==1">
				<image src="../../static/icon_weixin.png"></image>
			</view>
			<view class="api-login-box" @tap="toWBlogin" v-if="wblogin==1">
				<image src="../../static/icon_weibo.png"></image>
			</view>
		</view>
		<!-- #endif -->
		
		<view class="api-login-box" style="margin: 10px;">
			<view class="api-login-box">
				<text @tap="toFoget" style="color: #989898;">忘记密码</text>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''" style="padding: 15px 15px;">
			<view class="cu-dialog" style="border-radius: 15px">
				<view class="cu-bar bg-white justify-end" style="background: white;">
					<view class="content">温馨提示</view>
					
			</view>
				<view class="padding text-left" style="background: white;">
				登录时候提交数据前请确认好各项数据输入正确，重复点按钮会被判定为疑似被攻击，导致操作被禁止10-30分钟，并且无法以任何方式解除。
				</view>
				<view class="padding text-center" style="background: white;">
					<tn-button style="margin-left: 20rpx;" backgroundColor="#3cc9a4" fontColor="#fff" @tap="hideModal">好的</tn-button>
				</view>
				
			</view>
		</view>
		<tn-popup v-model="modelVisible" mode="bottom" :borderRadius="23" :maskCloseable="false">
				      <view style="padding: 30rpx 40rpx;">
						  <view style="text-align: center;">温馨提示</view>
						  <view class="model-body" v-html="logintext" style="margin-top: 20rpx;"></view>
						  <view style="display: flex;justify-content: center;margin-top: 20rpx;">
						  	<tn-button style="margin-left: 20rpx;" backgroundColor="#3cc9a4" fontColor="#fff" @tap="okBtn">知道了</tn-button>
						  </view>
					  </view>
				</tn-popup>
		
		
	</view>			
</template>

<script>
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	var API = require('../../utils/api')
	var Net = require('../../utils/net')
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
			AppStyle:this.$store.state.AppStyle,
				userName:"",
				password:"",
				logintext:"",
				modelVisible: false,
				wxlogin: 0,
				qqlogin: 0,
				wblogin: 0,
				modalName: null,
			}
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			
		},
		onLoad() {
			const modelViewTime = uni.getStorageSync('modelView');
						if(modelViewTime){
							console.log(modelViewTime);
							const nowDate = +new Date();
							const isVisible = nowDate - modelViewTime > 1000;
							if(!isVisible) {
								this.modelVisible = false;
							}
						}
			
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
		},
		
		mounted() {
		this.getleiji()
		this.getset()
		},
		methods: {
			
			getleiji() {
			  var that = this;
			  		uni.request({
			  			url:that.$API.SMqqlogin(),
			  			method:'GET',
			  			dataType:"json",
			  			success(res) {
							that.qqlogin = res.data.qqlogin;
							that.wxlogin = res.data.wxlogin;
							that.wblogin = res.data.wblogin;
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
			okBtn() {
							const nowDate = +new Date();
							uni.setStorageSync('modelView', nowDate);
							this.cancleBtn();
						},
			cancleBtn() {
							this.modelVisible = false;
						},
			getCID() {
				var that = this;
				let cid = ''
				// #ifdef APP-PLUS
				let pinf = plus.push.getClientInfo();
				cid = pinf.clientid;
				if(cid){
					that.setClientId(cid);
				}
				// #endif
			},
			setClientId(cid){
				var that = this;
				var token = "";
				if(localStorage.getItem('token')){
					
					token = localStorage.getItem('token');
				}else{
					return false;
				}
				that.$Net.request({
					
					url: that.$API.setClientId(),
					data:{
						"clientId":cid,
						"token":token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
			
							
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
			getset() {
			  var that = this;
			      uni.request({
			        url:that.$API.SMset(),
			        method:'GET',
			        dataType:"json",
			        success(res) {
					    that.logintext = res.data.logintext;
						if(that.logintext!=""){
							that.modelVisible = true;
						}
			        },
			        fail(error) {
			          console.log(error);
			        }
			      })
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			toMedia(){
				uni.navigateTo({
				    url: '/pages/user/media'
				});
			},
			login() {
				var that = this;
				if (this.password == ""||this.userName == "") {
					uni.showToast({
					    title:"请输入正确完整",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				if (/select|update|delete|exec|count|'|"|=|;|>|<|%/i.test(this.userName)) {
				  uni.showToast({
				    title: "账号存在注入风险",
				    icon: 'none',
				    duration: 1000,
				    position: 'bottom',
				  });
				  return false;
				}
			
				var data = {
					name: this.userName,
					password: this.password,
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.userLogin(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if(res.data.code==1){
							//保存用户信息
							uni.setStorage({
								key: 'username',
								data: that.userName,
								success: function () {
									console.log('缓存成功');
									console.log(that.userName);
								},
								fail:function(){
									console.log('缓存失败');
								}
							});
							localStorage.setItem('userinfo',JSON.stringify(res.data.data));
							localStorage.setItem('token',res.data.data.token);
							that.getCID();
							var timer = setTimeout(function() {
								uni.switchTab({
									url: '/pages/home/home'
								})
								clearTimeout('timer')
							}, 1000);
							
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
			toRegister(){
				var that = this;
				
				uni.navigateTo({
					url: '/pages/user/register'
				});
			},
			toFoget(){
				var that = this;
				uni.navigateTo({
					url: '/pages/user/foget'
				});
			},
			toQQlogin(){
				//QQ登陆
				//后端直接根据access_token来判断用户的唯一性。
				var that = this;
				uni.login({
					provider: 'qq',
					success: resp => {
						var js_code = resp.code;
						var access_token = "";
						// #ifdef APP-PLUS
						access_token = resp.authResult.access_token;
						// #endif
						uni.getUserInfo({
							provider: 'qq',
							success: function(infoRes) {
								
								var formdata = {
									nickName: infoRes.userInfo.nickname,
									//gender: infoRes.userInfo.gender == '男' ? 1 : 2,
									appLoginType:"qq",
				                    headImgUrl: infoRes.userInfo.figureurl_qq_2,
									// openId: infoRes.userInfo.openId,
									// accessToken: access_token
								};
								// #ifdef APP-PLUS
								formdata.openId=infoRes.userInfo.openId;
								formdata.accessToken=access_token,
								formdata.type = "app";
								// #endif
								// #ifdef MP-QQ
								formdata.type = "applets";
								formdata.js_code = js_code;
								// #endif
								uni.showLoading({
									title: "加载中"
								});
								that.$Net.request({
									
									url: that.$API.userApi(),
									data:{"params":JSON.stringify(that.$API.removeObjectEmptyKey(formdata))},
									header:{
										'Content-Type':'application/x-www-form-urlencoded'
									},
									method: "get",
									dataType: 'json',
									success: function(res) {
										console.log(res)
										setTimeout(function () {
											uni.hideLoading();
										}, 1000);
										uni.showToast({
											title: res.data.msg,
											icon: 'none'
										})
										if(res.data.code==1){
											uni.setStorage({
												key: 'username',
												data: that.userName,
												
												success: function () {
												},
												fail:function(){
													console.log('缓存失败');
												}
											});
											//保存用户信息
											
											localStorage.setItem('userinfo',JSON.stringify(res.data.data));
											localStorage.setItem('token',res.data.data.token);
											
											var timer = setTimeout(function() {
												uni.switchTab({
													url: '/pages/home/home'
												})
												clearTimeout('timer')
											}, 1000)
											if (localStorage.getItem('userinfo')) {
											  var userInfo = JSON.parse(localStorage.getItem('userinfo'));
											  that.username = userInfo.name;
											
													
											}
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
								
							}
						});
					},
					fail: err => {
						uni.showToast({
							title: '请求出错啦！',
							icon: 'none',
							duration: 3000
						});
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
					}
				});
			},
			toWexinlogin(){
				var that = this;
				//微信登陆
				//后端直接根据unionId来判断用户的唯一性。
				
				uni.login({
					provider: 'weixin',
					success: res => {
						
						var js_code = res.code;
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								
								let formdata = {
									nickName: infoRes.userInfo.nickName,
									//gender: infoRes.userInfo.gender,
									appLoginType:"weixin",
				                    headImgUrl: infoRes.userInfo.avatarUrl,
									// openId: infoRes.userInfo.openId,
									// accessToken: infoRes.userInfo.unionId,
								};
								// #ifdef APP-PLUS
								formdata.openId=infoRes.userInfo.openId;
								formdata.accessToken=infoRes.userInfo.unionId,
								formdata.type = "app";
								formdata.js_code = js_code;
								// #endif
								// #ifdef MP-WEIXIN
								formdata.type = "applets";
								formdata.js_code = js_code;
								// #endif
								uni.showLoading({
									title: "加载中"
								});
								that.$Net.request({
									
									url: that.$API.userApi(),
									data:{"params":JSON.stringify(that.$API.removeObjectEmptyKey(formdata))},
									header:{
										'Content-Type':'application/x-www-form-urlencoded'
									},
									method: "get",
									dataType: 'json',
									success: function(res) {
										setTimeout(function () {
											uni.hideLoading();
										}, 1000);
										uni.showToast({
											title: res.data.msg,
											icon: 'none'
										})
										if(res.data.code==1){
											uni.setStorage({
												key: 'username',
												data: that.userName,
												success: function () {
													console.log('缓存成功');
													console.log(that.userName);
												},
												fail:function(){
													console.log('缓存失败');
												}
											});
											//保存用户信息
											localStorage.setItem('userinfo',JSON.stringify(res.data.data));
											localStorage.setItem('token',res.data.data.token);
											var timer = setTimeout(function() {
												uni.switchTab({
													url: '/pages/home/home'
												})
												clearTimeout('timer')
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
								
							}
						});
					},
					fail: err => {
						console.log(err)
						uni.showToast({
							title: '请求出错啦！',
							icon: 'none',
							duration: 3000
						});
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
					}
				});
			},
			toWeibologin(){
				var that = this;
				//微博登陆
				//后端直接根据access_token来判断用户的唯一性。
				
				uni.login({
					provider: 'sinaweibo',
					success: res => {
						var access_token = '';
						access_token = res.authResult.access_token;
						uni.getUserInfo({
							provider: 'sinaweibo',
							success: function(infoRes) {
								var formdata = {
									nickName: infoRes.userInfo.nickname,
									//gender: infoRes.userInfo.gender == 'm' ? 1 : 2,
									headImgUrl: infoRes.userInfo.avatar_large,
									openId: infoRes.userInfo.id,
									accessToken: access_token,
									appLoginType: 'SINAWEIBO'

								};
								uni.showLoading({
									title: "加载中"
								});
								that.$Net.request({
									
									url: that.$API.userApi(),
									data:{"params":JSON.stringify(that.$API.removeObjectEmptyKey(formdata))},
									header:{
										'Content-Type':'application/x-www-form-urlencoded'
									},
									method: "get",
									dataType: 'json',
									success: function(res) {
										setTimeout(function () {
											uni.hideLoading();
										}, 1000);
										uni.showToast({
											title: res.data.msg,
											icon: 'none'
										})
										if(res.data.code==1){
											uni.setStorage({
												key: 'username',
												data: that.userName,
												success: function () {
													console.log('缓存成功');
													console.log(that.userName);
												},
												fail:function(){
													console.log('缓存失败');
												}
											});
											//保存用户信息
											localStorage.setItem('userinfo',JSON.stringify(res.data.data));
											localStorage.setItem('token',res.data.data.token);
											var timer = setTimeout(function() {
												uni.switchTab({
													url: '/pages/home/home'
												})
												clearTimeout('timer')
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
							}
						});
					},
					fail: err => {
						uni.showToast({
							title: '请求出错啦！',
							icon: 'none',
							duration: 3000
						});
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
					}
				});
			}
			
		}
	}
	
</script>

<style>
			.img-a {
				position: absolute;
				width: 100%;
				top: -280rpx;
				right: -100rpx;
				background-color: url('/static/login/2.png');
			}
			.img-b {
				position: absolute;
				width: 50%;
				bottom: 0;
				left: -50rpx;
				margin-bottom: -300rpx;
				background-color: url('/static/login/bg1.png');
			}
			.t-login {
				position: relative;
				width: 600rpx;
				margin: 0 auto;
				font-size: 28rpx;
				color: #000;
			}
			
			.t-login button {
				font-size: 28rpx;
				background: #5677fc;
				color: #fff;
				height: 90rpx;
				line-height: 90rpx;
				border-radius: 50rpx;
				box-shadow: 0 5px 7px 0 rgba(86, 119, 252, 0.2);
			}
			
			.t-login input {
				padding: 0 20rpx 0 120rpx;
				height: 90rpx;
				line-height: 90rpx;
				/* margin-bottom: 50rpx; */
				background: #f8f7fc;
				border: 1px solid #e9e9e9;
				font-size: 28rpx;
				border-radius: 50rpx;
			}
			
			.t-login .t-a {
				position: relative;
			}
			
			.t-login .t-a image {
				width: 60rpx;
				height: 40rpx;
				position: absolute;
				left: 40rpx;
				top: 28rpx;
				border-right: 2rpx solid #dedede;
				padding-right: 20rpx;
			}
			
			.t-login .t-b {
				text-align: left;
				font-size: 19px;
				color: #313131;
				padding: 35px 0 0px 0;
				font-weight: bold;
			}
			
			.t-login .t-c {
				position: absolute;
				right: 22rpx;
				top: 22rpx;
				background: #5677fc;
				color: #fff;
				font-size: 24rpx;
				border-radius: 50rpx;
				height: 50rpx;
				line-height: 50rpx;
				padding: 0 25rpx;
			}
			
			.t-login .t-d {
				text-align: center;
				color: #999;
				margin: 80rpx 0;
			}
			
			.t-login .t-e {
				text-align: center;
				width: 250rpx;
				margin: 80rpx auto 0;
			}
			
			.t-login .t-g {
				float: left;
				width: 100%;
			}
			
			.t-login .t-e image {
				width: 50rpx;
				height: 50rpx;
			}
			
			.t-login .t-f {
				text-align: center;
				margin: 200rpx 0 0 0;
				color: #666;
			}
			
			.t-login .t-f text {
				margin-left: 20rpx;
				color: #aaaaaa;
				font-size: 27rpx;
			}
			
			.t-login .uni-input-placeholder {
				color: #000;
			}
			
			.cl {
				zoom: 1;
			}
			.s1{
					
					float: right;
				}
			.cl:after {
				clear: both;
				display: block;
				visibility: hidden;
				height: 0;
				content: '\20';
			}
		</style>
