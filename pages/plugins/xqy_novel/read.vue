<template>
	<view class="reader-page" :style="{'background-color': '#f6f6f6', 'min-height': '100vh'}">
		<!-- H5端UI -->
		<!-- #ifdef H5 -->
		<view class="reader-container-h5" @click="handlePageClick">
			<!-- 头部 -->
			<view class="nav-bar" :class="{hidden: !showHeader}">
				<view class="nav-content">
					<view class="nav-left" @tap="back">
						<text class="icon-back">‹</text>
					</view>
					<view class="content text-bold">
						{{ loadingNovel ? '加载中...' : (bookInfo.title) }}
					</view>
				</view>
			</view>

			<!-- 内容区域 -->
			<view class="content-container-h5">
				<view class="chapter-main-title-h5">{{ loadingChapter ? '加载中...' : chapterDisplayTitle }}</view>
				<view class="novel-title-h5">本章字数：{{ loadingChapter ? '加载中...' : (currentChapter.word_count || '未知') }}字 更新时间：{{ loadingChapter ? '加载中...' : (formatUpdateTime(currentChapter.updated_at) || '未知') }}</view>

				<scroll-view class="chapter-content-h5" scroll-y @scroll="onH5Scroll">
					<view class="rich-text-container" :style="{ fontSize: fontSize + 'px' }">
						<view v-if="loadingChapter" class="loading-text">正在加载章节内容...</view>
						<rich-text v-else :nodes="processedContent" class="rich-content"></rich-text>
					</view>
				</scroll-view>
				
				<!-- 右侧工具栏 -->
				<view class="right-toolbar" :style="{ opacity: toolbarOpacity }">
					<view class="toolbar-btn" @click.stop="toggleCatalogH5">
						<view class="toolbar-icon">≡</view>
						<view>目录</view>
					</view>
					<view class="toolbar-btn" @click.stop="addToBookshelf">
						<view class="toolbar-icon">{{ isBookmarked ? '✓' : '➕' }}</view>
						<view>{{ isBookmarked ? '已收藏' : '书架' }}</view>
					</view>
					<view class="toolbar-btn" @click.stop="showFontSizeSlider = !showFontSizeSlider">
						<view class="toolbar-icon">A</view>
						<view>字号</view>
					</view>
				</view>
			</view>

			<!-- H5端字号滑动条 -->
			<view class="font-size-slider-container" v-if="showFontSizeSlider" @click.stop>
				<view class="slider-header">
					<text class="slider-title">字号调整</text>
					<text class="close-btn" @click="showFontSizeSlider = false">×</text>
				</view>
				<view class="slider-content">
					<text class="size-label">A</text>
					<slider 
						:value="fontSize" 
						:min="12" 
						:max="24" 
						:step="1" 
						@change="onFontSizeChange"
						class="font-slider"
					/>
					<text class="size-label large">A</text>
				</view>
				<view class="current-size">当前字号: {{ fontSize }}px</view>
			</view>

			<!-- H5端章节目录弹窗 -->
			<view class="catalog-overlay-h5" v-if="showCatalogH5" @click="showCatalogH5 = false">
				<view class="catalog-modal-h5" @click.stop>
					<view class="catalog-header-h5">
						<view class="catalog-title-section">
							<text class="catalog-title-h5">目录</text>
							<text class="catalog-subtitle">共{{ chapterList.length }}章</text>
						</view>
						<view class="catalog-close-h5" @click="showCatalogH5 = false">
							<text class="close-icon">×</text>
						</view>
					</view>
					<scroll-view class="catalog-list-h5" scroll-y :scroll-into-view="'chapter-' + currentChapter.id">
						<view class="catalog-item-h5" 
							v-for="(chapter, index) in chapterList" 
							:key="chapter.id"
							:id="'chapter-' + chapter.id"
							:class="{current: chapter.id === currentChapter.id}"
							@click="goToChapterFromCatalogH5(chapter.id)">
							<view class="chapter-info-h5">
								<text class="chapter-number">{{ index + 1 }}</text>
								<view class="chapter-details">
									<text class="chapter-title-text">{{ chapter.title }}</text>
									<text class="chapter-meta">{{ formatWordCount(chapter.word_count) }}字</text>
								</view>
							</view>
							<view class="chapter-status-h5" v-if="chapter.id === currentChapter.id">
								<text class="current-indicator">正在阅读</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

			<!-- 底部 -->
			<view class="reader-footer-h5">
				<view class="nav-buttons-h5">
					<button v-if="prevChapter" @click="goToChapter('prev')">上一章</button>
					<button v-if="nextChapter" @click="goToChapter('next')">下一章</button>
				</view>
			</view>
		</view>
		<!-- #endif -->
		
		<!-- #ifndef H5 -->
		<view class="reader-container-app">
			<!-- 头部导航 -->
			<view class="nav-bar" :class="{hidden: !showHeader}">
				<view class="nav-content" :style="[{height: CustomBar + 'px', 'padding-top': StatusBar + 'px'}]">
					<view class="nav-left" @tap="back">
						<text class="icon-back">‹</text>
					</view>
					<view class="content text-bold">
						{{ loadingNovel ? '加载中...' : bookInfo.title }}
					</view>
					
				</view>
			</view>
			
			<!-- 阅读内容区域 -->
			<view class="reading-area" @tap="toggleHeaderFooter" :style="[{height: 'calc(100vh - ' + (showFooter ? '140px' : '0px') + ')', 'padding-top': (showHeader ? (CustomBar + StatusBar) : 20) + 'px', 'padding-bottom': '20px'}]">
				<!-- 章节标题 -->
				<view class="chapter-header" :style="{'margin-top': !showHeader ? (StatusBar + 10) + 'px' : '0'}">
					<text class="chapter-title">{{ loadingChapter ? '加载中...' : chapterDisplayTitle }}</text>
					<text class="chapter-info">字数：{{ loadingChapter ? '...' : (currentChapter.word_count || '未知') }} | 更新：{{ loadingChapter ? '...' : (formatUpdateTime(currentChapter.updated_at) || '未知') }}</text>
				</view>
				
				<!-- 分页内容 -->
				<swiper 
					class="content-swiper" 
					:current="currentPage" 
					@change="onPageChange"
					@touchstart="onTouchStart"
					@touchend="onTouchEnd"
					:circular="false"
					:duration="300"
					:easing-function="'ease-out'"
				>
					<swiper-item v-for="(page, index) in pageContents" :key="index" class="swiper-page">
						<scroll-view class="page-scroll" scroll-y="false">
							<view class="page-content" 
							:style="{
								fontSize: fontSize + 'px',
								lineHeight: lineHeight,
								padding: contentPadding + 'px'
							}">
								<view v-if="loadingChapter" class="loading-container">
									<text class="loading-text">正在加载章节内容...</text>
								</view>
								<rich-text v-else :nodes="page" class="rich-content"></rich-text>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
				
				<!-- 页码指示器 -->
				<view class="page-indicator" v-if="totalPages > 1">
					<text class="page-info">{{ currentPage + 1 }} / {{ totalPages }}</text>
				</view>
			</view>
			
			<!-- 底部工具栏 -->
			<view class="app-footer" :class="{visible: showFooter}">
				<view class="footer-safe-area">
					<view class="main-toolbar">
						<view class="tool-item" :class="{disabled: !prevChapter}" @tap="goToChapter('prev')">
							<text class="tool-icon">‹</text>
							<text class="tool-text">上一章</text>
						</view>
						<view class="tool-item" @tap="toggleCatalog">
							<text class="tool-icon">≡</text>
							<text class="tool-text">目录</text>
						</view>
						<view class="tool-item" @tap="addToBookshelf">
							<text class="tool-icon">{{ isBookmarked ? '★' : '☆' }}</text>
							<text class="tool-text">{{ isBookmarked ? '已收藏' : '收藏' }}</text>
						</view>
						<view class="tool-item" @tap="toggleSettings">
							<text class="tool-icon">⚙</text>
							<text class="tool-text">设置</text>
						</view>
						<view class="tool-item" :class="{disabled: !nextChapter}" @tap="goToChapter('next')">
							<text class="tool-icon">›</text>
							<text class="tool-text">下一章</text>
						</view>
					</view>
					
					<!-- 设置面板 -->
					<view class="settings-panel" v-if="showSettings">
						<view class="setting-row">
							<text class="setting-label">字体大小</text>
							<view class="setting-options">
								<view class="setting-btn" @tap="changeFontSize(-1)">
									<text>A-</text>
								</view>
								<view class="font-size-display">
									<text>{{ fontSize }}px</text>
								</view>
								<view class="setting-btn" @tap="changeFontSize(1)">
									<text>A+</text>
								</view>
							</view>
						</view>
						
						<view class="setting-row">
							<text class="setting-label">行间距</text>
							<view class="setting-options">
								<view class="setting-btn" @tap="changeLineHeight(-0.1)">
									<text>-</text>
								</view>
								<view class="font-size-display">
									<text>{{ lineHeight }}</text>
								</view>
								<view class="setting-btn" @tap="changeLineHeight(0.1)">
									<text>+</text>
								</view>
							</view>
						</view>
						
						<view class="setting-row">
							<text class="setting-label">页面边距</text>
							<view class="setting-options">
								<view class="setting-btn" @tap="changePadding(-5)">
									<text>-</text>
								</view>
								<view class="font-size-display">
									<text>{{ contentPadding }}px</text>
								</view>
								<view class="setting-btn" @tap="changePadding(5)">
									<text>+</text>
								</view>
							</view>
						</view>
						

					</view>
				</view>
			</view>
			
			<!-- 目录弹窗 -->
			<view class="catalog-overlay" v-if="showCatalog" @tap="showCatalog = false">
				<view class="catalog-modal" @tap.stop>
					<view class="catalog-header">
						<text class="catalog-title">目录</text>
						<view class="catalog-close" @tap="showCatalog = false">
							<text>×</text>
						</view>
					</view>
					<scroll-view class="catalog-list" scroll-y>
						<view class="catalog-item" 
							v-for="(chapter, index) in chapterList" 
							:key="chapter.id"
							:class="{current: chapter.id === currentChapter.id}"
							@tap="goToChapterFromCatalog(chapter.id)">
							<text class="chapter-index">{{ index + 1 }}</text>
							<text class="chapter-title">{{ chapter.title }}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- #endif -->

	</view>
