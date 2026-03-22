# IV. Cài đặt – Kiểm thử

Tài liệu này mô tả **ngôn ngữ lập trình**, **công cụ phát triển**, **môi trường triển khai** và **quy trình kiểm thử – đánh giá ứng dụng** cho dự án **Three Flower Hotel** (hệ thống quản lý khách sạn web: backend FastAPI + frontend React, cơ sở dữ liệu MySQL). Nội dung được rút ra trực tiếp từ cấu trúc mã nguồn và tệp cấu hình trong kho lưu trữ.

---

## 1. Ngôn ngữ, công cụ và môi trường

### 1.1. Ngôn ngữ lập trình và định dạng dữ liệu

| Thành phần | Ngôn ngữ / định dạng | Ghi chú |
|------------|----------------------|---------|
| Backend | **Python 3** (khuyến nghị **≥ 3.10**) | Ứng dụng API đồng bộ/bất đồng bộ theo chuẩn FastAPI; dùng type hints và mô hình Pydantic. |
| Frontend | **JavaScript (ES modules)** + **JSX** | Giao diện người dùng với React 19; `package.json` đặt `"type": "module"`. |
| Cơ sở dữ liệu | **SQL** (MySQL 8) | Script khởi tạo: `data/Three_Flow_Hotel.sql`; kết nối qua driver PyMySQL và SQLAlchemy. |
| Cấu hình & môi trường | **.env** (biến môi trường) | Được nạp bằng `python-dotenv` trong `backend/database.py`. |

### 1.2. Stack công nghệ theo từng lớp

**Backend (thư mục `backend/`)**

- **FastAPI**: framework web REST API, tự sinh tài liệu OpenAPI (Swagger UI, ReDoc).
- **Uvicorn** (`uvicorn[standard]`): ASGI server chạy ứng dụng; hỗ trợ `--reload` khi phát triển.
- **SQLAlchemy 2.x**: ORM, định nghĩa mô hình bảng trong `models.py`, session qua `SessionLocal`.
- **PyMySQL**: driver MySQL cho chuỗi kết nối `mysql+pymysql://...`.
- **Pydantic** (kèm FastAPI): xác thực request/response trong `schemas.py`.
- **Xác thực**: `python-jose` (JWT), `passlib` + `bcrypt` (băm mật khẩu; có ràng buộc `bcrypt<4.1` trong `requirements.txt` để tương thích).
- **python-multipart**: hỗ trợ form upload nếu API cần (chuẩn FastAPI).

**Frontend (thư mục `frontend/`)**

- **React 19** + **React DOM**: UI component-based.
- **React Router 7**: định tuyến phía client (`BrowserRouter`), tách luồng Lễ tân và Khách hàng.
- **Vite 7**: dev server và build production; cổng mặc định **5173**.
- **Tailwind CSS 4** (plugin `@tailwindcss/vite`): styling utility-first trong `index.css`.
- **Axios**: HTTP client, cấu hình base URL/interceptor JWT trong `src/api/axios.js`.
- **Recharts**: biểu đồ thống kê (trang thống kê Lễ tân).
- **react-icons**: icon giao diện.

**Công cụ phụ trợ**

- **npm** (kèm Node.js): cài dependency và chạy script `dev`, `build`, `lint`, `preview`.
- **ESLint 9** + plugin React: kiểm tra tĩnh mã nguồn frontend (`npm run lint`).

### 1.3. Kiến trúc vận hành và cổng mạng

- **Trình duyệt** → **Vite (5173)**: tài nguyên SPA; mọi request có đường dẫn `/api/*` được **proxy** sang backend `http://localhost:8000` (cấu hình trong `frontend/vite.config.js`).
- **Backend (8000)** ↔ **MySQL**: thường dùng cổng **3307** theo tài liệu dự án (có thể đổi qua biến môi trường).
- **CORS**: backend chỉ cho phép origin `http://localhost:5173` (`backend/main.py`), phù hợp môi trường dev local.

### 1.4. Yêu cầu hệ thống (máy phát triển / máy chạy thử)

| Thành phần | Phiên bản tối thiểu (theo README dự án) |
|------------|----------------------------------------|
| Python | ≥ **3.10** |
| Node.js | ≥ **18** |
| MySQL | ≥ **8.0** (đang giả định chạy tại **localhost:3307**) |
| Trình duyệt | Bất kỳ trình duyệt hiện đại hỗ trợ ES modules |

