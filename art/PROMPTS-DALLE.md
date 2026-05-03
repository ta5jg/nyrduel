# Nyrduel Art — DALL-E 3 Prompt Set

DALL-E 3 farklı çalışıyor: hashtag/parametre yok, doğal cümle seviyor, prompt'u kendi içinden "rewrite" edebiliyor. Aşağıdaki yapı bu üçünü çözüyor.

## Nereden kullanırsın

| Yol | Maliyet | Hız | Kontrol |
|---|---|---|---|
| **ChatGPT Plus (DALL-E 3)** | $20/ay (ChatGPT aboneliği) | Hızlı, sohbet içinde | En iyi — aynı sohbete kalan promptlar stil tutarlılığını korur |
| **Bing Image Creator** ([bing.com/images/create](https://www.bing.com/images/create)) | Ücretsiz | Yavaş (kuyruk var) | Aynı DALL-E 3 motoru, sadece hız farklı |
| **OpenAI API** (`dall-e-3`) | $0.04–0.12 / görsel | Çok hızlı | Tam parametre kontrolü (style: natural / vivid, hd kalitesi) |

## Üç altın kural

1. **"I NEED" tekniği** — ChatGPT senin promptunu kendi içinden iyileştirip rewrite ediyor (genelde stilini bozuyor). Önüne **"I NEED EXACTLY THIS, DO NOT REWRITE:"** yazınca aynen kullanıyor.
2. **Şeffaf arka plan yok** — DALL-E 3 transparent PNG üretmiyor. "Plain white background, no shadow" iste, sonra [remove.bg](https://www.remove.bg)'e koy. Heroes için zorunlu, arenalar için gerekmiyor.
3. **Tutarlılık için aynı sohbette** — 6 hero'yu **aynı ChatGPT sohbetinde** üret. DALL-E önceki üretimleri referans alıyor; stil dağılmıyor. Yeni sohbet açarsan stil sıfırlanır.

## Master stil bloğu

Her prompt'un sonuna ekle (kelime kelime aynı olsun, stil tutarlılığı için):

```
In the style of Studio Ghibli, hand-painted anime illustration with
painterly brushwork, soft warm volumetric lighting, gentle dramatic
atmosphere, clean linework, cinematic composition.
```

---

## HERO SPRITE'LARI (6 portre, 1024×1792 — portrait)

ChatGPT'de tek tek girin, her birinden **2-3 varyant üretip en tutarlı olanını seçin**. Hepsi aynı sohbette olsun.

### 1) Soldier

```
I NEED EXACTLY THIS, DO NOT REWRITE: Full-body anime illustration of a
young human soldier in his early twenties, short dark hair, wearing a
simple polished steel breastplate over a beige linen tunic, holding a
worn kite shield in his left hand and a straight longsword pointing
down in his right hand, calm grounded stance, sturdy leather boots,
neutral confident expression, centered character on a plain white
background, no shadow on the floor, no text, no logos, character
reference sheet, 3:4 portrait orientation, full body visible head to toe.

In the style of Studio Ghibli, hand-painted anime illustration with
painterly brushwork, soft warm volumetric lighting, gentle dramatic
atmosphere, clean linework, cinematic composition.
```

### 2) Brute

```
I NEED EXACTLY THIS, DO NOT REWRITE: Full-body anime illustration of a
massive bare-chested brawler, broad shoulders, slightly hunched
posture, thick muscular forearms wrapped in worn leather strips, bald
with a scarred face and a small scar across the brow, holding a heavy
spiked wooden club resting on his right shoulder, simple dark trousers
and worn boots, grim determined expression, centered character on a
plain white background, no shadow on the floor, no text, no logos,
character reference sheet, 3:4 portrait orientation, full body visible
head to toe.

In the style of Studio Ghibli, hand-painted anime illustration with
painterly brushwork, soft warm volumetric lighting, gentle dramatic
atmosphere, clean linework, cinematic composition.
```

### 3) Archer

```
I NEED EXACTLY THIS, DO NOT REWRITE: Full-body anime illustration of a
lean ranger archer, hooded forest-green cloak with leaf accent details,
drawing back a recurve wooden bow with one nocked arrow, eyes focused
forward, lightweight brown leather chest armor, quiver full of arrows
across the back, agile balanced stance with one foot slightly forward,
tall leather boots, centered character on a plain white background, no
shadow on the floor, no text, no logos, character reference sheet, 3:4
portrait orientation, full body visible head to toe.

In the style of Studio Ghibli, hand-painted anime illustration with
painterly brushwork, soft warm volumetric lighting, gentle dramatic
atmosphere, clean linework, cinematic composition.
```

### 4) Rogue

```
I NEED EXACTLY THIS, DO NOT REWRITE: Full-body anime illustration of a
nimble rogue assassin, deep black hooded cloak casting heavy shadow
over the upper face, two glinting curved daggers held in reverse grip
at the hips, crouched ready stance, dark leather armor with silver
buckle accents, partial dark bandana over the lower face, only the
sharp golden eyes catching the light from under the hood, centered
character on a plain white background, no shadow on the floor, no text,
no logos, character reference sheet, 3:4 portrait orientation, full
body visible head to toe.

In the style of Studio Ghibli, hand-painted anime illustration with
painterly brushwork, soft warm volumetric lighting, gentle dramatic
atmosphere, clean linework, cinematic composition.
```

### 5) Mage

```
I NEED EXACTLY THIS, DO NOT REWRITE: Full-body anime illustration of a
young mage, tall pointed dark blue wizard hat with a single embroidered
silver star, flowing dark blue and silver-trimmed robes that widen
toward the bottom, holding a wooden staff in the right hand topped with
a softly glowing violet crystal orb, faint wisps of magical mist
swirling around the feet, gentle but powerful confident expression,
centered character on a plain white background, no shadow on the floor,
no text, no logos, character reference sheet, 3:4 portrait orientation,
full body visible head to toe.

In the style of Studio Ghibli, hand-painted anime illustration with
painterly brushwork, soft warm volumetric lighting, gentle dramatic
atmosphere, clean linework, cinematic composition.
```

### 6) Paladin

```
I NEED EXACTLY THIS, DO NOT REWRITE: Full-body anime illustration of a
noble paladin in ornate silver plate armor with a gold cross emblem on
the chestplate, helmet with a vertical golden crest, holding a long
ornate sword pointed up to the sky in a heroic two-handed stance, white
flowing cape behind, divine warm light catching the gold trim and
edges of the armor, calm righteous expression visible through the
visor slit, centered character on a plain white background, no shadow
on the floor, no text, no logos, character reference sheet, 3:4
portrait orientation, full body visible head to toe.

In the style of Studio Ghibli, hand-painted anime illustration with
painterly brushwork, soft warm volumetric lighting, gentle dramatic
atmosphere, clean linework, cinematic composition.
```

---

## ARENA BACKGROUND'LARI (5 sahne, 1792×1024 — landscape)

Karakter olmayacak, geniş peyzaj. DALL-E "no people / no characters" yazsan da bazen ekliyor — eklerse o varyantı atla.

### 1) Sunlit Glade — `forest.svg`

```
I NEED EXACTLY THIS, DO NOT REWRITE: A peaceful grassy clearing on a
hilltop, lush green deep forest framing both edges of the scene,
fluffy white cumulus clouds drifting in a clear blue sky, soft midday
sunlight casting warm rays through gaps in the trees, distant rolling
green mountains hazed by sun and atmosphere, scattered wildflowers in
the foreground grass, no people, no characters, no animals, empty
peaceful landscape, 16:9 cinematic landscape composition.

In the style of Studio Ghibli, hand-painted anime landscape painting,
painterly cloud brushwork, soft volumetric light, gentle warm
atmosphere, environmental concept art.
```

### 2) Twilight Peaks — `peaks.svg`

```
I NEED EXACTLY THIS, DO NOT REWRITE: A dramatic snow-capped mountain
range at sunset, layered horizon of deep blue sky on top transitioning
into burning orange and gold near the horizon, amber sun touching the
distant peaks, distant rocky cliffs in dark blue silhouette, cool
painterly clouds streaked across the sky, foreground rocky plateau in
cool blue shadow, no people, no characters, no animals, empty epic
landscape, 16:9 cinematic landscape composition.

In the style of Studio Ghibli, hand-painted anime landscape painting,
painterly cloud brushwork, soft volumetric light, gentle dramatic
atmosphere, environmental concept art.
```

### 3) Moonlit Grove — `grove.svg`

```
I NEED EXACTLY THIS, DO NOT REWRITE: A quiet enchanted forest at night,
a luminous full moon high in a deep purple and indigo sky scattered
with tiny stars, dozens of glowing soft yellow fireflies floating
between dark tree silhouettes, soft moonlight pooling on a mossy
clearing in the center, atmospheric magical mist drifting low across
the ground, no people, no characters, no animals, empty mysterious
landscape, 16:9 cinematic landscape composition.

In the style of Studio Ghibli, hand-painted anime landscape painting,
painterly cloud brushwork, soft volumetric light, gentle dreamlike
atmosphere, environmental concept art.
```

### 4) Storm Coast — `storm.svg`

```
I NEED EXACTLY THIS, DO NOT REWRITE: A rocky coastline under a heavy
ocean storm, churning grey-blue sea with whitecaps in the middle
distance, low dark heavy clouds covering the sky, a single bright
jagged lightning bolt cracking down through the sky, sheets of rain
falling diagonally in the middle distance, dramatic painterly lighting,
foreground wet dark stone, no people, no characters, no animals, empty
brooding landscape, 16:9 cinematic landscape composition.

In the style of Studio Ghibli, hand-painted anime landscape painting,
painterly cloud brushwork, dramatic volumetric light through the
clouds, brooding atmosphere, environmental concept art.
```

### 5) Old Colosseum — `colosseum.svg`

```
I NEED EXACTLY THIS, DO NOT REWRITE: An ancient ruined arena at golden
hour, weathered cracked stone columns flanking the foreground left and
right, distant tiered ringed colosseum structure in the background, a
pale orange and gold warm sky with thin painterly clouds, drifting
sand and dust on the arena floor, distant ruined city silhouettes far
on the horizon, no people, no characters, no animals, empty solemn
landscape, 16:9 cinematic landscape composition.

In the style of Studio Ghibli, hand-painted anime landscape painting,
painterly cloud brushwork, golden hour volumetric light, solemn
historical atmosphere, environmental concept art.
```

---

## Üretim akışı (10-15 dk)

1. **ChatGPT Plus aç → yeni sohbet**
2. İlk Soldier prompt'unu yapıştır → 4 varyant gelir, en stil-tutarlı olanı seç
3. **Aynı sohbette** Brute prompt'u → karşılaştır, "match the previous painting style" eklemeden de DALL-E referans alır ama stil kayarsa bunu ekle
4. Sırayla diğer 4 hero'yu üret
5. Yeni sohbet aç → 5 arena'yı sırayla üret (peyzaj farklı medium, ayrı sohbet daha iyi tutarlılık)
6. İndirilen 11 PNG'yi `apps/web/public/heroes/` ve `apps/web/public/arenas/` altına koy
7. Hero'lar için: her birini [remove.bg](https://www.remove.bg) → şeffaf PNG indir
8. **Yeniden adlandır** (DALL-E URL'leri uzun): `soldier.png`, `brute.png` … `forest.png`, `peaks.png` …
9. `apps/web/src/lib/assets.ts`'i aç, `.svg` → `.png` değiştir:
   ```ts
   export const HERO_ART: Record<HeroId, string> = {
     soldier: "/heroes/soldier.png",
     brute: "/heroes/brute.png",
     archer: "/heroes/archer.png",
     rogue: "/heroes/rogue.png",
     mage: "/heroes/mage.png",
     paladin: "/heroes/paladin.png"
   };
   export const ARENAS = [
     "/arenas/forest.png",
     "/arenas/peaks.png",
     "/arenas/grove.png",
     "/arenas/storm.png",
     "/arenas/colosseum.png"
   ] as const;
   ```
10. `pnpm dev:web` → arenalar ve sprite'lar otomatik gelir

## Optimizasyon (önemli — yoksa ilk yükleme yavaş olur)

DALL-E'nin direkt indirdiği PNG'ler 1-3 MB olabiliyor. Web için bunlar **çok büyük**.

```bash
# Sıkıştırma (homebrew ile)
brew install imagemagick webp

# Heroes: 512x896 WebP, kalite 85 → ~50-90 KB
cd apps/web/public/heroes
for f in *.png; do
  cwebp -q 85 -resize 512 0 "$f" -o "${f%.png}.webp"
done

# Arenas: 1600x900 WebP, kalite 85 → ~100-200 KB
cd ../arenas
for f in *.png; do
  cwebp -q 85 -resize 1600 0 "$f" -o "${f%.png}.webp"
done
```

Sonra `assets.ts`'de `.png` → `.webp` değiştir.

## Stil uyumlu kalmazsa

Eğer hero'lar stil olarak dağılırsa (mesela 3'ü pixel-art, 3'ü realistik gelir), şu cümleyi 2., 3., 4. … prompt'lara ekle:

```
The painting style and color palette must exactly match the previously
generated character painting in this conversation. Same brushwork, same
lighting, same proportions, same line weight.
```

## Nihai not

Bu prompt'lar **bir başlangıç**. İlk neslin %30'u kullanılabilir olacak. 4-6 deneme normal. Bütçen sıkıysa Bing Image Creator (ücretsiz) yeterli — sadece yavaş.
