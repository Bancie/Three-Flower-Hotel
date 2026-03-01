from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import TaiKhoan, KhachHang
from ..schemas import RegisterRequest, LoginRequest, TokenResponse
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(TaiKhoan).filter(
        TaiKhoan.ten_dang_nhap == req.ten_dang_nhap
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")

    khach = KhachHang(
        ho_ten=req.ho_ten,
        so_dien_thoai=req.so_dien_thoai,
        email=req.email,
        so_giay_to=req.so_giay_to,
    )
    db.add(khach)
    db.flush()

    tai_khoan = TaiKhoan(
        ten_dang_nhap=req.ten_dang_nhap,
        mat_khau=hash_password(req.mat_khau),
        vai_tro="khach_hang",
        ma_khach_hang=khach.ma_khach_hang,
    )
    db.add(tai_khoan)
    db.commit()
    db.refresh(tai_khoan)

    token = create_access_token({"sub": tai_khoan.ma_tai_khoan})
    return TokenResponse(
        access_token=token,
        vai_tro=tai_khoan.vai_tro,
        ho_ten=khach.ho_ten,
    )


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(TaiKhoan).filter(
        TaiKhoan.ten_dang_nhap == req.ten_dang_nhap
    ).first()

    if not user or not verify_password(req.mat_khau, user.mat_khau):
        raise HTTPException(status_code=401, detail="Sai tên đăng nhập hoặc mật khẩu")

    if user.trang_thai != "Hoạt động":
        raise HTTPException(status_code=403, detail="Tài khoản đã bị vô hiệu hóa")

    ho_ten = ""
    if user.khach_hang:
        ho_ten = user.khach_hang.ho_ten or ""
    elif user.vai_tro == "le_tan":
        ho_ten = "Lễ tân"

    token = create_access_token({"sub": user.ma_tai_khoan})
    return TokenResponse(
        access_token=token,
        vai_tro=user.vai_tro,
        ho_ten=ho_ten,
    )


@router.get("/me")
def get_me(current_user: TaiKhoan = Depends(get_current_user)):
    ho_ten = ""
    if current_user.khach_hang:
        ho_ten = current_user.khach_hang.ho_ten or ""
    elif current_user.vai_tro == "le_tan":
        ho_ten = "Lễ tân"

    return {
        "ma_tai_khoan": current_user.ma_tai_khoan,
        "ten_dang_nhap": current_user.ten_dang_nhap,
        "vai_tro": current_user.vai_tro,
        "ho_ten": ho_ten,
        "ma_khach_hang": current_user.ma_khach_hang,
    }
