<template>
	<view class="shopChild-container">
		<view class="shopChild-container-top">
			<view class="shopChild-con">
				<image class="icon-img" :src="require('static/icon/shop_child.png')" mode=""></image>
			</view>
			<view class="head-name">
				{{name}}
			</view>
		</view>
		<view class="">
			<view class="content-name">
				基本功能
			</view>
			<view class="example-body">
				<uni-grid :column="2" :highlight="true" @change="change">
					<uni-grid-item v-for="(item, index) in list" :index="index" :key="index">
						<view class="grid-item-box">
							<image :src="item.url" class="image" mode="aspectFill" />
							<text class="text-name">{{ item.text }}</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>
	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	export default {
		components: {
			uniGrid,
			uniGridItem
		},
		data() {
			return {
				usercode: "",
				name: "",
				list: [{
						url: '/static/icon/room.png',
						text: '包厢',
						badge: '0',
						type: "primary"
					},
					{
						url: '/static/icon/desk.png',
						text: '桌台',
						badge: '1',
						type: "success"
					},
				],
			}
		},
		onLoad: function(e) {
			let that = this;
			that.usercode = e.id;
			that.name = e.name;
		},
		methods: {
			change(e) {
				let that = this;
				let {
					index
				} = e.detail
				switch (index) {
					case 0:
						uni.navigateTo({
							url: '../roomDetail/roomDetail?id=' + that.usercode
						});
						break;
					case 1:
						uni.navigateTo({
							url: '../deskDetail/deskDetail?id=' + that.usercode
						});
						break;
					default:
						return;
				}
			},
		}
	}
</script>

<style scoped>
	.shopChild-container-top {
		background-color: #3CB371;
		height: 8rem;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.shopChild-con {
		background-color: #FFFFFF;
		height: 150upx;
		width: 150upx;
		border-radius: 75upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon-img {
		height: 100upx;
		width: 100upx;
	}

	.head-name {
		margin-top: 0.4rem;
		font-size: 16px;
		color: #FFFFFF;
	}

	.content-name {
		font-size: 12px;
		background-color: rgb(243 241 241);
		padding: 0.4rem;
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
		width: 120rpx;
		height: 120rpx;
	}

	.text-name {
		margin-top: 0.4rem;
	}
</style>
