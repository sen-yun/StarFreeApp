<template>
	<view class="page-container">
		<view class="gpt-bg">
			<view class="bg-gradient"></view>
		</view>
		
		<view class="header gpt-header" :style="[{height:CustomBar + 'px'}]" :class="[scrollTop>40?'goScroll':'']">
			<view class="cu-bar" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}" >
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<text class="text-bold">{{name}}</text>
				</view>
				<view class="action">
					<view class="cu-avatar round"  @tap="showModal" data-target="chatInfo" :style="avatarstyle" v-if="avatarstyle!=''"></view>
					<view class="cu-avatar round" v-else>
						<text class="home-noLogin"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-chat cu-chat-gpt" >
			<view class="cu-item"  :style="[{padding:NavBar + 'px 0px 0px 0px'}]"></view>
			<!-- <view class="more-msg">
				<text class="text-blue" @tap="loadMore">{{moreText}}</text>
			</view> -->
			<view class="gpt-nodata-info" v-if="msgList.length==0">
				<view class="gpt-nodata-info-ico">
					<view class="ai-icon"></view>
				</view>
				<view class="gpt-nodata-info-tips">
					欢迎使用AI聊天功能，您可以按如下方式询问。
				</view>
				<view class="gpt-nodata-info-box">
					<view class="gpt-nodata-info-main" @tap="msg='我要怎么克服拖延症？'">
						我要怎么克服拖延症？
					</view>
				</view>
				<view class="gpt-nodata-info-box">
					<view class="gpt-nodata-info-main" @tap="msg='请帮我写一个关于秋天的故事。'">
						请帮我写一个关于秋天的故事。
					</view>
				</view>
				<view class="gpt-nodata-info-box">
					<view class="gpt-nodata-info-main" @tap="msg='怎么用javascript实现随机数生成？'">
						怎么用javascript实现随机数生成？
					</view>
				</view>
			</view>
			<view class="cu-info gpt-cu-info" v-if="msgList.length>0">
				聊天窗口消息仅显示最新的100条，可在历史记录中查询之前的消息
				
			</view>
			<block v-for="(item,index) in msgList" :key="index">
				<!-- #ifndef APP-PLUS -->
				<view class="cu-item " :class="item.type==0 || item.isAI==0?'self':''">
					<view class="cu-avatar radius" v-if="item.type==1 || item.isAI==1" :style="'background-image:url('+(item.gptJson ? item.gptJson.avatar : item.userJson.avatar)+');'"></view>
					<view class="main">
						<view class="content shadow break-all gpt-content" :class="[item.type==0 || item.isAI==0?'bg-blue light':'']">
						<mp-html :content="item.text" :selectable="true" :show-img-menu="true" :scroll-table="true" :markdown="true"/>
					</view>
					</view>
					<view class="cu-avatar radius" v-if="item.type==0 || item.isAI==0" :style="'background-image:url('+item.userJson.avatar+');'"></view>
					<view class="date">
					{{formatDate(item.created)}}
					</view>
				</view>
				<!-- #endif -->
				
				<!-- #ifdef APP-PLUS -->
				<view class="cu-item app-chat-item" :class="item.type==0 || item.isAI==0?'self':''">
					<view class="cu-avatar radius app-avatar" v-if="item.type==1 || item.isAI==1" :style="'background-image:url('+(item.gptJson ? item.gptJson.avatar : item.userJson.avatar)+');'"></view>
					<view class="main">
						<view class="content shadow break-all gpt-content" :class="[item.type==0 || item.isAI==0?'bg-blue light':'']">
						<mp-html :content="item.text" :selectable="true" :show-img-menu="true" :scroll-table="true" :markdown="true"/>
					</view>
					</view>
					<view class="cu-avatar radius app-avatar" v-if="item.type==0 || item.isAI==0" :style="'background-image:url('+item.userJson.avatar+');'"></view>
					<view class="date">
					{{formatDate(item.created)}}
					</view>
				</view>
				<!-- #endif -->
			</block>
			<view class="cu-item" v-if="isWaiting==1">
				<view class="main">
					<view class="content shadow break-all">
						AI正在思考中...
					</view>
				</view>
			</view>
		</view>

		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<template v-if="isWaiting==0">
				<!-- <input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"></input> -->
				 
				 <textarea class="msg-input" :adjust-position="false" :focus="false" maxlength="-1" auto-height :placeholder="'当前AI单次请求消耗'+price+currencyName"
				 @focus="InputFocus" @blur="InputBlur" v-model="msg"/>
				<button class="cu-btn bg-blue light" @tap="sendMsg()">发送</button>
			</template>
			
			<template v-if="isWaiting==1">
				<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10" placeholder="AI正在思考..."></input>
				<button class="cu-btn bg-blue light">等待</button>
			</template>
		</view>
		<view class="cu-modal" :class="modalName=='chatInfo'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar justify-end bg-white">
					<view class="content"><text class="text-bold">{{name}}</text>
					</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
					<view class="user-edit-header">
						<image :src="avatar"></image>
						<view class="gpt-tips-intro">{{intro}}</view>
											
					</view>
					
				<view class="cu-bar justify-center bg-white">
					<view class="action">
							<button class="cu-btn bg-blue light" @tap="goHistory()">历史消息</button>
							<button class="cu-btn bg-red margin-left" @tap="gptChatDelete()">重置聊天</button>
					</view>
				</view>
			</view>
		</view>
		<!--加载遮罩-->
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="style/loading.gif"></image>
			</view>
		</view>
		<!--加载遮罩结束-->
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
				InputBottom: 0,
				id:0,
				name:"未知大模型",
				moreText:"获取更多",
				isWaiting:0,
				toid:0,
				avatar:"",
				userInfo:null,
				token:"",
				avatarstyle:"",
				msg:"",
				page:1,
				
				msgList:[],
				uid:"",
				
				msgLoading:null,
				lastTime:0,
				
				group:"",
				
				
				modalName:"",
				lastid:0,
				
				isLoading: true,
				
				price:"",
				intro:"",
				currencyName:"",
				
				scrollTop: 0,
				
				model_id: 0, // 模型ID
				name: 'AI助手', // 模型名称
				avatar: '', // AI头像
				
				isDisabled: false, // 禁用发送按钮
				gpt: {
					id: 0,
					name: "AI助手",
					model_name: "",
					model_id: "",
					api_key: "",
					source: "喵小算",
					welcome: "",
					tips: "",
					system: "",
					status: 1
				},
				chatBg: "",
				msgContent: "",
				statusBarHeight: 0,
				windowHeight: 0,
				showNoLoginTip: false,
				sending: false
			};
		},
		onPageScroll(res){
			var that = this;
			that.scrollTop = res.scrollTop;
		},
		onShow() {
			var that = this
			if(localStorage.getItem('userinfo')){
				
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.uid = that.userInfo.uid;
				that.group = that.userInfo.group;
			}
		},
		onReachBottom() {
		    //触底后执行的方法，比如无限加载之类的
			var that = this;
			//到底部后，重新变成第一页，开始加载数据
			that.page = 1;
		},
		onBackPress() {
			var that = this
			
		},
		onUnload() {
			var that = this
			
		},
		onLoad(options) {
			let that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			
			//console.log("页面加载参数:", options);
			
			// 初始化页面
			uni.showLoading({
				title: '加载中...'
			});
			
			// 获取系统设置
			uni.request({
				url: that.$API.SMset(),
				method: 'GET',
				dataType: "json",
				success(res) {
					that.currencyName = res.data.assetsname;
				},
				fail(error) {
					console.error("获取系统设置失败:", error);
				}
			});
			
			// 获取参数 - 支持id或model_id参数
			if(options.id) {
				that.id = options.id;
			} else if(options.model_id) {
				that.id = options.model_id;
			}
			
			// 设置名称 (如果提供)
			if(options.name) {
				that.name = options.name;
			}
			
			//console.log("使用模型ID:", that.id, "名称:", that.name);
			
			// 如果有ID则获取信息
			if(that.id) {
				// 获取GPT信息
				that.getGptInfo();
				// 获取聊天记录
				that.getMsgList();
				
				// 隐藏加载
				that.isLoading = 1;
			} else {
				console.error("未提供有效的模型ID");
				uni.hideLoading();
				uni.showToast({
					title: '未提供有效的模型ID',
					icon: 'none'
				});
			}
			
			// #ifdef APP-PLUS
			uni.onKeyboardHeightChange(res => {
				if (res.height == 0) {
					that.InputBottom = 0;
				} else {
					that.InputBottom = res.height;
				}
			});
			// #endif
			
			// 页面加载后滚动到底部
			setTimeout(() => {
				uni.hideLoading();
				uni.pageScrollTo({
					duration: 0,
					scrollTop: 99999999
				});
			}, 300);
		},
		methods: {
			back(){
				var that = this;
				clearInterval(that.msgLoading);
				that.msgLoading = null
				uni.navigateBack({
					delta: 1
				});
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
			InputFocus(e) {
				this.isOwO = false;
				this.InputBottom = e.detail.height;
			},
			InputBlur(e) {
				this.InputBottom = 0;
			},
			previewImage(image) {
				var imgArr = [];
				imgArr.push(image);
				//预览图片
				uni.previewImage({
					urls: imgArr,
					current: imgArr[0]
				});
			},
			getMsgList(){
				let that = this;
				var token = "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				
				that.$Net.request({
					url: that.$API.PluginLoad('xqy_gpt'),
					data: {
						"plugin": "xqy_gpt",
						"action": "history",
						"model_id": that.id,
						"limit": 100,
						"scene": "chat",
						"isAI": -1, // 显式设置为-1，确保返回所有消息类型
						"token": token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						uni.stopPullDownRefresh();
						that.isLoad = 0;
						//console.log("历史消息API响应:", JSON.stringify(res.data));
						
						// 兼容两种代码格式
						if(res.data.code == 1 || res.data.code == 200){
							var list = [];
							
							// 处理不同返回格式
							if(res.data.data && Array.isArray(res.data.data)) {
								list = res.data.data;
							} else if(res.data.data && res.data.data.list && Array.isArray(res.data.data.list)) {
								list = res.data.data.list;
							}
							
							if(list.length > 0) {
								// 服务器已经按时间戳排序，保持原有顺序
								that.msgList = list;
								
								// 确保消息格式正确
								that.msgList = that.msgList.filter(item => {
									// 添加默认值，防止页面出错
									item.isAI = item.isAI || (item.type == 1 ? 1 : 0);
									
									// 过滤掉空消息
									if(item.isAI == 1 && (!item.text || item.text.trim() === '')) {
										return false;
									}
									
									// 确保用户和AI信息完整
									if(item.isAI == 1){
										if(!item.gptJson) {
											item.gptJson = {
												avatar: that.avatar || "/static/admin/images/ai.png",
												name: that.name || "AI助手"
											};
										}
									} else {
										item.userJson = item.userJson || {};
										if(!item.userJson.avatar && that.userInfo) {
											item.userJson.avatar = that.userInfo.avatar || "/static/user/avatar.png";
										}
										if(!item.userJson.nickname && that.userInfo) {
											item.userJson.nickname = that.userInfo.nickname || that.userInfo.name || "用户";
										}
									}
									
									return true;
								});
								
								//console.log("处理后的消息列表:", that.msgList);
							} else {
								//console.log("没有历史消息记录");
							}
						} else {
							console.error("获取历史消息失败:", res.data.msg);
							uni.showToast({
								title: res.data.msg || "获取历史消息失败",
								icon: 'none'
							});
						}
						
						that.isLoading = 1;
						setTimeout(() => {
							uni.pageScrollTo({
								duration: 0,
								scrollTop: 99999999
							});
						}, 200);
					},
					fail: function(err) {
						uni.stopPullDownRefresh();
						that.isLoad = 0;
						that.isLoading = 1;
						console.error("获取消息列表失败:", err);
						uni.showToast({
							title: "网络连接失败，请稍后重试",
							icon: 'none'
						});
					}
				});
			},
			getGptInfo(){
				let that = this;
				//console.log("获取模型信息，ID:", that.id);
				
				that.$Net.request({
					url: that.$API.PluginLoad('xqy_gpt'),
					data: {
						"plugin": "xqy_gpt",
						"action": "models",
						"id": that.id
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						//console.log("模型信息响应:", JSON.stringify(res.data));
						
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
								console.error("无法解析模型信息");
								uni.showToast({
									title: "无法获取模型信息",
									icon: 'none'
								});
							}
						} else {
							console.error("获取模型信息失败:", res.data.msg);
							uni.showToast({
								title: res.data.msg || "获取模型信息失败",
								icon: 'none'
							});
						}
					},
					fail: function(err) {
						console.error("获取GPT信息失败:", err);
						uni.showToast({
							title: "网络连接失败，请稍后再试",
							icon: 'none'
						});
					}
				});
			},
			sendMsg() {
				let that = this;
				
				if(that.msg == ""){
					return false;
				}
				
				if(that.msg.length > 1500){
					uni.showToast({
						title: "最大字符数为1500",
						icon: 'none'
					})
					return false;
				}
				
				// 检查用户登录状态
				if(!localStorage.getItem('userinfo') || localStorage.getItem('userinfo')==""){
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					});
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.uid = that.userInfo.uid;
				var token = that.userInfo.token;
				
				var curtime = Date.parse(new Date());
				var msg = {
					"created": curtime / 1000,
					"text": that.msg,
					"isAI": 0,
					"type": 0,
					"uid": that.uid,
					"userJson": {
						avatar: that.userInfo.avatar,
						nickname: that.userInfo.nickname || that.userInfo.name
					}
				};
				that.msgList.push(msg);
				
				setTimeout(() => {
					uni.pageScrollTo({
						duration: 0,
						scrollTop: 99999999
					});
				}, 100);
				
				var sendContent = that.msg;
				that.msg = "";
				
				that.isWaiting = 1;
				
				that.$Net.request({
					url: that.$API.PluginLoad('xqy_gpt'),
					data: {
						"plugin": "xqy_gpt",
						"action": "chat",
						"model_id": that.id,
						"message": sendContent,
						"token": token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						that.isWaiting = 0;
						//console.log("聊天API完整响应:", JSON.stringify(res.data));
						
						if(res.data.code == 1 || res.data.code == 200){
							//console.log("API返回数据类型:", typeof res.data.data);
							
							// 处理不同的响应格式
							var responseText = "";
							if(typeof res.data.data === 'string') {
								// 直接是字符串
								responseText = res.data.data;
							} else if(typeof res.data.data === 'object' && res.data.data !== null) {
								// 是对象，尝试获取response字段
								if(res.data.data.response) {
									responseText = res.data.data.response;
								} else {
									// 对象但没有response字段，尝试转为JSON字符串
									responseText = JSON.stringify(res.data.data);
								}
							} else {
								// 其他情况
								responseText = "很抱歉，服务器返回了意外的响应格式，请稍后再试。";
							}
							
							// 检查空响应
							if (!responseText || responseText === "") {
								responseText = "很抱歉，服务器返回了空内容，请稍后再试。";
							}
							
							var msg = {
								"created": Date.parse(new Date()) / 1000,
								"text": responseText,
								"isAI": 1,
								"uid": "ai",
								"userJson": {
									"avatar": that.avatar,
									"nickname": that.name
								}
							};
							that.msgList.push(msg);
							setTimeout(() => {
								uni.pageScrollTo({
									duration: 0,
									scrollTop: 99999999
								});
							}, 200);
						} else {
							// 特别处理余额不足的情况
							if(res.data.code == 402) {
								uni.showModal({
									title: '余额不足',
									content: '您的余额不足，无法使用该模型，请充值后再试',
									showCancel: true,
									confirmText: '去充值',
									success: function(res) {
										if(res.confirm) {
											// 跳转到充值页面
											uni.navigateTo({
												url: '/pages/user/pay'
											});
										}
									}
								});
							} else {
								uni.showToast({
									title: res.data.msg || "请求失败",
									icon: 'none'
								});
							}
							
							// 添加错误消息
							var errorMsg = {
								"created": Date.parse(new Date()) / 1000,
								"text": "很抱歉，我无法回答您的问题。" + (res.data.msg || "发生了一个错误"),
								"isAI": 1,
								"uid": "ai",
								"userJson": {
									"avatar": that.avatar,
									"nickname": that.name
								}
							};
							that.msgList.push(errorMsg);
							
							setTimeout(() => {
								uni.pageScrollTo({
									duration: 0,
									scrollTop: 99999999
								});
							}, 200);
						}
					},
					fail: function(err) {
						that.isWaiting = 0;
						console.error("发送消息失败:", err);
						
						uni.showToast({
							title: "网络开小差了哦",
							icon: 'none'
						});
						
						// 添加错误消息
						var errorMsg = {
							"created": Date.parse(new Date()) / 1000,
							"text": "很抱歉，网络连接失败，请稍后再试。",
							"isAI": 1,
							"uid": "ai",
							"userJson": {
								"avatar": that.avatar,
								"nickname": that.name
							}
						};
						that.msgList.push(errorMsg);
						
						setTimeout(() => {
							uni.pageScrollTo({
								duration: 0,
								scrollTop: 99999999
							});
						}, 200);
					}
				});
			},
			goHistory(){
				var that = this;
				uni.navigateTo({
					url: '/pages/plugins/xqy_gpt/history?id='+that.id+'&name='+that.name
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
			upload(){
				let that = this;
				var token = "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}else{
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					})
					clearInterval(that.msgLoading);
					that.msgLoading = null
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				uni.chooseImage({
					count: 6, 
					sourceType: ['album', 'camera'], 
				    success: function (res) {
						uni.showLoading({
							title: "上传中"
						});
						const tempFilePaths = res.tempFilePaths;
						for(let i = 0;i < tempFilePaths.length; i++) {
							const uploadTask = uni.uploadFile({
							  url : that.$API.upload(),
							  filePath: tempFilePaths[i],
							  name: 'file',
							  formData: {
							   'token': token
							  },
							  success: function (uploadFileRes) {
								  let count = 0;
								  count++;
								  if(count==tempFilePaths.length){
									  setTimeout(function () {
										uni.hideLoading();
									  }, 1000);
								  }
									var data = JSON.parse(uploadFileRes.data);
									//var data = uploadFileRes.data;
									// uni.showToast({
									// 	title: data.msg,
									// 	icon: 'none'
									// })
									if(data.code==1){
										that.sendURL(1,data.data.url);
									}
								},fail:function(){
								}
								
							   
							});
						}
					}
				})
			},
			sendURL(type,url){
				var that = this;
				var token = "";
				if(that.url==""){
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
				
				var data={
					"chatid":that.chatid,
					"token":token,
					"url":url,
					"type":type,
					
				}
				that.$Net.request({
					
					url: that.$API.sendMsg(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.getMsgList();
							that.msg = "";
						}else{
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络开小差了哦",
							icon: 'none'
						})
					}
				})
			},
			markHtml(text){
				var that = this;
				text = that.replaceAll(text,"<","&lt;");
				text = that.replaceAll(text,">","&gt;");
				// #ifdef APP-PLUS || H5
				var owoList=that.owoTextList;
				for(var i in owoList){
				
					if(that.replaceSpecialChar(text).indexOf(owoList[i].data) != -1){
						text = that.replaceAll(that.replaceSpecialChar(text),owoList[i].data,"<img src='/"+owoList[i].icon+"' class='tImg' />")
						
					}
				}
				// #endif
				
				return text;
				
				
			},
			goChatInfo(){
				var that = this;
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
				return text;
			},
			replaceAll(string, search, replace) {
			  return string.split(search).join(replace);
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal() {
				this.modalName = null
			},
			gptChatDelete(){
				let that = this;
				this.modalName = null;
				
				// 检查用户登录状态
				if(!localStorage.getItem('userinfo') || localStorage.getItem('userinfo')==""){
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					});
					return;
				}
				
				var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				var token = userInfo.token;
				
				uni.showModal({
					title: '重置聊天',
					content: '此操作将删除所有消息，并将聊天重置，是否继续？',
					success: function (res) {
						if (res.confirm) {
							uni.showLoading({
								title: "处理中..."
							});
							
							that.$Net.request({
								url: that.$API.PluginLoad('xqy_gpt'),
								data: {
									"plugin": "xqy_gpt",
									"action": "resetChat",
									"model_id": that.id,
									"token": token
								},
								header: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								method: "post",
								dataType: 'json',
								success: function(res) {
									setTimeout(function () {
										uni.hideLoading();
									}, 1000);
									
									//console.log("重置聊天响应:", JSON.stringify(res.data));
									
									// 兼容两种状态码
									if(res.data.code == 1 || res.data.code == 200){
										uni.showToast({
											title: res.data.msg || "重置成功",
											icon: 'success'
										});
										that.back();
									} else {
										uni.showToast({
											title: res.data.msg || "重置失败",
											icon: 'none'
										});
									}
								},
								fail: function(err) {
									setTimeout(function () {
										uni.hideLoading();
									}, 1000);
									
									console.error("重置聊天失败:", err);
									uni.showToast({
										title: "网络连接失败，请稍后再试",
										icon: 'none'
									});
								}
							});
						}
					}
				});
			},
			onImageError(e) {
				console.error('背景图片加载失败:', e);
			},
			onImageLoad(e) {
				//console.log('背景图片加载成功');
			}
		}
	}
