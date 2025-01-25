<template>
	<view class="user" :class="AppStyle">
		
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					设置
				</view>
				<view class="action">
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="cu-list menu margin-top">
			<view class="cu-item" @tap="toLink('/pages/user/useredit')">
				<view class="content">
					<text>账号资料设置</text>
				</view>
				<view class="action">
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-item" v-if="qqlogin==1||wxlogin==1||wblogin==1" @tap="toQQbd">
				<view class="content">
					<text>绑定第三方账号</text>
				</view>
				<view class="action">
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-item" @tap="toPay">
				<view class="content">
					<text>提现收款码设置</text>
				</view>
				<view class="action">
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-item" @tap="toAddress">
				<view class="content">
					<text>收货地址设置</text>
				</view>
				<view class="action">
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-item" v-if="token!=''">
				<view class="content">
					<text>账号状态<text class="cuIcon-question margin-left-xs" @tap="showModal" data-target="Modal"></text></text>
				</view>
				<view class="action">
					<block v-if="systemBan==-1">
						<text class="text-blue">获取中…</text>
					</block>
					<block v-if="systemBan==1">
						<text class="text-red">功能限制</text>
					</block>
					<block v-if="systemBan==0">
						<text class="text-green">正常</text>
					</block>
				</view>
			</view>
			<view class="cu-item" @tap="rmlocal">
				<view class="content">
					<text>清除缓存</text>
				</view>
				<view class="action">
					<text class="text-gray">{{ localdata }}</text>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			
			<view class="cu-item" @tap="isUpdate(true)">
				<view class="content">
					<text>检查更新</text>
				</view>
				<view class="action">
					<text class="text-gray" v-if="Update==0">{{wgtVer}}</text>
					<text class="update-tips bg-red"  v-if="Update==1">发现新版本</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<view class="logout" v-if="token!=''" @tap="logout">
			<view class="logout-main">
				<text class="text-red">退出登录</text>
			</view>
			
		</view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">账号状态说明</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl text-left">
					发评论、帖子、动态时，千万不要频繁点发布按钮，否则会被禁止操作10-30分钟，并且无法以任何方式解除。
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
				NavBar: this.StatusBar + this.CustomBar,
				AppStyle: this.$store.state.AppStyle,
				
				modalName: null,
				
				localdata: '',
				systemBan: "-1",
				progress: 0,
				versionCode: 0,
				wgtVer: '',
				issqq: 0,
				Update: 0,
				versionUrl: "",
				qqlogin: 0,
				wxlogin: 0,
				wblogin: 0,
				userInfo: null,
				token: "",
				username: "",
			}
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			
			that.isUpdate(false);
			// #endif
			if(localStorage.getItem('userinfo')){
				
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				//that.userInfo.style = "background-image:url("+that.userInfo.avatar+");"
			}
			
			
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			if(localStorage.getItem('token')){
				
				that.token = localStorage.getItem('token');
			}
			that.get_cache_size();
			that.getUserData();
		},
		
		mounted() {
		var that = this;
		this.getleiji()
		},
		methods: {
			
			getleiji() {
			  var that = this;
			 if (localStorage.getItem('userinfo')) {
			   var userInfo = JSON.parse(localStorage.getItem('userinfo'));
			   that.username = userInfo.name;
			 
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
			  		
			  	}
			},
			toQQ(){
				var that = this;
				var url=API.GetWebUrl();
				Net.request({
					url:'https://wk.sxiongd.com/connect.php?act=login',
					method:'GET',
					data:{
						appid:"1006",
						appkey:'179c734ebf443c7ff4504bdfc8046fbe',
						type:'qq',
						redirect_uri:'http://bbs.eyunapps.com/'
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					dataType:'json',
	                success(res) {
	                	console.log(res.data.url);
						var url=res.data.url;
						window.open(url)
						// uni.navigateTo({
						// 	url:'/pages/user/webview?url='+url
						// })
	                },
					fail() {
                        console.log('获取登陆链接失败');
					}
					
				});
				
			},
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			rmlocal(){
				var that = this;
				uni.showModal({
				    title: '提示',
				    content: '是否确定清除缓存',
				    success: function (res) {
				        if (res.confirm) {
							that.closeLocal();
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			getUserData() {
				var that = this;
				that.$Net.request({
					
					url: that.$API.getUserData(),
					data:{
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res));
						if(res.data.code==1){
							that.systemBan = res.data.data.systemBan;
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
			closeLocal() {
				var that = this
				var userinfo = localStorage.getItem('userinfo')
				var token = localStorage.getItem('token')
				
				// 如果有userinfo和token,先保存下来
				if(userinfo && token) {
					for(let key in localStorage) {
						if(key !== 'userinfo' && key !== 'token') {
							localStorage.removeItem(key)
						}
					}
				} else {
					localStorage.clear()
				}
				
				uni.showToast({
					title: '清除成功！',
					icon: 'none',
					duration: 1000,
					position: 'bottom'
				})
				
				that.localdata = '0 KB'
			},
			get_cache_size() {
				var that = this
				var obj = uni.getStorageInfoSync()
				if (obj) {
					that.localdata = obj.currentSize + ' KB'
				} else {
					console.log('浏览器不支持localStorage')
				}
			},
			isUpdate(Status) {
							var that = this;
							plus.runtime.getProperty(plus.runtime.appid, function(inf) {
								
								that.wgtVer = inf.version //获取当前版本号
								that.versionCode = inf.versionCode;
								var version = inf.versionCode;
								that.$Net.request({
									url: that.$API.GetUpdateUrl(),
									method: 'get',
									success: function(res) {
										var versionCode = res.data.versionCode;
										that.versionUrl =  res.data.versionUrl;
										if(Status){
											uni.showToast({
												title:"检测完成",
												icon:'none',
												duration: 1000,
												position:'bottom',
											});
											
										}
										if(versionCode > version){
											console.log("有更新");
											that.Update=1;
											if(Status){
												if(res.data.versionUrl!=""){
													plus.runtime.openURL(res.data.versionUrl);  
												}
											}
										}
										
									},
									fail:function(res){
										
									}
								})
								
							})
						},
			download(url){
				var that=this;
				const downloadTask = uni.downloadFile({
					url: url, //仅为示例，并非真实的资源
					success: (res) => {
						if (res.statusCode === 200) {
							//that.Toast('下载成功，开始安装！');
							 uni.saveFile({
							      tempFilePath: res.tempFilePath,
							      success: function (res) {
							        var savedFilePath = res.savedFilePath;
									   uni.openDocument({
									      filePath: savedFilePath,
									      showMenu: true,
									      success: function (res) {
									        that.Toast('开始安装');
									      }
									    });
							      }
							    });
						}
					}
				});
				
				downloadTask.onProgressUpdate((res) => {
					that.progress='下载进度：' + res.progress+'%';
					//console.log('已经下载的数据长度' + res.totalBytesWritten);
					//console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
				
					// 满足测试条件，取消下载任务。
					// if (res.progress > 50) {
					// 	downloadTask.abort();
					// }
				});
			},
			Toast(res){
				uni.showToast({
					icon:'none',
					title:res
				})
			},
			toLink(text){
				var that = this;
				
				if(!localStorage.getItem('token')||localStorage.getItem('token')==""){
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
			toAddress(){
				var that = this;
				
				if(!localStorage.getItem('token')||localStorage.getItem('token')==""){
					uni.showToast({
						title: "请先登录哦",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
				    url: '/pages/user/address'
				});
			},
			toClothes(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/user/clothes'
				});
			},
			toPay(){
				var that = this;
				if(!localStorage.getItem('token')||localStorage.getItem('token')==""){
					uni.showToast({
						title: "请先登录哦",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
				    url: '/pages/user/pay'
				});
			},
			toQQbd(){
				var that = this;
				if(!localStorage.getItem('token')||localStorage.getItem('token')==""){
					uni.showToast({
						title: "请先登录哦",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
				    url: '/pages/user/userbind'
				});
			},
			
			logout(){
				var that = this;
				uni.showModal({
				    title: '提示',
				    content: '确认退出账户？',
				    success: function (res) {
				        if (res.confirm) {
							
							uni.showLoading({
								title: "加载中"
							});
							var data={
								"token":that.token
							}
							that.$Net.request({
								url: that.$API.signOut(),
								data:data,
								header:{
									'Content-Type':'application/x-www-form-urlencoded'
								},
								method: "get",
								dataType: 'json',
								success: function(res) {
									setTimeout(function () {
										uni.hideLoading();
									}, 1000);
									
									if(res.data.code==1){
										localStorage.removeItem('userinfo');
										localStorage.removeItem('token');
										uni.showToast({
											title:"退出成功",
											icon:'none',
											duration: 1000,
											position:'bottom',
										});
										var timer = setTimeout(function() {
											uni.reLaunch({
												url: '/pages/home/home'
											})
											clearTimeout('timer')
										}, 1000)
									}else{
										uni.showToast({
											title: res.data.msg,
											icon: 'none'
										})
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
								}
							})
							
							
				            
				        } else if (res.cancel) {
				            
				        }
				    }
				});
			}
		}
	}
</script>

<style>
</style>
