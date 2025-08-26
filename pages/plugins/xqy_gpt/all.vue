<template>
	<view class="user" :class="$store.state.AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					AI大模型
				</view>
				<view class="action">
					<!-- <text class="text-blue">沟通过</text> -->
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		
		<view class="cu-list menu-avatar userList" style="margin-top: 20upx;">
			<view class="cu-bar bg-white search">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input type="text" placeholder="输入搜索关键字" v-model="searchText"  @input="searchTag"></input>
					<view class="search-close" v-if="searchText!=''" @tap="searchClose()"><text class="cuIcon-close"></text></view>
				</view>
			</view>
			<view class="search-type grid col-2">
				<view class="search-type-box" @tap="setType(0)" :class="type==0?'active':''">
					<text>聊天GPT</text>
				</view>
				<view class="search-type-box" @tap="setType(1)" :class="type==1?'active':''">
					<text>AI应用</text>
				</view>
			</view>
			<view class="no-data" v-if="gptList.length==0&&dataLoad">
				<text class="cuIcon-text"></text>暂时没有数据
			</view>
			<view class="dataLoad" v-if="!dataLoad">
				<image src="@/static/loading.gif"></image>
			</view>
			<view class="cu-item" v-for="(item,index) in gptList" :key="index">
				<view class="cu-avatar round lg" :style="item.style"></view>
				<view class="content">
					<view class="text-black">
						<text class="text-pink margin-right-xs" v-if="item.isVip==1">[VIP]</text>{{item.name}}
					</view>
					<view class="text-gray text-sm flex">
						单次请求：<text class="text-orange">{{item.price}}</text>{{currencyName}}
					</view>
				</view>
				<view class="action goUserIndex">
					<view class="cu-btn bg-blue light" @tap="goChat(item)">
						<text class="cuIcon-messagefill margin-right-xs"></text>沟通
					</view>
				</view>
			</view>
			<view class="load-more" @tap="loadMore" v-if="gptList.length>=limit">
				<text>{{moreText}}</text>
			</view>

		</view>
		<!--加载遮罩-->
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="@/static/loading.gif"></image>
			</view>
		</view>
		<!--加载遮罩结束-->
	</view>
</template>

<script>
	import { localStorage } from '@/js_sdk/mp-storage/mp-storage/index.js'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
			AppStyle:this.$store.state.AppStyle,
				
				gptList:[],
				searchText:"",
				type:0,
				
				page:1,
				limit:10,
				moreText:"加载更多",
				isLoad:0,
				isLoading:0,
				currencyName:"",
				
				dataLoad:false,
			}
		},
		onPullDownRefresh(){
			var that = this;
			that.page=1;
			that.getGptList(false);
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
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
			that.page=1;
			// #ifdef APP-PLUS
			
			//plus.navigator.setStatusBarStyle("dark")
			// #endif
			
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			that.getGptList(false);
			uni.request({
				url:that.$API.SMset(),
				method:'GET',
				dataType:"json",
				success(res) {
					that.currencyName = res.data.assetsname;
				},
				fail(error) {
				  console.log(error);
				}//
				
			})
		},
		methods:{
			allCache(){
				var that = this;
			},
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			searchTag(){
				var that = this;
				var searchText = that.searchText;
				that.page=1;
				that.getGptList();
			
			},
			setType(type){
				var that = this;
				that.type = type;
				that.page=1;
				that.gptList = [];
				that.getGptList();
			},
			searchClose(){
				var that = this;
				that.searchText = "";
				that.page=1;
				that.getGptList();
			
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
			loadMore(){
				var that = this;
				that.moreText="正在加载中...";
				that.isLoad=1;
				that.getGptList(true);
				
			},
			getGptList(isPage){
				var that = this;
				var page = that.page;
				if(isPage){
					page++;
				}
				var token = ""
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				
				that.dataLoad = false;
				
				that.$Net.request({
					url: that.$API.PluginLoad('xqy_gpt'),
					data:{
						"plugin": "xqy_gpt",
						"action": "models",
						"type": that.type,
						"limit": that.limit,
						"page": page,
						"search_key": that.searchText,
						"token": token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						that.isLoad=0;
						that.dataLoad = true;
						
						if(res.data.code == 1 || res.data.code == 200){
							var list = [];
							
							// 处理不同返回格式
							if(res.data.data && Array.isArray(res.data.data)) {
								list = res.data.data;
							} else if(res.data.data && res.data.data.list && Array.isArray(res.data.data.list)) {
								list = res.data.data.list;
							}
							
							if(list.length>0){
								var gptList = [];
								for(var i in list){
									var arr = list[i];
									if(arr.avatar) {
										arr.style = "background-image:url("+arr.avatar+");";
									}
									gptList.push(arr);
								}
								if(isPage){
									that.page++;
									that.gptList = that.gptList.concat(gptList);
								}else{
									that.gptList = gptList;
								}
							}else{
								if(isPage){
									that.moreText="没有更多数据了";
								}else{
									that.gptList = [];
								}
							}
						} else {
							if(isPage){
								that.moreText="加载失败";
							}else{
								that.gptList = [];
							}
							uni.showToast({
								title: res.data.msg || "获取数据失败",
								icon: 'none'
							});
						}
						
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						that.dataLoad = true;
						that.isLoad=0;
						that.moreText="加载更多";
						uni.showToast({
							title: "网络连接失败",
							icon: 'none'
						});
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					}
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
			goChat(data){
				var that = this;
				if(!localStorage.getItem('token')||localStorage.getItem('token')==""){
					uni.showToast({
						title: "请先登录哦",
						icon: 'none'
					})
					return false;
				}
				if(data.type==0){
					uni.navigateTo({
						url: '/pages/plugins/xqy_gpt/chat?model_id='+data.id+'&name='+data.name
					});
				}else{
					uni.navigateTo({
						url: '/pages/plugins/xqy_gpt/app?model_id='+data.id+'&name='+data.name
					});
				}
				
			},
			subText(text,num){
				if(text){
					if(text.length>num){
						text = text.substring(0,num);
						return text+"……";
					}else{
						return text;
					}
				}else{
					return "管理员暂未设置介绍"
				}
			},
			
			
		}
	}
	
</script>

<style>
</style>
