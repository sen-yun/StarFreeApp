<template>
  <view class="user" :class="[$store.state.AppStyle]" :style="{'background-color':'#f6f6f6','min-height':'100vh'}">
    <!-- 顶部导航栏 -->
    <view class="header" :style="[{height:CustomBar + 'px'}]">
      <view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
        <view class="action" @tap="back">
          <text class="cuIcon-back"></text>
        </view>
        <view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
          我的头像框
        </view>
      </view>
    </view>
    <view :style="[{padding:(NavBar+5) + 'px 10px 0px 10px'}]"></view>

    <!-- 用户头像预览区域 -->
    <view class="avatar-preview" v-if="currentWearingFrame">
      <view class="preview-wrapper">
        <image 
          :src="userInfo && userInfo.avatar" 
          class="preview-avatar"
          mode="aspectFill"
        ></image>
        <image 
          :src="currentWearingFrame.frame_url" 
          class="preview-frame"
          mode="aspectFit"
        ></image>
      </view>
      <text class="preview-tip">{{ currentWearingFrame ? '当前佩戴' : '未佩戴头像框' }}</text>
    </view>

    <!-- 统计信息 -->
    <view class="stats-card">
      <view class="stats-item">
        <text class="stats-number">{{frames && frames.length || 0}}</text>
        <text class="stats-label">我的头像框</text>
      </view>
    </view>

    <!-- 头像框列表 -->
    <view class="frame-list">
      <!-- 空状态 -->
      <view class="empty" v-if="!frames || frames.length === 0">
        <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
        <text>暂无头像框</text>
        <button class="cu-btn round bg-blue" @tap="goToFrameShop">去获取</button>
      </view>
      
      <!-- 头像框网格 -->
      <view class="frame-grid" v-if="displayFrames && displayFrames.length > 0">
        <view 
          class="frame-item" 
          v-for="frame in displayFrames" 
          :key="frame.id"
          :class="{'active': frame.is_wearing}"
        >
          <view class="frame-card">
            <!-- 预览效果 -->
            <view class="frame-preview">
              <image 
                :src="userInfo && userInfo.avatar || '/static/images/default-avatar.png'" 
                class="mini-avatar"
                mode="aspectFill"
                lazy-load
              ></image>
              <image 
                :src="frame.frame_url" 
                class="mini-frame"
                mode="aspectFit"
                lazy-load
              ></image>
            </view>
            <view class="frame-info">
              <text class="frame-name">{{ frame.name }}</text>
              <text class="frame-desc">{{ frame.description }}</text>
              <text class="frame-time">获得时间: {{ frame.obtain_time }}</text>
              <view class="frame-actions">
                <button 
                  class="wear-btn" 
                  :class="{'wearing': frame.is_wearing}"
                  @tap="toggleWear(frame)"
                >
                  {{ frame.is_wearing ? '取消佩戴' : '佩戴' }}
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 分页器 -->
      <view class="pagination" v-if="frames.length > pageSize">
        <view 
          class="page-btn" 
          :class="{disabled: currentPage === 1}"
          @tap="prevPage"
        >
          <text class="icon">←</text>
        </view>
        
        <!-- 页码显示 -->
        <view class="page-numbers">
          <!-- 第一页 -->
          <view class="page-num" 
            :class="{active: currentPage === 1}"
            @tap="goToPage(1)" 
            v-if="showFirstPage"
          >1</view>
          
          <!-- 左省略号 -->
          <view class="page-ellipsis" v-if="showLeftEllipsis">...</view>
          
          <!-- 中间页码 -->
          <view 
            v-for="page in middlePages" 
            :key="page"
            class="page-num"
            :class="{active: currentPage === page}"
            @tap="goToPage(page)"
          >{{ page }}</view>
          
          <!-- 右省略号 -->
          <view class="page-ellipsis" v-if="showRightEllipsis">...</view>
          
          <!-- 最后一页 -->
          <view class="page-num"
            :class="{active: currentPage === totalPages}"
            @tap="goToPage(totalPages)"
            v-if="showLastPage"
          >{{ totalPages }}</view>
        </view>
        
        <view 
          class="page-btn"
          :class="{disabled: currentPage === totalPages}"
          @tap="nextPage"
        >
          <text class="icon">→</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>


