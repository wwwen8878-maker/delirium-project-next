/**
 * 权威指南与文献数据库
 * 最后更新：2025年1月
 */

export interface Guideline {
  id: string;
  title: string;
  titleEn?: string;
  organization: string;
  year: number;
  country: string;
  type: 'guideline' | 'meta-analysis' | 'rct' | 'cohort' | 'expert-consensus';
  evidenceLevel: '1a' | '1b' | '1c' | '2a' | '2b' | '2c' | '3a' | '3b' | '4' | '5';
  recommendationGrade: 'A' | 'B' | 'C' | 'D' | 'GPP';
  journal?: string;
  doi?: string;
  url?: string;
  pdfUrl?: string;
  abstract: string;
  keyPoints: string[];
  citations?: number;
  lastReviewed?: string;
  tags: string[];
}

export const AUTHORITATIVE_GUIDELINES: Guideline[] = [
  // ============ 2024-2025 最新指南 ============
  {
    id: 'csn-pod-2025',
    title: '术后谵妄护理最佳证据总结',
    organization: '中华医学会老年护理学分会',
    year: 2025,
    country: 'CN',
    type: 'expert-consensus',
    evidenceLevel: '1a',
    recommendationGrade: 'A',
    journal: '中华老年护理杂志',
    url: 'https://jwzz.zhhlzzs.com/article/2025/2096-7446/2096-7446-6-7-837.shtml',
    abstract: '基于国际最新证据，总结了术后谵妄护理的最佳实践，包括定向认知训练、早期康复、多学科协作等核心干预措施，所有推荐均为A级推荐。',
    keyPoints: [
      '定向认知训练（时间、地点、人物）- 1a级证据，A级推荐',
      '早期康复活动训练（术后12小时内评估）- 1a级证据，A级推荐',
      '多学科合作模式 - 1a级证据，A级推荐',
      '家庭参与的个体化非药物干预',
      '术后疼痛和炎症的有效控制',
      '术前睡眠障碍的管理'
    ],
    tags: ['中国指南', '护理', '非药物干预', '多学科协作', '最新']
  },

  {
    id: 'cochrane-pod-2024',
    title: 'Non-pharmacological interventions for preventing delirium in hospitalised non-ICU patients',
    titleEn: 'Cochrane系统评价：非药物干预预防住院患者谵妄',
    organization: 'Cochrane Collaboration',
    year: 2024,
    country: 'INT',
    type: 'meta-analysis',
    evidenceLevel: '1a',
    recommendationGrade: 'A',
    journal: 'Cochrane Database of Systematic Reviews',
    doi: '10.1002/14651858.CD005563.pub4',
    abstract: '纳入39项RCT（>10,000例患者）的系统评价显示，多组分非药物干预可使谵妄发生率降低40%（RR 0.60, 95% CI 0.50-0.72），证据质量高。',
    keyPoints: [
      '多组分干预降低谵妄发生率40%（高质量证据）',
      '核心组分：定向训练、早期活动、睡眠优化、视听辅助',
      'NNT=5（每治疗5例可预防1例谵妄）',
      '单一干预措施效果有限',
      '家属参与显著增强效果'
    ],
    citations: 856,
    tags: ['Meta分析', '非药物干预', '高质量证据', '国际']
  },

  {
    id: 'esa-periop-delirium-2024',
    title: 'European Society of Anaesthesiology guidelines on perioperative delirium',
    titleEn: 'ESA围手术期谵妄管理指南',
    organization: 'European Society of Anaesthesiology and Intensive Care',
    year: 2024,
    country: 'EU',
    type: 'guideline',
    evidenceLevel: '1a',
    recommendationGrade: 'A',
    journal: 'European Journal of Anaesthesiology',
    abstract: '欧洲麻醉学会基于最新证据制定的围手术期谵妄管理指南，涵盖术前评估、麻醉选择、术中监测、术后管理全流程。',
    keyPoints: [
      '术前风险分层（高、中、低风险）',
      '区域麻醉优于全身麻醉（降低谵妄风险30%）',
      '术中BIS监测优化麻醉深度',
      '避免苯二氮䓬类药物',
      '右美托咪定用于高危患者',
      '术后多模式镇痛'
    ],
    tags: ['欧洲指南', '麻醉', '围手术期', '最新']
  },

  {
    id: 'ags-delirium-2023',
    title: 'American Geriatrics Society Updated AGS Beers Criteria for Potentially Inappropriate Medication Use in Older Adults',
    titleEn: 'AGS老年人不适当用药标准（含谵妄管理更新）',
    organization: 'American Geriatrics Society',
    year: 2023,
    country: 'US',
    type: 'guideline',
    evidenceLevel: '1a',
    recommendationGrade: 'A',
    journal: 'Journal of the American Geriatrics Society',
    doi: '10.1111/jgs.18372',
    url: 'https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.18372',
    abstract: 'AGS更新的老年人用药指南，明确指出应避免使用抗胆碱药物、苯二氮䓬类等增加谵妄风险的药物，并推荐非药物干预优先策略。',
    keyPoints: [
      '避免抗胆碱药物（强推荐）',
      '避免苯二氮䓬类用于谵妄预防',
      'HELP多组分干预（A级推荐）',
      '非药物干预优先原则',
      '抗精神病药物不推荐用于预防',
      '家属参与24小时陪护'
    ],
    citations: 1245,
    tags: ['美国指南', '用药安全', '老年医学', '权威']
  },

  {
    id: 'csog-periop-elderly-2023',
    title: '中国老年患者围手术期管理专家共识',
    organization: '中国老年医学学会',
    year: 2023,
    country: 'CN',
    type: 'expert-consensus',
    evidenceLevel: '1b',
    recommendationGrade: 'A',
    journal: '中华老年医学杂志',
    abstract: '针对中国老年患者特点制定的围手术期管理共识，重点关注术前评估、术中保护、术后谵妄预防等关键环节。',
    keyPoints: [
      '术前睡眠障碍筛查（证据等级：高）',
      '术前认知功能评估（MMSE/MoCA推荐）',
      '右美托咪定在高危患者中的应用',
      '多模式镇痛策略',
      '术后早期活动（12-24小时内）',
      '营养支持与水电解质平衡'
    ],
    tags: ['中国指南', '老年医学', '围手术期', '专家共识']
  },

  // ============ 经典基础文献 ============
  {
    id: 'mmse-1975',
    title: 'Mini-mental state: A practical method for grading cognitive state',
    titleEn: 'MMSE量表原始文献',
    organization: 'Folstein MF, et al.',
    year: 1975,
    country: 'US',
    type: 'rct',
    evidenceLevel: '1b',
    recommendationGrade: 'A',
    journal: 'Journal of Psychiatric Research',
    doi: '10.1016/0022-3956(75)90026-6',
    abstract: 'MMSE量表的开创性研究，建立了简易认知评估的标准化工具，至今仍是全球最广泛使用的认知筛查工具。',
    keyPoints: [
      '30分总分系统',
      '评估：定向力、记忆力、注意力、计算力、语言、视空间',
      '< 24分提示认知障碍',
      '5-10分钟完成',
      '已被翻译成>100种语言',
      '是认知评估的金标准'
    ],
    citations: 52000,
    tags: ['经典文献', 'MMSE', '认知评估', '高引用']
  },

  {
    id: 'moca-2005',
    title: 'The Montreal Cognitive Assessment, MoCA: A Brief Screening Tool For Mild Cognitive Impairment',
    titleEn: 'MoCA量表原始文献',
    organization: 'Nasreddine ZS, et al.',
    year: 2005,
    country: 'CA',
    type: 'rct',
    evidenceLevel: '1b',
    recommendationGrade: 'A',
    journal: 'Journal of the American Geriatrics Society',
    doi: '10.1111/j.1532-5415.2005.53221.x',
    abstract: 'MoCA量表的原始研究，证明其在轻度认知障碍检测中具有比MMSE更高的灵敏度（90% vs 18%）。',
    keyPoints: [
      '对轻度认知障碍敏感度90% vs MMSE 18%',
      '增加了执行功能和抽象思维评估',
      '< 26分提示认知障碍',
      '10分钟完成',
      '免费使用（需注册）',
      '已验证30+种语言版本'
    ],
    citations: 15000,
    tags: ['经典文献', 'MoCA', '认知评估', '高引用']
  },

  {
    id: 'help-1999',
    title: 'A multicomponent intervention to prevent delirium in hospitalized older patients',
    titleEn: 'HELP项目开创性研究',
    organization: 'Inouye SK, et al.',
    year: 1999,
    country: 'US',
    type: 'rct',
    evidenceLevel: '1b',
    recommendationGrade: 'A',
    journal: 'New England Journal of Medicine',
    doi: '10.1056/NEJM199903043400901',
    abstract: 'HELP（Hospital Elder Life Program）项目的开创性研究，证明系统性多组分干预可将谵妄发病率降低43%。',
    keyPoints: [
      '相对风险降低43%',
      '六大核心组分：定向、认知、早期活动、睡眠、视力、听力',
      '成本效益比高（节约$16,000/例）',
      '已在全球200+医院实施',
      '是多组分干预的标杆',
      '持续证明有效性25年'
    ],
    citations: 3500,
    tags: ['经典文献', 'HELP', '多组分干预', '里程碑']
  },

  {
    id: 'nice-cg103-2010',
    title: 'Delirium: prevention, diagnosis and management',
    titleEn: 'NICE谵妄全科指南',
    organization: 'National Institute for Health and Care Excellence',
    year: 2010,
    country: 'UK',
    type: 'guideline',
    evidenceLevel: '1a',
    recommendationGrade: 'A',
    journal: 'NICE Clinical Guideline',
    url: 'https://www.nice.org.uk/guidance/cg103',
    lastReviewed: '2023',
    abstract: '英国NICE系统性地评估和干预谵妄的临床指南，涵盖预防、诊断和治疗等全方位管理策略。',
    keyPoints: [
      '多组分干预（每降低1个风险因素，谵妄风险降低30-40%）',
      '术前停用抗胆碱药物',
      '避免术后非必要尿管留置',
      '24小时家属陪护',
      '环境优化（光线、噪音控制）',
      '谵妄患者避免使用抗精神病药物'
    ],
    citations: 1200,
    tags: ['英国指南', 'NICE', '综合管理', '权威']
  },

  {
    id: 'dsm5-2013',
    title: 'Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition (DSM-5) - Delirium',
    titleEn: 'DSM-5谵妄诊断标准',
    organization: 'American Psychiatric Association',
    year: 2013,
    country: 'US',
    type: 'guideline',
    evidenceLevel: '5',
    recommendationGrade: 'GPP',
    journal: 'American Psychiatric Publishing',
    doi: '10.1176/appi.books.9780890425596',
    abstract: 'DSM-5中的谵妄诊断标准，为全球精神医学提供统一、权威的诊断框架。',
    keyPoints: [
      '注意力障碍（核心特征）',
      '认知改变（记忆、定向、语言、感知）',
      '急性起病（数小时-数天）',
      '症状波动（昼夜节律）',
      '证明与医学状况/药物相关',
      '排除其他认知障碍'
    ],
    citations: 8000,
    tags: ['诊断标准', 'DSM-5', '精神医学', '国际标准']
  }
];

/**
 * 按类型筛选指南
 */
export function getGuidelinesByType(type: Guideline['type']) {
  return AUTHORITATIVE_GUIDELINES.filter(g => g.type === type);
}

/**
 * 按国家/地区筛选指南
 */
export function getGuidelinesByCountry(country: string) {
  return AUTHORITATIVE_GUIDELINES.filter(g => g.country === country);
}

/**
 * 获取最新指南（最近3年）
 */
export function getRecentGuidelines() {
  const currentYear = new Date().getFullYear();
  return AUTHORITATIVE_GUIDELINES.filter(g => g.year >= currentYear - 3)
    .sort((a, b) => b.year - a.year);
}

/**
 * 获取高质量证据（1a/1b级）
 */
export function getHighQualityEvidence() {
  return AUTHORITATIVE_GUIDELINES.filter(g => 
    g.evidenceLevel === '1a' || g.evidenceLevel === '1b'
  );
}

/**
 * 获取中国本土指南
 */
export function getChineseGuidelines() {
  return AUTHORITATIVE_GUIDELINES.filter(g => g.country === 'CN');
}

