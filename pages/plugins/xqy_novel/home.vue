<template>
	<view class="user"
	:style="{'background-color':'#f6f6f6','min-height':'100vh','padding-bottom':'120rpx'}">
		<view class="main-content" :style="{paddingTop: '20rpx'}">
			<block v-if="isLoading==1">
			<!-- 轮播图部分 -->
			<view class="data-box bg-white" v-if="swiperList.length > 0">
				<swiper class="custom-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500"
					:circular="true" :radius="true" indicator-active-color="#ffffff" @change="swiperChange">
					<swiper-item v-for="(item, index) in swiperList" :key="index" @click="swiperclick(index)">
						<view class="swiper-item">
							<view class="swiper-bg">
								<image class="bg-image" :src="item.cover" mode="aspectFill"></image>
								<view class="dark-overlay"></view>
							</view>
							<view class="swiper-content">
								<view class="app-info">
									<image class="app-icon" :src="item.cover" mode="aspectFill"></image>
									<view class="app-text">
										<text class="app-name">{{item.title}}</text>
										<text class="app-desc">{{item.author}}</text>
									</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>

			

			<!-- 筛选栏 -->
			<view class="bg-white margin-top-sm">
				<view class="filter-bar">
					<view class="filter-item" @tap="showOrderPicker">
						<text>{{orderText}}</text>
						<text class="cuIcon-unfold"></text>
					</view>
					<view class="filter-item" @tap="showCategoryFilter">
						<text>{{categoryText}}</text>
						<text class="cuIcon-unfold"></text>
					</view>
					<view class="filter-item" @tap="showStatusFilter">
						<text>{{statusText}}</text>
						<text class="cuIcon-unfold"></text>
					</view>
					<view class="filter-item" @tap="showTypeFilter">
						<text>{{typeText}}</text>
						<text class="cuIcon-unfold"></text>
					</view>
					<view class="filter-item" @tap="showTagFilter">
						<text>{{tagText}}</text>
						<text class="cuIcon-unfold"></text>
					</view>
				</view>

				<!-- 小说列表 -->
				<block v-if="novellist.length>0">
					<view class="loading-container" v-if="novelloading">
						<u-loading mode="circle" size="36"></u-loading>
					</view>
					<block v-else>
						<view class="waterfall-container">
							<view class="waterfall-column">
								<view class="novel-card" v-for="(item, index) in leftColumnNovels" :key="'left-' + index" @tap="goToNovel(item.id)">
									<!-- 封面 -->
									<view class="novel-cover">
										<u-image :src="item.cover" width="100%" :height="getCoverHeight(item)" :mode="getCoverMode(item)"
											:lazy-load="true" :fade="true" duration="450" border-radius="16rpx 16rpx 0 0"
											:style="getCoverStyle(item)">
											<u-loading slot="loading"></u-loading>
										</u-image>
									</view>
									<!-- 内容区域 -->
									<view class="novel-content">
										<!-- 标题 -->
										<view class="novel-title">{{item.title}}</view>
										<!-- 描述 -->
										<view class="novel-desc">{{item.description}}</view>
										<!-- 标签区域 -->
												<view class="novel-tags">
													<text class="tag-item status-tag" :class="getStatusClass(item.status)">{{getStatusText(item.status)}}</text>
													<template v-if="item.tags">
														<text v-for="tag in item.tags.split(',')" :key="tag" class="tag-item category-tag">{{tag}}</text>
													</template>
													<text class="tag-item category-tag" v-else>{{item.category_name || '未分类'}}</text>
													<text class="tag-item views-tag">{{formatNumber(item.views)}}阅读</text>
												</view>
									</view>
								</view>
							</view>
							<view class="waterfall-column">
								<view class="novel-card" v-for="(item, index) in rightColumnNovels" :key="'right-' + index" @tap="goToNovel(item.id)">
									<!-- 封面 -->
									<view class="novel-cover">
										<u-image :src="item.cover" width="100%" :height="getCoverHeight(item)" :mode="getCoverMode(item)"
											:lazy-load="true" :fade="true" duration="450" border-radius="16rpx 16rpx 0 0"
											:style="getCoverStyle(item)">
											<u-loading slot="loading"></u-loading>
										</u-image>
									</view>
									<!-- 内容区域 -->
									<view class="novel-content">
										<!-- 标题 -->
										<view class="novel-title">{{item.title}}</view>
										<!-- 描述 -->
										<view class="novel-desc">{{item.description}}</view>
										<!-- 标签区域 -->
														<view class="novel-tags">
															<text class="tag-item status-tag" :class="getStatusClass(item.status)">{{getStatusText(item.status)}}</text>
															<template v-if="item.tags">
																<text v-for="tag in item.tags.split(',')" :key="tag" class="tag-item category-tag">{{tag}}</text>
															</template>
															<text class="tag-item views-tag">{{formatNumber(item.views)}}阅读</text>
														</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</block>
				<block v-else>
					<view class="margin-top-sm">
						<u-empty text="暂无数据" mode="data" icon-size="100" font-size="24"></u-empty>
					</view>
				</block>

				<view class="load-more" @tap="loadMore" v-if="dataLoad&&novellist.length>0">
					<text>{{moreText}}</text>
				</view>
			</view>
		</block>
		</view>

		<!-- 排序选择器 -->
		<u-picker v-model="showOrder" :show="showOrder" :columns="[orderOptions]" @confirm="confirmOrder"
			@cancel="cancelOrder" mode="selector" :range="orderOptions" range-key="text"></u-picker>

		<!-- 分类筛选弹窗 -->
		<u-popup v-model="showCategory" mode="bottom" :mask-close-able="true" :safe-area-inset-bottom="true"
			@close="showCategory = false">
			<view class="filter-popup">
				<view class="filter-title">选择分类</view>
				<view class="filter-options">
					<view class="filter-option" v-for="(category, index) in categoryOptions" :key="index"
						:class="{'active': selectedCategory === category.value}" @tap="selectCategory(category.value)">
						{{category.label}}
					</view>
				</view>
				<view class="filter-buttons">
					<view class="btn-reset" @tap="resetCategory">重置</view>
					<view class="btn-confirm" @tap="confirmCategory">确定</view>
				</view>
			</view>
		</u-popup>

		<!-- 状态筛选弹窗 -->
		<u-popup v-model="showStatus" mode="bottom" :mask-close-able="true" :safe-area-inset-bottom="true"
			@close="showStatus = false">
			<view class="filter-popup">
				<view class="filter-title">选择状态</view>
				<view class="filter-options">
					<view class="filter-option" v-for="(status, index) in statusOptions" :key="index"
						:class="{'active': selectedStatus === status.value}" @tap="selectStatus(status.value)">
						{{status.label}}
					</view>
				</view>
				<view class="filter-buttons">
					<view class="btn-reset" @tap="resetStatus">重置</view>
					<view class="btn-confirm" @tap="confirmStatus">确定</view>
				</view>
			</view>
		</u-popup>



		<!-- 类型筛选弹窗 -->
		<u-popup v-model="showType" mode="bottom" :mask-close-able="true" :safe-area-inset-bottom="true"
			@close="showType = false">
			<view class="filter-popup">
				<view class="filter-title">选择类型</view>
				<view class="filter-options">
					<view class="filter-option" v-for="(type, index) in typeOptions" :key="index"
						:class="{'active': selectedType === type.value}" @tap="selectType(type.value)">
						{{type.label}}
					</view>
				</view>
				<view class="filter-buttons">
					<view class="btn-reset" @tap="resetType">重置</view>
					<view class="btn-confirm" @tap="confirmType">确定</view>
				</view>
			</view>
		</u-popup>

		<!-- 标签筛选弹窗 -->
		<u-popup v-model="showTag" mode="bottom" :mask-close-able="true" :safe-area-inset-bottom="true"
			@close="showTag = false">
			<view class="filter-popup">
				<view class="filter-title">选择标签</view>
				<view class="filter-options">
					<view class="filter-option" v-for="(tag, index) in tagOptions" :key="index"
						:class="{'active': selectedTag === tag.value}" @tap="selectTag(tag.value)">
						{{tag.label}}
					</view>
				</view>
				<view class="filter-buttons">
					<view class="btn-reset" @tap="resetTag">重置</view>
					<view class="btn-confirm" @tap="confirmTag">确定</view>
				</view>
			</view>
		</u-popup>

		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../../static/loading.gif"></image>
			</view>
		</view>
		
		<!-- 底部导航栏已移除，由主容器统一管理 -->
	</view>