</template>

<script>
import Vue from 'vue'
import {
	localStorage
} from '../../../js_sdk/mp-storage/mp-storage/index.js'

export default {
	
	data() {
			return {
	
				_isDestroyed: false,
				
	
				StatusBar: 0,
				CustomBar: 0,
				NavBar: 0,
				
	
				// H5端数据
				lastScrollTop: 0,
				toolbarOpacity: 0.5,
				showFontSizeSlider: false,
				showCatalogH5: false,

				// APP端数据
			currentPage: 0,
			totalPages: 1,
			pageContents: [],
			touchStartX: null,
			touchStartY: null,
			touchStartTime: null,
			targetPageAfterChapterLoad: 0,
			
			// #ifndef H5
			volumeKeyHandler: null,
			volumeLongPressHandler: null,
			// #endif

				showHeader: true,
				showFooter: true,
				showCatalog: false,
				showSettings: false,
				
	
				fontSize: 16,
				lineHeight: 1.8,
				contentPadding: 20,
				
				bookInfo: {},
				currentChapter: {},
				chapterList: [],
				prevChapter: null,
				nextChapter: null,
				
				loadingChapter: false,
				loadingNovel: false,
				loadingChapterList: false,
				
	
				isBookmarked: false,
			
		token: ''
		}
		},
	
	computed: {
		
		chapterDisplayTitle() {
			if (!this.currentChapter.title) {
				return '';
			}
			if (this.currentChapter.title.includes('第') && this.currentChapter.title.includes('章')) {
				return this.currentChapter.title;
			}
			// 确保chapterList是数组
			if (!Array.isArray(this.chapterList)) {
				return this.currentChapter.title;
			}
			// 获取当前章节在列表中的序号
			const currentIndex = this.chapterList.findIndex(chapter => chapter.id === this.currentChapter.id);
			const chapterNumber = currentIndex !== -1 ? currentIndex + 1 : 1;
			return `第${chapterNumber}章 ${this.currentChapter.title}`;
		},
		
		
		processedContent() {
			const content = this.currentChapter.content || '';
			if (typeof content === 'string') {
				return content;
			}
			// 如果内容是其他格式，转换为字符串
			return content.toString();
		},
		
		cleanContent() {
			const content = this.currentChapter.content || '';
			let contentStr = typeof content === 'string' ? content : content.toString();
			// 去除HTML标签，只保留纯文本内容
			return contentStr.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
		}
	},
	
	onLoad(options) {
		
		this._isDestroyed = false;
		
		
		this.StatusBar = uni.getSystemInfoSync().statusBarHeight;
		this.CustomBar = this.StatusBar + 44;
		
		// 初始化token
		if (process.env.VUE_APP_PLATFORM === 'h5') {
			if (localStorage.getItem('token')) {
				this.token = localStorage.getItem('token');
			}
		} else {
			// APP端初始化
			if (uni.getStorageSync('token')) {
				this.token = uni.getStorageSync('token');
			}
		}
		
		if (options.novelId) {
			this.bookInfo.id = options.novelId;
		}
		if (options.chapterId) {
			this.currentChapter.id = options.chapterId;
		}
		
		if (!this.bookInfo.id && uni.getStorageSync('currentBookId')) {
			this.bookInfo.id = uni.getStorageSync('currentBookId');
		}
		if (!this.currentChapter.id && uni.getStorageSync('currentChapterId')) {
			this.currentChapter.id = uni.getStorageSync('currentChapterId');
		}
		
		this.loadReadingSettings();
		
		// 确保书籍信息和章节列表都能加载
		if (this.bookInfo.id) {
			this.getNovelInfo();
			this.getChapterList();

			if (this.token) {
				this.checkBookmarkStatus();
			}
			
			// #ifdef H5
			// H5端不获取阅读进度，直接使用传入的章节ID或获取第一章
			if (this.currentChapter.id) {
				this.getChapterInfo();
			} else {
				this.getFirstChapter();
			}
			// #endif
			
			// #ifndef H5
			if (options.chapterId && this.currentChapter.id) {
				this.getChapterInfo();
			} else if (this.token) {
				this.getLastReadingProgress();
			} else if (this.currentChapter.id) {
				this.getChapterInfo();
			} else {
				this.getFirstChapter();
			}
			// #endif
		} else if (this.currentChapter.id) {
			// 如果没有小说ID但有章节ID，直接获取章节信息
			this.getChapterInfo();
		}
	},
	
	onHide() {
		// 页面隐藏时保存阅读设置
		this.saveReadingSettings();
	},
	
	onUnload() {
		
		this.saveReadingSettings();
		
		
		this._clearAllTimers();
		
		// 最后标记实例为已销毁状态
		this._isDestroyed = true;
	},
	
	methods: {
		
		_isInstanceValid() {
			try {
				// 简化检查，只检查关键状态
				return !this._isDestroyed && this.$options && typeof this.$data === 'object';
			} catch (error) {
				// 如果访问出错，说明实例已经不可用
				return false;
			}
		},

		// #ifdef H5
		onH5Scroll(e) {
			const scrollTop = e.detail.scrollTop;
			this.showHeader = true;
			this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
		},
		
		handlePageClick() {
			if (!this._isInstanceValid()) return;
			
			this.toolbarOpacity = 1;
			setTimeout(() => {
				if (!this._isInstanceValid()) return;
				this.toolbarOpacity = 0.5;
			}, 2000);
		},
		

		
		onFontSizeChange(e) {
			this.fontSize = e.detail.value;
			this.saveReadingSettings();

			this.$nextTick(() => {
				if (this._isInstanceValid()) {
					this.$forceUpdate();
				}
			});
		},

		// #endif
		
		
		checkBookmarkStatus() {
			if (!this._isInstanceValid() || !this.bookInfo.id || !this.token) {
				return;
			}

		uni.request({
				url: this.$API.PluginLoad('xqy_novel'),
				method: 'GET',
				data: {
					action: 'checkBookmark',
					plugin: 'xqy_novel',
					novel_id: this.bookInfo.id,
					token: this.token
				},
				success: (res) => {
					if (!this._isInstanceValid()) return;
					if (res.data && res.data.code === 200) {
						this.isBookmarked = res.data.data.is_bookmarked;
					}
				},
				fail: (error) => {
					if (!this._isInstanceValid()) return;
				}
			});
		},

		back() {
			// 检查是否从info页面进入，如果是则返回info页面
			const pages = getCurrentPages();
			if (pages.length >= 2) {
				const prevPage = pages[pages.length - 2];
				// 如果上一页是info页面，直接返回
				if (prevPage.route && prevPage.route.includes('info')) {
					uni.navigateBack();
					return;
				}
			}
			
			// 否则返回到info页面
			if (this.bookInfo.id) {
				uni.redirectTo({
					url: './info?id=' + this.bookInfo.id
				});
			} else {
				uni.navigateBack();
			}
		},
		
		showMenu() {

		},
		getChapterInfo() {
			if (!this._isInstanceValid()) return;
			
			this.loadingChapter = true;
			uni.request({
				url: this.$API.PluginLoad('xqy_novel'),
				data: {
					action: 'getChapterInfo',
					plugin: 'xqy_novel',
					id: this.currentChapter.id,
					token: this.token
				},
				method: 'GET',
				dataType: 'json',
				success: (res) => {
					if (!this._isInstanceValid()) return;
					
					this.loadingChapter = false;
					if (res.data && res.data.code === 200) {
					this.currentChapter = res.data.data;
				uni.setStorageSync('currentChapterId', this.currentChapter.id);
				if (res.data.data.novel_id) {
			if (!this.bookInfo.id) {
				this.bookInfo.id = res.data.data.novel_id;
				uni.setStorageSync('currentBookId', this.bookInfo.id);
				this.getNovelInfo();
				this.getChapterList();
			}
			if (this.token) {
				this.checkBookmarkStatus();
			}
		}
		
					this.increaseChapterViews();
				this.updatePrevNextChapter();
					

			
			// #ifdef H5
			// H5端重置滚动位置到顶部
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.chapter-content-h5').scrollOffset((res) => {
					if (res) {
						// 通过设置scrollTop为0来重置滚动位置
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 0
						});
					}
				}).exec();
			});
			// #endif
			
			// #ifndef H5
			// APP端处理章节内容分页
			this.$nextTick(() => {
				if (!this._isInstanceValid()) return;
				
				this.processChapterContent();
				// 如果有目标页码，跳转到指定页
				if (this.targetPageAfterChapterLoad !== undefined) {
					if (this.targetPageAfterChapterLoad === -1) {
			
						this.currentPage = Math.max(0, this.totalPages - 1);
					} else {
						this.currentPage = Math.max(0, Math.min(this.targetPageAfterChapterLoad, this.totalPages - 1));
					}
					this.targetPageAfterChapterLoad = undefined;
				} else {
		
					if (this.token) {
						this.restoreFromCache().catch(error => {
						});
					}
				}
			});
			// #endif
					} else {
						uni.showToast({
							title: res.data?.message || res.data?.msg || '获取章节信息失败',
							icon: 'none'
						});
					}
				},
				fail: (error) => {
					if (!this._isInstanceValid()) return;
					
					this.loadingChapter = false;
					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					});
				}
			});
		},
		
		
		getNovelInfo() {
			if (!this._isInstanceValid()) return;
			
			this.loadingNovel = true;
			uni.request({
				url: this.$API.PluginLoad('xqy_novel'),
				data: {
					action: 'getNovelInfo',
					plugin: 'xqy_novel',
					id: this.bookInfo.id,
					token: this.token
				},
				method: 'GET',
				dataType: 'json',
				success: (res) => {
					if (!this._isInstanceValid()) return;
					
					this.loadingNovel = false;
					if (res.data && res.data.code === 200) {
						this.bookInfo = res.data.data;
					} else {
						uni.showToast({
							title: res.data?.message || res.data?.msg || '获取小说信息失败',
							icon: 'none'
						});
					}
				},
				fail: (error) => {
					if (!this._isInstanceValid()) return;
					
					this.loadingNovel = false;

					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					});
				}
			});
		},
		
		
		getChapterList() {
			if (!this._isInstanceValid()) return;
			
			this.loadingChapterList = true;
			uni.request({
				url: this.$API.PluginLoad('xqy_novel'),
				data: {
					action: 'getChapterList',
					plugin: 'xqy_novel',
					novel_id: this.bookInfo.id,
					limit: 1000,
					token: this.token
				},
				method: 'GET',
				dataType: 'json',
				success: (res) => {
					if (!this._isInstanceValid()) return;
					
					this.loadingChapterList = false;
					if (res.data && res.data.code === 200) {
						const chapterData = res.data.data && res.data.data.list ? res.data.data.list : [];
						this.chapterList = Array.isArray(chapterData) ? chapterData : [];
						this.updatePrevNextChapter();
					} else {
						uni.showToast({
							title: res.data?.message || res.data?.msg || '获取章节列表失败',
							icon: 'none'
						});
					}
				},
				fail: (error) => {
					if (!this._isInstanceValid()) return;
					
					this.loadingChapterList = false;
					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					});
				}
			});
		},
		
		
		goToChapter(chapterId, fromGesture = false) {
			
			let newChapterId = null;
			let targetPage = 0;
			
			if (chapterId === 'prev' && this.prevChapter) {
				newChapterId = this.prevChapter.id;
				targetPage = fromGesture ? -1 : 0;
				
			} else if (chapterId === 'next' && this.nextChapter) {
				newChapterId = this.nextChapter.id;
				targetPage = 0;
				
			} else if (typeof chapterId === 'string' && chapterId !== 'prev' && chapterId !== 'next') {
				newChapterId = chapterId;
				targetPage = 0;
				
			} else if (typeof chapterId === 'number') {
				newChapterId = chapterId.toString();
				targetPage = 0;
				
			}

			if (newChapterId && newChapterId !== this.currentChapter.id) {

				this.currentChapter.id = newChapterId;
				// 保存目标页码，在章节内容加载完成后设置
				this.targetPageAfterChapterLoad = targetPage;
				this.getChapterInfo();
			} else {

			}
			
			this.showCatalog = false;
		},

		
		updatePrevNextChapter() {
			if (!Array.isArray(this.chapterList)) {
				this.chapterList = [];
				return;
			}
			
			// 确保ID类型一致进行比较
			const currentChapterId = String(this.currentChapter.id);
			const currentIndex = this.chapterList.findIndex(chapter => String(chapter.id) === currentChapterId);
			
			if (currentIndex !== -1) {
				this.prevChapter = currentIndex > 0 ? this.chapterList[currentIndex - 1] : null;
				this.nextChapter = currentIndex < this.chapterList.length - 1 ? this.chapterList[currentIndex + 1] : null;
			} else {
				this.prevChapter = null;
				this.nextChapter = null;
			}
		},
		
		
		changeFontSize(delta) {
			this.fontSize = Math.max(12, Math.min(24, this.fontSize + delta));
			this.saveReadingSettings();
		},

		changeLineHeight(delta) {
			this.lineHeight = Math.max(1.2, Math.min(2.0, this.lineHeight + delta));
			this.lineHeight = Math.round(this.lineHeight * 10) / 10;
			this.saveReadingSettings();
			if (process.env.VUE_APP_PLATFORM !== 'h5') {
				this.recalculatePagination();
			}
		},

		changePadding(delta) {
			this.contentPadding = Math.max(10, Math.min(40, this.contentPadding + delta));
			this.saveReadingSettings();
			if (process.env.VUE_APP_PLATFORM !== 'h5') {
				this.recalculatePagination();
			}
		},

		saveReadingSettings() {
			const settings = {
				fontSize: this.fontSize,
				lineHeight: this.lineHeight,
				contentPadding: this.contentPadding
			};
			uni.setStorageSync('readingSettings', settings);
		},

		loadReadingSettings() {
			const settings = uni.getStorageSync('readingSettings');
			if (settings) {
				this.fontSize = settings.fontSize || 12;
				this.lineHeight = settings.lineHeight || 1.6;
				this.contentPadding = settings.contentPadding || 20;
			}
		},

		formatTime(date) {
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			return `${hours}:${minutes}`;
		},

		formatUpdateTime(dateTimeString) {
			if (!dateTimeString) {
				return '';
			}
			if (dateTimeString.includes(' ')) {
				return dateTimeString.split(' ')[0];
			}
			return dateTimeString;
		},

		calculateTotalPages() {
			const content = this.cleanContent;
			if (!content) {
				this.totalPages = 1;
				return;
			}
			
			const charsPerPage = this.getCharsPerPage();
			this.totalPages = Math.max(1, Math.ceil(content.length / charsPerPage));

			if (this.currentPage >= this.totalPages) {
				this.currentPage = Math.max(0, this.totalPages - 1);
			}
		},

		toggleCatalog() {
			this.showCatalog = !this.showCatalog;
		},

		toggleCatalogH5() {
			this.showCatalogH5 = !this.showCatalogH5;
			if (this.showCatalogH5 && this.chapterList.length === 0) {
				this.getChapterList();
			}
		},

		goToChapterFromCatalogH5(chapterId) {
			this.currentChapter.id = chapterId;
			this.getChapterInfo();
			this.showCatalogH5 = false;
			this.updatePrevNextChapter();

			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.chapter-content-h5').node((res) => {
					if (res && res.node) {
						res.node.scrollTop = 0;
					}
				}).exec();
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

		toggleSettings() {
			this.showSettings = !this.showSettings;
		},

		recalculatePagination() {
			this.$nextTick(() => {
				this.calculateTotalPages();
	
				if (this.currentPage >= this.totalPages) {
					this.currentPage = Math.max(0, this.totalPages - 1);
				}
			});
		},

		goToChapterFromCatalog(chapterId) {
			if (!chapterId) {
				return;
			}
			this.goToChapter(chapterId);
			this.showCatalog = false;
		},

		showModeAlert(mode) {
			const modeText = mode === 'slide' ? '平移模式' : '上下滑动模式';
			uni.showToast({
				title: `当前已是${modeText}`,
				icon: 'none'
			});
		},

		toggleHeaderFooter() {
			this.showHeader = !this.showHeader;
			this.showFooter = !this.showFooter;
			if (!this.showHeader && !this.showFooter) {
				this.showSettings = false;
				this.showCatalog = false;
			}
		},

		addToBookshelf() {
			if (!this._isInstanceValid()) return;
			
			if (!this.token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}
			
			if (!this.bookInfo.id) {
				uni.showToast({
					title: '书籍信息不完整',
					icon: 'none'
				});
				return;
			}
			
			uni.request({
				url: this.$API.PluginLoad('xqy_novel'),
				method: 'POST',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: {
						action: 'toggleBookmark',
						plugin: 'xqy_novel',
						novel_id: this.bookInfo.id,
						token: this.token
					},
				success: (res) => {
					if (!this._isInstanceValid()) return;
					
					if (res.data && res.data.code === 200) {
						this.isBookmarked = !this.isBookmarked;
						uni.showToast({
							title: this.isBookmarked ? '已添加到书架' : '已从书架移除',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: res.data?.message || '操作失败',
							icon: 'none'
						});
					}
				},
				fail: (error) => {
					if (!this._isInstanceValid()) return;
					
					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					});
				}
			});
		},
		
		
		onPageChange(e) {
			if (e && e.detail && typeof e.detail.current !== 'undefined' && e.detail.current !== null) {
				this.currentPage = e.detail.current;
				
	
				if (this.token && this.currentChapter.id) {
					// #ifndef H5
					this.saveReadingProgress();
					// #endif
				}
			}
		},
		
		// #ifndef H5
		// APP端专用方法
		
		
		processChapterContent() {
			if (!this.currentChapter.content) {
				this.pageContents = [];
				this.totalPages = 1;
				return;
			}
			
			const content = this.currentChapter.content;
			if (!content) {
				this.pageContents = [];
				this.totalPages = 1;
				return;
			}
			

			const charsPerPage = this.getCharsPerPage();
			const pages = [];
			
			// 按HTML段落分割内容
			const paragraphs = content
				// 首先替换掉所有的换行为统一的\n
				.replace(/\r\n?/g, '\n')
				// 处理HTML段落
				.split(/(?:\n|<\/p>|<\/div>)+/)
				.map(p => {
					p = p.trim()
						// 清理HTML标签开头
						.replace(/^<p>|^<div>/i, '')
						// 清理HTML标签结尾
						.replace(/<\/p>$|<\/div>$/i, '')
						.trim();
					
					// 如果段落不包含HTML标签，添加p标签
					if (p && !/<[^>]+>/.test(p)) {
						return `<p>${p}</p>`;
					}
					// 如果段落包含HTML标签，确保外层有p标签
					if (p && !/<p|<div/i.test(p)) {
						return `<p>${p}</p>`;
					}
					return p;
				})
				.filter(p => p);
			
			let currentPageContent = '';
			let currentPageLength = 0;
			
			for (let i = 0; i < paragraphs.length; i++) {
				const paragraph = paragraphs[i];
				if (!paragraph) continue;
				
				// 计算纯文本长度（移除HTML标签）
				const textLength = paragraph.replace(/<[^>]+>/g, '').length;
				
				// 检查当前页是否能容纳这个段落
				if (currentPageLength + textLength + 4 <= charsPerPage) {
					// 可以容纳，添加到当前页
					if (currentPageContent) {
						currentPageContent += '\n';
					}
					currentPageContent += paragraph;
					currentPageLength += textLength + 4;
				} else {
					// 不能容纳，保存当前页并开始新页
					if (currentPageContent) {
						pages.push(this.formatPageContent(currentPageContent));
					}
					
					// 检查段落是否过长需要分割
					if (textLength > charsPerPage) {
			
						const pureText = paragraph.replace(/<[^>]+>/g, '');

						const chunks = this.splitLongParagraph(pureText, charsPerPage);
						for (let j = 0; j < chunks.length - 1; j++) {
							pages.push(this.formatPageContent(`<p>${chunks[j]}</p>`));
						}
						currentPageContent = `<p>${chunks[chunks.length - 1]}</p>`;
						currentPageLength = chunks[chunks.length - 1].length;
					} else {
						currentPageContent = paragraph;
						currentPageLength = textLength;
					}
				}
			}
			

			if (currentPageContent) {
				pages.push(this.formatPageContent(currentPageContent));
			}
			
			this.pageContents = pages.length > 0 ? pages : [this.formatPageContent('<p>暂无内容</p>')];
			this.totalPages = this.pageContents.length;
			
			// 确保当前页在有效范围内
			if (this.currentPage >= this.totalPages) {
				this.currentPage = Math.max(0, this.totalPages - 1);
			}
		},
		
		
		getCharsPerPage() {

			let baseChars = 800;
			

			const fontSizeRatio = 16 / this.fontSize;
			baseChars = Math.floor(baseChars * fontSizeRatio);
			

			const lineHeightRatio = 1.8 / this.lineHeight;
			baseChars = Math.floor(baseChars * lineHeightRatio);
			

			const paddingRatio = (40 - this.contentPadding) / 20;
			baseChars = Math.floor(baseChars * (1 + paddingRatio * 0.2));
			
			return Math.max(200, Math.min(1500, baseChars));
		},
		
		
		splitLongParagraph(paragraph, maxChars) {
			const chunks = [];
			let remaining = paragraph;
			
			while (remaining.length > maxChars) {
				// 寻找合适的分割点（优先在句号、问号、感叹号处分割）
				let splitIndex = maxChars;
				for (let i = Math.min(maxChars - 50, remaining.length - 1); i >= Math.max(maxChars - 200, 0); i--) {
					if (/[。！？；]/.test(remaining[i])) {
						splitIndex = i + 1;
						break;
					}
				}
				
				// 如果没找到合适的分割点，就在逗号处分割
				if (splitIndex === maxChars) {
					for (let i = Math.min(maxChars - 20, remaining.length - 1); i >= Math.max(maxChars - 100, 0); i--) {
						if (/[，、]/.test(remaining[i])) {
							splitIndex = i + 1;
							break;
						}
					}
				}
				
				chunks.push(remaining.substring(0, splitIndex));
				remaining = remaining.substring(splitIndex);
			}
			
			if (remaining) {
				chunks.push(remaining);
			}
			
			return chunks;
		},
		
		// 格式化页面内容为富文本节点
		formatPageContent(content) {
			if (!content) return [];
			
			// 使用正则表达式处理HTML内容
			const nodes = [];
			

			const paragraphs = content.split(/\n+/).filter(p => p.trim());
			
			paragraphs.forEach(paragraph => {
				if (paragraph.trim()) {
					// 检查是否包含HTML标签
					if (/<[^>]+>/.test(paragraph)) {
						// 处理HTML段落
						const node = {
							type: 'node',
							name: 'p',
							attrs: {
								style: 'text-indent: 2em; margin-bottom: 1em; line-height: inherit;'
							},
							children: [{
								type: 'text',
								text: paragraph.replace(/<[^>]+>/g, '')
							}]
						};
						nodes.push(node);
					} else {
			
						const node = {
							type: 'node',
							name: 'p',
							attrs: {
								style: 'text-indent: 2em; margin-bottom: 1em; line-height: inherit;'
							},
							children: [{
								type: 'text',
								text: paragraph.trim()
							}]
						};
						nodes.push(node);
					}
				}
			});
			
			return nodes;
		},
		
		
		onTouchStart(e) {
			if (e && e.touches && e.touches[0] && e.touches[0].clientX !== null && e.touches[0].clientY !== null) {
				this.touchStartX = e.touches[0].clientX;
				this.touchStartY = e.touches[0].clientY;
				this.touchStartTime = Date.now();
			}
		},
		
		
		onTouchEnd(e) {
			if (!e || !e.changedTouches || !e.changedTouches[0] || 
				e.changedTouches[0].clientX === null || e.changedTouches[0].clientY === null ||
				this.touchStartX === null || this.touchStartY === null ||
				this.touchStartTime === null) {
				return;
			}
			
			const touchEndX = e.changedTouches[0].clientX;
			const touchEndY = e.changedTouches[0].clientY;
			const deltaX = touchEndX - this.touchStartX;
			const deltaY = touchEndY - this.touchStartY;
			const touchDuration = Date.now() - this.touchStartTime;
			const swipeSpeed = Math.abs(deltaX) / touchDuration;
			
			// 判断是否为有效滑动（水平滑动距离大于垂直滑动距离，且滑动距离足够）
			if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
				// 滑动速度阈值（像素/毫秒）
				const SPEED_THRESHOLD = 0.8;
				// 触摸持续时间阈值（毫秒）
				const DURATION_THRESHOLD = 300;
				
				// 只在滑动速度较慢且触摸时间足够长时才触发章节切换
				if (swipeSpeed < SPEED_THRESHOLD && touchDuration > DURATION_THRESHOLD) {
					// 只在最后一页时允许滑动切换到下一章
					if (deltaX < 0 && this.currentPage === this.totalPages - 1 && this.nextChapter) {
						// 左滑到最后一页时，跳转到下一章第一页
						this.goToChapter('next', true);
					} else if (deltaX > 0 && this.currentPage === 0 && this.prevChapter) {
						// 右滑到第一页时，跳转到上一章最后一页
						this.goToChapter('prev', true);
					}
				}
			}
		},
		
		
		saveReadingProgress() {
			if (!this._isInstanceValid() || !this.token || !this.currentChapter.id || !this.bookInfo.id) {
				return;
			}
			

			
			uni.request({
				url: this.$API.PluginLoad('xqy_novel'),
				method: 'POST',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: {
					action: 'updateReadingProgress',
					plugin: 'xqy_novel',
					novel_id: this.bookInfo.id,
					chapter_id: this.currentChapter.id,
					current_page: this.currentPage,
					total_pages: this.totalPages,
					font_size: this.fontSize,
					line_height: this.lineHeight,
					content_padding: this.contentPadding,
					token: this.token
				},
				success: (res) => {
					if (this._isInstanceValid()) {

						if (res.data && res.data.code === 200) {
						} else {
						}
					}
				},
				fail: (error) => {
					if (this._isInstanceValid()) {
					}
				}
			});
		},
		// #endif
		

		

		

		

		
		
		cacheReadingProgress() {
			if (!this.currentChapter.id || !this.bookInfo.id) return;
			
			const progressData = {
				novel_id: this.bookInfo.id,
				chapter_id: this.currentChapter.id,
				font_size: this.fontSize,
				timestamp: Date.now()
			};
			
			// #ifdef H5
			// H5端只缓存章节信息
			localStorage.setItem('xqy_novel_progress_cache', JSON.stringify(progressData));
			// #endif
			
			// #ifndef H5
			// APP端缓存更多信息
			progressData.current_page = this.currentPage;
			progressData.total_pages = this.totalPages;
			progressData.line_height = this.lineHeight;
			progressData.content_padding = this.contentPadding;
			uni.setStorageSync('xqy_novel_progress_cache', progressData);
			// #endif
		},
		
		getReadingProgressFromServer() {
			if (!this._isInstanceValid() || !this.token || !this.currentChapter.id || !this.bookInfo.id) {
				return Promise.resolve(false);
			}
			
			return new Promise((resolve) => {
				uni.request({
					url: this.$API.PluginLoad('xqy_novel'),
					method: 'GET',
					data: {
						action: 'getReadingProgress',
						plugin: 'xqy_novel',
						novel_id: this.bookInfo.id,
						chapter_id: this.currentChapter.id,
						font_size: this.fontSize,
						token: this.token
					},
					success: (res) => {
						if (!this._isInstanceValid()) {
							resolve(false);
							return;
						}
						
						if (res.data && res.data.code === 200 && res.data.data) {
							const progressData = res.data.data;
							
							// #ifndef H5
							// APP端恢复页码信息
							if (progressData.current_page !== undefined && progressData.total_pages > 0) {
								this.currentPage = Math.max(0, Math.min(progressData.current_page, this.totalPages - 1));
							}
							// #endif
							
			
							resolve(true);
						} else {
							resolve(false);
						}
					},
					fail: (error) => {
					resolve(false);
				}
				});
			});
		},
		
		// 获取上次阅读进度并跳转到对应章节（仅APP端）
		// #ifndef H5
		getLastReadingProgress() {
			if (!this._isInstanceValid() || !this.token || !this.bookInfo.id) {
				this.getFirstChapter();
				return;
			}
			

			
			uni.request({
				url: this.$API.PluginLoad('xqy_novel'),
				method: 'GET',
				data: {
					action: 'getLastReadingProgress',
					plugin: 'xqy_novel',
					novel_id: this.bookInfo.id,
					token: this.token
				},
				success: (res) => {
					if (!this._isInstanceValid()) {
					return;
				}

				if (res.data && res.data.code === 200 && res.data.data && res.data.data.chapter_id) {
						const progressData = res.data.data;
						
						this.chapterId = progressData.chapter_id;
					this.currentChapter.id = progressData.chapter_id;

					if (progressData.current_page !== undefined) {
						this.targetPageAfterChapterLoad = progressData.current_page;
					}

					this.getChapterInfo();
					} else {
						this.getFirstChapter();
					}
				},
				fail: (error) => {
					this.getFirstChapter();
				}
			});
		},
		// #endif

		getFirstChapter() {
			if (!this._isInstanceValid() || !this.bookInfo.id) {
				return;
			}

			uni.request({
				url: this.$API.PluginLoad('xqy_novel'),
				method: 'GET',
				data: {
					action: 'getFirstChapter',
					plugin: 'xqy_novel',
					novel_id: this.bookInfo.id
				},
				success: (res) => {
					if (!this._isInstanceValid()) {
						return;
					}
					

					
					if (res.data && res.data.code === 200 && res.data.data && res.data.data.chapter_id) {
						this.chapterId = res.data.data.chapter_id;
						this.currentChapter.id = res.data.data.chapter_id;
						this.getChapterInfo();
					} else {
						uni.showToast({
							title: '获取章节失败',
							icon: 'none'
						});
					}
				},
				fail: (error) => {
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					});
				}
			});
		},

		restoreFromCache() {
			if (!this._isInstanceValid()) return Promise.resolve(false);
			
			// 如果有token，优先从服务器获取阅读进度
			if (this.token) {
				return this.getReadingProgressFromServer().then(success => {
					if (success) {
						return true;
					}
					// 服务器获取失败，尝试本地缓存
					return this.restoreFromLocalCache();
				});
			} else {
				// 没有token，直接使用本地缓存
				return Promise.resolve(this.restoreFromLocalCache());
			}
		},

		restoreFromLocalCache() {
			if (!this._isInstanceValid()) return false;
			
			try {
				let cachedProgress = null;
				
				// #ifdef H5
				const cached = localStorage.getItem('xqy_novel_progress_cache');
				if (cached) {
					cachedProgress = JSON.parse(cached);
				}
				// #endif
				
				// #ifndef H5
				cachedProgress = uni.getStorageSync('xqy_novel_progress_cache');
				// #endif
				
				if (cachedProgress && 
					cachedProgress.novel_id === this.bookInfo.id && 
					cachedProgress.chapter_id === this.currentChapter.id) {
					
					// 检查缓存是否在5分钟内
					const cacheAge = Date.now() - cachedProgress.timestamp;
					if (cacheAge < 5 * 60 * 1000) {
						// #ifndef H5
						if (cachedProgress.current_page !== undefined) {
							this.currentPage = Math.max(0, Math.min(cachedProgress.current_page, this.totalPages - 1));
						}
						if (cachedProgress.font_size) {
							this.fontSize = cachedProgress.font_size;
						}
						if (cachedProgress.line_height) {
							this.lineHeight = cachedProgress.line_height;
						}
						if (cachedProgress.content_padding) {
							this.contentPadding = cachedProgress.content_padding;
						}
						// #endif
						return true;
					}
				}
			} catch (error) {
			}
			return false;
		},

		increaseChapterViews() {
			if (!this._isInstanceValid() || !this.currentChapter.id) return;
			
			uni.request({
				url: this.$API.PluginLoad('xqy_novel'),
				method: 'POST',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: {
					action: 'increaseChapterViews',
					plugin: 'xqy_novel',
					id: this.currentChapter.id,
					token: this.token
				},
				success: (res) => {
					if (!this._isInstanceValid()) return;
					if (res.data && res.data.code === 200) {
				} else {
				}
				},
				fail: (error) => {
				if (!this._isInstanceValid()) return;
			}
			});
		},

		finalSaveProgress() {
			if (!this._isInstanceValid() || !this.token || !this.currentChapter.id || !this.bookInfo.id) return;

			this.cacheReadingProgress();

			// #ifdef H5
			// #endif

			// #ifndef H5
			const progress = this.totalPages > 0 ? Math.min(100, Math.max(0, ((this.currentPage + 1) / this.totalPages) * 100)) : 0;

			this.saveReadingProgress({
				novel_id: this.bookInfo.id,
				chapter_id: this.currentChapter.id,
				progress: progress,
				current_page: this.currentPage,
				total_pages: this.totalPages,
				last_read_time: new Date().toISOString()
			});
			// #endif
		},
		
		// #ifndef H5
		// APP端音量键翻页功能
		addVolumeKeyListener() {
			if (!this._isInstanceValid()) return;
			
			// #ifdef APP-PLUS
			try {
				this.volumeKeyHandler = (e) => {
					if (!this._isInstanceValid()) return;
					
					// 音量上键 - 上一页
					if (e.keyCode === 24) { // KEYCODE_VOLUME_UP
						this.prevPage();
					}
					// 音量下键 - 下一页  
					else if (e.keyCode === 25) { // KEYCODE_VOLUME_DOWN
						this.nextPage();
					}
				};
				
				this.volumeLongPressHandler = (e) => {
					// 阻止长按音量键弹出音量调节界面
				};
				
				// 监听系统按键事件
				plus.key.addEventListener('keydown', this.volumeKeyHandler, false);
				
				// 监听长按事件，防止弹出音量调节
				plus.key.addEventListener('longpressed', this.volumeLongPressHandler, false);
			} catch (e) {
				console.log('音量键监听设置失败:', e);
			}
			// #endif
		},
		
		removeVolumeKeyListener() {
			// #ifdef APP-PLUS
			try {
				// 移除按键事件监听
				if (this.volumeKeyHandler) {
					plus.key.removeEventListener('keydown', this.volumeKeyHandler);
					this.volumeKeyHandler = null;
				}
				if (this.volumeLongPressHandler) {
					plus.key.removeEventListener('longpressed', this.volumeLongPressHandler);
					this.volumeLongPressHandler = null;
				}
			} catch (e) {
				console.log('移除音量键监听失败:', e);
			}
			// #endif
		},
		
		nextPage() {
			if (!this._isInstanceValid()) return;
			
			if (this.currentPage < this.totalPages - 1) {
				// 当前章节还有下一页
				this.currentPage++;
				this.onPageChange({ detail: { current: this.currentPage } });
			} else if (this.nextChapter) {
				// 跳转到下一章
				this.goToChapter('next');
			} else {
				// 已经是最后一页
				uni.showToast({
					title: '已经是最后一页了',
					icon: 'none',
					duration: 1000
				});
			}
		},
		
		prevPage() {
			if (!this._isInstanceValid()) return;
			
			if (this.currentPage > 0) {
				// 当前章节还有上一页
				this.currentPage--;
				this.onPageChange({ detail: { current: this.currentPage } });
			} else if (this.prevChapter) {
				// 跳转到上一章的最后一页
				this.goToChapter('prev', true);
			} else {
				// 已经是第一页
				uni.showToast({
					title: '已经是第一页了',
					icon: 'none',
					duration: 1000
				});
			}
		}
		// #endif
	},
	
	
	beforeDestroy() {
		
		this._isDestroyed = true;
		
		// 不再需要清理定时器集合
		
		
		this.finalSaveProgress();
	},
	
	// uni-app页面显示时处理
	onShow() {
		// #ifndef H5
		// APP端页面显示时重新获取系统信息
		try {
			const systemInfo = uni.getSystemInfoSync();
			if (systemInfo && typeof systemInfo === 'object') {
				this.statusBarHeight = systemInfo.statusBarHeight || 0;
			}
		} catch (e) {
		}
		// #endif
	},
	
	
	onReady() {
		// 正确初始化状态栏相关变量
		if (Vue.prototype.StatusBar !== undefined) {
			this.StatusBar = Vue.prototype.StatusBar;
		}
		if (Vue.prototype.CustomBar !== undefined) {
			this.CustomBar = Vue.prototype.CustomBar;
		}
		this.NavBar = this.StatusBar + this.CustomBar;
		
		// #ifndef H5
		// APP端添加音量键监听
		this.addVolumeKeyListener();
		// #endif
		

		this.$nextTick(() => {
			if (!this._isInstanceValid()) return;
			

			setTimeout(() => {
				if (!this._isInstanceValid()) return;

	
			}, 100);
		});
	},
	
	// uni-app页面隐藏时保存
	onHide() {
		this.finalSaveProgress();
	},
	
	// uni-app页面卸载时保存
	onUnload() {
		
		this._isDestroyed = true;
		
		// #ifndef H5
		this.removeVolumeKeyListener();
		// #endif
		
		// 不再需要清理定时器集合
		
		this.finalSaveProgress();
	}
}
</script>

