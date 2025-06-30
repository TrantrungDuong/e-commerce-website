# Dockerfile cho ứng dụng Node.js

FROM node:20-alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Copy các file package.json và package-lock.json trước để tận dụng Docker cache
# nếu dependencies không thay đổi
COPY package*.json .

# Cài đặt các dependencies của Node.js
RUN npm install

# Copy toàn bộ mã nguồn của ứng dụng vào thư mục làm việc trong container
# Đảm bảo lệnh này nằm SAU 'npm install' để tận dụng cache
COPY . .

# Khai báo port mà ứng dụng sẽ lắng nghe
EXPOSE 3000

# Lệnh sẽ được thực thi khi container khởi động
ENTRYPOINT ["npm", "start"]