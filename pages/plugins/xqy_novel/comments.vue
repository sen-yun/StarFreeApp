<template>
	<view class="comments-page"
		:style="{'background-color':'#f6f6f6','min-height':'100vh'}">
		<view class="header" :style="[{height:CustomBar*2  + 25 + 'rpx'}]">
			<view class="cu-bar color-black"
			:style="{'height': CustomBar*2 + 25 + 'rpx','padding-top':StatusBar*2 + 25 + 'rpx', 'background-color': '#ffffff'}">
				<view class="action" @tap="back">
					<view>
						<text class="cuIcon-back color-black"></text>
					</view>
					<view class="content text-bold color-black" :style="[{top:StatusBar*2 + 25 + 'rpx'}]">
						评论区
					</view>
				</view>
			</view>
		</view>
		
		<view :style="[{padding:NavBar + 'px 15px 0px 15px'}]"></view>
		
		<!-- 主要内容容器 -->
		<view class="content-container">
			<!-- 评分统计区域 -->
			<view class="rating-section" :style="{'background-color':'#ffffff'}">
			<view class="rating-overview">
				<view class="rating-score">
					<text class="score-number" :style="{'color':'#333'}">{{ratingStats.averageRating}}</text>
					<view class="stars-display" @tap="goToWriteComment">
					<text v-for="(star, index) in 5" :key="index" 
						class="star" 
						:class="index < Math.floor(ratingStats.averageRating) ? 'star-filled' : 'star-empty'"
						@tap="rateBook(index + 1)">
						<text class="tn-icon-star-fill" :style="{'color': 'inherit'}"></text>
					</text>
				</view>
					<text class="rating-count" :style="{'color':'#666'}">{{ratingStats.totalCount}}人评分</text>
				</view>
				<view class="rating-distribution">
					<view class="rating-bar" v-for="(count, star) in ratingStats.distribution" :key="star">
						<text class="star-label" :style="{'color':'#666'}">{{star}}星</text>
						<view class="bar-container">
							<view class="bar-fill" :style="{width: getBarWidth(count) + '%', 'background-color': '#ff6600'}"></view>
						</view>
						<text class="count-label" :style="{'color':'#666'}">{{count}}</text>
					</view>
				</view>
			</view>
			</view>
			
			<!-- 评论列表 -->
			<view class="comments-list" :style="{'background-color':'#ffffff'}">
			<view class="comments-header">
				<text class="comments-title" :style="{'color':'#333'}">全部评论 ({{commentsList.length}})</text>
				<view class="sort-options">
					<text class="sort-btn" :class="{active: sortType === 'latest'}" @tap="changeSortType('latest')"
			:style="{'color': sortType === 'latest' ? '#ff6600' : '#666'}">最新</text>
					<text class="sort-btn" :class="{active: sortType === 'likes'}" @tap="changeSortType('likes')"
						:style="{'color': sortType === 'likes' ? '#ff6600' : '#666'}">最热</text>
				</view>
			</view>
			
			<view class="comment-item" v-for="comment in commentsList" :key="comment.id"
				:style="{'border-bottom-color':'#f0f0f0'}">
				<view class="comment-avatar" @tap.stop="toUserInfo(comment)">
					<u-image :src="comment.userAvatar" width="80rpx" height="80rpx" mode="aspectFill"
						:lazy-load="true" :fade="true" duration="450" border-radius="40rpx">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
				<view class="comment-content" @tap="goToCommentDetail(comment.id)">
					<view class="comment-header">
						<text class="comment-username" :style="{'color':'#333'}">{{comment.username}}</text>
						<view class="comment-rating">
							<text v-for="(star, index) in 5" :key="index" 
							class="comment-star" 
							:class="index < comment.rating ? 'star-filled' : 'star-empty'">
							<text class="tn-icon-star-fill"></text>
						</text>
						</view>
					</view>
					<text class="comment-text" :style="{'color':'#666'}">{{comment.content}}</text>
					<view class="comment-footer">
						<text class="comment-time" :style="{'color':'#999'}">{{formatDate(comment.createdAt)}}</text>
						<view class="comment-actions">
						<view class="action-btn" @tap.stop="likeComment(comment.id)">
							<text class="cuIcon-appreciate" :style="{'color': comment.isLiked ? '#ff6600' : '#999'}"></text>
					<text class="action-count" :style="{'color': comment.isLiked ? '#ff6600' : '#999'}">{{comment.likes}}</text>
						</view>
						<view class="action-btn" @tap.stop="deleteComment(comment.id, comment.uid)" v-if="canDeleteComment(comment.uid)">
							<text class="cuIcon-delete" :style="{'color':'#999'}"></text>
						</view>
					</view>
					
					<!-- 子级回复预览（最多显示2条） -->
					<view class="replies-preview" v-if="comment.replies && comment.replies.length > 0">
						<view class="reply-item" v-for="(reply, index) in comment.replies.slice(0, 2)" :key="reply.id"
						:style="{'background-color':'#f8f8f8'}">
							<view class="reply-avatar" @tap.stop="toUserInfo(reply)">
								<u-image :src="reply.userAvatar" width="50rpx" height="50rpx" mode="aspectFill"
									:lazy-load="true" :fade="true" duration="450" border-radius="25rpx">
									<u-loading slot="loading"></u-loading>
								</u-image>
							</view>
							<view class="reply-content">
								<text class="reply-username" :style="{'color':'#333'}">{{reply.username}}</text>
							<text class="reply-text" :style="{'color':'#666'}">{{reply.content}}</text>
							</view>
						</view>
						
						<!-- 查看更多回复按钮 -->
						<view class="view-more-replies" v-if="comment.replies.length > 2" 
						@tap.stop="goToCommentDetail(comment.id)"
						:style="{'color':'#999'}">
							<text>查看全部{{comment.replies.length}}条回复</text>
							<text class="cuIcon-right"></text>
						</view>
					</view>
					</view>
				</view>
			</view>
			
				<view class="load-more" @tap="loadMoreComments" v-if="hasMoreComments">
					<text :style="{'color':'#666'}">{{loadMoreText}}</text>
				</view>
			</view>
		</view>
		
		<!-- 底部写评论按钮 -->
		<view class="bottom-bar" :style="{'background-color':'#ffffff','border-top-color':'#f0f0f0'}">
			<button class="write-comment-btn" @tap="writeComment">写评论</button>
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
				novelId: '',
				ratingStats: {
					averageRating: 0,
					totalCount: 0,
					distribution: {
						5: 0,
						4: 0,
						3: 0,
						2: 0,
						1: 0
					}
				},
				commentsList: [],
				sortType: 'latest',
				commentsPage: 1,
				hasMoreComments: true,
				loadMoreText: '加载更多'
			};
		},
		onLoad(options) {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			if (localStorage.getItem('userinfo')) {
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
			}
			if (localStorage.getItem('token')) {
				that.token = localStorage.getItem('token');
			}
			
			if (options.novelId) {
				that.novelId = options.novelId;
				that.getRatingStats();
				that.getCommentsList();
			}
		},
		onPullDownRefresh() {
			this.commentsPage = 1;
			this.hasMoreComments = true;
			this.loadMoreText = '加载更多';
			this.getRatingStats();
			this.getCommentsList();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			goToWriteComment() {
				uni.navigateTo({
					url: `/pages/plugins/xqy_novel/writeComment?novelId=${this.novelId}`
				});
			},
			getRatingStats() {
				var that = this;
				uni.request({
				url: that.$API.PluginLoad('xqy_novel'),
				data: {
					action: 'getRatingStats',
					plugin: 'xqy_novel',
					novel_id: that.novelId
				},
				method: 'GET',
					dataType: 'json',
					success(res) {
						if (res.data && res.data.code === 200) {
							const stats = res.data.data;
							that.ratingStats = {
								averageRating: parseFloat(stats.average_rating || 0).toFixed(1),
								totalCount: stats.total_count || 0,
								distribution: stats.distribution || {
									5: 0, 4: 0, 3: 0, 2: 0, 1: 0
								}
							};
						}
					},
					fail(error) {
		
				}
				});
			},
			getCommentsList(isPage = false) {
			var that = this;
			var page = that.commentsPage;
			if (isPage) {
				page++;
			}
			uni.request({
			url: that.$API.PluginLoad('xqy_novel'),
			data: {
				action: 'getCommentList',
				plugin: 'xqy_novel',
				novel_id: that.novelId,
				page: page,
				limit: 20,
				sort: that.sortType
			},
			method: 'GET',
					dataType: 'json',
					success: async (res) => {
					if (res.data && res.data.code === 200) {
							const comments = res.data.data.list || [];
							
							// 使用 Promise.all 等待所有头像获取完成
							const promises = comments.map(item => that.getUserAvatar(item.uid));
							const userInfos = await Promise.all(promises);
							
							const mappedComments = comments.map((item, index) => ({
					id: item.id,
					uid: item.uid,
					username: item.username,
					userAvatar: userInfos[index]?.avatar,
					content: item.content,
					rating: item.rating,
					likes: item.likes || 0,
					isLiked: item.is_liked || false,
					createdAt: item.created_at
				}));
							
							if (isPage) {
								if (mappedComments.length < 1) {
									that.loadMoreText = '没有更多评论了';
									that.hasMoreComments = false;
								} else {
									that.commentsList = [...that.commentsList, ...mappedComments];
									that.commentsPage = page;
								}
							} else {
								that.commentsList = mappedComments;
								that.commentsPage = 1;
								that.hasMoreComments = true;
							}
						}
					},
					fail(error) {
		
				}
				});
			},

			getUserAvatar(uid) {
				return new Promise((resolve, reject) => {
					uni.request({
						url: this.$API.getUserInfo(),
						data: {
							key: uid
						},
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						method: "GET",
						dataType: 'json',
						success: (res) => {
							if(res.data?.code == 1) {
								resolve(res.data.data);
							} else {
								resolve(null);
							}
						},
						fail: (err) => {
					resolve(null);
				}
					});
				});
			},
			getBarWidth(count) {
				if (this.ratingStats.totalCount === 0) return 0;
				return (count / this.ratingStats.totalCount) * 100;
			},
			formatDate(dateStr) {
				if (!dateStr) return '';
				let date;
				if (typeof dateStr === 'number' || /^\d+$/.test(dateStr)) {
					date = new Date(parseInt(dateStr) * 1000);
				} else {
					date = new Date(dateStr.replace(/-/g, '/'));
				}
				const now = new Date();
				const diff = now - date;
				const days = Math.floor(diff / (1000 * 60 * 60 * 24));
				
				if (days === 0) {
				return '今天';
			} else if (days === 1) {
				return '昨天';
			} else if (days < 7) {
				return days + '天前';
			} else {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}年${month}月${day}日`;
			}
			},
			rateBook(rating) {
				if (!this.token) {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({
					url: './writeComment?novelId=' + this.novelId + '&rating=' + rating
				});
			},
			writeComment() {
				if (!this.token) {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					});
					return;
				}

				// 检查用户是否已经发表过评论
				const userComment = this.commentsList.find(comment => {
					return this.userInfo && comment.uid == this.userInfo.uid;
				});

				uni.navigateTo({
					url: './writeComment?novelId=' + this.novelId + (userComment ? '&hasComment=1' : '')
				});
			},
			changeSortType(type) {
				if (this.sortType !== type) {
					this.sortType = type;
					this.commentsPage = 1;
					this.hasMoreComments = true;
					this.getCommentsList();
				}
			},
			loadMoreComments() {
				if (this.hasMoreComments) {
					this.loadMoreText = "努力加载中...";
					this.getCommentsList(true);
				}
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
							// 更新本地评论的点赞状态
							const comment = that.commentsList.find(c => c.id === commentId);
							if (comment) {
								comment.isLiked = res.data.data.is_liked;
								comment.likes = res.data.data.likes;
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
			goToCommentDetail(commentId) {
				uni.navigateTo({
					url: `./commentDetail?commentId=${commentId}&novelId=${this.novelId}`
				});
			},

			toUserInfo(userItem) {
				if (!userItem || !userItem.uid) return;
				
				const uid = userItem.uid;
				const name = userItem.username;
				const title = name + "的信息";
				
				uni.navigateTo({
					url: '/pages/contents/userinfo?title=' + encodeURIComponent(title) + 
						 '&name=' + encodeURIComponent(name) + 
						 '&uid=' + uid + 
						 '&avatar=' + encodeURIComponent(userItem.userAvatar || '')
				});
			},

			canDeleteComment(commentUid) {
				if (!this.userInfo) return false;
				// 用户可以删除自己的评论，或者管理员可以删除所有评论
				return this.userInfo.uid == commentUid || this.userInfo.group === 'administrator';
			},

			deleteComment(commentId, commentUid) {
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
					content: '确定要删除这条评论吗？删除后无法恢复。',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '删除中...'
							});
							
							uni.request({
								url: that.$API.PluginLoad('xqy_novel'),
								data: {
									action: 'deleteComment',
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
									uni.hideLoading();
									if (res.data && res.data.code === 200) {
										uni.showToast({
											title: '删除成功',
											icon: 'success'
										});
										// 从列表中移除已删除的评论
										that.commentsList = that.commentsList.filter(comment => comment.id !== commentId);
							
										that.getRatingStats();
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
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "@/static/styles/home.scss";

	.comments-page {
		min-height: 100vh;
		padding-bottom: 180rpx;
	}

	.content-container {
		margin: 35rpx 15rpx 20rpx 15rpx;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.rating-section {
		padding: 40rpx 30rpx;
		border-bottom: 20rpx solid #f8f8f8;

		.rating-overview {
			display: flex;
			align-items: flex-start;
			gap: 40rpx;

			.rating-score {
				display: flex;
				flex-direction: column;
				align-items: center;
				min-width: 200rpx;

				.score-number {
					font-size: 60rpx;
					font-weight: bold;
					margin-bottom: 10rpx;
				}

				.stars-display {
				display: flex;
				margin-bottom: 10rpx;

				.star {
					font-size: 40rpx;
					margin: 0 2rpx;
					cursor: pointer;

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
				
				.rating-count {
					font-size: 24rpx;
				}
			}

			.rating-distribution {
				flex: 1;

				.rating-bar {
					display: flex;
					align-items: center;
					margin-bottom: 15rpx;
					gap: 15rpx;

					.star-label {
						font-size: 24rpx;
						min-width: 60rpx;
					}

					.bar-container {
						flex: 1;
						height: 12rpx;
						background-color: #f0f0f0;
						border-radius: 6rpx;
						overflow: hidden;

						.bar-fill {
							height: 100%;
							border-radius: 6rpx;
							transition: width 0.3s;
						}
					}

					.count-label {
						font-size: 24rpx;
						min-width: 40rpx;
						text-align: right;
					}
				}
			}
		}
	}

	.comments-list {
		padding: 0 30rpx;
		min-height: 400rpx;

		.comments-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #f0f0f0;

			.comments-title {
				font-size: 32rpx;
				font-weight: bold;
			}

			.sort-options {
				display: flex;
				gap: 30rpx;

				.sort-btn {
					font-size: 28rpx;
					cursor: pointer;

					&.active {
						font-weight: bold;
					}
				}
			}
		}

		.comment-item {
			display: flex;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #f0f0f0;
			gap: 20rpx;

			.comment-avatar {
				flex-shrink: 0;
			}

			.comment-content {
				flex: 1;

				.comment-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;

					.comment-username {
						font-size: 28rpx;
						font-weight: bold;
					}

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
				}

				.comment-text {
					font-size: 28rpx;
					line-height: 1.5;
					margin-bottom: 15rpx;
				}

				.comment-footer {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.comment-time {
						font-size: 24rpx;
					}

					.comment-actions {
						display: flex;
						gap: 20rpx;

						.action-btn {
							display: flex;
							align-items: center;
							gap: 5rpx;
							cursor: pointer;

							.action-count {
								font-size: 24rpx;
							}
						}
					}
				}
			}
		}

		.load-more {
			text-align: center;
			padding: 60rpx 0;
			font-size: 28rpx;
			cursor: pointer;
		}
		
		.replies-preview {
			margin-top: 20rpx;
			padding-left: 20rpx;
			border-left: 2rpx solid #e0e0e0;
			
			.reply-item {
				display: flex;
				padding: 15rpx;
				margin-bottom: 10rpx;
				border-radius: 10rpx;
				gap: 15rpx;
				
				.reply-avatar {
					flex-shrink: 0;
				}
				
				.reply-content {
					flex: 1;
					
					.reply-username {
						font-size: 24rpx;
						font-weight: bold;
						margin-right: 10rpx;
					}
					
					.reply-text {
						font-size: 24rpx;
						line-height: 1.4;
					}
				}
			}
			
			.view-more-replies {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 15rpx;
				font-size: 24rpx;
				cursor: pointer;
				gap: 5rpx;
			}
		}
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		border-top: 1rpx solid #f0f0f0;
		z-index: 100;

		.write-comment-btn {
			flex: 1;
			height: 80rpx;
			background-color: #ff6600;
			color: white;
			border: none;
			border-radius: 40rpx;
			font-size: 30rpx;
		}
	}	

		.rating-section {
			border-bottom-color: #404040;
		}

		.comments-list {
			.comments-header {
				border-bottom-color: #404040;
			}

			.comment-item {
				border-bottom-color: #404040;
				
				.comment-content {
					.comment-header {
						.comment-rating {
							.comment-star {
								&.star-filled {
									.tn-icon-star-fill {
										color: #ffaa44 !important;
										text-shadow: 0 0 4px rgba(255, 170, 68, 0.6);
									}
								}
								
								&.star-empty {
									color: #666;
									text-shadow: 0 0 2px rgba(255, 255, 255, 0.3);
								}
							}
						}
					}
				}
			}
			
			.replies-preview {
				border-left-color: #e0e0e0;
				
				.reply-item {
					background-color: #f8f8f8;
				}
			}
		}

		.bottom-bar {
			background-color: #ffffff;
			border-top-color: #f0f0f0;
		}

</style>