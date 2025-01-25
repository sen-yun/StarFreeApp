<template>
	<view :class="AppStyle">
		
		<view class="header" :style="{overflow: 'hidden', paddingTop: StatusBar + 'px', backgroundColor: '#fff'}">
		
			<view class="cu-bar bg-white" :style="{'height': 50 + 'px'}">
					
		<view @click="handleClick"  :class="squareid==0?'tab-wrap-index square-box':'square-box2'" style="margin: 0upx 17upx 0upx 17upx;">动态</view>
		<view @click="handleClick2" :class="squareid==2?'tab-wrap-index square-box':'square-box2'" style="margin: 0upx 17upx 0upx 17upx;">分类</view>
		<view @click="handleClick1" :class="squareid==1?'tab-wrap-index square-box':'square-box2'" style="margin: 0upx 70upx 0upx 17upx;">群聊</view>
		
					<!--  #ifdef H5 || APP-PLUS -->
					<view class="search-form radius" style="border-radius: 100px;">
						<text class="cuIcon-search"></text>
						<input type="text" :placeholder="sousuok" confirm-type="search"
							@tap="toSearch"></input>
					</view>
					<view class="cu-avatar round" style="color: #323232;margin: 0px 10px 0px 0upx;" @tap="goUserInfo()" :style="userInfo.style" v-if="token!=''"></view>
					<view class="cu-avatar round" style="color: #323232;margin: 0px 10px 0px 0upx;" @tap="goUserInfo()" v-else>
							<text class="home-noLogin">登录</text>
						</view> 
	
					<!--  #endif-->
					<block v-if="squareid==0">
					<view class="position-fixed2 ">
					  <view class="dropdown round-button2">
					    <text class="cuIcon-filter" style="font-size: 18px;"></text>
						<ul class="dropdown-menu">
						  <li :class="follow==0?'active':''" @tap="setFollow(0)">关注</li>
						  <li :class="follow==1?'active':''" @tap="setFollow(1)">综合</li>
						  <li :class="follow==2?'active':''" @tap="setFollow(2)">视频</li>
						  <li :class="follow==3?'active':''" @tap="setFollow(3)">图集</li>
						</ul>
					  </view>
					</view>
					
					<view class="position-fixed">
					  <view class="round-button" @tap="showModal" data-target="bottomModal">
					    <text class="cuIcon-edit" style="font-size: 18px;"></text>
					  </view>
					</view>
					</block>
				</view>
			</view>
			
		<block v-if="squareid==0">
			<view :style="[{padding:NavBar + 'px 10px 0px 0px'}]"></view>
			<view class="data-box">
				
				<view class="cu-modal cu-modal2 bottom-modal show2" :class="modalName=='bottomModal'?'show':''" @tap="hideModal">
					
					<view class="cu-dialog" style="background-color: rgb(0, 0, 0,0);">

						<view class="position-fixed">
						  <view class="round-button">
						    <text class="cuIcon-close" style="font-size: 18px;"></text>
						  </view>
						</view>
 
						<view class="padding-xl grid col-2 flex justify-center" style="font-size: larger;">
							<view  @tap="postSpace(0)" style="position: fixed;bottom: 230px;right: 30px;border-radius: 50%;width: 50px;height: 50px;">
								<image src="../../static/page/square/video.png" mode="widthFix">
									
								</image>
							</view>
							<view @tap="postSpace(4)" style="position: fixed;bottom: 160px;right: 30px;border-radius: 50%;width: 50px;height: 50px;">
								<image src="../../static/page/square/post.png" mode="widthFix">
								
								</image>
							</view>
						</view>
					</view>
				</view>
				
			</view>
			<view class="appcontent margin-top-xl">
			
			<block v-if="follow==0">
				<view class="no-data" v-if="token==''">
					<text class="cuIcon-text"></text>
					请先登录哦！
					<view class="text-center margin-top-sm">
						<text class="cu-btn bg-shojo radius" @tap="goLogin()">登录</text>
						<text class="cu-btn line-blue margin-left-sm radius" @tap="goRegister()">注册</text>
					</view>
				
				</view>
				<view v-else>
				<view class="no-data" v-if="spaceList.length==0">
				<text class="cuIcon-text"></text>
				暂时还没有关注的人哦~
			</view>
			<followItem :spaceList="spaceList" :followList="spaceList.isFollow"></followItem>
			<view class="load-more" @tap="loadMore" v-if="dataLoad&&chatList.length>0">
				<text>{{moreText}}</text>
			</view>
			</view>
			</block>
			<block v-if="follow==1">
			<view class="no-data" v-if="spaceList.length==0">
				<text class="cuIcon-text"></text>
				什么都没有
				<view class="text-center margin-top-sm">
					<text class="cu-btn bg-shojo radius" @tap="postSpace(0)">发动态</text>
				</view>
			</view>
			
			<spaceItem :spaceList="spaceList"></spaceItem>
			<view class="load-more" @tap="loadMore" v-if="dataLoad&&chatList.length>0">
				<text>{{moreText}}</text>
			</view>
			</block>
			<block v-if="follow==2">
			<view class="no-data" v-if="spaceList.length==0">
				<text class="cuIcon-text"></text>
				什么都没有
				<view class="text-center margin-top-sm">
					<text class="cu-btn bg-shojo radius" @tap="postSpace(0)">发动态</text>
				</view>
			</view>
			
			<spaceItem :spaceList="spaceList"></spaceItem>
			<view class="load-more" @tap="loadMore" v-if="dataLoad&&chatList.length>0">
				<text>{{moreText}}</text>
			</view>
			</block>
			<block v-if="follow==3">
			<view class="no-data" v-if="spaceList.length==0">
				<text class="cuIcon-text"></text>
				什么都没有
				<view class="text-center margin-top-sm">
					<text class="cu-btn bg-shojo radius" @tap="postSpace(0)">发动态</text>
				</view>
			</view>
			
			<spaceItem :spaceList="spaceList"></spaceItem>
			<view class="load-more" @tap="loadMore" v-if="dataLoad&&chatList.length>0">
				<text>{{moreText}}</text>
			</view>
			</block>
		</view>
		</block>
		<block v-if="squareid==1">
			<view :style="[{padding:NavBar + 'px 0px 0px 0px'}]"></view>
			<view class="no-data" v-if="token==''">
				<text class="cuIcon-text"></text>
				请先登录哦！
				<view class="text-center margin-top-sm">
					<text class="cu-btn bg-shojo radius" @tap="goLogin()">登录</text>
					<text class="cu-btn line-blue margin-left-sm radius" @tap="goRegister()">注册</text>
				</view>

			</view>
			<view class="cu-list menu-avatar" v-if="token!=''">
				<view class="cu-bar bg-white search">
					<view class="search-form round">
						<text class="cuIcon-search"></text>
						<input type="text" placeholder="搜索群聊" v-model="searchText"></input>
						<view class="search-close" v-if="searchText!=''" @tap="searchClose()"><text
								class="cuIcon-close"></text></view>
					</view>
				</view>
				<view class="no-data" v-if="chatList.length==0">
					<text class="cuIcon-text"></text>
					
					暂时没有数据
				</view>
				<block v-for="(item,index) in chatList" :key="index">
					<view class="cu-item" @tap="goChat(item)" v-if="item.name.indexOf(searchText)!=-1">
						<block v-if="item.type==1">
							<view class="cu-avatar round lg" :style="'background-image:url('+item.pic+');'"></view>
						</block>
						<block v-else>
							<view class="cu-avatar round lg" :style="'background-image:url('+item.userJson.avatar+');'">
							</view>
						</block>
						<view class="content">
							<view>
								<view class="text-cut">{{item.name}}</view>
							</view>
							<view class="text-gray text-sm flex">
								<view class="text-cut">
									<block v-if="item.lastMsg!=null">

										<block v-if="item.lastMsg.type!=4">
											<block v-if="item.lastMsg.uid==uid">
												我:
											</block>
											<block v-if="item.lastMsg.uid!=uid">
												{{item.lastMsg.name}}:
											</block>
											<block v-if="item.lastMsg.type==0">
												{{item.lastMsg.text}}
											</block>
											<block v-if="item.lastMsg.type==1">
												[图片]
											</block>
										</block>
										<block v-else>
											<block v-if="item.lastMsg.text=='ban'">
												<text class="text-red">[已开启全体禁言]</text>
											</block>
											<block v-else>
												<text class="text-blue">[已解除全体禁言]</text>
											</block>
										</block>
									</block>
									<block v-else>暂无消息</block>
								</view>
							</view>
						</view>
						<view class="action">
							<view class="text-grey text-xs">{{chatFormatDate(item.lastTime)}}</view>
							<block v-if="item.lastMsg!=null">
								<block v-if="item.lastMsg.uid==uid">
									<view class="cu-tag sm" style="background: none;">&nbsp</view>
								</block>
								<block v-else>
									<view class="cu-tag sm" style="background: none;" v-if="item.isNew==0">&nbsp</view>
									<view class="cu-tag round bg-red sm" v-else>{{item.unRead}}</view>
								</block>
							</block>
							<block v-else>
								<view class="cu-tag sm" style="background: none;">&nbsp</view>
							</block>
						</view>
					</view>
				</block>
			</view>
		</block>
