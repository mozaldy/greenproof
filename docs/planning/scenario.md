# GreenProof — Skenario Simulasi Visualisasi

> Dokumen ini adalah panduan lengkap untuk membangun tampilan simulasi ketiga aplikasi GreenProof. Semua data bersifat fiktif namun realistis untuk kebutuhan demo/hackathon.

---

## BAGIAN 1 — DATA SEED (Fixture)

### Perusahaan

| ID | Nama | Lokasi | Total Lahan | Mode AI |
|---|---|---|---|---|
| `PT-001` | PT Nusantara Agro Lestari | Kalimantan Tengah | 12.400 ha | Mode B (pakai model GreenProof) |
| `PT-002` | PT Sawit Makmur Sejati | Sumatera Selatan | 8.700 ha | Mode A (model sendiri) |

> Untuk simulasi demo, semua skenario menggunakan **PT-001**.

---

### Estate & Blok

PT-001 memiliki 3 estate aktif:

| Estate | Kode | Luas | Blok | Status |
|---|---|---|---|---|
| Estate Kapuas Barat | `KB` | 4.200 ha | KB-A1 s/d KB-F6 | Aktif |
| Estate Kapuas Timur | `KT` | 4.800 ha | KT-A1 s/d KT-G5 | Aktif |
| Estate Mentaya | `MT` | 3.400 ha | MT-A1 s/d MT-E4 | Aktif |

---

### Pengguna Terdaftar

#### Operator & Supervisor

| Nama | Role | Estate |
|---|---|---|
| Andi Prasetyo | Operator | Semua estate |
| Rini Kusumawati | Supervisor | KB & KT |

#### Agronomis (Verifier)

| Nama | Spesialisasi | Afiliasi |
|---|---|---|
| Dr. Budi Santoso | Penyakit Ganoderma, Hama | Konsultan eksternal |
| Siti Rahayu, S.P. | Nutrisi tanah, Defisiensi hara | Staf internal |

#### Mitra Lapangan

| Nama | Level | Estate | Total Task | Akurasi |
|---|---|---|---|---|
| Pak Surya | Field Expert (Lv.3) | KB | 347 | 91.2% |
| Bu Dewi | Field Analyst (Lv.2) | KB & KT | 128 | 84.7% |
| Agus Mulyono | Field Analyst (Lv.2) | KT | 95 | 82.3% |
| Wahyu Santoso | Field Observer (Lv.1) | KB | 23 | 78.0% |
| Fitri Handayani | Field Observer (Lv.1) | MT | 11 | 75.5% |

---

### Task Sample (Status Beragam)

| Task ID | Blok | Tipe | Koordinat | Reward | Status | Assignee |
|---|---|---|---|---|---|---|
| `TK-2847` | KB-C3 | Deteksi Ganoderma | -2.1847, 114.2341 | 150 token | ✅ Selesai — Terverifikasi | Pak Surya |
| `TK-2848` | KB-C4 | Hitung Pohon Mati | -2.1851, 114.2355 | 50 token | ✅ Selesai — Terverifikasi | Bu Dewi |
| `TK-2849` | KB-D2 | Kondisi Umum Area | -2.1823, 114.2298 | 40 token | ⚠️ Flagged — Butuh Verifikasi Agronomis | Agus & Wahyu |
| `TK-2850` | KT-B1 | Anomali Drainase | -2.2010, 114.2489 | 80 token | 🔄 Sedang Dikerjakan | Bu Dewi |
| `TK-2851` | KB-A1 | Deteksi BSR (Busuk Pangkal) | -2.1790, 114.2200 | 200 token | 📤 Terbuka | — |
| `TK-2852` | MT-C2 | Kualitas Pelepah | -2.2310, 114.1987 | 60 token | 📤 Terbuka | — |
| `TK-2853` | KB-C3 | Estimasi Serangan Hama | -2.1842, 114.2338 | 120 token | 📤 Terbuka | — |

---

## BAGIAN 2 — DEFINISI TIPE SUBMISSION

Tipe submission ditentukan oleh **kombinasi tipe task × level mitra** yang mengambilnya. Semakin tinggi level mitra, semakin kaya struktur laporan yang diharapkan. Semua tipe bisa upload lebih dari 1 foto, namun batas dan requirement berbeda.

---

### Tipe A — Quick Observation
**Siapa:** Level 1 (Field Observer) untuk task dasar  
**Kapan:** Hitung pohon mati, kondisi umum area, kualitas pelepah  

**Yang diinput:**
- 📷 **Foto: 1–3 gambar** (minimal 1 wajib, disarankan dari sudut berbeda)
- 📋 **Kondisi Umum:** dropdown pilihan
  - `Normal` / `Ada kekhawatiran` / `Butuh perhatian segera`
- 📝 **Catatan Singkat:** teks bebas, max 200 karakter
- 📍 **GPS:** otomatis terdeteksi (tampil sebagai konfirmasi koordinat ke mitra)

**Contoh data hasil:**
```
Kondisi: Ada kekhawatiran
Foto: [photo_001.jpg, photo_002.jpg]
Catatan: "Terlihat beberapa pohon dengan daun menguning di bagian barat blok, sekitar 8–10 pohon."
GPS: -2.1851, 114.2355 ✓
Waktu Submit: 09:14, 15 Mar 2025
```

---

### Tipe B — Field Report
**Siapa:** Level 2 (Field Analyst) untuk task menengah  
**Kapan:** Diagnosis kondisi kesehatan pohon, anomali semi-kritikal, anomali drainase  

**Yang diinput:**
- 📷 **Foto: 2–6 gambar** (wajib min. 2: satu tampak jauh, satu tampak dekat)
- ✅ **Gejala yang Diamati:** checklist multi-pilih (disesuaikan tipe task):
  - Untuk task kesehatan pohon: `Daun menguning` / `Bercak coklat` / `Pelepah layu` / `Buah abnormal` / `Tanda jamur di pangkal` / `Serangan serangga` / `Kerusakan fisik`
  - Untuk task drainase: `Genangan > 30 cm` / `Parit tersumbat` / `Erosi tepi parit` / `Bau tidak normal`
