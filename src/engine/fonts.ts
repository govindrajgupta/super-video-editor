import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadArchivoBlack } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadOldStandard } from "@remotion/google-fonts/OldStandardTT";

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
