<template>
	<view class="grade">
		<view class="bar">
			<u-navbar bgColor="rgba(255, 255, 255, 0.0)">
				<view slot="left" class="left" @click="goBack">
					<image src="../../static/image/travel/ranking/headLeft.png">
				</view>
				<view slot="center" class="center">
					<text>我的等级</text>
				</view>
				<view slot="right" class="right" @tap="showModal" data-target="Modal">
					<text>等级说明</text>
				</view>
			</u-navbar>
		</view>
		<view class="top">
			<image class="line" src="../../static/image/travel/ranking/arc.png">
			<view class="num">
				<view>
					<image src="../../static/image/travel/ranking/grade.png">
					<p style="font-size: 10px;">Lv.{{levelfirst}}</p>
				</view>
				<view>
					<image src="../../static/image/travel/ranking/grade.png">
					<text>Lv.{{level}}</text>
				</view>
				<view>
					<image src="../../static/image/travel/ranking/grade.png">
					<p style="font-size: 10px;">Lv.{{levellast}}</p>
				</view>
			</view>
			<view class="numerical">
				<view class="experience">
					<text class="pre">当前经验值：</text>
					<text class="expNum">{{jingyan}}</text>
				</view>
			</view>
		</view>
		<view class="cont">
			
			<view class="experience2">
				<text class="title">经验值：{{jingyan}}</text>
				<u-line-progress :percentage="percentage" activeColor="#3cc9a4" :showText="false" height="36rpx"></u-line-progress>
				
				<view class="number">
				  <text>Lv.{{level}}</text>
				  <text>距离下一等级还差{{postflowExp}}经验</text>
				  <text>Lv.{{levellast}}</text>
				</view>
				
			</view>
			
			<view class="experience">
				
			<text class="title">已连续签到{{ leiji }}天</text>
			<br>
			
			<view class="gift">
				<view class="item" v-for="(item,index) in dayList" :key="index">
					<view :class="{'special': index < leiji}">
						<view class="tn-icon-money" :class="[index < leiji ? 'tn-color-white' : 'tn-color-grey', 'icon-large']" style="font-size: 48rpx;"></view>
					</view>
					<text :style="index < leiji ? 'color: #333333;' : 'color: #999999;'">+{{item.jy}}</text>
				</view>
			</view>
			<br>
			<view class="gift">
				<view class="item" v-for="(item,index) in dayList" :key="index">
					<view :class="{'special': index < leiji}">
						<view class="tn-icon-platform" :class="[index < leiji ? 'tn-color-white' : 'tn-color-grey', 'icon-large']" style="font-size: 48rpx;"></view>
					</view>
					<text :style="index < leiji ? 'color: #333333;' : 'color: #999999;'">+{{item.exp}}</text>
				</view>
			</view>
			<view class="button-group">
			  <view class="button" @tap="qiandao()">
			    <text>立即签到</text>
			  </view>
			</view>
			</view>
			
			
			<view class="cu-modal" :class="modalName=='Modal'?'show':''" style="padding: 15px 15px;">
				<view class="cu-dialog" style="border-radius: 15px">
					<view class="cu-bar bg-white justify-end" style="background: white;">
						<view class="content">等级说明</view>
						
				</view>
					<view class="padding text-left" style="background: white;" v-html="jingyantext">
					
					</view>
					<view class="padding text-center" style="background: white;">
						<tn-button style="margin-left: 20rpx;" backgroundColor="#3cc9a4" fontColor="#fff" @tap="hideModal">好的</tn-button>
					</view>
					
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
			modalName: null,
			userInfo:null,
			uid:0,
			currentLevel2: 0,
			nextLevelExp2: 0,
			remainingExp2: 0,
			allExp: 0,
			levelfirst: 0,
			leiji: 0,
			continuous: 0,
			jingyan: 0,
			percentage:0,
			token:"",
			level: 0,
			levellast: 0,
			jingyantext:"",
			overflowExp: 0,
			 tempArr: [],
			postflowExp: 0,
			dayList: [
				{ state: 0, jy: 0, exp: 0 },
				{ state: 0, jy: 0, exp: 0 },
				{ state: 0, jy: 0, exp: 0 },
				{ state: 0, jy: 0, exp: 0 },
				{ state: 0, jy: 0, exp: 0 },
				{ state: 0, jy: 0, exp: 0 },
				{ state: 0, jy: 0, exp: 0 }
			]
		}
	},

	created() {
	  var that = this;
	  uni.$on('refreshPage', () => {
	      this.getContinuous();
		  this.percent();
		  
	    });
	  
	},
	onShow(){
		
				var that = this;
				this.userStatus();
				// #ifdef APP-PLUS
				uni.hideTabBar({
					animation: false
				})
				
				plus.navigator.setStatusBarStyle("dark")
				// #endif
				if(localStorage.getItem('userinfo')){
				
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				
				that.uid = that.userInfo.uid;
				}else{
					that.userInfo =null;
				}
				this.getqdjl();
				
			},
	
			onLoad() {
				var that = this;
				if(localStorage.getItem('token')){
					that.token = localStorage.getItem('token');
				}else{
					that.token = "";
				}
				this.userStatus();
				
				
				// #ifdef APP-PLUS || MP
				that.NavBar = this.CustomBar;
				// #endif
				
			},
	mounted() {
	this.userStatus();
	  this.getContinuous();
	  
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
				that.jingyantext = res.data.jingyantext;
				  
		         
		        },
		        fail(error) {
		          console.log(error);
		        }
		      })
		},
		userStatus() {
			var that = this;
			var token = "";
			if(localStorage.getItem('token')){
				token = localStorage.getItem('token');
			}
			that.$Net.request({
				
				url: that.$API.userStatus(),
				data:{
					"token":token
				},
				header:{
					'Content-Type':'application/x-www-form-urlencoded'
				},
				method: "get",
				dataType: 'json',
				success: function(res) {
					if(res.data.code==0){
						that.jingyan = 0;
					}else{
						
						if(localStorage.getItem('userinfo')){
							
							var userInfo = JSON.parse(localStorage.getItem('userinfo'));
							if(userInfo.screenName){
								that.name = userInfo.screenName;
							}else{
								that.name = userInfo.name;
							}
							if(res.data.data.customize){
								userInfo.customize = res.data.data.customize;
							}
							if(res.data.data.lv){
								userInfo.lv = res.data.data.lv;
							}
							if(res.data.data.isvip){
								userInfo.isvip = res.data.data.isvip;
							}
							if(res.data.data.vip){
								userInfo.vip = res.data.data.vip;
							}
							if(res.data.data.experience){
								userInfo.experience = res.data.data.experience;
								that.jingyan = res.data.data.experience;
								that.percent();
							}
							localStorage.setItem('userinfo',JSON.stringify(userInfo));
							
							
						}else{
							that.jingyan = 0;
							that.percent();
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
		
		showModal(e) {
			this.modalName = e.currentTarget.dataset.target
		},
		hideModal(e) {
			this.modalName = null
		},
		getContinuous() {
		  var that = this;
		  var token = '';
		  if (localStorage.getItem('token')) {
		    token = localStorage.getItem('token');
		  
		  		uni.request({
		  			url:that.$API.SMleiji(),
		  			method:'GET',
		  			data:{
						token:token
		  			},
		  			dataType:"json",
		  			success(res) {
		  				that.leiji = res.data.leiji;
		  			},
		  			fail(error) {
		  			  console.log(error);
		  			}
		  			
		  		})
		  		
		  	}
		},
		getqdjl() {
		  var that = this;
			uni.request({
				url:that.$API.SMqiandaojl(),
				method:'GET',
				dataType:"json",
				success(res) {
					// 更新 dayList 数据
					for(let i = 0; i < 7; i++) {
						that.dayList[i] = {
							jy: res.data ? (res.data[`assets_${i+1}day`] || 0) : 0,
							exp: res.data ? (res.data[`experience_${i+1}day`] || 0) : 0,
							state: i < that.leiji ? 1 : 0  // 根据累计签到天数设置状态
						}
					}
				},
				fail(error) {
					console.log(error);
				}
				
			})
		},
		 goBack() {
				uni.navigateBack({
					delta: 1
				});
		  },
		  torenwu(){
		  	uni.navigateTo({
		  	    url: '/pages/user/renwu'
		  	});
		  },
		
		qiandao(){
			var that = this;
			var token = '';
		  	if (localStorage.getItem('token')) {
		    token = localStorage.getItem('token');
					uni.request({
						url:that.$API.SMqiandao(),
						method:'GET',
						data:{
							token: that.token
						},
						dataType:"json",
						success(res) {
						  uni.showToast({
						    title: res.data.msg,
						    icon: 'none'
						  });
						  localStorage.removeItem('clist');
						  localStorage.removeItem('ctag');
						  that.loadData(); 
						  uni.$emit('refreshPage'); 
						},
						fail() {
						  localStorage.removeItem('clist');
						  localStorage.removeItem('ctag');
						  that.loadData(); 
						  uni.$emit('refreshPage'); 
						  console.log('签到失败');
						}
					})
					
				}
			
		},
		percent(){
			const currentExp = this.jingyan;
			const currentLevel = this.$API.getLever(currentExp);
			const nextLevel = currentLevel + 1;
			const prevLevel = currentLevel - 1;
			const levelExps = this.$API.getLeverExp();
			const currentLevelExp = levelExps[currentLevel];
			const nextLevelExp = levelExps[nextLevel];
			const remainingExp = nextLevelExp - currentExp;
			const allExp = nextLevelExp - currentLevelExp;
			const gainedExp = currentExp - currentLevelExp;
			this.level = currentLevel;
			this.levellast = nextLevel;
			this.levelfirst = prevLevel;
			this.postflowExp = remainingExp;
			this.remainingExp2 = gainedExp;
			this.allExp = allExp;
			this.percentage = Math.floor((gainedExp / allExp) * 100);
		},
		loadData() {
		  var that = this;
		  that.userStatus();
		  that.percent();
		}
	}
}
</script>

<style lang="scss" scoped>
	.grade{
		& text{
			font-family: PingFangSC-Semibold, PingFang SC;
		}
		.bar{
			.left image{
				width: 48rpx;
				height: 48rpx;
			}
			.center text{
				font-size: 32rpx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 44rpx;
			}
			.right{
				width: 148rpx;
				height: 44rpx;
				background: #3cc9a4;
				border-radius: 22rpx 0 0 22rpx;
				border: 2rpx solid #FFFFFF;
				text-align: center;
				margin-right: -34rpx;
				>text{
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					color: #FFFFFF;
					line-height: 44rpx;
				}
			}
		}
		.top{
			width: 750rpx;
			height: 450rpx;
			padding: 0 50rpx;
			border-radius: 0 0 50% 50%/0 0 15% 15%;
			background: linear-gradient(360deg, #44e4ba 0%, #28866b 100%);
			.line{
				width: 100%;
				height: 142rpx;
				margin-top: 88rpx;
			}
			.num{
				display: flex;
				justify-content: center;
				margin-top: -84rpx;
				>view{
					
					width: 144rpx;
					height: 136rpx;
					justify-content: center;
					align-items: center;
					display: flex;
					
					& image{
						width: 144rpx;
						height: 136rpx;
						
					}
					& text{
						font-size: 40rpx;
						font-weight: 600;
						color: #999999;
						line-height: 90rpx;
						text-shadow: 0rpx 2rpx 1rpx rgba(0,0,0,0.0200);
						background: linear-gradient(to bottom right, #ff9326, #df5557);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
						position: absolute;
					}
					& p{
						font-size: 40rpx;
						font-weight: 600;
						color: #999999;
						line-height: 90rpx;
						text-shadow: 0rpx 2rpx 1rpx rgba(0,0,0,0.0200);
						background: linear-gradient(to bottom right, #939393, #414141);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
						position: absolute;
					}
					&:nth-child(2){
						margin: 0 52rpx;
					}
					&:nth-child(1),&:nth-child(3){
						margin-top: -40rpx;
						>image{
							width: 104rpx;
							height: 100rpx;
						}
						>text{
							font-size: 40rpx;
						}
					}
					
				}
			}
			.numerical{
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-top: 24rpx;
				.experience{
					display: flex;
					align-items: center;
					.pre{
						font-size: 28rpx;
						color: #FFFFFF;
						line-height: 40rpx;
					}
					>image{
						width: 36rpx;
						height: 30rpx;
						margin: 0 6rpx;
					}
					.expNum{
						font-size: 36rpx;
						font-weight: 600;
						color: #FFFFFF;
					}
				}
				.differ{
					>text{
						font-size: 20rpx;
						color: #999999;
						line-height: 42rpx;
					}
				}
			}
		}
		.cont{
			padding: 0 40rpx;
			.people{
				width: 100%;
				height: 116rpx;
				background: linear-gradient(90deg, #43e3b9 0%, #3cc9a4 51%, #39bf9b 100%);
				border-radius: 58rpx;
				margin-top: 12rpx;
				padding: 0 36rpx 0 18rpx;
				display: flex;
				align-items: center;
				.image{
					width: 84rpx;
					height: 84rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-right: 20rpx;
					>image{
						width: 84rpx;
						height: 84rpx;
						border-radius: 50%;
					}
					>view{
						width: 92rpx;
						height: 92rpx;
						border-radius: 50%;
						border: 2rpx solid #FFFFFF;
						filter: blur(2rpx);
						position: absolute;
					}
				}
				.text{
					flex: 1;
					display: flex;
					align-items: center;
					>text:first-child{
						font-size: 36rpx;
						font-weight: 600;
						color: #FFFFFF;
						line-height: 50rpx;
						margin-right: 14rpx;
					}
					>text:last-child{
						height: 34rpx;
						background: #BDA3FF;
						border-radius: 17rpx;
						padding: 0 14rpx;
						font-size: 24rpx;
						color: #FFFFFF;
						line-height: 34rpx;
					}
				}
				.money{
					display: flex;
					flex-direction: column;
					>text:first-child{
						font-size: 36rpx;
						font-weight: 600;
						color: #FFFFFF;
						line-height: 50rpx;
					}
					>text:last-child{
						font-size: 24rpx;
						color: #DBCDFF;
						line-height: 34rpx;
					}
				}
			}
			.experience{
				width: 100%;
				height: 600rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				padding: 40rpx 18rpx;
				margin-top: 24rpx;
				.title{
					display: block;
					font-size: 32rpx;
					font-weight: 600;
					color: #333333;
					line-height: 44rpx;
					margin-bottom: 22rpx;
				}
				.number{
					display: flex;
					margin: 22rpx 0 56rpx 0;
					justify-content: space-between;
					>text{
						font-size: 28rpx;
						font-weight: 600;
						color: #000000;
						line-height: 40rpx;
						&:nth-child(2){
							font-size: 28rpx;
							font-weight: 400;
							color: #999999;
							line-height: 40rpx;
						}
					}
				}
				.gift{
					display: flex;
					.item{
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-right: 22rpx;
						>view{
							width: 70rpx;
							height: 70rpx;
							background: #f1f1f1;
							border-radius: 20rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							transition: all 0.8s ease;
							
							&.special {
								background: #3cc9a4;
								transform: scale(1.05);
							}
						}
						>text{
							font-size: 20rpx;
							transition: color 0.8s ease;
							color: #999999;
							line-height: 28rpx;
							margin-top: 4rpx;
						}
					}
				}
				.button-group {
				  display: flex;
				  flex-direction: row;
				  justify-content: space-around;
				}
				.button{
					width: 100%;
					height: 100rpx;
					margin: auto;
					margin-top: 60rpx;
					background: linear-gradient(90deg, #44e9bd 0%, #3cc9a4 100%);
					border-radius: 58rpx;
					text-align: center;
					>text{
						font-size: 32rpx;
						font-weight: 600;
						color: #FFFFFF;
						line-height: 100rpx;
					}
				}
			}
			.experience2{
				width: 100%;
				height: 300rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				padding: 40rpx 18rpx;
				margin-top: 24rpx;
				.title{
					display: block;
					font-size: 32rpx;
					font-weight: 600;
					color: #333333;
					line-height: 44rpx;
					margin-bottom: 22rpx;
				}
				.number{
					display: flex;
					margin: 22rpx 0 56rpx 0;
					justify-content: space-between;
					>text{
						font-size: 28rpx;
						font-weight: 600;
						color: #000000;
						line-height: 40rpx;
						&:nth-child(2){
							font-size: 28rpx;
							font-weight: 400;
							color: #999999;
							line-height: 40rpx;
						}
					}
				}
			}
			.task{
				width: 100%;
				height: 630rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				margin-top: 24rpx;
				padding: 40rpx 30rpx 0 20rpx;
				display: flex;
				flex-direction: column;
				.title{
					font-size: 32rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #333333;
					line-height: 44rpx;
				}
				.text{
					font-size: 24rpx;
					color: #999999;
					line-height: 34rpx;
					margin: 6rpx 0 22rpx 0;
				}
				.list{
					display: flex;
					justify-content: space-between;
					margin-bottom: 74rpx;
					>view{
						width: 92rpx;
						height: 116rpx;
						background: linear-gradient(90deg, #41dbb2 0%, #3cc9a4 100%);
						border-radius: 6rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						>image{
							width: 58rpx;
							height: 56rpx;
						}
						>text{
							font-size: 20rpx;
							color: #FFFFFF;
							line-height: 28rpx;
							margin-top: 6rpx;
						}
					}
				}
				.invitation{
					.item{
						display: flex;
						align-items: center;
						margin-bottom: 36rpx;
						.icon{
							width: 84rpx;
							height: 84rpx;
							border-radius: 50%;
							background: #F5F1FF;
							display: flex;
							justify-content: center;
							align-items: center;
							margin-right: 14rpx;
							>image{
								width: 60rpx;
								height: 60rpx;
							}
						}
						.cent{
							flex: 1;
							display: flex;
							flex-direction: column;
							>text:first-child{
								font-size: 28rpx;
								color: #333333;
								line-height: 40rpx;
							}
							>text:last-child{
								font-size: 24rpx;
								color: #999999;
								line-height: 34rpx;
							}
						}
						.complete{
							width: 122rpx;
							height: 52rpx;
							background: linear-gradient(90deg, #43e2b8 0%, #3cc9a4 100%);
							border-radius: 58rpx;
							text-align: center;
							>text{
								font-size: 24rpx;
								font-weight: 600;
								color: #FFFFFF;
								line-height: 52rpx;
							}
						}
					}
				}
			}
		}
	}
</style>