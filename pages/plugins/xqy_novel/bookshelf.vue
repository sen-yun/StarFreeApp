<template>
	<view class="user"
	:style="{'background':'#f6f6f6','min-height':'100vh','padding-bottom':'120rpx'}">
		<!-- 主体内容区 -->
		<view class="content-wrapper" style="padding-top: 20rpx;">
				<!-- 小说列表 - 瀑布流布局 -->
				<view class="waterfall-container" v-if="novelList.length > 0">
					<view class="waterfall-column">
						<view class="novel-card" v-for="(novel, index) in leftColumnNovels" :key="'left-' + index" @tap="goToNovelInfo(novel.id)">
							<!-- 编辑模式选择框 -->
							<view class="select-checkbox" v-if="isEditMode" @tap.stop="toggleSelect(novel.id)">
								<view class="checkbox-circle" :class="{selected: selectedNovels.includes(novel.id)}">
									<text class="tn-icon-check" v-if="selectedNovels.includes(novel.id)"></text>
								</view>
							</view>
							<!-- 封面 -->
							<view class="novel-cover">
								<u-image :src="novel.cover" width="100%" :height="getCoverHeight(novel)" mode="aspectFit"
									:style="getCoverStyle(novel)" :lazy-load="true" :fade="true" duration="450" border-radius="12rpx 12rpx 0 0">
									<u-loading slot="loading"></u-loading>
								</u-image>
								<!-- 更新提示 -->
								<view class="update-badge" v-if="novel.has_update">
									<text>更新</text>
								</view>
							</view>
							<!-- 内容区域 -->
							<view class="novel-content">
								<!-- 标题 -->
								<view class="novel-title">{{novel.title}}</view>
								<!-- 阅读进度 -->
								<view class="novel-progress" v-if="novel.reading_progress">{{ getProgressText(novel) }}</view>
								<view class="novel-progress" v-else>0章/{{ novel.chapterCount || 0 }}章</view>
							</view>
						</view>
					</view>
					<view class="waterfall-column">
						<view class="novel-card" v-for="(novel, index) in rightColumnNovels" :key="'right-' + index" @tap="goToNovelInfo(novel.id)">
							<!-- 编辑模式选择框 -->
							<view class="select-checkbox" v-if="isEditMode" @tap.stop="toggleSelect(novel.id)">
								<view class="checkbox-circle" :class="{selected: selectedNovels.includes(novel.id)}">
									<text class="tn-icon-check" v-if="selectedNovels.includes(novel.id)"></text>
								</view>
							</view>
							<!-- 封面 -->
							<view class="novel-cover">
								<u-image :src="novel.cover || '/static/images/default_cover.png'" width="100%" :height="getCoverHeight(novel)" mode="aspectFit"
									:style="getCoverStyle(novel)" :lazy-load="true" :fade="true" duration="450" border-radius="12rpx 12rpx 0 0">
									<u-loading slot="loading"></u-loading>
								</u-image>
								<!-- 更新提示 -->
								<view class="update-badge" v-if="novel.has_update">
									<text>更新</text>
								</view>
							</view>
							<!-- 内容区域 -->
							<view class="novel-content">
								<!-- 标题 -->
								<view class="novel-title">{{novel.title}}</view>
								<!-- 阅读进度 -->
								<view class="novel-progress" v-if="novel.reading_progress">{{ getProgressText(novel) }}</view>
								<view class="novel-progress" v-else>0章/{{ novel.chapterCount || 0 }}章</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 加载更多 -->
				<view class="load-more" v-if="novelList.length > 0">
					<u-loading v-if="isLoading" mode="flower" color="#3cc9a4"></u-loading>
					<text v-else-if="hasMore" class="load-text">上拉加载更多</text>
					<text v-else class="load-text">没有更多了</text>
				</view>

				<!-- 空状态 -->
				<view class="empty-state" v-if="novelList.length === 0 && !isLoading">
					<u-empty mode="list" text="书架空空如也">
						<view slot="bottom" class="empty-actions">
							<button class="cu-btn bg-green shadow" @tap="goToHome">去发现好书</button>
						</view>
					</u-empty>
				</view>
		</view>

		<!-- 编辑模式底部操作栏 -->
		<view class="edit-toolbar" v-if="isEditMode">
			<view class="toolbar-left">
				<view class="select-all-btn" @tap="selectAll" :class="{active: selectedNovels.length === novelList.length && novelList.length > 0}">
					<text class="select-all-text">全选</text>
				</view>
				<text class="selected-count">已选择 {{ selectedNovels.length }} 本</text>
			</view>
			<view class="toolbar-right">
				<button class="toolbar-btn" :disabled="selectedNovels.length === 0" @tap="batchRemove">
					<text class="tn-icon-delete"></text>
					<text>移除收藏</text>
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
	name: 'BookshelfComponent',
	
	props: {
		curPage: {
			type: Number,
			default: 1
		},

	},
	data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar: this.StatusBar + this.CustomBar,
				AppStyle: this.$store.state.AppStyle,
				userInfo: null,
				token: "",
				novelList: [],
				totalCount: 0,
				page: 1,
				isLoading: false,
				hasMore: true,
				isRefreshing: false,
	
				isEditMode: false,
				selectedNovels: [],
				statusMap: {
					ongoing: '连载中',
					completed: '已完结',
					paused: '暂停更新'
				},
	
				currentTab: 'bookshelf'
			};
		},
		computed: {
			isAllSelected() {
				return this.novelList.length > 0 && this.selectedNovels.length === this.novelList.length;
			},

			leftColumnNovels() {
				return this.novelList.filter((item, index) => index % 2 === 0);
			},

			rightColumnNovels() {
				return this.novelList.filter((item, index) => index % 2 === 1);
			}
		},
	created() {
		// 监听主容器事件
		uni.$on('onShow', this.handleShow);
		uni.$on('onPullDownRefresh', this.handlePullDownRefresh);
		uni.$on('onReachBottom', this.handleReachBottom);
	},
	mounted() {
		// #ifdef APP-PLUS || MP
		this.NavBar = this.CustomBar;
		// #endif
		if (localStorage.getItem('userinfo')) {
			this.userInfo = JSON.parse(localStorage.getItem('userinfo'));
		}
		if (localStorage.getItem('token')) {
			this.token = localStorage.getItem('token');
		}
		if (!this.token) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			return;
		}

		this.getBookshelfList();
	},
	beforeDestroy() {
		// 移除事件监听
		uni.$off('onShow', this.handleShow);
		uni.$off('onPullDownRefresh', this.handlePullDownRefresh);
		uni.$off('onReachBottom', this.handleReachBottom);
	},
	methods: {
		// 处理显示事件
		handleShow(pageIndex) {
			if (pageIndex === this.curPage) {
				// 可以在这里添加页面显示时的逻辑
			}
		},

		// 处理下拉刷新事件
		handlePullDownRefresh(pageIndex) {
			if (pageIndex === this.curPage) {
				this.onRefresh();
			}
		},

		// 处理触底事件
		handleReachBottom(pageIndex) {
			if (pageIndex === this.curPage && !this.isLoading && this.hasMore) {
				this.loadMore();
			}
		},
			onRefresh() {
				this.isRefreshing = true;
				this.page = 1;
				this.novelList = [];
				this.hasMore = true;
				this.getBookshelfList();
			},
			getBookshelfList() {
				var that = this;
				if (that.isLoading) return;
				that.isLoading = true;

				uni.request({
					url: that.$API.PluginLoad('xqy_novel'),
					data: {
						action: 'getBookmarkList',
						plugin: 'xqy_novel',
						page: that.page,
						limit: 10,
						sort: 'create_time',
						order: 'desc',
						token: that.token
					},
					method: 'GET',
					dataType: 'json',
					success(res) {
						that.isLoading = false;
						that.isRefreshing = false;
						uni.stopPullDownRefresh();
						if (res.data && res.data.code === 200) {
							const data = res.data.data;
							that.totalCount = data.total || 0;
							// 映射后台字段到前端字段
							const novels = (data.bookmarks || []).map(item => ({
								id: item.novel_id,
								title: item.title,
								author: item.author,
								cover: item.cover_image || '/static/images/default_cover.png',
								description: item.description || '暂无简介',
								category: item.category_name || '未分类',
								chapterCount: item.chapter_count || 0,
								wordCount: parseInt(item.word_count.toString().replace(/,/g, '')) || 0,
								views: parseInt(item.view_count.toString().replace(/,/g, '')) || 0,
								updateTime: item.novel_update_time,
								bookmarkTime: item.bookmark_time,
					
								status: that.getNovelStatus(item.novel_update_time),
					
								reading_progress: item.reading_progress || {
									chapter_id: null,
									chapter_title: '第1章',
									progress_percent: 0
								},
								// 检查是否有更新（简单判断：如果小说更新时间晚于书签时间）
								hasUpdate: new Date(item.novel_update_time) > new Date(item.bookmark_time)
							}));
							
							if (that.page === 1) {
								that.novelList = novels;
							} else {
								that.novelList = that.novelList.concat(novels);
							}
							that.hasMore = novels.length >= 10;
						} else {
							if (that.page === 1) {
								that.novelList = [];
								that.totalCount = 0;
							}
							uni.showToast({
								title: res.data?.msg || '获取书架失败',
								icon: 'none'
							});
						}
					},
					fail(error) {
						that.isLoading = false;
						that.isRefreshing = false;
						uni.stopPullDownRefresh();
						uni.showToast({
							title: '网络开小差了',
							icon: 'none'
						});
					}
				});
			},
			loadMore() {
				if (!this.hasMore || this.isLoading) return;
				this.page++;
				this.getBookshelfList();
			},
			getNovelStatus(updateTime) {
				if (!updateTime) return 'ongoing';
				const updateDate = new Date(updateTime).getTime();
				const now = Date.now();
				const daysDiff = (now - updateDate) / (1000 * 60 * 60 * 24);
				if (daysDiff > 30) {
					return 'paused';
				} else {
					return 'ongoing';
				}
			},

			getProgressText(novel) {
				if (!novel.reading_progress || !novel.reading_progress.chapter_number) {
					return `0章/${novel.chapterCount || 0}章`;
				}
				const currentChapter = novel.reading_progress.chapter_number || 0;
				const totalChapters = novel.chapterCount || 0;
				return `${currentChapter}章/${totalChapters}章`;
			},
			goToNovelInfo(novelId) {
				if (this.isEditMode) return;
				uni.navigateTo({
					url: './info?novel_id=' + novelId
				});
			},
			continueReading(novel) {
				if (novel.reading_progress && novel.reading_progress.chapter_id) {
		
					uni.navigateTo({
						url: './read?novelId=' + novel.id + '&chapterId=' + novel.reading_progress.chapter_id
					});
				} else {
					// 开始阅读（跳转到小说详情页）
					uni.navigateTo({
						url: './info?id=' + novel.id
					});
				}
			},

			// 跳转到首页
			goToHome() {
				uni.navigateTo({
					url: '/pages/plugins/xqy_novel/index'
				});
			},

			// 底部导航方法已移除，由主容器统一管理

			// 切换编辑模式（供父组件调用）
			toggleEditMode() {
				this.isEditMode = !this.isEditMode;
				if (!this.isEditMode) {
					this.selectedNovels = [];
				}
			},
			toggleSelect(novelId) {
				const index = this.selectedNovels.indexOf(novelId);
				if (index > -1) {
					this.selectedNovels.splice(index, 1);
				} else {
					this.selectedNovels.push(novelId);
				}
			},
			selectAll() {
				if (this.selectedNovels.length === this.novelList.length && this.novelList.length > 0) {
					this.selectedNovels = [];
				} else {
					this.selectedNovels = this.novelList.map(novel => novel.id);
				}
			},
			batchRemove() {
				if (this.selectedNovels.length === 0) {
					return;
				}
				
				let confirmContent = `确定要从书架中移除选中的 ${this.selectedNovels.length} 本小说吗？`;
				if (this.selectedNovels.length > 10) {
					confirmContent += '\n\n由于数量较多，将分批处理以确保稳定性。';
				}
				
				uni.showModal({
					title: '确认移除',
					content: confirmContent,
					success: (res) => {
						if (res.confirm) {
							this.processBatchRemove();
						}
					}
				});
			},
			processBatchRemove() {
				const batchSize = 5; 
				const totalNovels = [...this.selectedNovels];
				const totalCount = totalNovels.length;
				let processedCount = 0;
				let failedCount = 0;
				
				uni.showLoading({
					title: `移除中 0/${totalCount}`
				});
				
				const processBatch = (startIndex) => {
					if (startIndex >= totalNovels.length) {
			
						uni.hideLoading();
						if (failedCount === 0) {
							uni.showToast({
								title: '全部移除成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: `移除完成，${failedCount}本失败`,
								icon: 'none'
							});
						}
						this.selectedNovels = [];
						this.isEditMode = false;
						this.onRefresh();
						return;
					}
					
					const endIndex = Math.min(startIndex + batchSize, totalNovels.length);
					const batchNovels = totalNovels.slice(startIndex, endIndex);
					
					this.removeBatchFromBookshelf(batchNovels, (success) => {
						processedCount += batchNovels.length;
						if (!success) {
							failedCount += batchNovels.length;
						}
						
						uni.showLoading({
							title: `移除中 ${processedCount}/${totalCount}`
						});
						
						// 处理下一批，添加延迟避免请求过于频繁
						setTimeout(() => {
							processBatch(endIndex);
						}, 500);
					});
				};
				
				processBatch(0);
			},
			removeBatchFromBookshelf(novelIds, callback) {
				var that = this;
				uni.request({
					url: that.$API.PluginLoad('xqy_novel'),
					data: {
						action: 'batchRemoveBookmark',
						plugin: 'xqy_novel',
						novel_ids: novelIds.join(','),
						token: that.token
					},
					method: 'POST',
					dataType: 'json',
					timeout: 8000,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data && res.data.code === 200) {
							callback(true);
						} else {
							callback(false);
						}
					},
					fail(error) {
						callback(false);
					}
				});
			},
			removeFromBookshelf(retryCount = 0) {
				var that = this;
				const maxRetries = 2;
				
				if (retryCount === 0) {
					uni.showLoading({
						title: '移除中...'
					});
				}
				
				uni.request({
					url: that.$API.PluginLoad('xqy_novel'),
					data: {
						action: 'batchRemoveBookmark',
						plugin: 'xqy_novel',
						novel_ids: that.selectedNovels.join(','),
						token: that.token
					},
					method: 'POST',
					dataType: 'json',
					timeout: 10000, // 10秒超时
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						uni.hideLoading();
						if (res.data && res.data.code === 200) {
							uni.showToast({
								title: '移除成功',
								icon: 'success'
							});
				
							that.selectedNovels = [];
							that.isEditMode = false;
							that.onRefresh();
						} else {
							uni.showToast({
								title: res.data?.msg || '移除失败',
								icon: 'none'
							});
						}
					},
					fail(error) {
						
						// 如果是资源不足错误且未达到最大重试次数，则重试
						if (error.errMsg && error.errMsg.includes('ERR_INSUFFICIENT_RESOURCES') && retryCount < maxRetries) {
							uni.showToast({
								title: `网络繁忙，正在重试(${retryCount + 1}/${maxRetries})...`,
								icon: 'none',
								duration: 1500
							});
							
				
							setTimeout(() => {
								that.removeFromBookshelf(retryCount + 1);
							}, 2000);
							return;
						}
						
						uni.hideLoading();
						let errorMsg = '网络开小差了';
						if (error.errMsg && error.errMsg.includes('ERR_INSUFFICIENT_RESOURCES')) {
							errorMsg = '网络资源不足，请稍后重试';
						} else if (error.errMsg && error.errMsg.includes('timeout')) {
							errorMsg = '请求超时，请检查网络连接';
						}
						
						uni.showModal({
							title: '移除失败',
							content: errorMsg + '，是否重试？',
							showCancel: true,
							confirmText: '重试',
							cancelText: '取消',
							success: (res) => {
								if (res.confirm) {
									that.removeFromBookshelf(0);
								}
							}
						});
					}
				});
			},

			getStatusText(status) {
				return this.statusMap[status] || status;
			},
			formatTime(time) {
				if (!time) return '';
				// 处理Unix时间戳（数字）或日期字符串
				let date;
				if (typeof time === 'number' || /^\d+$/.test(time)) {
					// Unix时间戳
					date = new Date(parseInt(time) * 1000);
				} else {
		
					date = new Date(time);
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
					return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
				}
			},
			onImageError() {
			},
			onImageLoad() {
			},

			switchTab(tab) {
				this.currentTab = tab;
				switch(tab) {
					case 'home':
						uni.navigateTo({
							url: '/pages/plugins/xqy_novel/index'
						});
						break;
					case 'my':
						uni.navigateTo({
							url: '/pages/plugins/xqy_novel/my'
						});
						break;
					case 'bookshelf':
						// 当前页面，不需要跳转
						break;
				}
			},
			
			// 获取封面高度（真正的瀑布流错落效果）
			getCoverHeight(item) {
				// 统一高度范围，避免过度分类
				const minHeight = 260;
				const maxHeight = 420;
				const heightRange = maxHeight - minHeight;
				
				// 基于内容特征生成多个哈希种子
				const id = item.id || 0;
				const titleLength = item.title ? item.title.length : 0;
				const descLength = item.description ? item.description.length : 0;
				
				// 三个不同的哈希种子，创建更复杂的分布
				const hash1 = (id * 2654435761 + titleLength * 16777619) % 2147483647;
				const hash2 = (id * 1664525 + descLength * 1013904223) % 2147483647;
				const hash3 = (titleLength * 214013 + descLength * 2531011 + id) % 2147483647;
				
				// 使用正弦函数创建更自然的高度分布曲线
				const normalizedHash1 = hash1 / 2147483647;
				const normalizedHash2 = hash2 / 2147483647;
				const normalizedHash3 = hash3 / 2147483647;
				
	
				const sineFactor = Math.sin(normalizedHash1 * Math.PI * 2) * 0.3;
				const cosineFactor = Math.cos(normalizedHash2 * Math.PI * 1.5) * 0.2;
				const mixedFactor = (normalizedHash3 - 0.5) * 0.5;
				
	
				const heightRatio = 0.5 + sineFactor + cosineFactor + mixedFactor;
				const clampedRatio = Math.max(0, Math.min(1, heightRatio));
				
				// 添加微小的随机变化，避免完全规律
				const microVariation1 = ((hash1 % 100) / 100 - 0.5) * 0.05;
				const microVariation2 = ((hash2 % 100) / 100 - 0.5) * 0.03;
				const finalRatio = Math.max(0, Math.min(1, clampedRatio + microVariation1 + microVariation2));
				
				return Math.round(minHeight + heightRange * finalRatio) + 'rpx';
			},
			
			// 获取封面样式（aspectFit模式下的背景色）
			getCoverStyle(item) {
				return {
					'background-color': '#f8f9fa'
				};
			}
		},
	};
