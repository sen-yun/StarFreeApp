<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					发布评论
				</view>
				<!--  #ifdef H5 || APP-PLUS -->
				<view class="action">
					<text class="padding-lr-sm padding-tb-xs round text-shojo" style="background-color: #cbffea;" @tap="commentsadd()">发布</text>
				</view>
				<!--  #endif -->
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		
		<form>
			<view class="cu-form-group margin-top">
				<view class="title"  v-if="isreply>0">回复：</view>
				<view class="title"  v-else>帖子：</view>
				<input name="input" :value="title" disabled=""></input>
			</view>
			<view class="cu-form-group">
				<textarea maxlength="-1" v-model="text" placeholder="输入评论内容......"></textarea>
			</view>
			<!--  #ifdef H5 || APP-PLUS -->
			<view class="comments-owo">
				<text class="cuIcon-emoji" :style="{'color': isOwO ? '#3cc9a4' : ''}" @tap="OwO"></text>
				<!--表情-->
				<view class="owo" v-if="isOwO">
					<scroll-view class="owo-list" scroll-y>
						<view class="owo-main">
							<view class="owo-lit-box" v-for="(item,index)  in owoList" @tap="setOwO(item)" :key="index">
								<image :src="'/'+item.icon" mode="aspectFill"></image>
							</view>
						</view>
						
					</scroll-view>
					<view class="owo-type">
						<view class="owo-box" @tap="toOwO('paopao')" :class="OwOtype=='paopao'?'cur':''">
							泡泡
						</view>
						<view class="owo-box" @tap="toOwO('alu')" :class="OwOtype=='alu'?'cur':''">
							阿鲁
						</view>
						<view class="owo-box" @tap="toOwO('quyinniang')" :class="OwOtype=='quyinniang'?'cur':''">
							音娘
						</view>
					</view>
				</view>
			</view>
			<!--  #endif -->
			<!--  #ifdef MP -->
			<view class="all-btn">
				<view class="user-btn flex flex-direction">
					<button class="cu-btn bg-cyan margin-tb-sm lg" @tap="commentsadd">发布评论</button>
					
				</view>
			</view>
			<!--  #endif -->
			
		</form>
	</view>
</template>

<script>
	import mpHtml from '@/components/mp-html/mp-html'
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	
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
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
				AppStyle:this.$store.state.AppStyle,
				
				
				title:"",
				coid:0,
				isreply:0,
				cid:0,
				text:"",
				
				userinfo:{},
				token:"",
				
				isOwO:false,
				owo:owo,
				owoList:[],
				OwOtype:"paopao",
				
			}
		},
		onPullDownRefresh(){
			var that = this;
			
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			//获取用户信息
			if(localStorage.getItem('userinfo')){
				that.userinfo = JSON.parse(localStorage.getItem('userinfo'));
			}
			if(localStorage.getItem('token')){
				that.token = localStorage.getItem('token');
			}
			
		},
		onLoad(res) {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			that.title=res.title;
			that.coid=res.coid;
			that.isreply=res.isreply;
			that.cid=res.cid;
			// #ifdef APP-PLUS || H5
			that.owoList = that.owo.data.paopao.container;
			// #endif
		},
		methods: {
			PickerChange(e) {
				this.index = e.detail.value
			},
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			commentsadd(){
				var that = this;
				if(that.token==""){
					uni.showToast({
					    title:"请先登录",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					var timer = setTimeout(function() {
						uni.navigateTo({
						    url: '/pages/user/login'
						});
						clearTimeout('timer')
					}, 1000)
					return false
				}
				if (that.text == "") {
					uni.showToast({
					    title:"请输入评论内容",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				 if (that.text.length < 4) { 
				        uni.showToast({
				          title: "评论不能少于4个字",
				          icon: 'none',
				          duration: 1000,
				          position: 'bottom',
				        });
				        return false;
				      }
				var coid = that.coid;
				if(that.isreply==0){
					coid = 0;
				}
				
				var data = {
					"cid":that.cid,
					//"ownerId":that.userinfo.uid,
					"parent":coid,
					
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.setComments(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token":that.token,
						"text":that.text
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title:res.data.msg,
						    icon:'none'
						});
						if(res.data.code==1){
							if (localStorage.getItem('userinfo')) {
							  var userInfo = JSON.parse(localStorage.getItem('userinfo'));
							  that.username = userInfo.name;
							
									
								}
							var timer = setTimeout(function() {
								that.back();
							}, 1000)
							
						}
					},
					fail: function(res) {
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
						uni.stopPullDownRefresh()
					}
				})
			},
			
			toOwO(text){
				var that = this;
				that.OwOtype = text;
				if(text=="paopao"){
					that.owoList = that.owo.data.paopao.container;
				}
				if(text=="adai"){
					that.owoList = that.owo.data.adai.container;
				}
				if(text=="alu"){
					that.owoList = that.owo.data.alu.container;
				}
				if(text=="quyinniang"){
					that.owoList = that.owo.data.quyinniang.container;
				}
			},
			setOwO(data){
				var that = this;
				var text = data.data;
				that.text+=text;
			},
			OwO(){
				var that = this;
				that.isOwO = !that.isOwO;
			}
		}
	}
</script>

<style>
</style>
