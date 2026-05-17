-- =========================================================================
-- SK8 優惠券多張發放與消費消費機制資料庫升級檔 (Setup Vouchers Grant)
-- =========================================================================

-- 1. 移除 user_vouchers 的唯一性限制，允許同一會員擁有同張優惠券多份複本
ALTER TABLE user_vouchers DROP CONSTRAINT IF EXISTS user_vouchers_user_id_voucher_id_key;

-- 2. 在 vouchers 表格中新增一次領取/發放數量欄位 (預設為 1)
ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS grant_quantity INTEGER DEFAULT 1;

-- 確保該欄位對現有舊資料均設定預設值 1
UPDATE vouchers SET grant_quantity = 1 WHERE grant_quantity IS NULL;
