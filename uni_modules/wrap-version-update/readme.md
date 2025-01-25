# wrap-version-update

> 1.一行代码实现APP版本更新，更提供后台管理让版本的发布和迭代再也不用愁了
>
> 2.支持安卓apk安装更新、支持安卓和ios热更新、支持ios跳转到appStore更新
>
> 3.支持配置非强制更新，暴露绝大部分参数自定义性强
>
> 4.封装了大部分js方法，让向完全自定义界面的开发者更加便捷
>
> 5.提供后台管理 [WrapAppStore](https://apps.seepine.com/)，轻松完成版本更新
>
> 6.提供发布页，效果可查看案例 [Telegram发布页](https://apps.seepine.com/app/375348123164741)
>
> 7.提供后台有偿私有化部署，具体可加群联系群主

- 由于uniCloud收费，服务器做了迁移，请插件版本低于`3.0.0`的尽快升级！！！；

- WrapAppStore官方QQ群：855298680，有问题请加群讨论，避免应用发布后无法控制版本更新造成损失；

- 视频教程  [B站：Uniapp快速实现App版本更新功能](https://www.bilibili.com/video/BV1gu411x7SV)


## 一、后台管理添加应用

### 1.登录网址

[点我前往WrapAppStore后台管理](https://apps.seepine.com/)，后台提供版本更新服务，扫码登录即可。

### 2.创建应用

![](https://s1.ax1x.com/2023/01/08/pSZG43T.png)

### 3.添加版本

创建完应用后，点击菜单栏的版本管理，点击添加版本即可。其中HBuilderX是否更新和是否强制更新底部皆有解释，若还不明白的可添加QQ群讨论咨询。

![](https://s1.ax1x.com/2023/01/08/pSZGTu4.png)

### 4.设置正式版

在添加的版本菜单栏，选择设为正式版即可。

## 二、使用

### 1.获取应用id

![](https://s1.ax1x.com/2023/01/08/pSZGHb9.png)

### 2.引入组件，修改id值

将插件导入项目，在首页引入组件，id**记得**替换为上一步获取到的

```vue
<wrap-version-update id="372917185699909"></wrap-version-update>
```

### 3.监听事件

当需要更新会自动弹窗，当无需更新会触发`finish`事件，此时可表示应用为最新版，可由此事件继续应用的相关业务逻辑。

- @check (version)：无论是否需要更新都会触发事件，传入版本参数
- @finish (version): 当无需更新会触发事件，传入版本参数
- @error (err): 当发生错误会触发事件，传入错误信息

### 4.更多参数



| 参数         | 说明                                                         | 类型    | 默认                                                         |
| ------------ | ------------------------------------------------------------ | ------- | ------------------------------------------------------------ |
| id           | 应用appId                                                    | String  |                                                              |
| uniqueId | 唯一id，例如用户id等，可在后台查看到此值，统计某用户打开了多少次app | String | |
| auto | 是否自动检查新版本，若设为false，需要主动调用$refs.versionRef.check()去检查版本，适用于当开启了不强制更新，在设置->关于中可以提供让用户主动去检查更新的入口 | Boolean | true |
| apiUrl       | 请求版本更新接口                                             | String  | https://appsapi.seepine.com/v1/check |
| loading      | 是否显示检查接口加载                                         | Boolean | true                                                         |
| loadingText  | 加载文字                                                     | String  | 检查更新中                                                   |
| loadingMask  | 加载弹窗mask，为true则不可通过返回键取消动画                 | Boolean | true                                                         |
| loadingDelay | 加载动画延时，默认1.5秒后出现（表现为用户网络环境差时，1.5秒接口还未获得返回值则出现加载弹窗） | Number  | 1500        |
| loadingDelay | 加载动画延时，默认1.5秒后出现（表现为用户网络环境差时，1.5秒接口还未获得返回值则出现加载弹窗） | Number  | 1500    |
| lines      | 更新说明最多展示几行 | Number  | 4 |
| bgImage | 背景图片 | String | 默认蓝色调火箭背景图 |
| btnBgColor        | 升级按钮背景颜色                                                 | String  | #0a84ec      |
| btnTextColor | 升级按钮文字颜色                                             | String  | #FFFFFF                                                      |
| secondaryBtnText | 暂不更新按钮文字 | String | 以后再说 |
| secondaryBtnTextColor | 暂不更新按钮文字颜色 | String | #afafaf |
| textColor    | 升级弹窗版本说明文字颜色                                     | String  | #1e1e1e                                                      |
| errToast     | 检测新版本接口请求失败是否展示错误信息                       | Boolean | true                                                         |
| errTimes | 安装错误次数超过此值提示打开浏览器下载，一般若由高版本降回低版本会出现无法安装的情况 | Number | 2 |

## 三、体验

### 1.下载demo查看效果

打开后会提示有新版，升级使用热更新的方式。

- 直接下载apk：[点击demo_1.0.0.apk](https://mp-a23a1d70-8513-408a-adf5-73446ccd4d97.cdn.bspapp.com/cloudstorage/198c49ee-7d80-4567-a772-d93cc0c5d52d.apk)
- 前往工具站生成apk地址二维码，手机扫码下载
  - 工具站：[草料文本二维码生成器 (cli.im)](https://cli.im/text)
  - apk地址：https://mp-a23a1d70-8513-408a-adf5-73446ccd4d97.cdn.bspapp.com/cloudstorage/198c49ee-7d80-4567-a772-d93cc0c5d52d.apk

