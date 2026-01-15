# Rutt-Etra-Izer Pro

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://crazyka51.github.io/rutt-etra-izer-pro/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Profesionální emulace Rutt-Etra video syntezátoru s pokročilými filtry a 3D efekty.

## 🌐 Live Demo

**[https://crazyka51.github.io/rutt-etra-izer-pro/](https://crazyka51.github.io/rutt-etra-izer-pro/)**

## 📥 Desktop Aplikace

Stáhněte si **Electron desktop verzi** pro Windows:
- [Rutt-Etra-Izer-Setup-1.0.0.exe](https://github.com/Crazyka51/rutt-etra-izer-pro/releases) (78 MB)
- Vícekroková instalace s možností vytvoření ikony na ploše
- Funguje offline bez internetového připojení

## ✨ Hlavní funkce

### 🎨 Pokročilé obrazové filtry
- **Základní úpravy**: Jas, Kontrast, Expozice, Sytost, Ostrost
- **Pokročilé úpravy**: Světlá místa, Stíny, Vinětace
- **Barevné úpravy**: Teplota, Nádech, Hue shift, Gamma korekce
- **RGB Kanály**: Individuální ovládání červené, zelené a modré
- **Speciální efekty**: Inverze barev, Color shift

### 🔄 3D Efekty a Hloubka
- **Pokročilé ovládání hloubky**:
  - Inverze hloubky (tmavé oblasti = vysoké)
  - Ořez jasu (Min/Max rozsah)
  - Kontrast hloubky (Power curve falloff)
- **Rotace a pohyb**:
  - Auto-rotace s nastavitelnou rychlostí
  - Manuální rotace myší
  - Rotace šipkami
  - Frontální pohled (face-to-face view)

### 🎨 Vizuální režimy
- **Original**: Zachování původních barev
- **Monochrome**: Jednobarevný režim s vlastní barvou
- **Rainbow**: Duhovýpřechod
- **Gradient**: Barevný gradient

### 🔧 Diagnostika a Nástroje
- **Real-time logging**: Sledování všech operací v reálném čase
- **Export logů**: Uložení diagnostických dat do souboru
- **Systémové informace**: WebGL podpora, paměť, rozlišení
- **Memory management**: Automatické čištění paměti při načítání nových obrázků

## 🚀 Použití

### Web Verze
1. Otevřete [live demo](https://crazyka51.github.io/rutt-etra-izer-pro/)
2. Načtěte obrázek:
   - Přetáhněte obrázek do okna (drag & drop)
   - Klikněte na "vyberte soubor"
   - Načtěte ukázkový obrázek (Vermeer)
3. Upravujte parametry v ovládacím panelu vpravo
4. Uložte výsledek klávesou **'S'** nebo tlačítkem "Uložit obrázek"

### Ovládání
- **Myš**: Klikněte a táhněte pro rotaci 3D scény
- **Kolečko myši**: Přiblížení/oddálení (pouze nad 3D scénou)
- **Šipky**: Manuální rotace (↑↓ pro X, ←→ pro Y)
- **Klávesa 'S'**: Rychlé uložení obrázku
- **Tlačítka Reset**: Každá složka má vlastní reset button

## 🛠️ Technologie

- **Three.js r37** - 3D WebGL rendering
- **dat.GUI v0.7.9** - Ovládací panel
- **jQuery** - DOM manipulace
- **Canvas API** - Pixel-level image processing (20+ filtrů)
- **Electron v33.4.11** - Desktop aplikace
- **NSIS** - Windows instalátor

## 📦 Build (Desktop Verze)

```bash
# Instalace závislostí
npm install

# Spuštění v development módu
npm start

# Build Windows instalátoru
npm run build
```

## 🎯 Profesionální Workflow

Aplikace je navržena pro profesionální fotografy a digitální umělce:
- **Vysoká kvalita**: Support pro obrázky až 6000x6000 px
- **Real-time preview**: Okamžitá vizualizace změn
- **Non-destructive editing**: Všechny filtry jsou vratné
- **Export**: Vysoká kvalita PNG výstupu
- **Performance optimalizace**: Debouncing, memory management, anti-crash protections

## 📝 Historie změn

### v1.0.0 (15.1.2026)
- ✅ Initial release
- ✅ GitHub Pages deployment
- ✅ 20+ obrazových filtrů
- ✅ Pokročilé ovládání hloubky
- ✅ Memory leak fixes
- ✅ Comprehensive logging system
- ✅ Individual reset buttons
- ✅ Frontal view feature
- ✅ Desktop installer (NSIS)

## 🐛 Známé problémy

- **WebGL**: Vyžaduje podporu WebGL v prohlížeči
- **Velké obrázky**: Obrázky > 3000x3000 px mohou být pomalé
- **Mobile**: Optimalizováno pro desktop, mobile support je omezený

## 📄 Licence

Založeno na původním [RuttEtraIzer](http://www.airtightinteractive.com/2011/06/rutt-etra-izer/) od Felix Turner  
Modifikováno a rozšířeno o profesionální funkce

## 🤝 Přispívání

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Kontakt

GitHub Issues: [https://github.com/Crazyka51/rutt-etra-izer-pro/issues](https://github.com/Crazyka51/rutt-etra-izer-pro/issues)

---

**Made with ❤️ for photographers and digital artists**

🌟 **Star this repository** if you find it useful!
