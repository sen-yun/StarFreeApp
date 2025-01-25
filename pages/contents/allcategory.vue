<template>
	<view class="user" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					<block v-if="type=='edit'">选择一个</block>分类
				</view>
					
				<!--  #ifdef H5 || APP-PLUS -->
				<block v-if="type=='edit'">
				<view class="action" @tap="submit">
					<text class="cu-btn bg-shojo text-sm radius">确定</text>
				</view>
				</block>
				<!--  #endif -->
					
			</view>
		</view>
		
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		
		<view class="data-box">
			<view class="no-data" v-if="metaList.length==0">
				<text class="cuIcon-text"></text>暂时没有数据
			</view>

			
			<view class="container">
			<br>
			    <view class="ghj234">
			      <block  v-for="(item,index) in metaList" :key="index">
			        <view class="klm098" @tap="toCategoryContents(item.name,item.mid,index)" :class="item.active==1?'active':''">
			          <view class="poi321">
			            <view class="image-picbook" :style="'background-image:url(' + item.imgurl + ')'"></view>
			            <view class="tn-blogger-content__label">
			              <text class="tn-blogger-content__label__desc">{{ item.name }}</text>
			            </view>
			          </view>
			        </view>
			      </block>
			  </view>
			   </view>
			
			
			
		</view>

		<!--  #ifdef MP -->
		<block v-if="type=='edit'">
		<view class="post-update bg-blue" @tap="submit">
			<text class="cuIcon-upload"></text>
		</view>
		</block>
		<!--  #endif -->
		<!--加载遮罩-->
		<view class="loading" v-if="isLoading==0">
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
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar:this.StatusBar +  this.CustomBar,
			AppStyle:this.$store.state.AppStyle,
				
				metaList:[],
				searchText:"",
				
				isLoading:0,
				
				type:"all",
				curNum:0,
				
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
			
			
		},
		onLoad(res) {
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			that.getMetaList();
			if(res.type){
				that.type = res.type;
			}
		},
		methods: {
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			getMetaList(){
				var that = this;
				var data = {
					"type":"category"
				}
				that.$Net.request({
					url: that.$API.getMetasList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":100,
						"page":1,
						"order":"order"
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if(res.data.code==1){
							var list = res.data.data;
							if(list.length>0){

								var newList = [];
								for(var i in list){
									list[i].active = 0;
									if(that.type=="edit"){
										if(localStorage.getItem('clist')){
											var clist= localStorage.getItem('clist');
											var arr = clist.split(",");
											
											for(var j in arr){
												if(arr[j]!=""){
													var index = Number(arr[j]);
													if(list[i].mid == index){
														list[i].active=1;
														that.curNum++;
													}
													
												}
											}
										}
										
									}
									newList.push(list[i]);
								}
								
								
								that.metaList = newList;
								
								localStorage.setItem('find_metaList',JSON.stringify(that.metaList));
							}
						}
						var timer = setTimeout(function() {
							that.isLoading=1;
							clearTimeout('timer')
						}, 300)
					},
					fail: function(res) {
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
			},
			toCategoryContents(title,id,index){
				var that = this;
				if(that.type=="all"){
					var type="meta";
					uni.navigateTo({
					    url: '/pages/contents/contentlist?title='+title+"&type="+type+"&id="+id
					});
				}else{
					
					if(that.metaList[index].active==1){
						that.curNum--;
						that.metaList[index].active=0;
					}else{
						if(that.curNum>0){
							uni.showToast({
								title: "最多选择一个分类",
								icon: 'none'
							});
							return false;
						}
						that.curNum++;
						that.metaList[index].active=1;
					}
					
				}
				
			},
			submit(){
				var that = this;
				var clist ="";
				var list = that.metaList;
				for(var i in list){
					if(list[i].active==1){
						clist += ","+list[i].mid;
					}
				}
				if(clist==""){
					uni.showToast({
						title: "请选择分类",
						icon: 'none'
					});
					return false;
				}
				localStorage.setItem('clist',clist);
				//存入本地缓存后，恢复原本
				var old_list = that.metaList;
				for(var i in list){
					that.metaList[i].active=0;
				}
				that.back();
				
			},

		}
	}
</script>

<style>

	/* 为class属性添加偏僻词 */
	.data-box{
		margin-top: 0px;
		}
		.container {
		margin-left: 12px;
		  padding: 1px;
		  border-radius: 10px;
		}
		/* 用偏僻词替换class属性 */
		.ghj234 {
		  display: flex;
		  flex-wrap: wrap;
		}
		
		.ghj234 .klm098 {
		  width: 45%;
		  box-sizing: border-box;
		  padding: 10px 5px 10px 5px;
		  background-color: #fff;
		  border-radius: 10px;
		  box-shadow: 0px 5px 5px rgb(207 207 207 / 30%);
		  margin-bottom: 15px;
		  margin-right: 8px;
		}
		.ghj234 .klm098.active {
			color: #fff;
			background-color:  #3cc9a4;
			box-shadow: 0upx 0upx 15upx #3cc9a4;
		  }

		
		
		.ghj234 .klm098 .poi321 {
		  display: flex;
		  align-items: center;
		}
		
		.ghj234 .klm098 .poi321 .image-picbook {
		  width: 30px;
		  height: 30px;
		  background-size: cover;
		  border-radius: 50%;
		  margin-right: 15px;
		}
		
		.ghj234 .klm098 .poi321 .tn-blogger-content__label {
		  display: flex;
		  flex-direction: column;
		  justify-content: center;
		}
		
		.ghj234 .klm098 .poi321 .tn-blogger-content__label .tn-blogger-content__label__desc {
		  font-size: 12px;
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
