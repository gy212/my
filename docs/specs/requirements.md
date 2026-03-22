# Portfolio Performance Optimization Requirements

## Metadata

- Derived From: [design.md](/D:/CodeProject/web/my/docs/specs/design.md)
- Workflow: `Feature / Design-First`
- Target: [combined_portfolio.html](/D:/CodeProject/web/my/stitch_portfolio_home_avant_garde_wireframe/combined_portfolio.html)

## 1. Scope

本需求文档仅覆盖性能优化与资源治理，不引入新的用户功能。所有需求均从已批准设计派生。

## 2. Functional Requirements

### FR-1 Dependency Reduction

页面必须移除仅为 Target Cursor 服务的 React、ReactDOM 与 Babel 运行时，并以原生 JavaScript 提供等价光标行为。

#### Acceptance Criteria

1. GIVEN 页面在桌面端打开
   WHEN 用户移动鼠标、悬停 `.cursor-target` 元素、按下和松开鼠标
   THEN 自定义光标必须继续表现出跟随、角标吸附、旋转和缩放反馈。

2. GIVEN 页面源码被检查
   WHEN 审查 `<head>` 和底部脚本
   THEN 不应再存在 React、ReactDOM、Babel 远程脚本和 `type="text/babel"` 脚本块。

### FR-2 Styling Pipeline Optimization

页面必须改用本地预编译 CSS，而不是运行时 Tailwind CDN。

#### Acceptance Criteria

1. GIVEN 页面加载完成
   WHEN 审查网络请求
   THEN 不应再请求 `cdn.tailwindcss.com`。

2. GIVEN 页面视觉回归检查
   WHEN 比对核心区块
   THEN 现有布局、颜色、字体和动画类效果应保持一致，不能出现明显 class 丢失。

### FR-3 Hero ASCII Runtime Control

英雄区 ASCII 渲染必须只在可见时运行，并将渲染频率限制到满足视觉要求的最小水平。

#### Acceptance Criteria

1. GIVEN 英雄区滚出视口
   WHEN 页面继续滚动
   THEN ASCII 渲染循环必须暂停高代价渲染工作。

2. GIVEN 英雄区处于视口内
   WHEN 页面空闲显示
   THEN ASCII 动效必须持续可见，且视觉上无明显卡顿或频闪。

3. GIVEN 实现代码被检查
   WHEN 审查渲染逻辑
   THEN 必须存在可见性判断与帧率限制，且文字 Canvas 不能在每一帧重复重绘。

### FR-4 Icon and Font Optimization

页面必须仅为实际用到的图标和字体付出成本。

#### Acceptance Criteria

1. GIVEN 页面源码被检查
   WHEN 审查图标实现
   THEN `Material Symbols` 字体依赖必须被内联 SVG 替换。

2. GIVEN 页面加载字体
   WHEN 审查网络请求
   THEN Google Fonts 请求必须合并，并带有必要的 `preconnect`。

3. GIVEN 本地字体无法提供
   WHEN 进行最终实现
   THEN 必须删除失效的 `@font-face` 与对应字体引用，不能保留 404 请求。

### FR-5 Scroll and Animation Governance

滚动特效和通用 CSS 动画必须避免对不可见元素或大面积区域施加持续重绘负担。

#### Acceptance Criteria

1. GIVEN 带 `animate-` 的元素滚出视口
   WHEN 页面继续运行
   THEN 这些元素的 CSS 动画必须被暂停。

2. GIVEN 用户快速滚动页面
   WHEN velocity glitch 被触发
   THEN glitch 效果只能作用于局部目标元素，且最多持续约 `200ms` 后自动清理。

3. GIVEN 代码审查
   WHEN 审查 ScrollTrigger 相关逻辑
   THEN 不应再对 `main` 或同等级大范围容器施加高成本 `filter` 效果。

### FR-6 Resource Integrity Cleanup

页面必须修复缺失资源和明显冗余代码。

#### Acceptance Criteria

1. GIVEN 页面完成优化
   WHEN 打开浏览器控制台和网络面板
   THEN 不应存在 `Zpix.ttf`、`cat.jpg` 或其他已知静态资源 404。

2. GIVEN 代码审查
   WHEN 搜索冗余定义
   THEN 重复的 `@keyframes` 和调试 `console.log` 必须被清理。

3. GIVEN 页面源码被检查
   WHEN 审查 `<head>`
   THEN 必须包含描述页面内容的 `meta description`。

## 3. Non-Functional Requirements

### NFR-1 Performance Budget

- 首屏资源总量应低于 `1.0 MB`。
- 阻塞渲染的外部请求数应小于等于 `3`。
- 404 资源错误应为 `0`。

### NFR-2 Visual Fidelity

- 优化后页面必须保持前卫像素风格。
- Hero ASCII、glitch、关键 blend 和 cursor 交互不得缺失。

### NFR-3 Maintainability

- 运行时逻辑应按模块职责拆分，避免继续扩大单一超长脚本块的复杂度。
- 所有新增本地静态资源路径必须稳定、可追踪。

### NFR-4 Compatibility

- 若采用 `importmap + three.module.js`，必须验证目标浏览器是否支持。
- 如果不满足兼容性要求，必须使用设计文档中允许的回退方案，且不得无说明地硬切实现。

## 4. Assumptions Carried From Design

- 允许新增 Tailwind 构建文件和构建产物。
- 允许为图像和字体新增本地资源目录。
- 用户接受在视觉一致前提下对动画运行策略进行节流和暂停。

## 5. Out of Scope

- 重新设计页面布局或品牌语言。
- 引入 SPA 框架、SSR、路由或后端服务。
- 对作品内容、文案和信息结构进行重写。
