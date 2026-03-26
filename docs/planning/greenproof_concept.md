# GreenProof — Concept Document

---

## Apa Ini?

GreenProof adalah sistem yang membayar orang untuk membuktikan kebenaran.

Di perkebunan sawit modern, drone dan AI sudah bisa memindai ribuan hektar lahan dalam hitungan jam. Tapi ada satu hal yang tidak bisa dilakukan drone: memverifikasi apa yang sebenarnya terjadi di tanah. Apakah pohon itu benar-benar sakit? Apakah itu Ganoderma atau hanya kekurangan air? Apakah tanah di area ini memang selalu bermasalah karena kondisi historis tertentu?

Pengetahuan itu hanya ada di kepala manusia yang berdiri di depan pohon itu.

GreenProof membangun jembatan antara dua dunia itu — dan membayar siapapun yang menyumbangkan pengetahuan lapangan mereka secara terverifikasi.

---

## Masalah yang Sebenarnya

Ini bukan masalah teknologi. Ini masalah insentif dan kepercayaan.

**Masalah perusahaan perkebunan:**
Mereka sudah investasi besar di drone dan AI, tapi data yang dihasilkan tidak bisa sepenuhnya dipercaya tanpa verifikasi lapangan. AI bisa salah. Drone tidak bisa mencium tanah. Dan mengirim tim inspeksi ke setiap titik anomali secara manual itu mahal, lambat, dan tidak terstruktur.

**Masalah petugas dan petani lapangan:**
Mereka punya pengetahuan yang sangat berharga — tapi tidak ada mekanisme untuk mengukur atau menghargai kontribusi individual mereka. Yang rajin dan yang malas dapat bayaran yang sama. Pengetahuan yang mereka bawa pulang setiap hari tidak pernah masuk ke sistem manapun.

**Gap yang belum diisi:**
Tidak ada sistem yang menghubungkan kebutuhan perusahaan akan data lapangan yang terverifikasi dengan kapasitas manusia lapangan untuk menyediakannya — sekaligus memastikan data yang dikirim itu jujur dan tidak bisa dimanipulasi.

---

## Solusi — Cara Kerja Sistem

### Konsep Dasar

Perusahaan perkebunan memiliki peta anomali dari drone — daftar koordinat pohon atau area yang terdeteksi bermasalah. Data mentah drone tetap sepenuhnya di tangan perusahaan. Yang mereka lakukan di GreenProof hanya satu hal: menerbitkan **task** — instruksi sederhana yang berbunyi *"Cek titik ini, laporkan kondisinya, reward sekian token."*

Task itu masuk ke smart contract di blockchain SUI — terbuka, bisa dilihat siapapun, tidak bisa diubah setelah diterbitkan. Mitra validator yang sudah terdaftar — didaftarkan oleh perusahaan itu sendiri — menerima notifikasi langsung di aplikasi GreenProof di HP mereka.

Mitra pergi ke koordinat yang ditentukan. Mereka foto kondisi pohon. Mereka isi laporan singkat. Foto langsung tersimpan ke Walrus — storage terdesentralisasi yang tidak dimiliki siapapun, termasuk GreenProof. Smart contract memverifikasi bahwa semua syarat terpenuhi, lalu secara otomatis menerbitkan token reward ke akun mitra.

Token itu bukan mata uang. Token itu adalah bukti kontribusi yang tercatat permanen — tidak bisa diubah, tidak bisa dimanipulasi mandor, tidak bisa hilang. Token ini kemudian bisa ditukar dengan benefit nyata yang ditetapkan perusahaan: voucher belanja, pulsa, atau insentif lain.

### Yang Membuat Ini Berbeda

**Dari sisi mitra:** Ini pertama kalinya ada sistem yang mengakui dan membayar kontribusi pengetahuan lapangan secara individual dan transparan. Bukan gaji flat bulanan yang tidak mencerminkan siapa yang bekerja lebih keras.

