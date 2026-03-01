from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routers import auth, room_types, rooms, customers, bookings, invoices, payments, statistics, accounts

app = FastAPI(title="Three Flower Hotel API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(room_types.router, prefix="/api/loai-phong", tags=["Loại phòng"])
app.include_router(rooms.router, prefix="/api/phong", tags=["Phòng"])
app.include_router(customers.router, prefix="/api/khach-hang", tags=["Khách hàng"])
app.include_router(bookings.router, prefix="/api/dat-phong", tags=["Đặt phòng"])
app.include_router(invoices.router, prefix="/api/hoa-don", tags=["Hóa đơn"])
app.include_router(payments.router, prefix="/api/thanh-toan", tags=["Thanh toán"])
app.include_router(statistics.router, prefix="/api/thong-ke", tags=["Thống kê"])
app.include_router(accounts.router, prefix="/api/tai-khoan", tags=["Tài khoản"])


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok"}
