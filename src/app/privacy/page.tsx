import { Shield, Lock, Database, Eye, FileCheck, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* 页头 */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/50 shadow-sm mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                隐私与数据安全
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              数据隐私与安全政策
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              我们高度重视您的隐私和数据安全，承诺保护您的个人健康信息
            </p>
          </div>
        </div>
      </section>

      {/* 核心原则 */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 数据存储方式 */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500 rounded-xl flex-shrink-0">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">数据存储方式</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        本地存储优先
                      </h3>
                      <p className="text-blue-800">
                        您在本平台填写的所有评估数据、健康日记等信息<strong>仅保存在您的浏览器本地存储（LocalStorage/IndexedDB）中</strong>，
                        不会自动上传至服务器或云端。这意味着：
                      </p>
                      <ul className="mt-2 space-y-1 ml-4 text-sm">
                        <li>• 数据完全由您自己掌控</li>
                        <li>• 不会被第三方访问或分析</li>
                        <li>• 清除浏览器缓存将永久删除数据</li>
                        <li>• 更换设备或浏览器无法同步数据</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        重要提示
                      </h3>
                      <p className="text-yellow-800 text-sm">
                        由于数据仅存储在本地，请注意以下事项：
                      </p>
                      <ul className="mt-2 space-y-1 ml-4 text-sm text-yellow-800">
                        <li>• 请勿在公共设备上使用本平台</li>
                        <li>• 定期导出或打印重要评估报告</li>
                        <li>• 清除浏览器数据前请备份重要信息</li>
                        <li>• 使用隐私/无痕模式将无法保存数据</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 数据收集范围 */}
          <Card className="border-2 border-green-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500 rounded-xl flex-shrink-0">
                  <FileCheck className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">数据收集范围</h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">我们收集的信息：</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span><strong>基本信息：</strong>年龄、性别、教育程度（用于风险评估）</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span><strong>健康数据：</strong>认知评分、手术信息、既往史、用药情况</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span><strong>日记记录：</strong>健康日记、症状记录、情绪状态</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold text-gray-800 mb-2">我们不收集的信息：</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">✗</span>
                          <span>真实姓名、身份证号、手机号码</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">✗</span>
                          <span>医院病历号、就诊记录</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">✗</span>
                          <span>支付信息、银行账户</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">✗</span>
                          <span>地理位置、设备唯一标识符</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 数据使用目的 */}
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500 rounded-xl flex-shrink-0">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">数据使用目的</h2>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span><strong>风险评估：</strong>基于您提供的信息计算术后谵妄风险分数</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span><strong>个性化建议：</strong>生成针对性的预防措施和健康管理方案</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span><strong>趋势分析：</strong>帮助您追踪健康状态的变化趋势</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span><strong>报告生成：</strong>为您提供可打印的评估报告，便于与医生沟通</span>
                    </li>
                  </ul>
                  
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-purple-800 text-sm">
                      <strong>郑重承诺：</strong>我们绝不会将您的数据用于商业营销、出售给第三方，
                      或用于任何超出上述目的的用途。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 数据安全措施 */}
          <Card className="border-2 border-indigo-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500 rounded-xl flex-shrink-0">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">数据安全措施</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <h3 className="font-semibold text-indigo-900 mb-2">技术保护</h3>
                      <ul className="space-y-1 text-sm text-indigo-800">
                        <li>• HTTPS加密传输（如涉及）</li>
                        <li>• 浏览器本地加密存储</li>
                        <li>• 无服务器数据泄露风险</li>
                        <li>• 定期安全审计</li>
                      </ul>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <h3 className="font-semibold text-indigo-900 mb-2">访问控制</h3>
                      <ul className="space-y-1 text-sm text-indigo-800">
                        <li>• 仅设备本地可访问</li>
                        <li>• 无第三方代码注入</li>
                        <li>• 无追踪脚本或Cookie</li>
                        <li>• 开源代码可审查</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 用户权利 */}
          <Card className="border-2 border-pink-200 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">您的权利</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-pink-600">1.</span>
                  <div>
                    <strong>查看权：</strong>您可以随时在浏览器中查看所有本地存储的数据
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-pink-600">2.</span>
                  <div>
                    <strong>删除权：</strong>通过清除浏览器数据即可永久删除所有信息
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-pink-600">3.</span>
                  <div>
                    <strong>导出权：</strong>可以打印或导出评估报告作为个人备份
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-pink-600">4.</span>
                  <div>
                    <strong>拒绝权：</strong>您可以选择不使用本平台，不会影响您在医院的正常就诊
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 法律合规 */}
          <Card className="bg-gray-50 border-2 border-gray-300">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">法律合规</h2>
              <div className="space-y-3 text-gray-700 text-sm">
                <p>
                  本平台遵守《中华人民共和国个人信息保护法》、《中华人民共和国数据安全法》、
                  《网络安全法》等相关法律法规，以及《卫生健康行业个人信息保护管理办法》等行业规范。
                </p>
                <p>
                  本平台为<strong>辅助评估工具</strong>，不提供医疗诊断服务，
                  不属于互联网医疗平台。所有评估结果仅供参考，最终诊疗决策请咨询专业医生。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 联系方式 */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">隐私问题咨询</h2>
              <p className="text-gray-700 mb-4">
                如您对本隐私政策有任何疑问或建议，欢迎通过以下方式联系我们：
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/contact" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  联系我们
                </a>
                <a href="/guide" className="px-6 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  使用指南
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 更新日期 */}
          <div className="text-center text-sm text-gray-500 py-4">
            <p>本政策最后更新日期：2025年1月</p>
            <p className="mt-1">我们保留根据法律要求或服务变更更新本政策的权利</p>
          </div>
        </div>
      </section>
    </main>
  );
}


