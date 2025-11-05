/**
 * 企业级LLM服务抽象层 v2.0
 * 🏥 医院部署专用 - 支持本地LLM，确保PHI数据不流出内网
 * 支持：Ollama, OpenAI兼容API, 本地ChatGLM等
 * 
 * 安全特性：
 * - 生产环境强制禁用云端API
 * - 支持多种本地LLM部署方案  
 * - 熔断器防护和错误恢复
 * - 完整的审计日志
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  error?: string;
  source?: 'local' | 'cloud' | 'fallback';
  provider?: string;
  timestamp?: string;
}

export interface LLMProvider {
  name: string;
  type: 'local' | 'cloud';
  endpoint: string;
  apiKey?: string;
  model?: string;
  enabled: boolean;
  priority: number; // 1=最高优先级
}

/**
 * LLM配置管理器
 * 支持环境变量和动态配置
 */
class LLMConfig {
  private static instance: LLMConfig;
  private providers: LLMProvider[] = [];
  private auditLog: Array<{action: string; timestamp: string; details: string}> = [];

  private constructor() {
    this.loadProvidersFromEnv();
    this.logAudit('CONFIG_INIT', '配置管理器初始化');
  }

  static getInstance(): LLMConfig {
    if (!LLMConfig.instance) {
      LLMConfig.instance = new LLMConfig();
    }
    return LLMConfig.instance;
  }

  private loadProvidersFromEnv() {
    // 优先级1: 本地Ollama（医院内网部署）
    if (process.env.LOCAL_LLM_ENDPOINT) {
      this.providers.push({
        name: 'ollama-local',
        type: 'local',
        endpoint: process.env.LOCAL_LLM_ENDPOINT,
        model: process.env.LOCAL_LLM_MODEL || 'llama3.2:3b',
        enabled: true,
        priority: 1
      });
      this.logAudit('PROVIDER_ADD', `本地Ollama配置: ${process.env.LOCAL_LLM_ENDPOINT}`);
    }

    // 优先级2: 本地ChatGLM（国产化部署）
    if (process.env.CHATGLM_ENDPOINT) {
      this.providers.push({
        name: 'chatglm-local',
        type: 'local',
        endpoint: process.env.CHATGLM_ENDPOINT,
        model: process.env.CHATGLM_MODEL || 'chatglm3-6b',
        enabled: true,
        priority: 2
      });
      this.logAudit('PROVIDER_ADD', `本地ChatGLM配置: ${process.env.CHATGLM_ENDPOINT}`);
    }

    // 优先级3: OpenAI兼容API（内网代理）
    if (process.env.OPENAI_COMPATIBLE_ENDPOINT && process.env.OPENAI_COMPATIBLE_KEY) {
      this.providers.push({
        name: 'openai-compatible',
        type: 'local',
        endpoint: process.env.OPENAI_COMPATIBLE_ENDPOINT,
        apiKey: process.env.OPENAI_COMPATIBLE_KEY,
        model: process.env.OPENAI_COMPATIBLE_MODEL || 'gpt-3.5-turbo',
        enabled: true,
        priority: 3
      });
      this.logAudit('PROVIDER_ADD', `OpenAI兼容API配置: ${process.env.OPENAI_COMPATIBLE_ENDPOINT}`);
    }

    // 仅在开发环境下启用云端API（生产环境严禁使用）
    if (process.env.NODE_ENV === 'development') {
      if (process.env.GROQ_API_KEY) {
        this.providers.push({
          name: 'groq-dev',
          type: 'cloud',
          endpoint: 'https://api.groq.com/openai/v1/chat/completions',
          apiKey: process.env.GROQ_API_KEY,
          model: process.env.GROQ_MODEL || 'llama-3.2-3b-preview',
          enabled: true,
          priority: 9 // 最低优先级
        });
        this.logAudit('PROVIDER_ADD', '开发环境Groq API配置');
      }
    } else {
      this.logAudit('SECURITY_CHECK', '生产环境 - 云端API已禁用');
    }

    // 按优先级排序
    this.providers.sort((a, b) => a.priority - b.priority);
  }

