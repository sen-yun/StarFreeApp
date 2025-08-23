<template>
	<view class="user" :style="{'background-color':'#f6f6f6','min-height':'auto'}">
		<view class="header" :style="[{height:CustomBar*2 + 25 + 'rpx'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar*2 + 25 + 'rpx','padding-top':StatusBar*2 + 25 + 'rpx'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar*2 + 25 + 'rpx'}]">
					<view class="section-sub" style="line-height: 30px;">
						<text style="font-size:30upx">评论详情</text>
					</view>

				</view>
				<view class="action info-btn">
					<text class="tn-icon-more-vertical header-icon" @tap="popup()"></text>
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view v-if="isLoading2==1">
		<tn-popup v-model="show" mode="bottom" :zIndex="500" :closeBtn="true" height="35%" :borderRadius="20">
			<view class="center-container">
				<view class="">
					<block v-if="mainComment.userInfo && (mainComment.userInfo.uid==uid||group=='administrator')">
						
						<view class="tn-padding-sm tn-radius bg-flex-shadow popup-content sy-text-lg"
							@tap="deleteComment(mainComment.id,'main')">
							<text class="tn-icon-delete" style="margin-right: 5px;"></text>删除评论
						</view>
					</block>
					<block v-if="mainComment.userInfo && (group=='administrator'||group=='editor')">
						<view class="tn-padding-sm tn-radius bg-flex-shadow popup-content sy-text-lg"
							@tap="toBan(mainComment.userInfo.uid)">
							<text class="tn-icon-prohibit" style="margin-right: 5px;"></text>封禁用户
						</view>
					</block>

				</view>
			</view>
		</tn-popup>
		<view class="comment-container">
			<view class="comment-item" v-if="mainComment && mainComment.userInfo">
				<view class="comment-header" @tap="toUserInfo(mainComment.userInfo)">
					<view class="user-info-box">
						<u-avatar :src="mainComment.userInfo.avatar" size="70"></u-avatar>
						<view class="user-detail">
							<view class="username">
								<text>{{mainComment.userInfo.name}}</text>
								
							</view>
							<view class="comment-time">
								<text>{{formatDate(mainComment.created)}}</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="comment-content">
					<view v-if="mainComment.type === 'score'" class="score-display">
						<tn-rate
							v-model="mainComment.scoreNum"
							:count="5"
							:allowHalf="true"
							:disabled="true"
							:size="32"
							activeColor="#57d1b1"
							inactiveColor="#cecece"
							activeIcon="star-fill"
							inactiveIcon="star"
							:gutter="10"
						></tn-rate>
						<text class="score-text">{{mainComment.score}}分</text>
					</view>
					<view class="comment-text">{{mainComment.text}}</view>
					<view class="pic-box" v-if="mainComment.pic">
						<template>
							<view v-if="mainComment.pic.split('||').length === 1" class="single-pic">
								<u-image :src="mainComment.pic.split('||')[0]" 
									@tap="previewImage(mainComment.pic.split('||'), mainComment.pic.split('||')[0])"
									width="250rpx" height="300rpx" 
									:fade="true" duration="450"
									border-radius="12rpx">
									<u-loading slot="loading"></u-loading>
								</u-image>
							</view>
							<view v-else class="grid-pic">
								<u-image v-for="(pic, picIndex) in mainComment.pic.split('||').slice(0, 6)"
									:key="picIndex" :src="pic"
									@tap="previewImage(mainComment.pic.split('||'), pic)"
									width="200rpx" height="200rpx"
									:fade="true" duration="450"
									border-radius="12rpx">
									<u-loading slot="loading"></u-loading>
								</u-image>
							</view>
						</template>
					</view>
				</view>
				
				<view class="comment-actions" style="display: flex; justify-content: space-between; align-items: center;">
					<view class="filter-bar">
						<view class="filter-item" @tap="toggleOrder">
							<text>{{orderText}}</text>
							<text class="tn-icon-down"></text>
						</view>
					</view>
					
					<view style="display: flex; align-items: center;">
						
						
						<view class="action-item" v-if="mainComment.userInfo" @tap="showCommentsAdd('', mainComment.userInfo.name, mainComment.id)">
							<u-icon name="chat" size="32" color="#666"></u-icon>
							<text>回复</text>
						</view>
						<view class="action-item" @tap="handleLike(mainComment)">
							<u-icon :name="mainComment.is_liked ? 'thumb-up-fill' : 'thumb-up'" size="32" :color="mainComment.is_liked ? '#57d1b1' : '#666'"></u-icon>
							<text :class="{'liked': mainComment.is_liked}">{{mainComment.like_count || 0}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="replies-list">
				<view v-if="replyList.length === 0" class="no-replies">
					暂无回复，快来抢沙发吧~
				</view>
				<view v-else v-for="(reply, index) in replyList" :key="reply.id" class="reply-item">
					<view class="reply-header" v-if="reply.userInfo">
						<view class="user-info-box">
							<u-avatar :src="reply.userInfo.avatar" size="70" @tap="toUserInfo(reply.userInfo)"></u-avatar>
							<view class="user-detail">
								<view class="username">
									<template v-if="reply.touid != 0 && reply.replyTo">
										<text @tap="toUserInfo(reply.userInfo)">{{reply.userInfo.name}}</text>
										<text class="reply-to tn-icon-right-triangle"></text>
										<text @tap="toUserInfo(reply.replyTo)">{{reply.replyTo.name}}</text>
									</template>
									<template v-else>
										<text @tap="toUserInfo(reply.userInfo)">{{reply.userInfo.name}}</text>
									</template>
									
								</view>
								<view class="comment-time">
									<text>{{formatDate(reply.created)}}</text>
									</view>
							</view>
						</view>
					</view>
					<view class="reply-header" v-else>
						<view class="user-info-box">
							<u-avatar src="/static/default-avatar.png" size="70"></u-avatar>
							<view class="user-detail">
								<view class="username">
									<text>用户信息加载中...</text>
								</view>
								<view class="comment-time">
									<text>{{formatDate(reply.created)}}</text>
								</view>
							</view>
						</view>
					</view>
					
					<view class="reply-content">
						<view class="reply-text">{{reply.text}}</view>
						
						<view class="pic-box" v-if="reply.pic">
							<template>
								<view v-if="reply.pic.split('||').length === 1" class="single-pic">
									<u-image :src="reply.pic.split('||')[0]" 
										@tap="previewImage(reply.pic.split('||'), reply.pic.split('||')[0])"
										width="250rpx" height="300rpx" 
										:fade="true" duration="450"
										border-radius="12rpx">
										<u-loading slot="loading"></u-loading>
									</u-image>
								</view>
								<view v-else class="grid-pic">
									<u-image v-for="(pic, picIndex) in reply.pic.split('||').slice(0, 6)"
										:key="picIndex" :src="pic"
										@tap="previewImage(reply.pic.split('||'), pic)"
										width="200rpx" height="200rpx"
										:fade="true" duration="450"
										border-radius="12rpx">
										<u-loading slot="loading"></u-loading>
									</u-image>
								</view>
							</template>
						</view>
					</view>
					
					<view class="reply-actions" v-if="reply.userInfo">
						<view class="action-item" v-if="reply.userInfo.uid==uid||group=='administrator'" @tap="deleteComment(reply.id,'nomain')">
							<u-icon name="delete" size="32" color="#666"></u-icon>
							<text>删除</text>
						</view>
						<view class="action-item" @tap="showCommentsAdd('', reply.userInfo.name, reply.id)">
							<u-icon name="chat" size="32" color="#666"></u-icon>
							<text>回复</text>
						</view>
						<view class="action-item" @tap="handleLike(reply)">
							<u-icon :name="reply.is_liked ? 'thumb-up-fill' : 'thumb-up'" size="32" :color="reply.is_liked ? '#57d1b1' : '#666'"></u-icon>
							<text :class="{'liked': reply.is_liked}">{{reply.like_count || 0}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="load-more" v-if="replyList.length > 0">
				<text>{{moreText}}</text>
			</view>
		</view>
		
		<u-picker
			v-model="showOrderPicker"
			:show="showOrderPicker"
			mode="selector"
			:range="orderColumns"
			range-key="text"
			@confirm="confirmOrder"
			@cancel="cancelOrder"
			title="排序方式"
		></u-picker>
		
		
		<u-popup :style="{'background-color':'#f6f6f6'}"  :bgColor="'#f6f6f6'" :customStyle="{'background-color':'#f6f6f6'}" v-model="commentsAdd" mode="bottom" height="64%" z-index="999" border-radius="40">
			<view :style="{'background-color':'#f6f6f6'}">
				<form>
					<view class="cu-form-group">
						<textarea maxlength="5000" :adjust-position="false" :placeholder="coTitle" v-model="pltext"
							placeholder-class="textarea-placeholder"></textarea>
					</view>
					<view class="pl-tool-box">
						<view class="pl-tool-box-2">
							<view class="pl-tool">
								<text class="tn-icon-image" @tap="upimgf()"></text>
							</view>
						</view>
						<view>
							<tn-button @tap="commentsadd" blockTime class="pl-btn" height="54rpx" padding="0 22rpx" :plain="true"
								:border="true" shape="round" :backgroundColor="'none'">
								发送
							</tn-button>
						</view>
					</view>
					<view style="padding: 10rpx 30rpx;border-top: 1px solid #eee;">
						<block v-if="upimg">
							<u-upload ref="uUpload" :del-bg-color="'#00000080'" :show-progress="true" :action="uploadUrl"
								:form-data="{token: token}" :max-count="9" :auto-upload="true" :before-upload="beforeUpload"
								@on-success="handleSuccess" @on-remove="handleRemove" @on-uploaded="alluploaded"
								@on-choose-complete="choosecomplet" />
						</block>
					</view>
				</form>
				<view :style="{'background-color':'#f6f6f6', 'height':'900rpx'}"></view>
			</view>
		</u-popup>
		</view>
		<view class="loading" v-if="isLoading2==0">
			<view class="loading-main">
				<image src="../../../static/loading.gif"></image>
			</view>
		</view>
	</view>
</template>

<script>
import {
		localStorage
	} from '../../../js_sdk/mp-storage/mp-storage/index.js'
	export default {
	data() {
		return {
			StatusBar: this.StatusBar,
			CustomBar: this.CustomBar,
			NavBar: this.StatusBar + this.CustomBar,
			scrollTop: 0,
			commentId: 0, // 评论ID
			appId: 0, // 应用ID
			mainComment: null, // 主评论数据
			replyList: [], // 回复列表
			page: 1, // 当前页码
			limit:10, // 每页数量
			hasMore: true, // 是否还有更多数据
			isLoading: false, // 是否正在加载
			moreText: "加载更多",
			orderBy: 'desc', // 排序方式
			showOrderPicker: false,
			orderColumns: [
				{ text: '最新回复', value: 'desc' },
				{ text: '最早回复', value: 'asc' }
			],
			commentsAdd: false,
			pltext: "",
			coTitle: "",
			show: false,
			upimg: false,
			userInfo: null,
			uid: 0,
			pic: "",
			token: "",
			group: "",
			uploadUrl: this.$API.upload(),
			chooesed: false,
			uploaded: false,
			submitStatus: false,
			isLoading2: 0,
			currentReplyId: 0, // 当前回复的评论ID
		}
	},
	
	computed: {
		orderText() {
			return this.orderBy === 'desc' ? '最新回复' : '最早回复'
		}
	},
	
	onLoad(options) {
		if (localStorage.getItem('userinfo')) {

			this.userInfo = JSON.parse(localStorage.getItem('userinfo'));
			this.uid = this.userInfo.uid
			
		}else{
			this.userInfo = null;
			this.uid = 0;
		}
		if (localStorage.getItem('token')) {

			this.token = localStorage.getItem('token');
		}
		this.userStatus();
		if (options.id) {
			this.commentId = parseInt(options.id)
			this.appId = parseInt(options.aid || 0)
			this.getMainComment()
			this.getReplyList()
		}
	},
	onShow() {
		if (localStorage.getItem('userinfo')) {
		
			this.userInfo = JSON.parse(localStorage.getItem('userinfo'));
			this.uid = this.userInfo.uid
			
		}else{
			this.userInfo = null;
			this.uid = 0;
		}
		if (localStorage.getItem('token')) {
		
			this.token = localStorage.getItem('token');
		}
	},
	onPullDownRefresh(){
		var that = this;
		that.page = 1;
		if(that.appId!=0&&that.commentId!=0){
			that.getMainComment()
			that.getReplyList()
			
		}
		var timer = setTimeout(function() {
			
			uni.stopPullDownRefresh();
		}, 1000)
	},
	onReachBottom() {
		if (this.hasMore && !this.isLoading) {
			this.loadMore()
		}
	},
	
	methods: {
		userStatus() {
				var that = this;
				that.$Net.request({

					url: that.$API.userStatus(),
					data: {
						"token": that.token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							that.group = res.data.data.groupKey; // 保存用户组信息
							that.uid = res.data.data.uid;
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "支付接口配置异常",
							icon: 'none'
						})
					}
				})
			},
		toBan(uid) {
				uni.navigateTo({
					url: '/pages/manage/banuser?uid=' + uid
				});
			},
		popup(){
			this.show = true;
		},
		back() {
			uni.navigateBack()
		},
		toUserInfo(data) {
			var that = this;
			var name = data.name;
			var title = data.name + "的信息";
			if (data.screenName) {
				title = data.screenName + " 的信息";
				name = data.screenName
			}
			var id = data.uid;
			var type = "user";
			uni.navigateTo({
				url: '/pages/contents/userinfo?title=' + title + "&name=" + name + "&uid=" + id + "&avatar=" +
					encodeURIComponent(data.avatar)
			});
		},
		// 获取主评论
		getMainComment() {
			const params = {
				action: 'getScoreList',
				plugin: 'sy_appbox',
				getscore_aid: this.appId,
				getscore_if: JSON.stringify({ id: this.commentId })
			}
			
			this.$Net.request({
				url: this.$API.PluginLoad('sy_appbox'),
				data: params,
				method: 'GET',
				success: (res) => {
					if (res.data.code === 200 && res.data.data.comments.length > 0) {
						this.mainComment = {
							...res.data.data.comments[0],
							scoreNum: Number(res.data.data.comments[0].score)
						}
					}
					this.isLoading2 = 1;
				}
			})
		},
		
		// 获取回复列表
		getReplyList(isLoadMore = false) {
			if (this.isLoading) return
			this.isLoading = true
			
			const params = {
				action: 'getScoreReplies',
				plugin: 'sy_appbox',
				getreply_id: this.commentId,
				getreply_page: this.page,
				getreply_limit: this.limit,
				getreply_orderby: this.orderBy
			}
			
			// console.log('Request params:', params)
			
			this.$Net.request({
				url: this.$API.PluginLoad('sy_appbox'),
				data: params,
				method: 'GET',
				success: (res) => {
					// console.log('Response:', res)
					if (res.data.code === 200) {
						const { replies, total } = res.data.data
						
						if (isLoadMore) {
							this.replyList = [...this.replyList, ...replies]
						} else {
							this.replyList = replies
						}
						
						this.hasMore = this.replyList.length < total
						this.moreText = this.hasMore ? '加载更多' : '没有更多了'
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'none'
						})
					}
                    this.isLoading = false
					this.isLoading2 = 1;
					uni.stopPullDownRefresh()
				},
			})
		},
		
		// 加载更多
		loadMore() {
			if (!this.hasMore || this.isLoading) return
			this.page++
			this.moreText = "正在加载..."
			this.getReplyList(true)
		},
		
		// 切换排序方式
		toggleOrder() {
			this.showOrderPicker = true
		},
		
		// 确认排序方式
		confirmOrder(e) {
			const value = this.orderColumns[e].value
			if (value !== this.orderBy) {
				this.orderBy = value
				this.page = 1
				this.hasMore = true
				this.replyList = []
				this.getReplyList()
			}
			this.showOrderPicker = false
		},
		
		cancelOrder() {
			this.showOrderPicker = false
		},
		
		// 预览图片
		previewImage(imageList, image) {
			uni.previewImage({
				urls: imageList,
				current: image
			})
		},
		
		// 格式化时间
		formatDate(timestamp) {
			const date = new Date(timestamp * 1000)
			const now = new Date()
			const diff = now - date
			
			if (diff < 60000) {
				return '刚刚'
			}
			if (diff < 3600000) {
				return Math.floor(diff / 60000) + '分钟前'
			}
			if (diff < 86400000) {
				return Math.floor(diff / 3600000) + '小时前'
			}
			if (diff < 2592000000) {
				return Math.floor(diff / 86400000) + '天前'
			}
			
			const year = date.getFullYear()
			const month = (date.getMonth() + 1).toString().padStart(2, '0')
			const day = date.getDate().toString().padStart(2, '0')
			return `${year}-${month}-${day}`
		},
		
		getLv(i) {
			if(!i) i = 0
			return this.$API.getLever(i)
		},
		
		getLocal(local) {
			if (local && local != '') {
				const local_arr = local.split("|")
				if (!local_arr[3] || local_arr[3] == 0) {
					return local_arr[2]
				} else {
					return local_arr[3]
				}
			}
			return "未知"
		},
		
		// 处理回复
		handleReply(item) {
			// 实现回复功能
		},
		
		// 处理点赞
		
		upimgf() {
			this.upimg = true;
		},

		beforeUpload(index, list) {
			return true;
		},

		handleRemove(index) {
			let urls = this.pic.split('||');
			if (index >= 0 && index < urls.length) {
				urls.splice(index, 1);
				this.pic = urls.join('||');
			}
		},

		handleSuccess(data, index, lists) {
			if (data.code === 1) {
				const url = data.data.url;
				this.pic += (this.pic ? '||' : '') + url;
			} else {
				uni.showToast({
					title: data.msg,
					icon: 'none',
				});
			}
		},

		alluploaded(lists, name) {
			setTimeout(function() {
				uni.hideLoading();
			}, 500);
			uni.showToast({
				title: '上传完成',
				icon: 'success',
				duration: 1000,
			});
			this.uploaded = true;
		},

		choosecomplet(lists, name) {
			this.uploaded = false;
			this.chooesed = true;
		},

		showCommentsAdd(type, author, commentId) {
			if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
				uni.showToast({
					title: "请先登录",
					icon: 'none'
				});
				uni.navigateTo({
					url: '/pages/user/login'
				});
				return false;
			}

			this.commentsAdd = true;
			this.coTitle = "回复：@" + author;
			this.currentReplyId = commentId;
			this.pltext = ''; // 清空输入框
			this.pic = ''; // 清空图片
			this.upimg = false;
		},

		commentsadd() {
			if (this.submitStatus) return;
			if (!this.pltext.trim()) {
				uni.showToast({
					title: '请输入评论内容',
					icon: 'none'
				});
				return;
			}
			
			this.submitStatus = true;
			
			this.$Net.request({
				url: this.$API.PluginLoad('sy_appbox'),
				data: {
					action: 'scoreAdd',
					plugin: 'sy_appbox',
					token: this.token,
					aid: this.appId,
					text: this.pltext,
					type: 'discuss',
					reply_id: this.currentReplyId,
					pics: this.pic || ''
				},
				success: (res) => {
					if (res.data.code === 200) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
						this.commentsAdd = false;
						this.pltext = '';
						this.pic = '';
						this.upimg = false;
						
						// 刷新评论列表
						this.page = 1;
						this.replyList = [];
						this.getReplyList();
					} else {
						uni.showToast({
							title: res.data.msg || '评论失败',
							icon: 'none'
						});
					}
					this.submitStatus = false;
				},
				fail: () => {
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
					this.submitStatus = false;
				},
			});
		},

		// 删除评论
		deleteComment(id,type) {
			if (!localStorage.getItem('token')) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				uni.navigateTo({
					url: '/pages/user/login'
				});
				return;
			}

			uni.showModal({
				title: '提示',
				content: '确定要删除该评论吗？',
				success: (res) => {
					if (res.confirm) {
						this.$Net.request({
							url: this.$API.PluginLoad('sy_appbox'),
							data: {
								action: 'deleteScore',
								delete_id: id,
								token: localStorage.getItem('token')
							},
							method: 'GET',
							success: (res) => {
								if (res.data.code === 200) {
									uni.showToast({
										title: '删除成功',
										icon: 'success'
									});
									// 刷新评论列表
									this.page = 1;
									this.replyList = [];
									if(type=='main'){
										this.back()
									}else{
										this.getReplyList();
									}
									
								} else {
									uni.showToast({
										title: res.data.msg || '删除失败',
										icon: 'none'
									});
								}
							},
							fail: () => {
								uni.showToast({
									title: '网络错误，请稍后重试',
									icon: 'none'
								});
							}
						});
					}
				}
			});
		},

		handleLike(comment) {
			if (!localStorage.getItem('token')) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				uni.navigateTo({
					url: '/pages/user/login'
				});
				return;
			}

			this.$Net.request({
				url: this.$API.PluginLoad('sy_appbox'),
				data: {
					action: 'scoreLike',
					plugin: 'sy_appbox',
					token: this.token,
					aid: this.appId,
					score_id: comment.id
				},
				success: (res) => {
					if (res.data.code === 200) {
						comment.is_liked = !comment.is_liked;
						if (comment.is_liked) {
							comment.like_count = (comment.like_count || 0) + 1;
						} else {
							comment.like_count = (comment.like_count || 0) - 1;
						}
					} else {
						uni.showToast({
							title: res.data.msg || '点赞失败',
							icon: 'none'
						});
					}
				},
				fail: () => {
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
				},
			});
		},
	}
}
</script>

