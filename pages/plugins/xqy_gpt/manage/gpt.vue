<template>
	<view class="user" :class="$store.state.AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					大模型管理
				</view>
				<view class="action">
					<button class="cu-btn round bg-blue"  @tap="toLink('/pages/plugins/xqy_gpt/manage/gptAdd')">新增</button>
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
			<view class="no-data" v-if="gptList.length==0">
				<text class="cuIcon-text"></text>暂时没有数据
			</view>
			<view class="cu-item" v-for="(item,index) in gptList" :key="index">
				<view class="cu-avatar round lg" :style="item.style"></view>
				<view class="content">
					<view class="text-black">
						{{item.name}}
					</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut">
							{{subText(item.intro,100)}}
						</view>
					</view>
				</view>
				<view class="action user-list-btn">
					<view class="cu-btn text-red radius"  @tap="deleteGpt(item.id)">
						<text class="cuIcon-deletefill"></text>
					</view>
					<view class="cu-btn text-blue radius" @tap="toEdit(item.id)" >
						<text class="cuIcon-post"></text>
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
				
			}
		},
		onPullDownRefresh(){
			var that = this;
			that.page=1;
			that.getUserList(false);
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
				var data = {
					"type":that.type
				}
				that.$Net.request({
					url: that.$API.PluginLoad('xqy_gpt'),
					data:{
						"plugin": "xqy_gpt",
						"action": "models",
						"type": that.type,
						"limit": that.limit,
						"search_key": that.searchText,
						"page": page,
						"token": token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						that.isLoad=0;
						if(res.data && res.data.code==200){
							var list = res.data.data && res.data.data.list ? res.data.data.list : [];
							if(list.length>0){
								
								var gptList = [];
								for(var i in list){
									var arr = list[i];
									if(arr.avatar) {
										arr.style = "background-image:url("+arr.avatar+");";
									} else {
										arr.style = "background-image:url(/static/admin/images/ai.png);";
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
							// 处理错误响应
							//console.log("获取模型列表失败：", res.data);
							that.gptList = [];
							if(res.data && res.data.msg) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						that.isLoad=0;
						that.moreText="加载更多";
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
			toEdit(id){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/plugins/xqy_gpt/manage/gptAdd?type=edit&id='+id
				});
			},
			deleteGpt(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"id": id,
					"token": token
				}
				uni.showModal({
				    title: '删除将清空该模型所有聊天室和消息',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.PluginLoad('xqy_gpt'),
				            	data: {
									"plugin": "xqy_gpt",
									"action": "deleteModel",
									"id": id,
									"token": token
								},
				            	header:{
				            		'Content-Type':'application/x-www-form-urlencoded'
				            	},
				            	method: "post",
				            	dataType: 'json',
				            	success: function(res) {
				            		setTimeout(function () {
				            			uni.hideLoading();
				            		}, 1000);
									
									if(res.data && res.data.msg) {
										uni.showToast({
											title: res.data.msg,
											icon: 'none'
										})
									} else {
										uni.showToast({
											title: "操作完成",
											icon: 'none'
										})
									}
									
				            		if(res.data && res.data.code==200){
										that.page=1;
				            			that.getGptList();
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
				            //console.log('用户点击取消');
				        }
				    }
				});
				
			},
		}
	}
	
</script>

<style>
</style>