<block v-if="squareid==2">
		<metas :topic="metaCircleList" :moreText="metaCircleMoreTxt" :isLoading="isMetasLoading" @loadMore="metaLoadMore"/>
	
	</block>
	
		<!--加载遮罩-->
		<view class="loading" v-if="isLoading==0||changeLoading==0">
			<view class="loading-main">
				<image src="../../static/loading.gif"></image>
			</view>
		</view>
		<!--  #ifdef APP-PLUS -->
		<view style="height: 100upx;"></view>
		<Tabbar :current="1"></Tabbar>
		<!--  #endif -->

	</view>
</template>

<script>
	import waves from '@/components/xxley-waves/waves.vue';
		import metas from '@/pages/contents/metas.vue'
	// #ifdef APP-PLUS
	import Tabbar from '@/pages/components/tabBar.vue'
	// #endif
	import {
		localStorage
	} from '../../js_sdk/mp-storage/mp-storage/index.js'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar: this.StatusBar + this.CustomBar,
				AppStyle: this.$store.state.AppStyle,

					 changeLoading:1,
				userInfo: null,
				token: "",
				isLoading: 0,
				toolid: 0,
				userList:[],
				noticeSum: 0,
				squareid: 0,
				follow: 1,
				searchText: "",
				sousuok: "",
				chatList: [],
				oldChatList: [],
				metaList: [],
				spaceList: [],
				curIMG:"",
				isGetChat: null,
				uid: 0,
				modalName: null,
				dataLoad: false,

				page: 1,
				moreText: "加载更多",
