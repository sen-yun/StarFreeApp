<template>
	<view class="user" :style="{'background-color':'#ffffff','min-height':'auto'}">
		<view class="header" :style="[{height:CustomBar*2  + 25 + 'rpx'}]">
			<view class="cu-bar" :class="scrollTop>40?('color-black'):'color-white'" :style="{'height': CustomBar*2 + 25 + 'rpx','padding-top':StatusBar*2 + 25 + 'rpx', 'background-color': scrollTop>40?('#ffffff !important'):'transparent !important'}">
				<view class="action" @tap="back">
					<view>
						<text class="cuIcon-back"
							:class="scrollTop > 40 ? 'color-black' : 'color-white'"></text>
					</view>
					<view class="content text-bold" :style="[{top:StatusBar*2 + 25 + 'rpx'}]"
						:class="scrollTop > 40 ? 'color-black' : 'color-white'">
						<block v-if="scrollTop > 40">
							<view class="app-top">
								<u-image :src="appData.logo" width="50rpx" height="50rpx" mode="aspectFill"
									:lazy-load="true" :fade="true" duration="450" border-radius="30rpx">
									<u-loading slot="loading"></u-loading>
								</u-image>
								<text class="tn-margin-left-sm">{{getName(appData.name)}}</text>
							</view>
						</block>
					</view>
				</view>
				<view class="action">
					<text class="tn-icon-more-vertical margin-left-lg header-icon" 
						:class="scrollTop > 40 ? 'color-black' : 'color-white'"
						@tap="popup()"></text>
				</view>
			</view>
		</view>
		<view :style="[{padding:NavBar + 'px 10px 0px 10px'}]"></view>
		<tn-popup v-model="show" mode="bottom" :zIndex="500" :closeBtn="true" height="35%" :borderRadius="20">
			<view class="center-container">
				<view class="">
					<block v-if="userInfo && (appData.authorId==userInfo.uid || group=='administrator')">
						<view class="tn-padding-sm tn-radius bg-flex-shadow popup-content sy-text-lg"
							@tap="toEdit(appData.id,'version')">
							<text class="tn-icon-upload" style="margin-right: 5px;"></text>更新版本
						</view>
						<view class="tn-padding-sm tn-radius bg-flex-shadow popup-content sy-text-lg"
							@tap="toEdit(appData.id)">
							<text class="tn-icon-edit-write" style="margin-right: 5px;"></text>编辑应用
						</view>

						<view class="tn-padding-sm tn-radius bg-flex-shadow popup-content sy-text-lg"
							@tap="toDelete(appData.id)">
							<text class="tn-icon-delete" style="margin-right: 5px;"></text>删除应用
						</view>
						<view class="tn-padding-sm tn-radius bg-flex-shadow popup-content sy-text-lg"
							v-if="group=='administrator'||group=='editor'"
							@tap="toBan(appData.userJson && appData.userJson.uid)">
							<text class="tn-icon-prohibit" style="margin-right: 5px;"></text>封禁用户
						</view>
					</block>
				</view>
			</view>
		</tn-popup>
		<view class="bg-white" v-if="isLoading==1">
			<view class="appinfo-box">
				<view class="app-box-body" style="margin: 0 40rpx;">
					<view class="app-box-logo" style="margin: 20rpx;">
						<u-image :src="appData.logo" width="120rpx" height="120rpx" mode="aspectFill" :lazy-load="true"
							:fade="true" duration="450" border-radius="30rpx">
							<u-loading slot="loading"></u-loading>
						</u-image>
					</view>
					<view class="tn-margin-sm">
						<view class="appinfo-box-title text-title-1">{{appData.name}}</view>
						<view style="font-size: 26rpx;margin-top: 10rpx;margin-bottom: 10rpx;">
							<text>{{appData.pkname}}</text>
						</view>
						<view style="font-size: 28rpx;">
							<text class="app-tag" style="background-color: orange;" v-if="appData.status==0">待审核</text>
							<text class="app-tag"
								:style="{backgroundColor: appData.tagInfo.color}">{{appData.tagInfo.text}}</text>
							<text v-for="(category, idx) in appData.sortJson" :key="idx"
								class="app-category-tag">{{category.name}}</text>
						</view>
					</view>
				</view>
				<view class="list" style="display: flex; justify-content:space-evenly;color: #222;">
					<view class="item">
						<view class="text">
							<text>{{appData.score}}<text class="cuIcon-favor" style="margin-left: 5rpx;"></text></text>
							<text>{{appData.commentsNum}}条评论</text>
						</view>
					</view>
					<view class="item">
						<u-line class="u-line" direction="col" :hair-line="false" color="#ccc" length="40rpx"></u-line>
					</view>
					<view class="item">
						<view class="text">
							<text>{{appData.size}}</text>
							<text>大小</text>
						</view>
					</view>
					<view class="item">
						<u-line class="u-line" direction="col" :hair-line="false" color="#ccc" length="40rpx"></u-line>
					</view>
					<view class="item">
						<view class="text">
							<text>{{appData.version}}</text>
							<text>版本</text>
						</view>
					</view>
					<view class="item">
						<u-line class="u-line" direction="col" :hair-line="false" color="#ccc" length="40rpx"></u-line>
					</view>
					<view class="item">
						<view class="text" @tap="goReward(appData.id)">
							<text>{{getMoney(appData.tipsAll)}}<text class="tn-icon-money"
									style="margin-left: 5rpx;"></text></text>
							<text>{{appData.tipsNum}}人打赏</text>
						</view>
					</view>
				</view>
				<view class="wrap">
					<view style="margin-bottom: 10rpx;">

						<u-tabs-swiper ref="uTabs" :bgColor="'#ffffff'" :list="tablist" :current="current" @change="tabsChange"
							:is-scroll="false" swiperWidth="750" active-color="#57d1b1"></u-tabs-swiper>
						<!-- #ifdef H5 -->
						<u-sticky @fixed="sticky" :offset-top='5' :h5-nav-height="CustomBar" @unfixed="unsticky">
							<view style="height: 5px;width: 100%;" :style="{'background-color':'#f6f6f6'}">&nbsp;</view>
						</u-sticky>
						<!-- #endif -->
					</view>
					<!-- #ifdef APP-PLUS || MP -->
					<tn-sticky :index="1" :offsetTop="5" :customNavHeight="CustomBar" @fixed="sticky"
						@unfixed="unsticky">
						<view style="height: 5px;width: 100%;">&nbsp;</view>
					</tn-sticky>
					<!-- #endif -->
					<swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
						@animationfinish="animationfinish">
						<swiper-item class="swiper-item" style="height: 100%;">
							<scroll-view :scroll-y="isLock" style="height: 100%;width: 100%;"
								@scrolltolower="onReachBottom1">
								<view class="scroll-1-box">
									<scroll-view scroll-x="true" scroll-left="0" scroll-with-animation="true">
										<view class="scroll-view_H" v-if="appData.infoImages">
											<!-- #ifdef APP-PLUS || H5 -->
											<view v-for="(image, index) in appData.infoImages" :key="index"
												class="scroll-view-item_H" :style="getMargin(index)">
												<u-image :src="image" width="230rpx" height="430rpx" mode="aspectFill"
													:lazy-load="true" :fade="true"
													@click="previewImage(appData.infoImages, image)" duration="450"
													border-radius="30rpx">
													<u-loading slot="loading"></u-loading>
												</u-image>
											</view>
											<!-- #endif -->
											<!-- #ifdef MP -->
											<view v-for="(image, index) in appData.infoImages" :key="index"
												class="scroll-view-item_H">
												<u-image :src="image" width="230rpx" height="430rpx" mode="aspectFill"
													:lazy-load="true" :fade="true"
													@click="previewImage(appData.infoImages, image)" duration="450"
													border-radius="30rpx">
													<u-loading slot="loading"></u-loading>
												</u-image>
											</view>
											<!-- #endif -->
										</view>
									</scroll-view>
								</view>
								<view class="appinfo-box-tabs">
									<u-tag v-for="(tab, index) in appData.tabJson" :key="index"
										class="appinfo-box-tabs-item" :text="tab.name" mode="light" size="default"
										shape="circle" type="info" border-color="#f4f4f5" :bg-color="'#f4f4f5'" />
								</view>
								<view v-if="appData.tagInfo.text=='原创'" class="appinfo-box-info-sm">
									原创资源，未经作者授权，禁止转载！
								</view>
								<view v-if="appData.tagInfo.text=='搬运'||appData.tagInfo.text=='金标'"
									class="appinfo-box-info-sm">
									资源来源于互联网，如侵犯了您的合法权益，请联系管理员（邮箱{{adminEmail}}）进行删除!
								</view>
								<view class="info-section" v-if="appData.versionInfo">
									<view class="info-section-title">
										<text class="title-text">更新介绍</text>
										<view class="title-line"></view>
									</view>
									<view class="info-content" v-html="appData.versionInfo">
									</view>
								</view>
								<view class="info-section">
									<view class="info-section-title">
										<text class="title-text">应用介绍</text>
										<view class="title-line"></view>
									</view>
									<view class="info-content" v-html="appData.info">
									</view>
								</view>
								<view class="comment-item">
									<view class="comment-header" @tap="toUserInfo(appData.userJson)">
										<view class="user-info-box">
											<u-avatar :src="appData.userJson.avatar" size="70"></u-avatar>
											<view class="user-detail">
												<view class="username">
													<text>{{appData.userJson.name}}</text>
												</view>
												<view class="comment-time">
													<text>{{formatDate(appData.created)}}上传</text>
												</view>
											</view>
										</view>

									</view>
								</view>
								<view class="ads-banner tn-margin-top-sm tn-margin-bottom-sm"
									style="border-radius:20upx;" v-if="bannerAdsInfo!=null">
									<image :src="bannerAdsInfo.img" mode="widthFix" @tap="goAds(bannerAdsInfo)">
									</image>
								</view>
								<view :style="{'padding-bottom': paddingBottomHeight + 100 + 'upx'}"></view>
							</scroll-view>
						</swiper-item>
						<swiper-item class="swiper-item">
							<scroll-view :scroll-y="isLock" style="height: 100%;width: 100%;"
								@scrolltolower="onReachBottom2">
								<view class="scroll-2-box">
									<view style="color: #333;">评分与评价</view>
									<view class="pj-box">
										<view>
											<view class="pj-box-title">{{appData.score}}</view>
											<text class="pj-box-text">{{appData.commentsNum}}条评论</text>
										</view>
										<view>
											<view class="pj-star-box">
												<view class="pj-star-box-1">
													<view class="pj-star-box">
														<view class="margin-right-10">
															<u-icon name="star-fill"
																style="margin-left: 1rpx;"></u-icon>
															<u-icon name="star-fill"
																style="margin-left: 5rpx;"></u-icon>
															<u-icon name="star-fill"
																style="margin-left: 5rpx;"></u-icon>
															<u-icon name="star-fill"
																style="margin-left: 5rpx;"></u-icon>
															<u-icon name="star-fill"
																style="margin-left: 5rpx;"></u-icon>
														</view>
														<view>
															<u-line-progress :percent="getStarPercent(5)"
																style="width: 220rpx;" :show-percent="false" height="12"
																active-color="#57d1b1" :how-percent="true">
															</u-line-progress>
														</view>
													</view>
													<view class="pj-star-box">
														<view class="margin-right-10">
															<u-icon name="star-fill" style="margin-left: 5rpx;"
																v-for="i in 4" :key="i"></u-icon>
														</view>
														<view>
															<u-line-progress :percent="getStarPercent(4)"
																style="width: 220rpx;" :show-percent="false" height="12"
																active-color="#57d1b1" :how-percent="true">
															</u-line-progress>
														</view>
													</view>
													<view class="pj-star-box">
														<view class="margin-right-10">
															<u-icon name="star-fill" style="margin-left: 5rpx;"
																v-for="i in 3" :key="i"></u-icon>
														</view>
														<view>
															<u-line-progress :percent="getStarPercent(3)"
																style="width: 220rpx;" :show-percent="false" height="12"
																active-color="#57d1b1" :how-percent="true">
															</u-line-progress>
														</view>
													</view>
													<view class="pj-star-box">
														<view class="margin-right-10">
															<u-icon name="star-fill" style="margin-left: 5rpx;"
																v-for="i in 2" :key="i"></u-icon>
														</view>
														<view>
															<u-line-progress :percent="getStarPercent(2)"
																style="width: 220rpx;" :show-percent="false" height="12"
																active-color="#57d1b1" :how-percent="true">
															</u-line-progress>
														</view>
													</view>
													<view class="pj-star-box">
														<view class="margin-right-10">
															<u-icon name="star-fill" style="margin-left: 5rpx;"
																v-for="i in 1" :key="i"></u-icon>
														</view>
														<view>
															<u-line-progress :percent="getStarPercent(1)"
																style="width: 220rpx;" :show-percent="false" height="12"
																active-color="#57d1b1" :how-percent="true">
															</u-line-progress>
														</view>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>

								<view class="filter-bar">
									<view class="filter-item" @tap="openSortPicker">
										<text>{{sortText}}</text>
										<text class="tn-icon-down"></text>
									</view>
									<view class="filter-item" @tap="openOrderPicker">
										<text>{{orderText}}</text>
										<text class="tn-icon-down"></text>
									</view>
									<view class="filter-item" @tap="openTypePicker">
										<text>{{typeText}}</text>
										<text class="tn-icon-down"></text>
									</view>
								</view>
								<view class="data-box" style="border-radius: 20upx;">
									<view class="no-data" v-if="appScoreList.length==0">
										快来抢沙发吧！
									</view>
									<view v-else>
										<view v-for="(item, index) in appScoreList" :key="index" class="comment-item">
											<view class="comment-header">
												<view class="user-info-box" @tap="toUserInfo(item.userInfo)">
													<u-avatar :src="item.userInfo.avatar" size="70"></u-avatar>
													<view class="user-detail">
														<view class="username">
															<text>{{item.userInfo.name}}</text>
															
														</view>
														<view class="comment-time">
															<text>{{formatDate(item.created)}}</text>
															</view>
													</view>
												</view>

											</view>

											<view class="comment-content">
												<!-- 评分展示 -->
												<view v-if="item.type === 'score'" class="score-display">
													<tn-rate v-model="item.scoreNum" :count="5" :allowHalf="true"
														:disabled="true" :size="32" activeColor="#57d1b1"
														inactiveColor="#cecece" activeIcon="star-fill"
														inactiveIcon="star" :gutter="10"></tn-rate>
													<text class="score-text">{{item.score}}分</text>
												</view>
												<view class="comment-text">{{item.text}}</view>
												<!-- 图片展示 -->
												<view class="pic-box" v-if="item.pic">
													<template>
														<view v-if="item.pic.split('||').length === 1"
															class="single-pic">
															<u-image :src="item.pic.split('||')[0]"
																@tap="previewImage(item.pic.split('||'), item.pic.split('||')[0])"
																width="250rpx" height="300rpx" :fade="true"
																duration="450" border-radius="12rpx">
																<u-loading slot="loading"></u-loading>
															</u-image>
														</view>
														<view v-else class="grid-pic">
															<u-image
																v-for="(pic, picIndex) in item.pic.split('||').slice(0, 6)"
																:key="picIndex" :src="pic"
																@tap="previewImage(item.pic.split('||'), pic)"
																width="200rpx" height="200rpx" :fade="true"
																duration="450" border-radius="12rpx">
																<u-loading slot="loading"></u-loading>
															</u-image>
														</view>
													</template>
												</view>
											</view>

											<!-- 回复列表 -->
											<view class="reply-list" v-if="item.children && item.children.length > 0">
												<view v-for="(reply, replyIndex) in item.children.slice(0, 3)"
													:key="replyIndex" class="reply-item" v-if="reply.userInfo">
													<view class="reply-avatar">
														<u-avatar :src="reply.userInfo.avatar" size="45"></u-avatar>
													</view>
													<view class="reply-content-box">
														<view class="reply-header" @tap="toUserInfo(reply.userInfo)">
															<template>
																<template v-if="reply.touid != 0">
																	<template v-if="reply.replyTo">
																		<text
																			class="username">{{reply.userInfo.name}}</text><text
																			class="reply-to tn-icon-right-triangle"></text><text
																			class="username">{{reply.replyTo.name}}</text>
																	</template>
																	<template v-else>
																		<text
																			class="username">{{reply.userInfo.name}}</text>
																	</template>
																</template>
																<template v-else>
																	<text
																		class="username">{{reply.userInfo.name}}</text>
																</template>
															</template>
														</view>
														<view class="reply-body">
															<view class="reply-text">
																{{reply.text}}
																<text v-if="reply.pic" style="margin-left: 20rpx;">
																	[图片]×{{reply.pic.split('||').length}}
																</text>
															</view>
														</view>
														<view class="reply-footer">
															<view>
																<text
																	class="reply-time">{{formatDate(reply.created)}}</text>
																
															</view>
															<view class="reply-actions">
																<view class="action-item" v-if="reply.userInfo && ((userInfo && reply.userInfo.uid==userInfo.uid)||group=='administrator')" @tap="deleteComment(reply.id)">
																	<u-icon name="delete" size="32" color="#666"></u-icon>
																	<text>删除</text>
																</view>
																<u-icon name="chat" size="32"
																	@tap="viewMoreReplies(item.id)"></u-icon>
																<!-- <u-icon :name="reply.isLikes ? 'thumb-up-fill' : 'thumb-up'" size="32" @tap="handleLike(reply)"> -->
																<view class="action-item" @tap="handleLike(reply)">
																	<u-icon :name="reply.is_liked ? 'thumb-up-fill' : 'thumb-up'" size="32" :color="reply.is_liked ? '#57d1b1' : '#666'"></u-icon>
																	<text :class="{'liked': reply.is_liked}">{{reply.like_count || 0}}</text>
																</view>
															</view>
														</view>
													</view>
												</view>
												<!-- 添加查看全部评论按钮 -->
												<view class="view-all-replies" v-if="item.reply_count > 3"
													@tap="viewMoreReplies(item.id)">
													查看全部{{item.reply_count}}条回复
												</view>
											</view>

											<!-- 评论操作栏 -->
											<view class="comment-actions">
												<view class="action-item" v-if="item.userInfo.uid==userInfo.uid||group=='administrator'" @tap="deleteComment(item.id)">
													<u-icon name="delete" size="32" color="#666"></u-icon>
													<text>删除</text>
												</view>
												<view class="action-item" @tap="viewMoreReplies(item.id)">
													<u-icon name="chat" size="32" color="#666"></u-icon>
													<text>回复</text>
												</view>
												<view class="action-item" @tap="handleLike(item)">
													<u-icon :name="item.is_liked ? 'thumb-up-fill' : 'thumb-up'" size="32" :color="item.is_liked ? '#57d1b1' : '#666'"></u-icon>
													<text :class="{'liked': item.is_liked}">{{item.like_count || 0}}</text>
												</view>
											</view>
										</view>
									</view>
								</view>

								<view class="load-more" style="background-color: #fff;" @tap="loadMore" v-if="appScoreList.length>0">
									<text>{{moreText}}</text>
								</view>
								<view :style="{'padding-bottom': paddingBottomHeight + 100 + 'upx'}"></view>
							</scroll-view>
						</swiper-item>
						<swiper-item class="swiper-item">
							<scroll-view :scroll-y="isLock" style="height: 100%;width: 100%;"
								@scrolltolower="onReachBottom3">

								<view class="scroll-2-box">
									<!-- 版本列表 -->
									<view class="app-box" v-for="(version, index) in versionList" :key="index">
										<view class="app-box-body" @tap="showVersionDetail(version)">
											<view class="app-box-logo">
												<u-image :src="version.logo" width="120rpx" height="120rpx"
													mode="aspectFill" :lazy-load="true" :fade="true" duration="450"
													border-radius="30rpx">
													<u-loading slot="loading"></u-loading>
												</u-image>
											</view>
											<view class="tn-margin-sm" style="width: 50vw;">
												<view class="app-box-title text-title-1">{{version.name}}<text
														v-if="version.status==0">【待审核】</text></view>
												<view style="font-size: 26rpx;margin-top: 8rpx;margin-bottom: 8rpx;">
													<text
														style="margin-right: 10rpx;">{{formatSize(version.size)}}</text><text>v{{version.version}}</text>
												</view>
												<view class="text-title-1" style="font-size: 28rpx;">
													<text
														style="margin-right: 10rpx;">{{version.versionInfo.replace(/<[^>]+>/g, '')}}</text>
												</view>
											</view>
										</view>
										<view class="app-box-down" @tap="downloadVersion(version)">
											下载
										</view>
									</view>
									<!-- 加载更多 -->
									<view class="load-more" style="background-color: #fff;" v-if="versionList.length > 0">
										<text>{{versionLoadMoreText}}</text>
									</view>

									<view :style="{'padding-bottom': paddingBottomHeight + 100 + 'upx'}"></view>
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>

		<view class="info-footer grid col-1" :style="{'padding-bottom': paddingBottomHeight + 'upx'}">
			<view class="appinfo-footer-box">
				<view class="appinfo-footer-box-money" style="width: 15%;" @tap="goGif">
					<text class="tn-icon-money footer-icon text-bold" style="font-size: 40rpx;"></text>
					<text>打赏</text>
				</view>
				<view style="width: 65%;">
					<tn-button class="appinfo-footer-box-down" height="70rpx" :backgroundColor="'#3cc9a4'" shape="round"
						fontColor="#fff" @click="downApp()">
						{{current === 1 ? '发表评论' : '下载 ' + appData.size}}
					</tn-button>
				</view>
				<view class="appinfo-footer-box-share" style="width: 15%;" @click="toShare">
					<text class="tn-icon-share footer-icon text-bold" style="font-size: 40rpx;"></text>
					<text>分享</text>
				</view>
			</view>
		</view>
		<tn-popup v-model="dsShow" mode="bottom" :zIndex="500" :closeBtn="true" height="25%" :borderRadius="20">
			<view class="grid col-3 padding-sm tn-margin-top-xxl" style="display: flex;justify-content: center;margin-top: 40rpx;">
				<view v-for="(item,index) in checkbox" class="padding-xs" :key="index">
					<button class="cu-btn cyan lg block" :class="item.checked?'bg-cyan':'line-cyan'" @tap="ChooseCheckbox(index)"> 
						{{item.num}}{{currencyName}}
						<view class="cu-tag sm round" :class="item.checked?'bg-white text-cyan':'bg-cyan'" v-if="item.hot">HOT</view>
					</button>
				</view>
				<view style="display: flex;justify-content: center;margin-top: 20rpx;">
					<tn-button :backgroundColor="'#1cbbb4'" style="padding: 0 60upx;" fontColor="#fff" @tap="toReward(),dsShow=false">立即打赏</tn-button>
				</view>
			</view>
		</tn-popup>
		<view class="loading" v-if="isLoading==0">
			<view class="loading-main">
				<image src="../../../static/loading.gif"></image>
			</view>
		</view>
		<u-popup v-model="showDownloadPopup" mode="bottom" border-radius="40">
			<view class="download-popup">
				<view class="download-title">选择下载方式</view>
				<!-- 添加 v-if 确保 downloadInfo 不为 null -->
				<template v-if="downloadInfo">
					<!-- Android 应用下载选项 -->
						<!-- 蓝奏云/123网盘且解析成功 -->
						<template v-if="['lz','123'].includes(downloadInfo.downloadType)">
							<u-button
								shape="circle"
								class="download-btn btn-color-1"
								:disabled="true"
								style="opacity: 0.7;"
							>
								直接下载
							</u-button>
							<view class="button-container" style="display: flex;">
								<u-button
									shape="circle"
									:plain="true"
									class="download-btn btn-color-2"
									style="margin-right: 20rpx; opacity: 0.7;"
									:disabled="true"
								>
									手动下载
								</u-button>
								<u-button
									shape="circle"
									:plain="true"
									v-if="downloadInfo.downloadPw"
									class="download-btn btn-color-2"
									:disabled="true"
									style="opacity: 0.7;"
								>
									提取码 {{downloadInfo.downloadPw}}
								</u-button>
							</view>
							<view style="margin-top: 30rpx; color: #f56c6c; text-align: center; font-size: 28rpx;">
								{{ downloadInfo.downloadType === 'lz' ? '蓝奏云' : '123网盘' }}解析需要升级Pro版解锁
							</view>
						</template>

						<!-- 直链下载 -->
						<template v-else-if="downloadInfo.downloadType === 'zl'">
							<template v-if="downloadInfo.downloadPw">
								<view class="button-container" style="display: flex;">
									<u-button shape="circle" :plain="true" class="download-btn btn-color-2"
										style="margin-right: 20rpx;" @click="manualDownload">手动下载</u-button>
									<u-button shape="circle" :plain="true" v-if="downloadInfo.downloadPw"
										class="download-btn btn-color-2" @click="copyPassword">
										提取码 {{downloadInfo.downloadPw}}
									</u-button>
								</view>
							</template>
							<u-button shape="circle" v-else class="download-btn btn-color-1"
								@click="directDownload">直接下载</u-button>
						</template>

						<!-- 其他网盘 -->
						<template v-else>
							<view class="button-container" style="display: flex;">
								<u-button shape="circle" :plain="true" class="download-btn btn-color-2"
									style="margin-right: 20rpx;" @click="manualDownload">手动下载</u-button>
								<u-button shape="circle" :plain="true" v-if="downloadInfo.downloadPw"
									class="download-btn btn-color-2" @click="copyPassword">
									提取码 {{downloadInfo.downloadPw}}
								</u-button>
							</view>
						</template>
				</template>

				<!-- 添加加载中状态 -->
				<template v-else>
					<view class="loading-text">加载中...</view>
				</template>
			</view>
		</u-popup>
		<view class="info-operate-bg" :class="isShare?'show':''" @tap="isShare=false"></view>
		<view class="info-operate" :class="isShare?'show':''">
			<view class="info-operate-main grid col-2">
				<view class="index-sort-box">
					<view class="index-sort-main" @tap="copyShare">
						<view class="index-sort-i" style="background: rgb(158 158 158 / 20%)">
							<text class="tn-icon-link" style="color:  rgba(19, 19, 19);"></text>
						</view>
						<view class="index-sort-text">
							复制应用链接
						</view>
					</view>
				</view>
				<view class="index-sort-box">
					<view class="index-sort-main" @tap="goShare">
						<view class="index-sort-i" style="background: rgb(158 158 158 / 20%)">
							<text class="tn-icon-share-triangle" style="color: rgba(19, 19, 19);"></text>
						</view>
						<view class="index-sort-text">
							分享到其他应用
						</view>
					</view>
				</view>
			</view>


		</view>
		<!-- 修改picker组件 -->
		<u-picker v-model="showSortPicker" :show="showSortPicker" mode="selector" :range="sortColumns" range-key="text"
			@confirm="confirmSort" @cancel="cancelSort" title="排序方式"></u-picker>

		<u-picker v-model="showOrderPicker" :show="showOrderPicker" mode="selector" :range="orderColumns"
			range-key="text" @confirm="confirmOrder" @cancel="cancelOrder" title="排序方向"></u-picker>

		<u-picker v-model="showTypePicker" :show="showTypePicker" mode="selector" :range="typeColumns" range-key="text"
			@confirm="confirmType" @cancel="cancelType" title="评论类型"></u-picker>

		<!-- 添加版本详情弹窗 -->
		<u-popup v-model="showVersionPopup" mode="center" border-radius="24" width="600rpx">
			<view class="version-popup">
				<view class="version-popup-header">
					<text class="version-popup-title">版本更新详情</text>
					<text class="version-popup-close tn-icon-close" @tap="showVersionPopup = false"></text>
				</view>
				<view class="version-popup-content">
					<view class="version-popup-info" v-if="currentVersion">
						<text class="version-popup-version">版本 {{currentVersion.version}}</text>
						<text class="version-popup-time">大小 {{formatSize(currentVersion.size)}}</text>
					</view>
					<view class="version-popup-desc" v-if="currentVersion" v-html="currentVersion.versionInfo"></view>
					<view class="version-popup-info">
						<text class="version-popup-time"><br>发布 {{formatDate(currentVersion.created)}}</text>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 添加类型选择弹窗 -->
		<u-popup v-model="showTypePopup" mode="bottom" height="auto" border-radius="20">
			<view class="type-select-popup">
				<view class="type-select-title">选择评论类型</view>
				<view class="type-select-options">
					<view class="type-option" @tap="selectCommentType('discuss')">
						<text class="tn-icon-message"></text>
						<text>发表讨论</text>
					</view>
					<view class="type-option" @tap="selectCommentType('score')">
						<text class="tn-icon-star"></text>
						<text>评分评价</text>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 修改评论弹窗样式 -->
		<u-popup v-model="showCommentPopup" mode="bottom" height="74%" z-index="999" border-radius="20">
			<view class="comment-popup">
				<view class="comment-popup-header">
					<text>{{commentappType === 'discuss' ? '发表讨论' : '评分评价'}}</text>
					<text class="close-icon tn-icon-close" @tap="showCommentPopup = false"></text>
				</view>
				
				<view class="score-box" v-if="commentappType === 'score'">
					<tn-rate v-model="scoreValue" 
						:count="5"
						:allowHalf="true"
						:size="40"
						activeColor="#57d1b1"
						inactiveColor="#cecece"
						activeIcon="star-fill"
						inactiveIcon="star"
						:gutter="20">
					</tn-rate>
					<text class="score-text">{{scoreValue}}分</text>
				</view>
				
				<view class="comment-input">
					<textarea v-model="commentText" 
						placeholder="说点什么吧..."
						:adjust-position="false"
						:cursor-spacing="140"
						:maxlength="5000"
						class="textarea-style">
					</textarea>
				</view>
				
				<view class="comment-tools">
					<view class="tool-left">
						<text class="tn-icon-image" @tap="showUpload"></text>
					</view>
					<view class="tool-right">
						<button class="submit-btn" 
							:class="{'active': commentText.trim()}"
							@tap="submitComment">
							发布
						</button>
					</view>
				</view>
				
				<view class="upload-box" v-if="showUploadBox">
					<u-upload ref="uUpload" 
						:action="uploadUrl"
						:form-data="{token: token}"
						:max-count="9"
						:width="160"
						:height="160"
						:auto-upload="true"
						@on-success="handleSuccess"
						@on-remove="handleRemove">
					</u-upload>
				</view>
			</view>
			<!-- 添加支撑元素 -->
			<view :style="{'background-color':'#f6f6f6', 'height':'900rpx'}"></view>
		</u-popup>
		
	</view>
