from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from ..database import get_db
from ..models import TaiKhoan
from ..schemas import TaiKhoanOut, TaiKhoanCreate, TaiKhoanUpdate
from ..auth import require_role, hash_password

router = APIRouter()


def _to_out(t: TaiKhoan) -> dict:
    return {
        "ma_tai_khoan": t.ma_tai_khoan,
        "ten_dang_nhap": t.ten_dang_nhap,
        "vai_tro": t.vai_tro,
        "ma_khach_hang": t.ma_khach_hang,
        "trang_thai": t.trang_thai,
        "ho_ten": t.khach_hang.ho_ten if t.khach_hang else ("Lễ tân" if t.vai_tro == "le_tan" else ""),
    }


@router.get("/", response_model=List[TaiKhoanOut])
def list_accounts(
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    items = db.query(TaiKhoan).options(joinedload(TaiKhoan.khach_hang)).all()
    return [_to_out(t) for t in items]


@router.post("/", response_model=TaiKhoanOut)
def create_account(
    data: TaiKhoanCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    existing = db.query(TaiKhoan).filter(TaiKhoan.ten_dang_nhap == data.ten_dang_nhap).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")

    account = TaiKhoan(
        ten_dang_nhap=data.ten_dang_nhap,
        mat_khau=hash_password(data.mat_khau),
        vai_tro=data.vai_tro,
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return _to_out(account)


@router.put("/{ma_tai_khoan}", response_model=TaiKhoanOut)
def update_account(
    ma_tai_khoan: int,
    data: TaiKhoanUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(TaiKhoan).options(joinedload(TaiKhoan.khach_hang)).get(ma_tai_khoan)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản")
    for key, val in data.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(item, key, val)
    db.commit()
    db.refresh(item)
    return _to_out(item)


@router.delete("/{ma_tai_khoan}")
def delete_account(
    ma_tai_khoan: int,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(TaiKhoan).get(ma_tai_khoan)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản")
    db.delete(item)
    db.commit()
    return {"detail": "Đã xóa tài khoản"}