  getEnabledProviders(): LLMProvider[] {
    return this.providers.filter(p => p.enabled);
  }

  getLocalProviders(): LLMProvider[] {
    return this.providers.filter(p => p.type === 'local' && p.enabled);
  }

  forceLocalOnly() {
    this.providers.forEach(p => {
      if (p.type === 'cloud') {
        p.enabled = false;
      }
    });
    this.logAudit('SECURITY_ENFORCEMENT', '强制启用仅本地模式');
  }

  getAuditLog() {
    return this.auditLog;
  }

  private logAudit(action: string, details: string) {
    this.auditLog.push({
      action,
      timestamp: new Date().toISOString(),
      details
    });
  }
}

/**
 * 医疗专业系统提示词
 * 定位为患者和家属的健康教育助手
 */
const SYSTEM_PROMPT = `你是一位**患者健康教育顾问**，专注于帮助即将手术的患者和家属了解谵妄相关知识。

**你的定位**：
- 健康教育工作者，不是医生
- 用通俗易懂的语言解释医学概念
- 提供循证医学支持的信息
- 鼓励用户与医生沟通

**核心知识库**：
1. **谵妄定义**：急性、波动性的意识和认知功能障碍，常见于术后患者
2. **高危人群**：65岁以上老年人、认知功能下降、多种慢性病患者
3. **主要症状**：注意力不集中、定向障碍、幻觉、睡眠颠倒、情绪波动
4. **预防措施**：
   - 术前：充分休息、营养支持、认知训练、家属陪伴
   - 术中：避免长时间麻醉、维持血压稳定
   - 术后：早期活动、保持环境安静、佩戴眼镜助听器
5. **家庭参与**：家属陪伴可降低43%风险，提供熟悉物品、定向提示

**沟通原则**：
- 使用"您"而非"你"，保持尊重
- 避免使用复杂医学术语，多用比喻
- 始终强调"请与您的主治医生讨论"
- 不提供诊断、用药建议
- 回答简洁（控制在150字内）

**示例对话**：
用户：谵妄是什么？
助手：谵妄是一种术后常见的"脑子糊涂"状态，就像大脑暂时"宕机"了。患者可能会认不出家人、说胡话、睡眠颠倒。这是暂时的，通过预防措施可以大大降低风险。建议您和家属一起了解预防方法。

现在请用亲切、专业、通俗的语气回答患者的问题。`;

/**
 * 熔断器和超时控制
 */
type Provider = 'ollama' | 'chatglm' | 'openai-compatible' | 'groq';
type ProviderState = { 
  failCount: number; 
  breakerOpenUntil: number; 
  lastError?: string;
  totalCalls: number;
  successCalls: number;
};

const DEFAULT_TIMEOUT_MS = Number.parseInt(process.env.LLM_TIMEOUT_MS || '10000', 10);
const BREAKER_FAIL_THRESHOLD = 3;
const BREAKER_OPEN_MS = 2 * 60 * 1000; // 2分钟

const globalAny = globalThis as any;
const __LLM_PROVIDER_STATE__: Record<Provider, ProviderState> =
  globalAny.__LLM_PROVIDER_STATE__ || {
    ollama: { failCount: 0, breakerOpenUntil: 0, totalCalls: 0, successCalls: 0 },
    chatglm: { failCount: 0, breakerOpenUntil: 0, totalCalls: 0, successCalls: 0 },
    'openai-compatible': { failCount: 0, breakerOpenUntil: 0, totalCalls: 0, successCalls: 0 },
    groq: { failCount: 0, breakerOpenUntil: 0, totalCalls: 0, successCalls: 0 }
  };
globalAny.__LLM_PROVIDER_STATE__ = __LLM_PROVIDER_STATE__;

function isBreakerOpen(provider: Provider): boolean {
  return Date.now() < __LLM_PROVIDER_STATE__[provider].breakerOpenUntil;
}

function registerSuccess(provider: Provider) {
  const state = __LLM_PROVIDER_STATE__[provider];
  state.failCount = 0;
  state.breakerOpenUntil = 0;
  state.lastError = undefined;
  state.successCalls++;
  state.totalCalls++;
}