</template>

<script>
import {
	localStorage
} from '../../../js_sdk/mp-storage/mp-storage/index.js'


export default {
	name: 'HomeComponent',
	
	props: {
		curPage: {
			type: Number,
			default: 0
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
				isLoading: 0,
			swiperList: [],
			novellist: [],
			page: 1,
				novelloading: false,
				dataLoad: true,
				moreText: "加载更多",
				isLoad: 0,

	
				showOrder: false,
				orderOptions: [{
						text: '最新发布',
						value: 'created_at'
					},
					{
						text: '最近更新',
						value: 'updated_at'
					},
					{
						text: '评分最高',
						value: 'rating'
					},
					{
						text: '阅读最多',
						value: 'views'
					}],
				selectedOrder: 'created_at',
				orderText: '最新发布',

	
				showCategory: false,
				categoryOptions: [{
						label: '全部',
						value: ''
					},
					{
						label: '玄幻',
						value: '玄幻'
					},
					{
						label: '都市',
						value: '都市'
					},
					{
						label: '历史',
						value: '历史'
					},
					{
						label: '科幻',
						value: '科幻'
					},
					{
						label: '武侠',
						value: '武侠'
					},
					{
						label: '言情',
						value: '言情'
					}],
				selectedCategory: '',
				categoryText: '分类',

	
				showStatus: false,
				statusOptions: [{
						label: '全部',
						value: ''
					},
					{
						label: '连载中',
						value: '1'
					},
					{
						label: '已完结',
						value: '2'
					},
					{
						label: '已停更',
						value: '0'
					}],
				selectedStatus: '',
				statusText: '状态',

	
				showType: false,
				typeOptions: [{
						label: '全部',
						value: ''
					},
					{
						label: '原创',
						value: '原创'
					},
					{
						label: '搬运',
						value: '搬运'
					}],
				selectedType: '',
				typeText: '类型',

	
				showTag: false,
				tagOptions: [{
						label: '全部',
						value: ''
					}],
				selectedTag: '',
				tagText: '标签',
				
	
				isEditMode: false
			};
		},
	computed: {
		
		leftColumnNovels() {
			return this.novellist.filter((item, index) => index % 2 === 0);
		},
		
		rightColumnNovels() {
			return this.novellist.filter((item, index) => index % 2 === 1);
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
		this.initData();
	},
	beforeDestroy() {
		// 移除事件监听
		uni.$off('onShow', this.handleShow);
		uni.$off('onPullDownRefresh', this.handlePullDownRefresh);
		uni.$off('onReachBottom', this.handleReachBottom);
	},
	methods: {
		// 初始化数据
		initData() {
			this.getCategoryList();
			this.getTagList();
			this.getNovelList();
		},

		// 处理显示事件
		handleShow(pageIndex) {
			if (pageIndex === this.curPage) {
				// 可以在这里添加页面显示时的逻辑
			}
		},

		// 处理下拉刷新事件
		handlePullDownRefresh(pageIndex) {
			if (pageIndex === this.curPage) {
				this.page = 1;
				this.isLoading = 0;
				this.getCategoryList();
				this.getTagList();
				this.getNovelList();
			}
		},

		// 处理触底事件
		handleReachBottom(pageIndex) {
			if (pageIndex === this.curPage && !this.novelloading && this.dataLoad) {
				this.loadMore();
			}
		},

		toSearch() {
			uni.navigateTo({
				url: '/pages/plugins/xqy_novel/search'
			});
		},



		swiperChange(e) {

		},

		swiperclick(index) {
			if (this.swiperList[index] && this.swiperList[index].id) {
				this.goToNovel(this.swiperList[index].id);
			}
		},

		
		showOrderPicker() {
			this.showOrder = true;
		},

		showCategoryFilter() {
			this.showCategory = true;
		},

		showStatusFilter() {
			this.showStatus = true;
		},

		confirmOrder(e) {
			const index = e[0];
			this.selectedOrder = this.orderOptions[index].value;
			this.orderText = this.orderOptions[index].text;
			this.showOrder = false;
			this.refreshData();
		},

		cancelOrder() {
			this.showOrder = false;
		},

		selectCategory(value) {
			this.selectedCategory = value;
			const option = this.categoryOptions.find(item => item.value === value);
			this.categoryText = option ? option.label : '分类';
		},

		confirmCategory() {
			this.showCategory = false;
			this.refreshData();
		},

		resetCategory() {
			this.selectedCategory = '';
			this.categoryText = '分类';
		},

		selectStatus(value) {
			this.selectedStatus = value;
			const option = this.statusOptions.find(item => item.value === value);
			this.statusText = option ? option.label : '状态';
		},

		confirmStatus() {
			this.showStatus = false;
			this.refreshData();
		},

		resetStatus() {
				this.selectedStatus = '';
				this.statusText = '状态';
			},




			showTypeFilter() {
				this.showType = true;
			},

			showTagFilter() {
				this.showTag = true;
			},

			selectType(value) {
				this.selectedType = value;
				const option = this.typeOptions.find(item => item.value === value);
				this.typeText = option ? option.label : '类型';
			},

			confirmType() {
				this.showType = false;
				this.refreshData();
			},

			resetType() {
				this.selectedType = '';
				this.typeText = '类型';
			},

			selectTag(value) {
				this.selectedTag = value;
				const option = this.tagOptions.find(item => item.value === value);
				this.tagText = option ? option.label : '标签';
			},

			confirmTag() {
				this.showTag = false;
				this.refreshData();
			},

			resetTag() {
				this.selectedTag = '';
				this.tagText = '标签';
			},

			refreshData() {
			this.page = 1;
			this.novellist = [];
			this.dataLoad = true;
			this.getNovelList();
		},
		
		// 底部导航方法已移除，由主容器统一管理

		resetFilters() {
			this.selectedOrder = 'created_at';
			this.orderText = '最新发布';
			this.selectedCategory = '';
			this.categoryText = '分类';
			this.selectedStatus = '';
			this.statusText = '状态';
			this.selectedType = '';
			this.typeText = '类型';
			this.selectedTag = '';
			this.tagText = '标签';
			this.showCategory = false;
			this.showStatus = false;
			this.showType = false;
			this.showTag = false;
			this.refreshData();
		},

		toNovelInfo(id) {
			uni.navigateTo({
				url: '/pages/plugins/xqy_novel/info?novel_id=' + id
			});
		},
		
		
		goToNovel(id) {
			if (!id) {
				uni.showToast({
					title: '小说ID不能为空',
					icon: 'none'
				});
				return;
			}
			uni.navigateTo({
				url: '/pages/plugins/xqy_novel/info?novel_id=' + id
			});
		},
		
		seeMore(type) {
			uni.navigateTo({
				url: '/pages/plugins/xqy_novel/list?type=' + type
			});
		},
		
		selectSection(value) {
			this.selectedSection = value;
			this.page = 1;
			this.novellist = [];
			this.getNovelList();
		},
		
		selectOrder(value) {
			this.selectedOrder = value;
			this.showSortModal = false;
			this.page = 1;
			this.novellist = [];
			this.getNovelList();
		},
		
		selectCategory(value) {
			this.selectedCategory = value;
			this.page = 1;
			this.novellist = [];
			this.getNovelList();
		},
		
		showSortPicker() {
			this.showSortModal = true;
		},
		
		hideSortPicker() {
			this.showSortModal = false;
		},
		
		getCurrentOrderText() {
			const option = this.orderOptions.find(item => item.value === this.selectedOrder);
			return option ? option.text : '最新发布';
		},
		
		
		formatNumber(num) {
			if (num >= 10000) {
				return (num / 10000).toFixed(1) + 'w';
			}
			if (num >= 1000) {
				return (num / 1000).toFixed(1) + 'k';
			}
			return num.toString();
		},
		
		
		getStatusText(status) {
			switch(status) {
				case 1:
					return '连载';
				case 2:
					return '完结';
				case 0:
					return '停更';
				default:
					return '未知';
			}
		},
		
		
		getStatusClass(status) {
			switch(status) {
				case 1:
					return 'status-ongoing';
				case 2:
					return 'status-completed';
				case 0:
					return 'status-paused';
				default:
					return 'status-unknown';
			}
		},
		
		loadMore() {
			if (this.novelloading || !this.dataLoad) return;
			this.page++;
			this.getNovelList();
		},
		


		
		getCategoryList() {
			uni.request({
				url: this.$API.PluginLoad('xqy_novel'),
				data: {
					action: 'getCategoryList',
					plugin: 'xqy_novel',
					token: this.token
				},
				method: 'GET',
				dataType: 'json',
				success: (res) => {
					if (res.data && res.data.code === 200) {
						const categories = res.data.data.list || [];
						this.categoryOptions = [
							{ label: '全部', value: '' },
							...categories.map(item => ({
								label: item.name,
								value: item.name
							}))
						];
					} else {
					}
				},
				fail: (error) => {
				}
			});
		},

		
		getTagList() {
			uni.request({
				url: this.$API.PluginLoad('xqy_novel'),
				data: {
					action: 'getTagList',
					plugin: 'xqy_novel',
					token: this.token
				},
				method: 'GET',
				dataType: 'json',
				success: (res) => {
					if (res.data && res.data.code === 200) {
						const tags = res.data.data.list || [];
						this.tagOptions = [
							{ label: '全部', value: '' },
							...tags.map(item => ({
								label: item.name,
								value: item.name
							}))
						];
					} else {
					}
				},
				fail: (error) => {
				}
			});
		},

		getNovelList() {
			const that = this;
			if (that.novelloading) return;
			that.novelloading = true;

			uni.request({
				url: that.$API.PluginLoad('xqy_novel'),
				data: {
					action: 'getNovelList',
					plugin: 'xqy_novel',
					page: that.page,
					limit: 10,
					sort: that.selectedOrder,
					order: 'desc',
					category: that.selectedCategory,
					status: that.selectedStatus,
					type: that.selectedType,
					tag: that.selectedTag,
					token: that.token
				},
				method: 'GET',
				dataType: 'json',
				success(res) {
					that.isLoading = 1;
					that.novelloading = false;
					uni.stopPullDownRefresh();
					if (res.data && res.data.code === 200) {
						const data = res.data.data;
						const novels = (data.novels || []).map(item => {
							return {
								id: item.id,
								title: item.title,
								author: item.author,
								cover: item.cover_image || '/static/default-cover.jpg',
								description: item.description || '暂无简介',
								category: item.category_name || '未分类',
								category_name: item.category_name || '未分类',
								wordCount: item.word_count,
								chapterCount: item.chapter_count,
								status: item.status,
								views: item.views,
								tags: item.tags
							};
						});

						if (that.page === 1) {
							that.novellist = novels;
						} else {
							that.novellist = that.novellist.concat(novels);
						}
						that.dataLoad = novels.length >= 10;
						if (novels.length < 10) {
							that.moreText = '没有更多了';
						} else {
							that.moreText = '加载更多';
						}
					} else {
						uni.showToast({
							title: res.data?.message || res.data?.msg || '获取小说列表失败',
							icon: 'none'
						});
					}
				},
				fail(err) {
					that.isLoading = 1;
					that.novelloading = false;
					uni.stopPullDownRefresh();
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					});
				}
			});
		},
		
		
		loadMore() {
			if (this.dataLoad && !this.novelloading) {
				this.page++;
				this.getNovelList();
			}
		},

		
		getStatusText(status) {

			const statusStr = String(status);
			switch (statusStr) {
				case '1':
					return '连载中';
				case '2':
					return '已完结';
				case '0':
					return '已停更';
				default:
					return '未知';
			}
		},

		
		getStatusClass(status) {

			const statusStr = String(status);
			switch (statusStr) {
				case '1':
					return 'status-ongoing';
				case '2':
					return 'status-completed';
				case '0':
					return 'status-paused';
				default:
					return 'status-unknown';
			}
		},

		getCoverHeight(item) {
			const minHeight = 260;
			const maxHeight = 420;
			
			const titleLength = (item.title || '').length;
			const descLength = (item.description || '').length;
			const id = item.id || 0;
			
			const hash1 = (id * 73 + titleLength * 41) % 97;
			const hash2 = (id * 23 + descLength * 19) % 89;
			const hash3 = (titleLength * 37 + descLength * 13) % 83;
			
			const combinedHash = (hash1 + hash2 * 2 + hash3 * 3) % 1000;
			
			const normalizedHash = combinedHash / 1000; // 0-1之间
			const sineWave = Math.sin(normalizedHash * Math.PI * 2.7); // 使用非整数倍增加不规律性
			const heightRatio = (sineWave + 1) / 2; // 转换到0-1范围
			
			const heightRange = maxHeight - minHeight;
			let height = minHeight + (heightRange * heightRatio);
			
			const microVariation1 = (hash1 % 20) - 10; // -10到+10
			const microVariation2 = (hash2 % 16) - 8;  // -8到+8
			const microVariation3 = (hash3 % 12) - 6;  // -6到+6
			
			height += microVariation1 + microVariation2 * 0.5 + microVariation3 * 0.3;
			
			height = Math.max(minHeight, Math.min(maxHeight, height));
			
			return Math.round(height) + 'rpx';
		},
		
		getCoverType(item) {
			const id = item.id || 0;
			const titleLength = (item.title || '').length;
			
			// 基于ID和标题长度的简单分类算法
			const hash = (id * 7 + titleLength * 3) % 100;
			
			if (hash < 20) {
				return 'title-top';
			} else if (hash < 40) {
				return 'title-bottom';
			} else if (hash < 60) {
				return 'title-center';
			} else if (hash < 80) {
				return 'title-upper';
			} else {
				return 'title-lower';
			}
		},
		
		getCoverMode(item) {

			return 'aspectFit';
		},
		
		getCoverStyle(item) {
			return {
				backgroundColor: '#f8f8f8'
			};
		},

		switchTab(tab) {
			this.currentTab = tab;
			switch(tab) {
				case 'home':
					break;
				case 'bookshelf':
					uni.navigateTo({
						url: '/pages/plugins/xqy_novel/bookshelf'
					});
					break;
				case 'my':
					uni.navigateTo({
						url: '/pages/plugins/xqy_novel/my'
					});
					break;
			}
		}
	}
}
</script>

