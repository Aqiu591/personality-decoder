/**
 * 个性化引擎 v2
 *
 * v2 改动：放宽检测规则，从「精确选项匹配」升级为「行为倾向匹配」。
 * 同一个行为倾向（如"缓冲型冲突处理"）由多组选项组合触发，
 * 不再要求精确的单一选项对。
 *
 * 四个注入层：
 * 1. 多题答案模式 — 检测用户在不同题目中选了同一种行为策略
 * 2. 矛盾聚光灯 — 指出用户自己可能没意识到的内在矛盾
 * 3. 自定义答案回显 — 把用户自己写的文本展示回结果页
 * 4. 一句话洞察 — 综合所有命中，给一句最核心的判断
 */

// ============================================================
// 辅助函数：兼容单选（旧格式）和多选（新格式）
// ============================================================

/** 检查用户在指定题目是否选了指定选项 */
function has(a, qIdx, optIdx) {
  const answer = a[qIdx]
  if (typeof answer === 'string') return false       // 自定义文本
  if (Array.isArray(answer)) return answer.includes(optIdx)  // 多选
  return answer === optIdx                            // 单选
}

/** 检查用户在指定题目是否选了指定选项集合中的任意一个 */
function hasAny(a, qIdx, optIndices) {
  return optIndices.some(idx => has(a, qIdx, idx))
}

// ============================================================
// 多题答案模式规则
// ============================================================
// 每条规则：{ id, title, check(answers), strong, mild }
// check 返回 'strong' | 'mild' | false

