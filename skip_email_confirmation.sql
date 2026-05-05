-- 1. 立即開通目前所有尚未驗證的帳號
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email_confirmed_at IS NULL;

-- 2. 建立自動驗證函數：未來新註冊的帳號將會直接略過 Email 驗證
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.email_confirmed_at = now();
  RETURN NEW;
END;
$$;

-- 3. 綁定觸發器到 auth.users 表格
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;

CREATE TRIGGER auto_confirm_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user();
