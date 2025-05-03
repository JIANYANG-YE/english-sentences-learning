import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库
// 与notes/route.ts中的数据存储相同
// 实际应用中应该使用真实数据库
const notesStore: Record<string, Record<string, any[]>> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';
    
    // 如果没有该用户或课程的笔记，返回空统计
    if (!notesStore[userId] || !notesStore[userId][id]) {
      return NextResponse.json({
        total: 0,
        byType: {},
        byParagraph: {}
      });
    }
    
    const notes = notesStore[userId][id];
    
    // 按类型统计
    const countByType: Record<string, number> = {};
    // 按段落统计
    const countByParagraph: Record<number, number> = {};
    
    notes.forEach(note => {
      // 统计类型
      if (!countByType[note.type]) {
        countByType[note.type] = 0;
      }
      countByType[note.type]++;
      
      // 统计段落
      if (!countByParagraph[note.paragraphIndex]) {
        countByParagraph[note.paragraphIndex] = 0;
      }
      countByParagraph[note.paragraphIndex]++;
    });
    
    // 按类型统计，并添加中文名称
    const typeStats = Object.entries(countByType).map(([type, count]) => ({
      type,
      name: getTypeName(type),
      emoji: getTypeEmoji(type),
      count
    }));
    
    // 按段落统计
    const paragraphStats = Object.entries(countByParagraph).map(([paragraphIndex, count]) => ({
      paragraphIndex: parseInt(paragraphIndex),
      count
    }));
    
    return NextResponse.json({
      total: notes.length,
      byType: typeStats,
      byParagraph: paragraphStats
    });
  } catch (error) {
    console.error('Failed to get note statistics:', error);
    return NextResponse.json(
      { error: 'Failed to get note statistics' },
      { status: 500 }
    );
  }
}

// 获取笔记类型对应的emoji
function getTypeEmoji(type: string) {
  switch (type) {
    case 'important':
      return '⭐';
    case 'difficult':
      return '🔴';
    case 'insight':
      return '💡';
    case 'question':
      return '❓';
    case 'vocabulary':
      return '📚';
    default:
      return '📝';
  }
}

// 获取笔记类型的中文名称
function getTypeName(type: string) {
  switch (type) {
    case 'important':
      return '重要';
    case 'difficult':
      return '难点';
    case 'insight':
      return '感悟';
    case 'question':
      return '疑问';
    case 'vocabulary':
      return '词汇';
    default:
      return '笔记';
  }
} 