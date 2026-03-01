from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import LoaiPhong
from ..schemas import LoaiPhongCreate, LoaiPhongOut, LoaiPhongBase
from ..auth import get_current_user, require_role

router = APIRouter()


@router.get("/", response_model=List[LoaiPhongOut])
def list_room_types(db: Session = Depends(get_db)):
    return db.query(LoaiPhong).all()


@router.get("/{ma_loai_phong}", response_model=LoaiPhongOut)
def get_room_type(ma_loai_phong: int, db: Session = Depends(get_db)):
    item = db.query(LoaiPhong).get(ma_loai_phong)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại phòng")
    return item


@router.post("/", response_model=LoaiPhongOut)
def create_room_type(
    data: LoaiPhongCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = LoaiPhong(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{ma_loai_phong}", response_model=LoaiPhongOut)
def update_room_type(
    ma_loai_phong: int,
    data: LoaiPhongBase,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(LoaiPhong).get(ma_loai_phong)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại phòng")
    for key, val in data.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(item, key, val)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{ma_loai_phong}")
def delete_room_type(
    ma_loai_phong: int,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(LoaiPhong).get(ma_loai_phong)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại phòng")
    db.delete(item)
    db.commit()
    return {"detail": "Đã xóa loại phòng"}
