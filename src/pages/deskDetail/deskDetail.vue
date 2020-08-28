<template>
	<view class="main-content">
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
		 @scroll="scroll">
			<view class="item-money-box" v-for="(item, index) in list" :index="index" :key="index" @click="goQrcodeFun(item)">
				<view class="img-box">
					<image class="icon-img" :src="require('static/icon/desk_list.png')" mode=""></image>
				</view>
				<view class="text-box">
					<view class="box-right">
						<view class="box-right-left">
							<view class="item-name">
								{{item.deskName}}
							</view>
							<view class="item-time">
								{{item.userCode}}
							</view>
						</view>
						<view class="item-amout">
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
				usercode: "",
			}
		},
		onLoad(e) {
			let that = this;
			that.usercode = e.id;
			that.loadData();
			
		},
		methods: {
			goQrcodeFun(item) {
				uni.navigateTo({
					url: '../qrcodeDeskRoom/qrcodeDeskRoom?id=' + item.id
				});
			},
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
			loadData() {
				var that = this;
				uni.request({
					url: request.apiHttp + "user/getOrdermgVestinMainPage",
					data: {
						page: 1,
						limit: 99,
						userCode: that.usercode,
						deskType: "1", // 1:桌子 2：包厢
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
