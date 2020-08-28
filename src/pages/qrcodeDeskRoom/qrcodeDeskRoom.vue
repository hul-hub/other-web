<template>
	<view class="qrcode-container">
		<view class="content">
			<view class="li-contain">
				<view class="qr-head">
					<image class="icon-img" :src="require('static/icon/in_money.png')" mode=""></image>
					<text>二维码收款</text>
				</view>
				<view class="qr-img-cont">
					<view class="qr-img">
						<text>扫二维码向我付款</text>
					</view>
					<view class="img">
						<image :src="qrUrl" mode=""></image>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import request from "@/utils/request";

	export default {
		data() {
			return {
				qrUrl: "",
				id: "",
			}
		},
		methods: {
			ran(m) {
				m = m > 13 ? 13 : m;
				var num = new Date().getTime();
				return num.toString().substring(13 - m);
				num.toString().substring(13 - m);
			},
			exportQrcode() {
				let that = this;
				var params = {};
				params['deskId'] = that.id;
				uni.request({
					url: request.apiHttp + "order/deskMakeQRCode",
					data: params,
					method: "POST",
					dataType: "json",
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: function success(res) {
						that.qrUrl = res.data;
					}
				});

			},
		},
		onLoad: function(e) {
			let that = this;
			that.id = e.id;
		},
		onReady: function() {

		},
		onHide: function() {
			let that = this;
		},
		onShow: function() {
			var that = this;
			that.exportQrcode();
		}
	}
</script>

<style scoped>
	.qrcode-container {
		height: 100%;
		background-color: #3CB371;
		display: flex;
		justify-content: center;
	}

	.content {
		width: 94%;
	}

	.li-contain {
		background-color: #FFFFFF;
		margin-top: 1rem;
		border-radius: 6px;
	}

	.qr-head {
		display: flex;
		padding: 1.2rem 0.8rem;
		background-color: #f8f8f8;
		border-radius: 6px 6px 0 0;
	}

	.qr-head>text {
		margin-left: 1rem;
		color: #3CB371;
		font-size: 16px;
	}

	.icon-img {
		height: 40upx;
		width: 40upx;
		align-items: center;
		vertical-align: middle;
	}

	.qr-img {
		text-align: center;
		margin-top: 1rem;
	}

	.qr-img>text {
		font-size: 12px;

	}

	.img {
		display: flex;
		justify-content: center;
	}

	.img>image {
		width: 310px;
		height: 310px;
	}
</style>
