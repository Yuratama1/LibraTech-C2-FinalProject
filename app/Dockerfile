# import image node versi 18 alpine
# 1. Gunakan base image Node.js yang ringan
FROM node:18-alpine

# 2. Tentukan working directory di dalam container
WORKDIR /app

# 3. Copy file package.json dulu (biar cache optimal)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy seluruh sisa source code ke dalam container
COPY . .

# 6. Buka port aplikasi (Sesuai dengan app.js kamu yaitu 3000)
EXPOSE 3000

# 7. Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]