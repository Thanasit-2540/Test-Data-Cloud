const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const admin = require('firebase-admin');

// ตั้งค่า Firebase (รองรับทั้งรันในเครื่องตัวเอง และรันบน Render.com)
let serviceAccount;
if (process.env.FIREBASE_CREDENTIALS) {
    // ดึงจาก Environment Variables ของ Render.com
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} else {
    // ดึงจากไฟล์ในเครื่อง (Local)
    serviceAccount = require('./firebase-key.json');
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// รายชื่อสถานที่ท่องเที่ยวและรูปภาพ (เตรียมไว้สำหรับสุ่ม)
const travelDestinations = [
    { place: "ภูเขาไฟฟูจิ", country: "ประเทศญี่ปุ่น", image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&q=80" },
    { place: "ทะเลมัลดีฟส์", country: "มัลดีฟส์", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80" },
    { place: "หอไอเฟล", country: "ประเทศฝรั่งเศส", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&q=80" },
    { place: "บอลลูน คัปปาโดเกีย", country: "ประเทศตุรกี", image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400&q=80" },
    { place: "แกรนด์แคนยอน", country: "สหรัฐอเมริกา", image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&q=80" }
];

// API: ดึงข้อมูลทั้งหมดจาก Firestore
app.get('/api/data', async (req, res) => {
    try {
        const snapshot = await db.collection('travels').orderBy('timestamp', 'asc').get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: สุ่มสถานที่ท่องเที่ยวและบันทึกลง Firestore
app.post('/api/generate', async (req, res) => {
    try {
        const randomIndex = Math.floor(Math.random() * travelDestinations.length);
        const selectedTravel = travelDestinations[randomIndex];

        const randomData = {
            place: selectedTravel.place,
            country: selectedTravel.country,
            imageUrl: selectedTravel.image,
            timestamp: new Date().toLocaleString('th-TH')
        };

        const docRef = await db.collection('travels').add(randomData);
        res.json({ message: "สุ่มที่เที่ยวสำเร็จ!", data: { id: docRef.id, ...randomData } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: ล้างข้อมูลทั้งหมดใน Firestore
app.delete('/api/data', async (req, res) => {
    try {
        const snapshot = await db.collection('travels').get();
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        res.json({ message: "ล้างข้อมูลทั้งหมดแล้ว" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 เซิร์ฟเวอร์ทำงานแล้วที่พอร์ต: ${PORT}`);
});