<style lang="scss" scoped>
.reader-page {
	width: 100%;
	min-height: 100vh;
	background: #f5f5f5;
	font-family: 'Source Serif Pro', serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	transition: all 0.3s ease;
	overflow-x: hidden;
}

.reader-container-h5 {
	width: 100%;
	height: 100%;
	// display: flex;
	// flex-direction: column;
	position: relative;
	background-color: #f5f5f5;
	color: #333333;
	transition: background-color 0.3s, color 0.3s;
	
}


/* 导航栏通用样式 */
.nav-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20px);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

	.nav-content {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		box-sizing: border-box;
	}

	.nav-left {
		position: absolute;
		left: 15px;
		display: flex;
		align-items: center;
	
		.icon-back {
			font-size: 24px;
			color: #333;
			line-height: 1;
		}
	}

	.nav-right {
		position: absolute;
		right: 15px;
		display: flex;
		align-items: center;
		
		.bookmark-icon {
			font-size: 20px;
			color: #333;
			line-height: 1;
		}
	}

	.content {
		font-size: 16px;
		font-weight: 500;
		color: #333;
		text-align: center;
		padding: 0 40px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.nav-bar-app {
	padding-top: env(safe-area-inset-top);
}

.nav-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20px);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.nav-bar.hidden {
	transform: translateY(-100%);
}

