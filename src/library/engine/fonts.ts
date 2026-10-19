import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadArchivoBlack } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadGreatVibes } from "@remotion/google-fonts/GreatVibes";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadOldStandard } from "@remotion/google-fonts/OldStandardTT";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

// Condensed bold caps for impact words (paper-studio look).
export const condensed = loadBebasNeue("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

// Clean grotesk for supporting lines.
export const grotesk = loadInter("normal", { weights: ["500", "700", "800"], subsets: ["latin"] }).fontFamily;

// Handwritten monoline script for the emotional word.
export const hand = loadCaveat("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;

// Calligraphy, used once per video for a "magic" word.
export const calligraphy = loadGreatVibes("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

// Heavy rounded sans for key phrases (editorial-poster look).
export const rounded = loadPoppins("normal", { weights: ["500", "600", "800", "900"], subsets: ["latin"] }).fontFamily;

// Serif italic captions, the documentary voice of the reel.
export const serif = loadInstrumentSerif("italic", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;

// Condensed display type for headlines and the slot-machine counter.
export const display = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;

// Newspaper mastheads.
export const masthead = loadOldStandard("normal", {
  weights: ["700"],
  subsets: ["latin"],
}).fontFamily;

// Heavy sans for the marigold caption boxes.
export const heavy = loadArchivoBlack("normal", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;
