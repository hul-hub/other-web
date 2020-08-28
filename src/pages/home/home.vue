<template>
	<view class="home-container">
		<view class="home-container-top">
			<view class="head-logout">
				<text @click="open">退出</text>
				<text style="margin-right: 12px;" @click="bindFun">绑定</text>
			</view>
			<view class="top-common top-name">
				<text>{{username}}</text>
			</view>
			<view class="top-common top-money-name">
				<text>今日交易金额(元)</text>
			</view>
			<view class="top-common top-money-value">
				<text>{{moneyItem.total}}</text>
			</view>
			<view class="top-amount">
				<view>交易共{{moneyItem.countNumAll}}笔</view>
				<view>支付成功共{{moneyItem.countNum}}笔</view>
			</view>
		</view>
		<view class="qiun-charts">
			<!--#ifdef MP-ALIPAY -->
			<!-- <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio" -->
			<!-- :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchColumn"></canvas> -->
			<!--#endif-->
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
			<!--#endif-->
		</view>
		<view style="height: 10px;background-color: rgb(243 241 241);">

		</view>
		<view class="example-body">
			<uni-grid :column="4" :highlight="true" @change="change" :show-border="false">
				<uni-grid-item v-for="(item, index) in list" :index="index" :key="index">
					<view class="grid-item-box">
						<image :src="item.url" class="image" mode="aspectFill" />
						<text class="text">{{ item.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<template>
			<view>
				<uni-popup ref="popupDialog" type="dialog">
					<uni-popup-dialog :type="msgType" title="退出确认" content="是否确认退出登陆!" :before-close="true" @confirm="dialogConfirm"
					 @close="dialogClose"></uni-popup-dialog>
				</uni-popup>
				<uni-popup ref="bindDialog" type="dialog">
					<uni-popup-dialog title="绑定确认" content="是否确认绑定!" :before-close="true" @confirm="bindDialogConfirm" @close="bindDialogClose"></uni-popup-dialog>
				</uni-popup>
			</view>
		</template>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import request from "@/utils/request";
	import util from "@/utils/util";
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	var _self;
	var canvaColumn = null;
	export default {
		components: {
			uniGrid,
			uniGridItem,
			uniPopup,
			uniPopupDialog
		},
		data() {
			return {
				username: "",
				msgType: 'success',
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				textarea: '',
				scrollTop: 0,
				moneyItem: {
					countNum: 0,
					countNumAll: 0,
					total: 0,
				},
				list: [{
						url: '/static/icon/shop2.png',
						text: '门店',
						badge: '0',
						type: "primary"
					},
					{
						url: '/static/icon/person1.png',
						text: '员工',
						badge: '1',
						type: "success"
					},
				],
			}
		},
		onLoad() {

		},
		onShow() {
			_self = this;
			_self.username = uni.getStorageSync('username')
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function(res) {
					if (res.pixelRatio > 1) {
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio = 2;
					}
				}
			});
			//#endif
			_self.cWidth = uni.upx2px(750);
			_self.cHeight = uni.upx2px(500);
			_self.getServerData();
			_self.loadData();
			if (uni.getStorageSync('userType') == 1) {
				_self.list = [{
						url: '/static/icon/shop2.png',
						text: '门店',
						badge: '0',
						type: "primary"
					},
					{
						url: '/static/icon/person1.png',
						text: '员工',
						badge: '1',
						type: "success"
					},
				];

			} else if (uni.getStorageSync('userType') == 2) {
				_self.list = [{
					url: '/static/icon/shop2.png',
					text: '门店',
					badge: '0',
					type: "primary"
				}];
			} else {
				_self.list = [];
			}
		},
		methods: {
			loadData() {
				var that = this;
				var params = {};
				var date = util.formatDateYYYYMMDD(new Date);
				// console.log(date)
				params['serProCode'] = uni.getStorageSync('usercode');
				params['payStatus'] = "SUCCESS";
				params['days'] = "0";
				params['reqtransstartdate'] = date + " 00:00:00";
				params['reqtransenddate'] = date + " 23:59:59";
				uni.request({
					url: request.apiHttp + "order/count",
					//仅为示例，并非真实接口地址。
					data: params,
					method: "POST",
					dataType: "json",
					header: {},
					success: function success(res) {
						var resData = res.data;
						if (resData.code == 200) {
							that.moneyItem.countNum = resData.data.countNum;
							that.moneyItem.total = resData.data.total;
							that.moneyItem.countNumAll = resData.data.countNumAll;
						}
					}
				});
			},
			change(e) {
				let {
					index
				} = e.detail
				switch (index) {
					case 0:
						uni.navigateTo({
							url: '../shop/shop'
						});
						break;
					case 1:
						uni.navigateTo({
							url: '../person/person'
						});
						break;
					default:
						return;
				}
			},
			getServerData() {
				let that = this;
				let params = {};
				params['serprocode'] = uni.getStorageSync('usercode');
				uni.request({
					url: request.apiHttp + "api/getOrderDetailsByDataFormCode",
					//仅为示例，并非真实接口地址。
					data: params,
					method: "POST",
					dataType: "json",
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: function success(res) {
						var resData = res.data;
						if (resData.code == 200) {
							let timeArr = [];
							let series = [{
								"name": "近七天交易情况",
								"data": [],
								"color": "#3CB371"
							}];
							// console.log(series.data)
							for (let item of resData.data) {
								timeArr.push(item.days)
								series[0].data.push(item.ordemanay)
							}
							let Column = {
								categories: [],
								series: []
							};
							//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
							Column.categories = timeArr;
							Column.series = series;
							_self.showColumn("canvasColumn", Column);
						}
					}
				});

			},
			showColumn(canvasId, chartData) {
				canvaColumn = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					padding: [15, 5, 0, 15],
					legend: {
						show: true,
						padding: 5,
						lineHeight: 11,
						margin: 0,
					},
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid: true,
					},
					yAxis: {
						data: [{
							position: 'right',
							axisLine: false,
							format: (val) => {
								return val.toFixed(0) + '元'
							},
						}]
					},
					dataLabel: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: _self.cWidth * _self.pixelRatio * 0.45 / chartData.categories.length
						}
					}
				});
				// console.log(canvaColumn)
			},
			touchColumn(e) {
				//这里一定要加，将偏移量累加到该事件中
				//#ifndef H5
				e.changedTouches[0].y += this.scrollTop;
				e.mp.changedTouches[0].y += this.scrollTop;
				//#endif
				canvaColumn.showToolTip(e, {
					format: function(item, category) {
						if (typeof item.data === 'object') {
							return category + '交易情况:' + item.data.value
						} else {
							return category + '交易情况:' + item.data
						}
					}
				});
				canvaColumn.touchLegend(e, {
					animation: true
				});
			},
			bindFun() {
				this.$refs.bindDialog.open()
			},
			bindDialogClose(done) {
				// 需要执行 done 才能关闭对话框
				done()
			},
			bindDialogConfirm(done) {
				var params = {};
				params['serprocode'] = uni.getStorageSync('usercode');
				params['password'] = uni.getStorageSync('pwd');
				params['code'] = uni.getStorageSync('openId');
				uni.request({
					url: request.apiHttp + "serpro/saveWeChat",
					//仅为示例，并非真实接口地址。
					data: params,
					method: "POST",
					dataType: "json",
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: function success(res) {
						var resData = res.data;
						alert(resData.msg);
					}
				});
				done()
			},
			/**
			 * 对话框取消按钮
			 */
			dialogClose(done) {
				this.msgType = 'info'
				// 需要执行 done 才能关闭对话框
				done()
			},
			open() {
				// console.log(1111);
				this.$refs.popupDialog.open()
			},
			/**
			 * 对话框点击确认按钮
			 */
			dialogConfirm(done) {
				uni.removeStorageSync('usercode');
				uni.removeStorageSync('pwd');
				uni.removeStorageSync('username');
				uni.removeStorageSync('userType');
				uni.removeStorageSync('serviceType');
				uni.navigateTo({
					url: '../login/login'
				});
				done()
			},

		}
	}
</script>

<style scoped>
	.home-container {
		font-size: 12px;
	}

	.home-container-top {
		background-color: #3CB371;
		color: #ecebeb;
		padding-top: 0.4rem;
	}

	.head-logout {
		color: #ddd;
		display: flex;
		flex-direction: row-reverse;
		margin-right: 24upx;
		font-size: 12px;
	}

	.top-common {
		text-align: center;
	}

	.top-name {
		font-size: 16px;
		padding-top: 0.4rem;
	}

	.top-money-name {
		margin-top: 0.8rem;
	}

	.top-money-value {
		font-size: 38px;
		color: #e8e86c;
	}

	.top-amount {
		margin-top: 0.4rem;
		padding: 0 2.6rem 0.8rem 2.6rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		margin-top: 1rem;
		padding-bottom: 0.4rem;
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.example-body {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}

	.example-body {
		flex-direction: column;
		/* padding: 0 1rem; */
		background-color: #ffffff;
	}

	.grid-item-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10px 0;
	}

	.image {
		width: 68rpx;
		height: 68rpx;
	}
</style>