**Dari sisi perusahaan:** Mereka mendapat data lapangan yang terverifikasi secara kriptografis — foto dan laporan yang terikat ke koordinat GPS dan waktu yang tidak bisa dipalsukan secara retroaktif. Data ini adalah dataset pelatihan yang terus meningkatkan akurasi AI drone mereka, sekaligus audit trail operasional yang objektif.

**Dari sisi sistem secara keseluruhan:** Semakin banyak validasi yang masuk, semakin pintar AI drone-nya, semakin relevan task yang dihasilkan, semakin efisien kerja mitra. Ini adalah loop yang memperkuat dirinya sendiri.

---

## Prinsip Kedaulatan Data — GreenProof Tidak Menyentuh Data Perusahaan

Ini adalah keputusan yang paling penting dan sekaligus paling kuat sebagai nilai jual — meski GreenProof yang build dan operate seluruh aplikasinya.

GreenProof **tidak menyimpan, tidak membaca, dan tidak bisa mengakses** data internal perusahaan perkebunan. Tidak ada data lahan, tidak ada koordinat anomali mentah dari drone, tidak ada data produktivitas yang pernah menyentuh server GreenProof.

Yang terjadi sebenarnya: perusahaan memegang data drone mereka sendiri. Mereka memilih anomali mana yang mau dijadikan task, lalu menerbitkan task itu melalui aplikasi GreenProof ke smart contract — hanya task, bukan data asalnya. Foto validasi dari mitra langsung ke Walrus, bukan ke server GreenProof. Smart contract adalah kode terbuka yang bisa diaudit siapapun.

### Seal — Akses Terkontrol ke Walrus

Foto validasi di Walrus dienkripsi menggunakan **Seal**, access control layer dari ekosistem SUI. Perusahaan yang menerbitkan task memegang kendali penuh atas siapa yang bisa membaca foto di storage mereka.

Secara default, hanya dua pihak yang diberi akses:

- **Perusahaan itu sendiri** — bisa review foto kapanpun dari dashboard mereka
- **Smart contract GreenProof yang terverifikasi** — butuh akses untuk memproses verifikasi dan menerbitkan token reward

Tidak ada pihak lain — termasuk tim GreenProof — yang bisa membaca foto validasi perusahaan tanpa izin eksplisit. Perusahaan bisa melihat log siapa yang mengakses data mereka, kapan, dan berapa banyak — langsung dari dashboard. Akses bisa dicabut kapanpun, efektif seketika.

Ini adalah **selling point utama** ke perusahaan besar yang selama ini tidak mau pakai platform pihak ketiga karena takut data operasional mereka bocor ke kompetitor. Dengan GreenProof, ketakutan itu tidak relevan karena secara teknis memang tidak bisa terjadi — bukan karena janji, tapi karena arsitekturnya.

---

## Siapa yang Develop Apa — dan Siapa yang Urus Siapa

**GreenProof develop dan maintain seluruh aplikasi** — aplikasi mitra, dashboard perusahaan, smart contract, dan seluruh backend. Ini adalah produk SaaS yang siap pakai.

**Perusahaan perkebunan tidak perlu develop apapun.** Mereka cukup daftar, bayar subscription, dan sistem langsung bisa digunakan. Tapi ada satu tanggung jawab yang tetap ada di sisi mereka: **rekrutmen dan onboarding validator**. GreenProof menyediakan platform dan aplikasinya — perusahaan yang menentukan siapa yang boleh masuk sebagai validator di kebun mereka, mendaftarkan mereka ke sistem, dan mengelola pool validator internal mereka sendiri.

Pembagian tanggung jawab ini penting karena dua alasan. Pertama, perusahaan yang paling tahu siapa yang layak dipercaya untuk masuk ke area kebun mereka — ini adalah keputusan yang tidak bisa didelegasikan ke pihak luar. Kedua, ini menjaga GreenProof tetap sebagai software company yang bisa di-scale, bukan operations company yang harus rekrut orang di setiap area kebun baru.

