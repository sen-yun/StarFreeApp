<template>
	<view class="comment-detail-page"
	:style="{'background-color':'#f6f6f6','min-height':'100vh'}">
		<view class="header" :style="[{height:CustomBar*2  + 25 + 'rpx'}]">
			<view class="cu-bar color-black"
		:style="{'height': CustomBar*2 + 25 + 'rpx','padding-top':StatusBar*2 + 25 + 'rpx', 'background-color': '#ffffff'}">
				<view class="action" @tap="back">
					<view>
						<text class="cuIcon-back color-black"></text>
				</view>
				<view class="content text-bold color-black" :style="[{top:StatusBar*2 + 25 + 'rpx'}]">
						书评详情
					</view>
				</view>
			</view>
		</view>
		
		<view :style="[{padding:(NavBar + 20) + 'px 15px 0px 15px'}]"></view>
		
		<view class="content-container">
		<!-- 父级评论 -->
		<view class="parent-comment-section" :style="{'background-color':'#ffffff'}">
			<view class="comment-item">
				<view class="comment-avatar" @tap="toUserInfo(parentComment)">
				<u-image :src="parentComment.userAvatar" width="80rpx" height="80rpx" mode="aspectFill"
					:lazy-load="true" :fade="true" duration="450" border-radius="40rpx">
					<u-loading slot="loading"></u-loading>
				</u-image>
			</view>
				<view class="comment-content">
					<view class="comment-header">
						<text class="comment-username" :style="{'color':'#333'}">{{parentComment.username}}</text>
						<button class="follow-btn" @tap="toggleFollow" v-if="parentComment.uid && parentComment.uid != vid">
							<text class="follow-text">{{isFollow == 1 ? '已关注' : '+ 关注'}}</text>
						</button>
					</view>
					<view class="comment-rating-time" v-if="parentComment.rating > 0">
						<view class="comment-rating">
							<text v-for="(star, index) in 5" :key="index" 
							class="comment-star" 
							:class="index < parentComment.rating ? 'star-filled' : 'star-empty'">
							<text class="tn-icon-star-fill"></text>
						</text>
						</view>
						<text class="comment-time" :style="{'color':'#999'}">{{formatDate(parentComment.created_at)}}</text>
					</view>
					<view class="comment-time-only" v-else>
						<text class="comment-time" :style="{'color':'#999'}">{{formatDate(parentComment.created_at)}}</text>
					</view>
					<text class="comment-text" :style="{'color':'#666'}">{{parentComment.content}}</text>
				</view>
			</view>
			
			<!-- 小说信息卡片 -->
			<view class="novel-info-card" :style="{'background-color':'#f8f8f8','border-color':'#e0e0e0'}" @tap="goToNovelDetail">
				<view class="novel-cover">
					<u-image :src="novelInfo.cover" width="120rpx" height="160rpx" mode="aspectFill"
						:lazy-load="true" :fade="true" duration="450" border-radius="8rpx">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
				<view class="novel-details">
					<text class="novel-title" :style="{'color':'#333'}">{{novelInfo.title}}</text>
					<text class="novel-author" :style="{'color':'#666'}">{{novelInfo.author}}</text>
				</view>
			</view>
			
			<!-- 评论点赞按钮 -->
			<view class="comment-like-section">
				<view class="comment-like-btn" @tap="likeComment(parentComment.id)">
					<text class="cuIcon-appreciate" :style="{'color': parentComment.isLiked ? '#ff6600' : '#999'}"></text>
				<text class="like-count" :style="{'color': parentComment.isLiked ? '#ff6600' : '#999'}">{{parentComment.likes || 0}}</text>
				</view>
			</view>
		</view>
		
		<!-- 回复列表 -->
		<view class="replies-section" :style="{'background-color':'#ffffff'}">
			<view class="replies-header">
				<text class="replies-title" :style="{'color':'#333'}">全部回复 ({{repliesList.length}})</text>
			</view>
			
			<view class="reply-item" v-for="reply in repliesList" :key="reply.id"
				:style="{'border-bottom-color':'#f0f0f0'}"
				:class="{'grandchild-reply': reply.reply_to_id}"
				@tap="selectReply(reply)">
				<view class="reply-avatar" @tap="toUserInfo(reply)">
					<u-image :src="reply.userAvatar" width="60rpx" height="60rpx" mode="aspectFill"
						:lazy-load="true" :fade="true" duration="450" border-radius="30rpx">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
				<view class="reply-content">
					<view class="reply-header">
						<text class="reply-username" :style="{'color':'#333'}">{{reply.username}}</text>
						<!-- 孙级评论显示回复目标 -->
						<view class="reply-target" v-if="reply.reply_to_id && reply.reply_to_username">
							<text class="reply-arrow" :style="{'color':'#999'}">回复</text>
							<text class="reply-target-user" :style="{'color':'#ff6600'}">@{{reply.reply_to_username}}</text>
						</view>
					</view>
					<text class="reply-text" :style="{'color':'#666'}">{{reply.content}}</text>
					<view class="reply-footer">
						<text class="reply-time" :style="{'color':'#999'}">{{formatDate(reply.created_at)}}</text>
						<view class="reply-actions">
							<view class="action-btn" @tap="likeComment(reply.id)">
								<text class="cuIcon-appreciate" :style="{'color': reply.isLiked ? '#ff6600' : '#999'}"></text>
					<text class="action-count" :style="{'color': reply.isLiked ? '#ff6600' : '#999'}">{{reply.likes}}</text>
							</view>
							<view class="action-btn" @tap="replyToReply(reply)">
								<text class="cuIcon-message" :style="{'color':'#999'}"></text>
					<text class="action-text" :style="{'color':'#999'}">回复</text>
							</view>
							<view class="action-btn" @tap="deleteReply(reply.id, reply.uid)" v-if="canDeleteComment(reply.uid)">
								<text class="cuIcon-delete" :style="{'color':'#999'}"></text>
							</view>
						</view>
					</view>
					<!-- 展开孙级评论按钮 -->
					<view class="expand-grandchildren" v-if="reply.grandchildrenCount > 0 && !reply.reply_to_id" @tap="toggleGrandchildren(reply.id)"
						:style="{'background-color':'#f8f8f8','border-color':'#e0e0e0'}">
						<text class="expand-icon" :style="{'color':'#666'}">{{expandedReplies[reply.id] ? '▲' : '▼'}}</text>
						<text class="expand-text" :style="{'color':'#666'}">
							{{expandedReplies[reply.id] ? '收起' : '展开'}}{{reply.grandchildrenCount}}条回复
						</text>
					</view>
				</view>
			</view>
			
			<view class="load-more" @tap="loadMoreReplies" v-if="hasMoreReplies">
				<text :style="{'color':'#666'}">{{loadMoreText}}</text>
			</view>
		</view>
		</view>
		
		<!-- 底部回复输入框 -->
		<!-- 回复预览区域 -->
		<view class="reply-preview" v-if="replyToUser && replyToReplyContent" 
			:style="{'background-color':'#f5f5f5','border-bottom-color':'#e0e0e0'}">
			<view class="preview-header">
				<text class="preview-label" :style="{'color':'#666'}">回复</text>
				<text class="preview-username" :style="{'color':'#ff6600'}">@{{replyToUser}}</text>
				<text class="preview-label" :style="{'color':'#666'}">:</text>
			</view>
			<view class="preview-content" :style="{'color':'#999'}">
				{{replyToReplyContent.length > 50 ? replyToReplyContent.substring(0, 50) + '...' : replyToReplyContent}}
			</view>
		</view>
		
		<view class="bottom-input-bar" :style="{'background-color':'#ffffff','border-top-color':'#f0f0f0'}">
			<view class="input-container">
				<input class="reply-input" 
					v-model="replyContent"
					:placeholder="replyToUser ? `回复 @${replyToUser}` : '写下你的回复...'"
					:placeholder-style="'color:#999'"
					:style="{'background-color':'#f8f8f8','color':'#333','border-color':'#e0e0e0'}"
					maxlength="200"
					@focus="onInputFocus"
					@blur="onInputBlur" />
				<view class="cancel-reply-btn" v-if="replyToUser" @tap="cancelReply"
					:style="{'color':'#999'}">
					取消
				</view>
				<button class="send-btn" 
					@tap="sendReply" 
					:disabled="!canSend"
					:style="{'background-color': canSend ? '#ff6600' : '#ccc', 'color': canSend ? '#fff' : '#999'}">
					{{isSending ? '发送中' : '发送'}}
				</button>
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
					userInfo: null,
					token: "",
					vid: 0,
					novelId: '',
					commentId: '',
					parentComment: {},
					novelInfo: {},
					repliesList: [],
					replyContent: '',
					isSending: false,
					repliesPage: 1,
					hasMoreReplies: true,
					loadMoreText: '加载更多',
					isFollow: 0,
					replyToUser: null,
			replyToReplyId: null,
			replyToReplyContent: null,
			expandedReplies: {},
			originalReplies: []
				};
			},
		computed: {
			canSend() {
				return this.replyContent.trim().length > 0 && !this.isSending;
			}
		},
		onLoad(options) {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			if (localStorage.getItem('userinfo')) {
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.vid = that.userInfo.uid || 0;
			}
			if (localStorage.getItem('token')) {
				that.token = localStorage.getItem('token');
			}
			
			if (options.novelId && options.commentId) {
				that.novelId = options.novelId;
				that.commentId = options.commentId;
				that.getNovelInfo();
				that.getParentComment();
				that.getRepliesList();
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			formatDate(dateStr) {
				if (!dateStr) return '';
				// 处理Unix时间戳（数字）或日期字符串
				let date;
				if (typeof dateStr === 'number' || /^\d+$/.test(dateStr)) {
					// Unix时间戳
					date = new Date(parseInt(dateStr) * 1000);
				} else {
		
					date = new Date(dateStr.replace(/-/g, '/'));
				}
				const now = new Date();
				const diff = now - date;
				const minutes = Math.floor(diff / (1000 * 60));
				const hours = Math.floor(diff / (1000 * 60 * 60));
				const days = Math.floor(diff / (1000 * 60 * 60 * 24));
				
				if (minutes < 1) return '刚刚';
				if (minutes < 60) return `${minutes}分钟前`;
				if (hours < 24) return `${hours}小时前`;
				if (days === 0) return '今天';
				if (days === 1) return '昨天';
				if (days < 7) return `${days}天前`;
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}年${month}月${day}日`;
			},
			getNovelInfo() {
				var that = this;
				uni.request({
					url: that.$API.PluginLoad('xqy_novel'),
					data: {
						action: 'getNovelInfo',
						plugin: 'xqy_novel',
						id: that.novelId
					},
					method: 'GET',
					dataType: 'json',
					success(res) {
						if (res.data && res.data.code === 200) {
							that.novelInfo = res.data.data;
						}
					},
					fail(error) {
					}
				});
			},
			getParentComment() {
				var that = this;
				uni.request({
					url: that.$API.PluginLoad('xqy_novel'),
					data: {
						action: 'getCommentDetail',
						plugin: 'xqy_novel',
						comment_id: that.commentId
					},
					method: 'GET',
					dataType: 'json',
					success(res) {
					if (res.data && res.data.code === 200) {
						that.parentComment = res.data.data;
						// 立即获取用户头像，不依赖token验证
					if (that.parentComment.uid) {
						that.getUserAvatar(that.parentComment.uid).then(userInfo => {
							that.$set(that.parentComment, 'userAvatar', userInfo?.avatar);
						});
						that.getIsFollow();
					}
					}
				},
					fail(error) {
					}
				});
			},
			getRepliesList() {
				var that = this;
				uni.request({
					url: that.$API.PluginLoad('xqy_novel'),
					data: {
						action: 'getCommentReplies',
						plugin: 'xqy_novel',
						comment_id: that.commentId,
						page: that.repliesPage,
						limit: 20
					},
					method: 'GET',
					dataType: 'json',
					success(res) {
						if (res.data && res.data.code === 200) {
							const replies = res.data.data.list;
							
							// 获取所有回复的用户头像
						const avatarPromises = replies.map(reply => that.getUserAvatar(reply.uid));
						Promise.all(avatarPromises).then(userInfos => {
							replies.forEach((reply, index) => {
								reply.userAvatar = userInfos[index]?.avatar;
							});
								
								// 重新组织回复数据结构，将孙级评论正确嵌套
								const organizedReplies = that.organizeReplies(replies);
								
								if (that.repliesPage === 1) {
								that.repliesList = organizedReplies;
								that.originalReplies = [...replies];
							} else {
								that.repliesList = that.repliesList.concat(organizedReplies);
								that.originalReplies = that.originalReplies.concat(replies);
							}
								
								that.hasMoreReplies = replies.length >= 20;
							});
						}
					},
					fail(error) {
					}
				});
			},
			getUserAvatar(uid) {
				return new Promise((resolve) => {
					uni.request({
						url: this.$API.getUserInfo(),
						data: {
							key: uid
						},
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						method: 'GET',
						dataType: 'json',
						success(res) {
							if (res.data?.code == 1) {
								resolve(res.data.data);
							} else {
								resolve(null);
							}
						},
						fail(err) {
							resolve(null);
						}
					});
				});
			},

			likeComment(commentId) {
				if (!this.token) {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					});
					return;
				}
				
				var that = this;
				uni.request({
					url: that.$API.PluginLoad('xqy_novel'),
					data: {
						action: 'toggleCommentLike',
						plugin: 'xqy_novel',
						comment_id: commentId,
						token: that.token
					},
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					dataType: 'json',
					success(res) {
						if (res.data && res.data.code === 200) {
				
							if (that.parentComment.id === commentId) {
								that.parentComment.isLiked = res.data.data.is_liked;
								that.parentComment.likes = res.data.data.likes;
							} else {
					
								const reply = that.repliesList.find(r => r.id === commentId);
								if (reply) {
									reply.isLiked = res.data.data.is_liked;
									reply.likes = res.data.data.likes;
								}
							}
						} else {
							uni.showToast({
								title: res.data.msg || '操作失败',
								icon: 'none'
							});
						}
					},
					fail(error) {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					}
				});
			},
			loadMoreReplies() {
				if (!this.hasMoreReplies) return;
				
				this.repliesPage++;
				this.loadMoreText = '加载中...';
				this.getRepliesList();
				
				setTimeout(() => {
					this.loadMoreText = '加载更多';
				}, 1000);
			},
			onInputFocus() {
				// 输入框获得焦点时的处理
			},
			onInputBlur() {
				// 输入框失去焦点时的处理
			},
			sendReply() {
				if (!this.token) {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					});
					return;
				}
				
				if (this.replyContent.trim().length === 0) {
					uni.showToast({
						title: "请输入回复内容",
						icon: 'none'
					});
					return;
				}
				
				this.isSending = true;
				
				var that = this;
				
	
				let requestData = {
					action: 'addReply',
					plugin: 'xqy_novel',
					comment_id: that.commentId,
					content: that.replyContent.trim(),
					token: that.token
				};
				
				// 如果是回复子级评论，添加parent_reply_id参数
				if (that.replyToReplyId) {
					requestData.parent_reply_id = that.replyToReplyId;
				}
				
				uni.request({
					url: that.$API.PluginLoad('xqy_novel'),
					method: 'POST',
					data: requestData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					dataType: 'json',
					success(res) {
						that.isSending = false;
						if (res.data && res.data.code === 200) {
							uni.showToast({
								title: '回复成功',
								icon: 'success'
							});
				
							that.replyContent = '';
							that.replyToUser = null;
							that.replyToReplyId = null;
							that.replyToReplyContent = null;
				
							that.repliesPage = 1;
							that.getRepliesList();
						} else {
							uni.showToast({
								title: res.data?.msg || '回复失败',
								icon: 'none'
							});
						}
					},
					fail(error) {
						that.isSending = false;
						uni.showToast({
							title: '网络开小差了',
							icon: 'none'
						});
					}
				});
			},
			
			// 关注/取消关注用户
			follow(type) {
				var that = this;
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				} else {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					})
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				
				if (!that.parentComment.uid) {
					uni.showToast({
						title: "用户信息不存在",
						icon: 'none'
					});
					return;
				}
				
				var data = {
					token: token,
					touid: that.parentComment.uid,
					type: type,
				}
				that.isFollow = type;
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					url: that.$API.follow(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							if (type == 1) {
								uni.request({
									url: that.$API.SPguanzhu(),
									method: 'GET',
									data: {
										uid: that.vid,
									},
									dataType: "json",
									success(res) {},
									fail() {
										setTimeout(function() {
											uni.hideLoading();
										}, 1000);
										uni.showToast({
											title: "网络不太好哦",
											icon: 'none'
										})
									}
								})
							} else {
								uni.request({
									url: that.$API.SPquguan(),
									method: 'GET',
									data: {
										uid: that.vid,
									},
									dataType: "json",
									success(res) {},
									fail() {
										setTimeout(function() {
											uni.hideLoading();
										}, 1000);
										uni.showToast({
											title: "网络不太好哦",
											icon: 'none'
										})
									}
								})
							}
						}
						setTimeout(function() {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						that.getIsFollow();
					},
					fail: function(res) {
						setTimeout(function() {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络开小差了哦",
							icon: 'none'
						})
						that.getIsFollow();
					}
				})
			},
			

			toUserInfo(userItem) {
				if (!userItem || !userItem.uid) return;
				
				const uid = userItem.uid;
				const name = userItem.username;
				const title = name + "的信息";
				
				uni.navigateTo({
					url: '/pages/contents/userinfo?title=' + encodeURIComponent(title) + 
						 "&name=" + encodeURIComponent(name) + 
						 "&uid=" + uid + 
						 "&avatar=" + encodeURIComponent(userItem.userAvatar || '')
				});
			},
			

			toggleFollow() {
				var that = this;
				var newType = that.isFollow == 1 ? 0 : 1;
				that.follow(newType);
			},
			

			getIsFollow() {
				var that = this;
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				var data = {
					token: token,
					touid: that.parentComment.uid,
				}
				that.$Net.request({
					url: that.$API.isFollow(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.isFollow = res.data.code;
					},
					fail: function(res) {
						uni.showToast({
							title: "网络开小差了哦",
							icon: 'none'
						})
					}
				})
			},
			

			goToNovelDetail() {
				uni.navigateTo({
					url: '/pages/plugins/xqy_novel/info?id=' + this.novelInfo.id
				});
			},
			

			canDeleteComment(commentUid) {
				if (!this.userInfo) return false;
				// 用户可以删除自己的评论，或者管理员可以删除所有评论
				return this.userInfo.uid == commentUid || this.userInfo.group === 'administrator';
			},
			

			

			deleteReply(replyId, replyUid) {
				var that = this;
				
				if (!that.token) {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					});
					return;
				}
				
	
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这条回复吗？删除后无法恢复。',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '删除中...'
							});
							
							uni.request({
								url: that.$API.PluginLoad('xqy_novel'),
								data: {
									action: 'deleteReply',
									plugin: 'xqy_novel',
									reply_id: replyId,
									token: that.token
								},
								method: 'POST',
								header: {
									'content-type': 'application/x-www-form-urlencoded'
								},
								dataType: 'json',
								success(res) {
									uni.hideLoading();
									if (res.data && res.data.code === 200) {
										uni.showToast({
											title: '删除成功',
											icon: 'success'
										});
										// 从列表中移除已删除的回复
										that.repliesList = that.repliesList.filter(reply => reply.id !== replyId);
									} else {
										uni.showToast({
											title: res.data.msg || '删除失败',
											icon: 'none'
										});
									}
								},
								fail(error) {
									uni.hideLoading();
									uni.showToast({
										title: '网络错误',
										icon: 'none'
									});
								}
							});
						}
					}
				});
			},
			

			replyToReply(reply) {
				this.replyToUser = reply.username;
				this.replyToReplyId = reply.id;
				this.replyToReplyContent = reply.content; // 保存被回复的内容用于预览
				this.replyContent = '';
	
				setTimeout(() => {
					const inputEl = document.querySelector('.reply-input');
					if (inputEl) {
							inputEl.focus();
						}
					}, 100);
			},
			

			cancelReply() {
				this.replyToUser = null;
				this.replyToReplyId = null;
				this.replyToReplyContent = null;
				this.replyContent = '';
			},
			
			// 重新组织回复数据结构，将孙级评论正确嵌套
			organizeReplies(replies) {
				const childReplies = []; // 子级评论（直接回复父评论的）
				const grandchildReplies = []; // 孙级评论（回复子级评论的）
				
	
				replies.forEach(reply => {
					if (reply.reply_to_id) {
			
						grandchildReplies.push(reply);
					} else {
			
						childReplies.push(reply);
					}
				});
				
				// 为每个子级评论添加孙级评论信息
				childReplies.forEach(childReply => {
					const relatedGrandchildren = grandchildReplies.filter(grandchild => 
						grandchild.reply_to_id === childReply.id
					);
					
					// 按时间顺序排序孙级评论
					relatedGrandchildren.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
					
					// 为子级评论添加孙级评论信息
					childReply.grandchildren = relatedGrandchildren;
					childReply.grandchildrenCount = relatedGrandchildren.length;
				});
				
				// 构建最终的显示列表（默认只显示子级评论）
				const organizedList = [];
				
				childReplies.forEach(childReply => {
		
					organizedList.push(childReply);
					
					// 如果该子级评论已展开，则添加其孙级评论
					if (this.expandedReplies[childReply.id] && childReply.grandchildren) {
						organizedList.push(...childReply.grandchildren);
					}
				});
				
				return organizedList;
			},
			
			// 切换孙级评论的展开/收起状态
			toggleGrandchildren(childReplyId) {
				this.$set(this.expandedReplies, childReplyId, !this.expandedReplies[childReplyId]);
				// 使用原始数据重新组织回复列表
				this.repliesList = this.organizeReplies([...this.originalReplies]);
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "@/static/styles/home.scss";

	.comment-detail-page {
		min-height: 100vh;
		padding-bottom: 180rpx;
	}

	.content-container {
		margin: 15rpx;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.parent-comment-section {
		padding: 40rpx 30rpx;
		border-bottom: 20rpx solid #f8f8f8;

		.comment-item {
			display: flex;
			gap: 20rpx;

			.comment-avatar {
				flex-shrink: 0;
			}

			.comment-content {
				flex: 1;

				.comment-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 12rpx;

					.comment-username {
						font-size: 28rpx;
						font-weight: bold;
						flex: 1;
					}

					.follow-btn {
						background-color: #ff6600;
						border: none;
						border-radius: 15rpx;
						padding: 6rpx 12rpx;
						height: 36rpx;
						font-size: 20rpx;
						color: white;
						cursor: pointer;
						display: inline-flex;
						align-items: center;
						margin-left: 20rpx;

						.follow-text {
							color: white;
							font-size: 20rpx;
						}

						&:active {
							opacity: 0.8;
						}
					}
				}

				.comment-rating-time {
					display: flex;
					align-items: center;
					gap: 15rpx;
					margin-bottom: 12rpx;

					.comment-rating {
						display: flex;

						.comment-star {
							font-size: 24rpx;
							margin: 0 1rpx;

							&.star-filled {
								color: #ff6600;
								
								.tn-icon-star-fill {
									color: #ff6600 !important;
								}
							}

							&.star-empty {
								color: #ddd;
							}
						}
					}
					


					.comment-time {
						font-size: 24rpx;
					}
				}

				.comment-time-only {
					margin-bottom: 12rpx;

					.comment-time {
						font-size: 24rpx;
					}
				}

				.comment-text {
					font-size: 28rpx;
					line-height: 1.5;
					margin-bottom: 15rpx;
				}


			}
		}

		.novel-info-card {
				display: flex;
				padding: 20rpx;
				margin-top: 20rpx;
				border: 2rpx solid #e0e0e0;
				border-radius: 12rpx;
				gap: 20rpx;
				cursor: pointer;

				&:active {
					opacity: 0.8;
				}

				.novel-cover {
					flex-shrink: 0;
				}

				.novel-details {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					gap: 8rpx;

					.novel-title {
						font-size: 28rpx;
						font-weight: bold;
						line-height: 1.3;
					}

					.novel-author {
						font-size: 24rpx;
					}
				}
			}

			.comment-like-section {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: 20rpx 0;

				.comment-like-btn {
					display: flex;
					align-items: center;
					gap: 8rpx;
					cursor: pointer;
					padding: 10rpx 20rpx;
					border-radius: 25rpx;
					background-color: rgba(255, 102, 0, 0.05);

					&:active {
						opacity: 0.8;
					}

					.cuIcon-appreciate {
						font-size: 32rpx;
					}

					.like-count {
						font-size: 26rpx;
						font-weight: bold;
					}
				}
			}


	}

	.replies-section {
		padding: 0 30rpx;
		min-height: 400rpx;

		.replies-header {
			padding: 30rpx 0;
			border-bottom: 1rpx solid #f0f0f0;

			.replies-title {
				font-size: 32rpx;
				font-weight: bold;
			}
		}

		.reply-item {
			display: flex;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #f0f0f0;
			gap: 15rpx;
			
			&.grandchild-reply {
				margin-left: 40rpx;
				padding-left: 20rpx;
				border-left: 2rpx solid #ff6600;
				background-color: rgba(255, 102, 0, 0.02);
			}

			.reply-avatar {
				flex-shrink: 0;
			}

			.reply-content {
				flex: 1;

				.reply-header {
					margin-bottom: 8rpx;
					display: flex;
					align-items: center;
					gap: 8rpx;
					flex-wrap: wrap;

					.reply-username {
						font-size: 26rpx;
						font-weight: bold;
					}
					
					.reply-target {
						display: flex;
						align-items: center;
						gap: 4rpx;
						
						.reply-arrow {
							font-size: 22rpx;
						}
						
						.reply-target-user {
							font-size: 22rpx;
							font-weight: bold;
						}
					}
				}

				.reply-text {
					font-size: 26rpx;
					line-height: 1.4;
					margin-bottom: 12rpx;
				}

				.reply-footer {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.reply-time {
						font-size: 22rpx;
					}

					.reply-actions {
						display: flex;
						gap: 15rpx;

						.action-btn {
							display: flex;
							align-items: center;
							gap: 4rpx;
							cursor: pointer;

							&:active {
								opacity: 0.7;
							}

							.cuIcon-appreciate, .cuIcon-message, .cuIcon-delete {
								font-size: 24rpx;
							}

							.action-count, .action-text {
								font-size: 22rpx;
							}
						}
					}
				}
			}
		}

		.load-more {
			text-align: center;
			padding: 40rpx 0;
			cursor: pointer;

			text {
				font-size: 28rpx;
			}
		}
	}

	.reply-preview {
		position: fixed;
		bottom: 120rpx;
		left: 15rpx;
		right: 15rpx;
		padding: 15rpx 20rpx;
		border-bottom: 1rpx solid #e0e0e0;
		border-radius: 20rpx 20rpx 0 0;
		box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
		z-index: 999;
		
		.preview-header {
			display: flex;
			align-items: center;
			gap: 8rpx;
			margin-bottom: 8rpx;
			
			.preview-label {
				font-size: 24rpx;
			}
			
			.preview-username {
				font-size: 24rpx;
				font-weight: bold;
			}
		}
		
		.preview-content {
			font-size: 24rpx;
			line-height: 1.4;
			padding: 8rpx 12rpx;
			border-left: 3rpx solid #ff6600;
			margin-left: 10rpx;
		}
	}

	.bottom-input-bar {
		position: fixed;
		bottom: 0;
		left: 15rpx;
		right: 15rpx;
		height: 120rpx;
		padding: 20rpx;
		border-top: 1rpx solid #f0f0f0;
		border-radius: 20rpx 20rpx 0 0;
		box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.1);
		z-index: 1000;

		.input-container {
			display: flex;
			align-items: center;
			gap: 15rpx;
			height: 100%;

			.reply-input {
				flex: 1;
				height: 70rpx;
				padding: 0 20rpx;
				border: 2rpx solid #e0e0e0;
				border-radius: 35rpx;
				font-size: 26rpx;
				box-sizing: border-box;
			}

			.cancel-reply-btn {
				padding: 0 15rpx;
				font-size: 24rpx;
				cursor: pointer;

				&:active {
					opacity: 0.7;
				}
			}

			.send-btn {
				width: 100rpx;
				height: 70rpx;
				border: none;
				border-radius: 35rpx;
				font-size: 26rpx;
				font-weight: bold;
				cursor: pointer;

				&:disabled {
					cursor: not-allowed;
				}
			}
		}
	}

	


		.expand-grandchildren {
			margin-top: 20rpx;
			padding: 16rpx 24rpx;
			border: 1px solid #e0e0e0;
			border-radius: 12rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: all 0.3s ease;

			&:hover {
				opacity: 0.8;
			}

			.expand-icon {
				font-size: 24rpx;
				margin-right: 12rpx;
				transition: transform 0.3s ease;
			}

			.expand-text {
				font-size: 26rpx;
				font-weight: 500;
			}
		}


</style>