# GutasClient
# Dokumentasi Aplikasi Rock Paper Scissors Multiplayer

## 📝 Deskripsi Project
Aplikasi web multiplayer Rock Paper Scissors (Batu Gunting Kertas) yang dibangun menggunakan teknologi modern. Permainan ini memungkinkan 2 pemain untuk bermain secara real-time melalui internet dengan sistem room matching otomatis.

## 🏗️ Arsitektur Aplikasi

### Backend (Server)
- **Framework**: Node.js + Express.js
- **Real-time Communication**: Socket.io
- **Port**: 3001

### Frontend (Client)
- **Framework**: React.js + Vite
- **Styling**: CSS3 dengan animasi
- **Port**: 5173

---

## 📂 Struktur Folder dan File

```
GP Coba/
├── server.js              # Server backend utama
├── package.json            # Dependencies server
├── PENJELASAN_PROJECT.md   # Dokumentasi project
├── GAME_FIX_SUMMARY.md     # Summary perbaikan bug
└── gp-coba/               # Folder frontend React
    ├── src/
    │   ├── App.jsx         # Komponen React utama
    │   ├── App.css         # Styling utama
    │   ├── main.jsx        # Entry point React
    │   ├── index.css       # Base CSS
    │   ├── components/     # Komponen terpisah (kosong)
    │   ├── contexts/       # Context API (kosong)
    │   └── hooks/          # Custom hooks (kosong)
    ├── public/             # Assets statis (kosong)
    ├── package.json        # Dependencies frontend
    ├── index.html          # HTML template
    └── vite.config.js      # Konfigurasi Vite
```

---

## 🔧 Penjelasan File Utama

### 1. `server.js` - Backend Server

#### **Import dan Setup**
```javascript
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
```
- Menggunakan Express untuk HTTP server
- Socket.io untuk komunikasi real-time
- CORS untuk mengizinkan koneksi dari frontend

#### **Variabel Global**
```javascript
let waitingPlayer = null    // Menyimpan pemain yang sedang menunggu
let games = new Map()       // Menyimpan semua game room aktif
```

#### **Fungsi Utama**

**`generateRoomId()`**
```javascript
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8)
}
```
- Membuat ID room unik 6 karakter acak untuk setiap game

**`determineWinner(choice1, choice2)`**
```javascript
function determineWinner(choice1, choice2) {
  if (choice1 === choice2) return 'tie'
  
  const winConditions = {
    rock: 'scissors',    // Batu mengalahkan gunting
    paper: 'rock',       // Kertas mengalahkan batu
    scissors: 'paper'    // Gunting mengalahkan kertas
  }
  
  return winConditions[choice1] === choice2 ? 'win' : 'lose'
}
```
- Menentukan pemenang berdasarkan aturan klasik Rock Paper Scissors

#### **Event Handler Socket.io**

**Connection Event**
- Menangani koneksi baru dari client
- Menampilkan log user yang terhubung

**Join Game Event**
- Jika ada `waitingPlayer`: Membuat room baru dan memulai game
- Jika tidak ada: Menunggu di queue sebagai `waitingPlayer`

**Player Choice Event**
- Menerima pilihan dari pemain (rock/paper/scissors)
- Menunggu hingga kedua pemain membuat pilihan
- Menghitung hasil ronde dan update skor
- Mengirim hasil ke kedua pemain
- Mengecek apakah game sudah selesai (7 ronde)

### 2. `gp-coba/src/App.jsx` - Frontend React

#### **State Management**
```javascript
const [socket, setSocket] = useState(null)           // Koneksi socket
const [username, setUsername] = useState('')         // Nama pemain
const [gameState, setGameState] = useState('login')  // login|waiting|playing|finished
const [roomId, setRoomId] = useState('')             // ID room game
const [currentRound, setCurrentRound] = useState(1)  // Ronde saat ini (1-7)
const [playerChoice, setPlayerChoice] = useState('') // Pilihan pemain
const [opponentChoice, setOpponentChoice] = useState('') // Pilihan lawan
const [scores, setScores] = useState({ player: 0, opponent: 0 }) // Skor
const [gameHistory, setGameHistory] = useState([])   // Riwayat permainan
const [aiRecommendation, setAiRecommendation] = useState('') // Rekomendasi AI
```

