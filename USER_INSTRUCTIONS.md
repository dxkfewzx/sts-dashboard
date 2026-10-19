# การเพิ่มค่าเริ่มต้นสำหรับอาคารและชั้นในแผนก

คุณได้ทำการปรับปรุงโค้ดและสคริปต์ฐานข้อมูลเพื่อเพิ่มฟังก์ชันการกำหนดค่าเริ่มต้นของอาคารและชั้นให้กับแผนกแล้ว แต่ตารางในฐานข้อมูลปัจจุบันยังไม่มีคอลัมน์เหล่านี้อยู่

## ขั้นตอนดำเนินการ

1. **คัดลอก SQL จากไฟล์ `add_default_columns.sql`**:
   ```sql
   -- ==========================================
   -- ADD DEFAULT COLUMNS TO REFERENCE_DATA TABLE
   -- ==========================================
   -- This script adds building_default and floor_default columns to the reference_data table
   -- Run this in your Supabase SQL editor if these columns don't exist yet

   -- Check if columns exist before adding them (safe to run multiple times)
   DO $$
   BEGIN
       -- Add building_default column if it doesn't exist
       IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name = 'reference_data' AND column_name = 'building_default') THEN
           ALTER TABLE reference_data ADD COLUMN building_default VARCHAR(100) NULL;
           RAISE NOTICE 'Added building_default column';
       ELSE
           RAISE NOTICE 'building_default column already exists';
       END IF;

       -- Add floor_default column if it doesn't exist
       IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name = 'reference_data' AND column_name = 'floor_default') THEN
           ALTER TABLE reference_data ADD COLUMN floor_default VARCHAR(50) NULL;
           RAISE NOTICE 'Added floor_default column';
       ELSE
           RAISE NOTICE 'floor_default column already exists';
       END IF;
   END $$;

   -- Create indexes for better performance (only useful for department type)
   DO $$
   BEGIN
       -- Index for building_default (only for department type)
       IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'reference_data' AND indexname = 'idx_reference_data_building_default') THEN
           CREATE INDEX IF NOT EXISTS idx_reference_data_building_default ON reference_data(building_default) WHERE type = 'department';
           RAISE NOTICE 'Created index on building_default';
       END IF;

       -- Index for floor_default (only for department type)
       IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'reference_data' AND indexname = 'idx_reference_data_floor_default') THEN
           CREATE INDEX IF NOT EXISTS idx_reference_data_floor_default ON reference_data(floor_default) WHERE type = 'department';
           RAISE NOTICE 'Created index on floor_default';
       END IF;
   END $$;

   -- Verify the columns were added
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'reference_data'
     AND column_name IN ('building_default', 'floor_default')
   ORDER BY ordinal_position;

   -- Show a few departments to verify the new columns are there
   SELECT id, name, building_default, floor_default
   FROM reference_data
   WHERE type = 'department'
   LIMIT 5;
   ```

2. **ไปที่หน้าแดชบอร์ดของโปรเจ็กต์ Supabase ของคุณ**:
   - เปิด [Supabase Dashboard](https://app.supabase.com/)
   - เลือกโปรเจ็กต์ของคุณ

3. **เปิด SQL Editor**:
   - ในแดชบอร์ด ให้ไปที่เมนูทางด้านซ้าย
   - เลือก "SQL Editor"

4. **วางและรัน SQL**:
   - วางสคริปต์ทั้งหมดจากขั้นตอนที่ 1 ลงใน SQL Editor
   - คลิกปุ่ม "Run" เพื่อรันสคริปต์

5. **ตรวจสอบผลลัพธ์**:
   - หลังจากรันสคริปต์สำเร็จ คุณควรเห็นข้อความแจ้งว่าได้เพิ่มคอลัมน์แล้ว
   - ผลลัพธ์ควรแสดงคอลัมน์ `building_default` และ `floor_default` ในตาราง `reference_data`

6. **ทดสอบแอปพลิเคชัน**:
   - รีเฟรชหน้าเว็บแอปพลิเคชันของคุณที่ `http://localhost:3000`
   - ฟังก์ชันการเบิกอุปกรณ์ควรทำงานปกติ (เนื่องจากเราได้แก้ไขตรรกะการกรองแล้ว)
   - คอลัมน์ใหม่จะพร้อมใช้งาน แต่จะมีค่าเป็น `NULL` สำหรับทุกแผนกจนกว่าคุณจะอัปเดต

## การตั้งค่าค่าเริ่มต้น (ทางเลือก)

หากคุณต้องการตั้งค่าค่าเริ่มต้นของอาคารและชั้นให้กับแผนกเฉพาะ ให้รันคำสั่ง UPDATE ตัวอย่างเช่น:

```sql
-- ตั้งค่าแผนกห้องยาให้ใช้อาคาร 1 ชั้น 2 เป็นค่าเริ่มต้น
UPDATE reference_data 
SET building_default = 'อาคาร 1', floor_default = 'ชั้น 2'
WHERE type = 'department' AND name = 'ห้องยา';

-- ตั้งค่าแผนกธุรการรังสีวิทยาให้ใช้อาคาร 2 ชั้น 3 เป็นค่าเริ่มต้น
UPDATE reference_data 
SET building_default = 'อาคาร 2', floor_default = 'ชั้น 3'
WHERE type = 'department' AND name = 'ธุรการรังสีวิทยา';
```

หลังจากตั้งค่าแล้ว คุณสามารถปรับปรุงโค้ดในอนาคตเพื่อใช้อัตโนมัติกรอกฟิลด์อาคารและชั้นเมื่อเลือกแผนกในฟอร์มได้

## สิ่งที่ได้ทำไปแล้ว

1. ✅ อัปเดต `database_reset.sql` เพื่อรวมคอลัมน์ `building_default` และ `floor_default` ในตาราง `reference_data`
2. ✅ อัปเดต `src/App.js` เพื่อส่งคอลัมน์ใหม่เหล่านี้ไปยังข้อมูลแผนก
3. ✅ ตรวจสอบและยืนยันว่า `src/components/WithdrawModal.js` มีตรรกะการกรองที่ถูกต้องโดยใช้ ID แทนที่จะใช้ข้อความ
4. ✅ สร้างสคริปต์ `add_default_columns.sql` เพื่อเพิ่มคอลัมน์เหล่านี้เข้าไปในฐานข้อมูลที่มีอยู่โดยปลอดภัย

ตอนนี้คุณเพียงแค่ต้องรันสคริปต์ SQL ใน Supabase SQL Editor เท่านั้น แล้วแอปพลิเคชันของคุณจะมีฟังก์ชันการกำหนดค่าเริ่มต้นของอาคารและชั้นต่อแผนกโดยไม่ต้องแยกตาราง