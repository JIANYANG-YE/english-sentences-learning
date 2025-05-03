export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">关于句子学习法</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          一种高效的语言学习方法，让您更快地掌握英语
        </p>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">什么是按句子学习英语？</h2>
          <p className="mb-4">
            按句子学习英语是一种以完整句子为单位，而不是孤立单词为基础的语言学习方法。这种方法注重语言在实际使用场景中的表达和理解，帮助学习者更全面地掌握英语。
          </p>
          <p>
            传统的英语学习方法往往过分关注单词和语法规则的记忆，而忽视了语言的整体性和实用性。按句子学习则更贴近语言的自然习得过程，让学习更有效果。
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">为什么按句子学习更有效？</h2>
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">科学研究表明：</h3>
            <p>
              人类大脑更容易记住有上下文联系的信息，而不是孤立的数据点。当我们学习完整句子时，单词被放在了有意义的语境中，更容易被记住和理解。
            </p>
          </div>
          
          <ul className="space-y-4 list-disc pl-6">
            <li>
              <strong>语境理解：</strong> 在句子中学习单词，您能更好地理解其实际用法和适用场景。
            </li>
            <li>
              <strong>语法应用：</strong> 句子展示了语法规则的实际应用，让抽象规则变得具体。
            </li>
            <li>
              <strong>自然表达：</strong> 通过学习地道句子，您能掌握更自然的英语表达方式。
            </li>
            <li>
              <strong>提高记忆：</strong> 有意义的句子比单个单词更容易记住，记忆效果更持久。
            </li>
            <li>
              <strong>实用能力：</strong> 直接学习可用于实际交流的句子，立即提升您的沟通能力。
            </li>
          </ul>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">如何有效使用句子学习法？</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">初学者建议</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>每天学习5-10个简单句子</li>
                <li>先理解整体意思，再分析单词用法</li>
                <li>大声朗读句子，提高口语感觉</li>
                <li>尝试用学过的句子模式造新句</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">进阶学习者</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>选择特定主题或场景的句子集中学习</li>
                <li>分析句子结构，关注复杂语法点</li>
                <li>练习替换句子中的关键词，扩展词汇量</li>
                <li>用学过的句型进行写作和口语练习</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-yellow-800">学习小贴士：</h3>
            <p>
              定期复习很重要！建议使用间隔重复技术，比如第1天、第3天、第7天和第14天分别复习同一组句子，以加深记忆。
            </p>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">开始您的句子学习之旅</h2>
          <p className="mb-4">
            我们的平台提供了丰富多样的英语句子，从日常对话到商务英语，从简单句型到复杂表达，满足不同学习者的需求。
          </p>
          <p className="mb-6">
            每个句子都配有中文翻译、难度标记和相关标签，让您能够有针对性地选择适合自己的学习内容。通过&ldquo;学习&rdquo;和&ldquo;练习&rdquo;功能，您可以系统地掌握这些句子，并检验学习成果。
          </p>
          
          <div className="text-center">
            <a 
              href="/study" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              立即开始学习
            </a>
          </div>
        </section>
      </div>
    </div>
  );
} 