<template>
	<view class="user" :class="AppStyle">
		<view class="header" v-if="isShowNav" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					{{title}}
				</view>
				<!--  #ifdef H5 || APP-PLUS -->
				<view class="action" @tap="toSearch">
					<text class="cuIcon-search"></text>
				</view>
				<!--  #endif -->
			</view>
		</view>
		<!-- <view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view> -->
		<view class="cu-card article no-card">
			<view class="cate-info flex" :style="'padding-top:'+NavBar+'px;'" style="height: 520rpx;" v-for="(item,index) in metaList"
				:key="index" v-if="item.mid==id">
				<view class="cate-info-bg" style="height: 510rpx;" :style="'background-image: url('+item.imgurl+');background-size:cover;'">
				</view>
				<view class="cate-info-main" style="height: 530rpx;">
					<view class="cu-bar margin-top-sm">
						<view class="action" @tap="back">
							<text class="cuIcon-back text-white" v-if="isHideNav"></text>
						</view>
						<view class="action" @tap="toSearch">
							<text class="cuIcon-search text-white"></text>
						</view>
					</view>
					<view class="flex margin-top-lg align-center">
						<view class="cu-avatar xl round margin-left " :style="'background-image:url('+item.imgurl+');'"></view>
						<view class="tn-flex-2 margin-left-sm" style="margin-left:15px;margin-right:25px;">
							<view style="display: flex; justify-content: space-between; align-items: center;margin-bottom: 5px;">
							  <text class="text-white" style="font-size: 15px;color: #ffffff; margin-right: auto;">{{item.name}}</text>
							  <text class="text-white" style="font-size: 13px;color: #ffffff; margin-left: auto;">帖子 {{fenlei}}</text>
							</view>
							<view>
							  <text class="text-white" style="font-size: 10px;color: #ffffff;">{{item.description}}</text>
							</view>
						</view>
					</view>
					<view class="bg-white padding-tb bg-white"
						style="position: absolute; width: 100%; bottom:0;background: #ffffff;border-radius: 20rpx 20rpx 0 0;padding-top: 10rpx;padding-bottom: 20rpx;">
						<view class="tn-tabs">
							<view class="tn-tabs__header">
								<view class="tn-tabs__item" 
									v-for="(item, index) in List" 
									:key="index"
									:class="{'tn-tabs__item--active': orderCur === item.order}"
									@tap="topSelect" 
									:data-order="item.order">
									<text class="tn-tabs__item-title">{{item.name}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="appcontent margin-left-sm margin-right-sm margin-top-sm">

				<block v-for="(item,index) in contentsList" :key="index">
					<articleItem :item="item"></articleItem>
				</block>
				<view class="load-more" @tap="loadMore" v-if="contentsList.length>0">
					<text>{{moreText}}</text>
				</view>
				<view class="no-data" v-if="contentsList.length==0">
					<text class="cuIcon-text"></text>暂时没有数据
				</view>
			</view>
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
	import {
		localStorage
	} from '../../js_sdk/mp-storage/mp-storage/index.js'
import { data } from '../../static/app-plus/owo/OwO.js';
	export default {
		data() {
			return {
				isHideNav: true,
				isShowNav: false,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar: this.StatusBar + this.CustomBar,
				AppStyle: this.$store.state.AppStyle,
				title: "",
				type: "",
				id: 0,
				fenlei: 0,
				imgurl: "",
				Topic: [],
				contentsList: [],
				page: 1,
				moreText: "加载更多",
				metaImg: "",

				isLoad: 0,

				metaList: [{
					mid: 0,
					name: "全部",
					parent: 0,
				}],
				List: [{
						order: "created",
						name: "最新",
						parent: 0
					},
					{
						order: "replyTime",
						name: "回复",
						parent: 0
					},
					{
						order: "views",
						name: "最热", 
						parent: 0
					},
					{
						order: "commentsNum", 
						name: "获评",
						parent: 0
					},
					
					{
						order: "likes",
						name: "获赞",
						parent: 0
					},
					
				],
				orderCur: "created",
				TabCur: 0,
				scrollLeft: 0,
				isLoading: 0,

			}
		},
		onPageScroll(e) {
			if (e.scrollTop >= 100) {
				console.log('显示导航栏');
				this.isShowNav = true
			} else {
				this.isShowNav = false
			}
			if (e.scrollTop >= 100) {
				this.isHideNav = false
			} else {
				this.isHideNav = true
			}
		},
		onPullDownRefresh() {
			var that = this;
			this.getfenlei()

		},
		onReachBottom() {
			//触底后执行的方法，比如无限加载之类的
			var that = this;
			if (that.isLoad == 0) {
				that.loadMore();
			}

		},
		onShow() {
			var that = this;
			// #ifdef APP-PLUS

			plus.navigator.setStatusBarStyle("dark")
			// #endif

		},
		onLoad(res) {
			var that = this;
			
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			that.title = res.title;
			that.type = res.type;
			that.imgurl = res.imgurl;
			//user根据用户查询 meta根据分类和标签查询，all显示分类查询全部，search根据搜索关键词查询
			that.id = res.id;
			if (res.type != "") {
				if (that.type == "meta") {

					that.getMetaContents(false, that.id);
					that.getMetaList();
					that.getTopPic();
				} else if (that.type == "top") {
					that.getContentsList(false, that.type, that.id);
				} else {
					that.getContentsList(false, that.type, that.id);
				}
			}
			if (res.type == "all") {
				that.getMetaList();
			}
			this.getfenlei()
		},
		
		
		methods: {
			getfenlei() {
			  var that = this;
			  var pages = getCurrentPages();
			  var prevPage = pages[pages.length - 1];
			  var id = prevPage.options.id; 
			  uni.getStorage({
			  	key:'username',
			  	success(res) {
			  		var username=res.data;
			  		uni.request({
			  			url:that.$API.SMfenlei(),
						data:{
							id:that.id
						},
			  			method:'GET',
			  			dataType:"json",
			  			success(res) {
			  				that.fenlei = res.data.count;
			  			},
			  			fail(error) {
			  			  console.log(error);
			  			}
			  			
			  		})
			  		
			  	}
			  })
			},
			allCache() {
				var that = this;
				var meta = that.TabCur;

			},
			tabSelect(e) {
				var that = this;
				that.TabCur = e.currentTarget.dataset.id;
				that.id = e.currentTarget.dataset.id;
				that.page = 1;
				that.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				if (localStorage.getItem('metaList')) {
					that.metaList = JSON.parse(localStorage.getItem('metaList'));
				}
				if (localStorage.getItem('Topic')) {
					that.Topic = JSON.parse(localStorage.getItem('Topic'));
				}
				if (that.TabCur == 0) {
					that.getContentsList(false, "all", 0);
				} else {
					that.getMetaContents(false, that.TabCur);
				}
			},
			topSelect(e) {
				var that = this;
				that.orderCur = e.currentTarget.dataset.order;
				that.page = 1;
				that.getContentsList(false, "all", 0);
			},
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			loadMore() {
				var that = this;
				that.moreText = "加载中...";
				that.isLoad = 1;
				if (that.type == "meta") {

					that.getMetaContents(true, that.id);
				} else if (that.type == "all") {
					if (that.id == 0) {
						that.getContentsList(true, that.type, that.id);
					} else {
						that.getMetaContents(true, that.id);
					}
				} else if (that.type == "top") {
					that.getContentsList(true, that.type, that.id);

				} else {
					that.getContentsList(true, that.type, that.id);
				}
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
						"limit": 40,
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
			getContentsList(isPage, type, id) {
				var that = this;
				var info = {
					"type": "post"
				}
				var order = "created";
				if (type == "user") {
					info = {
						"type": "post",
						"authorId": that.id
					}
				}
				order = that.orderCur
				var page = that.page;
				if (isPage) {
					page++;
				} else {
					that.contentsList = [];
				}
				var data = {
					"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(info)),
					"limit": 5,
					"page": page,
					"order": order
				};
				that.$Net.request({
					url: that.$API.getContentsList(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res))
						that.moreText = "加载更多";
						that.isLoad = 0;
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
										pushAdsInfo = pushAds[adsRand];
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
								if (isPage) {
									that.page++;
									that.contentsList = that.contentsList.concat(contentsList);
								} else {
									that.contentsList = contentsList;
								}



							} else {
								that.moreText = "没有更多了~";
							}
						}
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						that.moreText = "加载更多";
						that.isLoad = 0;
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
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
					"mid": meta
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
						"order": that.orderCur
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res))
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
								that.moreText = "没有更多了~";
							}
						}
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
						that.moreText = "加载更多";
						that.isLoad = 0;
					}
				})
			},
			toSearch() {
				var that = this;

				uni.navigateTo({
					url: '/pages/contents/search'
				});
			}
		}
	}
</script>

<style>
/* 添加Tab样式 */
.tn-tabs__header {
	border-radius: 20rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 80rpx;
    background-color: #ffffff;
}

.tn-tabs__item {
    position: relative;
    padding: 0 20rpx;
}

.tn-tabs__item--active {
    color: #01BEFF;
}

.tn-tabs__item--active::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10rpx;
    transform: translateX(-50%);
    width: 40rpx;
    height: 4rpx;
    background-color: #01BEFF;
    border-radius: 2rpx;
}

.tn-tabs__item-title {
    font-size: 28rpx;
}
</style>
