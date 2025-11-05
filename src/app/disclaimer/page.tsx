import { AlertTriangle, Shield, FileText, Users, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* 页头 */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-red-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/50 shadow-sm mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                法律声明与免责条款
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              使用前必读
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              请仔细阅读以下声明，使用本平台即表示您已知晓并同意这些条款
            </p>
          </div>
        </div>
      </section>

      {/* 核心声明 */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 最重要的警告 */}
          <Card className="border-4 border-red-500 bg-red-50">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-12 w-12 text-red-600 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-red-900 mb-4">⚠️ 核心声明</h2>
                  <div className="space-y-3 text-red-800">
                    <p className="text-lg font-semibold">
                      本平台不提供医疗诊断服务，不能替代专业医疗机构和医师的诊疗。
                    </p>
                    <p>
                      所有通过本平台获得的信息和建议仅供参考，<strong>最终的医疗决策必须由具备资质的医师做出</strong>。
                    </p>
                    <p>
                      如有任何健康问题或疑虑，请立即咨询您的主治医生或前往正规医疗机构就诊。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 平台定位 */}
          <Card className="border-2 border-blue-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">平台性质与定位</h2>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">1. 健康教育平台</h3>
                      <p>
                        本平台是一个健康教育与信息服务平台，旨在帮助患者和家属：
                      </p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>了解术后谵妄的相关知识</li>
                        <li>识别可能的风险因素</li>
                        <li>理解预防措施的重要性</li>
                        <li>更好地与医生沟通</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">2. 我们不提供的服务</h3>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-red-700 font-medium">
                        <li>❌ 医疗诊断</li>
                        <li>❌ 治疗方案制定</li>
                        <li>❌ 药品推荐或处方</li>
                        <li>❌ 替代医生的专业判断</li>
                        <li>❌ 紧急医疗救助</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">3. 我们提供的服务</h3>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-green-700 font-medium">
                        <li>✓ 科普教育内容</li>
                        <li>✓ 风险因素自查工具</li>
                        <li>✓ 文献资料查询</li>
                        <li>✓ 健康记录工具</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 内容来源与准确性 */}
          <Card className="border-2 border-purple-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <FileText className="h-8 w-8 text-purple-600 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">内容来源与准确性</h2>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">内容来源</h3>
                      <p>
                        本平台所有内容基于以下来源：
                      </p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>公开发表的医学文献和临床指南</li>
                        <li>国际权威医学机构的建议（NICE、ERAS® Society等）</li>
                        <li>DSM-5等诊断标准</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                      <h3 className="font-semibold text-yellow-900 mb-2">⚠️ 重要说明</h3>
                      <p className="text-yellow-800">
                        虽然我们引用的文献是经过同行评审的权威资料，但<strong>本平台本身的工具和算法未经临床验证</strong>。
                        我们不保证内容的完全准确性、及时性或适用性。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 责任限制 */}
          <Card className="border-2 border-gray-300">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Scale className="h-8 w-8 text-gray-600 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">责任限制</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      <strong>使用本平台所产生的任何决策和后果，责任由用户自行承担。</strong>
                    </p>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">平台运营方不对以下情况负责：</h3>
                      <ul className="list-decimal list-inside ml-4 space-y-2">
                        <li>因使用或无法使用本平台导致的任何直接或间接损失</li>
                        <li>用户基于平台信息做出的任何医疗决策</li>
                        <li>因网络故障、数据丢失等技术原因导致的服务中断</li>
                        <li>第三方链接网站的内容准确性</li>
                        <li>用户之间的任何纠纷</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-300">
                      <p className="text-red-800 font-medium">
                        <strong>紧急情况处理：</strong>
                        如遇紧急医疗情况，请立即拨打120急救电话或前往最近的医院急诊科，
                        不要依赖本平台的任何信息。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 用户须知 */}
          <Card className="border-2 border-green-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Users className="h-8 w-8 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">用户使用须知</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>使用本平台，您确认并同意：</p>
                    <ol className="list-decimal list-inside ml-4 space-y-2">
                      <li>您已年满18周岁，或在监护人同意下使用</li>
                      <li>您理解本平台不提供医疗诊断服务</li>
                      <li>您不会将平台信息作为医疗决策的唯一依据</li>
                      <li>您会在使用平台信息前咨询专业医生</li>
                      <li>您自行承担使用本平台的所有风险</li>
                      <li>您不会用于任何非法或不当用途</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 法律适用 */}
          <Card className="bg-gray-50 border-2 border-gray-300">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">法律适用与争议解决</h2>
              <div className="space-y-3 text-gray-700 text-sm">
                <p>
                  本声明适用中华人民共和国法律。如发生争议，双方应友好协商解决；
                  协商不成的，提交平台注册地有管辖权的人民法院诉讼解决。
                </p>
                <p>
                  本平台保留随时修改本声明的权利，修改后的声明将在平台上公布。
                  继续使用本平台即表示您接受修改后的声明。
                </p>
                <p className="font-medium">
                  最后更新时间：2025年1月
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 联系方式 */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">如有疑问</h3>
            <p className="text-gray-700 mb-6">
              如您对本声明有任何疑问，或需要进一步说明，欢迎联系我们
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                联系我们
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


























