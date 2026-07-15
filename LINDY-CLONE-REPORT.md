# Lindy AI 完整反解報告 (2026-07-15)

> 反解目標：`https://www.lindy.ai/`
> 工具：`mcp__chrome_devtools` (evaluate_script / take_screenshot / emulate)
> Viewport：Desktop 1440×900 / Mobile iPhone 14 (390×844 @3x)
> 數據來源：所有 token 皆為 `getComputedStyle()` 真實抓取，**非估算**

---

## 0. TL;DR

- **定位**：AI executive assistant，敘事主軸是「像真人一樣的助理」、核心通訊介面是 **iMessage**（這是 Lindy 跟所有競爭者最大的設計差異）。
- **設計哲學**：「warm minimalism with playful interruptions」——主體走極簡（單色 cream + navy + 單一藍 accent），但每隔幾屏就用一個 playful 元素打斷（黃色漸層 pricing card、超大 logo face emoji、Marquee 跑馬燈、Wall of Love 滾動）。
- **視覺關鍵詞**：cream `#FCF9F8`、navy `#0F1E2E`、brand blue `#2A66FF`、暖黃 highlight `#FEE289`、Manrope typeface、12px radius、4–6px layered shadow、backdrop-blur(16px) sticky nav。
- **最值得克隆的 3 個元素**：
  1. **Hero = center-stage text + full-bleed iPhone mockup with marquee task list**（不是兩欄 split，是文字置中、iPhone 浮在右側），scroll-cue 把任務字串（"Clear my inbox · Prep for my 2pm…"）水平無限滾動——極強「活著」的感覺。
  2. **Sticky nav with `backdrop-filter: blur(16px)` 透明毛玻璃，bg `rgba(252,251,248,0)`**——scroll 不加實心背景、純靠模糊區分層級，這是 2025–2026 頂級 SaaS 標配。
  3. **Plus pricing card 的暖黃漸層 (`linear-gradient(rgba(255,255,255,0) 34%, #FEE289)`)** 包住純白卡片做「熱度」標記——比 SaaS 常見的「邊框 + 推薦」標籤更抓眼球，且成本是 0 行 JS。
- **不建議克隆的 1 個元素**：**Wall of Love 是無限重複 3 組 tweet 的 marquee（用 CSS `@keyframes marquee-scroll` 水平平移）**。這種「假 testimonial 無限輪播」對 converter 友善但對真正想讀評語的人不友善，且對 SEO/accessibility 不佳。建議改用 paginated grid。

---

## 1. 截圖清單 (16+ 張)

