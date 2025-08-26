<template>
  <view class="user" :class="[$store.state.AppStyle]" :style="{'background-color':'#f6f6f6','min-height':'auto'}">
    <view class="header" :style="[{height:CustomBar + 'px'}]">
      <view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
        <view class="action" @tap="back">
          <text class="cuIcon-back"></text>
        </view>
        <view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
          我的勋章
        </view>
      </view>
    </view>
    <view :style="[{padding:(NavBar+5) + 'px 10px 0px 10px'}]"></view>

    <!-- 统计信息 -->
    <view class="stats-card">
      <view class="stats-item">
        <text class="stats-number">{{medals.length}}</text>
        <text class="stats-label">我的勋章</text>
      </view>
    </view>

    <!-- 勋章列表 -->
    <view class="medal-list">
      <view class="empty" v-if="medals.length === 0">
        <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
        <text>暂无勋章</text>
        <button class="cu-btn round bg-blue" @tap="goToApply">去申请</button>
      </view>
      
      <view class="medal-grid" v-else>
        <view class="medal-item" v-for="medal in showMedals" :key="medal.id" :class="{'active': medal.is_wearing}">
          <view class="medal-card">
            <image :src="medal.icon_url" class="medal-icon" mode="aspectFit"></image>
            <view class="medal-info">
              <text class="medal-name">{{ medal.name }}</text>
              <text class="medal-desc">{{ medal.description }}</text>
              <text class="medal-time">获得时间: {{ medal.obtain_time }}</text>
              <view class="medal-actions">
                <button 
                  class="wear-btn" 
                  :class="{'wearing': medal.is_wearing}"
                  @tap="toggleWear(medal)"
                >
                  {{ medal.is_wearing ? '取消佩戴' : '佩戴' }}
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 分页器 -->
      <view class="pagination" v-if="medals.length > pageSize">
        <view class="page-btn" :class="{disabled: currentPage === 1}" @tap="prevPage">
          <text class="cuIcon-back"></text>
        </view>
        <text class="page-number">{{currentPage}}/{{totalPages}}</text>
        <view class="page-btn" :class="{disabled: currentPage === totalPages}" @tap="nextPage">
          <text class="cuIcon-right"></text>
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
      wearingMedals: [],
      loading: false,
      currentPage: 1,
      pageSize: 6,
      maxWearable: 0,
      wearingCount: 0,
      isLoggedIn: false,
      userInfo: null,
      pageReady: false,
      isProcessing: false,
      token: '',
      isLogin: false,
      submitStatus: false
    }
  },

  created() {
    this.token = localStorage.getItem('token') || '';
    this.isLogin = !!this.token;
    if(!this.isLogin) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    this.loadMedals();
  },

  async mounted() {
    try {
      await this.checkLoginStatus()
      await this.loadMedals()
    } finally {
      this.pageReady = true
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.medals.length / this.pageSize)
    },
    showMedals() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.medals.slice(start, start + this.pageSize)
    }
  },

  onPullDownRefresh() {
    this.loadMedals()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
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

    async getMaxWearable() {
      try {
        const token = this.userInfo?.token || uni.getStorageSync('token');
        if (!token) {
          throw new Error('请先登录');
        }

        const requestUrl = this.$API.PluginLoad('xqy_medal')
        // console.log('获取最大佩戴数配置...')
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: requestUrl,
            data: {
              action: 'medalSettings',
              plugin: 'xqy_medal',
              op: 'get',
              token: token
            },
            method: 'GET',
            success: (res) => {
              //console.log('获取配置响应:', res)
              if (res.data && res.data.code === 200) {
                this.maxWearable = res.data.data.max_medals
                // console.log('获取到最大佩戴数:', this.maxWearable)
                resolve(this.maxWearable)
              } else {
                reject(new Error(res.data?.msg || '获取设置失败'))
              }
            },
            fail: (err) => reject(new Error('请求失败'))
          })
        })
        return this.maxWearable
      } catch (error) {
        console.error('获取最大佩戴数失败:', error)
        throw error
      }
    },

    async toggleWear(medal) {
      // console.log('[勋章系统] 开始切换勋章佩戴状态:', medal);
      if(this.submitStatus) {
        // console.log('防重复提交生效');
        uni.showToast({
          title: '请勿重复操作',
          icon: 'none'
        });
        return;
      }
      
      /* 
      console.log('开始佩戴/取消佩戴操作:', {
        medalId: medal.id,
        medalName: medal.name,
        currentStatus: medal.is_wearing ? '已佩戴' : '未佩戴',
        token: this.token
      });
      */
      
      this.submitStatus = true;
      
      uni.request({
        url: this.$API.PluginLoad('xqy_medal'),
        method: 'POST', 
        data: {
          plugin: 'xqy_medal',
          action: 'wearMedal',
          medal_id: medal.id,
          type: medal.is_wearing ? 'unwear' : 'wear',
          token: this.token
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          // console.log('佩戴/取消佩戴响应:', res);
          if(res.data.code === 200) {
            medal.is_wearing = !medal.is_wearing;
            // console.log('操作成功,新状态:', medal.is_wearing ? '已佩戴' : '未佩戴');
            uni.showToast({
              title: res.data.msg,
              icon: 'success'
            });
            this.loadMedals(); // 重新加载勋章列表
          } else if(res.data.code === 401) {
            console.log('登录状态失效');
            localStorage.removeItem('token');
            this.isLogin = false;
            uni.showToast({
              title: '请重新登录',
              icon: 'none'
            });
          } else {
            console.error('操作失败:', res.data);
            uni.showToast({
              title: res.data.msg,
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('请求发送失败:', err);
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        },
        complete: () => {
          // console.log('操作完成,重置提交状态');
          this.submitStatus = false;
        }
      });
    },

    async unwearMedal(medalId) {
      const token = this.userInfo?.token || uni.getStorageSync('token');
      if (!token) {
        throw new Error('请先登录');
      }

      try {
        const requestData = {
          action: 'wearMedal',
          plugin: 'xqy_medal',
          medal_id: medalId,
          token: token,
          type: 'unwear'
        }
        
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: this.$API.PluginLoad('xqy_medal'),
            data: requestData,
            method: 'POST',
            dataType: 'json',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
              if (res.data && res.data.code === 200) {
                resolve(res.data)
              } else {
                reject(new Error(res.data?.msg || '取消佩戴失败'))
              }
            },
            fail: (err) => reject(new Error('请求失败'))
          })
        })
      } catch (error) {
        throw error
      }
    },

    async wearMedal(medalId) {
      const token = this.userInfo?.token || uni.getStorageSync('token');
      if (!token) {
        throw new Error('请先登录');
      }

      const requestData = {
        action: 'wearMedal',
        plugin: 'xqy_medal',
        medal_id: medalId,
        token: token,
        type: 'wear'
      };

      try {
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: this.$API.PluginLoad('xqy_medal'),
            data: requestData,
            method: 'post',
            dataType: 'json',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
              if (res.data && res.data.code === 200) {
                resolve(res.data);
              } else {
                reject(new Error(res.data?.msg || '佩戴失败'));
              }
            },
            fail: (err) => reject(new Error('请求失败'))
          });
        });
      } catch (error) {
        console.error('佩戴失败:', error);
        throw error;
      }
    },

    async loadMedals() {
      if (this.loading) return;
      this.loading = true;
      
      // 检查是否已登录
      const token = uni.getStorageSync('token');
      if (!this.isLoggedIn || !token) {
        this.medals = [];
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        this.loading = false;
        return;
      }

      try {
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: this.$API.PluginLoad('xqy_medal'),
            data: {
              action: 'getMedals',
              plugin: 'xqy_medal',
              type: 'my',
              token: token
            },
            method: 'GET',
            dataType: 'json',
            success: (res) => {
              if (res.data && res.data.code === 200) {
                this.medals = res.data.data.medals;
                this.wearingCount = this.medals.filter(m => m.is_wearing).length;
                resolve(res.data);
              } else {
                // console.error('加载失败:', res.data);
                reject(new Error(res.data.msg || '加载失败'));
              }
            },
            fail: (err) => {
              // console.error('请求失败:', err);
              reject(new Error('请求失败'));
            }
          });
        });
        await this.getMaxWearable();
      } catch (error) {
        // console.error('[勋章系统] 加载勋章失败:', error);
        uni.showToast({
          title: error.message || '加载失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
        this.loading = false;
      }
    },

    back() {
      uni.navigateBack({
        delta: 1
      })
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    goToApply() {
      uni.navigateTo({
        url: '/pages/plugins/xqy_medal/home'
      })
    },

    onShow() {
      this.checkLoginStatus()
    }
  }
}
</script>