---

## Fitur Konfigurasi Model AI — Di Dashboard Perusahaan

Ini adalah fitur yang membedakan GreenProof dari sistem verifikasi lapangan biasa. Perusahaan bisa memilih bagaimana AI digunakan dalam sistem mereka — langsung dari dashboard, tanpa bantuan teknis dari GreenProof.

### Dua Mode yang Tersedia

**Mode A — Pakai Model Sendiri**
Perusahaan yang sudah punya model AI drone sendiri tetap bisa pakai model mereka. Mereka upload output anomaly map dari model mereka ke GreenProof dalam format standar. GreenProof tidak punya akses ke foto validasi untuk keperluan AI — Seal policy tetap ketat: hanya perusahaan dan smart contract GreenProof yang bisa akses.

**Mode B — Pakai Model GreenProof**
Perusahaan yang belum punya model sendiri bisa menggunakan model AI dari GreenProof. Dengan memilih mode ini, mereka memberikan izin tambahan ke AI service GreenProof untuk membaca foto validasi mereka via Seal — hanya untuk keperluan analisis dan training. Sebagai imbalannya, data validasi mereka berkontribusi pada peningkatan model, dan mereka mendapat akurasi model yang lebih baik seiring waktu.

### Prinsip Fairness Model GreenProof

Perusahaan yang berkontribusi lebih banyak data validasi ke model GreenProof mendapat model yang lebih akurat. Ini bukan hukuman untuk yang tidak berkontribusi — mereka tetap bisa pakai model GreenProof di tier dasar. Tapi ada insentif nyata untuk berbagi: semakin banyak data yang dikontribusikan, semakin pintar model untuk kebun spesifik mereka.

Model GreenProof dimulai sebagai satu model universal, dan akan berkembang menjadi model per-region seiring data yang terkumpul — karena kondisi kebun di Kalimantan berbeda dengan Sumatera. Data setiap submission di-tag dengan metadata wilayah sehingga fine-tuning regional bisa dilakukan tanpa harus memulai dari nol.

### Transparansi Akses Data

Di bagian manapun perusahaan memberikan akses tambahan ke AI service GreenProof, log akses tersedia secara real-time di dashboard. Perusahaan bisa lihat: kapan foto mereka diakses, oleh service apa, dan untuk tujuan apa. Akses bisa dicabut kapanpun dari dashboard yang sama — efektif seketika, tanpa perlu menghubungi tim GreenProof.

GreenProof berkomitmen untuk tidak menggunakan akses ini selain untuk training dan inference model yang sudah diizinkan. Tapi komitmen ini tidak sekadar janji — dikunci secara teknis melalui Seal dan bisa diaudit melalui log on-chain.

GreenProof beroperasi sebagai **SaaS B2B2C** — perusahaan perkebunan adalah klien yang membayar, mitra validator adalah pengguna akhir yang menggunakan aplikasi secara gratis.

### Sumber Pendapatan

**1. Subscription bulanan per perusahaan**
Perusahaan membayar biaya berlangganan berdasarkan skala operasi — jumlah estate aktif atau volume task per bulan. Ini adalah pendapatan utama dan paling stabil karena sifatnya recurring.

**2. Fee per token yang diterbitkan**
Setiap token reward yang diterbitkan perusahaan ke mitra, ada persentase kecil yang masuk ke GreenProof. Kecil per unit, tapi tumbuh seiring volume operasional klien — dan membuat GreenProof punya kepentingan yang sama dengan klien untuk memastikan mitra aktif.

**3. Tier enterprise (jangka panjang)**
Perusahaan besar dengan kebutuhan kustomisasi — integrasi ke sistem ERP atau drone, white-label aplikasi, SLA khusus — membayar dengan nilai kontrak yang lebih besar dan lebih panjang.

