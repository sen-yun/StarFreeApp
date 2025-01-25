<template>
	<view :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					社区工具库
				</view>
				<view class="action" @tap="toSearch">
					<text class="cuIcon-search"></text>
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="data-box">
			<view class="cu-bar bg-white">
				<view class="action data-box-title">
					<text class="cuIcon-titles text-rule"></text> 社区功能
				</view>
				<view class="action more">
					
				</view>
			</view>
			<view class="index-sort grid col-4 tool-sort">
				<!--<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toPage('使用攻略',raiders)">
							<view class="index-sort-i" style="background-color: #ff7300;">
								<text class="cuIcon-appreciate"></text>
							</view>
							<view class="index-sort-text">
								使用攻略
							</view>
						</view>
					</waves>
				</view>-->
				
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toView2('app.ycpw.xyz')">
							<view class="index-sort-i" style="background-color: #ffffff">
								<image src="/static/gy.png" style="width: 39px; height: 39px;"></image>
								<text class="cuIcon-read"></text>
							</view>
							<view class="index-sort-text">
								应用
							</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main"  @tap="goPage('/pages/contents/shop')">
							<view class="index-sort-i" style="background-color: #FFFFFF">
								<image src="/static/sc.png" style="width: 40px; height: 40px;"></image>
								<text class="cuIcon-taoxiaopu"></text>
							</view>
							<view class="index-sort-text">
								商城
							</view>
						</view>
					</waves>
				</view>
<!--
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="goPage('/pages/contents/randlist')">
							<view class="index-sort-i">
								<text class="cuIcon-refresh"></text>
							</view>
							<view class="index-sort-text">
								随机帖子
							</view>
						</view>
					</waves>
				</view>
				
				
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="goPage('/pages/contents/imagetoday')">
							<view class="index-sort-i" style="background-color: #039a54;">
								<text class="cuIcon-picfill"></text>
							</view>
							<view class="index-sort-text">
								免费图库
							</view>
						</view>
					</waves>
				</view>
				-->
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="goPage('/pages/ads/home')">
							<view class="index-sort-i" style="background-color: #FFFFFF">
								<image src="/static/ad.png" style="width: 35px; height: 35px;"></image>
							
							</view>
							<view class="index-sort-text">
								自助广告
							</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="goPage('/pages/contents/blackhouse')">
							<view class="index-sort-i" style="background-color: #FFFFFF">
								<image src="/static/tp.png" style="width: 35px; height: 35px;"></image>
								<text class="cuIcon-picfill"></text>
							</view>
							<view class="index-sort-text">
								小黑屋
							</view>
						</view>
					</waves>
					
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toPage('寻求功能',2)">
							<view class="index-sort-i" style="background-color: #FFFFFF">
								<image src="/static/gn.png" style="width: 40px; height: 40px;"></image>
							
							</view>
							<view class="index-sort-text">
								寻求功能
							</view>
						</view>
					</waves>
				</view>
			</view>
		</view>
		
		<!--<view class="data-box">
			<view class="cu-bar bg-white">
				<view class="action data-box-title">
					<text class="cuIcon-titles text-rule"></text> 站内入口
				</view>
				<view class="action more">
					
				</view>
			</view>
			<view class="index-sort grid col-3 tool-sort">
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="goPage('/pages/contents/imagetoday')">
							<view class="index-sort-i" style="background-color: #039a54;">
								<text class="cuIcon-picfill"></text>
							</view>
							<view class="index-sort-text">
								图库
							</view>
						</view>
					</waves>
				</view>-->
			
				<!--<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="goPage('/pages/ads/home')">
							<view class="index-sort-i" style="background-color: #7f165e;">
								<text class="cuIcon-read"></text>
							</view>
							<view class="index-sort-text">
								广告位
							</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main"  @tap="goPage('/pages/contents/shop')">
							<view class="index-sort-i" style="background-color: #ff3333;">
								<text class="cuIcon-taoxiaopu"></text>
							</view>
							<view class="index-sort-text">
								商城
							</view>
						</view>
					</waves>
				</view>-->
		
			<!--</view>
		</view>-->
		<view class="data-box">
			<view class="cu-bar bg-white">
				<view class="action data-box-title">
					<text class="cuIcon-titles text-rule"></text> 更多工具
				</view>
				<view class="action more">
					
				</view>
			</view>
			<view class="index-sort grid col-4 tool-sort">
				
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toView2('web.ycpw.xyz/url/chatgpt.html')">
							<view class="index-sort-i" style="background-color: #FFFFFF">
								<image src="/static/gpt.png" style="width: 32px; height: 32px;"></image>
							
							</view>
							<view class="index-sort-text">
								ChatGPT
							</view>
						</view>
					</waves>
				</view>
				<!--<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toView2('web.ycpw.xyz/games/')">
							<view class="index-sort-i" style="background-color: #FFFFFF">
								<image src="/static/game.png" style="width: 35px; height: 35px;"></image>
							
							</view>
							<view class="index-sort-text">
								在线玩
							</view>
						</view>
					</waves>
				</view>
				<view class="index-sort-box">
					<waves itemClass="butclass">
						<view class="index-sort-main" @tap="toView2('web.ycpw.xyz/tools/')">
							<view class="index-sort-i" style="background-color: #FFFFFF">
								<image src="/static/gengd.png" style="width: 30px; height: 30px;"></image>
							
							</view>
							<view class="index-sort-text">
								百宝箱
							</view>
						</view>
					</waves>
					
				</view>-->
				
			</view>
		</view>
		<!--加载遮罩-->
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../static/loading.gif"></image>
			</view>
		</view>
		<!--加载遮罩结束-->
	</view>
