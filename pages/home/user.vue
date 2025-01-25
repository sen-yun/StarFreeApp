<template>
	<view class="user" :class="$store.state.AppStyle">
		
		<view class="homepage">
			<view class="bar">
				<u-navbar :placeholder="true" bgColor="#f6f6f6">
					<view slot="left"></view>
					<view slot="right" class="right">
						<view @tap="toLink('/pages/user/useredit')">
							<text class="tn-icon-write" style="font-size: 40upx;"></text>
						</view>
						<view @tap="toSetup">
							<text class="tn-icon-set" style="font-size: 40upx;"></text>
						</view>
						<!-- #ifdef APP-PLUS -->
						<view @tap="toScan">
							<text class="tn-icon-scan" style="font-size: 40upx;"></text>
						</view>
						<!-- #endif -->
					</view>
				</u-navbar>
			</view>
			<view class="people">
				<view class="headImg">
					<!-- <image src="../../static/image/travel/personal/tx.png"> -->
					<!-- {{userInfo}} -->
					<view class="avatar" v-if="userInfo" :style="userInfo.style" @tap="toUserContents()"></view>
					<view class="avatar" style="background-color: #ccc;" v-else></view>
				</view>
				<view class="info" v-if="userInfo != null">
					<view class="nick" style="display: flex; align-items: center;">
					  <text :style="isvip ? 'color: #db3287ed' : ''">{{name}}</text>
					 
					</view>
					<view class="grade" @click="copyUid">
						<view style="margin-right: 10upx;color: #454545ed;">{{appname}}: {{uid}}</view>
					</view>
					<view class="grade" style="margin-top: 10upx;">
					<text class="userlv" v-if="isvip" style="margin-left: 0px;background: linear-gradient(to bottom right, #f2ad5c, #e6216d,#901ccb);color:white;padding: 2upx 10upx;border-radius: 20upx;">VIP</text>
					
					<text class="userlv" :style="getLvStyle(userInfo.experience)" :class="isvip ? '' : 'xyy'" style="padding: 2upx 10upx;">{{getLv(userInfo.experience)}}</text>
					
					<text class="userlv customize" style="border: 3upx solid black;color:black;padding: 2upx 10upx;border-radius: 40upx;background-color: transparent;" v-if="userInfo.customize&&userInfo.customize!=''">{{userInfo.customize}}</text>
					</view>
				</view>
				<view class="info" v-if="userInfo == null">
					<view class="nick" @tap="toLogin">
						<text>点击登录</text>
					</view>
				</view>
				<view class="space" v-if="userInfo != null">
					<text class="padding-lr-sm padding-tb-xs" style="border-radius: 40upx; background-color: #3cc9a4;color: white;padding: 10upx 40upx;" @tap="toClock">签到</text>
				</view>
			</view>
			<view class="list" style="display: flex; justify-content: center;"  v-if="userInfo != null">
				<view class="item"  @tap="toLink('/pages/user/fanList?uid='+uid)">
					<view class="text">
						<text>{{formatNumber(userData.fanNum)}}</text>
						<text>粉丝</text>
					</view>
					
				</view>
				<view class="item">
				<u-line direction="col" color="#979797 " length="32rpx"></u-line>
				</view>
				<view class="item">
					<view class="text" @tap="toLink('/pages/user/followList?uid='+uid)">
						<text>{{fancount}}</text>
						<text>关注</text>
					</view>
					
				</view>
				<view class="item">
				<u-line direction="col" color="#979797 " length="32rpx"></u-line>
				</view>
				<view class="item"  @tap="toLink('/pages/user/usercomments')">
					<view class="text">
						<text>{{userData.commentsNum}}</text>
						<text>评论</text>
					</view>
					
				</view>
				<view class="item">
				<u-line direction="col" color="#979797 " length="32rpx"></u-line>
				</view>
				<view class="item"  @tap="toLink('/pages/user/assets')">
					<view class="text">
						<text>{{formatNumber(userData.assets)}}</text>
						<text>{{assetsname}}</text>
					</view>
					
				</view>
			</view>
			<view class="infos">
				<!--<br>
				<view class="account-pay"></view>-->
				<view v-if="isvip" class="open-vip" @tap="toLink('/pages/user/buyvip')">
					<image src="/static/image/travel/personal/vip01.png"></image>
					<text class="text" style="font-weight: bold;">已开通尊贵VIP</text>
					<image src="/static/image/travel/personal/vip03.png" style="width: 55px; height: 20px;"></image>
					
				</view>
				<view v-else class="open-vip" @tap="toLink('/pages/user/buyvip')">
						<image src="/static/image/travel/personal/vip01.png"></image>
						<text class="text" style="font-weight: bold;">开通VIP享受十余项尊贵特权</text>
						<image src="/static/image/travel/personal/vip03.png" style="width: 55px; height: 20px;"></image>
				</view>
				<view class="tool">
					<view style="display: flex;align-items: center;" @tap="toLink('/pages/user/userpost')">
						<image src="/static/image/travel/personal/member.png"></image>
							<text>帖子</text>
					</view>
					<view style="display: flex;align-items: center;" @tap="toLink('/pages/user/usermark')">
						<image src="/static/image/travel/personal/house.png" ></image>
							<text>足迹</text>
					</view>
					<view style="display: flex;align-items: center;" @tap="toLink('/pages/user/assets')">
						<image src="/static/image/travel/personal/money.png" ></image>
							<text>钱包</text>
					</view>
					<view style="display: flex;align-items: center;" @tap="toLink('/pages/user/userexp')">
						<image src="/static/image/travel/personal/task.png" ></image>
							<text>签到</text>
					</view>
					
				</view>
				
				<view class="set">
					<view @tap="toManage" v-if="group=='administrator'||group=='editor'">
						<view class="tn-flex-1 tn-flex tn-flex-col-center">
							<text class="tn-icon-set" style="margin-left:8px"></text>
							<text>管理中心</text>
						</view>
						<view class="tn-flex tn-text-justify">
							
							<text>请勿滥用权限</text>
							<image class="right" src="../../static/image/travel/personal/Clipped.png">
						</view>
					</view>
				<view @tap="toLink('/pages/user/myshop')">
					 	<text class="tn-icon-shop" style="margin-left:8px"></text>
					 	<view class="tn-flex-1">
					 		<text>我的商品</text>
					 	</view>
					 		<image class="right"  style="float: right;" src="../../static/image/travel/personal/Clipped.png">
					 </view>
					<view @tap="toLink('/pages/user/sellorder')">
						<text class="tn-icon-order" style="margin-left:8px"></text>
						<view class="tn-flex-1">
							<text>售出订单</text>
						</view>
							<image class="right"  style="float: right;" src="../../static/image/travel/personal/Clipped.png">
					</view>
					<view  @tap="toSetUp">
						<view class="tn-flex-1 tn-flex tn-text-justify">
						<text class="tn-icon-identity" style="margin-left:8px"></text>
							<text>账户设置</text>
						</view>
						<image class="right"  style="float: right;" src="../../static/image/travel/personal/Clipped.png">
					</view>
					<view @tap="toMedia">
						<text class="tn-icon-service" style="margin-left:8px"></text>
						<view class="tn-flex-1">
						
							<text>联系我们</text>
						</view>
							<image class="right"  style="float: right;" src="../../static/image/travel/personal/Clipped.png">
					</view>
					
				</view>
			</view>
			
		</view>
	
		
		<!--  #ifdef APP-PLUS -->
		<view style="height: 100upx;"></view>
		<Tabbar :current="3"></Tabbar>
		<!--  #endif -->
		
		<view class="cu-modal userLoginstatus" :class="isLoginShow?'show':''">
			<view class="cu-dialog">
				<view class="padding-sm">
					<view class="padding flex flex-direction">
						<view class="userLoginstatus-i bg-red">
							<text class="cuIcon-close"></text>
						</view>
						<view class="text-bold">登录状态失效,可能是数据被自动清理或异地登陆</view>
						
						<button class="cu-btn bg-blue margin-top" @tap="isLoginShow=false">确定</button>
					</view>
				</view>
			
			</view>
		</view>
	</view>
