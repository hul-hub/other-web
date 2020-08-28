<template>
	<view class="main-content">
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
		 @scroll="scroll">
			<view class="item-money-box" v-for="(item, index) in list" :index="index" :key="index" @click="goPersonDetail(item)">
				<view class="img-box">
					<image class="icon-img" :src="require('static/icon/head2.png')" mode=""></image>
				</view>
				<view class="text-box">
					<view class="box-right">
						<view class="box-right-left">
							<view class="item-name">
								{{item.username}}
							</view>
							<view class="item-time">
								{{item.usercode}}
							</view>
						</view>
						<view class="item-amout">
							<text style="margin-right: 1rem;font-size: 14px;">{{item.status== 1?'启用':'禁用'}}</text>
							<image class="img-next" :src="require('static/icon/go_next.png')" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import request from "@/utils/request";
	export default {
		data() {
			return {
				scrollTop: 0,
				list: [],
			}
		},
		onLoad() {
			let that = this;
			that.loadData();
		},
		methods: {
			upper: function(e) {
				console.log(e)
			},
			lower: function(e) {
				console.log(e)
			},
			scroll: function(e) {
				console.log(e)
				this.scrollTop = e.detail.scrollTop
			},
			goPersonDetail(item) {
				let that = this;
				uni.navigateTo({
					url: '../personDetail/personDetail?id=' + item.usercode
				});
			},
			loadData() {
				var that = this;
				uni.request({
					url: request.apiHttp + "user/queryUserList",
					data: {
						page: 1,
						limit: 99,
						serprocode: uni.getStorageSync('usercode'),
						userType: "3", // 2:门店 ，3 用户
					},
					method: "POST",
					dataType: "json",
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: function success(res) {
						var resData = res.data;
						if (resData.code == 200) {
							that.list = resData.data;
							for (let item of that.list) {
								item['url'] = "static/icon/head.png";
							}
							console.log(that.list)
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.main-content {
		position: absolute;
		width: 100%;
		height: 100%;
		bottom: 0;
	}

	.main-content scroll-view {
		width: 100%;
		height: 100%;
	}

	.item-money-box {
		display: flex;
	}

	.img-box {
		padding: 0.6rem;
		display: flex;
		align-items: center;
	}

	.icon-img {
		height: 60upx;
		width: 60upx;
		align-items: center;
		vertical-align: middle;
		background-repeat: round;
	}

	.text-box {
		flex: 1;
		border-bottom: 1px solid rgb(245 242 242);
	}

	.box-right {
		display: flex;
		justify-content: space-between;
		height: 100%;
	}

	.item-amout,
	.item-name {
		font-size: 16px;
	}

	.item-amout {
		padding: 0.6rem 0.6rem 0.6rem 0;
	}

	.box-right-left {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0.6rem 0 0.6rem 0rem;
	}

	.item-time {
		color: #929090;
	}

	.img-next {
		height: 32upx;
		width: 32upx;
		align-items: center;
		vertical-align: middle;
	}
</style>