//分类数据
				isMetasLoading: 0,
				metaPage: 1,
				metaCircleList: [],
				metaCircleMoreTxt: "加载更多"

			}
		},
		onPullDownRefresh() {
			var that = this;
				if (that.follow == 2&&squareid==0) {
					that.changeLoading = 0;
					that.getSpaceList2();
					
					}
				if (that.follow == 3&&squareid==0) {
					that.changeLoading = 0;
					that.getSpaceList3();
					
				}
				if (squareid==0&&that.follow == 0||that.follow == 1) {
					
					that.getSpaceList(false);
					that.getUserList(false);
				}
			
			var timer = setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000)
		},
		onReachBottom() {
			//触底后执行的方法，比如无限加载之类的
			var that = this;
			if (that.follow == 2&&squareid==0) {
				that.changeLoading = 0;
				that.getSpaceList2();
				
				}
			if (that.follow == 3&&squareid==0) {
				that.changeLoading = 0;
				that.getSpaceList3();
				
			}
			if (squareid==0&&that.follow == 0||that.follow == 1) {
				
				that.getSpaceList(false);
				
			}
				
			
			
		},
		onHide() {
			var that = this
			clearInterval(that.isGetChat);
			that.isGetChat = null
		},
		onShow() {
			var that = this;
			that.loadMore();
			that.page = 1;
			// #ifdef APP-PLUS
			uni.hideTabBar({
				animation: false
			})


			plus.navigator.setStatusBarStyle("dark")
			// #endif
			if (localStorage.getItem('userinfo')) {

				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.userInfo.style = "background-image:url(" + that.userInfo.avatar + ");";
				that.uid = that.userInfo.uid;
			}
			if (localStorage.getItem('token')) {

				that.token = localStorage.getItem('token');
			}
			if (localStorage.getItem('chatList')) {
				that.oldChatList = JSON.parse(localStorage.getItem('chatList'));
				// that.chatList = JSON.parse(localStorage.getItem('chatList'));
			}
			that.userStatus();
			that.unreadNum();
			if (that.squareid == 0) {
				that.getSpaceList(false);
			}
			if (that.squareid == 2) {
				this.getMetaList();
				this.getTopPic2();
			}
			if (that.follow == 0) {
				that.getUserList(false);
			}
			if (that.follow == 2) {
				that.changeLoading = 0;
				that.getSpaceList2();
				// #ifdef H5
				 window.scrollTo(0, 0); // 将页面滚动到顶部
				 // #endif
				 // #ifdef APP-PLUS
				uni.pageScrollTo({
				  scrollTop: 0,
				  duration: 300
				});
				 // #endif
				}
			if (that.follow == 3) {
				that.changeLoading = 0;
				that.getSpaceList3();
				// #ifdef H5
				 window.scrollTo(0, 0); // 将页面滚动到顶部
				 // #endif
				 // #ifdef APP-PLUS
				uni.pageScrollTo({
				  scrollTop: 0,
				  duration: 300
				});
				 // #endif
				
			}
			if (that.token != "") {
				that.getMyChat(false);
				that.isGetChat = setInterval(() => {
					that.getMyChat(false);
				}, 4000);
			}

		},
		onLoad() {
			var that = this;
			that.loadMore();
			that.getMetaList();
			that.getUserList(false);
			if (that.token != "") {
				that.getMyChat(false);
				that.isGetChat = setInterval(() => {
					that.getMyChat(false);
				}, 4000);
			}
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif

		},
		
		
		mounted() {
			var that = this;
			that.loadMore();
			that.getgg();
		},
		methods: {
			
			loadMore() {
							var that = this;
							that.moreText = "加载中...";
							that.isLoad = 1;
							
							if (that.follow == 2) {
								that.getSpaceList2(true);
								
								}
							if (that.follow == 3) {
								that.getSpaceList3(true);
								
								
							}
							if (that.follow == 0||that.follow == 1) {
								
								 this.getUserList(true);
								this.getSpaceList(true);
								
							}
						},
			//公共缓存
						allCache() {
							var that = this;
							var meta = that.TabCur;
							if (localStorage.getItem('swiperList')) {
								that.swiperList = JSON.parse(localStorage.getItem('swiperList'));
								var timer = setTimeout(function() {
									that.isLoading = 1;
									clearTimeout('timer')
								}, 300)
							}
			
							if (localStorage.getItem('metaList')) {
								that.metaList = JSON.parse(localStorage.getItem('metaList'));
							}
							if (localStorage.getItem('contentsList_' + meta)) {
								that.contentsList = JSON.parse(localStorage.getItem('contentsList_' + meta));
							}
							if (localStorage.getItem('topContents')) {
								that.topContents = JSON.parse(localStorage.getItem('topContents'));
							}
			
							if (localStorage.getItem('Topic')) {
								that.Topic = JSON.parse(localStorage.getItem('Topic'));
							}
						},
			getTopPic() {
							var that = this;
							var data = {
								"isrecommend": "1"
							}
							that.$Net.request({
								url: that.$API.getMetasList(),
								data: {
									"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
									"limit": 4,
									"page": 1,
								},
								header: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								method: "get",
								dataType: 'json',
								success: function(res) {
									if (res.data.code == 1) {
										var list = res.data.data;
										if (list.length > 0) {
											that.Topic = list;
			
										} else {
											that.Topic = [];
										}
										localStorage.setItem('Topic', JSON.stringify(that.Topic));
									}
									var timer = setTimeout(function() {
										that.isLoading = 1;
										clearTimeout('timer')
									}, 300)
								},
								fail: function(res) {
									var timer = setTimeout(function() {
										that.isLoading = 1;
										clearTimeout('timer')
									}, 300)
								}
							})
						},
			getMetaContents(isPage, meta) {
							var that = this;
							var data = {
								"mid": meta,
								"type": "post"
							}
							var page = that.page;
							if (isPage) {
								page++;
							}
							that.$Net.request({
								url: that.$API.getMetaContents(),
								data: {
									"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
									"limit": 5,
									"page": page,
									"order": "created"
								},
								header: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								method: "get",
								dataType: 'json',
								success: function(res) {
									if (!isPage) {
										that.dataLoad = true;
									}
									that.isLoad = 0;
			
									that.moreText = "加载更多";
									if (res.data.code == 1) {
										var list = res.data.data;
										if (list.length > 0) {
											var contentsList = [];
											//将自定义字段获取并添加到数据
											var curFields = that.$API.GetFields();
											for (var i in list) {
												var fields = list[i].fields;
												if (fields.length > 0) {
													for (var j in fields) {
														if (curFields.indexOf(fields[j].name) != -1) {
															list[i][fields[j].name] = fields[j].strValue;
														}
													}
												}
												contentsList.push(list[i]);
											}
											if (isPage) {
												that.page++;
												that.contentsList = that.contentsList.concat(contentsList);
											} else {
												that.contentsList = contentsList;
											}
			
			
											localStorage.setItem('contentsList_' + meta, JSON.stringify(that
												.contentsList));
										} else {
											that.moreText = "没有更多啦~";
										}
									}
								},
								fail: function(res) {
			
									that.moreText = "加载更多";
									that.isLoad = 0;
								}
							})
			},
			getgg() {
			  var that = this;
			      uni.request({
			        url:that.$API.SMgonggao(),
			        method:'GET',
			        dataType:"json",
			        success(res) {
					  that.sousuok = res.data.sousuok;
					  
			        },
			        fail(error) {
			          console.log(error);
			        }
			      })
			},
			
			toCategoryContents(title, id) {
							var that = this;
							var type = "meta";
							uni.navigateTo({
								url: '/pages/contents/contentlist?title=' + title + "&type=" + type + "&id=" + id
							});
						},
			toMetas() {
							var that = this;
			
							uni.navigateTo({
								url: '/pages/contents/metas'
							});
						},
			
			
			metaLoadMore() {
				if (this.squareid==2){
					console.log('metaLoadMore');
					this.metaCircleMoreTxt = "加载中...";
				}

			},
			
			getUserList(isPage){
				var that = this;
				var page = that.page;
				if(isPage){
					page++;
				}
				that.$Net.request({
					url: that.$API.followList(),
					data:{
						"uid":this.uid,
						"limit":10,
						"page":page,
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.isLoad=0;
						if(res.data.code==1){
							var list = res.data.data;
							if(list.length>0){
								
								var userList = [];
								for(var i in list){
									var arr = list[i];
									arr.style = "background-image:url("+list[i].userJson.avatar+");"
									userList.push(arr);
								}
								if(isPage){
									that.page++;
									that.userList = that.userList.concat(userList);
								}else{
									that.userList = userList;
								}
							}else{
								//that.moreText="没有更多数据了";
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
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			
			ChooseCheckbox(j) {
				let items = this.checkbox;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					this.checkbox[i].checked = false;
				}
				this.checkbox[j].checked = !this.checkbox[j].checked;
			},
			handleClick() {
				this.squareid=0;
			    this.setSquare(0);
			      },
			handleClick2() {
				this.squareid=2;
			    this.setSquare(2);
			      },
			handleClick1() {
				this.squareid=1;
			    this.setSquare(1);
			      },
			setSquare(type) {
				var that = this;
				that.page = 1;
				that.squareid = type;
				clearInterval(that.isGetChat);
				that.isGetChat = null
				if (type == 0) {
					that.getSpaceList(false);
				}
				if (type == 1) {
					if (that.token != "") {
						that.getMyChat(false);
						that.isGetChat = setInterval(() => {
							that.getMyChat(false);
						}, 4000);
					}

				}
				if (type == 2){
					that.moreText = "加载中...";
					that.isLoad = 1;
						// that.getMetaContents(true, that.TabCur);
						this.getTopPic2();
				}
			},
			setFollow(type) {
				var that = this;
				that.page = 1;
				that.follow = type;
				clearInterval(that.isGetChat);
				that.isGetChat = null
				if (type == 2) {
					that.changeLoading = 0;
					that.getSpaceList2();
					}
				if (type == 3) {
					that.changeLoading = 0;
					that.getSpaceList3();
					
				}
				if (type == 1||type == 0) {
					that.getSpaceList(false);
				}
			},
			searchClose() {
				var that = this;
				that.searchText = "";
				that.page = 1;
				that.getUserList(false);
			},
			formatDate(datetime) {
			  var now = new Date();
			  var diff = now - new Date(datetime * 1000);
			  var minuteDiff = Math.floor(diff / 60000);
			  var hourDiff = Math.floor(diff / 3600000);
			  var dayDiff = Math.floor(diff / 86400000);
			  var weekDiff = Math.floor(dayDiff / 7);
			  var monthDiff = Math.floor(diff / 2592000000);
			  var yearDiff = Math.floor(diff / 31536000000);
			
			  if (diff < 60000) {
			    return Math.floor(diff / 1000) + "秒前";
			  } else if (diff < 3600000) {
			    return minuteDiff + "分钟前";
			  } else if (hourDiff < 24) {
			    return hourDiff + "小时前";
			  } else if (dayDiff < 7 && dayDiff > 0) {
			    return dayDiff + "天前";
			  } else if (weekDiff > 0 && monthDiff <= 1) {
			    return weekDiff + "周前";
			  } else if (monthDiff > 1 && monthDiff < 12) {
			    return monthDiff + "个月前";
			  } else if (yearDiff >= 1) {
			    return yearDiff + "年前";
			  } else {
			    return "刚刚";
			  }
			},
			toInfo(data) {
				var that = this;
				clearInterval(that.chatLoading);
				that.chatLoading = null
				uni.navigateTo({
					url: '/pages/contents/info?cid=' + data.cid + "&title=" + data.title
				});
			},
			getMetaList() {
				var that = this;
				var data = {
					"type": "category"
				}
				that.$Net.request({
					url: that.$API.getMetasList(),
					data: {
						"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit": 15,
						"page": 1,
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							var list = res.data.data;
							if (list.length > 0) {
								var meta = [{
									mid: 0,
									name: "推荐",
									parent: 0
								}];
								that.metaList = meta.concat(list);
			
							} else {
								that.metaList = [];
							}
							localStorage.setItem('metaList', JSON.stringify(that.metaList));
						}
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			toPage(title, cid) {
				var that = this;
				clearInterval(that.chatLoading);
				that.chatLoading = null
				uni.navigateTo({
					url: '/pages/contents/info?cid=' + cid + "&title=" + title
				});
			},
			toSearch() {
				var that = this;
				clearInterval(that.chatLoading);
				that.chatLoading = null
				uni.navigateTo({
					url: '/pages/contents/search'
				});
			},
			goPage(url) {
				var that = this;
				clearInterval(that.chatLoading);
				that.chatLoading = null
				uni.navigateTo({
					url: url
				});
			},
			toCategoryContents(title, id) {
				var that = this;
				clearInterval(that.chatLoading);
				that.chatLoading = null
				var type = "meta";
				uni.navigateTo({
					url: '/pages/contents/contentlist?title=' + title + "&type=" + type + "&id=" + id
				});
			},
			userStatus() {
				var that = this;
				that.$Net.request({

					url: that.$API.userStatus(),
					data: {
						"token": that.token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.isLoading = 1;
						if (res.data.code == 0) {
							localStorage.removeItem('userinfo');
							localStorage.removeItem('token');
							that.token = "";
							that.userinfo = null;
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
			toLink(text) {
				var that = this;

				if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
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
			toGroup() {
				var url = that.$API.GetGroupUrl();
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			getTopPic2(){
							var that = this;
							var data = {
							}
							var page = that.metaPage;
							// if(isPage){
							// 	page++;
							// }
							
							that.$Net.request({
								url: that.$API.getMetasList(),
								data:{
									"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
									"limit": 20,
									"order":"order",
									"page":page,
								},
								header:{
									'Content-Type':'application/x-www-form-urlencoded'
								},
								method: "get",
								dataType: 'json',
								success: function(res) {
									that.isMetasLoading=1;
									that.isLoad=0;
									if(res.data.code==1){
										var list = res.data.data;
										if(list.length>0){
											var Topic = list;
											// if(isPage){
												that.metaPage++;
												that.metaCircleList = that.metaCircleList.concat(Topic);
											// }else{
											// 	that.metaCircleList = Topic;
											// }
										}else{
											//that.metaCircleMoreTxt="没有更多数据了";
										}
										
									}
								},
								fail: function(res) {
									that.isMetasLoading=1;
									that.isLoad=0;
									that.metaCircleMoreTxt="加载更多";
								}
							})
						},
			unreadNum() {
				var that = this;
				that.$Net.request({

					url: that.$API.unreadNum(),
					data: {
						"token": that.token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
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

			//群聊(性能考虑，只加载前30条)
			getMyChat(isPage) {
				var that = this;
				var page = that.page;
				if (isPage) {
					page++;
				}
				if (that.token == "") {
					uni.showToast({
						title: "请先登录",
						icon: 'none',
						duration: 1000,
						position: 'bottom',
					});
					return false
				}
				that.$Net.request({
					url: that.$API.allChat(),
					data: {
						"token": that.token,
						"limit": 30,
						"page": page,
						"type": that.type,
						"order": "lastTime"
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.isLoading = 1;
						that.isLoad = 0;
						if (res.data.code == 1) {
							var list = res.data.data;
							if (list.length > 0) {
								var chatList = [];
								for (var i in list) {
									var arr = list[i];
									arr.isNew = 0;
									arr.unRead = 0;
									chatList.push(arr);
								}
								if (isPage) {
									that.page++;
									that.chatList = that.chatList.concat(chatList);
								} else {
									var oldChatList = [];
									if (that.oldChatList != null) {
										oldChatList = that.oldChatList;
									}
									if (oldChatList.length > 0) {

										if (!that.arraysEqual(oldChatList, chatList)) {
											console.log("开始对比")
											for (var c in chatList) {
												for (var d in oldChatList) {
													if (oldChatList[d].id == chatList[c].id) {
														if (oldChatList[d].lastTime < chatList[c].lastTime) {
															console.log("赋值完成")
															chatList[c].isNew = 1;

															var unRead = chatList[c].msgNum - oldChatList[d]
																.msgNum;
															if (unRead <= 0) {
																unRead = 0;
															}
															chatList[c].unRead = unRead;
														}
													}

												}
											}
											that.oldChatList = chatList;
											that.chatList = chatList;
											localStorage.setItem('AllchatList', JSON.stringify(chatList));
										}


									} else {
										that.oldChatList = chatList;
										that.chatList = chatList;
										localStorage.setItem('AllchatList', JSON.stringify(chatList));
									}
								}
							} else {
								// that.moreText="没有更多消息了";
							}

						}
					},
					fail: function(res) {
						that.isLoading = 1;
						that.isLoad = 0;
						// that.moreText="加载更多";
					}
				})
			},
			arraysEqual(a, b) {
				if (a === b) return true;
				if (a == null || b == null) return false;
				if (a.length != b.length) return false;
				for (var c in a) {
					for (var d in b) {
						if (b[d].id == a[c].id) {
							if (b[d].lastTime != a[c].lastTime) {
								return false;
							}
						}

					}
				}
			},
			chatFormatDate(datetime) {
				var datetime = new Date(parseInt(datetime * 1000));
				// 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
				var year = datetime.getFullYear();
				var month = ("0" + (datetime.getMonth() + 1)).slice(-2);
				var date = ("0" + datetime.getDate()).slice(-2);
				var hour = ("0" + datetime.getHours()).slice(-2);
				var minute = ("0" + datetime.getMinutes()).slice(-2);
				var time = year + "" + month + "" + date;

				var result = hour + ":" + minute;
				var curDate = new Date();
				var curYear = curDate.getFullYear(); //获取完整的年份(4位)
				var curMonth = ("0" + (curDate.getMonth() + 1)).slice(-2);
				var curDay = ("0" + curDate.getDate()).slice(-2); //获取当前日(1-31)
				var curTime = curYear + "" + curMonth + "" + curDay;
				if (year == curYear) {
					if (year == curYear) {
						if (date == curDay) {
							result = hour + ":" + minute;
						} else {
							result = month + "-" + date;
						}
					} else {
						result = month + "-" + date;
					}
				} else {
					result = month + "-" + date;
				}
				return result;
			},
			goChat(data) {
				var that = this;
				var chatid = data.id;
				clearInterval(that.chatLoading);
				that.chatLoading = null
				//去除未读标志
				var chatlist = that.chatList;
				for (var i in chatlist) {
					if (chatlist[i].id == chatid) {
						chatlist[i].isNew = 0;
						chatlist[i].unRead = 0;
					}
				}
				that.chatList = chatlist;
				that.oldChatList = that.chatList;
				localStorage.setItem('AllchatList', JSON.stringify(that.chatList));
				//结束
				if (data.type == 0) {
					var name = data.userJson.name;
					var uid = data.userJson.uid;

					uni.navigateTo({
						url: '/pages/chat/chat?uid=' + uid + "&name=" + name + "&chatid=" + chatid + "&type=0"
					});
				}
				if (data.type == 1) {
					var name = data.name;

					uni.navigateTo({
						url: '/pages/chat/chat?&name=' + name + '&chatid=' + chatid + '&type=1'
					});
				}

			},
			postSpace(type) {
				var that = this;
				if (type == 1) {
					uni.navigateTo({
						url: '/pages/user/post?isSpace=1'
					});
				} else if (type == 5) {
					uni.navigateTo({
						url: '/pages/user/addshop?isSpace=1'
					});
				} else {
					uni.navigateTo({
						url: '/pages/space/post?type=' + type
					});
				}


			},
			getSpaceList2(isPage){
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
					that.$Net.request({
						url: that.$API.spaceList(),
						data:{
							"limit":10,
							"page":page,
							"order":"created",
							"searchKey":"#视频#",
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
			getSpaceList3(isPage){
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
					that.$Net.request({
						url: that.$API.spaceList(),
						data:{
							"limit":10,
							"page":page,
							"order":"created",
							"searchKey":"#图集#",
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
			getSpaceList(isPage) {
				var that = this;
				var page = that.page;
				if (isPage) {
					page++;
				}
				that.$Net.request({
					url: that.$API.spaceList(),
					data: {
						"limit": 10,
						"page": page,
						"order": "created",
						"token": that.token
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.isLoading = 1;
						that.isLoad = 0;
						that.moreText = "加载更多";
						if (!isPage) {
							that.dataLoad = true;
						}
						if (res.data.code == 1) {
							var list = res.data.data;
							var spaceList = [];
							for (var i in list) {
								if (list[i].type == 0) {
									if (list[i].pic) {
										var pic = list[i].pic;
										list[i].picList = pic.split("||");
									} else {
										list[i].picList = [];
									}

								}
								if (list[i].type == 2) {
									if (list[i].forwardJson.pic) {
										var pic = list[i].forwardJson.pic;
										list[i].forwardJson.picList = pic.split("||");
									} else {
										list[i].forwardJson.picList = [];
									}

								}
							}
							spaceList = list;
							if (list.length > 0) {
								if (isPage) {
									that.page++;
									that.spaceList = that.spaceList.concat(spaceList);
								} else {
									that.spaceList = spaceList;
								}

							} else {
								that.moreText = "没有更多动态了";
							}
						}
					},
					fail: function(res) {
						that.isLoading = 1;
						that.moreText = "加载更多";
						that.isLoad = 0;
					}
				})
			},

			goUserInfo() {

				var that = this;
				if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				uni.switchTab({
					url: '/pages/home/user'
				});
			},
			goLogin() {
				uni.navigateTo({
					url: '/pages/user/login'
				});
			},
			goRegister() {
				uni.navigateTo({
					url: '/pages/user/register'
				});
			},
			toGroup() {
							uni.navigateTo({
								url: "/pages/contents/metas"
							})
						}
			
			},
		// #ifdef APP-PLUS
		components: {
			waves,
			Tabbar,
			metas
		},
		// #endif

		// #ifdef H5 || MP
		components: {
			waves,metas
		},
		// #endif

	}
</script>

<style>
	.tab-wrap-index {
		color:#454545;
	  position: relative;
	  z-index: 1;
	}
	.tab-wrap-index::after {
	  position: absolute;
	  border-radius: 50px;
	  color:#797979;
	  right: 5%;
	  bottom: 6rpx;
	  z-index: -1;
	  display: block;
	  content: "";
	  width: 100%;
	  height:13rpx;
	  background-color: #3cc9a4;
	}
	.square-box{
		    font-weight: bold;
		    font-size: 17px;
	}
	.square-box2{
		font-weight: bold;
		    font-size: 14px;
	}
	.square-box, .square-box2 {
	  transition: all 0.5s ease-in-out
	}
	.position-fixed2 {
	  position: fixed;
	  bottom: 160px;
	  right: 30px;
	}
	.position-fixed {
	  position: fixed;
	  bottom: 90px;
	  right: 30px;
	}
	
	.round-button {
	  width: 50px;
	  height: 50px;
	  border-radius: 50%;
	  background: linear-gradient(to bottom right, #acffcc, #47bf7f);
	  display: flex;
	  color: #fff;
	  justify-content: center;
	  align-items: center;
	  box-shadow: #33a26059 0px 3px 5px 0px;
	}
	.round-button2 {
	  width: 50px;
	  height: 50px;
	  border-radius: 50%;
	  background: linear-gradient(to bottom right, #aefffd, #2182bf);
	  display: flex;
	  color: #fff;
	  justify-content: center;
	  align-items: center;
	  box-shadow: #33a26059 0px 3px 5px 0px;
	}
	.appcontent {
		margin-left: 12upx;
		margin-right: 12upx;
	}
	.font-size-small {
		font-size: small;
	}
.dropdown {
  position: relative;
  cursor: pointer;
}

.dropdown i.arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 6px 6px 6px;
  border-color: transparent transparent #c3c3c3 transparent;
}

.dropdown-menu {
  opacity: 0;
  transition: all 0.5s ease-in-out;
  position: absolute;
  bottom: 100%;
  right: 0px;
  z-index: 9999;
  display: none;
  min-width: 80px;
  padding: 10px;
  text-align: center;
  margin: 0;
  list-style: none;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 0px 8px rgba(0, 0, 0, 0.2);
}

.dropdown-menu li {
  font-weight: normal;
  transition: all 0.5s ease-in-out;
  color: #666;
  font-size: 14px;
  display: block;
  padding: 5px 10px;
  cursor: pointer;
}
 
.dropdown-menu li.active {
  font-weight: bold;
  transition: all 0.5s ease-in-out;
  color: #232323;
  font-size: 16px;
}

.dropdown:hover .dropdown-menu {
  display: block;
  opacity: 1 !important;
}
.header {
    z-index: 995;
	}
	
</style>
