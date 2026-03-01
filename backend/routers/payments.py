from datetime import date as date_type
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import ThanhToan, HoaDon
from ..schemas import ThanhToanCreate, ThanhToanOut, ThanhToanBase
from ..auth import require_role

router = APIRouter()


@router.get("/", response_model=List[ThanhToanOut])
def list_payments(
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    return db.query(ThanhToan).order_by(ThanhToan.ma_thanh_toan.desc()).all()


@router.get("/{ma_thanh_toan}", response_model=ThanhToanOut)
def get_payment(
    ma_thanh_toan: int,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(ThanhToan).get(ma_thanh_toan)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy thanh toán")
    return item


@router.post("/", response_model=ThanhToanOut)
def create_payment(
    data: ThanhToanCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    invoice = db.query(HoaDon).get(data.ma_hoa_don)
    if not invoice:
        raise HTTPException(status_code=400, detail="Hóa đơn không tồn tại")

    payment = ThanhToan(
        ma_hoa_don=data.ma_hoa_don,
        ngay_thanh_toan=date_type.today(),
        phuong_thuc=data.phuong_thuc,
        so_tien=data.so_tien,
        trang_thai="Đã thanh toán",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


@router.put("/{ma_thanh_toan}", response_model=ThanhToanOut)
def update_payment(
    ma_thanh_toan: int,
    data: ThanhToanBase,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(ThanhToan).get(ma_thanh_toan)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy thanh toán")
    for key, val in data.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(item, key, val)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{ma_thanh_toan}")
def delete_payment(
    ma_thanh_toan: int,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(ThanhToan).get(ma_thanh_toan)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy thanh toán")
    db.delete(item)
    db.commit()
    return {"detail": "Đã xóa thanh toán"}
