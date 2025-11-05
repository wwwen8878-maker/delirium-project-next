// 增强功能本地存储管理

import { HealthDiaryEntry, RiskVisualization, PreventionPlan, FamilyMember, AssessmentSession, AssessmentResult } from '@/lib/types/enhanced';

// 通用存储键名前缀
const STORAGE_PREFIX = 'delirium_enhanced_';

// 健康日记存储键
const HEALTH_DIARY_KEY = `${STORAGE_PREFIX}health_diary`;
const RISK_VISUALIZATION_KEY = `${STORAGE_PREFIX}risk_visualization`;
const PREVENTION_PLANS_KEY = `${STORAGE_PREFIX}prevention_plans`;
const FAMILY_MEMBERS_KEY = `${STORAGE_PREFIX}family_members`;
const ASSESSMENT_SESSIONS_KEY = `${STORAGE_PREFIX}assessment_sessions`;
const USER_PROFILE_KEY = `${STORAGE_PREFIX}user_profile`;

// 通用存储操作类
class EnhancedStorage {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  // 获取存储项
  protected getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  // 设置存储项
  protected setItem<T>(key: string, value: T): void {
    if (!this.isClient) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }

  // 删除存储项
  private removeItem(key: string): void {
    if (!this.isClient) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  // 清空所有相关存储
  clearAll(): void {
    if (!this.isClient) return;

    const keys = [
      HEALTH_DIARY_KEY,
      RISK_VISUALIZATION_KEY,
      PREVENTION_PLANS_KEY,
      FAMILY_MEMBERS_KEY,
      ASSESSMENT_SESSIONS_KEY,
      USER_PROFILE_KEY
    ];

    keys.forEach(key => this.removeItem(key));
  }
}

// 健康日记存储管理
export class HealthDiaryStorage extends EnhancedStorage {
  // 获取所有日记条目
  getAllEntries(): HealthDiaryEntry[] {
    return this.getItem(HEALTH_DIARY_KEY, []);
  }

  // 获取指定日期的日记
  getEntryByDate(date: string): HealthDiaryEntry | null {
    const entries = this.getAllEntries();
    return entries.find(entry => entry.date === date) || null;
  }

  // 获取指定ID的日记
  getEntryById(id: string): HealthDiaryEntry | null {
    const entries = this.getAllEntries();
    return entries.find(entry => entry.id === id) || null;
  }

  // 添加或更新日记条目
  saveEntry(entry: HealthDiaryEntry): void {
    const entries = this.getAllEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);

    if (existingIndex >= 0) {
      entries[existingIndex] = { ...entry, updatedAt: new Date().toISOString() };
    } else {
      entries.push(entry);
    }

    // 按日期倒序排列
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.setItem(HEALTH_DIARY_KEY, entries);
  }

  // 删除日记条目
  deleteEntry(id: string): void {
    const entries = this.getAllEntries().filter(entry => entry.id !== id);
    this.setItem(HEALTH_DIARY_KEY, entries);
  }

  // 获取日期范围内的日记
  getEntriesInRange(startDate: string, endDate: string): HealthDiaryEntry[] {
    const entries = this.getAllEntries();
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });
  }

  // 获取最近7天的日记
  getRecentEntries(days: number = 7): HealthDiaryEntry[] {
    const entries = this.getAllEntries();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return entries.filter(entry => new Date(entry.date) >= cutoffDate);
  }
}

// 风险可视化存储管理
export class RiskVisualizationStorage extends EnhancedStorage {
  // 获取风险可视化数据
  getRiskVisualization(): RiskVisualization | null {
    return this.getItem(RISK_VISUALIZATION_KEY, null);
  }

  // 保存风险可视化数据
  saveRiskVisualization(data: RiskVisualization): void {
    this.setItem(RISK_VISUALIZATION_KEY, {
      ...data,
      lastUpdated: new Date().toISOString()
    });
  }

  // 更新风险趋势
  updateRiskTrend(trend: 'improving' | 'stable' | 'worsening'): void {
    const current = this.getRiskVisualization();
    if (current) {
      this.saveRiskVisualization({ ...current, trend });
    }
  }
}

// 预防计划存储管理
export class PreventionPlanStorage extends EnhancedStorage {
  // 获取所有预防计划
  getAllPlans(): PreventionPlan[] {
    return this.getItem(PREVENTION_PLANS_KEY, []);
  }

  // 获取指定分类的计划
  getPlansByCategory(category: PreventionPlan['category']): PreventionPlan[] {
    const plans = this.getAllPlans();
    return plans.filter(plan => plan.category === category);
  }

