<template>
	<view class="user"
		:style="{'background-color':'#f6f6f6','min-height':'100vh'}">
		<view class="header" :style="[{height:CustomBar*2  + 25 + 'rpx'}]">
			<view class="cu-bar"
				:class="scrollTop>40?'color-black':'color-white'"
				:style="{'height': CustomBar*2 + 25 + 'rpx','padding-top':StatusBar*2 + 'rpx', 'background-color': scrollTop>40?'#ffffff !important':'transparent !important'}">
				<view class="action" @tap="back">
					<view>
						<text class="cuIcon-back" :class="scrollTop > 40 ? 'color-black' : 'color-white'"></text>
					</view>
					<view class="content text-bold" :style="[{top:StatusBar*2 + 'rpx'}]"
						:class="scrollTop > 40 ? 'color-black' : 'color-white'">
						<block v-if="scrollTop > 40">
							<view class="novel-top">
								<u-image :src="novelData.cover" width="50rpx" height="70rpx" mode="aspectFill"
									:lazy-load="true" :fade="true" duration="450" border-radius="8rpx">
									<u-loading slot="loading"></u-loading>
								</u-image>
								<text class="tn-margin-left-sm">{{getName(novelData.title)}}</text>
							</view>
						</block>
					</view>
				</view>
				<view class="action">
					<text class="tn-icon-share margin-left-lg header-icon"
						:class="scrollTop > 40 ? 'color-black' : 'color-white'" @tap="toShare()"></text>
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 15px 0px 15px'}]"></view>
		<view class="content-container">
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
							复制小说链接
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
		<view class="bg-white"
			:style="{'background-color':'#ffffff'}" v-if="isLoading==1">
			<view class="novelinfo-box">
				<view class="novel-box-body" style="margin: 0 40rpx;">
					<view class="novel-box-cover" style="margin: 20rpx;">
						<u-image :src="novelData.cover" width="160rpx" height="220rpx" mode="aspectFill"
							:lazy-load="true" :fade="true" duration="450" border-radius="12rpx">
							<u-loading slot="loading"></u-loading>
						</u-image>
					</view>
					<view class="tn-margin-sm">
						<view class="novelinfo-box-title text-title-1" :style="{'color':'#333'}">{{novelData.title}}</view>
						<view style="font-size: 26rpx;margin-top: 10rpx;margin-bottom: 10rpx;" :style="{'color':'#666'}">
							<text v-if="novelData.type === 'original'">作者：{{novelData.author}}</text>
							<text v-else>
								作者：{{novelData.author}}<text style="margin-left: 20rpx;">发布者：{{novelData.publisher}}</text>
							</text>
						</view>
						<view style="font-size: 28rpx;">
							<text class="novel-status-tag"
								:style="{backgroundColor: novelData.statusInfo.color}">{{novelData.statusInfo.text}}</text>
							<text class="novel-type-tag">{{novelData.type === 'original' ? '原创' : '搬运'}}</text>
							<text v-for="(tag, index) in novelData.tagList" :key="index" class="novel-tag-item">{{tag}}</text>
						</view>
					</view>
				</view>
				<view class="list" style="display: flex; justify-content:space-evenly;" :style="{'color':'#222','border-top-color':'#f0f0f0','border-bottom-color':'#f0f0f0'}">
					<view class="item" @tap="goToComments">
						<view class="text">
							<text>{{novelData.rating}}<text class="cuIcon-favor" style="margin-left: 5rpx;"></text></text>
							<text>评分</text>
						</view>
					</view>
					<view class="item">
						<u-line class="u-line" direction="col" :hair-line="false" color="#ccc" length="40rpx"></u-line>
					</view>
					<view class="item">
						<view class="text">
							<text>{{novelData.chapterCount}}</text>
							<text>章节</text>
						</view>
					</view>
					<view class="item">
						<u-line class="u-line" direction="col" :hair-line="false" color="#ccc" length="40rpx"></u-line>
					</view>
					<view class="item">
						<view class="text">
							<text>{{formatWordCount(novelData.wordCount)}}</text>
							<text>字数</text>
						</view>
					</view>
					<view class="item">
						<u-line class="u-line" direction="col" :hair-line="false" color="#ccc" length="40rpx"></u-line>
					</view>
					<view class="item">
						<view class="text">
							<text>{{novelData.views}}</text>
							<text>阅读</text>
						</view>
					</view>
				</view>
				<view class="wrap">
					<view style="margin-bottom: 10rpx;">
						<u-tabs-swiper ref="uTabs" :bgColor="'#ffffff'" :list="tablist"
							:current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"
							active-color="#57d1b1"></u-tabs-swiper>
						<!-- #ifdef H5 -->
						<u-sticky @fixed="sticky" :offset-top='5' :h5-nav-height="CustomBar" @unfixed="unsticky">
							<view style="height: 5px;width: 100%;"
								:style="{'background-color':'#f6f6f6'}">&nbsp;</view>
						</u-sticky>
						<!-- #endif -->
					</view>
					<!-- #ifdef APP-PLUS || MP -->
					<tn-sticky :index="1" :offsetTop="5" :customNavHeight="CustomBar" @fixed="sticky"
						@unfixed="unsticky">
						<view style="height: 5px;width: 100%;">&nbsp;</view>
					</tn-sticky>
					<!-- #endif -->
					<swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
						@animationfinish="animationfinish">
						<swiper-item class="swiper-item">
							<scroll-view :scroll-y="isLock" class="scroll-view-content"
								@scrolltolower="onReachBottom1">
								<view class="scroll-1-box">
									<view class="info-section">
										<view class="info-section-title">
											<text class="title-text">小说简介</text>
											<view class="title-line"></view>
										</view>
										<view class="info-content" v-html="novelData.description">
										</view>
									</view>
									<view class="action-buttons">
										<button class="action-btn start-read" @tap="startReading">开始阅读</button>
										<button class="action-btn add-shelf" @tap="addToShelf">{{isBookmarked ? '移出书架' : '加入书架'}}</button>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
						<swiper-item class="swiper-item">
							<scroll-view :scroll-y="isLock" class="scroll-view-content"
								@scrolltolower="onReachBottom2">
								<view class="scroll-2-box">
									<view class="chapter-list">
										<view class="chapter-sort">
											<text class="sort-btn" :class="{active: sortOrder === 'asc'}"
												@tap="changeSortOrder('asc')">正序</text>
											<text class="sort-btn" :class="{active: sortOrder === 'desc'}"
												@tap="changeSortOrder('desc')">倒序</text>
										</view>
										<view class="chapter-item" v-for="(chapter, index) in chapterList" :key="chapter.id"
											@tap="readChapter(chapter.id)">
											<view class="chapter-info">
												<text class="chapter-title">第{{chapter.chapterNumber}}章 {{chapter.title}}</text>
												<text class="chapter-meta">{{formatDate(chapter.createdAt)}} · {{formatWordCount(chapter.wordCount)}}字</text>
											</view>
											<view class="chapter-status">
												<text v-if="chapter.isVip" class="vip-tag">VIP</text>
												<text class="chapter-arrow">></text>
											</view>
										</view>
									</view>
									<view class="load-more" @tap="loadMoreChapters" v-if="chapterDataLoad">
										<text>{{chapterMoreText}}</text>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		</view>
		<view class="loading" v-if="isLoading==0">
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
				AppStyle: this.$store.state.AppStyle,
				userInfo: null,
				token: "",
				group: "",
				novelId: '',
				novelData: {},
				isLoading: 0,
				isShare: false,
				shareof: 0,
				scrollTop: 0,
				isBookmarked: false,
				tablist: [{
						name: '详情'
					},
					{
						name: '目录'
					}
				],
				current: 0,
				swiperCurrent: 0,
				isLock: true,
				chapterList: [],
				chapterPage: 1,
				chapterDataLoad: true,
				chapterMoreText: "加载更多",
				sortOrder: 'asc',
				statusMap: {
					ongoing: {
						text: '连载中',
						color: '#19be6b'
					},
					completed: {
						text: '已完结',
						color: '#2979ff'
					},
					paused: {
						text: '暂停更新',
						color: '#ff6600'
					}
				}
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad(options) {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			if (localStorage.getItem('userinfo')) {
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.group = that.userInfo.group || '';
			}
			if (localStorage.getItem('token')) {
				that.token = localStorage.getItem('token');
			}
			// 支持两种参数格式：id 和 novel_id
			if (options.id) {
				that.novelId = options.id;
			} else if (options.novel_id) {
				that.novelId = options.novel_id;
			}
			
			if (that.novelId) {
				that.getNovelInfo();
				that.getChapterList();
				if (that.token) {
					that.checkBookmarkStatus();
				}
			}
		},
		onPullDownRefresh() {
			var that = this;
			if (that.novelId) {
				that.chapterPage = 1;
				that.chapterDataLoad = true;
				that.chapterMoreText = "加载更多";
				
				that.getNovelInfo();
				that.getChapterList();
				// 如果有token，刷新收藏状态
				if (that.token) {
					that.checkBookmarkStatus();
				}
				
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 1000);
			} else {
				uni.stopPullDownRefresh();
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			toShare() {
				this.isShare = true;
			},
			copyShare() {
				var that = this;
				var appname = that.$API.GetAppName();
				var url = that.shareof;
				var text = '分享小说【' + that.novelData.title + '】 - 来自于' + appname + ' | 链接：' + url;
				that.ToCopy(text);
				that.isShare = false;
			},
			goShare() {
				var that = this;
				var appname = that.$API.GetAppName();
				var url = that.shareof;
				var text = '分享小说【' + that.novelData.title + '】 - 来自于' + appname + ' | 链接：' + url;
				var summary = '分享小说【' + that.novelData.title + '】 - 来自于' + appname;
				
				// #ifdef APP-PLUS
				uni.shareWithSystem({
					type: 'text',
					href: url,
					title: that.novelData.title,
					summary: summary,
					success() {
						uni.showToast({
							title: '分享成功',
							icon: 'success'
						});
					},
					fail(err) {
						// 分享失败时复制到剪贴板
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
			getName(name) {
				if (!name) return '';
				return name.length > 8 ? name.substring(0, 8) + '...' : name;
			},
			getNovelInfo() {
				var that = this;
				uni.request({
					url: that.$API.PluginLoad('xqy_novel'),
					data: {
						action: 'getNovelInfo',
						plugin: 'xqy_novel',
						novel_id: that.novelId,
						token: that.token
					},
					method: 'GET',
					dataType: 'json',
					success(res) {
						if (res.data && res.data.code === 200) {
						const novelInfo = res.data.data;
						let tagList = [];
						if (novelInfo.tag_names && Array.isArray(novelInfo.tag_names)) {
							tagList = novelInfo.tag_names;
						} else if (novelInfo.tags) {
							try {
								tagList = JSON.parse(novelInfo.tags);
							} catch (e) {
								tagList = novelInfo.tags.split(',').filter(tag => tag.trim());
							}
						}
						that.novelData = {
							id: novelInfo.id,
							title: novelInfo.title,
							author: novelInfo.author,
							authorId: novelInfo.user_id,
							cover: novelInfo.cover_image || '/static/images/default_cover.png',
							description: novelInfo.description || '暂无简介',
							category: novelInfo.category_name || '未分类',
							chapterCount: novelInfo.chapter_count || 0,
							wordCount: novelInfo.word_count || 0,
							views: novelInfo.views || 0,
							rating: parseFloat(novelInfo.rating) || 0,
							userJson: {
								uid: novelInfo.user_id
							},

							type: novelInfo.type || 'original',
							publisher: novelInfo.publisher || novelInfo.source || '',
							tagList: tagList,
							status: that.getNovelStatus(novelInfo.updated_at),
							statusInfo: null
						};
				
							that.novelData.statusInfo = that.statusMap[that.novelData.status] || {
								text: '连载中',
								color: '#19be6b'
							};
				
							that.shareof = that.$API.GetWebUrl() + 'pages/plugins/xqy_novel/info?id=' + that.novelId;
					that.isLoading = 1;
						} else {
							uni.showToast({
								title: res.data?.msg || '获取小说信息失败',
								icon: 'none'
							});
							that.back();
						}
					},
					fail(error) {
				uni.showToast({
					title: '网络开小差了',
					icon: 'none'
				});
				that.back();
			}
				});
			},
			getChapterList(isPage = false) {
				var that = this;
				var page = that.chapterPage;
				if (isPage) {
					page++;
				}
				uni.request({
					url: that.$API.PluginLoad('xqy_novel'),
					data: {
						action: 'getChapterList',
						plugin: 'xqy_novel',
						novel_id: that.novelId,
						page: page,
						limit: 20,
						sort: 'chapter_number',
						order: that.sortOrder === 'asc' ? 'asc' : 'desc',
						token: that.token
					},
					method: 'GET',
					dataType: 'json',
					success(res) {
						if (res.data && res.data.code === 200) {
							const data = res.data.data.list || [];
							// 映射后台字段到前端字段
							const chapters = data.map(item => ({
								id: item.id,
								title: item.title,
								chapterNumber: item.chapter_number,
								wordCount: item.word_count || 0,
								createdAt: item.create_time,
								isVip: false // 暂时设为false，后续可添加VIP功能
							}));
							
							if (isPage) {
								if (chapters.length < 1) {
									that.chapterMoreText = '没有更多章节了';
									that.chapterDataLoad = false;
								} else {
									that.chapterList = [...that.chapterList, ...chapters];
									that.chapterPage = page;
								}
							} else {
								that.chapterList = chapters;
								that.chapterPage = 1;
								that.chapterDataLoad = true;
							}
						} else {
							uni.showToast({
								title: res.data?.msg || '获取章节列表失败',
								icon: 'none'
							});
						}
					},
					fail(error) {
				uni.showToast({
					title: '获取章节列表失败',
					icon: 'none'
				});
			}
				});
			},
			formatWordCount(count) {
				if (!count) {
					return '0';
				}
				if (count >= 10000) {
					return (count / 10000).toFixed(1) + '万';
				} else {
					return count.toString();
				}
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
			formatDate(dateStr) {
				if (!dateStr) return '';
				// 处理Unix时间戳（数字）或日期字符串
				let date;
				if (typeof dateStr === 'number' || /^\d+$/.test(dateStr)) {
					// Unix时间戳
					date = new Date(parseInt(dateStr) * 1000);
				} else {
		
					date = new Date(dateStr);
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
					return date.toLocaleDateString();
				}
			},
			tabsChange(index) {
				this.current = index;
				this.swiperCurrent = index;
			},
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.current = current;
				this.swiperCurrent = current;
			},
			sticky() {
				this.isLock = false;
			},
			unsticky() {
				this.isLock = true;
			},
			onReachBottom1() {
	
			},
			onReachBottom2() {
	
				this.loadMoreChapters();
			},
			loadMoreChapters() {
				if (this.chapterDataLoad) {
					this.chapterMoreText = "努力加载中...";
					this.getChapterList(true);
				}
			},
			changeSortOrder(order) {
				if (this.sortOrder !== order) {
					this.sortOrder = order;
					this.chapterPage = 1;
					this.chapterDataLoad = true;
					this.getChapterList();
				}
			},
			startReading() {
				if (this.chapterList.length === 0) {
					uni.showToast({
						title: "暂无章节",
						icon: 'none'
					});
					return;
				}
				
				// #ifdef H5
				// H5端直接跳转到第一章，不获取阅读进度
				const firstChapter = this.chapterList[0];
				this.readChapter(firstChapter.id);
				// #endif
				
				// #ifndef H5
				// APP端如果有token，先尝试获取上次阅读进度
				if (this.token) {
					this.getLastReadingProgressAndJump();
				} else {
					// 没有token，直接跳转到第一章
					const firstChapter = this.chapterList[0];
					this.readChapter(firstChapter.id);
				}
				// #endif
			},
			
			// 获取上次阅读进度并跳转（仅APP端）
			// #ifndef H5
			getLastReadingProgressAndJump() {
	
				
				uni.request({
					url: this.$API.PluginLoad('xqy_novel'),
					method: 'GET',
					data: {
						action: 'getLastReadingProgress',
						plugin: 'xqy_novel',
						novel_id: this.novelId,
						token: this.token
					},
					success: (res) => {
		
						
						if (res.data && res.data.code === 200 && res.data.data && res.data.data.chapter_id) {
					const progressData = res.data.data;
							
				
							this.readChapter(progressData.chapter_id);
						} else {
					// 没有阅读进度，跳转到第一章
					const firstChapter = this.chapterList[0];
					this.readChapter(firstChapter.id);
				}
					},
					fail: (error) => {
				// 获取失败，跳转到第一章
				const firstChapter = this.chapterList[0];
				this.readChapter(firstChapter.id);
			}
				});
			},
			// #endif
			readChapter(chapterId) {
				uni.navigateTo({
					url: './read?novelId=' + this.novelId + '&chapterId=' + chapterId
				});
			},
			checkBookmarkStatus() {
				var that = this;
				uni.request({
					url: that.$API.PluginLoad('xqy_novel'),
					method: 'GET',
					data: {
						action: 'checkBookmark',
						plugin: 'xqy_novel',
						novel_id: that.novelId,
						token: that.token
					},
					success(res) {
						if (res.data && res.data.code === 200) {
							that.isBookmarked = res.data.data.is_bookmarked;
						}
					},
					fail(error) {
			}
				});
			},
			addToShelf() {
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
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						action: 'toggleBookmark',
						plugin: 'xqy_novel',
						novel_id: that.novelId,
						token: that.token
					},
					success(res) {
						if (res.data && res.data.code === 200) {
							const isBookmarked = res.data.data.is_bookmarked;
							that.isBookmarked = isBookmarked;
							uni.showToast({
								title: isBookmarked ? "已加入书架" : "已移出书架",
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: res.data?.msg || '操作失败',
								icon: 'none'
							});
						}
					},
					fail(error) {
						uni.showToast({
							title: '网络开小差了',
							icon: 'none'
						});
					}
				});
			},
			goToComments() {
				uni.navigateTo({
					url: './comments?novelId=' + this.novelId
				});
			}
		},
	};
