import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 验证笔记数据的Schema
const noteSchema = z.object({
  id: z.string().optional(),
  lessonId: z.string(),
  userId: z.string().optional(),
  timestamp: z.string(),
  highlight: z.string(),
  note: z.string(),
  type: z.string(),
  paragraphIndex: z.number()
});

const notesSchema = z.array(noteSchema);

// 模拟数据库
// 实际应用中，这些数据应该存储在数据库中
// 这里使用内存对象模拟
const notesStore: Record<string, Record<string, any[]>> = {};

// 获取笔记
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';
    
    // 如果没有该用户或课程的笔记，返回空数组
    if (!notesStore[userId] || !notesStore[userId][id]) {
      return NextResponse.json({ notes: [] });
    }
    
    return NextResponse.json({ 
      notes: notesStore[userId][id],
      total: notesStore[userId][id].length
    });
  } catch (error) {
    console.error('Failed to get notes:', error);
    return NextResponse.json(
      { error: 'Failed to get notes' },
      { status: 500 }
    );
  }
}

// 保存笔记
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const userId = request.headers.get('x-user-id') || 'default-user';
    const body = await request.json();
    
    // 验证请求体
    const parseResult = notesSchema.safeParse(body.notes);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid notes data', details: parseResult.error.format() },
        { status: 400 }
      );
    }
    
    // 初始化用户的笔记存储
    if (!notesStore[userId]) {
      notesStore[userId] = {};
    }
    
    // 保存笔记
    notesStore[userId][id] = parseResult.data;
    
    return NextResponse.json({ 
      success: true,
      total: parseResult.data.length
    });
  } catch (error) {
    console.error('Failed to save notes:', error);
    return NextResponse.json(
      { error: 'Failed to save notes' },
      { status: 500 }
    );
  }
}

// 导出笔记为Markdown
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';
    const format = searchParams.get('format') || 'markdown';
    
    // 如果没有该用户或课程的笔记，返回错误
    if (!notesStore[userId] || !notesStore[userId][id]) {
      return NextResponse.json(
        { error: 'No notes found for this lesson' },
        { status: 404 }
      );
    }
    
    let exportedData;
    
    if (format === 'markdown') {
      // 将笔记转换为Markdown格式
      exportedData = convertNotesToMarkdown(notesStore[userId][id]);
    } else if (format === 'json') {
      // 直接返回JSON格式
      exportedData = JSON.stringify(notesStore[userId][id], null, 2);
    } else {
      return NextResponse.json(
        { error: 'Unsupported export format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      data: exportedData,
      format
    });
  } catch (error) {
    console.error('Failed to export notes:', error);
    return NextResponse.json(
      { error: 'Failed to export notes' },
      { status: 500 }
    );
  }
}

// 删除所有笔记
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const userId = request.headers.get('x-user-id') || 'default-user';
    
    // 如果没有该用户或课程的笔记，返回成功
    if (!notesStore[userId] || !notesStore[userId][id]) {
      return NextResponse.json({ success: true });
    }
    
    // 删除该课程的所有笔记
    delete notesStore[userId][id];
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete notes:', error);
    return NextResponse.json(
      { error: 'Failed to delete notes' },
      { status: 500 }
    );
  }
}

// 将笔记转换为Markdown格式
function convertNotesToMarkdown(notes: any[]) {
  // 按段落排序
  const sortedNotes = [...notes].sort((a, b) => a.paragraphIndex - b.paragraphIndex);
  
  let markdown = '# 学习笔记\n\n';
  
  // 按照段落分组
  const notesByParagraph: Record<number, any[]> = {};
  
  sortedNotes.forEach(note => {
    if (!notesByParagraph[note.paragraphIndex]) {
      notesByParagraph[note.paragraphIndex] = [];
    }
    notesByParagraph[note.paragraphIndex].push(note);
  });
  
  // 生成Markdown
  Object.keys(notesByParagraph).forEach(paragraphIndex => {
    markdown += `\n## 段落 ${parseInt(paragraphIndex) + 1}\n\n`;
    
    notesByParagraph[parseInt(paragraphIndex)].forEach(note => {
      const typeEmoji = getTypeEmoji(note.type);
      markdown += `### ${typeEmoji} ${getTypeName(note.type)}\n\n`;
      markdown += `> ${note.highlight}\n\n`;
      markdown += `${note.note}\n\n`;
      markdown += `*记录时间: ${new Date(note.timestamp).toLocaleString()}*\n\n`;
      markdown += `---\n\n`;
    });
  });
  
  return markdown;
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