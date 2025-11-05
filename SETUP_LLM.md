# 🤖 开源LLM集成指南

## 快速开始

本平台集成了**开源LLM**作为智能助手，支持多种部署方式。

### 方式1: 本地运行 Ollama (推荐)

#### 1. 安装 Ollama
```bash
# Windows/Mac/Linux
访问 https://ollama.com 下载安装

# 验证安装
ollama --version
```

#### 2. 下载推荐模型
```bash
# 轻量级模型 (推荐，内存需求低)
ollama pull llama3.2:3b

# 中文优化模型
ollama pull qwen2.5:7b

# 医疗专用模型
ollama pull meditron:7b
```

#### 3. 启动服务
```bash
ollama serve
# 默认运行在 http://localhost:11434
```

#### 4. 配置环境变量
创建 `.env.local` 文件:
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

### 方式2: 使用云端开源LLM API

#### OpenRouter (多模型聚合)
```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

#### Together AI (开源模型托管)
```env
TOGETHER_API_KEY=your_key_here
TOGETHER_MODEL=meta-llama/Llama-3.2-3B-Instruct-Turbo
```

## 安装依赖

```bash
npm install langchain @langchain/community react-markdown
# 或
pnpm install langchain @langchain/community react-markdown
```

## 功能特性

✅ **完全开源** - 使用Meta Llama、Qwen等开源模型
✅ **本地运行** - 数据不出本地，保护隐私
✅ **医疗优化** - 针对谵妄知识库训练的提示词
✅ **实时对话** - 流式响应，体验流畅
✅ **多模型支持** - 灵活切换不同LLM

## 测试

启动开发服务器:
```bash
npm run dev
```

访问网站，点击右下角智能助手图标开始对话！

## 推荐模型对比

| 模型 | 大小 | 内存需求 | 中文能力 | 推荐场景 |
|-----|------|---------|---------|---------|
| llama3.2:3b | 3B | 4GB | ⭐⭐⭐ | 轻量部署 |
| qwen2.5:7b | 7B | 8GB | ⭐⭐⭐⭐⭐ | 中文优先 |
| meditron:7b | 7B | 8GB | ⭐⭐⭐ | 医疗专业 |

## 故障排查

### Ollama连接失败
```bash
# 检查服务状态
curl http://localhost:11434/api/tags

# 重启Ollama服务
ollama serve
```

### 模型响应慢
- 使用更小的模型 (3B参数)
- 增加系统内存
- 考虑使用云端API