const PATTERN_RULES = [

  // 1. 缓冲型冲突处理
  //    特质：面对冲突需要缓冲带，不直接冲撞
  //    Q3: B(1)截图吐槽 / C(2)打了全删 / D(3)评估再定
  //    Q13: B(1)等对方先发 / C(2)先测水温 / D(3)先想清楚
  {
    id: 'indirect_conflict',
    title: '处理冲突的缓冲策略',
    check(a) {
      const q3Indirect = hasAny(a, 2, [1, 2, 3])
      const q13Indirect = hasAny(a, 12, [1, 2, 3])
      if (!q3Indirect || !q13Indirect) return false
      const strong = hasAny(a, 2, [1, 2]) && hasAny(a, 12, [1, 2])
      return strong ? 'strong' : 'mild'
    },
    strong: '你在第3题和第13题选了同一种策略。面对公开场合的不舒服，你没有当场怼回去——你先退到了安全距离。跟好朋友吵架之后，你也没有直接冲上去——你先试探、先想清楚、先等时机。你在冲突面前需要一个缓冲带，等到安全的时候才出手。这是你保护关系的方式，也是你保护自己的方式。',
    mild: '你面对冲突有一个不自觉的模式：不直接冲，先观察和试探。第3题和第13题，你的选择指向同一条路。你在乎这段关系，比输赢更多。'
  },

  // 2. 社交信息归档
  //    特质：社交中持续观察和分析，事后继续处理
  //    Q2: A(0)放大分析 / D(3)归档分析
  //    Q14: D(3)复盘全场 / B(1)回味某句话
  {
    id: 'social_archivist',
    title: '聚会结束，大脑还在归档',
    check(a) {
      const q2Observes = hasAny(a, 1, [0, 3])
      const q14Processes = hasAny(a, 13, [1, 3])
      if (!q2Observes || !q14Processes) return false
      return has(a, 13, 3) ? 'strong' : 'mild'
    },
    strong: '你的大脑在社交中不会关机。第2题你被排除在聚会外——你没有只是生气。你本能地开始分析谁叫的局、谁是主动谁是被动。第14题聚会结束后，你还在复盘全场：谁和谁之间有点微妙、你有没有说错什么。你在社交中不只接收对话内容——你还在读取关系之间的张力和蛛丝马迹。这套系统让你对人了如指掌，但代价是：你永远比同场的人多累一倍。',
    mild: '你比大多数人更早注意到社交中微妙的痕迹。一场聚会结束，你的大脑还在继续工作——回味那些对话、分析那些关系。这是一种天赋，也是一种别人看不出来的负担。'
  },

  // 3. 独处刚需
  //    特质：独处是必需品，不是逃避
  //    触发1: Q6-A(0) + Q14-A(0) — 社交前后两端都是"终于一个人了"
  //    触发2: Q6-A(0) + Q12-A(0) — 独处跨越中性和低谷
  {
    id: 'alone_essential',
    title: '独处是你的必需品',
    check(a) {
      const aloneLover = has(a, 5, 0)
      const postSocialRelief = has(a, 13, 0)
      const aloneWhenSad = has(a, 11, 0)
      if (!aloneLover) return false
      if (postSocialRelief) return 'strong'
      if (aloneWhenSad) return 'mild'
      return false
    },
    strong: '第6题你说了实话：一个人待一整天，你的答案是"太好了能不能再续一天"。第14题聚会结束关上门的那一刻，你脑子里第一个念头是"终于"。你的接收器天生比别人灵敏，活在一个音量太大的世界里。不用管理表情、不用想话题——这才叫休息。独处是刚需，是你给自己充电的唯一方式。',
    mild: '独处是你的必需品。你处理情绪的方式是不让人看见，恢复能量的方式是关上门。给自己留够不被打扰的时间——你只是知道自己需要什么。'
  },

  // 4. 内化处理
  //    特质：情绪处理方式是内向的，不向外寻求
  //    Q5: A(0)身体重播 / C(2)分析 / D(3)写出来     → 三种内化方式
  //    Q12: A(0)一个人消化 / C(2)身体动起来          → 不找人倾诉
  {
    id: 'internal_processor',
    title: '你处理情绪的方式：一个人慢慢消化',
    check(a) {
      const q5Internal = hasAny(a, 4, [0, 2, 3])
      const q12Internal = hasAny(a, 11, [0, 2])
      if (!q5Internal || !q12Internal) return false
      return (has(a, 4, 0) && has(a, 11, 0)) ? 'strong' : 'mild'
    },
    strong: '第5题和第12题——你处理情绪的入口和出口是同一种方式：一个人。晚上躺床上，大脑开始自动重播"如果当时…"的片段，身体跟着演。真正难过的时候也是一个人待着。灯关了，裹在被子里，不用解释。你觉得说出来之前的那些感受，别人很难真的接到。所以你先消化完了再出现。这套系统大部分时候很好用。但偶尔会卡住：消化不完的时候，你也在装消化完了。',
    mild: '你的情绪处理流程是：先自己消化，消化完了再出现。不管是分析、写出来、还是身体动起来——你都不太找人说。这种方法在大多数时候有效。但偶尔——消化不完的时候——试着让一个人进来。不用是很多人，一个就够了。'
  },

  // 5. 规则质疑者
  //    特质：对规则有自己的判断，不是盲从型
  //    Q10: B(1)得自己判断 / C(2)谁定的凭什么
  //    Q11: B(1)先试一小步 / C(2)直觉冲 / D(3)先问人
  {
    id: 'rule_questioner',
    title: '规则对你来说是参考线',
    check(a) {
      const q10Questions = hasAny(a, 9, [1, 2])
      const q11SelfDirected = hasAny(a, 10, [1, 2, 3])
      if (!q10Questions || !q11SelfDirected) return false
      return (has(a, 9, 2) || has(a, 10, 2)) ? 'strong' : 'mild'
    },
    strong: '第10题和第11题暴露了你的默认习惯。看到"规则"和"应该"这两个词，你先过一遍自己的判断才决定要不要服从。面对不确定的机会，比起纸面利弊，你更信自己的直觉。规则在你这里是参考线。这套直觉在大多数时候是你的优势。但偶尔会让你跳过应该多看一眼的步骤。',
    mild: '规则在你这里会先经过一遍自己的判断。面对不确定的事，你也不全靠理性分析。你不叛逆，你只是有一套自己的判断系统，而且你更信它。'
  },

  // 6. 分析型消化者
  //    特质：用分析和复盘来处理情绪事件
  //    Q5: C(2)分析前因后果 / D(3)写出来分析
  //    Q9: B(1)反复复盘 / C(2)分析性接纳
  {
    id: 'analytical_processor',
    title: '想不通的事情不会翻篇',
    check(a) {
      const q5Analyzes = hasAny(a, 4, [2, 3])
      const q9Ruminates = hasAny(a, 8, [1, 2])
      if (!q5Analyzes || !q9Ruminates) return false
      return (has(a, 4, 2) && has(a, 8, 1)) ? 'strong' : 'mild'
    },
    strong: '你处理情绪事件的方式很特别：你不会让它"过去"——你会把它变成一道分析题。第5题你晚上躺床上不是在单纯难受。你在分析前因后果。第9题一段关系结束了，最让你卡住的是"结束的方式不清不楚"。没归档的东西没法归档——不清不楚的淡出比明确的告别难受一百倍。你想通了才能放下。这是你尊重发生过的事的方式。',
    mild: '你不太擅长"算了"——大脑自动开始分析。一道情绪题在你这里变成了一道逻辑题。想通的那一刻，才是真正的翻篇。'
  },

  // 7. 温和坚定
  //    特质：处理人际问题时冷静直接，不升级也不退缩
  //    Q4: D(3)笑着说但解决 → 礼貌但坚定
  //    Q13: D(3)先想清楚再找 → 思考后行动
  //    或 Q4: D(3) + Q3: D(3)评估后决定
  {
    id: 'measured_assertive',
    title: '你有自己的"温和坚定"模式',
    check(a) {
      const q4Measured = has(a, 3, 3)
      const q13Measured = has(a, 12, 3)
      const q3Measured = has(a, 2, 3)
      if (!q4Measured) return false
      if (q13Measured || q3Measured) return 'strong'
      return false
    },
    strong: '第4题和第13题，你在处理人际摩擦上有同一种风格。饮品不对——你端回去，笑着说"能帮我看看吗"，不吵不闹但要拿到你付钱买的东西。跟好朋友吵架——你先想清楚到底在吵什么，带着结论去，不带情绪去。你靠清晰来解决问题，不靠音量。这种坚定比任何嗓门都更有力量。',
    mild: '你处理人际问题的方式很稳——不吵、不躲、不将就。你不需要靠提高音量来让人重视你。把事情想清楚了再去谈，这本身就是一种力量。'
  },

  // 8. 自知型距离保持者
  //    特质：清楚自己的社交边界，主动管理
  //    Q1: A(0)发完后悔删 / B(1)觉得没说清楚 → 自我监控
  //    Q7: A(0)分析是否真心 / B(1)浑身不自在 → 社交中的自我意识
  {
    id: 'self_aware_distancer',
    title: '你很知道什么时候该收、什么时候该藏',
    check(a) {
      const q1SelfMonitors = hasAny(a, 0, [0, 1])
      const q7SelfAware = hasAny(a, 6, [0, 1])
      if (!q1SelfMonitors || !q7SelfAware) return false
      return (has(a, 0, 0) && has(a, 6, 0)) ? 'strong' : 'mild'
    },
    strong: '第1题你发了动态没多久就删了。第7题别人夸你的时候，你嘴上说谢谢，脑子里在分析这是客气还是真心。你太清楚自己在社交中的位置了。你监控自己呈现出来的样子，调整、收回、再调整。这套系统让你不会说出让自己后悔的话。但它偶尔也会让你错过一些应该被听见的瞬间。你需要的不是在所有人面前都保持"没事"的表情。偶尔让别人看到你没调整过的样子——可能没那么可怕。',
    mild: '你对自己在社交中的表现有一种持续的觉察。说了什么、呈现了什么、该收什么——你有一套自己的监控系统。你对自己的标准很高。偶尔放松一下这个标准，不会出事的。'
  }
]

