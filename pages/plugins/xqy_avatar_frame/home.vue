<template>
  <view class="user" :class="[$store.state.AppStyle]" :style="{'background-color':'#f6f6f6','min-height':'100vh'}">
    <!-- 顶部导航栏 -->
    <view class="header" :style="[{height:CustomBar + 'px'}]">
      <view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
        <view class="action" @tap="back">
          <text class="cuIcon-back"></text>
        </view>
        <view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
          头像框商城
        </view>
        <view class="action" @tap="goToMyFrames">
          <text class="text-primary">我的头像框</text>
        </view>
      </view>
    </view>
    <!-- #ifdef APP-PLUS -->
    <view :style="[{padding:(NavBar-30) + 'px 10px 0px 10px'}]"></view>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <view :style="[{padding:(NavBar+30) + 'px 10px 0px 10px'}]"></view>
    <!-- #endif -->

    <!-- 筛选区域 -->
    <view class="filter-section">
      <view class="filter-container">
        <!-- 获取方式筛选 -->
        <view class="filter-item">
          <text class="filter-label">获取方式</text>
          <view class="custom-picker" @tap="showCustomPicker('filterType')">
            <view class="picker-content">
              <text class="picker-text">{{ filterTypeOptions[filterTypeIndex].label }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </view>
        </view>
        
        <!-- 头像框类型筛选 -->
        <view class="filter-item">
          <text class="filter-label">头像框类型</text>
          <view class="custom-picker" @tap="showCustomPicker('filterFrameType')">
            <view class="picker-content">
              <text class="picker-text">{{ filterFrameTypeOptions[filterFrameTypeIndex].label }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </view>
        </view>
        
        <!-- 拥有状态筛选 -->
        <view class="filter-item">
          <text class="filter-label">拥有状态</text>
          <view class="custom-picker" @tap="showCustomPicker('filterOwned')">
            <view class="picker-content">
              <text class="picker-text">{{ filterOwnedOptions[filterOwnedIndex].label }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </view>
        </view>
        
        <!-- 重置按钮 -->
        <view class="filter-reset" @tap="resetFilters">
          <text class="reset-text">重置</text>
        </view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="frame-content" v-if="pageReady">
      <!-- 空状态 -->
      <view class="empty-state" v-if="displayFrames.length === 0">
        <image class="empty-icon" src="/static/images/empty-frames.png" mode="aspectFit"></image>
        <text class="empty-text">暂无可获取的头像框</text>
      </view>
      
      <!-- 头像框网格 -->
      <view class="frame-grid" v-else>
        <view 
          class="frame-card" 
          v-for="frame in displayFrames" 
          :key="frame.id"
        >
          <view class="frame-content">
            <!-- 条件标签 -->
            <view class="condition-tags" v-if="frame.isOwned || (frame.conditions && !frame.isOwned)">
              <view class="tag owned" v-if="frame.isOwned">
                <text>已拥有</text>
              </view>
              <view class="tag review" v-if="frame.conditions.need_review && !frame.isOwned">
                <text>需审核</text>
              </view>
            </view>
            <image 
              :src="frame.frame_url" 
              class="frame-icon" 
              mode="aspectFit"
            ></image>
            <view class="frame-info">
              <text class="frame-name">{{ frame.name }}</text>
              <text class="frame-desc">{{ frame.description }}</text>
              <text class="frame-count">{{ frame.holder_count }}/{{ frame.max_holders || '∞' }}</text>
            </view>
          </view>
          <button 
                class="get-btn" 
                :class="{
                  'disabled': frame.max_holders > 0 && frame.holder_count >= frame.max_holders || applying || frame.isOwned || (frame.conditions && frame.conditions.need_review === 3 && !frame.isOwned),
                  'applying': applying,
                  'owned': frame.isOwned,
                  'admin-only-btn': frame.conditions && frame.conditions.need_review === 3 && !frame.isOwned
                }"
                @tap="frame.isOwned || (frame.conditions && frame.conditions.need_review === 3 && !frame.isOwned) ? null : showFramePreview(frame)"
                :disabled="frame.max_holders > 0 && frame.holder_count >= frame.max_holders || applying || frame.isOwned || (frame.conditions && frame.conditions.need_review === 3 && !frame.isOwned)"
              >
                <text class="btn-text">{{ frame.isOwned ? '已拥有' : (frame.conditions && frame.conditions.need_review === 3 && !frame.isOwned ? '仅限授予' : '申请') }}</text>
              </button>
        </view>
      </view>

      <!-- 分页控制器 -->
      <view class="pagination" v-if="filteredFrames.length > pageSize">
        <view class="page-btn" 
          :class="{ disabled: currentPage === 1 }"
          @tap="prevPage"
        >
          <text class="icon">←</text>
        </view>
        
        <view class="page-info">
          <text>{{ currentPage }}/{{ totalPages }}</text>
        </view>
        
        <view class="page-btn"
          :class="{ disabled: currentPage === totalPages }"
          @tap="nextPage"
        >
          <text class="icon">→</text>
        </view>
      </view>
    </view>
    <view v-else class="loading-container">
      <u-loading mode="circle" size="36"></u-loading>
    </view>

    <!-- 预览弹窗 -->
    <view class="preview-modal" v-if="showPreview" @tap="closePreview">
      <view class="preview-content" @tap.stop>
        <view class="preview-title">头像框预览</view>
        <view class="preview-image-container">
          <view class="preview-wrapper">
            <image 
              :src="userInfo && userInfo.avatar || '/static/images/default-avatar.png'" 
              class="preview-avatar"
              mode="aspectFill"
            ></image>
            <image 
              v-if="previewFrame" 
              :src="previewFrame.frame_url" 
              class="preview-frame"
              mode="aspectFit"
            ></image>
          </view>
          <view class="preview-info">
            <text class="preview-name">{{ previewFrame && previewFrame.name || '' }}</text>
            <text class="preview-desc">{{ previewFrame && previewFrame.description || '' }}</text>
            <!-- 显示获取条件 -->
            <view class="preview-conditions" v-if="previewFrame && previewFrame.conditions">
              <text class="condition-title">获取条件：</text>
              <view v-if="previewFrame.conditions.need_review" class="condition-item">
                需要管理员审核通过
              </view>

              <view v-if="previewFrame.conditions.condition_logic" class="condition-logic">
                {{ previewFrame.conditions.condition_logic === 'all' ? '需满足全部条件' : '满足当前条件' }}
              </view>
            </view>
          </view>
        </view>
        <view class="preview-actions">
          <button class="preview-btn cancel" @tap="closePreview">取消</button>
          <button 
            v-if="isLoggedIn"
            class="preview-btn apply" 
            @tap="handleApply" 
            :disabled="applying"
          >{{ applying ? '申请中...' : '申请' }}</button>
        </view>
      </view>
    </view>

    <!-- 自定义选择器弹窗 -->
    <view class="custom-picker-modal" v-if="showCustomPickerModal" @tap="hideCustomPicker">
      <view class="custom-picker-content" @tap.stop>
        <view class="custom-picker-header">
          <text class="custom-picker-title">{{ customPickerTitle }}</text>
          <view class="custom-picker-close" @tap="hideCustomPicker">
            <text class="close-icon">×</text>
          </view>
        </view>
        <view class="custom-picker-list">
          <view 
            class="custom-picker-item" 
            :class="{ 'selected': index === currentPickerIndex }"
            v-for="(item, index) in currentPickerOptions" 
            :key="index"
            @tap="selectPickerItem(index)"
          >
            <text class="picker-item-text">{{ item.label }}</text>
            <view class="picker-item-check" v-if="index === currentPickerIndex">
              <text class="check-icon">✓</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { localStorage } from '@/js_sdk/mp-storage/mp-storage/index.js'


export default {
  
  data() {
    return {
      StatusBar: this.StatusBar,
      CustomBar: this.CustomBar,
      NavBar: this.StatusBar + this.CustomBar,
      AppStyle: this.$store.state.AppStyle,
      frames: [],
      pageSize: 6,
      currentPage: 1,
      allFrames: [],
      userFrames: [], 
      applying: false,
      loading: false,
      isLoggedIn: false,
      userInfo: null,
      pageReady: false,
      pendingApplications: new Set(),
      applyDebounce: {},
      submitStatus: false,
      showPreview: false,
      previewFrame: null,
      token: '',
      acquiring: false,
      xqyFrameCache: {}, 
      applyDebounceTimer: null,
      applyDebounceDelay: 500, // 500ms防抖延迟
      // 筛选相关数据
      filterTypeIndex: 0,
      filterOwnedIndex: 0,
      filterFrameTypeIndex: 0,
      filterTypeOptions: [
        { label: '全部', value: 'all' },
        { label: '需审核', value: 'review' }
      ],
      filterOwnedOptions: [
        { label: '全部', value: 'all' },
        { label: '未拥有', value: 'not_owned' },
        { label: '已拥有', value: 'owned' }
      ],
      filterFrameTypeOptions: [
        { label: '全部', value: 'all' },
        { label: '静态', value: 'static' },
        { label: '动态', value: 'dynamic' }
      ],
      filteredFrames: [], // 筛选后的头像框列表
      // 自定义选择器相关
      showCustomPickerModal: false,
      customPickerTitle: '',
      currentPickerOptions: [],
      currentPickerIndex: 0,
      currentPickerType: ''
    }
  },

  computed: {
    displayFrames() {
      if (!Array.isArray(this.filteredFrames)) {
        return [];
      }
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredFrames.slice(start, start + this.pageSize);
    },
    totalPages() {
      if (!Array.isArray(this.filteredFrames)) {
        return 0;
      }
      return Math.ceil(this.filteredFrames.length / this.pageSize);
    },
  },

  async mounted() {
    try {
      // 确保安全访问缓存
      try {
        // 初始化缓存
        if (typeof uni !== 'undefined' && uni.getStorageSync) {
          const cacheData = uni.getStorageSync('xqyFrameCache');
          if (cacheData) {
            this.xqyFrameCache = JSON.parse(cacheData);
          }
        }
      } catch (err) {
        console.error('初始化头像框缓存失败:', err);
        this.xqyFrameCache = {};
      }
      
      await this.getUserInfo();
      await this.checkLoginStatus();
      if (this.isLoggedIn) {
        await this.loadFrames();
      }
    } finally {
      this.pageReady = true;
    }
  },

  methods: {
    // 获取用户信息和头像
    async getUserInfo() {
      try {
        // 获取token
        let token = '';
        // #ifdef H5
        if(localStorage.getItem('userinfo')){
          const userInfo = JSON.parse(localStorage.getItem('userinfo'));
          token = userInfo.token;
        }
        // #endif
        
        // #ifdef APP-PLUS || MP
        const userInfo = uni.getStorageSync('userinfo');
        if(userInfo) {
          const parsedUserInfo = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
          token = parsedUserInfo.token;
        }
        // #endif
        
        this.token = token;
        
        if (!token) return;
        
        // 使用Promise包装uni.request以处理错误
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: this.$API.PluginLoad('xqy_avatar_frame'),
            data: {
              plugin: 'xqy_avatar_frame',
              action: 'getUserInfo',
              token: token
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          });
        });
        
        if (res.data && res.data.code === 200) {
          this.userInfo = res.data.data;
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    
    // 检查登录状态
    async checkLoginStatus() {
      this.isLoggedIn = !!this.token;
      return this.isLoggedIn;
    },
    
    // 加载头像框列表
    async loadFrames() {
      try {
        this.loading = true;
        
        // 加载所有头像框
        const allFramesRes = await this.loadAllFrames();
        this.allFrames = allFramesRes || [];
        
        // 只有在用户登录时才加载用户已拥有的头像框
        let userFramesRes = [];
        if (this.isLoggedIn && this.token) {
          userFramesRes = await this.loadUserFrames();
        }
        
        // 处理用户已拥有的头像框数据
        this.userFrames = userFramesRes || [];
        const userFrameIds = new Set(this.userFrames.map(frame => frame.id));
        
        // 标记用户已拥有的头像框
        this.allFrames = this.allFrames.map(frame => ({
          ...frame,
          isOwned: this.isLoggedIn ? userFrameIds.has(frame.id) : false
        }));
        
        // 初始化筛选数据
        this.applyFilters();
        
        
        if (this.allFrames.length === 0) {
          uni.showToast({
            title: '暂无可用头像框',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('加载头像框列表失败:', error);
        // 显示错误提示
        uni.showToast({
          title: '加载头像框失败，请稍后再试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    // 加载所有头像框
    async loadAllFrames() {
      let allFrames = [];
      let page = 1;
      let hasMoreData = true;
      const pageSize = 20;
      const maxPages = 10;
      
      while (hasMoreData && page <= maxPages) {
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: this.$API.PluginLoad('xqy_avatar_frame'),
            data: {
              plugin: 'xqy_avatar_frame',
              action: 'manage_frame',
              op: 'list',
              page: page,
              pageSize: pageSize
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            timeout: 10000,
            success: (res) => resolve(res),
            fail: (err) => {
              console.error(`请求第${page}页失败:`, err);
              resolve({ data: { code: 500, msg: '请求失败' } });
            }
          });
        });
        
        if (res.data && res.data.code === 200) {
          const frames = res.data.data.frames || [];
          allFrames = [...allFrames, ...frames];
          
          if (frames.length < pageSize || page >= res.data.data.totalPages) {
            hasMoreData = false;
          } else {
            page++;
          }
        } else {
          hasMoreData = false;
        }
        
        if (hasMoreData) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      return allFrames.filter(frame => frame.status === 1);
    },
    
    // 加载用户已拥有的头像框
    async loadUserFrames() {
      try {
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: this.$API.PluginLoad('xqy_avatar_frame'),
            data: {
              plugin: 'xqy_avatar_frame',
              action: 'get_user_frames',
              op: 'list',
              token: this.token
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => resolve(res),
            fail: (err) => {
              console.error('获取用户头像框失败:', err);
              resolve({ data: { code: 200, data: { awarded: [] } } });
            }
          });
        });
        
        if (res.data && res.data.code === 200) {
          return res.data.data.awarded || [];
        }
        return [];
      } catch (error) {
        console.error('获取用户头像框失败:', error);
        return [];
      }
    },

    // 显示预览弹窗
    showFramePreview(frame) {
      this.previewFrame = frame;
      this.showPreview = true;
    },
    
    closePreview() {
      this.showPreview = false;
      this.previewFrame = null;
    },
    
    // 处理申请操作
    handleApply() {
      if (this.applyDebounceTimer) {
        clearTimeout(this.applyDebounceTimer);
      }
      
      this.applyDebounceTimer = setTimeout(() => {
        if (!this.isLoggedIn) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/user/login'
            });
          }, 1500);
          return;
        }
        
        if (this.applying) return;
        
        // 检查该头像框是否在防抖期
        if (this.applyDebounce[this.previewFrame.id]) {
          return;
        }

        
        if (this.previewFrame.conditions && this.previewFrame.conditions.need_review === 1) {
          uni.showModal({
            title: '申请确认',
            content: '该头像框需要管理员审核，确定要提交申请吗？',
            success: (res) => {
              if (res.confirm) {
                this.submitApply();
              }
            }
          });
          return;
        }
        
        this.submitApply();
      }, this.applyDebounceDelay);
    },

    // 提交申请
    async submitApply() {
      this.applying = true;
      // 设置防抖状态
      this.applyDebounce[this.previewFrame.id] = true;
      
      try {
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: this.$API.PluginLoad('xqy_avatar_frame'),
            data: {
              plugin: 'xqy_avatar_frame',
              action: 'apply_frame',
              frame_id: this.previewFrame.id,
              token: this.token
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          });
        });

        if (res.data.code === 200) {
          // 根据条件类型显示不同提示
          const needReview = this.previewFrame.conditions ? this.previewFrame.conditions.need_review : 1;
          let message = '申请已提交，请等待审核';
          
          if (needReview === 0 || needReview === 2) {
            message = '申请成功！头像框已添加到您的收藏中';
          }
          
          uni.showToast({
            title: message,
            icon: 'success'
          });
          this.closePreview();
          // 如果是直接获取成功，刷新列表
          if (needReview === 0 || needReview === 2) {
            await this.loadFrames();
          }
        } else {
          uni.showToast({
            title: res.data.msg || '操作失败',
            icon: 'none'
          });
        }
      } catch (err) {
        console.error('操作失败:', err);
        uni.showToast({
          title: '网络错误,请重试',
          icon: 'none'
        });
      } finally {
        this.applying = false;
        // 3秒后清除防抖状态
        setTimeout(() => {
          this.applyDebounce[this.previewFrame.id] = false;
        }, 3000);
      }
    },

    // 页面导航
    back() {
      uni.navigateBack();
    },
    
    goToMyFrames() {
      uni.navigateTo({
        url: '/pages/plugins/xqy_avatar_frame/myFrame'
      });
    },

    // 分页控制
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    onShow() {
      this.checkLoginStatus();
      if (this.isLoggedIn) {
        this.loadFrames();
      } else {
        uni.navigateTo({
          url: '/pages/login/login'
        });
      }
    },







    async acquireFrame(frame) {
      if (this.acquiring) return;
      this.acquiring = true;
      
      try {
        const res = await this.$Net.request({
          url: this.$API.PluginLoad('xqy_avatar_frame'),
          data: {
            plugin: 'xqy_avatar_frame',
            action: 'acquire_frame',
            frame_id: this.previewFrame.id,
            token: this.token
          },
          method: 'POST'
        });
        
        if (res.data.code === 200) {
          uni.showToast({
            title: '获取成功',
            icon: 'success'
          });
          this.closePreview();
          this.loadFrames();
        } else {
          uni.showToast({
            title: res.data.msg || '获取失败',
            icon: 'none'
          });
        }
      } catch (err) {
        console.error('获取失败:', err);
        uni.showToast({
          title: '获取失败，请重试',
          icon: 'none'
        });
      } finally {
        this.acquiring = false;
      }
    },

    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    },

    // 筛选相关方法
    applyFilters() {
      if (!Array.isArray(this.allFrames)) {
        this.filteredFrames = [];
        return;
      }

      let filtered = [...this.allFrames];

      // 按获取方式筛选
      const filterType = this.filterTypeOptions[this.filterTypeIndex].value;
      if (filterType !== 'all') {
        filtered = filtered.filter(frame => {
          switch (filterType) {
            case 'review':
              // 只有需要审核的头像框
              return frame.conditions && frame.conditions.need_review === 1;
            case 'approved':
              // 申请通过的头像框（包括原来的货币购买，在免费版中归类为申请通过）
              return frame.conditions && (frame.conditions.need_review === 2 || frame.conditions.need_review === 0);
            default:
              return true;
          }
        });
      }

      // 按头像框类型筛选
      const filterFrameType = this.filterFrameTypeOptions[this.filterFrameTypeIndex].value;
      if (filterFrameType !== 'all') {
        filtered = filtered.filter(frame => {
          // 使用数据库中的 frame_type 字段进行筛选
          switch (filterFrameType) {
            case 'static':
              return frame.frame_type === 'static';
            case 'dynamic':
              return frame.frame_type === 'dynamic';
            default:
              return true;
          }
        });
      }

      // 按拥有状态筛选
      const filterOwned = this.filterOwnedOptions[this.filterOwnedIndex].value;
      if (filterOwned !== 'all') {
        filtered = filtered.filter(frame => {
          if (filterOwned === 'owned') {
            return frame.isOwned;
          } else if (filterOwned === 'not_owned') {
            return !frame.isOwned;
          }
          return true;
        });
      }

      this.filteredFrames = filtered;
      
      // 筛选完成
      
      // 重置到第一页
      this.currentPage = 1;
    },

    onFilterTypeChange(e) {
      this.filterTypeIndex = e.detail.value;
      this.applyFilters();
    },

    onFilterOwnedChange(e) {
      this.filterOwnedIndex = e.detail.value;
      this.applyFilters();
    },

    onFilterFrameTypeChange(e) {
      this.filterFrameTypeIndex = e.detail.value;
      this.applyFilters();
    },

    resetFilters() {
      this.filterTypeIndex = 0;
      this.filterOwnedIndex = 0;
      this.filterFrameTypeIndex = 0;
      this.applyFilters();
    },

    // 自定义选择器相关方法
    showCustomPicker(type) {
      this.currentPickerType = type;
      
      switch (type) {
        case 'filterType':
          this.customPickerTitle = '选择获取方式';
          this.currentPickerOptions = this.filterTypeOptions;
          this.currentPickerIndex = this.filterTypeIndex;
          break;
        case 'filterFrameType':
          this.customPickerTitle = '选择头像框类型';
          this.currentPickerOptions = this.filterFrameTypeOptions;
          this.currentPickerIndex = this.filterFrameTypeIndex;
          break;
        case 'filterOwned':
          this.customPickerTitle = '选择拥有状态';
          this.currentPickerOptions = this.filterOwnedOptions;
          this.currentPickerIndex = this.filterOwnedIndex;
          break;
      }
      
      this.showCustomPickerModal = true;
    },

    hideCustomPicker() {
      this.showCustomPickerModal = false;
      this.currentPickerType = '';
    },

    selectPickerItem(index) {
      this.currentPickerIndex = index;
      
      switch (this.currentPickerType) {
        case 'filterType':
          this.filterTypeIndex = index;
          break;
        case 'filterFrameType':
          this.filterFrameTypeIndex = index;
          break;
        case 'filterOwned':
          this.filterOwnedIndex = index;
          break;
      }
      
      this.applyFilters();
      this.hideCustomPicker();
    },
  }
}
</script>

