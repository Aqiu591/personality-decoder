const { MINI_QUESTIONS } = require('../../utils/questions.js')
const { calculateResult, RESULT_TEMPLATES } = require('../../utils/results.js')

Page({
  data: {
    currentIndex: 0,
    totalQuestions: MINI_QUESTIONS.length,
    currentQuestion: MINI_QUESTIONS[0],
    selectedIndex: -1,
    answers: [],
    progress: 0,
    finished: false
  },

  onLoad() {
    const app = getApp()
    app.globalData.userAnswers = []
    app.globalData.reportResult = null
  },

  selectOption(e) {
    const index = e.currentTarget.dataset.index
    const answers = this.data.answers.slice()
    answers[this.data.currentIndex] = index

    this.setData({ selectedIndex: index, answers })

    setTimeout(() => { this.nextQuestion() }, 400)
  },

  nextQuestion() {
    const nextIndex = this.data.currentIndex + 1

    if (nextIndex >= this.data.totalQuestions) {
      this.calculateAndFinish()
    } else {
      const answers = this.data.answers
      this.setData({
        currentIndex: nextIndex,
        currentQuestion: MINI_QUESTIONS[nextIndex],
        selectedIndex: answers[nextIndex] !== undefined ? answers[nextIndex] : -1,
        progress: Math.round((nextIndex / this.data.totalQuestions) * 100)
      })
    }
  },

  calculateAndFinish() {
    try {
      const answers = this.data.answers
      console.log('答题完成，答案数组:', answers, '长度:', answers.length)

      const result = calculateResult(answers)
      console.log('计算结果:', result ? result.typeName : 'NULL')

      if (!result) {
        console.error('calculateResult 返回了 undefined')
        wx.showToast({ title: '出错了，请重试', icon: 'none' })
        return
      }

      const app = getApp()
      app.globalData.userAnswers = answers
      app.globalData.reportResult = result

      this.setData({ finished: true, progress: 100 })
    } catch (err) {
      console.error('calculateAndFinish 异常:', err)
      wx.showToast({ title: '出错了: ' + (err.message || '未知'), icon: 'none' })
    }
  },

  viewResult() {
    wx.navigateTo({ url: '/pages/result/result' })
  }
})
