# Use Case card thumbnails

Drop the thumbnail images here. The homepage Use Cases grid
(`components/sections/UseCases.tsx`) renders each card's `image` from
`lib/data.ts` via `next/image`. If a file is missing, the card falls back to a
generated visual — so add these whenever ready, no code change needed.

## Required files (16:9, min 1200×675, PNG or WebP)

| File            | Use case                     |
|-----------------|------------------------------|
| `legal.png`     | AI for Legal Documents       |
| `research.png`  | AI for Research              |
| `sales.png`     | AI for Sales                 |
| `marketing.png` | AI for Marketing             |
| `healthcare.png`| AI for Healthcare            |
| `business.png`  | AI for Small & Medium Business |
| `hr.png`        | AI for HR Documents          |
| `real-estate.png` | AI for Real Estate         |
| `insurance.png` | AI for Insurance             |
| `banking.png`   | AI for Banking               |
| `operations.png`| AI for Business Operations   |

## Notes

- Filenames must match `image:` paths in `lib/data.ts` exactly.
- `.webp` is fine — just update the extension in `lib/data.ts` to match.
- Cards crop to a 16:9 box with `object-fit: cover`; keep key content centered.
- Aim for dark-theme visuals with the brand blues (#2563EB / #3B82F6 / #60A5FA).
