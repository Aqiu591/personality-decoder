/**
 * 角色映射池 v2
 * 8 型人格 × 6 角色 = 48 个
 * 来源: 动漫/游戏 + 影视/漫威 + 现实/互联网人物
 *
 * 首次测试展示前 2 个(代表作)
 * 重测用 typeKey + sessionIndex 种子化随机
 * strong 强度展示 3 个
 */

// mulberry32: 7 行纯 JS 种子随机数生成器
function mulberry32(seed) {
  return function () {
    var t = seed += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// Fisher-Yates 洗牌
function shuffle(arr, rng) {
  var result = arr.slice()
  for (var i = result.length - 1; i > 0; i--) {
    var j = Math.floor(rng() * (i + 1))
    var tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}

// 字符串哈希 → 32 位种子
function hashStr(str) {
  var hash = 0
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

// ═══════════════════════════════════════
// 48 角色池
// ═══════════════════════════════════════

var POOL = {

  // ═══ 1. 先想再动：脑派·建构 ═══
  outward_logic_order: [
    { name: '赫敏·格兰杰', source: '《哈利·波特》',
      reason: '去图书馆查完所有资料再行动。她说"我知道"的时候，已经翻过三本书了。' },
    { name: '工藤新一', source: '《名侦探柯南》',
      reason: '看到线索→跑完推理→开口。脑子自动跑完了所有可能性。' },
    { name: '奇异博士', source: '漫威',
      reason: '看了 1400 万种结局才动手。不是犹豫，是在穷举。' },
    { name: '安西教练', source: '《灌篮高手》',
      reason: '坐在场边不动，全场战术已经算完了。开口的时候，比赛已经定了。' },
    { name: 'MOSS', source: '《流浪地球》',
      reason: '所有变量都跑一遍才给你答案。冷漠不是因为无情，是因为全算过了。' },
    { name: '何同学', source: 'B站 UP主',
      reason: '一个视频想三个月，出了就是全网刷屏。慢，但每帧都值得。' }
  ],

  // ═══ 2. 脑比嘴快：脑派·流动 ═══
  outward_logic_flow: [
    { name: 'L·劳伦斯', source: '《死亡笔记》',
      reason: '蹲在椅子上吃甜食、做事方式没人理解。所有人还在讨论，他已经知道答案了。' },
    { name: '托尼·斯塔克', source: '漫威',
      reason: '嘴在前面跑，脑子比嘴还快十倍。话说到一半，下一个想法已经冒出来了。' },
    { name: '埃隆·马斯克', source: '现实人物',
      reason: '火箭炸了说"数据拿到了"。别人看到失败，他看到下一版的参数。' },
    { name: '哆啦A梦', source: '《哆啦A梦》',
      reason: '每次从口袋里掏出来的东西你都想不到。问题多不怕，口袋够深。' },
    { name: '罗辑', source: '《三体》',
      reason: '所有人绝望的时候，他想出了黑暗森林。最难的题需要最跳脱的脑子。' },
    { name: '手工耿', source: 'B站 UP主',
      reason: '做了一堆"没用"的东西，但你每个都想看。创造力的本质就是：凭什么不能这样。' }
  ],

  // ═══ 3. 自动操心：心派·建构 ═══
  outward_feel_order: [
    { name: '灶门炭治郎', source: '《鬼灭之刃》',
      reason: '连敌人都会心疼。同理心自动运转，关不掉。最累的那个永远是他。' },
    { name: '莫妮卡·盖勒', source: '《老友记》',
      reason: '招待所有人、记住每个人的习惯、散场后一个人收拾。不安排好的话她不知道怎么放松。' },
    { name: '大白 Baymax', source: '《超能陆战队》',
      reason: '扫描到你的疼痛指数，立刻抱住。不需要你说"我需要帮助"——它已经知道了。' },
    { name: '千寻', source: '《千与千寻》',
      reason: '一个人扛起所有，把爸妈变回来。崩溃了躲进角落哭完，擦干眼泪继续走。' },
    { name: '董宇辉', source: '现实人物',
      reason: '直播间讲到让人哭，自己还在笑。把知识变成安慰，是另一种照顾。' },
    { name: '波吉', source: '《国王排名》',
      reason: '不会说话不会打架，但他往前走一步，所有人都想保护他。温柔是一种超能力。' }
  ],

  // ═══ 4. 走哪热哪：心派·流动 ═══
  outward_feel_flow: [
    { name: '漩涡鸣人', source: '《火影忍者》',
      reason: '走到哪都把敌人变成朋友。嘴遁不是技能，是他真的相信每个人都有故事。' },
    { name: '菲比·布菲', source: '《老友记》',
      reason: '怪但可爱。完全活在自己的频率上，别人反而被她带跑了——而且跑得很开心。' },
    { name: '路飞', source: '《海贼王》',
      reason: '每到一个岛多一群队友。不靠算计，靠的是"跟着这个人好像会很有意思"。' },
    { name: '周星驰', source: '现实人物/电影',
      reason: '他自己不一定开心，但你看到他就想笑。把孤独变成喜剧，是最高级的感染力。' },
    { name: '星爵 Peter Quill', source: '漫威',
      reason: '跳舞拯救银河系。在所有人板着脸的时候，他放了首劲歌金曲。' },
    { name: 'Papi酱', source: '互联网创作者',
      reason: '一个人一张嘴，演完整部剧。把日常切片变成段子，每个人都觉得"这就是我"。' }
  ],

  // ═══ 5. 自给自足：内源·脑派·建构 ═══
  inward_logic_order: [
    { name: '绫波丽', source: '《EVA》',
      reason: '话最少的人，每句都精准。一个人就是一个完整的生态系统。' },
    { name: '安迪·杜弗雷', source: '《肖申克的救赎》',
      reason: '在任何人都会崩溃的地方，安静地、按部就班地挖了二十年。心里有别人看不见的图纸。' },
    { name: '宫崎骏', source: '现实人物',
      reason: '一个人画了半个动画史，退休七次还在画。他的世界够大，不需要别人填满。' },
    { name: '坂本', source: '《在下坂本，有何贵干》',
      reason: '一个人完成所有操作，cool 到不合逻辑。不需要合群——群会自动向他靠拢。' },
    { name: '伍六七', source: '《刺客伍六七》',
      reason: '一个人、一把剪刀、一个小岛。不追热点，不走套路，自己的节奏就是对的。' },
    { name: '李子柒', source: '现实/互联网',
      reason: '一个人种地做饭盖房子，几千万人围观她的安静。不需要解释，做就是了。' }
  ],

  // ═══ 6. 后台运行：内源·脑派·流动 ═══
  inward_logic_flow: [
    { name: '奈良鹿丸', source: '《火影忍者》',
      reason: '嘴里说着"好麻烦"，其实所有可能性已经算完了。看起来最懒散的那个，是全场最聪明的人。' },
    { name: '夏洛克·福尔摩斯', source: '《神探夏洛克》',
      reason: '瘫在沙发上像关机了。但所有线索早已在后台拼接完毕。动的时候，案子已经破了。' },
    { name: '张一鸣', source: '现实人物',
      reason: '看起来最不"大佬"的大佬。不怎么说话，但所有逻辑在后台跑完了才开口。' },
    { name: '五条悟', source: '《咒术回战》',
      reason: '蒙着眼，开着挂。看着在玩，其实全场每一帧他都已经算过了。' },
    { name: '孙悟空', source: '《西游记》',
      reason: '看着闹，每一步都算过。七十二变不是乱变——哪一变打哪个妖怪，心里有账本。' },
    { name: '沈腾', source: '现实人物',
      reason: '台上看起来像在划水——每个包袱都精准到帧。最松弛的人，往往是最用功的那个。' }
  ],

  // ═══ 7. 外面整齐：内源·心派·建构 ═══
  inward_feel_order: [
    { name: '艾莎 Elsa', source: '《冰雪奇缘》',
      reason: '用完美的控制保护自己和身边的人。怕失控、怕伤害、怕被别人看到里面那个不够完美的自己。' },
    { name: '薇尔莉特', source: '《紫罗兰永恒花园》',
      reason: '外表一丝不苟、每句话经过斟酌。里面藏着一个曾经碎裂、被小心粘好的自己。' },
    { name: '谷爱凌', source: '现实人物',
      reason: '赛场上稳得像设定好程序。私下也会紧张到吐——只是她不会让你看到那一面。' },
    { name: '灰原哀', source: '《名侦探柯南》',
      reason: '外表冷到结冰，里面藏着一整个崩溃过的自己。用冷漠保护温柔。' },
    { name: '李诗情', source: '《开端》',
      reason: '循环了二十几次，每次都保持冷静推理。慌完了继续想办法——慌的部分不让你看见。' },
    { name: '罗翔', source: '现实人物',
      reason: '用最严谨的法条，讲最温柔的道理。框架是铠甲，里面是软的。' }
  ],

  // ═══ 8. 安静但想：内源·心派·流动 ═══
  inward_feel_flow: [
    { name: '夏目贵志', source: '《夏目友人帐》',
      reason: '安静地走在人群边缘，但他看见的东西比所有人都多。细腻到能感知别人忽略的每一丝波动。' },
    { name: '碇真嗣', source: '《EVA》',
      reason: '接收器太灵敏了——一个眼神、一句话的语气——他全收到了。音量太大的世界，只能把自己调成静音。' },
    { name: '新海诚的主角', source: '《你的名字。》等',
      reason: '安静地穿越时空，只为见一个人。心里有一整片宇宙，外面看起来只是在看云。' },
    { name: '余华', source: '现实人物',
      reason: '写得比谁都狠，活得比谁都通透。小说让人哭，采访让人笑——两个都是真的。' },
    { name: '无脸男', source: '《千与千寻》',
      reason: '不说话，但他给的最多。想被看见，但不知道怎么开口。给出去是他唯一会的语言。' },
    { name: '陈奕迅', source: '现实人物',
      reason: '唱尽所有人的心碎，本人是个讲段子的。把沉重唱出来，把轻松留给生活。' }
  ]
}

// ═══════════════════════════════════════
// 公开: 从池中挑选角色
// ═══════════════════════════════════════

/**
 * @param {string} typeKey - 8 型 key, 如 "outward_logic_order"
 * @param {object} [opts]
 * @param {string} [opts.intensity] - 'strong' | 'moderate' | 'mild'
 * @param {number} [opts.sessionIndex] - 0=首次, >0=重测次数
 * @returns {Array<{name, source, reason}>}
 */
function pickCharacters(typeKey, opts) {
  opts = opts || {}
  var pool = POOL[typeKey]
  if (!pool || !pool.length) return []

  var count = opts.intensity === 'strong' ? 3 : 2
  var idx = opts.sessionIndex || 0

  // 首次: 返回前 N 个代表角色
  if (idx === 0) {
    return pool.slice(0, Math.min(count, pool.length))
  }

  // 重测: 种子化随机
  var seed = hashStr(typeKey + '_' + idx)
  var rng = mulberry32(seed)
  var shuffled = shuffle(pool, rng)
  return shuffled.slice(0, Math.min(count, pool.length))
}

module.exports = { POOL: POOL, pickCharacters: pickCharacters }
