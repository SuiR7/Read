// Menggunakan server Vercel pribadimu untuk mencari komik Solo Leveling
const API_URL = 'https://vercel.app';

async function muatKatalog() {
    try {
        const response = await fetch(API_URL);
        const hasil = await response.json();
        const katalog = document.getElementById('katalog');
        katalog.innerHTML = '';

        // Looping data dari API untuk disusun menjadi kartu komik
        hasil.results.forEach(komik => {
            katalog.innerHTML += `
                <a href="baca.html?id=${encodeURIComponent(komik.id)}" class="kartu">
                    <img src="${komik.image}" alt="${komik.title}" loading="lazy">
                    <p>${komik.title}</p>
                </a>
            `;
        });
    } catch (error) {
        console.error("Error memuat API:", error);
        document.getElementById('katalog').innerHTML = '<h2>Gagal memuat data dari server Vercel Anda.</h2>';
    }
}

// Jalankan fungsi otomatis saat halaman dibuka
muatKatalog();
