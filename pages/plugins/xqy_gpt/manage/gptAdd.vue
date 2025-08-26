<template>
	<view class="user" :class="$store.state.AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					<block v-if="type=='add'">
						添加大模型
					</block>
					<block v-else>
						大模型修改
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
				<image :src="avatar"></image>
				<!--  #ifdef H5 || APP-PLUS -->
				<!-- <text class="cu-btn bg-blue radius" @tap="showModal" data-target="DialogModal1">设置头像</text> -->
				<text class="cu-btn bg-blue radius" @tap="toAvatar" >设置大模型图标</text>
				<!--  #endif -->
			</view>
			<view class="cu-form-group margin-top"  v-if="type=='edit'">
				<view class="title">ID</view>
				<input name="input" disabled :value="id"></input>
			</view>
		
			<view class="cu-form-group">
				<view class="title">名称</view>
				<input name="input" type="text" v-model="name"></input>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">简介</view>
				<textarea v-model="intro" placeholder="请输入大模型角色简介"></textarea>
			</view>
			<view class="cu-form-group"  v-if="type=='add'">
				<view class="title">类型</view>
				<view class="action">
					<text class="meta-type" :class="gptType==0?'act':''" @tap="gptType=0">聊天大模型</text>
					<text class="meta-type" :class="gptType==1?'act':''" @tap="gptType=1">AI应用</text>
				</view>
			</view>
			
			<view class="cu-form-group align-start">
				<view class="title">Prompt</view>
				<textarea v-model="prompt" maxlength="10000" :placeholder="gptType==1 ? '请输入AI应用Prompt' : '请输入聊天大模型的系统指令，定义AI的行为和回复风格'"></textarea>
			</view>

			<!-- 添加字数统计显示 -->
			<view class="padding-sm text-sm text-grey text-right">
				已输入: {{prompt.length}} / 10000 字符
			</view>

			<!-- 聊天大模型提示说明 -->
			<view class="cu-bar bg-white solid-bottom" v-if="gptType==0">
				<view class="action">
					<text class="cuIcon-info text-blue"></text>
					<text class="text-sm text-blue">提示：系统指令可以定义AI角色和行为</text>
				</view>
			</view>
			<view class="padding bg-white text-sm text-grey" v-if="gptType==0">
				<view>示例1：你是一位专业的程序员，熟悉多种编程语言。请用简洁专业的方式回答问题。</view>
				<view class="margin-top-sm">示例2：你是一位亲切的心理咨询师，善于倾听和提供建议，回答要温和有耐心。</view>
			</view>

			<view class="cu-form-group">
				<view class="title">模型源</view>
				<view class="picker" @tap="showModal" data-target="sourceList">
					{{sourceText}}
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">仅VIP可用</view>
				<switch @change="SwitchVIP" :class="switchVip?'checked':''" :checked="switchVip?true:false"></switch>
			</view>
			<view class="cu-form-group">
				<view class="title">单次请求价格（整数）</view>
				<input name="input" v-model="price" type="Number"></input>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">AI模型名称</view>
				<textarea v-model="model_name" :placeholder="source=='硅基流动' ? '请输入硅基流动平台的AI模型名称，如：deepseek-ai/DeepSeek-R1' : '请输入喵小算平台的AI模型名称，如：deepseek-chat'"></textarea>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">API密钥</view>
				<textarea v-model="api_key" :placeholder="source=='硅基流动' ? '请输入硅基流动平台的API密钥' : '请输入喵小算平台的API密钥'" type="password"></textarea>
				<view class="text-sm text-grey margin-top-xs" v-if="type=='edit' && api_key_original">
					当前已设置API密钥，留空则不修改
				</view>
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
		<view class="cu-modal" :class="modalName=='sourceList'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in sourceList" :key="index">
							<label class="flex justify-between align-center flex-sub" @tap="setSource(item)">
								<view class="flex-sub">{{item.name}}</view>
								<radio class="round" :class="source==item.id?'checked':''" :checked="source==item.id?true:false"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
	</view>
</template>

