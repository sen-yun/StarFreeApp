<template>
	<view class="userpost">
		<!-- 用户榜 -->
		<block v-if="userlist_of==1 && logins==1">
		<view class="tn-margin-top-sm" @tap="toUserList">
		  <view class="tn-flex tn-flex-row-between tn-round tn-padding-xs tn-margin" style="background: #71e0b7;color: #fff;">
		    <view class="justify-content-item tn-text-center tn-flex" style="background-color: transparent;">
		      <tn-avatar-group :lists="avatargroup" size="sm"></tn-avatar-group> 
		      <text class="tn-padding-xs">共{{usercount}}人</text>
		    </view>
		    <view class="justify-content-item tn-text-right tn-padding-top">
		      <view class="tn-text-bold">
		        分类 · 全部用户
		      </view>
		    </view>
		    <view class="justify-content-item tn-text-right tn-margin-right tn-padding-top">
		      <text class="tn-icon-right"></text>
		    </view>
		  </view>
		</view>
		</block>
		<block v-if="quanzi_style==1 && logins==1">
		<view style="padding: 5px;"></view>
		<view class="container">
		    <view class="ghj234">
		      <block v-for="(item, index) in topic" :key="index">
		        <view class="klm098" @tap="toCategoryContents(item.name,item.mid,item.imgurl)">
		          <view class="poi321">
		            <view class="image-picbook" :style="'background-image:url(' + item.imgurl + ')'"></view>
		            <view class="tn-blogger-content__label">
		              <text class="tn-blogger-content__label__desc">{{ item.name }}</text>
					  <text class="tn-color-gray">{{ item.description}}</text>
		            </view>
		          </view>
		        </view>
		      </block>
		  </view>
		   </view>
		   </block>
		<block v-if="quanzi_style==2 && logins==1">
		<view class="tn-flex tn-flex-wrap tn-margin-sm">
				  <block v-for="(item, index) in topic" :key="index">
				    <view class="" style="width: 50%;"  @tap="toCategoryContents(item.name,item.mid,item.imgurl)">
				      <view class="tn-blogger-content__wrap" style="background-color: rgba(255,255,255,0.6);">
				        <view class="image-picbook" :style="'background-image:url(' + item.imgurl + ')'">
				          <view class="image-book">
				          </view>
				        </view> 
				        
				        <view class="tn-blogger-content__label tn-text-justify" style="padding: 10px 10px 0px 10px;">
				          <text class="tn-blogger-content__label__desc">{{ item.name }}</text>  
				        </view>
						
						<view class="tn-blogger-content__label tn-text-justify" style="padding: 0px 10px 10px 10px;">
						  <text class="tn-text-sm tn-blogger-content__label__desc tn-color-gray">{{ item.description }}</text>  
						</view>
				      </view>
				    </view>
				  </block>
				</view>
				<view class="tn-text-center" v-show="topic.length == 0">
					 <text class="text-gray">暂时还没有设置分类介绍哦~</text>
				</view>
		</block>
		<!--加载遮罩-->
		<view class="loading" v-if="isLoading==0 && logins==1">
			<view class="loading-main">
				<image src="../../static/loading.gif"></image>
			</view>
		</view>
		<!--加载遮罩结束-->
	</view>
</template>

