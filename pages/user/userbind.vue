<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					第三方账号绑定
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		
		<view class="cu-list menu bind">
			
			<view class="cu-item margin-top" v-if="qqlogin==1">
				<view class="content">
					<image src="../../static/icon_qq.png"></image><text>QQ绑定</text>
				</view>
				<view class="action">
					<text class="text-gray" v-if="userBind.qqBind==0" @tap="toQQBind">未绑定</text>
					<text class="text-blue" v-else>已绑定</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-item" v-if="wxlogin==1">
				<view class="content">
					<image src="../../static/icon_weixin.png"></image>
					<text>微信绑定</text>
				</view>
				<view class="action" @tap="toWexinBind">
					<text class="text-gray" v-if="userBind.weixinBind==0">未绑定</text>
					<text class="text-blue" v-else>已绑定</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-item" v-if="wblogin==1">
				<view class="content">
					<image src="../../static/icon_weibo.png"></image>
					<text>微博绑定</text>
				</view>
				<view class="action" @tap="toWeiboBind">
					<text class="text-gray" v-if="userBind.weiboBind==0">未绑定</text>
					<text class="text-blue" v-else>已绑定</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-item margin-top" v-if="qqlogin==0&&wxlogin==0&&wblogin==0">
				<view class="content">
					<image src="../../static/icon_qq.png"></image><text>管理员已关闭该功能</text>
				</view>
			</view>
			
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
				
				qqlogin: 0,
				wxlogin: 0,
				wblogin: 0,
				token:'',
				
				userBind:{
					"qqBind":0,
					"weixinBind":0,
					"weiboBind":0,
				}
			}
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		created() {
		  var that = this;
		this.getleiji();
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			if(localStorage.getItem('token')){
				
				that.token = localStorage.getItem('token');
				that.userBindStatus();
			}else{
				that.token = "";
			}
			
		},
		
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
		},
		mounted() {
		this.getleiji()
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
			userBindStatus() {
				var that = this;
				that.$Net.request({
					
					url: that.$API.userBindStatus(),
					data:{
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.userBind = res.data.data;
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
			toQQBind(){
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
									
									url: that.$API.apiBind(),
									data:{
										"params":JSON.stringify(that.$API.removeObjectEmptyKey(formdata)),
										"token":that.token
									},
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
											if (localStorage.getItem('userinfo')) {
											  var userInfo = JSON.parse(localStorage.getItem('userinfo'));
											  that.username = userInfo.name;
													
													
												}
											that.userBindStatus();
											
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
						uni.showLoading({
							title: "加载中"
						});
					}
				});
			},
			toWexinBind(){
				//微信登陆
				//后端直接根据unionId来判断用户的唯一性。
				var that = this;
				
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
								// #endif
								// #ifdef MP-WEIXIN
								formdata.type = "applets";
								formdata.js_code = js_code;
								// #endif
								uni.showLoading({
									title: "加载中"
								});
								that.$Net.request({
									
									url: that.$API.apiBind(),
									data:{
										"params":JSON.stringify(that.$API.removeObjectEmptyKey(formdata)),
										"token":that.token
									},
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
											that.userBindStatus();
											
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
						uni.showLoading({
							title: "加载中"
						});
					}
				});
			},
			toWeiboBind(){
				//微博登陆
				//后端直接根据access_token来判断用户的唯一性。
				var that = this;
				
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
									
									url: that.$API.apiBind(),
									data:{
										"params":JSON.stringify(that.$API.removeObjectEmptyKey(formdata)),
										"token":that.token
									},
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
											that.userBindStatus();
											
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
						uni.showLoading({
							title: "加载中"
						});
					}
				});
			}
		}
	}
</script>

<style>
</style>
