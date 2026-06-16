const { MINI_QUESTIONS } = require('../../utils/questions.js')
const { calculateResult } = require('../../utils/results.js')
const { track } = require('../../utils/analytics.js')

function decorateOptions(question, selectedIndices) {
  if (!question || !question.options) return []
  const selected = selectedIndices || []
  return question.options.map((option, index) => ({
    ...option,
    index,
    selected: selected.indexOf(index) > -1
  }))
}

Page({
  data: {
    currentIndex: 0,
    totalQuestions: MINI_QUESTIONS.length,
    currentQuestion: MINI_QUESTIONS[0],
    currentOptions: decorateOptions(MINI_QUESTIONS[0], []),
    selectedIndices: [],          // v3: 多选 → 数组
    answers: [],                  // 每题的答案：[] | [0,2] | '自定义文本'
    progress: 0,
    finished: false,
    // 自定义输入
    customMode: false,
    customText: ''
  },

  onLoad() {
    const app = getApp()
    app.globalData.userAnswers = []
    app.globalData.reportResult = null
  },

  // ──── 多选：toggle 选项 ────
  toggleOption(e) {
    if (this.data.customMode) return  // 自定义模式下不允许选选项

    const optIndex = e.currentTarget.dataset.index
    let selected = this.data.selectedIndices.slice()

    const pos = selected.indexOf(optIndex)
    if (pos > -1) {
      selected.splice(pos, 1)      // 已选中 → 取消
    } else {
      selected.push(optIndex)      // 未选中 → 加入
    }

    this.setData({
      selectedIndices: selected,
      currentOptions: decorateOptions(this.data.currentQuestion, selected)
    })
  },

  // ──── 都不像？自己写 ────
  enableCustom() {
    const currentAnswer = this.data.answers[this.data.currentIndex]
    const existingText = (typeof currentAnswer === 'string') ? currentAnswer : ''

    this.setData({
      customMode: true,
      selectedIndices: [],
      currentOptions: decorateOptions(this.data.currentQuestion, []),
      customText: existingText
    })
  },

  onCustomInput(e) {
    this.setData({ customText: e.detail.value })
  },

  submitCustom() {
    const text = this.data.customText.trim()
    if (!text) {
      wx.showToast({ title: '写点什么吧', icon: 'none' })
      return
    }

    this.setData({ customMode: false, customText: '' })
    this.saveAndAdvance(text)
  },

  cancelCustom() {
    // 恢复之前的选项状态
    const prevAnswer = this.data.answers[this.data.currentIndex]
    if (Array.isArray(prevAnswer)) {
      this.setData({
        selectedIndices: prevAnswer.slice(),
        currentOptions: decorateOptions(this.data.currentQuestion, prevAnswer),
        customMode: false,
        customText: ''
      })
    } else if (typeof prevAnswer === 'number') {
      this.setData({
        selectedIndices: [prevAnswer],
        currentOptions: decorateOptions(this.data.currentQuestion, [prevAnswer]),
        customMode: false,
        customText: ''
      })
    } else {
      this.setData({
        selectedIndices: [],
        currentOptions: decorateOptions(this.data.currentQuestion, []),
        customMode: false,
        customText: ''
      })
    }
  },

  // ──── 上一题 ────
  prevQuestion() {
    const prevIndex = this.data.currentIndex - 1
    if (prevIndex < 0) return

    const prevAnswer = this.data.answers[prevIndex]
    this.restoreQuestionState(prevIndex, prevAnswer)
  },

  // ──── 下一题 ────
  nextQuestion() {
    // 自定义模式 → 先提交自定义文本
    if (this.data.customMode) {
      this.submitCustom()
      return
    }

    if (this.data.selectedIndices.length === 0) {
      wx.showToast({ title: '至少选一个，或点"自己写"', icon: 'none' })
      return
    }

    this.saveAndAdvance(this.data.selectedIndices.slice())
  },

  // ──── 保存当前题答案并前进 ────
  saveAndAdvance(value) {
    const answers = this.data.answers.slice()
    answers[this.data.currentIndex] = value

    const nextIndex = this.data.currentIndex + 1

    if (nextIndex >= this.data.totalQuestions) {
      // 全部完成
      this.setData({ answers, finished: true, progress: 100, customMode: false, customText: '' })
      this.calculateAndFinish(answers)
    } else {
      const nextAnswer = answers[nextIndex]
      this.setData({ answers })
      this.restoreQuestionState(nextIndex, nextAnswer)
    }
  },

  // ──── 恢复到指定题目的状态 ────
  restoreQuestionState(qIndex, qAnswer) {
    if (typeof qAnswer === 'string') {
      this.setData({
        currentIndex: qIndex,
        currentQuestion: MINI_QUESTIONS[qIndex],
        currentOptions: decorateOptions(MINI_QUESTIONS[qIndex], []),
        selectedIndices: [],
        customMode: true,
        customText: qAnswer,
        progress: Math.round((qIndex / this.data.totalQuestions) * 100)
      })
    } else if (Array.isArray(qAnswer) && qAnswer.length > 0) {
      this.setData({
        currentIndex: qIndex,
        currentQuestion: MINI_QUESTIONS[qIndex],
        currentOptions: decorateOptions(MINI_QUESTIONS[qIndex], qAnswer),
        selectedIndices: qAnswer.slice(),
        customMode: false,
        customText: '',
        progress: Math.round((qIndex / this.data.totalQuestions) * 100)
      })
    } else if (typeof qAnswer === 'number') {
      // 兼容旧格式（单选）
      this.setData({
        currentIndex: qIndex,
        currentQuestion: MINI_QUESTIONS[qIndex],
        currentOptions: decorateOptions(MINI_QUESTIONS[qIndex], [qAnswer]),
        selectedIndices: [qAnswer],
        customMode: false,
        customText: '',
        progress: Math.round((qIndex / this.data.totalQuestions) * 100)
      })
    } else {
      this.setData({
        currentIndex: qIndex,
        currentQuestion: MINI_QUESTIONS[qIndex],
        currentOptions: decorateOptions(MINI_QUESTIONS[qIndex], []),
        selectedIndices: [],
        customMode: false,
        customText: '',
        progress: Math.round((qIndex / this.data.totalQuestions) * 100)
      })
    }
  },

  // ──── 计算并完成 ────
  calculateAndFinish(answers) {
    try {
      // 从历史记录中获取 sessionIndex (首次=0)
      var sessionIndex = 0
      try {
        var history = wx.getStorageSync('testHistory')
        if (history && history.records) { sessionIndex = history.records.length }
      } catch (_) {}

      var result = calculateResult(answers, { sessionIndex: sessionIndex })
      if (!result) {
        wx.showToast({ title: '出错了，请重试', icon: 'none' })
        return
      }

      const app = getApp()
      app.globalData.userAnswers = answers
      app.globalData.reportResult = result
      // 持久化保底：小程序被杀进程后可从本地恢复
      try { wx.setStorageSync('lastResult', result) } catch (_) {}
      const customAnswerCount = answers.filter(answer => typeof answer === 'string' && answer.trim()).length
      const selectedAnswerCount = answers.filter(answer => Array.isArray(answer) || typeof answer === 'number').length
      track('test_complete', {
        answerCount: answers.length,
        selectedAnswerCount,
        customAnswerCount,
        code: result.code,
        typeName: result.typeName,
        intensity: result.intensity,
        patterns: result.personalization ? result.personalization.patterns.length : 0,
        contradictions: result.personalization ? result.personalization.contradictions.length : 0
      })
    } catch (err) {
      console.error('calculateAndFinish 异常:', err)
      wx.showToast({ title: '出了点小问题，重试一下看看', icon: 'none' })
    }
  },

  viewResult() {
    wx.redirectTo({ url: '/pages/result/result' })
  }
})
