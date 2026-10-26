# STS Dashboard - Design System Guide

## ภาพรวม

Design System สำหรับ STS Dashboard ที่สร้างขึ้นเพื่อให้:
- 🎨 **สม่ำเสมอ** - ใช้ Design Tokens ร่วมกันทุกส่วน
- 📱 **Responsive** - Mobile-first รองรับทุกขนาดหน้าจอ
- 🇹🇭 **รองรับไทย** - ฟอนต์ Prompt, line-height, word-break ที่เหมาะสม
- ⚡ **Bootstrap 5 + SweetAlert2** - ใช้ utility classes และ theme ได้เลย

---

## 📁 โครงสร้างไฟล์

```
src/
├── styles/
│   ├── tokens/                    # Design Tokens (Core)
│   │   ├── index.css              # Import all tokens
│   │   ├── colors.css             # สี + Bootstrap 5 + SA2 mapping
│   │   ├── spacing.css            # Spacing scale + fluid
│   │   ├── typography.css         # Fluid type + Thai optimize
│   │   ├── borders.css            # Radius + border widths
│   │   ├── shadows.css            # Layered shadows
│   │   ├── transitions.css        # Animation timing
│   │   ├── breakpoints.css        # Responsive breakpoints
│   │   ├── layout.css             # Layout tokens
│   │   ├── z-index.css            # Z-index scale
│   │   └── components.css         # Component tokens (Card, Table, Modal, Form, Button, Badge, etc.)
│   ├── components/                # Component-specific styles
│   │   ├── table-responsive.css   # Responsive table patterns
│   │   └── form-responsive.css    # Responsive form patterns
│   └── sweetalert2-theme.css      # SweetAlert2 theme (CSS variables)
├── utils/
│   ├── swal.js                    # SweetAlert2 helper (NEW - ใช้ตัวนี้)
│   └── toast.js                   # Legacy toast (deprecated)
└── App.css                        # Main stylesheet (imports tokens + components)
```

---

## 🎨 Design Tokens Usage

### Colors (ใน CSS)

```css
/* Semantic colors - ใช้ตัวนี้แทน hardcode */
color: var(--text-primary);
background: var(--bg-surface);
border-color: var(--border-subtle);

/* Status colors */
--status-available-bg: var(--color-success-light);
--status-available-text: var(--color-success);

/* Bootstrap 5 mapping - ใช้ class ได้เลย */
.bg-primary { background: var(--bs-primary); }
.text-danger { color: var(--bs-danger); }
.border-success { border-color: var(--bs-success); }
```

### Spacing

```css
/* Fixed spacing */
padding: var(--space-md);    /* 8px */
margin: var(--space-lg);     /* 16px */

/* Fluid/responsive spacing */
padding: var(--space-fluid-md);  /* 16-32px ขึ้นกับ viewport */
gap: var(--space-fluid-lg);      /* 24-48px */
```

### Typography

```css
/* Fluid type scale */
font-size: var(--text-base);    /* 15-16px responsive */
font-size: var(--text-xl);      /* 20-22px responsive */
line-height: var(--leading-body);  /* 1.45 - Thai friendly */

/* Classes */
.thai-text { }           /* Thai optimizations */
.text-balance { }        /* text-wrap: balance */
.text-pretty { }         /* text-wrap: pretty */
```

---

## 📱 Responsive Breakpoints

```css
/* Bootstrap 5 standard */
--bp-sm: 576px;   /* Landscape phones */
--bp-md: 768px;   /* Tablets */
--bp-lg: 992px;   /* Small laptops */
--bp-xl: 1200px;  /* Desktops */
--bp-xxl: 1400px; /* Large desktops */

/* Usage in CSS */
@media (min-width: 768px) { ... }
@media (max-width: 767.98px) { ... }
```

---

## 📊 Table Patterns

### 1. Horizontal Scroll (Default)
```jsx
<div className="table-responsive">
  <table className="table">
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</div>
```

### 2. Card Layout (Mobile < 768px)
```jsx
<table className="table table-card-layout">
  <thead>
    <tr><th>ชื่อ</th><th>สถานะ</th><th>Action</th></tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="ชื่อ">MacBook Pro</td>
      <td data-label="สถานะ"><span className="badge bg-success">พร้อมใช้</span></td>
      <td data-label="Action" className="actions">
        <button className="btn btn-sm btn-primary">รายละเอียด</button>
      </td>
    </tr>
  </tbody>
</table>
```
- บน Mobile: แสดงเป็นการ์ด์ พร้อม label
- บน Tablet+: แสดงเป็นตารางปกติ

