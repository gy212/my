# 性能优化实施计划

> **项目**: `stitch_portfolio_home_avant_garde_wireframe/combined_portfolio.html`
> **当前状态**: 单体 HTML 文件（84 KB / 1,746 行），首屏加载 ~3.9 MB
> **优化目标**: 首屏加载降至 ~1.0 MB 以内，运行时帧率稳定 60fps
> **日期**: 2026-03-22

---

## 一、现状总览

| 指标 | 当前值 | 目标值 |
|------|--------|--------|
| 首屏资源总量 | ~3.9 MB | < 1.0 MB |
| 阻塞渲染的外部请求 | 8 个 | ≤ 3 个 |
| 外部域名（无 preconnect） | 5 个 | 0 个 |
| 持续运行的动画/渲染循环 | ~30+ 个 | 仅可见区域运行 |
| 404 资源错误 | 2 个 | 0 个 |

---

## 二、分阶段实施方案

### Phase 1：消灭巨型依赖（预计节省 ~2.5 MB）

#### 1.1 移除 Babel Standalone + React/ReactDOM（节省 ~1.93 MB）

**涉及行**: 14-16, 1404-1746

**原因**: 加载 1.8 MB 的 Babel 编译器 + 130 KB 的 React，仅为渲染一个 `TargetCursor` 光标组件（5 个 div 元素）。

**实施步骤**:
1. 将 `TargetCursor` 组件用原生 JavaScript 重写（约 80 行代码）
   - 用 `document.createElement` 替代 JSX
   - 用原生事件监听替代 `useEffect`
   - 用闭包变量替代 `useRef`
   - GSAP 动画逻辑保持不变（已经是直接调用）
2. 删除 `<script type="text/babel">` 块（行 1404-1746）
3. 删除三行 `<script>` 引用：
   ```html
   <!-- 删除以下三行 -->
   <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
   <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
   <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
   ```
4. 将重写后的原生 JS 以 `<script>` 标签内联到 HTML 底部

**验证**: 光标跟随、hover 变形、旋转动画表现与原版一致。

---

#### 1.2 替换 Tailwind CDN 为预编译 CSS（节省 ~300 KB）

**涉及行**: 6, 37-89

**原因**: CDN 版在浏览器中运行完整 JIT 编译器，官方标注"仅供开发使用"。

**实施步骤**:
1. 在项目中初始化 Tailwind：
   ```bash
   npm init -y
   npm install -D tailwindcss
   npx tailwindcss init
   ```
2. 将行 38-89 的 `tailwind.config` 迁移到 `tailwind.config.js`
3. 创建 `input.css`，包含 `@tailwind base; @tailwind components; @tailwind utilities;`
4. 运行构建并生成精简 CSS：
   ```bash
   npx tailwindcss -i ./input.css -o ./dist/output.css --minify
   ```
5. 将 `<script src="https://cdn.tailwindcss.com...">` 替换为 `<link rel="stylesheet" href="./dist/output.css">`
6. 删除 `<script id="tailwind-config">` 块

**验证**: 所有样式与原版视觉一致，无 class 丢失。

---

#### 1.3 精简 Three.js 加载（节省 ~450 KB）

**涉及行**: 10, 952-1237

**原因**: 加载完整 Three.js（~600 KB），仅使用 7 个模块。

**方案 A（推荐 — 不引入构建工具时）**: 替换为 Three.js ESM 按需导入
```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.min.js"
  }
}
</script>
<script type="module">
import { PerspectiveCamera, Scene, WebGLRenderer, PlaneGeometry, ShaderMaterial, Mesh, CanvasTexture } from 'three';
// ... 原有逻辑
</script>
```

**方案 B（最小体积）**: 用原生 WebGL 重写着色器渲染
- 仅需 Canvas 2D API + 少量 WebGL boilerplate（~100 行）
- 完全移除 Three.js 依赖
- 代价：需重写较多代码

**验证**: ASCII 英雄区效果与原版一致。

---

### Phase 2：字体与图标优化（预计节省 ~350 KB）

#### 2.1 用内联 SVG 替换 Material Symbols 字体（节省 ~300 KB）

**涉及行**: 8，以及 HTML 中所有 `<span class="material-symbols-outlined">` 标签

**原因**: 为 8 个图标加载整套可变字重图标字体（300+ KB）。

