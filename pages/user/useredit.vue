<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					个人设置
				</view>
				<!--  #ifdef H5 || APP-PLUS -->
				<view class="action" @tap="userEdit">
					<button class="cu-btn round bg-blue">保存</button>
				</view>
				<!--  #endif -->
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		
		<form>
			<view class="user-edit-header margin-top">
				<image :src="avatar"></image>
				<!--  #ifdef H5 || APP-PLUS -->
				<!-- <text class="cu-btn bg-blue radius" @tap="showModal" data-target="DialogModal1">设置头像</text> -->
				<text class="cu-btn bg-gradual-blue radius" @tap="toAvatar" >设置头像</text>
				<!--  #endif -->
			</view>
			<view class="cu-form-group">
			<view class="title">背景</view>
			<input :placeholder="ifurl==true ? '已更新' : '个人页的背景封面'" @tap="upload" name="input" disabled></input>
			<text class="text-blue" @tap="upload">上传</text>
			</view>
			<view class="cu-form-group">
				<view class="title">账号</view>
				<input name="input" disabled="disabled" :value="name"></input>
			</view>
			
			
			<view class="cu-form-group margin-top">
				<view class="title">昵称</view>
				<input placeholder="请输入昵称" name="input" v-model="screenName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">邮箱</view>
				<input placeholder="未设置" disabled="disabled" name="input" :value="mail"></input>
				<view class="text-blue" @tap="toEmail">修改</view>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">个人简介</view>
				<textarea v-model="introduce"  placeholder="输入个人简介"></textarea>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">密码</view>
				<input placeholder="请输入密码,不填则不修改" v-model="password" name="input"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">确认密码</view>
				<input placeholder="请再次输入密码" v-model="repassword" name="input"></input>
			</view>
		</form>
		<!--  #ifdef H5 || APP-PLUS -->

		<!--  #endif -->
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">设置头像</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl text-left">
					<view>Gravatar是全球最大的头像库。它广泛应用于国内外各类网站和程序，包括知名的Github。在Gravatar通过您的邮箱注册用户，并设置头像后，您在所有支持Gravatar的网站使用邮箱，都会显示您的头像。</view>
					<view>或者，您可以将将邮箱设置成QQ邮箱，将自动获取您的QQ头像。</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn bg-green margin-left" @tap="toGravatar">前往Gravatar</button>
		
					</view>
				</view>
			</view>
		</view>
		<!--  #ifdef MP -->
		<view class="post-update bg-blue" @tap="userEdit">
			<text class="cuIcon-upload"></text>
		</view>
		<!--  #endif -->
	</view>
</template>

