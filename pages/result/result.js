Page({
  data: {
    result: null,
    revealedCount: 1,
    shareQuote: ''
  },

  onLoad() {
    try {
      const app = getApp()
      const result = app.globalData.reportResult
      console.log('结果页读取 result:', result ? result.typeName : 'NULL')

      if (!result) {
        wx.showToast({ title: '还没答题，请先测试', icon: 'none' })
        setTimeout(() => { wx.redirectTo({ url: '/pages/index/index' }) }, 1500)
        return
      }

      const shareQuote = this.pickShareQuote(result)

      this.setData({ result, shareQuote, revealedCount: 1 })
    } catch (err) {
      console.error('结果页异常:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  pickShareQuote(result) {
    if (!result.dimensions || !result.dimensions[0]) return result.oneLiner || ''
    const text = result.dimensions[0].analysis
    const parts = text.split(/[。！；]/).filter(s => s.trim().length > 8 && s.includes('你'))
    return parts[0] ? parts[0].trim() : result.oneLiner
  },

  revealNext() {
    const next = this.data.revealedCount + 1
    if (next <= 3) this.setData({ revealedCount: next })
  },

  retest() {
    const app = getApp()
    app.globalData.userAnswers = []
    app.globalData.reportResult = null
    wx.navigateTo({ url: '/pages/test/test' })
  },

  onShareAppMessage() {
    const result = this.data.result
    return {
      title: result ? result.shareText : '测测你的3字身份码？',
      path: '/pages/index/index',
      imageUrl: ''
    }
  }
})
