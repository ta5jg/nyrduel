# Nyrduel Art — Midjourney Prompt Set

Drop generated PNGs (transparent background) into `apps/web/public/heroes/<id>.png` and update `apps/web/src/lib/assets.ts` to point at `.png` instead of `.svg`. Same for arenas under `public/arenas/`.

Style anchor: **Studio Ghibli + painterly anime + soft warm lighting**. Keep all six heroes in the same aesthetic world so they read as one cast.

## Master style suffix (append to every hero prompt)

```
:: anime painterly style, Studio Ghibli inspired, hand-painted textures,
soft rim light, dramatic but warm color palette, full body, isolated on
fully transparent background, centered figure, 3:4 portrait, character
art reference sheet, no shadow ground, no text, no logos
--style raw --v 6 --ar 3:4
```

## Hero prompts (6 portraits)

**Soldier** — Balanced frontline. Reliable.
```
A young human soldier, short dark hair, simple steel breastplate over a
linen tunic, holding a basic kite shield in left hand and a straight
sword pointed down in right, calm grounded stance, weathered leather
boots, neutral confident expression
```

**Brute** — Heavy bruiser. Hits late, lasts long.
```
A massive bare-chested brawler, broad shoulders, hunched posture, thick
forearms wrapped in leather strips, bald with a scarred face, holding a
spiked wooden club resting on shoulder, grim determined look, simple
trousers and worn boots
```

**Archer** — Fast crit-leaning sniper. Glassy.
```
A lean ranger archer, hooded green cloak with leaf accents, drawing a
recurve bow with one arrow nocked, focused eyes peering forward, light
leather armor, quiver across back, agile grounded stance, forest scout
energy
```

**Rogue** — Glass cannon with vicious crits.
```
A nimble rogue assassin, black hooded cloak casting deep face shadow,
two glinting daggers held in reverse grip, crouched ready posture, dark
leather armor with silver buckles, partial bandana over lower face,
golden eyes catching the light
```

**Mage** — Hard hitter. One mistake away from dust.
```
A young mage, tall pointed dark blue hat with a single star, flowing
robes with silver trim, holding a wooden staff topped with a glowing
violet crystal orb, faint wisps of magical mist around feet, gentle but
powerful aura
```

**Paladin** — Self-anchored. Even tempo, hard to break.
```
A noble paladin in ornate plate armor with a gold cross emblem on chest,
helmet with a vertical golden crest, holding a longsword pointed up to
the sky in a heroic stance, white cape fluttering, divine warm light
catching the gold trim
```

## Arena prompts (5 backgrounds, 16:9)

Append to each arena prompt:
```
:: Studio Ghibli landscape painting, painterly clouds, soft volumetric
light, no characters, no people, environmental concept art, 16:9
cinematic --style raw --v 6 --ar 16:9
```

**Sunlit Glade** (`forest.svg`)
```
A peaceful grassy clearing on a hilltop, lush green forest framing the
edges, fluffy white cumulus clouds drifting in a clear blue sky, soft
midday sunlight, distant green mountains hazed in sun, wildflowers in
foreground
```

**Twilight Peaks** (`peaks.svg`)
```
Snow-capped mountain range at sunset, layered blue and orange sky,
amber sun touching the horizon, distant rocky cliffs in silhouette,
cool dramatic painted clouds, foreground rocky plateau in shadow
```

**Moonlit Grove** (`grove.svg`)
```
A quiet enchanted forest at night, full moon high in a deep purple sky
with scattered stars, glowing fireflies floating between dark tree
silhouettes, soft moonlight pooling on a mossy clearing, magical and
peaceful atmosphere
```

**Storm Coast** (`storm.svg`)
```
A rocky coastline under a heavy storm, churning grey sea, low dark
clouds, single jagged lightning bolt cracking through the sky, rain
sheeting in the middle distance, dramatic painterly lighting
```

**Old Colosseum** (`colosseum.svg`)
```
An ancient ruined arena at golden hour, weathered stone columns
flanking the foreground, distant tiered ringed structure, pale orange
warm sky, drifting sand on the floor, distant ruined city silhouettes
```

## Production tips

- Generate each hero **at least 4 times**; pick the variation that best matches the others' style. Style consistency across the cast is more important than any single hero looking great.
- Use `/describe` on a Ghibli still you love to capture the painterly tags Midjourney responds to (`hand-painted`, `cel-shaded`, `studio ghibli`), then mix into the master suffix.
- For transparent background, run final picks through `remove.bg` if Midjourney leaves white. SDXL with a good "white background, isolated" prompt also works.
- Keep file sizes under ~80 KB each by exporting WebP at quality 85. Heroes should be square 512×512; arenas 1600×900.
- Once dropped in, update `apps/web/src/lib/assets.ts`:
  ```ts
  export const HERO_ART: Record<HeroId, string> = {
    soldier: "/heroes/soldier.webp",
    // ... etc
  };
  ```

## Stretch — animation pack

If you want richer motion later (post-v0.1):

- **Idle bob** — 2-frame loop, 1 KB GIF/APNG. Trivial CSS could do this from a single sprite by `transform: translateY()` cycle.
- **Attack pose** — 1 alternate sprite per hero ("attacking" version). Swap on `acting` state. ~30 min code change.
- **Hit pose** — flash overlay + alternate sprite. Optional.

The current code already animates via `acting`/`hit`/`crit-hit` classes — extra sprites slot in trivially when ready.
