<template>
	<view class="video-detail" :class="[AppStyle]" style="background-color:#f6f6f6;min-height:auto">
		<!-- 沉浸式视频播放区域 -->
		<view class="video-player-section" :class="{'vertical-video': videoInfo.is_vertical}">
			<!-- 视频播放器组件 -->
			<video :id="'video-' + videoInfo.id" :src="videoInfo.video_url" :poster="videoInfo.cover_url"
				:controls="true" :show-center-play-btn="true" :enable-progress-gesture="true"
				:object-fit="videoInfo.is_vertical ? 'contain' : 'cover'" class="video-player" @play="onVideoPlay"
				@pause="onVideoPause" @ended="onVideoEnded" @error="onVideoError"></video>

			<!-- 悬浮导航栏 -->
			<view class="floating-nav" :style="{'padding-top': StatusBar + 'px'}">
				<view class="nav-left" @tap="back">
					<text class="nav-icon cuIcon-back"></text>
				</view>
			</view>
		</view>

		<!-- 视频信息卡片 -->
		<view class="video-info-card" style="background-color:#fff;box-shadow:0 2px 12px rgba(0, 0, 0, 0.1)">
			<view class="title-section">
				<text class="video-title" style="color:#333">{{videoInfo.title}}</text>
				<view class="stats-row">
					<text class="views" style="color:#666">{{formatNumber(videoInfo.view_count)}} 次观看</text>
					<text class="date" style="color:#666">{{videoInfo.created_at}}</text>
				</view>
			</view>

			<view class="interaction-bar" style="border-bottom-color:#eee">
				<view class="action-btn" :class="{'active': videoInfo.is_liked}" @tap="likeVideo"
					style="background-color:#f5f5f5">
					<text class="icon"
						:class="videoInfo.is_liked ? 'cuIcon-appreciatefill text-red' : 'cuIcon-appreciate'"></text>
					<text class="action-label" style="color:#333">点赞</text>
					<text class="count" style="color:#666">{{formatNumber(videoInfo.like_count)}}</text>
				</view>
				<view class="action-btn" @tap="scrollToComments" style="background-color:#f5f5f5">
					<text class="icon cuIcon-comment" style="color:#333"></text>
					<text class="action-label" style="color:#333">评论</text>
					<text class="count" style="color:#666">{{formatNumber(videoInfo.comment_count)}}</text>
				</view>
				<view class="action-btn" @tap="handleShare" style="background-color:#f5f5f5">
					<text class="icon cuIcon-share" style="color:#333"></text>
					<text class="action-label" style="color:#333">分享</text>
				</view>
			</view>

			<!-- 作者信息 -->
			<view class="author-card" style="border-bottom-color:#eee">
				<image class="avatar" :src="videoInfo.author_avatar" mode="aspectFill" @tap="toAuthorInfo"
					style="border-color:#eee"></image>
				<view class="author-info" @tap="toAuthorInfo">
					<text class="name" style="color:#333">{{videoInfo.author_name}}</text>
				</view>
				<button v-if="!isSelf" class="follow-btn" :class="{'following': isFollow === 1}" @tap="toggleFollow">
					<text class="icon" v-if="isFollow === 1">✓</text>
					<text class="icon" v-else>+</text>
					{{isFollow === 1 ? '已关注' : '关注'}}
				</button>
			</view>

			<!-- 视频描述 -->
			<view class="description" v-if="videoInfo.description">
				<text :class="{'expanded': showFullDescription}" @tap="toggleDescription" style="color:#333">
					{{videoInfo.description}}
				</text>
				<text class="expand-btn" v-if="isDescriptionLong" @tap="toggleDescription" style="color:#007AFF">
					{{showFullDescription ? '收起' : '展开'}}
				</text>
			</view>
		</view>

		<!-- 分享弹窗 -->
		<view class="info-operate-bg" :class="isShare?'show':''" @tap="isShare=false"></view>
		<view class="info-operate" :class="[isShare?'show':'']">
			<view class="info-operate-main grid col-2">
				<view class="index-sort-box">
					<view class="index-sort-main" @tap="copyShare">
						<view class="index-sort-i" :style="{'background': 'rgb(158 158 158 / 20%)'}">
							<text class="tn-icon-link" :style="{'color': 'rgba(19, 19, 19)'}"></text>
						</view>
						<view class="index-sort-text" :style="{'color': '#333'}">
							复制视频链接
						</view>
					</view>
				</view>
				<view class="index-sort-box">
					<view class="index-sort-main" @tap="goShare">
						<view class="index-sort-i" :style="{'background': 'rgb(158 158 158 / 20%)'}">
							<text class="tn-icon-share-triangle" :style="{'color': 'rgba(19, 19, 19)'}"></text>
						</view>
						<view class="index-sort-text" :style="{'color': '#333'}">
							分享到其他应用
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 评论区 -->
		<view class="comments-section" id="comments-section" style="background-color:#f6f6f6">
			<view class="section-header" style="border-bottom-color:#eee">
				<text class="title" style="color:#333">评论 {{formatNumber(videoInfo.comment_count)}}</text>
				<view class="sort-options" style="background-color:#f0f0f0">
					<text class="sort-btn" :class="{active: sortBy === 'likes'}"
						@tap="changeSortBy('likes')">点赞最多</text>
					<text class="sort-btn" :class="{active: sortBy === 'time'}" @tap="changeSortBy('time')">最新</text>
				</view>
			</view>

			<view class="comment-list">
				<!-- 有评论时显示评论列表 -->
				<view class="comment-item" v-for="comment in comments" :key="comment.id">
					<image class="avatar" :src="comment.user_avatar" mode="aspectFill" @tap="toUserInfo(comment)">
					</image>
					<view class="comment-content">
						<!-- 用户名、作者标识和时间 -->
						<view class="comment-header">
							<view class="user-info">
								<text class="username" @tap="toUserInfo(comment)">{{comment.user_name}}</text>
								<!-- 作者标识 -->
								<view class="author-badge" v-if="comment.user_id === videoInfo.author_id">
									UP主
								</view>
							</view>
							<text class="time">{{comment.created_at}}</text>
						</view>

						<!-- 评论内容 -->
						<view class="text-container" @tap="toCommentDetail(comment)">
							<text class="text">{{comment.content}}</text>
						</view>

						<!-- 评论底部操作区 -->
						<view class="comment-footer">
							<view class="reply-btn" @tap="showReplyInput(comment)">
								<text class="icon cuIcon-comment"></text>
								<text class="text">回复</text>
							</view>
							<view class="like-btn" :class="{'liked': comment.is_liked}" @tap="likeComment(comment)">
								<text class="icon"
									:class="comment.is_liked ? 'cuIcon-appreciatefill' : 'cuIcon-appreciate'"></text>
								<text class="count">{{formatNumber(comment.like_count || 0)}}</text>
							</view>
							<view class="delete-btn" v-if="canDeleteComment(comment)"
								@tap="confirmDeleteComment(comment)">
								<text class="icon cuIcon-delete"></text>
								<text class="text">删除</text>
							</view>
						</view>

						<!-- 回复计数和展开/折叠按钮 -->
						<view class="replies-toggle" :class="{'collapsed': !comment.isExpanded}"
							v-if="comment.replies && comment.replies.length > 0">
							<button type="default" size="mini" plain @click="toggleReplies(comment)"
								class="toggle-button">
								{{ comment.isExpanded ? '收起' : '查看' }} {{ comment.replies.length }}条回复
								<text class="toggle-icon cuIcon-unfold"></text>
							</button>
						</view>

						<!-- 评论回复列表，根据展开状态显示 -->
						<view class="replies-container"
							v-show="comment.isExpanded && comment.replies && comment.replies.length > 0">
							<view class="reply-item" v-for="(reply, replyIndex) in comment.displayedReplies"
								:key="reply.id">
								<image class="avatar" :src="reply.user_avatar" mode="aspectFill"
									@tap="toUserInfo(reply)"></image>
								<view class="reply-content">
									<!-- 美化版回复内容 -->
									<view class="reply-body">
										<!-- 用户名和回复内容 -->
										<view class="reply-header">
											<view class="reply-user-info">
												<text class="username highlight-style"
													@tap="toUserInfo(reply)">{{reply.user_name}}</text>
												<!-- 作者标识 -->
												<view class="author-badge small"
													v-if="reply.user_id === videoInfo.author_id">
													UP主
												</view>
											</view>
											<view class="reply-relation" v-if="reply.reply_to_user_name">
												<text class="reply-to">回复 @</text>
												<text class="reply-to-username highlight-style"
													@tap="toUserInfo({user_id: reply.reply_to_user_id, user_name: reply.reply_to_user_name})">{{reply.reply_to_user_name}}</text>
												<!-- 如果被回复者是视频作者，显示作者标识 -->
												<view class="author-badge small"
													v-if="reply.reply_to_user_id === videoInfo.user_id">作者</view>
											</view>
										</view>
										<!-- 评论内容 -->
										<view class="reply-text-container">
											<text class="text">{{reply.content}}</text>
										</view>
										<!-- 评论底部：时间、点赞和回复按钮 -->
										<view class="reply-footer">
											<view class="left-actions">
												<text class="time">{{reply.created_at || '刚刚'}}</text>
												<text class="reply-action" @tap="replyToComment(reply)">回复</text>
												<text class="delete-action" v-if="canDeleteComment(reply)"
													@tap="confirmDeleteComment(reply)">删除</text>
											</view>
											<view class="like-btn" :class="{'liked': reply.is_liked}"
												@tap="likeComment(reply)">
												<text class="icon"
													:class="reply.is_liked ? 'cuIcon-appreciatefill' : 'cuIcon-appreciate'"></text>
												<text class="count">{{formatNumber(reply.like_count || 0)}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>


							<view class="load-more-replies" v-if="comment.replies.length > comment.displayLimit">
								<view class="load-more-btn" :class="{'loading': comment.isLoadingMore}"
									@tap="loadMoreReplies(comment)">
									{{comment.isLoadingMore ? '加载中...' : '查看更多回复'}}
									<text class="icon"
										:class="comment.isLoadingMore ? 'cuIcon-loading' : 'cuIcon-unfold'"></text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 无评论时显示提示 -->
				<view class="empty-comment" v-if="!comments || comments.length === 0">
					<text class="icon cuIcon-comment"></text>
					<text class="text">暂无评论，快来发表第一条评论吧！</text>
				</view>
			</view>
		</view>

		<!-- 评论输入框 -->
		<view class="comment-input-bar" style="background-color:#fff;border-top-color:#eee">
			<view class="reply-info" v-if="replyTo">
				<text class="reply-text" style="color:#333">回复 {{replyTo.user_name}}</text>
				<text class="cancel-btn" style="color:#007AFF" @tap="cancelReply">取消</text>
			</view>
			<view class="input-container">
				<input type="text" v-model="commentText"
					:placeholder="replyTo ? '回复 ' + replyTo.user_name + '...' : '添加评论...'" @confirm="submitComment"
					style="background-color:#f5f5f5;color:#333" />
				<text class="send-btn" :class="{'active': commentText.trim(), 'submitting': isSubmitting}"
					@tap="submitComment">{{isSubmitting ? '提交中...' : '发送'}}</text>
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
				AppStyle: this.$store.state.AppStyle,
				token: '',
				isLogin: false,
				loading: true,
				videoId: 0,
				videoInfo: {
					is_vertical: false
				},
				sortBy: 'likes',
				comments: [],
				commentText: '',
				videoContext: null,
				showFullDescription: false,
				replyTo: null,
				replyParentId: 0,
				isDescriptionLong: false,
				descriptionMaxLength: 100,
				replyDisplayLimit: 5,
				isSelf: false,
				isFollow: 0,
				isSubmitting: false,
				debounceTimer: null,
				isAdmin: false,
				isShare: false,
				shareof: ''
			}
		},
		onLoad(options) {
			this.videoId = options.id ? parseInt(options.id) : 0;

			this.token = localStorage.getItem('token') || '';
			this.isLogin = !!this.token;
			if (this.isLogin) {
				this.checkAdminStatus();
			}

			if (this.videoId) {
				this.getVideoDetail();
			} else {
				this.loading = false;
			}
		},
		onShow() {
			setTimeout(() => {
				if (this.videoInfo.id) {
					this.videoContext = uni.createVideoContext('video-' + this.videoInfo.id, this);
				}
			}, 300);
		},
		onHide() {
			if (this.videoContext) {
				this.videoContext.pause();
			}
			if (this.debounceTimer) {
				clearTimeout(this.debounceTimer);
				this.debounceTimer = null;
			}
			this.isSubmitting = false;
		},
		onUnload() {
			if (this.videoContext) {
				this.videoContext.pause();
			}

			if (this.debounceTimer) {
				clearTimeout(this.debounceTimer);
				this.debounceTimer = null;
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},

			getVideoDetail() {
				const that = this;
				that.loading = true;

				uni.request({
					url: that.$API.PluginLoad('xqy_video'),
					data: {
						action: 'getVideoInfo',
						plugin: 'xqy_video',
						video_id: that.videoId,
						token: that.token,
						sort_by: that.sortBy === 'likes' ? 'likes' : 'time'
					},
					method: 'GET',
					success: function(res) {
						that.loading = false;

						if (res.data.code === 200) {
							that.videoInfo = res.data.data.video || {};

							if (that.videoInfo.width && that.videoInfo.height) {
								that.videoInfo.is_vertical = that.videoInfo.height > that.videoInfo.width;
							} else {
								that.videoInfo.is_vertical = false;
								setTimeout(() => {
									that.checkVideoOrientation();
								}, 500);
							}

							that.comments = res.data.data.comments || [];
							let currentUserId = 0;
							if (localStorage.getItem('userinfo')) {
								const userInfo = JSON.parse(localStorage.getItem('userinfo'));
								currentUserId = userInfo.uid;
							}
							that.isSelf = (currentUserId === that.videoInfo.author_id);
							if (!that.isSelf && that.isLogin && that.videoInfo.author_id) {
								that.checkFollowStatus();
							}
							const processedComments = [];
							that.comments.forEach(comment => {
								const processedComment = {
									...comment
								};

								if (processedComment.is_liked === undefined) {
									processedComment.is_liked = false;
								}
								if (processedComment.like_count === undefined) {
									processedComment.like_count = 0;
								}
								processedComment.isExpanded = false;
								processedComment.replySortBy = 'likes';

								if (processedComment.replies && processedComment.replies.length > 0) {
									const processedReplies = [];

									processedComment.replies.reverse().forEach(reply => {
										const processedReply = {
											...reply
										};

										if (processedReply.is_liked === undefined) {
											processedReply.is_liked = false;
										}
										if (processedReply.like_count === undefined) {
											processedReply.like_count = 0;
										}

										processedReplies.push(processedReply);
									});

									processedComment.replies = processedReplies;
								}

								processedComment.displayLimit = that.replyDisplayLimit;
								processedComment.isLoadingMore = false;

								if (processedComment.replies && processedComment.replies.length > 0) {
									processedComment.displayedReplies = processedComment.replies.slice(
										0, that.replyDisplayLimit);
								}

								processedComments.push(processedComment);
							});

							that.comments = processedComments;
							//console.log('处理后的评论数据', processedComments);

							if (that.videoInfo.is_following === undefined) {
								that.videoInfo.is_following = false;
							}

							if (that.videoInfo.description) {
						that.isDescriptionLong = that.videoInfo.description.length > that
							.descriptionMaxLength;
					}

					that.shareof = that.$API.GetWebUrl() + 'pages/plugins/xqy_video/detail?id=' + that.videoId;
					setTimeout(() => {
						that.videoContext = uni.createVideoContext('video-' + that.videoInfo
							.id, that);
					}, 300);
						} else {
							uni.showToast({
								title: res.data.msg || '获取视频详情失败',
								icon: 'none'
							});
						}
					},
					fail: function() {
						that.loading = false;
						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
					}
				});
			},

			likeVideo() {
				if (!this.isLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				const that = this;

				const isLiked = that.videoInfo.is_liked;
				that.videoInfo.is_liked = !isLiked;
				that.videoInfo.like_count = isLiked ? Math.max(0, that.videoInfo.like_count - 1) : that.videoInfo
					.like_count + 1;

				uni.showToast({
					title: isLiked ? '已取消点赞' : '点赞成功',
					icon: 'none'
				});

				const requestData = {
					action: 'likeVideo',
					plugin: 'xqy_video',
					video_id: that.videoInfo.id,
					token: that.token
				};

				uni.request({
					url: that.$API.PluginLoad('xqy_video'),
					data: requestData,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						if (res.data.code === 200) {
							that.videoInfo.is_liked = res.data.data.action === 'like';
							that.videoInfo.like_count = res.data.data.like_count;
						} else {
							that.videoInfo.is_liked = isLiked;
							that.videoInfo.like_count = isLiked ? that.videoInfo.like_count + 1 : that
								.videoInfo.like_count - 1;

							uni.showToast({
								title: res.data.msg || '操作失败',
								icon: 'none'
							});
						}
					},
					fail: function() {
						that.videoInfo.is_liked = isLiked;
						that.videoInfo.like_count = isLiked ? that.videoInfo.like_count + 1 : that.videoInfo
							.like_count - 1;

						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
					}
				});
			},

			replyToComment(reply) {
				if (!this.isLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				const parentComment = this.comments.find(c => {
					if (c.replies && c.replies.length > 0) {
						return c.replies.some(r => r.id === reply.id);
					}
					return false;
				});

				if (parentComment) {

					this.showReplyInput(parentComment, reply);
				}
			},

			showReplyInput(comment, reply = null) {
				if (!this.isLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				if (reply) {

					this.replyTo = reply;
					this.replyParentId = comment.id;
				} else {

					this.replyTo = comment;
					this.replyParentId = comment.id;
				}

				// #ifdef H5
				setTimeout(() => {
					const inputEl = document.querySelector('.comment-input-bar input');
					if (inputEl) {
						inputEl.focus();
					}
				}, 100);
				// #endif
			},

			cancelReply() {
				this.replyTo = null;
				this.replyParentId = 0;
			},

			toggleReplies(comment) {
				const index = this.comments.findIndex(c => c.id === comment.id);
				if (index !== -1) {
					const updatedComment = {
						...comment
					};
					updatedComment.isExpanded = !comment.isExpanded;

					if (updatedComment.isExpanded) {
						updatedComment.displayLimit = this.replyDisplayLimit;
						updatedComment.displayedReplies = updatedComment.replies.slice(0, this.replyDisplayLimit);
					}

					this.$set(this.comments, index, updatedComment);
				}
			},

			submitComment() {
				// 如果正在提交中，直接返回，防止重复提交
				if (this.isSubmitting) {
					return;
				}

				if (!this.isLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				if (!this.commentText.trim()) {
					uni.showToast({
						title: '评论内容不能为空',
						icon: 'none'
					});
					return;
				}

				const that = this;

				that.isSubmitting = true;

				uni.showLoading({
					title: '提交中...',
					mask: true
				});
				if (that.debounceTimer) {
					clearTimeout(that.debounceTimer);
				}
				let requestData;
				const commentContent = that.commentText.trim();
				const isReply = !!that.replyTo;

				if (isReply) {
					// 回复评论
					requestData = {
						action: 'replyComment',
						plugin: 'xqy_video',
						video_id: that.videoInfo.id,
						comment_id: that.replyParentId,
						reply_to_user_id: that.replyTo.user_id,
						content: commentContent,
						token: that.token
					};
				} else {
					requestData = {
						action: 'commentVideo',
						plugin: 'xqy_video',
						video_id: that.videoInfo.id,
						content: commentContent,
						token: that.token
					};
				}

				that.debounceTimer = setTimeout(() => {
					uni.request({
						url: that.$API.PluginLoad('xqy_video'),
						data: requestData,
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success: function(res) {
							uni.hideLoading();

							if (res.data.code === 200) {

								that.commentText = '';

								that.replyTo = null;
								that.replyParentId = 0;

								that.getVideoDetail();

								uni.showToast({
									title: isReply ? '回复成功' : '评论成功',
									icon: 'success'
								});
							} else {
								uni.showToast({
									title: res.data.msg || '操作失败',
									icon: 'none'
								});
							}
						},
						fail: function(err) {

							uni.hideLoading();

							uni.showToast({
								title: '网络错误，请稍后重试',
								icon: 'none'
							});
						},
						complete: function() {
							that.isSubmitting = false;
						}
					});
				}, 300); // 300ms 的防抖延迟
			},

			toUserInfo(user) {
				if (!user || !user.user_id) return;

				const uid = user.user_id;
				const name = user.user_name || '';
				const title = name + "的信息";
				const avatar = user.user_avatar || '';

				uni.navigateTo({
					url: '/pages/contents/userinfo?title=' + encodeURIComponent(title) +
						"&name=" + encodeURIComponent(name) +
						"&uid=" + uid +
						"&avatar=" + encodeURIComponent(avatar)
				});
			},

			toAuthorInfo() {
				if (!this.videoInfo || !this.videoInfo.author_id) return;

				const uid = this.videoInfo.author_id;
				const name = this.videoInfo.author_name || '';
				const title = name + "的信息";
				const avatar = this.videoInfo.author_avatar || '';

				uni.navigateTo({
					url: '/pages/contents/userinfo?title=' + encodeURIComponent(title) +
						"&name=" + encodeURIComponent(name) +
						"&uid=" + uid +
						"&avatar=" + encodeURIComponent(avatar)
				});
			},

			changeSortBy(sortType) {
				if (this.sortBy === sortType) return;

				this.sortBy = sortType;

				this.getVideoDetail();

				uni.showToast({
					title: sortType === 'likes' ? '已按点赞数排序' : '已按最新排序',
					icon: 'none'
				});
			},

			handleShare() {
				this.isShare = true;
			},

			copyShare() {
				var that = this;
				var appname = that.$API.GetAppName();
				var url = that.shareof;
				var text = '分享视频【' + that.videoInfo.title + '】 - 来自于' + appname + ' | 链接：' + url;
				that.ToCopy(text);
				that.isShare = false;
			},

			goShare() {
				var that = this;
				var appname = that.$API.GetAppName();
				var url = that.shareof;
				var text = '分享视频【' + that.videoInfo.title + '】 - 来自于' + appname + ' | 链接：' + url;
				var summary = '分享视频【' + that.videoInfo.title + '】 - 来自于' + appname;
				
				// #ifdef APP-PLUS
				uni.shareWithSystem({
					type: 'text',
					href: url,
					title: that.videoInfo.title,
					summary: summary,
					success() {
						uni.showToast({
							title: '分享成功',
							icon: 'success'
						});
					},
					fail(err) {
						that.ToCopy(text);
					}
				});
				// #endif
				
				// #ifdef H5 || MP
				that.ToCopy(text);
				// #endif
				
				that.isShare = false;
			},

			ToCopy(content) {
				uni.setClipboardData({
					data: content,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						});
					}
				});
			},

			copyLink() {
				let shareUrl = this.$API.GetvideoStar().replace('{id}', this.videoId);
				uni.setClipboardData({
					data: shareUrl,
					success: () => {
						uni.showToast({
							title: '链接已复制',
							icon: 'success'
						});
					}
				});
			},

			shareToOther() {
				let shareUrl = this.$API.GetvideoStar().replace('{id}', this.videoId);
				// #ifdef APP-PLUS
				plus.share.sendWithSystem({
					type: 'text',
					content: this.videoInfo.title,
					href: shareUrl
				}, function() {
					//console.log('分享成功');
				}, function(e) {
					//console.log('分享失败：' + JSON.stringify(e));
				});
				// #endif
			},

			onShareAppMessage(res) {
				let shareUrl = this.$API.GetvideoStar().replace('{id}', this.videoId);
				return {
					title: this.videoInfo.title,
					path: shareUrl,
					imageUrl: this.videoInfo.cover_url
				}
			},

			likeComment(comment) {
				if (!this.isLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				const isLiked = comment.is_liked;
				comment.is_liked = !isLiked;
				comment.like_count = comment.like_count || 0;
				comment.like_count = isLiked ? Math.max(0, comment.like_count - 1) : comment.like_count + 1;

				uni.showToast({
					title: isLiked ? '已取消点赞' : '点赞成功',
					icon: 'none'
				});

				const that = this;

				const requestData = {
					action: 'likeComment',
					plugin: 'xqy_video',
					comment_id: comment.id,
					token: that.token
				};

				uni.request({
					url: that.$API.PluginLoad('xqy_video'),
					data: requestData,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						if (res.data.code === 200) {
							comment.is_liked = res.data.data.action === 'like';
							comment.like_count = res.data.data.like_count;
						} else {
							comment.is_liked = isLiked;
							comment.like_count = isLiked ? comment.like_count + 1 : comment.like_count - 1;

							uni.showToast({
								title: res.data.msg || '操作失败',
								icon: 'none'
							});
						}
					},
					fail: function() {
						comment.is_liked = isLiked;
						comment.like_count = isLiked ? comment.like_count + 1 : comment.like_count - 1;

						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
					}
				});
			},

			checkFollowStatus() {
				const that = this;
				const token = localStorage.getItem('token') || '';

				if (!token || !that.videoInfo.author_id) return;

				const data = {
					token: token,
					touid: that.videoInfo.author_id
				};

				that.$Net.request({
					url: that.$API.isFollow(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: 'get',
					dataType: 'json',
					success: function(res) {
						that.isFollow = res.data.code;
					},
					fail: function(res) {}
				});
			},

			toggleFollow() {
				if (!this.isLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}

				const that = this;

				let currentUserId = 0;
				if (localStorage.getItem('userinfo')) {
					const userInfo = JSON.parse(localStorage.getItem('userinfo'));
					currentUserId = userInfo.uid;
				}

				if (currentUserId === that.videoInfo.author_id) {
					uni.showToast({
						title: '不能关注自己',
						icon: 'none'
					});
					return;
				}

				const type = that.isFollow === 1 ? 0 : 1;
				that.isFollow = type;
				uni.showLoading({
					title: '加载中'
				});
				const token = localStorage.getItem('token') || '';
				const data = {
					token: token,
					touid: that.videoInfo.author_id,
					type: type
				};

				that.$Net.request({
					url: that.$API.follow(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: 'get',
					dataType: 'json',
					success: function(res) {
						setTimeout(function() {
							uni.hideLoading();
						}, 500);

						// console.log('关注请求响应:', res.data);

						uni.showToast({
							title: res.data.msg || (type === 0 ? '已取消关注' : '关注成功'),
							icon: 'none'
						});

						if (res.data.code === 1) {
							that.checkFollowStatus();
						} else {
							that.isFollow = type === 1 ? 0 : 1;
						}
					},
					fail: function(res) {
						setTimeout(function() {
							uni.hideLoading();
						}, 500);

						// console.log('关注请求失败:', res);

						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});

						that.isFollow = type === 1 ? 0 : 1;
					}
				});
			},

			scrollToComments() {
				// #ifdef H5
				const commentSection = document.getElementById('comments-section');
				if (commentSection) {
					commentSection.scrollIntoView({
						behavior: 'smooth'
					});
				}
				// #endif

				// #ifndef H5
				uni.createSelectorQuery()
					.select('#comments-section')
					.boundingClientRect(data => {
						if (data) {
							uni.pageScrollTo({
								scrollTop: data.top,
								duration: 300
							});
						}
					})
					.exec();
				// #endif
			},

			toggleDescription() {
				this.showFullDescription = !this.showFullDescription;
			},

			onVideoPlay() {
				// console.log('视频开始播放');
			},

			onVideoPause() {
				// console.log('视频已暂停');
			},

			onVideoEnded() {
				// console.log('视频播放结束');
			},

			onVideoError(e) {
				//console.error('视频播放错误:', e);

				const that = this;

				if (that.videoInfo && that.videoInfo.video_url) {
					setTimeout(() => {
						that.videoContext = uni.createVideoContext('video-' + that.videoInfo.id, that);
					}, 1500);
				}
			},

			formatNumber(num) {
				if (!num) return '0';
				if (num < 1000) return num.toString();
				if (num < 10000) return (num / 1000).toFixed(1) + 'K';
				return (num / 10000).toFixed(1) + 'W';
			},

			loadMoreReplies(comment) {
				if (comment.isLoadingMore) return;

				comment.isLoadingMore = true;

				setTimeout(() => {
					comment.displayLimit += 5;
					comment.displayedReplies = comment.replies.slice(0, comment.displayLimit);
					comment.isLoadingMore = false;
					this.$forceUpdate();
				}, 500);
			},

			checkAdminStatus() {
				const that = this;

				const userInfo = localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo')) : null;
				if (userInfo && userInfo.isAdmin !== undefined) {
					that.isAdmin = userInfo.isAdmin === 1;
					return;
				}

				uni.request({
					url: that.$API.PluginLoad('xqy_video'),
					data: {
						action: 'checkAdminStatus',
						plugin: 'xqy_video',
						token: that.token
					},
					method: 'GET',
					success: function(res) {
						if (res.data.code === 200 && res.data.data && res.data.data.isAdmin !== undefined) {
							that.isAdmin = res.data.data.isAdmin === 1;

							if (userInfo) {
								userInfo.isAdmin = res.data.data.isAdmin;
								localStorage.setItem('userinfo', JSON.stringify(userInfo));
							}
						}
					}
				});
			},

			canDeleteComment(comment) {
				if (!this.isLogin) return false;
				if (this.isAdmin) return true;
				let currentUserId = 0;
				if (localStorage.getItem('userinfo')) {
					const userInfo = JSON.parse(localStorage.getItem('userinfo'));
					currentUserId = parseInt(userInfo.uid);
				}

				const commentUserId = parseInt(comment.user_id);
				const videoAuthorId = parseInt(this.videoInfo.author_id);

				return currentUserId === commentUserId || currentUserId === videoAuthorId;
			},


			confirmDeleteComment(comment) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这条评论吗？',
					success: (res) => {
						if (res.confirm) {
							this.deleteComment(comment);
						}
					}
				});
			},

			deleteComment(comment) {
				const that = this;

				uni.showLoading({
					title: '删除中...',
					mask: true
				});

				uni.request({
					url: that.$API.PluginLoad('xqy_video'),
					data: {
						action: 'deleteComment',
						plugin: 'xqy_video',
						comment_id: comment.id,
						token: that.token
					},
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						uni.hideLoading();

						if (res.data.code === 200) {
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});

							that.getVideoDetail();
						} else {
							uni.showToast({
								title: res.data.msg || '删除失败',
								icon: 'none'
							});
						}
					},
					fail: function() {
						uni.hideLoading();

						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
					}
				});
			},

			checkVideoOrientation() {
				const that = this;
				if (!that.videoInfo.id) return;

				// #ifdef H5
				const video = document.createElement('video');
				video.src = that.videoInfo.video_url;

				video.onloadedmetadata = function() {
					const videoWidth = video.videoWidth;
					const videoHeight = video.videoHeight;

					that.videoInfo.is_vertical = videoHeight > videoWidth;

					video.src = '';
				};
				// #endif

				// #ifndef H5
				// APP环境下无法检测视频方向，保持默认值
				// #endif

				video.onerror = function() {
					console.error('无法获取视频元数据');
				};

				video.load();

				setTimeout(() => {
					if (video.src) {
						video.src = '';
					}
				}, 3000);
			},
		},
	}