<style lang="scss" scoped>
.comment-time {
	font-size: 24rpx;
	color: #999;
	margin-top: 6rpx;
}
.comment-container {
	padding: 20rpx;
	background: #fff;
	
	.comment-item {
		padding: 30rpx 0;
		position: relative;
		
		&:after {
			content: none;
		}
		
		.comment-header {
			.user-info-box {
				display: flex;
				align-items: flex-start;
				
				.user-detail {
					flex: 1;
					margin-left: 20rpx;
					
					.username {
						display: flex;
						align-items: center;
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
						
						image {
							margin-left: 12rpx;
						}
					}
					
					.comment-time {
						font-size: 24rpx;
						color: #999;
						margin-top: 8rpx;
					}
				}
			}
		}
		
		.comment-content {
			margin: 20rpx 0 0 90rpx;
			
			.score-display {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;
				
				.score-text {
					margin-left: 16rpx;
					color: #57d1b1;
					font-weight: 500;
				}
			}
			
			.comment-text {
				font-size: 28rpx;
				line-height: 1.6;
				color: #333;
			}
		}
	}
	
	.filter-bar {
		padding: 20rpx 0;
		margin: 20rpx 0;
		position: relative;
		
		.filter-item {
			position: relative;
			display: inline-flex;
			align-items: center;
			font-size: 28rpx;
			color: #666;
			
			.tn-icon-down {
				margin-left: 6rpx;
				font-size: 24rpx;
				color: #999;
			}
		}
	}
	
	.replies-list {
		position: relative;
		
		.no-replies {
			text-align: center;
			padding: 60rpx 0;
			color: #999;
			font-size: 28rpx;
		}
		
		.reply-item {
			padding: 30rpx 0;
			position: relative;
			
			
			&:last-child:after {
				display: none;
			}
			
			.reply-header {
				.user-info-box {
					display: flex;
					align-items: flex-start;
					
					.user-detail {
						flex: 1;
						margin-left: 20rpx;
						
						.username {
							display: flex;
							align-items: center;
							font-size: 28rpx;
							color: #333;
							
							.reply-to {
								margin: 0 10rpx;
								color: #999;
								font-size: 24rpx;
							}
						}
					}
				}
			}
			
			.reply-content {
				margin: 16rpx 0 0 90rpx;
				
				.reply-text {
					font-size: 28rpx;
					line-height: 1.6;
					color: #333;
				}
			}
		}
	}
	
	.pic-box {
		margin-top: 20rpx;
		
		.single-pic {
			width: 400rpx;
			border-radius: 12rpx;
			overflow: hidden;
		}
		
		.grid-pic {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 12rpx;
			
			image {
				width: 100%;
				height: 200rpx;
				border-radius: 8rpx;
				object-fit: cover;
			}
		}
	}
	
	.comment-actions,
	.reply-actions {
		display: flex;
		justify-content: flex-end;
		margin: 16rpx 0 0 90rpx;
		
		.action-item {
			display: flex;
			align-items: center;
			margin-left: 40rpx;
			
			text {
				font-size: 26rpx;
				color: #666;
				margin-left: 8rpx;
				
				&.liked {
					color: #57d1b1;
				}
			}
			
			&:active {
				opacity: 0.8;
			}
		}
	}
	
	.load-more {
		text-align: center;
		padding: 30rpx 0;
		color: #999;
		font-size: 26rpx;
	}
}