<style lang="scss">
.filter-section {
  background: #fff;
  margin: 0 20rpx 20rpx 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
  
}

.filter-container {
  display: flex;
  align-items: center;
  padding: 24rpx;
  gap: 16rpx;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 140rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.filter-label {
  font-size: 24rpx;
  color: #8e8e93;
  
}

.custom-picker {
  width: 100%;
  cursor: pointer;
}

.picker-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  
  
  &:active {
    border-color: #007AFF;
  }
}

.picker-text {
  font-size: 28rpx;
  color: #333;
  
}

.picker-arrow {
  font-size: 20rpx;
  color: #8e8e93;
  transform: scale(0.8);

}

.filter-reset {
  padding: 16rpx 20rpx;
  background: #007AFF;
  border-radius: 12rpx;
  min-width: 80rpx;
  
  &:active {
    opacity: 0.8;
  }
}

.reset-text {
  font-size: 28rpx;
  color: #fff;
  text-align: center;
}

.frame-content {
  padding: 20rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  
  .empty-icon {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
  }
  
  .empty-text {
    color: #8e8e93;
    font-size: 28rpx;
  }
}

.frame-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.frame-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);

  .frame-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.frame-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 16rpx;
  object-fit: contain;
  transform: scale(1.2);
}

.frame-info {
  text-align: center;
  width: 100%;
}

