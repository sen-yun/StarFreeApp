<template>
	<view class="user" :style="{'background':'#f6f6f6','min-height':'auto'}">
		<view class="header" :style="[{height:CustomBar*2 + 25 + 'rpx'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar*2 + 25 + 'rpx','padding-top':StatusBar*2 + 25 + 'rpx'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar*2 + 25 + 'rpx'}]">
					<view class="section-sub" style="line-height: 30px;">
						<text style="font-size:30upx">
							{{ getPageTitle }}
						</text>
					</view>
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<scroll-view class="content-scroll" scroll-y>
			<view class="content-wrapper">
				<view class="quick-actions">
					<button class="action-btn get-info-btn" @tap="goToGetAppInfo">
						<text class="tn-icon-scan"></text>
						<text>扫描应用</text>
					</button>
					<button class="action-btn scan-btn" @tap="parseAppInfo">
						<text class="tn-icon-code"></text>
						<text>解析应用</text>
					</button>

				</view>

				<view class="form-section">
					<view class="section-title">
						<text class="title-text">{{ type === 'version' ? '新版本图标' : '应用图标' }}</text>
						<view class="title-line"></view>
					</view>

					<view class="logo-upload">
						<view class="logo-preview" @tap="chooseAppLogo">
							<u-image v-if="formData.logo" 
								:src="formData.logo" 
								width="160rpx"
								height="160rpx"
								:radius="40"
								mode="aspectFill"
								:lazy-load="true"
								:fade="true"
								duration="500"
								bg-color="#f8faff"
								@error="onImageError"
								@load="onImageLoad">
								<u-loading slot="loading"></u-loading>
							</u-image>
							<text v-else class="tn-icon-upload"></text>
						</view>
						<text class="upload-tip">{{ type === 'version' ? '点击上传新版本图标' : '点击上传应用图标' }}</text>
						<text class="hint-text" v-if="type === 'version' && lastVersion">
							不修改将默认为上个版本图标
						</text>
					</view>

					<view class="section-title margin-top-lg">
						<text class="title-text">{{ type === 'version' ? '版本信息' : '基本信息' }}</text>
						<view class="title-line"></view>
					</view>

					<view class="form-group">
						<text class="label">
							APP名称
							<text class="optional" v-if="type === 'version'">(可选)</text>
							<text class="required" v-else>*</text>
						</text>
						<input class="input" type="text" v-model="formData.name"
							:placeholder="type === 'version' ? '输入新版本APP名称' : '请输入应用名称'" />
						<text class="hint-text" v-if="type === 'version' && lastVersion">
							留空将默认为上个版本名称：{{lastVersion.name}}
						</text>
					</view>
					<view class="form-group">
						<view class="section-title margin-top-lg">
							<text class="title-text">版本信息</text>
							<view class="title-line"></view>
						</view>


						<view v-if="type === 'version'">
							<text class="label">
								版本名
								<text class="required">*</text>
							</text>
							<input class="input" type="text" v-model="formData.version" placeholder="如: 1.0.1" />
							<text class="hint-text" v-if="lastVersion">
								上个版本号：{{lastVersion.version}}
							</text>
						</view>
						<view v-else>
							<text class="label">
								版本名 和 版本号
								<text class="required">*</text>
							</text>
							<view class="version-inputs">
								<input class="input version-name" type="text" v-model="formData.version"
									placeholder="如 1.0.0" />
								<input class="input version-code" type="number" v-model="formData.versionCode"
									placeholder="如 100" />
							</view>
							<text class="hint-text" v-if="lastVersion">
								必须大于上个版本码：{{lastVersion.versionCode}}
							</text>
						</view>
					</view>

					<view class="form-group" v-if="type === 'version'">
						<text class="label">
							版本码
							<text class="required">*</text>
						</text>
						<input class="input" type="number" v-model="formData.versionCode" placeholder="如: 101" />
						<text class="hint-text" v-if="lastVersion">
							必须大于上个版本码：{{lastVersion.versionCode}}
						</text>
					</view>

					<view class="form-group" v-if="type === 'version'">
						<text class="label">
							更新说明
							<text class="required">*</text>
						</text>
						<textarea class="textarea" v-model="formData.info" placeholder="请输入更新内容" />
					</view>

					<template v-if="type !== 'version'">
						<view class="form-group">
							<text class="label">应用包名</text>
							<input class="input" type="text" v-model="formData.pkname" placeholder="请输入应用包名" />
						</view>
					</template>

					<view class="form-group">
						<text class="label">
							APP大小
							<text class="optional" v-if="type === 'version'">(可选)</text>
							<text class="required" v-else>*</text>
						</text>
						<view class="input-wrapper">
							<input class="input" type="number" v-model="formData.sizeDisplay"
								:placeholder="type === 'version' ? '输入新版本APP大小' : '请输入APP大小'" />
							<picker :value="formData.sizeUnit" :range="sizeUnits" @change="handleSizeUnitChange">
								<view class="suffix-select">
									<text>{{formData.sizeUnit}}</text>
									<text class="tn-icon-down"></text>
								</view>
							</picker>
						</view>
						<text class="hint-text" v-if="type === 'version' && lastVersion">
							留空将默认为上个版本大小：{{formatSize(lastVersion.size)}}
						</text>
					</view>

					<view class="section-title margin-top-lg">
						<text class="title-text">下载配置</text>
						<view class="title-line"></view>
					</view>

					<view class="form-group">
						<text class="label">网盘类型<text class="required">*</text></text>
						<view class="select-btn" @tap="openDiskTypePicker">
							<text class="btn-text">{{getDiskTypeName}}</text>
							<text class="tn-icon-right"></text>
						</view>
					</view>

					<view class="form-group">
						<text class="label">下载链接<text class="required">*</text></text>
						<input class="input" type="text" maxlength="-1" v-model="formData.downloadUrl"
							:placeholder="downloadUrlPlaceholder" />
					</view>

					<view class="form-group">
						<text class="label">提取码</text>
						<input class="input" type="text" v-model="formData.extractCode"
							:placeholder="extractCodePlaceholder" />
					</view>

					<template v-if="type !== 'version'">
						<view class="form-group">
							<view class="section-title margin-top-lg">
								<text class="title-text">应用分类</text>
								<view class="title-line"></view>
							</view>
							<view class="category-section">
								<view class="category-group">
									<view class="label-wrapper">
										<text class="label">应用分区
											<text class="required">*</text></text>
										<text class="selected-count">(可选1~3)</text>
									</view>

									<view class="selected-tags" v-if="selectedCategories.length > 0">
										<view class="selected-tag" v-for="id in selectedCategories" :key="id">
											<text>{{getCategoryName(id)}}</text>
											<text class="remove-tag" @tap.stop="toggleCategory(id)">×</text>
										</view>
									</view>

									<view class="select-btn" style="margin-bottom: 40rpx;" @tap="openCategoryPicker">
										<text class="btn-text">选择分区</text>
										<text class="tn-icon-right"></text>
									</view>

									<view class="label-wrapper">
										<text class="label">应用标签
											<text class="required">*</text></text>
										<text class="selected-count">(可选1~10)</text>
									</view>

									<view class="selected-tags" v-if="selectedTags.length > 0">
										<view class="selected-tag" v-for="id in selectedTags" :key="id">
											<text>{{getTagName(id)}}</text>
											<text class="remove-tag" @tap.stop="toggleTag(id)">×</text>
										</view>
									</view>

									<view class="select-btn" style="margin-bottom: 40rpx;" @tap="openTagPicker">
										<text class="btn-text">选择标签</text>
										<text class="tn-icon-right"></text>
									</view>

									<view class="form-group">
										<text class="label">应用铭牌
											<text class="required">*</text>
										</text>
										<view class="radio-group">
										<view v-for="item in badgeTypes" :key="item.value"
											:class="['radio-item', {'radio-active': formData.badge === item.value}]"
											@tap="formData.badge = item.value">
											{{ item.name }}
										</view>
										</view>
									</view>


								</view>
							</view>
						</view>

						<view class="form-group">
							<view class="section-title margin-top-lg">
								<text class="title-text">应用介绍</text>
								<view class="title-line"></view>
							</view>
							<textarea class="textarea" v-model="formData.info" placeholder="请输入应用介绍" maxlength="500" />
							<view class="word-count" style="text-align: right; color: #999999;">
								{{formData.info.length}}/500
							</view>
						</view>

						<view class="preview-upload">
							<scroll-view scroll-x class="preview-scroll" :scroll-left="scrollLeft"
								:scroll-with-animation="true">
								<text class="upload-tip">上传3-9张应用预览图</text>
								<view class="preview-list">
									<view v-for="(img, index) in formData.previewImages" :key="index"
										class="preview-item">
										<u-image 
											:src="img" 
											width="240rpx"
											height="440rpx"
											mode="aspectFill"
											:radius="20"
											:lazy-load="true"
											:fade="true"
											duration="500"
											bg-color="#f8faff"
											@error="onImageError"
											@load="onImageLoad">
											<u-loading slot="loading"></u-loading>
										</u-image>
										<view class="delete-btn" @tap.stop="deletePreview(index)">
											<text class="tn-icon-close"></text>
										</view>
									</view>
									<view class="preview-item upload-btn" @tap="choosePreviewImages"
										v-if="formData.previewImages.length < 9">
										<text class="tn-icon-add"></text>
									</view>
								</view>
							</scroll-view>
							<view class="scroll-indicator" v-if="formData.previewImages.length > 1">
								<text class="indicator-text">向左滑动查看更多</text>
								<text class="tn-icon-right indicator-icon"></text>
							</view>

						</view>
					</template>
				</view>
				<view class="submit-section">
					<button class="submit-btn" @tap="submitForm">
						<text class="btn-text">{{ type === 'version' ? '发布更新' : '提交审核' }}</text>
					</button>
				</view>
			</view>
		</scroll-view>
		<u-popup v-model="showCategoryPicker" mode="bottom" :mask-close-able="true" border-radius="24">
			<view class="picker-popup">
				<view class="picker-header">
					<text class="cancel" @tap="closeCategoryPicker">取消</text>
					<text class="title">选择分区</text>
					<text class="confirm" @tap="confirmCategory">确定</text>
				</view>

				<view class="search-box">
					<text class="tn-icon-search"></text>
					<input type="text" v-model="categorySearch" placeholder="搜索分区" @input="searchCategories" />
				</view>

				<scroll-view class="picker-content" scroll-y @scrolltolower="loadMoreCategories">

					<view class="loading-wrapper" v-if="loadingCategories">
						<view class="loading-spinner"></view>
						<text class="loading-text">加载中...</text>
					</view>

					<view class="tags-container" v-else>
						<view v-for="item in filteredCategories" :key="item.id"
							:class="['tag', {'tag-active': tempSelectedCategories.includes(item.id)}]"
							@tap="toggleTempCategory(item.id)">
							{{ item.name }}
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<u-popup v-model="showTagPicker" mode="bottom" :mask-close-able="true" border-radius="24">
			<view class="picker-popup">
				<view class="picker-header">
					<text class="cancel" @tap="closeTagPicker">取消</text>
					<text class="title">选择标签</text>
					<text class="confirm" @tap="confirmTag">确定</text>
				</view>

				<view class="search-box">
					<text class="tn-icon-search"></text>
					<input type="text" v-model="tagSearch" placeholder="搜索标签" @input="searchTags" />
				</view>

				<scroll-view class="picker-content" scroll-y @scrolltolower="loadMoreTags">

					<view class="loading-wrapper" v-if="loadingTags">
						<view class="loading-spinner"></view>
						<text class="loading-text">加载中...</text>
					</view>

					<view class="tags-container" v-else>
						<view v-for="item in filteredTags" :key="item.id"
							:class="['tag', {'tag-active': tempSelectedTags.includes(item.id)}]"
							@tap="toggleTempTag(item.id)">
							{{ item.name }}
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<u-popup v-model="showDiskTypePicker" mode="bottom" :mask-close-able="true" border-radius="24">
			<view class="picker-popup">
				<view class="picker-header">
					<text class="cancel" @tap="closeDiskTypePicker">取消</text>
					<text class="title">选择网盘类型</text>
					<text class="confirm" @tap="confirmDiskType">确定</text>
				</view>

				<scroll-view class="picker-content" scroll-y>
					<view class="disk-type-list">
						<view v-for="item in diskTypes" :key="item.value" class="disk-type-item"
							:class="{'disk-type-active': tempDiskType === item.value}"
							@tap="selectTempDiskType(item.value)">
							<view class="disk-name">{{item.name}}</view>
							<view class="disk-desc" v-if="item.subText">{{item.subText}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<u-popup v-model="showJsonParser" mode="center" :mask-close-able="true" border-radius="24">
			<view class="json-parser-popup">
				<view class="parser-header">
					<text class="title">解析应用信息</text>
					<text class="close-btn" @tap="closeJsonParser">×</text>
				</view>

				<view class="parser-content">
					<textarea class="json-input" v-model="jsonContent" placeholder="请粘贴扫描生成的应用信息数据" :maxlength="-1"
						auto-height></textarea>
				</view>

				<view class="parser-footer">
					<button class="cancel-btn" @tap="closeJsonParser">取消</button>
					<button class="confirm-btn" @tap="confirmParseJson">解析</button>
				</view>
			</view>
		</u-popup>
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
				formData: {
					logo: '',
					previewImages: [],
					name: '',
					pkname: '',
					version: '',
					versionCode: '',
					info: '',
					diskType: 'zl',
					downloadUrl: '',
					extractCode: '',
					urlSchemes: '',
					sizeDisplay: '',
					sizeUnit: 'Mb',
					badge: '1',
					system: 'android'
				},
				categories: [],
				tags: [],
				selectedCategories: [],
				selectedTags: [],
				categorySearch: '',
				tagSearch: '',
				filteredCategories: [],
				filteredTags: [],
				tempSelectedCategories: [],
				tempSelectedTags: [],
				categoryPage: 1,
				tagPage: 1,
				categoryLoading: false,
				tagLoading: false,
				showCategoryPicker: false,
				showTagPicker: false,
				diskTypes: [
					{
						value: 'zl',
						name: '直链',
						subText: '用户可直接下载'
					},
					{
						value: 'other',
						name: '网盘链接',
						subText: '需用户手动下载'
					}
				],
				systemTypes: [{
						value: 'android',
						name: '安卓'
					}
				],
				badgeTypes: [], // 改为空数组,在mounted中动态设置
				sizeUnits: ['Mb', 'Gb'],
				showDiskTypePicker: false,
				tempDiskType: '',
				themeColor: {
					primary: '#57d1b1',
					gradient: 'linear-gradient(135deg, #57d1b1, #009efd)'
				},
				diskTypeConfig: {
					lz: {
						urlPlaceholder: '请输入蓝奏云下载链接',
						codePlaceholder: '请输入蓝奏云提取码（选填）'
					},
					'123': {
						urlPlaceholder: '请输入123网盘下载链接',
						codePlaceholder: '请输入123网盘提取码（选填）'
					},
					zl: {
						urlPlaceholder: '请输入直链链接',
						codePlaceholder: '直链通常不需要提取码'
					},
					other: {
						urlPlaceholder: '请输入网盘链接',
						codePlaceholder: '请输入提取码（选填）'
					}
				},
				SPgetAppInfoUrl: this.$API.SFgetAppInfoUrl(),
				userInfo: null,
				token: "",
				showJsonParser: false,
				jsonContent: '',
				scrollLeft: 0,
				loadingCategories: false, // 新增：分类加载状态
				loadingTags: false, // 新增：标签加载状态
				isEdit: false, // 是否为编辑模式
				appId: null, // 应用ID
				group: '', // 用户组
				type: 'app', // 默认为应用发布模式
				lastVersion: null, // 存储上一个版本信息
			}
		},
		computed: {
			getDiskTypeName() {
				const diskType = this.diskTypes.find(item => item.value === this.formData.diskType)
				return diskType ? diskType.name : '请选择网盘类型'
			},
			downloadUrlPlaceholder() {
				return this.diskTypeConfig[this.formData.diskType]?.urlPlaceholder || '请输入下载链接'
			},
			extractCodePlaceholder() {
				return this.diskTypeConfig[this.formData.diskType]?.codePlaceholder || '请输入提取码（选填）'
			},
			getPageTitle() {
				if (this.type === 'version') {
					return '发布新版本';
				} else if (this.isEdit) {
					return '编辑应用';
				} else {
					return '发布应用';
				}
			}
		},
		onShow() {
			var that = this;
			// 获取配置的URL和用户信息
			if (localStorage.getItem('userinfo')) {
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.userInfo.style = "background-image:url(" + that.userInfo.avatar + ");"
			}
			if (localStorage.getItem('token')) {
				that.token = localStorage.getItem('token');
			}
			that.userStatus();
		},
		onLoad(options) {
			var that = this;
			// 获取配置的URL和用户信息
			if (localStorage.getItem('userinfo')) {
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.userInfo.style = "background-image:url(" + that.userInfo.avatar + ");"
			}
			if (localStorage.getItem('token')) {
				that.token = localStorage.getItem('token');
			}
			that.userStatus();
		
			// 设置操作类型和appId
			that.type = options.type || 'app';
			if (options.appId) {
				that.appId = parseInt(options.appId);
			}
		
			// 根据类型执行不同的初始化
			if (that.type === 'version') {
				// 发布新版本模式
				that.getLastVersion();
			} else if (that.appId) {
				// 编辑应用模式
				that.isEdit = true;
				that.loadAppInfo();
			}
		},
		
		methods: {
			back() {
				uni.navigateBack()
			},
			parseAppInfo() {
				this.showJsonParser = true;
			},
			closeJsonParser() {
				this.showJsonParser = false;
				this.jsonContent = '';
			},
			confirmParseJson() {
				if (!this.jsonContent.trim()) {
					uni.showToast({
						title: '请输入JSON数据',
						icon: 'none'
					});
					return;
				}

				try {
					const appInfo = JSON.parse(this.jsonContent);

					// 验证必要字段
					if (!appInfo.appName && !appInfo.packageName) {
						throw new Error('无效的应用信息JSON');
					}

					// 更新表单数据
					this.formData.name = appInfo.appName || this.formData.name;
					this.formData.pkname = appInfo.packageName || this.formData.pkname;
					this.formData.version = appInfo.versionName || this.formData.version;
					this.formData.versionCode = appInfo.versionCode || this.formData.versionCode;
					this.formData.urlSchemes = appInfo.urlScheme || this.formData.urlSchemes;

					// 处理系统类型
					if (appInfo.appType) {
						const systemType = appInfo.appType.toLowerCase();
						if (systemType === 'ios' || systemType === 'android') {
							this.formData.system = 'android';
						}
					}

					// 处理文件大小(转换为MB)
					if (appInfo.appSize) {
						let sizeInMb;
						if (appInfo.appSize > 1024 * 1024) { // 如果大于1GB
							sizeInMb = (appInfo.appSize / (1024 * 1024)).toFixed(2);
							this.formData.sizeUnit = 'Gb';
						} else {
							sizeInMb = (appInfo.appSize / 1024).toFixed(2);
							this.formData.sizeUnit = 'Mb';
						}
						this.formData.sizeDisplay = sizeInMb;
					}

					// 处理应用图标
					if (appInfo.icon) {
						// 如果是base64图片数据
						if (appInfo.icon.startsWith('data:image')) {
							this.formData.logo = appInfo.icon;
						}
						// 如果是URL
						else if (appInfo.icon.startsWith('http')) {
							this.formData.logo = appInfo.icon;
						}
					}

					// 处理应用介绍
					if (appInfo.description) {
						this.formData.info = appInfo.description;
					}

					// 处理预览图
					if (Array.isArray(appInfo.screenshots) && appInfo.screenshots.length > 0) {
						const validScreenshots = appInfo.screenshots.filter(url =>
							url.startsWith('http') || url.startsWith('data:image')
						);

						if (validScreenshots.length > 0) {
							this.formData.previewImages = [
								...this.formData.previewImages,
								...validScreenshots
							].slice(0, 9); // 最多9张
						}
					}

					uni.showToast({
						title: '解析成功',
						icon: 'success'
					});
					this.closeJsonParser();

				} catch (error) {
					console.error('解析JSON失败:', error);
					uni.showToast({
						title: '解析失败，请检查JSON格式',
						icon: 'none'
					});
				}
			},
			scanAppInfo() {
				// 扫描应用信息逻辑
			},
			toggleCategory(id) {
				const index = this.selectedCategories.indexOf(id)
				if (index > -1) {
					this.selectedCategories.splice(index, 1)
				} else if (this.selectedCategories.length < 3) {
					this.selectedCategories.push(id)
				} else {
					uni.showToast({
						title: '最多选择3个分区',
						icon: 'none'
					})
				}
			},
			toggleTag(id) {
				const index = this.selectedTags.indexOf(id)
				if (index > -1) {
					this.selectedTags.splice(index, 1)
				} else if (this.selectedTags.length < 10) {
					this.selectedTags.push(id)
				} else {
					uni.showToast({
						title: '最多选择10个标签',
						icon: 'none'
					})
				}
			},
			submitForm() {
				// 表单验证
				if (!this.validateForm()) return;

				// 构建基础提交数据
				const submitData = {
					token: this.token
				};

				if (this.type === 'version') {
					// 版本更新模式
					submitData.action = 'appVersionAdd';
					submitData.appid = this.appId;
					submitData.version = this.formData.version;
					submitData.versionCode = this.formData.versionCode;
					submitData.versionInfo = this.formData.info;
					submitData.downloadType = this.formData.diskType;
					submitData.downloadUrl = this.formData.downloadUrl;
					submitData.downloadPw = this.formData.extractCode || '';

					// 可选字段，如果有值才提交
					if (this.formData.name) {
						submitData.name = this.formData.name;
					}
					if (this.formData.logo) {
						submitData.logo = this.formData.logo;
					}
					if (this.formData.sizeDisplay) {
						submitData.size = this.convertSizeToKB();
					}
				} else {
					// 应用发布或编辑模式
					submitData.action = this.isEdit ? 'appEdit' : 'appAdd';
					if (this.isEdit) {
						submitData.appid = this.appId;
					}
					// 添加应用发布/编辑需要的字段
					submitData.name = this.formData.name;
					submitData.pkname = this.formData.pkname;
					submitData.version = this.formData.version;
					submitData.versionCode = this.formData.versionCode;
					submitData.info = this.formData.info;
					submitData.downloadType = this.formData.diskType;
					submitData.downloadUrl = this.formData.downloadUrl;
					submitData.downloadPw = this.formData.extractCode;
					submitData.urlSchemes = this.formData.urlSchemes;
					submitData.size = this.convertSizeToKB();
					submitData.logo = this.formData.logo;
					submitData.badge = this.formData.badge;
					submitData.system = 'android';
					submitData.sort = this.selectedCategories.join(',');
					submitData.tab = this.selectedTags.join(',');
					submitData.infoImg = this.formData.previewImages.join('||');
				}

				// 发送请求
				uni.showLoading({
					title: '提交中...'
				});
				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: submitData,
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							setTimeout(() => {
								// 返回到应用详情页
								uni.navigateBack();
							}, 1500);
						} else {
							uni.showToast({
								title: res.data.msg || '提交失败',
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
					complete: () => uni.hideLoading()
				});
			},
			// 选择应用图标
			chooseAppLogo() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						// 上传图片
						this.uploadImage(res.tempFilePaths[0], 'logo')
					}
				})
			},
			// 选择预览图
			choosePreviewImages() {
				const count = 9 - this.formData.previewImages.length
				uni.chooseImage({
					count,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						// 上传图片
						res.tempFilePaths.forEach(path => {
							this.uploadImage(path, 'preview')
						})
						// 添加延时以确保图片加载完成后再滚动
						setTimeout(() => {
							// 获取滚动区域的宽度并设置滚动位置
							const query = uni.createSelectorQuery()
							query.select('.preview-list').boundingClientRect(data => {
								if (data) {
									this.scrollLeft = data.width
								}
							}).exec()
						}, 300)
					}
				})
			},
			// 上传图片
			uploadImage(filePath, type) {
				uni.showLoading({
					title: '上传中...'
				})

				uni.uploadFile({
					url: this.$API.upload(), // 使用您的上传接口
					filePath: filePath,
					name: 'file',
					formData: {
						token: this.token
					},
					success: (res) => {
						const data = JSON.parse(res.data)
						if (data.code === 1) { // 根据您的接口返回改判断条件
							if (type === 'logo') {
								this.formData.logo = data.data.url
							} else {
								this.formData.previewImages.push(data.data.url)
							}
							uni.showToast({
								title: '上传成功',
								icon: 'success'
							})
						} else {
							uni.showToast({
								title: data.msg || '上传失败',
								icon: 'none'
							})
						}
						uni.hideLoading()
					},
					fail: () => {
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						})
						uni.hideLoading()
					},
				})
			},
			// 删除预览图
			deletePreview(index) {
				this.formData.previewImages.splice(index, 1)
			},
			// 获取分类名称
			getCategoryName(id) {
				// 先从已加载的分类列表中查找
				const category = this.filteredCategories.find(item => item.id === id);
				if (category) {
					return category.name;
				}

				// 如果没找到，发起请求获取分类信息
				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getSortList',
						getsort_order: 'sort',
						getsort_page: 1,
						getsort_limit: 1,
						getsort_id: id // 直接搜索ID
					},
					success: (res) => {
						if (res.data.code === 200 && res.data.data.length > 0) {
							// 找到对应的分类
							const category = res.data.data.find(item => item.id === id);
							if (category) {
								// 更新filteredCategories，避免重复请求
								if (!this.filteredCategories.some(item => item.id === id)) {
									this.filteredCategories.push(category);
								}
								return category.name;
							}
						}
					}
				});

				// 如果还是没找到，返回ID
				return `分类${id}`;
			},

			// 获取标签名称
			getTagName(id) {
				// 先从已加载的标签列表中查找
				const tag = this.filteredTags.find(item => item.id === id);
				if (tag) {
					return tag.name;
				}

				// 如果没找到，发起请求获取标签信息
				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getSortList',
						getsort_order: 'tab',
						getsort_page: 1,
						getsort_limit: 1,
						getsort_id: id // 直接搜索ID
					},
					success: (res) => {
						if (res.data.code === 200 && res.data.data.length > 0) {
							// 找到对应的标签
							const tag = res.data.data.find(item => item.id === id);
							if (tag) {
								// 更新filteredTags，避免重复请求
								if (!this.filteredTags.some(item => item.id === id)) {
									this.filteredTags.push(tag);
								}
								return tag.name;
							}
						}
					}
				});

				// 如果还是没找到，返回ID
				return `标签${id}`;
			},

			// 修改显示分类选择器方法
			openCategoryPicker() {
				this.tempSelectedCategories = [...this.selectedCategories];
				this.showCategoryPicker = true;
				this.categoryPage = 1;
				this.loadingCategories = true; // 显示加载动画

				// 加载分类数据
				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getSortList',
						getsort_order: 'sort',
						getsort_page: 1,
						getsort_limit: 30
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.filteredCategories = res.data.data;
						}
						this.loadingCategories = false; // 隐藏加载动画
					},
					fail: () => {
						uni.showToast({
							title: '网络开小差了',
							icon: 'none'
						})
						this.loadingCategories = false; // 隐藏加载动画
					}
				});
			},

			// 修改关闭分类选择器方法
			closeCategoryPicker() {
				this.showCategoryPicker = false;
				this.categorySearch = '';
				// 不需要重置filteredCategories
			},

			// 修改确认分类选择方法
			confirmCategory() {
				this.selectedCategories = [...this.tempSelectedCategories]
				this.showCategoryPicker = false
				this.categorySearch = ''
				// 添加提示
				uni.showToast({
					title: '已选择' + this.selectedCategories.length + '个分区',
					icon: 'none'
				})
			},

			// 时切换分类选择
			toggleTempCategory(id) {
				const index = this.tempSelectedCategories.indexOf(id)
				if (index > -1) {
					this.tempSelectedCategories.splice(index, 1)
				} else if (this.tempSelectedCategories.length < 3) {
					this.tempSelectedCategories.push(id)
				} else {
					uni.showToast({
						title: '最多选择3个分区',
						icon: 'none'
					})
				}
			},

			// 搜索分类
			searchCategories() {
				// 清空当前列表
				this.filteredCategories = [];

				// 发起搜索请求
				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getSortList',
						getsort_order: 'sort',
						getsort_search: this.categorySearch,
						getsort_page: 1,
						getsort_limit: 30
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.filteredCategories = res.data.data;
						}
					}
				});
			},

			// 加载更多分类
			loadMoreCategories() {
				if (this.categoryLoading) return;
				this.categoryLoading = true;

				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getSortList',
						getsort_order: 'sort',
						getsort_search: this.categorySearch,
						getsort_page: this.categoryPage + 1,
						getsort_limit: 30
					},
					success: (res) => {
						if (res.data.code === 200 && res.data.data.length > 0) {
							this.filteredCategories = [...this.filteredCategories, ...res.data.data];
							this.categoryPage++;
						}
						this.categoryLoading = false;
					},
					fail: () => {
						uni.showToast({
							title: '网络开小差了',
							icon: 'none'
						})
						this.categoryLoading = false; // 隐藏加载动画
					}
				});
			},

			// 标签相关方法
			openTagPicker() {
				this.tempSelectedTags = [...this.selectedTags];
				this.showTagPicker = true;
				this.tagPage = 1;
				this.loadingTags = true; // 显示加载动画

				// 加载标签数据
				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getSortList',
						getsort_order: 'tab',
						getsort_page: 1,
						getsort_limit: 30
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.filteredTags = res.data.data;
						}
						this.loadingTags = false; // 隐藏加载动画
					},
					fail: () => {
						uni.showToast({
							title: '网络开小差了',
							icon: 'none'
						})
						this.loadingTags = false; // 隐藏加载动画
					}
				});
			},

			closeTagPicker() {
				this.showTagPicker = false;
				this.tagSearch = '';
				// 不需要重置filteredTags
			},

			confirmTag() {
				this.selectedTags = [...this.tempSelectedTags]
				this.showTagPicker = false
				this.tagSearch = ''
			},

			toggleTempTag(id) {
				const index = this.tempSelectedTags.indexOf(id)
				if (index > -1) {
					this.tempSelectedTags.splice(index, 1)
				} else if (this.tempSelectedTags.length < 10) {
					this.tempSelectedTags.push(id)
				} else {
					uni.showToast({
						title: '最多选择10个标签',
						icon: 'none'
					})
				}
			},

			searchTags() {
				// 清空当前列表
				this.filteredTags = [];

				// 发起搜索请求
				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getSortList',
						getsort_order: 'tab',
						getsort_search: this.tagSearch,
						getsort_page: 1,
						getsort_limit: 30
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.filteredTags = res.data.data;
						}
					}
				});
			},

			// 加载更多标签
			loadMoreTags() {
				if (this.tagLoading) return;
				this.tagLoading = true;

				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getSortList',
						getsort_order: 'tab',
						getsort_search: this.tagSearch,
						getsort_page: this.tagPage + 1,
						getsort_limit: 30
					},
					success: (res) => {
						if (res.data.code === 200 && res.data.data.length > 0) {
							this.filteredTags = [...this.filteredTags, ...res.data.data];
							this.tagPage++;
						}
						this.tagLoading = false;
					},
					fail: () => {
						uni.showToast({
							title: '网络开小差了',
							icon: 'none'
						})
						this.tagLoading = false; // 隐藏加载动画
					}
				});
			},

			// 选择网盘类型
			selectDiskType(type) {
				this.formData.diskType = type
				// 根据类型更新placeholder
				switch (type) {
					case 'lz':
						this.formData.downloadUrlPlaceholder = "请输入蓝奏云下载链接"
						this.formData.extractCodePlaceholder = "请输入提取码（选填）"
						break
					case '123':
						this.formData.downloadUrlPlaceholder = "请输入123网盘下载链接"
						this.formData.extractCodePlaceholder = "请输入提取码（选填）"
						break
					case 'zl':
						this.formData.downloadUrlPlaceholder = "请输入直链链接"
						this.formData.extractCodePlaceholder = "直链通常不需要提取码"
						break
					default:
						this.formData.downloadUrlPlaceholder = "请输入网盘链接"
						this.formData.extractCodePlaceholder = "请输入提取码（选填）"
				}
			},

			// 处理大小单位变化
			handleSizeUnitChange(e) {
				this.formData.sizeUnit = this.sizeUnits[e.detail.value]
			},

			// 提交前转换大小为KB
			convertSizeToKB() {
				const size = parseFloat(this.formData.sizeDisplay)
				if (isNaN(size)) return 0

				if (this.formData.sizeUnit === 'gb') {
					return Math.round(size * 1024 * 1024)
				} else {
					return Math.round(size * 1024)
				}
			},

			openDiskTypePicker() {
				this.tempDiskType = this.formData.diskType
				this.showDiskTypePicker = true
			},

			closeDiskTypePicker() {
				this.showDiskTypePicker = false
			},

			selectTempDiskType(type) {
				this.tempDiskType = type
			},

			confirmDiskType() {
				this.formData.diskType = this.tempDiskType
				// 清空已输入的链接和提取码
				this.formData.downloadUrl = ''
				this.formData.extractCode = ''
				this.showDiskTypePicker = false
			},

			// 跳转到获取应用信息页面
			goToGetAppInfo() {
				const url = this.SPgetAppInfoUrl + '?token=' + this.token;

				// 使用通用的webview跳转方法
				this.goWeb(url, '获取应用信息');
			},
			goWeb(url, name) {
				var that = this;
				// #ifdef APP-PLUS || MP-WEIXIN
				uni.navigateTo({
					url: '/pages/contents/webview?url=' + url + '&name=' + name
				})
				// plus.runtime.openWeb(url);
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
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
							that.assets = res.data.data.assets;
							that.group = res.data.data.groupKey; // 保存用户组信息
							that.initBadgeTypes(); // 初始化铭牌选项
						}
						that.isLoading = 1;
					},
					fail: function(res) {
						uni.showToast({
							title: "网络异常",
							icon: 'none'
						})
					}
				})
			},
			// 解析信息JSON
			parseAppJson(jsonStr) {
				try {
					const appInfo = JSON.parse(jsonStr);

					// 填充表单数据
					this.formData.name = appInfo.appName || '';
					this.formData.pkname = appInfo.packageName || '';
					this.formData.version = appInfo.versionName || '';
					this.formData.versionCode = appInfo.versionCode || '';
					this.formData.urlSchemes = appInfo.urlScheme || '';

					// 处理文件大小（从KB转换为MB）
					if (appInfo.appSize) {
						const sizeMB = (appInfo.appSize / 1024).toFixed(2);
						this.formData.sizeDisplay = sizeMB;
						this.formData.sizeUnit = 'mb';
					}

					// 处理应用类型
					if (appInfo.appType) {
						this.formData.system = 'android';
					}

					// 如果有图标URL，设置图标
					if (appInfo.icon) {
						this.formData.logo = appInfo.icon;
					}

					uni.showToast({
						title: '应用信息已导入',
						icon: 'success'
					});
				} catch (e) {
					uni.showToast({
						title: 'JSON格式错误',
						icon: 'none'
					});
					console.error(e);
				}
			},

			// 监听页面消息
			onMessage(event) {
				try {
					const data = event.detail.data[0];
					if (data && data.type === 'appInfo') {
						this.parseAppJson(data.content);
					}
				} catch (e) {
					console.error('处理消息出错:', e);
				}
			},

			// 添加一个辅助方法用于验证URL
			isValidUrl(url) {
				try {
					new URL(url);
					return true;
				} catch {
					return false;
				}
			},

			// 修改加载应用信息的方法
			loadAppInfo() {
				uni.showLoading({
					title: '加载中...'
				});

				uni.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getAppInfo',
						getapp_appid: this.appId,
						getapp_token: this.token,
						getapp_isedit: 'true'
					},
					method: 'GET',
					dataType: 'json',
					success: (res) => {
						if (res.data.code === 200 && res.data.data.length > 0) {
							const appInfo = res.data.data[0];

							// 转换大小显示
							let sizeDisplay = '';
							let sizeUnit = 'Mb';
							if (appInfo.size) {
								const sizeInMb = appInfo.size / 1024; // 转换为MB
								if (sizeInMb >= 1024) {
									sizeDisplay = (sizeInMb / 1024).toFixed(2); // 转换为GB
									sizeUnit = 'Gb';
								} else {
									sizeDisplay = sizeInMb.toFixed(2);
									sizeUnit = 'Mb';
								}
							}

							// 填充基本表单数据
							this.formData = {
								name: appInfo.name,
								sizeDisplay: sizeDisplay,
								sizeUnit: sizeUnit,
								version: appInfo.version || '1.0.0',
								versionCode: appInfo.versionCode || 100,

								pkname: appInfo.pkname || '',
								badge: appInfo.type || '1',
								system: 'android',

								logo: appInfo.logo,
								info: appInfo.info.replace(/<br\s*\/?>/g, '\n').replace(/<\/?p>/g, ''),

								previewImages: appInfo.infoImg.split('||').filter(img => img),
								urlSchemes: appInfo.urlschemes || '',
								diskType: 'lz',
								downloadUrl: '',
								extractCode: ''
							};

							// 设置分类和标签
							if (appInfo.sort) {
								this.selectedCategories = appInfo.sort.split(',').map(id => parseInt(id));
							}
							if (appInfo.tab) {
								this.selectedTags = appInfo.tab.split(',').map(id => parseInt(id));
							}

							// 获取下载信息
							this.getDownloadInfo();

						} else {
							uni.showToast({
								title: '加载应用信息失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						});
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},

			// 添加获取下载信息的方法
			getDownloadInfo() {
				uni.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getDownUrl',
						geturl_appid: this.appId,
						geturl_type: 'initial',
						geturl_token: this.token
					},
					method: 'GET',
					dataType: 'json',
					success: (res) => {
						if (res.data.code === 200 && res.data.data) {
							const downloadInfo = res.data.data;
							// 更新表单数据中的下载相关信息
							this.formData = {
								...this.formData,
								downloadUrl: downloadInfo.downloadUrl || '',
								extractCode: downloadInfo.downloadPw || '',
								diskType: downloadInfo.downloadType || 'other'
							};
						} else {
							uni.showToast({
								title: '获取下载信息失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '获取下载信息失败',
							icon: 'none'
						});
					}
				});
			},

			formatSize(sizeInKB) {
				if (!sizeInKB) return '未知';

				const sizeInMB = sizeInKB / 1024;
				if (sizeInMB >= 1024) {
					// 大于等于1GB时显示GB
					return (sizeInMB / 1024).toFixed(2) + ' GB';
				} else {
					// 否则显示MB
					return sizeInMB.toFixed(2) + ' MB';
				}
			},
			initBadgeTypes() {
				// 基础选项(所有用户都可见)
				const baseTypes = [{
						value: '1',
						name: '搬运'
					},
					{
						value: '2',
						name: '原创'
					}
				];

				// 管理员可见的额外选项
				const adminTypes = [{
						value: '3',
						name: '金标'
					},
					{
						value: '4',
						name: '官方'
					}
				];

				// 如果是管理员,显示所有选项
				if (this.group === 'administrator') {
					this.badgeTypes = [...baseTypes, ...adminTypes];
				} else {
					// 非管理员只显示基础选项
					this.badgeTypes = baseTypes;
				}
			},
			// 获取上一个版本信息
			getLastVersion() {
				if (this.type !== 'version') return;

				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'getOldAppList',
						getold_appid: this.appId,
						getold_page: 1,
						getold_limit: 1, // 只需要最新的一个版本
						getold_token: this.token
					},
					success: (res) => {
						if (res.data.code === 200 && res.data.data.versions && res.data.data.versions.length >
							0) {
							// 获取最新的版本信息
							this.lastVersion = res.data.data.versions[0];

							// 预填充部分表单数据
							this.formData.version = ''; // 清空版本号等待用户输入
							this.formData.versionCode = parseInt(this.lastVersion.versionCode) + 1; // 自动递增版本码

							// 如果是可选字段,使用上一版本的值作为默认值
							if (!this.formData.name) {
								this.formData.name = this.lastVersion.name;
							}
							if (!this.formData.logo) {
								this.formData.logo = this.lastVersion.logo;
							}
							if (!this.formData.sizeDisplay) {
								// 转换size为显示格式
								const sizeInMb = this.lastVersion.size / 1024;
								if (sizeInMb >= 1024) {
									this.formData.sizeDisplay = (sizeInMb / 1024).toFixed(2);
									this.formData.sizeUnit = 'Gb';
								} else {
									this.formData.sizeDisplay = sizeInMb.toFixed(2);
									this.formData.sizeUnit = 'Mb';
								}
							}
						} else {
							// 如果没有历史版本,可能需要从app表获取初始版本信息
							uni.showToast({
								title: '获取版本信息失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络错误,请稍后重试',
							icon: 'none'
						});
					}
				});
			},
			// 验证表单
			validateForm() {
				if (this.type === 'version') {
					// 版本更新模式的验证
					if (!this.formData.version) {
						uni.showToast({
							title: '版本号不能为空',
							icon: 'none'
						});
						return false;
					}
					if (!this.formData.versionCode) {
						uni.showToast({
							title: '版本码不能为空',
							icon: 'none'
						});
						return false;
					}
					if (this.lastVersion && parseInt(this.formData.versionCode) <= parseInt(this.lastVersion
						.versionCode)) {
						uni.showToast({
							title: '版本码必须大于当前版本',
							icon: 'none'
						});
						return false;
					}
					if (!this.formData.info) {
						uni.showToast({
							title: '更新说明不能为空',
							icon: 'none'
						});
						return false;
					}
					if (!this.formData.downloadUrl) {
						uni.showToast({
							title: '下载链接不能为空',
							icon: 'none'
						});
						return false;
					}
				} else {
					// 保持原有的应用发布/编辑模式验证逻辑
				}

				return true;
			},
			// 添加图片加载事件处理方法
			onImageError(err) {
				console.error('图片加载失败:', err);
				uni.showToast({
					title: '图片加载失败',
					icon: 'none'
				});
			},
			onImageLoad() {
				console.log('图片加载成功');
			},
		},
		
	}
