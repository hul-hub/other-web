<template>
	<view class="detail-container">
		<view class="head-content">
			<view class="head-time">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-db">
							<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" fields="month">
								<view class="time-contain">
									<view class="uni-input">{{date}}</view>
									<image class="icon-img-time" :src="require('static/icon/go_down_black.png')" mode=""></image>
								</view>
							</picker>
						</view>
					</view>
				</view>
			</view>
			<view class="head-orderamount">
				<text>收入：￥{{orderCount}}&nbsp;&nbsp;总交易笔数：{{pageInfo.total}}</text>
			</view>
		</view>
		<view class="main-content">
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
			 @scroll="scroll">
				<view class="item-money-box" v-for="(item, index) in list" :index="index" :key="index">
					<view class="img-box">
						<image class="icon-img" :src="require('static/icon/free_money.png')" mode=""></image>
					</view>
					<view class="text-box">
						<view class="box-right">
							<view class="box-right-left">
								<view class="item-name">
									{{item.subAccountName?item.subAccountName:item.serproname}}
								</view>
								<view class="item-time">
									{{item.paytype2}}
								</view>
								<view class="item-time">
									{{item.reqtransenddate}}
								</view>
							</view>
							<view class="item-amout">
								<text>{{item.orderamount}}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import request from "@/utils/request";
	import util from "@/utils/util.js";
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				scrollTop: 0,
				list: [],
				orderCount: 0,
				pageInfo: {
					page: 1,
					limit: 20,
					total: 0,
				},
				query: {
					serprocode: "",
					reqtransstartdate: "",
					reqtransenddate: "",
				},
				date: currentDate,
				index: 0,
				endDate: "",
				startDate: "",

			}
		},
		onLoad: function(e) {
			let that = this;
			that.query.serprocode = e.id;
			that.endDate = that.getDate("end");
			that.startDate = that.getDate("start");
			that.loadData();
		},
		methods: {
			bindDateChange(e) {
				let that = this;
				that.date = e.target.value;
				that.pageInfo.page = 1;
				that.pageInfo.limit = 20;
				that.pageInfo.total = 0;
				that.list = [];
				that.loadData();
			},
			upper: function(e) {
				console.log(e)
			},
			// 滚动到底部触发的事件
			lower: function(e) {
				// console.log(e)
				let that = this;
				// console.log(that.pageInfo.page*that.pageInfo.limit <that.pageInfo.total);
				if (that.pageInfo.page * that.pageInfo.limit < that.pageInfo.total) {
					that.pageInfo.page++;
					that.loadData();
				}
			},
			scroll: function(e) {
				// console.log(e)
				this.scrollTop = e.detail.scrollTop
			},
			loadData() {
				var that = this;
				var nowYear = that.date.split("-")[0];
				var nowMonth = that.date.split("-")[1] - 1;
				var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
				var reqtransenddate = util.formatDateYYYYMMDD(monthEndDate)
				let params = {};
				params['page'] = that.pageInfo.page;
				params['limit'] = that.pageInfo.limit;
				params['serprocode'] = that.query.serprocode;
				params['reqtransstartdate'] = that.date + "-1 00:00:00";
				params['reqtransenddate'] = reqtransenddate + " 23:59:59";
				uni.request({
					url: request.apiHttp + "api/queryOrderByUserCode",
					data: params,
					method: "POST",
					dataType: "json",
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: function success(res) {
						var resData = res.data;
						if (resData.code == 200) {
							that.pageInfo.total = resData.count;
							for (let item of resData.data) {
								item['paytype2'] = that.filterPaytype(item.paytypecode) + that.filterGetPayWay(item.paywaycode);
								that.list.push(item);
							}
							that.orderCount = resData.orderCount;
						}
					}
				});

			},
			filterPaytype(paytypecode) {
				switch (paytypecode) {
					case "01":
						return "微信-";
					case "02":
						return "支付宝-";
					case "03":
						return "银联-";
					case "04":
						return "百度-";
					case "05":
						return "京东-";
					case "06":
						return "QQ钱包-";
					default:
						return "暂无-";
				}
			},
			filterGetPayWay(payWayCode) {
				switch (payWayCode) {
					case "AP":
						return "APP支付";
					case "DF":
						return "代付";
					case "FK":
						return "付款码支付";
					case "FW":
						return "服务窗支付";
					case "GZ":
						return "公众号支付";
					case "H5":
						return "H5支付";
					case "KJ":
						return "快捷支付";
					case "SM":
						return "扫码支付";
					case "WG":
						return "网关支付";
					default:
						return "支付方式未知";
				}
			},
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
			}
		},
		computed: {
			// startDate() {
			// 	console.log(this.getDate('start'));
			// 	return this.getDate('start');
			// },
			// endDate() {
			// 	return this.getDate('	');
			// }
		},
	}
</script>

<style scoped>
	.head-content {
		position: fixed;
		background-color: rgb(243 241 241);
		width: 100%;
		height: 2.5rem;
		padding: 0.6rem;
	}

	.head-time {
		font-size: 16px;
	}

	.head-orderamount {
		margin-top: 0.1rem;
		color: #929090;
	}

	.main-content {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 3.7rem;
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
	}

	.text-box {
		flex: 1;
		border-bottom: 1px solid rgb(245 242 242);
	}

	.box-right {
		display: flex;
		justify-content: space-between;
		/* padding: 0.8rem; */
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

	.icon-img-time {
		margin-left: 0.2rem;
		height: 28upx;
		width: 28upx;
		margin-top: 0.2rem;
	}

	.time-contain {
		display: flex;
	}
</style>
