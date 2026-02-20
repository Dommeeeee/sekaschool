# ระบบแจ้งปัญหาโรงเรียนเซกา จังหวัดบึงกาฬ

ระบบแจ้งปัญหาและติดตามการแก้ไขปัญหาภายในโรงเรียนเซกา สร้างด้วย Next.js และ Firebase Real-time Database

## ✨ Features

- 🎯 **หน้าแจ้งปัญหา**: แบบฟอร์มสวยงาม รองรับภาษาไทย
- 👨‍💼 **แผงควบคุมผู้ดูแล**: จัดการปัญหา ดูสถิติ และติดตามสถานะ
- 📊 **ระบบติดตามสถานะ**: รอดำเนินการ → กำลังดำเนินการ → แก้ไขแล้ว
- 🔍 **ค้นหาและกรอง**: ตามหมวดหมู่ ความเร่งด่วน สถานะ
- 🔄 **Real-time Updates**: ข้อมูลอัปเดตทันทีทุกที่ทุกเวลา
- 📱 **Responsive Design**: รองรับทุกอุปกรณ์
- 🎨 **UI/UX สวยงาม**: ใช้สีธีมโรงเรียน แอนิเมชั่นนุ่มนวล

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm หรือ yarn
- Firebase project (มีคอนฟิกแล้ว)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dommeeeee/sekaschool.git
cd sekaschool
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

## 🔐 Admin Access

- URL: `/admin`
- Password: `admin1234`

## 📱 Firebase Configuration

โปรเจคนี้ใช้ Firebase Real-time Database สำหรับเก็บข้อมูลแบบ real-time:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBUuCrJxIC76NF_fcjcL33dk2qhMks1ow0",
  authDomain: "school-92721.firebaseapp.com",
  projectId: "school-92721",
  storageBucket: "school-92721.firebasestorage.app",
  messagingSenderId: "575199760636",
  appId: "1:575199760636:web:ae6b7005706288449ec779",
  measurementId: "G-Y7JQ7XP9KC",
  databaseURL: "https://school-92721-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
```

**Database URL**: https://school-92721-default-rtdb.asia-southeast1.firebasedatabase.app/

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Real-time Database
- **UI Components**: Lucide Icons, Custom Components
- **Fonts**: Sarabun (Thai support)

## 📁 Project Structure

```
├── app/
│   ├── api/           # API routes
│   ├── admin/         # Admin page
│   └── globals.css    # Global styles
├── components/        # React components
├── lib/              # Utilities and Firebase config
├── public/           # Static assets (logo)
└── data/             # Server-side data storage
```

## 🎯 How to Use

### สำหรับนักเรียน/บุคลากร:
1. ไปที่หน้าหลัก
2. คลิก "แจ้งปัญหาใหม่"
3. กรอกข้อมูลปัญหา
4. จดรหัสการแจ้งปัญหา (ISS-XXXXX) ไว้ติดตาม

### สำหรับผู้ดูแลระบบ:
1. ไปที่ `/admin`
2. ใส่รหัสผ่าน `admin1234`
3. จัดการปัญหา เปลี่ยนสถานะ เพิ่มหมายเหตุ
4. ดูสถิติและรายงาน

## 🚀 Deployment

### Vercel (Recommended)
1. Push ไป GitHub
2. เชื่อมต่อกับ Vercel
3. Deploy อัตโนมัติ

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

## 🤝 Contributing

1. Fork โปรเจค
2. สร้าง feature branch
3. Commit changes
4. Push และ Pull Request

## 📄 License

MIT License - ดูที่ [LICENSE](LICENSE) file

## 📞 Support

ถ้ามีปัญหาการใช้งาน ติดต่อ:
- GitHub Issues: https://github.com/Dommeeeee/sekaschool/issues
- Email: [your-email@seka-school.ac.th]

---

🏫 **โรงเรียนเซกา จังหวัดบึงกาฬ** - พัฒนาเพื่อการศึกษาไทย 🇹🇭
