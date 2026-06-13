/**
 * 15 道题 × 4 个选项 = 60 个行为锚点
 *
 * v3 — 基于 IPIP 开源量表优化（2026-06-10）
 *
 * 设计原则（来源：IPIP-NEO-PI / Big Five Factor Markers / 行为锚定法）：
 * 1. 每题只触及 2 个心理维度 → 选项是这两个维度构成的 2×2 空间里的 4 个点
 * 2. 每个选项是具体的、可观察的行为模式，不是抽象的性格宣言
 * 3. 4 个选项覆盖「这个题能有的所有真实反应」，不再需要"都不像"
 * 4. 维度出现频率重新平衡：每维度只出现在其真正相关的 3-5 题中
 * 5. 选项读起来像朋友在描述自己，不像问卷
 *
 * 10 维度 × 出现题数：
 *   sensitive(4) rational(3) assertive(4) diplomatic(3) structured(3)
 *   spontaneous(3) expressive(3) reserved(3) social_drain(2) adventure(3)
 */

const MINI_QUESTIONS = [

  // ========== 1: sensitive × reserved ==========
  { id: 1,
    text: '你发了一条动态，没多久又删了。删的时候你在想什么？',
    dimensions: ['sensitive', 'reserved'],
    options: [
      { label: 'A', text: '发的时候是真的，删的时候也是真的。情绪冲上来的时候觉得必须说，情绪过去了就覺得没必要留在那儿了', score: { sensitive: 80, reserved: 50 } },
      { label: 'B', text: '我刚才到底想表达什么？再看一遍觉得没说清楚。删了，等想清楚了再发', score: { reserved: 65, sensitive: 55 } },
      { label: 'C', text: '发都发了删什么。别人爱怎么理解怎么理解，我又不是发给所有人看的', score: { sensitive: 15, reserved: 10 } },
      { label: 'D', text: '分组设错了，本来只想给几个人看的。下次发之前检查一遍接收人', score: { reserved: 50, sensitive: 35 } }
    ]
  },

  // ========== 2: sensitive × assertive ==========
  { id: 2,
    text: '你刷到朋友们聚会的照片，没人跟你说过有这个局。',
    dimensions: ['sensitive', 'assertive'],
    options: [
      { label: 'A', text: '放大看每张照片——都有谁、谁叫的局、在哪儿。然后退出，假装没刷到过。心里不舒服但不表现出来', score: { sensitive: 85, assertive: 5 } },
      { label: 'B', text: '直接私最熟的那个："你们在哪儿呢？"可能是忘了叫我。不问的话我自己在这演内心戏', score: { assertive: 75, sensitive: 45 } },
      { label: 'C', text: '心里刺了一下但就算了。人家临时组局不需要跟我报备。我做我的事', score: { sensitive: 40, assertive: 30 } },
      { label: 'D', text: '记下了。下次他们约我我也不一定去。不是因为生气——是因为我知道了谁是主动约、谁是被动拉', score: { sensitive: 70, assertive: 40 } }
    ]
  },

  // ========== 3: assertive × diplomatic ==========
  { id: 3,
    text: '一个不太熟的人公开说了句让你很不舒服的话。',
    dimensions: ['assertive', 'diplomatic'],
    options: [
      { label: 'A', text: '当场回一句，礼貌但明确。不舒服就是不舒服，憋着比说出来难受一百倍', score: { assertive: 85, diplomatic: 10 } },
      { label: 'B', text: '截图发给最信任的人疯狂吐槽。当面撕太耗了，但我需要被人听见——在安全的地方说出来才能翻篇', score: { diplomatic: 65, assertive: 20 } },
      { label: 'C', text: '打了三段回复全删了。脑子里吵完了，没必要真的发。但这个人我会在心里标注一下', score: { diplomatic: 40, assertive: 30 } },
      { label: 'D', text: '评估：这人以后还会打交道吗？会的话私下聊清楚。不会的话——花一秒钟决定忽略他。不浪费情绪', score: { diplomatic: 55, assertive: 55 } }
    ]
  },

  // ========== 4: assertive × diplomatic ==========
  { id: 4,
    text: '买了一杯喝的，喝了一口发现味道完全不对。',
    dimensions: ['assertive', 'diplomatic'],
    options: [
      { label: 'A', text: '算了。十几块钱的东西让人重做，尴尬的几十秒比这杯饮料贵。下次不点这个就行', score: { diplomatic: 80, assertive: 5 } },
      { label: 'B', text: '端回去："麻烦帮我重做一杯，味道不太对。"我点的就是这个，不是什么别的。不吵不闹，但要拿到我付钱买的东西', score: { assertive: 80, diplomatic: 35 } },
      { label: 'C', text: '不喝也不退。放下走了。不吵不闹不将就。那家店以后少去', score: { diplomatic: 45, assertive: 30 } },
      { label: 'D', text: '喝了一半确认：真的不对。端回去说："不好意思，这个味道不太对，能帮我看看吗？"笑着说的——不让人难做，但问题得解决', score: { diplomatic: 65, assertive: 55 } }
    ]
  },

  // ========== 5: sensitive × rational ==========
  { id: 5,
    text: '晚上躺床上，脑子里开始自动回放一些"如果当时..."的片段。',
    dimensions: ['sensitive', 'rational'],
    options: [
      { label: 'A', text: '不只回放，身体跟着演——肩膀缩起来、脚趾抠床单。告诉大脑别想了，大脑说好的然后继续。能重播到凌晨两点', score: { sensitive: 90, rational: 5 } },
      { label: 'B', text: '想了就想了。那个人、那句话、那个瞬间——已经过去了。情绪来过，现在走了。翻个身，睡了', score: { rational: 60, sensitive: 35 } },
      { label: 'C', text: '开始分析：当时为什么会那样？现在还会不会？想清楚前因后果，这件事才算真的翻篇。想不通的地方明天继续想', score: { rational: 80, sensitive: 55 } },
      { label: 'D', text: '爬起来记在手机备忘录里。把脑子里转的东西倒出来——写完了，就能睡了。第二天看那些字，有时候觉得昨晚的自己有点好笑', score: { sensitive: 65, rational: 60 } }
    ]
  },

  // ========== 6: social_drain × reserved ==========
  { id: 6,
    text: '一个人待了一整天，没有任何社交。你的状态？',
    dimensions: ['social_drain', 'reserved'],
    options: [
      { label: 'A', text: '太好了。能不能再续一天。不用管理表情、不用想话题、不用在"好的"和"好的！"之间纠结措辞——这才叫休息', score: { social_drain: 85, reserved: 65 } },
      { label: 'B', text: '还行。上午很享受，到下午有点想找人发条消息。一个人待一天可以，第二天得出去了', score: { social_drain: 45, reserved: 40 } },
      { label: 'C', text: '上午还行，下午就坐不住了。开始找人聊天、刷社交、约明天的饭。独处久了会觉得世界在发生什么而我错过了', score: { social_drain: 15, reserved: 20 } },
      { label: 'D', text: '看那天做了什么。如果沉浸式做了一件事——看书、打游戏、写东西——那很满足，时间过得不知不觉。如果只是无聊地刷手机，会想找人', score: { reserved: 55, social_drain: 40 } }
    ]
  },

  // ========== 7: sensitive × expressive ==========
  { id: 7,
    text: '有人当着其他人的面认真地夸你。你的第一反应是？',
    dimensions: ['sensitive', 'expressive'],
    options: [
      { label: 'A', text: '嘴上说谢谢，脑子里在分析：他们是客气还是真心的？这句话有几分是社交礼仪、几分是真的？', score: { sensitive: 75, expressive: 20 } },
      { label: 'B', text: '开心但浑身不自在。下意识想找地缝、或者赶紧把话题转到夸别人身上。被注视的感觉太烫了', score: { sensitive: 70, expressive: 25 } },
      { label: 'C', text: '大方接住："谢谢你看到了！"被认可的感觉就是很好——为什么要假装不好意思。我能接住夸奖，也能接住批评', score: { expressive: 80, sensitive: 20 } },
      { label: 'D', text: '谢谢，然后说"其实主要是团队/运气/刚好碰上了"。不是谦虚的套话，是真的觉得不全是我一个人的功劳', score: { sensitive: 50, expressive: 45 } }
    ]
  },

  // ========== 8: structured × spontaneous ==========
  { id: 8,
    text: '朋友约你"下个月什么时候有空"，你通常？',
    dimensions: ['structured', 'spontaneous'],
    options: [
      { label: 'A', text: '打开日历。看具体哪几天空着。知道接下来要发生什么让我踏实——空白格子是安全感，不是空虚', score: { structured: 85, spontaneous: 5 } },
      { label: 'B', text: '"到时候再说呗。"现在定下个月的事，万一到时候不想去呢。最好的计划就是没有计划', score: { spontaneous: 85, structured: 5 } },
      { label: 'C', text: '先答应大概的时间段，到时候再定具体哪天。不拒绝也不锁死——留一点弹性，对所有人都好', score: { spontaneous: 45, structured: 45 } },
      { label: 'D', text: '"你先定，我尽量配合。"不是没主见——是我的时间比他们灵活，让他们先选。但定了之后我会准时到', score: { structured: 50, spontaneous: 40 } }
    ]
  },

  // ========== 9: adventure × rational ==========
  { id: 9,
    text: '一段你在意的关系结束了。最让你卡住的是？',
    dimensions: ['adventure', 'rational'],
    options: [
      { label: 'A', text: '这个人本身的不可替代性。那些只有你们懂的梗、那个频率的对话——以后再也没有第二个人能接住了。这个洞填不上', score: { adventure: 10, rational: 20 } },
      { label: 'B', text: '结束的方式让我反复复盘。如果是吵了一架，至少是个句号。不清不楚的淡出比明确的告别难受一百倍——因为没法归档', score: { rational: 55, adventure: 25 } },
      { label: 'C', text: '其实还好。有些人就是陪你走一段的。来了没问，走了也不该留。每段关系都是一次版本更新——有些功能被移除了，但你学会了新的', score: { rational: 60, adventure: 55 } },
      { label: 'D', text: '结束之后反而松了一口气。不是不在乎——是在一起的时候已经尽力了。剩下的交给时间。下一段关系我会带着这段的经验进去', score: { adventure: 70, rational: 55 } }
    ]
  },

  // ========== 10: structured × adventure ==========
  { id: 10,
    text: '看到"规则"和"应该"这两个词，你的本能是？',
    dimensions: ['structured', 'adventure'],
    options: [
      { label: 'A', text: '规则让人安全。别人踩过的坑画出来的线。知道边界在哪，你反而能在边界里面自由地发挥', score: { structured: 85, adventure: 10 } },
      { label: 'B', text: '规则我遵守，但"应该"我得自己判断过才能接受。不是所有理所当然的事对我都理所当然', score: { structured: 40, adventure: 40 } },
      { label: 'C', text: '本能想问"谁定的"和"凭什么"。规则是给需要规则的人准备的。我看到规则的第一反应是找它的漏洞', score: { adventure: 80, structured: 5 } },
      { label: 'D', text: '每个规则都有它的上下文。一条交通规则在凌晨三点的空路口——你停不停？我停。不是因为怕罚，是因为规则内化了就成了习惯', score: { structured: 65, adventure: 30 } }
    ]
  },

  // ========== 11: rational × adventure ==========
  { id: 11,
    text: '一个好但不太确定的机会来了。你怎么决定？',
    dimensions: ['rational', 'adventure'],
    options: [
      { label: 'A', text: '列利弊。最坏的情况能不能承受？能就做。不能就算了。一张纸画完，决定就做好了。不纠结', score: { rational: 85, adventure: 20 } },
      { label: 'B', text: '先试一小步。不用全押——拿一点时间和资源探一下，反馈好了再加。用小成本验证大判断', score: { rational: 60, adventure: 50 } },
      { label: 'C', text: '直觉说冲就冲了。想太多会错过——有些机会只在那一瞬间。先跳进去，不会的边游边学', score: { adventure: 85, rational: 10 } },
      { label: 'D', text: '问两个信得过的人。不是让他们替我做决定——是跟他们聊完之后，我自己会知道答案。有时候话还没说完，答案已经冒出来了', score: { adventure: 40, rational: 40 } }
    ]
  },

  // ========== 12: reserved × expressive ==========
  { id: 12,
    text: '上一次你真正难过的时候，你做了什么？',
    dimensions: ['reserved', 'expressive'],
    options: [
      { label: 'A', text: '一个人待着。灯关了，裹在被子里。不用说话、不用解释——需要自己慢慢消化。消化完了就好了，没消化完明天继续', score: { reserved: 80, expressive: 10 } },
      { label: 'B', text: '打给了那个人。你知道是谁——那个不用铺垫可以直接说"我今天不行"的人。把话说出来之后好多了。有时候话还没说完，答案已经冒出来了', score: { expressive: 70, reserved: 15 } },
      { label: 'C', text: '没有停下来的选项。整理房间、跑了很远的步、一口气清掉了积了好久的待办。身体动起来比坐着想有用——累到脑子里没空间想别的', score: { reserved: 45, expressive: 35 } },
      { label: 'D', text: '叫一个不需要安慰我的人出来——吃顿饭、看场电影、纯粹待着。不用聊那件事。只是不想一个人，但也不想解释', score: { expressive: 55, reserved: 40 } }
    ]
  },

  // ========== 13: assertive × diplomatic ==========
  { id: 13,
    text: '跟好朋友吵架了。接下来最像你的剧本是？',
    dimensions: ['assertive', 'diplomatic'],
    options: [
      { label: 'A', text: '我主动开口。冷战对我的消耗比吵架本身大得多。我可以吵——吵完我可以道歉——但我不能悬着。主动不是因为输了，是因为关系比面子重要', score: { assertive: 75, diplomatic: 35 } },
      { label: 'B', text: '想开口但不知道怎么起头。万一对方还在生气呢。拖了几天，最后是对方先发了消息。收到消息的那一刻——松了一大口气', score: { diplomatic: 50, assertive: 15 } },
      { label: 'C', text: '发一条跟吵架完全无关的消息——一个好笑视频、一个随便的问题。水温测到了再决定要不要聊。直接谈太硬了，先看看对方还在不在生气', score: { diplomatic: 70, assertive: 30 } },
      { label: 'D', text: '先想清楚：这次吵架到底在吵什么。想明白了再去找对方——不想在情绪里对话。带着结论去，不是带着情绪去', score: { assertive: 50, diplomatic: 50 } }
    ]
  },

  // ========== 14: social_drain × expressive ==========
  { id: 14,
    text: '参加完一个局回到家。关上门的那一刻，你脑子里第一个念头？',
    dimensions: ['social_drain', 'expressive'],
    options: [
      { label: 'A', text: '"终于。"长出一口气。今天晚上应该待在家里的。需要至少半天恢复——不说话、不接电话、不安排任何见面', score: { social_drain: 85, expressive: 5 } },
      { label: 'B', text: '还在回味刚才某个人说的某句话。那个想法有意思——明天可以继续想想。这场局至少有一个值得的对话', score: { expressive: 55, social_drain: 20 } },
      { label: 'C', text: '其实还行。今晚有几个不错的对话，能量没被榨干。但上次那个尬局——一出门就开始回血了。不是每场社交都一个效果', score: { social_drain: 35, expressive: 40 } },
      { label: 'D', text: '开始复盘：今晚谁和谁之间有点微妙、我有没有说错什么、那个人为什么中途离场。自动开始归档——像一场社交的会后总结', score: { social_drain: 50, expressive: 30 } }
    ]
  },

  // ========== 15: structured × spontaneous ==========
  { id: 15,
    text: '如果要一个词留在别人对你的记忆里，你希望是？',
    dimensions: ['structured', 'spontaneous'],
    options: [
      { label: 'A', text: '"靠谱。"不是最耀眼的——但你答应的事一定会做。跟你站在一起的人不用回头确认你在不在。你在。', score: { structured: 75, spontaneous: 15 } },
      { label: 'B', text: '"有意思。"想到你就想笑。跟你待在一起的时间过得特别快——你有一种让人卸下防备的能力。不是搞笑，是有趣', score: { spontaneous: 75, structured: 15 } },
      { label: 'C', text: '"忘不掉。"来过就不会被忘记。有自己的节奏、自己的判断、自己的世界——没办法归类。不是故意与众不同的，是你本来就不一样', score: { spontaneous: 50, structured: 25 } },
      { label: 'D', text: '"暖。"不是轰轰烈烈的那种。是冬天递过来的一杯热水、散场时确认每个人都安全到家了、有人难过的时候你什么都不问只是坐在旁边', score: { structured: 45, spontaneous: 35 } }
    ]
  }
]

module.exports = { MINI_QUESTIONS }