<script>
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	// #ifdef H5 || APP-PLUS 
	import { pathToBase64, base64ToPath } from '../../js_sdk/mmmm-image-tools/index.js'
	// #endif
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
			AppStyle:this.$store.state.AppStyle,
				ifurl:false,
				uid:0,
				name:'',
				screenName:'',
				password:'',
				repassword:'',
				mail:'',
				userBg:"",
				avatar:"",
				avatarNew:"",
				introduce:"",
				backif:0,
				modalName: null,
				
				token:'',
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
			
			that.getCacheInfo();
			
			if(localStorage.getItem('toAvatar')){
				var toAvatar = JSON.parse(localStorage.getItem('toAvatar'));
				that.avatarUpload(toAvatar.dataUrl);
			}else{
				console.log("没有头像缓存")
			}
			
		},
		onLoad(res) {
			var that = this;
			that.backif = res.backif;
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
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			getCacheInfo(){
				var that = this;
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					that.uid=userInfo.uid;
					that.screenName=userInfo.screenName;
					that.name=userInfo.name;
					that.mail=userInfo.mail;
					that.userBg=userInfo.userBg;
					that.token=userInfo.token;
					that.avatar=userInfo.avatar;
					that.introduce = userInfo.introduce;
				}
			},
			userEditbh() {
				var that = this;
				if (that.password != "") {
					if (that.password != that.repassword) {
						uni.showToast({
						    title:"两次密码不一致",
							icon:'none',
							duration: 1000,
							position:'bottom',
						});
						return false
					}
					
				}
				
				
				var data = {
					uid:that.uid,
					name:that.name,
					screenName:that.screenName,
					password:that.password,
					introduce:that.introduce,
					userBg:that.userBg,
				}
				if(that.avatarNew!=''){
					data.avatar = that.avatarNew;
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.userEdit(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res))
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: '背景图已更新',
							icon: 'success'
						})
						if(res.data.code==1){
							//保存用户信息
							if(that.password!=""){
								localStorage.removeItem('userinfo');
								localStorage.removeItem('token');
								var timer = setTimeout(function() {
									uni.reLaunch({
										url: '/pages/home/home'
									})
									clearTimeout('timer')
								}, 1000)
							}else{
								var userInfo = JSON.parse(localStorage.getItem('userinfo'));
								userInfo.screenName=that.screenName;
								userInfo.userBg=that.userBg;
								userInfo.introduce = that.introduce;
								if(that.avatarNew!=''){
									userInfo.avatar = that.avatarNew;
								}
								that.avatarNew = '';
								localStorage.setItem('userinfo',JSON.stringify(userInfo));
								that.getCacheInfo();
							}
							
						}
						if(that.backif==1){
							that.back();
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
						uni.stopPullDownRefresh()
					}
				})
			},
			userEdit() {
				var that = this;
				if (that.password != "") {
					if (that.password != that.repassword) {
						uni.showToast({
						    title:"两次密码不一致",
							icon:'none',
							duration: 1000,
							position:'bottom',
						});
						return false
					}
					
				}
				
				var data = {
					uid:that.uid,
					name:that.name,
					screenName:that.screenName,
					password:that.password,
					introduce:that.introduce,
					userBg:that.userBg,
				}
				if(that.avatarNew!=''){
					data.avatar = that.avatarNew;
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.userEdit(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
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
							//保存用户信息
							if(that.password!=""){
								localStorage.removeItem('userinfo');
								localStorage.removeItem('token');
								var timer = setTimeout(function() {
									uni.reLaunch({
										url: '/pages/home/home'
									})
									clearTimeout('timer')
								}, 1000)
							}else{
								var userInfo = JSON.parse(localStorage.getItem('userinfo'));
								userInfo.screenName=that.screenName;
								userInfo.userBg=that.userBg;
								userInfo.introduce = that.introduce;
								if(that.avatarNew!=''){
									userInfo.avatar = that.avatarNew;
								}
								that.avatarNew = '';
								localStorage.setItem('userinfo',JSON.stringify(userInfo));
								that.getCacheInfo();
							}
							
						}
						if(that.backif==1){
							that.back();
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
						uni.stopPullDownRefresh()
					}
				})
				
			},
			upload() {
			  let that = this
			  uni.chooseImage({
			    count: 1,
			    sourceType: ['album', 'camera'],
			    sizeType: ['compressed'],
			    crop: {
			      width: 470,
			      height: 270,
			      quality: 90
			    },
			    success: function(res) {
			      const tempFilePaths = res.tempFilePaths;
			      uni.showLoading({
			        title: "加载中"
			      });
			      const uploadTask = uni.uploadFile({
			        url: that.$API.upload(),
			        filePath: tempFilePaths[0],
			        name: 'file',
			        formData: {
			          'token': that.token
			        },
			        success: function(uploadFileRes) {
			          var data = JSON.parse(uploadFileRes.data);
			          uni.showToast({
			            title: data.msg,
			            icon: 'none'
			          })
			          if (data.code == 1) {
			            that.userBg = data.data.url;
						that.ifurl = true
						that.userEditbh();
			          }
			        },
			        fail: function() {
			          setTimeout(function() {
			            uni.hideLoading();
			          }, 1000);
			        }
			      });
			    },
			    fail: function() {
			      setTimeout(function() {
			        uni.hideLoading();
			      }, 1000);
			    }
			  })
			},
			toEmail(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/user/mailedit'
				});
			},
			toAddress(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/user/address'
				});
			},
			toPay(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/user/pay'
				});
			},
			toBind(){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/user/userbind'
				});
			},
			toGravatar(){
				var that = this;
				that.hideModal();
				var url = "https://cn.gravatar.com/";
				// #ifdef APP-PLUS
				plus.runtime.openURL(url) 
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			toAvatar(){
				// #ifdef APP-PLUS || H5
				const that = this;
				  uni.navigateTo({
					url: "../../uni_modules/buuug7-img-cropper/pages/cropper",
					events: {
					  imgCropped(event) {
						console.log(event);
					  },
					},
				  });
				// #endif
			},
			avatarUpload(base64){
				
				var that = this;
				base64ToPath(base64)
				  .then(path => {
					var file = path;
					const uploadTask = uni.uploadFile({
					  url : that.$API.upload(),
					  filePath:file,
					 //  header: {
						// "Content-Type": "multipart/form-data",
					 // },
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
							
							
							if(data.code==1){
								// uni.showToast({
								// 	title: data.msg,
								// 	icon: 'none'
								// })
								that.avatar = data.data.url;
								that.avatarNew = data.data.url;
								localStorage.removeItem('toAvatar');
								that.userEdit();
								//console.log(that.avatar)
								
							}else{
								uni.showToast({
									title: "头像上传失败，请检查接口",
									icon: 'none'
								})
							}
						},fail:function(){
							setTimeout(function () {
								uni.hideLoading();
							}, 1000);
						}
						
					   
					});
				  })
				  .catch(error => {
					console.error("失败"+error)
				  })
			}
		}
	}
</script>

<style>
</style>
