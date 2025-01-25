<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					{{assetsname}}商城
				</view>
				<view class="action">
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="data-box">
			<view class="cu-bar bg-white search">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input type="text" placeholder="搜索商品" v-model="searchText"  @input="searchShop"></input>
				</view>
			</view>
			<view class="shop-sort">
				<view class="shop-sort-box" @tap="setType(0)":class="type=='0'?'active':''">
					全部
				</view>
				<view class="shop-sort-box" @tap="setType(1)":class="type=='1'?'active':''">
					实物
				</view>
				<view class="shop-sort-box" @tap="setType(2)":class="type=='2'?'active':''">
					其他
				</view>
				<view class="shop-sort-box" @tap="setType(3)":class="type=='3'?'active':''">
					软件资源
				</view>
				<view class="shop-sort-box" @tap="setType(4)":class="type=='4'?'active':''">
					技术教程
				</view>
			</view>
		</view>
		<view class="data-box">
			<view class="no-data" v-if="shopList.length==0">
				商品正在赶来的路上啦~
			</view>
			<view class="shop-list grid col-2">
				
				<view class="shop-box" v-for="(item,index) in shopList" :key="index">
					<view class="shop-main" @tap="shopInfo(item.id)">
						<view class="shop-img">
							<image :src="item.imgurl" mode="widthFix"></image>
						</view>
						<view class="shop-title">
							{{item.title}}
						</view>
						<view class="shop-info">
							<block v-if="isvip>0">
								<text class="shop-price text-red text-bold">{{parseInt(item.price * item.vipDiscount)}}</text><text class="text-sm margin-left-sm text-yellow">{{currencyName}}</text>
							</block>
							<block v-else>
								<text class="shop-price text-shojo text-bold">{{item.price}}</text><text class="text-sm margin-left-sm text-red">{{currencyName}}</text>
							</block>
							<text class="cuIcon-cart"></text>
						</view>
					</view>
				</view>

				
			</view>
		</view>
		<tn-popup v-model="modelVisible" mode="bottom" :borderRadius="23" :maskCloseable="false">
				      <view style="padding: 30rpx 40rpx;">
						  <view style="text-align: center;">{{assetsname}}商城购物保障</view>
						  <view class="model-body" style="margin-top: 20rpx;">在社区商城请放心购买，若购买后被骗请及时联系客服，支持全额退款！</view>
						  <view style="display: flex;justify-content: center;margin-top: 20rpx;">
						  	<tn-button style="margin-left: 20rpx;" backgroundColor="#3cc9a4" fontColor="#fff" @tap="okBtn">知道了</tn-button>
						  </view>
					  </view>
				</tn-popup>
		<view class="load-more" @tap="loadMore" v-if="shopList.length>0">
			<text>{{moreText}}</text>
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
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
				AppStyle:this.$store.state.AppStyle,
				
				modelVisible: true,
				userInfo:null,
				token:"",
				
				shopList:[],
				isLoad:0,
				page:1,
				moreText:"加载更多",
				type:0,
				assetsname:"",
				isLoading:0,
				searchText:"",
				
				vipDiscount:0,
				vipPrice:0,
				scale:0,
				isvip:0,
				vip:0,
				currencyName:"",
				
			}
		},
		onPullDownRefresh(){
			var that = this;
			that.page=1;
			that.getShopList(false);
			var timer = setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000)
		},
		onReachBottom() {
		    //触底后执行的方法，比如无限加载之类的
			var that = this;
			if(that.isLoad==0){
				that.loadMore();
			}
		},
		onShow(){
			var that = this;
			that.currencyName = that.$API.getCurrencyName();
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			
			// #endif
			if(localStorage.getItem('userinfo')){
				
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.userInfo.style = "background-image:url("+that.userInfo.avatar+");"
			}
			if(localStorage.getItem('token')){
				
				that.token = localStorage.getItem('token');
			}
			that.isLoad=0;
			that.page=1;
			that.allCache();
			that.getVipInfo();
			that.userStatus();
			
		},
		onLoad() {
			
			const modelViewTime = uni.getStorageSync('modelView');
						if(modelViewTime){
							console.log(modelViewTime);
							const nowDate = +new Date();
							const isVisible = nowDate - modelViewTime > 1000 * 60 * 60 * 6;
							if(!isVisible) {
								this.modelVisible = false;
							}
						}
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			that.getShopList(false);
		},
		
				mounted() {
						 this.getset();
						},
				methods: {
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
			searchShop(){
				var that = this;
				that.page=1;
				that.getShopList();
			},
			loadMore(){
				var that = this;
				that.moreText="加载中...";
				that.isLoad=1;
				that.getShopList(true);
				
			},
			setType(i){
				var that = this;
				that.type = i;
				that.page = 1;
				that.getShopList();
			},
			//公共缓存
			allCache(){
				var that = this;
				if(localStorage.getItem(that.type+'_shopList')){
					that.shopList = JSON.parse(localStorage.getItem(that.type+'_shopList'));
				}
			},
			getShopList(isPage){
				var that = this;
				var data = {
					"type":that.type,
					"status":"1"
				}
				if(that.type==0){
					data = {
						"status":"1"
					}
				}
				
				var page = that.page;
				if(isPage){
					page++;
				}
				that.$Net.request({
					url: that.$API.shopList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"searchKey":that.searchText,
						"limit":6,
						"page":page,
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
						that.isLoad=0;
						that.moreText="加载更多";
						if(res.data.code==1){
							var list = res.data.data;
							if(list.length==0){
								that.moreText="没有更多数据了";
							}
							if(isPage){
								if(list.length>0){
									that.page++;
									that.shopList = that.shopList.concat(list);
								}
							}else{
								
								that.shopList = list;
							}
							
							localStorage.setItem(that.type+'_shopList',JSON.stringify(that.shopList));
						}
					},
					fail: function(res) {
						that.moreText="加载更多";
						that.isLoad=0;
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
			shopInfo(sid){
				var that = this;
				uni.navigateTo({
				    url: '/pages/contents/shopinfo?sid='+sid
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
		components: {
			waves
		}
	}
</script>

<style>
</style>
