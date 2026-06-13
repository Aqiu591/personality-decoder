/**
 * v3 多选测试：新旧格式兼容 + 多选算法
 */
const { calculateResult } = require('../utils/results.js');

function summarize(p) {
  return {
    patterns: p.patterns.length,
    contradictions: p.contradictions.length,
    highlight: p.highlight ? p.highlight.slice(0, 40) + '...' : 'N/A'
  }
}

// ============================================================
// Test 1: 旧格式（单选）— 向后兼容
// ============================================================
console.log('=== Test 1: 旧格式（单选）向后兼容 ===');
const oldFormat = [0, 1, 1, 2, 0, 0, 1, 0, 1, 2, 2, 0, 2, 0, 1];
const r1 = calculateResult(oldFormat);
console.log('Type:', r1.typeName, '|', summarize(r1.personalization));

// ============================================================
// Test 2: 新格式（多选）— 用户选了多个选项
// ============================================================
console.log('\n=== Test 2: 新格式（多选）===');
const multiAnswers = [
  [0, 1],   // Q1: 发了后悔 + 觉得没说清楚 → 都像
  [3],      // Q2: 记下了分析
  [1],      // Q3: 截图吐槽
  [3],      // Q4: 笑着说但解决
  [2],      // Q5: 分析前因后果
  [0, 3],   // Q6: 太好了 + 取决于做什么（矛盾的自我认知）
  [0, 1],   // Q7: 分析真心 + 浑身不自在
  [0],      // Q8: 打开日历
  [1],      // Q9: 反复复盘
  [1],      // Q10: 自己判断
  [1],      // Q11: 先试一小步
  [0],      // Q12: 一个人消化
  [3],      // Q13: 先想清楚
  [1],      // Q14: 回味某句话
  [0]       // Q15: 靠谱
];
const r2 = calculateResult(multiAnswers);
console.log('Type:', r2.typeName, '|', summarize(r2.personalization));

// ============================================================
// Test 3: 混合格式（多选 + 自定义文本）
// ============================================================
console.log('\n=== Test 3: 多选 + 自定义文本 ===');
const mixedAnswers = [
  [0], [3], [1, 2], '我自己写的答案', [2], [0], [0], [0],
  [1], [1, 3], [1], [0], [3], [1], [0]
];
const r3 = calculateResult(mixedAnswers);
console.log('Type:', r3.typeName, '|', summarize(r3.personalization));
console.log('Custom answers:', r3.personalization.customAnswers.length);
r3.personalization.customAnswers.forEach(c =>
  console.log('  Q' + c.questionIndex + ': ' + c.userText.slice(0, 30))
);

// ============================================================
// Test 4: 极端多选（每道题都选 2-3 个选项）
// ============================================================
console.log('\n=== Test 4: 全多选（每题 2-3 个选项）===');
const allMulti = [
  [0, 1], [0, 3], [1, 2], [2, 3], [0, 2],
  [0, 3], [0, 1], [0, 2], [1, 2], [1, 2],
  [1, 2], [0, 2], [2, 3], [1, 3], [0, 2]
];
const r4 = calculateResult(allMulti);
console.log('Type:', r4.typeName, '|', summarize(r4.personalization));

// ============================================================
// Test 5: 同一用户，单选 vs 多选结果对比
// ============================================================
console.log('\n=== Test 5: 单选 vs 多选对比（同一心理学模式）===');
const singlePick = [0, 3, 1, 3, 2, 0, 0, 0, 1, 1, 1, 0, 3, 1, 0];
const multiPick =  [[0], [3], [1, 2], [3], [2], [0], [0, 1], [0], [1], [1], [1], [0], [3], [1], [0]];

const rs = calculateResult(singlePick);
const rm = calculateResult(multiPick);
console.log('单选:', rs.typeName, '| patterns:', rs.personalization.patterns.length);
console.log('多选:', rm.typeName, '| patterns:', rm.personalization.patterns.length);
console.log('多选新增模式:', rm.personalization.patterns.filter(p =>
  !rs.personalization.patterns.find(sp => sp.id === p.id)
).map(p => p.id));

// ============================================================
// Test 6: 全自定义答案 — 不应被中心校准误判为中高强度类型
// ============================================================
console.log('\n=== Test 6: 全自定义答案（低量化信号）===');
const allCustom = Array(15).fill(0).map((_, i) => '这是我的自定义答案 ' + (i + 1));
const rc = calculateResult(allCustom);
console.log('Type:', rc.typeName, '| intensity:', rc.intensity, '| scores:', rc._scores);
if (rc.intensity !== 'mild') {
  throw new Error('全自定义答案缺少量化信号时，应为 mild 强度');
}
if (rc.code !== '自由作答') {
  throw new Error('全自定义答案应进入自由作答兜底结果，而不是普通人格类型');
}

console.log('\n✅ 全部测试通过');