</script>

<style lang="scss" scoped>
	@import "@/static/styles/home.scss";

	.swiper-box {
		flex: 1;
		height: 100%;
		min-height: 400rpx;
	}

	.swiper-item {
		height: 100%;
	}

	.scroll-view-content {
		height: 100%;
		width: 100%;
	}

	.scroll-1-box,
	.scroll-2-box {
		min-height: 100%;
		padding-bottom: 40rpx;
	}

	.wrap {
		flex: 1;
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 400rpx;
	}

	.novel-top {
		display: flex;
		align-items: center;
	}

	.content-container {
		margin: 35rpx 15rpx 20rpx 15rpx;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		background-color: #ffffff;
	}

	.novelinfo-box {
		padding: 40rpx 0;
		display: flex;
		flex-direction: column;
		height: 100vh;
		min-height: 100vh;
		background-color: transparent;

		.novel-box-body {
			display: flex;
			align-items: flex-start;

			.novel-box-cover {
				margin-right: 30rpx;
			}

			.novelinfo-box-title {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 10rpx;
				line-height: 1.4;
			}

			.novel-status-tag {
				padding: 6rpx 16rpx;
				border-radius: 20rpx;
				color: white;
				font-size: 22rpx;
				margin-right: 10rpx;
			}

			.novel-type-tag {
				padding: 6rpx 16rpx;
				border-radius: 20rpx;
				background-color: #e8f4fd;
				color: #2979ff;
				border: 1rpx solid #2979ff;
				font-size: 22rpx;
				margin-right: 10rpx;
			}

			.novel-tag-item {
				padding: 4rpx 12rpx;
				border-radius: 16rpx;
				font-size: 20rpx;
				margin-right: 8rpx;
				margin-bottom: 8rpx;
				background-color: #f0f8ff;
				color: #3cc9a4;
				border: 1rpx solid #3cc9a4;
				display: inline-block;
			}
		}

		.list {
			padding: 30rpx 0;
			border-top: 1rpx solid #f0f0f0;
			border-bottom: 1rpx solid #f0f0f0;

			.item {
				display: flex;
				align-items: center;

				.text {
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 28rpx;

					text:first-child {
						font-weight: bold;
						margin-bottom: 8rpx;
					}

					text:last-child {
						color: #999;
						font-size: 24rpx;
					}
				}
			}
		}
	}

	.info-section {
		padding: 30rpx;

		.info-section-title {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			.title-text {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				margin-right: 20rpx;
			}

			.title-line {
				flex: 1;
				height: 2rpx;
				background-color: #e0e0e0;
			}
		}

		.info-content {
			font-size: 28rpx;
			line-height: 1.6;
			color: #666;
		}
	}

	.action-buttons {
		display: flex;
		padding: 30rpx;
		gap: 20rpx;

		.action-btn {
			flex: 1;
			height: 80rpx;
			border-radius: 40rpx;
			font-size: 30rpx;
			border: none;
			color: white;

			&.start-read {
				background-color: #3cc9a4;
			}

			&.add-shelf {
				background-color: #ff6600;
			}
		}
	}

	.chapter-list {
		padding: 20rpx;

		.chapter-sort {
			display: flex;
			justify-content: center;
			margin-bottom: 30rpx;
			padding: 10rpx;
			background-color: #f8f8f8;
			border-radius: 40rpx;

			.sort-btn {
				padding: 16rpx 40rpx;
				border-radius: 30rpx;
				font-size: 28rpx;
				color: #666;
				margin: 0 10rpx;
				transition: all 0.3s;

				&.active {
					background-color: #3cc9a4;
					color: white;
				}
			}
		}

		.chapter-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 20rpx;
			border-bottom: 1rpx solid #f0f0f0;

			.chapter-info {
				flex: 1;

				.chapter-title {
					font-size: 30rpx;
					color: #333;
					margin-bottom: 10rpx;
					display: block;
				}

				.chapter-meta {
					font-size: 24rpx;
					color: #999;
				}
			}

			.chapter-status {
				display: flex;
				align-items: center;

				.vip-tag {
					padding: 4rpx 12rpx;
					border-radius: 20rpx;
					background-color: #ff6600;
					color: white;
					font-size: 20rpx;
					margin-right: 10rpx;
				}

				.chapter-arrow {
					font-size: 24rpx;
					color: #ccc;
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

	.load-more {
		text-align: center;
		padding: 40rpx;
		color: #999;
		font-size: 28rpx;
	}
</style>