<script>
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	export default {
		props: {
			topic: {
				type: Array,
				default:() => []
			},
			avatargroup: {
				type: Array,
				default:() => []
			},
			moreText: {
				type: String,
				default: ""
			},
			isLoading: {
				type: Number,
				default: 0
			}
		},
		name: "metas",
		data() {
			return {
				// moreText:"加载更多",
				page: 1,
				quanzi_style: 1,
				userlist_of: 1,
				userlist_all: 0,
				mid: 0,
				usercount: "0",
				logins: 0,
			}
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		onShow(){
			var that = this;
			
			this.getContinuous()
			this.$emit('loadMore')
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			
		},
		onReachBottom() {
		    //触底后执行的方法，比如无限加载之类的
			var that = this;
			console.log(123);
			that.loadMore();
		},
		mounted() {
			var that = this;
			this.$emit('loadMore')
			 this.getContinuous()
			 
			// #ifdef APP-PLUS || MP || H5
			that.NavBar = this.CustomBar;
			// #endif
			
		},
		methods: {
			
			toUserList() {
				uni.navigateTo({
					url: '/pages/user/userlist'
				})
			},
			
			getContinuous() {
			  var that = this;
			 
			  		uni.request({
			  			url: that.$API.SMuser(),
			  			method:'GET',
			  			dataType:"json",
			  			success(res) {
			  						that.usercount = res.data.usercount;
			  			 
			  			},
			  			fail(error) {
			  			  console.log(error);
			  			}
			  			
			  		})
					uni.request({
						url:that.$API.SMgonggao(),
						method:'GET',
						dataType:"json",
						success(res) {
							that.userlist_of = res.data.userlist_of;
							that.userlist_all = res.data.userlist_all;
							that.quanzi_style = res.data.quanzi_style;
							that.logins = 1
						},
						fail(error) {
						  console.log(error);
						  that.logins = 1
						}
						
					})
			},
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			loadMore(){
				var that = this;
				// that.moreText="加载中...";
				// if(that.isLoad==0){
				// }
				this.$emit('loadMore')
			},
			replaceSpecialChar(text) {
			  text = text.replace(/&quot;/g, '"');
			  text = text.replace(/&amp;/g, '&');
			  text = text.replace(/&lt;/g, '<');
			  text = text.replace(/&gt;/g, '>');
			  text = text.replace(/&nbsp;/g, ' ');
			  text = text.replace("||rn||","\n");
			  return text;
			},
			toCategoryContents(title,id){
				var that = this;
				var type="meta";
				uni.navigateTo({
				    url: '/pages/contents/contentlist?title='+title+"&type="+type+"&id="+id
				});
			},
		}
	}
</script>

<style scoped>
	.margin-top-sm{
		/* margin-top: 0 ; */
		/* margin-bottom: 10px; */
	}
	.image-book{
	  padding: 150rpx 0rpx;
	  font-size: 16rpx;
	  font-weight: 300;
	  position: relative;
	}
	.image-picbook{
	  background-size: cover;
	  background-repeat:no-repeat;
	  background-position:top;
	  border-radius: 15rpx 15rpx 0 0;
	}
	.tn-blogger-content__wrap{
		box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.07);
		border-radius: 10px;
		margin: 7px;
	}
	.data-box{
		background: #f6f6f6;
	}
	.tn-flex{
		margin: 10px;
	}
	/* 为class属性添加偏僻词 */

	.container {
	margin-left: 14px;
	  padding: 1px;
	  border-radius: 10px;
	}
	/* 用偏僻词替换class属性 */
	.ghj234 {
	  display: flex;
	  flex-wrap: wrap;
	}
	
	.ghj234 .klm098 {
	  width: 46%;
	  box-sizing: border-box;
	  padding: 10px;
	  background-color: #fff;
	  border-radius: 10px;
	  box-shadow: 0px 5px 5px rgb(207 207 207 / 30%);
	  margin-bottom: 15px;
	  margin-right: 8px;
	}
	
	
	
	.ghj234 .klm098 .poi321 {
	  display: flex;
	  align-items: center;
	}
	
	.ghj234 .klm098 .poi321 .image-picbook {
	  width: 50px;
	  height: 50px;
	  background-size: cover;
	  border-radius: 50%;
	  margin-right: 10px;
	}
	
	.ghj234 .klm098 .poi321 .tn-blogger-content__label {
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	}
	
	.ghj234 .klm098 .poi321 .tn-blogger-content__label .tn-blogger-content__label__desc {
	  font-size: 15px;
	  font-weight: bold;
	  margin-bottom: 5px;
	}
	
	.ghj234 .klm098 .poi321 .tn-blogger-content__label .tn-color-gray {
	  font-size: 10px;
	}
	
	/* 避免描述过长排版会乱 */
	.ghj234 .klm098 .poi321 .tn-color-gray {
 white-space: nowrap; /* 不换行 */
     overflow: hidden; /* 超出隐藏 */
     text-overflow: ellipsis; /* 显示省略号 */
     display: inline-block; /* 显示为行内块元素 */
  max-width: 8em; 
	}
</style>
