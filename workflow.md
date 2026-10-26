# STS Dashboard - บันทึกการเปลี่ยนแปลง (Workflow & Changes Log)

## ภาพรวม
เอกสารนี้บันทึกการเปลี่ยนแปลงทั้งหมดที่ทำในโปรเจกต์ STS Dashboard

---

## การเปลี่ยนแปลงตามวันที่

### 2026-10-26

#### 1. แก้ SweetAlert2 ให้แสดงตรงกลางจอ
**ปัญหา:** SweetAlert2 dialogs แสดงชิดขวาจอ แทนที่จะอยู่กลางจอ

**ไฟล์ที่แก้:**
- `src/utils/swal.js` - เพิ่ม `position: 'center'` ใน defaultOptions
- `src/styles/sweetalert2-theme.css` - เพิ่ม flexbox centering ให้ `.swal2-container`

**รายละเอียด:**
```javascript
// swal.js - บรรทัด 78
position: 'center',
```

```css
/* sweetalert2-theme.css - บรรทัด 22-28 */
.swal2-container {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: fixed !important;
  inset: 0 !important;
  z-index: var(--swal2-zindex, 1090) !important;
  padding: var(--swal2-container-padding, 0.625em) !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
}
```

**สาเหตุหลัก:** CSS ที่เขียนเองขาด `position: fixed` และ `inset: 0` บน container ทำให้ flex centering ไม่ทำงาน

---

#### 2. แก้สี Badge จากสีเทาเป็นสีดำ
**ปัญหา:** Badge ใช้ `badge-secondary` (สีเทา) แทนที่จะเป็นสีดำ/ดำ

**ไฟล์ที่แก้:**
- `src/components/DashboardContent.js` - 2 จุด
- `src/components/InventoryList.js` - 1 จุด

**การเปลี่ยนแปลง:**
```jsx
// ก่อน
<span className="badge badge-secondary">...</span>

// หลัง (Bootstrap 5 syntax)
<span className="badge bg-dark">...</span>
```

**ตำแหน่งที่แก้:**
- DashboardContent.js:171 - Badge ผู้ดูแลในตาราง
- DashboardContent.js:255 - Badge จำนวนรายการทั้งหมด
- InventoryList.js:351 - Badge จำนวนรายการทั้งหมด

---

#### 3. แก้หัวตารางหายไป (Header Missing)
**ปัญหา:** หัวคอลัมน์ตารางแสดงว่างเปล่า (โดยเฉพาะคอลัมน์ `#`)

**สาเหตุหลัก:** Table component คาดหวัง `column.label` แต่ column definitions ทั้งหมดใช้ `column.header`

**ไฟล์ที่แก้:**
- `src/components/ui/Table.jsx` - 2 จุด (บรรทัด 181, 252)

**วิธีแก้:**
```jsx
// ก่อน
<span>{column.label}</span>

// หลัง
<span>{column.header || column.label}</span>
```

**ตารางที่ได้รับผลกระทบ:**
- DashboardContent.js - ตารางรายการอุปกรณ์
- RepairDetails.js - ตารางซ่อมบำรุง
- Report.js - ตารางรายงาน
- InventoryList.js - ตารางสต็อก

---

#### 4. แก้ข้อความ Input ทับไอคอน
**ปัญหา:** ข้อความใน input field ทับกับไอคอนทางซ้าย (ไอคอนค้นหา)

**ไฟล์ที่แก้:**
- `src/components/ui/Input.css` - คลาส `.ui-input--has-icon`

**การเปลี่ยนแปลง:**
```css
/* ก่อน */
.ui-input--has-icon {
  padding-left: calc(var(--space-md) * 2 + 1.25rem);
}

/* หลัง (เพิ่ม !important เพื่อ specificity) */
.ui-input--has-icon {
  padding-left: 4rem !important;
}
```

**หมายเหตุ:** Dev server รันด้วย `--watch=off` ต้อง hard refresh (Ctrl+Shift+R) หรือ restart เพื่อเห็นการเปลี่ยนแปลง

---

#### 5. เพิ่มรองรับโลโก้บริษัท (Sidebar & Login)
**คำขอ:** เพิ่มพื้นที่สำหรับโลโก้บริษัทบน Sidebar header และหน้า Login

**ไฟล์ที่แก้:**
- `src/components/ui/Sidebar.jsx` - เพิ่ม props `logo`, `logoAlt`, `title`
- `src/components/ui/Sidebar.css` - เพิ่ม CSS สำหรับ logo image/custom
- `src/components/Login.jsx` - เพิ่ม props `logo`, `logoAlt`, `title`, `subtitle`
- `src/components/Login.css` - เพิ่ม CSS สำหรับ logo image/custom

**การใช้งาน - Sidebar:**
```jsx
<Sidebar
  items={menuItems}
  activeItem={activeItem}
  onItemClick={handleItemClick}
  user={user}
  onLogout={handleLogout}
  logo="/logo.png"              // URL รูปภาพ
  // หรือ logo={<MyLogoComponent />}  // React component
  logoAlt="บริษัท ABC จำกัด"
  title="STS Dashboard"
/>
```

**การใช้งาน - Login:**
```jsx
<Login
  logo="/logo.png"              // URL รูปภาพ
  // หรือ logo={<MyLogoComponent />}
  logoAlt="บริษัท ABC จำกัด"
  title="เข้าสู่ระบบ"
  subtitle="ระบบจัดการสต็อกอุปกรณ์ (STS)"
/>
```

**ขนาดโลโก้:**
| ตำแหน่ง | ขนาด Container | ขนาดรูป Max |
|----------|---------------|--------------|
| Sidebar (ขยาย) | 36×36px | 36×36px |
| Sidebar (ยุบ) | 36×36px | 32×32px |
| หน้า Login | 70×70px | 90×90px |

---

## หมายเหตุการพัฒนา

### Dev Server
- รันด้วย flag `--watch=off`
- **ต้อง reload เอง:** Hard refresh (Ctrl+Shift+R) หรือ restart `npm start`

### คำสั่ง Build
```bash
npm run build
```

### โครงสร้างไฟล์สำคัญ
```
src/
├── components/
│   ├── ui/
│   │   ├── Sidebar.jsx + Sidebar.css
│   │   ├── Table.jsx + Table.css
│   │   ├── Input.jsx + Input.css
│   │   └── Badge.css
│   ├── DashboardContent.js
│   ├── InventoryList.js
│   ├── RepairDetails.js
│   ├── Report.js
│   └── Login.jsx + Login.css
├── utils/
│   ├── swal.js          # SweetAlert2 helpers
│   └── toast.js         # Toast notifications
├── styles/
│   └── sweetalert2-theme.css
└── hooks/
    └── useAuth.js
```

---

## คำสั่งอ้างอิงเร็ว

```bash
# Build สำหรับ production
npm run build

# เริ่ม dev server
npm start

# Hard refresh browser (Windows/Linux)
Ctrl+Shift+R

# Hard refresh browser (Mac)
Cmd+Shift+R
```

---

## งานที่ต้องทำต่อ / TODOs

- [ ] เพิ่มโลโก้ในหน้าอื่นๆ (ถ้าจำเป็น)
- [ ] พิจารณาเพิ่ม favicon support
- [ ] เพิ่ม dark/light theme toggle ใน sidebar
- [ ] Optimize bundle size
- [ ] เพิ่ม unit tests

---

*อัปเดตล่าสุด: 2026-10-26*
