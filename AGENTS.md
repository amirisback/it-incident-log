<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-guidelines -->
# 📘 Mandatory: Read Project Guidelines

**BEFORE writing any code, you MUST read `GUIDELINE.md` in the project root.**

This file contains:
- Project architecture & folder structure conventions
- Coding standards (TypeScript, React, Tailwind CSS v4)
- Environment variable rules (`.env`, `.env.development`, `.env.production`)
- PWA (Serwist) configuration guidelines
- SEO & performance requirements
- Git conventions
- Dos and Don't for AI agents

Failure to follow these guidelines will result in inconsistent, non-maintainable code.
<!-- END:project-guidelines -->

<!-- BEGIN:skill-invocation-rules -->
# 🧠 Mandatory: Skill Inspection & Invocation Before Execution

**EVERY TIME the user gives any command or request, you MUST:**
1. **Mandatory Skills to Always Invoke:**
   - **`using-superpowers`** (`.agents/skills/using-superpowers/SKILL.md`): Read and follow BEFORE taking any action or responding (including clarifying questions).
   - **`ponytail`** (`.agents/skills/ponytail/SKILL.md`): Read and follow to enforce YAGNI, minimal code, zero unrequested abstractions, and maximum efficiency.
2. **Mandatory UI / Design System Skill:**
   - **`ina-digital-design-system`** (`.agents/skills/ina-digital-design-system/SKILL.md`): WAJIB dibaca dan di-invoke untuk setiap pembuatan atau modifikasi UI, halaman, komponen, tata letak, dan styling SPBE.
3. **Task-Specific Skills:** Check all available skills in `.agents/skills/` (and global skills). If any match the task, read their `SKILL.md` using `view_file` BEFORE writing code or taking action.
4. Strictly follow all instructions defined in the matched skill(s).
<!-- END:skill-invocation-rules -->

<!-- BEGIN:ina-digital-design-system -->
# 🏛️ Mandatory: INA Digital Design System (IDDS)

Setiap pengerjaan antarmuka pengguna (UI), layout, komponen, formulir, dan styling:
- **Dokumentasi & Skill Path**: [`.agents/skills/ina-digital-design-system/SKILL.md`](.agents/skills/ina-digital-design-system/SKILL.md)
  - Token Desain: [`.agents/skills/ina-digital-design-system/references/tokens.md`](.agents/skills/ina-digital-design-system/references/tokens.md)
  - Katalog Komponen: [`.agents/skills/ina-digital-design-system/references/components.md`](.agents/skills/ina-digital-design-system/references/components.md)
  - Pola Halaman SPBE: [`.agents/skills/ina-digital-design-system/references/patterns.md`](.agents/skills/ina-digital-design-system/references/patterns.md)
- **Aturan Implementasi**:
  1. Gunakan `@idds/react` dan `@idds/styles` bersama Tailwind CSS v4.
  2. Terapkan token warna IDDS (`content-*`, `background-*`, `stroke-*`, `success-*`, `danger-*`, `warning-*`, `guide-*`) serta font `Inter`.
  3. Konfigurasi brand theme instansi (`inagov`, `panrb`, `bkn`, `lan`, `bgn`, `default`) dan dukung mode `light`/`dark`.
  4. Patuhi hierarki tombol (maksimal 1 Primary button per area fokus), Banner Nasional `#BE0000`, dan pola halaman SPBE standar.
  5. Aksesibilitas WCAG 2.1 AA (kontras minimal 4.5:1, label form terhubung, tanpa text gradient) dan UX writing Bahasa Indonesia baku.
<!-- END:ina-digital-design-system -->


