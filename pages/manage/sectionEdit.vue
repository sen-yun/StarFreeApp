<template>
	<view class="user" :class="$store.state.AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					<block v-if="type=='add'">
						添加分类版块
					</block>
					<block v-else>
						分类版块编辑
					</block>
					
				</view>
				<!--  #ifdef H5 || APP-PLUS -->
				<view class="action" @tap="edit" v-if="type=='edit'">
					<button class="cu-btn round bg-blue">保存</button>
				</view>
				<view class="action" @tap="add" v-if="type=='add'">
					<button class="cu-btn round bg-blue">提交</button>
				</view>
				<!--  #endif -->
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		
		<form>
			<view class="user-edit-header margin-top">
				<image :src="pic"></image>
				<!--  #ifdef H5 || APP-PLUS -->
				<!-- <text class="cu-btn bg-blue radius" @tap="showModal" data-target="DialogModal1">设置头像</text> -->
				<text class="cu-btn bg-blue radius" @tap="toAvatar" >设置版块图标</text>
				<!--  #endif -->
			</view>
			<view class="cu-form-group margin-top"  v-if="type=='edit'">
				<view class="title">MID</view>
				<input name="input" disabled :value="id"></input>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">所在大类</view>
				<input name="input" type="text" :value="sort" disabled="disabled"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">名称</view>
				<input name="input" type="text" v-model="name"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">缩略名</view>
				<input name="input" type="text" v-model="slug" placeholder="用于url生成,建议英文"></input>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">简介</view>
				<textarea v-model="text" placeholder="请输入分类和标签简介"></textarea>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">排序</view>
				<input name="input" type="number" v-model="order" placeholder="数值越大,排序越高"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">发帖权限</view>
				<view class="picker" @tap="showModal" data-target="restrictList">
					{{restrictList[restrict].name}}
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">背景图</view>
				<view class="action">
					<text class="cu-btn bg-blue radius" @tap="imgUpload">上传图片</text>
				</view>
			</view>
			<view class="pay-codeImg" v-if="bg!=''">
				<image :src="bg"></image>
			</view>

		</form>
		<!--  #ifdef MP -->
		<view class="post-update bg-blue" @tap="edit" v-if="type=='edit'">
			<text class="cuIcon-upload"></text>
		</view>
		<view class="post-update bg-blue" @tap="add" v-if="type=='add'">
			<text class="cuIcon-upload"></text>
		</view>
		<!--  #endif -->
		<view class="cu-modal" :class="modalName=='restrictList'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in restrictList" :key="index">
							<label class="flex justify-between align-center flex-sub" @tap="setRestrict(item.id)">
								<view class="flex-sub">{{item.name}}</view>
								<radio class="round" :class="restrict==item.id?'checked':''" :checked="restrict==item.id?true:false"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
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
				token:"",
				sort:"未选择大类",
				parent:0,
				id:0,
				name:'',
				order:1,
				pic:'',
				picNew:"",
				bg:'',
				slug:'',
				text:'',
				restrict:0,
				
				type:"add",
				
				restrictList:[
					{
						'id':0,
						'name':'普通用户'
					},
					{
						'id':1,
						'name':'审核员'
					},
					{
						'id':2,
						'name':'执行员'
					},
					{
						'id':3,
						'name':'小版主'
					},
					{
						'id':4,
						'name':'版主'
					},
					{
						'id':5,
						'name':'大版主'
					}
				],
				modalName: null,
				
			}
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		onShow(){
			var that = this;
			if(localStorage.getItem('toAvatar')){
				var toAvatar = JSON.parse(localStorage.getItem('toAvatar'));
				that.avatarUpload(toAvatar.dataUrl);
			}else{
				console.log("没有图片缓存")
			}
			// #ifdef APP-PLUS
			
			//plus.navigator.setStatusBarStyle("dark")
			// #endif
			
		},
		onLoad(res) {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			if(localStorage.getItem('token')){
				
				that.token = localStorage.getItem('token');
			}
			
			if(res.type){
				that.type = res.type;
			}
			if(res.sort){
				that.sort = res.sort;
			}
			if(res.parent){
				that.parent = res.parent;
			}
			if(res.name){
				that.sort = res.name;
			}
			if(res.id){
				that.id = res.id;
				that.getSectionInfo();
			}
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
			RadioChange(e) {
				this.radio = e.detail.value
			},
			setRestrict(id){
				let that = this	
				that.restrict = id;
				that.hideModal();
			},
			imgUpload(){
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
								that.bg = data.data.url;
								
								
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
								that.pic = data.data.url;
								that.picNew = data.data.url;
								localStorage.removeItem('toAvatar');
								// that.userEdit();
								//console.log(that.avatar)
								
							}else{
								uni.showToast({
									title: "图片上传失败，请检查接口",
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
			},
			add(){
				var that = this;
				if(that.parent==0){
					uni.showToast({
						title:"未选择大类",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				if (that.name == ""||that.order == "") {
					uni.showToast({
						title:"请完成表单填写",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				var data = {
					'name':that.name,
					'order':that.order,
					'parent':that.parent,
					'bg':that.bg,
					'text':that.text,
					'pic':that.pic,
					'slug':that.slug,
					'type':"section",
					"token":that.token,
					"restrict":that.restrict
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.addSection(),
					data:that.$API.removeObjectEmptyKey(data),
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
							var timer = setTimeout(function() {
								that.back();
							}, 1000)
							
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
			getSectionInfo(){
				var that = this;
				that.$Net.request({
					
					url: that.$API.sectionInfo(),
					data:{
						"id":that.id
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.name = res.data.data.name;
							that.order = res.data.data.orderKey;
							that.pic = res.data.data.pic;
							that.picNew = res.data.data.pic;
							that.bg = res.data.data.bg;
							that.slug = res.data.data.slug;
							that.text = res.data.data.text;
							that.restrict = res.data.data.restrictKey;
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
			edit(){
				var that = this;
				if(that.parent==0){
					uni.showToast({
						title:"未选择大类",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				if (that.name == ""||that.order == "") {
					uni.showToast({
						title:"请完成表单填写",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				var data = {
					'id':that.id,
					'name':that.name,
					'order':that.order,
					'parent':that.parent,
					'bg':that.bg,
					'text':that.text,
					'slug':that.slug,
					'pic':that.pic,
					'type':"section",
					"token":that.token,
					"restrict":that.restrict
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.editSection(),
					data:that.$API.removeObjectEmptyKey(data),
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
							var timer = setTimeout(function() {
								that.back();
							}, 1000)
							
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
		}
	}
</script>

<style>
</style>
