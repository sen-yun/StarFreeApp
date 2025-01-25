<template>
	<view class="post" :class="AppStyle">
		<view class="header" :style="[{height:CustomBar + 'px'},{top:jpHeight + 'px'}]">
			<view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
				<view class="action" @tap="back">
					<text class="cuIcon-back"></text>
				</view>
				<view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
					<block v-if="type=='edit'">
						修改帖子
					</block>
					<block v-else>
						发布帖子
					</block>
				</view>
				<!--  #ifdef H5 || APP-PLUS -->
				<view class="action" @tap="submit">
					<!-- <text class="cuIcon-upload"></text> -->
					<button class="cu-btn round bg-blue">发布</button>
				</view>
				<!--  #endif -->
				
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">标题</view>
				<input placeholder="输入帖子标题" name="input" v-model="title"   @focus="ToisText(0)" @blur="ToisText(0)" :adjust-position="false" :focus="false"></input>
			<view class="picker" @tap="toCategory">
				<block v-if="categoryText==''">
					选择分类
				</block>
				<block v-else>
					<text class="text-green">已选择</text>
				</block>
				
				<text class="cuIcon-right"></text>
			</view>
			</view>
			
			<view class="edit-tool" style="background-color: white;margin:1px 0px;padding: 0px 20px;">
				<!--  #ifdef H5 || APP-PLUS -->
				<view class="OwO-box">
					
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
								蛆音娘
							</view>
						</view>
					</view>
				</view>
				<!--  #endif -->
				<text class="cuIcon-emoji" style="font-size:22px;" :style="{'color': isOwO ? '#3cc9a4' : ''}" @tap="OwO"></text>
				<!-- class="cuIcon-picfill" @tap="upload"></text>
				<text class="cuIcon-playfill" @tap="uploadVideo"></text>-->
				<text v-if="post_tool5==1" class="cuIcon-picfill" style="font-size:22px;" @tap="showModal" data-target="imgModal"></text>
				<text v-if="post_tool2==1" class="cuIcon-font" style="font-size:22px;" @tap="toCode"></text>
				<text v-if="post_tool4==1" class="cuIcon-attentionforbidfill" style="font-size:22px;" @tap="showModal" data-target="LinksModal2"></text>
				<text v-if="post_tool9==1" class="cuIcon-vip" style="color: #f7521e;font-size:22px;" @tap="showModal" data-target="LinksModal3"></text>
				<text v-if="post_tool10==1" class="cuIcon-musicfill" style="font-size:22px;" @tap="showModal" data-target="mp3Modal"></text>
				<text v-if="post_tool3==1" class="cuIcon-link" style="font-size:22px;" @tap="showModal" data-target="LinksModal"></text>
				
				<text v-if="post_tool6==1" class="cuIcon-tag" style="font-size:22px;" :class="tag!=''?'text-blue':''" @tap="addTag"></text>
				<view v-if="post_tool7==1">
				<text class="text-red cuIcon-shopfill" style="font-size:22px;" @tap="setShop" v-if="shopID==-1"></text>
				<text class="text-yellow cuIcon-shopfill" style="font-size:22px;" @tap="setShop" v-else></text>
				</view>
				
				
			</view>
			<view class="cu-form-group">
				<textarea maxlength="-1" v-if="z_kg==0" class="text" :adjust-position="false" :auto-blur="true" :focus="false" @input="textareaAInput" v-model="text" placeholder="输入帖子内容" :style="poststyle" @focus="ToisText(1)" @blur="ToisText(0)">
				</textarea>
				<scroll-view scroll-y class="text" v-if="z_kg==1"  :style="readstyle" @tap="toIsShow2(0,true)">
					<mp-html :content="textRead" :scroll-table="true" :selectable="true" :show-img-menu="true" :lazy-load="true" :markdown="true"/>
				</scroll-view>
			</view>
			
			<!--  #ifdef MP -->
			<view class="post-update bg-blue" @tap="submit">
				<text class="cuIcon-upload"></text>
			</view>
			<!--  #endif -->
		</form>
		<!--标题控件-->
		<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in 5" :key="index" @tap="toTitle(index +1)" >
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">标题 {{index +1}}</view>
								<radio class="round"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
		<!--插入回复可见-->
		<view class="cu-modal LinksModal" :class="modalName=='LinksModal2'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">设置回复可见</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl" style="background-color: white;">
					<input placeholder="输入隐藏内容" v-model="hide.title"/>
					<view class="post-link-type grid col-2">
						<!--<view class="post-link-box" @tap="toPostlinktype(0)" :class="postlinktype==0?'cur':''">
							<text>超链接</text>
						</view>-->
						<!--<view class="post-link-box" @tap="toPostlinktype(1)" :class="postlinktype==1?'cur':''">
							<text>远程图片</text>
						</view>-->
					</view>
				</view>
				
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue text-blue" @tap="hideModal">取消</button>
						<button class="cu-btn bg-blue margin-left" @tap="tohide">确定</button>
		
					</view>
				</view>
			</view>
		</view>
		<!--插入VIP可见-->
		<view class="cu-modal LinksModal" :class="modalName=='LinksModal3'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">设置VIP可见</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl" style="background-color: white;">
					<input placeholder="输入VIP可见内容" v-model="viptext.title"/>
					<view class="post-link-type grid col-2">
						
					</view>
				</view>
				
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue text-blue" @tap="hideModal">取消</button>
						<button class="cu-btn bg-blue margin-left" @tap="tovip">确定</button>
		
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal LinksModal" :class="modalName=='mp3Modal'?'show':''">
		  <view class="cu-dialog">
		    <view class="cu-bar bg-white justify-end">
		      <view class="content">插入音频</view>
		      <view class="action" @tap="hideModal">
		        <text class="cuIcon-close text-red"></text>
		      </view>
		    </view>
		    <view class="padding-xl" style="background-color: white;">
		      <input placeholder="音频标题" v-model="audio.title"/>
			  <view class="post-link-type grid col-2">
		      <input placeholder="音频链接" v-model="audio.url"/>
			   <button class="cu-btn bg-blue" style="margin-left:auto;" @tap="toWebview(mp3wz,'上传音频',token)">上传音频</button>
		      
			  </view><view class="post-link-type grid col-2">
		        <view class="cu-item">
		          <view class="title">循环播放</view>
		          				<switch @change="toloop" :class="audio.loop?'checked':''" :checked="audio.loop?true:false"></switch>
				  
		        </view>
		        <view class="cu-item">
					<view class="title">自动播放</view>
									<switch @change="toautoplay" :class="audio.autoplay?'checked':''" :checked="audio.autoplay?true:false"></switch>
		          
		        </view>
		      </view>
		     
		    </view>
		    <view class="cu-bar bg-white justify-end">
		      <view class="action">
		        <button class="cu-btn line-blue text-blue" @tap="hideModal">取消</button>
				<button class="cu-btn bg-blue margin-left" @tap="toMP3">插入</button>
		      </view>
		    </view>
		  </view>
		</view>
		<!--插入链接控件-->
		<view class="cu-modal LinksModal" :class="modalName=='LinksModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">插入外部链接</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl" style="background-color: white;">
					<input placeholder="链接标题" v-model="link.title"/>
					<input placeholder="http(s)://"  v-model="link.url"/>
					<view class="post-link-type grid col-2">
						<!--<view class="post-link-box" @tap="toPostlinktype(0)" :class="postlinktype==0?'cur':''">
							<text>超链接</text>
						</view>-->
						<!--<view class="post-link-box" @tap="toPostlinktype(1)" :class="postlinktype==1?'cur':''">
							<text>远程图片</text>
						</view>-->
					</view>
				</view>
				
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue text-blue" @tap="hideModal">取消</button>
						<button class="cu-btn bg-blue margin-left" @tap="tolinks">确定</button>
		
					</view>
				</view>
			</view>
		</view>
		<!--插入图片控件-->
		<view class="cu-modal LinksModal" :class="modalName=='imgModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">插入媒体</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl" style="background-color: white;">
					<view class="padding flex flex-direction">
						<view class="content">建议写完内容后上传</view><br>
						<button class="cu-btn bg-blue lg" @tap="upload">上传图片</button>
						<block v-if="post_tool8==1">
						<br>
						<button class="cu-btn line-blue lg" @tap="uploadVideo">上传视频</button>
						</block>
						<block  v-if="post_tool1==1">
						<br>
						<button class="cu-btn line-red lg" @tap="goImgData">免费图库</button>
						</block>
					</view>
				</view>
			
			</view>
		</view>
		<!--xss提示控件-->
		<view class="cu-modal" :class="modalName=='xss'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">安全提示</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl text-left">
					<view>检测到该帖子的内容存在可执行的代码，为了您的系统安全，请你确认帖子内容不存在如：<text class="text-bold text-red">未知远程js、未知的接口请求代码、未知的网页嵌套、未知的表单提交等</text>可能触发xss漏洞的代码。</view>
					<view>如您已经确认无误，可点击下方按钮继续。</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn bg-blue margin-left">预览</button>
		
					</view>
				</view>
			</view>
		</view>
		<tn-popup v-model="modelVisible" mode="bottom" :borderRadius="23" :maskCloseable="false">
				      <view style="padding: 30rpx 40rpx;">
						  <view style="text-align: center;">社区发帖规范</view>
						  <view class="model-body" v-html="posttext" style="margin-top: 20rpx;"></view>
						  <view style="display: flex;justify-content: center;margin-top: 20rpx;">
						  	<tn-button style="margin-left: 20rpx;" backgroundColor="#3cc9a4" fontColor="#fff" @tap="okBtn">知道了</tn-button>
						  </view>
					  </view>
				</tn-popup>
		<!--插入商品控件-->
		<view class="setShop" v-if="isShop">
			<view class="setShop-bg" @tap="isShop=0"></view>
			<view class="setShop-box">
				<view class="setShop-main">
					<view class="setShop-title">
						选择商品插入帖子
						<text class="setShop-close cuIcon-close" @tap="isShop=0"></text>
						
					</view>

					<scroll-view class="setShop-list" scroll-y>
						<view class="setShop-list-box" v-for="(item,index) in shopList" @tap="toShop(item.id)" :class="item.id==shopID?'cur':''" :key="index">
							<view class="setShop-list-main">
								<text class="cuIcon-moneybagfill text-red"></text>{{item.title}}
							</view>
							<view class="setShop-status">
								<text v-if="item.cid!=-1">CID：{{item.cid}}</text>
								<text v-else class="text-green">未插入帖子</text>
							</view>
							
						</view>

					</scroll-view>
					<view class="setShop-btn text-center">
						<text class="cu-btn radius bg-blue" @tap="toAddShop">添加商品</text>
					</view>
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
				
				modalName:"",
				token:"",
				z_kg:1,
				isShow:false,
				posttext:"",
				curHeight:0,
				jpHeight:0,
				screenHeight:0,
				postheight:0,
				poststyle:"",
				readstyle:"",
				username:"",
				isText:0,
				//帖子表单部分
				title:"",
				category:"",
				tag:"",
				categoryText:"",
				text:'',
				author:'',
				poster:this.$API.SMmusicpic(),
				textRead:"",
				link:{
					title:"",
					url:"",
				},
				hide:{
					title:"",
				},
				audio:{
					title:"",
					url:"",
					loop:false,
					autoplay:false,
				},
				viptext:{
					title:"",
				},
				modelVisible: true,
				modalName: null,
				shopList:[],
				restrictedIds:[],
				xzcategory:"",
				isShop:0,
				shopID:-1,
				mp3wz:this.$API.GetMp3Url(),
				//页面状态
				type:"add",
				cid:0,
				post_tool1:0,
				post_tool2:0,
				post_tool3:0,
				post_tool4:0,
				post_tool5:0,
				post_tool6:0,
				post_tool7:0,
				post_tool8:0,
				post_tool9:0,
				post_tool10:0,
				isOwO:false,
				owo:owo,
				owoList:[],
				OwOtype:"paopao",
				group:"",
				postlinktype:0,
				
				start:-1,
				
				toImg:false,
				isSpace:false,
				
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
			if(localStorage.getItem('userinfo')){
				var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.token=userInfo.token;
			}
			if(localStorage.getItem('clist')){
				that.categoryText = "已选择";
				that.category = localStorage.getItem('clist');
			}
			if(localStorage.getItem('ctag')){
				that.tag = localStorage.getItem('ctag');
			}
			if(localStorage.getItem('serImage')){
				that.modalName = null;
				var serImage = localStorage.getItem('serImage');
				var h = "";
				if(that.text!=""){
					h="\n";
				}
				var text = h+"![图片名称]("+serImage+") \n";
				//that.text+=text;
				that.insetText(text);
				localStorage.removeItem('serImage');
			}
			if(localStorage.getItem('token')){
				that.getviphide();
			}
			// #ifdef APP-PLUS || H5
			that.owoList = that.owo.data.paopao.container;
			// #endif
		},
		onHide() {
			var that = this;
			//localStorage.removeItem('clist')3 * 60 * 60 * 1000
		},
		onLoad(res) {
			
			const modelViewTime = uni.getStorageSync('modelView');
						if(modelViewTime){
							console.log(modelViewTime);
							const nowDate = +new Date();
							const isVisible = nowDate - modelViewTime > 1;
							if(!isVisible) {
								this.modelVisible = false;
							}
						}
			var that = this;
			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			if(res.qzpost){
				that.qztitle = res.qztitle;
				that.qztitle = res.qzmid;
			}
			if(res.type){
				that.type = res.type;
				
				if(res.cid){
					that.cid = res.cid;
					that.getInfo(that.cid);
					
				}
			}
			if(res.isSpace){
				if(res.isSpace==1){
					that.isSpace = true;
				}
			}
			that.getShopList();
			
			//键盘弹出相关
			let screenHeight = uni.getSystemInfoSync().screenHeight;
			let statusHeight= uni.getSystemInfoSync().statusBarHeight;
			let inputHeight = screenHeight - statusHeight - 290;
			// #ifdef APP-PLUS
			inputHeight = screenHeight - statusHeight - 300;
			// #endif
			// #ifdef H5
			inputHeight = 400;
			// #endif
			
			that.screenHeight = screenHeight - that.NavBar;
			that.postheight = inputHeight;
			//
			//that.poststyle = "height:200upx";
			that.poststyle = "height:"+inputHeight+"px";
			that.readstyle = "height:"+(inputHeight+30)+"px;white-space: pre-wrap;";
			// #ifdef H5
			//that.h5Keyboard();
			// #endif
			// #ifdef APP-PLUS
			uni.onKeyboardHeightChange(res => {
				//监听软键盘的高度 
				//当点击软键盘自带的收起按钮的时候也就是会隐藏软键盘 这时候监听到的软键盘的高度就是0 、
				//让输入框取消焦点 这时候再去输入内容的时候 输入框就会弹起
				if (res.height == 0) {
				
					that.focalize(res.height);
					that.poststyle = "height:"+inputHeight+"px";
					
				} else {
					that.curHeight=res.height;
					var keyHeight = inputHeight - res.height;
					that.focus(res.height);
					that.poststyle = "height:"+keyHeight+"px";
				}
			});
			// #endif
			localStorage.removeItem('clist')
		},
		mounted() {
					 this.getset();
					 
					 this.qzxz();
					 setTimeout(() => {
					   this.toIsShow2(1,true);
					 }, 1000);
					      
					  
					},
		methods: {
			
			getset() {
			  var that = this;
			      uni.request({
			        url:that.$API.SMset(),
			        method:'GET',
			        dataType:"json",
			        success(res) {
						that.post_tool1 = res.data.post_tool1;
						that.post_tool2 = res.data.post_tool2;
						that.post_tool3 = res.data.post_tool3;
						that.post_tool4 = res.data.post_tool4;
						that.post_tool5 = res.data.post_tool5;
						that.post_tool6 = res.data.post_tool6;
						that.post_tool7 = res.data.post_tool7;
						that.post_tool8 = res.data.post_tool8;
					    that.posttext = res.data.posttext;
					  
			        },
			        fail(error) {
			          console.log(error);
			        }
			      })
			},
			getviphide() {
			  var that = this;
			      uni.request({
			        url:that.$API.SMviphide(),
					data:{
						token:that.token
					},
			        method:'GET',
			        dataType:"json",
			        success(res) {
						that.post_tool9 = res.data.post_tool9;
						that.post_tool10 = res.data.post_tool10;
					  
			        },
			        fail(error) {
			          console.log(error);
			        }
			      })
			},
			toloop(e) {
				this.audio.loop = e.detail.value
			},
			toautoplay(e) {
				this.audio.autoplay = e.detail.value
			},
			okBtn() {
							const nowDate = +new Date();
							uni.setStorageSync('modelView', nowDate);
							this.cancleBtn();
						},
			cancleBtn() {
							this.modelVisible = false;
						},
			markHtml(text){
				var that = this;
				text = that.replaceAll(text,"@!!!","@@@@");
				text = that.replaceAll(text,"!!!","");
				text = that.replaceAll(text,"@@@@","@!!!");
				text = that.replaceAll(text,"[audio","<audio");
				text = that.replaceAll(text,"width='100%']","width='100%' audio>");
				text = that.replaceAll(text,"[/audio]","</audio>");
				text = that.replaceAll(text,"[hide]","<div style='width:100%;padding:15px 15px;color:#666666;border:solid 1px #3cc9a4;box-sizing: border-box;border-radius: 20px;word-break:break-all;'><div style='width:100%;color:#3cc9a4;word-break:break-all;'>回复可见</div>");
				text = that.replaceAll(text,"[/hide]","</div>");
				text = that.replaceAll(text,"[vip]","<div style='width:100%;padding:15px 15px;color:#666666;border:solid 1px #fb7299;box-sizing: border-box;border-radius: 20px;word-break:break-all;'><div style='width:100%;color:#fb7299;word-break:break-all;'>会员可见</div>");
				text = that.replaceAll(text,"[/vip]","</div>");
				var owoList=that.owoList;
				for(var i in owoList){
					if(text.indexOf(owoList[i].data) != -1){
						text = that.replaceAll(that.replaceSpecialChar(text),owoList[i].data,"<img src='"+owoList[i].icon+"' class='tImg' />")
						
					}
				}
				//text = text.replace(/(?<!\r)\n(?!\r)/g, "\n\n");
				//兼容垃圾的Safari浏览器
				text = text.replace(/([^\r])\n([^\r])/g, "$1\n\n$2");
				text = that.replaceAll(text,"||rn||","\n\n");
				return text;
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
			replaceAll(string, search, replace) {
			  return string.split(search).join(replace);
			},
			ToisText(i){
				var that= this;
				that.isText = i;
				
				if (that.curHeight != 0&&that.isText==1) {
					that.focus(that.curHeight);
				}
				 if (that.isText == 1) {
				        that.toIsShow2(0,true);
						  
				      } else {
				        that.toIsShow2(1,false);
				      }
				 
				uni.getSelectedTextRange({
				  success: res => {
				    //console.log('getSelectedTextRange res', res.start, res.end);
					that.start = res.start;
				  }
				})
			},
			insetText(newStr){
				var that= this;
				var start = that.start;
				var text = that.text;
				if(start==-1){
					text+=newStr;
				}else{
					text = text.slice(0, start) + newStr + text.slice(start);
				}
				that.text = text;
				that.textRead = that.markHtml(that.text);
			},
			focus(h){
				var that = this;
				if(that.isText==0){
					return false;
				}
				// #ifdef APP-PLUS
				// let screenHeight = uni.getSystemInfoSync().screenHeight;
				// let statusHeight= uni.getSystemInfoSync().statusBarHeight;
				// let inputHeight = screenHeight - statusHeight - 240;
				// that.screenHeight = screenHeight - statusHeight - 5;
				// let height = h;
				// let postheight = that.postheight - height;

				// that.jpHeight =height - statusHeight;
				
				
				// that.postheight = postheight;
				// that.poststyle = "height:"+postheight+"px";
				// that.readstyle = "height:"+(inputHeight+30)+"px";
				// #endif
			},
			focalize(h){
				var that = this;
				// #ifdef APP-PLUS
				// let screenHeight = uni.getSystemInfoSync().screenHeight;
				// let statusHeight= uni.getSystemInfoSync().statusBarHeight;
				// that.screenHeight = screenHeight - that.NavBar;
				// let inputHeight = screenHeight - statusHeight - 250;
				// that.jpHeight =0;
				// that.postheight = inputHeight;
				// that.poststyle = "height:"+inputHeight+"px";
				// #endif
			},
			back(){
				localStorage.removeItem('clist');
				uni.navigateBack({
					delta: 1
				});
			},
			PickerChange(e) {
				this.index = e.detail.value
			},
			hideModal() {
				this.modalName = null
			},
			textareaAInput(){
				var that = this;
				uni.getSelectedTextRange({
				  success: res => {
				    //console.log('getSelectedTextRange res', res.start, res.end);
					that.start = res.start;
				  }
				})
				that.textRead = that.markHtml(that.text);
				
			},
			//编辑器工具开始
			toBold(){
				var that = this;
				var h = "";
				var text = h+"**加粗文字**";
				//that.text+=text;
				that.insetText(text);
				
			},
			toItalic(){
				var that = this;
				var h = "";
				var text = h+"*斜体文字* ";
				//that.text+=text;
				that.insetText(text);
				
			},
			toTitle(num){
				var that = this;
				var text = "";
				for (var i=0;i<num;i++)
				{ 
				    text=text+"#";
				}
				var h = "";
				if(that.text!=""){
					h="\n";
				}
				var title = h+text+" 标题文字";
				//that.text+=title;
				that.insetText(title);
				
				that.hideModal();
			},
			toCode(){
				var that = this;
				var h = "";
				if(that.text!=""){
					h="\n";
				}
				var text = h+"```javascript\n代码片段\n```";
				//that.text+=text;
				that.insetText(text);
				
			},
			
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
				
			},
			hideModal(e) {
				this.modalName = null
			},
			tohide(){
				var that = this;
				var hide = that.hide;
				if(hide.title==""){
					uni.showToast({
					    title:"请输入要隐藏的内容",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
			var text;
			text = "\n [hide]\n \n"+hide.title+"\n \n [/hide] \n";
			that.insetText(text);
				that.hide = {
					title:"",
				}
				that.hideModal();
			},
			
			tovip(){
				var that = this;
				var viptext = that.viptext;
				if(viptext.title==""){
					uni.showToast({
					    title:"请输入VIP查看的内容",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
			var text;
			text = "\n [vip] \n \n"+viptext.title+"\n \n [/vip]\n";
			that.insetText(text);
				that.viptext = {
					title:"",
				}
				that.hideModal();
			},
			toMP3(){
				var that = this;
				var audio = that.audio;
				
				if(audio.title==""||audio.url==""){
					uni.showToast({
					    title:"请将数据输入完整",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				if (localStorage.getItem('userinfo')) {
				  var userInfo = JSON.parse(localStorage.getItem('userinfo'));
				  var name = '';
				  name = userInfo.screenName !== undefined ? userInfo.screenName : userInfo.name;

				if(audio.autoplay==""){
					audio.autoplay = "";
				} else {
					audio.autoplay = 'autoplay=""';
				}
				if(audio.loop==""){
					audio.loop = "";
				} else {
					audio.loop = 'loop="true"';
				}
			var text = `\n\n[audio src="${audio.url}" poster="${that.poster}" name="${audio.title}" author="${name}" ${audio.loop} ${audio.autoplay} width='100%'][/audio]\n\n`;
			that.insetText(text);
				that.audio = {
					title:"",
					url:"",
					loop:"",
					autoplay:"",
					author:"",
				}
				that.hideModal();
				}
			},
			tolinks(){
				var that = this;
				var link = that.link;
				if(link.title==""||link.url==""){
					uni.showToast({
					    title:"请输入正确的参数",
						icon:'none',
						duration: 1000,
						position:'bottom',
					});
					return false
				}
				var text;
				if(that.postlinktype==0){
					text = " \n["+link.title+"]("+link.url+") \n";
				}
				if(that.postlinktype==1){
					text = " \n!["+link.title+"]("+link.url+") \n";
				}
				//that.text+=text;
				//that.text+=text;
				that.insetText(text);
				that.link = {
					title:"",
					url:"",
				}
				that.hideModal();
			},
			upload(){
				let that = this				
				uni.chooseImage({
					count: 9,  // 最多可以选择的图片张数，默认9
					sourceType: ['album', 'camera'], 
					sizeType:['compressed'],
				    success: function (res) {						
						uni.showLoading({
							title: "加载中"
						});
						const tempFilePaths = res.tempFilePaths;
						for(let i = 0;i < tempFilePaths.length; i++) {
							const uploadTask = uni.uploadFile({
							  url : that.$API.upload(),
							  filePath: tempFilePaths[i],
							  name: 'file',
							  formData: {
							   'token': that.token
							  },
							  success: function (uploadFileRes) {
								  let count = 0;
								  count++;
								  if(count==tempFilePaths.length){
									  that.hideModal();
									  setTimeout(function () {
									  	uni.hideLoading();
									  }, 1000);
								  }
									var data = JSON.parse(uploadFileRes.data);
									//var data = uploadFileRes.data;
									uni.showToast({
										title: data.msg,
										icon: 'none'
									})
									if(data.code==1){
									   //插入帖子
										var h = "";
										if(that.text!=""){
											h="\n \n";
										}
										var text = h + "\n![图片名称]("+data.data.url+")\n";
										//that.text+=text;
										that.insetText(text);
									}
								},fail:function(){
									setTimeout(function () {
										uni.hideLoading();
									}, 1000);
								}
								
							   
							});
						}
					}
				})
			},
			uploadVideo(){
				var that = this;
				
				uni.chooseVideo({
					sourceType: ['camera', 'album'],
					compressed:false,
					success: (responent) => {
						uni.showLoading({
							title: "加载中"
						});
						let videoFile = responent.tempFilePath;
						const uploadTask = uni.uploadFile({
						  url : that.$API.upload(),
						  filePath:videoFile,
						  name: 'file',
						  formData: {
						   'token': that.token
						  },
						  
						  success: function (uploadFileRes) {
						  								  let count = 0;
						  								  count++;
						  								  if(count==1){
						  									  that.hideModal();
						  									  setTimeout(function () {
						  									  	uni.hideLoading();
						  									  }, 1000);
						  								  }
								var data = JSON.parse(uploadFileRes.data);
								//var data = uploadFileRes.data;
								uni.showToast({
									title: data.msg,
									icon: 'none'
								})
								if(data.code==1){
								   var h = "";
								   if(that.text!=""){
								   	h="\n";
								   }
								   var text = h+`\n!!!\n<video src="${data.data.url}" controls width="100%"></video>\n!!!\n
								   `;
								   //that.text+=text;
								   that.insetText(text);
								}
							},fail:function(){
								uni.showToast({
									title: "网络异常，上传失败！",
									icon: 'none'
								})
								setTimeout(function () {
									uni.hideLoading();
								}, 1000);
							}
							
						   
						});
					}
				})
			}, 
			toWebview(url,title,token) {
				var that = this;
				if (!localStorage.getItem('token')) {
					uni.showToast({
						title: "请先登录！",
						icon: 'none'
					})
					return false;
				}
				uni.navigateTo({
					url: '/pages/user/webview?url=' + url + "&title=" + title + "&token=" + token
				});
			},
			toIsShow2(kg,isTo){
				var that= this;
				var group = "";
				if(localStorage.getItem('userinfo')){
					
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					var group = userInfo.group;
				}
				if(!isTo&&!that.isShow){
					if(group=='administrator'||group=='editor'){
						if(that.text.indexOf("<script>")!=-1||that.text.indexOf("<form>")!=-1||that.text.indexOf("<iframe>")!=-1||that.text.indexOf("<frame>")!=-1){
							
							that.modalName = "xss"
							return false;
						}
					}
				}
				that.textRead = that.markHtml(that.text);
				if(kg==1){
					that.z_kg = 1;
					console.log(that.z_kg);
				} else {
					that.z_kg = 0;
					console.log(that.z_kg);
				}
			},
			qzxz(){
				var that = this;
				if(localStorage.getItem('userinfo')){
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					that.group = userInfo.group;
					
				}
				uni.request({
					url:that.$API.SMqzxz(),
					method:'GET',
					dataType:"json",
					success(res) {
						that.restrictedIds = res.data.xzcategory.split(',').map(Number);
						
					},
					fail() {
						console.log(error);
					}
				})
				
			},
			submit(){
				var that = this;
				var type = that.type;
				if(type=="add"){
					that.contentsAdd();
				}else{
					that.contentsUpdate();
				}
				// if(that.shopID!=-1){
				// 	that.mountShop();
				// }
				
			},
			contentsAdd() {
				var that = this;
				var categories = that.category.split(","); 
				for (var i = 0; i < categories.length; i++) { 
					categories[i] = parseInt(categories[i]);
				if (that.group !== 'administrator') {
				  if (that.restrictedIds.includes(categories[i])) {
				    uni.showToast({
				      title: '您不能选择该分类',
				      icon: 'none',
				      duration: 1000,
				    });
				    return false;
				  }
				}
				}
				if (that.title == "") {
					uni.showToast({
						title:"请输入帖子标题",
						icon:'none',
						duration: 1000,
					});
					return false
				}
				if (that.text == "") {
					uni.showToast({
						title:"请输入帖子内容",
						icon:'none',
						duration: 1000,
					});
					return false
				}
				if (that.category == "") {
					uni.showToast({
						title:"请选择分类",
						icon:'none',
						duration: 1000,
					});
					return false
				}
				
				if (that.title.length < 5) {
				    uni.showToast({
				        title: "标题长度不能少于5个字符",
				        icon: 'none',
				        duration: 1000,
				    });
				    return false;
				}
				if (that.text.length < 20) {
				    uni.showToast({
				        title: "内容少于20字，请勿水贴",
				        icon: 'none',
				        duration: 1000,
				    });
				    return false;
				}
				var isSpace = 0;
				if(that.isSpace){
					isSpace = 1;
				}
				var data = {
					'title':that.title,
					'category':that.category,
					'tag':that.tag,
					'sid':that.shopID
				}
				var text = that.text;
				text = text.replace(/\r\n/g,"||rn||");
				text = text.replace(/\n/g,"||rn||");
				uni.showLoading({
					title: "加载中"
				});
				that.$Net.request({
					
					url: that.$API.contentsAdd(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token":that.token,
						'text':text,
						"isSpace":0,
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
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
							title: "网络不太好哦，发布失败",
							icon: 'none',
						})
						uni.stopPullDownRefresh()
					}
				})
			},
			contentsUpdate() {
				var that = this;
				var categories = that.category.split(",");
				for (var i = 0; i < categories.length; i++) { 
					categories[i] = parseInt(categories[i]);
				if (that.group !== 'administrator') {
				  if (that.restrictedIds.includes(categories[i])) {
				    uni.showToast({
				      title: '您不能选择该分类',
				      icon: 'none',
				      duration: 1000,
				    });
				    return false;
				  }
				}
				}
				if (that.title == "") {
					uni.showToast({
						title:"请输入帖子标题",
						icon:'none',
						duration: 1000,
					});
					return false
				}
				if (that.text == "") {
					uni.showToast({
						title:"请输入帖子内容",
						icon:'none',
						duration: 1000,
					});
					return false
				}
				if (that.category == "") {
					uni.showToast({
						title:"请选择分类",
						icon:'none',
						duration: 1000,
					});
					return false
				}
				if (that.title.length < 5) {
				    uni.showToast({
				        title: "标题长度不能少于5个字符",
				        icon: 'none',
				        duration: 1000,
				    });
				    return false;
				}
				if (that.text.length < 20) {
				    uni.showToast({
				        title: "内容少于20字，请勿水贴",
				        icon: 'none',
				        duration: 1000,
				    });
				    return false;
				}
				var data = {
					'cid':that.cid,
					'title':that.title,
					'category':that.category,
					'tag':that.tag,
					'sid':that.shopID
				}
				uni.showLoading({
					title: "加载中"
				});
				var text = that.text;
				text = text.replace(/\r\n/g,"||rn||");
				text = text.replace(/\n/g,"||rn||");
				that.$Net.request({
					
					url: that.$API.contentsUpdate(),
					data:{
						"params":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"token":that.token,
						'text':text
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "post",
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
							localStorage.removeItem('clist');
							localStorage.removeItem('ctag');
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
							title: "网络不太好哦",
							icon: 'none'
						})
						uni.stopPullDownRefresh()
					}
				})
			},
			getInfo(cid){
				var that = this;
				var token = "";
				if(localStorage.getItem('userinfo')){
					
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
					
				}
				var data = {
					"key":that.cid,
					"token":token,
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
						if(res.data.title){
							
							that.title = res.data.title;
							if(res.data.category.length>0){
								that.categoryText = "已选择";
								var list = res.data.category;
								var clist ="";
								for(var i in list){

									clist += ","+list[i].mid;
									
								}
								localStorage.setItem('clist',clist);
								that.category = clist;
								
							}
							if(res.data.tag.length>0){
								var list = res.data.tag;
								var ctag ="";
								for(var i in list){
							
									ctag += ","+list[i].mid;
									
								}
								localStorage.setItem('ctag',ctag);
								that.tag = ctag;
								
							}
							
							that.text=res.data.text;
						}
					},
					fail: function(res) {
					}
				})
			},
			toMate(data){
				var that = this;
				that.categoryText = data.name;
				that.category = data.mid,
				that.hideModal();
			},
			setShop(){
				var that=this;
				that.isShop = 1;
			},
			toShop(id){
				var that=this;
				that.shopID = id;
				that.isShop = 0;
			},
			getShopList(){
				var that = this;
				var uid= 0;
				if(localStorage.getItem('userinfo')){
					
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					uid = userInfo.uid;
					
				}else{
					uni.showToast({
					    title:"请先登录",
						icon:'none',
						duration: 1000,
					});
					var timer = setTimeout(function() {
						uni.navigateTo({
							url: '/pages/user/login'
						});
						clearTimeout('timer')
					}, 1000)
					return false
				}
				var data = {
					"uid":uid,
					"status":1,
				}
				that.$Net.request({
					url: that.$API.shopList(),
					data:{
						"searchParams":JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit":1000,
						"page":1,
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {

						if(res.data.code==1){
							var list = res.data.data;
							that.shopList = list;
	
							
							if(that.cid!=0){
								for(var i in list){
									if(list[i].cid == that.cid){
										
										that.shopID = list[i].id;
									}
								}
							}
							
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "网络不太好哦",
							icon: 'none'
						})
						
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
				//that.text+=text;
				that.insetText(text);
				that.textRead = that.markHtml(that.text);
			},
			OwO(){
				var that = this;
				that.isOwO = !that.isOwO;
			},
			toCategory(){
				var that = this;
				uni.navigateTo({
				    url: '/pages/contents/allcategory?type=edit'
				});
			},
			addTag(){
				var that = this;
				uni.navigateTo({
				    url: '/pages/contents/alltag?type=edit'
				});
			},
			toPostlinktype(i){
				var that = this;
				that.postlinktype = i;
			},
			toAddShop(){
				var that = this;
				uni.navigateTo({
				    url: '/pages/user/addshop'
				});
			},
			goImgData(){
				var that = this;
				uni.navigateTo({
				    url: '/pages/contents/imagetoday?type=post'
				});
			},
			
		}
	}
</script>

<style>
.edit-tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.edit-tool uni-text {
    display: inline-block;
    margin: 0px 4px;
    width: 16px;
    font-size: 16px;
    flex-grow: 1;
    flex-basis: 0;
	}
.page{
	overflow: hidden;
}
.post{
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
}
</style>