.nav-content {
	display: flex;
	align-items: center;
	height: 88rpx;
	padding: 0 30rpx;
}

.nav-left {
	width: 80rpx;
	display: flex;
	align-items: center;
}

.icon-back {
	font-size: 44rpx;
	color: #333333;
	font-weight: 500;
	transition: all 0.2s ease;
	cursor: pointer;
	border-radius: 50%;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.icon-back:hover {
	background: rgba(0, 0, 0, 0.05);
	transform: scale(1.1);
}


.content {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 20rpx;
	color: #333333;
	font-size: 32rpx;
	transition: color 0.2s ease;
}

.text-bold {
	font-weight: 600;
	letter-spacing: -0.5rpx;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.nav-right {
	display: flex;
	align-items: center;
	width: 80rpx;
	justify-content: flex-end;
}

.menu-btn {
	font-size: 44rpx;
	color: #333333;
	cursor: pointer;
	transition: all 0.2s ease;
	border-radius: 50%;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 500;
}

.menu-btn:hover {
	background: rgba(0, 0, 0, 0.05);
	transform: scale(1.1);
}

.reader-header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 60px;
	background-color: #ffffff;
	border-bottom: 1px solid #e0e0e0;
	padding: 12px 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 100;
	transition: transform 0.3s ease-in-out, background-color 0.3s, border-color 0.3s;
	font-family: 'Source Sans Pro', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	
	&.hidden {
		transform: translateY(-100%);
	}
	
	.header-icon {
		position: absolute;
		left: 20px;
		font-size: 24px;
		cursor: pointer;
		color:rgb(0, 0, 0);
		transition: color 0.3s;
		
		&:hover {
			color: #333333;
		}
	}
	
	.chapter-title-h5 {
		font-size: 15px;
		font-weight: 400;
		color: #888888;
		text-align: center;
	}
	
	.header-left, .header-right {
		width: 60px;
		display: flex;
		align-items: center;
		
		text {
			font-size: 24px;
			cursor: pointer;
		}
	}
	
	.header-center {
		flex: 1;
		text-align: center;
		
		.novel-title {
			font-size: 18px;
			font-weight: 500;
		}
	}
}

.content-container-h5 {
	padding: 20px;
	max-width: 720px;
	margin: 65px auto 20px auto;
	background-color: #ffffff;
	border: 1px solid #e0e0e0;
	transition: background-color 0.3s, border-color 0.3s;
	box-sizing: border-box;
	position: relative;
	left: 0;
	right: 0;
	

	
	.novel-title-h5 {
		font-size: 16px;
		font-weight: 600;
		color: #888888;
		margin-bottom: 10px;
		font-family: 'Source Sans Pro', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		

	}
	
	.chapter-main-title-h5 {
		font-size: 34px;
		font-weight: 700;
		margin-bottom: 30px;
		line-height: 1.4;
		color: #333333;
		

	}
	
	.chapter-content-h5 {
		font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
		line-height: 1.8;
		font-size: v-bind(fontSize + 'px');
		
		/* 富文本内容样式 */
		p {
			text-indent: 2em;
			margin-bottom: 1em;
		}
		
		img {
			max-width: 100%;
			height: auto;
			display: block;
			margin: 20px auto;
		}
		

	}
}

.reader-footer-h5 {
	padding: 40px 20px;
	text-align: center;
	margin-top: 20px;
	font-family: 'Source Sans Pro', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.reader-footer-h5 .nav-buttons-h5 button {
	background-color: transparent;
	color: #333333;
	border: 1px solid #333333;
	padding: 12px 30px;
	border-radius: 50px;
	cursor: pointer;
	margin: 0 15px;
	font-size: 16px;
	font-family: 'Source Sans Pro', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	transition: all 0.3s;
}

.reader-footer-h5 .nav-buttons-h5 button:hover {
	background-color: #333333;
	color: white;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}



.right-toolbar {
	position: fixed;
	top: 50%;
	right: 20px;
	transform: translateY(-50%);
	display: flex;
	flex-direction: column;
	gap: 15px;
	z-index: 20;
	opacity: 0.5;
	transition: opacity 0.3s ease-in-out;
}

@media (min-width: 900px) {
	.right-toolbar {
		right: calc((100vw - 720px) / 2 - 60px);
	}
}

@media (max-width: 768px) {
	.content-container-h5 {
		padding: 15px;
		margin: 65px 10px 20px 10px;
	}
}



.right-toolbar:hover {
	opacity: 1 !important;
}

.right-toolbar .toolbar-btn {
	background-color: #ffffff;
	border: 1px solid #e0e0e0;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	transition: all 0.3s;
	font-family: 'Source Sans Pro', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	font-size: 12px;
	color: #888888;
}

.right-toolbar .toolbar-btn:hover {
	border-color: #333333;
	color: #333333;
}

.right-toolbar:hover .toolbar-btn {
	opacity: 1 !important;
}

.right-toolbar .toolbar-btn .toolbar-icon {
	font-size: 20px;
	margin-bottom: 2px;
}

.rich-text-container {
		width: 100%;
		line-height: 1.6;
	}
	
	.rich-text-container rich-text {
		font-size: inherit !important;
	}
	
	.loading-text {
		text-align: center;
		color: #999;
		padding: 40px 20px;
		font-size: 16px;

	}
	
	/* H5端字号滑动条样式 */
	.font-size-slider-container {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: #ffffff;
	border: 1px solid #e0e0e0;
	border-radius: 12px;
}

.font-size-slider-container {
	padding: 20px;
	width: 300px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	z-index: 1000;
	font-family: 'Source Sans Pro', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	transition: all 0.3s ease;
}


.slider-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.slider-title {
	font-size: 18px;
	font-weight: 600;
	color: #333333;
}

.close-btn {
	font-size: 24px;
	cursor: pointer;
	color: #888888;
	transition: color 0.3s;
}

.close-btn:hover {
	color: #333333;
}

.slider-content {
	display: flex;
	align-items: center;
	gap: 15px;
	margin-bottom: 15px;
}

.size-label {
	font-size: 16px;
	color: #666666;
	font-weight: 500;
}

.size-label.large {
	font-size: 20px;
}

.font-slider {
	flex: 1;
	height: 6px;
	background-color: #f0f0f0;
	border-radius: 3px;
	outline: none;
}

.current-size {
	text-align: center;
	font-size: 14px;
	color: #888888;
	font-weight: 500;
}

.status-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	background: transparent;
}

.app-header {
	position: fixed;
	top: var(--status-bar-height);
	left: 0;
	right: 0;
	height: 56px;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20px);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
	z-index: 999;
	transform: translateY(-100%);
	transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.app-header.visible {
	transform: translateY(0);
}

.reading-area {
	position: relative;
	width: 100%;
	height: 100%;
	min-height: 100vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.content-swiper {
	width: 100%;
	flex: 1;
	height: 100%;
}

.swiper-page {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
}

.page-scroll {
	width: 100%;
	flex: 1;
	height: 100%;
}

.chapter-header {
	padding: 20px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	background: rgba(255, 255, 255, 0.95);
}

.chapter-title {
	font-size: 18px;
	font-weight: bold;
	color: #333;
	margin-bottom: 8px;
	display: block;
}

.chapter-info {
	font-size: 12px;
	color: #666;
	display: block;
}

.page-content {
	flex: 1;
	padding: 20px;
	overflow-y: auto;
	position: relative;
	background: transparent;
	transition: all 0.3s ease;
	height: 100%;
	box-sizing: border-box;
	color: #333;
}

.rich-content {
	color: inherit;
}

.loading-container {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 200px;
}

.loading-text {
	font-size: 16px;
	color: #666;
}

.page-content p {
	margin: 0 0 1em 0;
	text-indent: 2em;
	line-height: inherit;
}

.page-content div {
	margin: 0 0 1em 0;
	text-indent: 2em;
	line-height: inherit;
}

.page-content br {
	display: block;
	margin: 0.5em 0;
}

/* 确保HTML标签正常显示 */
.page-content strong {
	font-weight: bold;
}

.page-content em {
	font-style: italic;
}

.page-content u {
	text-decoration: underline;
}

.page-content.active {
	opacity: 1;
	transform: translateX(0);
}



/* 页码指示器 */
.page-indicator {
	position: absolute;
	bottom: 100px;
	right: 20px;
	background: rgba(0, 0, 0, 0.6);
	border-radius: 12px;
	padding: 6px 12px;
	z-index: 100;
}

.page-info {
	font-size: 12px;
	color: #ffffff;
	font-weight: 500;
}

/* 底部工具栏 */
.app-footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20px);
	border-top: 0.5px solid rgba(0, 0, 0, 0.1);
	transform: translateY(100%);
	transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.app-footer.visible {
	transform: translateY(0);
}

.footer-safe-area {
	padding-bottom: env(safe-area-inset-bottom);
}

.main-toolbar {
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 0 20px;
}

.tool-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	padding: 8px 16px;
	border-radius: 12px;
	transition: all 0.2s ease;
	min-width: 60px;
}

