<template>
	<view>
		<view class="header gpt-header" :style="[{height:CustomBar + 'px'}]" :class="scrollTop>40?'goScroll':''">
			<view class="cu-bar" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}" >
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<text class="text-bold">{{name}}</text>
				</view>
				<view class="action">
					<view class="cu-avatar round" :style="avatarstyle" v-if="avatarstyle!=''"></view>
					<view class="cu-avatar round" v-else>
						<text class="home-noLogin"></text>
					</view>
				</view>
			</view>
		</view>
		
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="gpt-bg">
			<image src="./style/gpt-bg.png"></image>
		</view>
		<view class="gpt-app-info">
			<view class="data-box">
				<view class="cu-bar bg-white">
					<view class="action data-box-title">
						<text class="cuIcon-titles text-rule"></text>内容输入
					</view>
					
					<view class="action">
						<template v-if="isWaiting==0">
							<text class="cu-btn sm bg-blue radius" @tap="sendText()">提交</text>
						</template>
						<template v-if="isWaiting==1">
							<text class="cu-btn sm bg-blue radius">提交中...</text>
						</template>
					</view>
				</view>
				<view class="gpt-app-form">
					<view class="gpt-app-form-intro">
						{{intro}}
					</view>
					<view class="gpt-app-form-intro">
						价格：<text class="text-orange">{{price}}</text>{{currencyName}}
					</view>
					<view class="gpt-app-form-input">
						<textarea v-model="text" placeholder="请输入你想要让AI处理的内容" maxlength="1500"></textarea>
					</view>
				</view>
				
			</view>
			<view class="data-box">
				<view class="cu-bar bg-white">
					<view class="action data-box-title">
						<text class="cuIcon-titles text-rule"></text>AI输出
					</view>
					<view class="action">
						<text class="text-blue" @tap="ToCopy(aiMsg)">复制结果</text>
					</view>
					
				</view>
				<view class="gpt-app-form">
					<view class="gpt-app-form-intro">
						下列为AI的输出结果，可点击按钮复制。
					</view>
					<view class="gpt-app-form-input">
						<!-- <textarea :value="aiMsg" placeholder="等待你的输入" disabled></textarea> -->
						<mp-html :content="aiMsg" :selectable="true" :show-img-menu="true"  :scroll-table="true" :markdown="true"/>
					</view>
				</view>
				
			</view>
		</view>
		
	</view>
</template>

<script>
	import { localStorage } from '@/js_sdk/mp-storage/mp-storage/index.js'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
				AppStyle:this.$store.state.AppStyle,
				name:"未知应用",
				avatar:"",
				price:0,
				intro:"",
				id:0,
				token:'',
				avatarstyle:"",
				aiMsg:"",
				text:"",
				currencyName:"",
				isWaiting:0,
				scrollTop:0,
				
			}
		},
		onPageScroll(res){
			var that = this;
			that.scrollTop = res.scrollTop;
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		onHide() {
			localStorage.removeItem('getuid')
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			//plus.navigator.setStatusBarStyle("dark")
			// #endif
			
			if(localStorage.getItem('getuid')){
				that.toid = localStorage.getItem('getuid');
			}
			
		},
		onLoad(res) {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			uni.request({
				url:that.$API.SMset(),
				method:'GET',
				dataType:"json",
				success(res) {
					that.currencyName = res.data.assetsname;
				},
				fail(error) {
				  console.log(error);
				}
			})
			
			// 获取model_id参数
			if(res.model_id) {
				that.id = res.model_id;
				
				// 设置名称
				if(res.name) {
					that.name = res.name;
				}
				
				that.getGptInfo();
			} else {
				uni.showToast({
					title: "模型ID不存在",
					icon: 'none'
				});
			}
		},
		methods: {
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			getGptInfo(){
				var that = this;
				
				that.$Net.request({
					url: that.$API.PluginLoad('xqy_gpt'),
					data: {
						"plugin": "xqy_gpt",
						"action": "models",
						"id": that.id
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						
						// 兼容两种状态码
						if(res.data.code == 1 || res.data.code == 200){
							var gptInfo = null;
							
							// 处理不同的返回格式
							if(typeof res.data.data === 'object' && res.data.data !== null) {
								// 检查是否有info字段（主要信息在info字段中）
								if(res.data.data.info) {
									gptInfo = res.data.data.info;
								} else {
									// 直接是对象
									gptInfo = res.data.data;
								}
							} else if(Array.isArray(res.data.data) && res.data.data.length > 0) {
								// 是数组，取第一个
								gptInfo = res.data.data[0];
							}
							
							if(gptInfo) {
								that.avatarstyle = "background-image:url("+(gptInfo.avatar)+");"
								that.avatar = gptInfo.avatar;
								that.name = gptInfo.name;
								that.price = gptInfo.price;
								that.intro = gptInfo.intro;
							} else {
								uni.showToast({
									title: "无法获取模型信息",
									icon: 'none'
								});
							}
						} else {
							uni.showToast({
								title: res.data.msg || "获取模型信息失败",
								icon: 'none'
							});
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络连接失败",
							icon: 'none'
						});
					}
				});
			},
			ToCopy(text) {
				var that = this;
				// #ifdef APP-PLUS
				uni.setClipboardData({
					data: text,
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: "复制成功"
						})
					}
				});
				// #endif
				// #ifdef H5 
				let textarea = document.createElement("textarea");
				textarea.value = text;
				textarea.readOnly = "readOnly";
				document.body.appendChild(textarea);
				textarea.select();
				textarea.setSelectionRange(0, text.length) ;
				uni.showToast({ //提示
					title: "复制成功"
				})
				var result = document.execCommand("copy") 
				textarea.remove();
				
				// #endif
			},
			sendText(){
				var that = this;
				var token = "";
				if(that.text==""){
					return false;
				}
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}else{
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					})
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				if(that.text.length>1500){
					uni.showToast({
						title: "最大字符数为1500",
						icon: 'none'
					})
					return false
				}
				
				that.aiMsg = "AI正在思考中..."
				that.isWaiting = 1;
				
				that.$Net.request({
					url: that.$API.PluginLoad('xqy_gpt'),
					data: {
						"plugin": "xqy_gpt",
						"action": "chat",
						"model_id": that.id,
						"message": that.text,
						"token": token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						that.isWaiting = 0;
						
						if(res.data.code == 1 || res.data.code == 200){
							if(res.data.data && res.data.data.response) {
								that.aiMsg = res.data.data.response;
							} else {
								that.aiMsg = "AI 回复解析失败";
								uni.showToast({
									title: "AI回复解析失败",
									icon: 'none'
								});
							}
						} else {
							that.aiMsg = res.data.msg || "请求失败";
							uni.showToast({
								title: res.data.msg || "请求失败",
								icon: 'none'
							});
						}
					},
					fail: function(res) {
						that.isWaiting = 0;
						that.aiMsg = "网络请求失败";
						uni.showToast({
							title: "网络开小差了哦",
							icon: 'none'
						});
					}
				});
			},
		}
	}
</script>

<style>
</style>
