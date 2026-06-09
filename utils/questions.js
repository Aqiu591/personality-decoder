/**
 * Mini 版题库 — 15 道精选题
 * 每道题 3 个选项，每个选项携带多维得分权重
 */

const MINI_QUESTIONS = [
  // 1
  { id: 1,
    text: '朋友发了一条消息，你看了一眼，过了两个小时才回。为什么？',
    options: [
      { label: 'A', text: '需要想想怎么回比较合适，不想敷衍了事', score: { sensitive: 85, reserved: 60, expressive: 15 } },
      { label: 'B', text: '当下能量低想自己待着，等状态好了再好好聊', score: { social_drain: 80, reserved: 50, structured: 40 } },
      { label: 'C', text: '忘了。真的就是忘了。不是故意不回的', score: { spontaneous: 85, expressive: 50, sensitive: 10 } }
    ]
  },
  // 2
  { id: 2,
    text: '深夜刷到朋友出去玩的合照——一群人里没有你。第一反应？',
    options: [
      { label: 'A', text: '点赞划走。没叫我就没叫我，又不是什么大事', score: { rational: 80, diplomatic: 70, sensitive: 15 } },
      { label: 'B', text: '仔细看每张照片里每个人的表情，推测为什么没叫自己', score: { sensitive: 90, reserved: 50, expressive: 10 } },
      { label: 'C', text: '截图发给共同朋友问"你们啥时候约的？"', score: { assertive: 75, expressive: 55, sensitive: 35 } }
    ]
  },
  // 3
  { id: 3,
    text: '群里有个人 @ 所有人说了一件你认为明显不对的事。你怎么做？',
    options: [
      { label: 'A', text: '群里直接说，摆事实讲道理。错的就是错的，不说出来憋得慌', score: { assertive: 85, rational: 75, diplomatic: 5 } },
      { label: 'B', text: '私聊那个人委婉提醒。当众让人下不来台没必要', score: { diplomatic: 85, sensitive: 70, assertive: 15 } },
      { label: 'C', text: '看到了但没出声。说了可能变成焦点，不值当', score: { reserved: 80, diplomatic: 35, assertive: 5 } }
    ]
  },
  // 4
  { id: 4,
    text: '你点了一杯喝的，喝了一口——不是你要的味道。你？',
    options: [
      { label: 'A', text: '算了将就喝吧，为了十几块钱跟店员理论太累了', score: { diplomatic: 80, assertive: 5, structured: 20 } },
      { label: 'B', text: '心里斗争了三十秒——最后还是去换了', score: { sensitive: 65, assertive: 45, structured: 35 } },
      { label: 'C', text: '直接告诉店员做错了。不是钱的问题，是我要喝到我点的那杯', score: { assertive: 85, rational: 55, structured: 50 } }
    ]
  },
  // 5
  { id: 5,
    text: '躺床上突然想起五年前一件尴尬到脚趾抠地的事。你通常会？',
    options: [
      { label: 'A', text: '脑内自动重播三遍，告诉自己"别想了"——然后继续想', score: { sensitive: 85, spontaneous: 45, rational: 10 } },
      { label: 'B', text: '笑一下觉得当时的自己挺可爱的，翻个身继续刷手机', score: { rational: 60, diplomatic: 60, sensitive: 20 } },
      { label: 'C', text: '分析一下当时为什么会那样，复盘完这事儿就翻篇了', score: { rational: 85, structured: 60, sensitive: 30 } }
    ]
  },
  // 6
  { id: 6,
    text: '你在社交媒体上更接近哪种状态？',
    options: [
      { label: 'A', text: '潜水型——刷得起飞但基本不发，偶尔发了也可能很快删掉或仅自己可见', score: { reserved: 85, sensitive: 55, expressive: 5 } },
      { label: 'B', text: '观察型——会发但每条反复编辑好几遍，发完过一会儿看看有没有互动', score: { sensitive: 70, structured: 45, expressive: 30 } },
      { label: 'C', text: '分享型——看到有意思的就发，不太纠结有没有人看', score: { expressive: 80, spontaneous: 60, sensitive: 15 } }
    ]
  },
  // 7
  { id: 7,
    text: '别人对你的第一印象，和你自己觉得的自己——差距大吗？',
    options: [
      { label: 'A', text: '很大。别人觉得我高冷/安静/不好接近，但我只是慢热，熟了完全不一样', score: { reserved: 75, sensitive: 55, expressive: 20 } },
      { label: 'B', text: '有一点差距但不离谱。亲近的人看到的我更接近真实', score: { diplomatic: 65, sensitive: 45, expressive: 40 } },
      { label: 'C', text: '基本上一致。我里外比较统一，不太会包装自己', score: { expressive: 70, assertive: 55, sensitive: 15 } }
    ]
  },
  // 8
  { id: 8,
    text: '一段关系（朋友或感情）走到终点，最让你难受的是？',
    options: [
      { label: 'A', text: '失去这个人本身——只有你们懂的梗、习惯、默契，再也找不到一样的了', score: { sensitive: 90, reserved: 40, rational: 10 } },
      { label: 'B', text: '过程里的遗憾——"要是我当时没那么说/那么做，会不会不一样"', score: { sensitive: 75, structured: 45, rational: 35 } },
      { label: 'C', text: '结束的方式——不清不楚地淡掉比吵一架更让人难受', score: { assertive: 60, structured: 50, rational: 45 } }
    ]
  },
  // 9
  { id: 9,
    text: '周末没有任何安排。到周日晚上，你更接近哪种状态？',
    options: [
      { label: 'A', text: '按计划做了几件事，感觉周末过得充实有掌控感', score: { structured: 85, rational: 55, spontaneous: 5 } },
      { label: 'B', text: '本来想做点啥但躺着躺着就过去了，有点愧疚但也还行', score: { spontaneous: 65, sensitive: 45, structured: 20 } },
      { label: 'C', text: '完全不记得干了什么但挺开心的，计划是什么能吃吗', score: { spontaneous: 90, adventure: 50, structured: 5 } }
    ]
  },
  // 10
  { id: 10,
    text: '有人当众夸你。你的真实反应是？',
    options: [
      { label: 'A', text: '开心但浑身不自在，赶紧转移话题夸回去', score: { reserved: 70, sensitive: 60, diplomatic: 50 } },
      { label: 'B', text: '表面淡定微笑说谢谢，心里偷偷乐', score: { diplomatic: 65, reserved: 45, expressive: 30 } },
      { label: 'C', text: '大大方方接受——"谢谢我也觉得！"或者至少不否认', score: { expressive: 75, assertive: 55, reserved: 5 } }
    ]
  },
  // 11
  { id: 11,
    text: '一个好机会摆在面前，但风险也不小。你的决策过程更像？',
    options: [
      { label: 'A', text: '列 pros & cons，评估最坏情况能不能承受，能就干', score: { rational: 80, structured: 65, adventure: 35 } },
      { label: 'B', text: '问了几个信任的人的意见，然后跟着感觉走', score: { diplomatic: 55, sensitive: 50, adventure: 50 } },
      { label: 'C', text: '直觉说冲就冲了。想太多反而迈不动腿', score: { adventure: 80, spontaneous: 65, rational: 10 } }
    ]
  },
  // 12
  { id: 12,
    text: '一个人待了一整天之后，你的状态是？',
    options: [
      { label: 'A', text: '精力充沛心情好，甚至觉得能不能再续一天', score: { social_drain: 85, reserved: 60, structured: 40 } },
      { label: 'B', text: '还行，但如果有人叫我出去我也不排斥', score: { diplomatic: 60, expressive: 40, social_drain: 30 } },
      { label: 'C', text: '有点闷，想找人说话或者出去透透气', score: { expressive: 75, adventure: 45, social_drain: 5 } }
    ]
  },
  // 13
  { id: 13,
    text: '你跟好朋友吵架了。最可能发生的场景是？',
    options: [
      { label: 'A', text: '你主动开口——"我们谈谈吧"。冷战比吵架更消耗你', score: { assertive: 75, expressive: 60, reserved: 10 } },
      { label: 'B', text: '你想开口但不知道怎么起头，怕说错让对方更生气', score: { sensitive: 80, reserved: 50, diplomatic: 40 } },
      { label: 'C', text: '先冷一冷。等双方情绪都消了自然会恢复', score: { reserved: 70, diplomatic: 55, assertive: 10 } }
    ]
  },
  // 14
  { id: 14,
    text: '你对"规则"的态度？',
    options: [
      { label: 'A', text: '规则让事情可预期，大多数时候遵守规则效率最高', score: { structured: 80, rational: 60, adventure: 5 } },
      { label: 'B', text: '看情况。合理的遵守，不合理的想办法绕过去', score: { rational: 60, assertive: 45, structured: 25 } },
      { label: 'C', text: '规则是给需要规则的人用的。我有自己的判断标准', score: { adventure: 60, spontaneous: 50, assertive: 50 } }
    ]
  },
  // 15
  { id: 15,
    text: '你希望自己在别人记忆里是什么样的？',
    options: [
      { label: 'A', text: '一个靠谱的、可以依赖的人。说到做到，让人放心', score: { structured: 70, rational: 55, assertive: 40 } },
      { label: 'B', text: '一个有趣的、让人想起来就笑的人。跟你在一起很轻松', score: { expressive: 70, spontaneous: 55, diplomatic: 45 } },
      { label: 'C', text: '一个特别的、让人忘不掉的人。有深度，跟别人不一样', score: { sensitive: 60, adventure: 50, reserved: 40 } }
    ]
  }
]

module.exports = { MINI_QUESTIONS }