### 3. Priority Columns
```jsx
<table className="table table-priority">
  <thead>
    <tr>
      <th>ชื่อ</th>
      <th className="col-priority-medium">แผนก</th>
      <th className="col-priority-low">หมายเหตุ</th>
      <th>Action</th>
    </tr>
  </thead>
```
- Mobile: แสดงเฉพาะคอลัมน์สำคัญ
- Tablet: เพิ่ม medium priority
- Desktop: แสดงทั้งหมด

### 4. Expandable Rows
```jsx
<table className="table table-expandable">
  <tbody>
    <tr>
      <td><button className="expand-toggle" aria-expanded="false">▼</button></td>
      <td>MacBook Pro</td>
    </tr>
    <tr className="expandable-row">
      <td colspan="4">
        <div className="expandable-content">รายละเอียดเพิ่มเติม...</div>
      </td>
    </tr>
  </tbody>
</table>
```

---

## 📝 Form Patterns

### 1. Responsive Grid
```jsx
<div className="form-grid">
  <div className="form-group">
    <label className="form-label required">ชื่ออุปกรณ์</label>
    <input className="form-control" />
  </div>
  <div className="form-group">
    <label className="form-label">หมวดหมู่</label>
    <select className="form-select">...</select>
  </div>
</div>
```
- Mobile: stacked (1 column)
- Tablet+: 2 columns
- Desktop: 3-4 columns with `.cols-3`, `.cols-4`

### 2. Horizontal Form (Label left, Input right)
```jsx
<div className="form-label-inline">
  <label className="form-label">ชื่ออุปกรณ์</label>
  <input className="form-control" />
</div>
```
- Mobile: stacked
- Desktop: label 160px fixed, input flexible

### 3. Inline Form (Search/Filter bar)
```jsx
<form className="form-inline">
  <label className="form-label">ค้นหา</label>
  <input className="form-control search-input" placeholder="ค้นหา..." />
  <select className="form-select search-select">...</select>
  <button className="btn btn-primary">ค้นหา</button>
</form>
```

### 4. Filter Sidebar with Toggle
```jsx
{/* Mobile toggle button */}
<button className="filter-toggle" aria-expanded={isOpen} onClick={toggle}>
  ตัวกรอง <span className="filter-count">{count}</span>
</button>

{/* Filter panel */}
<div className={`filter-panel ${isOpen ? 'open' : ''}`}>
  <div className="form-filter">
    <div className="filter-group">
      <label className="form-label">สถานะ</label>
      <select className="form-select">...</select>
    </div>
    <div className="filter-group-inline">
      <div className="form-group">
        <label className="form-label">วันที่เริ่ม</label>
        <input type="date" className="form-control" />
      </div>
      <div className="form-group">
        <label className="form-label">วันที่สิ้นสุด</label>
        <input type="date" className="form-control" />
      </div>
    </div>
  </div>
</div>
```

### 5. Multi-step Form (Wizard)
```jsx
<div className="form-wizard">
  {/* Steps indicator */}
  <div className="form-wizard-steps">
    <div className="form-wizard-step completed">
      <div className="form-wizard-step-circle">1</div>
      <span className="form-wizard-step-label">ข้อมูลพื้นฐาน</span>
    </div>
    <div className="form-wizard-step active">
      <div className="form-wizard-step-circle">2</div>
      <span className="form-wizard-step-label">รายละเอียด</span>
    </div>
    <div className="form-wizard-step">
      <div className="form-wizard-step-circle">3</div>
      <span className="form-wizard-step-label">ยืนยัน</span>
    </div>
  </div>

  {/* Step content */}
  <div className="form-wizard-content">
    <form>...</form>
  </div>

  {/* Navigation */}
  <div className="form-wizard-actions">
    <button className="btn btn-secondary">ย้อนกลับ</button>
    <button className="btn btn-primary">ถัดไป</button>
  </div>
</div>
```

