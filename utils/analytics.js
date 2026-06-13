/**
 * 最小数据记录层
 *
 * 记录：答题完成 → 结果类型 → 分享点击 → 重测
 * 仅保存在本地设备（wx.setStorageSync），不上传到服务器。
 */

const STORAGE_KEY = '_analytics_log'
const MAX_LOCAL_LOGS = 500

/**
 * 记录事件
 * @param {string} event - 事件名：test_complete / result_view / share_click / retest / report_view
 * @param {Object} data - 附加数据
 */
function track(event, data = {}) {
  const entry = {
    event,
    data,
    time: Date.now(),
    // 脱敏：不记录 openId 等个人信息
    _v: 1
  }

  // 本地存储
  try {
    const logs = getLogs()
    logs.push(entry)
    // 保留最近 N 条
    if (logs.length > MAX_LOCAL_LOGS) {
      logs.splice(0, logs.length - MAX_LOCAL_LOGS)
    }
    wx.setStorageSync(STORAGE_KEY, logs)
  } catch (e) {
    console.warn('analytics: 本地记录失败', e)
  }
}

/**
 * 读取本地日志
 */
function getLogs() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || []
  } catch (e) {
    return []
  }
}

/**
 * 获取统计摘要（供调试）
 */
function summary() {
  const logs = getLogs()
  const counts = {}
  logs.forEach(l => {
    counts[l.event] = (counts[l.event] || 0) + 1
  })
  return {
    total: logs.length,
    events: counts,
    oldest: logs[0] ? new Date(logs[0].time).toISOString() : null,
    newest: logs[logs.length - 1] ? new Date(logs[logs.length - 1].time).toISOString() : null
  }
}

module.exports = { track, summary, getLogs }
