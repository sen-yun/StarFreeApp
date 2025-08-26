<template>
	<view class="write-comment-page"
		:style="{'background-color':'#f6f6f6','min-height':'100vh'}">
		<view class="header" :style="[{height:CustomBar*2  + 25 + 'rpx'}]">
			<view class="cu-bar color-black"
				:style="{'height': CustomBar*2 + 25 + 'rpx','padding-top':StatusBar*2 + 25 + 'rpx', 'background-color': '#ffffff'}">
				<view class="action" @tap="back">
					<view>
						<text class="cuIcon-back color-black"></text>
					</view>
					<view class="content text-bold color-black" :style="[{top:StatusBar*2 + 25 + 'rpx'}]">
						写评论
					</view>
				</view>
			</view>
		</view>
		
		<view :style="[{padding:NavBar + 'px 15px 0px 15px'}]"></view>
		
		<!-- 内容容器 -->
		<view class="content-container">
			<!-- 评分区域 -->
			<view class="rating-section">
				<view class="rating-title">
					<text :style="{'color':'#333'}">给这本书打分</text>
				</view>
				<view class="stars-container">
					<text v-for="(star, index) in 5" :key="index" 
						class="rating-star" 
						:class="index < selectedRating ? 'star-filled' : 'star-empty'"
						@tap="selectRating(index + 1)">
						<text class="tn-icon-star-fill" :style="{'color': 'inherit'}"></text>
					</text>
				</view>
				<view class="rating-text">
					<text :style="{'color':'#666'}">{{getRatingText(selectedRating)}}</text>
				</view>
			</view>
			
			<!-- 评论内容区域 -->
			<view class="comment-section">
				<view class="comment-title">
					<text :style="{'color':'#333'}">写下你的评价</text>
				</view>
				<textarea 
					class="comment-textarea" 
					v-model="commentContent"
					placeholder="分享你的阅读感受吧..."
					:placeholder-style="'color:#999'"
					:style="{'background-color':'#f8f8f8','color':'#333','border-color':'#e0e0e0'}"
					maxlength="500"
					auto-height
					:show-confirm-bar="false">
				</textarea>
				<view class="char-count">
					<text :style="{'color':'#999'}">{{commentContent.length}}/500</text>
				</view>
			</view>
			
			<!-- 提交按钮 -->
			<view class="submit-section">
				<button class="submit-button" @tap="submitComment" :disabled="!canSubmit">
					{{isSubmitting ? '发布中...' : '发布评论'}}
				</button>
			</view>
			
			<!-- 用户评分历史提示 -->
			<view class="user-rating-tip" v-if="userRating" :style="{'background-color':'#fff3cd','border-color':'#ffeaa7'}">
				<text :style="{'color':'#856404'}">{{userRating.message || '你已经给这本书评过分了，当前评分：' + (userRating.rating || '?') + '星'}}</text>
				<text :style="{'color':'#856404','display':'block','margin-top':'10rpx'}">提交后将覆盖你之前发表的评论</text>
			</view>
		</view>
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
				userInfo: null,
				token: "",
				novelId: '',
				selectedRating: 0,
				commentContent: '',
				isSubmitting: false,
				userRating: null,
				ratingTexts: {
					1: '很差，不推荐',
					2: '一般般，有待改进',
					3: '还不错，值得一看',
					4: '很好，强烈推荐',
					5: '非常棒，必看佳作'
				}
			};
		},
		computed: {
			canSubmit() {
				return this.selectedRating > 0 && this.commentContent.trim().length > 0 && !this.isSubmitting;
			}
		},
		onLoad(options) {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			if (localStorage.getItem('userinfo')) {
				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
			}
			if (localStorage.getItem('token')) {
				that.token = localStorage.getItem('token');
			}
			
			if (options.novelId) {
				that.novelId = options.novelId;
				// 如果传入了评分参数，设置默认评分
				if (options.rating) {
					that.selectedRating = parseInt(options.rating);
				}
	
				that.checkUserRating();
				
				// 如果从评论列表页跳转过来，并且标记了用户已有评论
				if (options.hasComment && options.hasComment === '1') {
					// 如果还没有加载到用户评分数据，创建一个临时对象
					if (!that.userRating) {
						that.userRating = { hasRated: true, message: '您之前已经评论过这本书' };
					}
				}
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			selectRating(rating) {
				this.selectedRating = rating;
			},
			getRatingText(rating) {
				return this.ratingTexts[rating] || '请选择评分';
			},
			checkUserRating() {
				var that = this;
				if (!that.token) return;
				
				uni.request({
				url: that.$API.PluginLoad('xqy_novel'),
				data: {
					action: 'checkUserRating',
					plugin: 'xqy_novel',
					novel_id: that.novelId,
					token: that.token
				},
				method: 'GET',
					dataType: 'json',
					success(res) {
						if (res.data && res.data.code === 200 && res.data.data.hasRated) {
							that.selectedRating = res.data.data.rating;
							that.commentContent = res.data.data.content || '';
							that.userRating = res.data.data;
						}
					},
					fail(error) {
					}
				});
			},
			submitComment() {
				var that = this;
				
				if (!that.token) {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					});
					return;
				}
				
				if (that.selectedRating === 0) {
					uni.showToast({
						title: "请选择评分",
						icon: 'none'
					});
					return;
				}
				
				if (that.commentContent.trim().length === 0) {
					uni.showToast({
						title: "请输入评论内容",
						icon: 'none'
					});
					return;
				}
				
				if (that.commentContent.trim().length < 5) {
					uni.showToast({
						title: "评论内容至少5个字符",
						icon: 'none'
					});
					return;
				}
				
				that.isSubmitting = true;
				
				uni.request({
				url: that.$API.PluginLoad('xqy_novel'),
				method: 'POST',
				data: {
					action: 'addRating',
					plugin: 'xqy_novel',
					novel_id: that.novelId,
					rating: that.selectedRating,
					content: that.commentContent.trim(),
					token: that.token
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
					success(res) {
						that.isSubmitting = false;
						if (res.data && res.data.code === 200) {
							uni.showToast({
								title: that.userRating ? '评分更新成功' : '评分成功',
								icon: 'success'
							});
							// 延迟返回，让用户看到成功提示
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 1500);
						} else {
							uni.showToast({
								title: res.data?.msg || '发布失败',
								icon: 'none'
							});
						}
					},
					fail(error) {
						that.isSubmitting = false;
						uni.showToast({
							title: '网络开小差了',
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/styles/home.scss";

	.write-comment-page {
		min-height: 100vh;
	}

	.content-container {
		margin: 35rpx 15rpx 20rpx 15rpx;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		background-color: #ffffff;
	}

	.rating-section {
		padding: 60rpx 40rpx;
		text-align: center;
		border-bottom: 20rpx solid #f8f8f8;
		background-color: transparent;

		.rating-title {
			margin-bottom: 40rpx;

			text {
				font-size: 36rpx;
				font-weight: bold;
			}
		}

		.stars-container {
			display: flex;
			justify-content: center;
			gap: 20rpx;
			margin-bottom: 30rpx;

			.rating-star {
				font-size: 80rpx;
				cursor: pointer;
				transition: all 0.2s;

				&.star-filled {
					color: #ff6600;
					transform: scale(1.1);
					
					.tn-icon-star-fill {
						color: #ff6600 !important;
					}
				}

				&.star-empty {
					color: #ddd;
				}

				&:hover {
					transform: scale(1.2);
				}
			}
		}

		.rating-text {
			text {
				font-size: 28rpx;
			}
		}
	}

	.comment-section {
		padding: 40rpx;
		background-color: transparent;

		.comment-title {
			margin-bottom: 30rpx;

			text {
				font-size: 32rpx;
				font-weight: bold;
			}
		}

		.comment-textarea {
			width: 100%;
			min-height: 300rpx;
			padding: 30rpx;
			border: 2rpx solid #e0e0e0;
			border-radius: 16rpx;
			font-size: 28rpx;
			line-height: 1.5;
			box-sizing: border-box;
			resize: none;
		}

		.char-count {
			text-align: right;
			margin-top: 15rpx;

			text {
				font-size: 24rpx;
			}
		}
	}

	.submit-section {
		padding: 40rpx;

		.submit-button {
			width: 100%;
			height: 88rpx;
			background-color: #ff6600;
			color: white;
			border: none;
			border-radius: 44rpx;
			font-size: 32rpx;
			font-weight: bold;

			&:disabled {
				background-color: #ccc;
				color: #999;
			}
		}
	}

	.user-rating-tip {
		margin: 20rpx 40rpx;
		padding: 20rpx;
		border: 2rpx solid #ffeaa7;
		border-radius: 12rpx;
		background-color: #fff3cd;

		text {
			font-size: 26rpx;
			color: #856404;
		}
	}
</style>