<template>
	<view class="home-component" :class="[AppStyle]">
		<!-- 搜索区域 -->
		<view class="search-wrapper bg-white" v-show="showSearchBar">
			<view class="search-bar" @tap="focusSearch">
				<text class="search-icon cuIcon-search"></text>
				<input 
					type="text" 
					placeholder="搜索视频" 
					v-model="searchKeyword"
					@confirm="searchVideos"
					confirm-type="search"
				/>
				<view class="search-cancel" @tap="hideSearch" v-if="showSearchBar">
					<text>取消</text>
				</view>
			</view>
		</view>

		<view class="main-content">

			<!-- 视频内容区域 -->
			<view class="video-grid">
				<view
					class="video-card"
					v-for="(item, index) in videoList"
					:key="item.id"
					@tap="goDetail(item.id)"
				>
					<view class="video-cover">
						<image :src="item.cover_url" mode="aspectFill"></image>
						<view class="video-duration">{{item.duration_text || formatDuration(item.duration)}}</view>
						<view class="play-count">
							<view class="play-icon">
								<text class="cuIcon-video"></text>
							</view>
							<text class="count-text">{{formatNumber(item.view_count)}}</text>
						</view>
					</view>
					<view class="video-info">
						<view class="video-title">{{item.title}}</view>
						<view class="author-info">
							<image class="author-avatar" :src="item.author_avatar" mode="aspectFill"></image>
							<text class="author-name">{{item.author_name}}</text>
							<view class="stats">
								<text class="like-count">
									<text class="cuIcon-appreciatefill"></text>
									{{formatNumber(item.like_count)}}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载状态 -->
			<view class="loading-more" v-if="loading">
				<view class="loading-spinner"></view>
			<text>加载中...</text>
		</view>
	</view>
	</view>
</template>

<script>
import { localStorage } from '../../../js_sdk/mp-storage/mp-storage/index.js'


export default {
	
	props: {
		curPage: {
			type: Number,
			default: 0
		}
	},
	data() {
			return {
				AppStyle: this.$store ? this.$store.state.AppStyle : '',
				token: '',
				isLogin: false,
				loading: true,
				videoList: [],
				page: 1,
				limit: 12,
			hasMore: true,
			submitStatus: false,
			searchKeyword: '',
			categoryList: [],
			currentCategory: 'all',
			showRecommend: false, 
			showSearchBar: false
			}
		},
	mounted() {
		this.token = localStorage.getItem('token') || '';
		this.isLogin = !!this.token;
		this.getVideoSettings();
		this.getCategoryList();
		this.getVideoList();
		uni.$on('onShow', (curPage) => {
			if (curPage === this.curPage) {
			}
		});
		uni.$on('onPullDownRefresh', (curPage) => {
			if (curPage === this.curPage) {
				this.handleRefresh();
			}
		});
		uni.$on('onReachBottom', (curPage) => {
			if (curPage === this.curPage) {
				if (this.hasMore && !this.loading) {
					this.loadMore();
				}
			}
		});
	},
	beforeDestroy() {
		uni.$off('onShow');
		uni.$off('onPullDownRefresh');
		uni.$off('onReachBottom');
	},
	methods: {
		showSearch() {
			this.showSearchBar = true;
			this.$nextTick(() => {
				this.focusSearch();
			});
		},
		
		hideSearch() {
			this.showSearchBar = false;
			this.searchKeyword = '';
			this.currentCategory = 'all';
			this.page = 1;
			this.videoList = [];
			this.getVideoList();
		},
		getVideoList() {
			return new Promise((resolve, reject) => {
				if (this.submitStatus) {
					resolve();
					return;
				}

				if (!this.hasMore && this.page > 1) {
					resolve();
					return;
				}

				const that = this;
				that.loading = true;
				that.submitStatus = true;

				uni.request({
				url: that.$API.PluginLoad('xqy_video'),
				data: {
					action: 'getVideoList',
					plugin: 'xqy_video',
					page: that.page,
					limit: that.limit,
					status: 1,
					token: that.token,
					keyword: that.searchKeyword,
					category_id: (that.currentCategory === 'all' || that.currentCategory === 'recommend' || that.currentCategory === 'hot') ? '' : that.currentCategory,
					is_recommend: that.currentCategory === 'recommend' ? 1 : '',
					order_by: that.currentCategory === 'hot' ? 'view_count' : 'created_at',
					order_type: that.currentCategory === 'hot' ? 'DESC' : 'DESC'
				},
					method: 'GET',
					success: function(res) {
						that.loading = false;
						that.submitStatus = false;

						if (res.data.code === 200) {
							const videos = res.data.data.videos || [];

							if (that.page === 1) {
								that.videoList = videos;
							} else {
								that.videoList = [...that.videoList, ...videos];
							}

							that.hasMore = videos.length >= that.limit;
							resolve();
						} else {
							uni.showToast({
								title: res.data.msg || '获取视频列表失败',
								icon: 'none'
							});
							reject(new Error(res.data.msg));
						}
					},
					fail: function(err) {
						that.loading = false;
						that.submitStatus = false;

						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
						reject(err);
					},
					complete: function() {
						uni.stopPullDownRefresh();
					}
				});
			});
		},

		loadMore() {
			if (!this.hasMore || this.loading) return;
			this.page++;
			this.getVideoList();
		},

		goDetail(id) {
			uni.navigateTo({
				url: `/pages/plugins/xqy_video/detail?id=${id}`
			});
		},

		formatNumber(num) {
			if (!num) return '0';
			if (num < 1000) return num.toString();
			if (num < 10000) return (num / 1000).toFixed(1) + 'K';
			return (num / 10000).toFixed(1) + 'W';
		},

		formatDuration(seconds) {
			if (!seconds) return '00:00';
			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = Math.floor(seconds % 60);
			return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
		},

		searchVideos(e) {
			const keyword = e.detail.value.trim();
			if (!keyword) {
				uni.showToast({
					title: '请输入搜索关键词',
					icon: 'none'
				});
				return;
			}

			this.searchKeyword = keyword;
			this.page = 1;
			this.videoList = [];
			this.hasMore = true;
			this.getVideoList();
		},

		handleRefresh() {
			this.page = 1;
			this.videoList = [];
			this.hasMore = true;
			this.getCategoryList();
			this.getVideoList();
		},

		focusSearch() {
		},

		getCategoryList() {
			const that = this;
			uni.request({
				url: that.$API.PluginLoad('xqy_video'),
				data: {
					action: 'getCategoryList',
					plugin: 'xqy_video',
					type: 'all',
					limit: 50
				},
				method: 'GET',
				success: function(res) {
					if (res.data && res.data.code === 200) {
						that.categoryList = res.data.data || [];
					}
				},
				fail: function(err) {
				}
			});
		},
		getVideoSettings() {
			const that = this;
			const requestData = {
				action: 'getVideoSettings',
				plugin: 'xqy_video',
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
						const settings = res.data.data;
						that.showRecommend = settings.show_recommend == 1 || settings.show_recommend === '1';
					}
				},
				fail: function(err) {
					that.showRecommend = false;
				}
			});
		},

		selectCategory(categoryId) {
			if (this.currentCategory === categoryId && this.videoList.length > 0) return;
			this.currentCategory = categoryId;
			this.page = 1;
			this.videoList = [];
			this.hasMore = true;
			this.getVideoList();
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.$forceUpdate();
		});
	},
	beforeDestroy() {
		if (this.refreshTimer) {
			clearTimeout(this.refreshTimer);
		}
	}
}
</script>