.frame-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #000;
  margin-bottom: 8rpx;
}

.frame-desc {
  font-size: 24rpx;
  color: #8e8e93;
  margin-bottom: 8rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.frame-count {
  font-size: 24rpx;
  color: #8e8e93;
}

.get-btn {
  width: 100%;
  height: 56rpx;
  border-radius: 28rpx;
  background: #007AFF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16rpx;
  
  &:active {
    opacity: 0.8;
  }
  
  &.disabled {
    background: #c7c7cc;
  }
  
  &.owned {
    background: #e8e8e8;
    cursor: not-allowed;

    &:active {
      opacity: 1;
    }
    
    .btn-text {
      color: #999999;
    }
  }
  
  &.admin-only-btn {
    background: #8e8e93;
    cursor: not-allowed;

    &:active {
      opacity: 1;
    }
    
    .btn-text {
      color: #fff;
    }
  }
  
  .btn-text {
    color: #fff;
    font-size: 24rpx;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
  gap: 32rpx;
}

.page-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);

  &:active {
    transform: scale(0.95);
  }
  
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  
  .icon {
    font-size: 36rpx;
    color: #007AFF;
  }
}

.page-info {
  font-size: 30rpx;
  color: #8e8e93;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
}

// 自定义选择器弹窗样式
.custom-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.custom-picker-content {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  width: 100%;
  max-height: 60vh;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.custom-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.custom-picker-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.custom-picker-close {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30rpx;
  background: #f5f5f5;
  transition: all 0.2s ease;

  &:active {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.close-icon {
  font-size: 40rpx;
  color: #666;
}

.custom-picker-list {
  max-height: 50vh;
  overflow-y: auto;
}

.custom-picker-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.2s ease;
 
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background: #f8f8f8;
  }
  
  &.selected {
    background: #f0f8ff;
  }
}

.picker-item-text {
  font-size: 30rpx;
  color: #333;

  .selected & {
    color: #007AFF;
    font-weight: 600;
  }
}

.picker-item-check {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 32rpx;
  color: #007AFF;
  font-weight: bold;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.preview-content {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  width: 85%;
  max-width: 600rpx;
}

.preview-title {
  font-size: 32rpx;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30rpx;
}

.preview-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30rpx 0;
}

.preview-wrapper {
  position: relative;
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    position: absolute;
    top: -10rpx;
    left: -10rpx;
    right: -10rpx;
    bottom: -10rpx;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(0,122,255,0.1), transparent 70%);
    animation: pulse 2s ease-in-out infinite;
  }
}