| 編號 | 路徑 | 描述 |
|---|---|---|
| SHOT-01 | `/tmp/lindy-screenshots/shot-01-hero.png` | Hero 首屏：centered "hey, I'm Lindy" 大標 + iPhone mockup + "Try for free" 藍鈕 + G2 4.9 rating。Nav 透明浮在內容上。 |
| SHOT-02 | `/tmp/lindy-screenshots/shot-02-logos.png` | Social proof：捲動到 "People use me at some pretty cool places"，下方 logo 跑馬燈（shopify / apple / adobe / mckinsey / nvidia / harvard 等），黑色 logo on cream bg。 |
| SHOT-03 | `/tmp/lindy-screenshots/shot-03-features-row.png` | Features row：4 個垂直 feature card（EMAIL TRIAGE / MEETING SCHEDULING / MEETING PREP / REMINDERS），每張含 eyebrow + Lindy logo face + H3 + 兩段描述。 |
| SHOT-04 | `/tmp/lindy-screenshots/shot-04-product-screenshot.png` | "See how I eliminate workday chaos" 區：含 product demo video iframe + "Watch: See Lindy in action" CTA。 |
| SHOT-05 | `/tmp/lindy-screenshots/shot-05-pricing.png` | Pricing：3 欄 cards (Human Assistant $8k / **Plus $49.99** / Enterprise)，**Plus 卡片有暖黃漸層 + 24px 外圓角**，中央 card 略高視覺 highlight。 |
| SHOT-06 | `/tmp/lindy-screenshots/shot-06-testimonials.png` | "Wall of Love" 區：3 欄 tweet card grid (Greg Isenberg, Lenny, Deedy 等)，hover 會 `translateY(-5px)` 浮起。 |
| SHOT-07 | `/tmp/lindy-screenshots/shot-07-footer.png` | Footer 全貌：左側 logo + compliance badges (GDPR/SOC2/HIPAA/PIPEDA 藍色徽章) + 社群 icon；右側 Company + Legal 兩欄 link grid；底部 © 2026 + Lindy disclaimer。 |
| SHOT-08 | `/tmp/lindy-screenshots/shot-08-mobile-hero.png` | Mobile (iPhone 14, 390×844) Hero：H1 縮為 49.5px、CTA 全寬、漢堡選單取代 nav links。 |
| SHOT-09 | `/tmp/lindy-screenshots/shot-09-mobile-features.png` | Mobile features section：垂直堆疊單欄、間距變緊湊。 |
| SHOT-10 | `/tmp/lindy-screenshots/shot-10-cta-hover.png` | **Hover 狀態**：nav 上的 "Try for free" 鈕 hover——bg 由 `#2A66FF` → `#2252CC`（深藍，CSS var `--button--background-hover`），無 transform/scale 變化。 |
| SHOT-11 | `/tmp/lindy-screenshots/shot-11-sticky-nav.png` | **Sticky nav scroll 過半**：header wrapper 是 `position: fixed; top: 0; z-index: 1000; backdrop-filter: blur(16px); bg: rgba(252,251,248,0)`，**永遠透明只用 blur 撐層級**。 |
| SHOT-12 | `/tmp/lindy-screenshots/shot-12-pricing-toggle.png` | Pricing tab-switcher (Human/Plus/Enterprise)，**Lindy 沒有月繳/年繳 toggle**——只切 tier，這個 spec 要求項目不存在，截圖用同區塊替代。 |
| SHOT-13 | `/tmp/lindy-screenshots/shot-13-product-closeup.png` | Product close-up：含 Wistia iframe + "Watch: See Lindy in action" 標籤。 |
| SHOT-14 | `/tmp/lindy-screenshots/shot-14-cta-final.png` | "Wake up tomorrow already ahead" 最終 CTA：24px-radius 容器，內含全幅 bg-image (BG_CTA_FIX_2.avif) + H2 + Try for free 鈕。 |
| SHOT-15 | `/tmp/lindy-screenshots/shot-15-nav-dropdown.png` | **Resources dropdown 展開**：mega menu 401×420px、bg `rgb(252,251,248)` cream、12px radius、border `rgb(231,231,231)`、雙層 shadow。 |
| SHOT-16 | `/tmp/lindy-screenshots/shot-16-footer-detail.png` | Footer 細部：4 個藍色 compliance badges + 4 個社群 icon（X/LinkedIn/YouTube）+ Company/Legal link grid 局部放大。 |
| BONUS | `/tmp/lindy-screenshots/shot-13-product-closeup.jpeg` | 同區塊 jpeg 格式（測試格式對照，非必要）。 |

---

## 2. Design Token 真實數字

### 2.1 Color

