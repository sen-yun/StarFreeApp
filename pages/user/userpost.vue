<template>
	<view class="userpost" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					投稿列表
				</view>
				<!--  #ifdef H5 || APP-PLUS -->
				<view class="action" @tap="toWeb">
					<text class="cuIcon-service" style="margin-right: 4rpx;"></text>审核
				</view>
				<!--  #endif -->
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="data-box">
			<view class="search-type grid col-3">
				<view class="search-type-box" @tap="toType('publish')" :class="type=='publish'?'active':''">
					<text>已发布</text>
				</view>
				<view class="search-type-box" @tap="toType('waiting')" :class="type=='waiting'?'active':''">
					<text>待审核</text>
				</view>
				<view class="search-type-box" @tap="toType('reject')" :class="type=='reject'?'active':''">
					<text>已拒绝</text>
				</view>
			</view>
			<view class="cu-card article no-card">
				<!--  #ifdef MP -->
				<view class="all-btn">
					<view class="user-btn flex flex-direction">
						<button class="cu-btn bg-blue margin-tb-sm lg" @tap="toPost">发布帖子</button>
						
					</view>
				</view>
				<!--  #endif -->
				<view class="no-data" v-if="contentsList.length==0">
					<text class="cuIcon-text"></text>暂时没有数据
				</view>
				<view class="cu-item shadow article-item" v-for="(item,index) in contentsList" :key="index">
					<view class="content">
						<view class="article-main" @tap="toEdit(item.cid)">
							<view class="article-title text-cut">{{replaceSpecialChar(item.title)}}</view>
							<view class="article-time">{{formatDate(item.created)}}</view>
						</view>
						<view class="article-actions">
							<view class="status-tag cu-tag sm round" 
								:class="item.status=='publish' ? 'bg-green light' : 'bg-orange light'">
								{{item.status=='publish' ? '已发布' : '待审核'}}
							</view>
							<view class="action-btns">
								<text class="action-btn edit-btn" @tap="toEdit(item.cid)">
									<text class="cuIcon-edit"></text> 编辑
								</text>
								<text class="action-btn delete-btn" @tap.stop="toDelete(item.cid)" v-if="allowDelete==1">
									<text class="cuIcon-delete"></text> 删除
								</text>
							</view>
						</view>
						<view class="divider"></view>
					</view>
				</view>
				<view class="load-more" @tap="loadMore" v-if="contentsList.length>0">
					<text>{{moreText}}</text>
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
				shenhe:"",
				isLoad:0,
				token:"",
				contentsList:[],
				
				isLoading:0,
				type:"publish",
				
				allowDelete:0,
			}
		},
		onPullDownRefresh(){
			var that = this;
			that.page=1;
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
			that.page = 1;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			if(localStorage.getItem('token')){
				that.token=localStorage.getItem('token');
				that.getContentsList(false);
			}
			
			that.contentConfig();
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			that.getset();
			
		},
		methods: {
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			getset() {
			  var that = this;
			      uni.request({
			        url:that.$API.SMset(),
			        method:'GET',
			        dataType:"json",
			        success(res) {
						that.shenhe = res.data.shenhe;
						// that.kefu = res.data.kefu;
						// that.qqqun = res.data.qqqun;
			        },
			        fail(error) {
			          console.log(error);
			        }
			      })
			},
			loadMore(){
				var that = this;
				that.moreText="正在加载中...";
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
					
				var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				var authorId = userInfo.uid;
				
				var data = {
					"type":"post",
					"authorId":authorId,
					"status":that.type
				}
				var page = that.page;
				if(isPage){
					page++;
				}
				that.$Net.request({
					url: that.$API.getContentsList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":15,
						"page":page,
						"order":"created",
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
								
							}else{
								that.moreText="没有更多帖子了";
								if(!isPage){
									that.contentsList = list;
								}
							}
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
						that.moreText="加载更多";
						that.isLoad=0;
					}
				})
			},
			contentConfig(){
				var that = this;
				that.$Net.request({
					
					url: that.$API.contentConfig(),
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.allowDelete = res.data.data.allowDelete;
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
			toDelete(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"key":id,
					"token":token
				}
				uni.showModal({
				    title: '确定要删除该帖子吗',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.contentsDelete(),
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
				            			
				            			//执行积分程序
				            			if (localStorage.getItem('userinfo')) {
				            			  var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				            			  that.username = userInfo.name;
				            			
				            				}
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
			toWeb(){
			var that = this;
			var url = that.shenhe;
			// #ifdef APP-PLUS
			plus.runtime.openURL(url) 
			// #endif
			// #ifdef H5
			window.open(url)
			// #endif
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
			toType(i){
				var that = this;
				that.type=i;
				that.page=1;
				that.moreText="加载更多";
				that.isLoad=0;
				that.getContentsList(false);
			},
			subText(text,num){
				if(text.length < null){
					return text.substring(0,num)+"……"
				}else{
					return text;
				}
				
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
				text = text.replace("||rn||","\n");
				return text;
			}
		}
	}
</script>

<style>
.article-item {
  padding: 24rpx;
  margin: 20rpx 0;
  border-radius: 12rpx;
}

.article-item .content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.article-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24rpx;
}

.article-title {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-time {
  font-size: 24rpx;
  color: #999;
  flex-shrink: 0;
}
.divider{
  border-bottom: 1rpx solid #eee;
}
.article-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  
}

.action-btns {
  display: flex;
  gap: 24rpx;
}

.action-btn {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  display: inline-flex;
  align-items: center;
  gap: 4rpx;
}

.edit-btn {
  color: #2d8cf0;
}

.delete-btn {
  color: #ff4d4f;
}

.action-btn:active {
  opacity: 0.8;
}

.status-tag {
  font-size: 24rpx;
}
.load-more {
  background-color: #ffffff;
}
</style>
