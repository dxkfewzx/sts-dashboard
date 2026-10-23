# Workflow - การแก้ไขหน้า Details และปุ่มจัดการข้อมูล

**วันที่:** 2026-10-23

---

## สรุปการแก้ไขวันนี้

### 1. แก้ไข Syntax Error ใน Details.js
- **ปัญหา:** Template literal (`${var}`) ทำให้ Babel parser error
- **แก้ไข:** แปลงเป็น string concatenation (`'string ' + var + ' string'`) ทุกจุดที่ error
- **ผลลัพธ์:** Build ผ่าน ไม่มี syntax error

### 2. ลบโค้ดซ้ำ (Duplicate Component)
- **ปัญหา:** ไฟล์ Details.js มี component `Details` ประกาศซ้ำ 2 ครั้ง (บรรทัดที่ 1 และบรรทัดที่ 832)
- **แก้ไข:** ลบ component ตัวเก่าออก เหลือเพียงตัวเดียวที่สมบูรณ์
- **ขนาดไฟล์:** ลดจาก 1592 บรรทัดเหลือ ~832 บรรทัด

### 3. กู้คืน Modal ที่หายไป
Modal 3 ตัวที่หายไปหลังลบโค้ดซ้ำ:
- **Return Modal** (รับคืนอุปกรณ์) - สำหรับรับคืนอุปกรณ์ที่สถานะ "เบิกออกแล้ว"
- **History Modal** (ประวัติการเบิก-คืน) - สำหรับดูประวัติของหมายเลขเครื่อง
- **Edit Modal** (แก้ไขหมายเลขเครื่อง) - สำหรับแก้ไขข้อมูลหมายเลขเครื่อง

**แก้ไข:** เพิ่ม JSX ของ modal ทั้ง 3 ตัวกลับเข้าไปในตำแหน่งที่ถูกต้อง (อยู่ภายใน outer `<div>` wrapper)

### 4. แก้ไข Prop `onReturn` และ `onWithdraw` ไม่ถูกส่งผ่าน
- **ปัญหา:** App.js ไม่ได้ส่ง `onWithdraw` และ `onReturn` ให้ AppContent ทำให้ Details ได้รับเป็น `undefined`
- **Error:** `TypeError: onReturn is not a function`
- **แก้ไข:** เพิ่ม `onWithdraw={onWithdraw}` และ `onReturn={onReturn}` ใน AppContent props

### 5. แก้ไข Prop `withdrawalLogs` ไม่ถูกส่งผ่าน
- **ปัญหา:** App.js ไม่ได้ส่ง `withdrawalLogs` ให้ AppContent ทำให้ประวัติไม่แสดงผล
- **แก้ไข:** เพิ่ม `withdrawalLogs={withdrawalLogs}` ใน AppContent props

### 6. เพิ่มรายละเอียดในหน้ารับคืน (Return Modal)
**คำขอจากผู้ใช้:** ล็อคเลข Job, หน่วยงาน, ชั้น, อาคาร จากขั้นตอนการเบิก ไปแสดงในประวัติการคืน

**การเปลี่ยนแปลง:**

**Details.js:**
- `handleOpenReturnModal`: Pre-fill `job_number`, `dept_used`, `building`, `floor` จากข้อมูล serial number
- Return Modal JSX: เพิ่มฟิลด์ read-only 4 ฟิลด์:
  - เลข Job (จากการเบิก)
  - หน่วยงาน (จากการเบิก)
  - อาคาร (จากการเบิก)
  - ชั้น (จากการเบิก)
- `handleReturnSubmit`: ส่ง field เพิ่มเติมเหล่านี้ไปให้ `onReturn`

**App.js - onReturn function:**
- รับ `job_number`, `dept_used`, `building`, `floor` จาก returnData
- บันทึกลง `withdrawal_logs` table พร้อมกับข้อมูลการคืน

---

## ไฟล์ที่แก้ไข

| ไฟล์ | การเปลี่ยนแปลงหลัก |
|------|------------------|
| `src/components/Details.js` | แก้ syntax error, ลบโค้ดซ้ำ, เพิ่ม modal 3 ตัว, เพิ่มฟิลด์ใน Return Modal |
| `src/App.js` | เพิ่ม props `onWithdraw`, `onReturn`, `withdrawalLogs` ให้ AppContent, อัปเดต onReturn function |

---

## การทดสอบ

1. **Build:** `npm run build` - ผ่าน ไม่มี error (มีแค่ ESLint warnings)
2. **Hard Refresh:** กด `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac) เพื่อโหลดโค้ดล่าสุด
3. **ทดสอบปุ่มจัดการ:**
   - ✅ ปุ่มแก้ไข (Edit) - เปิด Edit Modal
   - ✅ ปุ่มรับคืน (Return) - เปิด Return Modal พร้อมข้อมูลจากการเบิก
   - ✅ ปุ่มประวัติ (History) - เปิด History Modal
   - ✅ ปุ่มลบ (Delete) - ยืนยันแล้วลบ

---

## หมายเหตุ

- Error `Cannot read properties of undefined (reading 'M_ID')` ที่เห็นใน Console เป็นจาก **Chrome Extension** (eppiocemhmnlbhjplcgkofciiegomcon) ไม่ใช่โค้ดของเรา
- หากยังเจอปัญหา ให้ Hard Refresh อีกครั้ง และเช็ค Console (F12) ดู error จริง

---

## ขั้นตอนต่อไป (ถ้าต้องการ)

- [ ] เพิ่ม validation ให้กับฟิลด์ใหม่ใน Return Modal
- [ ] ปรับปรุง UI ให้ดูสวยงามขึ้น
- [ ] เพิ่มการกรอง/ค้นหาใน History Modal