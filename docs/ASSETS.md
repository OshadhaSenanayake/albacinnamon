# Asset origin and generation records

The storefront uses two original images created with the built-in image generation tool for this sample application. They are generated, photo-style illustrations, not photographs of actual Alba Cinnamon inventory or operations. No external image downloads are included, and no remote image attribution is required.

## Generated bitmap assets

| Local file | Size | Use |
| --- | --- | --- |
| `public/images/cinnamon-hero.png` | 2,471,424 bytes (approximately 2.47 MB) | Home page hero image. |
| `public/images/cinnamon-story.png` | 2,910,373 bytes (approximately 2.91 MB) | Home page story image. |

### Hero prompt

```text
Use case: photorealistic-natural. Asset type: premium cinnamon storefront hero background. Create one square editorial food photograph. A generous tactile bundle of delicate true Ceylon cinnamon quills with many thin papery rolled layers, loosely tied with natural jute string, arranged diagonally from lower left toward upper right on a deep warm charcoal brown rustic stone surface. A few loose cinnamon quills and tiny cinnamon bark flakes in the foreground. One small natural green cinnamon leaf branch entering from upper right. Warm soft directional afternoon light from upper left, chiaroscuro shadows, rich warm ochre and cinnamon browns, quietly luxurious artisan food brand mood, shallow depth of field but the main quills sharp. Close view, cinnamon takes up 65 percent of composition, sufficient dark breathing space in top and bottom corners for UI captions. Authentic fine grain, natural imperfect texture. No text, no lettering, no logos, no watermarks, no packaging, no collage, no borders. A photograph only.
```

### Story prompt

```text
Use case: photorealistic-natural. Asset type: small artisan Ceylon cinnamon storefront story section photograph. A quiet editorial close photograph of an unbranded shallow handmade clay bowl filled with warm golden brown ground cinnamon, a few thin papery true Ceylon cinnamon quills placed loosely beside it, and a small green leaf on soft naturally wrinkled beige linen, resting on a weathered warm wooden table. Calm beautiful tactile natural ingredients still life. Morning window light from left, gentle dark shadows, understated warm earthy cream terracotta sage palette, shallow depth of field, natural grain and perfectly realistic textures. Square composition, main clay bowl in upper left central area, quills angled below right. Cozy artisan pantry storytelling, unpretentious and authentic. No people, no text, no labels, no packaging, no logos, no border, no watermarks. Photograph only.
```

The prompt wording requests a photographic style; the resulting images remain generated illustrations.

## Code-based visual assets

- `src/views/components/Brand.tsx`: original wordmark and botanical SVG artwork.
- `src/views/components/Icon.tsx`: original interface SVG icons.
- `src/views/components/ProductVisual.tsx` and associated styles in `src/App.css`: original sample packaging illustrations constructed with React markup, SVG, and CSS.
- `public/favicon.svg`: original Alba branding in SVG format.

These are source-native SVG/CSS visuals, not generated bitmap images. Product packaging is illustrative rather than a representation of manufactured inventory.

## Typography

No font files are bundled and no remote font stylesheet is loaded. CSS uses the available system fonts and fallbacks, including Georgia for serif text and Segoe UI for sans-serif text when preferred named fonts are unavailable.