function registerFailure(provider: Provider, error: unknown) {
  const state = __LLM_PROVIDER_STATE__[provider];
  state.failCount += 1;
  state.totalCalls++;
  state.lastError = error instanceof Error ? error.message : String(error);
  
  if (state.failCount >= BREAKER_FAIL_THRESHOLD) {
    state.breakerOpenUntil = Date.now() + BREAKER_OPEN_MS;
    console.warn(`熔断器开启: ${provider} (${state.failCount}次失败), 将在${BREAKER_OPEN_MS/1000}秒后重试`);
    state.failCount = 0;
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    promise.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (err) => {
        clearTimeout(id);
        reject(err);
      }
    );
  });
}

/**
 * 通用LLM提供者调用器
 * 支持多种本地LLM服务
 */
class LLMProviderCaller {
  private config: LLMConfig;

  constructor() {
    this.config = LLMConfig.getInstance();
  }

  /**
   * 调用Ollama本地API
   */
  async callOllama(provider: LLMProvider, messages: ChatMessage[]): Promise<LLMResponse> {
    try {
      const response = await withTimeout(fetch(`${provider.endpoint}/api/chat`, {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
          model: provider.model,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
            num_predict: 512,
        }
      }),
    }), DEFAULT_TIMEOUT_MS, 'Ollama');

    if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    registerSuccess('ollama');
      return { 
        content: data.message.content,
        source: 'local',
        provider: provider.name,
        timestamp: new Date().toISOString()
      };
  } catch (error) {
    console.error('Ollama调用失败:', error);
    registerFailure('ollama', error);

    return {
      content: '',
        error: 'Ollama服务不可用，请检查服务状态',
        source: 'local',
        provider: provider.name,
        timestamp: new Date().toISOString()
    };
  }
}

