<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					商品详情
				</view>
				<view class="action">
					
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="info" style="margin-top:10upx;">
			<view class="shopinfo-img">
				
				<image :src="imgurl" mode="widthFix" @tap="previewImage(imgurl)"></image>
			</view>
			<view class="shopinfo-title">
				{{title}}
			</view>
			<view class="shopinfo-info">
				<text class="text-sm shop-user text-black"  @tap="toUserContents(userInfo)">
					<block v-if="userInfo.isvip>0">
						<block v-if="userInfo.screenName!=''"><text class="text-shojo">{{userInfo.screenName}}</text>
						</block>
						<block v-else><text class="text-shojo">{{userInfo.name}}</text></block>
					</block>
					<block v-else>
						<block v-if="userInfo.screenName!=''">{{userInfo.screenName}}
						</block>
						<block v-else>{{userInfo.name}}</block>
					</block>
				</text>
				<text class="text-sm text-right text-gray">剩余数量：{{num}}</text>
			</view>
			<view class="info-content shop-content">
				<!-- <joMarkdown :nodes="markdownData"></joMarkdown> -->
				
				<mp-html :content="html" :selectable="true" :show-img-menu="true" :lazy-load="true" :ImgCache="true" :markdown="true"/>
			</view>
		</view>
		<view class="shopinfo-bar grid col-2" v-if="isBuy==0||type==1">
			<view class="shopinfo-price">
				<block v-if="isvip>0">
					{{parseInt(price * vipDiscount)}} {{currencyName}}
					<text class="text-red margin-left text-sm">会员特惠</text>
				</block>
				<block v-else>
					{{price}} {{currencyName}}
				</block>
			</view>
			<view class="shopinfo-btn">
				<text class="cu-btn bg-shojo radius" @tap="shopBuy">立即购买</text>
			</view>
		</view>
		<view class="shopinfo-bar grid col-2" v-if="isBuy==1&&type!=1">
			<view class="shopinfo-price">
				已购买
			</view>
			<view class="shopinfo-btn">
				<text class="cu-btn bg-blue radius" @tap="toInfo">查看详情</text>
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
	import mpHtml from '@/components/mp-html/mp-html'
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
			AppStyle:this.$store.state.AppStyle,
				
				userInfo:"",
				
				sid:0,
				title:"",
				html:"",
				markdownData: {},
				price:"",
				num:"",
				imgurl:"",
				
				isLoading:0,
				
				isBuy:0,
				shopinfo:{},
				
				vipDiscount:0,
				vipPrice:0,
				scale:0,
				isvip:0,
				vip:0,
				currencyName:""
				
			}
		},
		components: {
		  mpHtml,
		},
		onReachBottom() {
		    //触底后执行的方法，比如无限加载之类的
			var that = this;
		},
		
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			that.getVipInfo();
			that.userStatus();
			
		},
		onPullDownRefresh(){
			var that = this;
			that.getInfo(that.sid);
			that.isBuyShop(that.sid);
		},
		onLoad(res) {
			var that = this;
			that.currencyName = that.$API.getCurrencyName();
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			if(res.sid){
				that.sid = res.sid;
				that.getInfo(that.sid);
				
			}
			
		},
		methods:{
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			getInfo(sid){
				var that = this;
				var data = {
					"key":that.sid,
				}
				that.$Net.request({
					url: that.$API.shopInfo(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						uni.stopPullDownRefresh();
						that.shopinfo = res.data;
						that.title = res.data.title;
						that.type = res.data.type;
						that.html = res.data.text;
						that.imgurl = res.data.imgurl;
						that.price = res.data.price;
						that.num = res.data.num;
						that.vipDiscount = res.data.vipDiscount;
						if(res.data.type!=1){
							that.isBuyShop(that.sid);
						}
						
						that.getUserInfo(res.data.uid);
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						uni.stopPullDownRefresh();
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			previewImage(image) {
				var imgArr = [];
				imgArr.push(image);
				//预览图片
				uni.previewImage({
					urls: imgArr,
					current: imgArr[0]
				});
			},
			shopBuy(){
				var that = this;
				var token= "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}else{
					uni.showToast({
					    title:"请先登录",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					var timer = setTimeout(function() {
						uni.navigateTo({
							url: '../user/login'
						});
						clearTimeout('timer')
					}, 1000)
					return false
				}
				var data = {
					"token":token,
					"sid":that.sid
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					url: that.$API.buyShop(),
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
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if(res.data.code==1){
							
							
							//跳转订单页面
							var timer = setTimeout(function() {
								uni.redirectTo({
								    url: '/pages/user/order'
								});
								clearTimeout('timer')
							}, 1000)
						}else{
							if(res.data.msg=="购买实体商品前，需要先设置收货地址"){
								var timer = setTimeout(function() {
									uni.redirectTo({
									    url: '/pages/user/address'
									});
									clearTimeout('timer')
								}, 1000)
							}
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
					}
				})
			},
			getUserInfo(id){
				var that = this;
				var data = {
					"key":id,
				}
				
				that.$Net.request({
					url: that.$API.getUserInfo(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.userInfo = res.data.data;
							that.userInfo.style = "background-image:url("+res.data.data.avatar+");"
						}
					},
					fail: function(res) {
					}
				});
			},
			toInfo(){
				var that = this;
				var data = that.shopinfo;
				if(data.type==1){
					uni.showToast({
						title: "实体商品请留意快递信息",
						icon: 'none'
					})
				}else{
					uni.navigateTo({
					    url: '/pages/contents/shoptext?sid='+data.id
					});
				}
			},
			isBuyShop(sid){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"sid":that.sid,
					"token":token
				}
				that.$Net.request({
					url: that.$API.isBuyShop(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.isBuy=1;
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
			toUserContents(data){
				var that = this;
				var name = data.name;
				var title = data.name+"的信息";
				if(data.screenName){
					title = data.screenName+" 的信息";
					name = data.screenName
				}
				var id= data.uid;
				var type="user";
				uni.navigateTo({
				    url: '/pages/contents/userinfo?title='+title+"&name="+name+"&uid="+id+"&avatar="+encodeURIComponent(data.avatar)
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
							//that.vipDiscount=res.data.data.vipDiscount;
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
							that.vip = res.data.data.vip;
							that.isvip = res.data.data.isvip;
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
		},
		
	}
</script>

<style>
</style>