- 📊 **Tingkat Keparahan:** skala 1–5
  - 1 = Ringan (< 10% pohon terdampak)
  - 2 = Sedang (10–25%)
  - 3 = Signifikan (25–50%)
  - 4 = Parah (50–75%)
  - 5 = Kritis (> 75% atau spreading aktif)
- 📐 **Estimasi Luas Terdampak:** input angka + satuan (m² atau jumlah pohon)
- 📝 **Catatan Tambahan:** teks bebas, max 500 karakter

**Contoh data hasil (Task TK-2850 — Anomali Drainase):**
```
Gejala: [Genangan > 30 cm, Parit tersumbat]
Keparahan: 3 — Signifikan
Estimasi: ~200 m² (sekitar 40–50 meter jalur parit)
Foto: [drain_far.jpg, drain_close1.jpg, drain_sediment.jpg]
Catatan: "Parit utama blok B1 tersumbat material tanah dan sisa pelepah. Genangan terlihat mulai dari titik koordinat ke arah utara sekitar 50 meter. Kemungkinan hujan deras 3 hari lalu memperparah kondisi."
GPS: -2.2010, 114.2489 ✓
Waktu Submit: 11:32, 15 Mar 2025
```

---

### Tipe C — Expert Assessment
**Siapa:** Level 3 (Field Expert) untuk task kritikal  
**Kapan:** Deteksi Ganoderma, deteksi BSR, estimasi serangan hama skala besar, anomali kritikal lain  

**Yang diinput:**
- 📷 **Foto: 2–10 gambar** (wajib: foto pangkal batang, foto pelepah, foto area sekitar, foto jarak jauh)
- 🎥 **Video Opsional:** max 1 video, durasi 15–60 detik (untuk kasus spreading atau kondisi yang butuh konteks gerak)
- 📋 **Diagnosis Primer:** dropdown dari daftar diagnosis terstandar:
  - `Ganoderma boninense (BSR)` / `Fusarium wilt` / `Defisiensi Magnesium` / `Defisiensi Boron` / `Trunk Injector Damage` / `Crown Disease` / `Oryctes (serangan kumbang)` / `Nettle caterpillar infestation` / `Drought stress` / `Waterlogging damage` / `Mechanical injury` / `Tidak dapat diidentifikasi — perlu eskalasi`
- 🎯 **Confidence Level:** slider 10–100%
- 🔁 **Diagnosis Diferensial:** multi-pilih — kondisi lain yang mungkin juga terjadi
- ⚡ **Urgensi:** pilihan
  - `Pantau` / `Tindak dalam 7 hari` / `Tindak dalam 48 jam` / `Isolasi segera`
- 🛠️ **Rekomendasi Tindakan:** teks singkat + dropdown tindakan standar:
  - `Injeksi fungisida` / `Kapur dolomit` / `Pemupukan khusus` / `Perbaikan drainase` / `Pembongkaran pohon` / `Pemasangan perangkap` / `Monitoring rutin` / `Eskalasi ke agronomis`
- 📐 **Estimasi Luas Terdampak:** m² + jumlah pohon terdampak
- 📎 **Evidence Notes:** teks bebas, max 1000 karakter

**Contoh data hasil (Task TK-2847 — Deteksi Ganoderma):**
```
Diagnosis Primer: Ganoderma boninense (BSR)
Confidence: 87%
Diagnosis Diferensial: [Drought stress, Fusarium wilt]
Urgensi: Tindak dalam 48 jam
Rekomendasi: Pembongkaran pohon + injeksi fungisida pohon sekitar (radius 5 pohon)
Estimasi: 3 pohon terdampak langsung, ~15 pohon berisiko di sekitar
Foto: [root_base.jpg, fruitbody_gano.jpg, crown_view.jpg, area_overview.jpg, affected_ring.jpg]
Video: ganoderma_spreading_context.mp4 (32 detik)
Evidence Notes: "Badan buah Ganoderma ditemukan di pangkal batang pohon baris ke-7 dari utara, pohon ke-3 dari barat. Spora terlihat aktif. Dua pohon tetangga (timur dan barat) sudah menunjukkan gejala awal daun menguning. Tanah di sekitar basah berlebihan — drainase sub-optimal di area ini."
GPS: -2.1847, 114.2341 ✓
Waktu Submit: 07:53, 15 Mar 2025
```

---

### Tipe D — Cross-Validation (Sistem)
Ketika sebuah task menerima submission dari **lebih dari 1 mitra** (karena ambiguitas tinggi atau sistem mewajibkan double-check), sistem menggabungkan semua submission menjadi satu kasus. Disagreement score dihitung otomatis dan menentukan apakah kasus perlu di-flag ke verifier.

**Flag otomatis jika:**
- Diagnosis berbeda di antara 2+ submission
- Confidence rata-rata < 60%
- Mitra melaporkan urgensi berbeda (satu bilang Pantau, satu bilang Isolasi Segera)

---

## BAGIAN 3 — SKENARIO PER APLIKASI

---

## 3A — DASHBOARD OPERATOR

### Persona
**Andi Prasetyo** — Operator PT-001. Bekerja dari kantor regional di Palangka Raya. Membuka dashboard setiap pagi untuk cek status operasional, lalu kembali siang hari setelah tim lapangan mulai bekerja.

---

### Halaman 1: Overview / Home

**Layout:** Command center. Split horizontal — kiri metrics, kanan peta lahan interaktif.

