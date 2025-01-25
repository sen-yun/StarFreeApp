<template>
	<view class="userpost" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					帖子管理
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<view class="data-box">
			<view class="cu-bar bg-white search">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input type="text" placeholder="输入搜索关键字" v-model="searchText"  @input="searchTag"></input>
					<view class="search-close" v-if="searchText!=''" @tap="searchClose()"><text class="cuIcon-close"></text></view>
				</view>
			</view>
			<view class="search-type grid col-3">
				<view class="search-type-box" @tap="toType('waiting')" :class="type=='waiting'?'active':''">
					<text>待审核</text>
				</view>
				<view class="search-type-box" @tap="toType('publish')" :class="type=='publish'?'active':''">
					<text>已发布</text>
				</view>
				<view class="search-type-box" @tap="toType('reject')" :class="type=='reject'?'active':''">
					<text>已拒绝</text>
				</view>
			</view>
			
			<view class="cu-card article no-card">
				<view class="data-select" v-if="type=='publish'">
					<view class="filter-tag" :class="{'active': dataSelect==0}" @tap="toSelect(0)">全部</view>
					<view class="filter-tag" :class="{'active': dataSelect==1}" @tap="toSelect(1)">推荐</view>
					<view class="filter-tag" :class="{'active': dataSelect==2}" @tap="toSelect(2)">置顶</view>
					<view class="filter-tag" :class="{'active': dataSelect==3}" @tap="toSelect(3)">轮播</view>
				</view>
				<view class="no-data" v-if="contentsList.length==0">
					<text class="cuIcon-text"></text>暂时没有数据
				</view>
				<view class="cu-item shadow article-item" v-for="(item,index) in contentsList" :key="index">
					<view class="content" style="flex-direction: column;">
						<view class="article-main">
							<view class="article-title text-cut">
								<view class="article-title-text">{{item.title}}</view>
								<view style="margin-top: 10rpx;">
									<view class="status-tags" style="margin-right: 4rpx;">
									<view class="cu-tag sm round"
										:class="{
											'bg-green light': item.status=='publish',
											'bg-orange light': item.status=='waiting',
											'bg-red light': item.status=='reject'
										}">
										{{item.status=='publish' ? '已发布' : item.status=='waiting' ? '待审核' : '已拒绝'}}
									</view>
									<text class="author-name">{{item.authorInfo.name}}</text>
								</view>
							</view>
							</view>

							<view class="article-time">{{formatDate(item.created)}}</view>
						</view>
						
						<view class="article-actions">
							
							
							<view class="action-btns">
								<block v-if="item.status=='waiting'">
									<text class="action-btn approve-btn" @tap="toAudit(item.cid,0)">
										<text class="cuIcon-check"></text>通过
									</text>
									<text class="action-btn reject-btn" @tap="toAudit(item.cid,1)">
										<text class="cuIcon-close"></text>拒绝
									</text>
								</block>
								
								<block v-if="item.status=='publish' && group=='administrator'">
									<text class="action-btn" :class="item.isrecommend ? 'text-grey' : 'recommend-btn'" 
										@tap="item.isrecommend ? rmRecommend(item.cid) : addRecommend(item.cid)">
										<text class="cuIcon-favor"></text>{{item.isrecommend ? '取消' : '推荐'}}
									</text>
									<text class="action-btn" :class="item.istop ? 'text-grey' : 'top-btn'"
										@tap="item.istop ? rmTop(item.cid) : addTop(item.cid)">
										<text class="cuIcon-top"></text>{{item.istop ? '取消' : '置顶'}}
									</text>
									<text class="action-btn" :class="item.isswiper==0 ? 'recommend-btn' : 'text-grey'"
										@tap="item.isswiper==0 ? addSwiper(item.cid) : rmSwiper(item.cid)">
										<text class="cuIcon-pic"></text>{{item.isswiper==0 ? '轮播' : '取消'}}
									</text>
								</block>
								
								<text class="action-btn edit-btn" @tap="toEdit(item.cid)">
									<text class="cuIcon-edit"></text>编辑
								</text>
								<text class="action-btn delete-btn" v-if="group=='administrator'||group=='editor'" 
									@tap="toDelete(item.cid)">
									<text class="cuIcon-delete"></text>删除
								</text>
							</view>
							
						</view>
						<view class="divider"></view>
					</view>
				</view>
				<view class="load-more" @tap="loadMore" v-if="contentsList.length>0">
					<text>{{moreText}}</text>
				</view>

			</view>
		</view>
		<!--加载遮罩-->
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../static/loading.gif"></image>
			</view>
		</view>
		<!--加载遮罩结束-->
		<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in abcimgList" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{item.name}}</view>
								<radio class="round" :class="abcimg==item.value?'checked':''" :checked="abcimg==item.value?true:false"
								 :value="item.value"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='reject'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">输入拒绝理由</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl text-left">
					<textarea maxlength="-1" v-model="reason" placeholder="输入拒绝理由" style="width: 100%;height: 150upx;"></textarea>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="toAudit(curCid,1)">确定</button>
		
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { localStorage } from '../../js_sdk/mp-storage/mp-storage/index.js'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
			AppStyle:this.$store.state.AppStyle,

				page:1,
				moreText:"加载更多",
				
				isLoad:0,
				token:"",
				contentsList:[],
				
				searchText:"",
				
				type:"waiting",
				
				reason:"",
				curCid:0,
				
				isLoading:0,
				
				group:"",
				
				modalName: null,
				abcimg: 'able',
				abcimgList:[
					{
						name:"默认",
						value:"able"
					},
					{
						name:"三图",
						value:"mable"
					},
					{
						name:"大图",
						value:"bable"
					},
				],
				curCid:"",
				dataSelect:0,
			}
		},
		onPullDownRefresh(){
			var that = this;
			that.page=1;
			that.getContentsList(false);
			var timer = setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000)
			
		},
		onReachBottom() {
		    //触底后执行的方法，比如无限加载之类的
			var that = this;
			if(that.isLoad==0){
				that.loadMore();
			}
		},
		onShow(){
			var that = this;
			// #ifdef APP-PLUS
			
			plus.navigator.setStatusBarStyle("dark")
			// #endif
			that.page = 1;
			if(localStorage.getItem('token')){
				that.token=localStorage.getItem('token');
				that.getContentsList(false);
			}
			if(localStorage.getItem('userinfo')){
				
				var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.group = userInfo.group;
			}
			
			
		},
		onLoad() {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			
		},
		methods: {
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			loadMore(){
				var that = this;
				that.moreText="正在加载中...";
				that.isLoad=1;
				that.getContentsList(true);
			},
			searchTag(){
				var that = this;
				var searchText = that.searchText;
				that.page=1;
				that.getContentsList();
			
			},
			searchClose(){
				var that = this;
				that.searchText = "";
				that.page=1;
				that.getContentsList();
			
			},
			toType(i){
				var that = this;
				that.type=i;
				that.page=1;
				that.moreText="加载更多";
				that.isLoad=0;
				that.getContentsList(false);
			},
			toSelect(i){
				var that = this;
				that.dataSelect = i;
				that.page=1;
				that.moreText="加载更多";
				that.isLoad=0;
				that.getContentsList(false);
			},
			getContentsList(isPage){
				var that = this;
				if(that.token==""){
					uni.showToast({
					    title:"请先登录",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				var data = {
					"type":"post",
					"status":that.type
				}
				if(that.dataSelect==1){
					data.isrecommend = 1;
				}
				if(that.dataSelect==2){
					data.istop = 1;
				}
				if(that.dataSelect==3){
					data.isswiper = 1;
				}
				var page = that.page;
				if(isPage){
					page++;
				}
				that.$Net.request({
					url: that.$API.getContentsList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":15,
						"page":page,
						"searchKey":that.searchText,
						"order":"created",
						"token":that.token
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.isLoad=0;
						//console.log(JSON.stringify(res))
						that.moreText="加载更多";
						if(res.data.code==1){
							var list = res.data.data;
							if(list.length>0){
								var contentsList = [];
								//将自定义字段获取并添加到数据
								var curFields = that.$API.GetFields();
								for(var i in list){
									var fields = list[i].fields;
									if(fields.length>0){
										for(var j in fields){
											if(curFields.indexOf(fields[j].name)!=-1){
												list[i][fields[j].name]=fields[j].strValue;
											}
										}
									}
									contentsList.push(list[i]);
								}
								if(isPage){
									that.page++;
									that.contentsList = that.contentsList.concat(contentsList);
								}else{
									that.contentsList = contentsList;
								}
								
							}else{
								that.moreText="没有更多帖子了";
								if(!isPage){
									that.contentsList = list;
								}
							}
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
						that.moreText="加载更多";
						that.isLoad=0;
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					}
				})
			},
			toPost(){
				var that = this;
				
				uni.navigateTo({
					url: '/pages/user/post'
				});
			},
			toEdit(cid){
				var that = this;
				
				uni.navigateTo({
					url: '/pages/user/post?type=edit'+'&cid='+cid
				});
			},
			subText(text,num){
				if(text.length < null){
					return text.substring(0,num)+"……"
				}else{
					return text;
				}
				
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
			toAudit(id,type){
				var that = this;
				var token = "";
				that.modalName=null;
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				if(type==1){
					if(that.reason==""){
						that.modalName='reject';
						that.curCid = id;
						return false
					}
				}
				var alert = "确定要审核通过该帖子吗？";
				if(type==1){
					alert = "确定要拒绝该帖子吗？";
				}
				var data = {
					"type":type,
					"key":id,
					"token":token,
					"reason":that.reason
				}
				uni.showModal({
				    title: alert,
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            that.$Net.request({
				            	url: that.$API.contentsAudit(),
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
									that.reason="";
									that.curCid=0;
				            		
				            	},
				            	fail: function(res) {
				            		setTimeout(function () {
				            			uni.hideLoading();
				            		}, 1000);
				            		uni.showToast({
				            			title: "网络不太好哦",
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
				            			title: "网络不太好哦",
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
			addRecommend(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"key":id,
					"recommend":1,
					"token":token
				}
				uni.showModal({
				    title: '确定要推荐该帖子吗',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.toRecommend(),
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
				            			title: "网络不太好哦",
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
			rmRecommend(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"key":id,
					"recommend":0,
					"token":token
				}
				uni.showModal({
				    title: '确定要取消推荐该帖子吗',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.toRecommend(),
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
				            			title: "网络不太好哦",
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
			addTop(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"key":id,
					"istop":1,
					"token":token
				}
				uni.showModal({
				    title: '确定要置顶该帖子吗',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.toTop(),
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
				            			title: "网络不太好哦",
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
			rmTop(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"key":id,
					"istop":0,
					"token":token
				}
				uni.showModal({
				    title: '确定要取消置顶该帖子吗',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.toTop(),
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
				            			title: "网络不太好哦",
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
			addSwiper(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"key":id,
					"isswiper":1,
					"token":token
				}
				uni.showModal({
				    title: '确定要轮播该帖子吗',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.toSwiper(),
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
				            			title: "网络不太好哦",
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
			rmSwiper(id){
				var that = this;
				var token = "";
				
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"key":id,
					"isswiper":0,
					"token":token
				}
				uni.showModal({
				    title: '确定要取消轮播该帖子吗',
				    success: function (res) {
				        if (res.confirm) {
				            uni.showLoading({
				            	title: "加载中"
				            });
				            
				            that.$Net.request({
				            	url: that.$API.toSwiper(),
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
				            			title: "网络不太好哦",
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
			toMetas(){
				var that = this;
				
				uni.navigateTo({
					url: '/pages/manage/metas'
				});
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			RadioChange(e) {
				var abcimg = e.detail.value;
				var cid = this.curCid;
				this.setFields(cid,abcimg);
			},
			setFields(id,type){
				var that = this;
				that.curCid = id;
				if(type){
					that.abcimg = type;
				}else{
					that.abcimg = "able";
				}
				if(that.modalName == null){
					that.modalName = "RadioModal";
					return false;
				}
				
				var token;
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token=userInfo.token;
				}
				var data = {
					"cid":id,
					"name":"abcimg",
					"strvalue":that.abcimg,
					"token":token
				}
				that.modalName = null;
				uni.showLoading({
					title: "加载中"
				});
				
				that.$Net.request({
					url: that.$API.setFields(),
					data:data,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						that.modalName =  null;
						that.abcimg = "able";
						that.curCid = "";
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
						that.modalName =  null;
						that.abcimg = "able";
						that.curCid = "";
						setTimeout(function () {
							uni.hideLoading();
						}, 1000);
						uni.showToast({
							title: "网络不太好哦",
							icon: 'none'
						})
					}
				})
			},
			
		}
	}
</script>

<style>
.article-item {
    padding: 24rpx;
    margin: 20rpx 0;
    border-radius: 12rpx;
    background: #fff;
}

.article-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24rpx;
}

.article-title {
    flex: 1;
    font-size: 30rpx;
    color: #333;
    line-height: 1.4;
}

.article-time {
    font-size: 24rpx;
    color: #999;
    flex-shrink: 0;
}

.article-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding-top: 20rpx;
    
}
.divider{
    border-top: 1rpx solid #eee;
}
.status-tags {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.author-name {
    font-size: 24rpx;
    color: #666;
}

.action-btns {
    display: flex;
    gap: 16rpx;
}

.action-btn {
    font-size: 24rpx;
    padding: 6rpx 16rpx;
    border-radius: 6rpx;
    display: inline-flex;
    align-items: center;
    gap: 4rpx;
}

.action-btn [class*="cuIcon-"] {
    font-size: 26rpx;
}

.approve-btn { color: #19be6b; }
.reject-btn { color: #ff9900; }
.recommend-btn { color: #2d8cf0; }
.top-btn { color: #2d8cf0; }
.edit-btn { color: #2d8cf0; }
.delete-btn { color: #ed4014; }

.action-btn:active {
    opacity: 0.8;
}

.data-select {
    display: flex;
    gap: 20rpx;
    padding: 20rpx;
    background: #fff;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
}

.filter-tag {
    padding: 12rpx 24rpx;
    font-size: 26rpx;
    color: #666;
    background: #f5f7fa;
    border-radius: 32rpx;
    transition: all 0.3s ease;
}

.filter-tag.active {
    color: #2d8cf0;
    background: rgba(45, 140, 240, 0.1);
    font-weight: 500;
}

.filter-tag:active {
    opacity: 0.8;
}
</style>