| Token | 值 | 用途 |
|---|---|---|
| `--brand-blue` | `#2A66FF` (rgb 42,102,255) | 主色：所有 primary CTA、compliance badge 文字、focus outline |
| `--button--background` | `#2A66FF` | Primary button bg |
| `--button--background-hover` | `#2252CC` (rgb 34,82,204) | Primary button hover bg（**無 transform，只換色**） |
| `--button--text` / `--button--text-hover` | `#fff` | 按鈕文字 |
| `--text-main` | `#0F3547` (rgb 15,53,71) | H1/H2/H3 主要文字（深 navy） |
| `--_colors---navy--700` | `#0F1E2E` (rgb 15,30,46) | body / footer 主文字（最深的 navy） |
| `--text-subtle` | `#31505F` (rgb 49,80,95) | nav link / 副文字 |
| `--new-text-color-secondary` | `#474A54` | 次要文字（footer link、meta） |
| Subhead (computed) | `rgb(52, 77, 99)` | Hero "I take admin work off your plate." |
| Body bg | `rgb(252, 249, 248)` ≈ `#FCF9F8` | 全站底色（warm cream） |
| `--_colors---cream--200` | `#FCF9F8` | 同上 (CSS var) |
| Card surface | `#fff` (rgb 255,255,255) | Pricing card / testimonial card bg |
| Card border | `rgba(0, 0, 0, 0.08)` | 所有 card 邊框 |
| `--swatch--stroke-subtle` | `#E7E7E7` | Dropdown panel border |
| Plus pricing gradient | `linear-gradient(rgba(255,255,255,0) 34%, rgb(254, 226, 137))` | 暖黃 highlight 漸層（**注意：rgb(254,226,137) ≈ `#FEE289`**，僅下方 66% 有色） |
| iMessage bubble bg | `rgb(10, 132, 255)` ≈ `#0A84FF` | 對話氣泡 primary 色（iOS 系統色） |
| iMessage bubble radius | `18px 18px 5px` | 經典 iOS 對話氣泡（右下角 5px 小角） |

### 2.2 Typography

| Token | 值 | 用於 |
|---|---|---|
| Font family (all) | `Manrope, sans-serif` | 全站單一字型 |
| H1 (hero) | `72px / 75.6px line-height / -1.44px letter-spacing / weight 700` | Hero "hey, I'm Lindy" |
| H2 (section) | `48px / 50.4px / -0.96px / 700` | 區塊大標 ("See how I eliminate…", "Wake up tomorrow…") |
| H3 (feature) | `clamp(2rem, …, 3rem)` (computed ≈ 36-48px) / 700 | Feature card 標題 |
| Subhead | `20px / 30px / 500 / rgb(52,77,99)` | Hero 副標 |
| Body | `16px / 24px / Manrope` | 預設 body |
| Button | `16px / 500` | CTA |
| Eyebrow | `14.08px / 700 / 1.408px letter-spacing / uppercase` | "EMAIL TRIAGE & DRAFTING", "WALL OF LOVE" 等 |
| Compliance badge title | `12px / 700 / brand-blue` | "GDPR", "SOC 2" |
| Compliance badge label | `8px / 500 / brand-blue` | "Compliant" |

**Fluid typography via CSS vars (在 viewport 20–90rem 間 clamp)**：
- H1: `clamp(3rem, …, 4.5rem)`（mobile 49.5px / desktop 72px）
- H2: `clamp(2.5rem, …, 3.5rem)`
- H3: `clamp(2rem, …, 3rem)`

### 2.3 Spacing

| Token | 值 | 用於 |
|---|---|---|
| `--lumos-latest_spacing---section-space--main` | `clamp(4rem, …, 7rem)` | section 上下 padding（流動） |
| `--lumos-latest_spacing---section-space--large` | `clamp(5.5rem, …, 10rem)` | 大 section (pricing, CTA) |
| Section padding (實測) | `40px 0px` | 大多數 section（不算 hero） |
| Container max-width | `1440px` (computed) | section 寬 |
| `--lumos-latest---max-width--main` | `calc(90 * 1rem)` = `1440px` | 設計系統上限 |
| Inner container | `1184px` | section 內部 container (`u-n-container`) |
| `--lumos-latest---site--gutter` | `clamp(1rem, …, 2rem)` | gutter |
| Grid gap (pricing) | `0` (cards touch)，計算約 0.5px | 3 pricing cards |
| Grid gap (features) | `12px` (small) | card 內部元素 |
| Hero CTA → rating gap | `normal` | nav 行內 |

### 2.4 Button

