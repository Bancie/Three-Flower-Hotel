-- Cơ sở dữ liệu: hotel_bahoa
--
-- Kết nối MySQL:
-- - Loại CSDL: MySQL
-- - Tên kết nối: hotel
-- - Nhóm kết nối: (không đặt)
-- - Kết nối qua: Server và cổng
-- - Máy chủ: localhost
-- - Cổng: 3307
-- - Cơ sở dữ liệu: hotel_bahoa
-- - Người dùng: root
-- - Mật khẩu: bahoa123
-- - Giao thức xác thực: mặc định (default)
-- - SSL: tắt
-- - Qua SSH: tắt
-- - Thời gian chờ kết nối: (mặc định / không đặt)
-- - Giới hạn số bản ghi mặc định khi xem: 500

USE `hotel_bahoa`;

CREATE TABLE `KHACH_HANG` (
  `ma_khach_hang` INT PRIMARY KEY,
  `ho_ten` VARCHAR(255),
  `so_dien_thoai` VARCHAR(20),
  `email` VARCHAR(255),
  `so_giay_to` VARCHAR(50)
);

CREATE TABLE `LOAI_PHONG` (
  `ma_loai_phong` INT PRIMARY KEY,
  `ten_loai_phong` VARCHAR(255),
  `gia_phong` DECIMAL(10,2),
  `mo_ta` VARCHAR(255)
);

CREATE TABLE `PHONG` (
  `ma_phong` INT PRIMARY KEY,
  `ma_loai_phong` INT,
  `so_phong` VARCHAR(20),
  `trang_thai_phong` VARCHAR(50)
);

CREATE TABLE `DAT_PHONG` (
  `ma_dat_phong` INT PRIMARY KEY,
  `ma_khach_hang` INT,
  `ngay_nhan_phong` DATE,
  `ngay_tra_phong` DATE,
  `trang_thai` VARCHAR(50),
  `ma_phong` INT
);

CREATE TABLE `HOA_DON` (
  `ma_hoa_don` INT PRIMARY KEY,
  `tong_tien` DECIMAL(10,2),
  `ngay_lap` DATE,
  `ma_dat_phong` INT UNIQUE
);

CREATE TABLE `THANH_TOAN` (
  `ma_thanh_toan` INT PRIMARY KEY,
  `ma_hoa_don` INT,
  `ngay_thanh_toan` DATE,
  `phuong_thuc` VARCHAR(50),
  `so_tien` DECIMAL(10,2),
  `trang_thai` VARCHAR(50)
);

ALTER TABLE `PHONG`
  ADD CONSTRAINT fk_phong_loai
  FOREIGN KEY (`ma_loai_phong`)
  REFERENCES `LOAI_PHONG` (`ma_loai_phong`);

ALTER TABLE `DAT_PHONG`
  ADD CONSTRAINT fk_datphong_khach
  FOREIGN KEY (`ma_khach_hang`)
  REFERENCES `KHACH_HANG` (`ma_khach_hang`);

ALTER TABLE `DAT_PHONG`
  ADD CONSTRAINT fk_datphong_phong
  FOREIGN KEY (`ma_phong`)
  REFERENCES `PHONG` (`ma_phong`);

ALTER TABLE `HOA_DON`
  ADD CONSTRAINT fk_hoadon_datphong
  FOREIGN KEY (`ma_dat_phong`)
  REFERENCES `DAT_PHONG` (`ma_dat_phong`);

ALTER TABLE `THANH_TOAN`
  ADD CONSTRAINT fk_thanhtoan_hoadon
  FOREIGN KEY (`ma_hoa_don`)
  REFERENCES `HOA_DON` (`ma_hoa_don`);

SELECT * FROM `KHACH_HANG`;

-- Mock data
-- Xóa dữ liệu cũ trước khi insert (theo thứ tự ngược lại do foreign key constraints)
DELETE FROM THANH_TOAN;
DELETE FROM HOA_DON;
DELETE FROM DAT_PHONG;
DELETE FROM PHONG;
DELETE FROM LOAI_PHONG;
DELETE FROM KHACH_HANG;

INSERT INTO KHACH_HANG VALUES
(1, 'Nguyễn Văn A', '0901234567', 'a@gmail.com', 'CCCD123456'),
(2, 'Trần Thị B', '0912345678', 'b@gmail.com', 'CCCD234567'),
(3, 'Lê Văn C', '0923456789', 'c@gmail.com', 'CCCD345678'),
(4, 'Phạm Thị D', '0934567890', 'd@gmail.com', 'CCCD456789'),
(5, 'Hoàng Văn E', '0945678901', 'e@gmail.com', 'CCCD567890'),
(6, 'Vũ Thị F', '0956789012', 'f@gmail.com', 'CCCD678901'),
(7, 'Đặng Văn G', '0967890123', 'g@gmail.com', 'CCCD789012'),
(8, 'Bùi Thị H', '0978901234', 'h@gmail.com', 'CCCD890123'),
(9, 'Ngô Văn I', '0989012345', 'i@gmail.com', 'CCCD901234'),
(10, 'Đỗ Thị K', '0990123456', 'k@gmail.com', 'CCCD012345'),
(11, 'Lý Văn L', '0901123456', 'l@gmail.com', 'CCCD112345'),
(12, 'Trương Thị M', '0902123456', 'm@gmail.com', 'CCCD212345');

