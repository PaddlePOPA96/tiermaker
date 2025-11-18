require("dotenv").config();
const { Manga, login } = require("mangadex-full-api");

(async () => {
  try {
    await login(
      process.env.MANGADEX_USERNAME,
      process.env.MANGADEX_PASSWORD
    );

    console.log("Login sukses!");

    const result = await Manga.search("Berserk");
    const manga = result[0];

    console.log("Judul:", manga.title);
    console.log("ID:", manga.id);

    const covers = await manga.getCovers();
    const file = covers.data[0].attributes.fileName;

    const url = `https://uploads.mangadex.org/covers/${manga.id}/${file}`;

    console.log("COVER:", url);

  } catch (err) {
    console.error("ERROR:", err);
  }

  console.log("USER:", process.env.MANGADEX_USERNAME);
console.log("PASS:", process.env.MANGADEX_PASSWORD);
})();