### 6. Collapsible Form Sections
```jsx
<div className="form-sections">
  <div className="form-section collapsible">
    <div className="form-section-header" onClick={toggleSection}>
      <h3 className="form-section-title">ข้อมูลอุปกรณ์</h3>
      <p className="form-section-description">กรอกข้อมูลพื้นฐานของอุปกรณ์</p>
      <span className="form-section-toggle">▼ ขยาย/ยุบ</span>
    </div>
    <div className="form-section-body">
      {/* form fields */}
    </div>
    <div className="form-section-footer">
      <button className="btn btn-primary">บันทึก</button>
    </div>
  </div>
</div>
```

---

## 🔔 SweetAlert2 Helper (swal.js)

### Import
```javascript
import { 
  swalConfirm, 
  swalAlert, 
  swalSuccess, 
  swalError, 
  swalWarning,
  swalLoading,
  swalClose,
  swalToast,
  swalToastSuccess,
  swalConfirmDelete,
  swalConfirmWithdraw 
} from '@/utils/swal';
```

### Usage Examples

```javascript
// Confirmation dialog
const result = await swalConfirmDelete({
  title: 'ลบอุปกรณ์นี้?',
  text: 'MacBook Pro M2 - SN: ABC123'
});
if (result.isConfirmed) {
  // delete...
}

// Withdraw confirmation
const result = await swalConfirmWithdraw({
  title: 'ยืนยันการเบิกอุปกรณ์?',
  text: 'MacBook Pro M2 - พร้อมใช้งาน 5 เครื่อง'
});

// Success toast (auto-dismiss)
swalToastSuccess('บันทึกข้อมูลสำเร็จ');

// Error toast
swalToastError('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');

// Loading
swalLoading('กำลังบันทึก...');
await api.save(data);
swalClose();

// Input dialog
const value = await swalInput({
  title: 'เพิ่มหมายเลขเครื่อง',
  inputPlaceholder: 'กรอก Serial Number'
});

// Textarea
const value = await swalTextarea({
  title: 'หมายเหตุการซ่อม',
  inputPlaceholder: 'รายละเอียดอาการเสีย'
});

// Select dropdown
const value = await swalSelect({
  title: 'เลือกสถานะ',
  inputOptions: {
    available: 'พร้อมใช้งาน',
    withdrawn: 'ถูกเบิกแล้ว',
    repair: 'ส่งซ่อม'
  }
});
```

---

## 🔧 Bootstrap 5 Utility Classes

### Spacing (ใช้ tokens ผ่าน class)
```jsx
<div className="p-3 m-2">           {/* var(--space-md) = 8px */}
<div className="px-4 py-3">         {/* padding x/y */}
<div className="gap-3">             {/* flex gap */}
<div className="mx-auto">           {/* center horizontal */}
```

### Typography
```jsx
<h1 className="display-4">          {/* var(--text-4xl) */}
<h2 className="display-5">          {/* var(--text-3xl) */}
<h3 className="h3">                 {/* var(--text-2xl) */}
<p className="lead">                {/* var(--text-lg) */}
<small className="text-muted">     {/* var(--text-sm) + muted color */}
```

### Colors (Semantic)
```jsx
<div className="bg-primary text-white">      {/* Primary brand */}
<div className="bg-success text-white">      {/* Success */}
<div className="bg-warning text-dark">       {/* Warning */}
<div className="bg-danger text-white">       {/* Danger */}
<div className="bg-light border">            {/* Light surface */}
<div className="bg-dark text-white">         {/* Dark surface */}

<button className="btn btn-primary">         {/* Primary button */}
<button className="btn btn-outline-primary"> {/* Outline primary */}
<button className="btn btn-ghost">           {/* Ghost/link style */}
```

### Badges
```jsx
<span className="badge bg-success">พร้อมใช้งาน</span>
<span className="badge bg-warning text-dark">รออนุมัติ</span>
<span className="badge bg-danger">ส่งซ่อม</span>
<span className="badge bg-secondary">ไม่พร้อมใช้</span>
```

### Cards
```jsx
<div className="card shadow-sm">
  <div className="card-header bg-light">
    <h5 className="card-title mb-0">หัวข้อ</h5>
  </div>
  <div className="card-body">
    <p className="card-text">เนื้อหา</p>
  </div>
  <div className="card-footer bg-light">
    <button className="btn btn-sm btn-primary">Action</button>
  </div>
</div>
```

