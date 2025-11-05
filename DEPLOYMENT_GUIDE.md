# 🌐 生产环境部署指南

## 问题说明

当前配置使用 `localhost:11434` 的Ollama，**仅适用于本地开发**。

❌ **问题**：用户访问部署后的网站时，无法连接到你本地的Ollama服务。

✅ **解决方案**：使用云端LLM API服务。

---

## 🚀 推荐方案（按优先级）

### 方案1：Groq API（推荐 ⭐⭐⭐⭐⭐）

**优势**：
- ⚡ **超快速度**（比其他快10倍）
- 🆓 **免费额度充足**（每天可处理数千次请求）
- 🤖 **开源模型**（Llama 3.2, Mixtral等）
- 🌐 **官方稳定**

**配置步骤**：

1. 注册账号：https://console.groq.com
2. 创建API Key
3. 添加环境变量：

```env
# .env.local (本地开发)
GROQ_API_KEY=gsk_xxxxxxxxxxxx
GROQ_MODEL=llama-3.2-3b-preview
```

4. 生产环境在Vercel/Netlify等平台设置环境变量

---

### 方案2：OpenRouter（推荐 ⭐⭐⭐⭐）

**优势**：
- 🎯 **多模型聚合**（一个API访问50+模型）
- 🆓 **有免费模型**（如Llama 3.2免费版）
- 💰 **按需付费**（其他模型按实际使用计费）

**配置**：
```env
OPENROUTER_API_KEY=sk-or-v1-xxxxx
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

注册：https://openrouter.ai

---

### 方案3：Together AI（推荐 ⭐⭐⭐⭐）

**优势**：
- 🚀 **专注开源模型**
- 💰 **价格便宜**（$0.2 / 百万tokens）
- 🎁 **新用户$25免费额度**

**配置**：
```env
TOGETHER_API_KEY=xxxxx
TOGETHER_MODEL=meta-llama/Llama-3.2-3B-Instruct-Turbo
```

注册：https://together.ai

---

### 方案4：Cloudflare Workers AI（性价比高 ⭐⭐⭐⭐）

**优势**：
- 💰 **极低价格**（每天10,000次免费请求）
- ⚡ **边缘计算**（全球低延迟）
- 🔒 **Cloudflare基础设施**

需要修改代码集成，较复杂。

---

## 🛠️ 实施步骤

### 步骤1：更新 LLM 服务代码

修改 `src/lib/llm-service.ts`，添加Groq支持：

```typescript
/**
 * 调用Groq API（推荐用于生产环境）
 */
async function callGroq(messages: ChatMessage[]): Promise<LLMResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama-3.2-3b-preview';

  if (!apiKey) {
    return {
      content: '',
      error: '未配置Groq API密钥'
    };
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return { content: data.choices[0].message.content };
  } catch (error) {
    console.error('Groq调用失败:', error);
    return {
      content: '',
      error: 'Groq服务暂时不可用'
    };
  }
}

/**
 * 主聊天函数 - 根据环境自动选择LLM
 */
export async function chat(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<LLMResponse> {
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  // 优先级1：Groq（生产环境推荐）
  if (process.env.GROQ_API_KEY) {
    const result = await callGroq(messages);
    if (!result.error) {
      return result;
    }
  }

  // 优先级2：OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    const result = await callOpenRouter(messages);
    if (!result.error) {
      return result;
    }
  }

  // 优先级3：Together AI
  if (process.env.TOGETHER_API_KEY) {
    const result = await callTogether(messages);
    if (!result.error) {
      return result;
    }
  }

  // 优先级4：本地Ollama（仅开发环境）
  if (process.env.OLLAMA_BASE_URL) {
    const result = await callOllama(messages);
    if (!result.error) {
      return result;
    }
  }

  // 兜底回复
  return {
    content: getFallbackResponse(userMessage),
    error: '智能助手暂时不可用，这是预设回复'
  };
}
```

---

### 步骤2：环境变量配置

#### 本地开发 (`.env.local`)
```env
# 开发环境：使用本地Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b

# 或使用云端API测试
# GROQ_API_KEY=gsk_xxxxx
# GROQ_MODEL=llama-3.2-3b-preview
```

#### 生产环境（Vercel/Netlify）
在部署平台的环境变量设置中添加：

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=llama-3.2-3b-preview
```

**重要**：不要把API Key提交到Git仓库！

---

## 📋 各平台部署指南

### Vercel 部署

1. **连接GitHub仓库**
   ```bash
   # 推送代码到GitHub
   git add .
   git commit -m "添加云端LLM支持"
   git push
   ```

2. **导入项目到Vercel**
   - 访问 https://vercel.com
   - 点击 "Add New Project"
   - 选择你的GitHub仓库

3. **配置环境变量**
   在 Vercel Dashboard → Settings → Environment Variables 添加：
   ```
   GROQ_API_KEY = gsk_xxxxx
   GROQ_MODEL = llama-3.2-3b-preview
   ```