</script>

<style lang="scss" scoped>
	.dark .user{
		background: #1c1c1c !important;
		min-height: 100vh;
	}
	/* 整体容器样式 */
	.user {
		min-height: 100vh;
		background: linear-gradient(180deg, #f8faff 0%, #ffffff 100%);
	}
	
	.dark {
		.quick-actions .action-btn {
			&.get-info-btn,
			&.scan-btn,
			&.parse-btn,
			&.get-info-btn.active {
				background-color: #3c3c3c !important;
				color: #c7cddb !important;
				
				&:active {
					background-color: #4c4c4c !important;
				}
			}
		}
		
		.user {
			background-color: #1c1c1c !important;
		}
		
		.content-wrapper {
			.form-section {
				background-color: #2c2c2c !important;
				color: #c7cddb !important;
			}
			
			.form-group {
				.input-wrapper {
					.suffix-text,
					.suffix-select {
						background-color: #3c3c3c !important;
						border: 1px solid #3c3c3c !important;
					}
				}
				
				.radio-group .radio-item {
					background-color: #343434 !important;
					border: 1px solid transparent !important;
					
					&.active,
					&.radio-active {
						background-color: #3c3c3c !important;
					}
					
					&.radio-active {
						border: 1px solid #b3b3b3 !important;
					}
				}
				
				.input {
					background-color: #3c3c3c !important;
				}
			}
			
			.logo-upload .logo-preview {
				background-color: #3c3c3c !important;
			}
			
			.preview-upload .preview-item.upload-btn {
				background-color: #3c3c3c !important;
				border: 1px solid #3c3c3c !important;
			}
			
			.submit-section .submit-btn {
				color: #f2f2f2 !important;
			}
		}
		
		.select-btn,
		.select-btn.active {
			background-color: #3c3c3c !important;
		}
		
		input,
		textarea {
			background-color: #3c3c3c !important;
			border: 1px solid #3c3c3c !important;
		}
	}
	/* 内容区样式 */
	.content-wrapper {
		padding: 30rpx;

		.quick-actions {
			display: flex;
			gap: 20rpx;
			margin: 20rpx 0 40rpx;

			.action-btn {
				flex: 1;
				height: 90rpx;
				border-radius: 45rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 12rpx;
				font-size: 28rpx;
				color: #fff;
				border: none;
				box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.05);
				transition: all 0.3s;

				&.parse-btn {
					background: linear-gradient(135deg, #57d1b1, #00b4db);

					&:active {
						background: linear-gradient(135deg, #4ac0a2, #009ec1);
					}
				}

				&.scan-btn {
					background: linear-gradient(135deg, #8E2DE2, #4A00E0);

					&:active {
						background: linear-gradient(135deg, #7d28c9, #4000c4);
					}
				}

				&.get-info-btn {
					background: linear-gradient(135deg, #FF9800, #FF5722);

					&:active {
						background: linear-gradient(135deg, #F57C00, #E64A19);
					}
				}

				text {
					font-size: 32rpx;
				}
			}
		}

		/* 表单区域样式 */
		.form-section {
			background: #fff;
			border-radius: 24rpx;
			padding: 30rpx;
			box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.03);
			margin-bottom: 30rpx;

			.section-title {
				display: flex;
				align-items: center;
				margin: 20rpx 0 30rpx;

				.title-text {
					font-size: 32rpx;
					font-weight: 600;
					color: #333;
					position: relative;
					padding-left: 24rpx;

					&::before {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 6rpx;
						height: 28rpx;
						background: #57d1b1;
						border-radius: 6rpx;
					}
				}

				.title-line {
					flex: 1;
					height: 1px;
					background: linear-gradient(to right, #eee 0%, transparent 100%);
					margin-left: 20rpx;
				}
			}
		}

		/* Logo上传区域 */
		.logo-upload {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 30rpx 0;

			.logo-preview {
				width: 160rpx;
				height: 160rpx;
				border-radius: 40rpx;
				background: #f8faff;
				border: 2rpx dashed #ddd;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				transition: all 0.3s;
				box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.02);

				&:active {
					transform: scale(0.95);
				}

				image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.tn-icon-upload {
					font-size: 60rpx;
					color: #ccc;
				}
			}
		}

		/* 预览图上传区域 */
		.preview-upload {
			margin: 30rpx 0;

			.preview-scroll {
				width: 100%;
			}

			.preview-list {
				display: flex;
				padding: 20rpx 0;
				overflow-x: auto;

				&::-webkit-scrollbar {
					display: none;
				}
			}

			.preview-item {
				position: relative;
				width: 240rpx;
				height: 440rpx;
				margin-right: 20rpx;
				border-radius: 20rpx;
				overflow: hidden;
				box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.05);
				flex-shrink: 0;

				&.upload-btn {
					background: #f8faff;
					border: 2rpx dashed #ddd;
					display: flex;
					align-items: center;
					justify-content: center;

					.tn-icon-add {
						font-size: 60rpx;
						color: #ccc;
					}

					&:active {
						background: #f0f0f0;
					}
				}

				image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.delete-btn {
					position: absolute;
					top: 10rpx;
					right: 10rpx;
					width: 44rpx;
					height: 44rpx;
					border-radius: 22rpx;
					background: rgba(0, 0, 0, 0.6);
					display: flex;
					align-items: center;
					justify-content: center;
					backdrop-filter: blur(10rpx);

					.tn-icon-close {
						color: #fff;
						font-size: 24rpx;
					}
				}
			}

			.scroll-indicator {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 16rpx 0;
				gap: 8rpx;

				.indicator-text {
					font-size: 24rpx;
					color: #999;
				}

				.indicator-icon {
					font-size: 24rpx;
					color: #999;
					animation: slideRight 1.5s infinite;
				}
			}

			@keyframes slideRight {
				0% {
					transform: translateX(0);
					opacity: 0.3;
				}

				50% {
					transform: translateX(10rpx);
					opacity: 1;
				}

				100% {
					transform: translateX(0);
					opacity: 0.3;
				}
			}

			.upload-tip {
				font-size: 24rpx;
				color: #999;
				margin-top: 20rpx;
				text-align: center;
			}
		}

		/* 表单控件样式 */
		.form-group {
			margin-bottom: 30rpx;

			.label {
				font-size: 28rpx;
				color: #666;
				margin-bottom: 15rpx;
				display: block;
			}

			.input {
				width: 100%;
				height: 88rpx;
				background: #f8faff;
				border-radius: 16rpx;
				padding: 0 30rpx;
				font-size: 28rpx;
				color: #333;
				border: 2rpx solid #eee;
				transition: all 0.3s;

				&:focus {
					border-color: #57d1b1;
					background: #fff;
					box-shadow: 0 0 0 2rpx rgba(87, 209, 177, 0.1);
				}
			}

			.version-inputs {
				display: flex;
				gap: 20rpx;

				.version-name {
					flex: 2;
				}

				.version-code {
					flex: 1;
				}
			}

			.textarea {
				width: 100%;
				height: 300rpx;
				background: #f8faff;
				border-radius: 16rpx;
				padding: 20rpx 30rpx;
				font-size: 28rpx;
				color: #333;
				border: 2rpx solid #eee;
				transition: all 0.3s;

				&:focus {
					border-color: #57d1b1;
					background: #fff;
					box-shadow: 0 0 0 2rpx rgba(87, 209, 177, 0.1);
				}
			}

			.radio-group {
				display: flex;
				gap: 20rpx;
				flex-wrap: wrap;

				.radio-item {
					padding: 20rpx 30rpx;
					background: #f8faff;
					border-radius: 16rpx;
					border: 2rpx solid #eee;
					font-size: 28rpx;
					color: #666;
					transition: all 0.3s ease;
					display: flex;
					align-items: center;
					gap: 8rpx;

					.sub-text {
						font-size: 24rpx;
						color: #999;
					}

					&.radio-active {
						background: linear-gradient(135deg, #57d1b1, #00b4db);
						border-color: transparent;
						color: #fff;
						box-shadow: 0 6rpx 16rpx rgba(87, 209, 177, 0.25);

						.sub-text {
							color: rgba(255, 255, 255, 0.8);
						}
					}

					&:active {
						transform: scale(0.95);
					}
				}
			}

			.input-wrapper {
				display: flex;
				align-items: center;

				.input {
					flex: 1;
					border-radius: 16rpx 0 0 16rpx;
					border-right: none;
				}

				.suffix-select,
				.suffix-text {
					height: 88rpx;
					background: #f7f8fa;
					display: flex;
					align-items: center;
					padding: 0 30rpx;
					border-radius: 0 16rpx 16rpx 0;
					border: 2rpx solid #eee;
					border-left: none;

					text {
						font-size: 28rpx;
						color: #666;

						&.tn-icon-down {
							margin-left: 8rpx;
							font-size: 24rpx;
							color: #999;
						}
					}
				}

				.suffix-text {
					padding: 0 20rpx;
					background: #f7f8fa;

					text {
						font-size: 28rpx;
						color: #666;
					}
				}
			}

			.size-input {
				display: flex;
				align-items: center;
				gap: 20rpx;

				.input {
					flex: 1;
				}

				.unit {
					font-size: 28rpx;
					color: #666;
					padding: 0 20rpx;
				}
			}
		}

		/* 分类标签样式 */
		.category-section {

			.label-wrapper {
				display: flex;
				align-items: center;
				margin-bottom: 15rpx;

				.selected-count {
					font-size: 24rpx;
					color: #999;
					margin-left: 10rpx;
				}
			}

			.selected-tags {
				display: flex;
				flex-wrap: wrap;
				gap: 15rpx;
				margin-bottom: 20rpx;
				padding: 10rpx 0;

				.selected-tag {
					background: #e8f6f3;
					padding: 12rpx 24rpx;
					border-radius: 30rpx;
					font-size: 26rpx;
					color: #57d1b1;
					display: flex;
					align-items: center;
					transition: all 0.3s ease;
					box-shadow: 0 4rpx 12rpx rgba(87, 209, 177, 0.1);

					&:active {
						transform: scale(0.95);
					}

					.remove-tag {
						margin-left: 10rpx;
						font-size: 32rpx;
						line-height: 1;
						padding: 0 4rpx;

						&:active {
							opacity: 0.7;
						}
					}
				}
			}

			.select-btn {
				height: 88rpx;
				background: #f7f8fa;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx;
				transition: all 0.25s ease;

				.btn-text {
					font-size: 28rpx;
					color: #333;
				}

				.tn-icon-right {
					font-size: 24rpx;
					color: #999;
				}

				&:active {
					background: #f0f1f5;
				}
			}
		}

		/* 提交按钮样式 */
		.submit-section {
			margin: 60rpx 0;
			padding: 0 30rpx;

			.submit-btn {
				width: 100%;
				height: 90rpx;
				border-radius: 45rpx;
				background: #57d1b1;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-size: 32rpx;
				font-weight: 500;
				border: none;
				box-shadow: none;
				transition: all 0.3s;

				&:active {
					opacity: 0.9;
					transform: none;
				}
			}
		}
	}

	/* 提示文字样式 */
	.upload-tip {
		font-size: 24rpx;
		color: #999;
		margin-top: 20rpx;
		text-align: center;
	}

	.picker-popup {
		background: #fff;
		border-radius: 24rpx 24rpx 0 0;

		.picker-header {
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
			border-bottom: 1rpx solid #eee;

			.title {
				font-size: 32rpx;
				font-weight: 500;
			}

			.cancel,
			.confirm {
				font-size: 28rpx;
				color: #666;
			}

			.confirm {
				color: #57d1b1;
				font-weight: 500;
			}
		}

		.search-box {
			margin: 20rpx 30rpx;
			height: 80rpx;
			background: #f8faff;
			border-radius: 40rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			border: 2rpx solid #eee;
			transition: all 0.3s ease;

			&:focus-within {
				border-color: #57d1b1;
				background: #fff;
				box-shadow: 0 0 0 2rpx rgba(87, 209, 177, 0.1);
			}

			.tn-icon-search {
				font-size: 36rpx;
				color: #999;
				margin-right: 20rpx;
			}

			input {
				flex: 1;
				font-size: 28rpx;
				color: #333;

				&::placeholder {
					color: #999;
				}
			}
		}

		.picker-content {
			height: 600rpx;
			padding: 0 30rpx 30rpx;
			position: relative;

			.tags-container {
				display: flex;
				flex-wrap: wrap;
				padding: 20rpx 0;
				gap: 30rpx;

				.tag {
					min-width: 140rpx;
					padding: 20rpx 46rpx;
					background: #fff;
					border-radius: 16rpx;
					font-size: 28rpx;
					color: #666;
					text-align: center;
					transition: all 0.3s ease;
					box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

					&:active {
						transform: scale(0.95);
					}

					&.tag-active {
						background: #57d1b1;
						color: #fff;
						font-weight: 500;
						box-shadow: 0 6rpx 16rpx rgba(87, 209, 177, 0.25);

						&:active {
							transform: scale(0.95);
							box-shadow: 0 3rpx 8rpx rgba(87, 209, 177, 0.15);
						}
					}
				}

			}
		}
	}

	.unit-select {
		min-width: 100rpx;
		height: 88rpx;
		background: #f8faff;
		border-radius: 16rpx;
		border: 2rpx solid #eee;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
		padding: 0 20rpx;
		margin-left: 20rpx;

		text {
			font-size: 28rpx;
			color: #666;

			&.tn-icon-down {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	/* 修改主题色相样式 */
	.button-group {
		display: flex;
		gap: 20rpx;

		.button-item {
			flex: 1;
			height: 88rpx;
			background: #f8faff;
			border-radius: 16rpx;
			border: 2rpx solid #eee;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #666;
			transition: all 0.3s ease;

			&.button-active {
				background: v-bind('themeColor.gradient');
				border-color: transparent;
				color: #fff;
				box-shadow: 0 6rpx 16rpx rgba(0, 183, 238, 0.25);
			}

			&:active {
				transform: scale(0.95);
			}
		}
	}

	.disk-type-list {
		padding: 20rpx;

		.disk-type-item {
			padding: 24rpx;
			border-radius: 8rpx;
			background: #f7f8fa;
			margin-bottom: 12rpx;
			transition: all 0.25s ease;

			&:active {
				background: #f0f1f5;
			}

			&.disk-type-active {
				background: #57d1b1;
				color: #fff;
				position: relative;

				&::after {
					content: '✓';
					position: absolute;
					right: 24rpx;
					top: 50%;
					transform: translateY(-50%);
					font-size: 28rpx;
				}

				.disk-desc {
					color: rgba(255, 255, 255, 0.8);
				}
			}

			.disk-name {
				font-size: 28rpx;
				font-weight: 500;
				margin-bottom: 6rpx;
			}

			.disk-desc {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	/* 修改其他使用主题色的地方 */
	.submit-btn {
		background: #57d1b1 !important;
		box-shadow: none !important;

		&:active {
			opacity: 0.9;
			transform: none;
		}
	}

	.radio-item.radio-active {
		background: #57d1b1 !important;
		box-shadow: none !important;
	}

	.tag.tag-active {
		background: #57d1b1 !important;
		box-shadow: none !important;
	}

	.input:focus,
	.textarea:focus {
		border-color: #57d1b1 !important;
		box-shadow: none !important;
	}

	.confirm {
		color: #57d1b1 !important;
	}

	/* 修改系统兼容按钮组样式 */
	.system-group {
		display: flex;
		background: #f7f8fa;
		padding: 4rpx;
		border-radius: 12rpx;

		.system-item {
			flex: 1;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #666;
			transition: all 0.25s ease;
			position: relative;
			z-index: 1;
			border-radius: 8rpx;

			&.system-active {
				color: #57d1b1;
				background: #fff;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
			}
		}
	}

	/* 修改网盘型选择样 */
	.disk-type-list {
		padding: 20rpx;

		.disk-type-item {
			padding: 24rpx;
			border-radius: 8rpx;
			background: #f7f8fa;
			margin-bottom: 12rpx;
			transition: all 0.25s ease;

			&:active {
				background: #f0f1f5;
			}

			&.disk-type-active {
				background: #57d1b1;
				color: #fff;
				position: relative;

				&::after {
					content: '✓';
					position: absolute;
					right: 24rpx;
					top: 50%;
					transform: translateY(-50%);
					font-size: 28rpx;
				}

				.disk-desc {
					color: rgba(255, 255, 255, 0.8);
				}
			}

			.disk-name {
				font-size: 28rpx;
				font-weight: 500;
				margin-bottom: 6rpx;
			}

			.disk-desc {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	/* 修改选择按钮的通用样式 */
	.select-btn {
		height: 88rpx;
		background: #f7f8fa;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		transition: all 0.25s ease;

		.btn-text {
			font-size: 28rpx;
			color: #333;
		}

		.tn-icon-right {
			font-size: 24rpx;
			color: #999;
		}

		&:active {
			background: #f0f1f5;
		}
	}

	/* 修系统兼容按钮组样式 */
	.system-group {
		display: flex;
		background: #f7f8fa;
		padding: 4rpx;
		border-radius: 12rpx;

		.system-item {
			flex: 1;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #666;
			transition: all 0.25s ease;
			position: relative;
			z-index: 1;
			border-radius: 8rpx;

			&.system-active {
				color: #57d1b1;
				background: #fff;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
			}
		}
	}

	/* 修改快捷操作钮样式 */
	.quick-actions {
		.action-btn {
			background: #fff !important;
			color: #333 !important;

			&.get-info-btn {
				background: #fff !important;

				&:active {
					background: #f0f1f5 !important;
				}
			}
			&.scan-btn {
				background: #fff !important;

				&:active {
					background: #f0f1f5 !important;
				}
			}
		}
	}

	/* 修改提交按钮样式 */
	.submit-btn {
		background: #57d1b1 !important;
		box-shadow: none !important;

		&:active {
			opacity: 0.9;
			transform: none;
		}
	}

	/* 修改标签选择样式 */
	.tag {
		background: #f7f8fa !important;
		box-shadow: none !important;
		border-radius: 8rpx !important;

		&.tag-active {
			background: #57d1b1 !important;
			box-shadow: none !important;
		}
	}

	/* 修改APP铭牌选择样式 */
	.radio-group {
		.radio-item {
			background: #f7f8fa;
			box-shadow: none;
			border-radius: 8rpx;

			&.radio-active {
				background: #57d1b1 !important;
				box-shadow: none !important;
			}
		}
	}

	/* 修改网盘类型选择样式 */
	.disk-type-list {
		padding: 20rpx;

		.disk-type-item {
			padding: 24rpx;
			border-radius: 8rpx;
			background: #f7f8fa;
			margin-bottom: 12rpx;
			transition: all 0.25s ease;

			&:active {
				background: #f0f1f5;
			}

			&.disk-type-active {
				background: #57d1b1;
				color: #fff;
				position: relative;

				&::after {
					content: '✓';
					position: absolute;
					right: 24rpx;
					top: 50%;
					transform: translateY(-50%);
					font-size: 28rpx;
				}

				.disk-desc {
					color: rgba(255, 255, 255, 0.8);
				}
			}

			.disk-name {
				font-size: 28rpx;
				font-weight: 500;
				margin-bottom: 6rpx;
			}

			.disk-desc {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	/* 统一输入框样式 */
	.input,
	.textarea {
		background: #f7f8fa !important;
		border: none !important;
		box-shadow: none !important;

		&:focus {
			background: #f0f1f5 !important;
			box-shadow: none !important;
		}
	}

	/* 修改选择器头部样式 */
	.picker-header {
		.confirm {
			color: #57d1b1 !important;
			font-weight: 500;
		}
	}

	.quick-actions {
		.action-btn {
			&.get-info-btn {
				background: linear-gradient(135deg, #FF9800, #FF5722);

				&:active {
					background: linear-gradient(135deg, #F57C00, #E64A19);
				}
			}
		}
	}

	.required {
		color: #ff5252;
		font-size: 28rpx;
	}

	/* 在已有的样式中添加以下内容 */
	.form-group {
		.label {
			display: flex;
			align-items: center;
			gap: 8rpx;

			.required {
				color: #ff5252;
				font-size: 28rpx;
			}

			.optional {
				color: #999;
				font-size: 24rpx;
			}
		}

		.url-scheme-input {
			display: flex;
			align-items: center;

			.input {
				flex: 1;
				border-radius: 16rpx 0 0 16rpx;
			}

			.scheme-suffix {
				background: #f8faff;
				height: 88rpx;
				padding: 0 46rpx;
				display: flex;
				align-items: center;
				color: #666;
				font-size: 36rpx;
				border-radius: 0 16rpx 16rpx 0;
			}
		}
	}

	/* 可选字段的输入框样式稍微调淡一些 */
	.optional-input {
		background: #fafbfc !important;

		&::placeholder {
			color: #bbb;
		}
	}

	.json-parser-popup {
		width: 600rpx;
		background: #fff;
		border-radius: 24rpx;
		overflow: hidden;

		.parser-header {
			padding: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #f5f5f5;

			.title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}

			.close-btn {
				font-size: 40rpx;
				color: #999;
				padding: 10rpx;
				line-height: 1;

				&:active {
					opacity: 0.7;
				}
			}
		}

		.parser-content {
			padding: 30rpx;

			.json-input {
				width: 100%;
				min-height: 300rpx;
				background: #f8faff;
				border-radius: 16rpx;
				padding: 20rpx;
				font-size: 28rpx;
				color: #333;
				line-height: 1.5;

				&::placeholder {
					color: #999;
				}
			}
		}

		.parser-footer {
			padding: 20rpx 30rpx 30rpx;
			display: flex;
			gap: 20rpx;

			button {
				flex: 1;
				height: 80rpx;
				border-radius: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				border: none;

				&.cancel-btn {
					background: #f5f5f5;
					color: #666;

					&:active {
						background: #eee;
					}
				}

				&.confirm-btn {
					background: #57d1b1;
					color: #fff;

					&:active {
						opacity: 0.9;
					}
				}
			}
		}
	}

	.loading-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;

		.loading-spinner {
			width: 60rpx;
			height: 60rpx;
			border: 4rpx solid #f3f3f3;
			border-top: 4rpx solid #57d1b1;
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}

		.loading-text {
			margin-top: 20rpx;
			font-size: 28rpx;
			color: #999;
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	/* 添加提示文本样式 */
	.hint-text {
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.optional {
		color: #999;
		font-size: 24rpx;
		margin-left: 8rpx;
	}
</style>