**Elemen kiri — Metrics Header:**
```
┌─────────────────────────────────────┐
│  Selamat pagi, Andi.                │
│  Senin, 15 Maret 2025 — 08:17      │
│  PT Nusantara Agro Lestari          │
├─────────────────────────────────────┤
│ TASK AKTIF      TERVERIFIKASI HARI INI │
│    24              7                  │
│                                       │
│ ⚠️ PERLU REVIEW    TOKEN DITERBITKAN  │
│     3               2.340             │
└───────────────────────────────────────┘
```

**Elemen kiri — Status per Estate (accordion):**
```
▼ KB — Kapuas Barat     12 task aktif    2 flagged ⚠️
  Blok bermasalah: KB-C3, KB-D2
  
▶ KT — Kapuas Timur      9 task aktif    1 flagged ⚠️

▶ MT — Mentaya           3 task aktif    0 flagged ✅
```

**Elemen kanan — Peta Lahan:**
- Peta polygon per blok, warna-kode:
  - 🟢 Hijau: blok aman, tidak ada anomali aktif
  - 🟡 Kuning: ada task aktif sedang dikerjakan
  - 🔴 Merah: ada kasus flagged / anomali kritikal
  - 🔵 Biru: task selesai dalam 24 jam terakhir
- Klik blok → popup ringkasan blok
- Tombol overlay: `Tampilkan Task` | `Tampilkan Drone Coverage` | `Tampilkan Validator Aktif`

---

### Halaman 2: Monitoring Drone

**Konsep:** Simulasi drone scanner. Karena ini POC/demo, gunakan **LLM drone simulator** yang generate daftar anomali realistis berdasarkan estate yang dipilih.

**Sub-halaman 2a — Jalankan Simulasi Drone**

```
┌─────────────────────────────────────────────────┐
│  🛸 Drone Anomaly Scanner — KB Estate           │
│                                                 │
│  Pilih estate:  [KB — Kapuas Barat ▼]          │
│  Pilih mode:    [Scan Penuh ▼]                  │
│                                                 │
│  [ ▶ Jalankan Scan Drone ]                      │
│                                                 │
│  ── Hasil Scan Terakhir ──────────────────────  │
│  Dijalankan: 14 Mar 2025, 06:30                │
│  Coverage: 4.200 ha (98.3%)                    │
│  Anomali Terdeteksi: 31                        │
│  Sudah jadi Task: 24  │  Belum diproses: 7     │
└─────────────────────────────────────────────────┘
```

**Sub-halaman 2b — Daftar Anomali dari Drone**

Tabel anomali. Setiap baris punya tombol `Jadikan Task`:

| # | Koordinat | Blok | Jenis Anomali (AI) | Confidence AI | Status |
|---|---|---|---|---|---|
| 1 | -2.1847, 114.2341 | KB-C3 | Suspected Ganoderma | 73% | ✅ Sudah jadi Task TK-2847 |
| 2 | -2.1823, 114.2298 | KB-D2 | Crown Disease atau Defisiensi | 51% | ✅ Task TK-2849 |
| 3 | -2.1799, 114.2189 | KB-A2 | Anomali Warna Vegetasi | 68% | ➕ Jadikan Task |
| 4 | -2.1882, 114.2411 | KB-D4 | Dry Spells Pattern | 44% | ➕ Jadikan Task |
| ... | | | | | |

Klik `Jadikan Task` → Modal form:
```
┌──── Buat Task dari Anomali #3 ────┐
│ Blok: KB-A2                      │
│ Koordinat: -2.1799, 114.2189     │
│ Tipe Task: [Kondisi Umum ▼]      │
│ Level Minimum Mitra: [Lv.1 ▼]   │
│ Reward Token: [60] token         │
│ Catatan untuk Mitra: __________  │
│                                  │
│ [Batal]        [Terbitkan Task]  │
└──────────────────────────────────┘
```

---

### Halaman 3: Monitoring Task & Mitra

**Sub-halaman 3a — Semua Task**

Filter: `Semua` | `Terbuka` | `Dikerjakan` | `Selesai` | `Flagged`

Tabel task dengan kolom: Task ID, Blok, Tipe, Reward, Status, Assignee, Waktu Submit, Aksi.

Klik task → **Detail Task**:
```
┌──── TK-2847 — Deteksi Ganoderma ────────────────┐
│ Blok: KB-C3    Koordinat: -2.1847, 114.2341     │
│ Reward: 150 token    Level Min: Lv.3            │
│ Status: ✅ Selesai — Terverifikasi               │
├──────────────────────────────────────────────────┤
│ SUBMISSION — Pak Surya (Field Expert)            │
│ Submit: 15 Mar 2025, 07:53                      │
│                                                 │
│ 📷 Foto (5):                                    │
│ [root_base] [fruitbody] [crown] [area] [ring]  │
│ 🎥 Video: ganoderma_context.mp4 (32 detik)     │
│                                                 │
│ Diagnosis: Ganoderma boninense (BSR)            │
│ Confidence: 87%   Urgensi: ⚡ 48 jam            │
│ Rekomendasi: Bongkar + injeksi radius 5 pohon  │
│                                                 │
│ LLM Quality Gate: ✅ LULUS (skor konsistensi: 94%) │
│ Smart Contract: ✅ Token 150 diterbitkan 08:01  │
│                                                 │
│ [Lihat di Walrus] [Lihat di Blockchain]         │
└──────────────────────────────────────────────────┘
```

**Sub-halaman 3b — Manajemen Mitra**

Tabel semua mitra terdaftar + tombol aksi:

| Nama | Level | Task Selesai | Akurasi | Token Earned | Status | Aksi |
|---|---|---|---|---|---|---|
| Pak Surya | ⭐⭐⭐ Expert | 347 | 91.2% | 42.300 | Aktif | [Detail] [Nonaktifkan] |
| Bu Dewi | ⭐⭐ Analyst | 128 | 84.7% | 14.890 | Aktif | [Detail] [Nonaktifkan] |
| Wahyu Santoso | ⭐ Observer | 23 | 78.0% | 1.150 | Aktif | [Detail] [Nonaktifkan] |

