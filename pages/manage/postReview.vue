<template>
	<view class="user" :class="$store.state.AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					帖子审核
				</view>
				<!-- <view class="action" @tap="submit">
					<button class="cu-btn round bg-blue">提交</button>
				</view> -->
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		
		<view class="data-box">
			<form>
				<view class="cu-form-group" @tap="toSection()">
					<view class="title">选择版块</view>
					<view class="picker">
						<text class="text-green">{{curSection.name}}</text>
						<text class="cuIcon-right"></text>
					</view>
				</view>
			</form>
			<view class="cu-bar bg-white search">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input type="text" placeholder="输入搜索关键字" v-model="searchText"  @input="searchTag"></input>
					<view class="search-close" v-if="searchText!=''" @tap="searchClose()"><text class="cuIcon-close"></text></view>
				</view>
			</view>
			<view class="search-type grid col-3">
				<view class="search-type-box" @tap="toType(0)" :class="status==0?'active':''">
					<text>待审核</text>
				</view>
				<view class="search-type-box" @tap="toType(2)" :class="status==2?'active':''">
					<text>已锁定</text>
				</view>
				<view class="search-type-box" @tap="toType(1)" :class="status==1?'active':''">
					<text>已发布</text>
				</view>
			</view>
			<view class="forum-list-main postReview">
				<view class="no-data" v-if="postList.length==0">
					<text class="cuIcon-text"></text>暂时没有数据
				</view>
				<view class="forum-list-box" v-for="(item,index) in postList">
					<view class="forum-list-content">
						<view class="forum-list-user">
							<view class="forum-avatar">
								<image :src="item.userJson.avatar"></image>
							</view>
							<view class="forum-userinfo">
								<view class="forum-userinfo-name">
									{{item.userJson.name}}
								</view>
								<view class="forum-userinfo-date">
									发布于 {{formatDate(item.created)}}
								</view>
							</view>
						</view>
						<view class="forum-list-text"  @tap="goInfo(item.id)">
							<view class="forum-list-title">
								{{item.title}}
							</view>
							<view class="forum-list-intro">
								{{item.text}}
							</view>
						</view>
						<block  v-if="item.images.length>0">
							<view class="grid flex-sub col-3 grid-square forum-media" v-if="item.images.length>1">
								<view class="bg-img"  :style="'background-image:url('+data+');'"
								 v-for="(data,i) in item.images" :key="i">
								</view>
							</view>
							<view class="forum-media forum-one" v-else>
								<image :src="item.images[0]" mode="widthFix"></image>
							</view>
						</block>
						
					</view>
					<view class="forum-list-operate padding-sm text-center bg-white">
						<block v-if="item.status==0">
							<text class="bg-green cu-btn xs radius" @tap="toReview(item.id,1,index)"> <text class="cuIcon-check"></text>通过</text>
							<text class="bg-red cu-btn xs radius margin-left" @tap="toReview(item.id,0,index)"><text class="cuIcon-close"></text>不通过</text>
						</block>
						<block v-if="item.status==1">
							<text class="bg-black cu-btn xs radius" @tap="toLock(item.id,2,index)"><text class="cuIcon-lock"></text>锁定</text>
						</block>
						<block v-if="item.status==2">
							<text class="bg-black cu-btn xs radius" @tap="toLock(item.id,1,index)"><text class="cuIcon-unlock"></text>解除锁定</text>
						</block>
					</view>
					
				</view>
				<view class="load-more" @tap="loadMore" v-if="dataLoad&&postList.length>0">
					<text>{{moreText}}</text>
				</view>
			</view>
		</view>
		
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
	
				token:'',
				curSection:{
					"name":"",
					"id":0,
				},
				status:0,
				
				group:"",

				modalName: null,
				
				postList:[],
				topList:[],
				dataLoad:false,
				
				page:1,
				moreText:"加载更多",
				
				isLoading:0,
				isLoad:0,
				
				searchText:"",
				
			}
		},
		onPullDownRefresh(){
			var that = this;
			that.page=1;
			that.getPostList(false);
			var timer = setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000)
			
		},
		onHide() {
			localStorage.removeItem('getuid')
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			//plus.navigator.setStatusBarStyle("dark")
			// #endif
			
			if(localStorage.getItem('curSection')){
				that.curSection =JSON.parse(localStorage.getItem('curSection'));
				that.page=1;
				that.getPostList(false);
				localStorage.removeItem('curSection')
			}
			
		},
		onReachBottom() {
		    //触底后执行的方法，比如无限加载之类的
			var that = this;
			if(that.isLoad==0){
				that.loadMore();
			}
		},
		onLoad(res) {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			if(localStorage.getItem('token')){
				
				that.token = localStorage.getItem('token');
			}
		},
		methods: {
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			toType(type){
				var that = this;
				that.status = type;
				that.page=1;
				that.getPostList(false);
			},
			toSection(){
				var that = this;
				uni.navigateTo({
				    url: '/pages/forum/section?type=1'
				});
			},
			searchClose(){
				var that = this;
				that.searchText = "";
				that.page=1;
				that.getPostList(false);
			
			},
			searchTag(){
				var that = this;
				var searchText = that.searchText;
				that.page=1;
				that.getPostList(false);
			},
			loadMore(){
				var that = this;
				that.moreText="正在加载中...";
				that.isLoad=1;
				that.getPostList(true);
				
			},
			getPostList(isPage){
				var that = this;
				var page = that.page;
				var token = "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				if(isPage){
					page++;
				}
				var data = {
					"section":that.curSection.id,
					"status":that.status
				}
				var order = that.order;
				if(order=='recommend'){
					data.isrecommend = 1;
				}else{
					data.order = order;
				}	
				that.$Net.request({
					url: that.$API.postList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":10,
						"page":page,
						"order":that.orderKey,
						"searchKey":that.searchText,
						"token":token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.dataLoad =true;
						that.isLoad=0;
						if(res.data.code==1){
							var list = res.data.data;
							if(list.length>0){
								
								var postList = list;
								if(isPage){
									that.page++;
									that.postList = that.postList.concat(postList);
								}else{
									that.postList = postList;
								}
							}else{
								if(isPage){
									that.moreText="没有更多数据了";
								}else{
									that.postList = [];
								}
								
							}
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
						that.isLoading = 1;
					},
					fail: function(res) {
						that.dataLoad =true;
						that.isLoad=0;
						that.moreText="加载更多";
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
						that.isLoading = 1;
					}
				})
			},
			toLock(id,type,index){
				var that = this;
				
				var typeText = "确定要锁定帖子吗？";
				if(type==1){
					typeText = "确定要取消锁定帖子吗？";
				}
				var token = "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"id":id,
					"type":type,
					"token":token
				}
				uni.showModal({
				    title: typeText,
				    success: function (res) {
				        if (res.confirm) {
							
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.postLock(),
				            	data:data,
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
				            			that.page=1;
				            			that.getPostList(false);
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
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			formatDate(datetime) {
				var datetime = new Date(parseInt(datetime * 1000));
				var year = datetime.getFullYear(),
					month = ("0" + (datetime.getMonth() + 1)).slice(-2),
					date = ("0" + datetime.getDate()).slice(-2),
					hour = ("0" + datetime.getHours()).slice(-2),
					minute = ("0" + datetime.getMinutes()).slice(-2);
				var result = year + "-" + month + "-" + date + " " + hour + ":" + minute;
				return result;
			},
			toReview(id,type,index){
				var that = this;
				var typeText = "确定要审核帖子吗？";
				if(type==0){
					typeText = "确定要不过审帖子吗？";
				}
				var token = "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"id":id,
					"type":type,
					"token":token
				}
				uni.showModal({
				    title: typeText,
				    success: function (res) {
				        if (res.confirm) {
							
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.postReview(),
				            	data:data,
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
				            			that.page=1;
				            			that.getPostList(false);
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
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			goInfo(id){
				var that = this;
				uni.navigateTo({
					url: '/pages/forum/info?id='+id
				});
			},
		},
	}
</script>

<style>
</style>