</script>

<style>
page{
  padding-bottom: 100upx;
  background-color: transparent;
}

.page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 1;
}
.cu-bar.foot{
	z-index: 998;
}
.gpt-header {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  z-index: 996;
}
.cu-chat-gpt {
  background-color: transparent;
  padding-bottom: 120rpx;
}
.gpt-bg {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: -2;
	background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.bg-gradient {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #e8f4ff; /* 设置背景颜色 */
	background-image: linear-gradient(to bottom, #e8f4ff, #f5f8ff); /* 添加渐变背景 */
	z-index: -1;
}
.gpt-nodata-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40rpx 0;
	width: 100%;
	text-align: center;
}
.cu-chat .cu-item {
	padding: 30rpx 30rpx 70rpx;
	display: flex;
	position: relative;
}

/* 默认样式 */
.cu-chat .cu-item > .main {
	max-width: calc(100% - 260rpx);
	margin: 0 40rpx;
}

/* APP端专用样式 */
/* #ifdef APP-PLUS */
.cu-chat .cu-item > .main {
	max-width: calc(100% - 280rpx);
	margin: 0 30rpx;
}
/* #endif */

.cu-chat .cu-item.self {
	justify-content: flex-end;
	text-align: right;
}

/* 默认头像样式 */
.cu-chat .cu-avatar {
	width: 80rpx;
	height: 80rpx;
	flex-shrink: 0; /* 防止头像被挤压 */
}

/* APP端头像样式优化 */
/* #ifdef APP-PLUS */
.cu-chat .cu-avatar {
	width: 80rpx;
	height: 80rpx;
	flex-shrink: 0;
	margin: 0 10rpx; /* 增加外边距 */
	border: 2rpx solid #eee; /* 添加边框使头像更明显 */
}
/* #endif */

.cu-chat .cu-item > .main .content {
	padding: 20rpx;
	border-radius: 20rpx;
	background-color: rgba(248, 248, 248, 0.9);
	max-width: 100%;
	box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);
	white-space: pre-wrap;
}