// ============================================================
// 矛盾检测规则
// ============================================================

const CONTRADICTION_RULES = [

  // 1. 社交分裂：独处刚需 vs 享受有深度的社交
  {
    id: 'social_split',
    title: '你对社交的态度是分裂的',
    check(a) {
      const needsAlone = has(a, 5, 0)
      const enjoyedSocial = hasAny(a, 13, [1, 2])
      return needsAlone && enjoyedSocial
    },
    body: '第6题你说一个人待一整天"太好了能不能再续一天"——你是认真的。但第14题聚会结束之后，你在回味某个人的某句话，你觉得那场局至少有一个值得的对话。95%的社交对你来说太淡了，不值得消耗能量。剩下那5%——那个有深度的对话、那个跟你同频率的人——能给你能量。你要找的是"值得的社交"，不是"更多的社交"。两种感受都是真的，不矛盾。'
  },

  // 2. 计划 vs 冲动：既想要可控感，又在重要决定上信直觉
  {
    id: 'plan_vs_leap',
    title: '你在计划和冲动之间有一条自己的线',
    check(a) {
      const plans = hasAny(a, 7, [0, 3])
      const leaps = hasAny(a, 10, [1, 2])
      return plans && leaps
    },
    body: '第8题朋友约下个月——你倾向于先确定下来。第11题一个不确定的机会来了——你相信自己的直觉和试探，不完全依赖纸面分析。两件事都是你。你把计划留给了常规，把直觉留给了真正重要的事。那些需要你安排的事是生活的骨架。那些靠直觉冲的瞬间是生活的高光。两套系统并行运转，不冲突。'
  },

  // 3. 先 hit 后 think：先被情绪击中，再用分析消化
  {
    id: 'feel_then_think',
    title: '你有一个"先感受、再分析"的两段式处理流程',
    check(a) {
      const feelsFirst = has(a, 0, 0)
      const thinksAfter = hasAny(a, 4, [2, 3]) || has(a, 8, 1)
      return feelsFirst && thinksAfter
    },
    body: '第1题你先做了再说——情绪冲上来就发了，情绪过去了就删了。但同一类事情如果卡在脑子里，你会开始分析：当时为什么会那样、现在还会不会。你的处理流程是两段的：先是真实的情绪反应，不经过滤的。然后是事后分析，不放过一个"为什么"。这是一套完整的消化系统：感受 → 归档 → 翻篇。两段都不能少。'
  },

  // 4. 外刚内柔：公开场合能硬扛，私下允许自己卸掉
  {
    id: 'public_tough_private_soft',
    title: '你在外面扛得住，但你知道怎么卸掉',
    check(a) {
      const publicTough = hasAny(a, 2, [0, 3])
      const privateSoft = hasAny(a, 11, [0, 2]) || has(a, 4, 0)
      return publicTough && privateSoft
    },
    body: '第3题有人公开说了不舒服的话——你能扛住，不卑不亢。但第12题真正难过的时候，你不需要在任何人面前硬撑。你有对外的那一面：该说的话说得出口。你也有对内的那一面：不想让任何人看到你碎掉的样子。两种状态都是真实的。你只是对不同的人展示了不同的面——这种成熟来自对自己的了解。'
  }
]