<style lang="scss" scoped>
.stats-card {
  margin: 20rpx;
  padding: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  justify-content: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
  

}

.stats-item {
  text-align: center;
}

.stats-number {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  

}

.stats-label {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
  

}

.medal-list {
  padding: 16rpx;
}

.empty {
  text-align: center;
  color: #999;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  

}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.medal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 10rpx;
}

.medal-item.active .medal-card {
  border: 2rpx solid #007AFF;
  background: rgba(0,122,255,0.05);
  

}

.medal-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  

  
  &:hover {
    transform: translateY(-4rpx);
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.medal-icon {
  width: 128rpx;
  height: 128rpx;
  margin-bottom: 16rpx;
  display: block;
}

.medal-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.medal-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
  color: #333;
  

}

.medal-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
  text-align: center;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  

}

.medal-time {
  font-size: 24rpx;
  color: #999;
  

}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30rpx;
  gap: 20rpx;
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
}

.page-number {
  font-size: 28rpx;
  color: #666;
  

}

.medal-actions {
  margin-top: 8rpx;
}

.wear-btn {
  font-size: 24rpx;
  padding: 8rpx 24rpx;
  border-radius: 32rpx;
  background: #007AFF;
  color: #fff;
  border: none;
  
  &.wearing {
    background: #8e8e93;
  }
  
  &:active {
    opacity: 0.8;
  }
}
</style>
