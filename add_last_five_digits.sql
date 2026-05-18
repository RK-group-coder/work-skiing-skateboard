-- =========================================================================
-- SK8 訂單系統：新增付款帳號末五碼欄位 (Add Last Five Digits to Orders)
-- =========================================================================

-- 在 orders 表格中新增付款帳號末五碼欄位
ALTER TABLE orders ADD COLUMN IF NOT EXISTS last_five_digits TEXT;

-- 對現有資料進行註記 (選填)
COMMENT ON COLUMN orders.last_five_digits IS '客戶付款轉帳帳號末五碼，供對帳查驗使用';
