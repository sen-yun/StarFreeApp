<template>
	<view class="usermarks" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					浏览记录
				</view>
				<view class="action" @tap="toSearch">
					<text class="cuIcon-search"></text>
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="all-box">
			<view class="no-data" v-if="contentsList.length==0">
				<text class="cuIcon-text"></text>暂时没有数据
			</view>
			<view class="cu-card article no-card" v-for="(item,index) in contentsList" :key="index"  @tap="toInfo(item)">
				<view class="cu-item shadow">
					<view class="title">
						<view class="text-cut">{{item.title}}</view>
					</view>
					<view class="content">
						<block v-if="item.category[0].slug !== 'vip'">
						<image v-if="item.images.length>0" :src="item.images[0]" mode="aspectFill"></image>
						</block>
						<block v-else>
						<image v-if="item.images.length>0" src="../../static/page/vip_img.png" mode="aspectFill"></image>
						</block>
						
						<view class="desc">
							<view class="text-content" v-html="hideContent(item.text,30)"></view>
							<view>
								<view class="cu-tag data-author"><text class="cuIcon-attentionfill"></text>{{formatNumber(item.views)}}</view>
								<view class="cu-tag data-author"><text class="cuIcon-appreciatefill"></text>{{item.likes}}</view>
								<view class="cu-tag data-author"><text class="cuIcon-messagefill"></text>{{item.commentsNum}}</view>
								<view class="cu-tag data-time" style="background-color: #ffffff;">发布于{{formatDate(item.created)}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			
			
			
			
			
			
			
			<view class="load-more" @tap="loadMore" v-if="contentsList.length>0">
				<text>{{moreText}}</text>
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
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
			AppStyle:this.$store.state.AppStyle,
				
				page:1,
				moreText:"加载更多",
				
				isLoad:0,
				token:"",
				contentsList:[],
				isLoading:0,
			}
		},
		onPullDownRefresh(){
			var that = this;
			that.getContentsList(false);
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
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			if(localStorage.getItem('token')){
				that.token=localStorage.getItem('token');
				that.getContentsList(false);
			}
			that.page = 1;
			
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			
		},
		mounted(){
			var that = this;
			this.getMetaList();
			this.getMetaContents(false, that.TabCur);
			this.getMetaContents(false, that.TabCur);
		},
		methods: {
			
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
								that.moreText = "到底啦~";
							}
						}
					},
					fail: function(res) {
			
						that.moreText = "加载更多";
						that.isLoad = 0;
					}
				})
			},
			 hideContent(text,num) {
			   var pattern = /\[hide\](.*?)\[\/hide\]/g;
			   var vippattern = /\[vip\](.*?)\[\/vip\]/g;
			   var matches = text.match(pattern);
			   var vipmatches = text.match(vippattern);
			   if (matches) {
			     for (var i = 0; i < matches.length; i++) {
			       var match = matches[i];
			       var content = match.replace(/\[hide\]|\[\/hide\]/g, '');
			       text = text.replace(match, '<span style="display: none">' + content + '</span>');
			     }
			   }
			   if (vipmatches) {
			     for (var i = 0; i < vipmatches.length; i++) {
			       var vipmatch = vipmatches[i];
			       var vipcontent = vipmatch.replace(/\[vip\]|\[\/vip\]/g, '');
			       text = text.replace(vipmatch, '<span style="display: none">' + vipcontent + '</span>');
			     }
			   }
			   if (text.length > num) {
			     return text.substring(0, num) + "……";
			   } else {
			     return text;
			   }
			 },
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			loadMore(){
				var that = this;
				that.moreText="加载中...";
				that.isLoad=1;
				that.getContentsList(true);
			},
			getContentsList(isPage){
				var that = this;
				if(that.token==""){
					uni.showToast({
					    title:"请先登录",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				var page = that.page;
				if(isPage){
					page++;
				}
				that.$Net.request({
					url: that.$API.getMarkList(),
					data:{
						"limit":8,
						"page":page,
						"token":that.token,
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.isLoad=0;
						//console.log(JSON.stringify(res))
						that.moreText="加载更多";
						if(res.data.code==1){
							var list = res.data.data;
							if(list.length>0){
								if(isPage){
									that.page++;
									that.contentsList = that.contentsList.concat(list);
								}else{
									that.contentsList = list;
								}
								
								
								localStorage.setItem('userContentsList',JSON.stringify(that.contentsList));
							}else{
								that.moreText="没有更多了~";
							}
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						that.moreText="加载更多";
						that.isLoad=0;
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			toInfo(data){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/contents/info?cid='+data.cid+"&title="+data.title
				});
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
			formatNumber(num) {
			    return num >= 1e3 && num < 1e4 ? (num / 1e3).toFixed(1) + 'k' : num >= 1e4 ? (num / 1e4).toFixed(1) + 'w' : num
			},
			toSearch(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/contents/search'
				});
			},
		}
	}
</script>

<style>
</style>
