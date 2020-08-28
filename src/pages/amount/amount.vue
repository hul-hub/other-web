<template>
	<view class="qrcode-container">
		<view class="content">
			<view class="li-contain">
				<view class="shou-text">
					<text>收款金额</text>
				</view>
				<view class="amount-text">
					<text>￥</text>
					<input class="uni-input" @input="handleInput" v-model="amount" focus type="digit" />
				</view>
				<view class="button-foot">
					<button @click="okFun">确定</button>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount: undefined,
			}
		},
		methods: {
			handleInput(e) {
				clearTimeout(this.timer); //防抖
				this.timer = setTimeout(() => {
					let val = e.target.value;
					let reg = /^(0|[1-9]\d*)(\.\d{1,2})?/;
					let price = val.match(reg);
					this.amount = price ? price[0] : '';
				}, 500);
			},
			okFun() {
				let that = this;
				if (!that.amount) {
					uni.showToast({
						title: '请输入正确的金额',
						duration: 1500
					});
				} else {
					var pages = getCurrentPages();
					var prevPage = pages[pages.length - 2]; //上一个页面
					// 上一个页面最后设置userdata
					prevPage.$vm.amount = that.amount
					uni.navigateBack({ //返回
						delta: 1
					})
				}

			}
		}
	}
</script>

<style>
	.qrcode-container {
		height: 100%;
		background-color: #D1D1D1;
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
		padding: 1rem;
	}

	.shou-text {
		font-size: 16px;
		margin-bottom: 0.8rem;
	}

	.amount-text {
		font-size: 36px;
		font-weight: 600;
		border-bottom: 1px solid #D1D1D1;
		display: flex;
		align-items: center;
		padding-bottom: 0.3rem;
	}

	.amount-text>input {
		font-size: 36px;
	}

	.button-foot {
		margin-top: 1.6rem;
		margin-bottom: 0.4rem;
	}

	.button-foot>button {
		background-color: #3CB371;
		color: #FFFFFF;
	}
</style>
