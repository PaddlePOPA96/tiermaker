async function fetchPage(page) {
    const url = `https://api.jikan.moe/v4/anime?order_by=score&sort=desc&limit=25&page=${page}`;
    const res = await fetch(url);
  
    if (!res.ok) {
      console.error("Gagal fetch:", res.status, res.statusText);
      return [];
    }
  
    const json = await res.json();
    return json.data || [];
  }
  
  function escapeHtml(str = "") {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  
  (async () => {
    try {
      let all = [];
  
      console.log("Mengambil 200 anime skor tertinggi dari Jikan...");
  
      // Ambil 8 halaman = 25 x 8 = 200 anime
      for (let page = 1; page <= 8; page++) {
        console.log(`Fetching page ${page}...`);
        const data = await fetchPage(page);
        all = all.concat(data);
      }
  
      all = all.slice(0, 200);
  
      console.log("Selesai! Membuat HTML card...");
  
      const cardsHtml = all
        .map((item, idx) => {
          const title =
            item.title ||
            (item.titles && item.titles[0] && item.titles[0].title) ||
            "Untitled";
  
          const img =
            item.images &&
            item.images.jpg &&
            item.images.jpg.image_url
              ? item.images.jpg.image_url
              : "https://placehold.co/200x300?text=No+Image";
  
          const safeTitle = escapeHtml(title);
  
          return `
  <div class="anime-card" draggable="true" id="anime-score-${idx + 1}">
    <img src="${img}" alt="${safeTitle}" />
    <div><div class="anime-name">${safeTitle}</div></div>
  </div>`;
        })
        .join("\n");
  
      // Simpan output ke file
      const fs = await import("node:fs");
      fs.writeFileSync("anime-cards-score.html", cardsHtml);
  
      console.log("Sukses! File telah dibuat:");
      console.log("➡ anime-cards-score.html");
      console.log("Silakan buka & copy isinya ke tier maker.");
    } catch (err) {
      console.error("Error:", err);
    }
  })();
  