### Siapa yang Membayar Apa

| Pihak | Yang mereka bayar | Yang mereka dapat |
|---|---|---|
| Perusahaan perkebunan | Subscription + fee per token | Aplikasi siap pakai, platform untuk kelola validator internal mereka, verifikasi lapangan terverifikasi, data tetap milik mereka sepenuhnya |
| Mitra Validator (didaftarkan perusahaan) | Tidak ada — gratis | Aplikasi untuk terima task dan token reward per kontribusi valid |
| GreenProof | Develop dan operate seluruh platform | Subscription + fee per token |

### Kenapa Perusahaan Mau Bayar

Biaya satu flight drone untuk satu estate bisa mencapai puluhan juta rupiah. Kalau data yang dihasilkan tidak bisa ditindaklanjuti karena tidak ada sistem verifikasi lapangan yang bisa dipercaya, sebagian besar investasi itu terbuang. GreenProof mengubah data drone dari *nice to have* menjadi *actionable intelligence* — dengan aplikasi yang langsung bisa dipakai, tanpa perusahaan perlu membangun apapun sendiri, dan tanpa harus melepaskan kendali atas data mereka.

---

## Stakeholder dan Peran Mereka

**Perusahaan Perkebunan** — klien yang membayar. Mereka menggunakan dashboard GreenProof untuk menerbitkan task, mengatur nilai reward per tipe validasi, dan memantau seluruh aktivitas validasi di kebun mereka.

**Mitra Validator** — pengguna aplikasi GreenProof di lapangan yang didaftarkan oleh perusahaan perkebunan itu sendiri. GreenProof menyediakan platform dan aplikasinya — perusahaan yang menentukan siapa yang boleh jadi validator di kebun mereka. Bisa terdiri dari karyawan tetap perusahaan untuk validasi kritikal, petani plasma yang lahannya berbatasan dengan kebun, atau warga lokal yang sudah punya hubungan dengan perusahaan.

**Agronomis / Ahli** — wasit untuk kasus ambigu yang tidak bisa diselesaikan data saja. Mereka memberikan verdict akhir untuk kasus seperti deteksi Ganoderma — dan input mereka menjadi training data paling berharga di sistem.

**Tim GreenProof** — developer dan operator seluruh platform. Bertanggung jawab atas uptime, keamanan smart contract, dan onboarding klien baru.

---

## Struktur Role dan Hak Akses

GreenProof memisahkan pengguna ke dalam empat kelompok berdasarkan siapa yang mengelola mereka dan apa yang bisa mereka lakukan di sistem.

---

### Kelompok 1 — GreenProof Level

**Admin GreenProof**
Satu-satunya role yang dikelola oleh tim GreenProof sendiri. Punya akses ke seluruh platform lintas perusahaan untuk keperluan operasional — onboarding klien baru, monitoring kesehatan sistem, penanganan isu teknis. Tidak bisa mengakses data foto validasi perusahaan manapun karena dibatasi Seal.

---

### Kelompok 2 — Perusahaan Level

Semua role di kelompok ini didaftarkan dan dikelola oleh perusahaan perkebunan, bukan oleh GreenProof.

**Operator**
Pengguna utama dashboard perusahaan. Bisa menerbitkan task, mendaftarkan dan menonaktifkan validator, mengatur nilai reward per tipe validasi, melihat seluruh aktivitas validasi di kebun mereka, dan mengkonfigurasi setting model AI serta Seal policy. Satu perusahaan bisa punya lebih dari satu Operator.

**Supervisor**
Role opsional di atas Operator untuk perusahaan yang butuh approval flow. Supervisor bisa mereview dan menyetujui task kritikal sebelum diterbitkan, melihat flag dari quality gate, dan memutuskan apakah sebuah kasus perlu dieskalasi ke Agronomis. Supervisor tidak bisa ubah setting sistem — hanya review dan approve.

---

### Kelompok 3 — Lapangan Level

