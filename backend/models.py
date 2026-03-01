from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class KhachHang(Base):
    __tablename__ = "KHACH_HANG"

    ma_khach_hang = Column(Integer, primary_key=True, autoincrement=True)
    ho_ten = Column(String(255))
    so_dien_thoai = Column(String(20))
    email = Column(String(255))
    so_giay_to = Column(String(50))

    dat_phong = relationship("DatPhong", back_populates="khach_hang")
    tai_khoan = relationship("TaiKhoan", back_populates="khach_hang")


class LoaiPhong(Base):
    __tablename__ = "LOAI_PHONG"

    ma_loai_phong = Column(Integer, primary_key=True, autoincrement=True)
    ten_loai_phong = Column(String(255))
    gia_phong = Column(Numeric(10, 2))
    mo_ta = Column(String(255))

    phong = relationship("Phong", back_populates="loai_phong")


class Phong(Base):
    __tablename__ = "PHONG"

    ma_phong = Column(Integer, primary_key=True, autoincrement=True)
    ma_loai_phong = Column(Integer, ForeignKey("LOAI_PHONG.ma_loai_phong"))
    so_phong = Column(String(20))
    trang_thai_phong = Column(String(50))

    loai_phong = relationship("LoaiPhong", back_populates="phong")
    dat_phong = relationship("DatPhong", back_populates="phong")


class DatPhong(Base):
    __tablename__ = "DAT_PHONG"

    ma_dat_phong = Column(Integer, primary_key=True, autoincrement=True)
    ma_khach_hang = Column(Integer, ForeignKey("KHACH_HANG.ma_khach_hang"))
    ngay_nhan_phong = Column(Date)
    ngay_tra_phong = Column(Date)
    trang_thai = Column(String(50))
    ma_phong = Column(Integer, ForeignKey("PHONG.ma_phong"))

    khach_hang = relationship("KhachHang", back_populates="dat_phong")
    phong = relationship("Phong", back_populates="dat_phong")
    hoa_don = relationship("HoaDon", back_populates="dat_phong", uselist=False)


class HoaDon(Base):
    __tablename__ = "HOA_DON"

    ma_hoa_don = Column(Integer, primary_key=True, autoincrement=True)
    tong_tien = Column(Numeric(10, 2))
    ngay_lap = Column(Date)
    ma_dat_phong = Column(Integer, ForeignKey("DAT_PHONG.ma_dat_phong"), unique=True)

    dat_phong = relationship("DatPhong", back_populates="hoa_don")
    thanh_toan = relationship("ThanhToan", back_populates="hoa_don")


class ThanhToan(Base):
    __tablename__ = "THANH_TOAN"

    ma_thanh_toan = Column(Integer, primary_key=True, autoincrement=True)
    ma_hoa_don = Column(Integer, ForeignKey("HOA_DON.ma_hoa_don"))
    ngay_thanh_toan = Column(Date)
    phuong_thuc = Column(String(50))
    so_tien = Column(Numeric(10, 2))
    trang_thai = Column(String(50))

    hoa_don = relationship("HoaDon", back_populates="thanh_toan")


class TaiKhoan(Base):
    __tablename__ = "TAI_KHOAN"

    ma_tai_khoan = Column(Integer, primary_key=True, autoincrement=True)
    ten_dang_nhap = Column(String(100), unique=True, nullable=False)
    mat_khau = Column(String(255), nullable=False)
    vai_tro = Column(String(20), nullable=False, default="khach_hang")
    ma_khach_hang = Column(Integer, ForeignKey("KHACH_HANG.ma_khach_hang"), nullable=True)
    trang_thai = Column(String(50), default="Hoạt động")

    khach_hang = relationship("KhachHang", back_populates="tai_khoan")