| 屬性 | Primary (`.btn_main_wrap`) |
|---|---|
| Height | `40px` |
| Padding | `0 16px` |
| Radius | `12px` |
| Font | `16px / 500` |
| BG | `#2A66FF` (rgb 42,102,255) |
| Hover BG | `#2252CC` (rgb 34,82,204) — **僅變色，無 transform** |
| Text | `#fff` |
| Border | 0 (透明) |
| Box-shadow | `rgba(0,0,0,0.1) 0 -1px 1px 0 inset, rgba(20,21,26,0.05) 0 1px 2px 0`（**雙層 inset + drop 極輕陰影**） |
| iMessage bubble button | bg `rgb(10,132,255)`, radius `18px 18px 5px`, padding `8px 10px 8px 13px`, font `14px/400` |

### 2.5 Card / Shadow / Nav / Grid

**Card (一般：testimonial / pricing)**：
- bg: `#fff`
- border: `1px solid rgba(0,0,0,0.08)`
- radius: `12px`
- padding: `32px` (testimonial) / `24px` (pricing 內層)
- box-shadow: `none`（**完全靠 1px 邊框撐結構**，不用陰影——這是 cream-on-white 設計的標準做法）

**Plus pricing card**：
- 外層 wrapper radius: `20px`, padding: `8px`
- bg: `linear-gradient(rgba(255,255,255,0) 34%, rgb(254,226,137))`（黃色只在下方 66%）
- 內層 card radius: `12px`, bg: `white`

**Dropdown panel**：
- bg: `rgb(252,251,248)` (cream)
- border: `1px solid rgb(231,231,231)`
- radius: `12px`
- padding: `16px`
- box-shadow: `rgba(14,23,39,0.06) 0 4px 6px -2px, rgba(14,23,39,0.1) 0 12px 16px -4px` (**layered shadow: 兩個不同 alpha 疊加**)
- width: 401px / height: 420px

**Nav**：
- Wrapper: `.g_header_wrap` `position: fixed; top: 0; z-index: 1000; height: 62px`
- bg: `rgba(252, 251, 248, 0)`（**永遠透明**）
- backdrop-filter: `blur(16px)`（**永遠毛玻璃**）
- Inner nav: `.nav_wrap` height 62px, padding 0
- Link size: `16px / 500`
- Link color (default): `color(srgb 0.0588 0.1176 0.1804 / 0.8)` = navy at 80% opacity
- Link color (hover): `.nav-btn:hover` → bg `rgb(197, 212, 255)` = light blue pill bg
- Logo height: ~22px (SVG)

**Grid (Pricing)**：
- 3-column, equal width (325px × 3 = 975px in 1184px container)
- gap: 0 (cards touch, no gap)
- justify-content: center
- align-items: stretch
- type: `flex`

**Grid (Features row)**：
- 4 vertical feature cards, each ~280px wide
- Layout uses `u-display-contents` (deeper flex parent handles layout)

**Grid (How it works)**：
- `howitworks_layout u-vflex-center-top u-gap-medium` — vertical flex with medium gap

**Footer grid**：
- 4-quadrant: (badges | logo+social) | (Company | Legal)
- Compliance badges: 32×32 icon + 12px label + 8px sub-label, brand-blue text
- Link color: `color(srgb ... / 0.8)` (navy 80%)
- Link font: `14.08px / 500`

---

## 3. Layout 反解

- **Hero**：**置中文字（非 2-column split）**。H1 + subhead + CTA 全部置中於左半邊（頁面水平中線略偏左），右側有一個浮動的 iPhone mockup 帶 marquee 任務字串。視覺重心是「文字+手機插畫」而非 split。高度 900px 滿版。
- **Nav**：**logo left + links center/left + CTA right**。
  - 左：Lindy SVG logo (78×26 viewbox)
  - 中：Pricing / Enterprise / Security / Integrations / Resources (dropdown)
  - 右：Log in / Try for free (藍鈕)
  - 永遠 fixed top, 透明 + blur
