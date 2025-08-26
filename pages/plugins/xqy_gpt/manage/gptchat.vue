<template>
	<view class="user" :class="$store.state.AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					<template v-if="uid==0">
						GPT聊天消息管理
					</template>
					<template v-else>
						单独查询UID：{{uid}}
					</template>
				</view>
				<view class="action">
					<template v-if="uid!=0">
						<text class="text-blue" @tap="setUid(0)">重置查询</text>
					</template>
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		
		<view class="cu-card dynamic no-card" style="margin-top: 20upx;">
			<view class="cu-bar bg-white search">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input type="text" placeholder="搜索消息内容或用户名" v-model="searchText"  @input="searchTag"></input>
				</view>
			</view>

			<view class="select-type"  v-if="uid==0">
				<text class="select-type-value" :class="isAI==-1?'cur':''" @tap="setType(-1)">全部</text>
				<text>|</text>
				<text class="select-type-value" :class="isAI==0?'cur':''" @tap="setType(0)">仅用户</text>
				<text>|</text>
				<text class="select-type-value" :class="isAI==1?'cur':''" @tap="setType(1)">仅AI</text>
			</view>
			<view class="cu-item chat-history"  v-for="(item,index) in msgList" :key="index" :class="item.isAI==0?'self':''">
				<view class="chat-history-user">
					<template v-if="item.isAI==1" >
						<view class="cu-avatar radius" :style="'background-image:url('+item.gptJson.avatar+');'"></view>
						
					</template>
					<template v-else >
						<view class="cu-avatar radius" :style="'background-image:url('+item.userJson.avatar+');'"></view>
					</template>
				</view>
				<view class="chat-history-main">
					<view class="chat-history-user">
						<template v-if="item.isAI==1" >
							{{item.gptJson.name}}
							
						</template>
						<template v-else >
							{{item.userJson.name}}
						</template>
					</view>
					<view class="content shadow break-all" @longtap="ToCopy(item.text)">
						<!-- <rich-text :nodes="markHtml(item.text)"></rich-text> -->
						<mp-html :content="item.text" :selectable="true" :show-img-menu="true"  :scroll-table="true" :markdown="true"/>
					</view>
					<view class="date">
					{{formatDate(item.created)}}
					</view>
					<template v-if="item.isAI==0">
						<view class="chat-history-btn">
							<text class="text-blue" @tap="setUid(item.userJson.uid)">查看消息</text>
							<text class="text-red margin-left" @tap="toBan(item.userJson.uid)">封禁用户</text>
						</view>
					</template>
				</view>
				<!-- <view class="cu-avatar radius"  v-if="item.isAI==0" :style="'background-image:url('+item.userJson.avatar+');'"></view> -->
				
			</view>
			<view class="load-more" @tap="loadMore" v-if="msgList.length>=limit">
				<text>{{moreText}}</text>
			</view>
			<!-- {{msgList}} -->
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
			
				uid:0,
				isAI:-1,
				id:0,
				msgList:[],
				moreText:"加载更多",
				page:1,
				limit:10,
				
				searchText:"",
				
				isLoading:0,
				avatar:"",
				name:"",
				price:"",
				intro:"",
				
			}
		},
		onPullDownRefresh(){
			var that = this;
			that.page=1;
			that.getGptMsgList(false);
			var timer = setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000)
			
		},
		onReachBottom() {
		    //触底后执行的方法，比如无限加载之类的
			var that = this;
			that.loadMore();
		},
		onShow(){
			var that = this;
			that.page = 1;
			// #ifdef APP-PLUS
			
			//plus.navigator.setStatusBarStyle("dark")
			// #endif
		},
		onLoad(res) {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			that.getGptMsgList(false);
			
		},
		methods:{

			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			replaceAll(string, search, replace) {
			  return string.split(search).join(replace);
			},

			loadMore(){
				var that = this;
				that.moreText="正在加载中...";
				if(that.isLoad==0){
					that.getGptMsgList(true);
				}
			},
			toInfo(cid,title){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/contents/info?cid='+cid+"&title="+title
				});
			},
			setType(type){
				var that = this;
				that.isAI = type;
				that.page=1;
				//console.log("设置筛选类型:", type);
				that.getGptMsgList(false);
			},
			setUid(uid){
				var that = this;
				that.isAI = -1;
				that.uid = uid;
				that.page=1;
				that.getGptMsgList();
			},
			searchTag(){
				var that = this;
				var searchText = that.searchText;
				that.page=1;
				that.getGptMsgList();
			
			},
			getGptMsgList(isPage){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var page = that.page;
				if(isPage){
					page++;
				}
				var data = {}
				
				//console.log("当前筛选类型:", that.isAI);
				
				that.$Net.request({
					url: that.$API.PluginLoad('xqy_gpt'),
					data:{
						"plugin": "xqy_gpt",
						"action": "history",
						"limit": that.limit,
						"page": page,
						"uid": that.uid > 0 ? that.uid : null,
						"search_key": that.searchText,
						"isAI": that.isAI,
						"scene": "admin",
						"token": token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						that.isLoad=0;
						//console.log("获取消息列表响应:", res.data);
						
						if(res.data.code==1 || res.data.code == 200){
							var list = [];
							
							// 处理不同的返回格式
							if(res.data.data && Array.isArray(res.data.data)) {
								list = res.data.data;
							} else if(res.data.data && res.data.data.list && Array.isArray(res.data.data.list)) {
								list = res.data.data.list;
							}
							
							if(list.length>0){
								var msgList = [];
								for(var i in list){
									var arr = list[i];
									
									// 确保必要的属性存在
									if(!arr.userJson) {
										arr.userJson = {
											name: "用户",
											avatar: "/static/user/avatar.png"
										};
									}
									
									// 为AI消息添加gptJson
									if(arr.isAI == 1 && !arr.gptJson) {
										arr.gptJson = {
											name: "AI助手",
											avatar: "/static/admin/images/ai.png"
										};
									}
									
									msgList.push(arr);
								}
								
								if(isPage){
									that.page++;
									that.msgList = that.msgList.concat(msgList);
								}else{
									that.msgList = msgList;
								}
								that.moreText = "加载更多";
							}else{
								that.moreText="没有更多数据了";
								if(!isPage){
									that.msgList = list;
								}
							}
							
						} else {
							uni.showToast({
								title: res.data.msg || "获取消息列表失败",
								icon: 'none'
							});
						}
						
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300);
					},
					fail: function(res) {
						that.isLoad = 0;
						that.moreText = "加载更多";
						
						uni.showToast({
							title: "网络请求失败",
							icon: 'none'
						});
						
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300);
					}
				})
			},
			toStatus(i){
				var that = this;
				that.status=i;
				that.page=1;
				that.moreText="加载更多";
				that.isLoad=0;
				that.getCommentsList(false);
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
			
			replaceSpecialChar(text) {
				if(!text){
					return false;
				}
				text = text.replace(/&quot;/g, '"');
				text = text.replace(/&amp;/g, '&');
				text = text.replace(/&lt;/g, '<');
				text = text.replace(/&gt;/g, '>');
				text = text.replace(/&nbsp;/g, ' ');
				return text;
			},
			toBan(uid){
				uni.navigateTo({
				    url: '/pages/manage/banuser?uid='+uid
				});
			}
		}
	}
</script>

<style>
</style>
