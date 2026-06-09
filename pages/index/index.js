// pages/index/index.js
Page({
  data: {
    // 首页无动态数据
  },

  onLoad() {
    // 页面加载
  },

  startTest() {
    // 重置答题状态
    const app = getApp()
    app.globalData.userAnswers = []
    app.globalData.reportResult = null

    wx.navigateTo({
      url: '/pages/test/test'
    })
  },

  onShareAppMessage() {
    return {
      title: '你确定你了解自己吗？我测完发现了一些没想到的事。',
      path: '/pages/index/index'
    }
  }
})
