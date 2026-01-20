# Three-Flower-Hotel

## Mô tả hệ thống Hotel Management

### 1. Tiếp nhận yêu cầu đặt phòng
- Khách sạn cung cấp các dịch vụ lưu trú và dịch vụ đi kèm (phòng, ăn uống, giặt ủi, spa, …) theo yêu cầu đặt phòng của khách hàng.
- Khi khách hàng gửi yêu cầu đặt phòng, nhân viên lễ tân kiểm tra:
  - Loại phòng
  - Thời gian lưu trú
  - Số lượng phòng
  - Các dịch vụ đi kèm
- Nếu khách sạn không có đủ phòng hoặc không cung cấp một số dịch vụ theo yêu cầu, lễ tân sẽ từ chối đặt phòng.
- Nếu có thể đáp ứng, lễ tân tiếp nhận đơn đặt phòng và lưu thông tin khách hàng (tạo hồ sơ mới nếu là khách mới).

### 2. Kiểm tra tình trạng phòng và thanh toán
- Sau khi tiếp nhận yêu cầu, lễ tân:
  - Kiểm tra tình trạng phòng trống trong hệ thống
  - Đối chiếu lịch đặt phòng
  - Xác minh tình trạng thanh toán hoặc công nợ của khách (đối với khách quen hoặc khách doanh nghiệp)
- Nếu:
  - Không đủ phòng trong thời gian yêu cầu, hoặc
  - Khách hàng còn nợ các khoản thanh toán trước đó  
  → Lễ tân từ chối xác nhận đặt phòng.
- Nếu không có vấn đề, lễ tân lập phiếu xác nhận đặt phòng (booking) dựa trên yêu cầu của khách hàng.

### 3. Thanh toán và nhận phòng
- Khách hàng sử dụng phiếu xác nhận đặt phòng để thanh toán tại bộ phận tài chính / thu ngân.
- Sau khi khách hàng thanh toán đầy đủ hoặc đặt cọc theo quy định:
  - Bộ phận tài chính xác nhận thanh toán
  - Gửi thông tin cho lễ tân và bộ phận buồng phòng
- Khi khách đến khách sạn:
  - Lễ tân làm thủ tục check-in
  - Bàn giao phòng cho khách

### 4. Sử dụng dịch vụ và trả phòng
- Trong thời gian lưu trú, các dịch vụ phát sinh của khách hàng được ghi nhận vào hóa đơn.
- Khi khách check-out:
  - Khách hàng nhận hóa đơn tổng hợp
  - Hoàn tất quá trình sử dụng dịch vụ tại khách sạn