</script>

<style lang="scss" scoped>
	@import "@/static/styles/home.scss";

	.content-wrapper {
		padding: 0 20rpx 20rpx 20rpx;
	}

	/* 瀑布流布局样式 */
	.waterfall-container {
		display: flex;
		gap: 20rpx;
		padding-top: 0rpx;
	}

	.waterfall-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.novel-card {
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		position: relative;
		overflow: hidden;
		transition: transform 0.2s, box-shadow 0.2s;

		&:active {
			transform: scale(0.98);
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		}
	}
	
	

	
		// 瀑布流布局中的小说内容区域
		.novel-content {
			padding: 16rpx;
			display: flex;
			flex-direction: column;
			gap: 8rpx;

			.novel-title {
				font-size: 26rpx;
				font-weight: bold;
				color: #333;
				line-height: 1.4;
				max-height: 72rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.novel-progress {
				font-size: 22rpx;
				color: #999;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		
	.waterfall-container {
		display: flex;
		gap: 20rpx;
		padding: 20rpx;
		align-items: flex-start;
	}
	
	.waterfall-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	// 瀑布流布局中的小说卡片样式
	.novel-card {
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
		overflow: hidden;
		transition: all 0.3s ease;
		
		&:active {
			transform: scale(0.98);
		}
	}
	


	// 瀑布流布局中的小说内容区域样式
	.novel-content {
		padding: 16rpx;
		display: flex;
		flex-direction: column;
		gap: 8rpx;

		.novel-title {
			font-size: 26rpx;
			font-weight: bold;
			color: #333;
			line-height: 1.4;
			max-height: 72rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.novel-progress {
			font-size: 22rpx;
			color: #999;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	
	.novel-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 20rpx;
		padding-top: 30rpx;

		.novel-item {
			width: calc(33.333% - 14rpx);
			background-color: #fff;
			border-radius: 16rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			position: relative;
			overflow: hidden;
			margin-bottom: 20rpx;

			.select-checkbox {
				position: absolute;
				top: 10rpx;
				left: 10rpx;
				width: 44rpx;
				height: 44rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 10;

				.checkbox-circle {
					width: 44rpx;
					height: 44rpx;
					border-radius: 50%;
					border: 3rpx solid rgba(255, 255, 255, 0.8);
					background-color: rgba(0, 0, 0, 0.3);
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.3s;

					&.selected {
						background-color: #3cc9a4;
						border-color: #3cc9a4;
						transform: scale(1.1);
					}

					.tn-icon-check {
						font-size: 24rpx;
						color: #fff;
						font-weight: bold;
					}
				}
			}

			.novel-content {
				display: flex;
				flex-direction: column;
				height: 100%;

				.novel-cover {
					position: relative;
					width: 100%;
					height: 240rpx;
					// aspectFit模式下的背景美化
					background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
					box-shadow: inset 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

					.update-badge {
						position: absolute;
						top: 8rpx;
						right: 8rpx;
						background-color: #ff4757;
						color: #fff;
						font-size: 18rpx;
						padding: 4rpx 8rpx;
						border-radius: 12rpx;
						z-index: 2;
					}
				}

				.novel-info {
					padding: 16rpx;
					display: flex;
					flex-direction: column;
					gap: 8rpx;
					flex: 1;

					.novel-title {
						font-size: 26rpx;
						font-weight: bold;
						color: #333;
						line-height: 1.3;
						max-height: 68rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}

					.novel-progress {
						font-size: 22rpx;
						color: #999;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
	}

	.load-more {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40rpx;

		.load-text {
			font-size: 26rpx;
			color: #999;
		}
	}

	.empty-state {
		padding: 100rpx 40rpx;

		.empty-actions {
			margin-top: 40rpx;
			display: flex;
			justify-content: center;
		}
	}

	.edit-toolbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		background-color: #fff;
		border-top: 2rpx solid #e0e0e0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 40rpx;
		z-index: 1001;

		.toolbar-left {
			display: flex;
			align-items: center;
			gap: 20rpx;

			.select-all-btn {
				padding: 16rpx 24rpx;
				border-radius: 50rpx;
				border: 2rpx solid #e0e0e0;
				background-color: #fff;
				transition: all 0.3s;

				&.active {
					background-color: #3cc9a4;
					border-color: #3cc9a4;

					.select-all-text {
						color: #fff;
					}
				}

				.select-all-text {
					font-size: 28rpx;
					color: #333;
					transition: color 0.3s;
				}
			}

			.selected-count {
				font-size: 24rpx;
				color: #999;
			}
		}

		.toolbar-right {
			.toolbar-btn {
				display: flex;
				align-items: center;
				gap: 10rpx;
				padding: 20rpx 30rpx;
				background-color: #ff4757;
				color: #fff;
				border-radius: 50rpx;
				font-size: 26rpx;
				border: none;

				&:disabled {
					background-color: #e9ecef;
					color: #999;
				}

				.tn-icon-delete {
					font-size: 28rpx;
				}
			}
		}
	}



	/* 底部导航栏样式 */
	.novel-tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		background-color: #ffffff;
		border-top: 1rpx solid #e5e5e5;
		display: flex;
		align-items: center;
		justify-content: space-around;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
		z-index: 1000;
	}
	
	.tabbar-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 100%;
		position: relative;
	}
	
	.tab-icon {
		margin-bottom: 8rpx;
	}
	
	.tab-icon-text {
		font-size: 44rpx;
		color: #999999;
		transition: color 0.3s;
	}
	
	.tab-icon-text.active {
		color: #3cc9a4;
	}
	
	.tab-text {
		font-size: 22rpx;
		color: #999999;
		transition: color 0.3s;
	}
	
	.tab-text.active {
		color: #3cc9a4;
		font-weight: bold;
	}
	

</style>