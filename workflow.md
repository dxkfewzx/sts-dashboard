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

---

## 🔄 Refactor Details Component (2026-10-23 - ครั้งที่ 2)

### เป้าหมาย: แยกโค้ด Details.js ที่ใหญ่โต (~1,500 บรรทัด) ให้เป็น component/hook/utils แยกต่างหาก

### 1. สร้าง Custom Hooks ใหม่
| ไฟล์ | หน้าที่ |
|------|--------|
| `src/hooks/useCascadingDropdowns.js` | จัดการ Building → Floor → Department cascading dropdowns (ใช้ร่วม 3 forms) |
| `src/hooks/useSupabase.js` | Entity-specific hooks: `useItems`, `useSerialNumbers`, `useWithdrawReturn`, `useReferenceData`, `useItemStats`, `useDashboardStats`, `useReportStats` |

### 2. สร้าง Constants & Utilities
| ไฟล์ | หน้าที่ |
|------|--------|
| `src/constants/snForms.js` | `INITIAL_SN_FORM`, `INITIAL_BULK_FORM`, `INITIAL_RETURN_FORM`, `SN_STATUS_OPTIONS`, `RETURN_CONDITION_OPTIONS`, helper functions `createSNFormData`, `createBulkSNArray`, `createReturnFormData` |
| `src/utils/status.js` | Shared status configs: `SN_STATUS_CONFIG`, `REPAIR_STATUS_CONFIG`, `WITHDRAWAL_ACTION_CONFIG` + getter functions |
| `src/utils/toast.js` | SweetAlert2 wrapper: `success`, `error`, `warning`, `info`, `loading`, `confirm`, `input` + `operationToast` shortcuts |

### 3. แยก Modal Components (5 ไฟล์)
| ไฟล์ | บรรทัด | ใช้ใน |
|------|--------|-------|
| `src/components/modals/AddSNModal.jsx` | 182 | เพิ่มหมายเลขเครื่องเดี่ยว |
| `src/components/modals/BulkAddSNModal.jsx` | 192 | เพิ่มหลายรายการ |
| `src/components/modals/EditSNModal.jsx` | 177 | แก้ไขหมายเลขเครื่อง |
| `src/components/modals/ReturnModal.jsx` | 132 | รับคืนอุปกรณ์ |
| `src/components/modals/HistoryModal.jsx` | 89 | ดูประวัติการเบิก-คืน |

### 4. Rewrite Details.js ใหม่
- **ก่อน:** ~1,520 บรรทัด (มีโค้ดซ้ำ cascading dropdowns 3 ครั้ง, inline modals 5 ตัว)
- **หลัง:** 573 บรรทัด (**ลด 62%**)
- ใช้ hooks ทั้งหมดแทน inline logic
- ใช้ constants สำหรับ initial state และ options
- ใช้ utils สำหรับ status badge/text และ toast notifications
- ใช้ modal components แทน inline JSX

### 5. แก้ไขปัญหาเพิ่มเติม
- ✅ Fix `operationToast.confirm is not a function` - import `confirm` แยกต่างหาก
- ✅ Fix table overflow - เพิ่ม `table-responsive` + `overflowX: auto` + `minWidth`
- ✅ Fix delete error handling - แสดง error message ชัดเจนสำหรับ foreign key constraint
- ✅ Build ผ่าน ไม่มี error (มีแค่ ESLint warnings เดิมในไฟล์อื่น)

### 6. สถิติโค้ด
| หมวด | ก่อน | หลัง | หมายเหตุ |
|------|------|------|----------|
| Details.js | ~1,520 บรรทัด | 573 บรรทัด | **-62%** |
| Modal components | รวมใน Details | 772 บรรทัด | 5 ไฟล์แยกต่างหาก |
| Hooks (useCascadingDropdowns + useSupabase) | - | 294 บรรทัด | ใหม่ |
| Constants (snForms) | - | 104 บรรทัด | ใหม่ |
| Utils (status + toast) | - | 299 บรรทัด | ใหม่ |
| **รวมใหม่** | 1,520 | **2,042** | เพิ่มขึ้นแต่แยกเป็น modules |

### ผลประโยชน์
1. **Maintainability** - Details.js เหลือแค่ orchestration logic ง่ายต่อการ maintain
2. **Reusability** - Modals, hooks, constants ใช้ซ้ำได้ในหน้าอื่น
3. **Testability** - แต่ละ unit ทดสอบแยกได้
4. **Readability** - โค้ดสะอาด แยก concerns ชัดเจน
5. **Performance** - React.memo ได้ง่ายขึ้น, lazy load modals ได้

### ไฟล์ที่แก้ไข/สร้างใหม่

**สร้างใหม่ (9 ไฟล์):**
- `src/hooks/useCascadingDropdowns.js`
- `src/hooks/useSupabase.js` (เพิ่มเติม)
- `src/constants/snForms.js`
- `src/utils/status.js`
- `src/utils/toast.js`
- `src/components/modals/AddSNModal.jsx`
- `src/components/modals/BulkAddSNModal.jsx`
- `src/components/modals/EditSNModal.jsx`
- `src/components/modals/ReturnModal.jsx`
- `src/components/modals/HistoryModal.jsx`

**แก้ไข (1 ไฟล์):**
- `src/components/Details.js` - Rewrite ใหม่ทั้งหมด

### การทดสอบ
1. **Build:** `npm run build` - ✅ ผ่าน
2. **Hard Refresh:** `Ctrl+Shift+R` - ✅ โหลดโค้ดใหม่
3. **ทดสอบฟังก์ชันหลัก:**
   - ✅ เพิ่มหมายเลขเครื่อง (เดี่ยว/หลายรายการ)
   - ✅ แก้ไขหมายเลขเครื่อง
   - ✅ ลบหมายเลขเครื่อง (พร้อม error message ชัดเจน)
   - ✅ รับคืนอุปกรณ์ (พร้อมข้อมูลจากการเบิก)
   - ✅ ดูประวัติ (ทั้งใน Tab History และ Modal)
   - ✅ แท็บสลับ Serial Numbers / History / Stats
   - ✅ Table horizontal scroll ทำงานปกติ

---

## หมายเหตุ

- หากยังเจอปัญหาการลบข้อมูลไม่ได้ ให้รัน SQL ใน Supabase เพื่อเพิ่ม CASCADE DELETE:
```sql
ALTER TABLE withdrawal_logs 
DROP CONSTRAINT IF EXISTS withdrawal_logs_serial_number_id_fkey;

ALTER TABLE withdrawal_logs
ADD CONSTRAINT withdrawal_logs_serial_number_id_fkey 
FOREIGN KEY (serial_number_id) REFERENCES serial_numbers(id) 
ON DELETE CASCADE;
```
- Error `Cannot read properties of undefined (reading 'M_ID')` ใน Console เป็นจาก **Chrome Extension** ไม่ใช่โค้ดของเรา