.tool-item:active {
	background-color: rgba(0, 0, 0, 0.05);
	transform: scale(0.95);
}

.tool-item.disabled {
	opacity: 0.4;
	pointer-events: none;
}

.tool-item.disabled .tool-icon,
.tool-item.disabled .tool-text {
	color: #cccccc;
}

.tool-icon {
	font-size: 20px;
}

.tool-text {
	font-size: 12px;
	color: #666666;
	font-weight: 500;
}

/* 设置面板 */
.settings-panel {
	padding: 20px;
	background: #ffffff;
	border-top: 0.5px solid rgba(0, 0, 0, 0.1);
}

.setting-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 0;
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
}

.setting-row:last-child {
	border-bottom: none;
}

.setting-label {
	font-size: 16px;
	color: #000000;
	font-weight: 500;
}

.setting-options {
	display: flex;
	gap: 8px;
}

.setting-btn {
	padding: 8px 16px;
	border: 1px solid #E5E5EA;
	border-radius: 8px;
	background: #ffffff;
	transition: all 0.2s ease;
	min-width: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.setting-btn text {
	font-size: 14px;
	color: #000000;
	font-weight: 500;
}

.setting-btn.active {
	background: #007AFF;
	border-color: #007AFF;
}

.setting-btn.active text {
	color: #ffffff;
}

.setting-btn:active {
	transform: scale(0.95);
}

.font-size-display {
	padding: 8px 16px;
	border: 1px solid #E5E5EA;
	border-radius: 8px;
	background: #F8F8F8;
	min-width: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.font-size-display text {
	font-size: 14px;
	color: #666666;
	font-weight: 500;
}

/* 目录弹窗 */
.catalog-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
}

.catalog-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #ffffff;
	z-index: 1001;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.catalog-header {
	flex-shrink: 0;
	height: calc(56px + var(--status-bar-height));
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20px;
	padding-top: var(--status-bar-height);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
}

.catalog-title {
	font-size: 18px;
	font-weight: 600;
	color: #000000;
}

.catalog-close {
	width: 32px;
	height: 32px;
	border-radius: 16px;
	background: rgba(0, 0, 0, 0.05);
	display: flex;
	align-items: center;
	justify-content: center;
}

.catalog-close text {
	font-size: 16px;
	color: #666666;
}

.catalog-list {
	flex: 1;
	overflow-y: auto;
	padding-bottom: env(safe-area-inset-bottom);
	/* 显示滚动条 */
	-webkit-overflow-scrolling: touch;
}

/* APP端目录滚动条样式 */
.catalog-list::-webkit-scrollbar {
	width: 4px;
}

.catalog-list::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.05);
	border-radius: 2px;
}