Klik `[Detail]` → profil mitra: riwayat task, grafik akurasi over time, token history, progress ke level berikutnya.

Tombol: `[ + Daftarkan Mitra Baru ]`

---

### Halaman 4: Audit & Review Flagged

**Sub-halaman 4a — Kasus Flagged (Perlu Perhatian)**

```
⚠️ 3 kasus membutuhkan review

┌──── TK-2849 — Kondisi Umum KB-D2 ─────────────┐
│ Flagged: Disagreement tinggi antar 2 submission │
│ Dikirim ke agronomis: Siti Rahayu, S.P.        │
│ Status agronomis: 🕐 Menunggu verdict           │
│ [Lihat Detail Kasus]                            │
└────────────────────────────────────────────────┘

┌──── TK-2853 — Hama KB-C3 ──────────────────────┐
│ Flagged: Confidence LLM rendah (38%)           │
│ Dikirim ke agronomis: Dr. Budi Santoso         │
│ Status agronomis: ✅ Verdict sudah masuk        │
│ [Lihat Verdict] [Terapkan & Terbitkan Token]   │
└────────────────────────────────────────────────┘
```

**Sub-halaman 4b — Audit Log**

Timeline aktivitas seluruh sistem dengan filter per estate, per mitra, per waktu. Bisa export ke CSV.

---

### Halaman 5: Konfigurasi

**5a — Pengaturan Reward per Tipe Task**

| Tipe Task | Reward Default | Reward Kritikal | Level Min |
|---|---|---|---|
| Kondisi Umum | 40 token | — | Lv.1 |
| Hitung Pohon | 50 token | — | Lv.1 |
| Health Diagnosis | 100 token | 150 token | Lv.2 |
| Deteksi Ganoderma/BSR | 150 token | 200 token | Lv.3 |

**5b — Konfigurasi Model AI**

```
Mode Aktif: ◉ Mode B — Pakai Model GreenProof

Izin yang diberikan:
✅ AI GreenProof dapat membaca foto validasi untuk training
✅ Fine-tuning regional (Kalimantan)

Log Akses Terakhir (Seal):
• 15 Mar 2025, 08:01 — AI GreenProof Service — 5 foto (TK-2847) — Training
• 14 Mar 2025, 16:22 — AI GreenProof Service — 3 foto (TK-2844) — Inference

[Cabut Akses AI GreenProof] [Lihat Semua Log]
```

---

## 3B — DASHBOARD VERIFIER (AGRONOMIS)

### Persona
**Siti Rahayu, S.P.** — Agronomis staf internal. Tidak duduk di lapangan, tapi punya pengetahuan teknis dalam. Membuka dashboard ketika ada notifikasi kasus baru yang di-flag sistem. Bekerja layaknya seorang *reviewer* jurnal ilmiah — menilai bukti, memberikan verdict, dan meninggalkan catatan yang berguna untuk sistem AI.

---

### Filosofi UI Dashboard Verifier
Dashboard ini adalah **ruang kerja pengetahuan**, bukan ruang kerja operasional. Tidak ada peta besar, tidak ada angka volume. Yang ada: antrean kasus, konteks yang cukup untuk memutuskan, dan ruang untuk berpikir.

---

### Halaman 1: Beranda Verifier

```
┌───────────────────────────────────────────────┐
│  Selamat datang, Siti.                        │
│  Siti Rahayu, S.P. — Agronomis               │
│  PT Nusantara Agro Lestari                   │
├───────────────────────────────────────────────┤
│  ANTREAN KASUS       │  DISELESAIKAN BULAN INI │
│       3              │           18             │
│                      │                          │
│  VERDICT PENDING     │  KONTRIBUSI KE MODEL AI  │
│       2              │     247 labeled data      │
└───────────────────────────────────────────────┘

[ Buka Antrean Kasus ]
```

---

### Halaman 2: Antrean Kasus

Daftar kasus yang belum mendapat verdict. Urut berdasarkan prioritas (urgensi yang dilaporkan mitra + lama menunggu).

```
┌──── KASUS #1 — TK-2849 — KB-D2 ────────────────┐
│ 🔴 PRIORITAS TINGGI                             │
│ Tipe: Kondisi Umum → flagged jadi health check  │
│ Alasan flag: Dua mitra berbeda pendapat         │
│   • Agus (Lv.2): "Defisiensi Magnesium, Sev.3" │
│   • Wahyu (Lv.1): "Normal, tidak ada masalah"  │
│ Menunggu sejak: 6 jam lalu                      │
│ [ Buka & Review ]                               │
└─────────────────────────────────────────────────┘

┌──── KASUS #2 — TK-2853 — KB-C3 ────────────────┐
│ 🟡 PRIORITAS SEDANG                             │
│ Tipe: Estimasi Serangan Hama                   │
│ Alasan flag: Confidence LLM rendah (38%)        │
│   • Pak Surya (Lv.3): Expert Assessment masuk  │
│ Menunggu sejak: 2 jam lalu                      │
│ [ Buka & Review ]                               │
└─────────────────────────────────────────────────┘
```

---

### Halaman 3: Detail Kasus — Review & Verdict

**Kasus: TK-2849 — Kondisi Umum Blok KB-D2**

Layout tiga kolom:
- Kiri: informasi konteks & riwayat blok
- Tengah: semua submission (foto + laporan)
- Kanan: form verdict agronomis

**Kolom Kiri — Konteks Blok KB-D2:**
```
Blok: KB-D2
Estate: Kapuas Barat
Umur Tanaman: 9 tahun
Jenis Tanah: Gambut dalam
Riwayat Masalah:
  • Feb 2025: Drainase kurang optimal (resolved)
  • Nov 2024: Laporan gejala kuning sporadis
Curah Hujan 7 Hari Terakhir: 214 mm (di atas rata-rata)
Task Serupa Terakhir: TK-2801 — Feb 2025 — Resolved
```

