# 🏥 企业级LLM配置示例

将此文件复制为 `.env.local`（开发环境）或 `.env`（生产环境）

```bash
# 🏥 企业级LLM配置 - 医院部署专用
# 确保PHI数据不流出内网

# ===== 本地LLM配置（推荐） =====

# 本地Ollama部署（优先级1）
LOCAL_LLM_ENDPOINT=http://localhost:11434
LOCAL_LLM_MODEL=llama3.2:3b
# 其他可选模型: llama3.2:7b, qwen2.5:3b, mistral:7b

# 本地ChatGLM部署（优先级2 - 国产化选择）
CHATGLM_ENDPOINT=http://localhost:8000
CHATGLM_MODEL=chatglm3-6b
# 其他可选: chatglm4-9b, codegeex4-all-9b

# OpenAI兼容API内网代理（优先级3）
OPENAI_COMPATIBLE_ENDPOINT=http://internal-llm-proxy.hospital.local/v1/chat/completions
OPENAI_COMPATIBLE_KEY=your-internal-api-key
OPENAI_COMPATIBLE_MODEL=gpt-3.5-turbo

# ===== 安全配置 =====

# LLM超时设置（毫秒）
LLM_TIMEOUT_MS=10000

# 环境标识（production时自动禁用云端API）
NODE_ENV=production

# ===== 开发环境配置（生产环境请删除） =====
# 🚨 以下配置仅用于开发测试，生产环境严禁使用

# Groq API（开发环境测试用）
# GROQ_API_KEY=gsk_your_groq_api_key_here
# GROQ_MODEL=llama-3.2-3b-preview
```

## 本地LLM部署说明

### 1. Ollama部署（推荐）
```bash
# 安装
curl -fsSL https://ollama.ai/install.sh | sh

# 启动服务
ollama serve

# 拉取模型
ollama pull llama3.2:3b

# 默认端口: 11434
```

### 2. ChatGLM部署（国产化）
```bash
# 克隆项目
git clone https://github.com/THUDM/ChatGLM3

# 安装依赖
pip install -r requirements.txt

# 启动API服务
python openai_api.py

# 默认端口: 8000
```

### 3. OpenAI兼容代理
可使用以下任一方案：
- **vLLM**: 高性能推理引擎
- **FastChat**: 支持多种模型
- **Text Generation WebUI**: 图形化界面

确保在医院内网环境中部署。

## 安全检查清单

- ✅ `LOCAL_LLM_ENDPOINT` 指向内网地址
- ✅ `NODE_ENV=production` 在生产环境
- ✅ 删除所有云端API配置
- ✅ 网络策略阻止外网访问
- ✅ 定期备份模型和配置

## 配置验证

启动应用后，可通过以下方式验证配置：

```typescript
import { getLLMStatus } from './lib/llm-service';

// 查看当前配置状态
console.log(getLLMStatus());
```

确保 `securityMode` 显示为 `'LOCAL_ONLY'`（生产环境）。