/* APP端消息内容优化 */
/* #ifdef APP-PLUS */
.cu-chat .cu-item > .main .content {
	padding: 20rpx;
	border-radius: 20rpx;
	background-color: rgba(248, 248, 248, 0.9);
	max-width: 100%;
	min-width: 80rpx; /* 设置最小宽度 */
	box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);
	white-space: pre-wrap;
}
/* #endif */

.cu-chat .cu-item.self > .main .content {
	background-color: rgba(203, 230, 254, 0.9);
	color: #333;
}
.cu-chat .cu-item .date {
	position: absolute;
	font-size: 24rpx;
	color: #8799a3;
	width: 100%;
	bottom: 20rpx;
	left: 0;
	text-align: center;
}
.gpt-content {
	max-width: 80vw;
	word-break: break-all;
}

/* APP端内容宽度优化 */
/* #ifdef APP-PLUS */
.gpt-content {
	max-width: 70vw; /* 在APP中稍微减小内容宽度 */
	word-break: break-all;
}
/* #endif */

.cu-chat .cu-info {
	display: inline-block;
	padding: 10rpx 20rpx;
	border-radius: 10rpx;
	background-color: rgba(0, 0, 0, 0.1);
	font-size: 24rpx;
	color: #666;
	max-width: 400rpx;
	margin: 20rpx auto;
	text-align: center;
}
.gpt-nodata-info-ico {
	width: 150rpx;
	height: 150rpx;
	margin-bottom: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.ai-icon {
	width: 100rpx;
	height: 100rpx;
	background-color: #0081ff;
	border-radius: 50%;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 8rpx 20rpx rgba(0, 129, 255, 0.3);
	margin: 0 auto;
}
.ai-icon:before {
	content: "AI";
	color: #ffffff;
	font-size: 48rpx;
	font-weight: bold;
}
.gpt-nodata-info-tips {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 30rpx;
}
.gpt-nodata-info-box {
	width: 90%;
	max-width: 600rpx;
	margin: 0 auto 20rpx;
}
.gpt-nodata-info-main {
	background-color: white;
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
	color: #333;
}

/* APP端特定样式 */
/* #ifdef APP-PLUS */
.app-chat-item {
    padding: 30rpx 20rpx 70rpx !important; /* 减少左右内边距 */
}

.app-avatar {
    min-width: 80rpx !important; /* 强制最小宽度 */
    min-height: 80rpx !important; /* 强制最小高度 */
    background-size: cover !important; /* 确保背景图片填充整个区域 */
    background-position: center !important; /* 居中背景图片 */
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1) !important; /* 添加阴影 */
}

/* 优化APP端消息间距 */
.cu-chat .app-chat-item > .main {
    max-width: calc(100% - 240rpx) !important; /* 调整宽度 */
    margin: 0 20rpx !important; /* 减少边距 */
}

/* 确保APP端文本不会挤压头像 */
.app-chat-item .gpt-content {
    max-width: 100% !important;
    margin: 0 !important;
}

/* 修复右对齐时的布局问题 */
.app-chat-item.self {
    justify-content: flex-end !important;
}

/* 优化移动端聊天日期显示 */
.app-chat-item .date {
    font-size: 22rpx !important;
    bottom: 10rpx !important;
}
/* #endif */
</style>

