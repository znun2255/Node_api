const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// นำเข้าไฟล์การรับรองที่ดาวน์โหลดมา
const serviceAccount = require('./path/to/serviceAccountKey.json');
// กำหนดการรับรองให้ Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://test-liff-01-default-rtdb.asia-southeast1.firebasedatabase.app'
});

// "client_email": "firebase-adminsdk-bq80e@test-liff-01.iam.gserviceaccount.com",


if (admin.apps.length) {
    console.log('เชื่อมต่อกับ Firebase สำเร็จแล้ว');
} else {
    console.log('ไม่สามารถเชื่อมต่อกับ Firebase ได้');
}
const db = admin.firestore();

app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// กำหนดเส้นทางสำหรับการเรียกข้อมูลจาก Firebase
app.get('/data', (req, res) => {
    db.collection('users').get()
        .then(snapshot => {
            const data = [];
            snapshot.forEach(doc => {
                data.push(doc.data());
            });

            let message = "";
            if (data === undefined || data.length == 0) {
                message = "User is Empty";
                res.status(400).send({ error: true, data: data, message: message });
            } else {
                message = "Fetch Complete";
            }
            res.send({ error: false, data: data, message: message });
        })
        .catch(error => {
            console.log('Error getting documents:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/data/:id', (req, res) => {
    let DOCid = req.params.id;

    db.collection('users').doc(DOCid).get()
        .then((doc) => {

            let message = "";
            if (doc.exists) {
                message = "User Fetch Complete";
                res.send({ error: false, data: doc.data(), message: message });

            } else {
                return res.status(400).send({ error: true, messege: "Please insert ID" });
            }
        })
        .catch(error => {
            console.log('Error getting documents:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.post('/data', async (req, res) => {
    const { name, age } = req.body;
    const newData = { name, age };
    console.log(newData);
    db.collection('/users').doc('user')
        .set({ newData })
        .then((docRef) => {
            console.log('Document written with ID:', docRef.id);
            res.send({ error: false, message: 'Data written successfully' });
        })
        .catch((error) => {
            console.error('Error adding document:', error);
            res.send({ error: true, message: error.message });
        });
});


// กำหนดพอร์ตและเริ่มต้นเซิร์ฟเวอร์
const port = 3000; // เปลี่ยนเป็นพอร์ตที่คุณต้องการ
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// export Firebase Realtime Database หรืออ็อบเจ็กต์ที่ใช้เพื่อเชื่อมต่อ
module.exports = app;