#### **Socket Event Listeners**
```javascript
useEffect(() => {
  const newSocket = io('https://hck.duniahabbib.site')
  
  newSocket.on('gameJoined', (data) => {
    // Bergabung ke room / menunggu lawan
  })
  
  newSocket.on('gameStart', (data) => {
    // Game dimulai, dapat info lawan
  })
  
  newSocket.on('roundResult', (data) => {
    // Menerima hasil ronde dari server
  })
  
  newSocket.on('gameOver', (data) => {
    // Game selesai, tampilkan hasil akhir
  })
}, [])
```

#### **Fitur AI Recommendation**
```javascript
const generateAIRecommendation = () => {
  if (gameHistory.length < 2) return ''
  
  // Analisis 2 langkah terakhir lawan
  const recentMoves = gameHistory.slice(-2).map(h => h.opponentChoice)
  const moveCount = { rock: 0, paper: 0, scissors: 0 }
  
  recentMoves.forEach(move => {
    moveCount[move]++
  })
  
  // Cari pilihan paling sering dan counter-nya
  const mostFrequent = Object.keys(moveCount).reduce((a, b) => 
    moveCount[a] > moveCount[b] ? a : b
  )
  
  const counter = {
    rock: 'paper',     // Jika lawan sering pilih batu, rekomendasikan kertas
    paper: 'scissors', // Jika lawan sering pilih kertas, rekomendasikan gunting
    scissors: 'rock'   // Jika lawan sering pilih gunting, rekomendasikan batu
  }
  
  return counter[mostFrequent]
}
```

#### **UI Components**

**Login Screen**
- Input username
- Button "Join Game"

**Waiting Screen**  
- Menampilkan "Waiting for opponent..."
- Spinner loading

**Game Screen**
- Header dengan info ronde (1-7) dan skor
- AI recommendation (muncul mulai ronde 3)
- Tombol pilihan: 🪨 Rock, 📄 Paper, ✂️ Scissors
- Tampilan hasil ronde
- History permainan

**Game Over Screen**
- Hasil akhir (menang/kalah/seri)
- Skor final
- Ringkasan statistik
- Button "Main Lagi"

### 3. `gp-coba/src/App.css` - Styling

#### **Design System**
- **Background**: Gradient ungu-biru yang menarik
- **Cards**: Glass morphism effect dengan backdrop blur
- **Colors**: Dominan putih dengan aksen hijau untuk tombol
- **Typography**: Font Arial yang clean

#### **Key CSS Classes**

**`.app`** - Container utama dengan centering dan gradient background

**`.final-round`** - Styling khusus untuk ronde terakhir
```css
.final-round {
  color: #ff6b6b;
  font-weight: bold;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
```

**`.choice-btn`** - Tombol pilihan dengan hover effect dan transisi

**`.ai-recommendation`** - Box rekomendasi AI dengan border kuning

---

## 🎮 Alur Permainan

### 1. **Login Phase**
1. User membuka `http://localhost:5173`
2. Memasukkan username
3. Klik "Join Game"
4. Socket terhubung ke server

### 2. **Matchmaking Phase**
1. Jika belum ada pemain lain → masuk waiting queue
2. Jika sudah ada pemain → langsung match dan buat room
3. Server generate room ID unik
4. Kedua pemain masuk room yang sama

