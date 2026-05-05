-- =========================================================================
-- SK8 優惠券系統最終資料庫結構設定檔 (Setup Vouchers Final)
-- =========================================================================

-- 1. 確保 vouchers 表格具有所有需要的欄位
DO $$ 
BEGIN
    -- 確保 title 欄位存在 (稍早缺少的欄位)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vouchers' AND column_name='title') THEN
        ALTER TABLE vouchers ADD COLUMN title TEXT NOT NULL DEFAULT '優惠券';
    END IF;

    -- 確保 is_published 欄位存在
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vouchers' AND column_name='is_published') THEN
        ALTER TABLE vouchers ADD COLUMN is_published BOOLEAN DEFAULT true;
    END IF;

    -- 確保 description 欄位存在 (自訂內文)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vouchers' AND column_name='description') THEN
        ALTER TABLE vouchers ADD COLUMN description TEXT;
    END IF;

    -- 確保 target_type 欄位存在
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vouchers' AND column_name='target_type') THEN
        ALTER TABLE vouchers ADD COLUMN target_type TEXT DEFAULT 'global';
    END IF;

    -- 確保 target_id 欄位存在
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vouchers' AND column_name='target_id') THEN
        ALTER TABLE vouchers ADD COLUMN target_id TEXT;
    END IF;

    -- 確保 min_amount 欄位存在 (如果原本叫 min_spend 就會新建一個 min_amount)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vouchers' AND column_name='min_amount') THEN
        ALTER TABLE vouchers ADD COLUMN min_amount NUMERIC DEFAULT 0;
    END IF;

    -- 確保 valid_until 欄位存在
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vouchers' AND column_name='valid_until') THEN
        ALTER TABLE vouchers ADD COLUMN valid_until TEXT;
    END IF;
END $$;

-- 2. 建立 user_vouchers 表格來追蹤使用者領取的優惠券 (防止重複領取)
CREATE TABLE IF NOT EXISTS user_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    voucher_id UUID REFERENCES vouchers(id) ON DELETE CASCADE,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, voucher_id)
);

-- 3. 啟用 RLS
ALTER TABLE user_vouchers ENABLE ROW LEVEL SECURITY;

-- 4. 建立 Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "users_can_view_own_claims" ON user_vouchers;
    DROP POLICY IF EXISTS "users_can_claim_vouchers" ON user_vouchers;
    DROP POLICY IF EXISTS "users_can_update_own_claims" ON user_vouchers;
END $$;

CREATE POLICY "users_can_view_own_claims" ON user_vouchers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_can_claim_vouchers" ON user_vouchers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_update_own_claims" ON user_vouchers FOR UPDATE USING (auth.uid() = user_id);

-- 完成！
