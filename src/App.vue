<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

// 全局配置：请务轻易修改
<style>
	html,
	body {
		margin: 0;
		padding: 0;
		font-size: 14px;
	}

	uni-page-wrapper,
	uni-page-body,
	page,
	#app {
		height: 100% !important;
		overflow: hidden;
	}

	uni-page-head {
		display: none; // 顶部标题隐藏
	}

	.bottom {
		height: 50px;
		border-top: 1px solid rgba(0, 0, 0, 0.33);
		box-sizing: border-box;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		z-index: 999;
	}
</style>
