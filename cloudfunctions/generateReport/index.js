/**
 * 云函数：生成性格报告
 * 完整版启用，Mini 版使用静态结果
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { answers } = event

  if (!answers || answers.length !== 30) {
    return { code: -1, msg: '参数错误：需要完整的 30 道题答案' }
  }

  try {
    // 调用混元大模型（需先开通云开发 AI 能力）
    const result = await cloud.openapi.ai.generateText({
      model: 'hunyuan-lite',
      prompt: buildPrompt(answers),
      config: {
        temperature: 0.8,
        max_tokens: 3000
      }
    })

    return {
      code: 0,
      data: result
    }
  } catch (err) {
    return {
      code: -1,
      msg: '生成失败',
      error: err.message
    }
  }
}

function buildPrompt(answers) {
  // 将 30 题答案转化为自然语言摘要
  const summary = analyzeAnswers(answers)

  const systemPrompt = `
你是一位经验丰富的性格分析专家。基于用户的答题数据，生成一份千人千面的性格报告。

规则：
1. 全文用"系统分析""数据匹配"替代"AI"/"人工智能"
2. 避免巴纳姆效应式的泛泛描述
3. 指出用户身上同时存在的矛盾倾向
4. 70% 写用户模糊感觉到但说不清楚的东西
5. 每个维度约 200 字

输入数据：${summary}

输出 JSON 格式：
{
  "typeName": "性格类型名称（4-6字，有记忆点）",
  "tagline": "一句话标签",
  "oneLiner": "直击人心的一句话描述",
  "dimensions": [
    { "name": "维度名", "score": 85, "analysis": "200字分析" }
    // ...7个维度
  ],
  "careers": ["适合的3个职业方向"],
  "relationships": "人际关系分析（100字）",
  "celebrities": ["相似的2-3个名人"],
  "advice": "个人发展建议（100字）",
  "shareText": "分享文案（含'测测匹配度'）"
}`

  return systemPrompt
}

function analyzeAnswers(answers) {
  // 将 30 题答案按维度聚合为文字摘要
  // 完整版需要解析每个维度的得分和选项组合
  // Mini 版可跳过
  return JSON.stringify(answers)
}
