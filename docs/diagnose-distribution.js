/**
 * 分布诊断 v2：单次扫描，统计类型 + 轴 + 维度分布
 * 用法：node docs/diagnose-distribution.js
 */
const { calculateResult } = require('../utils/results')
const { MINI_QUESTIONS } = require('../utils/questions')

const N = 1000
const DIMS = ['sensitive','rational','assertive','diplomatic','structured','spontaneous','expressive','reserved','social_drain','adventure']

function randomAnswer(nOptions) {
  const r = Math.random()
  if (r < 0.1 && nOptions >= 3) {
    const indices = []
    while (indices.length < 3) {
      const idx = Math.floor(Math.random() * nOptions)
      if (!indices.includes(idx)) indices.push(idx)
    }
    return indices.sort((a, b) => a - b)
  } else if (r < 0.3) {
    const a = Math.floor(Math.random() * nOptions)
    let b = Math.floor(Math.random() * nOptions)
    while (b === a) b = Math.floor(Math.random() * nOptions)
    return [a, b].sort((x, y) => x - y)
  } else {
    return [Math.floor(Math.random() * nOptions)]
  }
}

// 单次扫描
const typeCounts = {}
const typeIntensity = {}
const axisData = { energy: [], judgment: [], rhythm: [] }
const dimData = {}
DIMS.forEach(d => { dimData[d] = [] })

for (let i = 0; i < N; i++) {
  const answers = MINI_QUESTIONS.map(q => randomAnswer(q.options.length))
  const result = calculateResult(answers)

  const type = result.typeName
  typeCounts[type] = (typeCounts[type] || 0) + 1
  if (!typeIntensity[type]) typeIntensity[type] = {}
  typeIntensity[type][result.intensity] = (typeIntensity[type][result.intensity] || 0) + 1

  if (result._scores) {
    axisData.energy.push(result._scores.energyScore)
    axisData.judgment.push(result._scores.judgmentScore)
    axisData.rhythm.push(result._scores.rhythmScore)
    DIMS.forEach(d => {
      dimData[d].push(result._scores.norm ? (result._scores.norm[d] || 0) : 0)
    })
  }
}

// ════ 输出 ════
console.log(`\n=== ${N} 次随机答题 · 8型分布 ===\n`)
Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
  const pct = (count / N * 100).toFixed(1)
  const bar = '█'.repeat(Math.round(count / N * 40))
  const ints = typeIntensity[type]
  const intStr = Object.entries(ints).sort((a,b) => b[1]-a[1]).map(([k,v]) => `${k}:${(v/count*100).toFixed(0)}%`).join(' ')
  console.log(`${pct.padStart(5)}% ${bar} ${type} (${intStr})`)
})

console.log(`\n=== 三轴得分 ===`)
;['energy', 'judgment', 'rhythm'].forEach(axis => {
  const s = axisData[axis].sort((a, b) => a - b)
  const avg = s.reduce((a, v) => a + v, 0) / s.length
  const pos = (s.filter(v => v > 20).length / N * 100).toFixed(1)
  const neg = (s.filter(v => v < -20).length / N * 100).toFixed(1)
  const neu = (s.filter(v => v >= -20 && v <= 20).length / N * 100).toFixed(1)
  console.log(`  ${axis.padEnd(10)} avg:${avg.toFixed(1).padStart(7)}  p5:${s[Math.floor(N*0.05)].toFixed(1).padStart(7)}  p50:${s[Math.floor(N*0.5)].toFixed(1).padStart(7)}  p95:${s[Math.floor(N*0.95)].toFixed(1).padStart(7)}  +:${pos}%  -:${neg}%  ~:${neu}%`)
})

console.log(`\n=== 10维度归一化得分 ===`)
DIMS.forEach(d => {
  const s = dimData[d].sort((a, b) => a - b)
  const avg = s.reduce((a, v) => a + v, 0) / s.length
  const pos = (s.filter(v => v > 5).length / N * 100).toFixed(1)
  const neg = (s.filter(v => v < -5).length / N * 100).toFixed(1)
  console.log(`  ${d.padEnd(14)} avg:${avg.toFixed(1).padStart(7)}  p50:${s[Math.floor(N*0.5)].toFixed(1).padStart(7)}  >5:${pos}%  <-5:${neg}%`)
})