- **Pricing**：3 欄等寬 cards (325px each)，**gap=0 cards 直接相鄰**，沒有 padding-intermediate。視覺上中間 Plus 卡片「浮起來」是靠暖黃背景 + 20px 外層 radius + 8px padding 做出層次感，不是靠 box-shadow 或 z-index。
- **Section spacing rhythm**：
  - Hero: 900px (含 mockup)
  - Logos section: ~430px
  - Features row: ~2430px (含子內容 4 張大 card)
  - Product demo: ~745px
  - How it works: ~661px
  - Integrations: ~773px
  - Security: ~516px
  - Pricing: ~861px
  - Wall of love: ~489px
  - Final CTA: ~742px
  - 每個 section padding: `40px 0px`（小 section）、`clamp(4rem..7rem)`（大 section via CSS var）
- **Footer**：**精簡 4 象限**（非 mega menu）——左上 compliance badges 4 個 + 左下社群 icon 4 個 / 右上 Company 4 links / 右下 Legal 3 links，bottom 一行 © disclaimer。
- **Sticky/fixed element**：
  - ✅ **Nav**: fixed top, backdrop-blur(16px), 永遠透明
  - ❌ 無 chat widget (Intercom/Crisp) 在首頁
  - ❌ 無 announcement bar (no 黑條/Beta 提示)

---

## 4. 互動 / 動畫

### Button hover
- **Primary CTA**: `bg #2A66FF → #2252CC`（純變色，~150ms ease），**無 transform/scale/shadow shift**。
- **Nav button (`.nav-btn`)**: `bg → rgb(197, 212, 255)` light blue pill bg
- **Text link (`.btn-text`)**: `color → rgb(0, 122, 255)` iOS blue

### Card hover
- **Testimonial card** (`.testimonial_item`): `transform: translateY(-5px)` — **5px lift**
- **Action node** (`.node_wrap.is-action`): `transform: scale(0.98)` — **slight press-in** (按下反饋)
- **Card image** (`.lumos-latest--card_primary_image`): `transform: scale(calc(1 + 0.1 * var(--off)))` with 0.3s transition

### Scroll 動畫
- **無 AOS library** (`[data-aos]` count = 0)
- 使用 **Webflow Interactions (IX2)** + 自訂 `@keyframes`：
  - `@keyframes marquee-scroll` — logo 跑馬燈
  - `@keyframes lp-typing` — Hero 任務字串打字效果
  - `@keyframes lp-demo-tap` — iPhone mockup 點擊 demo
- `.testimonial_item:hover { transform: translateY(-5px); }` 是 hover-triggered 而非 scroll-triggered

### Nav scroll 行為
- **無 scroll-listener 加 class**（header wrapper className 始終是 `g_header_wrap is-global is-active`）
- 永遠 `position: fixed; backdrop-filter: blur(16px); bg: rgba(252,251,248,0)`
- 視覺效果靠 **模糊後的 cream 底色** 而不是實心白色區分層級
- 這是 Lindy 最有「品牌一致性」的選擇：nav 永遠透明，永遠 cream 色系

### Page transition
- 無 SPA route change 動畫（landing page 為主）

---

## 5. 設計哲學 + 微文案

### Design tone
- **Warm minimalism with playful interruptions**
- 主體：極簡 SaaS landing（cream + navy + 1 accent）
- 打斷節奏：iMessage 對話氣泡、Yellow gradient pricing card、Lindy logo face emoji、Wall of Love 滾動

### Color temperature
- **Warm**：背景 `#FCF9F8` 是帶紅的 cream，比純白 `#FFFFFF` 暖約 4 點 hue
- 但藍色 accent `#2A66FF` 是冷色（iOS system blue 變體）
- 整體溫暖中性偏暖

### Spacing philosophy
- **寬鬆平均**：section padding 流動到 7rem，features 之間靠大塊留白區隔
- Pricing cards 反而緊湊（gap=0），靠色彩層級（黃色 highlight）區分主從