</template>

<script>
	import {
		localStorage
	} from '../../../js_sdk/mp-storage/mp-storage/index.js'

	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				NavBar: this.StatusBar + this.CustomBar,
				AppStyle: this.$store.state.AppStyle,
				userInfo: null,
				token: "",
				moreText: "",
				paddingBottomHeight: 0, 
				scrollTop: 0,
				isLock: false, 
				isuserlogin: false,
				commentsList: [],
				appid: 0,
				tablist: [],
				current: 0,
				dsShow: false,
				swiperCurrent: 0,
				isOnlyUser: 0,
				page: 1,
				adminEmail: this.$API.GetAppEmail(),
				comPx: false,
				bannerAdsInfo: null,
				isLoad: 0,
				isLoading: 0,
				appData: {
					logo: '',
					name: '加载中',
					pkname: '未知包名',
					type: 0,
					size: 0,
					version: '未知版本',
					info: '加载中',
					infoImg: '',
					score: 0,
					commentsNum: 0,
					tipsAll: 0,
					tipsNum: 0,
					sortJson: [],
					tabJson: [],
					infoImages: [],
					tagInfo: {
						text: '未知',
						color: '#999'
					}
				},
				isShare: false,
				tagMap: {
					1: {
						text: '搬运',
						color: '#7c72ff'
					},
					2: {
						text: '原创',
						color: '#19be6b'
					},
					3: {
						text: '金标',
						color: '#ff6600'
					},
					4: {
						text: '官方',
						color: '#2979ff'
					}
				},
				showDownloadPopup: false,
				uploadUrl: this.$API.upload(),
				downloadInfo: null,
				appScoreList: [], 
				commentPage: 1,
				commentLimit: 5, 
				isLoadingComment: false, 
				hasMoreComment: true, 
				scoreValue: 0,
				commentText: '', 
				inputBottom: 0, 
				replyTo: null, 
				totalComments: 0, 
				currentCommentId: null, 
				scoreStats: null, 
				showSortPicker: false,
				showOrderPicker: false,
				showTypePicker: false,
				group: "",
				sortBy: 'created',
				order: 'desc',
				commentType: '',
				show: false,

				sortColumns: [{
						text: '发布时间',
						value: 'created'
					},
					{
						text: '应用评分',
						value: 'score'
					},
					{
						text: '点赞数量',
						value: 'likes'
					},
					{
						text: '回复数量',
						value: 'replies'
					}
				],

				orderColumns: [{
						text: '降序',
						value: 'desc'
					},
					{
						text: '升序',
						value: 'asc'
					}
				],

				typeColumns: [{
						text: '全部',
						value: ''
					},
					{
						text: '讨论',
						value: 'discuss'
					},
					{
						text: '评分',
						value: 'score'
					}
				],
				forceHeaderBg: false, 
				versionList: [], 
				versionLoadMoreText: '加载更多',
				currentVersion: {}, 
				versionPage: 1,
				versionLimit: 10, 
				hasMoreVersion: true,
				showVersionPopup: false,
				currencyName: '',
				dsof: 0,
				shareof: 0,
				showCommentPopup: false,
				commentappType: 'discuss',
				commentPics: '', 
				showUploadBox: false, 
				submitStatus: false,
				showTypePopup: false,
				showCommentBtn: false,
				dsShow: false,
				dsstyle: 1,
				rewardLog: [],
				rewardTotal: 0,
				checkbox: [{
					value: 0,
					name: '5金币',
					num: 5,
					checked: false,
					hot: false,
				}, {
					value: 1,
					name: '10金币',
					num: 10,
					checked: false,
					hot: false,
				}, {
					value: 2,
					name: '30金币',
					num: 30,
					checked: false,
					hot: false,
				}, {
					value: 3,
					name: '50金币',
					num: 50,
					checked: false,
					hot: false,
				}, {
					value: 4,
					name: '100金币',
					num: 100,
					checked: false,
					hot: false,
				}, {
					value: 5,
					name: '200金币',
					num: 200,
					checked: false,
					hot: false,
				}],
			};
		},
		onPullDownRefresh() {
			var that = this;
			that.page = 1;
			if (that.appid != 0) {
				that.getAppInfo();
				that.getAppScoreList();
				that.getVersionList();
			}
			var timer = setTimeout(function() {

				uni.stopPullDownRefresh();
			}, 1000)
		},
		onShow() {
			var that = this;
			// console.log(this.$u.config.v);
			uni.$emit('tOnLazyLoadReachBottom');
			// console.log(that.appSwiper[0].image);
			if (localStorage.getItem('userinfo')) {

				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.userInfo.style = "background-image:url(" + that.userInfo.avatar + ");"
			}
			if (localStorage.getItem('token')) {

				that.token = localStorage.getItem('token');
			}
			// #ifdef APP-PLUS
			that.initStatusBarStyle();
			// #endif
			that.userStatus();

			const savedScrollTop = localStorage.getItem('savedScrollTop');
			if (savedScrollTop) {
				that.scrollTop = parseInt(savedScrollTop, 10);
				
				localStorage.removeItem('savedScrollTop');
			}
		},
		onLoad(res) {
			var that = this;

			uni.getSystemInfo({
				success: function(res) {
					let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
					console.log("当前设备型号：" + res.model)
					model.forEach(item => {

						if (res.model.indexOf(item) != -1 && res.model.indexOf('iPhone') != -1) {
							that.paddingBottomHeight = 40;
						}
					})
				}
			});

			// #ifdef APP-PLUS || MP
			that.NavBar = this.CustomBar;
			// #endif
			if (res.id) {
				that.appid = res.id;
			}
			if (localStorage.getItem('userinfo')) {

				that.userInfo = JSON.parse(localStorage.getItem('userinfo'));
				that.userInfo.style = "background-image:url(" + that.userInfo.avatar + ");"
			}
			if (localStorage.getItem('token')) {

				that.token = localStorage.getItem('token');
			}
			localStorage.setItem('isinfoback', 1);
		},
		async mounted() {
			try {
				await this.getTabList();
				
				await this.$nextTick();
				
				await Promise.all([
					this.getAppInfo(),
					this.getAppScoreList(),
					this.getVersionList(),
					this.getopset()
				]);
			} catch (error) {
				console.error('初始化数据失败:', error);
			}
		},
		methods: {
			goGif() {
				if(this.dsof==1){
					this.dsShow = true;
				}else{
					uni.showToast({
						title: '打赏功能已关闭',
						icon: 'none'
					});
				}
			},
			async getTabList() {
				this.tablist = [{
					name: '详情'
				}, {
					name: '讨论'
				}, {
					name: '版本'
				}];
				
				await this.$nextTick();
			},
			back() {
				localStorage.setItem('isFromReply', 'true');
				uni.navigateBack({
					delta: 1
				});
			},
			toShare() {
				var that = this;
				if (that.shareof == 1) {
					that.isShare = !that.isShare
				} else {
					uni.showToast({
						title: '分享功能已关闭',
						icon: 'none'
					});
				}

			},
			ToCopy(text) {
				var that = this;
				// #ifdef APP-PLUS
				uni.setClipboardData({
					data: text,
					success: () => { 
						uni.showToast({ 
							title: "链接复制成功"
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
					title: "链接复制成功"
				})
				var result = document.execCommand("copy")
				textarea.remove();

				// #endif
			},
			copyShare() {
				var that = this;
				var linkStar = that.$API.GetappStar();
				var appname = that.$API.GetAppName()
				var url = linkStar.replace("{id}", that.appData.id);
				var text = '分享应用【' + that.appData.name + '】 - 来自于' + appname + " | 链接：" + url
				that.ToCopy(text);
				that.isShare = false
			},
			goShare() {
				var that = this;
				var linkStar = that.$API.GetappStar();
				var appname = that.$API.GetAppName()
				var url = linkStar.replace("{id}", that.appData.id);
				// #ifdef APP-PLUS
				uni.shareWithSystem({
					href: url,
					summary: that.appData.name + ' | 来自于' + appname,
					success() {
						// 分享完成，请注意此时不一定是成功分享

					},
					fail() {
						// 分享失败
					}
				});
				// #endif
				// #ifdef H5
				var text = '分享应用【' + that.appData.name + '】 - 来自于' + appname + " | 链接：" + url
				that.ToCopy(text);
				// #endif
				that.isShare = false
			},
			getopset() {
				var that = this;
				uni.request({
					url:that.$API.SMset(),
					method:'GET',
					dataType:"json",
					success(res) {
						that.currencyName = res.data.assetsname;
						that.shareof = res.data.shareof;
						that.dsof = res.data.dsof;
					},
					fail(error) {
					console.log(error);
					}
				})
			},
			onReachBottom3() {
				if (this.hasMoreVersion) {
					this.versionPage++;
					this.getVersionList(true);
				}
			},
			onReachBottom2() {
				// console.log('isLoadingComment:', this.isLoadingComment);
				// console.log('hasMoreComment:', this.hasMoreComment);
				// 触底加载更多评论
				if (!this.isLoadingComment && this.hasMoreComment) {
					this.loadMore();
				}
			},
			formatNumber(num) {
				return num >= 1e3 && num < 1e4 ? (num / 1e3).toFixed(1) + 'k' : num >= 1e4 ? (num / 1e4).toFixed(1) + 'w' :
					num
			},
			setOnlyUser(type) {
				var that = this;
				that.isOnlyUser = type;
				that.page = 1;
				var id = that.appid
				// that.getCommentsList(false, id);
				that.comPx = false;
			},
			sticky(index) {
				this.isLock = true;
				this.$set(this, 'isLock', true);
				console.log(this.isLock);
			},
			unsticky(index) {
				this.isLock = false;
				this.$set(this, 'isLock', false);
				console.log(this.isLock);
			},
			
			initStatusBarStyle() {
				var that = this;
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform === 'android') {
					plus.navigator.setStatusBarStyle('dark'); // Android 平台
				} else {
					plus.navigator.setStatusBarStyle('dark'); // iOS 平台

				}
				// #endif

			},
			onPageScroll(event) {
				this.scrollTop = event.scrollTop;
				// #ifdef APP-PLUS
				if (this.scrollTop > 40) {
					if (uni.getSystemInfoSync().platform === 'android') {
						plus.navigator.setStatusBarStyle('dark'); // Android 平台
					} else {
						plus.navigator.setStatusBarStyle('dark'); // iOS 平台
					}
					
				} else {
					if (uni.getSystemInfoSync().platform === 'android') {
						plus.navigator.setStatusBarStyle('dark'); // Android 平台
					} else {
						plus.navigator.setStatusBarStyle('dark'); // iOS 平台
					}
				}
				// #endif
			},
			
			tabsChange(index) {
				if (this.$refs.uTabs) {
					this.swiperCurrent = index;
					if (index === 1) {
						this.updateScoreStats();
					}
				}
			},
			transition(e) {
				if (this.$refs.uTabs) {
					let dx = e.detail.dx;
					this.$refs.uTabs.setDx(dx);
				}
			},
			animationfinish(e) {
				if (this.$refs.uTabs) {
					let current = e.detail.current;
					this.$refs.uTabs.setFinishCurrent(current);
					this.swiperCurrent = current;
					this.current = current;
					if (current === 1) {
						this.updateScoreStats();
					}
				}
			},
			onReachBottom1(e) {
				
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
			getDowns(downs) {
				var that = this;
				if (downs <= 999) {
					return downs;
				} else if (downs > 999 && downs <= 9999) {
					return (downs / 1000).toFixed(1) + "千";
				} else if (downs > 9999) {
					return (downs / 10000).toFixed(1) + "万";
				}
			},
			previewImage(imageList, image) {

				uni.previewImage({
					urls: imageList,
					current: image
				});
			},
			getMargin(index) {
				if (index === 0) {
					return "margin-left: 20rpx;";
				} else if (index === this.appData.infoImages.length - 1) {
					return "margin-right: 20rpx;";
				}
				return "";
			},
			loadMore() {
				var that = this;
				console.log('执行loadMore');
				console.log('当前页码:', that.commentPage);
				if (!that.hasMoreComment || that.isLoadingComment) return;
				that.commentPage++;
				that.moreText = "正在加载中...";
				that.getAppScoreList(true);
			},

			userStatus() {
				var that = this;
				that.$Net.request({

					url: that.$API.userStatus(),
					data: {
						"token": that.token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 1) {
							that.assets = res.data.data.assets;
							that.group = res.data.data.groupKey;
						}
					},
					fail: function(res) {
						uni.showToast({
							title: "支付接口配置异常",
							icon: 'none'
						})
					}
				})
			},
			getCommentsList(isPage, id, isLogin) {
				var that = this;
				if (that.submitStatus1) {
					return false;
				}
				that.submitStatus1 = true;
				var token = "";
				if (!isLogin) {
					localStorage.setItem('isbug', '1');
				}

				var data = {
					"forumid": id,
				}
				if (that.isOnlyUser == 1) {
					data.uid = that.userJson.uid;
				}
				var page = that.page;
				if (isPage) {
					page++;
				}
				that.$Net.request({
					url: that.$API.postCommentList(),
					data: {
						"searchParams": JSON.stringify(that.$API.removeObjectEmptyKey(data)),
						"limit": 10,
						"page": page,
						"token": token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "get",
					dataType: 'json',
					success: function(res) {
						if (!isLogin) {
							localStorage.removeItem('isbug');
						}
						that.submitStatus1 = false;
						uni.stopPullDownRefresh();
						that.isLoad = 0;
						if (res.data.code == 1) {
							var list = res.data.data;
							if (list.length > 0) {
								var commentsList = [];
								for (var i in list) {
									var arr = list[i];
									arr.style = "background-image:url(" + list[i].userJson.avatar + ");"
									commentsList.push(arr);
								}
								if (isPage) {
									that.page++;
									that.commentsList = that.commentsList.concat(commentsList);
								} else {
									that.commentsList = commentsList;
								}

							} else {
								that.moreText = "没有更多评论了";
								if (that.page == 1 && !isPage) {
									that.commentsList = [];
								}

							}

						} else {
							if (res.data.msg == "用户未登录或Token验证失败") {
								if (isLogin) {
									that.isuserlogin = true
								} else {
									that.getCommentsList(isPage, that.appid, true);
								}
							}
						}

					},
					fail: function(res) {
						if (!isLogin) {
							localStorage.removeItem('isbug');
						}
						that.submitStatus1 = false;
						uni.stopPullDownRefresh();
						uni.showToast({
							title: "网络开小差了哦",
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
			getName(name) {
				if (name.length > 10) {
					return name.substring(0, 10) + '...';
				} else {
					return name;
				}
			},

			getMoney(money) {
				if (money == 0) {
					return '0';
				} else if (money >= 10000) {
					return (money / 10000).toFixed(2) + 'w';
				} else if (money >= 1000) {
					return (money / 1000).toFixed(2) + 'k';
				} else {
					return money + '';
				}
			},
			popup() {
				var that = this;
				if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
					uni.showToast({
						title: "请先登录哦",
						icon: 'none'
					})
					return false;
				}
				that.show = true;

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
			getAppInfo() {
				const that = this;
				that.$Net.request({
					url: that.$API.PluginLoad('sy_appbox'),
					data: {
						"action": "getAppInfo",
						"getapp_appid": that.appid,
						"getapp_token": that.token
					},
					method: "GET",
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 200) {
							if (res.data.data[0].msg == '查询成功') {
								const data = res.data.data;
								const list = data.map(item => ({
									...item,
									tagInfo: that.tagMap[item.type] || {
										text: '未知',
										color: '#999'
									},
									size: that.formatSize(item.size),
									infoImages: item.infoImg?.split('||') || [],
									pkname: item.pkname == null ? '未知包名' : item.pkname,
									version: item.version == null ? '未知版本' : item.version,

								}));
								that.appData = list[0] || that.appData;

							} else {
								uni.showToast({
									title: "应用加载失败",
									icon: 'none'
								});
							}

						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
						that.isLoading = 1;
					}
				});
			},
			formatSize(size) {
				if (!size) {
					return '未知大小';
				}

				if (size >= 1024 * 1024) {
					return (size / (1024 * 1024)).toFixed(1) + 'Gb';
				} else if (size >= 1024) {
					return (size / 1024).toFixed(1) + 'Mb';
				} else {
					return size + 'Kb';
				}
			},
			// 下载应用
			downApp() {
				const that = this;
				const token = localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo')).token : "";
				if(that.current === 1){
					that.showTypeSelect()
					return false;
				}
				// 显示加载提示
				uni.showLoading({
					title: '获取下载链接',
					mask: true
				});

				uni.request({
					url: that.$API.PluginLoad('sy_appbox'),
					data: {
						"action": "getDownUrl",
						"geturl_appid": that.appid,
						"geturl_token": token
					},
					method: "GET",
					success: (res) => {
						// 隐藏加载提示
						uni.hideLoading();

						if (res.data.code === 200) {
							that.downloadInfo = res.data.data;
							that.showDownloadPopup = true;
						} else {
							uni.showToast({
								title: res.data.msg || "获取下载链接失败",
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						// 隐藏加载提示
						uni.hideLoading();

						uni.showToast({
							title: "网络请求失败",
							icon: 'none'
						});
					}
				});
			},

			// 直接下载
			directDownload() {
				const url = this.downloadInfo.parse_url || this.downloadInfo.downloadUrl;
				// #ifdef APP-PLUS
				plus.runtime.openURL(url);
				// #endif
				// #ifdef H5
				window.open(url);
				// #endif
				// #ifdef MP
				uni.setClipboardData({
					data: url,
					success: () => {
						uni.showToast({
							title: '链接已复制',
							icon: 'success'
						});
					}
				});
				// #endif
				this.showDownloadPopup = false;
			},

			// 手动下载
			manualDownload() {
				const url = this.downloadInfo.downloadUrl;
				// #ifdef APP-PLUS
				plus.runtime.openURL(url);
				// #endif
				// #ifdef H5
				window.open(url);
				// #endif
				// #ifdef MP
				uni.setClipboardData({
					data: url,
					success: () => {
						uni.showToast({
							title: '链接已复制',
							icon: 'success'
						});
					}
				});
				// #endif
				this.showDownloadPopup = false;
			},

			// 复制提取码
			copyPassword() {
				uni.setClipboardData({
					data: this.downloadInfo.downloadPw,
					success: () => {
						uni.showToast({
							title: '提取码已复制',
							icon: 'none'
						});
					}
				});
			},

			// 显示错误信息
			showError() {
				uni.showToast({
					title: this.downloadInfo.error || '解析失败',
					icon: 'none'
				});
			},
			// 获取评论列表
			getAppScoreList(isLoadMore = false) {
				// console.log('执行getAppScoreList, isLoadMore:', isLoadMore);
				// console.log('当前加载状态:', this.isLoadingComment);
				if (this.isLoadingComment) return;
				this.isLoadingComment = true;

				// 如果不是加载更多，重置页码和列表
				if (!isLoadMore) {
					this.commentPage = 1;
					this.appScoreList = [];
					this.hasMoreComment = true;
				}

				// 构建请求参数
				const params = {
					action: "getScoreList",
					getscore_aid: this.appid,
					getscore_page: this.commentPage,
					getscore_limit: this.commentLimit,
					getscore_orderby: this.sortBy,
					getscore_order: this.order
				};

				// 添加类型筛选
				if (this.commentType) {
					params.getscore_if = JSON.stringify({
						type: this.commentType
					});
				}



				// 发起请求
				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: params,
					method: 'GET',
					dataType: 'json',
					success: (res) => {

						if (res.data.code === 200) {
							const {
								comments,
								total
							} = res.data.data;
							// console.log('评论总数:', total);
							// console.log('当前获取评论数:', comments.length);

							const processedComments = comments.map(comment => ({
								...comment,
								scoreNum: Number(comment.score)
							}));

							if (isLoadMore) {
								this.appScoreList = [...this.appScoreList, ...processedComments];
							} else {
								this.appScoreList = processedComments;
							}

							// 判断是否还有更多数据
							this.hasMoreComment = this.appScoreList.length < total && comments.length > 0;
							// console.log('是否还有更多:', this.hasMoreComment);
							this.moreText = this.hasMoreComment ? '加载更多' : '没有更多了';

						} else {
							console.log('请求失败:', res.data.msg);
							uni.showToast({
								title: res.data.msg || '获取评论失败',
								icon: 'none'
							});
							this.moreText = '加载更多';
						}
						this.isLoadingComment = false;
						if (this.hasMoreComment) {
							setTimeout(() => {
								// 检查是否已经滚动到底部
								const query = uni.createSelectorQuery();
								query.select('.scroll-2-box').boundingClientRect();
								query.selectViewport().scrollOffset();
								query.exec((res) => {
									if (res[0] && res[1]) {
										const isBottom = res[0].bottom <= res[1].scrollHeight;
										if (isBottom && !this.isLoadingComment) {
											this.loadMore();
										}
									}
								});
							}, 100);
						}
					},
					fail: (err) => {
						console.log('请求错误:', err);
						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
						this.isLoadingComment = false;
						this.moreText = '加载更多';

					},
				});
			},


			// 切换评论类型
			switchCommentType(type) {
				this.commentappType = type;
				if (type === 'score') {
					this.scoreValue = 5; // 默认5分
				}
			},
			toJb(title) {
				var that = this;

				uni.navigateTo({
					url: '/pages/user/help?type=text&title=' + title
				});
			},
			// 处理回复
			handleReply(item, replyToUser = null) {
				this.currentCommentId = item.id; // 保存当前主评论ID
				this.replyTo = replyToUser || item.userInfo; // 如果是回复子评论，使用传入的用户信息
				this.commentText = '';
				this.$nextTick(() => {
					const inputEl = this.$refs.commentInput;
					if (inputEl) {
						inputEl.focus();
					}
				});
			},

			// 处理点赞
			

			// 查看更多回复
			viewMoreReplies(id) {
				// 存储当前 scrollTop
				localStorage.setItem('savedScrollTop', this.scrollTop);
				uni.navigateTo({
					url: `/pages/plugins/sy_appbox/replyinfo?id=${id}&aid=${this.appid}`
				});
			},

			// 提交评论
			async submitComment() {
				if (!this.checkLogin()) return;
				if (!this.commentText.trim()) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					});
					return;
				}

				// 评分类型时检查分数
				if (this.commentappType === 'score' && !this.replyTo && this.scoreValue === 0) {
					uni.showToast({
						title: '请选择评分',
						icon: 'none'
					});
					return;
				}

				const params = {
					aid: this.appid,
					text: this.commentText.trim(),
					token: this.userInfo.token,
					type: this.commentappType
				};

				// 如果是评分类型，添加分数
				if (this.commentappType === 'score' && !this.replyTo) {
					params.score = this.scoreValue;
				}

				// 如果是回复，添加父评论ID和被回复用户ID
				if (this.replyTo) {
					params.parent = this.currentCommentId; // 主评论ID
					params.touid = this.replyTo.uid; // 被回复用户ID
				}

				try {
					uni.showLoading({
						title: '提交中'
					});

					const res = await this.$Net.request({
						url: this.$API.addScore(), // 修正API方法名
						data: params,
						method: 'POST'
					});

					if (res.data.code === 200) {
						uni.showToast({
							title: '评论成功',
							icon: 'success'
						});

						// 重置表单
						this.commentText = '';
						this.scoreValue = 0;
						this.replyTo = null;

						// 刷新评论列表
						this.getAppScoreList();
					} else {
						uni.showToast({
							title: res.data.msg || '评论失败',
							icon: 'none'
						});
					}
				} catch (err) {
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},

			// 检查登录状态
			checkLogin() {
				if (!this.userInfo || !this.userInfo.token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				return true;
			},

			// 输入框获取焦点
			inputFocus(e) {
				this.inputBottom = e.detail.height;
			},

			// 输入框失去焦点
			inputBlur() {
				this.inputBottom = 0;
				// 如果内容为空，重置回复状态
				if (!this.commentText.trim()) {
					this.replyTo = null;
				}
			},

			// 格式化时间
			formatDate(timestamp) {
				const date = new Date(timestamp * 1000);
				const now = new Date();
				const diff = now - date;

				// 小于1分钟
				if (diff < 60000) {
					return '刚刚';
				}
				// 小于1小时
				if (diff < 3600000) {
					return Math.floor(diff / 60000) + '分钟前';
				}
				// 小于24小时
				if (diff < 86400000) {
					return Math.floor(diff / 3600000) + '小时前';
				}
				// 小于30天
				if (diff < 2592000000) {
					return Math.floor(diff / 86400000) + '天前';
				}

				// 超过30天显示具体日期
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			getLv(i) {
				var that = this;
				if (!i) {
					var i = 0;
				}
				var lv = that.$API.getLever(i);
				return lv;
			},
			getLocal(local) {
				var that = this;
				if (local && local != '') {
					var local_arr = local.split("|");
					if (!local_arr[3] || local_arr[3] == 0) {
						return local_arr[2];
					} else {
						return local_arr[3];
					}

				} else {
					return "未知"
				}

			},
			getLvStyle(i) {
				var that = this;
				if (!i) {
					var i = 0;
				}
				var lv = that.$API.getLever(i);
				var rankStyle = that.$API.GetRankStyle();
				var userlvStyle = "color:#fff;background-color: " + rankStyle[lv];
				return userlvStyle;
			},
			getStarPercent(star) {
				if (!this.scoreStats) return 0;
				const starCount = this.scoreStats[`star${star}`];
				const totalCount = Object.values(this.scoreStats).reduce((sum, count) => sum + count, 0);
				if (totalCount === 0) return 0;
				return Math.round((starCount / totalCount) * 100);
			},
			// 添加更新评分统计的方法
			updateScoreStats() {
				if (this.appData && this.appData.scoreJson) {
					this.scoreStats = this.appData.scoreJson;
				}
			},
			openSortPicker() {
				this.showSortPicker = true
			},

			openOrderPicker() {
				this.showOrderPicker = true
			},

			openTypePicker() {
				this.showTypePicker = true
			},

			confirmSort(e) {
				const value = this.sortColumns[e].value
				this.sortBy = value
				this.showSortPicker = false
				this.refreshComments()
			},


			confirmOrder(e) {
				const value = this.orderColumns[e].value
				this.order = value
				this.showOrderPicker = false
				this.refreshComments()
			},


			confirmType(e) {
				const value = this.typeColumns[e].value
				this.commentType = value
				this.showTypePicker = false
				this.refreshComments()
			},

			cancelSort() {
				this.showSortPicker = false
			},

			cancelOrder() {
				this.showOrderPicker = false
			},

			cancelType() {
				this.showTypePicker = false
			},

			refreshComments() {
				this.commentPage = 1
				this.appScoreList = []
				this.getAppScoreList()
			},
			showVersionDetail(version) {
				this.currentVersion = version;
				this.showVersionPopup = true;
			},
			downloadVersion(version) {
				const token = localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo')).token : "";

				uni.showLoading({
					title: '获取下载链接',
					mask: true
				});

				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: "getDownUrl",
						geturl_appid: this.appid,
						geturl_token: token,
						geturl_version_id: version.id,
						geturl_type: "history"
					},
					method: "GET",
					success: (res) => {
						uni.hideLoading();

						if (res.data.code === 200) {
							this.downloadInfo = res.data.data;
							this.showDownloadPopup = true;
						} else {
							uni.showToast({
								title: res.data.msg || "获取下载链接失败",
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							title: "网络请求失败",
							icon: 'none'
						});
					}
				});
			},
			toEdit(id, type) {
				var that = this;
				if (type == 'version') {
					uni.navigateTo({
						url: '/pages/plugins/sy_appbox/post?appId=' + id + '&type=version'
					});
				} else {
					uni.showModal({
						title: '此操作仅为编辑初版应用信息，请确定你的操作。',
						confirmText: '确定编辑',
						cancelText: '更新版本',
						success: function(res) {
							if (res.confirm) {
								if (that.group !== 'administrator') {
									uni.showModal({
										title: '编辑后需要重新审核，确定要编辑应用吗？',
										confirmText: '确定编辑',
										success: function(res) {
											if (res.confirm) {
												uni.navigateTo({
													url: '/pages/plugins/sy_appbox/post?appId=' +
														id
												});
											} else if (res.cancel) {
												return false
												console.log('用户点击取消');
											}
										}
									});
								} else {
									uni.navigateTo({
										url: '/pages/plugins/sy_appbox/post?appId=' + id
									});
								}
							} else if (res.cancel) {
								uni.navigateTo({
									url: '/pages/plugins/sy_appbox/post?appId=' + id + '&type=version'
								});
							}
						}
					});
				}

			},
			toBan(uid) {
				uni.navigateTo({
					url: '/pages/manage/banuser?uid=' + uid
				});
			},
			// 获取版本列表
			getVersionList(isLoadMore = false) {
				if (!isLoadMore) {
					this.versionPage = 1;
					this.versionList = [];
					this.hasMoreVersion = true;
				}

				const params = {
					action: 'getOldAppList',
					getold_appid: this.appid,
					getold_page: this.versionPage,
					getold_limit: this.versionLimit,
					getold_token: this.token,
				};

				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: params,
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							const data = res.data.data || {};
							// 处理返回的版本数据
							const versions = data.versions || [];
							const total = data.total || 0;

							if (isLoadMore) {
								this.versionList = [...this.versionList, ...versions];
							} else {
								this.versionList = versions;
							}

							this.hasMoreVersion = this.versionList.length < total;
							this.versionLoadMoreText = this.hasMoreVersion ? '加载更多' : '没有更多了';
						} else {
							uni.showToast({
								title: res.data.msg || '获取版本列表失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
					}
				});
			},
			// 显示评论弹窗
			showCommentAdd() {
				if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					});
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				this.showCommentPopup = true;
				this.commentappType = 'discuss';
				this.commentText = '';
				this.scoreValue = 5;
				this.commentPics = '';
				this.showUploadBox = false;
			},
			
			// 切换评论类型
			switchCommentType(type) {
				this.commentappType = type;
				this.commentText = '';
				this.showUploadBox = false;
			},
			
			// 提交评论
			submitComment() {
				if (this.submitStatus) return;
				if (!this.commentText.trim()) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					});
					return;
				}
				
				this.submitStatus = true;
				const params = {
					action: 'scoreAdd',
					plugin: 'sy_appbox',
					token: localStorage.getItem('token'),
					aid: this.appid,
					text: this.commentText,
					type: this.commentappType,
					score: this.commentappType === 'score' ? this.scoreValue.toString() : '',
					pics: this.commentPics
				};
				
				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: params,
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							this.showCommentPopup = false;
							this.refreshComments();
						} else {
							uni.showToast({
								title: res.data.msg || '评论失败',
								icon: 'none'
							});
						}
						this.submitStatus = false;
					},
					fail: () => {
						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
						this.submitStatus = false;
					}
				});
			},
			
			// 图片上传相关方法
			showUpload() {
				this.showUploadBox = true;
			},
			
			handleRemove(index) {
				let urls = this.commentPics.split('||');
				urls.splice(index, 1);
				this.commentPics = urls.join('||');
			},
			
			handleSuccess(data) {
				if (data.code === 1) {
					this.commentPics += (this.commentPics ? '||' : '') + data.data.url;
				} else {
					uni.showToast({
						title: data.msg,
						icon: 'none'
					});
				}
			},
			// 显示类型选择弹窗
			showTypeSelect() {
				if (!localStorage.getItem('token') || localStorage.getItem('token') == "") {
					uni.showToast({
						title: "请先登录",
						icon: 'none'
					});
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return false;
				}
				this.showTypePopup = true;
			},
			
			// 选择评论类型
			selectCommentType(type) {
				this.commentappType = type;
				this.showTypePopup = false;
				this.showCommentPopup = true;
				this.commentText = '';
				this.scoreValue = 5;
				this.commentPics = '';
				this.showUploadBox = false;
			},
			
			
			toDelete(id) {
				const that = this;
				uni.showModal({
					title: '提示',
					content: '确定要删除该应用吗？',
					success: function(res) {
						if (res.confirm) {
							that.$Net.request({
								url: that.$API.PluginLoad('sy_appbox'),
								data: {
									action: 'deleteApp',
									delete_appid: id,
									token: localStorage.getItem('token')
								},
								method: 'POST',
								success: (res) => {
									if (res.data.code === 200) {
										uni.showToast({
											title: '删除成功',
											icon: 'success'
										});
										setTimeout(() => {
											uni.navigateBack();
										}, 1500);
									} else {
										uni.showToast({
											title: res.data.msg || '删除失败',
											icon: 'none'
										});
									}
								},
								fail: () => {
									uni.showToast({
										title: '网络错误，请稍后重试',
										icon: 'none'
									});
								}
							});
						}
					}
				});
			},
			deleteComment(id) {
				const that = this;
				uni.showModal({
					title: '提示',
					content: '确定要删除该评论吗？',
					success: function(res) {
						if (res.confirm) {
							that.$Net.request({
								url: that.$API.PluginLoad('sy_appbox'),
								data: {
									action: 'deleteScore',
									delete_id: id,
									token: localStorage.getItem('token')
								},
								method: 'POST',
								success: (res) => {
									if (res.data.code === 200) {
										uni.showToast({
											title: '评论删除成功',
											icon: 'success'
										});
										setTimeout(() => {
											that.getAppScoreList();
										}, 1500);
									} else {
										uni.showToast({
											title: res.data.msg || '评论删除失败',
											icon: 'none'
										});
									}
								},
								fail: () => {
									uni.showToast({
										title: '网络错误，请稍后重试',
										icon: 'none'
									});
								}
							});
						}
					}
				});
			},
			handleLike(comment) {
				if (!localStorage.getItem('token')) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					uni.navigateTo({
						url: '/pages/user/login'
					});
					return;
				}

				this.$Net.request({
					url: this.$API.PluginLoad('sy_appbox'),
					data: {
						action: 'scoreLike',
						plugin: 'sy_appbox',
						token: this.token,
						aid: this.appid,
						score_id: comment.id
					},
					success: (res) => {
						if (res.data.code === 200) {
							comment.is_liked = !comment.is_liked;
							if (comment.is_liked) {
								comment.like_count = (comment.like_count || 0) + 1;
							} else {
								comment.like_count = (comment.like_count || 0) - 1;
							}
						} else {
							uni.showToast({
								title: res.data.msg || '点赞失败',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
					},
				});
			},
			// 选择打赏金额
			ChooseCheckbox(j) {
				let items = this.checkbox;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					this.checkbox[i].checked = false;
				}
				this.checkbox[j].checked = !this.checkbox[j].checked;
			},

			// 执行打赏
			toReward() {
				var that = this;
				var token = "";
				if (localStorage.getItem('userinfo')) {
					var userInfo = JSON.parse(localStorage.getItem('userinfo'));
					token = userInfo.token;
				}
				var rewardList = that.checkbox;
				var num = 10;
				for (var i in rewardList) {
					if (rewardList[i].checked) {
						num = rewardList[i].num;
					}
				}
				
				uni.showLoading({
					title: "加载中"
				});
				
				that.$Net.request({
					url: that.$API.PluginLoad('sy_appbox'),
					data: {
						"aid": that.appData.id,
						"num": num,
						"token": token,
						"action": "tipAdd"
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "GET",
					dataType: 'json',
					success: function(res) {
						setTimeout(function() {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if (res.data.code === 200) {
							setTimeout(() => {
								that.getAppInfo();
							}, 1000);
						}
					},
					fail: function(res) {
						setTimeout(function() {
							uni.hideLoading();
						}, 500);
						uni.showToast({
							title: "网络开小差了哦",
							icon: 'none'
						})
					}
				})
			},


			// 查看打赏记录详情
			goReward(id) {
				uni.navigateTo({
					url: '/pages/plugins/sy_appbox/tipList?id=' + id
				});
			},
		},

		computed: {
			sortText() {
				const option = this.sortColumns.find(item => item.value === this.sortBy)
				return option ? option.text : '排序'
			},

			orderText() {
				const option = this.orderColumns.find(item => item.value === this.order)
				return option ? option.text : '方向'
			},

			typeText() {
				const option = this.typeColumns.find(item => item.value === this.commentType)
				return option ? option.text : '类型'
			}
		},

	};
</script>

<style lang="scss" scoped>
	@import "/styles/home.scss";

	page {
		background-color: #fff;
		color: #333333;
	}
	.dark .info-footer{
		background: linear-gradient(to bottom, #ffffff00, #1c1c1c) !important;
	}
	.dark .user{
		background-color: #2c2c2c !important;
	}
	.color-black {
		color: #333333;
	}

	.header-icon {
		font-size: 36rpx;
		font-weight: 400;
	}

	.bq-box {
		padding: 10rpx 40rpx;
		background-color: #c9edff;
		color: #3ca9c9;
		margin: 30rpx 10rpx 0rpx 10rpx;
	}

	.down-button {
		border-radius: 40rpx;
		background-color: #3cc9a4;
		padding: 10rpx 20rpx;
		color: white;
		font-size: 24rpx;
	}

	.icon5__item--icon {
		width: 100rpx;
		height: 100rpx;
	}

	.app-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.app-box-body {
		display: flex;
		align-items: center;
	}

	.app-box-logo {
		width: 120rpx;
		height: 120rpx;
	}

	.app-box-title {
		font-size: 30rpx;
		font-weight: bold;
	}

	.appinfo-box-title {
		color: #222;
		font-size: 36rpx;
		font-weight: bold;
	}


	.app-box-down {
		background-color: #3cc9a4;
		color: #fff;
		padding: 10rpx 30rpx;
		border-radius: 100rpx;
	}

	.app-box-tag {

		color: #fff;
		padding: 6rpx 6rpx;
		border-radius: 10rpx;
		font-size: 24rpx;
		margin-right: 10rpx;
	}

	.app-tag-1 {
		background-color: deepskyblue;
	}

	.app-tag-2 {
		background-color: #57d1b1;
	}

	.cu-bar {
		display: flex;
		position: relative;
		align-items: center;
		min-height: 55px;
		justify-content: space-between;
	}

	.cu-bar .content {
		text-align: left;
	}

	.appinfo-footer-box {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.appinfo-footer-box-money {
		display: flex;
		align-items: center;
		flex-direction: column;
		color: #333;
	}

	.appinfo-footer-box-share {
		display: flex;
		align-items: center;
		flex-direction: column;
		color: #333;
	}

	.appinfo-footer-box-down {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 44rpx;
		color: fff;
	}

	.appinfo-tag {
		background-color: rgb(228, 247, 253);
		color: #0099bd;
		padding: 6rpx 6rpx;
		border-radius: 10rpx;
		font-size: 24rpx;
		margin-right: 10rpx;
	}

	.info-footer {
		background: linear-gradient(to bottom, #ffffff00, #fff);
		border-top: none;
	}

	.appinfo-box-tabs {
		margin: 5rpx 20rpx 20rpx 20rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.appinfo-box-tabs-item {
		font-size: 26rpx;
		margin-right: 15rpx;
		margin-top: 15rpx;
	}

	.appinfo-box-info {
		margin: 20rpx;
		font-size: 28rpx;
		line-height: 50rpx;
	}

	.list {
		width: 100%;
		display: flex;
		padding: 12rpx 5rpx;
		box-sizing: border-box;

		.item {
			display: flex;
			justify-content: space-evenly;
			align-items: center;

			.text-l {
				color: #ccc;
			}

			.text {
				display: flex;
				flex-direction: column;
				align-items: center;

				>text:first-child {
					font-size: 32rpx;
					line-height: 48rpx;
				}

				>text:last-child {
					font-size: 24rpx;
					color: #999999;
					line-height: 34rpx;
				}
			}
		}
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.scroll-view_H {
		display: flex;
		flex-direction: row;
	}

	.scroll-view-item_H {
		border-radius: 30rpx;
		margin: 10rpx;
	}

	.scroll-2-box {
		margin: 20rpx;
	}

	.pj-box-title {
		color: #555;
		font-size: 80rpx;
		font-weight: bold;

	}

	.pj-box-text {
		font-size: 26rpx;
		color: #777;
	}

	.pj-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20rpx 10rpx;
	}

	.pj-star-box {
		display: flex;
		align-items: center;

	}

	.pj-star-box-1 {
		display: flex;
		align-items: flex-end;
		flex-direction: column;
		justify-content: center;
		font-size: 22rpx;
	}

	.margin-right-10 {
		margin-right: 20rpx;
		margin-bottom: 5rpx;
	}

	.sticky-yc {
		display: none;
	}

	.sticky-xs {
		display: block;
	}

	.app-tag {
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		color: #ffffff;
		margin-right: 12rpx;
		font-size: 24rpx;
	}

	.app-category-tag {
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		background-color: #f5f5f5;
		color: #666666;
		margin-right: 12rpx;
		font-size: 24rpx;
	}

	.app-top {
		display: flex;
		align-items: center;
	}

	.cu-bar .content {
		width: calc(100% - 220rpx);
	}

	.text-title-1 {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.appinfo-box-info-sm {
		background-color: #f4f4f5;
		padding: 20rpx;
		border-radius: 15rpx;
		margin: 20rpx;
	}

	.download-popup {
		padding: 30rpx;

		.download-title {
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 40rpx;
		}

		.download-btn {
			margin: 20rpx 0;
			width: 100%;
			height: 96rpx;
			line-height: 96rpx;
		}

		.loading-text {
			text-align: center;
			padding: 30rpx 0;
			color: #999;
		}
	}

	.btn-color-1 {
		background-color: #3cc9a4 !important;
		border-color: #3cc9a4 !important;
		color: #fff !important;
	}

	.btn-color-2 {
		color: #3cc9a4 !important;
		border-color: #3cc9a4 !important;
		background-color: #f2fffb !important;
	}

	.comment-item {
		padding: 30rpx;
		border-bottom: 1px solid #f5f5f5;

		.comment-header {

			.user-info-box {
				display: flex;
				align-items: center;

				.user-detail {
					margin-left: 20rpx;

					.username {
						display: flex;
						align-items: center;
						font-size: 28rpx;
						font-weight: 500;

						.vip-tag {
							margin-left: 10rpx;

							image {
								width: 70rpx;
								height: 35rpx;
							}
						}
					}

					.comment-time {
						font-size: 24rpx;
						color: #999;
						margin-top: 6rpx;
					}
				}
			}


		}

		.comment-content {
			margin-top: 20rpx;

			.score-display {
				margin-top: 20rpx;
				display: flex;
				align-items: center;

				.score-text {
					margin-left: 10rpx;
					color: #808080;
					font-weight: 500;
				}
			}

			.comment-text {
				margin-top: 20rpx;
				font-size: 28rpx;
				line-height: 1.6;
				color: #333;
			}

			.pic-box {
				margin-top: 20rpx;

				.single-pic {
					width: 400rpx;
				}

				.grid-pic {
					display: grid;
					grid-template-columns: repeat(3, 0fr);
					gap: 20rpx;
				}
			}
		}

		.reply-list {
			margin-top: 20rpx;
			background: #f8f8f8;
			border-radius: 12rpx;
			padding: 20rpx;

			.reply-item {
				display: flex;
				margin-bottom: 20rpx;

				.reply-avatar {
					margin-right: 20rpx;
					flex-shrink: 0;
				}

				.reply-content-box {
					flex: 1;

					.reply-header {
						display: flex;
						align-items: center;
						margin-top: 4rpx;
						margin-bottom: 4rpx;

						.username {
							font-size: 30rpx;
							color: #888;
							font-weight: 500;
						}

						.reply-to {
							font-size: 28rpx;
							color: #888;
							margin: 0 6rpx;
						}
					}

					.reply-body {
						.reply-text {
							font-size: 28rpx;
							color: #333;
							line-height: 1.5;
							margin-bottom: 10rpx;
						}

						.reply-pic {
							.grid-pic {
								display: grid;
								grid-template-columns: repeat(4, 0fr);
								gap: 15rpx;
							}
						}
					}

					.reply-footer {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 10rpx;

						.reply-time {
							font-size: 24rpx;
							color: #999;
						}

						.reply-actions {
							display: flex;
							align-items: center;
							gap: 20rpx;

							.u-icon {
								color: #666;
							}
						}
					}
				}
			}
		}

		// 添加查看全部评论样式
		.view-all-replies {
			font-size: 26rpx;
			color: #777;
			padding: 20rpx 0;
			text-align: center;
			font-weight: 500;

			&:active {
				opacity: 0.7;
			}
		}
		.action-item {
			display: flex;
			align-items: center;
		
			text {
				font-size: 26rpx;
				color: #666;
				margin-left: 6rpx;
		
				&.liked {
					color: #57d1b1;
				}
			}
		}
		.comment-actions {
			margin-top: 20rpx;
			display: flex;
			justify-content: flex-end;

			.action-item {
				display: flex;
				align-items: center;
				margin-left: 30rpx;

				text {
					font-size: 26rpx;
					color: #666;
					margin-left: 6rpx;

					&.liked {
						color: #57d1b1;
					}
				}
			}
		}
	}

	.comment-input-box {
		position: fixed;
		left: 0;
		right: 0;
		background: #fff;
		padding: 20rpx;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

		.input-container {
			display: flex;
			align-items: center;

			.type-switch {
				display: flex;
				align-items: center;
				margin-right: 20rpx;

				text {
					padding: 6rpx 20rpx;
					font-size: 26rpx;
					color: #666;
					border-radius: 30rpx;
					margin-right: 10rpx;

					&.active {
						background: #57d1b1;
						color: #fff;
					}
				}
			}

			.score-input {
				margin-right: 20rpx;
			}

			.comment-input {
				flex: 1;
				height: 70rpx;
				background: #f5f5f5;
				border-radius: 35rpx;
				padding: 0 30rpx;
				font-size: 28rpx;
			}

			.send-btn {
				width: 120rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				background: #ddd;
				color: #fff;
				border-radius: 35rpx;
				margin-left: 20rpx;
				font-size: 28rpx;

				&.active {
					background: #57d1b1;
				}
			}
		}
	}


	.reply-content {
		font-size: 26rpx;
		color: #333;
		margin-top: 6rpx;

	}

	/* 添加新的样式 */
	.filter-bar {
		display: flex;
		padding: 20rpx;
		background: #fff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;

		.filter-item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #666;

			text:last-child {
				margin-left: 6rpx;
				font-size: 24rpx;
			}

			&:not(:last-child) {
				border-right: 1px solid #eee;
			}
		}
	}

	.popup-content {
		padding: 30rpx;

		.popup-title {
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
			color: #333;
		}

		.popup-list {
			.popup-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx;
				font-size: 28rpx;
				color: #666;

				&.active {
					color: #3cc9a4;
				}

				&:not(:last-child) {
					border-bottom: 1px solid #f5f5f5;
				}

				&:active {
					background-color: #f9f9f9;
				}
			}
		}
	}

	.swiper-item {
		padding: 0rpx 25rpx;
	}

	.version-list {
		display: block;
		padding: 20rpx;
	}

	.version-item {
		width: 100%;
		margin-bottom: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.version-info {
		display: flex;
		flex-direction: column;
	}

	.version-header {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.version-title {
		margin-left: 10rpx;
		flex: 1;
		font-size: 26rpx;
		color: #333;

		.version-name {
			font-size: 28rpx;
			font-weight: 500;
			display: block;
			margin-bottom: 4rpx;
		}

		.version-number {
			font-size: 24rpx;
			color: #666;
		}
	}

	.version-download {
		margin-left: auto;
		font-size: 24rpx;
		background-color: #57d1b1;
		color: #fff;
		padding: 10rpx 30rpx;
		border-radius: 100rpx;
	}

	.version-content {
		margin-top: 10rpx;
		padding: 10rpx 0;
		font-size: 24rpx;
		color: #666;

		.version-desc {
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			line-height: 1.5;
			margin-bottom: 10rpx;
		}

		.version-time {
			color: #999;
			font-size: 22rpx;
		}
	}

	.version-popup {
		padding: 40rpx;

		.version-popup-header {
			display: flex;
			justify-content: space-between;

			.version-popup-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}

			.version-popup-close {
				font-size: 40rpx;
				color: #999;
				padding: 10rpx;
			}
		}

		.version-popup-content {
			.version-popup-info {
				margin-bottom: 20rpx;

				.version-popup-version {
					font-size: 28rpx;
					color: #333;
					font-weight: 500;
				}

				.version-popup-time {
					font-size: 24rpx;
					color: #999;
					margin-left: 20rpx;
				}
			}

			.version-popup-desc {
				font-size: 28rpx;
				color: #666;
				line-height: 1.6;
			}
		}
	}

	.text-title-1 {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	// 添加新样式
	.info-section {
		margin: 20rpx 30rpx;

		.info-section-title {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			.title-text {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
				padding-left: 20rpx;
				position: relative;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 6rpx;
					height: 28rpx;
					background: #3cc9a4;
					border-radius: 6rpx;
				}
			}

			.title-line {
				flex: 1;
				height: 2rpx;
				background: #f5f5f5;
				margin-left: 20rpx;
			}
		}

		.info-content {
			font-size: 28rpx;
			line-height: 1.8;
			color: #666;
			padding: 0 20rpx;
		}
	}

	.center-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		margin-top: 80rpx;
	}

	.comment-btn {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		padding: 20rpx;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #333;
		z-index: 999;
	}

	.comment-popup {
		padding: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;
	}

	.comment-type {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.type-item {
		flex: 1;
		text-align: center;
		padding: 10rpx 0;
		border-radius: 10rpx;
		border: 1px solid #ccc;
		color: #333;
		font-size: 28rpx;
		margin: 0 10rpx;

		&.active {
			background: #57d1b1;
			color: #fff;
			border-color: #57d1b1;
		}
	}

	.score-box {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.score-text {
		margin-left: 10rpx;
		font-size: 28rpx;
		color: #333;
	}

	.comment-input {
		background: #f5f5f5;
		border-radius: 10rpx;
		padding: 20rpx;
		margin: 20rpx 0;
	}

	.comment-tools {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
	}

	.tool-left {
		font-size: 40rpx;
		color: #666;
	}

	.tool-right {
		display: flex;
		align-items: center;
	}

	.submit-btn {
		padding: 12rpx 40rpx;
		background: #ddd;
		color: #fff;
		border-radius: 100rpx;
		font-size: 28rpx;

		&.active {
			background: #57d1b1;
		}
	}

	.upload-box {
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #eee;
	}

	.comment-popup {
		padding: 30rpx;
		
		.comment-type {
			display: flex;
			margin-bottom: 30rpx;
			
			.type-item {
				flex: 1;
				text-align: center;
				padding: 20rpx 0;
				font-size: 28rpx;
				color: #666;
				position: relative;
				
				&.active {
					color: #57d1b1;
					
					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						width: 40rpx;
						height: 4rpx;
						background: #57d1b1;
					}
				}
			}
		}
		
		.score-box {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 20rpx 0;
			
			.score-text {
				margin-left: 20rpx;
				font-size: 32rpx;
				color: #57d1b1;
			}
		}
		
		.comment-input {
			background: #f5f5f5;
			border-radius: 12rpx;
			padding: 20rpx;
			margin: 20rpx 0;
			
			textarea {
				width: 100%;
				height: 200rpx;
				font-size: 28rpx;
			}
		}
		
		.comment-tools {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.tool-left {
				font-size: 40rpx;
				color: #666;
			}
			
			.submit-btn {
				padding: 12rpx 40rpx;
				background: #ddd;
				color: #fff;
				border-radius: 100rpx;
				font-size: 28rpx;
				
				&.active {
					background: #57d1b1;
				}
			}
		}
		
		.upload-box {
			margin-top: 20rpx;
			padding-top: 20rpx;
			border-top: 1rpx solid #eee;
		}
	}

	.type-select-popup {
		padding: 30rpx;
		
		.type-select-title {
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}
		
		.type-select-options {
			display: flex;
			justify-content: space-around;
			
			.type-option {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 30rpx;
				
				text {
					&:first-child {
						font-size: 60rpx;
						margin-bottom: 20rpx;
						color: #57d1b1;
					}
					
					&:last-child {
						font-size: 28rpx;
						color: #333;
					}
				}
			}
		}
	}

	.comment-popup {
		.comment-popup-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			margin-bottom: 20rpx;
			
			text {
				&:first-child {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
				}
				
				&.close-icon {
					font-size: 40rpx;
					color: #999;
					padding: 10rpx;
				}
			}
		}
		
		.score-box {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 20rpx 0 30rpx;
			
			.score-text {
				margin-left: 20rpx;
				font-size: 32rpx;
				color: #57d1b1;
				font-weight: bold;
			}
		}
		
		.comment-input {
			background: #f8f8f8;
			border-radius: 12rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;
			
			.textarea-style {
				width: 100%;
				height: 180rpx;
				font-size: 28rpx;
				line-height: 1.5;
				color: #333;
				padding: 0;
			}
		}
		
		.comment-tools {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx 0;
			
			.tool-left {
				text {
					font-size: 44rpx;
					color: #666;
					padding: 10rpx;
				}
			}
			
			.tool-right {
				.submit-btn {
					height: 64rpx;
					line-height: 64rpx;
					padding: 0 40rpx;
					background: #ddd;
					color: #fff;
					border-radius: 32rpx;
					font-size: 28rpx;
					border: none;
					
					&.active {
						background: #57d1b1;
					}
				}
			}
		}
		
		.upload-box {
			margin-top: 20rpx;
			padding: 20rpx 0;
			
			:deep(.u-upload) {
				.u-upload__wrap {
					.u-upload__wrap__preview {
						border-radius: 8rpx;
						overflow: hidden;
					}
					
					.u-upload__wrap__preview__image {
						width: 160rpx;
						height: 160rpx;
						border-radius: 8rpx;
					}
					
					.u-upload__wrap__preview__delete {
						background: rgba(0, 0, 0, 0.5);
						border-radius: 100rpx;
						width: 36rpx;
						height: 36rpx;
						top: 6rpx;
						right: 6rpx;
						
						&__icon {
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}

	.comment-btn {
		position: fixed;
		bottom: 30rpx;
		right: 30rpx;
		background: #57d1b1;
		color: #fff;
		padding: 20rpx 40rpx;
		border-radius: 100rpx;
		box-shadow: 0 4rpx 16rpx rgba(87, 209, 177, 0.3);
		display: flex;
		align-items: center;
		z-index: 999;
		
		text {
			&:first-child {
				font-size: 36rpx;
				margin-right: 10rpx;
			}
			
			&:last-child {
				font-size: 28rpx;
			}
		}
	}

	.info-footer grid col-2 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
	}

	.info-footer-input {
		flex: 1;
	}

	.info-footer-btn {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.user-rz {
		display: flex;
		align-items: center;
	}

	.foot-num {
		margin-left: 10rpx;
		font-size: 28rpx;
		color: #666;
	}

	.reward-log {
		background-color: #fff;
		padding: 20rpx;
		margin: 20rpx;
		border-radius: 12rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.reward-log-main {
		flex: 1;
	}

	.reward-log-btn {
		width: 80rpx;
		text-align: center;
	}

	.reward-log-btn text {
		font-size: 40rpx;
		color: #999;
	}

</style>