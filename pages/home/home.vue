<template>
	<view :class="AppStyle">

		<view class="header" :style="{overflow: 'hidden', paddingTop: StatusBar + 'px', backgroundColor: '#fff'}">

			<view class="cu-bar bg-white" :style="{'height': 50 + 'px'}">

				<view @click="flag=0" :class="flag==0?'tab-wrap-index square-box':'square-box2'"
					style="margin: 0upx 30upx 0upx 30upx;">首页</view>
				<view @click="flag=1" :class="flag==1?'tab-wrap-index square-box':'square-box2'"
					style="margin: 0px 100upx 0px 20upx;">发现</view>
				<!--  #ifdef H5 || APP-PLUS -->
				<view class="search-form radius" style="border-radius: 50%;" @tap="toSearch()">
					<text class="cuIcon-search"></text>
					<input type="text" :placeholder="sousuok" confirm-type="search"></input>
				</view>
				<view class="cu-avatar round" style="color: #323232;margin: 0px 10px 0px 0upx;" @tap="goUserInfo()"
					:style="userInfo.style" v-if="token!=''"></view>
				<view class="cu-avatar round" style="color: #323232;margin: 0px 10px 0px 0upx;" @tap="goUserInfo()"
					v-else>
					<text class="home-noLogin">登录</text>
				</view>
				<!--  #endif-->
			</view>
			<!--  #ifdef H5 -->

			<view class="position-fixed">
				<view class="round-button" @tap="showModal" data-target="bottomModal">
					<text class="cuIcon-edit" style="font-size: 18px;"></text>
				</view>
			</view>
			<!--  #endif-->
			<view class="data-box">

				<view class="cu-modal cu-modal2 bottom-modal show2" :class="modalName=='bottomModal'?'show':''"
					@tap="hideModal">

					<view class="cu-dialog" style="background-color: rgb(0, 0, 0,0);">

						<view class="position-fixed">
							<view class="round-button">
								<text class="cuIcon-close" style="font-size: 18px;"></text>
							</view>
						</view>
						<view class="tabbar-operate-main padding-xl flex justify-center"
							style="width: 100%;display: flex; justify-content: center; align-items: flex-end;padding: 170rpx;">
							<view class="text-white tn-flex-1" @tap="postSpace(1)"
								style="width: 110rpx; height: 110rpx;">
								<text
									style="display: inline-block; border-radius: 20rpx;  width: 100rpx;height: 100rpx;">
									<image src="../../static/page/square/photo.png" mode="widthFix">
								</text>
								<view>发帖</view>
							</view>


							<view class="text-white tn-flex-1" @tap="postSpace(5)"
								style="border-radius: 20rpx; width: 110rpx; height: 110rpx;">
								<text
									style="display: inline-block; border-radius: 20rpx;  width: 100rpx;height: 100rpx;">
									<image src="../../static/page/square/shop.png" mode="widthFix">

								</text>
								<view>商品</view>


								</image>
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>
		<view v-if="flag==0" class="">

			<view :style="[{padding:NavBar + 25 + 'px 10px 0px 10px'}]"></view>
			<block>
				<view class="margin-left-sm margin-right-sm">
					<swiper v-if="lunbo_of==1" class="screen-swiper swiper-container" style="border-radius: 20upx; "
						:class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
						:autoplay="true" interval="5000" duration="500">
						<swiper-item v-for="(item,index) in swiperList" :key="index" @tap="toInfo(item)">
							<view class="swiper-box" style="border-radius: 20upx; ">
								<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
								<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false"
									objectFit="cover" v-if="item.type=='video'"></video>
							</view>
						</swiper-item>
					</swiper>
					<view v-if="top_of==1" class="index-sort grid col-4" style="border-radius: 20upx;">
						<view class="index-sort-box">
							<waves itemClass="butclass">
								<view class="index-sort-main" @tap="goPage('/pages/contents/blackhouse')">
									<view class="index-sort-i"
										style="border-radius: 20upx;background: linear-gradient(to bottom right, #aaff7f, #00ae4b);box-shadow: #55ff0059 0px 3px 5px 0px;">
										<text class="cuIcon-apps" style="color:  #ffffff;"></text>
									</view>
									<view class="index-sort-text">
										小黑屋
									</view>
								</view>
							</waves>
						</view>
						<view class="index-sort-box">
							<waves itemClass="butclass">
								<view class="index-sort-main" @tap="toShop">
									<view class="index-sort-i"
										style="border-radius: 20upx;background: linear-gradient(to bottom right, #aaffff, #89adff);box-shadow: #00aaff59 0px 3px 5px 0px;">
										<text class="cuIcon-goods" style="color:  #ffffff;"></text>
									</view>
									<view class="index-sort-text">
										商城
									</view>
								</view>
							</waves>
						</view>

						<view class="index-sort-box">
							<waves itemClass="butclass">
								<view class="index-sort-main" @tap="toLink('/pages/ads/home')">
									<view class="index-sort-i"
										style="border-radius: 20upx;background: linear-gradient(to bottom right, #aaaaff, #811aff);box-shadow: #aa55ff59 0px 3px 5px 0px;">
										<text class="cuIcon-text" style="color:  #ffffff;"></text>
									</view>
									<view class="index-sort-text">
										广告位
									</view>
								</view>
							</waves>
						</view>
						<view class="index-sort-box">
							<waves itemClass="butclass">
								<view class="index-sort-main" @tap="toUsers">
									<view class="index-sort-i"
										style="border-radius: 20upx;background: linear-gradient(to bottom right, #ffd198, #ff5c10);box-shadow: #ffaa0059 0px 3px 5px 0px;">
										<text class="cuIcon-calendar" style="color:  #ffffff;"></text>
									</view>
									<view class="index-sort-text">
										签到
									</view>
								</view>
							</waves>
						</view>

					</view>
					<!-- 滚动通知开头 -->
					<view v-if="gonggao_of==1" class="tn-notice-bar-class tn-notice-bar"
						style="display:flex; align-items:center;border-radius: 10px;backgroundColor:#fff;padding: 0px 5px 0px 10px;margin-top: 10px;">
						<view class="cuIcon-notification"></view>
						<marquee style="margin: 20rpx 10rpx 20rpx 20rpx;backgroundColor:#fff;"
							v-if="noticeList.length > 0">{{ noticeList[0] }}</marquee>
					</view>

					<view class="ads-banner" v-if="bannerAdsInfo!=null">
						<image :src="bannerAdsInfo.img" mode="widthFix" @tap="goAds(bannerAdsInfo)"></image>
					</view>

					<view class="all-box" :style="TabCur!=0?'margin-top:0;':''"
						style="background-color: rgb(0, 0, 0,0);">

						<view v-if="hometop==1">
							<block v-for="(item,index) in topContents" :key="'top'+index">


								<articleItem :item="item" :isTop="true" :owoList="owoList"></articleItem>


							</block>
						</view>

						<view v-if="act_of==1">

							<block v-for="(item,index) in contentsList" :key="index" v-if="dataLoad">

								<articleItem :item="item" :owoList="owoList"></articleItem>

							</block>

							<view class="load-more" @tap="loadMore" v-if="dataLoad">

								<text>{{moreText}}</text>

							</view>
							<view class="dataLoad" v-if="!dataLoad">

								<image src="../../static/loading.gif"></image>

							</view>
						</view>

					</view>




					<!-- 滚动通知结束 -->
				</view>
			</block>

			
			<!--底下改成滑动形式-->



		</view>

		<view v-if="flag==1" class="">
			<view :style="[{padding:NavBar + 25 + 'px 10px 0px 10px'}]"></view>
			<swiper class="screen-swiper swiper-container" style="border-radius: 20upx;margin: 0px 10px 10px 10px;"
				:class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true" :autoplay="true"
				interval="5000" duration="500" v-if="bannerswitch==1">
				<swiper-item v-for="(item,index) in swiperList2" :key="index" v-if="index<adimage_sl" @click="swiperclick(index)">
					<view class="swiper-box" style="border-radius: 20upx;">
						<image style="width: 100%; height: 100%;" mode="aspectFill" :src="item.url"/>
					</view>
				</swiper-item>
			</swiper>
			<view class="margin-left-sm margin-right-sm">

				<view class="all-box" :style="TabCur!=0?'margin-top:0;':''" style="background-color: rgb(0, 0, 0,0);">

					<view v-if="findtop==1">

						<block v-for="(item,index) in topContents" :key="'top'+index">


							<articleItem :item="item" :isTop="true" :owoList="owoList"></articleItem>


						</block>

					</view>
				</view>

				<view class="data-box" style="border-radius: 10px;margin-top: 0px;">
					<view class="cu-bar bg-white" style="border-radius: 10px;padding: 15px 5px 0px 5px;">
						<view class="action data-box-title">

							话题推荐 <text class="cuIcon-titles text-rule"></text>


						</view>
						<view class="action more" @tap="toAlltag">
							<text>全部话题</text><text class="cuIcon-right"></text>
						</view>
					</view>
					<view class="tags1">
						<view class="tags">

							<text class="tags-box" v-for="(item,index) in tagList"
								@tap='toCategoryContents("#"+item.name+"#",item.mid)'>
								{{item.name}}
							</text>

						</view>
					</view>
				</view>
				<view class="data-box" style="border-radius: 20upx;margin-top:10px">

					<view class="cu-bar bg-white" style="border-radius: 10px;padding: 15px 5px 0px 5px;">

						<view class="action data-box-title">



							<text class="cuIcon-titles text-rule"></text>上升热点 <image src="/static/rd.png"
								style="width: 26px; height: 26px;"></image>

						</view>

						<view class="action more" @tap='toTopContents("更多热帖","commentsNum")'>

							<text>更多热帖</text><text class="cuIcon-right"></text>

						</view>



					</view>

					<view class="top">

						<view class="top-box" v-for="(item,index) in topList" :key="index" @tap="toInfo(item)">

							<text>{{index+1}}</text>{{item.title}}

						</view>

					</view>

				</view>

				<view class="data-box" style="padding: 10px;border-radius: 20upx">
					<view class="cu-bar bg-white" style="border-radius: 20upx;">
						<view class="action data-box-title">
							推荐帖子
						</view>
						<view class="action more" @tap="toRecommend">
							<text>更多推荐</text><text class="cuIcon-right"></text>
						</view>
					</view>
				</view>
				<view class="padding-xs" style="background-color: #f6f6f6;"></view>
				<block v-for="(item,index) in recommendList" :key="index" v-if="dataLoad">

					<articleItem :item="item" :owoList="owoList"></articleItem>

				</block>

				<view class="dataLoad" v-if="!dataLoad">

					<image src="../../static/loading.gif"></image>

				</view>
				<view class="padding-xs" style="background-color: #f6f6f6;"></view>


			</view>
		</view>

		<!--加载遮罩-->
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../static/loading.gif"></image>
			</view>
		</view>
		<!--加载遮罩结束-->
		<!--弹窗公告-->
		<view class="announcement" v-if="isAnnouncement&&Update!=1">
			<view class="announcement-bg" @tap="isAnnouncement=false">

			</view>
			<view class="announcement-main">
				<view class="announcement-title">
					公告
					<text class="cuIcon-close text-red" @tap="isAnnouncement=false"></text>
				</view>
				<view class="announcement-concent" style="background-color: white;">
					<rich-text :nodes="announcement"></rich-text>
				</view>
				<view class="announcement-btn">
					<button class="cu-btn bg-blue lg" @tap="readAnnouncement">我知道了</button>
				</view>
			</view>
		</view>

		<!--  #ifdef APP-PLUS -->
		<view class="Startupmap" v-if="!isStart">
			<view class="Startupmap-close" @tap="toStart">
				<text>跳过</text>
			</view>
			<view class="Startupmap-close2">
				<text>广告</text>
			</view>
			<view class="Startupmap-pic" @tap="toStartUrl">
				<image :src="startImg.localUrl"></image>
			</view>
		</view>
		<view style="height: 100upx;"></view>
		<Tabbar :current="0"></Tabbar>
		<!--  #endif -->

	</view>