Hệ điều hành: **Windows**, **macOS**, **Linux** đều được; chỉ khác cú pháp kích hoạt virtualenv và biến môi trường (ví dụ `PYTHONPATH` trên Windows PowerShell).

### 1.5. Biến môi trường (file `.env` ở thư mục gốc)

Các biến sau được đọc trong backend (xem `backend/database.py` và README):

| Biến | Ý nghĩa |
|------|---------|
| `DB_USER`, `DB_PASS` | Tài khoản MySQL |
| `DB_HOST`, `DB_PORT` | Máy chủ và cổng (mặc định port **3307** nếu không set) |
| `DB_NAME` | Tên database (mặc định `hotel_bahoa`) |
| `SECRET_KEY` | Khóa ký JWT |
| `ALGORITHM` | Thuật toán JWT (thường `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Thời hạn token (ví dụ **480** phút = 8 giờ) |

**Lưu ý:** Không commit file `.env` chứa mật khẩu thật; chỉ cung cấp mẫu hoặc hướng dẫn tạo tay.

### 1.6. Quy trình cài đặt tóm tắt (theo thứ tự)

1. **Clone** repository và vào thư mục dự án.
2. **MySQL**: tạo database và import `data/Three_Flow_Hotel.sql` (schema + dữ liệu mẫu).
3. Tạo file **`.env`** với thông tin kết nối và JWT như trên.
4. **Python**: tạo virtual environment, `pip install -r requirements.txt`.
5. **Node**: `cd frontend && npm install`.
6. (Tùy chọn nhưng khuyến nghị) **Tạo tài khoản Lễ tân** bằng đoạn Python một dòng trong README (user `letan` / mật khẩu `letan123`) nếu chưa có trong DB.
7. Chạy **hai tiến trình**:
   - Backend (từ thư mục gốc):  
     `PYTHONPATH=. python -m uvicorn backend.main:app --reload --port 8000`  
     Dùng `PYTHONPATH=.` để tránh `ModuleNotFoundError: No module named 'backend'` khi dùng `--reload`.
   - Frontend: `cd frontend && npm run dev`.
8. Truy cập ứng dụng: **http://localhost:5173**.

### 1.7. Công cụ và tài liệu API kèm theo

- **Swagger UI**: `http://localhost:8000/docs` — thử trực tiếp endpoint, xem schema request/response.
- **ReDoc**: `http://localhost:8000/redoc` — tài liệu dạng đọc.
- Endpoint kiểm tra nhanh: **GET `/api/health`** trả về `{"status": "ok"}` (`backend/main.py`).

### 1.8. Xử lý sự cố thường gặp (đã ghi trong README)

- **Port 8000 bị chiếm**: dùng `lsof -i :8000` (macOS/Linux) rồi `kill` PID tương ứng.
- **Module `backend` không tìm thấy** khi reload: luôn chạy uvicorn với `PYTHONPATH=.` từ thư mục gốc dự án.

---

## 2. Kiểm thử: đánh giá ứng dụng

Phần này mô tả **cách kiểm thử thực tế** phù hợp với mã nguồn hiện tại và **đánh giá tổng quan** về chất lượng, phạm vi và hạn chế.

### 2.1. Hiện trạng kiểm thử tự động trong dự án

Trong kho mã **không có** thư mục test chuẩn (ví dụ `tests/` với **pytest**) cho backend, và **không cấu hình** framework test frontend như **Vitest** hay **Jest** trong `package.json`. Script `npm run lint` chỉ chạy **ESLint** — đây là kiểm tra tĩnh (style, một số lỗi logic cơ bản), **không thay thế** test đơn vị hay tích hợp.

**Ý nghĩa:** Chất lượng chức năng hiện phụ thuộc chủ yếu vào **kiểm thử thủ công**, **gọi API qua Swagger**, và **rà soát luồng nghiệp vụ** trên giao diện.

### 2.2. Kiểm thử API (backend)

**Phương pháp:**

1. Khởi chạy backend và mở **Swagger UI** (`/docs`).
2. Thử các nhóm endpoint theo thứ tự phụ thuộc: đăng ký/đăng nhập → lấy JWT → **Authorize** trong Swagger (nếu hỗ trợ) hoặc gửi header `Authorization: Bearer <token>` khi dùng công cụ khác.
3. Kiểm tra **GET `/api/health`** để xác nhận service sống.
4. Với từng module (`/api/loai-phong`, `/api/phong`, `/api/khach-hang`, `/api/dat-phong`, …), xác minh:
   - Mã HTTP (200, 201, 401, 403, 404, 422…) đúng kịch bản.
   - Phân quyền: endpoint chỉ dành **Lễ tân** phải từ chối khi dùng token **Khách hàng** và ngược lại (theo `README.md` bảng quyền).

**Nghiệp vụ cần chú ý khi thử API / UI:**

- **Đặt phòng**: kiểm tra xung đột thời gian — không cho hai đơn trùng khoảng ngày trên cùng một phòng; cập nhật trạng thái phòng (Trống / Đã đặt / …).
- **Hủy đặt phòng**: phòng trở lại trạng thái phù hợp khi không còn đơn active.
- **Hóa đơn**: tổng tiền = giá × số đêm (logic backend tự tính).
- **Thống kê**: tham số năm/tháng (nếu có) trả dữ liệu khớp dữ liệu đã nhập.

### 2.3. Kiểm thử giao diện (frontend)

**Phương pháp:** Kiểm thử chức năng thủ công (exploratory + checklist) trên trình duyệt tại `http://localhost:5173`.

**Nhóm kiểm thử gợi ý:**

| Vùng | Nội dung kiểm tra |
|------|-------------------|
| Xác thực | Đăng nhập/đăng ký, lưu token, đăng xuất, redirect theo vai trò (`/le-tan/*` vs `/khach-hang/*`). |
| Bảo vệ route | Truy cập trang Lễ tân bằng tài khoản Khách (và ngược lại) — phải bị chặn hoặc chuyển hướng (component `ProtectedRoute`). |
| Lễ tân | CRUD loại phòng, phòng, khách hàng; tạo/sửa đặt phòng; lập hóa đơn; thanh toán; thống kê; quản lý tài khoản. |
| Khách hàng | Xem phòng, lọc, đặt phòng, xem/hủy đặt của mình, xem hóa đơn của mình — không thấy dữ liệu người khác. |
| UX / lỗi mạng | Tắt backend và thao tác trên UI — thông báo lỗi (Axios) có hiển thị hợp lý. |

Có thể bổ sung **DevTools** (tab Network) để xác nhận request `/api/*` đi qua proxy và mã trạng thái HTTP.

### 2.4. Kiểm thử tĩnh và build

- Chạy `npm run lint` trong `frontend/` để phát hiện vi phạm quy tắc ESLint.
- Chạy `npm run build` để đảm bảo **build production** không lỗi (cú pháp, import, tree-shaking).

### 2.5. Đánh giá ứng dụng (tổng quan)

**Điểm mạnh (dựa trên thiết kế mã và tài liệu):**

- **Kiến trúc tách bạch**: React SPA + REST API + MySQL — dễ triển khai và mở rộng.
- **Bảo mật cơ bản**: JWT, phân vai **Lễ tân** / **Khách hàng**, mật khẩu băm bằng bcrypt.
- **Nghiệp vụ khách sạn đầy đủ**: từ danh mục phòng đến đặt phòng, hóa đơn, thanh toán, thống kê.
- **Khả năng quan sát API**: Swagger/ReDoc giúp kiểm thử và onboarding nhanh.
- **Trải nghiệm dev**: Hot reload (Vite + Uvicorn `--reload`), proxy gom CORS trong dev.

**Hạn chế và rủi ro về chất lượng:**

- **Thiếu test tự động**: hồi quy (regression) phải làm tay; refactor dễ sót lỗi.
- **Phụ thuộc kiểm thử thủ công**: không có số liệu coverage; khó đảm bảo mọi nhánh nghiệp vụ được thử đều đặn.
- **Môi trường**: CORS fix cứng `localhost:5173` — cần cấu hình lại khi triển khai domain/port khác.

**Kết luận đánh giá:** Ứng dụng **phù hợp làm bài tập / đồ án / demo nội bộ** với quy trình cài đặt rõ ràng và kiểm thử chức năng qua Swagger và UI. Để đưa vào môi trường production hoặc nhóm lớn, nên **bổ sung test tự động** (pytest + TestClient FastAPI cho API; Vitest/Playwright cho frontend) và pipeline CI chạy lint + test + build.

---

*Tài liệu này phản ánh trạng thái codebase tại thời điểm biên soạn; khi thêm test hoặc đổi stack, cần cập nhật lại mục 2 cho khớp thực tế.*