**Agronomis / Ahli**
Role khusus yang di-assign operator untuk menangani kasus ambigu — kasus yang tidak bisa diselesaikan oleh data dan cross-validation saja. Agronomis tidak mengambil task biasa. Mereka menerima antrian kasus yang di-flag oleh sistem, memberikan verdict akhir, dan diagnosis mereka menjadi labeled data dengan nilai tertinggi dalam sistem. Role ini bisa di-assign ke konsultan eksternal atau staf internal yang punya kompetensi agronomi.

**Mitra Validator**
Pengguna aplikasi lapangan. Terbagi ke dalam tiga level berdasarkan track record — detail di section leveling di bawah.

---

### Leveling Mitra Validator

Level ditentukan secara otomatis oleh sistem berdasarkan kombinasi dua metrik: jumlah task yang diselesaikan dan akurasi diagnosis yang terbukti benar dari waktu ke waktu. Bukan salah satu saja — volume tanpa akurasi tidak naik level, akurasi tinggi dari sedikit task belum dianggap konsisten.

**Level 1 — Field Observer** *(default untuk semua mitra baru)*

Mitra yang baru terdaftar. Sistem belum punya cukup data untuk menilai kualitas mereka, jadi akses dibatasi ke task berisiko rendah.

- Task yang bisa diambil: hitungan pohon, kondisi umum area
- Token reward: standar (1x)
- Bobot dalam cross-validation: 1x
- Naik ke Level 2 setelah: 50 task selesai dengan akurasi di atas 75%

**Level 2 — Field Analyst**

Mitra yang sudah terbukti bisa diandalkan untuk task standar. Dipercaya untuk menangani kondisi yang lebih kompleks.

- Task yang bisa diambil: semua Level 1 + diagnosis kondisi kesehatan pohon, anomali semi-kritikal
- Token reward: 1.5x multiplier dari standar
- Bobot dalam cross-validation: 1.5x
- Bisa lihat ranking kontribusi mereka di pool validator perusahaan
- Naik ke Level 3 setelah: 200 task selesai, akurasi di atas 85%, konsisten minimal 3 bulan

**Level 3 — Field Expert**

Mitra dengan track record panjang dan akurasi tinggi. Diagnosis mereka punya bobot signifikan dalam menentukan hasil agregasi. Pada level ini, mitra mulai bisa berkontribusi pada kasus yang sebelumnya hanya bisa ditangani agronomis — dengan supervisi.

- Task yang bisa diambil: semua tipe task termasuk anomali kritikal
- Token reward: 2x multiplier dari standar
- Bobot dalam cross-validation: 2x — satu Field Expert setara dua Field Analyst atau empat Field Observer
- Diagnosis Field Expert yang konsisten dengan verdict agronomis otomatis menaikkan reputasi score mereka
- Bisa di-assign oleh operator untuk task spesifik secara langsung, tanpa melalui antrian terbuka

---

### Hak Akses per Role — Ringkasan

| Role | Aplikasi | Dashboard | Kelola Validator | Terbitkan Task | Ambil Task | Review Kasus Flag | Konfigurasi Sistem |
|---|---|---|---|---|---|---|---|
| Admin GreenProof | — | ✓ (lintas klien) | — | — | — | — | ✓ |
| Operator | — | ✓ (perusahaan sendiri) | ✓ | ✓ | — | — | ✓ |
| Supervisor | — | ✓ (read + approve) | — | ✓ (dengan approval) | — | ✓ | — |
| Agronomis | — | ✓ (antrian kasus saja) | — | — | — | ✓ | — |
| Field Observer | ✓ | — | — | — | ✓ (task dasar) | — | — |
| Field Analyst | ✓ | — | — | — | ✓ (task menengah) | — | — |
| Field Expert | ✓ | — | — | — | ✓ (semua task) | — | — |

### Role Overlap