  // 获取待完成的计划
  getPendingPlans(): PreventionPlan[] {
    const plans = this.getAllPlans();
    return plans.filter(plan => !plan.completed);
  }

  // 获取今日待完成计划
  getTodayPlans(): PreventionPlan[] {
    const plans = this.getAllPlans();
    const today = new Date().toISOString().split('T')[0];

    return plans.filter(plan =>
      !plan.completed &&
      plan.dueDate <= today
    );
  }

  // 保存预防计划
  savePlan(plan: PreventionPlan): void {
    const plans = this.getAllPlans();
    const existingIndex = plans.findIndex(p => p.id === plan.id);

    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.push(plan);
    }

    this.setItem(PREVENTION_PLANS_KEY, plans);
  }

  // 完成预防计划
  completePlan(planId: string): void {
    const plans = this.getAllPlans();
    const planIndex = plans.findIndex(p => p.id === planId);

    if (planIndex >= 0) {
      plans[planIndex] = {
        ...plans[planIndex],
        completed: true,
        progress: 100,
        completedAt: new Date().toISOString()
      };
      this.setItem(PREVENTION_PLANS_KEY, plans);
    }
  }

  // 删除预防计划
  deletePlan(planId: string): void {
    const plans = this.getAllPlans().filter(plan => plan.id !== planId);
    this.setItem(PREVENTION_PLANS_KEY, plans);
  }
}

// 家庭成员存储管理
export class FamilyStorage extends EnhancedStorage {
  // 获取所有家庭成员
  getAllMembers(): FamilyMember[] {
    return this.getItem(FAMILY_MEMBERS_KEY, []);
  }

  // 添加家庭成员
  addMember(member: FamilyMember): void {
    const members = this.getAllMembers();
    members.push(member);
    this.setItem(FAMILY_MEMBERS_KEY, members);
  }

  // 更新家庭成员
  updateMember(memberId: string, updates: Partial<FamilyMember>): void {
    const members = this.getAllMembers();
    const memberIndex = members.findIndex(m => m.id === memberId);

    if (memberIndex >= 0) {
      members[memberIndex] = {
        ...members[memberIndex],
        ...updates,
        lastActive: new Date().toISOString()
      };
      this.setItem(FAMILY_MEMBERS_KEY, members);
    }
  }

  // 删除家庭成员
  removeMember(memberId: string): void {
    const members = this.getAllMembers().filter(member => member.id !== memberId);
    this.setItem(FAMILY_MEMBERS_KEY, members);
  }

  // 获取患者角色成员
  getPatientMember(): FamilyMember | null {
    const members = this.getAllMembers();
    return members.find(member => member.role === 'patient') || null;
  }
}

// 评估会话存储管理
export class AssessmentStorage extends EnhancedStorage {
  // 获取所有评估会话
  getAllSessions(): AssessmentSession[] {
    return this.getItem(ASSESSMENT_SESSIONS_KEY, []);
  }

  // 获取进行中的会话
  getActiveSession(): AssessmentSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(session => !session.isCompleted) || null;
  }

  // 保存评估会话
  saveSession(session: AssessmentSession): void {
    const sessions = this.getAllSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }

    this.setItem(ASSESSMENT_SESSIONS_KEY, sessions);
  }

  // 完成评估会话
  completeSession(sessionId: string, result: AssessmentResult): void {
    const sessions = this.getAllSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);

    if (sessionIndex >= 0) {
      sessions[sessionIndex] = {
        ...sessions[sessionIndex],
        isCompleted: true,
        endTime: new Date().toISOString(),
        result
      };
      this.setItem(ASSESSMENT_SESSIONS_KEY, sessions);
    }
  }

  // 删除评估会话
  deleteSession(sessionId: string): void {
    const sessions = this.getAllSessions().filter(session => session.id !== sessionId);
    this.setItem(ASSESSMENT_SESSIONS_KEY, sessions);
  }
}

// 创建存储实例
export const healthDiaryStorage = new HealthDiaryStorage();
export const riskVisualizationStorage = new RiskVisualizationStorage();
export const preventionPlanStorage = new PreventionPlanStorage();
export const familyStorage = new FamilyStorage();
export const assessmentStorage = new AssessmentStorage();

// 导出便捷访问对象
export const enhancedStorage = {
  healthDiary: healthDiaryStorage,
  riskVisualization: riskVisualizationStorage,
  preventionPlans: preventionPlanStorage,
  family: familyStorage,
  assessment: assessmentStorage,
  clearAll: () => {
    healthDiaryStorage.clearAll();
  }
};
