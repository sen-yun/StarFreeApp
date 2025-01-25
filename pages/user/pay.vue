<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					提现账户设置
				</view>
				<view class="action" @tap="userEdit">
					<text class="cuIcon-check"></text>
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">账户类型</view>
				<view class="picker" @tap="showModal" data-target="payModal">
					<block v-if="type==''">
						选择账户类型
					</block>
					<block v-else>
						{{type}}
					</block>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">真实姓名</view>
				<input placeholder="请输入真实姓名" name="input" type="text" v-model="realname"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">账户信息</view>
				<input placeholder="请输入账户信息" name="input" type="text" v-model="info"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">收款二维码</view>
				<view class="action">
					<text class="cu-btn bg-blue radius" @tap="upload">上传图片</text>
				</view>
			</view>
			<view class="pay-codeImg" v-if="imgurl!=''">
				<image :src="imgurl"></image>
			</view>
			
		</form>
		<!--  #ifdef MP -->
		<view class="post-update bg-blue" @tap="userEdit">
			<text class="cuIcon-upload"></text>
		</view>
		<!--  #endif -->
		<!--分类选择控件-->
		<view class="cu-modal" :class="modalName=='payModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in payList" :key="index" @tap="toPay(item.name)" >
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{item.name}}</view>
								<radio class="round"></radio>
							</label>
						</view>
					</view>
				</radio-group>
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
				
				uid:0,
				payList:[
					{
					"name":"支付宝",
					},
					{
					"name":"WeChat",
					}
				],
				type:"",
				realname:"",
				info:"",
				
				token:'',
				userInfo:"",
				
				
				modalName:"",
				
				imgurl:"",
				
				isLoading:0,
			}
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			if(localStorage.getItem('token')){
				
				that.token = localStorage.getItem('token');
			}
			that.userStatus();
			that.getCacheInfo();
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
		},
		methods: {
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			PickerChange(e) {
				this.index = e.detail.value
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal() {
				this.modalName = null
			},
			toPay(name){
				var that = this;
				that.type = name;
				that.hideModal();
			},
			getCacheInfo(){
				var that = this;
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					that.uid=userInfo.uid;
					that.userInfo = userInfo;
				}
			},
			userEdit() {
				var that = this;
				if(that.type==""||that.realname==""||that.info==""||that.imgurl==""){
					uni.showToast({
						title: "请完成表单输入",
						icon: 'none'
					})
					return false;
				}
				var pay = that.type+"|"+that.realname+"|"+that.info+"|"+that.imgurl;
				var data = {
					uid:that.uid,
					name:that.userInfo.name,
					pay:pay
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.userEdit(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token":that.token,
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res))
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if(res.data.code==1){
							uni.showToast({
								title: "操作成功！",
								icon: 'none'
							})
							setTimeout(function () {
								that.back();
							}, 1000);
							
							
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
						uni.stopPullDownRefresh()
					}
				})
			},
			upload(){
				let that = this				
				uni.chooseImage({
					count: 1,  // 最多可以选择的图片张数，默认9
					sourceType: ['album', 'camera'], 
				    success: function (res) {						
						uni.showLoading({
							title: "加载中"
						});
						const tempFilePaths = res.tempFilePaths;
						const uploadTask = uni.uploadFile({
						  url : that.$API.upload(),
						  filePath: tempFilePaths[0],
						  name: 'file',
						  formData: {
						   'token': that.token
						  },
						  success: function (uploadFileRes) {
							  setTimeout(function () {
							  	uni.hideLoading();
							  }, 1000);
							var data = JSON.parse(uploadFileRes.data);
							//var data = uploadFileRes.data;
							uni.showToast({
								title: data.msg,
								icon: 'none'
							})
							if(data.code==1){
								that.imgurl = data.data.url;
							}
							},fail:function(){
								setTimeout(function () {
									uni.hideLoading();
								}, 1000);
							}
							
						   
						});
					 
						uploadTask.onProgressUpdate(function (res) {
						  
						 });
					}
				})
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
							var pay = res.data.data.pay;
							if(pay){
								var arr = pay.split("|");
								that.type=arr[0];
								that.realname=arr[1];
								that.info=arr[2];
								that.imgurl=arr[3];
							}
							
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
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
.user {
  min-height: 100vh;
  background-color: #f8f8f8;
  
  .header {
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
    .cu-bar {
      .content {
        font-size: 32rpx;
      }
    }
  }
  
  .cu-form-group {
    margin: 20rpx 30rpx;
    border-radius: 12rpx;
    background-color: #ffffff;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
    
    .title {
      font-size: 28rpx;
      color: #333333;
    }
    
    input {
      font-size: 28rpx;
    }
    
    .picker {
      font-size: 28rpx;
      color: #666666;
    }
    
    .cu-btn {
      padding: 0 30rpx;
      height: 64rpx;
      font-size: 26rpx;
      background: #3cc9a4;
      
      &:active {
        background: #2fad8b;
      }
    }
  }
  
  .pay-codeImg {
    margin: 30rpx;
    padding: 20rpx;
    background-color: #ffffff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
    
    image {
      width: 100%;
      height: 400rpx;
      border-radius: 8rpx;
    }
  }
  
  .cu-modal {
    .cu-dialog {
      border-radius: 16rpx;
      
      .cu-list {
        .cu-item {
          padding: 24rpx 30rpx;
          
          label {
            font-size: 28rpx;
          }
        }
      }
    }
  }
  
  .post-update {
    position: fixed;
    right: 40rpx;
    bottom: 120rpx;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(74,137,220,0.3);
    
    .cuIcon-upload {
      color: #ffffff;
      font-size: 40rpx;
    }
  }
}
</style>