**Kolom Tengah — Submission Mitra:**

```
━━━ SUBMISSION 1 — Agus Mulyono (Field Analyst) ━━━
Waktu: 09:47, 15 Mar 2025

📷 Foto (4 gambar):
[Foto 1: tampak luar blok ]  [Foto 2: daun menguning ]
[Foto 3: pohon terdampak  ]  [Foto 4: batang bawah   ]

Gejala: ✅ Daun menguning  ✅ Bercak coklat kecil
Keparahan: 3 — Signifikan (~30% pohon di area)
Estimasi: ~15–20 pohon di bagian barat blok
Catatan: "Pola kuning di pelepah tengah ke atas, tidak
ada tanda jamur di pangkal. Kemungkinan defisiensi 
magnesium karena hujan deras beberapa hari ini."

━━━ SUBMISSION 2 — Wahyu Santoso (Field Observer) ━━━
Waktu: 11:22, 15 Mar 2025

📷 Foto (2 gambar):
[Foto 1: tampak luar blok ]  [Foto 2: pohon umum      ]

Kondisi: Normal
Catatan: "Tidak ada yang mencurigakan. Warna daun 
terlihat biasa saja dari yang saya lihat."

━━━ LLM QUALITY GATE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Flagged — Disagreement Tinggi
Analisis: Submission 1 dan 2 saling bertentangan.
Foto submission 2 tidak menunjukkan area yang sama
dengan submission 1 (berdasarkan metadata GPS: 
jarak 180 meter dari titik task).
Rekomendasi: Eskalasi ke agronomis.
```

**Kolom Kanan — Form Verdict Agronomis:**
```
┌──── VERDICT ANDA ────────────────────────┐
│                                          │
│ Diagnosis Final:                         │
│ [Defisiensi Magnesium          ▼]       │
│                                          │
│ Confidence Anda: [75%] ████████░░        │
│                                          │
│ Urgensi:                                 │
│ ◉ Tindak dalam 7 hari                   │
│                                          │
│ Rekomendasi Tindakan:                   │
│ [Pemupukan khusus (MgSO4)      ▼]       │
│                                          │
│ Catatan Reasoning (untuk AI training):  │
│ ┌──────────────────────────────────────┐ │
│ │ Gejala kuning pada pelepah tengah   │ │
│ │ ke atas setelah periode hujan       │ │
│ │ intensif di lahan gambut adalah     │ │
│ │ pola klasik pencucian Magnesium.    │ │
│ │ Foto submission 2 tidak representat │ │
│ │ -if — lokasinya berbeda dari titik  │ │
│ │ anomali yang sebenarnya.            │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Submission yang Valid:                   │
│ ✅ Submission 1 (Agus)  ❌ Submission 2  │
│                                          │
│ [Simpan Draft]  [Kirim Verdict Final]   │
└──────────────────────────────────────────┘
```

Setelah kirim verdict → sistem otomatis:
- Terbitkan token ke Agus (reward penuh)
- Token Wahyu tidak diterbitkan (submission invalid)
- Data verdict masuk sebagai labeled training data
- Notifikasi ke Operator

---

### Halaman 4: Riwayat Verdict

Tabel semua verdict yang sudah diberikan. Bisa filter per tipe penyakit/kondisi, per estate, per periode.

**Insight panel:**
```
Tipe kasus paling sering: Defisiensi Magnesium (8 kasus)
Tipe paling sulit (confidence terendah): BSR vs Fusarium
Kontribusi data ke model: 247 labeled instances
Akurasi AI sebelum vs sesudah kontribusi Anda: 71% → 84%
```

---

### Halaman 5: Knowledge Base (Referensi)

Halaman referensi cepat — kumpulan pola gejala yang sudah di-approve dari verdict sebelumnya. Bisa digunakan sebagai acuan saat review kasus baru.

```
📚 Referensi Penyakit Sawit — Kalimantan Tengah

> Ganoderma boninense (BSR)
  Tanda khas: badan buah di pangkal, daun tombak tidak
  membuka, crown collapse, spora oranye/coklat
  Sering tertukar dengan: Fusarium wilt, Drought stress
  Tip lapangan: cek selalu di bawah permukaan tanah
  (radius 30 cm dari pangkal)

> Defisiensi Magnesium
  Tanda khas: daun menguning mulai pelepah tengah,
  pola simetris kiri-kanan, intensif setelah hujan besar
  di lahan gambut
  Sering tertukar dengan: Ganoderma awal, Crown Disease
  ...
```

---

## 3C — MOBILE APP MITRA LAPANGAN (PWA)

### Persona
**Bu Dewi** — Field Analyst, 34 tahun. Punya HP Android biasa. Tidak terlalu tech-savvy tapi terbiasa pakai WhatsApp dan Google Maps. Menggunakan aplikasi sambil berjalan di kebun.

### Filosofi UI Mobile App
- **Satu tujuan per layar** — tidak ada yang membingungkan
- **GPS dan kamera adalah fitur utama** — akses cepat, tap minimal
- **Feedback instan** — setiap aksi ada respons visual yang jelas
- **Offline-friendly** — bisa isi form tanpa sinyal, submit begitu ada koneksi
- **Gamification ringan** — progress level dan token selalu terlihat

---

### Screen 1: Login & Selamat Datang

```
┌──────────────────────────────┐
│                              │
│        🌿 GreenProof         │
│                              │
│  Masuk dengan akun Google    │
│  ┌────────────────────────┐  │
│  │  G  Masuk dengan Google│  │
│  └────────────────────────┘  │
│                              │
│  Tidak perlu install apa-apa │
│  Cukup buka di browser HP   │
└──────────────────────────────┘
```