<style lang="scss">
.page-container {
	min-height: 100vh;
	background: #f8f8f8;
	position: relative;
}

	.search-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1001;
		padding: 20rpx 30rpx;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);

		.search-bar {
			height: 72rpx;
			background: #f5f5f5;
			border-radius: 36rpx;
			display: flex;
			align-items: center;
			padding: 0 24rpx;
			transition: all 0.3s ease;

			&:active {
				background: #ebebeb;
			}

			.search-icon {
				font-size: 32rpx;
				color: #999;
				margin-right: 16rpx;
			}

			input {
				flex: 1;
				height: 72rpx;
				color: #333;
				font-size: 30rpx;

				&::placeholder {
					color: #999;
				}
			}
			
			.search-cancel {
				margin-left: 20rpx;
				padding: 0 20rpx;
				height: 72rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #FF6B6B;
				font-size: 28rpx;
				cursor: pointer;
				transition: all 0.3s ease;
				
				&:active {
					opacity: 0.7;
				}
			}
		}
	}



.main-content {
	flex: 1;
	height: 100vh;
	background: #f8f8f8;

	&::-webkit-scrollbar {
		display: none;
	}
}

@keyframes scale-up {
	from {
		transform: scale(0.95);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}

.video-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
	padding: 10px;

	.video-card {
		background: #fff;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transform: translateY(0);
		transition: all 0.3s ease;

		&:active {
			transform: translateY(2px);
		}

		.video-cover {
			position: relative;
			padding-top: 56.25%;

			image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			.video-duration {
				position: absolute;
				bottom: 8px;
				right: 8px;
				background: rgba(0, 0, 0, 0.6);
				color: #fff;
				padding: 2px 6px;
				border-radius: 4px;
				font-size: 12px;
			}

			.play-count {
				position: absolute;
				bottom: 8px;
				left: 8px;
				color: #fff;
				font-size: 12px;
				display: flex;
				align-items: center;
				background: rgba(0, 0, 0, 0.5);
				padding: 2px 6px;
				border-radius: 12px;

				.play-icon {
					display: flex;
					align-items: center;
					margin-right: 4px;

					.cuIcon-video {
						font-size: 14px;
						color: #fff;
					}
				}

				.count-text {
					font-size: 12px;
					color: #fff;
					font-weight: 500;
				}
			}
		}

		.video-info {
			padding: 10px;

			.video-title {
				font-size: 14px;
				color: #333;
				line-height: 1.4;
				margin-bottom: 8px;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			.author-info {
				display: flex;
				align-items: center;

				.author-avatar {
					width: 24px;
					height: 24px;
					border-radius: 50%;
					margin-right: 6px;
				}

				.author-name {
					flex: 1;
					font-size: 12px;
					color: #666;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.stats {
					font-size: 12px;
					color: #999;

					.like-count {
						display: flex;
						align-items: center;

						.cuIcon-appreciatefill {
							margin-right: 2px;
							font-size: 14px;
						}
					}
				}
			}
		}
	}
}

.loading-more {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16px 0;
	opacity: 0;
	transition: opacity 0.3s ease;

	&.visible {
		opacity: 1;
	}

	.loading-spinner {
		width: 18px;
		height: 18px;
		border: 2px solid #f3f3f3;
		border-top: 2px solid #FF6B6B;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
}
</style>

