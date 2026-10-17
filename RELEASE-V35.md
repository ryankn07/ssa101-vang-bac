# V35 — Final Stable Release · SSA101 / Nhóm Vàng Bạc

**Website Production:** https://ssa101-vang-bac.vercel.app/  
**Nguồn:** GitHub `ryankn07/ssa101-vang-bac` / `main`.  
**Nhánh lưu mốc:** `release/v35-stable`.  
**Thời điểm chốt:** 17/10/2026.  
**Mục tiêu:** Giữ nguyên phiên bản đã kiểm thử; từ đây chỉ sửa khi có lỗi hoặc yêu cầu nội dung thực sự cần thiết.

## Phạm vi chốt

- Giao diện: thiết kế nhất quán giữa 8 phần chương trình và footer. Giữ bố cục V33; V34 chỉ bổ sung bộ kiểm thử, **không thay đổi CSS/JS**.
- Nội dung dự án: 5 buổi (Pomodoro online 120 phút; 4 buổi offline khoảng 60 phút), có lịch tháng và lịch 7 ngày.
- Video: hai trình phát nhúng Google Drive thực tế (video demo và video giới thiệu), kèm liên kết mở trên Drive.
- Lịch minh chứng: thành viên 01 có lịch kế hoạch tuần và phần tự đánh giá; thành viên 02 có ảnh trước/sau khi lập kế hoạch; đã phân biệt `đã lên lịch` với `đã hoàn thành`, và không xem ảnh so sánh là bằng chứng hiệu quả chung.
- Điều hướng, FAQ, nút đăng ký Google Form và nút về đầu trang được giữ nguyên.
- Không thực hiện công việc liên quan poster, QR poster hay tối ưu hiệu năng.

## Bằng chứng kiểm thử

- Dashboard cuối: https://ssa101-vang-bac.vercel.app/qa-final-v34.html
- Kết quả ở lần chạy V34: **626/626 bài kiểm tra đạt, 0 lỗi**.
- Độ rộng kiểm thử iframe: 360, 390, 430, 768, 1360, 1680, 1850, 1920px.
- Bao gồm kiểm tra tiêu đề, tràn ngang, sự chồng chữ, CTA mobile, FAQ, hai video, hai lịch, nhãn minh chứng và chức năng điều hướng.
- Đã xác nhận triển khai `main` trên Vercel ở trạng thái `READY` trước khi chốt V35.

## Cấu hình phát hành

- CSS: `site-v10.css?v=20261017-v33`
- JavaScript: `site-v10.js?v=20261016-v28`
- Mỗi tệp CSS/JS biên dịch phải được cập nhật qua nguồn trong `tools/build-v10.mjs`; tránh sửa riêng bundle.
- Bản V35 không thay đổi thiết kế so với bản đã kiểm thử V34.

## Lưu ý trước khi sử dụng

1. Google Form **yêu cầu đăng nhập tài khoản Google** để điền. Đây là yêu cầu của biểu mẫu; website chỉ liên kết đến Form.
2. Hai video đã có hình xem trước và trình phát công khai khi kiểm tra, nhưng chưa có bài kiểm tra tự động xem hết thời lượng từng video.
3. Kiểm tra responsive thực hiện bằng iframe trình duyệt; chưa phải kiểm tra trực quan thủ công trên mọi điện thoại thật.
4. Các số lịch tuần là **mục đã được lên lịch**, không tương đương số việc đã hoàn thành.
5. Bộ kiểm thử không thay thế việc kiểm chứng mọi đường dẫn và quyền chia sẻ trong tương lai.

## Sau khi chốt

Giữ `release/v35-stable` như mốc phục hồi cố định. Các chỉnh sửa sau này thực hiện trên `main`, kiểm thử lại và chỉ tạo phiên bản ổn định mới khi thật sự cần. Không phát triển thêm tính năng/hiệu ứng không phục vụ dự án.
