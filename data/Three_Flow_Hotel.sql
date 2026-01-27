CREATE TABLE `KHACH_HANG` (
  `ma_khach_hang` int PRIMARY KEY,
  `ho_ten` string,
  `so_dien_thoai` string,
  `email` string,
  `so_giay_to` string
);

CREATE TABLE `LOAI_PHONG` (
  `ma_loai_phong` int PRIMARY KEY,
  `ten_loai_phong` string,
  `gia_phong` decimal,
  `mo_ta` string
);

CREATE TABLE `PHONG` (
  `ma_phong` int PRIMARY KEY,
  `ma_loai_phong` int,
  `so_phong` string,
  `trang_thai_phong` string
);

CREATE TABLE `DAT_PHONG` (
  `ma_dat_phong` int PRIMARY KEY,
  `ma_khach_hang` int,
  `ngay_nhan_phong` date,
  `ngay_tra_phong` date,
  `trang_thai` string,
  `ma_phong` int
);

CREATE TABLE `HOA_DON` (
  `ma_hoa_don` int PRIMARY KEY,
  `tong_tien` decimal,
  `ngay_lap` date,
  `ma_dat_phong` int UNIQUE
);

CREATE TABLE `THANH_TOAN` (
  `ma_thanh_toan` int PRIMARY KEY,
  `ma_hoa_don` int,
  `ngay_thanh_toan` date,
  `phuong_thuc` string,
  `so_tien` decimal,
  `trang_thai` string
);

ALTER TABLE `PHONG` ADD FOREIGN KEY (`ma_loai_phong`) REFERENCES `LOAI_PHONG` (`ma_loai_phong`);

ALTER TABLE `DAT_PHONG` ADD FOREIGN KEY (`ma_khach_hang`) REFERENCES `KHACH_HANG` (`ma_khach_hang`);

ALTER TABLE `DAT_PHONG` ADD FOREIGN KEY (`ma_phong`) REFERENCES `PHONG` (`ma_phong`);

ALTER TABLE `HOA_DON` ADD FOREIGN KEY (`ma_dat_phong`) REFERENCES `DAT_PHONG` (`ma_dat_phong`);

ALTER TABLE `THANH_TOAN` ADD FOREIGN KEY (`ma_hoa_don`) REFERENCES `HOA_DON` (`ma_hoa_don`);
