const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

let mockDatabase = [];

// รายชื่อสถานที่ท่องเที่ยวและรูปภาพ (เตรียมไว้สำหรับสุ่ม)
const travelDestinations = [
    { place: "ภูเขาไฟฟูจิ", country: "ประเทศญี่ปุ่น", image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&q=80" },
    { place: "ทะเลมัลดีฟส์", country: "มัลดีฟส์", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80" },
    { place: "หอไอเฟล", country: "ประเทศฝรั่งเศส", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&q=80" },
    { place: "บอลลูน คัปปาโดเกีย", country: "ประเทศตุรกี", image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400&q=80" },
    { place: "แกรนด์แคนยอน", country: "สหรัฐอเมริกา", image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&q=80" }
];

app.get('/api/data', (req, res) => {
    res.json(mockDatabase);
});

// API: สุ่มสถานที่ท่องเที่ยว
app.post('/api/generate', (req, res) => {
    // สุ่มเลือก 1 สถานที่จาก Array
    const randomIndex = Math.floor(Math.random() * travelDestinations.length);
    const selectedTravel = travelDestinations[randomIndex];

    const randomData = {
        id: Date.now(),
        place: selectedTravel.place,
        country: selectedTravel.country,
        imageUrl: selectedTravel.image,
        timestamp: new Date().toLocaleString('th-TH')
    };

    mockDatabase.push(randomData);
    res.json({ message: "สุ่มที่เที่ยวสำเร็จ!", data: randomData });
});

app.delete('/api/data', (req, res) => {
    mockDatabase = [];
    res.json({ message: "ล้างข้อมูลทั้งหมดแล้ว" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 เซิร์ฟเวอร์ทำงานแล้วที่: http://localhost:${PORT}`);
});
