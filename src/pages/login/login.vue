<template>
	<view class="head-content" :style="{backgroundImage:`url(${indexBackgroundImage})`,backgroundSize: 'cover'}">

		<view class="bind-login">
			<view class="logo-contain">
				<!-- <image :src="require('static/icon/face.jpg')" mode=""></image> -->
			</view>
			<form action="" method="post" id="searchFrm" lay-filter="searchFrm" class="form-pane">
				<view class="form-item">
					<view class="inline">
						<view class="form-item-content">
							<view class="input-group">
								<view class="input-group-prepend">
									<text>账号</text>
								</view>
								<input type="text" v-model="serprocode" class="input-inner" />
							</view>
						</view>
					</view>
					<view class="inline">
						<view class="form-item-content">
							<view class="input-group">
								<view class="input-group-prepend">
									<text>密码</text>
								</view>
								<input type="password" v-model="password" class="input-inner" autocomplete="off" />
							</view>
						</view>
					</view>
					<view class="inline">
						<button type="button" @click="okFun">登陆</button>
					</view>
				</view>
			</form>
		</view>

	</view>
</template>

<script>
	import request from "@/utils/request";
	import indexBackgroundImage from "@/static/login-bg.jpg"

	export default {
		data() {
			return {
				serprocode: "",
				password: "",
				indexBackgroundImage: indexBackgroundImage
			}
		},
		methods: {
			orderData() {
				uni.switchTab({
					url: '../home/home'
				});
			},
			okFun() {
				let that = this;
				let params = {};
				params["usercode"] = that.serprocode;
				params["pwd"] = that.password;
				params["noVerifyCode"] = "1";

				uni.request({
					url: request.apiHttp + "login/loginsubmit", //仅为示例，并非真实接口地址。
					data: params,
					method: "POST",
					dataType: "json",
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: (res) => {
						console.log(res.data.username)
						if (res.data.code == 200) {
							uni.setStorageSync('usercode', that.serprocode);
							uni.setStorageSync('pwd', that.password);
							uni.setStorageSync('username', res.data.username);
							uni.setStorageSync('userType', res.data.userType);
							uni.setStorageSync('serviceType', res.data.serviceType);
							that.orderData();
						} else {
							uni.showToast({
								title: res.data.msg,
								duration: 2000
							});
						}
					}
				});
			}
		},
		onLoad: function(e) {

		},
		onReady: function() {

		},
		onShow: function() {
			const usercode = uni.getStorageSync('usercode');
			if (usercode) {
				this.orderData();
			}
		}
	}
</script>

<style>
	.head-content {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		font-size: 24px;
	}

	.bind-login {
		width: 90%;
	}

	.logo-contain {
		display: flex;
		justify-content: center;
		margin: 110px 0;
	}

	.logo-contain>image {
		height: 120px;
		width: 120px;
	}

	.form-pane {
		width: 100%;
	}

	.form-item {
		line-height: normal;
		display: inline-table;
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
	}


	.inline {
		margin-bottom: 22px;
	}

	.form-item-content {
		line-height: 40px;
		position: relative;
		font-size: 14px;
	}

	.input-group {
		line-height: normal;
		display: inline-table;
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
	}

	.input-group-prepend {
		background-color: #F5F7FA;
		color: #909399;
		vertical-align: middle;
		display: table-cell;
		position: relative;
		border: 1px solid #DCDFE6;
		border-radius: 4px;
		padding: 0 20px;
		width: 1px;
		white-space: nowrap;
		border-right: 0;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.input-group-prepend>span {
		margin-left: 5px;
	}

	.input-inner {
		-webkit-appearance: none;
		background-color: #FFF;
		background-image: none;
		border-radius: 4px;
		border: 1px solid #DCDFE6;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		color: #606266;
		display: block !important;
		font-size: inherit;
		height: 40px;
		line-height: 40px;
		outline: 0;
		padding: 0 15px;
		-webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
		transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
		width: 100%;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	button {
		color: #FFF;
		background-color: #409EFF;
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		border: 1px solid #409EFF;
		-webkit-appearance: none;
		text-align: center;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		outline: 0;
		margin: 0;
		-webkit-transition: .1s;
		transition: .1s;
		font-weight: 500;
		padding: 12px 20px;
		font-size: 14px;
		border-radius: 4px;
		width: 100%;
	}
</style>