</script>

<style lang="scss">
	.video-detail {
		background: #f8f8f8;
		min-height: 100vh;
		position: relative;
		overflow-y: auto;
	}

	.video-player-section {
		position: relative;
		width: 100%;
		height: 56.25vw;
		background: #000;
		margin-bottom: 40px;

		// #ifdef APP-PLUS
		margin-top: var(--status-bar-height);
		// #endif

		&.vertical-video {
			height: 100vw;
			max-height: 80vh;
		}

		.video-player {
			width: 100%;
			height: 100%;

			// #ifdef H5
			&::-webkit-media-controls-panel {
				position: absolute;
				bottom: -30px;
				width: 100%;
				background: rgba(0, 0, 0, 0.6);
			}

			&::-webkit-media-controls-timeline {
				margin: 0 10px;
			}

			&::-webkit-media-controls-current-time-display,
			&::-webkit-media-controls-time-remaining-display {
				color: #fff;
			}

			// #endif
		}

		.floating-nav {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 44px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 15px;
			background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);

			.nav-icon {
				color: #fff;
				font-size: 24px;
				padding: 8px;
			}
		}
	}

	.video-info-card {
		background: #fff;
		border-radius: 20px 20px 0 0;
		margin-top: 10px;
		padding: 20px;
		position: relative;
		z-index: 1;

		// #ifdef H5
		margin-top: 30px;
		// #endif

		.title-section {
			margin-bottom: 15px;

			.video-title {
				font-size: 18px;
				font-weight: 600;
				line-height: 1.4;
				margin-bottom: 8px;
			}

			.stats-row {
				display: flex;
				font-size: 14px;
				color: #666;

				.views {
					margin-right: 15px;
				}
			}
		}
	}

	/* 交互栏 */
	.interaction-bar {
		display: flex;
		justify-content: space-around;
		padding: 15px 0;
		border-bottom: 1px solid #f0f0f0;

		.action-btn {
			display: flex;
			flex-direction: column;
			align-items: center;

			.icon {
				font-size: 24px;
				color: #666;
				margin-bottom: 4px;
			}

			.action-label {
				font-size: 12px;
				color: #666;
			}

			.count {
				font-size: 12px;
				color: #666;
			}

			&.active {

				.icon,
				.count,
				.action-label {
					color: #FF6B6B;
				}
			}
		}
	}

	.author-card {
		display: flex;
		align-items: center;
		padding: 15px 0;

		.avatar {
			width: 48px;
			height: 48px;
			border-radius: 24px;
			margin-right: 12px;
			cursor: pointer;

			// #ifdef H5
			&:hover {
				opacity: 0.8;
				transform: scale(1.05);
				transition: all 0.2s ease;
			}

			// #endif
		}

		.author-info {
			flex: 1;
			cursor: pointer;

			// #ifdef H5
			&:hover .name {
				color: #FF6B6B;
				transition: color 0.2s ease;
			}

			// #endif

			.name {
				font-size: 16px;
				font-weight: 600;
				margin-bottom: 4px;
			}

			.followers {
				font-size: 12px;
				color: #666;
			}
		}

		.follow-btn {
			padding: 6px 20px;
			border-radius: 100upx;
			font-size: 14px;
			background: #3cc9a4;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 4px;

			.icon {
				font-size: 12px;
				margin-right: 2px;
			}

			&.following {
				background: #f0f0f0;
				color: #666;
			}
		}
	}

	.comments-section {
		background: #fff;
		margin-top: 12px;
		padding: 20px 16px;
		min-height: 200px;
		padding-bottom: 90px;
		border-radius: 16px 16px 0 0;
		box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.03);


		// #ifdef H5
		margin-bottom: 60px;
		// #endif

		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;
			padding-bottom: 12px;
			border-bottom: 1px solid #f5f5f5;

			.title {
				font-size: 17px;
				font-weight: 600;
				color: #222;
				display: flex;
				align-items: center;

				&::before {
					content: '';
					display: inline-block;
					width: 3px;
					height: 16px;
					background: #FF6B6B;
					/* 添加标题前的装饰条 */
					margin-right: 8px;
					border-radius: 3px;
				}
			}

			.sort-options {
				display: flex;
				align-items: center;
				background: #f8f8f8;
				border-radius: 20px;
				padding: 3px;

				.sort-btn {
					font-size: 13px;
					color: #666;
					padding: 5px 12px;
					border-radius: 16px;
					transition: all 0.2s ease;

					&.active {
						color: #fff;
						background-color: #FF6B6B;
						font-weight: 500;
						box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
					}
				}
			}
		}
	}

	/* 评论列表 */
	.comment-list {

		/* 空评论提示 */
		.empty-comment {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 50px 0;
			color: #999;
			background: #fafafa;
			border-radius: 12px;
			box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.02);

			.icon {
				font-size: 52px;
				margin-bottom: 16px;
				color: #ddd;
				opacity: 0.8;
			}

			.text {
				font-size: 15px;
				line-height: 1.5;
				color: #888;
			}
		}

		.comment-item {
			display: flex;
			padding: 16px;
			margin: 0 -16px;

			.avatar {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				margin-right: 12px;
				flex-shrink: 0;
			}

			.comment-content {
				flex: 1;
				min-width: 0;

				.comment-header {
					display: flex;
					align-items: flex-start;
					justify-content: space-between;
					margin-bottom: 6px;

					.user-info {
						display: inline-flex;
						align-items: center;
						height: 24px;

						.username {
							font-size: 15px;
							font-weight: 600;
							color: #333;
							line-height: 24px;
							margin: 0;
							padding: 0;
						}

						.author-badge {
							display: inline-flex;
							align-items: center;
							height: 18px;
							padding: 0 8px;
							font-size: 12px;
							color: #FF6B6B;
							background: rgba(255, 107, 107, 0.1);
							border: 1px solid rgba(255, 107, 107, 0.2);
							border-radius: 9px;
							margin-left: 8px;
							line-height: 1;
						}
					}

					.time {
						font-size: 12px;
						color: #999;
						line-height: 24px;
					}
				}

				.text-container {
					margin: 8px 0;

					.text {
						font-size: 15px;
						line-height: 1.6;
						color: #333;
					}
				}

				.comment-footer {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					gap: 12px;
					margin-top: 8px;

					.reply-btn,
					.like-btn,
					.delete-btn {
						display: flex;
						align-items: center;
						padding: 6px 12px;
						border-radius: 16px;
						background: #f5f5f5;

						.icon {
							font-size: 16px;
							margin-right: 4px;
							color: #666;
						}

						.text,
						.count {
							font-size: 13px;
							color: #666;
						}
					}

					.delete-btn {

						.icon,
						.text {
							color: #FF6B6B;
						}

						&:hover {
							background: rgba(255, 107, 107, 0.1);
						}
					}

					.like-btn.liked {
						background: rgba(255, 107, 107, 0.1);

						.icon,
						.count {
							color: #FF6B6B;
						}
					}
				}

				/* 子评论展开/折叠按钮 */
				.replies-toggle {
					margin-top: 12px;

					.toggle-button {
						display: flex;
						align-items: center;
						padding: 6px 12px;
						font-size: 13px;
						color: #007AFF;
						background: rgba(0, 122, 255, 0.05);
						border-radius: 16px;

						.toggle-icon {
							margin-left: 4px;
							font-size: 12px;
						}
					}
				}

				/* 子评论列表样式 */
				.replies-container {
					margin-top: 12px;
					margin-left: 40px;
					padding-left: 16px;
					border-left: 2px solid #f0f0f0;

					.reply-item {
						display: flex;
						padding: 12px 0;
						position: relative;

						/* 子评论之间的分割线 */
						&:not(:last-child)::after {
							content: '';
							position: absolute;
							left: 0;
							right: 0;
							bottom: 0;
							height: 1px;
							background: #f0f0f0;


						}

						.avatar {
							width: 32px;
							height: 32px;
							border-radius: 50%;
							margin-right: 12px;
						}

						.reply-content {
							.reply-body {
								background: #f8f8f8;
								border-radius: 12px;
								padding: 8px 12px;
								margin-left: 32px;

								.reply-header {
									margin-bottom: 6px;

									.reply-user-info {
										.username.highlight-style {
											color: #FB7299;

											&:hover {
												opacity: 0.8;
											}
										}

										/* 作者标识 */
										.author-badge.small {
											height: 16px;
											padding: 0 6px;
											font-size: 11px;
										}
									}

									.reply-relation {
										.reply-to {
											font-size: 12px;
											color: #666;
										}

										.reply-to-username.highlight-style {
											color: #00A1D6;

											&:hover {
												opacity: 0.8;
											}
										}
									}
								}

								.reply-text-container {
									.text {
										font-size: 14px;
										line-height: 1.5;
										color: #333;
										margin: 4px 0;
									}
								}

								.reply-footer {
									margin-top: 8px;
									display: flex;
									align-items: center;
									justify-content: space-between;

									.left-actions {
										display: flex;
										align-items: center;
										gap: 12px;

										.time {
											font-size: 12px;
											color: #999;
										}

										.reply-action,
										.delete-action {
											font-size: 12px;
											color: #007AFF;
											opacity: 0;
											transition: opacity 0.2s ease;
										}

										.delete-action {
											color: #FF6B6B;
										}
									}

									.like-btn {
										padding: 4px 8px;
										border-radius: 15px;
										background: rgba(0, 0, 0, 0.05);
										transition: all 0.2s ease;

										&:hover {
											background: rgba(0, 0, 0, 0.08);
										}

										&.liked {
											background: rgba(255, 45, 85, 0.1);

											.icon,
											.count {
												color: #FF2D55;
											}
										}
									}

									.like-btn {
										background: rgba(255, 255, 255, 0.05);

										.icon,
										.count {
											color: #aaa;
										}

										&:hover {
											background: rgba(255, 255, 255, 0.1);
										}

										&.liked {
											background: rgba(255, 107, 107, 0.15);

											.icon,
											.count {
												color: #ff8a8a;
											}
										}
									}
								}
							}

							&:hover {
								background: #f2f2f2;

								.reply-footer .reply-action,
								.reply-footer .delete-action {
									opacity: 1;
								}
							}
						}
					}
				}
			}
		}
	}

	/* 评论输入栏 - 现代化设计 */
	.comment-input-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		padding: 12px 16px;
		display: flex;
		flex-direction: column;
		border-top: 1px solid #f0f0f0;
		z-index: 100;
		box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
		transition: all 0.3s ease;

		/* 回复信息区 */
		.reply-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 10px;
			margin-bottom: 10px;
			border-bottom: 1px dashed #eaeaea;

			.reply-text {
				font-size: 13px;
				color: #555;
				display: flex;
				align-items: center;

				&::before {
					content: '\e6a3';
					/* 使用回复图标 */
					font-family: 'cuIcon';
					margin-right: 4px;
					font-size: 14px;
					color: #007AFF;
				}
			}

			.cancel-btn {
				font-size: 12px;
				color: #FF6B6B;
				padding: 4px 10px;
				border-radius: 14px;
				background-color: rgba(255, 107, 107, 0.1);
				transition: all 0.2s ease;

				// #ifdef H5
				&:hover {
					background-color: rgba(255, 107, 107, 0.2);
				}

				// #endif
			}
		}

		// #ifdef H5
		padding-bottom: calc(12px + env(safe-area-inset-bottom));
		// #endif

		.input-container {
			display: flex;
			align-items: center;
			width: 100%;
		}

		input {
			flex: 1;
			height: 40px;
			background: #f5f5f5;
			border-radius: 20px;
			padding: 0 16px;
			font-size: 14px;
			margin-right: 12px;
			transition: all 0.3s ease;
			border: 1px solid transparent;

			&:focus {
				background: #fff;
				border-color: #e0e0e0;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
			}
		}

		.send-btn {
			font-size: 15px;
			color: #999;
			padding: 8px 16px;
			transition: all 0.2s ease;
			border-radius: 18px;
			min-width: 70px;
			text-align: center;

			&.active {
				color: #fff;
				background-color: #FF6B6B;
				box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
			}



			&.submitting {
				color: #fff;
				background-color: #999;
				opacity: 0.8;
				pointer-events: none;
				box-shadow: none;
			}

			// #ifdef H5
			&.active:hover {
				background-color: #ff5252;
				transform: translateY(-1px);
			}

			// #endif
		}
	}

	.load-more-replies {
		margin-top: 8px;
		padding: 8px 0;
		text-align: center;

		.load-more-btn {
			display: inline-flex;
			align-items: center;
			padding: 6px 16px;
			font-size: 13px;
			color: #007AFF;
			background: rgba(0, 122, 255, 0.05);
			border-radius: 16px;
			transition: all 0.2s ease;

			.icon {
				font-size: 12px;
				margin-left: 4px;
			}

			&:hover {
				background: rgba(0, 122, 255, 0.1);
			}

			&.loading {
				opacity: 0.7;
				pointer-events: none;
			}


		}
	}




	.video-player-section {
		.video-player {

			// #ifdef H5
			&::-webkit-media-controls-panel {
				background: rgba(0, 0, 0, 0.8);
			}

			// #endif
		}

		/* 回复展开/折叠按钮样式 - 简化版 */
		.replies-toggle {
			margin-top: 1px;
			margin-bottom: 1px;
			margin-left: 40px;
			/* 与父评论头像对齐 */
			display: flex;
			align-items: center;
			justify-content: flex-start;
			width: fit-content;

			.toggle-button {
				padding: 0 5px;
				font-size: 10px;
				color: #999;
				background-color: transparent;
				border-radius: 0;
				border: none;
				display: flex;
				align-items: center;
				justify-content: center;
				line-height: 1.2;
				margin: 0;
				height: auto;
				transition: none;
				box-shadow: none;

				&::after {
					border: none;
				}
			}

			.toggle-icon {
				font-size: 10px;
				color: #999;
				margin-left: 2px;
				transition: none;
			}

			&.collapsed .toggle-icon {
				transform: rotate(180deg);
			}
		}

		.replies-container {
			margin-top: 12px;
			margin-left: 40px;
			padding-left: 16px;
			border-left: 2px solid #f0f0f0;

			.reply-item {
				position: relative;
				padding: 12px 0;

				&:not(:last-child)::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					height: 1px;
					background: linear-gradient(to right, #f0f0f0 0%, transparent 100%);
				}

				.avatar {
					width: 24px;
					height: 24px;
					border-radius: 50%;
					margin-right: 8px;
					border: 2px solid #fff;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
					transition: transform 0.2s ease;

					&:hover {
						transform: scale(1.1);
					}
				}

				.reply-content {
					.reply-body {
						background: #f8f8f8;
						border-radius: 12px;
						padding: 8px 12px;
						margin-left: 32px;

						.reply-header {
							margin-bottom: 6px;

							.reply-user-info {
								.username.highlight-style {
									color: #FB7299;

									&:hover {
										opacity: 0.8;
									}
								}

								.author-badge.small {
									height: 16px;
									padding: 0 6px;
									font-size: 11px;
									color: #FF6B6B;
									background: rgba(255, 107, 107, 0.1);
									border: 1px solid rgba(255, 107, 107, 0.2);
									border-radius: 8px;
									font-weight: 500;
									white-space: nowrap;

									&:hover {
										background: rgba(255, 107, 107, 0.15);
									}
								}
							}

							.reply-relation {
								.reply-to {
									font-size: 12px;
									color: #666;
								}

								.reply-to-username.highlight-style {
									color: #00A1D6;
									font-size: 12px;

									&:hover {
										opacity: 0.8;
									}
								}
							}
						}

						.reply-text-container {
							.text {
								font-size: 14px;
								line-height: 1.5;
								color: #333;
								margin: 4px 0;
							}
						}

						.reply-footer {
							margin-top: 8px;
							display: flex;
							align-items: center;
							justify-content: space-between;

							.left-actions {
								display: flex;
								align-items: center;
								gap: 12px;

								.time {
									font-size: 12px;
									color: #999;
								}

								.reply-action {
									font-size: 12px;
									color: #007AFF;
									opacity: 0;
									transition: opacity 0.2s ease;
								}
							}

							.like-btn {
								padding: 4px 8px;
								border-radius: 15px;
								background: rgba(0, 0, 0, 0.05);
								transition: all 0.2s ease;

								&:hover {
									background: rgba(0, 0, 0, 0.08);
								}

								&.liked {
									background: rgba(255, 45, 85, 0.1);

									.icon,
									.count {
										color: #FF2D55;
										/* iOS风格的红色 */
									}
								}
							}
						}

						/* 悬停效果 */
						&:hover {
							background: #f2f2f2;

							.reply-footer .reply-action {
								opacity: 1;
							}
						}
					}
				}
			}
		}
	}

	/* 分享弹窗样式 */
	.info-operate-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
		opacity: 0;
		visibility: hidden;
		transition: all 0.3s;
	}

	.info-operate-bg.show {
		opacity: 1;
		visibility: visible;
	}

	.info-operate {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
		z-index: 1000;
		transform: translateY(100%);
		transition: all 0.3s;
		padding: 40rpx 30rpx 60rpx;
	}

	.info-operate.show {
		transform: translateY(0);
	}

	.info-operate-main {
		display: flex;
		flex-wrap: wrap;
		gap: 30rpx;
	}

	.index-sort-box {
		flex: 1;
		min-width: 0;
	}

	.index-sort-main {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx;
		border-radius: 16rpx;
		transition: all 0.3s;
	}

	.index-sort-main:active {
		background: #f5f5f5;
		transform: scale(0.95);
	}

	.index-sort-i {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;
		font-size: 40rpx;
	}

	.index-sort-text {
		font-size: 28rpx;
		color: #333;
		text-align: center;
		line-height: 1.2;
	}
</style>