4. **部署**
   - 点击 "Deploy"
   - 几分钟后即可访问

---

### Netlify 部署

1. **连接仓库**
   - 访问 https://netlify.com
   - 点击 "Add new site" → "Import from Git"

2. **构建设置**
   ```
   Build command: npm run build
   Publish directory: out 或 .next
   ```

3. **环境变量**
   在 Site settings → Environment variables 添加：
   ```
   GROQ_API_KEY = gsk_xxxxx
   GROQ_MODEL = llama-3.2-3b-preview
   ```

---

### 自有服务器部署

如果你有自己的服务器（如阿里云、腾讯云）：

#### 方案A：部署Ollama到云服务器

```bash
# 1. SSH连接服务器
ssh user@your-server.com

# 2. 安装Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 3. 下载模型
ollama pull llama3.2:3b

# 4. 启动服务（监听所有网络接口）
OLLAMA_HOST=0.0.0.0:11434 ollama serve

# 5. 配置Nginx反向代理
# /etc/nginx/sites-available/ollama
server {
    listen 443 ssl;
    server_name ollama.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:11434;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

然后在项目环境变量中：
```env
OLLAMA_BASE_URL=https://ollama.yourdomain.com
OLLAMA_MODEL=llama3.2:3b
```

#### 方案B：使用云端API
直接配置Groq等云端API，无需维护服务器。

---

## 💰 成本对比

| 方案 | 免费额度 | 付费价格 | 适用场景 |
|------|---------|---------|----------|
| **Groq** | 每天大量免费 | - | 🏆 **小中型项目首选** |
| **OpenRouter** | 部分模型免费 | 按模型不同 | 需要多模型切换 |
| **Together AI** | $25新用户 | $0.2/M tokens | 中型项目 |
| **自建Ollama** | 无限制 | 服务器费用 | 大型项目/隐私要求高 |

### 流量预估

假设：
- 平均每次对话：200 tokens（约150字）
- 每天100个用户，每人3次对话
- 每月总tokens：100人 × 3对话 × 200 tokens × 30天 = 1.8M tokens

**成本**：
- Groq：免费 ✅
- Together AI：$0.36/月
- 自建服务器：¥50-100/月（含服务器）

---

## 🔒 安全建议

### 1. API Key 保护
```typescript
// ❌ 错误：直接暴露在前端
const apiKey = 'gsk_xxxxx'; // 永远不要这样做！

// ✅ 正确：使用服务器端API路由
// src/app/api/chat/route.ts
const apiKey = process.env.GROQ_API_KEY; // 服务器端读取
```

### 2. 速率限制
```typescript
// src/app/api/chat/route.ts
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // 限制每个IP每分钟最多10次请求
  const limiter = rateLimit({
    interval: 60 * 1000, // 1分钟
    uniqueTokenPerInterval: 500,
  });
  
  try {
    await limiter.check(10, request.ip);
  } catch {
    return NextResponse.json(
      { error: '请求过于频繁，请稍后再试' },
      { status: 429 }
    );
  }
  
  // ... 处理聊天请求
}
```

### 3. 输入验证
```typescript
// 限制输入长度，防止滥用
if (message.length > 500) {
  return NextResponse.json(
    { error: '消息过长，请控制在500字以内' },
    { status: 400 }
  );
}
```

---

## 📊 监控与日志

### Vercel Analytics
```typescript
// 记录LLM使用情况
import { track } from '@vercel/analytics';

track('llm_request', {
  model: 'llama-3.2-3b',
  tokens: responseTokens,
  latency: responseTime,
});
```

### 错误追踪
```typescript
// Sentry 集成
import * as Sentry from '@sentry/nextjs';

try {
  const response = await callGroq(messages);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      service: 'groq',
      model: 'llama-3.2-3b',
    }
  });
  throw error;
}
```

---

## 🎯 推荐配置（开箱即用）

### 小型个人项目
```env
# 使用Groq免费版
GROQ_API_KEY=gsk_xxxxx
GROQ_MODEL=llama-3.2-3b-preview
```

### 中型商业项目
```env
# Groq + Together混合
GROQ_API_KEY=gsk_xxxxx
GROQ_MODEL=llama-3.2-3b-preview

TOGETHER_API_KEY=xxxxx
TOGETHER_MODEL=meta-llama/Llama-3.2-3B-Instruct-Turbo
```

### 大型企业项目
```env
# 自建Ollama服务器
OLLAMA_BASE_URL=https://ollama.yourcompany.com
OLLAMA_MODEL=llama3.2:3b

# 备用云端API
GROQ_API_KEY=gsk_xxxxx
```

---

## 🚀 快速实施

我现在就帮你更新代码，支持云端部署！

**步骤**：
1. 更新 `src/lib/llm-service.ts` 添加Groq支持
2. 注册Groq账号获取API Key
3. 配置环境变量
4. 部署到Vercel

需要我帮你完成这些修改吗？ 😊