INSERT INTO LOAI_PHONG VALUES
(1, 'Phòng đơn', 500000.00, 'Phòng cho 1 người'),
(2, 'Phòng đôi', 800000.00, 'Phòng cho 2 người'),
(3, 'Phòng VIP', 1500000.00, 'Phòng cao cấp'),
(4, 'Phòng gia đình', 1200000.00, 'Phòng cho 4 người'),
(5, 'Phòng suite', 2000000.00, 'Phòng suite sang trọng'),
(6, 'Phòng deluxe', 1000000.00, 'Phòng deluxe tiện nghi'),
(7, 'Phòng standard', 600000.00, 'Phòng tiêu chuẩn'),
(8, 'Phòng superior', 900000.00, 'Phòng superior cao cấp'),
(9, 'Phòng executive', 1800000.00, 'Phòng executive'),
(10, 'Phòng penthouse', 3000000.00, 'Phòng penthouse cao cấp'),
(11, 'Phòng studio', 700000.00, 'Phòng studio'),
(12, 'Phòng connecting', 1600000.00, 'Phòng nối liền nhau');

SELECT * FROM `LOAI_PHONG`;

-- Dữ liệu cho bảng PHONG
INSERT INTO PHONG VALUES
(1, 1, 'P101', 'Trống'),
(2, 2, 'P102', 'Đã đặt'),
(3, 3, 'P201', 'Trống'),
(4, 1, 'P202', 'Đang sử dụng'),
(5, 2, 'P301', 'Trống'),
(6, 4, 'P302', 'Đã đặt'),
(7, 5, 'P401', 'Trống'),
(8, 3, 'P402', 'Trống'),
(9, 6, 'P501', 'Đã đặt'),
(10, 2, 'P502', 'Trống'),
(11, 1, 'P103', 'Trống'),
(12, 7, 'P203', 'Trống'),
(13, 8, 'P303', 'Đã đặt'),
(14, 9, 'P403', 'Trống'),
(15, 10, 'P503', 'Trống');

-- Dữ liệu cho bảng DAT_PHONG
INSERT INTO DAT_PHONG VALUES
(1, 1, '2025-01-15', '2025-01-17', 'Đã xác nhận', 1),
(2, 2, '2025-01-16', '2025-01-18', 'Đã xác nhận', 2),
(3, 3, '2025-01-17', '2025-01-19', 'Đã hủy', 3),
(4, 4, '2025-01-18', '2025-01-20', 'Đã xác nhận', 4),
(5, 5, '2025-01-19', '2025-01-21', 'Đang chờ', 5),
(6, 6, '2025-01-20', '2025-01-22', 'Đã xác nhận', 6),
(7, 7, '2025-01-21', '2025-01-23', 'Đã xác nhận', 7),
(8, 8, '2025-01-22', '2025-01-24', 'Đã xác nhận', 8),
(9, 9, '2025-01-23', '2025-01-25', 'Đã xác nhận', 9),
(10, 10, '2025-01-24', '2025-01-26', 'Đang chờ', 10),
(11, 11, '2025-01-25', '2025-01-27', 'Đã xác nhận', 11),
(12, 12, '2025-01-26', '2025-01-28', 'Đã xác nhận', 12);

-- Dữ liệu cho bảng HOA_DON
INSERT INTO HOA_DON VALUES
(1, 1000000.00, '2025-01-17', 1),
(2, 1600000.00, '2025-01-18', 2),
(3, 3000000.00, '2025-01-19', 3),
(4, 1000000.00, '2025-01-20', 4),
(5, 1600000.00, '2025-01-21', 5),
(6, 2400000.00, '2025-01-22', 6),
(7, 4000000.00, '2025-01-23', 7),
(8, 3000000.00, '2025-01-24', 8),
(9, 2000000.00, '2025-01-25', 9),
(10, 1600000.00, '2025-01-26', 10),
(11, 1000000.00, '2025-01-27', 11),
(12, 1800000.00, '2025-01-28', 12);

-- Dữ liệu cho bảng THANH_TOAN
INSERT INTO THANH_TOAN VALUES
(1, 1, '2025-01-17', 'Tiền mặt', 1000000.00, 'Đã thanh toán'),
(2, 2, '2025-01-18', 'Chuyển khoản', 1600000.00, 'Đã thanh toán'),
(3, 3, '2025-01-19', 'Thẻ tín dụng', 3000000.00, 'Đã hủy'),
(4, 4, '2025-01-20', 'Tiền mặt', 1000000.00, 'Đã thanh toán'),
(5, 5, '2025-01-21', 'Chuyển khoản', 1600000.00, 'Chờ thanh toán'),
(6, 6, '2025-01-22', 'Thẻ tín dụng', 2400000.00, 'Đã thanh toán'),
(7, 7, '2025-01-23', 'Chuyển khoản', 4000000.00, 'Đã thanh toán'),
(8, 8, '2025-01-24', 'Tiền mặt', 3000000.00, 'Đã thanh toán'),
(9, 9, '2025-01-25', 'Thẻ tín dụng', 2000000.00, 'Đã thanh toán'),
(10, 10, '2025-01-26', 'Chuyển khoản', 1600000.00, 'Chờ thanh toán'),
(11, 11, '2025-01-27', 'Tiền mặt', 1000000.00, 'Đã thanh toán'),
(12, 12, '2025-01-28', 'Thẻ tín dụng', 1800000.00, 'Đã thanh toán');

SELECT * FROM KHACH_HANG;
SELECT * FROM LOAI_PHONG;
SELECT * FROM PHONG;
SELECT * FROM DAT_PHONG;
SELECT * FROM HOA_DON;
SELECT * FROM THANH_TOAN;