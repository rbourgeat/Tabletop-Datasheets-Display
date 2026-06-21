# Tabletop Datasheets Display

Browser-based unit datasheet viewer for Warhammer 40,000 (10th / 9th / 2nd edition) and Age of Sigmar (4th edition). Two themes: cyberpunk 40K and heraldic fantasy.

## Sources

Unit data is fetched from the public [Battlescribe](https://battlescribedata.appspot.com/) repository maintained by the community:

| Game | Version | Repository |
|------|---------|-----------|
| Warhammer 40,000 | v10 | [BSData/wh40k-10e](https://github.com/BSData/wh40k-10e) |
| Warhammer 40,000 | v9  | [BSData/wh40k-9e](https://github.com/BSData/wh40k-9e) |
| Warhammer 40,000 | v2  | [BSData/wh40k-2nd-edition](https://github.com/BSData/wh40k-2nd-edition) |
| Age of Sigmar | 4th | [BSData/age-of-sigmar-4th](https://github.com/BSData/age-of-sigmar-4th) |

Data is cached locally in the browser for performance. No data is sent to any server.

## Usage

Open `index.html` in a browser (GitHub Pages or any static host). Select a game, then a version, then a catalogue from the dropdown to view units.

URL parameters (`?game=wh40k&ver=v10&cat=...) persist your selection across page reloads.
