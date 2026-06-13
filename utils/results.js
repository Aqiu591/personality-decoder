/**
 * 8 型人格 × 3 级强度 = 24 种实际体验
 *
 * v2 修复（2026-06-10 内测反馈驱动）：
 * 1. 算法：维度归一化 + 中性阈值 ±15% → 消除 sensitive 霸权
 * 2. 文案：清除模板化句式("不是…是…""这就是你""但这不是重点")
 * 3. 每型一个"丑陋但真实"的细节 → 信任重建
 * 4. 3 级强度变体 → 温和派和极端派看到不同的话
 */

// ============================================================
// 结果模板
// ============================================================

const RESULT_TEMPLATES = {

  // ===== 外源·脑派·建构 =====
  outward_logic_order: {
    code: '先想再动',
    typeName: '把生活过成流程图的',
    oneLiner: {
      strong: '你不太需要别人觉得你行。你把事情从头到尾推演清楚了，自己心里就踏实了。三遍。',
      moderate: '喜欢想清楚了再动。想透了，心里踏实。',
      mild: '你习惯先想后动。偶尔反过来试试。有些答案不在计划里。'
    },
    dimensions: [
      { name: '你跟人的关系', label: '准',
        analysis: '你聊天其实是在提取信息。好的聊天让你脑子里多出三条新思路。纯寒暄的局，你走得最快。无聊对你来说是一种物理感受，像在读一本每一页都在重复上一页的书。朋友不多。但那几个人的对话质量，比别人几十场饭局加起来都高。你交朋友的标准挺简单：值得聊。' },
      { name: '你做判断的方式', label: '准',
        analysis: '你选一件事之前，脑子里已经跑完了别人要走三天的推理。问你为什么这么选，你能说出一二三。每条理由独立站得住。这套系统在 90% 的场景里很好用。剩下那 10%，遇到完全不讲逻辑的人，你最好的武器直接报废。那种烦躁很具体：输入格式不对，处理不了。有些人不需要被说服。需要被等到。' },
      { name: '你的安全区边缘', label: '有点像',
        analysis: '可预测让你安心。知道接下来会发生什么，比"到时候再说"让你舒服。这份精准是你花了很多年建的。但说真的，你人生里最好的那些意外，没有一件提前出现在你的日历上。那个没在计划里的人。那件临时起意半夜出门的事。它们不敲门。你得留条门缝。不用拆掉这个系统。偶尔在日程表上画个问号就行。' }
    ],
    shareText: '我是「先想再动」型。你的自述标签是什么？→',
    characters: [
      { name: '赫敏·格兰杰', source: '《哈利·波特》', reason: '去图书馆查完所有资料再行动。在她说"我知道"的时候，她已经翻过三本书了。' },
      { name: '工藤新一', source: '《名侦探柯南》', reason: '看到线索→跑完推理→开口。不是想耍帅，是脑子自动跑完了所有可能性。' }
    ]
  },

  // ===== 外源·脑派·流动 =====
  outward_logic_flow: {
    code: '脑比嘴快',
    typeName: '脑子比嘴快三拍的',
    oneLiner: {
      strong: '你看起来什么都不太在乎。但你在乎的东西你全想过了。你只是不需要展示思考过程。',
      moderate: '你的脑子一直在跑，嘴跟不上。过程太长，懒得解释而已。',
      mild: '你有时候显得随便。其实已经想完了。'
    },
    dimensions: [
      { name: '你的能量来源', label: '准',
        analysis: '你最好的想法产生于没人看的时候。散步、洗澡、睡前躺着的那十五分钟。人群里你话不多，但别人说的每一个字你都在听。你有一个隐藏开关：平时安静得像在观察，一旦有人聊到你真正在意的事，立刻从静音切到停不下来。这个反差经常把刚认识的人吓一跳。他们以为你很闷，突然发现你聊起某个话题火力全开。你只是挑频道。' },
      { name: '你怎么做决定', label: '有点像',
        analysis: '别人还在收集信息，你已经下了判断。你的处理速度比大多数人快一档。偶尔翻车。翻几次车总比一直停在原地强。先跑起来再调方向。这个逻辑在事情上很好用。放在人和关系上，稍微慢一点。不是所有人都跟得上你的处理速度。有些人需要你展示过程，不只是结果。' },
      { name: '你最像自己的时候', label: '准',
        analysis: '你恨被框住。太详细的计划、太确定的关系、一眼看到底的未来，你会想跑。但你又不喜欢让人觉得你不靠谱。所以你在"想要自由"和"不想被当成不负责"之间反复横跳。你需要的是一个不让你窒息的方向。不需要时间表。一个大概的、值得去的、让你期待明天的方向就够了。你有计划能力。你只是不想把计划当成笼子。' }
    ],
    shareText: '我是「脑比嘴快」型。你的自述标签是什么？→',
    characters: [
      { name: 'L', source: '《死亡笔记》', reason: '蹲在椅子上吃甜食、做事方式没人理解。但所有人还在讨论的时候，他已经知道答案了。' },
      { name: '托尼·斯塔克', source: '《钢铁侠》', reason: '嘴在前面跑，脑子比嘴还快十倍。话说到一半，下一个想法已经冒出来了。' }
    ]
  },

  // ===== 外源·心派·建构 =====
  outward_feel_order: {
    code: '自动操心',
    typeName: '全场最累但看起来最轻松的',
    oneLiner: {
      strong: '别人觉得跟你待在一起舒服。他们不知道，那种舒服是你每一秒的关注换来的。散场之后你的大脑还在复盘全场。',
      moderate: '你很会照顾人。但照顾完一轮之后，你需要一个没人找你说话的下午。',
      mild: '你对人的关注度很高。偶尔也让自己被照顾一下。不用总是当那个全场最累的人。'
    },
    dimensions: [
      { name: '你真正的社交模式', label: '准',
        analysis: '散场之后你还在想今晚谁说了什么、谁和谁之间有点微妙。你记得 A 的事、知道 B 最近在烦什么、C 上次聊的事你还记着追问后续。你在社交中的状态更像持续扫描和调整。谁说了一句不对劲的话，谁的表情变了半秒，你全捕捉到了。你累不是因为社交本身。你在一场局里同时开了十几个线程。全场看起来最不累的那个人，每次都是你。但每次散场后最需要回血的，也是你。' },
      { name: '你的判断系统', label: '准',
        analysis: '你判断一件事对不对，先想"这会让别人怎么想"，然后才是"这合理吗"。你有逻辑，只是你的逻辑系统里自动把人的感受放在了第一条。这让你的选择往往是最有人味的。代价是你偶尔要替别人收拾情绪的摊子。别人做了决定就走了，你留下来想把每个人的感受都安顿好。你最累的时候，往往不是因为事情多。是你替别人承担了他们的情绪重量。' },
      { name: '你最容易被忘掉的需求', label: '有点像',
        analysis: '你太会照顾别人了，以至于别人以为你不需要被照顾。你自己有时候也忘了。你一直往前排安排所有人，发现的时候自己已经站到了最后。继续这样你会怨的。怨恨是一点一点攒的，攒够了才被你注意到。别人愿意照顾你。你只是从来没给他们机会知道你需要什么。下次试着说一次"我今天不行"。说这句话比你想的难，但比你想的重要。' }
    ],
    shareText: '我是「自动操心」型。你的自述标签是什么？→',
    characters: [
      { name: '灶门炭治郎', source: '《鬼灭之刃》', reason: '连敌人都会心疼。不是圣母，是同理心自动运转，关不掉。最累的那个永远是他。' },
      { name: '莫妮卡·盖勒', source: '《老友记》', reason: '招待所有人、记住每个人的习惯、散场后一个人收拾。不是控制欲，是不安排好的话她不知道怎么放松。' }
    ]
  },

  // ===== 外源·心派·流动 =====
  outward_feel_flow: {
    code: '走哪热哪',
    typeName: '走到哪就把哪变热闹的',
    oneLiner: {
      strong: '你的存在本身就在改变一个房间的气氛。但你没出现的那些时刻，只有你自己知道原因。你在充电。',
      moderate: '你很会带气氛。但热闹完之后，你需要一段没人找你的时间。',
      mild: '你有一种让人放松的能力。偶尔也允许自己不负责氛围。别人也可以暖场的。'
    },
    dimensions: [
      { name: '你跟人的关系', label: '准',
        analysis: '你跟刚认识的人能聊得像老朋友。你有一种让对方在五分钟内放松下来的能力。跟你待着的人觉得轻松，因为你不预设任何人应该怎样。但你自己清楚。你只在状态好的时候出现。状态不好你会自动消失，不回消息、不接电话、不解释。你不想把坏情绪带进场。所以你在别人记忆里永远明媚。偶尔有人问"你最近怎么不见了"，你不会说实话。你害怕一旦不那么亮了，别人就不想待在你旁边了。' },
      { name: '你做决定的逻辑', label: '有点像',
        analysis: '你靠"这事对不对味"做决定。一件事让你觉得有意思、有点兴奋、或者单纯想试试，你就去了。信身体给的反应比分析快。当然有时候踩坑。但你不后悔。没试过对你来说才是真正的损失。你活得比别人多了很多"我试过了"，也多了很多"早该知道"。但都是你自己选的。这种选法让你的人生密度很高。不过有时候，密度高和方向对是两件不同的事。' },
      { name: '你一直在跑的东西', label: '准',
        analysis: '你最怕被困住。被困在一个无聊的工作里、被困在一段没有新鲜感的关系里、被困在一个被完全安排好的未来里。适应力是你最强的能力。你能在任何环境里找到舒服的姿势。但这也意味着你可能在一个不适合你的地方待很久，久到忘了自己本来想走。适应力太强的人，容易被环境"养着"然后忘了问自己还想不想要。你不是只能飘。你只是还没找到值得停的地方。' }
    ],
    shareText: '我是「走哪热哪」型。你的自述标签是什么？→',
    characters: [
      { name: '漩涡鸣人', source: '《火影忍者》', reason: '不是靠嘴皮子，是他真的相信每个人都有闪光点。冷掉的场子在他面前撑不过三分钟。' },
      { name: '菲比·布菲', source: '《老友记》', reason: '怪但可爱。完全活在自己的频率上，别人反而被她带跑了——而且跑得很开心。' }
    ]
  },

  // ===== 内源·脑派·建构 =====
  inward_logic_order: {
    code: '自给自足',
    typeName: '心里有座自己运转的城市',
    oneLiner: {
      strong: '你一个人的时候脑子最清楚。人多了反而吵。等你找到值得的人，你比谁都投入。',
      moderate: '你享受独处。人对你来说是偶尔的风景，不是每日必需品。',
      mild: '你偏安静。社交对你来说需要预热。先待一会，再决定要不要聊。'
    },
    dimensions: [
      { name: '你跟世界的关系', label: '准',
        analysis: '你一个人待着的时候状态最好。对人有真实的兴趣，但你每跟人待完都需要一段独处来整理和归档。像电脑要关机重启，你要安静地把今天接收到的所有信号归位。你朋友不多，但你们之间的深度是别人几十个点头之交比不上的。你的精力有限，只够分配给真正值得的关系。直觉很准：谁是值得的，谁是浪费时间的，你第一次见面就知道了。你交得到朋友。你只是在等值得交的人。' },
      { name: '你的默认出厂设置', label: '准',
        analysis: '分析是你的出厂设置。自动开启的。不管多乱的信息进来，你自动开始找结构。你对"为什么"有执念，一件事不搞清楚为什么会这样，会在后台一直跑这个进程。但这个设置有个 bug：有些人找你，要的不是解决方案。他们只是想说"我好难受"，要的是"我在听"。你的大脑自动切到修复模式。但有些事不需要修。需要的是被听见。你最亲近的人可能需要你少修一点、多听一点。' },
      { name: '你花了很多年建的系统', label: '准',
        analysis: '可预测的生活让你平静。你知道自己什么时候状态最好、什么时候该做什么。这份精准是你花了很多年建的。但说真的。你人生里那些最好的东西。那个不知道怎么应对的人、那件没预料到会开心的事。几乎没有一件是按计划发生的。不用拆掉这个系统。偶尔给"不知道"留一条缝就行。它们不会破门而入，你得留门。而且你得承认，有些最好的东西是你计划不出来的。' }
    ],
    shareText: '我是「自给自足」型。你的自述标签是什么？→',
    characters: [
      { name: '绫波丽', source: '《EVA》', reason: '话最少的人，但每句都精准。一个人就是一个完整的生态系统，不需要从外界获取能量。' },
      { name: '安迪·杜弗雷', source: '《肖申克的救赎》', reason: '在任何人都会崩溃的地方，安静地、按部就班地挖了二十年。心里有别人看不见的图纸。' }
    ]
  },

  // ===== 内源·脑派·流动 =====
  inward_logic_flow: {
    code: '后台运行',
    typeName: '看着随便其实早就想完了的',
    oneLiner: {
      strong: '你看起来对什么都不太当回事。但在乎的东西你全想过了。你只是不需要展示思考过程。',
      moderate: '你想事情很快，快到别人还没开始想你已经跳到了结论。过程你看过就行。',
      mild: '你有一种"已经在别处想完了"的气质。别人觉得你随性，其实你的CPU一直没停。'
    },
    dimensions: [
      { name: '你的能量来源', label: '准',
        analysis: '你最好的想法产生于没人看的时候。散步、洗澡、睡前躺着的那十五分钟。人群里你话不多，但别人说的每一个字你都在听。你有一个隐藏模式：平时安静得像在观察，一旦有人聊到你真正在意的事，立刻从静音切到停不下来。这个反差经常把刚认识的人吓一跳。你喜欢的社交是"交换想法"，不是"交换近况"。一个晚上如果没有任何让你觉得"有意思"的对话，你会觉得浪费了时间。' },
      { name: '你怎么想事情', label: '有点像',
        analysis: '你喜欢把事想清楚再动。但"想清楚"在你这里不发生在桌前，是在后台跑的。你可能做别的事的时候突然想通一个纠结了很久的问题。这让别人觉得你随性。但你知道在选 A 之前，A 到 Z 你已经全跑过了。只是过程快到你懒得解释。有时候这会让别人低估你。你早就想好了，只是不需要向他们证明。不过偶尔解释一下过程也挺好的。有些人需要看到你的思路，才能信任你的结论。' },
      { name: '你可能在骗自己的地方', label: '准',
        analysis: '社会时钟对你是背景噪音。你看起来比同龄人"慢"，但你没有真的慌。人生不是比赛。但有一件事你得对自己诚实：有时候你在乎。只是怕承认了在乎也做不到。把"无所谓"挂在嘴边的人，往往是最在乎的那个。对别人可以装，至少对自己，别。你不需要在所有人面前都保持"没事"的表情。在乎一件事、一个人。说出来不会让你变弱。' }
    ],
    shareText: '我是「后台运行」型。你的自述标签是什么？→',
    characters: [
      { name: '奈良鹿丸', source: '《火影忍者》', reason: '嘴里说着"好麻烦"，其实所有可能性已经算完了。看起来最懒散的那个，是全场最聪明的人。' },
      { name: '福尔摩斯', source: '《神探夏洛克》', reason: '瘫在沙发上像关机了。但所有线索早已在后台拼接完毕。动的时候，案子已经破了。' }
    ]
  },

  // ===== 内源·心派·建构 =====
  inward_feel_order: {
    code: '外面整齐',
    typeName: '用外在秩序守护内在敏感的人',
    oneLiner: {
      strong: '别人觉得你温和、好相处。他们没发现的是，你的温和是一套精心维护的系统。用来保护里面那个太容易受伤的自己。',
      moderate: '你喜欢周围的事物稳定、可预期。稳定让你安全。跟控制无关。',
      mild: '你对细节敏感。有时候太敏感了。但你花了很多年学会了用秩序来安顿它。'
    },
    dimensions: [
      { name: '你的内在生态', label: '准',
        analysis: '你内心有一个巨大的收藏馆。每段记忆、每种微妙的感受都被你仔细分类、归档、反复回味。你从一段对话里能品出三层意思，一首歌能把你拉回某个具体的下午，一个眼神变了半秒你能记好几天。你的感知分辨率比别人高。别人看到一件事，你已经看到了这件事可能引发的情绪连锁反应。代价是，大多数社交环境对你来说都太吵了。一场局下来，别人只听到了对话，你听到了所有的潜台词。所以你累得比别人快。' },
      { name: '你怎么知道什么是对的', label: '准',
        analysis: '你判断一件事，先感受，再分析。你的直觉很少出错。有时候你说不出"为什么"，但你就是知道。是一种身体层面的确认，不是头脑层面的推理。这个系统大部分时候很好用。但有个陷阱：直觉让你往前走的声音，和恐惧让你往后退的声音，在你这里听起来几乎一模一样。你需要学会分辨它们。直觉是"虽然有点怕但我想试试"。恐惧是"我想了一堆理由说明为什么不应该"。一个让你变大的，一个让你变小的。' },
      { name: '你花了很多年学的功课', label: '有点像',
        analysis: '你学会了用稳定来保护自己。东西在它该在的位置、关系是稳定可依的、明天是可预期的。你发现外在的秩序能让内在的敏感安顿下来。东西不乱，心就不乱。这很聪明。但偶尔这套系统会过头：你会用"保持稳定"来躲开所有可能让你受伤的事。而有些最值得的东西。那个人、那个机会、那句话。需要你先放下这个保护罩。不是对所有人。是对那个值得的。你得自己判断谁值得。' }
    ],
    shareText: '我是「外面整齐」型。你的自述标签是什么？→',
    characters: [
      { name: '薇尔莉特', source: '《紫罗兰永恒花园》', reason: '外表一丝不苟、每句话经过斟酌。里面藏着一个曾经碎裂、被小心粘好的自己。' },
      { name: '艾莎', source: '《冰雪奇缘》', reason: '用完美的外在控制保护自己和身边的人。怕失控、怕伤害、怕被别人看到里面那个不够完美的自己。' }
    ]
  },

  // ===== 内源·心派·流动 =====
  inward_feel_flow: {
    code: '安静但想',
    typeName: '静水深流型的',
    oneLiner: {
      strong: '外人觉得你随和、没太多要求。他们不知道你里面有多大的世界。你是最难被一眼看透的那种人。',
      moderate: '你看着安静，但里面一直在动。别人看得到水面，看不到底下的暗流。',
      mild: '你不太容易被归类。安静，有自己的想法。随和，有一条清楚的底线。'
    },
    dimensions: [
      { name: '你的真实状态', label: '准',
        analysis: '没有外界期待、不需要管理表情、不需要解释自己的时候，才是你最好的状态。独处是唯一不用翻译自己的时间。你不用向任何人表达自己。你对世界的感知太细腻了，细腻到大多数场合对你来说都像噪音。你的接收器天生灵敏，活在一个音量太大的世界里。你要找的是一个能让你安静地做自己的空间。以及一个不需要你解释为什么需要安静的人。' },
      { name: '你看不见的判断网', label: '准',
        analysis: '你做决定靠的是一种说不清楚但你知道很重要的东西。有人叫它直觉，有人叫它第六感。在你这里它是一套完整的、多层的、由所有你经历过的事编织出来的判断网。别人觉得你的决定有时候不好理解，但你自己知道那个"对"的感觉。一种身体层面的确认，骗不了自己。你对被骗的敏感度远超常人。不管是被别人骗，还是骗自己。这让你在商业和关系里都有一种天然的预警系统。别人事后说"早该知道的"，你事前就知道了。' },
      { name: '你跟时间的特殊关系', label: '准',
        analysis: '你不在任何人的时钟上。所有人冲刺的时候你可能在看天空，所有人躺平的时候你开始疯狂输出。你的节奏跟别人不在同一张谱上。这有时候让你觉得自己跟世界脱节了。但换个角度想：一个所有人都同步的世界，太吵了。总得有人不在同一频率上，提醒大家慢一点。你可能就是其中之一。你不用着急跟上谁的节奏。你的节奏没问题。它只是不在标准节拍器上。' }
    ],
    shareText: '我是「安静但想」型。你的自述标签是什么？→',
    characters: [
      { name: '夏目贵志', source: '《夏目友人帐》', reason: '安静地走在人群边缘，但他看见的东西比所有人都多。细腻到能感知别人忽略的每一丝波动。' },
      { name: '碇真嗣', source: '《EVA》', reason: '不是懦弱。是接收器太灵敏了——一个眼神、一句话的语气——他全收到了。在一个音量太大的世界里，只能把自己调成静音。' }
    ]
  }
}