.preview-avatar {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4rpx solid #fff;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);
}

.preview-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(1.2);
  pointer-events: none;
  z-index: 2;
}

.preview-info {
  text-align: center;
  margin-top: 20rpx;
}

.preview-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.preview-desc {
  font-size: 26rpx;
  color: #666;
  display: block;
}

.preview-actions {
  display: flex;
  gap: 20rpx;
}

.preview-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.cancel {
    background: #f5f5f5;
    color: #666;
  }
  
  &.apply {
    background: #007AFF;
    color: #fff;
    
    &:disabled {
      opacity: 0.5;
      background: #ccc;
    }
  }
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.5;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.condition-tags {
  position: absolute;
  top: -20rpx;
  left: 10rpx;
  display: flex;
  gap: 10rpx;
  z-index: 3;
}

.tag {
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  color: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
  
  &.owned {
    background: #34c759;
    color: #fff;
  }
  
  &.review {
    background: #ff6b6b;
  }
  
  &.level {
    background: #4ecdc4;
  }
  
  &.currency {
    background: #ffd93d;
    color: #333;
  }
  
  &.admin-only {
    background: #8e8e93;
    color: #fff;
  }
  
  &.logic {
    background: #6c5ce7;
    font-size: 18rpx;
  }
}

.preview-conditions {
  margin-top: 20rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;

  .condition-title {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 10rpx;
    font-weight: bold;
  }
  
  .condition-item {
    font-size: 24rpx;
    color: #333;
    margin: 8rpx 0;
    padding: 8rpx 16rpx;
    background: #fff;
    border-radius: 8rpx;
    box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
    border-left: 4rpx solid #007AFF;

    .currency-name {
      color: #ff9500;
      font-weight: 600;
      margin-left: 4rpx;
    }
  }
  
  .condition-logic {
    font-size: 22rpx;
    color: #666;
    margin-top: 10rpx;
    text-align: center;
    padding: 4rpx 0;
    border-top: 1px dashed #ddd;
  }
}

.preview-btn {
  &.apply {
    background: #007AFF;
    color: #fff;
    
    &:disabled {
      opacity: 0.5;
      background: #ccc;
    }
  }
}
</style>
