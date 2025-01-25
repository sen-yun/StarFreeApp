<template>
	<view class="user">
		<view class="header" :style="[{height:CustomBar + 'px'}]" :class="AppStyle">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					我的钱包
				</view>
				<view class="action">
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="data-box">
			<view class="myAssets">
				<text class="assets-amount">{{assets}}</text>
				<text class="assets-unit">{{assetsname}}</text>
			</view>
			<view class="action-buttons">
				<button class="action-btn recharge" @tap="userrecharge" v-if="chongzhi===1">
					<text class="btn-icon cuIcon-moneybag"></text>
					<text>充值</text>
				</button>
				
				<button 
					class="action-btn withdraw" 
					@tap="userwithdraw"
					:class="{'disabled': !canWithdraw}"
				>
					<text class="btn-icon cuIcon-present"></text>
					<text>提现</text>
				</button>
			</view>
		</view>
		
		<view class="order-list">
			<view class="no-data" v-if="orderList.length==0">
				<text class="cuIcon-text"></text>
				<text>暂无交易记录</text>
			</view>
			
			<view class="order-item" v-for="(item,index) in orderList" :key="index">
				<view class="order-header">
					<text class="order-id">订单 {{item.outTradeNo}}</text>
					<text :class="['order-status', item.status ? 'success' : 'pending']">
						{{item.status ? '已支付' : '待支付'}}
					</text>
				</view>
				
				<view class="order-content">
					<text class="order-title">{{item.subject}}</text>
					<text class="order-amount">{{item.totalAmount}} {{assetsname}}</text>
				</view>
				
				<view class="order-footer">
					<text class="order-time">{{formatDate(item.created)}}</text>
					<text class="order-type" v-if="item.shopInfo">{{getType(item.shopInfo.type)}}</text>
				</view>
			</view>
		</view>
		<view class="text-tips margin-top text-center text-gray text-sm">
			只显示最近30条记录
		</view>
		<!--加载遮罩-->
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../static/loading.gif"></image>
			</view>
		</view>
		<!--加载遮罩结束-->
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">VIP开通说明</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl text-center">
					<view v-html="viptext"></view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import waves from '@/components/xxley-waves/waves.vue';
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
			AppStyle:this.$store.state.AppStyle,
				tixian:0,
				group:"",
				userInfo:null,
				token:"",
				assets:"",
				isvip:0,
				vip:0,
				chongzhi:0,
				orderList:[],
				assetsname:"",
				vipzk:0,
				isLoading:0,
				viptext:"",
				modalName: null,
				
				vipDiscount:0,
				vipPrice:0,
				scale:0
				
			}
		},
		onPullDownRefresh(){
			var that = this;
			if(localStorage.getItem('token')){
				
				that.token = localStorage.getItem('token');
				that.userStatus();
				that.getOrderList();
			}
			that.getVipInfo();
			var timer = setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000)
		},
		
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			
			// #endif
			if(localStorage.getItem('userinfo')){
				
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.userInfo.style = "background-image:url("+that.userInfo.avatar+");"
				that.group = that.userInfo.group;
			}
			if(localStorage.getItem('token')){
				
				that.token = localStorage.getItem('token');
				that.userStatus();
				that.getOrderList();
			}
			that.getVipInfo();
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
		},
		mounted() {
		this.getleiji()
		},
		methods: {
			
			getleiji() {
			  var that = this;
			  		uni.request({
			  			url:that.$API.SMset(),
			  			method:'GET',
			  			dataType:"json",
			  			success(res) {
							that.assetsname = res.data.assetsname;
							that.chongzhi = res.data.chongzhi;
							that.vipzk = res.data.vipzk;
							that.viptext = res.data.viptext;
							that.tixian = res.data.tixian;
			  			  
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
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
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
			userrecharge(){
				var that = this;
				uni.navigateTo({
				    url: '/pages/user/userrecharge'
				});
				
			},
			userwithdraw(){
				if(this.canWithdraw){
					uni.navigateTo({
					    url: '/pages/user/userwithdraw'
					});
				}else{
					uni.showToast({
						title: "你的账号目前无法提现哦~",
						icon: 'none'
					})
				}
			},
			buyvip(){
				uni.navigateTo({
				    url: '/pages/user/buyvip'
				});
			},
			userStatus() {
				var that = this;
				that.$Net.request({
					
					url: that.$API.userStatus(),
					data:{
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.assets = res.data.data.assets;
							that.vip = res.data.data.vip;
							that.isvip = res.data.data.isvip;
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
			getOrderList(){
				var that = this;
				var data = {
					"token":that.token
				}
				that.$Net.request({
					url: that.$API.payLogList(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						uni.stopPullDownRefresh()
						if(res.data.code==1){
							var list = res.data.paydata;
							if(list.length>0){
							
								that.orderList = list;
								
							}
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						uni.stopPullDownRefresh()
						uni.showToast({
							title: "网络不太好哦",
							icon: 'none'
						})
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
							that.vipDiscount=res.data.data.vipDiscount;
							that.vipPrice=res.data.data.vipPrice;
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
			tovipDiscount(num){
				if(Number(num)<=0){
					return 0;
				}else{
					num = num.toString();
					num = num.replace("0.","");
					return num;
				}
				
			}
		},
		computed: {
			canWithdraw() {
				if (this.tixian === 4) return true;
				if (this.tixian === 5) return false;
				
				const isAdmin = this.group === 'administrator';
				const isEditor = this.group === 'editor';
				const hasVip = this.isvip === 1;
				
				switch(this.tixian) {
					case 1: return isEditor || isAdmin || hasVip;
					case 2: return isAdmin || hasVip;
					case 3: return isEditor || isAdmin;
					default: return false;
				}
			}
		},
		components: {
			waves
		}
	}
</script>

<style>
.data-box {
	padding: 20px;
	background: #fff;
	border-radius: 12px;
	margin: 15px;
	box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.myAssets {
	text-align: center;
	margin-bottom: 20px;
}

.assets-amount {
	font-size: 36px;
	font-weight: bold;
	color: #333;
}

.assets-unit {
	font-size: 14px;
	color: #666;
	margin-left: 4px;
}

.action-buttons {
	display: flex;
	justify-content: space-around;
	gap: 15px;
}

.action-btn {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 12px;
	border-radius: 8px;
	border: none;
	gap: 6px;
}

.action-btn.recharge {
	background: #007AFF;
	color: #fff;
}

.action-btn.withdraw {
	background: #FF3B30;
	color: #fff;
}

.action-btn.disabled {
	background: #E5E5EA;
	color: #8E8E93;
}

.btn-icon {
	font-size: 24px;
}

.order-list {
	margin: 15px;
}

.order-item {
	background: #fff;
	border-radius: 12px;
	padding: 15px;
	margin-bottom: 12px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.order-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
}

.order-id {
	color: #666;
	font-size: 13px;
}

.order-status {
	font-size: 13px;
}

.order-status.success {
	color: #34C759;
}

.order-status.pending {
	color: #FF9500;
}

.order-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.order-title {
	font-size: 15px;
	color: #333;
}

.order-amount {
	font-size: 16px;
	font-weight: 500;
	color: #333;
}

.order-footer {
	display: flex;
	justify-content: space-between;
	color: #8E8E93;
	font-size: 12px;
}

.no-data {
	text-align: center;
	color: #8E8E93;
	padding: 30px 0;
}
</style>