.header {
	position: fixed;
	width: 100%;
	z-index: 9999;
	background: #fff;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	
	.cu-bar {
		min-height: 0;
		
		.content {
			text-align: center;
			font-size: 32rpx;
			font-weight: 500;
		}
	}
}

/* 评论输入框样式优化 */
.cu-form-group {
	background-color: #ffffff;
	padding: 20rpx;
	
	textarea {
		background-color: #f8f8f8;
		border-radius: 16rpx;
		padding: 20rpx;
		width: 100%;
		min-height: 200rpx;
		font-size: 28rpx;
	}
}

.pl-tool-box {
	display: flex;
	padding: 20rpx 32rpx;
	align-items: center;
	justify-content: space-between;
	border-top: 1px solid #f5f5f5;
}

.pl-tool-box-2 {
	display: flex;
	align-items: center;
}

.pl-tool {
	font-size: 44rpx;
	color: #666;
	margin-right: 30rpx;
}

.pl-btn {
	font-size: 28rpx;
	height: 64rpx;
	line-height: 60rpx;
	padding: 0 40rpx;
	border: 2px solid #57d1b1;
	color: #57d1b1;
	border-radius: 32rpx;
	
	&:active {
		opacity: 0.8;
	}
}

.info-footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 99;
	background: #fff;
	padding: 16rpx 24rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
	
	.info-input-box {
		flex: 1;
		height: 72rpx;
		background: #f5f5f5;
		border-radius: 36rpx;
		padding: 0 30rpx;
		margin-right: 20rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	.info-footer-btn {
		padding: 0 20rpx;
		
		text {
			font-size: 44rpx;
			color: #666;
			margin-left: 30rpx;
		}
	}
}

.textarea-placeholder {
	color: #999;
	font-size: 28rpx;
}
.center-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		margin-top: 80rpx;
	}

</style> 