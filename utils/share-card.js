/**
 * Canvas 分享卡片生成器
 *
 * 设计：天蓝白 + 一句话让我想截图 + 类型标签 + 「测测匹配度」互动按钮
 */

/**
 * 在 Canvas 上绘制分享卡片
 * @param {Object} result - 结果数据
 * @param {string} canvasId - Canvas ID
 * @param {Object} [ctx] - Page/Component 实例（用于 Canvas 2D API）
 * @returns {Promise<string>} 临时图片路径
 */
function drawShareCard(result, canvasId, pageCtx) {
  return new Promise((resolve, reject) => {
    // 超时保护：8 秒后强制拒绝，防止 canvas 回调丢失导致 Promise 永久挂起
    const timeout = setTimeout(() => {
      reject(new Error('canvas timeout'))
    }, 8000)

    const done = (val) => { clearTimeout(timeout); resolve(val) }
    const fail = (err) => { clearTimeout(timeout); reject(err) }

    // 使用旧 Canvas API（兼容性最好）
    const ctx = wx.createCanvasContext(canvasId, pageCtx || undefined)

    const W = 500
    const H = 400
    const P = 32

    // 背景
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
    bgGrad.addColorStop(0, '#F0F9FF')
    bgGrad.addColorStop(0.5, '#E8F4FD')
    bgGrad.addColorStop(1, '#F5FAFD')
    ctx.setFillStyle(bgGrad)
    ctx.fillRect(0, 0, W, H)

    // 装饰圆
    ctx.setFillStyle('rgba(2, 132, 199, 0.06)')
    ctx.beginPath(); ctx.arc(W - 40, 40, 80, 0, 2 * Math.PI); ctx.fill()
    ctx.beginPath(); ctx.arc(40, H - 40, 60, 0, 2 * Math.PI); ctx.fill()

    // App 名称
    ctx.setFillStyle('#94A3B8')
    ctx.setFontSize(12)
    ctx.setTextAlign('left')
    ctx.fillText('原来我是这种人啊', P, P + 16)

    // 核心引用
    const quote = pickQuoteForCard(result)
    ctx.setFillStyle('#0F172A')
    ctx.setFontSize(18)
    ctx.setTextAlign('left')
    const maxWidth = W - P * 2
    const lines = wrapText(ctx, `"${quote}"`, maxWidth, 4)
    let y = P + 60
    lines.forEach(line => {
      ctx.fillText(line, P, y)
      y += 28
    })

    // 类型标签
    y += 12
    const tagW = ctx.measureText(String(result.typeName || '')).width + 32
    const tagH = 30
    const tagX = P
    const tagY = y
    ctx.setFillStyle('rgba(2, 132, 199, 0.1)')
    roundRect(ctx, tagX, tagY, Math.max(tagW, 60), tagH, 15)
    ctx.fill()
    ctx.setFillStyle('#0284C7')
    ctx.setFontSize(13)
    ctx.setTextAlign('left')
    ctx.fillText(String(result.typeName || ''), tagX + 16, tagY + 20)

    // 三字码标签
    const codeText = String(result.code || '')
    const codeW = ctx.measureText(codeText).width + 24
    const codeX = tagX + Math.max(tagW, 60) + 10
    ctx.setFillStyle('rgba(245, 158, 11, 0.12)')
    roundRect(ctx, codeX, tagY, Math.max(codeW, 40), tagH, 15)
    ctx.fill()
    ctx.setFillStyle('#F59E0B')
    ctx.fillText(codeText, codeX + 12, tagY + 20)

    // CTA 按钮
    y = tagY + tagH + 28
    const ctaText = '看看你是哪一种 →'
    const ctaW = ctx.measureText(ctaText).width + 48
    const ctaH = 40
    const ctaX = (W - ctaW) / 2
    const ctaGrad = ctx.createLinearGradient(ctaX, 0, ctaX + ctaW, 0)
    ctaGrad.addColorStop(0, '#0284C7')
    ctaGrad.addColorStop(1, '#0EA5E9')
    ctx.setFillStyle(ctaGrad)
    roundRect(ctx, ctaX, y, ctaW, ctaH, 20)
    ctx.fill()
    ctx.setFillStyle('#FFFFFF')
    ctx.setFontSize(14)
    ctx.setTextAlign('center')
    ctx.fillText(ctaText, W / 2, y + 27)

    // 底部
    y = y + ctaH + 28
    ctx.setFillStyle('rgba(2, 132, 199, 0.06)')
    roundRect(ctx, P, y, 56, 56, 12)
    ctx.fill()
    ctx.setFillStyle('#94A3B8')
    ctx.setFontSize(9)
    ctx.setTextAlign('center')
    ctx.fillText('扫码', P + 28, y + 26)
    ctx.fillText('测测', P + 28, y + 42)

    ctx.setFillStyle('#CBD5E1')
    ctx.setFontSize(10)
    ctx.setTextAlign('right')
    const bottomY = y + 36
    ctx.fillText('微信搜「原来我是这种人啊」', W - P, bottomY - 8)
    ctx.fillText('15 道题 · 看见你自己没说出口的那一面', W - P, bottomY + 10)

    // 渲染并导出（延长等待确保画布完成像素渲染）
    ctx.draw(false, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: canvasId,
          x: 0,
          y: 0,
          width: W,
          height: H,
          destWidth: W * 2,
          destHeight: H * 2,
          quality: 1,
          success: (res) => done(res.tempFilePath),
          fail: (err) => fail(err)
        }, pageCtx || undefined)
      }, 500)
    })
  })
}

function pickQuoteForCard(result) {
  if (!result) return '测测你的性格画像'
  if (result.oneLiner && result.oneLiner.length > 10) return result.oneLiner
  const dim = result.dimensions && result.dimensions[0]
  if (dim && dim.analysis) {
    const sentences = dim.analysis.split(/[。！]/).filter(s => s.trim().length > 8)
    if (sentences[0]) return sentences[0].trim()
  }
  return result.typeName || '测测你的性格画像'
}

function wrapText(ctx, text, maxWidth, maxLines) {
  const lines = []
  let current = ''
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const test = current + char
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current)
      if (lines.length >= maxLines) return lines
      current = char
    } else {
      current = test
    }
  }
  if (current && lines.length < maxLines) lines.push(current)
  // 最后一行如果太长，截断加省略号
  const last = lines[lines.length - 1]
  if (last && ctx.measureText(last + '…').width > maxWidth && last.length > 2) {
    lines[lines.length - 1] = last.slice(0, -2) + '…'
  }
  return lines
}

function roundRect(ctx, x, y, w, h, r) {
  // 确保圆角不超过宽高的一半
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.arc(x + w - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2)
  ctx.lineTo(x + w, y + h - radius)
  ctx.arc(x + w - radius, y + h - radius, radius, 0, Math.PI * 0.5)
  ctx.lineTo(x + radius, y + h)
  ctx.arc(x + radius, y + h - radius, radius, Math.PI * 0.5, Math.PI)
  ctx.lineTo(x, y + radius)
  ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5)
  ctx.closePath()
}

module.exports = { drawShareCard, pickQuoteForCard }
