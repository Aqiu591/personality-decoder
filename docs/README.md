# 性格解码器

微信 AI 工具小程序 · 两年内从零到第一笔收入

## 项目结构

```
├── app.json              # 小程序配置
├── app.js                # 全局逻辑
├── app.wxss              # 全局样式
├── project.config.json   # 开发者工具配置
├── sitemap.json          # 搜索配置
├── pages/
│   ├── index/            # 首页（落地页）
│   ├── test/             # 答题页（5 题 Mini 版 / 30 题完整版）
│   ├── result/           # 结果页（免费 3 维度 + 好奇心钩子）
│   └── report/           # 完整报告（付费版，开发中）
├── utils/
│   ├── questions.js      # 题库（Mini 5 题 + 完整 30 题）
│   └── results.js        # 静态结果模板（4 种性格画像）
├── prompts/
│   └── report-system-prompt.md  # Prompt 模板 + 调优指南
├── cloudfunctions/
│   └── generateReport/   # 云函数：调用混元生成报告
├── docs/
│   ├── 关键词方案与审核清单.md
│   └── README.md
└── images/               # 图标和素材
```

## 开发阶段

### Phase 1: Mini 版 (Day 0-1)
- [x] 项目结构搭建
- [x] 5 道精选题 + 4 套静态结果模板
- [x] 首页 / 答题 / 结果 / 分享完整流程
- [ ] 微信开发者工具导入测试
- [ ] 提交审核

### Phase 2: 完整版 (Day 2-5)
- [ ] 30 题题库 + 七个维度
- [ ] Prompt 调试（"卧槽"标准）
- [ ] 云函数接入混元 API
- [ ] Canvas 动态分享卡片
- [ ] 微信支付接入（仅 Android）
- [ ] iOS 端付费屏蔽

### Phase 3: 推广变现 (Day 6-14)
- [ ] 种子用户 50 人
- [ ] 搜一搜 SEO
- [ ] 小红书内容
- [ ] 数据看板 + 迭代
- [ ] 第一笔收入到账

## 核心判据

**Day 2 能不能让一个真人对屏幕说「卧槽」。**

能 → 继续跑。不能 → 换方向或继续调 Prompt。

## 审核避险

- 全文不使用"AI""人工智能""大模型"字眼
- 类目：工具 - 信息查询
- iOS 端不展示付费入口
- 内置免责声明："仅供娱乐参考"

---

> 计划来源：[AI 独立开发者两周变现计划](D:\AI-Indie-Plan)