---

### Screen 2: Beranda Mitra

```
┌──────────────────────────────┐
│  Halo, Bu Dewi 👋            │
│  ⭐⭐ Field Analyst — Lv.2   │
├──────────────────────────────┤
│  TOKEN SAYA    TASK SELESAI  │
│   14.890          128        │
│                              │
│  Progress ke Level 3:        │
│  ████████░░░░  72 / 200 task │
│  Akurasi: 84.7% (target 85%) │
├──────────────────────────────┤
│  TASK TERSEDIA DEKAT SAYA    │
│  📍 Lokasi: KB Estate        │
│                              │
│  🟡 TK-2850   680 m  80 tkn │
│     Anomali Drainase — KT-B1 │
│                              │
│  📤 TK-2852   1.2 km 60 tkn │
│     Kualitas Pelepah — MT-C2 │
│                              │
│  [Lihat Semua Task]          │
├──────────────────────────────┤
│  🏠 Beranda  📋 Task  👤 Saya│
└──────────────────────────────┘
```

---

### Screen 3: Daftar Task

```
┌──────────────────────────────┐
│  ← Task Tersedia             │
│  📍 Menampilkan 5 task dekat │
├──────────────────────────────┤
│  ┌────────────────────────┐  │
│  │ 🟡 TK-2850    ⭐⭐ Lv.2 │  │
│  │ Anomali Drainase        │  │
│  │ Blok KT-B1 — 680 m    │  │
│  │ 💰 80 token             │  │
│  │ [Ambil Task]            │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ 📤 TK-2852    ⭐ Lv.1   │  │
│  │ Kualitas Pelepah        │  │
│  │ Blok MT-C2 — 1.2 km   │  │
│  │ 💰 60 token             │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ 🔒 TK-2851   ⭐⭐⭐ Lv.3 │  │
│  │ Deteksi BSR             │  │
│  │ Blok KB-A1 — 2.1 km   │  │
│  │ 💰 200 token            │  │
│  │ Butuh Level 3           │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

> Task terkunci ditampilkan tapi tidak bisa diambil — memberi aspirasi ke mitra untuk naik level.

---

### Screen 4: Detail Task + Ambil Task

```
┌──────────────────────────────┐
│  ← TK-2850                  │
│                              │
│  📋 Anomali Drainase         │
│  Blok KT-B1                 │
├──────────────────────────────┤
│  📍 680 meter dari posisi    │
│     saya sekarang            │
│  [Buka di Maps]              │
├──────────────────────────────┤
│  Yang perlu kamu lakukan:    │
│  → Pergi ke koordinat        │
│  → Foto kondisi parit/saluran│
│  → Isi laporan singkat       │
│  → Submit                    │
├──────────────────────────────┤
│  💰 Reward: 80 token         │
│  ⏱️  Tidak ada batas waktu   │
├──────────────────────────────┤
│  [ ✅ Ambil Task Ini ]       │
└──────────────────────────────┘
```

---

### Screen 5: Navigasi ke Titik (setelah ambil task)

```
┌──────────────────────────────┐
│  Task TK-2850 — Aktif       │
│                              │
│  [PETA — titik merah di KT] │
│  Jarak: 680 m                │
│  Posisi kamu: titik biru    │
│                              │
│  ─────────────────────────  │
│                              │
│  Sudah di lokasi?            │
│  [ �� Mulai Laporan ]        │
│                              │
│  (Tombol aktif jika GPS      │
│   dalam radius 100 m)        │
└──────────────────────────────┘
```

---

### Screen 6a: Form Submission — Tipe A (Field Observer)
*Contoh: Task kualitas pelepah untuk Wahyu (Level 1)*

```
┌──────────────────────────────┐
│  ← Isi Laporan — TK-2852    │
│  Kualitas Pelepah — MT-C2   │
├──────────────────────────────┤
│  📷 FOTO (1–3 foto)          │
│  ┌────┐ ┌────┐ ┌──────────┐  │
│  │foto│ │foto│ │ + Tambah │  │
│  │ 1  │ │ 2  │ │   Foto   │  │
│  └────┘ └────┘ └──────────┘  │
│  Saran: foto dari dekat +   │
│  dari jauh                  │
├──────────────────────────────┤
│  Kondisi yang kamu lihat:    │
│  ○ Normal — tidak ada masalah│
│  ○ Ada yang mencurigakan     │
│  ○ Butuh perhatian segera   │
├──────────────────────────────┤
│  Catatan singkat (opsional): │
│  ┌──────────────────────────┐│
│  │ Ketik di sini...         ││
│  └──────────────────────────┘│
│  (max 200 huruf)             │
├──────────────────────────────┤
│  📍 GPS: ✅ -2.2310, 114.198 │
├──────────────────────────────┤
│  [ Kirim Laporan → ]        │
└──────────────────────────────┘
```

---

### Screen 6b: Form Submission — Tipe B (Field Analyst)
*Contoh: Task Anomali Drainase untuk Bu Dewi (Level 2)*

```
┌──────────────────────────────┐
│  ← Isi Laporan — TK-2850    │
│  Anomali Drainase — KT-B1   │
├──────────────────────────────┤
│  📷 FOTO (2–6 foto)          │
│  Tip: foto dari jauh,        │
│  dekat, dan tampak samping   │
│  ┌────┐ ┌────┐ ┌────┐ ┌───┐  │
│  │ 1  │ │ 2  │ │ 3  │ │ + │  │
│  └────┘ └────┘ └────┘ └───┘  │
├──────────────────────────────┤
│  Apa yang kamu lihat?        │
│  (centang semua yang ada)    │
│  ☑ Genangan air > 30 cm     │
│  ☑ Parit/saluran tersumbat  │
│  ☐ Pinggir parit terkikis   │
│  ☐ Bau tidak normal         │
├──────────────────────────────┤
│  Seberapa parah?             │
│  1────2────3────4────5        │
│       ●                      │
│  Sedang (25–50% terdampak)   │
├──────────────────────────────┤
│  Perkiraan luas/jumlah:      │
│  [50] meter panjang parit    │
│       atau [___] pohon       │
├──────────────────────────────┤
│  Catatan tambahan:           │
│  ┌──────────────────────────┐│
│  │ Parit tersumbat material │││
│  │ tanah dan pelepah...     │││
│  └──────────────────────────┘│
│  (max 500 huruf)             │
├──────────────────────────────┤
│  📍 GPS: ✅ -2.2010, 114.248 │
├──────────────────────────────┤
│  [ Kirim Laporan → ]        │
└──────────────────────────────┘
```

---

### Screen 6c: Form Submission — Tipe C (Field Expert)
*Contoh: Task Deteksi Ganoderma untuk Pak Surya (Level 3)*

```
┌──────────────────────────────┐
│  ← Isi Laporan — TK-2847    │
│  Deteksi Ganoderma — KB-C3  │
│  ⭐⭐⭐ Expert Assessment     │
├──────────────────────────────┤
│  📷 FOTO (2–10 foto)          │
│  Wajib: pangkal batang,      │
│  pelepah, area sekitar,      │
│  tampak jauh                 │
│  ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐    │
│  │1 ││2 ││3 ││4 ││5 ││+ │    │
│  └──┘└──┘└──┘└──┘└──┘└──┘    │
│                              │
│  🎥 VIDEO (opsional, max 60d)│
│  [+ Rekam / Pilih Video]     │
├──────────────────────────────┤
│  Diagnosis yang paling tepat:│
│  [Ganoderma boninense (BSR)▼]│
│                              │
│  Seberapa yakin? [87%]       │
│  ████████████░░░░            │
├──────────────────────────────┤
│  Kemungkinan kondisi lain:   │
│  ☑ Drought stress            │
│  ☑ Fusarium wilt             │
│  ☐ Crown Disease             │
│  ☐ Defisiensi Boron          │
├──────────────────────────────┤
│  Seberapa mendesak?          │
│  ○ Pantau saja               │
│  ○ Tangani dalam 7 hari      │
│  ● Tangani dalam 48 jam      │
│  ○ Isolasi segera            │
├──────────────────────────────┤
│  Rekomendasi tindakan:       │
│  [Pembongkaran pohon         │
│   + injeksi fungisida radius │
│   5 pohon              ▼]    │
├──────────────────────────────┤
│  Estimasi:                   │
│  [3] pohon langsung terdampak│
│  [15] pohon berisiko sekitar │
├──────────────────────────────┤
│  Catatan & Bukti:            │
│  ┌──────────────────────────┐│
│  │ Badan buah ditemukan di  │││
│  │ pangkal baris ke-7 dari  │││
│  │ utara, pohon ke-3 dari   │││
│  │ barat. Spora terlihat    │││
│  │ aktif...                 │││
│  └──────────────────────────┘│
│  (max 1000 huruf)            │
├──────────────────────────────┤
│  📍 GPS: ✅ -2.1847, 114.234 │
├──────────────────────────────┤
│  [ Kirim Laporan → ]        │
└──────────────────────────────┘
```

---

### Screen 7: Konfirmasi Submit & Upload

```
┌──────────────────────────────┐
│                              │
│  Mengirim laporan kamu...    │
│                              │
│  ✅ Foto terenkripsi & dikirim│
│  ✅ Laporan tersimpan         │
│  🔄 Verifikasi otomatis...   │
│                              │
│  (proses 10–30 detik)        │
│                              │
└──────────────────────────────┘
```

---

### Screen 8: Hasil — Laporan Diterima

```
┌──────────────────────────────┐
│                              │
│      🎉 Laporan Diterima!    │
│                              │
│  Task TK-2847 selesai        │
│  Foto tersimpan aman ✅      │
│                              │
│  ┌────────────────────────┐  │
│  │  + 150 token           │  │
│  │  Langsung masuk ke     │  │
│  │  akun kamu             │  │
│  └────────────────────────┘  │
│                              │
│  Total token kamu:           │
│  14.890 → 15.040 token       │
│                              │
│  Progress Level 3:           │
│  ████████████░  73 / 200     │
│                              │
│  [Lihat Task Lain]           │
│                              │
└──────────────────────────────┘
```

---

### Screen 9: Profil Saya

```
┌──────────────────────────────┐
│  👤 Bu Dewi                  │
│  Field Analyst — Level 2     │
├──────────────────────────────┤
│  STATISTIK SAYA              │
│                              │
│  Task Selesai:  128          │
│  Akurasi:       84.7%        │
│  Token Earned:  14.890       │
├──────────────────────────────┤
│  NAIK KE LEVEL 3             │
│  ████████████░░  72/200 task │
│  Akurasi: 84.7% (perlu 85%) │
│  Konsisten: 2 bulan          │
│             (perlu 3 bulan)  │
├──────────────────────────────┤
│  RIWAYAT TASK TERAKHIR       │
│  TK-2850 ✅ +80 token  hari ini│
│  TK-2843 ✅ +80 token  kemarin │
│  TK-2831 ✅ +100 token 2 hari │
│  [Lihat Semua →]             │
├──────────────────────────────┤
│  [Keluar dari Akun]          │
└──────────────────────────────┘
```

---

## BAGIAN 4 — KONEKSI ANTAR APLIKASI

### Alur Utama End-to-End

```
OPERATOR                    MITRA LAPANGAN          VERIFIER
   │                              │                    │
   │ 1. Jalankan drone simulator  │                    │
   │    → LLM generate anomali    │                    │
   │                              │                    │
   │ 2. Jadikan anomali → Task    │                    │
   │    → smart contract terbit   │                    │
   │                              │                    │
   │              3. Mitra terima notifikasi            │
   │                 task baru di app                  │
   │                              │                    │
   │              4. Ambil task, pergi ke lokasi        │
   │                              │                    │
   │              5. Foto + isi form                   │
   │                 (Tipe A/B/C sesuai level)         │
   │                              │                    │
   │              6. Submit → foto ke Walrus+Seal       │
   │                 laporan ke smart contract          │
   │                              │                    │
   │         7a. LLM Quality Gate verifikasi           │
   │              konsistensi foto ↔ laporan            │
   │                              │                    │
   ├── 7b. Jika LULUS → Token otomatis diterbitkan ────┤
   │        Operator lihat di dashboard                │
   │                              │                    │
   │         7c. Jika GAGAL/AMBIGU → kasus di-flag ───►│
   │                                  Masuk antrean    │
   │                                  verifier         │
   │                              │         │          │
   │                              │  8. Verifier review│
   │                              │     foto + laporan │
   │                              │     beri verdict   │
   │                              │         │          │
   │◄── 9. Operator terima hasil verdict ───┘          │
   │       approve → token diterbitkan                 │
   │                              │                    │
   │              10. Mitra lihat token masuk          │
   │                  di screen hasil                  │
