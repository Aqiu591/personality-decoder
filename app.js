App({
  onLaunch() {
    // 初始化云开发（完整版启用）
    // wx.cloud.init({ env: 'your-env-id' })
  },
  globalData: {
    userAnswers: [],
    reportResult: null,
    // Mini 版使用静态结果，完整版切换为动态
    useStaticResult: true
  }
})
