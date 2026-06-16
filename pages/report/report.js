// pages/report/report.js — 深层解读页
const { track } = require('../../utils/analytics')

Page({
  data: {
    result: null,
    patterns: [],
    contradictions: [],
    customAnswers: [],
    highlight: '',
    deepRead: {}
  },

  onLoad() {
    // 记录进入时间（停留时长埋点）
    this._enterTime = Date.now()
    // 防重复标记
    this._scrollEndTracked = false
    this._modulesTracked = {}

    try {
      const app = getApp()
      let result = app.globalData.reportResult
      // 持久化恢复
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

      const p = result.personalization || {}
      const deepRead = buildDeepRead(result, p)

      this.setData({
        result,
        patterns: p.patterns || [],
        contradictions: p.contradictions || [],
        customAnswers: p.customAnswers || [],
        highlight: p.highlight || '',
        deepRead
      })

      track('report_view', {
        code: result.code,
        typeName: result.typeName,
        intensity: result.intensity
      })
    } catch (err) {
      console.error('深层解读页异常:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  onReady() {
    // 页面首次渲染完成后，启动曝光监听
    if (!this.data.result) return
    try {
      this._setupScrollEndObserver()
      this._setupModuleExposureObserver()
    } catch (e) {
      console.warn('埋点观察器初始化失败', e)
    }
  },

  onUnload() {
    // 停留时长
    try {
      if (this._enterTime) {
        const durationMs = Date.now() - this._enterTime
        track('deep_read_duration', { durationMs })
      }
    } catch (e) {
      // 静默失败，不影响页面卸载
    }

    // 断开观察器
    if (this._scrollObserver) this._scrollObserver.disconnect()
    if (this._moduleObserver) this._moduleObserver.disconnect()
  },

  onShareAppMessage() {
    try {
      const result = this.data.result
      if (!result) return { title: '测测你的性格画像', path: '/pages/index/index' }
      track('share_click', { page: 'report', code: result.code, typeName: result.typeName })
      return { title: `「${result.code}」——我测出来是这个。你的是什么？`, path: '/pages/index/index' }
    } catch (e) {
      return { title: '测测你的性格画像', path: '/pages/index/index' }
    }
  },

  goBack() {
    wx.navigateBack()
  },

  // ════ 埋点：滚动到底部（读完率） ════
  _setupScrollEndObserver() {
    const observer = this.createIntersectionObserver()
    observer.relativeToViewport({ bottom: 0 }).observe('.disclaimer', (res) => {
      try {
        if (res.intersectionRatio > 0 && !this._scrollEndTracked) {
          this._scrollEndTracked = true
          const result = this.data.result || {}
          track('deep_read_scroll_end', { code: result.code || '' })
        }
      } catch (e) {
        // 埋点失败不影响页面
      }
    })
    this._scrollObserver = observer
  },

  // ════ 埋点：模块曝光 ════
  _setupModuleExposureObserver() {
    const modules = ['misunderstood', 'exhaustion', 'hiddenPattern', 'workRhythm', 'reverseTips']
    const observer = this.createIntersectionObserver()
    observer.relativeToViewport({ bottom: 0 })
    // observe 只观察第一个匹配节点，因此为每个模块单独注册选择器
    modules.forEach(module => {
      observer.observe(`.deep-card[data-module="${module}"]`, (res) => {
        try {
          if (res.intersectionRatio > 0 && !this._modulesTracked[module]) {
            this._modulesTracked[module] = true
            track('deep_read_module_view', { module })
          }
        } catch (e) {
          // 埋点失败不影响页面
        }
      })
    })
    this._moduleObserver = observer
  }
})

// ════ 深层解读生成器 — 基于用户答题数据 ════

function buildDeepRead(result, p) {
  const patterns = p.patterns || []
  const contradictions = p.contradictions || []
  const scores = result._scores || {}
  const dims = result.dimensions || []

  return {
    misunderstood: buildMisunderstood(contradictions, dims),
    exhaustion: buildExhaustion(patterns, dims),
    hiddenPattern: buildHiddenPattern(patterns, contradictions),
    workRhythm: buildWorkRhythm(scores, result.code),
    reverseTipEvidence: buildReverseTipEvidence(patterns, contradictions),
    reverseTips: buildReverseTips(patterns, contradictions, result.code)
  }
}

// ════ 模块 1：你最容易被误解的地方 ════
function buildMisunderstood(contradictions, dims) {
  // 优先使用矛盾规则中的"外刚内柔"或"社交分裂"
  const split = contradictions.find(c => c.id === 'public_tough_private_soft' || c.id === 'social_split')

  if (split) {
    const evidenceMap = {
      'public_tough_private_soft': '第3题 + 第12题：你在公开场合的处理方式 vs 私下独处时的真实状态',
      'social_split': '第6题 + 第14题：你对独处的渴望 vs 你对有深度社交的回味'
    }
    return {
      evidence: evidenceMap[split.id] || '',
      body: split.body
    }
  }

  // fallback: 使用第一个维度的分析
  if (dims.length > 0) {
    return {
      evidence: '基于你 15 道题的整体答题路径',
      body: dims[0].analysis
    }
  }

  return null
}

// ════ 模块 2：你真正累的来源 ════
function buildExhaustion(patterns, dims) {
  // 优先检测导致消耗的模式
  const draining = patterns.find(p =>
    p.id === 'social_archivist' || p.id === 'internal_processor' ||
    p.id === 'self_aware_distancer' || p.id === 'analytical_processor'
  )

  if (draining) {
    const evidenceMap = {
      'social_archivist': '第2题 + 第14题：社交中持续观察分析 → 事后继续处理归档',
      'internal_processor': '第5题 + 第12题：情绪入口和出口都是"一个人消化"',
      'self_aware_distancer': '第1题 + 第7题：持续自我监控 → 管理社交呈现',
      'analytical_processor': '第5题 + 第9题：情绪事件变成分析题 → 想不通不翻篇'
    }
    return {
      evidence: evidenceMap[draining.id] || '',
      body: draining.body
    }
  }

  // fallback: 使用第二维度
  if (dims.length > 1) {
    return {
      evidence: '基于答题模式检测',
      body: dims[1].analysis
    }
  }

  return null
}

// ════ 模块 3：你在关系里的选择模式 ════
function buildHiddenPattern(patterns, contradictions) {
  // 优先使用关系相关的模式
  const relational = patterns.find(p =>
    p.id === 'indirect_conflict' || p.id === 'measured_assertive' ||
    p.id === 'alone_essential'
  )

  if (relational) {
    return {
      evidence: '来自你的几道答案：你在不同题目中选了同一种行为策略',
      body: relational.body
    }
  }

  // fallback: 使用矛盾中的计划vs冲动
  const planLeap = contradictions.find(c => c.id === 'plan_vs_leap')
  if (planLeap) {
    return {
      evidence: '这里有个有意思的反差',
      body: planLeap.body
    }
  }

  return {
    evidence: '基于你 15 道题的整体答题路径',
    body: '你在关系里的选择模式，不一定表现为某个明显冲突，而更像一种稳定的选择习惯：哪些人你愿意靠近，哪些场合你会自动后退，哪些话你会说出口，哪些话你会吞回去。真正值得看的不是”你合不合群”，而是你把精力交给谁、又从谁那里慢慢收回来。'
  }
}

// ════ 模块 4：你适合的工作/创作节奏 ════
function buildWorkRhythm(scores, code) {
  const energy = scores.energyScore || 0
  const rhythm = scores.rhythmScore || 0

  // 根据答题倾向推断工作节奏
  let body = ''

  // 能量倾向 → 独立 vs 协作
  if (energy > 20) {
    body += '你的能量在人群里自动充电。协作、讨论、即兴脑暴——这些是你的加速器。单独的办公室反而会让你慢下来。你需要的是能随时交流的团队节奏。\n\n'
  } else if (energy < -20) {
    body += '你需要大段的、不被打断的时间。你的最佳产出发生在别人都不在的时候。开着门、随时会被叫到的环境会持续消耗你。深度工作 > 高频沟通。\n\n'
  } else {
    body += '你可以在协作和独立之间灵活切换。关键不是"哪种方式"，是"什么阶段"——前期需要碰撞，后期需要安静消化。给自己留够切换的空间。\n\n'
  }

  // 节奏倾向 → 结构 vs 自由
  if (rhythm > 20) {
    body += '你适合有清晰节点的工作方式。不一定要被人管，但需要知道"什么时候算做完"。可预测的节奏让你在框架内发挥最大创造力。'
  } else if (rhythm < -20) {
    body += '别把自己塞进朝九晚五的格子。你的产出节奏是脉冲式的——可能沉默三天然后一天出别人一周的量。间歇性爆发是你最有效率的姿态。'
  } else {
    body += '你既能在结构里运转，也能在自由里发挥。关键是找到一个允许你偶尔切换节奏的环境。'
  }

  return {
    evidence: '从你的答题节奏看：你更适合这种工作/创作状态',
    body
  }
}

function buildReverseTipEvidence(patterns, contradictions) {
  const signals = []
  if (patterns.length) signals.push(`${patterns.length} 个答题模式`)
  if (contradictions.length) signals.push(`${contradictions.length} 组矛盾信号`)

  return signals.length
    ? `基于${signals.join(' + ')}生成`
    : '基于你 15 道题的整体答题路径生成'
}

// ════ 模块 5：给你的三句反向提醒 ════
function buildReverseTips(patterns, contradictions, code) {
  const tips = []

  // 基于检测到的模式生成反向提醒
  const hasAlone = patterns.some(p => p.id === 'alone_essential')
  const hasInternal = patterns.some(p => p.id === 'internal_processor')
  const hasArchivist = patterns.some(p => p.id === 'social_archivist')
  const hasDistancer = patterns.some(p => p.id === 'self_aware_distancer')
  const hasConflict = patterns.some(p => p.id === 'indirect_conflict')
  const hasSocialSplit = contradictions.some(c => c.id === 'social_split')

  if (hasAlone || hasInternal) {
    tips.push('下次觉得"说了也没人懂"的时候，试着找一个人说出来。不用是完美的表达——说出来本身就在减轻那个重量。')
  }

  if (hasArchivist) {
    tips.push('聚会结束之后，大脑继续复盘的时候——试着对自己说一句"够了"。有些信息不值得归档，有些细节不需要分析。')
  }

  if (hasDistancer) {
    tips.push('偶尔让别人看到你没调整过的样子。不需要在所有人面前都保持"没事"的表情。不完美的你也是你。')
  }

  if (hasConflict) {
    tips.push('你处理冲突时需要缓冲——这没问题。但有些话等太久再说，对方已经不在可以听到的状态了。时机和内容一样重要。')
  }

  if (hasSocialSplit) {
    tips.push('别再用"我享受独处"来回避社交了。你回避的不是社交——是低质量的社交。找到那 5% 值得的人，主动一点，不丢人。')
  }

  // 确保至少有 3 条
  if (tips.length < 3) {
    tips.push('你习惯了自己扛。偶尔把"没事"换成"其实不太好"。对你最信任的那个人说一次。')
  }
  if (tips.length < 3) {
    tips.push('你的直觉在大多数时候是对的。但对"恐惧"和"直觉"——它们在你这里穿得很像。学会分辨：直觉让你变大，恐惧让你变小。')
  }
  if (tips.length < 3) {
    tips.push('那些你反复在想的事——写下来。不是发出去。是写给你自己看。你脑子里的循环，落到纸上的那一刻，往往已经解决了一半。')
  }

  return tips.slice(0, 3)
}
