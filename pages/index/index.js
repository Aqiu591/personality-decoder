// pages/index/index.js
const { track } = require('../../utils/analytics')

Page({
  data: {
    // 首页无动态数据
  },

  onLoad() {
    // 页面加载
  },

  startTest() {
    track('start_test', { from: 'index' })
    // 重置答题状态
    const app = getApp()
    app.globalData.userAnswers = []
    app.globalData.reportResult = null
    try { wx.removeStorageSync('lastResult') } catch (_) {}
    try { wx.removeStorageSync('lastAnswers') } catch (_) {}

    wx.navigateTo({
      url: '/pages/test/test'
    })
  },

  goPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    })
  },

  onShareAppMessage() {
    return {
      title: '你确定你了解自己吗？我测完发现了一些没想到的事。',
      path: '/pages/index/index'
    }
  }
})