Satu orang bisa punya lebih dari satu role, tapi hanya atas izin eksplisit dari Operator perusahaan. Kasus yang paling umum adalah Agronomis yang juga terdaftar sebagai Field Expert — mereka bisa ambil task lapangan tertentu sekaligus review kasus flag. Ketika seseorang punya dua role, sistem menggunakan role yang lebih tinggi untuk menentukan hak akses di setiap konteks.

### Untuk Hackathon (POC)

Tiga interface yang harus berjalan end-to-end saat demo, masing-masing mewakili sudut pandang berbeda dalam sistem:

---

**1. Dashboard Perusahaan**
Interface web untuk Operator dan Supervisor perusahaan perkebunan.

Yang bisa dilakukan:
- Daftarkan dan kelola validator — assign level awal, nonaktifkan
- Buat task baru — input koordinat, tipe validasi, nilai reward token
- Jalankan drone simulator — LLM generate daftar anomali realistis sebagai sumber task
- Pantau semua task: status, siapa yang mengerjakan, foto bukti, diagnosis yang dilaporkan
- Lihat berapa token yang sudah diterbitkan dan ke siapa
- Konfigurasi model AI (Mode A / Mode B) dan lihat log akses Seal

---

**2. Dashboard Verifier (Agronomis)**
Interface web khusus untuk Agronomis yang di-assign perusahaan.

Yang bisa dilakukan:
- Lihat antrian kasus yang di-flag sistem — disagreement tinggi antar mitra atau confidence rendah dari LLM quality gate
- Review foto bukti dari Walrus dan semua diagnosis yang disubmit mitra untuk kasus tersebut
- Berikan verdict akhir dengan catatan reasoning singkat
- Lihat history kasus yang sudah di-review

---

**3. Aplikasi Mitra Lapangan**
Aplikasi mobile web — dibuka dari browser HP tanpa install.

Yang bisa dilakukan:
- Login dengan akun Google via zkLogin
- Lihat task tersedia terdekat berdasarkan GPS — hanya task yang sesuai dengan level mitra
- Ambil task, pergi ke koordinat, foto kondisi pohon dari kamera HP
- Isi form diagnosis singkat sesuai tipe task, submit
- Foto langsung ke Walrus dengan Seal, LLM verifikasi konsistensi foto dan diagnosis
- Lihat token reward masuk setelah diverifikasi
- Lihat level saat ini dan progress ke level berikutnya

---

**Komponen pendukung yang tidak terlihat tapi harus berjalan:**
- Smart contract di SUI testnet — task registry, klaim, verifikasi, mint token
- Backend Node.js — API penghubung semua interface, integrasi LLM, sponsored transactions
- Walrus + Seal — upload dan enkripsi foto validasi dengan access policy per perusahaan
- LLM API — drone anomaly simulator dan quality gate Layer 2

---

### Admin GreenProof Dashboard

Konsep role Admin GreenProof ada dan dibutuhkan untuk operasional produk nyata. Tapi interface-nya tidak perlu dibangun untuk hackathon — fungsi admin yang dibutuhkan saat demo bisa dilakukan langsung via script atau CLI.

---

### Untuk Produk Nyata (Post-Hackathon)

**Admin GreenProof Dashboard** — interface untuk tim GreenProof mengelola seluruh platform: onboarding klien, monitoring kesehatan sistem lintas perusahaan, penanganan eskalasi.

**Model AI Spesifik** — model computer vision yang di-train dari data validasi terkumpul menggantikan LLM untuk analisis foto.

**Sistem Level Otomatis** — kalkulasi naik level otomatis berdasarkan akurasi dan volume; untuk hackathon bisa di-set manual oleh operator.

**Integrasi Drone Sungguhan** — konektor ke platform drone industri sehingga peta anomali masuk otomatis.

**Mekanisme Penukaran Token** — katalog benefit dari perusahaan yang bisa ditukar langsung dari aplikasi mitra.

---