.catalog-list::-webkit-scrollbar-thumb {
	background: rgba(0, 0, 0, 0.2);
	border-radius: 2px;
}

.catalog-list::-webkit-scrollbar-thumb:hover {
	background: rgba(0, 0, 0, 0.3);
}

.catalog-item {
	display: flex;
	align-items: center;
	padding: 16px 20px;
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
	transition: background-color 0.2s ease;
}

.catalog-item:active {
	background-color: rgba(0, 0, 0, 0.05);
}

.catalog-item.current {
	background-color: rgba(0, 122, 255, 0.1);
}

.chapter-index {
	font-size: 14px;
	color: #666666;
	margin-right: 12px;
	min-width: 30px;
}

.catalog-item .chapter-title {
	flex: 1;
	font-size: 16px;
	color: #000000;
	line-height: 1.4;
	margin: 0;
	text-align: left;
	font-weight: 400;
}

.catalog-item.current .chapter-title {
	color: #007AFF;
	font-weight: 500;
}

.settings-popup {
	background: white;
	border-radius: 20px 20px 0 0;
	max-height: 70vh;
	

	
	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		border-bottom: 1px solid #f0f0f0;
		

		
		.popup-title {
			font-size: 18px;
			color: #333;
			margin: 0;
			

		}
		
		.tn-icon-close {
			font-size: 24px;
			color: #666;
			cursor: pointer;
		}
	}
	
	.settings-content {
		padding: 20px;
		max-height: 50vh;
		overflow-y: auto;
		
		.setting-group {
			margin-bottom: 30px;
			
			.setting-label {
				font-size: 16px;
				color: #333;
				margin-bottom: 15px;
				font-weight: 500;
			}
			
			.font-size-control, .line-height-control, .padding-control {
				display: flex;
				align-items: center;
				gap: 15px;
				
				.control-btn {
					width: 40px;
					height: 40px;
					border: 1px solid #ddd;
					border-radius: 8px;
					background: white;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 18px;
					color: #333;
					cursor: pointer;
					
					&:hover {
						background: #f5f5f5;
					}
				}
				
				.font-size-text, .line-height-text, .padding-text {
					font-size: 16px;
					color: #333;
					min-width: 60px;
					text-align: center;
				}
			}
			

		}
	}
}