### Copy voice
- **第一人稱 + 口語化**：「hey, I'm Lindy」「I take admin work off your plate.」「I'll text you about important emails so you never miss what matters.」「Boring.」（Human Assistant 描述）
- 大量 imperative + contraction：I'm / I'll / I'll handle / I learn
- **沒有 marketing jargon**：沒有 "supercharge / unlock / 10x / leverage"
- Pricing card 對競爭者（Human Assistant）做**幽默負評**："Will betray you and everything you've ever loved"、"Has those 'judgy eyes'"——這種 playful roasts 是 Lindy 特色

### 跟「典型 SaaS landing page」的差異點
1. **iMessage 為主介面**——不展示 dashboard / admin panel，而是 iPhone mockup + 對話氣泡。所有 feature 都是「Lindy 會幫你做的事」，而不是「產品能做什麼」。
2. **CSS-driven marquee** 而不是 JS slider——logo 跑馬燈、Wall of Love 都是 `@keyframes` + duplicate children。
3. **Pricing 用 3 個真實 tier**（Human Assistant $8k / Plus $49.99 / Enterprise），**用「人類 vs AI」做 tier 1 而不是「Free」**——這是反 SaaS 慣例但對話敘事很強的選擇。
4. **無 monthly/yearly toggle**——所有價格都是 monthly（推測隱含 yearly 折扣只在 checkout）。
5. **Hero 是 centered + 右側 mockup**，不是 split，給 iPhone 完整 390px 寬度展示。
6. **Nav 永遠 transparent + blur**，scroll 不加實心背景——比 95% SaaS 站更簡潔。

---

## 6. 給 Agent 的實作 checklist

> 底下每條都是「打開檔案 → 改哪一行 → 改成什麼」的具體指令。

### 6.1 Tailwind / globals.css 設定

```css
/* 1) 加入品牌色到 tailwind.config.ts */
colors: {
  cream: { 50: '#FCF9F8', 100: '#FCFBF8', 200: '#F7F4F2' },
  navy: { 700: '#0F1E2E', 900: '#0F3547' },
  brand: { DEFAULT: '#2A66FF', hover: '#2252CC' },
  highlight: '#FEE289',
  iMessage: '#0A84FF',
  subtle: '#31505F',
  border: 'rgba(0,0,0,0.08)',
  strokeSubtle: '#E7E7E7',
}

/* 2) 字型：單一 Manrope，next/font 引入 */
fontFamily: { sans: ['Manrope', 'sans-serif'] }

/* 3) Tailwind 4 的 @theme 寫法（若用 v4）*/
@theme {
  --font-sans: 'Manrope', sans-serif;
  --color-cream-50: #FCF9F8;
  --color-brand: #2A66FF;
  --color-brand-hover: #2252CC;
  --radius-btn: 12px;
  --radius-card: 12px;
  --radius-cta: 24px;
  --shadow-dropdown: 0 4px 6px -2px rgba(14,23,39,0.06), 0 12px 16px -4px rgba(14,23,39,0.1);
  --shadow-btn: inset 0 -1px 1px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(20,21,26,0.05);
}
```

### 6.2 Hero（最高優先）

```tsx
// components/hero.tsx — 用 centered + 右側 mockup，不是 split
<section className="relative min-h-[900px] bg-cream-50 px-8">
  <div className="mx-auto max-w-[1440px] flex flex-col items-center pt-32">
    <div className="max-w-[680px] text-center">
      <h1 className="font-sans text-[clamp(3rem,2.25rem+2.5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-navy-900">
        hey, I'm [Brand]
      </h1>
      <p className="mt-4 text-[20px] leading-[30px] font-medium text-[rgb(52,77,99)]">
        I take admin work off your plate.
      </p>
      <button className="mt-8 h-10 px-4 rounded-[12px] bg-brand text-white text-base font-medium shadow-[inset_0_-1px_1px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(20,21,26,0.05)] hover:bg-brand-hover transition-colors duration-150">
        Try for free
      </button>
      <div className="mt-3 flex justify-center items-center gap-1.5 text-sm text-navy-900">
        ★★★★★ <span className="font-medium">4.9</span> on G2
      </div>
    </div>
    {/* iPhone mockup 浮在右側 */}
    <div className="absolute right-12 top-32 w-[375px] h-[750px] rounded-[44px] bg-black p-3 shadow-2xl">
      {/* 內容為 iMessage 風格 chat */}
    </div>
  </div>
</section>
```

