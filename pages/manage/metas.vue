<template>
	<view class="userpost" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					话题和分类
				</view>
				<!--  #ifdef H5 || APP-PLUS -->
				<view class="action" @tap="toAdd">
					<text class="cuIcon-add"></text>
				</view>
				<!--  #endif -->
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="data-box">
			<view class="cu-bar bg-white search">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input type="text" placeholder="输入搜索关键字" v-model="searchText"  @input="searchTag"></input>
					<view class="search-close" v-if="searchText!=''" @tap="searchClose()"><text class="cuIcon-close"></text></view>
				</view>
			</view>
			<view class="search-type grid col-2">
				<view class="search-type-box" @tap="toType('category')" :class="type=='category'?'active':''">
					<text>分类</text>
				</view>
				<view class="search-type-box" @tap="toType('tag')" :class="type=='tag'?'active':''">
					<text>话题</text>
				</view>
			</view>
			<!--  #ifdef MP -->
			<view class="all-btn">
				<view class="user-btn flex flex-direction">
					<button class="cu-btn bg-blue margin-tb-sm lg" @tap="toAdd">创建分类/话题</button>
					
				</view>
			</view>
			<!--  #endif -->
			<view class="no-data" v-if="metaList.length==0">
				<text class="cuIcon-text"></text>暂时没有数据
			</view>
			<view class="cu-card article no-card">
				<view class="cu-item shadow"  v-for="(item,index) in metaList" :key="index">
					<view class="content">
						<view class="desc meta-main">
							<view class="text-content">{{item.name}}
							
							<text class="meta-id">MID：{{item.mid}}</text>
							</view>
						</view>
						
					</view>
					<view class="manage-btn">
										
						<text class="cu-btn text-green radius" v-if="item.isrecommend==0"  @tap="toRecommend(item.mid,1)">推荐</text>
						<text class="cu-btn text-grey radius" v-else  @tap="toRecommend(item.mid,0)">取消推荐</text>
					
						<text class="cu-btn text-blue radius" @tap="toEdit(item.mid)">编辑</text>
						<text class="cu-btn text-red radius" @tap="toDelete(item.mid)">删除</text>
					</view>
				</view>
				<view class="load-more" @tap="loadMore" v-if="metaList.length>0">
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
				metaList:[],
				searchText:"",
				type:"category",
				page:1,
				moreText:"加载更多",
				
				isLoad:0,
				token:"",
				isLoading:0,
			}
		},
		onPullDownRefresh(){
			var that = this;
			that.page=1;
			that.getMetaList(false);
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
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			that.getMetaList(false);
			that.page = 1;
			
		},
		methods: {
			toRecommend(id,type){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					'key':id,
					'recommend':type,
					"token":token
			
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.metaRecommend(),
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
							that.page=1;
							that.moreText="加载更多";
							that.isLoad=0;
							that.getMetaList(false);
							
						}
					},
					fail: function(res) {
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络开小差了哦",
							icon: 'none'
						})
						uni.stopPullDownRefresh()
					}
				})
			},
			loadMore(){
				var that = this;
				that.moreText="加载中...";
				that.isLoad=1;
				that.getMetaList(true);
			},
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			toType(i){
				var that = this;
				that.type=i;
				that.page=1;
				that.metaList = [];
				that.moreText="加载更多";
				that.isLoad=0;
				that.getMetaList(false);
			},
			toDelete(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"id":id,
					"token":token
				}
				uni.showModal({
				    title: '确定要删除该数据吗',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.deleteMeta(),
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
				            			that.page=1;
				            			that.moreText="加载更多";
				            			that.isLoad=0;
				            			that.getMetaList(false);
				            			
				            		}
				            		
				            	},
				            	fail: function(res) {
				            		setTimeout(function () {
				            			uni.hideLoading();
				            		}, 1000);
				            		uni.showToast({
				            			title: "网络开小差了哦",
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
			getMetaList(isPage){
				var that = this;
				var data = {
					"type":that.type,
				}
				var page = that.page;
				if(isPage){
					page++;
				}
				that.$Net.request({
					url: that.$API.getMetasList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":8,
						"page":page,
						"searchKey":that.searchText,
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						uni.stopPullDownRefresh()
						that.isLoad=0;
						//console.log(JSON.stringify(res))
						that.moreText="加载更多";
						if(res.data.code==1){
							var list = res.data.data;
							if(list.length>0){
								if(isPage){
									that.page++;
									that.metaList = that.metaList.concat(list);
								}else{
									that.metaList = list;
								}
								
							}else{
								that.moreText="没有更多了~";
								if(!isPage){
									that.metaList = list;
								}
							}
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						uni.stopPullDownRefresh()
						that.moreText="加载更多";
						that.isLoad=0;
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			addRecommend(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					'mid':id,
					'isrecommend':1,
			
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.editMeta(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token":token,
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
							that.page=1;
							that.moreText="加载更多";
							that.isLoad=0;
							that.getMetaList(false);
							
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
			},
			rmRecommend(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					'mid':id,
					'isrecommend':0,
			
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.editMeta(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token":token,
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
							that.page=1;
							that.moreText="加载更多";
							that.isLoad=0;
							that.getMetaList(false);
							
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
			},
			toEdit(id){
				var that = this;
				
				uni.navigateTo({
					url: '/pages/manage/metasedit?type=edit&mid='+id
				});
			},
			toAdd(){
				var that = this;
				
				uni.navigateTo({
					url: '/pages/manage/metasedit?type=add'
				});
			},
			searchTag(){
				var that = this;
				var searchText = that.searchText;
				that.page=1;
				that.getMetaList();
			
			},
			searchClose(){
				var that = this;
				that.searchText = "";
				that.page=1;
				that.getMetaList();
			
			},
		}
		
	}
</script>

<style>
</style>