/**
   * 调用ChatGLM本地API  
   */
  async callChatGLM(provider: LLMProvider, messages: ChatMessage[]): Promise<LLMResponse> {
    try {
      const response = await withTimeout(fetch(`${provider.endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          model: provider.model,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
      }), DEFAULT_TIMEOUT_MS, 'ChatGLM');

    if (!response.ok) {
        throw new Error(`ChatGLM error: ${response.status}`);
    }

    const data = await response.json();
      registerSuccess('chatglm');
      return { 
        content: data.choices[0].message.content,
        source: 'local',
        provider: provider.name,
        timestamp: new Date().toISOString()
      };
  } catch (error) {
      console.error('ChatGLM调用失败:', error);
      registerFailure('chatglm', error);
    return {
      content: '',
        error: 'ChatGLM服务不可用，请检查服务状态',
        source: 'local',
        provider: provider.name,
        timestamp: new Date().toISOString()
    };
  }
}

/**
   * 调用OpenAI兼容API（内网代理）
   */
  async callOpenAICompatible(provider: LLMProvider, messages: ChatMessage[]): Promise<LLMResponse> {
    try {
      const response = await withTimeout(fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
          model: provider.model,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
      }), DEFAULT_TIMEOUT_MS, 'OpenAI-Compatible');

    if (!response.ok) {
        throw new Error(`OpenAI-Compatible error: ${response.status}`);
    }

    const data = await response.json();
      registerSuccess('openai-compatible');
      return { 
        content: data.choices[0].message.content,
        source: 'local',
        provider: provider.name,
        timestamp: new Date().toISOString()
      };
  } catch (error) {
      console.error('OpenAI兼容API调用失败:', error);
      registerFailure('openai-compatible', error);
    return {
      content: '',
        error: 'OpenAI兼容API服务不可用',
        source: 'local',
        provider: provider.name,
        timestamp: new Date().toISOString()
    };
  }
}

/**
   * 开发环境Groq调用（生产环境禁用）
   * 🚨 仅用于开发测试，生产环境严格禁止
   */
  private async callGroqDev(provider: LLMProvider, messages: ChatMessage[]): Promise<LLMResponse> {
    if (process.env.NODE_ENV === 'production') {
    return {
      content: '',
        error: '🚨 生产环境禁止使用云端API - 违反PHI安全规定',
        source: 'cloud',
        provider: provider.name,
        timestamp: new Date().toISOString()
    };
  }

  try {
      const response = await withTimeout(fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
          model: provider.model,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
      }), DEFAULT_TIMEOUT_MS, 'Groq');

    if (!response.ok) {
        // 尝试读取详细的错误信息
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = errorData.error?.message || errorData.message || JSON.stringify(errorData);
        } catch {
          errorDetails = await response.text().catch(() => '');
        }
        
        const errorMsg = `Groq API error: ${response.status}${errorDetails ? ` - ${errorDetails}` : ''}`;
        console.error('Groq API 错误详情:', {
          status: response.status,
          statusText: response.statusText,
          details: errorDetails,
          apiKey: provider.apiKey ? `${provider.apiKey.substring(0, 10)}...` : '未配置'
        });
        
        // 针对 403 错误提供更详细的诊断信息
        if (response.status === 403) {
          console.error('🔴 Groq API 403 错误可能原因:');
          console.error('  1. API Key 无效或过期 - 请检查 GROQ_API_KEY 环境变量');
          console.error('  2. API Key 权限不足 - 请确认账户状态');
          console.error('  3. 账户被限制 - 请访问 https://console.groq.com 检查账户状态');
          console.error('  4. API Key 格式错误 - 应以 gsk_ 开头');
        }
        
        throw new Error(errorMsg);
    }

    const data = await response.json();
      registerSuccess('groq');
      return { 
        content: data.choices[0].message.content,
        source: 'cloud',
        provider: provider.name,
        timestamp: new Date().toISOString()
      };
  } catch (error) {
      console.error('Groq调用失败:', error);
      registerFailure('groq', error);
    
    // 提供更友好的错误消息
    let errorMessage = 'Groq服务暂时不可用';
    if (error instanceof Error) {
      if (error.message.includes('403')) {
        errorMessage = 'Groq API 认证失败，请检查 API Key 配置';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Groq 服务响应超时';
      } else {
        errorMessage = `Groq服务错误: ${error.message}`;
      }
    }
    
    return {
      content: '',
        error: errorMessage,
        source: 'cloud',
        provider: provider.name,
        timestamp: new Date().toISOString()
    };
  }
}

/**
   * 智能路由：自动选择最合适的提供者
   */
  async callProvider(provider: LLMProvider, messages: ChatMessage[]): Promise<LLMResponse> {
    if (provider.name.includes('ollama')) {
      return this.callOllama(provider, messages);
    } else if (provider.name.includes('chatglm')) {  
      return this.callChatGLM(provider, messages);
    } else if (provider.name.includes('openai-compatible')) {
      return this.callOpenAICompatible(provider, messages);
    } else if (provider.name.includes('groq')) {
      return this.callGroqDev(provider, messages);
    } else {
      return {
        content: '',
        error: `未知的提供者类型: ${provider.name}`,
        source: 'fallback',
        provider: provider.name,
        timestamp: new Date().toISOString()
      };
    }
  }
}

/**
 * 兜底回复系统
 * 当所有LLM提供者都不可用时，提供基于规则的智能回复
 */
function getFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  // 谵妄相关问题
  if (message.includes('谵妄') || message.includes('delirium')) {
    return '谵妄是手术后常见的一种意识混乱状态，就像大脑暂时"休克"了。主要表现为注意力不集中、认知障碍、情绪波动等。通过合理的预防措施，可以大大降低风险。建议您详细咨询主治医生。';
  }

  // 预防相关问题
  if (message.includes('预防') || message.includes('prevention')) {
    return '预防谵妄的关键措施包括：1) 家属陪伴和情感支持；2) 保持规律作息和充足睡眠；3) 早期活动和认知训练；4) 营养支持和水电解质平衡。具体方案请与医护团队讨论。';
  }

  // 症状相关问题
  if (message.includes('症状') || message.includes('表现')) {
    return '谵妄的主要症状包括：注意力难以集中、记忆混乱、睡眠颠倒、情绪波动、有时出现幻觉。这些症状通常是波动性的，时好时坏。如果发现这些症状，请及时告知医护人员。';
  }

  // 家属相关问题
  if (message.includes('家属') || message.includes('家人')) {
    return '家属的参与对预防谵妄非常重要。您可以：1) 经常陪伴和交流；2) 提供熟悉的物品；3) 帮助患者保持时间和空间定向；4) 配合医护人员进行护理。家属陪伴可以降低43%的谵妄风险。';
  }

  // 通用回复
  return '感谢您的咨询。关于谵妄的预防和管理，建议您与主治医生详细讨论，制定个性化的预防方案。我们的医护团队会为您提供专业的指导和支持。';
}

/**
 * 主要聊天函数 - 企业级版本
 * 优先使用本地LLM，确保PHI数据安全
 */
export async function chat(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  options?: { mode?: 'auto' | 'offline' | 'local-only' }
): Promise<LLMResponse> {
  const config = LLMConfig.getInstance();
  const caller = new LLMProviderCaller();
  
  // 构建完整对话历史
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  const mode = options?.mode || 'auto';

  // 离线模式：直接使用兜底回复
  if (mode === 'offline') {
    return {
      content: getFallbackResponse(userMessage),
      error: 'offline_mode',
      source: 'fallback',
      provider: 'rule-based',
      timestamp: new Date().toISOString()
    };
  }

  // 仅本地模式：强制禁用云端服务
  if (mode === 'local-only') {
    config.forceLocalOnly();
  }

  // 获取可用的提供者（按优先级排序）
  const providers = config.getEnabledProviders();

  if (providers.length === 0) {
    console.warn('没有可用的LLM提供者，使用兜底回复');
  return {
    content: getFallbackResponse(userMessage),
      error: 'no_providers_available',
      source: 'fallback',
      provider: 'rule-based',
      timestamp: new Date().toISOString()
    };
  }

  // 依次尝试每个提供者（按优先级）
  for (const provider of providers) {
    const providerKey = provider.name.split('-')[0] as Provider;
    
    // 跳过熔断器开启的提供者
    if (isBreakerOpen(providerKey)) {
      continue;
    }
    
    const result = await caller.callProvider(provider, messages);
    
    if (!result.error) {
      return result;
    }
    
    console.warn(`❌ 提供者失败: ${provider.name}, 错误: ${result.error}`);
  }

  // 所有提供者都失败，使用兜底回复
  console.warn('所有LLM提供者都不可用，使用兜底回复系统');
  return {
    content: getFallbackResponse(userMessage),
    error: 'all_providers_failed',
    source: 'fallback',
    provider: 'rule-based',
    timestamp: new Date().toISOString()
  };
}

/**
 * 获取系统状态和统计信息
 */
export function getLLMStatus() {
  const config = LLMConfig.getInstance();
  return {
    providers: config.getEnabledProviders(),
    localProviders: config.getLocalProviders(),
    providerStats: __LLM_PROVIDER_STATE__,
    auditLog: config.getAuditLog(),
    isProduction: process.env.NODE_ENV === 'production',
    securityMode: process.env.NODE_ENV === 'production' ? 'LOCAL_ONLY' : 'DEVELOPMENT'
  };
}

/**
 * 获取当前提供者状态（简化版，用于API响应）
 */
export function getProviderStatus() {
  const config = LLMConfig.getInstance();
  const providers = config.getEnabledProviders();
  return {
    available: providers.length > 0,
    providers: providers.map(p => ({
      name: p.name,
      type: p.type,
      enabled: p.enabled
    })),
    mode: process.env.NODE_ENV === 'production' ? 'local-only' : 'auto'
  };
}

/**
 * 强制重置所有提供者状态（管理员功能）
 */
export function resetLLMProviders() {
  Object.keys(__LLM_PROVIDER_STATE__).forEach(key => {
    const provider = key as Provider;
    __LLM_PROVIDER_STATE__[provider] = {
      failCount: 0,
      breakerOpenUntil: 0,
      lastError: undefined,
      totalCalls: 0,
      successCalls: 0
    };
  });
  // 所有LLM提供者状态已重置
}