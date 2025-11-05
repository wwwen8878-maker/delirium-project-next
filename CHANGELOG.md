# 更新日志

## [2.0.0] - 2024-10-25

### 🚀 重大更新

#### 新增功能
- ✅ **云端LLM支持** - 支持Groq、OpenRouter、Together AI等云端API
- ✅ **智能助手全面升级** - 医疗场景专用对话组件
- ✅ **速率限制** - 防止API滥用（每IP每分钟15次）
- ✅ **自动降级机制** - 多个API自动切换，确保可用性
- ✅ **兜底回复系统** - 基于关键词的智能匹配

#### UI/UX优化
- 🎨 **去AI化设计** - 移除"AI"、"人工智能"等科技用语
- 🏥 **医疗专业化** - 强化"健康教育"、"循证医学"定位
- 👥 **明确目标用户** - 面向术前患者和家属
- 📝 **场景化描述** - 清晰说明术前/术后/家庭护理场景

#### 技术改进
- 🔧 **LLM服务重构** - 支持4种LLM方案的自动选择
- 🛡️ **安全加固** - 输入验证、长度限制、错误处理
- 📊 **日志监控** - API调用时长、来源IP追踪
- ⚡ **性能优化** - 请求限流、内存管理

### 📁 新增文件

```
src/
  lib/
    - llm-service.ts (更新) - 新增Groq/OpenRouter/Together支持
    - rate-limit.ts (新增) - 速率限制工具
  app/api/chat/
    - route.ts (更新) - 安全加固、日志监控
  components/
    - smart-assistant.tsx (新增) - 全新智能助手组件

文档/
  - DEPLOYMENT_GUIDE.md - 完整部署指南
  - 部署到云端-简明指南.md - 3步快速部署
  - SETUP_LLM.md - LLM配置详解
  - README_UPDATES.md - 更新说明
  - QUICKSTART.md - 快速开始
  - CHANGELOG.md - 本文件
```

### 🔄 修改文件

```
- package.json - 新增langchain、react-markdown等依赖
- src/app/layout.tsx - 更新元数据和标题
- src/app/page.tsx - 首页用户定位优化
- src/app/assessment/page.tsx - 去AI化文案
- .env.example - 环境变量配置示例
```

### 🌐 生产部署

现在支持：
- ✅ Vercel（推荐）
- ✅ Netlify
- ✅ 自有服务器
- ✅ Docker容器

### 📊 对比

| 维度 | v1.0 | v2.0 |
|------|------|------|
| LLM | 模拟回复 | 真实LLM + 兜底 |
| 部署 | 仅本地 | 可部署到云端 |
| UI | 科技感强 | 医疗专业化 |
| 安全 | 无限制 | 速率限制+验证 |

### 🎯 下一步计划

- [ ] 流式响应（Streaming）
- [ ] 多语言支持（英文、繁体）
- [ ] 语音输入/输出
- [ ] 对话历史持久化
- [ ] 用户反馈系统

---

## [1.0.0] - 2024-10-20

### 初始版本

- ✅ 术前科普宣教
- ✅ 风险评估工具
- ✅ 术后谵妄筛查
- ✅ 健康日记功能
- ✅ 预防计划管理
- ✅ 基础聊天组件

---

**完整更新说明**：README_UPDATES.md

