function o(o, t, a, i) {
  a = a || {}, (i = i || {})["content-type"] = "application/json";
  var r = wx.getStorageSync("token");
  return r && (i && i.token || (i.token = r)), wx.showNavigationBarLoading(), new Promise(function(r, c) {
    wx.request({
      url: n + o,
      header: i,
      data: a,
      method: t,
      success: function(o) {
        "object" === e(o.data) && (-200 === o.data.code ? (wx.showToast({
          title: "为确保能向您提供最准确的服务，请退出应用重新授权",
          icon: "none"
        }), c("请重新登录")) : "30001" !== o.data.code && "30002" !== o.data.code && "30003" !== o.data.code && "30004" !== o.data.code && "30005" !== o.data.code || (wx.removeStorageSync("token"),
          wx.removeStorageSync("user_account"), wx.removeStorageSync("fk_org"), wx.removeStorageSync("wx_open_id"),
          wx.removeStorageSync("wxPermissions"), wx.showToast({
            title: o.data.info + ",请重新登陆！",
            icon: "none"
          }), setTimeout(function() {
            wx.navigateTo({
              url: "/pages/index/index"
            });
          }, 1500), c(o.data.info))), r(o);
      },
      fail: c,
      complete: function() {
        wx.hideNavigationBarLoading();
      }
    });
  });
}

function t(o, t, e) {
  var a = {},
    i = wx.getStorageSync("UserSessionId");
  return i && (a && a.SESSIONID || (a.SESSIONID = i)), wx.showNavigationBarLoading(),
    new Promise(function(i, r) {
      wx.uploadFile({
        url: n + o,
        filePath: e,
        name: t,
        header: a,
        success: function(o) {
          i(o);
        },
        fail: r,
        complete: function() {
          wx.hideNavigationBarLoading();
        }
      });
    });
}

var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
    return typeof o;
  } : function(o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  },
  n = "http://api.hooskp.com/"; // 正式
  // n = "https://api-test.hooskp.com:9100/"; // 测试
module.exports = {
  apiHttp: n,
  socketHttp: "wss://*****.com/wss",
  get: function(t, e, n) {
    return o(t, "GET", e, n);
  },
  post: function(t, e, n) {
    return o(t, "POST", e, n);
  },
  upload: function(o, e, n) {
    return t(o, e, n);
  }
};