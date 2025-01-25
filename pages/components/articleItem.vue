<template>

	<view>
		<!--帖子推流广告区域-->
		<view class="cu-card article no-card" :class="isTop?'topContents':''" v-if="item.isAds" @tap="goAds(item)">
			<view class="cu-item shadow">
				<view class="title">
					<view class="text-cut">{{item.name}}</view>

				</view>
				<view class="content article-content" style="position: relative;">
					<image :src="item.img" mode="aspectFill"></image>
					<view class="desc">
						<view class="text-content">{{item.intro}}</view>
						<view class="ads-more" @tap="goAds(item)">了解更多<text class="cuIcon-right"></text></view>
					</view>
					<text class="ads-ico">广告</text>
				</view>
			</view>
		</view>
		<view class="cu-card article no-card" v-else @tap="toInfo(item)">

			<view v-if="isTop" class="cu-item" style="border-radius: 20upx;padding-bottom:0px">
				<view class="title">
					<view class="flex">
						<view class="margin-top-xs margin-right-xs" style="width: 43upx;height: 43upx;">
							<image src="../../static/page/br6.png" mode="widthFix"></image>
						</view>
						<text>{{formattedTitle}}</text>
					</view>
				</view>
			</view>

			<view v-if="isTop==false" class="cu-item">
				<view class="title">
					<view class="text-cut">
						<view class="content-author flex align-center">
							<image :src="item.authorInfo.avatar" mode="aspectFill"></image>
							<text v-if="item.authorInfo.isvip>0"
								class="content-author-name text-shojo2">{{item.authorInfo.name}}</text>
							<text class="userlv" v-if="item.authorInfo.isvip>0"
								style="background: linear-gradient(to bottom right, #f2ad5c, #e6216d,#901ccb);color:white;padding: 3px 5px;border-radius: 10px;">VIP</text>
							<text v-else class="content-author-name tn-text-bold">{{item.authorInfo.name}}</text>

						</view>
						<view class="data-time" style="color: #888;font-size: 9px;font-weight: normal !important;">
							{{formatDate(item.created)}}</view>
						<text style="color: #444;">{{formattedTitle}}</text>
					</view>
				</view>

				<block v-if="item.images.length == 0&&isTop==false">
					<view class="content article-content">
						<view class="text-content" v-if="item.text.length > 0"> {{infotext}}</view>

					</view>
				</block>
				<block v-if="item.images.length > 0 && isTop==false">
					<view class="content article-content">
						<view class="text-content text-ellipsis" v-if="item.text.length > 0">
							{{infotext}}
						</view>

						<view class="grid flex-sub col-3 grid-square">
							<block v-if="item.images.length == 1">
								<view class="bg-img">
									<image :src="isVipContent ? '../../static/page/vip_img.png' : item.images[0]"
										mode="aspectFill"></image>
								</view>
							</block>
							<block v-if="item.images.length == 2">
								<view class="bg-img">
									<image :src="isVipContent ? '../../static/page/vip_img.png' : item.images[0]"
										mode="aspectFill"></image>
								</view>
								<view class="bg-img">
									<image :src="isVipContent ? '../../static/page/vip_img.png' : item.images[1]"
										mode="aspectFill"></image>
								</view>
							</block>
							<block v-if="item.images.length >= 3">
								<view class="bg-img">
									<image :src="isVipContent ? '../../static/page/vip_img.png' : item.images[0]"
										mode="aspectFill"></image>
								</view>
								<view class="bg-img">
									<image :src="isVipContent ? '../../static/page/vip_img.png' : item.images[1]"
										mode="aspectFill"></image>
								</view>
								<view class="bg-img">
									<image :src="isVipContent ? '../../static/page/vip_img.png' : item.images[2]"
									mode="aspectFill"></image>
									<text v-if="item.images.length > 3" class="extra-count"><view class="cuIcon-add center-add"> {{ item.images.length-3 }}</view></text>
								</view>
								
							</block>
						</view>
					</view>
				</block>

				<view v-if="isTop==false" class="article-content-btn article-list-btn flex justify-between	"
					style="margin-top:30upx;">
					<view class="tn-padding-xs text-shojo"
						style="border-radius: 40upx;color: #262626;font-weight: bold;background: #f1f1f1;">
						<text class="padding-sm radius" v-if="item.category.length>0">{{item.category[0].name}}圈</text>

					</view>
					<view class="flex align-center" style="color:#666">

						<view class="margin-left-sm" style="width: 48upx;height: 39upx;">
							<image src="../../static/page/lll.png" mode="widthFix"></image>
						</view>
						<text style="margin-right: 20px;"> {{formatNumber(item.views)}} </text>

						<view class="margin-left-sm" style="width: 40upx;height: 44upx;">
							<image src="../../static/page/like_unpressed.png" mode="widthFix"></image>
						</view>
						<text style="margin-right: 20px;"> {{item.likes}} </text>

						<view class="margin-left-sm" style="width: 40upx;height: 42upx;">
							<image src="../../static/page/icon_message_pink.png" mode="widthFix"></image>
						</view>
						<text v-if="item.commentsNum>0">{{item.commentsNum}}</text>
						<text v-else> {{item.commentsNum}} </text>

					</view>

				</view>

			</view>
		</view>
		<view class="padding-xs" style="background-color: #f6f6f6;"></view>
	</view>