### 3. **Game Phase**
**Per Ronde (1-7):**
1. Kedua pemain memilih rock/paper/scissors
2. Server tunggu hingga kedua pilihan masuk
3. Server hitung pemenang ronde
4. Update skor dan kirim hasil ke clients
5. Client tampilkan hasil dan tunggu 3 detik
6. Lanjut ke ronde berikutnya

**AI Recommendation:**
- Mulai ronde 3, AI analisis 2 langkah terakhir lawan
- Berikan rekomendasi counter-move
- Tampilkan di UI dengan ikon robot

### 4. **End Game Phase**
1. Setelah ronde 7 selesai
2. Server hitung skor final
3. Tentukan pemenang overall
4. Kirim `gameOver` event ke clients
5. Client tampilkan hasil akhir
6. Server cleanup room setelah 5 detik

---

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (v14+)
- npm atau yarn

### Langkah Installation

1. **Clone atau Download Project**
2. **Install Dependencies Server**
   ```bash
   cd "GP Coba"
   npm install
   ```

3. **Install Dependencies Client**
   ```bash
   cd gp-coba
   npm install
   ```

4. **Jalankan Server (Terminal 1)**
   ```bash
   cd "GP Coba"
   npm start
   # atau untuk development:
   npm run dev
   ```
   Server akan berjalan di `http://localhost:3001` 

5. **Jalankan Client (Terminal 2)**
   ```bash
   cd "GP Coba/gp-coba"
   npm run dev
   ```
   Client akan berjalan di `http://localhost:5173`

6. **Testing Multiplayer**
   - Buka 2 tab browser
   - Masukkan username berbeda di masing-masing tab
   - Mulai bermain!

---

## 🔧 Dependencies

### Server (`package.json`)
```json
{
  "dependencies": {
    "cors": "^2.8.5",           // Cross-Origin Resource Sharing
    "express": "^4.21.2",       // Web framework
    "socket.io": "^4.7.2"       // Real-time communication
  },
  "devDependencies": {
    "nodemon": "^3.1.10"        // Auto-restart server saat development
  }
}
```

### Client (`gp-coba/package.json`)
```json
{
  "dependencies": {
    "react": "^19.1.0",              // UI library
    "react-dom": "^19.1.0",          // React DOM renderer
    "socket.io-client": "^4.8.1"     // Socket.io client
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.4.1", // Vite React plugin
    "eslint": "^9.25.0",              // Code linting
    "vite": "^6.3.5"                  // Build tool
  }
}
```

---

## 🐛 Bug Fixes & Improvements

### Issue yang Diperbaiki:
1. **Game melanjut ke ronde 8** - Fixed: Game sekarang berhenti tepat di ronde 7
2. **Race condition cleanup** - Fixed: Hapus duplikasi cleanup code
3. **UI feedback** - Added: Indikator "FINAL ROUND" dengan animasi

### Optimasi yang Dilakukan:
- Cleanup room otomatis setelah game selesai
- Error handling untuk disconnect
- Visual feedback yang lebih baik
- Code structure yang lebih clean

---

## 🎯 Fitur Unggulan

1. **Real-time Multiplayer** - Permainan sinkron antar pemain
2. **Auto Matchmaking** - Sistem queue otomatis
3. **AI Recommendation** - Saran berbasis analisis pola lawan
4. **Game History** - Rekam jejak setiap ronde
5. **Responsive Design** - Tampilan adaptif di berbagai device
6. **Visual Effects** - Animasi dan transisi yang smooth
7. **Error Handling** - Penanganan disconnect dan error

---

## 📱 Teknologi yang Digunakan

- **Frontend**: React.js, CSS3, Socket.io Client
- **Backend**: Node.js, Express.js, Socket.io
- **Build Tool**: Vite
- **Package Manager**: npm
- **Real-time**: WebSocket (Socket.io)
- **Styling**: Pure CSS dengan modern effects

---

*Dokumentasi ini dibuat untuk membantu pemahaman struktur dan cara kerja aplikasi Rock Paper Scissors Multiplayer.*
