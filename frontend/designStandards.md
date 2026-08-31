# Design Standards
To ensure that consistency is observed throughout the website, this markdown file shall act as a guideline to designing. 

## 🎨 Color Palette

### Primary Colors
| Usage | Color | Hex |
|-------|-------|-----|
| Headings, Main text | Dark Navy | `#10245C` |
| Primary button default | Bright Blue | `#2168D7` |
| Button hover state | Darker Blue | `#0B2C78` |
| Icons, Card icons | Light Blue | `#2878E8` |

### Secondary Colors
| Usage | Color | Hex |
|-------|-------|-----|
| Badge text | Medium Blue 1 | `#2365B3` |
| Benefit icons & borders | Medium Blue 2 | `#2580D9` |
| Detect card list items | Medium Blue 3 | `#286DB5` |

### Neutral Colors
| Usage | Color | Hex |
|-------|-------|-----|
| Navigation text | Dark Gray | `#17223D` |
| Benefit/Feature titles | Dark Gray 2 | `#182440` |
| Card text | Dark Gray 3 | `#273550` |
| Secondary text, Paragraphs | Medium Gray 1 | `#5F6D84` |
| Labels, Small text | Medium Gray 2 | `#69758A` |
| Benefit descriptions | Medium Gray 3 | `#6B778C` |
| Footer, Logo subtitle | Medium Gray 4 | `#68758D` |

### Background & Surface
| Usage | Color | Hex |
|-------|-------|-----|
| Main backgrounds, Cards | White | `#FFFFFF` |
| Footer background | Light Blue 1 | `#EEF6FF` |
| Hero gradient start | Light Blue 2 | `#E9F4FF` |
| Hero gradient middle | Light Blue 3 | `#F5F9FF` |
| Badges | Light Blue 4 | `#E9F3FF` |
| Feature icons | Light Blue 5 | `#F0F5FF` |

### Borders
| Usage | Color | Hex |
|-------|-------|-----|
| Navbar border | Light Gray 1 | `#E8EDF5` |
| Feature cards | Light Gray 2 | `#E2E7EF` |
| Floating cards | Light Gray 3 | `#E3EAF4` |
| Login button | Light Gray 4 | `#DCE2EC` |
| Secondary button | Light Gray 5 | `#CFD8E8` |

### Status Colors
| Usage | Color | Hex |
|-------|-------|-----|
| Good status, Success | Green | `#25A878` |
| Analysis card score | Navy Blue | `#123A91` |

---

## 🔤 Typography

### Font Family
- **Primary**: Arial, Helvetica, sans-serif

### Font Weights
| Weight | Value | Usage |
|--------|-------|-------|
| Normal | 400 | Body text, Paragraphs, Small text |
| Semibold | 600 | Navigation, Buttons, Badges |
| Bold | 700 | Headings, Icons, Strong text |

### Type Scale
| Element | Size |
|---------|------|
| Hero Heading | `clamp(44px, 5vw, 68px)` |
| Section Title | `32px` |
| Logo Text | `24px` |
| Hero Paragraph | `20px` |
| Benefit Icon | `19px` |
| Feature Title | `16px` |
| Navigation Link | `15px` |
| Badge Text | `15px` |
| Benefit Title | `14px` |
| Card Text | `13px` |
| Footer Text | `13px` |
| Logo Subtitle | `12px` |
| Benefit Description | `12px` |

### Line Heights
| Element | Value |
|---------|-------|
| Hero Heading | `1.08` |
| Logo Text | `1.1` |
| Benefit Descriptions | `1.5` |
| Feature Descriptions | `1.55` |
| Paragraph Text | `1.6` |

### Letter Spacing
| Element | Value |
|---------|-------|
| Hero Heading | `-2px` |

---

## 📐 Spacing System

### Common Spacing Values
| Value | Usage |
|-------|-------|
| `3px` | Logo subtitle top, Benefit title bottom |
| `5px` | Analysis card small text |
| `7px` | Card icons, Feature titles |
| `8px` | Detect card list top |
| `10px` | Badge padding vertical |
| `12px` | Logo gap, Benefit gap |
| `13px` | Login button padding |
| `14px` | Nav buttons gap, Button padding |
| `15px` | Hero buttons gap |
| `18px` | Feature cards gap, Floating cards padding |
| `20px` | Benefits gap, Feature cards horizontal padding |
| `25px` | Feature grid gap, Feature cards vertical padding |
| `27px` | Primary button horizontal padding |
| `28px` | Login button horizontal padding |
| `29px` | Secondary button horizontal padding |
| `30px` | Hero paragraph bottom |
| `35px` | Hero sections gap, Section title bottom |
| `38px` | Navigation links gap |
| `42px` | Hero buttons bottom |
| `55px` | Hero/Why section vertical padding |
| `65px` | Hero top padding |
| `70px` | Why section bottom padding |
| `5%` | Page-level horizontal padding |

---

## 🏗️ Layout Patterns

