# 🎨 Cara Tambahin Gambar Pixel Character

## Langkah-langkah:

1. **Siapkan gambar pixel art kamu** (format: `.png`, `.gif`, atau `.webp`)
   - Ukuran recommended: 128x128px atau 256x256px
   - Background sebaiknya transparan

2. **Rename file gambar jadi `character.png`**

3. **Taruh file di folder ini** (`public/images/`)
   - Path final: `public/images/character.png`

4. **Refresh browser** - karakter kamu akan otomatis muncul! ✨

---

## Custom Message:

Kalau mau ganti pesan yang muncul pas karakter di-klik, edit di `src/app/page.tsx`:

```tsx
<PixelCharacter message="Halo! Selamat datang! 🌸" />
```

---

## Kalau Belum Punya Gambar:

Kamu bisa bikin pixel art gratis di:
- **Piskel** (https://www.piskelapp.com/) - Web-based, gampang
- **Aseprite** (https://www.aseprite.org/) - Professional tool
- **Pixilart** (https://www.pixilart.com/) - Online & gratis

Atau download pixel art gratis dari:
- **itch.io** (https://itch.io/game-assets/free/tag-pixel-art)
- **OpenGameArt** (https://opengameart.org/)
