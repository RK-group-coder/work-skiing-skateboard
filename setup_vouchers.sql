-- 1. 確保 vouchers 表格具有所有需要的欄位
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vouchers' AND column_name='target_type') THEN
        ALTER TABLE vouchers ADD COLUMN target_type TEXT DEFAULT 'global';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vouchers' AND column_name='target_id') THEN
        ALTER TABLE vouchers ADD COLUMN target_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vouchers' AND column_name='min_spend') THEN
        ALTER TABLE vouchers ADD COLUMN min_spend NUMERIC DEFAULT 0;
    END IF;
END $$;

-- 2. 建立 user_vouchers 表格來追蹤使用者領取的優惠券
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
