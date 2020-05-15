const Mixin = {
  created() {},
  methods: {
    iosEndAndroid() {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //android终端或者uc浏览器
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // console.log(isAndroid,'检查是否安卓')
      if (isAndroid) {
        return "android";
      } else if (isiOS) {
        return "ios";
      } else {
        return "pc";
      }
    },
    isPhone(phone) {
      var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!myreg.test(phone)) {
        return false;
      } else {
        return true;
      }
    },
    // 微信分享
    shareWx(shareParams) {
      wx.updateTimelineShareData({
        title: shareParams.title, // 分享标题
        link: shareParams.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareParams.imgPath // 分享图标
      });
      wx.updateAppMessageShareData({
        title: shareParams.title, // 分享标题
        desc: shareParams.content, // 分享描述
        link: shareParams.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareParams.imgPath // 分享图标
      });

      wx.onMenuShareTimeline({
        title: shareParams.title, // 分享标题
        link: shareParams.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareParams.imgPath, // 分享图标
        success: function() {
          // 用户点击了分享后执行的回调函数
        }
      });
      wx.onMenuShareQZone({
        title: shareParams.title, // 分享标题
        desc: shareParams.content, // 分享描述
        link: shareParams.href, // 分享链接
        imgUrl: shareParams.imgPath // 分享图标
      });
    },
    //app分享
    async shareApp(shareParams) {
      let flag = true;
      try {
        await window.jsObject.goodShare(
          shareParams.title,
          shareParams.imgPath,
          shareParams.href,
          shareParams.content
        );
        flag = false;
      } catch (e) {}
      try {
        await window.webkit.messageHandlers.goodShare.postMessage(shareParams);
        flag = false;
      } catch (e) {}
      return flag;
    }
  },
  mounted() {}
};

export default Mixin;
