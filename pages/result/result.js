// pages/result/result.js — 结果页 v2：命门句 + 短证据 + 矛盾钩子
const { track } = require('../../utils/analytics')

Page({
  data: {
    result: null,
    shareQuote: '',
    killerLine: null,
    keywords: [],
    shortDimensions: [],
    contradictionHook: null,
    patterns: [],
    contradictions: [],
    customAnswers: [],
    highlight: '',
    showPersonalization: false
  },

  onLoad() {
    try {
      const app = getApp()
      let result = app.globalData.reportResult
      // 持久化恢复：小程序被杀进程后可从本地恢复
      if (!result) {
        try { result = wx.getStorageSync('lastResult') } catch (_) {}
        if (result) {
          app.globalData.reportResult = result
        }
      }

      if (!result) {
        wx.showToast({ title: '还没答题，请先测试', icon: 'none' })
        setTimeout(() => { wx.redirectTo({ url: '/pages/index/index' }) }, 1500)
        return
      }

      const shareQuote = this.pickShareQuote(result)
      const p = result.personalization || {}

      this.setData({
        result,
        shareQuote,
        killerLine: result.killerLine || null,
        keywords: result.keywords || [],
        shortDimensions: result.shortDimensions || [],
        contradictionHook: result.contradictionHook || null,
        patterns: p.patterns || [],
        contradictions: p.contradictions || [],
        customAnswers: p.customAnswers || [],
        highlight: p.highlight || '',
        showPersonalization: !!(p.highlight || (p.patterns && p.patterns.length) || (p.contradictions && p.contradictions.length))
      })

      track('result_view', {
        code: result.code,
        typeName: result.typeName,
        intensity: result.intensity,
        patterns: p.patterns ? p.patterns.length : 0,
        contradictions: p.contradictions ? p.contradictions.length : 0
      })
    } catch (err) {
      console.error('结果页异常:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  pickShareQuote(result) {
    // 优先用命门句第一句作为分享引用
    if (result.killerLine && result.killerLine.line1) {
      return result.killerLine.line1
    }
    if (!result.dimensions || !result.dimensions[0]) return result.oneLiner || ''
    const text = result.dimensions[0].analysis
    const parts = text.split(/[。！；]/).filter(s => s.trim().length > 8 && s.includes('你'))
    return parts[0] ? parts[0].trim() : result.oneLiner
  },

  goReport() {
    track('report_open', { from: 'result', code: this.data.result ? this.data.result.code : '' })
    wx.navigateTo({ url: '/pages/report/report' })
  },

  retest() {
    track('retest', { from: 'result', code: this.data.result ? this.data.result.code : '' })
    const app = getApp()
    app.globalData.userAnswers = []
    app.globalData.reportResult = null
    try { wx.removeStorageSync('lastResult') } catch (_) {}
    try { wx.removeStorageSync('lastAnswers') } catch (_) {}
    wx.redirectTo({ url: '/pages/test/test' })
  },

  onShareAppMessage() {
    try {
      const result = this.data.result
      if (!result) return { title: '测测你的性格画像', path: '/pages/index/index' }
      const title = `「${result.code}」——我测出来是这个。你的是什么？`
      track('share_click', { page: 'result', code: result.code, typeName: result.typeName })
      return { title, path: '/pages/index/index' }
    } catch (e) {
      return { title: '测测你的性格画像', path: '/pages/index/index' }
    }
  }
})