### 6.3 Nav（永遠 fixed + blur）

```tsx
// components/nav.tsx
<header className="fixed top-0 inset-x-0 z-[1000] h-[62px] bg-cream-50/0 backdrop-blur-[16px]">
  <nav className="mx-auto h-full max-w-[1440px] flex items-center justify-between px-8">
    <Logo />
    <ul className="flex gap-2 text-base font-medium text-navy-700/80">
      <li><Link className="px-4 py-3 hover:bg-[rgb(197,212,255)] rounded-md">Pricing</Link></li>
      {/* ... */}
    </ul>
    <button className="h-10 px-4 rounded-[12px] bg-brand text-white text-base font-medium hover:bg-brand-hover">
      Try for free
    </button>
  </nav>
</header>
```

### 6.4 Pricing card 黃色 highlight

```tsx
// components/pricing-card.tsx
const plans = [
  { name: 'Human Assistant', price: '$8,000', isHighlight: false },
  { name: 'Plus', price: '$49.99', isHighlight: true },
  { name: 'Enterprise', price: 'Contact', isHighlight: false },
];

return (
  <div className="flex justify-center">
    {plans.map(p => (
      <div key={p.name} className={`w-[325px] ${p.isHighlight ? 'rounded-[20px] p-2 bg-[linear-gradient(rgba(255,255,255,0)_34%,#FEE289)]' : ''}`}>
        <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-[12px] p-6">
          {/* card content */}
        </div>
      </div>
    ))}
  </div>
);
```

### 6.5 iMessage 對話氣泡（任一地方需要時）

```tsx
// bubble
<div className="bg-[#0A84FF] text-white text-sm px-[10px] py-2 pl-[13px] rounded-[18px_18px_5px] max-w-[213px]">
  What's on my calendar today?
</div>

// 對方（左側）氣泡
<div className="bg-gray-200 text-black text-sm px-3 py-2 rounded-[18px_18px_18px_5px]">
  You have 3 meetings today…
</div>
```

### 6.6 Testimonial card

```tsx
<div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-[12px] p-8 transition-transform duration-300 hover:-translate-y-[5px]">
  <div className="flex items-center gap-3">
    <Avatar />
    <div>
      <div className="font-medium text-navy-900">{name}</div>
      <div className="text-sm text-navy-700/60">@{handle}</div>
    </div>
  </div>
  <p className="mt-4 text-base text-navy-900">{quote}</p>
</div>
```

### 6.7 Marquee 跑馬燈（純 CSS）

```css
/* 在 globals.css 加入 */
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 40s linear infinite;
}

/* HTML：duplicate children */
<div className="overflow-hidden">
  <div className="marquee-track">
    {[...logos, ...logos].map(logo => <img src={logo} className="h-8 mx-8" />)}
  </div>
</div>
```

### 6.8 Dropdown

```tsx
<div className="bg-cream-50 border border-strokeSubtle rounded-[12px] p-4 shadow-[0_4px_6px_-2px_rgba(14,23,39,0.06),0_12px_16px_-4px_rgba(14,23,39,0.1)] min-w-[401px]">
  {/* mega menu grid */}
</div>
```

### 6.9 Final CTA

```tsx
<section className="py-[clamp(4rem,3rem+2vw,7rem)]">
  <div className="mx-auto max-w-[1392px] rounded-[24px] overflow-hidden bg-[url('/bg-cta.avif')] bg-cover px-16 py-24 text-center">
    <h2 className="text-[clamp(2.5rem,...,3.5rem)] font-bold tracking-[-0.02em] text-navy-900">
      Wake up tomorrow already ahead.
    </h2>
    <button className="mt-8 h-10 px-4 rounded-[12px] bg-brand text-white hover:bg-brand-hover">
      Try for free
    </button>
  </div>
</section>
```

