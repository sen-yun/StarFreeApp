<template>
	<view class="userpost userIndex" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar*2 + 'upx'}]"  :class="scrollTop>40?'goScroll':''">
			<view class="cu-bar" :style="{'height': CustomBar*2 + 'upx','padding-top':StatusBar*2 + 'upx'}">
				<view :class="scrollTop<40 && isLoading !== 0 ?'action2 cu-bar2':''" class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" style="height: 60upx;" :style="[{top:StatusBar*2 + 'upx'}]">
					<block v-if="scrollTop>40">
					<block v-if="uid==vid">
						<text :class="isvip ? 'text-shojo2' : ''">
							{{myname}}
						</text>
					</block>
					<block v-else>
						<text :class="isvip ? 'text-shojo2' : ''">
							{{name}}
						</text>
					</block>
					
					</block>
				</view>
				<!--  #ifdef H5 || APP-PLUS -->
				<view :class="scrollTop<40 && isLoading !== 0 ?'action2 cu-bar2':''" class="action" @tap="toSearch">
					<text class="cuIcon-search"></text>
				</view>
				<!--  #endif -->
			</view>
		</view>
		<!-- <view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view> -->
		<view class="all-box" style="margin-top:-10upx">
			
			<view class="user-info" :style="'padding-top:'+NavBar*2 + 'upx;height:480upx;position:initial'">
				<view class="user-info-bg">
					<image :src="bgurl || avatar" mode="aspectFill" style="height:450upx"></image>
				</view>
				<view class="user-info-main" style="background-color: transparent;">
				  <view class="user-info-content" style="background: transparent;padding: 0upx 0upx 0upx 60upx;z-index: 99;">
				    <view class="user-info-col" style="overflow:visible">
				      <view class="user-header" style="width: 180upx;">
				        <image :src="avatar" style="width: 180upx;height: 180upx;border: 6upx solid white;border-radius:90upx;background-color:white;"></image>
				      </view>
				    </view>
					<div class="user-text" style="width: calc(100% - 200upx);color: black;text-align: center;">
					  <div class="user-info-data col-3" style="padding:65upx 20upx 0upx 20upx;">
					    <div class="user-info-data-box">
					      <div class="user-data-num">{{formatNumber(fanNum)}}<text v-if="fanNum>9999" class="sup-script">万</text></div>
					      <div class="user-data-label" style="opacity:1">粉丝</div>
					    </div>
					    <div class="user-info-data-box">
					      <div class="user-data-num">{{formatNumber(fancount)}}<text v-if="fancount>9999" class="sup-script">万</text></div>
					      <div class="user-data-label" style="opacity:1">关注</div>
					    </div>
					    <div class="user-info-data-box">
					      <div class="user-data-num">{{formatNumber(likesall)}}<text v-if="likesall>9999" class="sup-script">万</text></div>
					      <div class="user-data-label" style="opacity:1">获赞</div>
					    </div>
					  </div>
					</div>
				  </view>
				  <view class="bg-white padding-tb bg-white" style="position: absolute; width: 100%; bottom:0upx;border-radius: 32upx 32upx 0 0;height:120upx;"></view>
				</view>
			</view>
			<!--  #ifdef H5 || APP-PLUS -->
			<view class="user-name" style="padding: 10upx 60upx 0upx 60upx;">
			<text class="user-info-name" style="font-size: 45upx;font-weight: 600;color: black;" @click="copyName">
				<block v-if="uid==vid">
					<text :class="isvip ? 'text-shojo2' : ''">
						{{myname}}
					</text>
				</block>
				<block v-else>
					<text :class="isvip ? 'text-shojo2' : ''">
						{{name}}
					</text>
				</block>
			</text>
			<view class="user-info-data-box" style="text-align: left;margin-top: 8upx;">
				<text class="user-data-label" @click="copyUid">{{appname}}: </text>
				<text class="user-data-label" style="margin-right: 10upx;" @click="copyUid">{{uid}}</text>
				<text class="tn-icon-copy mirror" @click="copyUid"></text>
			</view>
			<view class="user-data-label" style="margin-top: 10upx;word-wrap: break-word">
				<block v-if="introduce!=''&&introduce">
					{{subText(introduce,60)}}
				</block>
				<block v-else>
					Ta还没有个人介绍哦
				</block>
			</view>
			<view class="user-info-data-box" style="margin-top: 10upx;text-align: left;">
				<text class="userlv" v-if="isvip" style="margin-left: 0px;background: linear-gradient(to bottom right, #f2ad5c, #e6216d,#901ccb);color:white;padding: 2upx 10upx;border-radius: 20upx;">VIP</text>
				<text class="userlv" :style="getLvStyle(experience)"  :class="isvip ? '' : 'xyy'" style="padding: 2upx 10upx;">{{getLv(experience)}}</text>
				<text class="userlv customize" style="border: 3upx solid black;color:black;padding: 2upx 10upx;border-radius: 40upx;background-color: transparent;" v-if="customize&&customize!=''">{{customize}}</text>
			</view>
			<view class="user-info-data-box" style="margin-top: 10upx;text-align: center;margin-right: 0upx;">
				<view v-if="uid==vid" class="userInfo-bottom-main grid2 col-2">
					<view class="userInfo-bottom-box" style="padding:0upx 15upx 0upx 0upx;width: 70%;">
						<button class="cu-btn bg-gray" style="border-radius: 100upx" @tap="toLink('/pages/user/useredit?backif=1')"><text class="tn-icon-edit-form"></text>编辑资料</button>
					</view>
					<view class="userInfo-bottom-box" style="padding:0upx 0upx 0upx 15upx;width: 30%;">
						<button class="cu-btn" style="border-radius: 100upx;background-color: #f0f0f0;color: #333333;" @tap="toSetup"><text class="tn-icon-set"></text>设置</button>
					</view>
				</view>
				<view v-else class="userInfo-bottom-main grid col-2">
					<view class="userInfo-bottom-box" style="padding:0upx 15upx 0upx 0upx;">
						<button class="cu-btn bg-gray" style="border-radius: 100upx;" @tap="follow(0)" v-if="isFollow==1"><text class="cuIcon-check"></text>已关注</button>
						<button class="cu-btn bg-shojo" style="border-radius: 100upx;" @tap="follow(1)" v-else><text class="cuIcon-add"></text>关注</button>
					</view>
					<view class="userInfo-bottom-box" style="padding:0upx 0upx 0upx 15upx;">
						<button class="cu-btn" style="border-radius: 100upx;background-color: #f0f0f0;color: #333333;" @tap="getPrivateChat()"><text class="cuIcon-mark"></text>私聊</button>
					</view>
				</view>
			</view>
			</view>
			
			<!-- <view class="userinfo-lv"> -->
				<!--  #ifdef H5 || APP-PLUS -->
			<!-- <text class="userlv" :style="getUserLvStyle(lv)">{{getUserLv(lv)}}</text> -->
			<!--  #endif -->
			
			
			<!-- </view> -->
			
			<view class="search-type grid col-3">
				<view class="search-type-box" style="width: 10%;" @tap="toType(0)" :class="type==0?'active':''">
					<text>帖子</text>
				</view>
				<view class="search-type-box" style="width: 10%;" @tap="toType(2)" :class="type==2?'active':''">
					<text>动态</text>
				</view>
				<view class="search-type-box" style="width: 10%;" @tap="toType(1)" :class="type==1?'active':''">
					<text>评论</text>
				</view>
				
			</view>
			<!--  #endif -->
			<!--  #ifdef MP -->
			<view class="search-type grid col-2">
				<view class="search-type-box" @tap="toType(0)" :class="type==0?'active':''">
					<text>帖子</text>
				</view>
				<view class="search-type-box" @tap="toType(2)" :class="type==2?'active':''">
					<text>动态</text>
				</view>
			</view>
			<!--  #endif -->
			
			<view class="cu-card article no-card" v-if="type==0">
				<block v-for="(item,index) in contentsList" :key="index" v-if="type==0">
					<articleItem :item="item"></articleItem>
				</block>
				<view class="load-more" @tap="loadMore" v-if="contentsList.length>0">
					<text>{{moreText}}</text>
				</view>
				<view class="no-data" v-if="contentsList.length==0">
					<text class="cuIcon-text"></text>
					暂时没有数据
				</view>

			</view>
			<view class="search-space" v-if="type==2">
				<view class="no-data" v-if="spaceList.length==0">
					<text class="cuIcon-text"></text>
					暂时没有动态
				</view>
				<spaceItem :spaceList="spaceList"></spaceItem>
				<view class="load-more" @tap="loadMore" v-if="spaceList.length>0">
					<text>{{moreText}}</text>
				</view>
			</view>
			<!--评论-->
			<view class="cu-list menu-avatar" v-if="type==1">
				<view class="no-data" v-if="commentsList.length==0">
					<text class="cuIcon-text"></text>
					暂时没有评论
				</view>
				<view class="cu-card dynamic no-card" style="margin-top: 20upx;">
					<block  v-for="(item,index) in commentsList" :key="index" v-if="commentsList.length>0">
						<commentItem :item="item" :isHead="false"></commentItem>
					</block>
					
				</view>
				
				<view class="load-more" @tap="loadMore" v-if="commentsList.length>0">
					<text>{{moreText}}</text>
				</view>
			</view>
			<!--评论结束-->
			
			<!--占位区域-->
			<view style="width: 100%;height: 100upx; background-color: #f6f6f6;"></view>
		</view>
		<!--底部操作
		<view class="userInfo-bottom-btn" v-if="vid!=uid">
			<view class="userInfo-bottom-main grid col-2">
				<view class="userInfo-bottom-box" @tap="getPrivateChat()">
					<view class="userInfo-tochat">
						<text class="cuIcon-mark"></text>私聊
					</view>
					
				</view>
				<view class="userInfo-bottom-box">
					<button class="cu-btn bg-gray" @tap="follow(0)" v-if="isFollow==1"><text class="cuIcon-check"></text>已关注</button>
					<button class="cu-btn bg-shojo" @tap="follow(1)" v-else><text class="cuIcon-add"></text>关注</button>
					
				</view>
			</view>
		</view>-->
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
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	// #ifdef APP-PLUS
	import owo, { data } from '../../static/app-plus/owo/OwO.js'
	// #endif
	// #ifdef H5
	import owo from '../../static/h5/owo/OwO.js'
	// #endif
	// #ifdef MP
	var owo = [];
	// #endif
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
			AppStyle:this.$store.state.AppStyle,
				
				contentsList:[],
				commentsList:[],
				spaceList:[],
				likesall:0,
				fancount:0,
				userList:[],
				owo:owo,
				owoList:[],
				uhname:"",
				type:0,
				appname:this.$API.GetappJC(),
				page:1,
				moreText:"加载更多",
				experience:0,
				isLoad:0,
				
				isLoading:0,
				bgurl:"",
				title:"",
				uid:0,
				avatar:"",
				name:"",
				customize:"",
				lv:"",
				vip:"",
				isvip:"",
				introduce:"",
				fanNum:0,
				contentsNum:0,
				commentsNum:0,
				myname:"",
				scrollTop:0,
				isFollow:0,
				
				vid:"",
				
				
			} 
			
		},
		onPageScroll(res){
			var that = this;
			that.scrollTop = res.scrollTop;
		},
		onShow(){
			var that = this;
			if(localStorage.getItem('userinfo')){
				
				var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.vid = userInfo.uid;
			}
			var i = that.type;
			that.page=1;
			that.moreText="加载更多";
			that.isLoad=0;
			that.getIsFollow();
			that.getUserInfo();
			if(i==0){
				that.getContentsList(false);
			}else if(i==1){
				that.getCommentsList(false)
			}else{
				that.getSpaceList(false)
			}
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			
			
			
		},
		onReachBottom() {
		    //触底后执行的方法，比如无限加载之类的
			var that = this;
			if(that.isLoad==0){
				that.loadMore();
			}
			
		},
		onPullDownRefresh(){
			var that = this;
			var i = that.type;
			that.page=1;
			that.moreText="加载更多";
			that.isLoad=0;
			that.getIsFollow();
			that.getUserInfo();
			that.getUserData();
			that.getgg();
			if(i==0){
				that.getContentsList(false);
			}else if(i==1){
				that.getCommentsList(false)
			}else{
				that.getSpaceList(false)
			}
			that.getgg();
		},
		onLoad(res) {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			
			that.title = res.title;
			that.uid =  res.uid;
			that.avatar =  res.avatar;
			that.name =  res.name;
			that.getIsFollow();
			that.getUserInfo();
			that.getUserData();
			// #ifdef APP-PLUS || H5
			var owo = that.owo.data;
			var owoList=[];
			for(var i in owo){
				owoList = owoList.concat(owo[i].container);
			}
			that.owoList = owoList;
			// #endif
			that.getContentsList(false);
			
		},
		methods: {
			getgg() {
			  var that = this;
			      uni.request({
			        url:that.$API.SMlikeall(),
			        method:'GET',
					data:{
						uid:that.vid
					},
			        dataType:"json",
			        success(res) {
					  that.likesall = res.data.likesall;
					  that.fancount = res.data.fancount;
			        },
			        fail(error) {
			          console.log(error);
			        }
			      })
				  
			},
			copyName() {
			    var that = this;
			      uni.setClipboardData({
			        data: that.name,
			        success: function () {
			          uni.showToast({
			            title: '昵称已复制',
			            icon: 'success'
			          })
			        }
			      })
			    },
			copyUid() {
			    var that = this;
			      uni.setClipboardData({
			        data: that.uid,
			        success: function () {
			          uni.showToast({
			            title: 'ID已复制',
			            icon: 'success'
			          })
			        }
			      })
			    },
			toType(i){
				var that = this;
				that.type=i;
				that.page=1;
				that.moreText="加载更多";
				that.isLoad=0;
				if(i==0){
					that.getContentsList(false);
				}else if(i==1){
					that.getCommentsList(false)
				}else{
					that.getSpaceList(false)
				}
			},
			goFanList(uid){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/user/fanList?uid='+uid
				});
			},
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			getUserLv(i){
				var that = this;
				if(!i){
					var i = 0;
				}
				var rankList = that.$API.GetRankList();
				return rankList[i];
			},
			getUserLvStyle(i){
				var that = this;
				if(!i){
					var i = 0;
				}
				var rankStyle = that.$API.GetRankStyle();
				var userlvStyle ="color:#fff;background-color: "+rankStyle[i];
				return userlvStyle;
			},
			getUserInfo(){
				var that = this;
				that.$Net.request({
					
					url: that.$API.getUserInfo(),
					data:{
						"key":that.uid
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
							that.lv = res.data.data.lv;
							that.avatar = res.data.data.avatar;
							that.bgurl = res.data.data.userBg;
							that.customize = res.data.data.customize;
							that.experience = res.data.data.experience;
							that.introduce = res.data.data.introduce;
							if(res.data.data.screenName){
								that.myname = res.data.data.screenName;
							}else{
								that.myname = res.data.data.name;
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
			loadMore(){
				var that = this;
				that.moreText="加载中...";
				that.isLoad=1;
				if(that.type==0){
					that.getContentsList(true);
				}else if(that.type==1){
					that.getCommentsList(true)
				}else{
					that.getSpaceList(true)
				}
				
			},
			reload(){
				var that = this;
				if(that.type==0){
					that.getContentsList(false);
				}else if(that.type==1){
					that.getCommentsList(false)
				}else{
					that.getSpaceList(false)
				}
				
			},
			getLv(i){
				var that = this;
				if(!i){
					var i = 0;
				}
				var lv  = that.$API.getLever(i);
				var leverList = that.$API.GetLeverList();
				return leverList[lv];
			},
			getPrivateChat(){
				var that = this;
				var token = "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}else{
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					})
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				var touid = that.uid;
				var data={
					"touid":touid,
					"token":token
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.getPrivateChat(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res));
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						
						if(res.data.code==1){
							var name = that.name;
							var uid = that.uid;
							var chatid = res.data.data
							uni.redirectTo({
							    url: '/pages/chat/chat?uid='+uid+"&name="+name+"&chatid="+chatid
							});
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
							title: "网络不太好哦~",
							icon: 'none'
						})
					}
				})
			},
			getUserData() {
				var that = this;
				that.$Net.request({
					
					url: that.$API.getUserData(),
					data:{
						"uid":that.uid
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res));
						if(res.data.code==1){
							that.fanNum = res.data.data.fanNum;
							that.contentsNum = res.data.data.contentsNum;
							that.commentsNum = res.data.data.commentsNum;
							
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
			getContentsList(isPage){
				var that = this;
				var data = {
					"type":"post",
					"authorId":that.uid,
				}
				var page = that.page;
				if(isPage){
					page++;
				}
				that.$Net.request({
					url: that.$API.getContentsList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":8,
						"page":page,
						"order":"created"
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						uni.stopPullDownRefresh();
						that.isLoad=0;
						that.moreText="加载更多";
						if(res.data.code==1){
							var list = res.data.data;
							if(list.length>0){
								//that.contentsList = list;
								if(isPage){
									that.page++;
									that.contentsList = that.contentsList.concat(list);
								}else{
									that.contentsList = list;
								}
								
								
							}else{
								that.moreText="没有更多数据了";
							}
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						uni.stopPullDownRefresh();
						that.moreText="加载更多";
						that.isLoad=0;
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			toSetup() {
				uni.navigateTo({
					url: '/pages/user/setup'
				})
			},
			getCommentsList(isPage){
				var that = this;
				var data = {
					"type":"comment",
					"authorId":that.uid,
				}
				var page = that.page;
				if(isPage){
					page++;
				}
				that.$Net.request({
					url: that.$API.getCommentsList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":5,
						"page":page,
						"order":"created"
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						uni.stopPullDownRefresh();
						that.isLoad=0;
						if(res.data.code==1){
							var list = res.data.data;
							if(list.length>0){
								var commentsList = [];
								for(var i in list){
									var arr = list[i];
									arr.style = "background-image:url("+list[i].avatar+");"
									commentsList.push(arr);
								}
								if(isPage){
									that.page++;
									that.commentsList = that.commentsList.concat(commentsList);
								}else{
									that.commentsList = commentsList;
								}
							}else{
								that.moreText="没有更多数据了";
							}
							
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						uni.stopPullDownRefresh();
						that.isLoad=0;
						that.moreText="加载更多";
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			getIsFollow(){
				var that = this;
				var token = "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					token:token,
					touid:that.uid,
				}
				that.$Net.request({
					
					url: that.$API.isFollow(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.isFollow = res.data.code;
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
					}
				})
			},
			follow(type){
				var that = this;
				var token = "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}else{
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					})
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				var data = {
					token:token,
					touid:that.uid,
					type:type,
				}
				that.isFollow = type;
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.follow(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res))
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title:res.data.msg,
						    icon:'none'
						});
						if(type == 1){
						    if (localStorage.getItem('userinfo')) {
						      var userInfo = JSON.parse(localStorage.getItem('userinfo'));
						      that.username = userInfo.name;
						    		
						    		
						    	}
						}else if(type == 0){
						    if (localStorage.getItem('userinfo')) {
						      var userInfo = JSON.parse(localStorage.getItem('userinfo'));
						      that.username = userInfo.name;
						    		
						    	}
						}
						that.getIsFollow();
					},
					fail: function(res) {
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
						that.getIsFollow();
					}
				})
			},
			commentsAdd(title,coid,reply){
				var that = this;
				var cid = that.cid;
				uni.navigateTo({
				    url: '/pages/contents/commentsadd?cid='+cid+"&coid="+coid+"&title="+title+"&isreply="+reply
				});
			},
			toPost(){
				var that = this;
				
				uni.navigateTo({
					url: '/pages/user/post'
				});
			},
			toEdit(cid){
				var that = this;
				
				uni.navigateTo({
					url: '/pages/user/post?type=edit'+'&cid='+cid
				});
			},
			getUserLv(i){
				var that = this;
				var rankList = that.$API.GetRankList();
				return rankList[i];
			},
			getUserLvStyle(i){
				var that = this;
				var rankStyle = that.$API.GetRankStyle();
				var userlvStyle ="color:#fff;background-color: "+rankStyle[i];
				return userlvStyle;
			},
			toInfo(data){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/contents/info?cid='+data.cid+"&title="+data.title
				});
			},
			toInfoComment(cid,title){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/contents/info?cid='+cid+"&title="+title
				});
			},
			toSearch(){
				var that = this;
				
				uni.redirectTo({
				    url: '/pages/contents/search'
				});
			},
			ToCopy(text) {
				var that = this;
				// #ifdef APP-PLUS
				uni.setClipboardData({
					data: text,
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: "复制成功"
						})
					}
				});
				// #endif
				// #ifdef H5 
				let textarea = document.createElement("textarea");
				textarea.value = text;
				textarea.readOnly = "readOnly";
				document.body.appendChild(textarea);
				textarea.select();
				textarea.setSelectionRange(0, text.length) ;
				uni.showToast({ //提示
					title: "复制成功"
				})
				var result = document.execCommand("copy") 
				textarea.remove();
				
			// #endif
			},
			formatNumber(num) {
			    return num >= 1e4 ? (num / 1e4).toFixed(1) + '' : num
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
				text = text.replace("||rn||","\n");
				return text;
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
					return "Ta还没有个人介绍哦"
				}
			},
			getSpaceList(isPage){
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
				var data = {
					"uid":that.uid 
				}
				that.$Net.request({
					url: that.$API.spaceList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":10,
						"page":page,
						"order":"created",
						"token":token
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.changeLoading = 1;
						that.isLoad=0;
						that.moreText="加载更多";
						if(!isPage){
							that.dataLoad = true;
						}
						if(res.data.code==1){
							var list = res.data.data;
							var spaceList = [];
							for(var i in list){
								if(list[i].type==0){
									if(list[i].pic){
										var pic = list[i].pic;
										list[i].picList = pic.split("||");
									}else{
										list[i].picList = [];
									}
									
								}
								if(list[i].type==2){
									if(list[i].forwardJson.pic){
										var pic = list[i].forwardJson.pic;
										list[i].forwardJson.picList = pic.split("||");
									}else{
										list[i].forwardJson.picList = [];
									}
									
								}
							}
							spaceList = list;
							if(list.length>0){
								if(isPage){
									that.page++;
									that.spaceList = that.spaceList.concat(spaceList);
								}else{
									that.spaceList = spaceList;
								}
								
							}else{
								that.moreText="没有更多动态了";
							}
						}
					},
					fail: function(res) {
						
						that.changeLoading = 1;
						that.isLoad=0;
						that.moreText="加载更多";
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
		}
	}
</script>

<style>
.user-info-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.xyy{
	margin-left: 0px;
}
.search-type{
	display: flex;
	    position: relative;
	    align-items: center;
	    justify-content: space-around;
		border-bottom: solid 2px #f3f3f3;
}
.search-type-box.active {
    border-bottom: solid 2px #000000;
    color: #000000;
}
.user-info-data-box {
 flex-grow: 1;
 text-align: center;
	}
.user-data-num {
	margin-right:0px;
  font-size: 36upx;
}
.user-data-label {
  font-size: 28upx;
}
.sup-script {
  font-size: 28upx;
  font-weight: 400;
}
.cu-bar .action2 {
    background: #00000057;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    /* text-align: center; */
    display: flex;
    align-items: center;
    justify-content: center;
}
.grid2 {
    display: flex;
    flex-direction: row;
	justify-content: normal;
}
.cu-bar2{
	margin-top: 20upx;
}
</style>
