# V30 — Final Release / SSA101 Vàng Bạc

**Website:** https://ssa101-vang-bac.vercel.app/  
**Trạng thái:** Bản ổn định để nhóm kiểm tra và sử dụng.  
**Nhánh phát hành:** `release/v30-stable` (tạo sau khi hoàn tất kiểm thử)  
**Phạm vi:** Hoàn thiện nội dung và hành trình người dùng; không thay đổi giao diện V27/V28.

## Đã kiểm tra

- **Nội dung:** Đúng 5 buổi; Buổi 1 online Pomodoro 120 phút; 4 buổi offline khoảng 60 phút; Buổi 3 có lịch tháng và lịch chi tiết 7 ngày; Buổi 5 nhìn lại sau thời gian dùng lịch.
- **Responsive + tương tác:** Bộ kiểm thử `qa-content-v29.html` đạt **482/482**, 0 lỗi ở 360, 390, 430, 768, 1360, 1680, 1850 và 1920px trên Production sau chỉnh sửa nội dung V30.
- **Menu, lịch và video:** Các liên kết nội bộ hoạt động; 2 tab lịch hoạt động; cả 2 video Google Drive có trình phát xem trước và liên kết dự phòng mở không cần đăng nhập trong lần kiểm thử.
- **Form:** Liên kết đến Google Form chính thức hoạt động nhưng **người điền cần đăng nhập tài khoản Google**. Điều này đã được nêu gần nút đăng ký và trong FAQ.

## Giới hạn kiểm chứng

- Kiểm tra video xác nhận **trình phát và ảnh xem trước** hiển thị công khai; chưa xem từ đầu tới cuối cả hai video.
- Không gửi biểu mẫu thử; chưa xác minh dữ liệu phản hồi hoặc email tự động.
- Bộ QA không thay thế kiểm tra thủ công trên mọi thiết bị thật.
- Không thực hiện kiểm tra hay tối ưu hiệu năng trong V30 (theo phạm vi đã thống nhất).

## Tài nguyên đang dùng

- CSS phát hành: `site-v10.css?v=20261016-v27`
- JavaScript phát hành: `site-v10.js?v=20261016-v28`
- Kiểm tra nội dung: https://ssa101-vang-bac.vercel.app/qa-content-v29.html
- Video demo: https://drive.google.com/file/d/1luPqKvBMlRPSoXKnSSED-nhjNfV8xnEJ/view
- Video giới thiệu: https://drive.google.com/file/d/18DtUMajEsEXM_nU4sGO60Z_KDAG3ds0j/view
- Form: https://docs.google.com/forms/d/e/1FAIpQLSdvFnYiceiT-sh13q3ggggmLMSz9ifyf6zQS6-JSGxH60DN2w/viewform

## Hướng bảo trì

Giữ nhánh `release/v30-stable` làm mốc để đối chiếu khi thay đổi về sau. Khi cần sửa, tiếp tục trên `main`, cập nhật đúng tệp nguồn (không chỉ sửa bundle), kiểm thử, rồi mới cân nhắc đưa vào phiên bản ổn định tiếp theo. Việc form yêu cầu đăng nhập là do cài đặt Google Form; nếu nhóm muốn nhận đăng ký ẩn danh thì cần thay đổi trong tài khoản chủ biểu mẫu.
