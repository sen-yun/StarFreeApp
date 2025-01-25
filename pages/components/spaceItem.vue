<template>
	<view>
		<view class="cu-card dynamic no-card square-list">
			
			<block  v-for="(item,index) in spaceList" :key="index" v-if="spaceList.length>0">
			<block v-if="item.type==0||item.type==4">
				<view class="cu-item cu-item2">
					<view class="cu-list menu-avatar">
						<view class="cu-item cu-item2">
							<view class="cu-avatar round lg" :style="'background-image:url('+item.userJson.avatar+');'" @tap="toUserContents(item.userJson)">

							</view>
							<view class="content flex-sub">
								<view><text style="color: #ff6b97;" v-if="item.userJson.isvip>0">{{item.userJson.name}}</text><text v-else>{{item.userJson.name}}</text>
								<block v-if="item.userJson.uid!=0">
									<text class="userlv" v-if="item.userJson.isvip>0" style="background: linear-gradient(to bottom right, #f2ad5c, #e6216d,#901ccb);color:white;padding: 2px 5px;border-radius: 10px;">VIP</text>
									<text class="userlv" :style="getLvStyle(item.userJson.experience)">{{getLv(item.userJson.experience)}}</text>
									<!-- <text class="userlv" :style="getUserLvStyle(item.userJson.lv)">{{getUserLv(item.userJson.lv)}}</text>
									
									<text class="userlv customize" v-if="item.userJson.customize&&item.userJson.customize!=''">{{item.userJson.customize}}</text> -->
									
								</block>
								</view>
								<view class="text-gray text-sm flex">
									{{formatDate(item.created)}}
									<block v-if="item.userJson.uid!=0&&item.userJson.uid==uid">
										<text class="text-blue margin-left-sm" @tap="edit(item.id)">编辑</text>
										<text class="text-red margin-left-sm" @tap="toDelete2(item.id)">删除</text>
									</block>
									<block v-else>
										<text v-if="group=='administrator'||group=='editor'" class="text-blue margin-left-sm" @tap="edit(item.id)">编辑</text>
										<text v-if="group=='administrator'" class="text-red margin-left-sm" @tap="toDelete(item.id)">删除</text>
									</block>
										
									
								
								</view>
							</view>
						</view>
					</view>
					
					<block  v-if="item.type==0">
						<view class="text-content break-all">
							<rich-text :nodes="markHtml(item.text)"></rich-text>
						</view>
						<view class="grid flex-sub padding-lr col-3 grid-square" v-if="item.picList.length>0">
							<view class="bg-img" :style="'background-image:url('+data+');'"
							 v-for="(data,i) in item.picList" :key="i" @tap="previewImage(item.picList,data)">
							</view>
						</view>
					</block>
					
					
					<block  v-if="item.type==4">
						<view class="text-content break-all">
							<rich-text :nodes="markHtml(item.text)"></rich-text>
						</view>
						<view class="padding-lr spaceVideo">
							<!--  #ifdef H5 || MP-->
							<video :src="item.pic" @play="play(item.pic)" ></video>
							<!--  #endif -->
							<!--  #ifdef APP-PLUS -->
							<view class="paceVideo2">
												<view class="spaceVideo-play" :style="{ backgroundImage: 'url(' + curIMG + ')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center' }" @tap="goPlay(item.pic,item.text,item.userJson.name)">
													<text class="cuIcon-playfill"></text>
													</view>
												</view>
							<!--  #endif -->
							
							
						</view>
					</block>
					<block v-if="item.userJson.uid!=0&&item.userJson.uid==uid">
					
						<view class="text-center grid col-2 padding-xs">
							<view class="square-post-btn"  @tap="toInfo(item.id)">
								<text class="cuIcon-community"></text>
								<block v-if="item.reply>0">
									{{formatNumber(item.reply)}}
								</block>
								<block v-else>
									评论
								</block>
							</view>
							<view class="square-post-btn" @tap="toLike(item.id,index)">
								<text class="cuIcon-appreciate" :class="item.isLikes==1?'text-blue':''"></text>
								<block v-if="item.likes>0">
									{{formatNumber(item.likes)}}
								</block>
								<block v-else>
									点赞
								</block>
							</view>
						</view>
					</block>
					<block v-else>
					<view class="text-center grid col-3 padding-xs">
						<view class="square-post-btn">
							<view @tap="follow(0,item.userJson.uid,index)" v-if="item.isFollow==1">
								<text class="cuIcon-friendadd"></text>已关注
							</view>
							<view @tap="follow(1,item.userJson.uid,index)" v-if="item.isFollow==0">
								<text class="cuIcon-friendadd"></text>关注
							</view>
						</view>
						<view class="square-post-btn"  @tap="toInfo(item.id)">
							<text class="cuIcon-community"></text>
							<block v-if="item.reply>0">
								{{formatNumber(item.reply)}}
							</block>
							<block v-else>
								评论
							</block>
						</view>
						<view class="square-post-btn" @tap="toLike(item.id,index)">
							<text class="cuIcon-appreciate" :class="item.isLikes==1?'text-blue':''"></text>
							<block v-if="item.likes>0">
								{{formatNumber(item.likes)}}
							</block>
							<block v-else>
								点赞
							</block>
						</view>
					</view>
					</block>
				</view>
			</block>
			</block>
		</view>
		<view class="videoPlay" v-if="isPlay">
			<view class="videoPlay-bg" @tap="isPlay=false">
				<view class="videoPlay-close" @tap="isPlay=true">
					<i class="cuIcon-close"></i>
				</view>
			</view>
			<video :src="curVideo" http-cache="true" play-strategy="0" loop autoplay :title="mp4title"></video>
		</view>
	</view>
