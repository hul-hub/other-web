<template>
	<view class="container">
		<view class="top-content">
			<view class="uni-list-cell-db">
				<picker @change="bindPickerChange" :value="serindex" :range="serList" range-key="name">
					<view class="uni-input manage-name">{{serList.length >0?serList[serindex].name:""}}</view>
				</picker>
			</view>
			<view class="tab-contain">
				<wuc-tab :tab-list="tabList" :tabCur.sync="tabCur" @change="tabChange"></wuc-tab>
			</view>
			<view class="mer-name">
				<view class="uni-list">
					<view class="uni-list-cell flex-name">
						<view class="uni-list-cell-db">
							<picker @change="bindPickerChange" :value="serindex" :range="serList" range-key="name">
								<!-- <view class="uni-input manage-name">{{serList.length >0?serList[serindex].name:""}}</view> -->
								<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" fields="month">
									<view class="time-contain">
										<view class="uni-input manage-name-time">{{date}}</view>
										<image class="icon-img-time" :src="require('static/icon/go_down.png')" mode=""></image>
									</view>
								</picker>
							</picker>
						</view>
						<view class="">
							<wuc-tab-status :tab-list="statusTabList" :tabCur.sync="statusTabCur" @change="statusTabChange"></wuc-tab-status>
						</view>
					</view>
				</view>
			</view>
			<view class="mer-amount">
				<view class="amount-text">
					<text>共{{orderItem.countNum}}笔，合计</text>
				</view>
				<view class="amount-num">
					<text>￥{{orderItem.total}}</text>
				</view>
			</view>
		</view>
		<view class="bottom-content">
			<view class="bottom-content-con">
				<view class="data-content">
					<text>收入构成</text>
				</view>
				<view class="type-contain">
					<view class="type-contain-left">
						<image class="icon-img" :src="require('static/icon/zfb.png')" mode=""></image>
						<text>支付宝</text>
					</view>
					<view class="type-contain-right">
						{{orderItem.aliPay}}
					</view>
				</view>
				<view class="type-contain">
					<view class="type-contain-left">
						<image class="icon-img" :src="require('static/icon/wx.png')" mode=""></image>
						<text>微信</text>
					</view>
					<view class="type-contain-right">
						{{orderItem.wxPay}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "@/utils/request";
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import WucTabStatus from '@/components/wuc-tab-staus/wuc-tab-staus.vue';
	import util from "@/utils/util.js";

	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				date: currentDate,
				tabCur: 0,
				tabList: [{
					name: '月账单',
					value: 30
				}],
				statusTabList: [{
					name: '支付成功',
					value: "SUCCESS"
				}, {
					name: '未支付',
					value: "NOTPAY"
				}, {
					name: '退款',
					value: "REFUND"
				}],
				statusTabCur: 0,
				serList: [],
				serindex: 0,
				msgType: 'success',
				orderItem: {
					aliPay: 0.00, // 支付宝金额 ,
					countNum: 0, //笔数 ,
					total: 0.00, //金额 ,
					wxPay: 0.00, // 微信金额
				},

			}
		},
		components: {
			WucTab,
			WucTabStatus,
		},
		onLoad() {
			let that = this;
			that.endDate = that.getDate("end");
			that.startDate = that.getDate("start");
		},
		onShow() {
			let that = this;
			that.loadSerproList();
		},
		methods: {
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year;
					month = 1;
				}
				month = month > 9 ? month : '0' + month;
				return `${year}-${month}`;
			},
			bindDateChange(e) {
				let that = this;
				that.date = e.target.value;
				that.loadOrderCount();
			},
			loadSerproList() {
				var that = this;
				let serProCode = uni.getStorageSync('usercode');
				uni.request({
					url: request.apiHttp + "user/getUserListByCode",
					//仅为示例，并非真实接口地址。
					data: {
						serviceType: 2,
						serProCode: serProCode,
						token: ""
					},
					method: "POST",
					dataType: "json",
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: function success(res) {
						var resData = res.data;
						if (resData.code == 200) {
							var data = resData.data;
							var array = [];
							for (let item of data) {
								var arr = {};
								arr['serprocode'] = item.usercode;
								arr['name'] = item.username;
								array.push(arr);
							}

							that.serList = array;
							that.loadOrderCount();
						}
					}
				});
			},
			loadOrderCount() {
				var that = this;
				var nowYear = that.date.split("-")[0];
				var nowMonth = that.date.split("-")[1] - 1;
				var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
				var reqtransenddate = util.formatDateYYYYMMDD(monthEndDate)
				var params = {};
				params['serProCode'] = that.serList[that.serindex].serprocode;
				params['payStatus'] = that.statusTabList[that.statusTabCur].value;
				params['days'] = that.tabList[that.tabCur].value;
				params['reqtransstartdate'] = that.date + "-1 00:00:00";
				params['reqtransenddate'] = reqtransenddate + " 23:59:59";
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
							that.orderItem = resData.data;
						}
					}
				});
			},

			tabChange(index) {
				this.tabCur = index;
				this.loadOrderCount();
			},
			statusTabChange(index) {
				this.statusTabCur = index;
				this.loadOrderCount();
			},
			bindPickerChange: function(e) {
				// console.log('picker发送选择改变，携带值为', e.target.value)
				this.serindex = e.target.value
				this.loadOrderCount();
			},
		}
	}
</script>

<style scoped>
	/* 	uni-page-wrapper,
	uni-page-body {
		
	} */
	.head-logout {
		color: #ddd;
		display: flex;
		flex-direction: row-reverse;
		margin-right: 24upx;
		font-size: 12px;
	}

	.container {
		height: 100%;
		overflow-y: hidden;
	}

	.top-content {
		height: 12.50rem;
		background-color: #3CB371;
		padding-top: 1rem;
	}

	.mer-name {
		margin-top: 1.6rem;
	}

	.manage-name {
		color: #DFFFF8;
		padding-bottom: 0.4rem;
		text-align: center;
	}

	.manage-name-time {
		color: #DFFFF8;
		padding-left: 1rem;
		text-align: center;
	}

	.time-contain {
		display: flex;
	}

	.bottom-content {
		/* height: 65%; */
		height: 29.18rem;
		background-color: #3CB371;
	}

	.bottom-content-con {
		height: 100%;
		background-color: #FFFFFF;
		border-radius: 10px 10px 0 0;
		/* border-top-left-radius: 10px; */
		/* border-top-right-radius: 3px; */
		padding-left: 1rem;
		padding-top: 1.2rem;
	}

	.tab-contain {
		display: flex;
		justify-content: center;
	}


	.flex-name {
		display: flex;
		justify-content: space-between;
	}

	.mer-amount {
		margin-top: 1.6rem;
		padding-left: 1rem;
	}

	.amount-text {
		color: #ddd;
		font-size: 12px;
	}

	.amount-num {
		margin-top: 1.2rem;
		font-size: 22px;
		color: #DFFFF8;
	}

	.data-content {
		font-size: 14px;
	}

	.type-contain {
		display: flex;
		justify-content: space-between;
		padding-right: 12upx;
		margin-top: 1.2rem;
		font-size: 12px;
		height: 50upx;
		line-height: 50upx;
	}
	.icon-img-time {
		margin-left: 0.2rem;
		height: 28upx;
		width: 28upx;
		margin-top: 0.2rem;
	}
	.icon-img {
		height: 40upx;
		width: 40upx;
		align-items: center;
		vertical-align: middle;
	}

	.type-contain-left>text {
		padding-left: 12upx;
	}

	.type-contain-right {
		margin-right: 12upx;
	}
</style>
