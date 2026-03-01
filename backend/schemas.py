from pydantic import BaseModel
from typing import Optional
from datetime import date


# ── Auth ──

class RegisterRequest(BaseModel):
    ten_dang_nhap: str
    mat_khau: str
    ho_ten: str
    so_dien_thoai: Optional[str] = None
    email: Optional[str] = None
    so_giay_to: Optional[str] = None


class LoginRequest(BaseModel):
    ten_dang_nhap: str
    mat_khau: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    vai_tro: str
    ho_ten: str


# ── Khách hàng ──

class KhachHangBase(BaseModel):
    ho_ten: Optional[str] = None
    so_dien_thoai: Optional[str] = None
    email: Optional[str] = None
    so_giay_to: Optional[str] = None


class KhachHangCreate(KhachHangBase):
    ho_ten: str


class KhachHangOut(KhachHangBase):
    ma_khach_hang: int

    class Config:
        from_attributes = True


# ── Loại phòng ──

class LoaiPhongBase(BaseModel):
    ten_loai_phong: Optional[str] = None
    gia_phong: Optional[float] = None
    mo_ta: Optional[str] = None


class LoaiPhongCreate(LoaiPhongBase):
    ten_loai_phong: str
    gia_phong: float


class LoaiPhongOut(LoaiPhongBase):
    ma_loai_phong: int

    class Config:
        from_attributes = True


# ── Phòng ──

class PhongBase(BaseModel):
    so_phong: Optional[str] = None
    trang_thai_phong: Optional[str] = None
    ma_loai_phong: Optional[int] = None


class PhongCreate(PhongBase):
    so_phong: str
    ma_loai_phong: int
    trang_thai_phong: str = "Trống"


class PhongOut(PhongBase):
    ma_phong: int
    ten_loai_phong: Optional[str] = None
    gia_phong: Optional[float] = None

    class Config:
        from_attributes = True


# ── Đặt phòng ──

class DatPhongBase(BaseModel):
    ma_khach_hang: Optional[int] = None
    ma_phong: Optional[int] = None
    ngay_nhan_phong: Optional[date] = None
    ngay_tra_phong: Optional[date] = None
    trang_thai: Optional[str] = None


class DatPhongCreate(BaseModel):
    ma_khach_hang: int
    ma_phong: int
    ngay_nhan_phong: date
    ngay_tra_phong: date


class DatPhongOut(DatPhongBase):
    ma_dat_phong: int
    ho_ten_khach: Optional[str] = None
    so_phong: Optional[str] = None

    class Config:
        from_attributes = True


# ── Hóa đơn ──

class HoaDonBase(BaseModel):
    tong_tien: Optional[float] = None
    ngay_lap: Optional[date] = None
    ma_dat_phong: Optional[int] = None


class HoaDonCreate(BaseModel):
    ma_dat_phong: int


class HoaDonOut(HoaDonBase):
    ma_hoa_don: int
    ho_ten_khach: Optional[str] = None
    so_phong: Optional[str] = None

    class Config:
        from_attributes = True


# ── Thanh toán ──

class ThanhToanBase(BaseModel):
    ma_hoa_don: Optional[int] = None
    ngay_thanh_toan: Optional[date] = None
    phuong_thuc: Optional[str] = None
    so_tien: Optional[float] = None
    trang_thai: Optional[str] = None


class ThanhToanCreate(BaseModel):
    ma_hoa_don: int
    phuong_thuc: str
    so_tien: float


class ThanhToanOut(ThanhToanBase):
    ma_thanh_toan: int

    class Config:
        from_attributes = True


# ── Tài khoản ──

class TaiKhoanOut(BaseModel):
    ma_tai_khoan: int
    ten_dang_nhap: str
    vai_tro: str
    ma_khach_hang: Optional[int] = None
    trang_thai: str
    ho_ten: Optional[str] = None

    class Config:
        from_attributes = True


class TaiKhoanCreate(BaseModel):
    ten_dang_nhap: str
    mat_khau: str
    vai_tro: str = "le_tan"


class TaiKhoanUpdate(BaseModel):
    vai_tro: Optional[str] = None
    trang_thai: Optional[str] = None


# ── Statistics ──

class BookingStats(BaseModel):
    thang: str
    so_luong: int
    doanh_thu: float
