from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3307")
DB_NAME = os.getenv("DB_NAME", "hotel_bahoa")

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    "?charset=utf8mb4"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create TAI_KHOAN table and ensure AUTO_INCREMENT on existing tables."""
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS TAI_KHOAN (
                ma_tai_khoan INT AUTO_INCREMENT PRIMARY KEY,
                ten_dang_nhap VARCHAR(100) UNIQUE NOT NULL,
                mat_khau VARCHAR(255) NOT NULL,
                vai_tro VARCHAR(20) NOT NULL DEFAULT 'khach_hang',
                ma_khach_hang INT NULL,
                trang_thai VARCHAR(50) DEFAULT 'Hoạt động',
                FOREIGN KEY (ma_khach_hang) REFERENCES KHACH_HANG(ma_khach_hang)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """))

        tables_pk = [
            ("KHACH_HANG", "ma_khach_hang"),
            ("LOAI_PHONG", "ma_loai_phong"),
            ("PHONG", "ma_phong"),
            ("DAT_PHONG", "ma_dat_phong"),
            ("HOA_DON", "ma_hoa_don"),
            ("THANH_TOAN", "ma_thanh_toan"),
        ]
        for table, pk in tables_pk:
            try:
                conn.execute(text(
                    f"ALTER TABLE `{table}` MODIFY `{pk}` INT AUTO_INCREMENT"
                ))
            except Exception:
                pass

        conn.commit()