---

## ♿ Accessibility

### Focus States
```css
/* ทุก interactive element มี focus ring */
:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

### Thai Language Support
```css
/* ป้องกันตัดคำไทยกลางคำ */
* { word-break: keep-all; overflow-wrap: anywhere; }

/* Line height สำหรับไทย */
.thai-text { line-height: var(--leading-body); }  /* 1.45 */
```

---

## 🚀 การย้ายจาก Code เดิม

### Before (Hardcoded)
```jsx
<div style={{ padding: '16px', background: '#fff', borderRadius: '8px' }}>
  <h3 style={{ color: '#0066FF', fontSize: '20px' }}>Title</h3>
  <button style={{ background: '#0066FF', color: '#fff', padding: '8px 16px' }}>
    Action
  </button>
</div>
```

### After (Design Tokens)
```jsx
<div className="card">
  <div className="card-body">
    <h3 className="card-title text-primary">Title</h3>
    <button className="btn btn-primary">Action</button>
  </div>
</div>
```

### หรือใช้ CSS Variables
```css
.custom-card {
  padding: var(--card-padding);
  background: var(--card-bg);
  border-radius: var(--card-radius);
  border: 1px solid var(--card-border);
}
.custom-title {
  color: var(--bs-primary);
  font-size: var(--text-xl);
}
```

---

## 📋 Checklist ก่อน Deploy

- [ ] ทุกสีใช้ `var(--bs-*)` หรือ `var(--color-*)` แทน hardcode
- [ ] ทุก spacing ใช้ `var(--space-*)` หรือ utility class
- [ ] ทุก font-size ใช้ `var(--text-*)` หรือ responsive clamp()
- [ ] ทุก border-radius ใช้ `var(--radius-*)`
- [ ] ทุก shadow ใช้ `var(--shadow-*)`
- [ ] ทุก transition ใช้ `var(--transition-*)`
- [ ] ทุก z-index ใช้ `var(--z-index-*)`
- [ ] Table ใช้ `.table-responsive` หรือ `.table-card-layout`
- [ ] Form ใช้ `.form-grid` หรือ `.form-responsive`
- [ ] SweetAlert2 ใช้ `swal.js` helper
- [ ] ทดสอบบน 375px, 768px, 1024px, 1440px
- [ ] ทดสอบ dark mode (ถ้ามี)
- [ ] ทดสอบ `prefers-reduced-motion`
- [ ] ทดสอบ keyboard navigation (Tab, Enter, Escape)
- [ ] ทดสอบ screen reader (NVDA, VoiceOver)

---

## 🔄 Migration Guide

### ไฟล์ที่อัปเดตแล้ว
- ✅ `src/styles/tokens/colors.css` - Added Bootstrap 5 + SA2 mapping
- ✅ `src/styles/tokens/spacing.css` - Bootstrap 5 scale + fluid
- ✅ `src/styles/tokens/typography.css` - Fluid type + Thai optimize
- ✅ `src/styles/tokens/components.css` - NEW: Component tokens
- ✅ `src/styles/components/table-responsive.css` - NEW: Table patterns
- ✅ `src/styles/components/form-responsive.css` - NEW: Form patterns
- ✅ `src/styles/sweetalert2-theme.css` - NEW: SA2 theme
- ✅ `src/utils/swal.js` - NEW: SA2 helper
- ✅ `src/App.css` - Added component imports

### ไฟล์ที่ควรอัปเดตต่อไป
- ⬜ Components ใช้ utility classes แทน inline styles
- ⬜ แทนที่ `toast.js` ด้วย `swal.js` helpers
- ⬜ เพิ่ม `data-label` attributes ใน table cells สำหรับ card layout
- ⬜ เพิ่ม `col-priority-*` classes ใน table headers

---

## 📚 Resources

- [Bootstrap 5 Utilities](https://getbootstrap.com/docs/5.3/utilities/)
- [SweetAlert2 Docs](https://sweetalert2.github.io/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Fluid Typography](https://utopia.fyi/type/calculator/)
- [Thai Web Typography](https://github.com/googlefonts/thai-fonts)

---

*Last updated: 2026-10-26*
*Version: 1.0.0*