<template>
  <view class="user" :class="[$store.state.AppStyle]" :style="{'background-color':'#f6f6f6','min-height':'auto'}">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <view class="cu-load loading"></view>
    </view>

    <!-- 插件未开启或错误状态 -->
    <view v-else-if="!xqy_rank" class="plugin-disabled">
      <image src="/static/images/plugin-disabled.png" mode="aspectFit"></image>
      <view class="text">{{ errorMsg || '✨ 插件未开启 ✨' }}</view>
    </view>

    <!-- 检测插件是否开启 -->
    <view v-else class="rank-container">
      <!-- 顶部导航栏 -->
      <view class="header" :style="[{height:CustomBar + 'px'}]">
        <!-- #ifdef H5 -->
        <view class="cu-bar bg-white" :style="{'height': CustomBar + 'px', 'padding-top':StatusBar + 'px'}">
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <view class="cu-bar bg-white" :style="{'height': CustomBar + 'px', 'padding-top':StatusBar + 'px'}">
        <!-- #endif -->
          <view class="action" @tap="back">
            <text class="cuIcon-back"></text>
          </view>
          <view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
            {{ rankTitle }}
          </view>
        </view>
        <view class="nav-divider"></view>
      </view>
      
      <!-- #ifdef H5 -->
      <view :style="[{height:NavBar + 'px', background: '#fff'}]"></view>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <view :style="[{height:(NavBar-25) + 'px', background: '#fff'}]"></view>
      <!-- #endif -->
      
      <!-- 排行榜类型切换 -->
      <view class="rank-tabs">
        <view 
          v-for="(tab, index) in enabledTabs" 
          :key="index"
          class="tab-item"
          :class="{ active: currentTab === index }"
          @tap="switchTab(index)"
        >
          {{ tab.name }}
        </view>
      </view>
      
      <!-- 空数据提示 -->
      <view v-if="rankList.length === 0 && !loading" class="empty-box">
        <image src="/static/images/empty.png" mode="aspectFit"></image>
        <text class="empty-text">暂无{{tabs[currentTab].name}}数据</text>
      </view>
      
      <!-- 有数据时显示排行榜 -->
      <view v-else class="rank-content">
        <!-- 前三名展示区 -->
        <view class="podium">
          <!-- 第二名 -->
          <view class="rank-item second" v-if="rankList[1]">
            <view class="badge">🌸</view>
            <view class="rank-number">2</view>
            <view class="avatar-box" @tap="toUserInfo(rankList[1])">
              <image :src="rankList[1].avatar" mode="aspectFill"></image>
            </view>
            <view class="info">
              <text class="name">{{rankList[1].name}}</text>
              <text class="count" :class="tabs[currentTab].key">{{getCount(rankList[1])}}</text>
            </view>
          </view>
          
          <!-- 第一名 -->
          <view class="rank-item champion" v-if="rankList[0]">
            <view class="badge">👑</view>
            <view class="rank-number">1</view>
            <view class="avatar-box" @tap="toUserInfo(rankList[0])">
              <image :src="rankList[0].avatar" mode="aspectFill"></image>
            </view>
            <view class="info">
              <text class="name">{{rankList[0].name}}</text>
              <text class="count" :class="tabs[currentTab].key">{{getCount(rankList[0])}}</text>
            </view>
          </view>
          
          <!-- 第三名 -->
          <view class="rank-item third" v-if="rankList[2]">
            <view class="badge">🎉</view>
            <view class="rank-number">3</view>
            <view class="avatar-box" @tap="toUserInfo(rankList[2])">
              <image :src="rankList[2].avatar" mode="aspectFill"></image>
            </view>
            <view class="info">
              <text class="name">{{rankList[2].name}}</text>
              <text class="count" :class="tabs[currentTab].key">{{getCount(rankList[2])}}</text>
            </view>
          </view>
        </view>
        
        <!-- 其他排名列表 -->
        <view class="rank-list bg-white" v-if="otherRankList.length > 0">
          <view class="list-item" v-for="(item, index) in otherRankList" :key="index">
            <text class="number">{{index + 4}}</text>
            <view class="avatar-box" @tap="toUserInfo(item)">
              <image :src="item.avatar" mode="aspectFill"></image>
            </view>
            <view class="info">
              <text class="name">{{item.name}}</text>
              <text class="count" :class="tabs[currentTab].key">{{getCount(item)}}</text>
            </view>
          </view>
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
      xqy_rank: false,
      rankList: [],
      loading: true,
      errorMsg: '',
      rankTitle: '✨ 发帖之星 ✨',
      currentTab: 0,
      assetName: '积分',
      tabs: [
        { name: '文章排行', key: 'contentsNum' },
        { name: '等级排行', key: 'experience' },
        { name: '财富排行', key: 'assets' }
      ],
      enabledTabs: [{ name: '文章排行', key: 'contentsNum' }],
      topThree: []
    }
  },
  computed: {
    otherRankList() {
      return this.rankList.slice(3)
    }
  },
  onLoad() {
    try {
      let pluginList = [];
      
      // #ifdef H5
      pluginList = JSON.parse(localStorage.getItem('getPlugins') || '[]');
      // #endif
      
      // #ifdef APP-PLUS || MP
      const pluginsStr = uni.getStorageSync('getPlugins');
      if (pluginsStr) {
        try {
          pluginList = typeof pluginsStr === 'string' ? JSON.parse(pluginsStr) : pluginsStr;
        } catch (e) {
          pluginList = [];
        }
      }
      // #endif
      
      console.log('[Debug] Plugin list:', pluginList)
      
      if (Array.isArray(pluginList) && pluginList.length > 0 && pluginList.includes('xqy_rank')) {
        this.xqy_rank = true;
        this.getRankList();
      } else {

        this.loading = false;
      }
    } catch (err) {
      this.loading = false;
      this.errorMsg = '获取插件列表失败';
    }
  },
  methods: {
    switchTab(index) {
      if (this.currentTab === index || !this.enabledTabs[index]) return;
      this.currentTab = index;
      this.getRankList();
    },
    
    getCount(item) {
      const key = this.enabledTabs[this.currentTab].key
      if (key === 'experience') {
        return 'LV.' + this.$API.getLever(item.count)
      } else if (key === 'assets') {
        return item.count + ' ' + this.assetName
      } else if (key === 'post_count' || key === 'contentsNum') {
        return item.count + ' 篇'
      }
      return item.count
    },
    
    getRankList() {
      this.loading = true

      if (!this.enabledTabs.length) {
        this.enabledTabs = [{ name: '发帖排行', key: 'post_count' }];
        this.currentTab = 0;
      }
      
      uni.request({
        url: this.$API.PluginLoad('xqy_rank'),
        data: {
          plugin: 'xqy_rank',
          action: 'getRank',
          type: this.enabledTabs[this.currentTab].key
        },
        method: 'GET',
        dataType: 'json',
        success: async (res) => {
          if(res.data?.code === 200) {
            if(Array.isArray(res.data?.data?.rank_list)) {
              // 使用 Promise.all 等待所有头像获取完成
              const promises = res.data.data.rank_list.map(item => this.getUserAvatar(item.uid));
              const userInfos = await Promise.all(promises);
              
              this.rankList = res.data.data.rank_list.map((item, index) => ({
                ...item,
                avatar: userInfos[index]?.avatar || '/static/images/avatar.png'
              }));

              if(res.data.data.asset_name) {
                this.assetName = res.data.data.asset_name
              }
            }
            if(res.data?.data?.config?.title) {
              this.rankTitle = res.data.data.config.title
            }

            const newEnabledTabs = [];
            if (res.data.data.config.enable_contentsNum !== 0) {
              newEnabledTabs.push({ name: '文章排行', key: 'contentsNum' })
            }
            if (res.data.data.config.enable_experience !== 0) {
              newEnabledTabs.push({ name: '等级排行', key: 'experience' })
            }
            if (res.data.data.config.enable_assets !== 0) {
              newEnabledTabs.push({ name: '财富排行', key: 'assets' })
            }
            
            if (newEnabledTabs.length === 0) {
              newEnabledTabs.push({ name: '文章排行', key: 'contentsNum' });
            }
            
            this.enabledTabs = newEnabledTabs;
            
            if (this.currentTab >= this.enabledTabs.length) {
              this.currentTab = 0
              this.getRankList()
              return
            }
          } else {
            this.errorMsg = res.data?.msg || '获取排行榜失败'
            uni.showToast({
              title: this.errorMsg,
              icon: 'none'
            })
          }
          this.loading = false
        },
        fail: (err) => {

          this.loading = false
          this.errorMsg = '网络请求失败'
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          })
        }
      })
    },
    
    // 获取用户头像
    getUserAvatar(uid) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: this.$API.getUserInfo(),
          data: {
            key: uid
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: "GET",
          dataType: 'json',
          success: (res) => {
            if(res.data?.code == 1) {
              resolve(res.data.data);
            } else {
              resolve(null);
            }
          },
          fail: (err) => {
            resolve(null);
          }
        });
      });
    },
    back() {
      uni.navigateBack({
        delta: 1
      })
    },
    // 跳转到用户资料页面
    toUserInfo(item) {
      if (!item || !item.uid) return;
      
      const uid = item.uid;
      const name = item.name;
      const title = name + "的信息";
      
      uni.navigateTo({
        url: '/pages/contents/userinfo?title=' + encodeURIComponent(title) + 
             "&name=" + encodeURIComponent(name) + 
             "&uid=" + uid + 
             "&avatar=" + encodeURIComponent(item.avatar)
      });
    }
  }
}
</script>