## Aspek Hukum — Kenapa Ini Legal di Indonesia

Token dalam sistem ini bukan mata uang dan bukan aset kripto dalam pengertian regulasi Indonesia. Lebih tepat disebut voucher digital berbasis blockchain — konsep yang sudah lama dikenal hukum Indonesia.

Token tidak bisa diperjualbelikan di exchange manapun dan tidak bisa ditukar ke Rupiah secara langsung — hanya bisa digunakan dalam ekosistem yang ditetapkan perusahaan. Token bukan pengganti gaji, melainkan benefit tambahan di atas kompensasi Rupiah yang sudah ada. Dan POJK No. 27 Tahun 2024 secara eksplisit mengecualikan closed-loop token dari regulasi aset kripto OJK.

---

## Posisi di Landscape yang Lebih Besar

GreenProof masuk ke dalam kategori **DePIN — Decentralized Physical Infrastructure Network** — kategori proyek blockchain yang membayar kontributor untuk menyediakan data atau layanan dari dunia fisik.

Contoh global: Hivemapper membayar pengemudi untuk merekam jalan dan membangun peta, Helium membayar pemilik perangkat untuk menyediakan coverage jaringan wireless, WeatherXM membayar pemilik stasiun cuaca untuk data meteorologi.

GreenProof adalah versi DePIN untuk validasi data lapangan pertanian — kategori yang belum ada pemainnya di Indonesia dan sangat sedikit di level global. Bedanya dengan contoh-contoh tersebut: GreenProof hadir sebagai produk SaaS yang siap pakai, bukan hanya protocol. Entry barrier untuk klien jauh lebih rendah.

---

## Mengapa SUI, Walrus, dan Seal

Bukan pilihan teknis semata — ketiganya menjawab kekhawatiran bisnis yang nyata dan langsung terasa oleh pengguna.

**SUI** memungkinkan sistem ini dipakai oleh petani yang tidak pernah kenal blockchain sekalipun. Login pakai Google. Gas fee dibayar GreenProof atas nama perusahaan. Tidak ada kata "wallet", tidak ada kata "private key" dalam pengalaman pengguna. Blockchain-nya invisible — yang terlihat hanya "submit laporan, dapat reward."

**Walrus** adalah jawaban untuk pertanyaan yang selalu muncul dari perusahaan besar: *"Kalau foto validasi ada di ekosistem kamu, apa yang mencegah kamu menghapus atau mengubahnya?"* Dengan Walrus, jawabannya bukan "kami berjanji tidak akan" — tapi "secara teknis tidak bisa, oleh siapapun." Foto yang sudah masuk ke Walrus tidak bisa dihapus atau diubah — permanen, immutable.

**Seal** adalah jawaban untuk pertanyaan lanjutannya: *"Kalau fotonya permanen di Walrus, berarti semua orang bisa lihat?"* Tidak. Seal mengenkripsi data di Walrus dan memberikan perusahaan kendali penuh atas siapa yang bisa membaca foto mereka. Default-nya hanya perusahaan sendiri dan smart contract GreenProof — tidak lebih. Perusahaan yang mau mengaktifkan model AI GreenProof bisa memberi akses tambahan ke AI service, dengan log yang bisa diaudit dan bisa dicabut kapanpun.

Ketiganya bekerja bersama sebagai satu ekosistem yang kohesif di atas SUI — dan itu adalah keunggulan yang tidak bisa direplikasi dengan memilih tool dari ekosistem yang berbeda-beda.

---

## Satu Kalimat untuk Pitch

> GreenProof adalah aplikasi SaaS yang membayar petani dan petugas lapangan untuk memverifikasi data drone — mengubah pengetahuan lokal yang selama ini tidak terukur menjadi bukti lapangan yang permanen, terverifikasi, dan hanya bisa diakses oleh yang berhak, tanpa perusahaan perlu membangun apapun sendiri atau melepaskan kendali atas data mereka.
