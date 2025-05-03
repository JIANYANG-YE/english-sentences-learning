import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SentenceAlignmentOptions } from '@/types/courses/packageTypes';

// 请求body验证
const bodySchema = z.object({
  englishText: z.string(),
  chineseText: z.string(),
  options: z.object({
    method: z.enum(['length-based', 'semantic', 'neural', 'hybrid']).default('hybrid'),
    minConfidence: z.number().min(0).max(1).optional().default(0.7),
    manualVerification: z.boolean().optional().default(false),
    fallbackStrategy: z.enum(['skip', 'machine-translation', 'placeholder']).optional().default('skip'),
  }).optional().default({}),
});

/**
 * POST /api/courses/align
 * 对齐中英文句子
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 验证请求体
    const validationResult = bodySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: '无效的请求参数', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { englishText, chineseText, options } = validationResult.data;
    
    // 在实际应用中，这里会使用更复杂的算法进行句子对齐
    // 目前使用简单的拆分和长度匹配
    const alignedPairs = simpleAlignSentences(englishText, chineseText, options);
    
    return NextResponse.json({
      sentencePairs: alignedPairs,
      total: alignedPairs.length,
      method: options.method,
    });
  } catch (error) {
    console.error('句子对齐失败:', error);
    return NextResponse.json(
      { error: '句子对齐失败', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * 简单的句子对齐算法
 * 根据句子长度和位置进行匹配
 */
function simpleAlignSentences(
  englishText: string,
  chineseText: string,
  options: SentenceAlignmentOptions
): { english: string; chinese: string; confidence?: number }[] {
  // 分割句子
  const englishSentences = englishText
    .split(/[.!?]+\s*/)
    .filter(s => s.trim().length > 0);
    
  const chineseSentences = chineseText
    .split(/[。！？]+\s*/)
    .filter(s => s.trim().length > 0);
  
  const pairs: { english: string; chinese: string; confidence?: number }[] = [];
  
  // 句子数量差异过大时可能需要调整
  const englishLength = englishSentences.length;
  const chineseLength = chineseSentences.length;
  
  // 最简单的情况：一对一匹配
  if (englishLength === chineseLength) {
    for (let i = 0; i < englishLength; i++) {
      pairs.push({
        english: englishSentences[i],
        chinese: chineseSentences[i],
        confidence: 0.9 // 一对一匹配时信心较高
      });
    }
    return pairs;
  }
  
  // 数量不同时，使用基于长度的简单对齐
  // 在实际应用中，这里需要更复杂的算法，可能基于自然语言处理或机器学习
  
  // 先找出可能的一对一匹配
  const minLength = Math.min(englishLength, chineseLength);
  let enIndex = 0;
  let cnIndex = 0;
  
  while (enIndex < minLength && cnIndex < minLength) {
    const enSentence = englishSentences[enIndex];
    const cnSentence = chineseSentences[cnIndex];
    
    // 简单启发式：长度比例应在一定范围内
    const enLen = enSentence.length;
    const cnLen = cnSentence.length;
    const ratio = enLen / cnLen;
    
    if (ratio >= 0.5 && ratio <= 2.5) {
      // 认为是匹配的
      pairs.push({
        english: enSentence,
        chinese: cnSentence,
        confidence: 0.7 + (1 - Math.abs(1 - ratio) / 2) * 0.2 // 根据长度比例调整信心值
      });
      enIndex++;
      cnIndex++;
    } else if (ratio < 0.5) {
      // 中文句子相对较长，可能需要合并英文句子
      if (enIndex + 1 < englishLength) {
        const nextEnSentence = englishSentences[enIndex + 1];
        const combinedEn = enSentence + " " + nextEnSentence;
        const newRatio = combinedEn.length / cnLen;
        
        if (newRatio >= 0.5 && newRatio <= 2.5) {
          pairs.push({
            english: combinedEn,
            chinese: cnSentence,
            confidence: 0.6 // 合并后的信心值较低
          });
          enIndex += 2;
          cnIndex++;
          continue;
        }
      }
      
      // 无法良好匹配，使用单独的
      pairs.push({
        english: enSentence,
        chinese: cnSentence,
        confidence: 0.5 // 低信心值
      });
      enIndex++;
      cnIndex++;
    } else {
      // 英文句子相对较长，可能需要合并中文句子
      if (cnIndex + 1 < chineseLength) {
        const nextCnSentence = chineseSentences[cnIndex + 1];
        const combinedCn = cnSentence + nextCnSentence;
        const newRatio = enLen / combinedCn.length;
        
        if (newRatio >= 0.5 && newRatio <= 2.5) {
          pairs.push({
            english: enSentence,
            chinese: combinedCn,
            confidence: 0.6 // 合并后的信心值较低
          });
          enIndex++;
          cnIndex += 2;
          continue;
        }
      }
      
      // 无法良好匹配，使用单独的
      pairs.push({
        english: enSentence,
        chinese: cnSentence,
        confidence: 0.5 // 低信心值
      });
      enIndex++;
      cnIndex++;
    }
  }
  
  // 处理剩余的句子
  while (enIndex < englishLength) {
    if (options.fallbackStrategy === 'skip') {
      break;
    } else if (options.fallbackStrategy === 'placeholder') {
      pairs.push({
        english: englishSentences[enIndex],
        chinese: '[需要翻译]',
        confidence: 0.1
      });
    } else if (options.fallbackStrategy === 'machine-translation') {
      // 在实际应用中，这里会调用机器翻译API
      pairs.push({
        english: englishSentences[enIndex],
        chinese: `[自动翻译] ${englishSentences[enIndex].substring(0, 10)}...`,
        confidence: 0.4
      });
    }
    enIndex++;
  }
  
  while (cnIndex < chineseLength) {
    if (options.fallbackStrategy === 'skip') {
      break;
    } else if (options.fallbackStrategy === 'placeholder') {
      pairs.push({
        english: '[needs translation]',
        chinese: chineseSentences[cnIndex],
        confidence: 0.1
      });
    } else if (options.fallbackStrategy === 'machine-translation') {
      // 在实际应用中，这里会调用机器翻译API
      pairs.push({
        english: `[auto-translated] ${chineseSentences[cnIndex].substring(0, 10)}...`,
        chinese: chineseSentences[cnIndex],
        confidence: 0.4
      });
    }
    cnIndex++;
  }
  
  // 过滤低信心值的配对
  return pairs.filter(pair => (pair.confidence || 0) >= (options.minConfidence || 0.7));
} 