<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<!--  #ifdef H5 || APP-PLUS -->
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				
				<!--  #endif -->
				<!--  #ifdef MP -->
				<view class="action" @tap="backHome">
					<text class="cuIcon-home"></text>
				</view>
				<!--  #endif -->
				<view class="content text-bold flex align-center justify-center" :style="[{top:StatusBar + 'px'}]">
					<view style="opacity:1">
					<text>帖子详情</text>
					<!-- <text class="text-gray" v-if="category.length==0">暂无分类</text> -->
					</view>
				</view>
				<view class="action info-btn" v-if="group=='administrator'||group=='editor'||authorId==loginUid">
					<text class="cuIcon-more" @tap="showModal" data-target="bottomModal"></text>
				</view>
			</view>
			<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''" @tap="hideModal">
				<view class="cu-dialog" style="border-radius: 40upx 40upx 0upx 0upx;">
					<view class="padding-xl bg-white">
						<view class="padding-sm	">
						</view>
						<block v-if="group=='administrator'||authorId==loginUid">
							<view class="padding-sm">
								<text class="cuIcon-delete" @tap="toDeletePost(cid)">删除</text>
							</view>
						</block>
						<block v-if="group=='administrator'||group=='editor'||authorId==loginUid">
							<view class="padding-sm">
								<text class="cuIcon-edit" @tap="toEdit(cid)">编辑</text>
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="info margin-sm" style="margin-top: 20upx;border-radius: 20upx;">
			<view class="info-title flex align-center" style="border-radius: 20upx 20upx 0upx 0upx;">
				<!-- <view class="margin-right-xs text-shojo"  style="border-radius: 40upx;background-color: #cbffea;">
				<text v-if="category.length>0"
					@tap="toCategoryContents(category)" style="font-size: initial;" class="padding-lr-lg padding-tb-xs">{{category[0].name}}</text>
				<text class="text-gray" v-if="category.length==0">暂无分类</text>
				</view> -->
				{{replaceSpecialChar(title)}}
			</view>
			
			
			<!-- <view class="info-tyle">
				
				<text class="info-date" v-if="created!=''">{{formatDate(created)}}
			</view> -->
			<view class="info-author">
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round cumd " :style="userInfo.style" @tap="toUserInfo(userInfo)"></view>
						<view class="content">
							<view class="text-black">
								<block v-if="userInfo.isvip>0">
									<view class="text-shojo2">
										<block v-if="userInfo.screenName">
											{{userInfo.screenName}}
										</block>
										<block v-else>
											{{userInfo.name}}
										</block>
									</view>
								</block>
								<block v-else>
									<block v-if="userInfo.screenName">
										{{userInfo.screenName}}
									</block>
									<block v-else>
										{{userInfo.name}}
									</block>
								</block>

								<!--  #ifdef H5 || APP-PLUS -->
								<!-- <text class="userlv" :style="getUserLvStyle(userInfo.lv)">{{getUserLv(userInfo.lv)}}</text> -->
								<!--  #endif -->
								
								<text class="userlv" v-if="userInfo.isvip>0" style="background: linear-gradient(to bottom right, #f2ad5c, #e6216d,#901ccb);color:white;padding: 3px 5px;border-radius: 10px;">VIP</text>
								<text class="userlv customize"
									v-if="userInfo.customize&&userInfo.customize!=''">{{userInfo.customize}}</text>
								<!--  #ifdef H5 || APP-PLUS -->
								<!-- <block v-if="userInfo.isvip==1">
									<block v-if="userInfo.vip==1">
										<text class="isVIP bg-gradual-red">VIP</text>
									</block>
									<block v-else>
										<text class="isVIP bg-yellow">VIP</text>
									</block>
								</block> -->
								<!--  #endif -->
							</view>
							<view class="text-gray text-sm flex">
								<view class="text-cut">
									{{subText(userInfo.introduce,15)}}
								</view>
							</view>	
						</view>
						<view class="padding-right-sm">
							<block v-if="loginUid!=authorId">
								<text class="text-gray padding-lr-lg padding-tb-xs round" style="background-color: #9999992e;" @tap="follow(0)"
									v-if="isFollow==1">已关注</text>
								<text class="text-shojo padding-lr-lg padding-tb-xs round" style="background-color: #cbffea;" @tap="follow(1)"
									v-else>关注</text>
							</block>
						</view>
					</view>
				</view>
			</view>
			
			<view class="info-content" style="color:#666 !important;border-radius: 0 0 20upx 20upx;">
				
				<view>
					
					
				  
					  
				    <view v-if="html">
						<view v-if="token">
						
						<view v-if="category[0].slug === 'lv3'">
						    <view v-if="level >= 3">
						      <mp-html :content="html" :selectable="true" :show-img-menu="true" :scroll-table="true" :markdown="true" :lazy-load="false" />
						    </view>
						    <view v-else>
						      <view class="no-data">
						        <text class="cuIcon-text"></text>
						        该分类需3级才能查看哦~
						      </view>
						    </view>
						  </view>
						  <view v-else-if="category[0].slug === 'vip'">
						    <view v-if="myvip > 0">
						      <mp-html :content="html" :selectable="true" :show-img-menu="true" :scroll-table="true" :markdown="true" :lazy-load="false" />
						    </view>
						    <view v-else>
						      <view class="no-data">
						        <text class="cuIcon-text"></text>
						        未开通会员，无法查看会员专区！
						        <view class="text-center margin-top-sm">
						          <text class="cu-btn line-blue margin-left-sm radius" @tap="gobuyvip()">开通会员</text>
						        </view>
						      </view>
						    </view>
						  </view>
						  <view v-else>
						    <mp-html :content="html" :selectable="true" :show-img-menu="true" :scroll-table="true" :markdown="true" :lazy-load="false" />
						  </view>
							</view>
							<view v-else>
									<view class="no-data" v-if="lvof==1">
									  <text class="cuIcon-community"></text>
									  请先登录哦！
									  <view class="text-center margin-top-sm">
									    <text class="cu-btn bg-shojo radius" style="border-radius: 50px;" @tap="goLogin()">登录</text>
									    <text class="cu-btn bg-shojo margin-left-sm" style="border-radius: 50px;" @tap="goRegister()">注册</text>
									  </view>
									</view>
								<view v-if="lvof==0">
									<mp-html :content="html" :selectable="true" :show-img-menu="true" :scroll-table="true" :markdown="true" :lazy-load="false" />
								</view>
							</view>
					</view>
					
				<view v-else>
				      正在加载...
				    </view>
				  
				</view>
				
				<view class="shop-value" v-if="shopValue!=''">
					<view class="shop-value-title">
						付费内容
					</view>
					<mp-html :content="shopValue" :selectable="true" :show-img-menu="true"  :scroll-table="true" :markdown="true"/>
				</view>
				<view class="content-shop" v-if="shopValue==''">
						<view class="cu-card article no-card" v-for="(item,index) in shopList" :key="index">
							<block v-if="item.type==1">
								<view class="shop-tool text-center">
									<view class="shop-name">
										实体商品
									</view>
									<image :src="item.imgurl"
									 mode="aspectFill"></image>
									<view class="text-content">{{item.title}}</view>
									<view class="tool-price" v-if="isBuy==0">
										<text class="text-red text-bold">{{item.price}} {{currencyName}}</text><text class="margin-left-sm text-sm">VIP只需</text><text class="text-yellow text-bold">{{parseInt(item.price * item.vipDiscount)}} {{currencyName}}</text>
									</view>
									<view class="tool-price">
										<text class="cu-btn bg-blue" @tap="shopBuy(item.id)">立即兑换</text>
										<text class="cu-btn text-red" @tap="shopInfo(item)">商品详情</text>
									</view>
								</view>
							</block>
							<!--源码-->
							<block v-if="item.type==2">
								<view class="shop-tool text-center">
									<view class="shop-name">
										其他
									</view>
									<image :src="item.imgurl"
									 mode="aspectFill"></image>
									<view class="text-content">{{item.title}}</view>
									<view class="tool-price" v-if="isBuy==0">
										<text class="text-red text-bold">{{item.price}} {{currencyName}}</text><text class="margin-left-sm text-sm">VIP只需</text><text class="text-yellow text-bold">{{parseInt(item.price * item.vipDiscount)}} {{currencyName}}</text>
									</view>
									<view class="tool-price" v-if="isBuy==1">
										<text class="cu-btn bg-blue" @tap="toShopValue(item.id,item.type)">查看收费内容</text>
										<text class="cu-btn text-red" @tap="shopInfo(item)">商品详情</text>
									</view>
									<view class="tool-price" v-else>
										<text class="cu-btn bg-blue" @tap="shopBuy(item.id)">立即兑换</text>
										<text class="cu-btn text-red" @tap="shopInfo(item)">商品详情</text>
									</view>
								</view>
							</block>
							<!--工具-->
							<block v-if="item.type==3">
								<view class="shop-tool text-center">
									<view class="shop-name">
										软件资源
									</view>
									
									<image :src="item.imgurl"
									 mode="aspectFill"></image>
									<view class="text-content">{{item.title}}</view>
									<view class="tool-price" v-if="isBuy==0">
										<text class="text-red text-bold">{{item.price}} {{currencyName}}</text><text class="margin-left-sm text-sm">VIP只需</text><text class="text-yellow text-bold">{{parseInt(item.price * item.vipDiscount)}} {{currencyName}}</text>
									</view>
									<view class="tool-price" v-if="isBuy==1">
										<text class="cu-btn bg-blue" @tap="toShopValue(item.id,item.type)">查看收费内容</text>
										<text class="cu-btn text-red" @tap="shopInfo(item)">商品详情</text>
									</view>
									<view class="tool-price" v-else>
										<text class="cu-btn bg-blue" @tap="shopBuy(item.id)">立即兑换</text>
										<text class="cu-btn text-red" @tap="shopInfo(item)">商品详情</text>
									</view>
								</view>
							</block>
							<!--付费阅读-->
							<block v-if="item.type==4">
								<view class="shop-tool text-center">
									<view class="shop-name">
										技术教程
									</view>
									<image :src="item.imgurl"
									 mode="aspectFill"></image>
									<view class="text-content">{{item.title}}</view>
									<view class="tool-price" v-if="isBuy==0">
										<text class="text-red text-bold">{{item.price}} {{currencyName}}</text><text class="margin-left-sm text-sm">VIP只需</text><text class="text-yellow text-bold">{{parseInt(item.price * item.vipDiscount)}} {{currencyName}}</text>
									</view>
									<view class="tool-price" v-if="isBuy==1">
										<text class="cu-btn bg-blue" @tap="toShopValue(item.id,item.type)">查看收费内容</text>
									</view>
									<view class="tool-price" v-else>
										<text class="cu-btn bg-blue" @tap="shopBuy(item.id)">立即兑换</text>
									</view>
								</view>
							</block>
					</view>
				</view>
				<br>
				<!--<view class="bg-line-blue text-center">-->
				<view class="content text-bold flex align-center justify-center" :style="[{top:StatusBar + 'px'}]">
					
					<view v-if="token">
							<view v-if="category[0].slug === 'lv3'">
							    <view v-if="level >= 3">
							      <view class="text-shojo round"  style="background-color: #cbffea;">
							      <text @tap="toCategoryContents(category)" style="font-size: initial;" class="padding-lr-lg padding-tb-xs">{{category[0].name}}圈</text>
							    </view>
							  </view>
							  <view v-else>
							  </view>
					  </view>
					  <view v-else>
					      <view class="text-shojo round"  style="background-color: #cbffea;">
					      <text @tap="toCategoryContents(category)" style="font-size: initial;" class="padding-lr-lg padding-tb-xs">{{category[0].name}}圈</text>
					  </view>
					   </view>
					  
					
					<!--<text class="text-gray" v-if="category.length==0">暂无分类</text>-->
					</view>
					<view v-else>
					   
					</view>
				</view>
				<view class="tags text-center" v-if="tagList.length>0">

					<text class="text-shojo margin-xs" v-for="(item,index) in tagList"
						@tap='toTagsContents("#"+item.name+"#",item.mid)' :key="index">
						#{{item.name}}#
					</text>

				<!--
				</view>-->
				</view>
				
				<view v-if="dsof==1" class="text-center margin-top-lg">
					<view class="cu-avatar lg padding-bottom-sm" style="background-color: rgb(0, 0, 0,0);" @tap="showModal" data-target="ChooseModal" >
						
						<image src="../../static/page/money2.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="ads-banner" v-if="bannerAdsInfo!=null">
				<image :src="bannerAdsInfo.img" mode="widthFix" @tap="goAds(bannerAdsInfo)"></image>
			</view>


			<view class="data-box" v-if="isComment==1" style="border-radius: 20upx;">
				<view class="cu-bar bg-white" style="border-radius: 20upx;padding: 10px 0px 0px 0px;">
					<view class="action data-box-title" >
						<text class="cuIcon-titles text-rule"></text>
						<text v-if="commentsNum>0">评论区 ( {{commentsNum}} ) </text>
						<text v-else>评论区</text>
					</view>
					<!-- <view class="action more" @tap="commentsAdd(title,0,0)">
						<text class="cuIcon-add"></text><text>发布评论</text>
					</view> -->
				</view>
				<view class="no-data" v-if="commentsList.length==0">
					暂时没有评论
				</view>
				<view class="cu-card dynamic no-card info-comment">
					<block v-for="(item,index) in commentsList" :key="index" v-if="commentsList.length>0">
						<commentItem :item="item" :isContent="true" :owoList="owoList"></commentItem>
					</block>
				</view>

				
			</view>
			<view class="load-more margin-top-sm" @tap="loadMore" v-if="commentsList.length>0">
				<text>{{moreText}}</text>
			</view>
			<view style="height: 100upx"></view>
		</view>
		<!--  #ifdef H5 || APP-PLUS -->
		<!--打赏选择-->
		<view class="cu-modal bottom-modal" :class="modalName=='ChooseModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" style="border-radius: 40upx 40upx 0upx 0upx;" @tap.stop="">
				<view class="cu-bar bg-white">
					<view class="action text-black" @tap="hideModal">取消</view>
					<view class="action text-shojo" @tap="toReward">确定</view>
				</view>
				<view class="grid col-2 padding-sm bg-white">
					<view v-for="(item,index) in checkbox" class="padding-xs" :key="index">
						<button class="cu-btn orange lg block" :class="item.checked?'bg-orange':'line-orange'"
							@tap="ChooseCheckbox(index)"> {{item.num}}{{currencyName}}
							<view class="sm" :class="item.checked?'':''"
								v-if="item.hot"><text class="cuIcon-hot"></text></view>
						</button>
					</view>
				</view>
			</view>
		</view>
		<!--  #endif -->
		<!--加载遮罩-->
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../static/loading.gif"></image>
			</view>
		</view>
		<!--加载遮罩结束-->
		<!--  #ifdef H5 || APP-PLUS -->
		<view class="info-operate-bg" :class="isShare?'show':''" @tap="isShare=false"></view>
		<view class="info-operate" :class="isShare?'show':''">
			<view class="info-operate-main grid col-1">
				<view class="index-sort-box">
					<view class="index-sort-main" @tap="ToShare">
						<view class="index-sort-i" style="background: rgba(30, 134, 231, 0.2);">
							<text class="cuIcon-share" style="color:  #1e86e7;"></text>
						</view>
						<view class="index-sort-text">
							分享到其他应用
						</view>
					</view>
				</view>
			</view>

		</view>
		<view class="info-footer grid col-2">
			<view class="info-footer-input" style="border-radius: 50%;">
				<view class="info-input-box" @tap="commentsAdd(title,0,0)" style="border-radius: 40upx;">
					<text class="cuIcon-write"></text>发条友善的评论吧...
				</view>
			</view>
			<view class="flex align-center tn-flex-direction-row-reverse">
				<block v-if="shareof==1">
				<view class="margin-right-sm" style="width: 65upx;height: 70upx;" @tap="isShare=!isShare"
					v-if="isShare==0">
					<image src="../../static/page/icon_share_un.png" mode="widthFix"></image>
				</view>
				<view class="margin-right-sm" style="width: 65upx;height: 70upx;" @tap="isShare=!isShare" v-else>
					<image src="../../static/page/icon_share_pink.png" mode="widthFix"></image>
				</view>
				</block>
				
				<view class="margin-right-lg">
				{{likes}}
				</view>
				<view style="width: 50upx;height: 50upx;" @tap="toLikes" v-if="isLikes==0">
					
					<image src="../../static/page/like_unpressed.png" mode="widthFix"></image>
				</view>
				<view style="width: 50upx;height: 50upx;" @tap="toLikes" v-else>
					
					<image src="../../static/page/like_pressed.png" mode="widthFix"></image>
				</view>
				<view class="margin-right-lg" v-if="commentsNum>0">
				{{commentsNum}}
				</view>
				<view :class="{'margin-right-lg': !(commentsNum > 0)}" @tap="commentsAdd(title,0,0)" style="width: 47upx;height: 50upx;">
					<image src="../../static/page/icon_message_pink.png" mode="widthFix"></image>
				</view>
				<block v-if="dsof==1">
				<view  class="margin-right-lg" style="width: 50upx;height: 50upx;"  @tap="showModal" data-target="ChooseModal">
					<image src="../../static/page/money2.png" mode="widthFix"></image>
				</view>
				</block>
			</view>
		</view>
		
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../static/loading.gif"></image>
			</view>
		</view>
		<!--  #endif -->
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
	var API = require('../../utils/api')
	var Net = require('../../utils/net')
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar: this.StatusBar + this.CustomBar,
				AppStyle: this.$store.state.AppStyle,
				cid: 0,
				uid: 0,
				lvof: 1,
				title: "",
				html: "",
				jingyan: 0,
				level: 0,
				 needRefresh: false,
				commentsNum: 0,
				category: ['未知'],
				created: '',
				markdownData: {},
				userInfo: {},
				slug: "",
				tagList: [],
				commentsList: [],
				name: 1,
				moreText: "加载更多",
				page: 1,
				myvip: 0,

				isLoad: 0,

				isLoading: 0,

				isMark: 0,
				logid: -1,

				token: "",

				likes: 0,
				isLikes: 0,

				type: "post",

				shopList: [],
				shopID: -1,
				owo: owo,
				owoList: [],

				isCommnet: 0,

				modalName: null,
				checkbox: [{
					value: 0,
					name: '3 Ero',
					num: 3,
					checked: false,
					hot: false,
				}, {
					value: 1,
					name: '5 Ero',
					num: 5,
					checked: true,
					hot: true,
				}, {
					value: 2,
					name: '10 Ero',
					num: 10,
					checked: false,
					hot: false,
				}, {
					value: 3,
					name: '20 Ero',
					num: 20,
					checked: false,
					hot: false,
				}],
				ads: "",
				experience: 0,
				userlvStyle: "",
				vipDiscount: 0,
				vipPrice: 0,
				scale: 0,
				shareof: 0,
				isBuy: 0,
				shopValue: "",

				bannerAds: [],
				bannerAdsInfo: null,

				isComment: 0,
				images: [],

				group: "",
				loginUid: 0,
				dsof: 1,
				authorId: 0,
				isFollow: 0,
				dsstyle: 2,
				currencyName: "",
				opacityNum:1,
				display:0,
				isShare: false

			}
		},
		components: {
			mpHtml,

		},
		onReachBottom() {
			//触底后执行的方法，比如无限加载之类的
			var that = this;
			that.loadMore();
		},
		// #ifdef MP
		onShareAppMessage(res) {
			var that = this;
			if (res.from === 'button') {
				// 来自页面内分享按钮
			}
			if (res.from === 'menu') {
				// 来自页面内分享按钮
			}
			var data = {
				title: that.title,
				path: '/page/contents/info?cid=' + that.cid
			}
			if (that.images.lenght > 0) {
				data.imageUrl = that.images[0];
			}

		},
		onShareTimeline() {
			var that = this;
			var data = {
				title: that.title,
				path: '/page/contents/info?cid=' + that.cid
			}
			if (that.images.lenght > 0) {
				data.imageUrl = that.images[0];
			}

			return data;
		},
		// #endif
		onShow() {
			var that = this;
			that.currencyName = that.$API.getCurrencyName();
			if (localStorage.getItem('userinfo')) {

				var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.group = userInfo.group;
				that.loginUid = userInfo.uid;
				
			}
			
			// #ifdef MP-BAIDU
			//预留百度小程序TDK

			// #endif

			that.getAdsCache();
			// #ifdef H5 || APP-PLUS
			that.isComment = 1;
			// #endif

			// #ifdef MP
			that.isComment = that.$API.GetIsComment();
			// #endif

			// #ifdef APP-PLUS


			plus.navigator.setStatusBarStyle("dark")
			// #endif
			that.isLoad = 0;
			that.page = 1;

			if (that.cid != 0) {

				that.getIsCommnet();

				that.getInfo(that.cid);
				that.getCommentsList(false, that.cid);

			}

			if (localStorage.getItem('token')) {
				that.token = localStorage.getItem('token');
				that.getMyInfo();
			}else{
				that.experience = 0
			}
			that.toMark();
			//that.allCache();
			that.getVipInfo();

		},
		onPullDownRefresh() {
			var that = this;

			var timer = setTimeout(function() {
				that.getInfo(that.cid);
				// #ifdef H5 || APP-PLUS
				that.getCommentsList(false, that.cid);
				// #endif
			}, 1000)
		},
		onLoad(res) {
			var that = this;

			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			that.cid = res.cid;
			that.title = res.title;
			
			// #ifdef APP-PLUS || H5
			var owo = that.owo.data;
			var owoList = [];
			for (var i in owo) {
				owoList = owoList.concat(owo[i].container);
			}
			that.owoList = owoList;
			// #endif

			if (localStorage.getItem('likeDate_' + that.cid)) {
				var data = localStorage.getItem('likeDate_' + that.cid);
				var cur_date = new Date().getTime();
				var c = Number(cur_date) - Number(data);
				if (c >= 86400000) {
					that.isLikes = 0;
					localStorage.removeItem('likeDate_' + that.cid)
				} else {
					that.isLikes = 1;
				}
			}
			that.allCache();
			that.getInfo(that.cid);

			// #ifdef H5 || APP-PLUS
			that.getShopList();
			// #endif
			that.getCommentsList(false, that.cid);



			var ctx = this.$refs.article;
		},
		
		created() {
		  var that = this;
		  uni.$on('refreshPage', () => {
		    this.needRefresh = true; // 设置需要更新页面数据的标志
		    this.percent();
		  });
		  this.percent();
		},
		mounted() {
			var that = this;
		 this.getset();
		 
		 var token = "";
		 if (localStorage.getItem('userinfo')) {
		 	var userInfo = JSON.parse(localStorage.getItem('userinfo'));
		 	token = userInfo.token;
		 } else {
		 	return false
		 }
		},
		methods: {
			getset() {
			  var that = this;
			      uni.request({
			        url:that.$API.SMset(),
			        method:'GET',
			        dataType:"json",
			        success(res) {
						that.dsstyle = res.data.dsstyle;
					  that.shareof = res.data.shareof;
					  that.dsof = res.data.dsof;
					  that.lvof = res.data.lvof;
			        },
			        fail(error) {
			          console.log(error);
			        }
			      })
			},
			getAdsCache() {
				var that = this;
				if (localStorage.getItem('bannerAds')) {
					that.bannerAds = JSON.parse(localStorage.getItem('bannerAds'));

					var num = that.bannerAds.length;
					if (num > 0) {
						var rand = Math.floor(Math.random() * num);
						that.bannerAdsInfo = that.bannerAds[rand];
					}
				}
			},
			backHome() {
				uni.switchTab({
					url: '/pages/home/home'
				});
			},
			back() {

				const pages = getCurrentPages()
				if (pages.length === 1) {
					uni.switchTab({
						url: '/pages/home/home'
					})
				} else {
					uni.navigateBack({
						delta: 1
					});
				}
			},
			
			getUserLv(i) {
				var that = this;
				if (!i) {
					var i = 0;
				}
				var rankList = that.$API.GetRankList();
				return rankList[i];
			},
			getUserLvStyle(i) {
				var that = this;
				if (!i) {
					var i = 0;
				}
				var rankStyle = that.$API.GetRankStyle();
				var userlvStyle = "color:#fff;background-color: " + rankStyle[i];
				return userlvStyle;
			},
			replaceAll(string, search, replace) {
				return string.split(search).join(replace);
			},
			toUserInfo(data) {
				var that = this;
				var name = data.name;
				var title = data.name + "的信息";
				if (data.screenName) {
					title = data.screenName + " 的信息";
					name = data.screenName
				}
				var id = data.uid;
				var type = "user";
				uni.navigateTo({
					url: '/pages/contents/userinfo?title=' + title + "&name=" + name + "&uid=" + id + "&avatar=" +
						encodeURIComponent(data.avatar)
				});
			},
			toTagsContents(title, id) {
				var that = this;
				var type = "meta";
				uni.navigateTo({
					url: '/pages/contents/contentlist?title=' + title + "&type=" + type + "&id=" + id
				});
			},
			toCategoryContents(data) {
				var that = this;
				var title = data[0].name;
				var id = data[0].mid;
				var type = "meta";
				uni.navigateTo({
					url: '/pages/contents/contentlist?title=' + title + "&type=" + type + "&id=" + id
				});
			},
			toEdit(cid) {
				var that = this;

				uni.navigateTo({
					url: '/pages/user/post?type=edit' + '&cid=' + cid
				});
			},
			loadMore() {
				var that = this;
				that.moreText = "加载中...";
				if (that.isLoad == 0) {
					that.getCommentsList(true, that.cid);
				}

			},
			getVipInfo() {
				var that = this;
				that.$Net.request({
					url: that.$API.getVipInfo(),
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							that.vipDiscount = res.data.data.vipDiscount;
							that.vipPrice = res.data.data.vipPrice;
							that.scale = res.data.data.scale;
						}
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			allCache(){
				var that = this;
				var cid = that.cid;
				if(localStorage.getItem('postInfo_'+cid)){
					var postInfo = JSON.parse(localStorage.getItem('postInfo_'+cid));
					that.category = postInfo.category;
					that.created = postInfo.created;
					that.commentsNum = postInfo.commentsNum;
					that.images = postInfo.images;
					that.html=that.markHtml(postInfo.text);
					that.tagList=postInfo.tag;
					that.slug = postInfo.slug;
					that.authorId = postInfo.authorId
					
					that.getIsFollow(postInfo.authorId);
				}
				if(localStorage.getItem('commentsList_'+cid)){
					that.commentsList = JSON.parse(localStorage.getItem('commentsList_'+cid));
				}
				 
			},
			markHtml(text){
				var that = this;
				//下面奇怪的代码是为了解决可执行代码区域问题
				text = that.replaceAll(text,"@!!!","@@@@");
				
				text = that.replaceAll(text,"!!!","");
				text = that.replaceAll(text,"@@@@","@!!!");
			
				//结束
				text = that.replaceAll(text,"[audio","<audio");
				text = that.replaceAll(text,"width='100%']","width='100%' audio>");
				text = that.replaceAll(text,"[/audio]","</audio>");
				if(that.isCommnet==1){
					text = that.replaceAll(text,"[hide]","<div style='width:100%;padding:15px 15px;color:#666666;border:solid 1px #3cc9a4;box-sizing: border-box;border-radius: 20px;word-break:break-all;'>");
					text = that.replaceAll(text,"[/hide]","</div>");
					text = that.replaceAll(text,"{hide}","<div style='width:100%;padding:15px 15px;color:#666666;border:solid 1px #3cc9a4;box-sizing: border-box;border-radius: 20px;word-break:break-all;'>")
					text = that.replaceAll(text,"{/hide}","</div>")
				}else{
					text = text.replace(/\[hide(([\s\S])*?)\[\/hide\]/g,"<div style='width:100%;padding:15px 15px;background:#cbffea;color:#3cc9a4;border:solid 1px #3cc9a4;box-sizing: border-box;border-radius: 20px;text-align: center;'>该内容评论后显示！</div>");
					text = text.replace(/{hide(([\s\S])*?){\/hide}/g,"<div style='width:100%;padding:15px 15px;background:#cbffea;color:#3cc9a4;border:solid 1px #3cc9a4;box-sizing: border-box;border-radius: 20px;text-align: center;'>该内容评论后显示！</div>");
				}
				if(that.myvip==1){
					text = that.replaceAll(text,"[vip]","<div style='width:100%;padding:15px 15px;color:#666666;border:solid 1px #fb7299;box-sizing: border-box;border-radius: 20px;word-break:break-all;'>");
					text = that.replaceAll(text,"[/vip]","</div>");
					text = that.replaceAll(text,"{vip}","<div style='width:100%;padding:15px 15px;color:#666666;border:solid 1px #fb7299;box-sizing: border-box;border-radius: 20px;word-break:break-all;'>")
					text = that.replaceAll(text,"{/vip}","</div>")
				}else{
					text = text.replace(/\[vip(([\s\S])*?)\[\/vip\]/g,"<div style='width:100%;padding:15px 15px;background:#ffecee;color:#fb7299;border:solid 1px #fb7299;box-sizing: border-box;border-radius: 20px;text-align: center;'>该内容仅会员可查看！</div>");
					text = text.replace(/{vip(([\s\S])*?){\/vip}/g,"<div style='width:100%;padding:15px 15px;background:#ffecee;color:#fb7299;border:solid 1px #fb7299;box-sizing: border-box;border-radius: 20px;text-align: center;'>该内容仅会员可查看！</div>");
				}
				// #ifdef APP-PLUS || H5
				var owoList=that.owoList;
				for(var i in owoList){
			
					if(that.replaceSpecialChar(text).indexOf(owoList[i].data) != -1){
						text = that.replaceAll(that.replaceSpecialChar(text),owoList[i].data,"<img src='"+owoList[i].icon+"' class='tImg' />")
						
					}
				}
				// #endif
				
				//text = text.replace(/(?<!\r)\n(?!\r)/g, "\n\n");
				//兼容垃圾的Safari浏览器
				text = text.replace(/([^\r])\n([^\r])/g, "$1\n\n$2");
				text = that.replaceAll(text,"||rn||","\n\n");
				return text;
				
			},
			markCommentHtml(text){
				var that = this;
				// #ifdef APP-PLUS || H5
				var owoList=that.owoList;
				for(var i in owoList){
				
					if(that.replaceSpecialChar(text).indexOf(owoList[i].data) != -1){
						text = that.replaceAll(that.replaceSpecialChar(text),owoList[i].data,"<img src='/"+owoList[i].icon+"' class='tImg' />")
						
					}
				}
				// #endif
				return text;
			},
			getInfo(cid) {
				var that = this;
				var data = {
					"key": that.cid,
					"isMd": 0,
				}

				that.$Net.request({
					url: that.$API.getContentsInfo(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						uni.stopPullDownRefresh();
						if (res.data.title) {
							that.title = res.data.title;
							that.category = res.data.category;
							that.created = res.data.created;
							that.commentsNum = res.data.commentsNum;
							that.images = res.data.images;
							var html = that.markHtml(res.data.text);

							that.html = html;
							that.tagList = res.data.tag;
							that.slug = res.data.slug;
							that.type = res.data.type;
							that.likes = res.data.likes;
							that.authorId = res.data.authorId
							that.getUserInfo(res.data.authorId);
							that.getIsFollow(res.data.authorId);
							localStorage.removeItem('postInfo_' + that.cid);
							localStorage.setItem('postInfo_' + that.cid, JSON.stringify(res.data));
							var timer = setTimeout(function() {
								that.allCache();
							}, 200);
							var timer = setTimeout(function() {
								that.isLoading = 1;
								clearTimeout('timer')
							}, 300)

						}
					},
					fail: function(res) {
						uni.stopPullDownRefresh();
					}
				})
			},
			getUserInfo(id) {
				var that = this;
				var data = {
					"key": id,
				}

				that.$Net.request({
					url: that.$API.getUserInfo(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							that.userInfo = res.data.data;
							that.userInfo.style = "background-image:url(" + res.data.data.avatar + ");"
						} else {
							that.userInfo.name = "用户已注销"
						}
					},
					fail: function(res) {}
				});
			},
			getMyInfo() {
				var that = this;
				var data = {
					"token": that.token,
				}

				that.$Net.request({
					url: that.$API.userStatus(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							that.experience = res.data.data.experience;
						} else {
							that.experience = 0
						}
						console.log(that.experience);
					},
					fail: function(res) {}
				});
				that.level = that.$API.getLever(that.experience);
			},
			getCommentsList(isPage, id) {
				var that = this;
				var data = {
					"cid": id,
					"status": "approved"
				}
				var page = that.page;
				if (isPage) {
					page++;
				}
				that.$Net.request({
					url: that.$API.getCommentsList(),
					data: {
						"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit": 4,
						"page": page,
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						uni.stopPullDownRefresh();
						that.isLoad = 0;
						if (res.data.code == 1) {
							var list = res.data.data;
							if (list.length > 0) {
								var commentsList = [];
								for (var i in list) {
									var arr = list[i];
									arr.style = "background-image:url(" + list[i].avatar + ");"
									commentsList.push(arr);
								}
								if (isPage) {
									that.page++;
									that.commentsList = that.commentsList.concat(commentsList);
								} else {
									that.commentsList = commentsList;
								}
								localStorage.setItem('commentsList_' + that.cid, JSON.stringify(that
									.commentsList));

							} else {
								that.moreText = "没有更多评论了";
								if (that.page == 1 && !isPage) {
									localStorage.removeItem('commentsList_' + that.cid);
									that.commentsList = [];
								}

							}

						}

					},
					fail: function(res) {
						uni.stopPullDownRefresh();
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
						that.isLoad = 0;
						var timer = setTimeout(function() {
							that.isLoading = 1;
							clearTimeout('timer')
						}, 300)

						that.moreText = "加载更多";
					}
				})
			},
			commentsAdd(title, coid, reply) {
				var that = this;

				if (!localStorage.getItem('userinfo')) {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					})
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				} else {
					var cid = that.cid;
					uni.navigateTo({
						url: '/pages/contents/commentsadd?cid=' + cid + "&coid=" + coid + "&title=" + title +
							"&isreply=" + reply
					});
				}

			},
			toReward() {
				var that = this;
				var rewardList = that.checkbox;
				var num = 10;
				for (var i in rewardList) {
					if (rewardList[i].checked) {
						num = rewardList[i].num;
					}
				}
				var data = {
					"type": "reward",
					"cid": that.cid,
					"num": num,
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({

					url: that.$API.addLog(),
					data: {
						"params": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token": that.token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.hideModal();
						setTimeout(function() {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if (res.data.code == 1) {
							if (localStorage.getItem('userinfo')) {
							  var userInfo = JSON.parse(localStorage.getItem('userinfo'));
							  that.username = userInfo.name;
								
								}
							
						}

					},
					fail: function(res) {
						that.hideModal();
						setTimeout(function() {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
					}
				})
			},
			
			percent() {
			   var that = this;
			  if (localStorage.getItem('userinfo')) {
			    var userInfo = JSON.parse(localStorage.getItem('userinfo'));
			    that.username = userInfo.name;
			       uni.request({
			         url: that.$API.SMhy(),
			         method: 'GET',
			         data: {
			           username: that.username
			         },
			         dataType: "json",
			         success(res) {
						if (res.data.vip === 0) {
						      that.myvip = 0; 
						    } else if (res.data.vip === 1) {
						      that.myvip = 1; 
						    } else {
						      const expirationTime = new Date(res.data.vip * 1000);
						      const currentTime = new Date(); 
						      if (expirationTime < currentTime) {
						        that.myvip = 0; 
						      } else {
						        that.myvip = 1; 
						      }
						    }
					console.log(res);
			         },
			         fail(error) {
			           console.log(error);
			         }
			       })
				   
			    }
				
			        
			 },
			toLikes() {
				var that = this;
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				} else {
					uni.showToast({
						title: "请先登录",
						icon: 'none',
						duration: 1000,
						position: 'bottom',
					});
					var timer = setTimeout(function() {
						uni.navigateTo({
							url: '../user/login'
						});
						clearTimeout('timer')
					}, 1000)
					return false
				}
				var data = {
					"type": "likes",
					"cid": that.cid,
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({

					url: that.$API.addLog(),
					data: {
						"params": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token": that.token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {

						setTimeout(function() {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})

						if (res.data.code == 1) {
							var timestamp = new Date().getTime();
							that.isLikes = 1;
							localStorage.setItem('likeDate_' + that.cid, timestamp);
							that.likes++;
							//that.getInfo(that.cid);
						}

					},
					fail: function(res) {
						setTimeout(function() {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
					}
				})
			},
			showModal(e) {
				var that = this;
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				} else {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					})
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				that.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			ChooseCheckbox(j) {
				let items = this.checkbox;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					this.checkbox[i].checked = false;
				}
				this.checkbox[j].checked = !this.checkbox[j].checked;
			},
			toMark() { 
				var that = this;
				var data = {
					"type": "mark",
					"cid": that.cid,
				}
				that.$Net.request({

					url: that.$API.addLog(),
					data: {
						"params": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token": that.token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {

					},
					fail: function(res) {
						
					}
				})
			},
			
			formatDate(datetime) {
				var datetime = new Date(parseInt(datetime * 1000));
				// 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
				var year = datetime.getFullYear(),
					month = ("0" + (datetime.getMonth() + 1)).slice(-2),
					date = ("0" + datetime.getDate()).slice(-2),
					hour = ("0" + datetime.getHours()).slice(-2),
					minute = ("0" + datetime.getMinutes()).slice(-2);
				//second = ("0" + date.getSeconds()).slice(-2);
				// 拼接
				var result = year + "-" + month + "-" + date + " " + hour + ":" + minute;
				// 返回
				return result;
			},
			ToCopy(text) {
				var that = this;
				// #ifdef APP-PLUS
				uni.setClipboardData({
					data: text,
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: "复制成功"
						})
					}
				});
				// #endif
				// #ifdef H5 
				let textarea = document.createElement("textarea");
				textarea.value = text;
				textarea.readOnly = "readOnly";
				document.body.appendChild(textarea);
				textarea.select();
				textarea.setSelectionRange(0, text.length);
				uni.showToast({ //提示
					title: "复制成功"
				})
				var result = document.execCommand("copy")
				textarea.remove();

				// #endif
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
			ToShare() {

				var that = this;
				var linkStar = that.$API.GetlinkStar();


				var url = linkStar.replace("{cid}", that.cid);
				if (linkStar.indexOf("{category}") != -1) {
					var category = that.category[0].slug;
					url = url.replace("{category}", category);
				}
				// #ifdef APP-PLUS
				uni.shareWithSystem({
					href: url,
					summary: that.title,
					success() {
						// 分享完成，请注意此时不一定是成功分享

					},
					fail() {
						// 分享失败
					}
				});
				// #endif
				// #ifdef H5
				that.ToCopy(url);
				// #endif
			},
			formatNumber(num) {
				return num >= 1e3 && num < 1e4 ? (num / 1e3).toFixed(1) + 'k' : num >= 1e4 ? (num / 1e4).toFixed(1) + 'w' :
					num
			},
			getShopList() {
				var that = this;
				var uid = 0;
				if (localStorage.getItem('userinfo')) {

					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					uid = userInfo.uid;

				}
				var data = {
					"cid": that.cid,
				}
				that.$Net.request({
					url: that.$API.shopList(),
					data: {
						"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit": 1,
						"page": 1,
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res));
						if (res.data.code == 1) {
							var list = res.data.data;
							that.shopList = list;
							if (list.length > 0) {
								that.shopID = list[0].id;
								that.isBuyShop(that.shopID, list[0].type);
							}

						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})

					}
				})
			},
			getIsCommnet() {
				var that = this;
				// #ifdef MP
				that.isCommnet = 1;
				that.getInfo(that.cid);
				return false;
				// #endif
				var token = "";
				if (localStorage.getItem('userinfo')) {

					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;

				}
				if (token == "") {
					return false;
				}
				var data = {
					"key": that.cid,
					"token": token
				}
				that.$Net.request({
					url: that.$API.isCommnet(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							that.isCommnet = 1;
							that.getInfo(that.cid);
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})

					}
				})
			},
			shopInfo(data) {
				var that = this;
				var sid = data.id;
				if (data.status != 1) {
					uni.showToast({
						title: "该商品未上架",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: '/pages/contents/shopinfo?sid=' + sid
				});
			},
			toSearch() {
				var that = this;

				uni.redirectTo({
					url: '/pages/contents/search'
				});
			},
			toAds(url) {
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			replaceSpecialChar(text) {
				if (!text) {
					return false;
				}
				text = text.replace(/&quot;/g, '"');
				text = text.replace(/&amp;/g, '&');
				text = text.replace(/&lt;/g, '<');
				text = text.replace(/&gt;/g, '>');
				text = text.replace(/&nbsp;/g, ' ');
				text = text.replace("||rn||","\n");
				return text;
			},
			isBuyShop(sid, type) {
				var that = this;
				var token = "";

				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				var data = {
					"sid": sid,
					"token": token
				}
				that.$Net.request({
					url: that.$API.isBuyShop(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res));
						if (res.data.code == 1) {
							that.isBuy = 1;
							if (type == 4) {
								that.toShopValue(sid, type);
							}
						}

					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
					}
				})
			},
			shopBuy(sid) {
				var that = this;
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				} else {
					uni.showToast({
						title: "请先登录",
						icon: 'none',
						duration: 1000,
						position: 'bottom',
					});
					var timer = setTimeout(function() {
						uni.navigateTo({
							url: '../user/login'
						});
						clearTimeout('timer')
					}, 1000)
					return false
				}
				var data = {
					"token": token,
					"sid": sid
				}
				uni.showModal({
					title: '确定购买此商品吗?',
					content: ' ',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: "加载中"
							});
							that.$Net.request({
								url: that.$API.buyShop(),
								data: data,
								header: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								method: "get",
								dataType: 'json',
								success: function(res) {
									setTimeout(function() {
										uni.hideLoading();
									}, 1000);
									uni.showToast({
										title: res.data.msg,
										icon: 'none'
									})
									if (res.data.code == 1) {


										//跳转订单页面
										var timer = setTimeout(function() {
											uni.redirectTo({
												url: '/pages/user/order'
											});
											clearTimeout('timer')
										}, 1000)
									} else {
										if (res.data.msg == "购买实体商品前，需要先设置收货地址") {
											var timer = setTimeout(function() {
												uni.redirectTo({
													url: '/pages/user/address'
												});
												clearTimeout('timer')
											}, 1000)
										}
									}

								},
								fail: function(res) {
									setTimeout(function() {
										uni.hideLoading();
									}, 1000);
									uni.showToast({
										title: "网络不太好哦~",
										icon: 'none'
									})
								}
							})
						}
					}
				});

			},
			goLogin() {
				uni.navigateTo({
					url: '/pages/user/login'
				});
			},
			goRegister() {
				uni.navigateTo({
					url: '/pages/user/register'
				});
			},
			toShopValue(id, type) {
				var that = this;
				if (type == 1) {
					uni.showToast({
						title: "实体商品请留意快递信息",
						icon: 'none'
					})
				} else if (type == 4) {
					var that = this;
					var token = "";
					if (localStorage.getItem('token')) {
						token = localStorage.getItem('token');
					}
					var data = {
						"key": id,
						"token": token
					}
					that.$Net.request({
						url: that.$API.shopInfo(),
						data: data,
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						method: "get",
						dataType: 'json',
						success: function(res) {

							uni.stopPullDownRefresh();
							if (res.data.value) {
								that.shopValue = res.data.value;
							}


							var timer = setTimeout(function() {
								that.isLoading = 1;
								clearTimeout('timer')
							}, 300)
						},
						fail: function(res) {
							uni.stopPullDownRefresh();
							uni.showToast({
								title: "网络不太好哦~",
								icon: 'none'
							})
							var timer = setTimeout(function() {
								that.isLoading = 1;
								clearTimeout('timer')
							}, 300)
						}
					})
				} else {
					uni.navigateTo({
						url: '/pages/contents/shoptext?sid=' + id
					});
				}
			},
			subText(text, num) {
				if (text) {
					if (text.length > num) {
						text = text.substring(0, num);
						return text + "……";
					} else {
						return text;
					}
				} else {
					return "Ta还没有个人介绍哦"
				}
			},
			toUserContents(data) {
				var that = this;
				var name = data.author;
				var title = data.author + "的信息";
				var id = data.authorId;
				var type = "user";
				uni.navigateTo({
					url: '/pages/contents/userinfo?title=' + title + "&name=" + name + "&uid=" + id + "&avatar=" +
						encodeURIComponent(data.avatar)
				});
			},
			toBan(uid) {
				if (!uid) {
					uni.showToast({
						title: "该用户不存在",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: '/pages/manage/banuser?uid=' + uid
				});
			},
			toDelete(id) {
				var that = this;
				var token = "";

				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				var data = {
					"key": id,
					"token": token
				}
				uni.showModal({
					title: '确定要删除该评论吗',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: "加载中"
							});

							that.$Net.request({
								url: that.$API.commentsDelete(),
								data: data,
								header: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								method: "get",
								dataType: 'json',
								success: function(res) {
									setTimeout(function() {
										uni.hideLoading();
									}, 1000);
									uni.showToast({
										title: res.data.msg,
										icon: 'none'
									})
									if (res.data.code == 1) {
										that.page = 1;
										that.getCommentsList(false, that.cid);
									}

								},
								fail: function(res) {
									setTimeout(function() {
										uni.hideLoading();
									}, 1000);
									uni.showToast({
										title: "网络不太好哦~",
										icon: 'none'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			toDeletePost(id) {
				var that = this;
				var token = "";

				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				var data = {
					"key": id,
					"token": token
				}
				uni.showModal({
					title: '确定要删除该帖子吗',
				 success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: "加载中"
							});

							that.$Net.request({
				   	url: that.$API.contentsDelete(),
								data: data,
								header: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
				 			method: "get",
								dataType: 'json',
								success: function(res) {
									setTimeout(function() {
										uni.hideLoading();
									}, 1000);
				 				uni.showToast({
										title: res.data.msg,
										icon: 'none'
									})
									if (res.data.code == 1) {
										that.page = 1;
										that.moreText = "加载更多";
										that.isLoad = 0;
										that.getContentsList();
										
									}

								},
								fail: function(res) {
									setTimeout(function() {
										uni.hideLoading();
									}, 1000);
									uni.showToast({
										title: "网络不太好哦~",
										icon: 'none'
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			getIsFollow(uid) {
				var that = this;
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				var data = {
					token: token,
					touid: uid,
				}
				that.$Net.request({

					url: that.$API.isFollow(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.isFollow = res.data.code;
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
					}
				})
			},
			
			follow(type) {
				var that = this;
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				} else {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					})
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				var data = {
					token: token,
					touid: that.authorId,
					type: type,
				}
				that.isFollow = type;
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({

					url: that.$API.follow(),
					data: data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res))
						setTimeout(function() {
							uni.hideLoading();
						}, 1000);
						if(type == 1){
						    if (localStorage.getItem('userinfo')) {
						      var userInfo = JSON.parse(localStorage.getItem('userinfo'));
						      that.username = userInfo.name;
						    		
						    		
						    	}
						}else if(type == 0){
						   if (localStorage.getItem('userinfo')) {
						     var userInfo = JSON.parse(localStorage.getItem('userinfo'));
						     that.username = userInfo.name;
						    		
						    		
						    	}
						}
						that.getIsFollow(that.authorId);
					},
					fail: function(res) {
						setTimeout(function() {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
						uni.stopPullDownRefresh();
						that.getIsFollow(that.authorId);
					}
				})
			},
			toLink(text) {
				var that = this;

				if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
					uni.showToast({
						title: "请先登录哦",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: text
				});
			},
			gorenwu(){
				uni.navigateTo({
				    url: '/pages/user/renwu'
				});
			},
			gobuyvip(){
				uni.navigateTo({
				    url: '/pages/user/buyvip'
				});
			},
			goLogin(){
				uni.navigateTo({
				    url: '/pages/user/login'
				});
			},
			goRegister(){
				uni.navigateTo({
				    url: '/pages/user/register'
				});
			}
		}
	}
</script>

<style>
	.info-content image {
		border-radius: 10upx;
		margin-top: 10upx;
		
	}
	.no-data .cuIcon-community {
	    display: block;
	    font-size: 32px;
	    color: #ddd;
	    margin-bottom: 6px;
	}
</style>