**实施步骤**:
1. 提取实际使用的图标名：`terminal`, `code`, `coffee`, `schedule`, `star`, `smart_toy`, `settings`, `arrow_outward`
2. 从 [Material Symbols](https://fonts.google.com/icons) 下载对应 SVG
3. 将每个 `<span class="material-symbols-outlined">icon_name</span>` 替换为内联 `<svg>` 标签
4. 删除 `<link href="...Material+Symbols..." />`
5. 为 SVG 添加 `fill="currentColor"` 以继承文字颜色

**验证**: 图标视觉一致，颜色继承正确。

---

#### 2.2 合并 Google Fonts 请求 + 添加 preconnect（节省 ~200ms 延迟）

**涉及行**: 7, 9

**实施步骤**:
1. 合并两个 Google Fonts `<link>` 为一个请求：
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=VT323&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet"/>
   ```
2. 在 `<head>` 最顶部添加 preconnect：
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
   ```

---

#### 2.3 修复本地字体 404 错误

**涉及行**: 19-35

**实施步骤**:
1. **方案 A**: 下载 `Zpix.ttf` 放置到 `./fonts/` 目录
2. **方案 B**: 若决定不使用该字体，删除行 17-35 的两个 `@font-face` 声明，并清理 Tailwind config 中 `fontFamily` 里的 `'PixelChinese'` 和 `'Zpix'` 引用

---

### Phase 3：运行时性能优化（CPU/GPU 大幅降低）

#### 3.1 ASCII 渲染循环——可见性控制 + 帧率限制

**涉及行**: 952-1237（核心在 1174-1185）

**问题**: `requestAnimationFrame` 无限循环，每帧执行 `getImageData`（GPU→CPU 同步）+ `innerHTML` 替换。

**实施步骤**:
1. 添加 `IntersectionObserver` 检测英雄区域可见性：
   ```javascript
   const heroSection = document.getElementById('hero-section');
   let isHeroVisible = true;
   const observer = new IntersectionObserver(([entry]) => {
       isHeroVisible = entry.isIntersecting;
   }, { threshold: 0 });
   observer.observe(heroSection);
   ```
2. 在 `requestAnimationFrame` 回调中添加可见性判断：
   ```javascript
   function animate() {
       requestAnimationFrame(animate);
       if (!isHeroVisible) return; // 不可见时跳过渲染
       // ... 原有渲染逻辑
   }
   ```
3. 添加帧率限制（30fps 即可，ASCII 效果无需 60fps）：
   ```javascript
   let lastFrame = 0;
   const FRAME_INTERVAL = 1000 / 30;
   function animate(timestamp) {
       requestAnimationFrame(animate);
       if (!isHeroVisible) return;
       if (timestamp - lastFrame < FRAME_INTERVAL) return;
       lastFrame = timestamp;
       // ... 渲染逻辑
   }
   ```
4. 将静态文字的 `textCanvas.render()` 提到循环外，仅在文字变化时重新渲染

---

#### 3.2 CSS 动画——添加可见性暂停

**涉及行**: 分布在整个 HTML 中（约 30 处动画）

**实施步骤**:
1. 添加全局 IntersectionObserver 控制动画暂停：
   ```javascript
   const animObserver = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           entry.target.style.animationPlayState =
               entry.isIntersecting ? 'running' : 'paused';
       });
   }, { threshold: 0 });

   document.querySelectorAll('[class*="animate-"]').forEach(el => {
       animObserver.observe(el);
   });
   ```
2. 为频繁动画的元素添加 `will-change: transform`（仅 spinner/ping 元素）
3. 确保 `will-change` 在动画结束后移除（避免内存占用）

---

#### 3.3 velocity-glitch 效果节流

**涉及行**: 1383-1399

**问题**: 快速滚动时对 `main` 等大元素施加 `filter: contrast(150%) hue-rotate(90deg)`，强制整页重绘。

**实施步骤**:
1. 用 `requestAnimationFrame` 节流滚动回调
2. 缩小 glitch 作用范围——仅对 `.section-divider` 等小元素施加 filter，不要对 `main` 施加
3. 添加 debounce，glitch 效果最多持续 200ms 后自动移除：
   ```javascript
   let glitchTimeout = null;
   ScrollTrigger.create({
       onUpdate: (self) => {
           const velocity = Math.abs(self.getVelocity());
           if (velocity > 3500) {
               // 仅对小元素施加
               dividers.forEach(el => el.classList.add('velocity-glitch'));
               clearTimeout(glitchTimeout);
               glitchTimeout = setTimeout(() => {
                   dividers.forEach(el => el.classList.remove('velocity-glitch'));
               }, 200);
           }
       }
   });
   ```

---

### Phase 4：合成层与渲染优化（中等优先级）

#### 4.1 移除或优化 grain overlay

**涉及行**: 201-211

**实施步骤**:
1. **推荐**: 用 CSS 伪元素 + CSS `noise` 替代外部图片纹理：
   ```css
   .grain-overlay::after {
       content: '';
       position: fixed;
       inset: 0;
       z-index: 50;
       opacity: 0.05;
       background: repeating-conic-gradient(#0001 0 25%, transparent 0 50%) 0 0/4px 4px;
       pointer-events: none;
   }
   ```
2. 添加 `pointer-events: none` 使其不阻挡点击
3. 删除外部图片 URL 的引用

---

#### 4.2 减少 mix-blend-mode 使用

**涉及**: 15 处 `mix-blend-mode` 使用

**实施步骤**:
1. 审查每个 `mix-blend-mode` 的实际视觉贡献
2. 对于装饰性元素（贡献不明显的），移除 `mix-blend-mode`
3. 保留关键视觉效果的 blend mode，但为其容器添加 `isolation: isolate` 限制合成范围

---

#### 4.3 图片优化

**涉及行**: 210, 661, 795, 818, 837

**实施步骤**:
1. 将 5 张外部 `lh3.googleusercontent.com` 图片下载到本地 `./images/` 目录
2. 使用 WebP 格式压缩（可用 `cwebp` 或在线工具）
3. 将 CSS `background-image` 替换为 `<img>` 标签 + `loading="lazy"`
4. 为每张图片设置明确的 `width` 和 `height` 属性，避免布局偏移

---

### Phase 5：修复与清理（低优先级）

#### 5.1 修复缺失资源

| 资源 | 行号 | 操作 |
|------|------|------|
| `./fonts/Zpix.ttf` | 21, 30 | 下载放入 `./fonts/` 或删除 `@font-face` 声明 |
| `./cat.jpg` | 605 | 提供图片或使用占位图 |

#### 5.2 清理冗余代码

- 删除重复的 `@keyframes marquee`（行 119-122 vs 行 70-73）
- 删除重复的 `@keyframes glitch`（行 131-138 vs 行 78-85）
- 移除 7 处 `console.log`（分布在行 1244-1367）

#### 5.3 添加 meta 标签

```html
<meta name="description" content="前卫风格像素作品集" />
```

---

## 三、实施顺序与预期效果

```
Phase 1 ──────────────────────────────────── 节省 ~2.68 MB
  ├─ 1.1 移除 Babel/React（重写光标组件）      ~1.93 MB ★★★
  ├─ 1.2 预编译 Tailwind CSS                   ~0.30 MB ★★★
  └─ 1.3 精简 Three.js                         ~0.45 MB ★★☆

Phase 2 ──────────────────────────────────── 节省 ~350 KB + 延迟
  ├─ 2.1 SVG 替换 Material Symbols             ~300 KB  ★★☆
  ├─ 2.2 合并字体请求 + preconnect              ~200ms   ★☆☆
  └─ 2.3 修复本地字体 404                       修复错误  ★☆☆

Phase 3 ──────────────────────────────────── 运行时性能
  ├─ 3.1 ASCII 渲染循环优化                     CPU 降 60%+ ★★★
  ├─ 3.2 CSS 动画可见性暂停                     GPU 降 40%+ ★★☆
  └─ 3.3 velocity-glitch 节流                   消除卡顿    ★★☆

Phase 4 ──────────────────────────────────── 渲染优化
  ├─ 4.1 grain overlay 优化                     减少合成    ★☆☆
  ├─ 4.2 精简 mix-blend-mode                    减少重绘    ★☆☆
  └─ 4.3 图片本地化 + WebP                      减少外部依赖 ★☆☆

Phase 5 ──────────────────────────────────── 清理
  ├─ 5.1 修复缺失资源                           消除 404   ★☆☆
  ├─ 5.2 清理冗余代码                           代码整洁   ☆☆☆
  └─ 5.3 添加 meta 标签                         SEO       ☆☆☆
```

**完成 Phase 1-3 后预期效果**:
- 首屏加载: **3.9 MB → ~0.9 MB**（降低 ~77%）
- 渲染性能: 滚动时帧率从频繁掉帧恢复到稳定 60fps
- 404 错误归零

---

## 四、风险与注意事项

1. **视觉回归风险**: 每个 Phase 完成后必须人工比对视觉效果，特别是：
   - Phase 1.1: 光标组件的 hover 变形和旋转动画
   - Phase 1.2: 所有 Tailwind 工具类是否被正确提取
   - Phase 2.1: SVG 图标在暗色背景上的可见性

2. **Three.js ESM 兼容性**: `importmap` 在 Safari 16.4 以下不支持，需确认目标浏览器

3. **保持前卫风格**: 优化不应削弱页面的视觉冲击力——glitch、ASCII、blend mode 等效果是设计核心，优化的目标是"更高效地实现同样的效果"，而非简化效果
