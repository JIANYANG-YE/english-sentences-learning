'use client';

import { useState } from 'react';
import SentenceSyntaxTree from './SentenceSyntaxTree';

interface GrammarPoint {
  title: string;
  explanation: string;
  examples?: string[];
}

interface SyntaxTreeNode {
  id: string;
  text: string;
  type: string;
  children?: SyntaxTreeNode[];
}

interface GrammarAnalysisCardProps {
  sentence: string;
  translation: string;
  grammarPoints: GrammarPoint[];
  syntaxTree?: SyntaxTreeNode;
  className?: string;
}

// 默认语法树数据
const defaultSyntaxTree: SyntaxTreeNode = {
  id: '1',
  text: 'is',
  type: '谓语',
  children: [
    {
      id: '2',
      text: 'English',
      type: '主语',
      children: []
    },
    {
      id: '3',
      text: 'interesting',
      type: '宾语',
      children: [
        {
          id: '4',
          text: 'an',
          type: '冠词',
          children: []
        },
        {
          id: '5',
          text: 'language',
          type: '定语',
          children: []
        }
      ]
    },
    {
      id: '6',
      text: '.',
      type: '标点',
      children: []
    }
  ]
};

export default function GrammarAnalysisCard({
  sentence,
  translation,
  grammarPoints = [],
  syntaxTree = defaultSyntaxTree,
  className = ''
}: GrammarAnalysisCardProps) {
  const [activeTab, setActiveTab] = useState<'structure' | 'points'>('structure');
  const [expandedPoints, setExpandedPoints] = useState<string[]>([]);
  
  // 切换展开/折叠状态
  const togglePointExpand = (title: string) => {
    if (expandedPoints.includes(title)) {
      setExpandedPoints(expandedPoints.filter(item => item !== title));
    } else {
      setExpandedPoints([...expandedPoints, title]);
    }
  };
  
  // 分词处理句子
  const tokenizeSentence = (text: string) => {
    // 简单分词，实际应该使用更复杂的算法
    return text.split(/\s+/).map((word, index) => {
      // 去掉标点符号
      const cleanWord = word.replace(/[.,!?;:"'()]/g, '');
      const punctuation = word.match(/[.,!?;:"'()]/g)?.join('') || '';
      
      return {
        id: `word-${index}`,
        word: cleanWord,
        punctuation,
        original: word
      };
    });
  };
  
  const tokens = tokenizeSentence(sentence);

  return (
    <div className={`bg-gray-900 rounded-lg overflow-hidden shadow-lg ${className}`}>
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg text-white font-medium">语法分析</h3>
        <p className="text-gray-300 mt-1">{sentence}</p>
        <p className="text-gray-500 mt-1 text-sm">{translation}</p>
      </div>
      
      <div className="border-b border-gray-800">
        <div className="flex">
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeTab === 'structure'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('structure')}
          >
            句子结构
          </button>
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeTab === 'points'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('points')}
          >
            语法要点 {grammarPoints.length > 0 && `(${grammarPoints.length})`}
          </button>
        </div>
      </div>
      
      <div className={`${activeTab === 'structure' ? 'block' : 'hidden'}`}>
        <div className="p-4">
          <div className="mb-4">
            <h4 className="text-gray-300 text-sm font-medium mb-2">词性分析</h4>
            <div className="flex flex-wrap gap-2">
              {tokens.map((token, index) => (
                <div key={token.id} className="bg-gray-800 rounded-md px-2 py-1 inline-flex flex-col items-center">
                  <span className="text-white text-sm">{token.word}</span>
                  <span className="text-gray-500 text-xs">
                    {
                      // 根据句法树找到对应的词性
                      (() => {
                        const findType = (node: SyntaxTreeNode): string => {
                          if (node.text.toLowerCase() === token.word.toLowerCase()) {
                            return node.type;
                          }
                          
                          if (node.children) {
                            for (const child of node.children) {
                              const type = findType(child);
                              if (type) return type;
                            }
                          }
                          
                          return '';
                        };
                        
                        return findType(syntaxTree) || '未知';
                      })()
                    }
                  </span>
                  {token.punctuation && (
                    <span className="text-gray-400 text-sm">{token.punctuation}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-gray-300 text-sm font-medium mb-2">句法树</h4>
            <SentenceSyntaxTree 
              sentence={sentence} 
              treeData={syntaxTree} 
              title="句子依存树"
            />
          </div>
        </div>
      </div>
      
      <div className={`${activeTab === 'points' ? 'block' : 'hidden'}`}>
        <div className="p-4">
          {grammarPoints.length > 0 ? (
            <div className="space-y-4">
              {grammarPoints.map((point, index) => (
                <div key={index} className="rounded-md bg-gray-800 overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-700"
                    onClick={() => togglePointExpand(point.title)}
                  >
                    <h4 className="text-gray-200 font-medium">{point.title}</h4>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transform ${
                        expandedPoints.includes(point.title) ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {expandedPoints.includes(point.title) && (
                    <div className="p-3 pt-0 border-t border-gray-700">
                      <p className="text-gray-400 text-sm">{point.explanation}</p>
                      
                      {point.examples && point.examples.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-gray-400 text-xs mb-1">示例：</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {point.examples.map((example, idx) => (
                              <li key={idx} className="text-gray-400 text-sm">{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">暂无语法要点分析</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 