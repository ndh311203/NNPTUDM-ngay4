# NNPTUDM-ngay4
Nguyễn Đức Huy - 2280601174

## Repository
https://github.com/ndh311203/NNPTUDM-ngay4

## Chạy
1. MongoDB `localhost:27017`
2. `npm install`
3. `npm run seed` — nạp `data2.js` vào DB `nnptudm_bt_buoi4`
4. `npm start` — API `http://localhost:3000`

## API
| Method | Path | Mô tả |
|--------|------|--------|
| GET | `/roles` | Danh sách role |
| GET | `/roles/:id` | Chi tiết role |
| GET | `/roles/:id/users` | Tất cả user thuộc role `:id` |
| POST | `/roles` | Tạo role (`name`, `description`) |
| PUT | `/roles/:id` | Cập nhật role |
| DELETE | `/roles/:id` | Xóa role |
| GET | `/users` | Danh sách user |
| GET | `/users/:username` | Chi tiết user |
| POST | `/users` | Tạo user; `roleId` tùy chọn (mặc định `r1`) |
| PUT | `/users/:username` | Cập nhật user (có thể gửi `roleId`) |
| DELETE | `/users/:username` | Xóa user |

## Postman
Import file `NNPTUDM_Bt_buoi4.postman_collection.json` (đủ CRUD + `GET /roles/:id/users`).
