<template>
	<view>
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
			</view>
		</view>
		<view class="cu-card case" :class="isCard?'no-card':''">
			<view class="">
				<view class="image">
					<image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg"
					 mode="widthFix"></image>
					 
				</view>
				<view class="flex">
					<!-- <view class="cu-bar bg-white margin-top solid-bottom">
					</view> -->
					<scroll-view scroll-x class="bg-white nav">
						<view class="flex-sub text-center align-center">
							<view class="cu-item fl" :class="index==TabCur?'text-shojo	 cur':''" v-for="(item,index) in 2" :key="index" @tap="tabSelect" :data-id="index">
								占位{{index}}
							</view>
							<view class="fr cu-item radius"  @tap="commentsAdd(title,0,0)">
								<view class="">
									<text></text>点我发弹幕
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="cu-list menu-avatar bg-white padding-top-lg">
					<view class="cu-item">
						<view class="cu-avatar round lg" :style="'background-image:url('+userInfo.avatar+');'"></view>
						<view class="content flex-sub">
							<view class="flex-sub justify-between">
								<view class="text-shojo">{{userInfo.name}}</view>
								<view class="bg-shojo cu-btn cuIcon-add round">关注</view>
							</view>
							
							<view class="text-gray text-sm flex justify-start">
							<text class="cuIcon-attentionfill margin-lr-xs">{{postInfo.views}}</text>
							<text class="cuIcon-appreciatefill margin-lr-xs">{{postInfo.likes}}</text>
							<text class="cuIcon-messagefill margin-lr-xs">{{postInfo.commentsNum}}</text>
							<text class="cuIcon-timefill margin-lr-xs">{{formatDate(postInfo.created)}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="cu-item">
					<uni-collapse>
						<uni-collapse-item :title="postInfo.title">
							<view style="margin-left:32upx;">
								{{postInfo.text,80}}
							</view>
								<view class="tags-box round margin-sm">
									<block v-for="(item,index) in tagList"  @tap='toTagsContents("#"+item.name+"#",item.mid)' :key="index">
										<view class="cu-tag round padding-sm text-gray" >
											<text># {{item.name}}</text>
										</view>
									</block>
								</view>
						</uni-collapse-item>	
					</uni-collapse>
					<view class="flex-direction text-center bg-white">
						<view class="cu-item info-footer-btn">
							<text class="cuIcon-appreciate" @tap="toLikes" v-if="isLikes==0"></text>
							<text class="cuIcon-appreciatefill text-shojo" @tap="toLikes" v-else></text>
							<text class="cuIcon-favor" @tap="toMark" v-if="isMark==0"></text>
							<text class="cuIcon-favorfill text-shojo" @tap="rmMark" v-else></text>
							<!-- <text class="cuIcon-recharge"  @tap="toReward"></text> -->
							<text class="cuIcon-present"  @tap="showModal" data-target="ChooseModal"></text>
							<text class="cuIcon-like text-shojo" @tap="isShare=!isShare"></text>
						</view>
					</view>
					<view class="solid-bottom"></view>
					<block v-for="(item,index) in contentsList" :key="index" v-if="dataLoad">
						<articleItem :item="item"></articleItem>
					</block>
				</view>
			</view>
		</view>
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
				TabCur: 0,
				scrollLeft: 0,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
				AppStyle:this.$store.state.AppStyle,
				cid:0,
				uid:0,
				title:"",
				html:"",
				commentsNum:0,
				category:[],
				created:'',
				postInfo:{},
				markdownData: {},
				userInfo:{},
				slug:"",
				tagList:[],
				commentsList:[],
				
				moreText:"加载更多",
				page:1,
				
				isLoad:0,
				
				isLoading:0,
				
				isMark:0,
				logid:-1,
				
				token:"",
				
				likes:0,
				isLikes:0,
				
				type:"post",
				
				shopList:[],
				shopID:-1,
				owo:owo,
				owoList:[],
				
				isCommnet:0,
				
				modalName: null,
				checkbox: [{
					value: 0,
					name: '1 Ero',
					num:1,
					checked: false,
					hot: false,
				}, {
					value: 1,
					name: '2 Ero',
					num:2,
					checked: false,
					hot: false,
				}, {
					value: 2,
					name: '5 Ero',
					num:5,
					checked: false,
					hot: false,
				}],
				ads:"",
				userlvStyle:"",
				vipDiscount:0,
				vipPrice:0,
				scale:0,
				
				isBuy:0,
				shopValue:"",
				
				bannerAds:[],
				bannerAdsInfo:null,
				
				isComment:0,
				images:[],
				
				group:"",
				loginUid:0,
				
				authorId:0,
				isFollow:0,
				
				currencyName:"",
				
				isShare:false
				
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
		onShow(){
			var that = this;
			that.currencyName = that.$API.getCurrencyName();
			if(localStorage.getItem('userinfo')){
				
				var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.group = userInfo.group;
				that.loginUid = userInfo.uid;
				
			}
			// #ifdef MP-BAIDU
			//预留百度小程序TDK
		
			// #endif
			
			that.getAdsCache();
			// #ifdef H5 || APP-PLUS
			that.isComment=1;
			// #endif
			
			// #ifdef MP
			that.isComment = that.$API.GetIsComment();
			// #endif
			
			// #ifdef APP-PLUS
		
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			that.isLoad=0;
			that.page=1;
			
			if(that.cid!=0){
				
				that.getIsCommnet();
				
				that.getInfo(that.cid);
				that.getCommentsList(false,that.cid);
				
			}
			
			if(localStorage.getItem('token')){
				that.token=localStorage.getItem('token');
				that.toIsMark();
			}
			//that.allCache();
			that.getVipInfo();
			
		},
		onPullDownRefresh(){
			var that = this;
			
			var timer = setTimeout(function() {
				that.getInfo(that.cid);
				// #ifdef H5 || APP-PLUS
				that.getCommentsList(false,that.cid);
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
			var owoList=[];
			for(var i in owo){
				owoList = owoList.concat(owo[i].container);
			}
			that.owoList = owoList;
			// #endif
			
			if(localStorage.getItem('likeDate_'+that.cid)){
				var data = localStorage.getItem('likeDate_'+that.cid);
				var cur_date = new Date().getTime();
				var c = Number(cur_date)-Number(data);
				if(c>=86400000){
					that.isLikes = 0;
					localStorage.removeItem('likeDate_'+that.cid)
				}else{
					that.isLikes = 1;
				}
			}
			that.allCache();
			that.getInfo(that.cid);
			
			// #ifdef H5 || APP-PLUS
			that.getShopList();
			// #endif
			that.getCommentsList(false,that.cid);
			
			
			
			var ctx = this.$refs.article;
		},
		methods:{
			getAdsCache(){
				var that = this;
				if(localStorage.getItem('bannerAds')){
					that.bannerAds = JSON.parse(localStorage.getItem('bannerAds'));
					
					var num = that.bannerAds.length;
					if(num>0){
						var rand = Math.floor(Math.random()*num);
						that.bannerAdsInfo = that.bannerAds[rand];
					}
				}
			},
			backHome(){
				uni.switchTab({
					url: '/pages/home/home'
				});
			},
			back(){
				
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
					that.getUserInfo(postInfo.authorId);
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
				
				if(that.isCommnet==1){
					text = that.replaceAll(text,"[hide]","<div style='width:100%;padding:15px 15px;background:#dff0d8;color:#3c763d;border:solid 1px #d6e9c6;box-sizing: border-box;border-radius: 5px;word-break:break-all;'>");
					text = that.replaceAll(text,"[/hide]","</div>");
					text = that.replaceAll(text,"{hide}","<div style='width:100%;padding:15px 15px;background:#dff0d8;color:#3c763d;border:solid 1px #d6e9c6;box-sizing: border-box;border-radius: 5px;word-break:break-all;'>")
					text = that.replaceAll(text,"{/hide}","</div>")
				}else{
					text = text.replace(/\[hide(([\s\S])*?)\[\/hide\]/g,"<div style='width:100%;padding:15px 15px;background:#f2dede;color:#a94442;border:solid 1px #ebccd1;box-sizing: border-box;border-radius: 5px;'>此内容需要评论后方可阅读！</div>");
					text = text.replace(/{hide(([\s\S])*?){\/hide}/g,"<div style='width:100%;padding:15px 15px;background:#f2dede;color:#a94442;border:solid 1px #ebccd1;box-sizing: border-box;border-radius: 5px;'>此内容需要评论后方可阅读！</div>");
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
			getUserLv(i){
				var that = this;
				if(!i){
					var i = 0;
				}
				var rankList = that.$API.GetRankList();
				return rankList[i];
			},
			getUserLvStyle(i){
				var that = this;
				if(!i){
					var i = 0;
				}
				var rankStyle = that.$API.GetRankStyle();
				var userlvStyle ="color:#fff;background-color: "+rankStyle[i];
				return userlvStyle;
			},
			replaceAll(string, search, replace) {
			  return string.split(search).join(replace);
			},
			toUserInfo(data){
				var that = this;
				var name = data.name;
				var title = data.name+"的信息";
				if(data.screenName){
					title = data.screenName+" 的信息";
					name = data.screenName
				}
				var id= data.uid;
				var type="user";
				uni.navigateTo({
				    url: '/pages/contents/userinfo?title='+title+"&name="+name+"&uid="+id+"&avatar="+encodeURIComponent(data.avatar)
				});
			},
			toTagsContents(title,id){
				var that = this;
				var type="meta";
				uni.navigateTo({
				    url: '/pages/contents/contentlist?title='+title+"&type="+type+"&id="+id
				});
			},
			toCategoryContents(data){
				var that = this;
				var title = data[0].name;
				var id= data[0].mid;
				var type="meta";
				uni.navigateTo({
				    url: '/pages/contents/contentlist?title='+title+"&type="+type+"&id="+id
				});
			},
			toEdit(cid){
				var that = this;
				
				uni.navigateTo({
					url: '/pages/user/post?type=edit'+'&cid='+cid
				});
			},
			loadMore(){
				var that = this;
				that.moreText="加载中...";
				if(that.isLoad==0){
					that.getCommentsList(true,that.cid);
				}
				
			},
			getVipInfo(){
				var that = this;
				that.$Net.request({
					url: that.$API.getVipInfo(),
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.vipDiscount=res.data.data.vipDiscount;
							that.vipPrice=res.data.data.vipPrice;
							that.scale=res.data.data.scale;
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			getInfo(cid){
				var that = this;
				var data = {
					"key":that.cid,
					"isMd":0,
				}
				
				that.$Net.request({
					url: that.$API.getContentsInfo(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						uni.stopPullDownRefresh();
						if(res.data.title){
							that.postInfo = res.data;
							that.title = res.data.title;
							that.category = res.data.category;
							that.created = res.data.created;
							that.commentsNum = res.data.commentsNum;
							that.images = res.data.images;
							var html =that.markHtml(res.data.text);
							
							that.html=html;
							that.tagList=res.data.tag;
							that.slug = res.data.slug;
							that.type = res.data.type;
							that.likes =  res.data.likes;
							that.authorId =  res.data.authorId
							that.getUserInfo(res.data.authorId);
							that.getIsFollow(res.data.authorId);
							localStorage.removeItem('postInfo_'+that.cid);
							localStorage.setItem('postInfo_'+that.cid,JSON.stringify(res.data));
							var timer = setTimeout(function() {
								that.allCache();
							}, 200);
							var timer = setTimeout(function() {
								that.isLoading=1;
								clearTimeout('timer')
							}, 300)
							
						}
					},
					fail: function(res) {
						uni.stopPullDownRefresh();
					}
				})
			},
			getUserInfo(id){
				var that = this;
				var data = {
					"key":id,
				}
				
				that.$Net.request({
					url: that.$API.getUserInfo(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.userInfo = res.data.data;
							that.userInfo.style = "background-image:url("+res.data.data.avatar+");"
						}else{
							that.userInfo.name="用户已注销"
						}
					},
					fail: function(res) {
					}
				});
			},
			getCommentsList(isPage,id){
				var that = this;
				var data = {
					"cid":id,
					"status":"approved"
				}
				var page = that.page;
				if(isPage){
					page++;
				}
				that.$Net.request({
					url: that.$API.getCommentsList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":4,
						"page":page,
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						uni.stopPullDownRefresh();
						that.isLoad=0;
						if(res.data.code==1){
							var list = res.data.data;
							if(list.length>0){
								var commentsList = [];
								for(var i in list){
									var arr = list[i];
									arr.style = "background-image:url("+list[i].avatar+");"
									commentsList.push(arr);
								}
								if(isPage){
									that.page++;
									that.commentsList = that.commentsList.concat(commentsList);
								}else{
									that.commentsList = commentsList;
								}
								localStorage.setItem('commentsList_'+that.cid,JSON.stringify(that.commentsList));
								
							}else{
								that.moreText="没有更多评论了";
								if(that.page==1&&!isPage){
									localStorage.removeItem('commentsList_'+that.cid);
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
						that.isLoad=0;
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
						
						that.moreText="加载更多";
					}
				})
			},
			commentsAdd(title,coid,reply){
				var that = this;
				
				if(!localStorage.getItem('userinfo')){
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					})
					uni.navigateTo({
					    url: '/pages/user/login'
					});
					return false;
				}else{
					var cid = that.cid;
					uni.navigateTo({
					    url: '/pages/contents/commentsadd?cid='+cid+"&coid="+coid+"&title="+title+"&isreply="+reply
					});
				}
				
			},
			toReward(){
				var that = this;
				var rewardList = that.checkbox;
				var num = 10;
				for(var i in rewardList){
					if(rewardList[i].checked){
						num = rewardList[i].num;
					}
				}
				var data = {
					"type":"reward",
					"cid":that.cid,
					"num":num,
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.addLog(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.hideModal();
						setTimeout(function () {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if(res.data.code==1){
							uni.showToast({
								title: "成功打赏 "+num+" "+that.currencyName,
								icon: 'none'
							})
						}
						
					},
					fail: function(res) {
						that.hideModal();
						setTimeout(function () {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
					}
				})
			},
			toLikes(){
				var that = this;
				var data = {
					"type":"likes",
					"cid":that.cid,
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.addLog(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						
						setTimeout(function () {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						
						if(res.data.code==1){
							var timestamp=new Date().getTime();
							that.isLikes = 1;
							localStorage.setItem('likeDate_'+that.cid,timestamp);
							that.likes++;
							//that.getInfo(that.cid);
						}
						
					},
					fail: function(res) {
						setTimeout(function () {
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
				this.modalName = e.currentTarget.dataset.target
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
			toIsMark(){
				var that = this;
				that.$Net.request({
					
					url: that.$API.getIsMark(),
					data:{
						"token":that.token,
						"cid":that.cid
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						
						if(res.data.code==1){
							that.isMark = res.data.data.isMark;
							that.logid = res.data.data.logid;
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
			toMark(){
				
				var that = this;
				var data = {
					"type":"mark",
					"cid":that.cid,
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.addLog(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res))
						setTimeout(function () {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if(res.data.code==1){
							that.toIsMark();
							that.isMark=1;
							//that.toIsMark();
						}
						
					},
					fail: function(res) {
						setTimeout(function () {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
					}
				})
			},
			rmMark(){
				var that = this;
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.removeLog(),
					data:{
						"key":that.logid,
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res))
						setTimeout(function () {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if(res.data.code==1){
							that.isMark=0;
							that.toIsMark();
							//that.toIsMark();
						}
						
					},
					fail: function(res) {
						setTimeout(function () {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: "网络不太好哦~",
							icon: 'none'
						})
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
				textarea.setSelectionRange(0, text.length) ;
				uni.showToast({ //提示
					title: "复制成功"
				})
				var result = document.execCommand("copy") 
				textarea.remove();
				
				// #endif
			},
			goAds(data){
				var that = this;
				var url = data.url;
				var type = data.urltype;
				// #ifdef APP-PLUS
				if(type==1){
					plus.runtime.openURL(url);
				}
				if(type==0){
					plus.runtime.openWeb(url);
				}
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			ToShare(){
				
				var that = this;
				var linkStar = that.$API.GetlinkStar();
				
				
				var url = linkStar.replace("{cid}",that.cid);
				if(linkStar.indexOf("{category}")!=-1){
					var category = that.category[0].slug;
					url = url.replace("{category}",category);
				}
				// #ifdef APP-PLUS
				uni.shareWithSystem({
				  href: url,
				  summary:that.title,
				  success(){
				    // 分享完成，请注意此时不一定是成功分享
					
				  },
				  fail(){
				    // 分享失败
				  }
				});
				// #endif
				// #ifdef h5
				that.ToCopy(url);
				// #endif
			},
			formatNumber(num) {
			    return num >= 1e3 && num < 1e4 ? (num / 1e3).toFixed(1) + 'k' : num >= 1e4 ? (num / 1e4).toFixed(1) + 'w' : num
			},
			getShopList(){
				var that = this;
				var uid= 0;
				if(localStorage.getItem('userinfo')){
					
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					uid = userInfo.uid;
					
				}
				var data = {
					"cid":that.cid,
				}
				that.$Net.request({
					url: that.$API.shopList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":1,
						"page":1,
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res));
						if(res.data.code==1){
							var list = res.data.data;
							that.shopList = list;
							if(list.length>0){
								that.shopID = list[0].id;
								that.isBuyShop(that.shopID,list[0].type);
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
			getIsCommnet(){
				var that = this;
				// #ifdef MP
				that.isCommnet=1;
				that.getInfo(that.cid);
				return false;
				// #endif
				var token= "";
				if(localStorage.getItem('userinfo')){
					
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
					
				}
				if(token==""){
					return false;
				}
				var data = {
					"key":that.cid,
					"token":token
				}
				that.$Net.request({
					url: that.$API.isCommnet(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							that.isCommnet=1;
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
			shopInfo(data){
				var that = this;
				var sid = data.id;
				if(data.status!=1){
					uni.showToast({
						title: "该商品未上架",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
				    url: '/pages/contents/shopinfo?sid='+sid
				});
			},
			toSearch(){
				var that = this;
				
				uni.redirectTo({
				    url: '/pages/contents/search'
				});
			},
			toAds(url){
				// #ifdef APP-PLUS
				plus.runtime.openURL(url) 
				// #endif
				// #ifdef H5
				window.open(url)
				// #endif
			},
			replaceSpecialChar(text) {
				if(!text){
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
			isBuyShop(sid,type){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"sid":sid,
					"token":token
				}
				that.$Net.request({
					url: that.$API.isBuyShop(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res));
						if(res.data.code==1){
							that.isBuy=1;
							if(type==4){
								that.toShopValue(sid,type);
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
			shopBuy(sid){
				var that = this;
				var token= "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}else{
					uni.showToast({
					    title:"请先登录",
						icon:'none',
						duration: 1000,
						position:'bottom',
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
					"token":token,
					"sid":sid
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
								data:data,
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
										title: res.data.msg,
										icon: 'none'
									})
									if(res.data.code==1){
										
										
										//跳转订单页面
										var timer = setTimeout(function() {
											uni.redirectTo({
											    url: '/pages/user/order'
											});
											clearTimeout('timer')
										}, 1000)
									}else{
										if(res.data.msg=="购买实体商品前，需要先设置收货地址"){
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
									setTimeout(function () {
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
			toShopValue(id,type){
				var that = this;
				if(type==1){
					uni.showToast({
						title: "实体商品请留意快递信息",
						icon: 'none'
					})
				}else if(type==4){
					var that = this;
					var token = "";
					if(localStorage.getItem('token')){
						token=localStorage.getItem('token');
					}
					var data = {
						"key":id,
						"token":token
					}
					that.$Net.request({
						url: that.$API.shopInfo(),
						data:data,
						header:{
							'Content-Type':'application/x-www-form-urlencoded'
						},
						method: "get",
						dataType: 'json',
						success: function(res) {
							
							uni.stopPullDownRefresh();
							if(res.data.value){
								that.shopValue = res.data.value;
							}
							
					
							var timer = setTimeout(function() {
								that.isLoading=1;
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
								that.isLoading=1;
								clearTimeout('timer')
							}, 300)
						}
					})
				}else{
					uni.navigateTo({
					    url: '/pages/contents/shoptext?sid='+id
					});
				}
			},
			subText(text,num){
				if(text){
					if(text.length>num){
						text = text.substring(0,num);
						return text+"……";
					}else{
						return text;
					}
				}else{
					return "Ta还没有个人介绍哦"
				}
			},
			toUserContents(data){
				var that = this;
				var name = data.author;
				var title = data.author+"的信息";
				var id= data.authorId;
				var type="user";
				uni.navigateTo({
				    url: '/pages/contents/userinfo?title='+title+"&name="+name+"&uid="+id+"&avatar="+encodeURIComponent(data.avatar)
				});
			},
			toBan(uid){
				if(!uid){
					uni.showToast({
						title: "该用户不存在",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
				    url: '/pages/manage/banuser?uid='+uid
				});
			},
			toDelete(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"key":id,
					"token":token
				}
				uni.showModal({
				    title: '确定要删除该评论吗',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.commentsDelete(),
				            	data:data,
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
				            			title: res.data.msg,
				            			icon: 'none'
				            		})
				            		if(res.data.code==1){
										that.page = 1;
				            			that.getCommentsList(false,that.cid);
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
				            	}
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			toDeletePost(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"key":id,
					"token":token
				}
				uni.showModal({
				    title: '确定要删除该帖子吗',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.contentsDelete(),
				            	data:data,
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
				            			title: res.data.msg,
				            			icon: 'none'
				            		})
				            		if(res.data.code==1){
				            			that.page=1;
				            			that.moreText="加载更多";
				            			that.isLoad=0;
				            			that.getContentsList();
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
				            	}
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			getIsFollow(uid){
				var that = this;
				var token = "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					token:token,
					touid:uid,
				}
				that.$Net.request({
					
					url: that.$API.isFollow(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
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
			follow(type){
				var that = this;
				var token = "";
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}else{
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
					token:token,
					touid:that.authorId,
					type:type,
				}
				that.isFollow = type;
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.follow(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						//console.log(JSON.stringify(res))
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						that.getIsFollow(that.authorId);
					},
					fail: function(res) {
						setTimeout(function () {
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
			toLink(text){
				var that = this;
				
				if(!localStorage.getItem('token')||localStorage.getItem('token')==""){
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
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			}
		}
	}

</script>

<style>
</style>