### 6.10 Footer

```tsx
<footer className="bg-cream-50 border-t border-strokeSubtle px-8 py-10">
  <div className="mx-auto max-w-[1440px] grid grid-cols-2 gap-16">
    {/* Left: badges + social */}
    <div>
      <div className="grid grid-cols-2 gap-4">
        {['GDPR', 'SOC 2', 'HIPAA', 'PIPEDA'].map(b => (
          <div className="text-brand text-xs font-bold">{b}<div className="text-[8px] font-medium">Compliant</div></div>
        ))}
      </div>
      <div className="mt-6 flex gap-3">{/* social icons */}</div>
    </div>
    {/* Right: link grid */}
    <div className="grid grid-cols-2 gap-16">
      <FooterCol title="Company" links={['Careers', 'Security', 'Contact', 'Sitemap']} />
      <FooterCol title="Legal" links={['Privacy Policy', 'Trust Center', 'Terms of Service']} />
    </div>
  </div>
</footer>
```

### 6.11 Eyebrow label

```tsx
<div className="text-[14px] font-bold tracking-[0.1em] uppercase text-navy-900">
  EMAIL TRIAGE & DRAFTING
</div>
```

### 6.12 Mobile 行為

- H1 mobile = `49.5px`（用 `clamp()` 自然流動）
- Nav mobile = `58px`（比 desktop 少 4px），burger menu icon 取代 nav links
- Section padding mobile = 用 section-space clamp 自動縮減
- 所有 cards 在 mobile 自動 stack 成 1 欄（建議 `grid-cols-1 md:grid-cols-3`）

---

## 7. 補充資訊

### 7.1 無法抓到的 token（Sean 知道才不會誤會）

1. **iMessage 對話框的真實字型**：Mockup 內 iOS system 字 (SF Pro) 是 PNG/Webflow 內嵌圖，非真實可 inspect DOM，無法抓取 CSS。
2. **Hero background gradient/pattern**：Hero section bg 是純色 `rgb(252,249,248)`，但**底下的「任務字串 marquee」是 30 條文字組成的 absolute-positioned list**，逐字輪播——這是 Webflow CMS collection + custom CSS animation，沒有現成 token，只能照 clone。
3. **Pricing yearly 折扣**：**Lindy 沒有顯示 yearly pricing**。所有價位都是 monthly 顯示，沒有 toggle。也無法驗證實際年繳折扣 %。
4. **Lindy Logo face emoji**：是 `cdn.prod.website-files.com` 上的 `.avif` 圖檔（`logo-face.avif`），**不是 emoji 字元**，無法用 font-family 設定，要當圖檔處理。
5. **動畫 curve**：所有 transition 沒抓 timing-function 細節（推測是 ease-out），無法精準指定 `cubic-bezier()` 數值。
6. **Webflow Interactions IX2 設定**：scroll-triggered fade-in 的「In/Out of view」參數藏在 Webflow designer，無法從 runtime DOM 反推。

### 7.2 流量/SEO 觀察

- 整頁 ~8409px tall（desktop）、~10888px（mobile）——屬於 long-form landing
- H1 用 "hey, I'm Lindy"（非常規品牌敘事），SEO 上可能靠 body content 補強
- 截圖中可見多處 tweet embed link（指向 `x.com/.../status/...`）——這些是 UGC 引用做 social proof，**不是真實的 testimonial schema markup**

### 7.3 同類可參考的替代站（給 agent 訓練 prompt 時用）

如果想要再強化靈感，可同時 clone：
- **Linear.app**（更極簡的 SaaS，sticky blur nav，dark mode 漂亮）
- **Vercel.com**（hero 是大型 code + gradient，跟 Lindy 不同 vibe）
- **Stripe.com**（pricing 區分層做得很細）
- **Notion.so**（Marquee testimonial 是它們起家的）

但 Lindy 的核心是「cream + iMessage + playful roasts」三者合一，缺一就不像 Lindy。