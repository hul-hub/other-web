<template>
	<view class="content">
		<!-- {{code}} -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: "",
			}
		},
		components: {},
		onLoad() {
			var url = window.location.href;
			if(uni.getStorageSync('openId')){
				uni.removeStorageSync('openId');
			}
			this.code = url.substring(url.indexOf("?") + 6, url.indexOf("&"));
			uni.setStorageSync('openId', this.code);
			uni.redirectTo({
				url: '../login/login'
			});
		},
		methods: {}
	}
</script>

<style>
</style>
