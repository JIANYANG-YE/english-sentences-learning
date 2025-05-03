const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 图标尺寸定义，根据manifest.json中的要求
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = path.join(__dirname, '../public/icons/icon-base.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  console.log('开始生成PWA图标...');
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 为每个尺寸生成标准图标
  for (const size of sizes) {
    try {
      await sharp(sourceIcon)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      
      console.log(`✅ 已生成 ${size}x${size} 图标`);
    } catch (error) {
      console.error(`❌ 生成 ${size}x${size} 图标失败:`, error);
    }
  }
  
  // 生成可遮罩图标 (为svg添加背景并留出安全区域)
  try {
    // 创建一个512x512的PNG，添加填充以符合maskable icon要求
    // 可遮罩图标的安全区域应该是中心的80%
    const maskableSize = 512;
    const safeAreaPadding = Math.floor(maskableSize * 0.1); // 10% 边距
    
    // 创建圆形背景
    const circleBackground = Buffer.from(`
    <svg width="${maskableSize}" height="${maskableSize}" viewBox="0 0 ${maskableSize} ${maskableSize}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${maskableSize/2}" cy="${maskableSize/2}" r="${maskableSize/2}" fill="#4338CA"/>
    </svg>`);
    
    // 先创建背景
    await sharp(circleBackground)
      .toFile(path.join(outputDir, 'temp-bg.png'));
    
    // 调整原始图标大小以适应安全区域
    const iconSize = maskableSize - (safeAreaPadding * 2);
    await sharp(sourceIcon)
      .resize(iconSize, iconSize)
      .toFile(path.join(outputDir, 'temp-icon.png'));
    
    // 合并背景和图标
    await sharp(path.join(outputDir, 'temp-bg.png'))
      .composite([{
        input: path.join(outputDir, 'temp-icon.png'),
        left: safeAreaPadding,
        top: safeAreaPadding
      }])
      .toFile(path.join(outputDir, `maskable-icon-${maskableSize}x${maskableSize}.png`));
    
    // 清理临时文件
    fs.unlinkSync(path.join(outputDir, 'temp-bg.png'));
    fs.unlinkSync(path.join(outputDir, 'temp-icon.png'));
    
    console.log(`✅ 已生成可遮罩图标 ${maskableSize}x${maskableSize}`);
  } catch (error) {
    console.error('❌ 生成可遮罩图标失败:', error);
  }

  // 生成快捷方式图标
  try {
    // 课程图标
    await generateShortcutIcon('courses-icon', '#2563EB');
    
    // 学习图标
    await generateShortcutIcon('learn-icon', '#059669');
    
    console.log('✅ 已生成快捷方式图标');
  } catch (error) {
    console.error('❌ 生成快捷方式图标失败:', error);
  }
  
  console.log('图标生成完成！');
}

// 生成带有不同背景色的快捷方式图标
async function generateShortcutIcon(name, bgColor) {
  const shortcutSize = 192;
  
  // 创建自定义背景的SVG
  const background = Buffer.from(`
  <svg width="${shortcutSize}" height="${shortcutSize}" viewBox="0 0 ${shortcutSize} ${shortcutSize}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${shortcutSize}" height="${shortcutSize}" rx="${shortcutSize/8}" fill="${bgColor}"/>
  </svg>`);
  
  // 先创建背景
  await sharp(background)
    .toFile(path.join(outputDir, 'temp-shortcut-bg.png'));
  
  // 调整原始图标大小以适应安全区域
  const iconSize = Math.floor(shortcutSize * 0.7); // 图标占据70%空间
  const padding = Math.floor((shortcutSize - iconSize) / 2);
  
  await sharp(sourceIcon)
    .resize(iconSize, iconSize)
    .toFile(path.join(outputDir, 'temp-shortcut-icon.png'));
  
  // 合并背景和图标
  await sharp(path.join(outputDir, 'temp-shortcut-bg.png'))
    .composite([{
      input: path.join(outputDir, 'temp-shortcut-icon.png'),
      left: padding,
      top: padding
    }])
    .toFile(path.join(outputDir, `${name}-${shortcutSize}x${shortcutSize}.png`));
  
  // 清理临时文件
  fs.unlinkSync(path.join(outputDir, 'temp-shortcut-bg.png'));
  fs.unlinkSync(path.join(outputDir, 'temp-shortcut-icon.png'));
}

generateIcons().catch(console.error); 