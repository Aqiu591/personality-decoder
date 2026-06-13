# 原来我是这种人啊

微信小程序 · 性格画像分析工具

## 项目结构

```
├── app.json / app.js / app.wxss  # 小程序入口
├── pages/
│   ├── index/      # 首页（天蓝·白云·可爱）
│   ├── test/       # 答题页（15 题，多选 toggle + 自定义 + 上一题）
│   ├── result/     # 结果页（逐层揭开 3 层 + 个性化洞察）
│   ├── report/     # 完整报告页（付费后，开发中）
│   └── privacy/    # 隐私政策
├── utils/
│   ├── questions.js  # 15 道题，IPIP 行为锚定，10 维度 × 4 选项
│   ├── results.js    # 8 型人格算法 + 3 级强度 + 个性化集成
│   └── personalize.js # 个性化引擎 v2（8 模式 + 4 矛盾规则）
├── cloudfunctions/generateReport/  # 混元大模型云函数（未启用）
├── prompts/report-system-prompt.md  # 报告 Prompt
└── docs/
```

## 当前状态

- ✅ 体验版已上线
- ✅ 15 题 + 8 型人格 + 3 级强度
- ✅ 多选 toggle + 自定义输入 + 上一题
- ✅ 个性化引擎（跨题模式 / 矛盾聚光灯 / 自定义回显 / 一句话洞察）
- ❌ Canvas 分享卡片
- ❌ 微信支付
- ❌ 完整报告页

## 审核避险

- 全文不使用"AI""人工智能""大模型"字眼
- 类目：工具 - 信息查询
- iOS 端不展示付费入口
- 免责声明："仅供娱乐参考"
