# Baal ma

Site d'excuses en format story (React + Vite) : on appuie à droite pour avancer, à gauche pour revenir.

## Scènes
1. Écran verrouillé (balayer vers le haut)
2. Messages qui s'écrivent tout seuls
3. Cahier Seyès : couverture de la rédaction
4. I. Les preuves : souvenirs dessinés au stylo
5. II. Le kintsugi : repasser les fissures au feutre doré
6. III. Conclusion : « on fait la paix ? », cases à cocher, signature au doigt

## Modifier les textes
- Messages : `src/scenes/Chat.jsx` (tableau `MSGS`)
- Couverture : `src/scenes/Cover.jsx`
- Souvenirs : `src/scenes/Souvenirs.jsx` (tableau `items`)
- Kintsugi : `src/scenes/Kintsugi.jsx` (`intro`, `CRACKS`)
- Conclusion : `src/scenes/Conclusion.jsx`

## Lancer et déployer
```
npm install
npm run dev
npm run build        # dossier dist/
```
Cloudflare Pages : build command `npm run build`, output directory `dist`.
