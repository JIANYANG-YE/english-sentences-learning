const fs = require('fs');
const path = require('path');

// 确保输出目录存在
const outputDir = path.join(__dirname, '../public/screenshots');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 创建测试屏幕截图的空白图片
function createBasicScreenshot(filename, title) {
  const width = 1280;
  const height = 720;
  
  // 创建一个简单的SVG图片
  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f5f5f5"/>
    
    <!-- 顶部导航条 -->
    <rect width="100%" height="64" fill="#ffffff"/>
    <text x="24" y="40" font-family="Arial" font-size="24" font-weight="bold" fill="#4338CA">英语学习平台</text>
    
    <!-- 内容区域 -->
    <rect x="24" y="88" width="${width - 48}" height="${height - 112}" fill="#ffffff"/>
    
    <!-- 标题 -->
    <text x="48" y="144" font-family="Arial" font-size="32" font-weight="bold" fill="#000000">${title}</text>
    
    <!-- 水印 -->
    <text x="${width/2}" y="${height - 20}" font-family="Arial" font-size="14" fill="#666666" text-anchor="middle">仅用于PWA应用示例</text>
  </svg>
  `;
  
  // 将SVG保存为文件
  fs.writeFileSync(path.join(outputDir, filename), svg);
  console.log(`✅ 已生成截图: ${filename}`);
}

// 生成所需的截图
function generateScreenshots() {
  console.log('开始生成应用截图...');
  
  // 创建首页截图
  createBasicScreenshot('homepage.svg', '提升你的英语水平');
  
  // 创建课程页面截图
  createBasicScreenshot('course.svg', '初级英语课程');
  
  console.log('截图生成完成！');
}

generateScreenshots(); 