-- 刪除名稱為「買課程送課程」的特殊優惠券
DELETE FROM public.vouchers
WHERE title = '買課程送課程' AND target_type = 'special_bogo';
