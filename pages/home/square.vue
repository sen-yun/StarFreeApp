<template>
	<view :class="AppStyle">
		
		<view class="header" :style="{overflow: 'hidden', paddingTop: StatusBar + 'px', backgroundColor: '#fff'}">
		
			<view class="cu-bar bg-white" :style="{'height': 50 + 'px'}">
					
		<view @click="handleClick"  :class="squareid==0?'tab-wrap-index square-box':'square-box2'" style="margin: 0upx 17upx 0upx 17upx;">动态</view>
		<view v-if="sy_appbox&&appModOrder==1" @click="handleClick3" :class="squareid==3?'tab-wrap-index square-box':'square-box2'" style="margin: 0upx 17upx 0upx 17upx;">应用</view>
		<view @click="handleClick2" :class="squareid==2?'tab-wrap-index square-box':'square-box2'" style="margin: 0upx 17upx 0upx 17upx;">分类</view>
		<view v-if="sy_appbox&&appModOrder==0" @click="handleClick3" :class="squareid==3?'tab-wrap-index square-box':'square-box2'" style="margin: 0upx 17upx 0upx 17upx;">应用</view>
		<view @click="handleClick1" :class="squareid==1?'tab-wrap-index square-box':'square-box2'" style="margin: 0upx 40upx 0upx 17upx;">群聊</view>
		
					<!--  #ifdef H5 || APP-PLUS -->
					<view class="search-form radius" style="border-radius: 100px;margin: 5px 10px 5px 0px;">
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
		<view :style="[{padding:NavBar + 10 + 'px 10px 0px 0px'}]"></view>
		<metas :topic="metaCircleList" :avatargroup="latestUserAvatar" :moreText="metaCircleMoreTxt" :isLoading="isMetasLoading" @loadMore="metaLoadMore"/>
	
	</block>
	<!-- 应用start -->
	<block v-if="squareid==3">
		<view :style="[{padding:NavBar + 10 + 'px 10px 0px 0px'}]"></view>
			<!-- #ifdef APP-PLUS || H5 -->
			<block v-if="appLoad">
				<!-- 应用列表部分 -->
				<view class="u-wrap" :style="{ height: `calc(100vh - ${NavBar+70}px)` }">
					<view class="u-menu-wrap">
						<!-- 左侧菜单保持不变 -->
						<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view"
							:scroll-top="scrollTop">
							<view v-for="(item,index) in left_tabbar" :key="index" class="u-tab-item"
								:class="[current==index ? 'u-tab-item-active' : '']" :data-current="index"
								@tap.stop="swichMenu(index)">
								<text class="u-line-1">{{item.name}}</text>
							</view>
							<view style="width: 100%; height: 120upx;" :style="{'background-color':'#fff'}" ></view>
						</scroll-view>
						<scroll-view scroll-y class="right-box"
							@scrolltolower="handleScrollToLower">
							<view class="page-view">
								<view class="class-item">
									<view class="filter-bar">
										<view class="filter-item" @tap="showOrderPicker">
											<text>{{orderText}}</text>
											<text class="cuIcon-unfold"></text>
										</view>
										<view class="filter-item" @tap="showTypeFilter">
											<text>{{typeText}}</text>
											<text class="cuIcon-unfold"></text>
										</view>
									</view>
									<view class="loading-container" v-if="loading">
										<u-loading mode="circle" size="36"></u-loading>
									</view>

									<view class="item-container" v-else>
										<block v-if="appList.length>0">
											<view class="app-box" style="padding: 10rpx 10rpx 0 10rpx;"
												v-for="(item, index) in appList" :key="index">
												<view class="app-box-body" @tap="toAppInfo(item.id)">
													<view class="app-box-logo">
														<u-image :src="item.logo" width="110rpx" height="110rpx"
															mode="aspectFill" :lazy-load="true" :fade="true"
															duration="450" border-radius="28rpx">
															<u-loading slot="loading"></u-loading>
														</u-image>
													</view>
													<view class="app-box-content">
														<view class="app-box-title text-cut">{{item.name}}</view>
														<view class="app-box-info">
															<text :style="{color: item.tagInfo.color}"
																:class="item.score>=3?'tn-icon-star-fill':'tn-icon-star'"></text>
															<text
																:style="{color: item.tagInfo.color}">{{item.score}}</text>
															<text>{{item.size}}</text>

														</view>
														<view class="app-box-tags">
															<text class="app-tag"
																:style="{backgroundColor: item.tagInfo.color}">{{item.tagInfo.text}}</text>
															<text>v{{item.version}}</text>
															<text
																:class="item.system=='ios'?'tn-icon-iphone':''"></text>
														</view>
													</view>
												</view>
												<view class="app-box-down" @tap="toAppInfo(item.id)">下载</view>
											</view>
										</block>
										<block v-else>
											<view class="margin-top-sm">
												<u-empty text="暂无数据" mode="data" icon-size="100"
													font-size="24"></u-empty>
											</view>

										</block>
										<view class="loading-more" v-if="loadStatus !== 'nomore'">
											<u-loadmore :status="loadStatus" :icon-type="'circle'"
												:load-text="loadMoreText" @loadmore="handleScrollToLower" />
										</view>
									</view>
								</view>
							</view>



							<view style="width: 100%; height: 120upx;" :style="{'background-color':'#fff'}" ></view>
						</scroll-view>
					</view>
				</view>
				
				<!-- 悬浮发布应用按钮 -->
				<view class="float-publish-btn" @tap="goToPublishApp">
					<text class="tn-icon-add"></text>
				</view>
			</block>
			<block v-else>
				<view class="dataLoad" v-if="!dataLoad">
					<image src="../../static/loading.gif"></image>
				</view>
			</block>
		
			<u-picker v-model="showOrder" :show="showOrder" :columns="[orderOptions]" @confirm="confirmOrder"
				@cancel="cancelOrder" mode="selector" :range="orderOptions" range-key="text"></u-picker>

			<u-popup v-model="showType" mode="bottom" :mask-close-able="true" :safe-area-inset-bottom="true"
				@close="showType = false">
				<view class="filter-popup">
					<view class="filter-title">选择类型</view>
					<view class="filter-options">
						<view class="filter-option" v-for="(type, index) in typeOptions" :key="index"
							:class="{'active': selectedType === type.value}" @tap="selectType(type.value)">
							{{type.label}}
						</view>
					</view>
					<view class="filter-buttons">
						<view class="btn-reset" @tap="resetType">重置</view>
						<view class="btn-confirm" @tap="confirmType">确定</view>
					</view>
				</view>
			</u-popup>
			<!-- #endif -->
		</block>
		<!-- 应用end -->
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
				left_tabbar: [],
				scrollTop: 0, 
				current: 0,
				menuHeight: 0,
				menuItemHeight: 0, 
				sectionList: [],
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
				latestUserAvatar: [],
				curIMG:"",
				isGetChat: null,
				uid: 0,
				modalName: null,
				dataLoad: false,
				appModOrder:2,
				page: 1,
				moreText: "加载更多",
				isMetasLoading: 0,
				metaPage: 1,
				metaCircleList: [],
				metaCircleMoreTxt: "加载更多",
				appList: [], 
				limit: 15,
				loading: false,
				finished: false,
				appLoad: false,
				tagMap: {
					1: {
						text: '搬运',
						color: '#7c72ff'
					},
					2: {
						text: '原创',
						color: '#19be6b'
					},
					3: {
						text: '金标',
						color: '#ff6600'
					},
					4: {
						text: '官方',
						color: '#2979ff'
					}
				},

				// 筛选相关
				showOrder: false,
				orderOptions: [{
						text: '最新投稿',
						value: 'created'
					},
					{
						text: '好评如潮',
						value: 'score'
					},
					{
						text: '讨论火热',
						value: 'commentsNum'
					},
					{
						text: '随便看看',
						value: 'random'
					}
				],
				selectedOrder: 'created',
				orderText: '最新投稿',

				// 系统筛选
				showSystem: false,
				systemOptions: [
					{
						label: 'Android',
						value: 'android'
					}
				],
				selectedSystem: '',
				systemText: '系统',
				showType: false,
				typeOptions: [{
						label: '全部',
						value: ''
					},
					{
						label: '搬运',
						value: '1'
					},
					{
						label: '原创',
						value: '2'
					},
					{
						label: '金标',
						value: '3'
					},
					{
						label: '官方',
						value: '4'
					}
				],
				selectedType: '',
				typeText: '应用类型',
				sy_appbox:false,

				// 修改加载状态的处理
				loadStatus: 'loadmore', // loadmore, loading, nomore
				loadMoreText: {
					loadmore: '上拉加载更多',
					loading: '正在加载...',
					nomore: '没有更多了'
				},

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
				if (that.squareid == 3) {
					if(that.sy_appbox)
					{
						that.getSortList();
					}
					
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
			that.getLatestUsers();
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
			if (localStorage.getItem('getPlugins')) {
				var cachedPlugins = localStorage.getItem('getPlugins');
				if (cachedPlugins) {
					const pluginList = JSON.parse(cachedPlugins);
					// #ifdef APP-PLUS || H5
					that.sy_appbox = pluginList.includes('sy_appbox');
					// #endif
				}
				if(that.sy_appbox){
					that.getAppBoxInfo()
				}
			}

		},
		
		
		mounted() {
			var that = this;
			that.loadMore();
			that.getgg();
			
		},
		methods: {
			getSortList() {
				const that = this;
				that.$Net.request({
					url: that.$API.PluginLoad('sy_appbox'),
					data: {
						"action": "getSortList",
						"getsort_page": 1,
						"getsort_limit": 50,
						"getsort_order": "sort"
					},
					method: "GET",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 200) {
							// 添加"小编推荐"作为第一个分区
							that.left_tabbar = [{
								name: '小编推荐',
								slug: 'recommend',
								id: 0
							}, ...res.data.data];
						}
						that.getAppList();
					}
				});
			},
			getAppList(isPage = false) {

				const that = this;
				if (that.loading) return;

				if (!isPage) that.loading = true;
				that.loadStatus = 'loading';
				const page = isPage ? that.page + 1 : 1;

				// 构建筛选条件
				let conditions = {};
				if (that.selectedSystem != '') {
					conditions.system = that.selectedSystem
				}
				if (that.selectedType != '') {
					conditions.type = that.selectedType
				}
				if (that.current === 0) {
					conditions.istop = '1';
				} else if (that.left_tabbar[that.current]) {
					conditions.sort = String(that.left_tabbar[that.current].id);
				}

				that.$Net.request({
					url: that.$API.PluginLoad('sy_appbox'),
					data: {
						"action": "getAppList",
						"getapp_page": page,
						"getapp_limit": that.limit,
						"getapp_order": that.selectedOrder,
						"getapp_if": JSON.stringify(conditions)
					},
					method: "GET",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 200) {
							const data = res.data.data || [];
							// 确保data是数组类型
							const dataArray = Array.isArray(data) ? data : [];
							const list = dataArray.map(item => ({
								...item,
								tagInfo: that.tagMap[item.type] || {
									text: '未知',
									color: '#999'
								},
								size: that.formatSize(item.size)
							}));

							if (isPage) {
								// 加载更多时，使用数组拓展运算符合并数组
								that.appList = [...that.appList, ...list];
								that.page = page;
							} else {
								// 只有在初加载或刷新时才重置列表
								that.appList = list;
								that.page = 1;
							}

							that.finished = list.length < that.limit;
							that.loadStatus = that.finished ? 'nomore' : 'loadmore';
						}
						that.appLoad = true;
						that.loading = false;
					},
					fail: function() {
						that.appLoad = true;
						that.loading = false;
						that.loadStatus = 'loadmore';
					}
				});
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if (index == this.current) return; // 如果点击当前项则不处理

				this.current = index;
				this.page = 1;
				this.finished = false;
				this.loading = false;
				// 重置应用列表，避免显示上一个分类的数据
				this.appList = [];
				this.loadStatus = 'loadmore';
				this.getAppList();
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;

			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},
			// 触底加载
			handleScrollToLower() {
				console.log('触发触底加载');
				if (this.loadStatus === 'loadmore' && !this.loading&&this.sy_appbox) {
					this.getAppList(true);
				}
			},

			// 筛选相关方法
			showOrderPicker() {
				this.showOrder = true;
			},

			confirmOrder(e) {
				const selectedOption = this.orderOptions[e[0]];
				if (selectedOption) {
					this.selectedOrder = selectedOption.value;
					this.orderText = selectedOption.text;
					this.showOrder = false;
					this.page = 1; // 重置页码
					if(this.sy_appbox){
						this.appList = []; // 重置应用列表
						this.getAppList(false); // 使用false参数重新加载
					}
					
				}
			},

			showSystemFilter() {
				this.showSystem = true;
			},

			confirmSystem() {
				const option = this.systemOptions.find(item => item.value === this.selectedSystem);
				this.systemText = option ? option.label : '系统';
				this.showSystem = false;
				this.page = 1; // 重置页码
				if(this.sy_appbox){
					this.appList = []; // 重置应用列表
					this.getAppList(false); // 使用false参数重新加载
				}
			},

			showTypeFilter() {
				this.showType = true;
			},

			confirmType() {
				const option = this.typeOptions.find(item => item.value === this.selectedType);
				this.typeText = option ? option.label : '类型';
				this.showType = false;
				this.page = 1; // 重置页码
				if(this.sy_appbox){
					this.appList = []; // 重置应用列表
					this.getAppList(false); // 使用false参数重新加载
				}
			},
			// 获取标签信息
			getTagInfo(item) {
				return this.tagInfoMap[item.type] || {
					text: '未知',
					color: '#999999'
				};
			},

			// 文件大小
			formatSize(size) {
				if (!size) return '未知大小';

				if (size >= 1024 * 1024) {
					return (size / (1024 * 1024)).toFixed(1) + 'GB';
				} else if (size >= 1024) {
					return (size / 1024).toFixed(1) + 'MB';
				} else {
					return size + 'KB';
				}
			},
			selectSystem(value) {
				this.selectedSystem = value;
			},
			resetSystem() {
				this.selectedSystem = '';
				this.systemText = '系统';
				this.showSystem = false;
				this.appList = []; // 重置应用列表
				this.getAppList();
			},
			selectType(value) {
				this.selectedType = value;
			},
			resetType() {
				this.selectedType = '';
				this.typeText = '应用类型';
				this.showType = false;
				this.appList = []; // 重置应用列表
				this.getAppList(false);
			},
			toAppInfo(id) {
				uni.navigateTo({
					url: '/pages/plugins/sy_appbox/info?id=' + id
				});
			},
			// 跳转到发布应用页面
			goToPublishApp() {
				uni.navigateTo({
					url: '/pages/plugins/sy_appbox/post'
				});
			},
			// 添加取消排序方法
			cancelOrder() {
				this.showOrder = false;
			},
			goAppInfo(item) {
				var that = this;
				uni.navigateTo({
					url: '/pages/plugins/sy_appbox/info'
				});
			},
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
			handleClick3() {
				this.squareid=3;
			    this.setSquare(3);
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
				if (type == 3) {
					if(that.sy_appbox){
						that.getSortList();
					}
					
				}
			},
			
			getLatestUsers() {
				const that = this;
				that.$Net.request({
					url: that.$API.getUserList(),
					data: {
						"searchParams": "",
						"limit": 4,
						"page": 1,
						"searchKey": "",
						"order": "created"
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						if(res.data.code == 1) {
							const users = res.data.data || [];
							// 确保users是数组类型
							const usersArray = Array.isArray(users) ? users : [];
							that.latestUserAvatar = usersArray.map(user => ({
								userJson: {
									avatar: user.avatar
								}
							}));
						}
					}
				})
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
								"type":'category',
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
			getAppBoxInfo(){
				var that = this;
				uni.request({
					url: that.$API.PluginLoad('sy_appbox'),
					data: {
						"action": "getConfig"
					},
					method: 'GET',
					dataType: "json",
					success(res) {
						if(res.data.code == 200) {
							that.appModOrder = res.data.data.appModOrder;
							
						} else {
							console.log(res.data.msg)
						}
					},
					fail(error) {
						that.apploading = false;
						console.log(error);
						uni.showToast({
							title: "网络开小差了",
							icon: 'none'
						});
					}
				});
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

<style lang="scss" scoped>
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

	.uni-swiper-dot.uni-swiper-dot-active {
		background-color: #00bcd4 !important;
		opacity: 0.8;
	}

	.uni-swiper-dot {
		border-radius: 50upx !important;
	}

	.uni-swiper-slides swiper-item {
		padding: 0 0;
		box-sizing: border-box;
	}

	.screen-swiper {
		min-height: 300upx;
	}

	.u-wrap {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx; // 保持固定高度
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}

	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}

	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid #3cc9a4;
		height: 32rpx;
		left: 0;
		top: 39rpx;
		border-radius: 50rpx;
	}

	.u-tab-view {
		height: 100%;
		overflow: auto;
	}

	.right-box {
		background-color: rgb(250, 250, 250);
		overflow: auto;
	}
	.icon-grid-container {
	  width: 100%;
	  display: flex;
	  justify-content: center;
	  padding: 10rpx 0;
	}

	.icon-grid {
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: flex-start;
	  width: 100%;
	  max-width: 750rpx;
	}

	.icon-item {
	  width: calc(100% / 5);
	  box-sizing: border-box;
	  padding: 10rpx;
	}

	.page-view {
		padding: 16rpx;
	}

	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 16rpx;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}

	.item-menu-name {
		font-weight: normal;
		font-size: 24rpx;
		color: $u-main-color;
	}

	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
	}

	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
	}
	.icon5__item--icon {
		width: 62rpx;
		height: 62rpx;
		margin-bottom: 10rpx;
	}
	.icon5__item--icon-2 {
		width: 90rpx;
		height: 90rpx;
		margin-bottom: 10rpx;
	}
	.app-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.app-box-body {
		flex: 1;
		display: flex;
		margin-right: 20rpx;
		min-width: 0; // 防止flex子元素溢出
		align-items: center;
	}

	.app-box-logo {
		width: 110rpx;
		height: 110rpx;
		flex-shrink: 0; // 防止图片缩小
	}

	.app-box-content {
		flex: 1;
		margin-left: 20rpx;
		min-width: 0; // 防止flex子元素溢出
	}

	.app-box-title {
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 6rpx;
		width: 250rpx;
	}

	.text-cut {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.app-box-info {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 6rpx;

		text {
			margin-right: 10rpx;
		}
	}

	.app-box-tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8rpx;
	}

	.app-tag {
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		color: #ffffff;
		font-size: 24rpx;
	}

	.app-category-tag {
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		background-color: #f5f5f5;
		color: #666666;
		font-size: 24rpx;
	}

	.app-box-down {
		background-color: #3cc9a4;
		color: #fff;
		padding: 10rpx 30rpx;
		border-radius: 100rpx;
		white-space: nowrap; // 防止文字换行
		flex-shrink: 0; // 防止按钮缩小
	}

	.nav {
		white-space: nowrap;
		padding: 0 30rpx;
		height: 90rpx;
		border-bottom: 1px solid #f1f1f1;

		.cu-item {
			height: 90rpx;
			display: inline-block;
			line-height: 90rpx;
			margin: 0 30rpx;
			padding: 0 20rpx;

			&.cur {
				border-bottom: 4rpx solid #3cc9a4;
			}
		}
	}

	.app-box {
		margin-bottom: 20rpx;

		.app-box-tags {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			color: #666;
			font-size: 26rpx;

			.app-tag {
				padding: 4rpx 8rpx;
				border-radius: 8rpx;
				color: #ffffff;
				font-size: 20rpx;
			}

			.app-category-tag {
				padding: 4rpx 12rpx;
				border-radius: 8rpx;
				background-color: #f5f5f5;
				color: #666666;
				margin-right: 12rpx;
				font-size: 24rpx;
			}
		}
	}
	.des-info{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 180rpx;
	}
	/* 筛选栏样式 */
	.filter-bar {
		display: flex;
		padding: 20rpx;
		border-bottom: 1px solid #f5f5f5;
	}

	.filter-item {
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		color: #333;
		justify-content: center;
	}

	.filter-item .cuIcon-unfold {
		margin-left: 4rpx;
		font-size: 24rpx;
		color: #999;
	}

	/* 筛选弹窗样式 */
	.filter-popup {
		background: #fff;
		padding: 30rpx;
		border-radius: 20rpx 20rpx 0 0;
	}

	.filter-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
	}

	.filter-options {
		display: flex;
		flex-wrap: wrap;
	}

	.filter-option {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 1px solid #eee;
		border-radius: 30rpx;
		margin: 0 20rpx 20rpx 0;
		font-size: 28rpx;
	}

	.filter-option.active {
		background: #3cc9a4;
		color: #fff;
		border-color: #3cc9a4;
	}

	.filter-buttons {
		display: flex;
		margin-top: 40rpx;
	}

	.btn-reset,
	.btn-confirm {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		margin: 0 20rpx;
		font-size: 30rpx;
	}

	.btn-reset {
		background: #f5f5f5;
		color: #666;
	}

	.btn-confirm {
		background: #3cc9a4;
		color: #fff;
	}

	.text-title-1 {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	/* 添加加载动画相关样式 */
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;

		.loading-text {
			font-size: 26rpx;
			color: #909399;
			margin-top: 20rpx;
		}
	}

	.loading-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 0;

		.loading-more-text {
			font-size: 24rpx;
			color: #909399;
		}
	}

	.menu-scroll-view {
		height: 100%;
		overflow: auto;
	}

	.square-data-type-picker {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 20rpx 30rpx 20rpx 0;
	}
	.filter-item {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;
		cursor: pointer;
	}
	.filter-item .cuIcon-unfold {
		margin-left: 8rpx;
		font-size: 24rpx;
		color: #999;
	}

	/* 商城筛选相关样式 */
	.search-bar {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx 30rpx 0;
	}

	.search-form {
		flex: 1;
		margin-right: 20rpx;
	}

	.filter-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 120rpx;
		height: 60rpx;
		background: #f8f8f8;
		border-radius: 30rpx;
		padding: 0 20rpx;
	}

	.filter-text {
		font-size: 26rpx;
		color: #666;
		margin-left: 8rpx;
	}

	.shop-filter-popup {
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
		padding: 30rpx;
		max-height: 80vh;
		overflow-y: auto;
	}

	.filter-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 30rpx;
		border-bottom: 1px solid #f0f0f0;
		margin-bottom: 30rpx;
	}

	.filter-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.filter-reset {
		font-size: 28rpx;
		color: #999;
	}

	.filter-section {
		margin-bottom: 40rpx;
		transition: all 0.3s ease-in-out;
	}

	.filter-section-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.filter-tip {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 20rpx;
		background: #f8f9fa;
		border-radius: 16rpx;
		border: 1px dashed #ddd;
	}

	.filter-tip-text {
		font-size: 26rpx;
		color: #999;
		margin-left: 10rpx;
	}

	.filter-options {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.filter-option {
		padding: 0rpx 24rpx;
		background: #f8f8f8;
		border-radius: 30rpx;
		font-size: 26rpx;
		color: #666;
		border: 1px solid transparent;
		transition: all 0.3s;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		max-width: calc((100vw - 140rpx) / 3);
		min-width: 80rpx;
		box-sizing: border-box;
		flex-shrink: 0;
	}
	
	/* 针对较小屏幕的优化 */
	@media screen and (max-width: 750rpx) {
		.filter-option {
			max-width: calc((100vw - 120rpx) / 2);
			font-size: 24rpx;
		}
	}

	.filter-option.active {
		background: #e8fff4;
		color: #3cc9a4;
		border-color: #3cc9a4;
	}

	.filter-footer {
		display: flex;
		gap: 20rpx;
		margin-top: 40rpx;
		padding-top: 30rpx;
		border-top: 1px solid #f0f0f0;
	}

	.filter-btn-cancel,
	.filter-btn-confirm {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		font-size: 30rpx;
	}

	.filter-btn-cancel {
		background: #f8f8f8;
		color: #666;
	}

	.filter-btn-confirm {
		background: #3cc9a4;
		color: #fff;
	}

	/* 活跃用户卡片样式 */
	.active-users-container {
		padding: 0 20rpx 30rpx 20rpx;
	}

	.active-users-scroll {
		white-space: nowrap;
	}

	.active-users-list {
		display: flex;
		gap: 24rpx;
		padding: 20rpx 10rpx;
	}

	.active-user-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 260rpx;
		min-width: 260rpx;
		padding: 50rpx 40rpx 50rpx 40rpx;
		border-radius: 24rpx;
		background-color: #f5f5f5;
		transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		position: relative;
		overflow: hidden;
	}

	.active-user-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4rpx;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.active-user-card:active {
		transform: translateY(4rpx) scale(0.96);
		box-shadow: 0 4rpx 16rpx rgba(60, 201, 164, 0.16), 0 1rpx 4rpx rgba(0, 0, 0, 0.12);
	}

	.active-user-card:active::before {
		opacity: 1;
	}

	.user-avatar-container {
		position: relative;
		margin-bottom: 20rpx;
	}

	.user-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 64rpx;
		background-size: cover;
		background-position: center;
		transition: transform 0.3s ease;
	}

	.active-user-card:active .user-avatar {
		transform: scale(0.95);
	}

	.user-rz-icon-active {
		position: absolute;
		right: -6rpx;
		bottom: -6rpx;
		width: 44rpx;
		height: 44rpx;
		border-radius: 22rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
	}

	.user-name {
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 10rpx;
		text-align: center;
		max-width: 200rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 1.2;
	}

	.vip-name {
		color: #ff6c3e;
		font-weight: 700;
		text-shadow: 0 1rpx 2rpx rgba(255, 108, 62, 0.2);
	}

	.user-intro {
		font-size: 22rpx;
		color: #666;
		text-align: center;
		line-height: 1.5;
		max-width: 200rpx;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		word-break: break-all;
		opacity: 0.9;
	}

	.no-active-users {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 20rpx;
		color: #999;
	}

	.no-active-users .cuIcon-people {
		font-size: 80rpx;
		margin-bottom: 20rpx;
		opacity: 0.5;
	}

	.no-users-text {
		font-size: 28rpx;
		color: #999;
		opacity: 0.7;
	}

	/* 推荐话题卡片样式 */
	.topic-cards-container {
		padding: 20rpx;
		background: #ffffff;
	}

	.topic-row {
		display: flex;
		gap: 20rpx;
	}

	.topic-card {
		flex: 1;
		display: flex;
		align-items: center;
		background: #ffffff;
		padding: 20rpx;
		transition: all 0.3s ease;
	}

	.topic-card:active {
		transform: scale(0.98);
		opacity: 0.8;
	}

	.topic-image-container {
		flex-shrink: 0;
		width: 100rpx;
		height: 100rpx;
		border-radius: 20rpx;
		overflow: hidden;
		margin-right: 20rpx;
		background: #f8f9fa;
	}

	.topic-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.topic-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
	}

	.topic-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 8rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 1.2;
	}

	.topic-count {
		display: flex;
		align-items: baseline;
		gap: 4rpx;
	}


	.topic-count-text {
		font-size: 22rpx;
		color: #999;
	}

	.float-publish-btn {
		position: fixed;
		right: 40rpx;
		bottom: 170rpx;
		width: 100rpx;
		height: 100rpx;
		background: linear-gradient(135deg, #57d1b1, #00b4db);
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 20rpx rgba(87, 209, 177, 0.3);
		z-index: 999;
		transition: all 0.3s ease;
	}

	.float-publish-btn:active {
		transform: scale(0.95);
		box-shadow: 0 4rpx 12rpx rgba(87, 209, 177, 0.4);
	}

	.float-publish-btn .tn-icon-add {
		font-size: 48rpx;
		color: #fff;
		font-weight: bold;
	}
</style>