export default {
  
  data() {
    return {
      StatusBar: this.StatusBar,
      CustomBar: this.CustomBar,
      NavBar: this.StatusBar + this.CustomBar,
      frames: [],
      pageSize: 4,
      currentPage: 1,
      loading: false,
      isLoggedIn: false,
      token: '',
      uid: '',
      userInfo: null,
      maxVisiblePages: 4, // 最大显示的页码数
      xqyFrameCache: {}, 
    }
  },

  computed: {
    displayFrames() {
      if (!Array.isArray(this.frames)) return [];
      const start = (this.currentPage - 1) * this.pageSize;
      return this.frames.slice(start, start + this.pageSize);
    },
    totalPages() {
      if (!Array.isArray(this.frames)) return 0;
      return Math.ceil(this.frames.length / this.pageSize);
    },
    middlePages() {
      if (this.totalPages <= this.maxVisiblePages) {
        return Array.from({length: this.totalPages}, (_, i) => i + 1);
      }
      
      let start = Math.max(
        2,
        this.currentPage - Math.floor((this.maxVisiblePages - 2) / 2)
      );
      let end = Math.min(
        this.totalPages - 1,
        start + this.maxVisiblePages - 3
      );
      
      if (end - start + 1 < this.maxVisiblePages - 2) {
        start = Math.max(2, end - (this.maxVisiblePages - 3));
      }
      
      return Array.from(
        {length: end - start + 1},
        (_, i) => start + i
      );
    },
    showFirstPage() {
      return this.totalPages > this.maxVisiblePages;
    },
    showLastPage() {
      return this.totalPages > this.maxVisiblePages;
    },
    showLeftEllipsis() {
      return this.middlePages[0] > 2;
    },
    showRightEllipsis() {
      return this.middlePages[this.middlePages.length - 1] < this.totalPages - 1;
    },
    currentWearingFrame() {
      return this.frames?.find(frame => frame.is_wearing) || null;
    }
  },

  async mounted() {
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
    
    await this.checkLoginStatus();
    if (this.isLoggedIn) {
      await this.loadUserInfo();
      await this.loadMyFrames();
    }
  },

  methods: {
    // 检查登录状态
    async checkLoginStatus() {
      let token = '';
      try {
        // #ifdef H5
        if(localStorage.getItem('userinfo')){
          const userInfo = JSON.parse(localStorage.getItem('userinfo'));
          token = userInfo.token;
          this.uid = userInfo.uid;
        }
        // #endif
        
        // #ifdef APP-PLUS || MP
        const userInfo = uni.getStorageSync('userinfo');
        if(userInfo) {
          const parsedUserInfo = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
          token = parsedUserInfo.token;
          this.uid = parsedUserInfo.uid;
        }
        // #endif

        if (!token) {
          this.isLoggedIn = false;
          uni.showModal({
            title: '提示',
            content: '请先登录',
            showCancel: false,
            success: () => {
              uni.navigateTo({
                url: '/pages/login/login'
              });
            }
          });
          return;
        }
        this.isLoggedIn = true;
        this.token = token;
      } catch (error) {
        console.error('检查登录状态失败:', error);
        uni.showToast({
          title: '网络错误,请重试',
          icon: 'none'
        });
      }
    },

    // 加载用户信息
    async loadUserInfo() {
      try {
        if (!this.token || !this.uid) {
          console.warn('Token or UID not available');
          this.userInfo = {
            avatar: ''
          };
          return;
        }

        // 获取用户头像
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: this.$API.getUserInfo(),
            data: {
              key: this.uid,
              token: this.token
            },
            method: 'GET',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
              if (res.data?.code == 1) {
                this.userInfo = {
                  avatar: res.data.data?.avatar || '/static/images/default-avatar.png'
                };
              } else {
                this.userInfo = {
                  avatar: '/static/images/default-avatar.png'
                };
              }
              resolve(res);
            },
            fail: (err) => {
              console.error('获取用户头像失败:', err);
              this.userInfo = {
                avatar: '/static/images/default-avatar.png'
              };
              reject(err);
            }
          });
        });
      } catch (err) {
        console.error('获取用户头像失败:', err);
        this.userInfo = {
          avatar: '/static/images/default-avatar.png'
        };
        uni.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    },

    // 加载我的头像框
    async loadMyFrames() {
      if (this.loading) return;
      this.loading = true;
      
      try {
        // 获取token
        let token = '';
        try {
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
          
          if (!token) {
            throw new Error('未获取到token');
          }
        } catch (err) {
          console.error('获取token失败:', err);
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            });
          }, 1500);
          return;
        }

        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: this.$API.PluginLoad('xqy_avatar_frame'),
            data: {
              plugin: 'xqy_avatar_frame',
              action: 'get_user_frames',
              op: 'list',
              token: token
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          });
        });

        //console.log('loadMyFrames响应:', res.data);

        if (res.statusCode === 200 && res.data.code === 200) {
          //console.log('获取到的头像框数据:', res.data.data);
          if (!res.data.data.awarded) {
            console.warn('awarded 字段不存在');
            this.frames = [];
          } else {
            this.frames = res.data.data.awarded;
          }
          //console.log('设置后的 frames:', this.frames);
        } else {
          console.error('加载失败:', res.data);
          uni.showToast({
            title: res.data.msg || '加载失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('加载头像框失败:', error);
        uni.showToast({
          title: '网络错误,请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },

    // 切换头像框使用状态
    async toggleWear(frame) {
      //console.log('切换头像框佩戴状态:', frame)
      try {
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: this.$API.PluginLoad('xqy_avatar_frame'),
            data: {
              plugin: 'xqy_avatar_frame',
              action: 'get_user_frames',
              op: frame.is_wearing ? 'unset' : 'set',
              id: frame.id,
              token: this.token
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          });
        });
        
        //console.log('切换头像框响应:', res.data)
        
        if (res.data.code === 200) {
          // 更新本地状态
          frame.is_wearing = !frame.is_wearing
          // 如果是佩戴操作，取消其他头像框的佩戴状态
          if (frame.is_wearing) {
            this.frames.forEach(f => {
              if (f.id !== frame.id) {
                f.is_wearing = false
              }
            })
          }
          uni.showToast({
            title: res.data.msg,
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: res.data.msg || '操作失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('切换头像框失败:', error)
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },

    // 页面导航
    back() {
      uni.navigateBack();
    },
    
    goToFrameShop() {
      uni.navigateTo({
        url: '/pages/plugins/xqy_avatar_frame/home'
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

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  }
}
</script>

<style lang="scss">
.avatar-preview {
  background: #fff;
  padding: 40rpx;
  margin: 20rpx;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);

  .preview-wrapper {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 20rpx;
  }
  
  .preview-avatar {
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
  }
  
  .preview-tip {
    font-size: 24rpx;
    color: #666;
  }
}

.frame-preview {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  margin: 0 auto 20rpx;
  
  .mini-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2rpx solid #fff;
  }
  
  .mini-frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transform: scale(1.2);
  }
}

.stats-card {
  background: #fff;
  border-radius: 16rpx;
  margin: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);

  .stats-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stats-number {
    font-size: 36rpx;
    font-weight: 600;
    color: #007AFF;
  }
  
  .stats-label {
    font-size: 24rpx;
    color: #8e8e93;
    margin-top: 8rpx;
  }
}

.frame-list {
  padding: 20rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
  
  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
  }
  
  text {
    color: #8e8e93;
    font-size: 28rpx;
    margin-bottom: 30rpx;
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
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4rpx);
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  }
}

.frame-item.active .frame-card {
  border: 2rpx solid #007AFF;
  background: rgba(0,122,255,0.05);
}

.frame-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 16rpx;
}

.frame-info {
  text-align: center;
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

.frame-time {
  font-size: 24rpx;
  color: #8e8e93;
  margin-bottom: 16rpx;
}

.frame-actions {
  margin-top: 16rpx;
}

.wear-btn {
  width: 100%;
  height: 56rpx;
  border-radius: 28rpx;
  background: #007AFF;
  color: #fff;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  
  &.wearing {
    background: #28CD41;
  }
  
  &:active {
    opacity: 0.8;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30rpx;
  gap: 20rpx;
  
  .page-numbers {
    display: flex;
    align-items: center;
    gap: 10rpx;
  }
  
  .page-num {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 30rpx;
    font-size: 28rpx;
    color: #666;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);

    &.active {
      background: #007AFF;
      color: #fff;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  .page-ellipsis {
    color: #666;
    font-size: 28rpx;
    padding: 0 10rpx;
  }

  .page-btn {
    width: 60rpx;
    height: 60rpx;
    background: #fff;
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    
    .icon {
      font-size: 28rpx;
      color: #666;
    }
  }
}
</style>