</template>

<script>
	import waves from '@/components/xxley-waves/waves.vue';
	// #ifdef APP-PLUS
	import Tabbar from '@/pages/components/tabBar.vue'
	// #endif
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
import { data } from '../../static/app-plus/owo/OwO.js';
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
				AppStyle:this.$store.state.AppStyle,
				userInfo:null,
				name:"",
				uid:0,
				token:"",
				userData:{},
				isClock:0,
				group:"",
				avatar:"",
				fancount:0,
				isvip:0,
				vip:0,
				vipDiscount:0,
				vipPrice:0,
				userlvStyle:"",
				lvStyle:"",
				assetsname:"",
				appname:this.$API.GetappJC(),
				isLoginShow:false,
				
				noticeSum:0,
				
			}
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			uni.hideTabBar({
				animation: false
			})
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			if(localStorage.getItem('userinfo')){
				
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.userInfo.style = "background-image:url("+that.userInfo.avatar+");"
				that.avatar = that.userInfo.avatar;
				that.uid = that.userInfo.uid;
				that.group = that.userInfo.group;
				if(that.userInfo.screenName){
					that.name = that.userInfo.screenName;
				}else{
					that.name = that.userInfo.name;
				}
			}else{
				that.userInfo =null;
			}
			if(localStorage.getItem('token')){
				
				that.token = localStorage.getItem('token');
			}else{
				that.token = "";
			}
			that.getUserData();
			that.userStatus();
			that.unreadNum();
			that.getfsgz();
			
		},


		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			
		},
		mounted() {
				 this.getset();
				 
				},
		methods: {
			getfsgz() {
			  var that = this;
			      uni.request({
			        url:that.$API.SMlikeall(),
			        method:'GET',
					data:{
						uid:that.uid
					},
			        dataType:"json",
			        success(res) {
					  that.fancount = res.data.fancount;
			        },
			        fail(error) {
			          console.log(error);
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
					  that.assetsname = res.data.assetsname;
			        },
			        fail(error) {
			          console.log(error);
			        }
			      })
			},
			
			toLogin(){
				var that = this;
				
				// #ifdef MP-WEIXIN
				//that.toWexinlogin();
				//return false;
				// #endif
				// #ifdef MP-QQ
				// that.toQQlogin();
				// return false;
				// #endif
				uni.navigateTo({
					url: '/pages/user/login'
				});
				
			},
			tonlink(url){
									var url='http://'+url;
									uni.navigateTo({
									url:'/pages/user/webview?url='+url
									})
						
								},
			toPost() {
				if(!this.userInfo) {
					uni.showToast({
						title: "请先登录哦",
						icon: 'none'
					})
					return;
				}
				uni.navigateTo({
					url: '/pages/user/post'
				})
			},
			toSetup() {
				uni.navigateTo({
					url: '/pages/user/setup'
				})
			},
			toWexinlogin(){
				//微信登陆
				//后端直接根据unionId来判断用户的唯一性。
				uni.showLoading({
					title: "加载中"
				});
				uni.login({
					provider: 'weixin',
					success: res => {
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								console.log(JSON.stringify(infoRes));
								let formdata = {
									nickName: infoRes.userInfo.nickName,
									//gender: infoRes.userInfo.gender,
									appLoginType:"weixin",
				                    headImgUrl: infoRes.userInfo.avatarUrl,
									openId: infoRes.userInfo.openId,
									accessToken: infoRes.userInfo.unionId
								};
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
											//保存用户信息
											localStorage.setItem('userinfo',JSON.stringify(res.data.data));
											localStorage.setItem('token',res.data.data.token);
											var timer = setTimeout(function() {
												uni.reLaunch({
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
											title: "网络不太好哦~",
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
			toQQlogin(){
				//QQ登陆
				//后端直接根据access_token来判断用户的唯一性。
				uni.showLoading({
					title: "加载中"
				});
				uni.login({
					provider: 'qq',
					success: resp => {
						var access_token = resp.authResult.access_token;
						uni.getUserInfo({
							provider: 'qq',
							success: function(infoRes) {
								
								var formdata = {
									nickName: infoRes.userInfo.nickname,
									//gender: infoRes.userInfo.gender == '男' ? 1 : 2,
									appLoginType:"qq",
				                    headImgUrl: infoRes.userInfo.figureurl_qq_2,
									openId: infoRes.userInfo.openId,
									accessToken: access_token
								};
								
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
											//保存用户信息
											localStorage.setItem('userinfo',JSON.stringify(res.data.data));
											localStorage.setItem('token',res.data.data.token);
											var timer = setTimeout(function() {
												uni.reLaunch({
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
											title: "网络不太好哦~",
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
			getUserLv(i){
				var that = this;
				var rankList = that.$API.GetRankList();
				var rankStyle = that.$API.GetRankStyle();
				that.userlvStyle ="color:#fff;background-color: "+rankStyle[i];
				return rankList[i];
			},
			getLv(i){
				var that = this;
				var lv  = that.$API.getLever(i);
				var leverList = that.$API.GetLeverList();
				var rankStyle = that.$API.GetRankStyle();
				that.lvStyle ="color:#fff;background-color: "+rankStyle[lv];
				return leverList[lv];
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
			toPage(title,cid){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/contents/info?cid='+cid+"&title="+title
				});
			},
			goPage(url){
				var that = this;
				
				uni.navigateTo({
				    url: url
				});
			},
			userStatus() {
				var that = this;
				that.$Net.request({
					
					url: that.$API.userStatus(),
					data:{
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==0){
							
							if(that.userInfo != null){
								that.isLoginShow = true;
							}
							localStorage.removeItem('userinfo');
							localStorage.removeItem('token');
							
							that.userInfo = null;
						}else{
							
							if(localStorage.getItem('userinfo')){
								
								var userInfo = JSON.parse(localStorage.getItem('userinfo'));
								if(userInfo.screenName){
									that.name = userInfo.screenName;
								}else{
									that.name = userInfo.name;
								}
								if(res.data.data.customize){
									userInfo.customize = res.data.data.customize;
								}
								if(res.data.data.lv){
									userInfo.lv = res.data.data.lv;
								}
								if(res.data.data.isvip){
									userInfo.isvip = res.data.data.isvip;
								}
								if(res.data.data.vip){
									userInfo.vip = res.data.data.vip;
								}
								if(res.data.data.experience){
									userInfo.experience = res.data.data.experience;
								}
								localStorage.setItem('userinfo',JSON.stringify(userInfo));
								// if(res.data.data.avatar){
								// 	that.userInfo = res.data.data.avatar;
								// }
								
							}
							
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
					}
				})
			},
			toGroup(){
				var url = that.$API.GetGroupUrl();
				// #ifdef APP-PLUS
				plus.runtime.openURL(url) 
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
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
							that.userData = res.data.data;
							that.isClock = res.data.data.isClock;
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
					}
				})
			},
			formatNumber(num) {
			    return num >= 1e3 && num < 1e4 ? (num / 1e3).toFixed(1) + 'k' : num >= 1e4 ? (num / 1e4).toFixed(1) + 'w' : num
			},
			toClock(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/user/userexp'
				});
			},
			toScan(){
				var that = this;
				uni.scanCode({
					onlyFromCamera: false,
					scanType: ['barCode', 'qrCode'],
					success: function(res) {
						var text = res.result;
						var strUrl= "^((https|http|ftp|rtsp|mms)?://)" +
					   "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"+
					   "(([0-9]{1,3}\.){3}[0-9]{1,3}" +
					   "|"+
					   "([0-9a-z_!~*'()-]+\.)*" +
					   "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." +
					   "[a-z]{2,6})" +
					   "(:[0-9]{1,4})?"+
					   "((/?)|"+
					   "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
						var urlDemo = new RegExp(strUrl); 
						if(urlDemo.test(text)) {
							var linkStar = that.$API.GetlinkStar();
							var linkStarArr = linkStar.split("{cid}");
							if(text.indexOf(linkStarArr[0])!=-1){
								//是本站链接
								var cid = text;
								for(var i in linkStarArr){
									cid = cid.replace(linkStarArr[i],"");
								}
								uni.navigateTo({
									url: '/pages/contents/info?cid='+cid
								});
							}else{
								// #ifdef MP
								uni.setClipboardData({
								  data: href,
								  success: () =>
									uni.showToast({
									  title: '链接已复制'
									})
								})
								// #endif
								// #ifdef APP-PLUS
								plus.runtime.openWeb(href)
								// #endif
							}
						}else{
							that.scanLogin(text);
						}
					}
				});
			},
			scanLogin(text){
				var that = this;
				if(that.token==""){
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					})
					return false;
				}
				if(that.isJSON(text)){
					text = JSON.parse(text);
				}else{
					uni.showToast({
						title: "无法解析的内容！",
						icon: 'none'
					})
					return false;
				}
				if(text.type){
					if(text.type!="Scan"){
						uni.showToast({
							title: "无法解析的内容！",
							icon: 'none'
						})
						return false;
					}
				}
				uni.navigateTo({
				    url: '/pages/user/scan?text='+text.data
				});
				
			},
			toSearch(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/contents/search'
				});
			},
			
			userStatus() {
				var that = this;
				that.$Net.request({
					
					url: that.$API.userStatus(),
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
							that.assets = res.data.data.assets;
							that.vip = res.data.data.vip;
							that.isvip = res.data.data.isvip;
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
							that.vipDiscount=res.data.data.vipDiscount;
							that.vipPrice=res.data.data.vipPrice;
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
			tovipDiscount(num){
				if(Number(num)<=0){
					return 0;
				}else{
					num = num.toString();
					num = num.replace("0.","");
					return num;
				}
				},
			getLvStyle(i){
				var that = this;
				if(!i){
					var i = 0;
				}
				var lv  = that.$API.getLever(i);
				var rankStyle = that.$API.GetRankStyle();
				var userlvStyle ="border: 3upx solid " + rankStyle[lv] + ";color:" + rankStyle[lv] + ";background-color: transparent;border-radius: 40upx;";
				return userlvStyle;
			},
			toMedia(){
				uni.navigateTo({
				    url: '/pages/user/media'
				});
			},
			toSetUp(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/user/setup'
				});
			},
			toManage(){
				uni.navigateTo({
				    url: '/pages/user/manage'
				});
			},
			toScan(){
				var that = this;
				uni.scanCode({
					onlyFromCamera: false,
					scanType: ['barCode', 'qrCode'],
					success: function(res) {
						var text = res.result;
						var strUrl= "^((https|http|ftp|rtsp|mms)?://)" +
					   "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"+
					   "(([0-9]{1,3}\.){3}[0-9]{1,3}" +
					   "|"+
					   "([0-9a-z_!~*'()-]+\.)*" +
					   "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." +
					   "[a-z]{2,6})" +
					   "(:[0-9]{1,4})?"+
					   "((/?)|"+
					   "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
						var urlDemo = new RegExp(strUrl); 
						if(urlDemo.test(text)) {
							var linkStar = that.$API.GetlinkStar();
							var linkStarArr = linkStar.split("{cid}");
							if(text.indexOf(linkStarArr[0])!=-1){
								//是本站链接
								var cid = text;
								for(var i in linkStarArr){
									cid = cid.replace(linkStarArr[i],"");
								}
								uni.navigateTo({
									url: '/pages/contents/info?cid='+cid
								});
							}else{
								// #ifdef MP
								uni.setClipboardData({
								  data: href,
								  success: () =>
									uni.showToast({
									  title: '链接已复制'
									})
								})
								// #endif
								// #ifdef APP-PLUS
								plus.runtime.openWeb(href)
								// #endif
							}
						}else{
							that.scanLogin(text);
						}
					}
				});
			},
			scanLogin(text){
				var that = this;
				if(that.token==""){
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					})
					return false;
				}
				if(that.isJSON(text)){
					text = JSON.parse(text);
				}else{
					uni.showToast({
						title: "无法解析的内容！",
						icon: 'none'
					})
					return false;
				}
				if(text.type){
					if(text.type!="Scan"){
						uni.showToast({
							title: "无法解析的内容！",
							icon: 'none'
						})
						return false;
					}
				}
				uni.navigateTo({
				    url: '/pages/user/scan?text='+text.data
				});
				
			},
			toPage(title,cid){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/contents/info?cid='+cid+"&title="+title
				});
			},
			goStyle(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/user/clothes'
				});
			},
			isJSON(str) {
			
			    if (typeof str == 'string') {
			        try {
			            var obj=JSON.parse(str);
			            if(typeof obj == 'object' && obj ){
			                return true;
			            }else{
			                return false;
			            }
			        } catch(e) {
			            console.log('error：'+str+'!!!'+e);
			            return false;
			        }
			    }
			},
			unreadNum() {
				var that = this;
				that.$Net.request({
					
					url: that.$API.unreadNum(),
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
							that.noticeSum = res.data.data;
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
					}
				})
			},
			goFanList(uid){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/user/fanList?uid='+uid
				});
			},
			tonlink41(url){
									var url='https://'+url;
									uni.navigateTo({
									url:'/pages/user/webview?url='+url
									})
						
								},

			toWeb(url) {
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			toUserContents(){
				var that = this;
				var name = that.name;
				var title = that.name+"的信息";
				var id= that.uid;
				var type="user";
				uni.navigateTo({
				    url: '/pages/contents/userinfo?title='+title+"&name="+name+"&uid="+id+"&avatar="+encodeURIComponent(that.avatar)
				});
			},
			toAssets() {
				uni.navigateTo({
					url: '/pages/user/assets'
				})
			}
		},
		// #ifdef APP-PLUS
		components: {
			waves,
			Tabbar
		},
		// #endif
		
		// #ifdef H5 || MP
		components: {
			waves
		},
		// #endif
	}
</script>
<style scoped>
	.list-margin{
		margin: 0 20rpx;
	}
	.margin-ver {
		margin: 20rpx 20rpx;
	}
	::v-deep .cu-list.menu>.cu-item{
		background-color: transparent;
	}
	
	.account-pay {
		background-image: url('../../static/page/bg_my_vip.png');
		background-repeat: no-repeat;
		background-size: 100% 100%; 
		height: 96rpx;
		line-height: 72rpx;
		border-radius: 49rpx;
		/* color: #fff; */
	}
	::v-deep .account-pay .cu-item {
		min-height: auto;
		height: 72rpx;
	}
	::v-deep .cu-list.menu-avatar>.cu-item:after, .cu-list.menu>.cu-item:after {
		border: none;
	}
</style>
<style lang="scss" scoped>
	.homepage {
		width: 100%;

		& text {
			color: #333333;
			font-family: PingFangSC-Semibold, PingFang SC;
		}
		
		& text.cuIcon {
			font-family: 'cuIcon';
		}

		.bar {
			.right {
				display: flex;

				& view {
					width: 52rpx;
					height: 52rpx;
					margin-left: 26rpx;
					border-radius: 26rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					box-shadow: 0rpx -2rpx 2rpx 4rpx rgba(255, 255, 255, 0.5000), 0rpx 4rpx 4rpx 0rpx rgba(197, 183, 211, 0.5000), inset 0rpx 2rpx 6rpx 0rpx rgba(255, 255, 255, 0.5000);

					>image {
						width: 32rpx;
						height: 32rpx;
					}
				}
			}
		}

		.people {
			padding: 0 42rpx 28rpx 32rpx;
			display: flex;
			align-items: center;

			.headImg {
				// >image {
				// 	width: 166rpx;
				// 	height: 166rpx;
				// 	border-radius: 83rpx;
				// }
				width: 166rpx;
				height: 166rpx;
				border-radius: 83rpx;;
				overflow: hidden;
				margin-right: 20rpx;
			}

			.info {
				flex: 1;

				.nick {
					display: flex;

					>text {
						font-size: 36rpx;
						font-weight: 600;
						line-height: 50rpx;
					}

					.sex {
						width: 24rpx;
						height: 24rpx;
						border-radius: 12rpx;
						background: #61C9FD;
					}
				}

				.grade {
					display: flex;
					align-items: center;

					>view {
						display: flex;
						align-items: center;
						margin-right: 12rpx;

						& text {
							font-size: 20rpx;
							font-weight: 600;
							color: #FFFFFF;
							line-height: 28rpx;
							text-shadow: 0rpx 2rpx 4rpx #cbffea;
						}

						& image {
							width: 28rpx;
							height: 30rpx;
						}

						&:last-child {
							>image {
								width: 40rpx;
								height: 40rpx;
							}

							>text {
								margin-left: -6rpx;
							}
						}
					}
				}

				.userId {
					width: 220rpx;
					display: flex;
					background: #F5F5FF;
					border-radius: 8rpx;
					box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.1400), 0rpx -4rpx 6rpx 0rpx #FFFFFF;

					>image {
						width: 36rpx;
						height: 40rpx;
					}

					.number {
						flex: 1;
						display: flex;
						justify-content: center;

						>text {
							font-size: 24rpx;
							font-weight: 600;
							line-height: 40rpx;

							&:last-child {
								font-weight: 500;
								font-size: 22rpx;
								margin-left: 8rpx;
							}
						}
					}
				}
			}

			.space {
				display: flex;
				align-items: center;

				>text {
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}

		.list {
			width: 100%;
			display: flex;
			padding: 0 44rpx;
			box-sizing: border-box;

			.item {
				width: 25%;
				display: flex;
				justify-content: space-evenly;
				align-items: center;

				.text {
					display: flex;
					flex-direction: column;
					align-items: center;

					>text:first-child {
						font-size: 36rpx;
						font-family: CloudHeiChaoGBK;
						line-height: 48rpx;
						font-weight: 600;
					}

					>text:last-child {
						font-size: 24rpx;
						color: #999999;
						line-height: 34rpx;
					}
				}
			}
		}
.xyy{
	margin-left: 0px;
}
		.infos {
			padding: 0 40rpx;

			.open-vip {
				width: 100%;
				height: 72rpx;
				background: linear-gradient(180deg, #F7E5B4 0%, #FFE6AF 2%, #EBC075 100%);
				border-radius: 49rpx;
				display: flex;
				align-items: center;
				margin-top: 36rpx;
				padding: 0 24rpx 0 34rpx;
				box-sizing: border-box;

				>image {
					width: 48rpx;
					height: 48rpx;
				}

				.text {
					flex: 1;
					font-size: 24rpx;
					line-height: 34rpx;
					margin-left: 14rpx;
				}

				.button {
					width: 128rpx;
					height: 42rpx;
					background: linear-gradient(90deg, #4D4D4D 0%, #151515 100%);
					border-radius: 22rpx;
					font-size: 22rpx;
					color: #FFDFA9;
					line-height: 42rpx;
					text-align: center;
				}
			}

			.tool {
				display: flex;
				width: 100%;
				height: 172rpx;
				background: #FFFFFF;
				box-shadow:  0rpx 2rpx 28rpx 0rpx #c2c2c257;
				border-radius: 28rpx;
				justify-content: space-evenly;
				margin: 22rpx 0;

				>view {
					display: flex;
					flex-direction: column;

					& text {
						font-size: 22rpx;
						font-weight: 600;
						color: #666666;
						line-height: 32rpx;
					}

					& image {
						width: 98rpx;
						height: 96rpx;
						margin-top: 10rpx;
					}
				}
			}

			.set {
				width: 100%;
				padding: 34rpx 24rpx 44rpx 34rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 2rpx 28rpx 0rpx #c2c2c257;
				border-radius: 28rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				box-sizing: border-box;

				>view {
					display: flex;
					align-items: center;
					margin-bottom: 40rpx;
					
					&:last-child {
						margin-bottom: 0;
					}

					& text {
						font-size: 28rpx;
						line-height: 40rpx;
						margin-left: 30rpx;
					}

					.icon {
						width: 36rpx;
						height: 36rpx;
					}

					.right {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}

			.service {
				background: #FFFFFF;
				box-shadow: 0rpx 2rpx 28rpx 0rpx rgba(142, 146, 230, 0.2700);
				border-radius: 28rpx;
				margin-top: 26rpx;
				padding: 34rpx 24rpx 44rpx 34rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				>view {
					display: flex;
					align-items: center;
					margin-bottom: 40rpx;

					& text {
						flex: 1;
						font-size: 28rpx;
						line-height: 40rpx;
						margin-left: 30rpx;
					}

					.icon {
						width: 36rpx;
						height: 36rpx;
					}

					.right {
						width: 40rpx;
						height: 40rpx;
					}

				}
			}
		}
		.text-blue {
			color: #0081ff;
		}
		.margin-0 {
			margin-left: 0 !important;
		}
		.avatar {
			width: 100%;
			height: 100%;
			background-size: 100%;
		}
	}
</style>