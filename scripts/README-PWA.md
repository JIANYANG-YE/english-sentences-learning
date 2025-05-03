# PWA资源生成说明

本项目实现了Progressive Web App(PWA)功能，允许用户将网站安装到设备上，并提供离线访问能力。以下是PWA资源的生成和使用说明。

## 生成的资源

项目中生成了以下PWA相关资源：

1. **应用图标**：
   - 标准图标：`72x72`, `96x96`, `128x128`, `144x144`, `152x152`, `192x192`, `384x384`, `512x512`
   - 可遮罩图标：`maskable-icon-512x512.png`（带有安全区域的图标，适合圆形或其他形状的图标显示）
   - 快捷方式图标：`courses-icon-192x192.png`和`learn-icon-192x192.png`

2. **应用截图**：
   - 首页截图：`homepage.svg`
   - 课程页面截图：`course.svg`

## 资源生成脚本

以下脚本用于生成PWA资源：

1. **图标生成**：
   ```bash
   npm run generate:icons
   ```
   此命令运行`scripts/generate-icons.js`脚本，基于`public/icons/icon-base.svg`生成各种尺寸的PNG图标。

2. **截图生成**：
   ```bash
   npm run generate:screenshots
   ```
   此命令运行`scripts/generate-screenshots.js`脚本，生成应用截图。

3. **一次性生成所有资源**：
   ```bash
   npm run generate:pwa-assets
   ```
   此命令依次运行上述两个脚本，生成所有PWA资源。

## PWA配置

PWA功能通过以下文件配置：

1. **Manifest文件**：`public/manifest.json`
   - 定义应用名称、图标、主题色等
   - 配置应用快捷方式
   - 定义应用截图
   - 设置分享目标

2. **Next.js配置**：`next.config.mjs`
   - 使用`next-pwa`插件启用PWA功能
   - 配置资源缓存策略
   - 设置离线体验

## 自定义图标

要自定义应用图标，请替换`public/icons/icon-base.svg`文件，然后运行`npm run generate:pwa-assets`重新生成所有图标。

## 缓存策略

本项目配置了以下缓存策略：

- **字体文件**：使用`CacheFirst`策略，缓存时间为1年
- **图片文件**：使用`StaleWhileRevalidate`策略，缓存时间为30天
- **JavaScript文件**：使用`StaleWhileRevalidate`策略，缓存时间为7天
- **样式文件**：使用`StaleWhileRevalidate`策略，缓存时间为7天
- **API请求**：使用`NetworkFirst`策略，缓存时间为5分钟
- **其他资源**：使用`NetworkFirst`策略，缓存时间为1小时

## 测试PWA功能

要测试PWA功能，请执行以下步骤：

1. 构建并启动生产版本：
   ```bash
   npm run build && npm start
   ```

2. 在浏览器中打开应用，并检查是否显示"安装"选项（通常在地址栏或菜单中）

3. 测试离线功能：
   - 在开发者工具中启用"离线"模式
   - 刷新页面，验证应用是否仍能正常工作
   - 测试不同部分的离线访问能力 