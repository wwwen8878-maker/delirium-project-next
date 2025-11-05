'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Info, ExternalLink, BookOpen, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScaleInfoProps {
  scale: 'MMSE' | 'MoCA';
}

export function ScaleInfoDialog({ scale }: ScaleInfoProps) {
  const scaleData = {
    MMSE: {
      fullName: "简易精神状态检查",
      englishName: "Mini-Mental State Examination",
      scoreRange: "0-30分",
      cutoff: "< 27分提示认知障碍",
      description: "MMSE是全球应用最广泛的认知功能筛查工具，由Folstein等人于1975年开发。该量表通过定向力、记忆力、注意力、计算力、语言和视空间能力等多维度评估，为临床快速识别认知障碍提供标准化依据。",
      clinicalUse: [
        "术前认知基线评估的金标准工具",
        "适用于65岁及以上老年患者",
        "评估时间约5-10分钟",
        "已在全球范围内得到广泛验证"
      ],
      validation: {
        sensitivity: "85-90%",
        specificity: "80-85%",
        reliability: "重测信度 > 0.89"
      },
      references: [
        {
          title: "Folstein MF, et al. (1975). Mini-mental state: A practical method for grading cognitive state.",
          journal: "Journal of Psychiatric Research, 12(3), 189-198",
          doi: "10.1016/0022-3956(75)90026-6",
          url: "https://doi.org/10.1016/0022-3956(75)90026-6"
        },
        {
          title: "Tombaugh TN, McIntyre NJ (1992). The mini-mental state examination: a comprehensive review.",
          journal: "Journal of the American Geriatrics Society, 40(9), 922-935",
          doi: "10.1111/j.1532-5415.1992.tb01992.x",
          url: "https://doi.org/10.1111/j.1532-5415.1992.tb01992.x"
        }
      ],
      guidelines: [
        {
          name: "中国痴呆与认知障碍诊治指南",
          year: "2024",
          recommendation: "A级推荐"
        },
        {
          name: "American Academy of Neurology",
          year: "2018",
          recommendation: "一线筛查工具"
        }
      ]
    },
    MoCA: {
      fullName: "蒙特利尔认知评估",
      englishName: "Montreal Cognitive Assessment",
      scoreRange: "0-30分",
      cutoff: "< 26分提示认知障碍",
      description: "MoCA由Nasreddine等人于2005年开发，专门用于检测轻度认知障碍(MCI)。相比MMSE，MoCA增加了对执行功能、抽象思维和延迟记忆的评估，对轻度认知损害具有更高的灵敏度，特别适合术前精细认知评估。",
      clinicalUse: [
        "对轻度认知障碍(MCI)具有更高灵敏度",
        "包含执行功能和抽象思维评估",
        "推荐作为MMSE的补充工具",
        "适用于教育程度较高的人群"
      ],
      validation: {
        sensitivity: "90-100%（针对MCI）",
        specificity: "87%",
        reliability: "重测信度 0.92"
      },
      references: [
        {
          title: "Nasreddine ZS, et al. (2005). The Montreal Cognitive Assessment, MoCA: A Brief Screening Tool For Mild Cognitive Impairment.",
          journal: "Journal of the American Geriatrics Society, 53(4), 695-699",
          doi: "10.1111/j.1532-5415.2005.53221.x",
          url: "https://doi.org/10.1111/j.1532-5415.2005.53221.x"
        },
        {
          title: "Ciesielska N, et al. (2016). Is the Montreal Cognitive Assessment (MoCA) test better suited than the Mini-Mental State Examination (MMSE) in mild cognitive impairment (MCI) detection among people aged over 60?",
          journal: "Meta-analysis. Psychiatria Polska, 50(5), 1039-1052",
          doi: "10.12740/PP/45368",
          url: "https://doi.org/10.12740/PP/45368"
        }
      ],
      guidelines: [
        {
          name: "国际阿尔茨海默病协会",
          year: "2023",
          recommendation: "MCI筛查首选"
        },
        {
          name: "中国老年认知障碍防治指南",
          year: "2023",
          recommendation: "A级推荐"
        }
      ]
    }
  };

  const data = scaleData[scale];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full hover:bg-blue-100"
          aria-label={`查看${scale}量表详细信息`}
        >
          <Info className="h-4 w-4 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{scale} 量表详情</DialogTitle>
              <DialogDescription className="text-base">
                {data.englishName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              量表基本信息
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">中文名称：</span>
                <span className="font-medium text-gray-900">{data.fullName}</span>
              </div>
              <div>
                <span className="text-gray-600">评分范围：</span>
                <Badge variant="outline" className="ml-2">{data.scoreRange}</Badge>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">临床阈值：</span>
                <Badge className="ml-2 bg-orange-500">{data.cutoff}</Badge>
              </div>
            </div>
          </div>

          {/* 量表描述 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">量表简介</h3>
            <p className="text-gray-700 leading-relaxed">{data.description}</p>
          </div>

          {/* 临床应用 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              临床应用特点
            </h3>
            <ul className="space-y-2">
              {data.clinicalUse.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 信效度指标 */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">信效度指标</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-gray-600 mb-1">灵敏度</div>
                <div className="font-semibold text-green-700">{data.validation.sensitivity}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">特异度</div>
                <div className="font-semibold text-green-700">{data.validation.specificity}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">信度</div>
                <div className="font-semibold text-green-700">{data.validation.reliability}</div>
              </div>
            </div>
          </div>

          {/* 指南推荐 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">临床指南推荐</h3>
            <div className="space-y-2">
              {data.guidelines.map((guideline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div>
                    <div className="font-medium text-gray-900">{guideline.name}</div>
                    <div className="text-sm text-gray-600">{guideline.year}年</div>
                  </div>
                  <Badge className="bg-blue-600">{guideline.recommendation}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* 参考文献 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              核心参考文献
            </h3>
            <div className="space-y-3">
              {data.references.map((ref, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="font-medium text-gray-900 mb-1">{ref.title}</div>
                  <div className="text-sm text-gray-600 mb-2">{ref.journal}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">DOI: {ref.doi}</Badge>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 hover:underline"
                    >
                      查看原文
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 免责声明 */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ 专业提示：</strong> {scale}量表应由经过培训的医护人员进行施测和解读。
              本系统仅提供风险评估参考，不能替代专业医疗诊断。如有疑问，请咨询专业医生。
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


