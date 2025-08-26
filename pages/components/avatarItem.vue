<template>
	<view class="user-header" style="width: 180upx;">
		<view class="user-rz-container">
			<view class="user-rz" :style="{ backgroundImage: 'url(' + avatar + ')' }">
				<image v-if="xqy_avatarframe && AvatarItem" style="width:220rpx;height:220rpx;border-radius:0px;z-index: 90;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%) scale(1.1);max-width: initial;" :src="AvatarItem" mode="aspectFit"></image>
			</view>
		</view>
	</view>
</template>

<script>
import {
	localStorage
} from '../../js_sdk/mp-storage/mp-storage/index.js'
export default {
    props: {
        avatar: {
		  type: String,
		  default: ''
		},
        uid: {
          type: [String, Number],
          default: ''
        }
    },
	watch: {
	    uid(newVal) {
	      if(this.xqy_avatarframe && newVal) {
	        this.getAvatarFrameWithCache();
	      }
	    }
	  },
	name: "avatarItem",
	data() {
		return {
				AvatarItem:"",
				userinfo:null,
				xqy_avatarframe:false,
            frameCache: {},
            cacheExpiration: 5 * 60 * 1000,
            requestInProgress: {}
		};
	},
	mounted() {
		const that = this;
		if (localStorage.getItem('userinfo')) {
			that.userinfo = JSON.parse(localStorage.getItem('userinfo'));
		} else {
			that.userinfo = null;
		}
		
		var cachedPlugins = localStorage.getItem('getPlugins');
		if (cachedPlugins) {
			const pluginList = JSON.parse(cachedPlugins);
			// 检查插件是否存在于插件列表中
			that.xqy_avatarframe = pluginList.includes('xqy_avatar_frame');
		}
		if(that.xqy_avatarframe){
			that.getAvatarFrameWithCache();
		}
	},
	methods: {
        getAvatarFrameWithCache() {
            const that = this;
            const queryUid = that.uid;
            if (!queryUid) return;
            
            const cacheKey = `avatar_frame_${queryUid}`;
            const cachedData = localStorage.getItem(cacheKey);
            
            if (cachedData) {
                try {
                    const data = JSON.parse(cachedData);
                    if (data.timestamp && (Date.now() - data.timestamp < that.cacheExpiration)) {
                        that.AvatarItem = data.frameUrl || '';
                        return;
                    }
                } catch (e) {
                }
            }
            
            if (that.requestInProgress[queryUid]) return;
            that.requestInProgress[queryUid] = true;
            
            that.getAvatarFrameByid();
        },
		
		getAvatarFrameByid(){
			var that = this;
			const queryUid = that.uid;
			if (!queryUid) {
				that.requestInProgress[queryUid] = false;
				return;
			}
			that.$Net.request({
				url:that.$API.PluginLoad('xqy_avatar_frame'),
				data: {
					"action":"get_user_frames",
					"op": "list",
					"type": "view",
					"uid": queryUid
				},
				method: "post",
				dataType: 'json',
				success: function(res) {
					try {
						if (res.data && res.data.code === 200 && res.data.data && res.data.data.awarded && res.data.data.awarded.length > 0) {
							const wearingFrame = res.data.data.awarded.find(frame => frame.is_wearing);
							if (wearingFrame && wearingFrame.frame_url) {
								that.AvatarItem = wearingFrame.frame_url;
								localStorage.setItem(`avatar_frame_${queryUid}`, JSON.stringify({
									frameUrl: wearingFrame.frame_url,
									timestamp: Date.now()
								}));
							} else {
								localStorage.setItem(`avatar_frame_${queryUid}`, JSON.stringify({
									frameUrl: '',
									timestamp: Date.now()
								}));
							}
						} else {
							if (res.data && res.data.data && res.data.data.frame_url) {
								that.AvatarItem = res.data.data.frame_url;
								localStorage.setItem(`avatar_frame_${queryUid}`, JSON.stringify({
									frameUrl: res.data.data.frame_url,
									timestamp: Date.now()
								}));
							} else {
								localStorage.setItem(`avatar_frame_${queryUid}`, JSON.stringify({
									frameUrl: '',
									timestamp: Date.now()
								}));
							}
						}
					} catch (error) {
						localStorage.setItem(`avatar_frame_${queryUid}`, JSON.stringify({
							frameUrl: '',
							timestamp: Date.now()
						}));
					}
                that.requestInProgress[queryUid] = false;
				},
				fail: function(res) {
					console.error('获取头像框失败:', res);
                    that.requestInProgress[queryUid] = false;
				}
			})
		},
	}
}
</script>

<style>
	.text-content {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 10;
		-webkit-box-orient: vertical;
	}
	
	.text-shojo2 {
		color: #ff6c3e;
	}
	
	.user-info-data {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.xyy {
		margin-left: 0px;
	}
	
	.search-type {
		display: flex;
		position: relative;
		align-items: center;
		justify-content: space-around;
		border-bottom: solid 4upx #f3f3f3;
	}
	
	.search-type-box.active {
		border-bottom: solid 4upx #000000;
		color: #000000;
	}
	
	.user-info-data-box {
		flex-grow: 1;
		text-align: center;
	}
	
	.user-data-num {
		margin-right: 0px;
		font-size: 36upx;
	}
	
	.user-data-label {
		font-size: 28upx;
	}
	
	.sup-script {
		font-size: 28upx;
		font-weight: 400;
	}
	.user-rz-container image{
		background-color: initial!important;
		border: initial!important;
	}
	
	.cu-bar .action2 {
		background: #00000057;
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		/* text-align: center; */
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.grid2 {
		display: flex;
		flex-direction: row;
		justify-content: normal;
	}
	
	.cu-bar2 {
		margin-top: 10upx;
	}
	
	.userIndex .header .action {
		font-size: 36upx;
	}
	
	.user-rz-container {
		width: 200upx;
		height: 200upx;
		position: relative;
		display: inline-block;
		overflow: visible;
	}
	
	.user-rz {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		border: 3px solid white;
		overflow: visible; 
		position: relative; 
		z-index: 80;
	}
	

	
	/*  #ifdef MP || APP-PLUS */
	.user-header image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
	}
	
	/*  #endif */
	.user-info-main {
		/*  #ifdef H5 || APP-PLUS */
		height: 480rpx;
		/*  #endif */
		/*  #ifdef MP */
		height: 450rpx;
		/*  #endif */
	}
	
	.tn-margin-top-xxl {
		margin-top: 60upx;
	}
	
	.center-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>