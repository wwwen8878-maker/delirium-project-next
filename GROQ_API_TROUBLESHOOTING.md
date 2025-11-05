# 🔧 Groq API 403 错误故障排除指南

## 问题症状

控制台显示：
```
Groq API error: 403
Groq调用失败: Error: Groq API error: 403
```

## 可能原因和解决方案

### 1. ✅ API Key 无效或过期

**检查步骤：**
1. 打开 `.env.local` 文件（或项目根目录的 `.env` 文件）
2. 检查 `GROQ_API_KEY` 是否正确配置
3. 确保 API Key 没有多余的空格或换行符

**解决方法：**
```bash
# 在 .env.local 中检查格式
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
# 注意：不要有引号，不要有多余空格
```

**获取新的 API Key：**
1. 访问 https://console.groq.com
2. 登录账户
3. 进入 "API Keys" 页面
4. 创建新的 API Key
5. 复制并更新 `.env.local` 文件

---

### 2. ✅ API Key 格式错误

Groq API Key 应该：
- 以 `gsk_` 开头
- 长度约为 51 个字符
- 格式示例：`gsk_1234567890abcdefghijklmnopqrstuvwxyz`

**检查方法：**
```bash
# 在终端运行（Windows PowerShell）
$env:GROQ_API_KEY
# 或在 .env.local 文件中查看
```

---

### 3. ✅ 账户被限制或禁用

**检查步骤：**
1. 访问 https://console.groq.com
2. 登录账户
3. 检查账户状态和额度
4. 查看是否有警告或限制通知

**可能的问题：**
- 账户未完成验证
- 免费额度已用完
- 账户因滥用被限制
- 区域限制（某些地区可能无法使用）

---

### 4. ✅ 环境变量未正确加载

**检查方法：**

1. **确认文件存在：**
   - 确保项目根目录有 `.env.local` 文件（不是 `.env.local.md`）

2. **确认格式正确：**
   ```env
   GROQ_API_KEY=gsk_xxxxxxxxxxxx
   GROQ_MODEL=llama-3.2-3b-preview
   NODE_ENV=development
   ```

3. **重启开发服务器：**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   # 然后重新启动
   npm run dev
   ```

4. **验证环境变量是否加载：**
   在代码中临时添加日志（仅用于调试）：
   ```typescript
   console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? '已配置' : '未配置');
   ```

---

### 5. ✅ 使用本地 LLM 作为替代方案

如果 Groq API 持续出现问题，可以使用本地 LLM：

**使用 Ollama（推荐）：**
```bash
# 1. 安装 Ollama
# 访问 https://ollama.ai 下载

# 2. 拉取模型
ollama pull llama3.2:3b

# 3. 在 .env.local 中配置
LOCAL_LLM_ENDPOINT=http://localhost:11434
LOCAL_LLM_MODEL=llama3.2:3b

# 4. 删除或注释掉 GROQ_API_KEY
# GROQ_API_KEY=gsk_xxxxx  # 已禁用
```

---

## 🔍 诊断步骤

### 步骤 1: 验证 API Key

在终端运行（Windows）：
```powershell
# 测试 API Key 是否有效
curl -X POST https://api.groq.com/openai/v1/chat/completions `
  -H "Authorization: Bearer YOUR_API_KEY" `
  -H "Content-Type: application/json" `
  -d '{"model": "llama-3.2-3b-preview", "messages": [{"role": "user", "content": "test"}], "max_tokens": 10}'
```

如果返回 403，说明 API Key 有问题。

### 步骤 2: 检查控制台输出

运行应用后，查看控制台是否显示详细的错误信息：
```
Groq API 错误详情: {
  status: 403,
  statusText: 'Forbidden',
  details: '...',
  apiKey: 'gsk_xxxxx...'
}
```

### 步骤 3: 检查网络连接

确认可以访问 Groq API：
```bash
ping api.groq.com
```

---

## 💡 快速修复检查清单

- [ ] `.env.local` 文件存在于项目根目录
- [ ] `GROQ_API_KEY` 以 `gsk_` 开头
- [ ] API Key 没有多余的空格或引号
- [ ] 已重启开发服务器（`npm run dev`）
- [ ] 在 https://console.groq.com 验证账户状态
- [ ] 检查账户是否有可用额度
- [ ] 尝试创建新的 API Key

---

## 📞 获取帮助

如果以上步骤都无法解决问题：

1. **检查 Groq 官方状态：**
   - https://status.groq.com

2. **查看 Groq 文档：**
   - https://console.groq.com/docs

3. **联系 Groq 支持：**
   - 通过 console.groq.com 提交支持工单

---

## 🎯 临时解决方案

如果急需使用系统，可以：

1. **使用兜底回复系统**（已自动启用）
   - 当所有 LLM 提供者都失败时，系统会自动使用基于规则的回复

2. **切换到离线模式：**
   - 在 API 请求中添加 `?mode=offline` 参数

3. **配置本地 LLM：**
   - 使用 Ollama 或 ChatGLM 作为替代方案

---

**最后更新：** 2024年






