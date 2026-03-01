from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from ..database import get_db
from ..models import Phong, LoaiPhong
from ..schemas import PhongCreate, PhongOut, PhongBase
from ..auth import get_current_user, require_role

router = APIRouter()


def _to_out(p: Phong) -> dict:
    d = {
        "ma_phong": p.ma_phong,
        "so_phong": p.so_phong,
        "trang_thai_phong": p.trang_thai_phong,
        "ma_loai_phong": p.ma_loai_phong,
        "ten_loai_phong": p.loai_phong.ten_loai_phong if p.loai_phong else None,
        "gia_phong": float(p.loai_phong.gia_phong) if p.loai_phong else None,
    }
    return d


@router.get("", response_model=List[PhongOut])
def list_rooms(db: Session = Depends(get_db)):
    items = db.query(Phong).options(joinedload(Phong.loai_phong)).all()
    return [_to_out(p) for p in items]


@router.get("/{ma_phong}", response_model=PhongOut)
def get_room(ma_phong: int, db: Session = Depends(get_db)):
    p = db.query(Phong).options(joinedload(Phong.loai_phong)).get(ma_phong)
    if not p:
        raise HTTPException(status_code=404, detail="Không tìm thấy phòng")
    return _to_out(p)


@router.post("", response_model=PhongOut)
def create_room(
    data: PhongCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    if not db.query(LoaiPhong).get(data.ma_loai_phong):
        raise HTTPException(status_code=400, detail="Loại phòng không tồn tại")
    item = Phong(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    p = db.query(Phong).options(joinedload(Phong.loai_phong)).get(item.ma_phong)
    return _to_out(p)


@router.put("/{ma_phong}", response_model=PhongOut)
def update_room(
    ma_phong: int,
    data: PhongBase,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(Phong).get(ma_phong)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy phòng")
    for key, val in data.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(item, key, val)
    db.commit()
    db.refresh(item)
    p = db.query(Phong).options(joinedload(Phong.loai_phong)).get(item.ma_phong)
    return _to_out(p)


@router.delete("/{ma_phong}")
def delete_room(
    ma_phong: int,
    db: Session = Depends(get_db),
    _=Depends(require_role("le_tan")),
):
    item = db.query(Phong).get(ma_phong)
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy phòng")
    db.delete(item)
    db.commit()
    return {"detail": "Đã xóa phòng"}
