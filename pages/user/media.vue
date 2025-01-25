<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					联系我们
				</view>
				<view class="action">
				</view>
			</view>
		</view>
		<view :style="[{padding:CustomBar + 13 + 'px 10px 0px 10px'}]"></view>
		<view class="cu-list menu">
			<view class="cu-item" @tap="toGithub">
					<view class="content">
						<text class="cuIcon-friendfill  text-red"></text>
						<text>官方客服</text>
					</view>
					<view class="action">
			<text class="cuIcon-right"></text>
					</view>
				</view>
			
				<view class="cu-item" @tap="toGroup">
					<view class="content">
						<text class="cuIcon-friendfill  text-blue"></text>
						<text>官方交流群</text>
					</view>
					<view class="action">
						<text class="cuIcon-right"></text>
					</view>
				</view>
				<view class="cu-item" @tap="toWeb">
						<view class="content">
							<text class="cuIcon-circlefill text-brown"></text>
							<text>联系审核员</text>
						</view>
						<view class="action">
				<text class="cuIcon-right"></text>
						</view>
					</view>
			
		</view>
		
	</view>
</template>
<script>
	import waves from '@/components/xxley-waves/waves.vue';
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	var API = require('../../utils/api')
	var Net = require('../../utils/net')
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
				AppStyle:this.$store.state.AppStyle,
				data:"",
				shenhe:"",
				kefu:"",
				qqqun:""
			}
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			that.getset();
		},
		methods:{
			
					back(){
						uni.navigateBack({
							delta: 1
						});
					},
					getset() {
						var that = this;
							uni.request({
								url:that.$API.SMset(),
								method:'GET',
								dataType:"json",
								success(res) {
									that.shenhe = res.data.shenhe;
									that.kefu = res.data.kefu;
									that.qqqun = res.data.qqqun;
								},
								fail(error) {
								console.log(error);
								}
							})
						},
					toGroup(){
						var that = this;
						var url = that.qqqun;
						// #ifdef APP-PLUS
						plus.runtime.openURL(url) 
						// #endif
						// #ifdef H5
				window.open(url)
				// #endif
					},
					toWeb(){
						var that = this;
						var url = that.shenhe;
						// #ifdef APP-PLUS
						plus.runtime.openURL(url) 
						// #endif
						// #ifdef H5
					window.open(url)
					// #endif
						},
					toGithub(){
						var that = this;
						var url = that.kefu;
						// #ifdef APP-PLUS
						plus.runtime.openURL(url) 
						// #endif
						// #ifdef H5
						window.open(url)
						// #endif
					}
				},
			}
</script>

<style>
</style>
