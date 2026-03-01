from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List, Optional

from ..database import get_db
from ..models import DatPhong, HoaDon, Phong
from ..schemas import BookingStats
from ..auth import require_role

router = APIRouter()


@router.get("/dat-phong", response_model=List[BookingStats])
def booking_statistics(
    nam: Optional[int] = Query(None, description="Năm thống kê"),
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    q = db.query(
        func.date_format(DatPhong.ngay_nhan_phong, "%Y-%m").label("thang"),
        func.count(DatPhong.ma_dat_phong).label("so_luong"),
    )
    if nam:
        q = q.filter(extract("year", DatPhong.ngay_nhan_phong) == nam)
    q = q.group_by("thang").order_by("thang")
    rows = q.all()

    result = []
    for row in rows:
        rev_q = (
            db.query(func.coalesce(func.sum(HoaDon.tong_tien), 0))
            .join(DatPhong, HoaDon.ma_dat_phong == DatPhong.ma_dat_phong)
            .filter(func.date_format(DatPhong.ngay_nhan_phong, "%Y-%m") == row.thang)
        )
        revenue = float(rev_q.scalar() or 0)
        result.append(BookingStats(thang=row.thang, so_luong=row.so_luong, doanh_thu=revenue))

    return result


@router.get("/tong-quan")
def overview(
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    total_rooms = db.query(func.count(Phong.ma_phong)).scalar() or 0
    available = db.query(func.count(Phong.ma_phong)).filter(Phong.trang_thai_phong == "Trống").scalar() or 0
    total_bookings = db.query(func.count(DatPhong.ma_dat_phong)).scalar() or 0
    active_bookings = (
        db.query(func.count(DatPhong.ma_dat_phong))
        .filter(DatPhong.trang_thai.in_(["Đã xác nhận", "Đang chờ"]))
        .scalar() or 0
    )
    total_revenue = float(
        db.query(func.coalesce(func.sum(HoaDon.tong_tien), 0)).scalar() or 0
    )

    return {
        "tong_phong": total_rooms,
        "phong_trong": available,
        "tong_dat_phong": total_bookings,
        "dat_phong_hien_tai": active_bookings,
        "tong_doanh_thu": total_revenue,
    }