<style scoped>
.user {
	min-height: 100vh;
	background-color: #f6f6f6;
}

.main-content {
	padding-top: 20rpx;
	padding-bottom: 20rpx;
}

.data-box {
	margin: 20rpx;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

/* 轮播图样式 */
.custom-swiper {
	height: 400rpx;
	border-radius: 16rpx;
	overflow: hidden;
}

.swiper-item {
	position: relative;
	height: 100%;
	overflow: hidden;
}

.swiper-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.bg-image {
	width: 100%;
	height: 100%;
}

.swiper-content {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 40rpx;
	z-index: 10;
}

.app-info {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.app-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 12rpx;
}

.app-text {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.app-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #ffffff;
}

.app-desc {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

/* 编辑精选样式 */
.icon5__item--icon {
	width: 140rpx;
	height: 180rpx;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.down-button {
	background: linear-gradient(45deg, #667eea, #764ba2);
	color: #ffffff;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	font-weight: 500;
}

/* 筛选栏样式 */
.filter-bar {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx;
	background: #ffffff;
	border-bottom: 1rpx solid #f0f0f0;
}

.filter-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 16rpx 24rpx;
	margin-right: 20rpx;
	background: #f8f9fa;
	border-radius: 24rpx;
	font-size: 28rpx;
	color: #666;
	transition: all 0.3s ease;
}

.filter-item:active {
	background: #e9ecef;
	transform: scale(0.98);
}

.waterfall-container {
	display: flex;
	gap: 12rpx;
	padding: 16rpx;
	background: transparent;
	align-items: flex-start;
}

.waterfall-column {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.novel-card {
	background: #ffffff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.06), 0 1rpx 4rpx rgba(0, 0, 0, 0.04);
	transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	margin-bottom: 16rpx;
	border: 0.5rpx solid rgba(0, 0, 0, 0.04);
}

.novel-card:active {
	transform: scale(0.96);
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12), 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.novel-cover {
	position: relative;
	width: 100%;
	overflow: hidden;
	border-radius: 16rpx 16rpx 0 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	box-shadow: inset 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
}

.novel-cover .u-image {
	transition: all 0.3s ease;
}

.novel-cover .u-image[style*="object-position"] {
	object-fit: cover;
}

.novel-cover .u-image[style*="background-color"] {
	border-radius: 16rpx 16rpx 0 0;
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
}

.novel-content {
	padding: 20rpx 24rpx 24rpx 24rpx;
	background: #ffffff;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.novel-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #1d1d1f;
	line-height: 1.3;
	margin-bottom: 8rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	letter-spacing: -0.2rpx;
	font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

.novel-desc {
	font-size: 24rpx;
	color: #8e8e93;
	line-height: 1.4;
	margin-bottom: 16rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', sans-serif;
}

.novel-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 6rpx;
	align-items: center;
	margin-top: 4rpx;
}

.tag-item {
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
	line-height: 1.3;
	white-space: nowrap;
	font-weight: 600;
	font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', sans-serif;
	letter-spacing: 0;
}

.status-tag {
	background: rgba(0, 122, 255, 0.1);
	color: #007aff;
	border: 0.5rpx solid rgba(0, 122, 255, 0.2);
}

.category-tag {
	background: rgba(175, 82, 222, 0.1);
	color: #af52de;
	border: 0.5rpx solid rgba(175, 82, 222, 0.2);
}

.views-tag {
	background: rgba(52, 199, 89, 0.1);
	color: #34c759;
	border: 0.5rpx solid rgba(52, 199, 89, 0.2);
}

.status-badge {
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	font-size: 20rpx;
	font-weight: 500;
	color: #ffffff;
}

.status-ongoing {
	background: rgba(52, 199, 89, 0.2);
	color: #1d8348;
	border: 1rpx solid rgba(52, 199, 89, 0.4);
	font-weight: 700;
}

.status-completed {
	background: rgba(0, 122, 255, 0.2);
	color: #0056b3;
	border: 1rpx solid rgba(0, 122, 255, 0.4);
	font-weight: 700;
}

.status-paused {
	background: rgba(255, 149, 0, 0.2);
	color: #cc7a00;
	border: 1rpx solid rgba(255, 149, 0, 0.4);
	font-weight: 700;
}

.status-unknown {
	background: rgba(142, 142, 147, 0.2);
	color: #5a5a5e;
	border: 1rpx solid rgba(142, 142, 147, 0.4);
	font-weight: 700;
}

.load-more {
	padding: 40rpx;
	text-align: center;
	font-size: 28rpx;
	color: #666;
	background: #ffffff;
}

.loading-container {
	padding: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #ffffff;
}

/* 筛选弹窗样式 */
.filter-popup {
	padding: 40rpx;
	background: #ffffff;
	border-radius: 24rpx 24rpx 0 0;
}

.filter-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	text-align: center;
	margin-bottom: 40rpx;
}

.filter-options {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-bottom: 40rpx;
}

.filter-option {
	padding: 16rpx 32rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 24rpx;
	font-size: 28rpx;
	color: #666;
	transition: all 0.3s ease;
}

.filter-option.active {
	border-color: #667eea;
	background: #667eea;
	color: #ffffff;
}

.filter-buttons {
	display: flex;
	gap: 20rpx;
}

.btn-reset, .btn-confirm {
	flex: 1;
	padding: 24rpx;
	border-radius: 24rpx;
	font-size: 32rpx;
	font-weight: 500;
	text-align: center;
	transition: all 0.3s ease;
}

.btn-reset {
	background: #f5f5f5;
	color: #666;
}

.btn-confirm {
	background: linear-gradient(45deg, #667eea, #764ba2);
	color: #ffffff;
}

.btn-reset:active, .btn-confirm:active {
	transform: scale(0.98);
	opacity: 0.8;
}

/* 加载动画 */
.loading {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.9);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.loading-main {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
}

.loading-main image {
	width: 100rpx;
	height: 100rpx;
}

/* 工具类 */
.text-cut {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.text-cut-2 {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.text-cut-3 {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}

.bg-white {
	background-color: #ffffff;
}

.margin-top-sm {
	margin-top: 20rpx;
}

.margin-left-lg {
	margin-left: 40rpx;
}

.text-bold {
	font-weight: bold;
}

/* 状态栏 */
.status-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1001;
	background: transparent;
}

/* 顶部导航 */
.nav-header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	height: calc(var(--status-bar-height) + 120rpx);
	padding-top: var(--status-bar-height);
}

.nav-blur {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: var(--bg-primary);
	opacity: 0.95;
	backdrop-filter: blur(20rpx);
	-webkit-backdrop-filter: blur(20rpx);
}

.nav-content {
	position: relative;
	display: flex;
	align-items: center;
	height: 120rpx;
	padding: 0 40rpx;
}

.nav-left, .nav-right {
	width: 80rpx;
	display: flex;
	justify-content: center;
}

.nav-btn {
	width: 64rpx;
	height: 64rpx;
	border-radius: 32rpx;
	background: var(--bg-tertiary);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.nav-btn:active {
	transform: scale(0.95);
	opacity: 0.8;
}

.nav-icon {
	font-size: 36rpx;
	color: var(--text-primary);
	font-weight: 500;
}

.nav-center {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4rpx;
}

.nav-title {
	font-size: 36rpx;
	font-weight: 700;
	color: var(--text-primary);
	letter-spacing: -0.5rpx;
}

.nav-subtitle {
	font-size: 24rpx;
	color: var(--text-secondary);
	font-weight: 400;
}

/* 主滚动区域 */
.main-scroll {
	height: 100vh;
	padding-top: calc(var(--status-bar-height) + 120rpx);
	padding-bottom: 160rpx;
}

/* 页面容器 */
.user {
	padding-bottom: 140rpx; /* 为底部导航留出空间 */
	position: relative;
}

/* 精选轮播 */
.hero-section {
	position: relative;
	margin: 40rpx 30rpx;
	border-radius: 32rpx;
	overflow: hidden;
	box-shadow: 0 16rpx 48rpx var(--shadow-medium);
}

.hero-swiper {
	height: 480rpx;
}

.hero-card {
	position: relative;
	height: 100%;
	overflow: hidden;
}

.hero-bg {
	width: 100%;
	height: 100%;
}

.hero-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
	padding: 80rpx 40rpx 40rpx;
}

.hero-content {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.hero-title {
	font-size: 48rpx;
	font-weight: 700;
	color: #ffffff;
	letter-spacing: -1rpx;
	line-height: 1.2;
}

.hero-desc {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.8);
	line-height: 1.4;
}

.hero-action {
	margin-top: 16rpx;
}

.hero-btn {
	background: rgba(255, 255, 255, 0.2);
	color: #ffffff;
	padding: 16rpx 32rpx;
	border-radius: 24rpx;
	font-size: 28rpx;
	font-weight: 600;
	backdrop-filter: blur(10rpx);
	-webkit-backdrop-filter: blur(10rpx);
}

.hero-indicators {
	position: absolute;
	bottom: 24rpx;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	gap: 12rpx;
}

.indicator {
	width: 12rpx;
	height: 12rpx;
	border-radius: 6rpx;
	background: rgba(255, 255, 255, 0.4);
	transition: all 0.3s ease;
}

.indicator.active {
	width: 32rpx;
	background: #ffffff;
}

/* 分类导航区域 */
.category-section {
	padding: 30rpx 0 20rpx;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20rpx);
	-webkit-backdrop-filter: blur(20rpx);
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.category-scroll {
	padding: 0 30rpx;
}

.category-list {
	display: flex;
	gap: 24rpx;
}

.category-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	padding: 16rpx 20rpx;
	border-radius: 20rpx;
	background: rgba(0, 0, 0, 0.03);
	transition: all 0.3s ease;
	flex-shrink: 0;
	min-width: 100rpx;
}

.category-item.active {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	transform: translateY(-2rpx);
	box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
}

.category-icon {
	font-size: 32rpx;
	color: var(--text-secondary);
	transition: all 0.3s ease;
}

.category-item.active .category-icon {
	color: #ffffff;
	transform: scale(1.1);
}

.category-name {
	font-size: 24rpx;
	color: var(--text-primary);
	font-weight: 500;
	transition: all 0.3s ease;
}

.category-item.active .category-name {
	color: #ffffff;
	font-weight: 600;
}

/* 内容巷道通用样式 */
.content-lane {
	margin: 40rpx 0;
	padding: 0 30rpx;
}

.lane-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.lane-icon {
	font-size: 32rpx;
	line-height: 1;
}

.lane-title-wrapper {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.lane-title {
	font-size: 36rpx;
	font-weight: 700;
	color: var(--text-primary);
	letter-spacing: -0.5rpx;
}

.lane-subtitle {
	font-size: 22rpx;
	color: var(--text-tertiary);
	font-weight: 400;
	text-transform: uppercase;
	letter-spacing: 1rpx;
}

.lane-more-button {
	display: flex;
	align-items: center;
	gap: 4rpx;
	padding: 8rpx 16rpx;
	border-radius: 16rpx;
	background: rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

.lane-more-button:active {
	background: rgba(0, 0, 0, 0.1);
	transform: scale(0.95);
}

.lane-more-button text {
	font-size: 24rpx;
	color: var(--text-secondary);
	font-weight: 500;
}

/* 编辑精选巷道样式 */
.featured-lane {
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 255, 0.9) 100%);
	border-radius: 32rpx;
	margin: 40rpx 30rpx;
	padding: 32rpx;
	box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.08);
}

.featured-scroll {
	margin: 0 -16rpx;
}

.featured-list {
	display: flex;
	gap: 24rpx;
	padding: 0 16rpx;
}

.featured-card {
	width: 280rpx;
	flex-shrink: 0;
	background: #ffffff;
	border-radius: 24rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	overflow: hidden;
}

.featured-card:active {
	transform: translateY(-4rpx);
	box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
}

.card-cover-wrapper {
	position: relative;
	height: 360rpx;
	overflow: hidden;
}

.featured-cover {
	width: 100%;
	height: 100%;
}

.cover-overlay {
	position: absolute;
	top: 12rpx;
	right: 12rpx;
}

.status-badge {
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
	backdrop-filter: blur(10rpx);
	-webkit-backdrop-filter: blur(10rpx);
	font-size: 20rpx;
	color: #ffffff;
	font-weight: 600;
}

.status-ongoing {
	background: rgba(52, 199, 89, 0.9);
}

.status-completed {
	background: rgba(0, 122, 255, 0.9);
}

.status-paused {
	background: rgba(255, 149, 0, 0.9);
}

.status-unknown {
	background: rgba(142, 142, 147, 0.9);
}

.featured-info-wrapper {
	padding: 20rpx;
}

.featured-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.featured-title {
	font-size: 28rpx;
	font-weight: 600;
	color: var(--text-primary);
	line-height: 1.3;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.featured-author {
	font-size: 24rpx;
	color: var(--text-secondary);
	font-weight: 500;
}

.featured-category {
	font-size: 22rpx;
	color: var(--text-tertiary);
	font-weight: 400;
}

.featured-stats {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-top: 8rpx;
}

.stat-item {
	font-size: 22rpx;
	color: var(--text-tertiary);
	font-weight: 500;
}

/* 热门榜单巷道样式 */
.popular-lane {
	background: linear-gradient(135deg, rgba(255, 245, 235, 0.9) 0%, rgba(255, 235, 215, 0.9) 100%);
	border-radius: 32rpx;
	margin: 40rpx 30rpx;
	padding: 32rpx;
	box-shadow: 0 16rpx 48rpx rgba(255, 149, 0, 0.1);
}

.popular-scroll {
	margin: 0 -16rpx;
}

.popular-list {
	display: flex;
	gap: 20rpx;
	padding: 0 16rpx;
}

.popular-card {
	position: relative;
	width: 200rpx;
	flex-shrink: 0;
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
	overflow: hidden;
}

.popular-card:active {
	transform: translateY(-2rpx);
	box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.12);
}

.rank-badge {
	position: absolute;
	top: -8rpx;
	left: -8rpx;
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
}

.rank-1 {
	background: linear-gradient(135deg, #FFD700, #FFA500);
}

.rank-2 {
	background: linear-gradient(135deg, #C0C0C0, #A0A0A0);
}

.rank-3 {
	background: linear-gradient(135deg, #CD7F32, #B8860B);
}

.rank-4, .rank-5, .rank-6 {
	background: linear-gradient(135deg, #667eea, #764ba2);
}

.rank-number {
	font-size: 20rpx;
	color: #ffffff;
	font-weight: 700;
}

.popular-cover {
	width: 100%;
	height: 260rpx;
}

.popular-info {
	padding: 16rpx;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.popular-title {
	font-size: 26rpx;
	font-weight: 600;
	color: var(--text-primary);
	line-height: 1.3;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.popular-author {
	font-size: 22rpx;
	color: var(--text-secondary);
	font-weight: 500;
}

.popular-stats {
	display: flex;
	align-items: center;
	gap: 6rpx;
	margin-top: 4rpx;
}

.stat-icon {
	font-size: 20rpx;
}

.stat-text {
	font-size: 20rpx;
	color: var(--text-tertiary);
	font-weight: 500;
}

/* 最近更新巷道样式 */
.newest-lane {
	background: linear-gradient(135deg, rgba(235, 255, 245, 0.9) 0%, rgba(215, 255, 235, 0.9) 100%);
	border-radius: 32rpx;
	margin: 40rpx 30rpx;
	padding: 32rpx;
	box-shadow: 0 16rpx 48rpx rgba(52, 199, 89, 0.1);
}

.newest-scroll {
	margin: 0 -16rpx;
}

.newest-list {
	display: flex;
	gap: 16rpx;
	padding: 0 16rpx;
}

.newest-card {
	width: 160rpx;
	flex-shrink: 0;
	background: #ffffff;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
	transition: all 0.3s ease;
	overflow: hidden;
}

.newest-card:active {
	transform: translateY(-2rpx);
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.newest-cover-wrapper {
	position: relative;
	height: 200rpx;
	overflow: hidden;
}

.newest-cover {
	width: 100%;
	height: 100%;
}

.update-indicator {
	position: absolute;
	top: 8rpx;
	right: 8rpx;
}

.update-dot {
	font-size: 16rpx;
	color: #34C759;
	animation: pulse 2s infinite;
}

@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

.newest-info {
	padding: 12rpx;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.newest-title {
	font-size: 24rpx;
	font-weight: 600;
	color: var(--text-primary);
	line-height: 1.3;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.newest-author {
	font-size: 20rpx;
	color: var(--text-secondary);
	font-weight: 500;
}

/* 加载状态 */
.loading-state {
	padding: 60rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24rpx;
}

.loading-spinner {
	width: 48rpx;
	height: 48rpx;
	border: 4rpx solid var(--border-color);
	border-top-color: var(--accent-color);
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.loading-text {
	font-size: 28rpx;
	color: var(--text-secondary);
	font-weight: 500;
}

/* 空状态 */
.empty-state {
	padding: 120rpx 60rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24rpx;
	text-align: center;
}

.empty-icon {
	width: 200rpx;
	height: 200rpx;
	opacity: 0.6;
}

.empty-text {
	font-size: 32rpx;
	font-weight: 600;
	color: var(--text-secondary);
}

.empty-subtext {
	font-size: 28rpx;
	color: var(--text-tertiary);
	line-height: 1.5;
	max-width: 400rpx;
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

.sort-picker {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: flex-end;
	z-index: 2000;
}

.picker-content {
	width: 100%;
	background: var(--bg-primary);
	border-radius: 32rpx 32rpx 0 0;
	padding: 40rpx;
	max-height: 80vh;
	overflow: hidden;
}

.picker-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 40rpx;
}

.picker-title {
	font-size: 36rpx;
	font-weight: 700;
	color: var(--text-primary);
}

.picker-close {
	width: 48rpx;
	height: 48rpx;
	border-radius: 24rpx;
	background: var(--bg-tertiary);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: var(--text-secondary);
}

.picker-options {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.picker-option {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx;
	border-radius: 16rpx;
	transition: all 0.2s ease;
}

.picker-option:active {
	background: var(--bg-tertiary);
}

.picker-option.active {
	background: var(--accent-light);
}

.option-text {
	font-size: 32rpx;
	color: var(--text-primary);
	font-weight: 500;
}

.picker-option.active .option-text {
	color: var(--accent-color);
	font-weight: 600;
}

.option-check {
	font-size: 32rpx;
	color: var(--accent-color);
	font-weight: 700;
}
</style>