<script>
	import { localStorage } from '@/js_sdk/mp-storage/mp-storage/index.js'
	// #ifdef H5 || APP-PLUS
	import { pathToBase64, base64ToPath } from '@/js_sdk/mmmm-image-tools/index.js'
	// #endif
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
				AppStyle:this.$store.state.AppStyle,
				token:"",
				id:0,
				name:'',
				avatar:'',
				isVip:0,
				switchVip:false,
				picNew:"",
				price:0,
				intro:'',
				prompt:"",
				gptType:0,
				model_name:'',
				api_key:'',
				api_key_original:'', // 用于标记是否已有API密钥
				source:"喵小算",
				sourceText:"喵小算",
				
				type:"add",
				
				sourceList:[
					{
						'id':"喵小算",
						'name':'喵小算'
					},
					{
						'id':"硅基流动",
						'name':'硅基流动'
					}
				],
				modalName: null,
				
				//数据提交拦截，防止重复提交
				submitStatus:false,
				
				
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
				//console.log("没有图片缓存")
			}
			
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
				if(that.type=="edit"){
					if(res.id){
						that.id = res.id;
						that.getGptInfo(that.id)
					}else{
						uni.showToast({
							title: "无参数访问",
							icon: 'none'
						})
					}
					
				}
			}
			if(that.sourceList.length>0){
				that.setSource(that.sourceList[0]);
			}
		},
		methods: {
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			SwitchVIP(e) {
				this.switchVip = e.detail.value;
				if(this.switchVip){
					this.isVip = 1;
				}else{
					this.isVip = 0;
				}
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
			setSource(data){
				let that = this	
				that.source = data.id;
				that.sourceText = data.name;
				// 切换模型源时清空模型名称和API密钥
				that.model_name = '';
				that.api_key = '';
				that.hideModal();
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
				if(that.submitStatus){
					return false;
				}
				that.submitStatus = true;
				if(that.parent==0){
					uni.showToast({
						title:"未选择大类",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					that.submitStatus = false;
					return false
				}
				if (that.name == "") {
					uni.showToast({
						title:"请输入名称",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					that.submitStatus = false;
					return false
				}
				var data = {
					'plugin': 'xqy_gpt',
					'action': 'saveModel',
					'name': that.name,
					'source': that.source,
					'avatar': that.avatar,
					'intro': that.intro,
					'type': that.gptType,
					'prompt': that.prompt,
					'isVip': that.isVip,
					'price': that.price,
					'model_name': that.model_name,
					'api_key': that.api_key,
					"token": that.token
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					url: that.$API.PluginLoad('xqy_gpt'),
					data: data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						that.submitStatus = false;
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						
						if(res.data && res.data.msg) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: "操作完成",
								icon: 'none'
							})
						}
						
						if(res.data && res.data.code==200){
							var timer = setTimeout(function() {
								that.back();
							}, 1000)
						}
					},
					fail: function(res) {
						that.submitStatus = false;
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络开小差了哦",
							icon: 'none'
						})
						uni.stopPullDownRefresh()
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
				if (that.name == "") {
					uni.showToast({
						title:"请输入名称",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				// 如果API密钥为空且原来有密钥，则使用原密钥
				var api_key_to_send = that.api_key || that.api_key_original;
				var data = {
					'plugin': 'xqy_gpt',
					'action': 'saveModel',
					'id': that.id,
					'name': that.name,
					'source': that.source,
					'avatar': that.avatar,
					'intro': that.intro,
					'type': that.gptType,
					'prompt': that.prompt,
					'isVip': that.isVip,
					'price': that.price,
					'model_name': that.model_name,
					'api_key': api_key_to_send,
					"token": that.token
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					url: that.$API.PluginLoad('xqy_gpt'),
					data: data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						
						if(res.data && res.data.msg) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: "操作完成",
								icon: 'none'
							})
						}
						
						if(res.data && res.data.code==200){
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
							title: "网络开小差了哦",
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
					url: "/uni_modules/buuug7-img-cropper/pages/cropper",
					events: {
					  imgCropped(event) {
						//console.log(event);
					  },
					},
				  });
				// #endif
			},
			getGptInfo(id){
				var that = this;
				var data = {
					"plugin": "xqy_gpt",
					"action": "models",
					"id": id,
					"token": that.token
				}
				
				that.$Net.request({
					url: that.$API.PluginLoad('xqy_gpt'),
					data: data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						if(res.data && res.data.code==200 && res.data.data && res.data.data.info){
							var gptInfo = res.data.data.info;
							that.name = gptInfo.name || '';
							that.source = gptInfo.source || '喵小算';
							that.isVip = gptInfo.isVip || 0;
							if(that.isVip==1){
								that.switchVip = true;
							}else{
								that.switchVip = false;
							}
							that.price = gptInfo.price || 0;
							that.avatar = gptInfo.avatar || '';
						that.intro = gptInfo.intro || '';
						that.model_name = gptInfo.model_name || '';
						// 编辑模式下不显示API密钥，只标记是否已设置
						that.api_key_original = gptInfo.api_key || '';
						that.api_key = ''; // 编辑时不显示原密钥
						that.gptType = gptInfo.type || 0;
						that.prompt = gptInfo.prompt || '';
						} else {
							//console.log("获取模型信息失败：", res.data);
							if(res.data && res.data.msg) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络请求失败",
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>

<style>
</style>
