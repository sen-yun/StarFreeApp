<template>
	<view class="medal-display" v-if="isPluginEnabled && hasMedals">
		<image v-for="medal in wearingMedals" 
			:key="medal.id"
			class="medal-icon" 
			:src="medal.icon_url"
			mode="heightFix"
			:title="medal.name">
		</image>
	</view>
</template>

<script>
	export default {
		name: "medalItem",
		props: {
			uid: {
				type: [Number, String],
				required: false,
				default: ''
			}
		},
		data() {
			return {
				medals: [],
				wearingMedals: [],
				isPluginEnabled: false,
				hasMedals: false
			}
		},
		mounted() {
			const that = this;
			var cachedPlugins = localStorage.getItem('getPlugins');
			if (cachedPlugins) {
				const pluginList = JSON.parse(cachedPlugins);
				// 检查插件是否存在于插件列表中
				that.isPluginEnabled = pluginList.includes('xqy_medal');
			}
			if (that.uid) {
				that.loadUserMedals()
			}
		},
		watch: {
			uid: {
				handler(newVal) {
					if (newVal && this.isPluginEnabled) {
						this.loadUserMedals()
					}
				},
				immediate: true
			}
		},
		methods: {
			async loadUserMedals() {
				try {
					if (!this.isPluginEnabled || !this.uid) return;
					
					const res = await new Promise((resolve, reject) => {
						uni.request({
							url: this.$API.PluginLoad('xqy_medal'),
							data: {
								action: 'getMedals',
								plugin: 'xqy_medal',
								type: 'user',
								uid: this.uid
							},
							method: 'GET',
							success: (res) => resolve(res),
							fail: (err) => reject(err)
						})
					});

					if (res.data.code === 200) {
						this.medals = res.data.data.medals || [];
						this.wearingMedals = this.medals;
						this.hasMedals = this.wearingMedals.length > 0;
						this.$emit('medal-loaded', this.hasMedals ? this.wearingMedals : null);
					}
				} catch (error) {
					console.error('加载用户勋章失败:', error);
					this.hasMedals = false;
					this.$emit('medal-loaded', null);
				}
			}
		}
	}
</script>

<style>
	.medal-display {
		display: inline-flex;
		align-items: center;
		text-align: left;
		gap: 4rpx;
		flex-wrap: nowrap;
		overflow-x: auto;
		margin-left: 8upx;
		padding: 0 2rpx;
		vertical-align: middle;
		max-height: 45rpx;
		height: 42rpx;
	}

	.medal-icon {
		height: 42rpx;
		width: auto;
		min-width: 42rpx;
		max-width: 120rpx;
		flex-shrink: 0;
		object-fit: contain;
		margin-left: 4rpx;
		vertical-align: middle;
		transform: translateY(-1rpx);
		display: inline-block;
	}
</style>