</template>

<script>
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
	    props: {
	        spaceList: {
			  type: Array,
			  default: () => []
			},
			isHead: {
			  type: Boolean,
			  default: true
			}
	    },
		name: "spaceItem",
		data() {
			return {
				owo:owo,
				owoList:[],
				vipDiscount:0,
				currencyName:"",
				curIMG:"",
				group:"",
				mp4bt:"",
				mp4name:"",
				mp4title:"视频动态",
				uid:0,
				isPlay:false,
				curVideo:"",
			};
		},
		created(){
			var that = this;
			that.getvideoimg()
			if(localStorage.getItem('userinfo')){
							
				var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.group = userInfo.group;
				that.uid = userInfo.uid;
			}
			that.currencyName = that.$API.getCurrencyName();
			// #ifdef APP-PLUS || H5
			var owo = that.owo.data;
			var owoList=[];
			for(var i in owo){
				owoList = owoList.concat(owo[i].container);
			}
			that.owoList = owoList;
			// #endif
		},
		methods: {
			
			getvideoimg(){
				var that = this;
				      uni.request({
				        url:that.$API.SMgonggao(),
				        method:'GET',
				        dataType:"json",
				        success(res) {
						  that.curIMG = res.data.videoimg;
				        },
				        fail(error) {
				          console.log(error);
				        }
				      })
				},
			previewImage(imageList,image) {
				//预览图片
				uni.previewImage({
					urls: imageList,
					current: image
				});
			},
			subText(text,num){
				if(text.length < null){
					return text.substring(0,num)+"……"
				}else{
					return text;
				}
				
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
			formatDate(datetime) {
			  var now = new Date();
			  var diff = now - new Date(datetime * 1000);
			  var minuteDiff = Math.floor(diff / 60000);
			  var hourDiff = Math.floor(diff / 3600000);
			  var dayDiff = Math.floor(diff / 86400000);
			  var weekDiff = Math.floor(dayDiff / 7);
			  var monthDiff = Math.floor(diff / 2592000000);
			  var yearDiff = Math.floor(diff / 31536000000);
			
			  if (diff < 60000) {
			    return Math.floor(diff / 1000) + "秒前";
			  } else if (diff < 3600000) {
			    return minuteDiff + "分钟前";
			  } else if (hourDiff < 24) {
			    return hourDiff + "小时前";
			  } else if (dayDiff < 7 && dayDiff > 0) {
			    return dayDiff + "天前";
			  } else if (weekDiff > 0 && monthDiff <= 1) {
			    return weekDiff + "周前";
			  } else if (monthDiff > 1 && monthDiff < 12) {
			    return monthDiff + "个月前";
			  } else if (yearDiff >= 1) {
			    return yearDiff + "年前";
			  } else {
			    return "刚刚";
			  }
			},
			formatNumber(num) {
			    return num >= 1e3 && num < 1e4 ? (num / 1e3).toFixed(1) + 'k' : num >= 1e4 ? (num / 1e4).toFixed(1) + 'w' : num
			},
			toInfo(id){
				var that = this;
				
				uni.navigateTo({
				    url: '/pages/space/info?id='+id
				});
			},
			goContentInfo(data){
				var that = this;
				if(data.status!="publish"){
					uni.showToast({
						title:"帖子正在审核中，请稍后再试！",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false;
				}
				uni.navigateTo({
				    url: '/pages/contents/info?cid='+data.cid+"&title="+data.title
				});
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
			markHtml(text){
				var that = this;
				text = that.replaceAll(text,"<","&lt;");
				text = that.replaceAll(text,">","&gt;");
				var owoList=that.owoList;
				for(var i in owoList){
				
					if(that.replaceSpecialChar(text).indexOf(owoList[i].data) != -1){
						text = that.replaceAll(that.replaceSpecialChar(text),owoList[i].data,"<img src='/"+owoList[i].icon+"' class='tImg' />")
						
					}
				}
				text = that.replaceAll(text,"/r/n","<br>");
				text = that.TransferString(text);
				return text;
			},
			TransferString(content)
			{  
			    var string = content;  
			    try{  
			        string=string.replace(/\r\n/g,"<br>")  
			        string=string.replace(/\n/g,"<br>");  
			    }catch(e) {  
			        return content;
			    }  
			    return string;  
			},
			replaceAll(string, search, replace) {
			  return string.split(search).join(replace);
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
			getLv(i){
				var that = this;
				if(!i){
					var i = 0;
				}
				var lv  = that.$API.getLever(i);
				var leverList = that.$API.GetLeverList();
				return leverList[lv];
			},
			getLvStyle(i){
				var that = this;
				if(!i){
					var i = 0;
				}
				var lv  = that.$API.getLever(i);
				var rankStyle = that.$API.GetRankStyle();
				var userlvStyle ="color:#fff;background-color: "+rankStyle[lv];
				return userlvStyle;
			},
			follow(type,uid,index){
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
				that.spaceList[index].isFollow = type;
				var data = {
					token:token,
					touid:uid,
					type:type,
				}
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
						if(res.data.code==0){
							that.spaceList[index].isFollow = 0;
						}else{
							var spaceList = that.spaceList;
							for(var i in spaceList){
								if(spaceList[i].userJson.uid==uid){
									spaceList[i].isFollow = type;
								}
							}
							that.spaceList = spaceList;
						}
					},
					fail: function(res) {
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络开小差了哦",
							icon: 'none'
						})
						
					}
				})
			},
			toLike(id,index){
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
				if(that.spaceList[index].isLikes==1){
					uni.showToast({
						title: "你已经点赞过了",
						icon: 'none'
					});
					return false;
				}else{
					that.spaceList[index].isLikes = 1;
				}
				
				that.spaceList[index].likes += 1;
				var data = {
					token:token,
					id:id,
				}
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.spaceLikes(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
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
						if(res.data.code==0){
							that.spaceList[index].isLikes = 0;
						}
						
					},
					fail: function(res) {
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络开小差了哦",
							icon: 'none'
						})
						
					}
				})
			},
			edit(id){
				var that = this;
				uni.navigateTo({
				    url: '/pages/space/post?postType=edit&id='+id
				});
			},
			forward(id){
				var that = this;
				uni.navigateTo({
				    url: '/pages/space/post?type=2&id='+id
				});
			},
			
			goShopInfo(sid){
				var that = this;
				uni.navigateTo({
				    url: '/pages/contents/shopinfo?sid='+sid
				});
			},
			toUserContents(data){
				var that = this;
				var name = data.name;
				var title = data.name+"的信息";
				var id= data.uid;
				var type="user";
				uni.navigateTo({
				    url: '/pages/contents/userinfo?title='+title+"&name="+name+"&uid="+id+"&avatar="+encodeURIComponent(data.avatar)
				});
			},
			toBan(uid){
				if(uid==0){
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
					"id":id,
					"token":token
				}
				uni.showModal({
					title: '确定要删除该动态吗',
					success: function (res) {
						if (res.confirm) {
							uni.showLoading({
								title: "加载中"
							});
							
							that.$Net.request({
								url: that.$API.spaceDelete(),
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
									if(res.data.code==1){
										uni.showToast({
											title: res.data.msg,
											icon: 'none'
										})
									}else{
										uni.showToast({
											title: res.data.msg,
											icon: 'none'
										})
									}
									
									
								},
								fail: function(res) {
									setTimeout(function () {
										uni.hideLoading();
									}, 1000);
									uni.showToast({
										title: "网络开小差了哦",
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
			toDelete2(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"id":id,
					"token":token
				}
				uni.showModal({
					title: '确定要删除该动态吗',
					success: function (res) {
						if (res.confirm) {
							uni.showLoading({
								title: "加载中"
							});
							
							that.$Net.request({
								url: that.$API.spaceDelete(),
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
									if(res.data.code==1){
										//执行积分程序
										if (localStorage.getItem('userinfo')) {
										  var userInfo = JSON.parse(localStorage.getItem('userinfo'));
										  that.username = userInfo.name;
										
											}
									}else{
										uni.showToast({
											title: res.data.msg,
											icon: 'none'
										})
									}
									
									
								},
								fail: function(res) {
									setTimeout(function () {
										uni.hideLoading();
									}, 1000);
									uni.showToast({
										title: "网络开小差了哦",
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
			
			
			
			play (e) {
			  this.root.$emit('play')
			  // #ifndef APP-PLUS
			  if (this.root.pauseVideo) {
			    let flag = false
			    const id = e.target.id
			    for (let i = this.root._videos.length; i--;) {
			      if (this.root._videos[i].id === id) {
			        flag = true
			      } else {
			        this.root._videos[i].pause() // 自动暂停其他视频
			      }
			    }
			    // 将自己加入列表
			    if (!flag) {
			      const ctx = uni.createVideoContext(id
			        // #ifndef MP-BAIDU
			        , this
			        // #endif
			      )
			      ctx.id = id
			      if (this.root.playbackRate) {
			        ctx.playbackRate(this.root.playbackRate)
			      }
			      this.root._videos.push(ctx)
			    }
			  }
			  // #endif
			},
			goPlay(url,title,name){
				var that = this;
				that.curVideo = url;
				that.mp4bt = title;
				that.mp4name = name;
				that.mp4title = that.mp4bt + ' - ' + that.mp4name + ' | ' + that.$API.GetAppName();
				that.isPlay=true;
			}
		}
	}
</script>

<style>

.paceVideo2 {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1; /* 将 z-index 设置为 1 */
}

.spaceVideo-play::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20upx;
  z-index: 0; /* 将 z-index 设置为 0 */
}

.cuIcon-playfill {
  position: relative;
  z-index: 2; /* 将 z-index 设置为 2 */
}

.spaceVideo-play {
  border-radius: 20upx;
  position: relative;
  z-index: 2; /* 将 z-index 设置为 2 */
}
  .videoPlay-close {
    z-index: 99;
    color: white;
    position: absolute;
    top: 80upx;
    right: 50upx;
    font-size: 25px;
  }
</style>