.h5-content {
	width: 100%;
	line-height: 1.6;
	color: inherit;
}

.h5-content p {
	text-indent: 2em;
	margin-bottom: 0.8em;
	line-height: inherit;
}

.h5-content img {
	max-width: 100%;
	display: block;
	margin: 10px auto;
	border-radius: 4px;
}

.catalog-overlay-h5 {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	box-sizing: border-box;
	animation: fadeIn 0.3s ease-out;
}

.catalog-modal-h5 {
	width: 100%;
	max-width: 500px;
	max-height: 80vh;
	background: white;
	border-radius: 16px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	overflow: hidden;
	animation: slideUp 0.3s ease-out;
}

.catalog-header-h5 {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px 24px;
	border-bottom: 1px solid #f0f0f0;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
}

.catalog-title-section {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.catalog-title-h5 {
	font-size: 20px;
	font-weight: 600;
	color: white;
	margin: 0;
}

.catalog-subtitle {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.8);
	margin: 0;
}

.catalog-close-h5 {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
	
	&:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}
}

.close-icon {
	font-size: 24px;
	color: white;
	font-weight: 300;
}

.catalog-list-h5 {
	max-height: 60vh;
	overflow-y: auto;
	padding: 8px 0;
	
	&::-webkit-scrollbar {
		width: 6px;
	}
	
	&::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}
	
	&::-webkit-scrollbar-thumb {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 3px;
		transition: all 0.2s ease;
	}
	
	&::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
	}
}

