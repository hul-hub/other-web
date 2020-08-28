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
					<view class="amount-text" v-if="amount">
						<text>￥</text>
						<text>{{amount}}</text>
					</view>
					<view class="img">
						<image :src="qrUrl" mode=""></image>
					</view>
				</view>
				<view class="hand-foot">
					<view class="" v-if="amount" @click="resetFun">
						清除金额
					</view>
					<view class="" @click="setAmount" v-else>
						设置金额
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
				amount: undefined,
				serprocode: "",
			}
		},
		methods: {
			setAmount() {
				uni.navigateTo({
					url: '../amount/amount'
				});
			},
			resetFun() {
				let that = this;
				that.amount = undefined;
				that.exportQrcode();
			},
			ran(m) {
				m = m > 13 ? 13 : m;
				var num = new Date().getTime();
				return num.toString().substring(13 - m);
				num.toString().substring(13 - m);
			},
			getSerprocode() {
				let that = this;
				var params = {};
				params['userCode'] = uni.getStorageSync('usercode');
				uni.request({
					url: request.apiHttp + "user/getSerProCodeByUserCode",
					data: params,
					method: "POST",
					dataType: "json",
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: function success(res) {
						var resData = res.data;
						if (resData.code == 200) {
							that.serprocode = resData.data;
						}
					}
				});
			},
			exportQrcode() {
				let that = this;
				if (that.amount) {
					let jsonData = {
						mchOrderId: that.ran(13),
						orderAmount: that.amount * 100,
						serProCode: that.serprocode,
						payTypeCode: "03", // 目前设置金额支付只支持银联
						profitSharing: "N",
						spbill_create_ip: "195.15.6.52",
						goodsName: "手机",
						flag: "1",
						userId: "",
						backUrl: "https://baidu.com",
						product_id: "10",
						subAccount: uni.getStorageSync('usercode'),
					};
					uni.request({
						url: request.apiHttp + "api/hoopay/pushOrder",
						data: JSON.stringify(jsonData),
						method: "POST",
						dataType: "json",
						header: {
							'content-type': 'application/json' //自定义请求头信息
						},
						success: function success(res) {
							// that.qrUrl = res.data;
							var resData = res.data;
							console.log(resData)
							if (resData.code_url) {
								that.qrUrl = resData.code_url;
							} else {
								alert(resData.respMsg);
							}
						}
					});
				} else {
					var params = {};
					params['serprocode'] = uni.getStorageSync('usercode');
					uni.request({
						url: request.apiHttp + "order/makeQRCode",
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
				}

			},
		},
		onLoad: function(e) {
			let that = this;
			that.getSerprocode();
		},
		onReady: function() {

		},
		onHide: function() {
			let that = this;
			that.amount = undefined;
		},
		onShow: function() {
			var that = this;
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			if (currPage.amount) {
				let res = currPage.amount;
				that.amount = res
			}
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

	.hand-foot {
		padding-bottom: 1rem;
		color: #007AFF;
		display: flex;
		justify-content: center;
	}

	.amount-text {
		font-size: 26px;
		font-weight: 600;
		text-align: center;
		margin-top: 0.3rem;
	}
</style>
