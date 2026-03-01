from datetime import date as date_type
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from ..database import get_db
from ..models import HoaDon, DatPhong, TaiKhoan
from ..schemas import HoaDonCreate, HoaDonOut, HoaDonBase
from ..auth import get_current_user, require_role

router = APIRouter()


def _to_out(h: HoaDon) -> dict:
    return {
        "ma_hoa_don": h.ma_hoa_don,
        "tong_tien": float(h.tong_tien) if h.tong_tien else 0,
        "ngay_lap": h.ngay_lap,
        "ma_dat_phong": h.ma_dat_phong,
        "ho_ten_khach": h.dat_phong.khach_hang.ho_ten if h.dat_phong and h.dat_phong.khach_hang else None,
        "so_phong": h.dat_phong.phong.so_phong if h.dat_phong and h.dat_phong.phong else None,
    }


@router.get("/", response_model=List[HoaDonOut])
def list_invoices(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    q = db.query(HoaDon).options(
        joinedload(HoaDon.dat_phong).joinedload(DatPhong.khach_hang),
        joinedload(HoaDon.dat_phong).joinedload(DatPhong.phong),
    )
    if current_user.vai_tro == "khach_hang":
        q = q.join(DatPhong).filter(DatPhong.ma_khach_hang == current_user.ma_khach_hang)
    items = q.order_by(HoaDon.ma_hoa_don.desc()).all()
    return [_to_out(h) for h in items]


@router.get("/{ma_hoa_don}", response_model=HoaDonOut)
def get_invoice(
    ma_hoa_don: int,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    h = (
        db.query(HoaDon)
        .options(
            joinedload(HoaDon.dat_phong).joinedload(DatPhong.khach_hang),
            joinedload(HoaDon.dat_phong).joinedload(DatPhong.phong),
        )
        .get(ma_hoa_don)
    )
    if not h:
        raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn")
    if current_user.vai_tro == "khach_hang":
        if h.dat_phong and h.dat_phong.ma_khach_hang != current_user.ma_khach_hang:
            raise HTTPException(status_code=403, detail="Không đủ quyền")
    return _to_out(h)


@router.post("/", response_model=HoaDonOut)
def create_invoice(
    data: HoaDonCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    booking = (
        db.query(DatPhong)
        .options(joinedload(DatPhong.phong).joinedload("loai_phong"))
        .get(data.ma_dat_phong)
    )
    if not booking:
        raise HTTPException(status_code=400, detail="Đặt phòng không tồn tại")

    existing = db.query(HoaDon).filter(HoaDon.ma_dat_phong == data.ma_dat_phong).first()
    if existing:
        raise HTTPException(status_code=400, detail="Đặt phòng đã có hóa đơn")

    nights = (booking.ngay_tra_phong - booking.ngay_nhan_phong).days
    if nights < 1:
        nights = 1
    gia = float(booking.phong.loai_phong.gia_phong) if booking.phong and booking.phong.loai_phong else 0
    tong_tien = gia * nights

    invoice = HoaDon(
        tong_tien=tong_tien,
        ngay_lap=date_type.today(),
        ma_dat_phong=data.ma_dat_phong,
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    h = (
        db.query(HoaDon)
        .options(
            joinedload(HoaDon.dat_phong).joinedload(DatPhong.khach_hang),
            joinedload(HoaDon.dat_phong).joinedload(DatPhong.phong),
        )
        .get(invoice.ma_hoa_don)
    )
    return _to_out(h)


@router.put("/{ma_hoa_don}", response_model=HoaDonOut)
def update_invoice(
    ma_hoa_don: int,
    data: HoaDonBase,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(HoaDon).get(ma_hoa_don)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn")
    for key, val in data.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(item, key, val)
    db.commit()
    db.refresh(item)
    h = (
        db.query(HoaDon)
        .options(
            joinedload(HoaDon.dat_phong).joinedload(DatPhong.khach_hang),
            joinedload(HoaDon.dat_phong).joinedload(DatPhong.phong),
        )
        .get(item.ma_hoa_don)
    )
    return _to_out(h)


@router.delete("/{ma_hoa_don}")
def delete_invoice(
    ma_hoa_don: int,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(HoaDon).get(ma_hoa_don)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn")
    db.delete(item)
    db.commit()
    return {"detail": "Đã xóa hóa đơn"}