.catalog-item-h5 {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 24px;
	border-bottom: 1px solid #f8f8f8;
	cursor: pointer;
	transition: all 0.2s ease;
	position: relative;
	
	&:hover {
		background: #f8f9ff;
		transform: translateX(4px);
	}
	
	&.current {
		background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
		border-left: 4px solid #667eea;
		
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 4px;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		}
	}
	
	&:last-child {
		border-bottom: none;
	}
}

.chapter-info-h5 {
	display: flex;
	align-items: center;
	gap: 16px;
	flex: 1;
}

.chapter-number {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	font-size: 14px;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	
	.catalog-item-h5.current & {
		background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}
}

.chapter-details {
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;
	min-width: 0;
}

.chapter-title-text {
	font-size: 16px;
	font-weight: 500;
	color: #333;
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	
	.catalog-item-h5.current & {
		color: #667eea;
		font-weight: 600;
	}
}

.chapter-meta {
	font-size: 12px;
	color: #999;
	line-height: 1.2;
}

.chapter-status-h5 {
	flex-shrink: 0;
}

.current-indicator {
	font-size: 12px;
	color: #667eea;
	background: rgba(102, 126, 234, 0.1);
	padding: 4px 8px;
	border-radius: 12px;
	font-weight: 500;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes slideUp {
	from {
		transform: translateY(30px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

/* 滚动条样式 */
.catalog-list-h5::-webkit-scrollbar {
	width: 6px;
}

.catalog-list-h5::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 3px;
}

.catalog-list-h5::-webkit-scrollbar-thumb {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 3px;
}

.catalog-list-h5::-webkit-scrollbar-thumb:hover {
	background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>