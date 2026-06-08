// Mengambil data ID komik dari URL browser
const urlParams = new URLSearchParams(window.location.search);
const komikId = urlParams.get('id');

// Base URL server Vercel pribadimu
const BASE_API = 'https://vercel.app';
const selectChapter = document.getElementById('pilih-chapter');

async function inisialisasi() {
    if (!komikId) return;
    try {
        // 1. Ambil info detail komik dan daftar chapter
        const res = await fetch(`${BASE_API}/info?id=${komikId}`);
        const detail = await res.json();
        document.getElementById('judul-komik').innerText = detail.title;

        // 2. Masukkan semua daftar chapter ke dalam Dropdown Select
        detail.chapters.forEach(ch => {
            selectChapter.innerHTML += `<option value="${ch.id}">${ch.title}</option>`;
        });

        // 3. Efek otomatis load chapter pertama saat halaman terbuka
        if (detail.chapters.length > 0) {
            selectChapter.value = detail.chapters[0].id;
            gantiChapter(detail.chapters[0].id);
        }
    } catch (err) {
        console.error("Gagal memuat detail komik:", err);
    }
}

async function gantiChapter(chapterId) {
    if (!chapterId) return;
    const wadahGambar = document.getElementById('wadah-gambar');
    wadahGambar.innerHTML = '<h3>Sedang memuat lembaran gambar...</h3>';

    try {
        // 4. Ambil semua link gambar yang ada di dalam chapter tersebut
        const res = await fetch(`${BASE_API}/read?chapterId=${chapterId}`);
        const halaman = await res.json();
        wadahGambar.innerHTML = '';

        // 5. Render gambar memanjang ke bawah khas manhwa
        halaman.forEach(imgObj => {
            // Gunakan proxy weserv agar gambar tidak diblokir/broken oleh server komik asal
            const proxyUrl = `https://weserv.nl{encodeURIComponent(imgObj.img)}`;
            wadahGambar.innerHTML += `<img src="${proxyUrl}" class="halaman-komik" loading="lazy" alt="page">`;
        });
    } catch (err) {
        console.error("Gagal memuat gambar chapter:", err);
        wadahGambar.innerHTML = '<h3>Gagal memuat halaman, server tujuan sibuk.</h3>';
    }
}

// Deteksi saat user mengganti pilihan chapter di dropdown
selectChapter.addEventListener('change', (e) => {
    gantiChapter(e.target.value);
});

// Jalankan fungsi otomatis saat halaman baca dibuka
inisialisasi();