// ============================================================
// 算法 v2：归一化 + 中性阈值 + 强度分级
// ============================================================

/**
 * 10 个维度
 */
const DIMS = [
  'sensitive', 'rational', 'assertive', 'diplomatic', 'structured',
  'spontaneous', 'expressive', 'reserved', 'social_drain', 'adventure'
]

function calculateResult(answers) {
  const { MINI_QUESTIONS } = require('./questions')

  // --- Step 1: 初始化累计容器 ---
  const dimQuestionCount = {}
  const centerRaw = {}
  DIMS.forEach(d => { dimQuestionCount[d] = 0 })
  DIMS.forEach(d => { centerRaw[d] = 0 })

  // --- Step 2: 累计原始分（v3: 支持多选，取选中选项的平均分）---
  const raw = {}
  DIMS.forEach(d => { raw[d] = 0 })
  let scoredAnswerCount = 0

  answers.forEach((answerItem, qIdx) => {
    // 自定义文本答案不提供量化信号，也不参与分母和中心校准。
    if (typeof answerItem === 'string') return

    const q = MINI_QUESTIONS[qIdx]
    if (!q) return

    // 向后兼容：旧格式为单个索引，新格式为数组
    const selectedIndices = Array.isArray(answerItem) ? answerItem : [answerItem]
    const selectedOptions = selectedIndices
      .map(idx => q.options[idx])
      .filter(opt => opt && opt.score)

    if (selectedOptions.length === 0) return
    scoredAnswerCount++

    const dimsInQuestion = new Set()
    q.options.forEach(opt => {
      Object.keys(opt.score).forEach(k => dimsInQuestion.add(k))
    })
    dimsInQuestion.forEach(d => {
      dimQuestionCount[d]++
      const expected = q.options.reduce((sum, opt) => sum + ((opt.score && opt.score[d]) || 0), 0) / q.options.length
      centerRaw[d] += expected
    })
    const questionScores = {}

    selectedOptions.forEach(opt => {
      Object.entries(opt.score).forEach(([k, v]) => {
        questionScores[k] = (questionScores[k] || 0) + v
      })
    })

    // 取该题选中选项的平均分
    Object.keys(questionScores).forEach(k => {
      raw[k] = (raw[k] || 0) + questionScores[k] / selectedOptions.length
    })
  })

  // --- Step 3: 归一化 + 动态均值对中 ---
  // 选项只给正分，必须减去随机选择的期望均值。
  // 这里按用户实际回答的量化题动态计算基线，避免“自己写”被误当成负分。
  const norm = {}
  DIMS.forEach(d => {
    if (dimQuestionCount[d] > 0) {
      norm[d] = (raw[d] / dimQuestionCount[d]) - (centerRaw[d] / dimQuestionCount[d])
    } else {
      norm[d] = 0
    }
  })

  // --- Step 4: 三条轴的得分（对中后，期望 ≈ 0）---
  const energyScore  = norm.expressive + norm.diplomatic - norm.social_drain - norm.reserved * 0.5
  const judgmentScore = norm.rational + norm.structured - norm.sensitive - norm.spontaneous
  const rhythmScore  = norm.structured + norm.assertive * 0.6 - norm.spontaneous - norm.adventure

  // --- Step 5: 中性阈值 ---
  // 对中后轴得分标准差约 25-35，±15 覆盖 ~45% 的随机人群
  const NEUTRAL = 15

  function classify(score, positiveLabel, negativeLabel) {
    if (score > NEUTRAL)  return positiveLabel
    if (score < -NEUTRAL) return negativeLabel
    return score >= 0 ? positiveLabel : negativeLabel
  }

  const energy   = classify(energyScore,   'outward', 'inward')
  const judgment = classify(judgmentScore, 'logic',   'feel')
  const rhythm   = classify(rhythmScore,   'order',   'flow')

  // --- Step 6: 强度计算（对中后调整阈值）---
  function axisStrength(score) {
    const abs = Math.abs(score)
    if (abs > 40) return 2   // 强
    if (abs > 15) return 1   // 中
    return 0                  // 弱
  }

  const totalStrength = axisStrength(energyScore) + axisStrength(judgmentScore) + axisStrength(rhythmScore)

  let intensity
  if (totalStrength >= 5)      intensity = 'strong'
  else if (totalStrength >= 2) intensity = 'moderate'
  else                         intensity = 'mild'

  if (scoredAnswerCount === 0) {
    const personalization = generatePersonalization(answers, MINI_QUESTIONS)
    const customKillerLine = {
      line1: '你没有把自己硬塞进选项里。',
      line2: '这件事本身就很有信息量：你更在意准确表达，而不是随便选个差不多。',
      line3: '别人做题是在选答案，你是在改题目。预设选项没接住你的那部分，反而是最像你的地方。',
      tagLine: '你的自述标签：自由作答 · 选项外的人'
    }
    const customKeywords = [
      { word: '不愿将就', why: '当选项不够准确时，你宁愿自己写，也不愿随手选一个接近的' },
      { word: '表达优先', why: '你更关心“这是不是我真正想说的”，而不是“这个答案能不能过关”' },
      { word: '边界清楚', why: '你知道哪些描述接得住你，哪些只是看起来差不多' }
    ]
    const customShortDimensions = [
      {
        name: '你做题时暴露的第一件事',
        zinger: '你不是难选。你是讨厌不准确。',
        plain: '选项没有说到点上时，你会本能地想补充、修正、重新定义。',
        scene: '别人看到“都差不多”，你看到的是“差一点就完全不是那回事”。',
        tease: '这不是挑剔。好吧，有一点。但这是有用的挑剔。'
      },
      {
        name: '你的表达方式',
        zinger: '你不太喜欢被一句话概括。',
        plain: '因为你知道人不是一个标签，也不是一个选项能装下的。',
        scene: '你写下的原话，比任何预设结果都更接近你当下的真实反应。',
        tease: '所以这份结果先别急着看类型名。你的原话才是主菜。'
      },
      {
        name: '更适合你的读法',
        zinger: '你这次最重要的信号，不是你选了什么，而是你拒绝了什么。',
        plain: '那些让你觉得“不像我”的选项，正在反向画出你的轮廓。',
        scene: '回头看你写下的几句话：哪里不愿妥协，哪里必须自己定义。',
        tease: '如果想让画像更稳定，下一次每题先选一个最接近的，再把不准确的地方写出来。'
      }
    ]
    const customContradictionHook = {
      evidence: '你这次几乎没有使用预设选项，而是选择用自己的话回答。这个路径说明：系统给你的框，你没有直接接受。',
      partialReveal: '这背后通常不是“想太多”，而是你对表达准确度有要求。真正值得看的，是你反复想修正的那些地方……',
      unlockPercent: 24
    }
    return {
      personalization,
      code: '自由作答',
      typeName: '选项外的人',
      oneLiner: '你这次没有把自己塞进预设选项里。真正有信息量的是你写下的原话。',
      intensity: 'mild',
      dimensions: [
        {
          name: '你的答案方式',
          label: '待确认',
          analysis: '这份结果没有足够的选项信号来给你贴类型。你选择自己写，说明预设选项没有接住你当下的真实反应。这个动作本身有信息量：你更在意准确表达，而不是随便选一个接近的答案。'
        },
        {
          name: '更适合你的读法',
          label: '待确认',
          analysis: '先别急着看类型名。回头看你写下的每一句话，里面会有比标签更具体的东西：你在什么地方不愿意妥协，什么表达让你觉得不够准确，什么场景必须由你自己定义。'
        },
        {
          name: '下一步',
          label: '建议',
          analysis: '如果你想得到更稳定的画像，可以重测一次，每题至少选一个最接近的选项，再把不准确的部分写进自定义答案。这样系统能同时读到量化方向和你的原话。'
        }
      ],
      shareText: '我是「选项外的人」。你也测测看？',
      characters: [],
      killerLine: customKillerLine,
      keywords: customKeywords,
      shortDimensions: customShortDimensions,
      contradictionHook: customContradictionHook,
      _scores: { norm, energyScore, judgmentScore, rhythmScore, intensity: 'mild', scoredAnswerCount }
    }
  }

  // --- Step 7: 组装结果 ---
  const typeKey = `${energy}_${judgment}_${rhythm}`
  const typeMap = {
    'outward_logic_order': 'outward_logic_order',
    'outward_logic_flow':  'outward_logic_flow',
    'outward_feel_order':  'outward_feel_order',
    'outward_feel_flow':   'outward_feel_flow',
    'inward_logic_order':  'inward_logic_order',
    'inward_logic_flow':   'inward_logic_flow',
    'inward_feel_order':   'inward_feel_order',
    'inward_feel_flow':    'inward_feel_flow'
  }

  const mappedType = typeMap[typeKey] || 'inward_feel_flow'
  const template = RESULT_TEMPLATES[mappedType]

  // 根据强度选择对应的 oneLiner
  const personalizedOneLiner = template.oneLiner[intensity] || template.oneLiner.moderate

  // 个性化洞察
  const personalization = generatePersonalization(answers, MINI_QUESTIONS)

  // 命门句数据
  const killerData = KILLER_LINES[mappedType] || KILLER_LINES['inward_feel_flow']

  // 矛盾预览钩子（基于 user 的实际矛盾检测结果动态生成）
  const contradictionHook = buildContradictionHook(
    personalization.contradictions,
    personalization.patterns
  )

  // 组装最终结果
  return {
    personalization,
    code: template.code,
    typeName: template.typeName,
    oneLiner: personalizedOneLiner,
    intensity: intensity,
    // 第一维度根据强度微调（mild 在第一段末尾加一句鼓励）
    dimensions: template.dimensions.map((dim, idx) => {
      if (idx === 0 && intensity === 'mild') {
        return {
          name: dim.name,
          label: dim.label,
          analysis: dim.analysis + ' 当然，这些都只是方向。15道题画不完整个人。如果有说中的，想一想为什么。如果有没说中的，那个"没说中"的部分，可能恰恰是你最知道自己要什么的地方。'
        }
      }
      return { name: dim.name, label: dim.label, analysis: dim.analysis }
    }),
    shareText: template.shareText,
    characters: template.characters || [],
    // 命门句 + 短维度 + 矛盾钩子
    killerLine: killerData.killerLine,
    keywords: killerData.keywords,
    shortDimensions: killerData.shortDimensions,
    contradictionHook,
    // 附加调试信息（生产环境可去掉）
    _scores: { norm, energyScore, judgmentScore, rhythmScore, intensity, scoredAnswerCount }
  }
}

const { generatePersonalization } = require('./personalize')
const { KILLER_LINES, buildContradictionHook } = require('./killer-lines')

module.exports = { RESULT_TEMPLATES, calculateResult }