</template>

<script>
	import waves from '@/components/xxley-waves/waves.vue';
	import metas from '@/pages/contents/metas.vue'
	import owo from '@/static/app-plus/owo/OwO.js'
	// #ifdef APP-PLUS
	import Tabbar from '@/pages/components/tabBar.vue'
	// #endif
	import {
		localStorage
	} from '../../js_sdk/mp-storage/mp-storage/index.js'

	export default {
		data() {
			return {

				noticeList: [],
				StatusBar: this.StatusBar,
				CustomBar: 80,
				NavBar: this.StatusBar + this.CustomBar,
				AppStyle: this.$store.state.AppStyle,
				cardCur: 0,
				weburl: "",
				lunbo_of: 0,
				gonggao_of: 0,
				top_of: 0,
				act_of: 0,
				findtop: 0,
				hometop: 0,
				modalName: null,
				swiperList: [],
				swiperList2: [{
					url: '',
					zt: ''
				}],
				searchText: "",
				submitStatus1: false,
				submitStatus2: false,
				submitStatus3: false,
				submitStatus4: false,
				submitStatus5: false,
				submitStatus6: false,
				owoList: owo,
				contentsList: [],
				topContents: [],
				metaList: [],
				Topic: [],
				dotStyle: false,
				towerStart: 0,
				direction: '100000',
				TabCur: 0,
				scrollLeft: 0,
				countDown: 3,
				flag: 0,
				page: 1,
				moreText: "加载更多",
				isLoad: 0,
				token: "",
				sousuok: '',
				isLoading: 0,
				qzgx: 0,
				versionCode: 0,
				wgtVer: '',
				Update: 0,
				versionUrl: "",
				versionTitle: "",
				versionIntro: "",
				startImg: {
					localUrl: ""
				},
				isStart: false,
				dataLoad: false,
				pushAds: [],
				pushAdsInfo: null,
				bannerAds: [],
				bannerAdsInfo: null,
				announcement: "",
				isAnnouncement: false,
				noticeSum: 0,
				userInfo: null,
				owo: owo,
				owoList: [],
				gonggaotime: 86400000,
				adimage_sl: 0,
				bannerswitch:0,
				topList: [],
				tagList: [],
				recommendList: [],
				ads: "",
				noLogin: false,
				latestUserAvatar: [],

				//分类数据
				isMetasLoading: 0,
				metaPage: 1,
				metaCircleList: [],
				metaCircleMoreTxt: "加载更多"

			}
		},
		onPullDownRefresh() {
			var that = this;
			that.loading();
			var timer = setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000)
		},


		onShow() {
			var that = this;
			if (localStorage.getItem('userinfo')) {

				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.userInfo.style = "background-image:url(" + that.userInfo.avatar + ");"
				that.group = that.userInfo.group;
			} else {
				that.userInfo = null;
			}
			if (localStorage.getItem('token')) {

				that.token = localStorage.getItem('token');
			} else {
				that.token = "";
			}
			// #ifdef APP-PLUS || H5

			that.getAdsCache();

			that.getAds();
			// #endif
			// #ifdef APP-PLUS

			uni.hideTabBar({
				animation: false
			})
			//如果启动图还没有缓存过，第一次进来就不显示启动图了
			if (!localStorage.getItem('appStart')) {
				that.isStart = true;
			}

			plus.navigator.setStatusBarStyle("dark")
			// #endif
			//获取缓存
			that.allCache();
			if (localStorage.getItem('token')) {

				that.token = localStorage.getItem('token');
			}
			that.userStatus();
			// #ifdef APP-PLUS

			//外部启动APP处理
			var args = plus.runtime.arguments;
			plus.runtime.arguments = null;
			plus.runtime.arguments = "";
			if (args) {

				//跳转到帖子
				if (args.indexOf("?info=") != -1) {
					var arr = args.split("?info=");
					uni.navigateTo({
						url: '/pages/contents/info?cid=' + arr[1]
					});
				}
				//判断是否是扫码登录
				if (args.indexOf("?scan=") != -1) {
					var arr = args.split("?scan=");
					that.scanLogin(arr[1]);
				}
				
			}

			// #endif
			
			that.getadimg();


		},
		onLoad() {
			var that = this;

			that.loading();
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;

			that.isUpdate(false);
			// #endif
			var owo = that.owo.data;
			var owoList = [];
			for (var i in owo) {
				owoList = owoList.concat(owo[i].container);
			}
			that.owoList = owoList;



			setTimeout(function() {
				that.isStart = true;
			}, 5000);
			// #ifdef APP-PLUS
			that.appStartImg();
			//#endif

		},
		onReachBottom() {
			//触底后执行的方法，比如无限加载之类的
			var that = this;
			if (that.isLoad == 0) {
				that.loadMore();
			}
		},
		mounted() {
			this.getgg();
			
			this.loading();
			this.getAnnouncement();
		},
		methods: {
			loadMore() {
				var that = this;
				that.moreText = "加载中...";
				that.isLoad = 1;
				that.getContentsList(true);
			},
			goAds2(url) {
				var that = this;
				// #ifdef APP-PLUS
				plus.runtime.openWeb(url);
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			getTopPic() {
				var that = this;
				if (that.submitStatus6) {
					return false;
				}
				that.submitStatus6 = true;
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
						that.submitStatus6 = false;
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						that.submitStatus6 = false;
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			searchClose() {
				this.searchText = "";
			},
			getAdsCache() {
				var that = this;
				if (localStorage.getItem('bannerAds')) {
					that.bannerAds = JSON.parse(localStorage.getItem('bannerAds'));

					var num = that.bannerAds.length;
					if (num > 0) {
						var rand = Math.floor(Math.random() * num);
						that.bannerAdsInfo = that.bannerAds[rand];
					}
				}
			},
			loading() {
				var that = this;
				that.getRecommend();
				that.getTopList();
				that.getMetaList();
				that.getTagList();
				that.getTopPic();
				that.page = 1;
				that.getSwiper();

				that.getTopContents();
				that.getContentsList(false);
				that.getMetaContents(false, that.TabCur);
			},
			replaceSpecialChar(text) {
				text = text.replace(/&quot;/g, '"');
				text = text.replace(/&amp;/g, '&');
				text = text.replace(/&lt;/g, '<');
				text = text.replace(/&gt;/g, '>');
				text = text.replace(/&nbsp;/g, ' ');
				text = text.replace("||rn||","\n");
				return text;
			},
			getAds() {
				var that = this;

				that.$Net.request({
					url: that.$API.GetAds(),
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						if (res.data.isAds == 1) {
							that.ads = res.data.ad1.split("|");
						}

					},
					fail: function(res) {

					}
				})
			},
			goLogin() {
				var that = this;
				uni.navigateTo({
					url: '/pages/user/login'
				});
			},
			getRecommend() {
				var that = this;
				if (that.submitStatus3) {
					return false;
				}
				that.submitStatus3 = true;
				var data = {
					"type": "post",
					"isrecommend": 1
				}
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				that.$Net.request({
					url: that.$API.getContentsList(),
					data: {
						"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit": 5,
						"page": 1,
						"order": "modified",
						"token": token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {

						if (res.data.code == 1) {
							that.noLogin = false;
							var list = res.data.data;
							if (list.length > 0) {

								that.recommendList = list;

							} else {
								that.recommendList = [];
							}
							localStorage.setItem('recommendList', JSON.stringify(that.recommendList));
						} else {
							if (res.data.msg == "用户未登录或Token验证失败") {
								that.noLogin = true;
							}
						}
						that.submitStatus3 = false;
					},
					fail: function(res) {
						that.submitStatus3 = false;
					}
				})
			},

			goAds(data) {
				var that = this;
				var url = data.url;
				var type = data.urltype;
				// #ifdef APP-PLUS
				if (type == 1) {
					plus.runtime.openURL(url);
				}
				if (type == 0) {
					plus.runtime.openWeb(url);
				}
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			toSearch() {
				var that = this;
				if (that.noLogin) {
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				uni.navigateTo({
					url: '/pages/contents/search'
				});
			},
			toCategoryContents(title, id) {
				var that = this;
				var type = "meta";
				uni.navigateTo({
					url: '/pages/contents/contentlist?title=' + title + "&type=" + type + "&id=" + id
				});
			},
			toTopContents(title, id) {
				var that = this;
				var type = "meta";
				uni.navigateTo({
					url: '/pages/contents/contentlist?title=' + title + "&type=top&id=" + id
				});
			},
			toAllcategory() {
				var that = this;
				uni.navigateTo({
					url: '/pages/contents/allcategory'
				});
			},
			toRecommend() {
				var that = this;

				uni.navigateTo({
					url: '/pages/contents/recommend'
				});
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
			toGroup() {
				var url = that.$API.GetGroupUrl();
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			toAds(url) {
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			startCountDown() {
				if (this.countDown > 0) {
					this.countDown--
					setTimeout(this.startCountDown, 1000)
				} else {
					this.toStart()
				}
			},
			getCID() {
				var that = this;
				let cid = ''
				// #ifdef APP-PLUS
				let pinf = plus.push.getClientInfo();
				cid = pinf.clientid;
				if (cid) {
					that.setClientId(cid);
				}
				// #endif
			},
			setClientId(cid) {
				var that = this;
				var token = "";
				if (localStorage.getItem('token')) {

					token = localStorage.getItem('token');
				} else {
					return false;
				}
				that.$Net.request({

					url: that.$API.setClientId(),
					data: {
						"clientId": cid,
						"token": token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {


						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦",
							icon: 'none'
						})
					}
				})
			},
			//获取并缓存广告
			getAds() {
				var that = this;
				// #ifdef APP-PLUS || H5
				//获取推流广告
				that.getAdsList(0);
				//获取横幅广告
				that.getAdsList(1);
				//#endif
				// #ifdef APP-PLUS
				//获取启动图广告
				that.getAdsList(2);
				//#endif
			},
			getAdsCache() {
				var that = this;
				if (localStorage.getItem('pushAds')) {
					that.pushAds = JSON.parse(localStorage.getItem('pushAds'));
				}

				if (localStorage.getItem('bannerAds')) {
					that.bannerAds = JSON.parse(localStorage.getItem('bannerAds'));

					var num = that.bannerAds.length;
					if (num > 0) {
						var rand = Math.floor(Math.random() * num);
						that.bannerAdsInfo = that.bannerAds[rand];
					}
				}

			},
			getAdsList(type) {
				var that = this;
				var data = {
					"type": type,
				}
				that.$Net.request({
					url: that.$API.adsList(),
					data: {
						"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit": 100,
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							var list = res.data.data;
							if (type == 0) {
								that.pushAds = res.data.data;
								localStorage.setItem('pushAds', JSON.stringify(that.pushAds));
							}
							if (type == 1) {
								that.bannerAds = res.data.data;

								localStorage.setItem('bannerAds', JSON.stringify(that.bannerAds));

							}
							if (type == 2) {
								that.startAds = res.data.data;
								localStorage.setItem('startAds', JSON.stringify(that.startAds));
							}
						}


					},
					fail: function(res) {

					}
				})
			},
			toAlltag() {
				var that = this;

				uni.navigateTo({
					url: '/pages/contents/alltag'
				});
			},
			swiperclick(index) {
				const data = this.swiperList2[index];
				this.goAds2(data.zt)
				
			},
			tabSelect(e) {
				var that = this;
				that.TabCur = e.currentTarget.dataset.id;
				that.page = 1;
				that.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				that.contentsList = [];
				that.dataLoad = false;
				if (that.TabCur == 0) {
					that.getContentsList(false);
				} else {
					that.getMetaContents(false, that.TabCur);
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
				if (localStorage.getItem('topList')) {
					that.topList = JSON.parse(localStorage.getItem('topList'));
					var timer = setTimeout(function() {
						that.isLoading = 1;
						clearTimeout('timer')
					}, 300)
				}
				if (localStorage.getItem('recommendList')) {
					that.recommendList = JSON.parse(localStorage.getItem('recommendList'));
				}
				if (localStorage.getItem('find_metaList')) {
					that.metaList = JSON.parse(localStorage.getItem('find_metaList'));
				}
				if (localStorage.getItem('find_tagList')) {
					that.tagList = JSON.parse(localStorage.getItem('find_tagList'));
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
				if (localStorage.getItem('topList')) {
					that.topList = JSON.parse(localStorage.getItem('topList'));
					var timer = setTimeout(function() {
						that.isLoading = 1;
						clearTimeout('timer')
					}, 300)
				}
			},
			toView2(url) {
				var url = 'https://' + url;
				if (!localStorage.getItem('userinfo')) {
					uni.showToast({
						title: '请先登录！',
						icon: 'none'
					});
				} else {
					uni.getStorage({
						key: 'username',
						success(res) {
							uni.navigateTo({
								url: '/pages/user/webview?url=' + url
							})
						},
						fail() {
							uni.showToast({
								icon: 'none',
								title: '请先登录！'
							})
						}
					})
				}

			},
			getSwiper() {
				var that = this;
				var data = {
					"type": "post",
					"isswiper": 1
				}
				that.$Net.request({
					url: that.$API.getContentsList(),
					data: {
						"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit": 8,
						"page": 1,
						"order": "modified"
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {

						if (res.data.code == 1) {
							var list = res.data.data;
							var swiper = [];
							if (list.length > 0) {
								for (var i in list) {
									if (list[i].images.length > 0) {
										var arr = {
											cid: list[i].cid,
											type: 'image',
											url: list[i].images[0],
											title: list[i].title,
											intro: that.subText(list[i].text, 20),
										}
										swiper.push(arr);
									}

								}
								that.swiperList = swiper;

							} else {
								that.swiperList = [];
							}
							localStorage.setItem('swiperList', JSON.stringify(that.swiperList));
						}
					},
					fail: function(res) {

					}
				})
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

			getadimg() {
				var that = this;
				uni.request({
					url: that.$API.SMadimg(),
					method: 'GET',
					dataType: "json",
					success(res) {
						that.adimage_sl = res.data.adimage_sl;

						that.swiperList2 = [];

						for (let i = 1; i <= that.adimage_sl; i++) {
							that.swiperList2.push({
								url: res.data['adimage' + i],
								zt: res.data['link_url' + i]
							});
						}
					},
					fail(error) {
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
						console.error('获取广告图失败:', error);
					}
				})
			},
			getgg() {
				var that = this;
				uni.request({
					url: that.$API.SMgonggao(),
					method: 'GET',
					data: {
						id: 1
					},
					dataType: "json",
					success(res) {
						that.findtop = res.data.findtop;
						that.bannerswitch = res.data.bannerswitch;
						that.hometop = res.data.hometop;
						that.noticeList[0] = res.data.gonggao;
						that.sousuok = res.data.sousuok;
						that.lunbo_of = res.data.lunbo_of;
						that.gonggao_of = res.data.gonggao_of;
						that.top_of = res.data.top_of;
						that.act_of = res.data.act_of;
						that.weburl = res.data.weburl;
						that.gonggaotime = res.data.ggtime;


						console.log(res);
					},
					fail(error) {
						console.log(error);
					}
				})

			},

			goLogin() {
				var that = this;
				uni.navigateTo({
					url: '/pages/user/login'
				});
			},
			getTopList() {
				var that = this;
				if (that.submitStatus5) {
					return false;
				}
				that.submitStatus5 = true;
				var info = {
					"type": "post"
				}
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				that.$Net.request({
					url: that.$API.getContentsList(),
					data: {
						"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(info)),
						"limit": 5,
						"page": 1,
						"order": "commentsNum",
						"token": token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							var list = res.data.data;
							if (list.length > 0) {

								that.topList = list;
								localStorage.setItem('topList', JSON.stringify(list));
							}
						}
						that.submitStatus5 = false;
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦",
							icon: 'none'
						})
						that.submitStatus5 = false;
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			getTagList() {
				var that = this;
				if (that.submitStatus4) {
					return false;
				}
				that.submitStatus4 = true;
				var data = {
					"type": "tag"
				}
				that.$Net.request({
					url: that.$API.getMetasList(),
					data: {
						"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit": 20,
						"page": 1,
						"order": "count"
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							var list = res.data.data;
							if (list.length > 0) {


								that.tagList = list;

								localStorage.setItem('find_tagList', JSON.stringify(that.tagList));
							}
						}
						that.submitStatus4 = false;
					},
					fail: function(res) {}
				})
			},

			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			
			getTopContents() {
				var that = this;
				var data = {
					"type": "post",
					"istop": 1,
				}
				that.$Net.request({
					url: that.$API.getContentsList(),
					data: {
						"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit": 5,
						"page": 1,
						"order": "modified"
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

								that.topContents = contentsList;
							} else {
								that.topContents = [];
							}
							localStorage.setItem('topContents', JSON.stringify(that.topContents));
						}
					},
					fail: function(res) {}
				})
			},
			getContentsList(isPage) {
				var that = this;
				if (that.submitStatus1) {
					return false;
				}
				that.submitStatus1 = true;
				var data = {
					"type": "post",
					"istop": 0,
				}
				var page = that.page;
				if (isPage) {
					page++;
				}
				that.$Net.request({
					url: that.$API.getContentsList(),
					data: {
						"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit": 5,
						"page": page,
						"order": "created"
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.submitStatus1 = false;
						that.isLoad = 0;
						that.moreText = "加载更多";
						if (!isPage) {
							that.dataLoad = true;
						}
						if (res.data.code == 1) {
							var list = res.data.data;
							if (list.length > 0) {

								var num = res.data.data.length;
								var rand = Math.floor(Math.random() * num);
								var pushAdsInfo = null;
								// #ifdef APP-PLUS || H5
								if (localStorage.getItem('pushAds')) {
									var pushAds = JSON.parse(localStorage.getItem('pushAds'));
									var adsNum = pushAds.length;
									if (adsNum > 0) {
										var adsRand = Math.floor(Math.random() * adsNum);
										pushAdsInfo = that.pushAds[adsRand];
										pushAdsInfo.isAds = 1;
									}
								}
								// #endif
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
									// #ifdef APP-PLUS || H5
									var isAds = Math.round(Math.random());
									if (isAds == 1) {
										if (i == rand && pushAdsInfo != null) {
											contentsList.push(pushAdsInfo);
										}
									}

									// #endif

								}
								var num = contentsList.length;
								if (isPage) {
									that.page++;
									that.contentsList = that.contentsList.concat(contentsList);
								} else {
									that.contentsList = contentsList;
								}


								localStorage.setItem('contentsList_0', JSON.stringify(that.contentsList));
							} else {
								that.moreText = "再怎么找也没有了哦~";
							}
						}
					},
					fail: function(res) {
						that.submitStatus1 = false;
						that.moreText = "加载更多";
						that.isLoad = 0;
					}
				})
			},
			getMetaContents(isPage, meta) {
				var that = this;
				if (that.submitStatus2) {
					return false;
				}
				that.submitStatus2 = true;
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
						that.submitStatus2 = false;
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
								that.moreText = "到底啦~";
							}
						}
					},
					fail: function(res) {
						that.submitStatus2 = false;
						that.moreText = "加载更多";
						that.isLoad = 0;
					}
				})
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
			toForeverblog() {
				var that = this;

				uni.navigateTo({
					url: '/pages/contents/foreverblog'
				});

			},
			goPage(url) {
				if (!localStorage.getItem('userinfo')) {
					uni.showToast({
						title: '请先登录！',
						icon: 'none'
					});
				} else {
					var that = this;

					uni.navigateTo({
						url: url
					});
				}
			},
			toUsers() {
				var that = this;
				var token;
				if (!localStorage.getItem('token')) {
					uni.showToast({
						title: "请先登录！",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: '/pages/user/userexp'
				});
			},
			toCategoryContents(title, id) {
				var that = this;
				var type = "meta";
				uni.navigateTo({
					url: '/pages/contents/contentlist?title=' + title + "&type=" + type + "&id=" + id
				});
			},
			readAnnouncement() {
				var that = this;
				that.isAnnouncement = false;
				var timestamp = new Date().getTime();
				localStorage.setItem('isAnnouncement', timestamp);

			},
			toAllContents() {
				var that = this;
				var type = "all";
				var title = "全部帖子";
				uni.navigateTo({
					url: '/pages/contents/contentlist?title=' + title + "&type=" + type + "&id=0"
				});
			},
			toInfo(data) {
				var that = this;

				uni.navigateTo({
					url: '/pages/contents/info?cid=' + data.cid + "&title=" + data.title
				});
			},
			subText(text, num) {
				if (text.length < null) {
					return text.substring(0, num) + "……"
				} else {
					return text;
				}

			},
			toShop() {
				var that = this;
				var token;
				if (!localStorage.getItem('token')) {
					uni.showToast({
						title: "请先登录！",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: '/pages/contents/shop'
				});
			},
			formatNumber(num) {
				return num >= 1e3 && num < 1e4 ? (num / 1e3).toFixed(1) + 'k' : num >= 1e4 ? (num / 1e4).toFixed(1) + 'w' :
					num
			},
			getAnnouncement() {
				var that = this;
				that.$Net.request({
					url: that.$API.GetUpdateUrl(),
					header: {
						'content-type': 'application/json'
					},
					method: 'get',
					success: function(res) {
						that.announcement = res.data.announcement;
						if (that.announcement != "" || res.data.announcement) {
							if (localStorage.getItem('isAnnouncement')) {
								var oldTime = Number(localStorage.getItem('isAnnouncement'));
								var curTime = new Date().getTime();
								var difference = curTime - oldTime;
								if (difference > that.gonggaotime) {
									that.isAnnouncement = true;
								}
							} else {
								that.isAnnouncement = true;
							}
			
						}
			
					},
					fail: function(res) {
			
					}
				})
			},
			isUpdate(Status) {
				var that = this;
			
				plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			
					that.wgtVer = inf.version;
					that.versionCode = inf.versionCode;
					var version = inf.versionCode;
					that.$Net.request({
						url: that.$API.GetUpdateUrl(),
						header: {
							'content-type': 'application/json'
						},
						method: 'get',
						success: function(res) {
							var versionCode = res.data.versionCode;
							that.versionUrl = res.data.versionUrl;
							that.versionTitle = res.data.version;
							that.versionIntro = res.data.versionIntro;
							that.qzgx = res.data.qzgx;
							if (Status) {
								// uni.showToast({
								// 	title:"检测完成",
								// 	icon:'none',
								// 	duration: 1000,
								// 	position:'bottom',
								// });
			
							}
							if (versionCode > version) {
								console.log("有更新");
								uni.hideTabBar({
									animation: true
								})
								that.Update = 1;
								if (Status) {
									if (res.data.versionUrl != "") {
										plus.runtime.openURL(res.data.versionUrl);
									}
								}
							}
			
						},
						fail: function(res) {
			
						}
					})
			
				})
			},
			toImagetoday() {
				var that = this;

				uni.navigateTo({
					url: '/pages/contents/imagetoday'
				});
			},
			toWebview(url, title) {
				var that = this;
				var token;
				if (!localStorage.getItem('token')) {
					uni.showToast({
						title: "请先登录！",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: '/pages/user/webview?url=' + url + "&title=" + title
				});
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
			goCategory() {
				var that = this;
				uni.navigateTo({
					url: '/pages/contents/allcategory'
				});
			},
			closeUpdate() {
				var that = this;
				that.Update = 0;
				// uni.showTabBar({
				// 	animation: true
				// });
			},
			toRand() {
				var that = this;
				var token;
				if (!localStorage.getItem('token')) {
					uni.showToast({
						title: "请先登录！",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: '/pages/user/renwu'
				});
			},
			toLink(text) {
				var that = this;

				if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
					uni.showToast({
						title: "请先登录！",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: text
				});
			},
			scanLogin(text) {
				var that = this;
				var token;
				if (!localStorage.getItem('token')) {
					uni.showToast({
						title: "请先登录！",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: '/pages/user/scan?text=' + text
				});
			},
			//自定义启动图广告相关
			toStartUrl() {
				if (localStorage.getItem('appStart')) {
					var imgData = JSON.parse(localStorage.getItem('appStart'));
					//如果线上的图片与本地缓存图片相同，就不再进行下载
					if (imgData.url) {
						var url = imgData.url;
						var type = imgData.urltype;
						if (url.indexOf("http") != -1) {
							// #ifdef APP-PLUS
							if (type == 1) {
								plus.runtime.openURL(url);
							}
							if (type == 0) {
								plus.runtime.openWeb(url);
							}
							// #endif
							// #ifdef H5
							window.open(url)
							// #endif

						} else {
							uni.navigateTo({
								url: url
							});
						}

					} else {
						return false
					}

				} else {
					return false
				}
			},
			toStart() {
				var that = this;
				that.isStart = true;
			},
			appStartImg() {

				var that = this;
				// #ifdef APP-PLUS
				if (localStorage.getItem('appStart')) {
					var imgData = JSON.parse(localStorage.getItem('appStart'));

					if (!imgData.localUrl || imgData.localUrl == "") {
						console.log("启动图文件本地不存在");
						localStorage.removeItem('appStart');
						that.isStart = true;
						return false;
					}
					var localUrl = imgData.localUrl;
					//在请求之前，先为了性能载入上次图片
					plus.io.resolveLocalFileSystemURL(imgData.localUrl, function(entry) {
						console.log("启动图文件本地存在");
						imgData.localUrl = localUrl;
						that.startImg = imgData;

						that.isStart = false;
					}, function(e) {
						console.log("启动图文件本地不存在");
						localStorage.removeItem('appStart');
						that.isStart = true;
					});
				} else {
					console.log("启动图未缓存")
				}
				if (localStorage.getItem('startAds')) {
					var data = JSON.parse(localStorage.getItem('startAds'));
					var adsNum = data.length;
					if (adsNum > 0) {

						var adsRand = Math.floor(Math.random() * adsNum);
						var appStartPic = data[adsRand].img;
						if (appStartPic != "") {
							appStartPic = appStartPic.replace(/[\r\n]/g, "");
							var imgData = data[adsRand];
							imgData.appStartPic = appStartPic;
							that.Download(imgData);
						}
					} else {
						console.log("广告信息不存在，删除缓存");
						localStorage.removeItem('appStart');
						that.isStart = true;
					}

				}
				// #endif
			},
			Download(startImg) {
				var that = this;
				// #ifdef APP-PLUS
				var url = startImg.appStartPic;
				if (localStorage.getItem('appStart')) {
					var imgData = JSON.parse(localStorage.getItem('appStart'));
					//如果线上的图片与本地缓存图片相同，就不再进行下载
					if (url == imgData.appStartPic) {
						console.log("启动图不更新");
						//但是链接可能变化，所以需要载入缓存
						var oldStartImg = imgData;
						localStorage.setItem('appStart', JSON.stringify(oldStartImg));
						return false;
					}
				}
				uni.downloadFile({
					url: url, //下载地址接口返回
					success: (data) => {
						if (data.statusCode === 200) {
							//文件保存到本地
							uni.saveFile({
								tempFilePath: data.tempFilePath, //临时路径
								success: function(res) {
									// uni.showToast({
									// 	icon: 'none',
									// 	mask: true,
									// 	title: '文件已保存：' + res.savedFilePath, //保存路径
									// 	duration: 3000,
									// });

									startImg.localUrl = res.savedFilePath;
									localStorage.setItem('appStart', JSON.stringify(startImg));
									console.log("启动图已更新" + startImg.localUrl);

									that.startImg = startImg;
								}
							});
						}
					},
					fail: (err) => {
						console.log(err);
						// uni.showToast({
						// 	icon: 'none',
						// 	mask: true,
						// 	title: '失败请重新下载',
						// });
					},
				});
				// #endif

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
			waves,
			'metas': {
				// 组件选项
			},
			'tabbar': {
				// 组件选项
			}
		},
		// #endif
	}
</script>

<style scoped>
	.tab-wrap-index {
		color: #454545;
		position: relative;
		z-index: 1;
	}

	.tab-wrap-index::after {
		position: absolute;
		border-radius: 50px;
		color: #797979;
		right: 5%;
		bottom: 6rpx;
		z-index: -1;
		display: block;
		content: "";
		width: 100%;
		height: 13rpx;
		background-color: #3cc9a4;
	}

	.square-box {
		font-weight: bold;
		font-size: 17px;
	}

	.square-box2 {
		font-weight: bold;
		font-size: 14px;
	}

	.square-box,
	.square-box2 {
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

	.tab-wrap-index {
		color: #454545;
		position: relative;
		z-index: 1;
	}

	.tab-wrap-index::after {
		position: absolute;
		border-radius: 50px;
		color: #797979;
		right: 5%;
		bottom: 6rpx;
		z-index: -1;
		display: block;
		content: "";
		width: 100%;
		height: 13rpx;
		background-color: #3cc9a4;
	}

	.square-box {
		font-weight: bold;
		font-size: 32upx;
	}

	.square-box2 {
		font-weight: bold;
		font-size: 28upx;
	}

	.square-box,
	.square-box2 {
		transition: font-size 0.5s ease-in-out
	}

	.text-content {
		overflow: hidden;
		-webkit-line-clamp: 3;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}

	.font-size-small {
		font-size: small;
	}

	::v-deep .tn-row-notice-class {
		border-radius: 8rpx;
	}

	::v-deep .uni-swiper-slides uni-swiper-item {
		padding: 0;
	}

	.swiper-container {
		margin-bottom: 26rpx;
		box-shadow: 0 3px 5px 1px #d5d5d5;
	}

	.extra-count {
		position: absolute;
		background-color: #00000078;
		color: white;
		font-size: 40upx;
		border-radius: 20upx;
		font-weight: bold;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.grid.grid-square>uni-view {
		border-radius: 20upx;
	}

	.tags1 {
		padding: 10px;
	}

	.tags {
		display: flex;
		white-space: nowrap;
		overflow-x: auto;
	}

	.tags-box {
		display: inline-block;
		margin: 5px;
		border-radius: 10px;
	}
</style>