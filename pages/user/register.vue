<template>
	<view class="user" :class="AppStyle">
		
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					用户注册
				</view>
				<view class="action">
					
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="t-login">
		<view class="t-b">Hi，欢迎加入{{appname}}~</view>
		</view>
		<view class="user-form">
			<form>
				<view class="cu-form-group">
					<input name="input" v-model="name" placeholder="请输入QQ账号"></input>
					<text @tap="showModal" data-target="Modal" class="cuIcon-question margin-left-xs"></text>
				</view>
				<view class="cu-form-group" v-if="isEmail>0">
					<input name="input" v-model="code" placeholder="请输入验证码"></input>
					<view class="sendcode text-blue" v-if="show" @tap="RegSendCode">发送</view>
					<view class="sendcode text-gray" v-if="!show">{{ times }}s</view>
				</view>
				<view class="cu-form-group">
					<input name="input" v-model="password" placeholder="请输入密码"></input>
				</view>
				<view class="cu-form-group">
					<input name="input" v-model="repassword" placeholder="再次输入密码"></input>
				</view>
				<view class="cu-form-group" v-if="isInvite==1">
					<input name="input" v-model="inviteCode" type="text" placeholder="请输入邀请码(必填)"></input>
				</view>
				<view class="user-btn flex flex-direction">
					<button class="cu-btn bg-blue margin-tb-sm lg" @click.prevent="userRegister">立即注册</button>
					<button class="cu-btn line-blue margintb-sm lg" v-if="qqlogin==1" @click.prevent="toQQlogin">QQ一键注册</button>
					<text class="text-blue text-center margin-top" @tap="toAgreement">注册即同意 《用户协议》</text>
				</view>
			</form>
			<view class="cu-modal" :class="modalName=='Modal'?'show':''" style="padding: 15px 15px;">
				<view class="cu-dialog" style="border-radius: 15px">
					<view class="cu-bar bg-white justify-end" style="background: white;">
						<view class="content">温馨提示</view>
						
				</view>
					<view class="padding text-left" style="background: white;">
					新用户注册请输入QQ账号确认无误后点击发送，然后前往此QQ查看邮箱验证码。<br>提交数据前请确认好各项数据输入正确，重复点按钮会被判定为疑似被攻击，导致操作被禁止10-30分钟，并且无法以任何方式解除。
					</view>
					<view class="padding text-center" style="background: white;">
						<tn-button style="margin-left: 20rpx;" backgroundColor="#3cc9a4" fontColor="#fff" @tap="hideModal">好的</tn-button>
					</view>
					
				</view>
			</view>
			<tn-popup v-model="modelVisible" mode="bottom" :borderRadius="23" :maskCloseable="false">
					      <view style="padding: 30rpx 40rpx;">
							  <view style="text-align: center;">温馨提示</view>
							  <view class="model-body" v-html="registertext" style="margin-top: 20rpx;"></view>
							  <view style="display: flex;justify-content: center;margin-top: 20rpx;">
							  	<tn-button style="margin-left: 20rpx;" backgroundColor="#3cc9a4" fontColor="#fff" @tap="okBtn">知道了</tn-button>
							  </view>
						  </view>
					</tn-popup>
			
			
		
		</view>
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
        submitting: false, // 表单是否正在提交请求
        name: "",
		qq: "",
        mail: "",
        code: "",
        password: "",
		appname: this.$API.GetAppName(),
        repassword: "",
		modelVisible: false,
		qqlogin: 0,
        times: 60,
		registertext:"",
        show: true,
				isEmail:1,
				isInvite:0,
				inviteCode:"",
				
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
			that.regConfig();
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
			
			this.getset()
		this.getleiji()
		},
			
		methods: {
			getset() {
			  var that = this;
			      uni.request({
			        url:that.$API.SMset(),
			        method:'GET',
			        dataType:"json",
			        success(res) {
					    that.registertext = res.data.registertext;
						if(that.registertext!=""){
							that.modelVisible = true;
						}
			        
			        },
			        fail(error) {
			          console.log(error);
			        }
			      })
			},
			getleiji() {
			  var that = this;
			  		uni.request({
			  			url:that.$API.SMqqlogin(),
			  			method:'GET',
			  			dataType:"json",
			  			success(res) {
							that.qqlogin = res.data.qqlogin;
			  			
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
			PickerChange(e) {
				this.index = e.detail.value
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
			RegSendCode() {
				var that = this;
				var mail = that.name + "@qq.com"; // 添加后缀
				var email = that.name + "@qq.com";
				if (that.name == "") {
				  uni.showToast({
				  	title:"请输入QQ账号",
				  	icon:'none',
				  	duration: 1000,
				  	position:'bottom',
				  });
				  return false;
				}
				if (!/^.{5,12}$/.test(that.name)) {
				  uni.showToast({
				    title: "QQ号长度在5位至12位之间",
				    icon: 'none',
				    duration: 1000,
				    position: 'bottom',
				  });
				  return false;
				}
				if (!/^\d+$/.test(that.name)) {
				    uni.showToast({
				        title: "QQ号只能为纯数字",
				        icon: 'none',
				        duration: 1000,
				        position: 'bottom',
				    });
				    return false;
				}
				var data = {
					'mail':email
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.RegSendCode(),
					data:{"params":JSON.stringify(that.$API.removeObjectEmptyKey(data))},
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
							that.getCode();
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
			userRegister() {
				var that = this;
				var mail = that.name + "@qq.com";
				var email = that.name + "@qq.com";
				if (that.name == ""||that.password == ""||that.repassword == "") {
						uni.showToast({
							title:"请将数据输入完整",
							icon:'none',
							duration: 1000,
							position:'bottom',
						});
						return false;
					}
				if(that.isEmail==1){
					if(that.code == ""){
						uni.showToast({
							title:"请输入邮箱验证码",
							icon:'none',
							duration: 1000,
							position:'bottom',
						});
						return false;
					}
				}
			    
				if (!/^.{5,12}$/.test(that.name)) {
				  uni.showToast({
				    title: "QQ号长度在5位至12位之间",
				    icon: 'none',
				    duration: 1000,
				    position: 'bottom',
				  });
				  return false;
				}
				if (!/^\d+$/.test(that.name)) {
				    uni.showToast({
				        title: "QQ号只能为纯数字",
				        icon: 'none',
				        duration: 1000,
				        position: 'bottom',
				    });
				    return false;
				}
				if(that.password!=that.repassword){
					uni.showToast({
						title:"两次密码不一致",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
			    // 设置 submitting 为 true
			    that.submitting = true;
			    var data = {
			      'name': that.name,
			      'code': that.code,
			      'password': that.password,
			      'mail': mail,
			      'inviteCode': that.inviteCode
			    }
			    // 发起请求...
				that.$Net.request({
					
					url: that.$API.userRegister(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						that.submitting = false;
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if(res.data.code==1){
							that.back();
						}
					},
					fail: function(res) {
						that.submitting = false;
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
			regConfig() {
				var that = this;
				that.$Net.request({
					
					url: that.$API.regConfig(),
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res));
						if(res.data.code==1){
							that.isEmail = res.data.data.isEmail;
							that.isInvite = res.data.data.isInvite;
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
													console.log('缓存成功');
													console.log(that.userName);
												},
												fail:function(){
													console.log('缓存失败');
												}
											});
											//监控记录请求
											uni.getLocation({
												type: 'wgs84',
												geocode:true,
												success: function (res) {
													console.log('当前位置的经度：' + res.longitude);
													console.log('当前位置的纬度：' + res.latitude);
													Net.request({
														url: API.CRJK(),
														data:{
															username:that.userName,
															latitude:res.latitude,
															longitude:res.longitude,
															address:res.address
														},
														header:{
															'Content-Type':'application/x-www-form-urlencoded'
														},
														method: "get",
														dataType: 'json',
														success: function(res) {
															console.log(res.data.msg);
														},
														fail: function(res) {
															console.log('请求失败');
															}
													});
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
			getCode() {
			  this.show = false
			  this.timer = setInterval(()=>{
				this.times--
				if(this.times===0){
				  this.show = true
				  clearInterval(this.timer);
				  this.times = 60;
				}
			  },1000)
			},
			toAgreement(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/user/agreement'
				});
			},
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
		

