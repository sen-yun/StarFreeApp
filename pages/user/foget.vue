<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					找回密码
				</view>
				<view class="action">
					
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<block v-if="isEmail==1||isEmail==2">
			<view class="t-login">
			<view class="t-b">Hi，等你好久了~</view>
			</view>
			<view class="user-form">
			<form>
				<view class="cu-form-group">
					<input name="input" v-model="name" placeholder="请输入账号"></input>
					<view @tap="showModal" data-target="Modal"><text class="cuIcon-question margin-left-xs sendcode"></text></view>
				</view>
				<view class="cu-form-group">
					<input name="input" v-model="code" placeholder="请输入验证码"></input>
					<view class="sendcode text-blue" v-if="show" @tap="SendCode">发送</view>
					<view class="sendcode text-gray" v-if="!show">{{ times }}s</view>
				</view>
				<view class="cu-form-group">
					<input name="input" v-model="password" type="password" placeholder="输入新密码"></input>
				</view>
				<view class="cu-form-group">
					<input name="input" v-model="repassword" type="password" placeholder="再次输入密码"></input>
				</view>
				<view class="user-btn flex flex-direction">
					<button class="cu-btn bg-blue margin-tb-sm lg" @tap="userFoget">确认修改</button>
				</view>
			</form>
		</view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''" style="padding: 15px 15px;">
			<view class="cu-dialog" style="border-radius: 15px">
				<view class="cu-bar bg-white justify-end" style="background: white;">
					<view class="content">温馨提示</view>
					
			</view>
				<view class="padding text-left" style="background: white;">
				请输入第一次注册时的账号，若无法找回请联系客服。
				</view>
				<view class="padding text-center" style="background: white;">
					<tn-button style="margin-left: 20rpx;" backgroundColor="#3cc9a4" fontColor="#fff" @tap="hideModal">好的</tn-button>
				</view>
				
			</view>
		</view>
		</block>
		<block v-else>
			<view class="t-login">
			<view class="t-b">管理员已关闭邮箱发信功能，暂不支持自助找回密码，请联系管理员！</view>
			</view>
		</block>
		

		
		<tn-popup v-model="modelVisible" mode="bottom" :borderRadius="23" :maskCloseable="false">
				      <view style="padding: 30rpx 40rpx;">
						  <view style="text-align: center;">温馨提示</view>
						  <view class="model-body" v-html="fogettext" style="margin-top: 20rpx;"></view>
						  <view style="display: flex;justify-content: center;margin-top: 20rpx;">
						  	<tn-button style="margin-left: 20rpx;" backgroundColor="#3cc9a4" fontColor="#fff" @tap="okBtn">知道了</tn-button>
						  </view>
					  </view>
				</tn-popup>
	
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
			isEmail:3,
				times: 60,
				show:true,
				modelVisible: false,
				fogettext:"",
				name:"",
				code:"",
				password:"",
				repassword:"",
				
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
			var that = this;
			const modelViewTime = uni.getStorageSync('modelView');
						if(modelViewTime){
							console.log(modelViewTime);
							const nowDate = +new Date();
							const isVisible = nowDate - modelViewTime > 1000;
							if(!isVisible) {
								that.modelVisible = false;
							}
						}
						that.regConfig();
			
			// #ifdef APP-PLUS || MP
			that.NavBar = that.CustomBar;
			// #endif
		},
		mounted() {
			
			this.getset();
		},
		methods: {
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
					    that.fogettext = res.data.fogettext;
						if(that.fogettext!=""){
							that.modelVisible = true;
						}
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
			userFoget() {
				var that = this;
				if (that.name == ""||that.code == ""||that.password == ""||that.repassword == "") {
					uni.showToast({
						title:"请输入正确的参数",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
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
				var data = {
					'name':that.name,
					'code':that.code,
					'password':that.password,
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.userFoget(),
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
							that.back();
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
			toMedia(){
				uni.navigateTo({
				    url: '/pages/user/media'
				});
			},
			SendCode() {
				var that = this;
				if (that.name == "") {
					uni.showToast({
						title:"请输入账号",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				if (/select|update|delete|exec|count|'|"|=|;|>|<|%/i.test(that.name)) {
				  uni.showToast({
				    title: "账号存在注入风险",
				    icon: 'none',
				    duration: 1000,
				    position: 'bottom',
				  });
				  return false;
				}
				var data = {
					'name':that.name
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.SendCode(),
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
		
