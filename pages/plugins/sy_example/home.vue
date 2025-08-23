<template>
  <view class="user" style="min-height:auto">
    <view class="header" :style="[{height:CustomBar + 'px'}]">
      <view class="cu-bar bg-white" :style="{'height': CustomBar + 'px','padding-top':StatusBar + 'px'}">
        <!-- 顶栏 -->
        <view class="action" @tap="back">
          <!-- 左上角 默认为返回上一页按钮 -->
          <text class="cuIcon-back"></text>
        </view>
        <view class="content text-bold" :style="[{top:StatusBar + 'px'}]">
          <!-- 标题 -->
          标题
        </view>
        <view class="action">
          <!-- 右上角 默认无 -->
        </view>
      </view>
    </view>
    <view :style="[{padding:(NavBar+5) + 'px 10px 0px 10px'}]"></view>
    <!-- 页面内容开始 -->
    <view class="bg-white margin-top-sm padding">
      <view class="hello-title">Hello StarPlugin！</view>
      <view class="hello-text margin-top-sm">我的第一个Star插件</view>
      <view class="margin-top">
        <button class="plugin-author margin-top-sm" @click="toPlugins()">发送请求</button><!-- 按钮 -->
        <view class="plugin-author margin-top-sm">
          <block v-if="sy_code!=0"> 
            <!-- 当返回的code不等于0时候显示里面的内容 -->
            我的第一个请求： <br />
            返回信息：{{sy_msg}} <br />
            返回数据：{{sy_text}} <br />
            下拉刷新会重置请求数据
            <!-- 前端页面要调用js中的全局变量时，用{{变量名}}的方式调用 -->
          </block>
        </view>
      </view>
    </view>
    <!-- 页面内容结束 -->
  </view>
</template>

<script>
  import {
		localStorage
	} from '../../../js_sdk/mp-storage/mp-storage/index.js'//引入缓存js
  export default {
    data() {
      return { // 在此处定义数据属性（定义该页面中的全局变量）
        //初始必要变量，用于生成顶栏高度
        StatusBar: this.StatusBar,
        CustomBar: this.CustomBar,
        NavBar: this.StatusBar + this.CustomBar,
        AppStyle: this.$store.state.AppStyle,
        //其他变量
        sy_code: 0, //（定义时注意数据类型）
        sy_msg: "",
        sy_text: "",

      }
    },
    onPullDownRefresh() {//下拉刷新时触发
      var that = this;
      //这里将变量重置，相当于重置请求
      that.sy_code = 0;
      that.sy_msg = "";
      that.sy_text = "";
      //收回下拉刷新
      var timer = setTimeout(function() {
        uni.stopPullDownRefresh();
      }, 1000)//下拉刷新后，刷新图标会存在1000毫秒（1秒）
    },
    onShow() {//显示该页面时触发
      var that = this;

    },
    onLoad() {//加载该页面时触发
      var that = this;

    },
    methods: {
      //-------放置函数 Start-------

      toPlugins() {//请求插件函数
        var that = this;
        //设置传入参数
        uni.request({
          url:that.$API.PluginLoad('sy_example'),//括号中填插件名
          data: {
            "action": "hello", //【必要】请求动作
          },
          method: 'GET', //请求方式
          dataType: "json",
          success(res) { //发送请求成功
            if (res.data.code == 200) {
              //插件处理成功
              console.log(res.data);//控制台打印返回的所有数据
              //把返回数据分别给变量赋值
              that.sy_code = res.data.code;//返回的code
              that.sy_msg = res.data.msg;//返回的msg
              that.sy_text = res.data.data.text;//返回刚才传入的数据1
              //弹窗显示请求成功
              uni.showToast({
                title: "请求成功",//弹窗内容
                icon: 'success'//成功的弹窗图标
                  })
						} else {
							//插件处理未成功
							console.log(res.data);
							that.sy_code = res.data.code;
							that.sy_msg = res.data.msg;
							//弹窗显示失败信息
							uni.showToast({
								title:  res.data.msg,
								icon: 'none'//弹窗不显示图标
							})
						}
					},
					fail(error) { //发送请求失败
						console.log(error); //控制台打印报错
						//弹窗显示失败信息
						uni.showToast({
							title:  "网络开小差了",
							icon: 'none'
						})
					}
				})

			},
			back() {//返回上一页函数
				uni.navigateBack({
					delta: 1
				});
			},

			//-------放置函数 End-------
		},
	}
</script>

<style lang="scss" scoped>
	// 在此处编辑CSS样式

	//【方式一】引入css
	//@import "/style/style1.css";

	//【方式二】直接编写
  
	.hello-title {
		font-size: 20px;
		color: #777;
	}
</style>