```

---

### State Sharing Antar Aplikasi

| Data | Dibuat oleh | Dibaca oleh |
|---|---|---|
| Task baru | Operator Dashboard | Mobile App (list task) |
| Submission laporan | Mobile App | Operator Dashboard, Verifier Dashboard |
| Foto validasi | Mobile App → Walrus | Operator Dashboard (preview), Verifier Dashboard (review) |
| Verdict agronomis | Verifier Dashboard | Operator Dashboard (hasil review), Smart Contract |
| Token history | Smart Contract | Mobile App (profil), Operator Dashboard (audit) |
| Level mitra | Smart Contract / Backend | Mobile App (profil + filter task), Operator Dashboard |

---

## BAGIAN 5 — CATATAN UI/UX & PANDUAN VISUAL

### Identitas Visual

| Elemen | Nilai |
|---|---|
| Warna primer | Hijau tua `#1a5c38` |
| Warna aksen | Kuning kebun `#e8c547` |
| Warna bahaya | Oranye `#e05c1a` |
| Background | Krem terang `#f5f2eb` (dashboard) / putih (mobile) |
| Font display | Bebas Neue / Sora (untuk angka besar dan header) |
| Font body | Plus Jakarta Sans (mudah dibaca di layar kecil) |

---

### Prinsip UX per Aplikasi

