const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ให้บริการโฟลเดอร์ public สำหรับหน้าเว็บ
app.use(express.static(path.join(__dirname, 'public')));

// 🌟 API สุดฉลาด: ส่งกุญแจ Supabase ไปให้หน้าเว็บ
app.get('/api/config', (req, res) => {
    res.json({
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY
    });
});

// 🔒 API สำหรับตรวจสอบรหัสผ่านแอดมิน (ป้องกันการเอารหัสไปแปะในหน้าเว็บ)
app.post('/api/verify-admin', (req, res) => {
    const { password } = req.body;
    // อ่านรหัสผ่านจากไฟล์ .env (ถ้าไม่มีจะใช้ 1234 เป็นค่าเริ่มต้น)
    const adminPassword = process.env.ADMIN_PASSWORD || '1234';
    
    if (password === adminPassword) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// ตั้งค่าให้เข้าเว็บมาปุ๊บ โยนไปหน้า Dashboard ทันที
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 เซิร์ฟเวอร์จุดตรวจทำงานแล้วที่พอร์ต: ${PORT}`);
});
