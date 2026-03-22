# 作品展示区替换计划

## 现状

当前 `SELECTED_WORKS` 区域有 **3 个占位项目卡片**：
- `Project_Alpha` — `<WEB / 3D / GLITCH>`
- `Neon_Protocol` — `<UI / UX / SYSTEM>`
- `Data_Shrine` — `<ART / INSTALLATION>`

全部为虚构占位内容，需替换为真实 GitHub 项目。

---

## GitHub 可用仓库（非 fork）

| 仓库 | 描述 | 主语言 | Stars |
|------|------|--------|-------|
| PhotoWall | 图片管理桌面端程序 | Rust | 1 |
| my-python-project-CheekAI | AI 率检测工具 | Rust | 0 |
| claude_code_-_codex_-_review | Claude Code + Codex 自动代码审查 | Python | 0 |
| my-python-project-print | 中文键盘模拟输入器（绕过禁止粘贴） | Python | 2 |
| my-python-project-saomiao | LLM 图像转 Word/PDF 应用 | HTML | 0 |

---

## 替换映射

### 卡片1（精选/大卡片，7列宽）
- **原** → Project_Alpha
- **替换为** → **PhotoWall**
- 标签：`<RUST / DESKTOP / TOOL>`
- 链接：https://github.com/gy212/PhotoWall

### 卡片2（6列宽，右偏移）
- **原** → Neon_Protocol
- **替换为** → **CheekAI**（AI 率检测）
- 标签：`<RUST / AI / DETECTION>`
- 链接：https://github.com/gy212/my-python-project-CheekAI

### 卡片3（5列宽，左偏移）
- **原** → Data_Shrine
- **替换为** → **键盘模拟输入器**
- 标签：`<PYTHON / TOOL / UTILITY>`
- 链接：https://github.com/gy212/my-python-project-print

### 卡片4（新增，6列宽）
- **新增** → **LLM 扫描转档**
- 标签：`<LLM / OCR / APP>`
- 链接：https://github.com/gy212/my-python-project-saomiao

### 卡片5（新增，5列宽）
- **新增** → **Claude Code × Codex 审查**
- 标签：`<PYTHON / AI / DEVTOOL>`
- 链接：https://github.com/gy212/claude_code_-_codex_-_review

---

## 具体改动点

1. **修改 3 个现有卡片**：替换标题（h3）、描述标签（p）、图片 alt 文字
2. **新增 2 个卡片**：复用现有卡片 HTML 结构和样式，在 grid 中追加
3. **添加链接跳转**：每个卡片外层包裹 `<a>` 或在箭头图标上添加跳转到对应 GitHub 仓库
4. **图片**：暂保留现有占位图，后续可替换为项目真实截图
5. **角标文字更新**：如「精选」「MEOW_UI」等替换为贴合项目的标签
