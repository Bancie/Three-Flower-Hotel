from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import KhachHang
from ..schemas import KhachHangCreate, KhachHangOut, KhachHangBase
from ..auth import require_role

router = APIRouter()


@router.get("", response_model=List[KhachHangOut])
def list_customers(
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    return db.query(KhachHang).all()


@router.get("/{ma_khach_hang}", response_model=KhachHangOut)
def get_customer(
    ma_khach_hang: int,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(KhachHang).get(ma_khach_hang)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    return item


@router.post("", response_model=KhachHangOut)
def create_customer(
    data: KhachHangCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = KhachHang(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{ma_khach_hang}", response_model=KhachHangOut)
def update_customer(
    ma_khach_hang: int,
    data: KhachHangBase,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(KhachHang).get(ma_khach_hang)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    for key, val in data.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(item, key, val)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{ma_khach_hang}")
def delete_customer(
    ma_khach_hang: int,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(KhachHang).get(ma_khach_hang)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    db.delete(item)
    db.commit()
    return {"detail": "Đã xóa khách hàng"}