<style lang="scss" scoped>

/* #ifdef APP-PLUS */
.rank-tabs {
  padding: 8rpx 20rpx;
  margin-bottom: 8rpx;
  margin-top: -15rpx;
  
  .tab-item {
    padding: 4rpx 0;
    font-size: 26rpx;
  }
}

.header {
  .cu-bar {
    padding: 0 20rpx;
    height: calc(CustomBar - 15px);
    
    .content {
      font-size: 30rpx;
      transform: translateY(-8rpx);
    }
  }
  
  .nav-divider {
    height: 1rpx;
  }
}

.podium {
  padding: 15rpx 20rpx;
  gap: 15rpx;
  margin-top: -10rpx;
}

.rank-list {
  padding: 10rpx 20rpx;
  
  .list-item {
    padding: 12rpx;
    margin-bottom: 8rpx;
  }
}
/* #endif */

.nav-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2rpx;
  background: linear-gradient(to right, rgba(0,0,0,0.02), rgba(0,0,0,0.05), rgba(0,0,0,0.02));
}

.podium {
  padding: 40rpx 30rpx;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20rpx;
  background: #fff;
  position: relative;
  
  .rank-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
    background: #fff;
    border-radius: 25rpx;
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
    transition: all 0.3s ease;
    
    .badge {
      position: absolute;
      top: -30rpx;
      font-size: 45rpx;
      filter: drop-shadow(0 2rpx 4rpx rgba(0,0,0,0.1));
      animation: float 2s ease-in-out infinite;
      text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
    }
    
    .rank-number {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      width: 36rpx;
      height: 36rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      font-weight: bold;
      color: #fff;
      box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
    }
    
    .avatar-box {
      width: 110rpx;
      height: 110rpx;
      border-radius: 55rpx;
      overflow: hidden;
      margin: 15rpx 0;
      border: 4rpx solid #fff;
      box-shadow: 0 4rpx 15rpx rgba(0,0,0,0.1);
      
      image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .info {
      text-align: center;
      width: 100%;
      
      .name {
        display: block;
        font-size: 26rpx;
        color: #333;
        margin-bottom: 8rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 120rpx;
      }
      
      .count {
        font-size: 24rpx;
        color: #fff;
        background: linear-gradient(135deg, #3498db, #2980b9);
        padding: 8rpx 24rpx;
        border-radius: 30rpx;
        border: none;
        font-weight: 500;
        box-shadow: 2rpx 2rpx 10rpx rgba(52, 152, 219, 0.2);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 80rpx;
        
        &.post_count {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          box-shadow: 2rpx 2rpx 10rpx rgba(46, 204, 113, 0.2);
        }
        
        &.contentsNum {
          background: linear-gradient(135deg, #9b59b6, #8e44ad);
          box-shadow: 2rpx 2rpx 10rpx rgba(155, 89, 182, 0.2);
        }
        
        &.experience {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          box-shadow: 2rpx 2rpx 10rpx rgba(231, 76, 60, 0.2);
        }
        
        &.assets {
          background: linear-gradient(135deg, #1abc9c, #16a085);
          box-shadow: 2rpx 2rpx 10rpx rgba(26, 188, 156, 0.2);
        }
      }
    }
    
    &.second {
      transform: translateY(30rpx) scale(0.95);
      margin-right: -10rpx;
      background: linear-gradient(135deg, #e8e8e8, #fff);
      border: 2rpx solid rgba(192,192,192,0.3);
      z-index: 1;
      
      .rank-number {
        background: linear-gradient(135deg, #C0C0C0, #A9A9A9);
      }
      
      .avatar-box {
        border-color: #C0C0C0;
      }
    }
    
    &.champion {
      padding: 25rpx;
      transform: scale(1.1);
      background: linear-gradient(135deg, #fff9e6, #fff);
      border: 2rpx solid #ffd700;
      z-index: 2;
      
      .rank-number {
        background: linear-gradient(135deg, #FFD700, #FFA500);
      }
      
      .avatar-box {
        width: 120rpx;
        height: 120rpx;
        border-color: #ffd700;
      }
      
      .info .name {
        max-width: 140rpx;
      }
      
      &::before {
        content: '';
        position: absolute;
        top: -15rpx;
        left: -15rpx;
        right: -15rpx;
        bottom: -15rpx;
        background: radial-gradient(circle at center, rgba(255,215,0,0.08), transparent 70%);
        border-radius: 30rpx;
        z-index: -1;
        animation: pulse 3s ease-in-out infinite;
        pointer-events: none;
      }
      
      box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.15);
    }
    
    &.third {
      transform: translateY(45rpx) scale(0.9);
      margin-left: -10rpx;
      background: linear-gradient(135deg, #f8e4d5, #fff);
      border: 2rpx solid rgba(205,127,50,0.3);
      z-index: 1;
      
      .rank-number {
        background: linear-gradient(135deg, #CD7F32, #8B4513);
      }
      
      .avatar-box {
        border-color: #CD7F32;
      }
    }
  }
}

.rank-list {
  margin-top: 0;
  padding: 20rpx 30rpx;
  
  .list-item {
    display: flex;
    align-items: center;
    padding: 15rpx;
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 10rpx;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
    transition: transform 0.2s ease;
    border: 2rpx solid rgba(0,0,0,0.05);
    
    &:hover {
      transform: translateX(5rpx);
    }
    
    .number {
      width: 60rpx;
      font-size: 28rpx;
      color: #666;
      text-align: center;
      font-weight: 500;
    }
    
    .avatar-box {
      width: 80rpx;
      height: 80rpx;
      border-radius: 40rpx;
      overflow: hidden;
      margin: 0 20rpx;
      border: 3rpx solid rgba(0,0,0,0.05);
      
      image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .name {
        font-size: 28rpx;
        color: #333;
      }
      
      .count {
        font-size: 24rpx;
        color: #fff;
        background: linear-gradient(135deg, #3498db, #2980b9);
        padding: 8rpx 24rpx;
        border-radius: 30rpx;
        border: none;
        font-weight: 500;
        box-shadow: 2rpx 2rpx 10rpx rgba(52, 152, 219, 0.2);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 80rpx;
      }
    }
  }
}


      
      .number {
        color: #aaa;
      }
      
      .avatar-box {
        border-color: rgba(255,255,255,0.1);
      }
      
      .info {
        .name {
          color: #ddd;
        }
      }
    

.rank-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  
  .tab-item {
    flex: 1;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 6rpx 0;
    position: relative;
    
    &.active {
      color: #3498db;
      font-weight: bold;
      
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background: #3498db;
        border-radius: 2rpx;
      }
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5rpx); }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.4; 
    transform: scale(1.02); 
  }
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f6f6;
  z-index: 999;
}

.plugin-disabled {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa; /* 默认浅色背景 */
  
  image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 30rpx;
  }
  
  .text {
    font-size: 32rpx;
    color: #666;
  }
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  background-color: transparent;
}

.empty-box image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>