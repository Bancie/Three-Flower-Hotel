from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from ..database import get_db
from ..models import DatPhong, Phong, KhachHang, TaiKhoan
from ..schemas import DatPhongCreate, DatPhongOut, DatPhongBase
from ..auth import get_current_user

router = APIRouter()


def _to_out(b: DatPhong) -> dict:
    return {
        "ma_dat_phong": b.ma_dat_phong,
        "ma_khach_hang": b.ma_khach_hang,
        "ma_phong": b.ma_phong,
        "ngay_nhan_phong": b.ngay_nhan_phong,
        "ngay_tra_phong": b.ngay_tra_phong,
        "trang_thai": b.trang_thai,
        "ho_ten_khach": b.khach_hang.ho_ten if b.khach_hang else None,
        "so_phong": b.phong.so_phong if b.phong else None,
    }


@router.get("", response_model=List[DatPhongOut])
def list_bookings(
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    q = db.query(DatPhong).options(
        joinedload(DatPhong.khach_hang),
        joinedload(DatPhong.phong),
    )
    if current_user.vai_tro == "khach_hang":
        q = q.filter(DatPhong.ma_khach_hang == current_user.ma_khach_hang)
    items = q.order_by(DatPhong.ma_dat_phong.desc()).all()
    return [_to_out(b) for b in items]


@router.get("/{ma_dat_phong}", response_model=DatPhongOut)
def get_booking(
    ma_dat_phong: int,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    b = (
        db.query(DatPhong)
        .options(joinedload(DatPhong.khach_hang), joinedload(DatPhong.phong))
        .get(ma_dat_phong)
    )
    if not b:
        raise HTTPException(status_code=404, detail="Không tìm thấy đặt phòng")
    if current_user.vai_tro == "khach_hang" and b.ma_khach_hang != current_user.ma_khach_hang:
        raise HTTPException(status_code=403, detail="Không đủ quyền")
    return _to_out(b)


@router.post("", response_model=DatPhongOut)
def create_booking(
    data: DatPhongCreate,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    if current_user.vai_tro == "khach_hang":
        data.ma_khach_hang = current_user.ma_khach_hang

    if not db.query(KhachHang).get(data.ma_khach_hang):
        raise HTTPException(status_code=400, detail="Khách hàng không tồn tại")

    phong = db.query(Phong).get(data.ma_phong)
    if not phong:
        raise HTTPException(status_code=400, detail="Phòng không tồn tại")

    conflict = (
        db.query(DatPhong)
        .filter(
            DatPhong.ma_phong == data.ma_phong,
            DatPhong.trang_thai.in_(["Đã xác nhận", "Đang chờ"]),
            DatPhong.ngay_nhan_phong < data.ngay_tra_phong,
            DatPhong.ngay_tra_phong > data.ngay_nhan_phong,
        )
        .first()
    )
    if conflict:
        raise HTTPException(status_code=400, detail="Phòng đã được đặt trong khoảng thời gian này")

    booking = DatPhong(
        ma_khach_hang=data.ma_khach_hang,
        ma_phong=data.ma_phong,
        ngay_nhan_phong=data.ngay_nhan_phong,
        ngay_tra_phong=data.ngay_tra_phong,
        trang_thai="Đang chờ",
    )
    db.add(booking)
    db.flush()

    phong.trang_thai_phong = "Đã đặt"
    db.commit()
    db.refresh(booking)

    b = (
        db.query(DatPhong)
        .options(joinedload(DatPhong.khach_hang), joinedload(DatPhong.phong))
        .get(booking.ma_dat_phong)
    )
    return _to_out(b)


@router.put("/{ma_dat_phong}", response_model=DatPhongOut)
def update_booking(
    ma_dat_phong: int,
    data: DatPhongBase,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    item = db.query(DatPhong).get(ma_dat_phong)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy đặt phòng")
    if current_user.vai_tro == "khach_hang":
        raise HTTPException(status_code=403, detail="Không đủ quyền")

    for key, val in data.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(item, key, val)

    if data.trang_thai == "Đã hủy" and item.phong:
        active = (
            db.query(DatPhong)
            .filter(
                DatPhong.ma_phong == item.ma_phong,
                DatPhong.ma_dat_phong != ma_dat_phong,
                DatPhong.trang_thai.in_(["Đã xác nhận", "Đang chờ"]),
            )
            .first()
        )
        if not active:
            item.phong.trang_thai_phong = "Trống"

    db.commit()
    db.refresh(item)
    b = (
        db.query(DatPhong)
        .options(joinedload(DatPhong.khach_hang), joinedload(DatPhong.phong))
        .get(item.ma_dat_phong)
    )
    return _to_out(b)


@router.delete("/{ma_dat_phong}")
def cancel_booking(
    ma_dat_phong: int,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    item = db.query(DatPhong).get(ma_dat_phong)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy đặt phòng")
    if current_user.vai_tro == "khach_hang" and item.ma_khach_hang != current_user.ma_khach_hang:
        raise HTTPException(status_code=403, detail="Không đủ quyền")

    item.trang_thai = "Đã hủy"
    active = (
        db.query(DatPhong)
        .filter(
            DatPhong.ma_phong == item.ma_phong,
            DatPhong.ma_dat_phong != ma_dat_phong,
            DatPhong.trang_thai.in_(["Đã xác nhận", "Đang chờ"]),
        )
        .first()
    )
    if not active and item.phong:
        item.phong.trang_thai_phong = "Trống"

    db.commit()
    return {"detail": "Đã hủy đặt phòng"}