**Dashboard Operator — Density tinggi, tapi terstruktur**
- Semua informasi penting satu layar, tidak perlu scroll banyak
- Peta adalah elemen utama — harus interaktif dan responsif
- Color-coding konsisten di semua layar (merah = masalah, hijau = aman)
- Export data selalu tersedia di setiap tabel

**Dashboard Verifier — Fokus, tenang, cukup konteks**
- Tidak ada noise operasional — hanya kasus yang perlu diputuskan
- Foto bisa diperbesar, bisa di-zoom untuk inspeksi detail
- Form verdict tidak pernah lebih dari satu layar panjang
- Reasoning agronomis punya ruang yang cukup — bukan afterthought

**Mobile App — Satu tujuan per layar, tap minimal**
- Tidak ada kata teknis — "token" bukan "SUI token", "submit" menjadi "Kirim Laporan"
- Kamera dan GPS adalah CTA utama di setiap task
- Progress bar level selalu terlihat — memberi motivasi
- Offline mode: form bisa diisi, foto bisa diambil, submit saat sinyal kembali
- Setiap aksi punya feedback visual — spinner, checkmark, notifikasi sukses

---

### Tipe Task ↔ Tipe Submission — Mapping

| Tipe Task | Level Minimum | Tipe Submission | Yang Wajib |
|---|---|---|---|
| Kondisi Umum Area | Lv.1 | Tipe A | 1 foto + pilihan kondisi |
| Hitung Pohon / Inventarisasi | Lv.1 | Tipe A | 1 foto + angka hitungan |
| Kualitas Pelepah | Lv.1 | Tipe A | 1 foto + kondisi |
| Health Diagnosis | Lv.2 | Tipe B | 2 foto + gejala + keparahan |
| Anomali Drainase | Lv.2 | Tipe B | 2 foto + gejala + estimasi |
| Anomali Semi-Kritikal | Lv.2 | Tipe B | 3 foto + semua field |
| Deteksi Ganoderma / BSR | Lv.3 | Tipe C | 4 foto + diagnosis + confidence |
| Estimasi Serangan Hama Besar | Lv.3 | Tipe C | 4 foto + diagnosis + urgensi |
| Anomali Kritikal | Lv.3 | Tipe C | 4 foto + semua field + video opsional |

---

### Notifikasi & Feedback

**Mitra Lapangan (push notification via PWA):**
- "Ada task baru di dekat kamu — 80 token" → saat task terbit
- "✅ Laporan kamu diterima! +150 token masuk" → saat QA lulus
- "⚠️ Laporan kamu perlu ditinjau agronomis — standby" → saat di-flag
- "🎉 Kamu naik ke Level 3!" → saat milestone level tercapai

**Operator (in-app notifikasi):**
- "3 task baru dari hasil scan drone — jadikan task?" → setelah drone sim
- "⚠️ TK-2849 flagged — menunggu verdict agronomis" → saat flagging
- "✅ Verdict masuk untuk TK-2849 — siap diproses" → setelah verifier submit

**Verifier (in-app notifikasi):**
- "Kasus baru membutuhkan review kamu — prioritas tinggi" → saat kasus masuk

---

*Dokumen ini adalah panduan simulasi untuk keperluan demo dan pengembangan visualisasi GreenProof. Semua nama, koordinat, dan angka adalah data fiktif.*