</template>

<script>
	import waves from '@/components/xxley-waves/waves.vue';
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js';
	var API = require('../../utils/api');
	var Net = require('../../utils/net');
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
				AppStyle:this.$store.state.AppStyle,
				isxs:0,
				isapp:0,
				islt:0,
				userInfo:null,
				token:"",
				isLoading:0,
				raiders:0,
				toolid:0,
				
				noticeSum:0,
			}
		},
		onPullDownRefresh(){
			var that = this;
			var timer = setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000)
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
			}
			if(localStorage.getItem('token')){
				
				that.token = localStorage.getItem('token');
			}
			that.userStatus();
			that.unreadNum();
			that.getes();
			that.GetRaiders();
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
		},
		methods:{
			//获取配置
			getes(){
				var that=this;
				uni.getStorage({
					key:'ES',
					success(res) {
						that.isxs=res.data.isxs;
						that.isapp=res.data.isapp;
						that.islt=res.data.islt;
						console.log(res.data);
					},
					fail() {
						that.isxs=0;
						that.istj=0;
						that.islt=0;
					}
				})
			},
			
			//获取使用攻略的id
			GetRaiders(){
				var that = this;
				Net.request({
					url: API.GetRaiders(),
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==200){
							that.raiders=res.data.raiders; 
							console.log('使用攻略帖子ID：'+res.data.raiders);
						}
					},
					fail: function(res) {
						console.log('离线模式')
					}
				})
			},
			back(){
				uni.navigateBack({
					delta: 1
				});
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
			toInfo(data){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/contents/info?cid='+data.cid+"&title="+data.title
				});
			},
			toPage(title,cid){
				var that = this;
				if(!localStorage.getItem('userinfo')){
					uni.showToast({
						title:'请先登录！',
						icon:'none'
					});
				}else{
				
				uni.navigateTo({
				    url: '/pages/contents/info?cid='+cid+"&title="+title
				});
				}
			},
			toSearch(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/contents/search'
				});
			},
			toView2(url){
						var url='https://'+url;
						if(!localStorage.getItem('userinfo')){
							uni.showToast({
								title:'请先登录！',
								icon:'none'
							});
						}else{
							uni.getStorage({
								key:'username',
								success(res) {
									uni.navigateTo({
										url:'/pages/user/webview?url='+url
									})
								},
								fail() {
									uni.showToast({
										icon:'none',
										title:'请先登录！'
									})
								}
							})
						}
			
					},
					toView(url){
								var url=API.GetWebUrl()+url;
								if(!localStorage.getItem('userinfo')){
									uni.showToast({
										title:'请先登录！',
										icon:'none'
									});
								}else{
									uni.getStorage({
										key:'username',
										success(res) {
											var name=res.data;
											uni.navigateTo({
												url:'/pages/user/webview?url='+url+'&name='+name
											})
										},
										fail() {
											uni.showToast({
												icon:'none',
												title:'请先登录！'
											})
										}
									})
								}
					
							},
			goPage(url){
				if(!localStorage.getItem('userinfo')){
					uni.showToast({
						title:'请先登录！',
						icon:'none'
					});
				}else{
				var that = this;
				
				uni.navigateTo({
				    url: url
				});
				}
			},
			toCategoryContents(title,id){
				var that = this;
				var type="meta";
				uni.navigateTo({
				    url: '/pages/contents/contentlist?title='+title+"&type="+type+"&id="+id
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
						that.isLoading=1;
						if(res.data.code==0){
							localStorage.removeItem('userinfo');
							localStorage.removeItem('token');
							that.token = "";
							that.userinfo = null;
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
			toOrder(){
					var that = this;
					
					uni.navigateTo({
					    url: '/pages/contents/order'
					});
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
			toGroup(){
				var url = that.$API.GetGroupUrl();
				// #ifdef APP-PLUS
				plus.runtime.openURL(url) 
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
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
</style>
