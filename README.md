# Vàng Bạc · SSA101 — Motion V4

Landing page HTML/CSS/JS tĩnh, tối ưu để triển khai bằng **Vercel từ repository GitHub private**. Không cần framework, không cần npm hay build.

## Đã hoàn thành

- Giữ thiết kế gốc, logo nhóm và font Be Vietnam Pro + STIX Two Text.
- **Google Form đã liên kết**: nút `THAM GIA` ở đầu trang và `MỞ FORM ĐĂNG KÝ` ở cuối trang đều dẫn đến Form thật.
- **Motion V4:** animation reveal/parallax/ambient/interaction, chuyển đổi lịch 7 ngày–1 tháng. Giảm animation gây paint/layout: thay clip-path/padding-left bằng opacity/transform; loại bỏ blur ở header; gom phép đo layout và giới hạn update qua requestAnimationFrame.
- Tôn trọng `prefers-reduced-motion` của người truy cập.
- Placeholder video và demo thật được **giữ nguyên**, không làm giả bằng ảnh AI.

## Deploy private GitHub → Vercel

1. Tạo repo mới ở GitHub và chọn **Private** (không dùng repo khác của bạn).
2. Upload toàn bộ file ở **thư mục gốc** (index.html, *.css, script.js, assets, vercel.json).
3. Vercel: **Add New → Project → Import Git Repository**. Cấp cho Vercel quyền đọc đúng repository private này.
4. Framework Preset: **Other**. Build Command và Install Command: **để trống**; Output Directory: **để trống** (root).
5. Nhấn **Deploy**. Những lần push tiếp theo vào `main` sẽ tạo deployment mới tự động.

Vercel cho phép mã nguồn repo private nhưng trang web triển khai có URL công khai nếu không bật tính năng bảo vệ deployment. Để giữ QR poster hiện tại chạy được, cần cập nhật QR sang URL Vercel hoặc đặt domain/redirect phù hợp, bởi QR cũ đang dẫn tới Cloudflare.

## Cập nhật sau này

- Google Form: thay `SITE_CONFIG.registrationUrl` trong `script.js` và href dự phòng ở `index.html`.
- Video YouTube: đặt `SITE_CONFIG.youtubeEmbedUrl = "https://www.youtube.com/embed/VIDEO_ID"` trong `script.js`.
- Demo Before/After: thay hình thật ở mục demo, che dữ liệu cá nhân khi cần.

## Kiểm tra

`node --check script.js`; mở index.html trong trình duyệt. Đây là bản tối ưu *theo kiến trúc*, **không bảo đảm 120 FPS** trên mọi thiết bị khi chưa đo thực tế.


Logo gốc được lưu riêng, website dùng bản WebP tối ưu từ ảnh gốc.
