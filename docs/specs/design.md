# Bugfix Design: 响应式自适应大小修复方案

## 根因分析

页面在构建时主要针对桌面端设计，虽然使用了 Tailwind 响应式前缀（md:, lg:），但许多装饰性元素和容器使用了固定像素值，缺少小屏断点的覆盖。

核心根因：
1. 装饰性文字使用固定 `text-[Npx]` 而非响应式前缀
2. 绝对定位装饰元素缺少小屏隐藏逻辑
3. 固定高度容器未考虑内容在小屏上的换行需求
4. 作品卡片阴影层在满宽布局下溢出

## 修复策略：最小安全修复

### 策略 1：装饰性大字体 → 小屏缩小/隐藏
- `text-[200px]` → `text-[60px] md:text-[200px]`
- `text-[160px]` → 小屏隐藏
- `text-[120px]` → `text-[40px] md:text-[120px]`
- `text-[100px]` → `text-[40px] md:text-[100px]`
- `text-[80px]` → `text-[32px] md:text-[80px]`

### 策略 2：固定高度 → 自适应
- `min-h-[500px]` → `min-h-[280px] md:min-h-[500px]`
- `h-48` → `h-auto min-h-[10rem] md:h-48`

### 策略 3：溢出装饰 → 小屏隐藏或收敛
- 大偏移量装饰 → 小屏加 `hidden md:block`
- 小偏移量标签 → 缩小偏移

### 策略 4：字体大小响应式
- 统计卡片 `text-5xl` → `text-2xl md:text-5xl`
- 作品标题 `text-3xl` → `text-xl md:text-3xl`

### 策略 5：阴影层溢出 → 小屏缩小偏移
- `translate-x-4 translate-y-4` → `translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4`

### 策略 6：整体溢出防护
- Section 容器添加 `overflow-hidden`

## 受影响文件

- `stitch_portfolio_home_avant_garde_wireframe/combined_portfolio.html`

## 明确不修改的区域

- Tailwind 配置、CSS keyframes、JavaScript 逻辑、图片资源、桌面端视觉效果
