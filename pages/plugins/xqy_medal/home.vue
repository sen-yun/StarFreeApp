<template>
  <view class="user" :class="[$store.state.AppStyle]" :style="{'background-color':'#f6f6f6','min-height':'auto'}">
    <!-- 顶部导航栏 -->
    <view class="header" :style="[{height:CustomBar + 'px'}]">
      <view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
        <view class="action" @tap="back">
          <text class="cuIcon-back"></text>
        </view>
        <view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
          勋章馆
        </view>
        <view class="action" @tap="goToMyMedals">
          <text class="text-primary">我的勋章</text>
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
        
        <!-- 勋章类型筛选 -->
        <view class="filter-item">
          <text class="filter-label">勋章类型</text>
          <view class="custom-picker" @tap="showCustomPicker('filterMedalType')">
            <view class="picker-content">
              <text class="picker-text">{{ filterMedalTypeOptions[filterMedalTypeIndex].label }}</text>
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
    <view class="medal-content" v-if="pageReady">
      <!-- 空状态 -->
      <view class="empty-state" v-if="displayMedals.length === 0">
        <image class="empty-icon" src="/static/images/empty-medals.png" mode="aspectFit"></image>
        <text class="empty-text">暂无可申请的勋章</text>
      </view>
      
      <!-- 勋章网格 -->
      <view class="medal-grid" v-else>
        <view 
          class="medal-card" 
          v-for="medal in displayMedals" 
          :key="medal.id"
          :class="{'applying': applying}"
        >
          <view class="medal-content">
            <!-- 勋章名称移到最上面 -->
            <text class="medal-name">{{ medal.name }}</text>
            
            <image 
              :src="medal.icon_url" 
              class="medal-icon" 
              mode="aspectFit"
              :style="{ opacity: applying ? 0.5 : 1 }"
            ></image>
            
            <view class="medal-info">
              <!-- 条件标签保持在这里 -->
              <view class="condition-tags" v-if="medal.conditions">
                <view class="tag review" v-if="medal.conditions.need_review">
                  <text>需审核</text>
                </view>

              </view>
              <text class="medal-count">{{ medal.holder_count }}/{{ medal.max_holders ? medal.max_holders : '无限制' }}</text>
            </view>
          </view>
          <button 
            class="apply-btn"
            :class="{
              'disabled': applying || medal.isOwned, 
              'owned-btn': medal.isOwned
            }"
            @tap="medal.isOwned ? null : showMedalPreview(medal)"
            :disabled="applying || medal.isOwned"
          >
            <text class="btn-text">
              {{ medal.isOwned ? '已拥有' : (applying ? '申请中...' : '申请') }}
            </text>
          </button>
        </view>
      </view>

      <!-- 分页控制器 -->
      <view class="pagination" v-if="allMedals.length > pageSize">
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
          :class="{ disabled: !hasMore }"
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
    <view class="preview-modal" v-if="showPreview" @tap.stop="closePreview">
      <view class="preview-content" @tap.stop>
        <view class="preview-title">{{ previewMedal ? previewMedal.name : '' }}</view>
        
        <view class="preview-main">
          <view class="preview-image">
            <image 
              :src="previewMedal ? previewMedal.icon_url : ''" 
              class="preview-medal"
              mode="aspectFit"
            ></image>
          </view>
          
          <view class="preview-info">
            <!-- 获取条件(原描述文本) -->
            <view class="preview-section">
              <text class="section-label">获取条件</text>
              <view class="section-content-wrapper" @tap="showFullDescription">
                <text class="section-content ellipsis">{{ previewMedal ? previewMedal.description : '' }}</text>
                <text class="view-more" v-if="hasLongDescription">查看更多</text>
              </view>
            </view>
            
            <!-- 获取条件区域 -->
            <view class="preview-requirements">
              <view class="requirement-item" v-if="previewMedal && previewMedal.conditions">
                <text class="requirement-label">通过方式</text>
                <view class="requirement-tags">
                  <view v-if="previewMedal.conditions.need_review" class="requirement-tag review">
                    需要审核
                  </view>
                </view>
              </view>
              
              <view class="requirement-item">
                <text class="requirement-label">持有情况</text>
                <text class="requirement-value">{{ previewMedal ? `${previewMedal.holder_count}/${previewMedal.max_holders || '无限制'}` : '' }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 底部操作按钮 -->
        <view class="preview-actions">
          <view class="action-buttons">
            <button class="action-btn cancel" @tap="closePreview">取消</button>
            <button class="action-btn confirm" @tap="handleApply">
              申请
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 完整描述弹窗 -->
    <view class="full-desc-modal" v-if="showFullDesc" @tap.stop="showFullDesc = false">
      <view class="full-desc-content" @tap.stop>
        <view class="full-desc-title">获取条件</view>
        <text class="full-desc-text">{{ previewMedal ? previewMedal.description : '' }}</text>
        <button class="full-desc-close" @tap="showFullDesc = false">关闭</button>
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
import { localStorage } from '../../../js_sdk/mp-storage/mp-storage/index.js'


export default {
  
  data() {
    return {
      StatusBar: this.StatusBar,
      CustomBar: this.CustomBar,
      NavBar: this.StatusBar + this.CustomBar,
      AppStyle: this.$store.state.AppStyle,
      medals: [],
      pageSize: 6,
      currentPage: 1,
      allMedals: [],
      userMedals: [], // 用户已拥有的勋章列表
      applying: false,
      loading: false,
      isLoggedIn: false,
      userInfo: null,
      pageReady: false,
      pendingApplications: new Set(), // 记录正在申请中的勋章ID
      token: '',
      isLogin: false,
      submitStatus: false, // 防止重复提交
      applyDebounce: {}, // 用于存储每个勋章的防抖状态
      currencyName: '',
      showPreview: false,
      previewMedal: null,
      showFullDesc: false,
      // 筛选相关数据
      filterTypeIndex: 0,
      filterMedalTypeIndex: 0,
      filterOwnedIndex: 0,
      filterTypeOptions: [
        { label: '全部', value: 'all' },
        { label: '申请通过', value: 'review' }
      ],
      filterMedalTypeOptions: [
        { label: '全部', value: 'all' },
        { label: '静态', value: 'static' },
        { label: '动态', value: 'dynamic' }
      ],
      filterOwnedOptions: [
        { label: '全部', value: 'all' },
        { label: '未拥有', value: 'not_owned' },
        { label: '已拥有', value: 'owned' }
      ],
      filteredMedals: [], // 筛选后的勋章列表
      // 自定义选择器相关
      showCustomPickerModal: false,
      customPickerTitle: '',
      currentPickerOptions: [],
      currentPickerIndex: 0,
      currentPickerType: ''
    }
  },

  computed: {
    displayMedals() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredMedals.slice(start, end);
    },
    
    hasMore() {
      return this.currentPage * this.pageSize < this.filteredMedals.length
    },
    
    totalPages() {
      return Math.ceil(this.filteredMedals.length / this.pageSize)
    },
    hasLongDescription() {
      return this.previewMedal && this.previewMedal.description.length > 30
    }
  },

  async mounted() {
    try {
      await this.checkLoginStatus()
      await this.loadMedals()
    } finally {
      this.pageReady = true
    }
  },

  created() {
    // 获取token
    this.token = localStorage.getItem('token') || '';
    this.isLogin = !!this.token;
  },

  methods: {
    async checkLoginStatus() {
      const userInfo = uni.getStorageSync('userinfo') || localStorage.getItem('userinfo')
      if (userInfo) {
        this.userInfo = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo
        this.isLoggedIn = true
      } else {
        this.isLoggedIn = false
      }
    },

    async loadMedals() {
      if (this.loading) return
      this.loading = true
      
      // 检查是否已登录
      const token = uni.getStorageSync('token')
      if (!token) {
        console.log('用户未登录')
        this.medals = []
        this.loading = false
        return
      }
      
      try {
        const requestUrl = this.$API.PluginLoad('xqy_medal')
        
        // 同时加载所有勋章和用户已拥有的勋章
        const [allMedalsRes, userMedalsRes] = await Promise.all([
          // 获取所有勋章
          new Promise((resolve, reject) => {
            const requestData = {
              action: 'getMedals',
              plugin: 'xqy_medal',
              type: 'all',
              token: token
            }
            
            uni.request({
              url: requestUrl,
              data: requestData,
              method: 'GET',
              dataType: 'json',
              success: (res) => {
                if (res.data && res.data.code === 200) {
                  resolve(res.data)
                } else {
                  reject(new Error(res.data?.msg || '加载失败'))
                }
              },
              fail: (err) => {
                console.error('请求失败:', err)
                reject(new Error('请求失败'))
              }
            })
          }),
          // 获取用户已拥有的勋章
          new Promise((resolve, reject) => {
            const requestData = {
              action: 'getMedals',
              plugin: 'xqy_medal',
              type: 'my',
              token: token
            }
            
            uni.request({
              url: requestUrl,
              data: requestData,
              method: 'GET',
              dataType: 'json',
              success: (res) => {
                if (res.data && res.data.code === 200) {
                  resolve(res.data)
                } else {
                  // 用户可能没有勋章，这不是错误
                  resolve({ data: { medals: [] } })
                }
              },
              fail: (err) => {
                console.error('获取用户勋章失败:', err)
                resolve({ data: { medals: [] } })
              }
            })
          })
        ])
        
        // 处理所有勋章数据
        this.allMedals = allMedalsRes.data.medals || []
        this.currencyName = allMedalsRes.data.currencyName || '积分'
        
        // 处理用户已拥有的勋章数据
        this.userMedals = userMedalsRes.data.medals || []
        const userMedalIds = new Set(this.userMedals.map(medal => medal.id))
        
        // 标记用户已拥有的勋章
        this.allMedals = this.allMedals.map(medal => ({
          ...medal,
          isOwned: userMedalIds.has(medal.id)
        }))
        

        
        // 应用筛选
        this.applyFilters()
        
      } catch (error) {
        console.error('加载失败:', error)
        uni.showToast({
          title: error.message || '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    // 应用筛选
    applyFilters() {
      let filtered = [...this.allMedals];
      
      // 按获取方式筛选
      const filterType = this.filterTypeOptions[this.filterTypeIndex].value;
      if (filterType !== 'all') {
        filtered = filtered.filter(medal => {
          switch (filterType) {
            case 'review':
              // 只有需要审核的勋章
              return medal.conditions && medal.conditions.need_review;
            default:
              return true;
          }
        });
      }

      // 按勋章类型筛选
      const filterMedalType = this.filterMedalTypeOptions[this.filterMedalTypeIndex].value;
      if (filterMedalType !== 'all') {
        filtered = filtered.filter(medal => {
          // 使用数据库中的 medal_type 字段进行筛选
          switch (filterMedalType) {
            case 'static':
              return medal.medal_type === 'static';
            case 'dynamic':
              return medal.medal_type === 'dynamic';
            default:
              return true;
          }
        });
      }

      // 按拥有状态筛选
      const filterOwned = this.filterOwnedOptions[this.filterOwnedIndex].value;
      if (filterOwned !== 'all') {
        filtered = filtered.filter(medal => {
          if (filterOwned === 'owned') {
            return medal.isOwned;
          } else if (filterOwned === 'not_owned') {
            return !medal.isOwned;
          }
          return true;
        });
      }

      this.filteredMedals = filtered;
      
      // 筛选完成
      
      // 重置到第一页
      this.currentPage = 1;
    },

    onFilterTypeChange(e) {
      this.filterTypeIndex = e.detail.value;
      this.applyFilters();
    },

    onFilterMedalTypeChange(e) {
      this.filterMedalTypeIndex = e.detail.value;
      this.applyFilters();
    },

    onFilterOwnedChange(e) {
      this.filterOwnedIndex = e.detail.value;
      this.applyFilters();
    },

    resetFilters() {
      this.filterTypeIndex = 0;
      this.filterMedalTypeIndex = 0;
      this.filterOwnedIndex = 0;
      this.applyFilters();
    },

    showMedalPreview(medal) {
      this.previewMedal = { ...medal };
      this.showPreview = true;
    },

    closePreview() {
      this.showPreview = false;
      this.previewMedal = null;
    },

    async handleApply() {
      if (!this.previewMedal) return;
      
      if (this.previewMedal.conditions && this.previewMedal.conditions.need_review) {
        // 如果需要审核,显示确认弹窗
        uni.showModal({
          title: '申请确认',
          content: '该勋章需要管理员审核，确定要提交申请吗？',
          success: async (res) => {
            if (res.confirm) {
              await this.applyMedal(this.previewMedal);
            }
          }
        });
      } else {
        // 直接申请
        await this.applyMedal(this.previewMedal);
      }
    },

    async applyMedal() {
      if (!this.previewMedal || !this.previewMedal.id) {
        uni.showToast({
          title: '勋章信息无效',
          icon: 'none'
        });
        return;
      }
      
      if(this.submitStatus) {
        uni.showToast({
          title: '请勿重复提交',
          icon: 'none'
        });
        return;
      }
      
      // 检查该勋章是否在防抖期
      if (this.applyDebounce[this.previewMedal.id]) {
        return;
      }
      
      this.submitStatus = true;
      // 设置防抖状态
      this.applyDebounce[this.previewMedal.id] = true;

      // 显示加载提示
      uni.showLoading({
        title: '提交申请中...',
        mask: true
      });

      try {
        const [err, res] = await uni.request({
          url: this.$API.PluginLoad('xqy_medal'),
          method: 'POST',
          data: {
            plugin: 'xqy_medal',
            action: 'applyMedal',
            medal_id: this.previewMedal.id,
            token: this.token
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        if (err) {
          throw new Error(err.message || '请求失败');
        }

        if (res.data && res.data.code === 200) {
          uni.hideLoading();
          await new Promise(resolve => setTimeout(resolve, 100));
          uni.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 3000,
            mask: true
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
          this.closePreview();
          this.loadMedals();
        } else {
          uni.hideLoading();
          await new Promise(resolve => setTimeout(resolve, 100));
          uni.showToast({
            title: res.data?.msg || '申请失败',
            icon: 'none',
            duration: 3000,
            mask: true
          });
        }
      } catch (err) {
        /* console.error('申请失败:', err); */
        uni.hideLoading();
        await new Promise(resolve => setTimeout(resolve, 100));
        uni.showToast({
          title: err.message || '请求失败',
          icon: 'none',
          duration: 3000,
          mask: true
        });
      } finally {
        setTimeout(() => {
          this.submitStatus = false;
          this.applyDebounce[this.previewMedal.id] = false;
        }, 3000);
      }
    },

    goToMyMedals() {
      uni.navigateTo({
        url: '/pages/plugins/xqy_medal/myMedals'
      })
    },

    back() {
      uni.navigateBack()
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    async refresh() {
      this.currentPage = 1
      this.allMedals = []
      await this.loadMedals()
    },

    onShow() {
      this.checkLoginStatus()
    },

    showFullDescription() {
      if (this.hasLongDescription) {
        this.showFullDesc = true
      }
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
        case 'filterMedalType':
          this.customPickerTitle = '选择勋章类型';
          this.currentPickerOptions = this.filterMedalTypeOptions;
          this.currentPickerIndex = this.filterMedalTypeIndex;
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
          this.onFilterTypeChange({ detail: { value: index } });
          break;
        case 'filterMedalType':
          this.filterMedalTypeIndex = index;
          this.onFilterMedalTypeChange({ detail: { value: index } });
          break;
        case 'filterOwned':
          this.filterOwnedIndex = index;
          this.onFilterOwnedChange({ detail: { value: index } });
          break;
      }
      
      this.hideCustomPicker();
    }
  }
}
</script>

<style lang="scss" scoped>

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

.medal-content {
  padding: 16rpx;
}

// 空状态
.empty-state {
  padding: 64px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .empty-icon {
    width: 120px;
    height: 120px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .empty-text {
    color: #8e8e93;
    font-size: 28rpx;
    
  }
}

// 勋章网格
.medal-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 32px;
  width: 100%;
  box-sizing: border-box;
}

// 勋章卡片
.medal-card {
  width: calc((100% - 24px) / 3);
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  

  
  &:active {
    transform: scale(0.98);
  }
  
  &.applying {
    opacity: 0.7;
  }
}

.medal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
}

.medal-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  transition: opacity 0.2s;
}

.medal-info {
  text-align: center;
  width: 100%;
}

.medal-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
  
}

.medal-count {
  font-size: 12px;
  color: #8e8e93;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.apply-btn {
  width: 100%;
  height: 28px;
  border-radius: 14px;
  background: #007AFF;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:active {
    background: darken(#007AFF, 10%);
  }
  
  &.disabled {
    background: #c7c7cc;
  }
  
  &.buy-btn {
    background: #ff9900;
  }
  
  &.owned-btn {
    background: #e8e8e8;
    color: #999999;
    cursor: not-allowed;
    
    &:active {
      background: #e8e8e8;
      
    }
    
    .btn-text {
      color: #999999;
      
    }
  }
  
  &.admin-only-btn {
    background: #8e8e93;
    color: #fff;
    cursor: not-allowed;
    
    &:active {
      background: #8e8e93;
    }
    
    .btn-text {
      color: #fff;
      
    }
  }
  
  .btn-text {
    color: #fff;
    font-size: 12px;
    font-weight: 500;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  gap: 16px;

  .page-btn {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    transition: all 0.2s;
    
    &:active {
      transform: scale(0.95);
      background: #f5f5f5;
    }
    
    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    
    .icon {
      font-size: 18px;
      color: #007AFF;
    }
  }
  
  .page-info {
    font-size: 15px;
    color: #8e8e93;

  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200rpx;
}

.buy-btn {
  background: #ff9900 !important;
}

// 条件标签
.condition-tags {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 8rpx;
  width: 100%;

  .tag {
    padding: 2rpx 8rpx;
    border-radius: 20rpx;
    font-size: 18rpx;
    color: #fff;
    display: flex;
    align-items: center;
    box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
    
    &.review {
      background: #ff6b6b;
    
    }
    
    &.currency {
      background: #ffd93d;
      color: #333;
    }
    
    &.admin-only {
      background: #8e8e93;
      color: #fff;
    }
  }
}

// 预览弹窗
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
  border-radius: 24rpx;
  padding: 32rpx;
  width: 85%;
  max-width: 600rpx;

}

.preview-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 24rpx;
  text-align: center;
}

.preview-main {
  display: flex;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.preview-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-medal {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.preview-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.section-label {
  font-size: 24rpx;
  color: #86868b;
}

.section-content-wrapper {
  position: relative;
  cursor: pointer;
}

.section-content {
  font-size: 24rpx;
  color: #1d1d1f;
  line-height: 1.4;
  
  &.ellipsis {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.view-more {
  font-size: 22rpx;
  color: #007AFF;
  margin-top: 4rpx;
}

.preview-requirements {
  margin-top: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.requirement-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.requirement-label {
  font-size: 24rpx;
  color: #86868b;
}

.requirement-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}

.requirement-tag {
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  
  &.review {
    background: #fef0f0;
    color: #ff3b30;
  }
  
  &.currency {
    background: #fff2d9;
    color: #ff9500;
  }
}

.requirement-value {
  font-size: 24rpx;
  color: #1d1d1f;
}

.preview-actions {
  margin-top: 30rpx;
  padding: 0 20rpx;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border: none;
  
  &.cancel {
    background: #f5f5f5;
    color: #666;
    
    &:active {
      background: #e5e5e5;
    }
  }
  
  &.confirm {
    background: linear-gradient(135deg, #007AFF, #0056b3);
    color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(0,122,255,0.3);
    
    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 2rpx 6rpx rgba(0,122,255,0.2);
    }
  }
}

// 完整描述弹窗样式
.full-desc-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.full-desc-content {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  width: 80%;
  max-width: 560rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.full-desc-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 24rpx;
  text-align: center;
}

.full-desc-text {
  font-size: 28rpx;
  color: #1d1d1f;
  line-height: 1.6;
  padding: 0 16rpx;
  margin-bottom: 32rpx;
}

.full-desc-close {
  width: 160rpx;
  height: 64rpx;
  border-radius: 32rpx;
  background: #f5f5f5;
  color: #666;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  border: none;

  &:active {
    background: #e5e5e5;
  }
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
</style>