// ============================================================
// 主函数
// ============================================================

function generatePersonalization(answers, questions) {
  // --- 跨题模式 ---
  const patterns = []
  PATTERN_RULES.forEach(rule => {
    const confidence = rule.check(answers)
    if (confidence) {
      patterns.push({
        id: rule.id,
        title: rule.title,
        body: confidence === 'strong' ? rule.strong : rule.mild,
        confidence
      })
    }
  })

  // --- 矛盾检测 ---
  const contradictions = []
  CONTRADICTION_RULES.forEach(rule => {
    if (rule.check(answers)) {
      contradictions.push({
        id: rule.id,
        title: rule.title,
        body: rule.body
      })
    }
  })

  // --- 自定义答案回显 ---
  const customAnswers = []
  answers.forEach((a, idx) => {
    if (typeof a === 'string' && a.trim().length > 0) {
      customAnswers.push({
        questionIndex: idx + 1,
        questionText: questions[idx] ? questions[idx].text : '',
        userText: a.trim()
      })
    }
  })

  // --- 一句话洞察 ---
  const highlight = generateHighlight(patterns, contradictions, customAnswers)

  return { patterns, contradictions, customAnswers, highlight }
}

function generateHighlight(patterns, contradictions, customAnswers) {
  if (contradictions.length >= 2) {
    return '你的身上同时住了几个不太一样的人。而且他们都是真的你。上面那些分析如果只说中了其中一面，另一面可能需要你自己说出来。'
  }

  if (contradictions.length === 1) {
    const c = contradictions[0]
    if (c.id === 'social_split') {
      return '你对社交的品质要求很高。那些让你不想参加的局，问题不在你——是那个局的对话质量配不上你的注意力。'
    }
    if (c.id === 'plan_vs_leap') {
      return '你有两套运转良好的决策系统：一套管日常，一套管大事。你不需要在它们之间选一个——继续让它们各司其职就好。'
    }
    if (c.id === 'feel_then_think') {
      return '你比你以为的更会处理情绪。你先感受，然后分析——这套流程是完整的情绪处理。很多人只有前一段或只有后一段，你两段都有。'
    }
    if (c.id === 'public_tough_private_soft') {
      return '你懂得在不同的场合展示不同的面——这种社交智慧来自对自己的了解。成熟意味着知道什么时候该用哪一种状态。'
    }
  }

  if (customAnswers.length >= 2) {
    return '有几道题你没有选任何选项——你写了属于自己的答案。这些答案比任何预设选项都重要。它们是你没有被任何题目框住的部分。'
  }

  if (patterns.length >= 3) {
    return '上面这几段分析对应了你在不同题目里选过的同一个方向——这些不自觉的重复，比任何自我描述都诚实。不用全信，但值得认真想一想。'
  }

  if (patterns.length === 2) {
    return '你在答题中展现了一些你自己可能没注意到的固定习惯。两道完全不同的题，你选了同一种策略。这些重复出现的痕迹，是你真正的默认设置。'
  }

  if (patterns.length === 1) {
    return '上面有一段分析来自你两道题选了同一种策略——这种不自觉的重复，比任何自我描述都诚实。'
  }

  return '15道题能画出一张清楚的轮廓，但画不完整个人。上面的分析如果有说中的——想一想为什么。有没说中的——那个"没说中"的部分，可能恰恰是你最知道自己要什么的地方。'
}

module.exports = { generatePersonalization, PATTERN_RULES, CONTRADICTION_RULES }
