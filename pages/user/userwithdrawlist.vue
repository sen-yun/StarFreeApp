<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					提现记录
				</view>
				<view class="action"></view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 15px 0px 15px'}]"></view>
		
		<view class="records-container">
			<view class="cu-card dynamic no-card">
				<view class="cu-item">
					<view class="cu-list menu-avatar comment">
						<view class="no-data" v-if="withdrawList.length==0">
							<text class="cuIcon-text"></text>
							<text class="empty-text">暂时没有数据</text>
						</view>
						<view class="order-box" v-for="(item,index) in withdrawList" :key="index" v-if="withdrawList.length>0">
							<view class="order-main">
								<view class="order-info">
									<text class="order-time">{{formatDate(item.created)}}</text>
								</view>
								<view class="order-btn">
									<text class="amount">{{item.num}} {{assetsname}} = ￥ {{item.num/scale}}</text>
									<text class="status pending" v-if="item.cid==-1">审核中</text>
									<text class="status success" v-if="item.cid==0">已成功</text>
									<text class="status rejected" v-if="item.cid==-2">被拒绝</text>
								</view>
							</view>
						</view>
						
						<view class="load-more" @tap="loadMore" v-if="withdrawList.length>0">
							<text>{{moreText}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../static/loading.gif"></image>
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
				
				withdrawList:[],
				
				moreText:"加载更多",
				page:1,
				assetsname:"",
				isLoading:0,
				scale:0,
				
			}
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		onReachBottom() {
		    //触底后执行的方法，比如无限加载之类的
			var that = this;
			that.loadMore();
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			that.page=1;
			that.getVipInfo();
			
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			that.getWithdrawList(false);
		},
		
				mounted() {
						 this.getset();
						},
				methods: {
					getset() {
					  var that = this;
					      uni.request({
					        url:that.$API.SMset(),
					        method:'GET',
					        dataType:"json",
					        success(res) {
		
						that.assetsname = res.data.assetsname;
		
							  
					        },
					        fail(error) {
					          console.log(error);
					        }
					      })
					},
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			loadMore(){
				var that = this;
				that.moreText="正在加载中...";
				if(that.isLoad==0){
					that.getWithdrawList(true);
				}
			},
			getWithdrawList(isPage){
				var that = this;
				var userInfo = null;
				if(localStorage.getItem('userinfo')){
					
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				}else{
					uni.showToast({
						title: "请先登录哦",
						icon: 'none'
					})
					return false;
				}
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var uid = 0;
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					uid=userInfo.uid;
				}
				var data = {
					"type":"withdraw",
					"uid":uid
				}
				var page = that.page;
				if(isPage){
					page++;
				}
				that.$Net.request({
					url: that.$API.withdrawList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":5,
						"page":page,
						"token":token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.isLoad=0;
						if(res.data.code==1){
							var withdrawList = res.data.data;
							if(withdrawList.length>0){
								
								if(isPage){
									that.page++;
									that.withdrawList = that.withdrawList.concat(withdrawList);
								}else{
									that.withdrawList = withdrawList;
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
						that.isLoad=0;
						that.moreText="加载更多";
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					}
				})
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
			getVipInfo(){
				var that = this;
				that.$Net.request({
					url: that.$API.getVipInfo(),
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.scale=res.data.data.scale;
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
					}
				})
			},
		}
	}
</script>

<style lang="scss">
.records-container {
	padding: 0 15px;
	margin-top: 10px;
}

.order-box {
	background: #ffffff;
	border-radius: 12px;
	padding: 16px;
	margin-bottom: 12px;
	box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}

.order-main {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.order-info {
	display: flex;
	align-items: center;
}

.order-time {
	color: #666;
	font-size: 14px;
}

.order-btn {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.amount {
	font-size: 15px;
	color: #333;
	font-weight: 500;
}

.status {
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 13px;
}

.pending {
	background: #e6f3ff;
	color: #2196f3;
}

.success {
	background: #e8f5e9;
	color: #4caf50;
}

.rejected {
	background: #ffebee;
	color: #f44336;
}

.no-data {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px 0;
	color: #999;
	.cuIcon-text {
		font-size: 48px;
		margin-bottom: 10px;
	}
	.empty-text {
		font-size: 14px;
	}
}

.load-more {
	text-align: center;
	color: #666;
	background-color: #ffffff;
	font-size: 14px;
}

.loading {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255,255,255,0.9);
	display: flex;
	align-items: center;
	justify-content: center;
	
	.loading-main {
		width: 40px;
		height: 40px;
		image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