### Grid Systems
| Pattern | Breakpoints | Gap |
|---------|-------------|-----|
| Hero | 1 col (mobile) → 2 cols (desktop) | `35px` |
| Benefits | 1 col (mobile) → 3 cols (desktop) | `20px` |
| Features | 1 col → 2 cols (tablet) → 4 cols (desktop) | `25px` |

### Container Max Widths
| Element | Max Width |
|---------|-----------|
| Hero Content | `650px` |
| Hero Paragraph | `540px` |
| Benefits Container | `750px` |
| Hero Image | `590px` |

### Common Flex Patterns
| Pattern | Usage |
|---------|-------|
| `flex items-center justify-between` | Navbar |
| `flex items-center gap-[Xpx]` | Logo, Benefits, Feature cards |
| `flex flex-col sm:flex-row` | Hero buttons (stack on mobile) |

---

## 🧩 Component Styles

### Buttons
| Type | Background | Text | Border | Hover |
|------|------------|------|--------|-------|
| Primary | `#123A91` | White | None | Darken + lift 2px |
| Secondary | White | `#182440` | `#CFD8E8` | Blue border + blue text |
| Login | White | Default | `#DCE2EC` | Blue border + blue text |

### Cards
| Type | Border | Shadow | Hover Effect |
|------|--------|--------|--------------|
| Feature | `#E2E7EF` | None | Lift 5px + shadow |
| Floating | `#E3EAF4` | `0 12px 35px rgba(35,77,130,0.12)` | None |

### Badge
- **Background**: `#E9F3FF`
- **Text**: `#2365B3`
- **Border Radius**: `25px`
- **Font Weight**: Semibold (600)

### Benefit Item
- **Icon**: Border circle with `#2580D9`
- **Title**: Bold, `#182440`
- **Description**: Normal, `#6B778C`

---

## 🔄 Interactive States

### Hover Effects
| Element | Effect |
|---------|--------|
| Primary Button | Darker background + lift 2px |
| Secondary Button | Blue border + blue text |
| Login Button | Blue border + blue text |
| Navigation Link | Blue text |
| Feature Card | Lift 5px + shadow |

### Transitions
- **Duration**: `300ms`
- **Properties**: All, Colors, Transform

---

## 📱 Responsive Breakpoints

| Breakpoint | Prefix | Min Width | Target Devices |
|------------|--------|-----------|----------------|
| Mobile | (none) | 0px | Phones |
| Small | `sm:` | 640px | Large phones |
| Medium | `md:` | 768px | Tablets |
| Large | `lg:` | 1024px | Desktops, Laptops |

### Common Responsive Patterns
| Pattern | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero Layout | 1 column | 1 column | 2 columns |
| Features Layout | 1 column | 2 columns | 4 columns |
| Benefits Layout | 1 column | 3 columns | 3 columns |
| Navigation | Hidden | Hidden | Visible |
| Buttons | Stacked | Row | Row |
| Text Alignment | Center | Center | Left |

---

## ✨ Effects & Shadows

### Shadows
| Name | Value | Usage |
|------|-------|-------|
| Card Shadow | `0 12px 35px rgba(35,77,130,0.12)` | Floating cards |
| Card Shadow Hover | `0 12px 30px rgba(38,75,130,0.1)` | Feature cards on hover |

### Gradients
| Name | Value | Usage |
|------|-------|-------|
| Logo Gradient | `from #2878E8 to #173D9C` | Logo icon |
| Hero Gradient | `radial-gradient(circle at 80% 45%, #E9F4FF 0%, #F5F9FF 35%, #FFFFFF 70%)` | Hero background |

### Transforms
| Effect | Value | Usage |
|--------|-------|-------|
| Lift Button | `translateY(-2px)` | Button hover |
| Lift Card | `translateY(-5px)` | Card hover |
| Scale Mobile | `scale(0.8)` | Floating cards on mobile |

---

## ♿ Accessibility

### Color Contrast
- All text meets WCAG 2.1 AA standards
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text

### Interactive Elements
- All interactive elements have hover/focus states
- Focus indicators clearly visible
- Touch targets minimum 44px

### Semantic HTML
- Use semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`

---

## 📝 Quick Reference

### Most Common Classes
```jsx
// Text Colors
text-[#10245c]    // Dark navy (headings)
text-[#2168d7]    // Bright blue (accents)
text-[#5f6d84]    // Medium gray (paragraphs)
text-white        // White (buttons)

// Background Colors
bg-[#123a91]      // Primary button
bg-white          // Cards, sections
bg-[#eef6ff]      // Footer
bg-[#e9f3ff]      // Badges

// Layout
flex items-center justify-between
grid grid-cols-1 lg:grid-cols-2 gap-[35px]

// Spacing
px-[5%] py-[14px]
p-[18px]
mb-[25px] mt-[3px]

// Typography
text-[24px] font-semibold font-bold
leading-[1.6] tracking-[-2px]