</template>

<script>
	// #ifdef APP-PLUS
	import owo from '../../static/app-plus/owo/OwO.js'
	// #endif
	// #ifdef H5
	import owo from '../../static/h5/owo/OwO.js'
	// #endif
	// #ifdef MP
	var owo = [];
	// #endif
	export default {
		props: {
			item: {
				type: Object,
				default: () => ({})
			},
			isTop: {
				type: Boolean,
				default: false
			}
		},
		name: "articleItem",
		data() {
			return {
				needRefresh: false
			};
		},
		computed: {
			displayImages() {
				return this.item.images.slice(0, 3)
			},
			isVipContent() {
				return this.item.category?.[0]?.slug === 'vip'
			},
			formattedTitle() {
				return this.replaceSpecialChar(this.item.title)
			},
			infotext(){
				var text = this.item.text;
				const replacements = {
					'vip(.*?)/vip': '(该内容仅会员可见)',
					'audio(.*?)/audio': '(该帖子包含音乐)',
					'\\|\\|rn\\|\\|': '' // 去掉所有||rn||
				}

				Object.entries(replacements).forEach(([pattern, replacement]) => {
					text = text.replace(new RegExp(pattern, 'g'), replacement)
				})
				return text
			}
		},
		methods: {
			replaceAll(string, search, replace) {
				return string.split(search).join(replace);
			},

			replaceSpecialChar(text) {
				text = text.replace(/&quot;/g, '"');
				text = text.replace(/&amp;/g, '&');
				text = text.replace(/&lt;/g, '<');
				text = text.replace(/&gt;/g, '>');
				text = text.replace(/&nbsp;/g, ' ');
				return text;
			},
			formatDate(datetime) {
				const timeUnits = [{
						unit: 'year',
						divisor: 31536000000,
						suffix: '年前'
					},
					{
						unit: 'month',
						divisor: 2592000000,
						suffix: '个月前'
					},
					{
						unit: 'week',
						divisor: 604800000,
						suffix: '周前'
					},
					{
						unit: 'day',
						divisor: 86400000,
						suffix: '天前'
					},
					{
						unit: 'hour',
						divisor: 3600000,
						suffix: '小时前'
					},
					{
						unit: 'minute',
						divisor: 60000,
						suffix: '分钟前'
					},
					{
						unit: 'second',
						divisor: 1000,
						suffix: '秒前'
					}
				]

				const diff = new Date() - new Date(datetime * 1000)

				for (const {
						divisor,
						suffix
					}
					of timeUnits) {
					const value = Math.floor(diff / divisor)
					if (value >= 1) return `${value}${suffix}`
				}

				return '刚刚'
			},
			formatNumber(num) {
				const formats = [{
						threshold: 1e4,
						divisor: 1e4,
						suffix: 'w'
					},
					{
						threshold: 1e3,
						divisor: 1e3,
						suffix: 'k'
					}
				]

				for (const {
						threshold,
						divisor,
						suffix
					}
					of formats) {
					if (num >= threshold) {
						return (num / divisor).toFixed(1) + suffix
					}
				}

				return num
			},
			toInfo(data) {
				var that = this;
				if (data.type == 'post') {
					uni.navigateTo({
						url: '/pages/contents/info?cid=' + data.cid + "&title=" + data.title
					});
				} else {
					uni.navigateTo({
						url: '/pages/contents/videoInfo?cid=' + data.cid + "&title=" + data.title
					});
				}
			},
			toVideoInfo(data) {
				var that = this;

				uni.navigateTo({
					url: '/pages/contents/videoInfo?cid=' + data.cid + "&title=" + data.title
				});
			},
			goAds(data) {
				var that = this;
				var url = data.url;
				var type = data.urltype;
				// #ifdef APP-PLUS
				if (type == 1) {
					plus.runtime.openURL(url);
				}
				if (type == 0) {
					plus.runtime.openWeb(url);
				}
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
		}
	}
</script>

<style scoped>
	.text-content {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}


	.extra-count {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.47);
		color: white;
		font-size: 20px;
		border-radius: 20rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.grid.grid-square>uni-view {
		border-radius: 20rpx;
		overflow: hidden;
	}

	.text-ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		line-height: 1.5;
		font-size: 28rpx;
		color: #666;
	}
</style>