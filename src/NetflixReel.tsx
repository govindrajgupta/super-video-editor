import { Audio } from "@remotion/media";
import { interpolate, staticFile, Track } from "remotion";
import voiceover from "./data/voiceover.json";
import { Scene1Opener } from "./scenes/Scene1Opener";
import { Scene2Rejection } from "./scenes/Scene2Rejection";
import { Scene3Opposite } from "./scenes/Scene3Opposite";
import { Scene4Fall } from "./scenes/Scene4Fall";
import { Scene5Payoff } from "./scenes/Scene5Payoff";
import { Scene6No } from "./scenes/Scene6No";

// Scene starts (frames). Keep in sync with src/data/timeline.json, which the music script reads.
const SCENE_STARTS = [0, 183, 333, 504, 699, 927];
const VO_DELAY = 4;
const FPS = 30;

/** The music sits low under the voice and swells in the gaps between lines. */
const musicVolume = (frame: number) => {
  const speaking = voiceover.lines.some((line, i) => {
    const start = SCENE_STARTS[i] + VO_DELAY - 4;
    const end = SCENE_STARTS[i] + VO_DELAY + line.seconds * FPS + 2;
    return frame >= start && frame <= end;
  });
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (speaking ? 0.12 : 0.32) * fadeIn;
};

export const NetflixReel: React.FC = () => {
  return (
    <>
      <Track name="Scenes">
        <Scene1Opener
          name="1 Opener"
          durationInFrames={183}
          plaque="In 2000"
          line1="a tiny startup"
          line2="called Netflix"
          line3="offered to sell itself"
          line4="to Blockbuster."
        />
        <Scene2Rejection
          name="2 Rejection"
          from={183}
          durationInFrames={150}
          word1="laughed"
          word2="them out"
          sunburst="#a01218"
        />
        <Scene3Opposite name="3 The opposite" from={333} durationInFrames={171} caption="built the opposite." />
        <Scene4Fall
          name="4 The fall"
          from={504}
          durationInFrames={195}
          punchScale={1.7}
          shadowSkew={-53}
          shadowOpacity={0.55}
          bgZoom={1.12}
          lead="Ten years later,"
          verdict="bankruptcy."
        />
        <Scene5Payoff
          name="5 Payoff"
          from={699}
          durationInFrames={228}
          line1="Forty five"
          line2="billion"
          line3="dollars a year"
          identLine1="the biggest paid streaming"
          identLine2="service on Earth."
        />
        <Scene6No
          name="6 The no"
          from={927}
          durationInFrames={130}
          punchScale={1.7}
          line1="The most"
          line2="expensive"
          line3="in history."
        />
      </Track>

      <Track name="Voiceover">
        <Audio name="VO 1" src={staticFile("audio/vo-1.wav")} from={4} volume={0.78} />
        <Audio name="VO 2" src={staticFile("audio/vo-2.wav")} from={187} volume={0.78} />
        <Audio name="VO 3" src={staticFile("audio/vo-3.wav")} from={337} volume={0.78} />
        <Audio name="VO 4" src={staticFile("audio/vo-4.wav")} from={508} volume={0.78} />
        <Audio name="VO 5" src={staticFile("audio/vo-5.wav")} from={703} volume={0.78} />
        <Audio name="VO 6" src={staticFile("audio/vo-6.wav")} from={931} volume={0.78} />
      </Track>

      {/* Sound effects overlap each other, so they can't share one Track row: each gets its own. */}
      <>
        <Audio name="Shutter" src={staticFile("audio/sfx/shutter.wav")} from={2} volume={0.5} />
        <Audio name="Zoom-through whoosh" src={staticFile("audio/sfx/whoosh-long.wav")} from={26} volume={0.55} />
        <Audio name="Logo swing" src={staticFile("audio/sfx/whoosh-quick.wav")} from={185} volume={0.35} />
        <Audio name="Cash swing" src={staticFile("audio/sfx/whoosh-quick.wav")} from={197} volume={0.35} />
        <Audio name="Slot spin" src={staticFile("audio/sfx/slot-spin.wav")} from={207} volume={0.4} />
        <Audio name="Slot stop" src={staticFile("audio/sfx/slot-stop.wav")} from={235} volume={0.45} />
        <Audio name="Boss rises" src={staticFile("audio/sfx/whoosh-entrance.wav")} from={235} volume={0.4} />
        <Audio name="Laughed pop" src={staticFile("audio/sfx/pop.wav")} from={253} volume={0.3} />
        <Audio name="Them out pop" src={staticFile("audio/sfx/pop.wav")} from={275} volume={0.3} />
        <Audio name="Glitch 1" src={staticFile("audio/sfx/glitch.wav")} from={295} volume={0.3} />
        <Audio name="Glitch 2" src={staticFile("audio/sfx/glitch.wav")} from={300} volume={0.3} />
        <Audio name="Glitch 3" src={staticFile("audio/sfx/glitch.wav")} from={304} volume={0.3} />
        <Audio name="Red-eye boom" src={staticFile("audio/sfx/boom.wav")} from={307} volume={0.55} />
        <Audio name="Focus hunt desk" src={staticFile("audio/sfx/focus-hunt.wav")} from={333} volume={0.3} />
        <Audio name="Paper 1 in" src={staticFile("audio/sfx/whoosh-quick.wav")} from={391} volume={0.3} />
        <Audio name="Paper 1 lands" src={staticFile("audio/sfx/paper-slap.wav")} from={405} volume={0.5} />
        <Audio name="Paper 2 in" src={staticFile("audio/sfx/whoosh-quick.wav")} from={419} volume={0.3} />
        <Audio name="Paper 2 lands" src={staticFile("audio/sfx/paper-slap.wav")} from={433} volume={0.5} />
        <Audio name="Paper 3 in" src={staticFile("audio/sfx/whoosh-quick.wav")} from={453} volume={0.3} />
        <Audio name="Paper 3 lands" src={staticFile("audio/sfx/paper-slap.wav")} from={467} volume={0.5} />
        <Audio name="Punch in" src={staticFile("audio/sfx/whoosh-entrance.wav")} from={504} volume={0.35} />
        <Audio name="Step aside" src={staticFile("audio/sfx/whoosh-quick.wav")} from={630} volume={0.35} />
        <Audio name="Underline" src={staticFile("audio/sfx/scribble.wav")} from={645} volume={0.35} />
        <Audio name="Focus hunt study" src={staticFile("audio/sfx/focus-hunt.wav")} from={699} volume={0.3} />
        <Audio name="Lamp buzz" src={staticFile("audio/sfx/neon-buzz.wav")} from={705} volume={0.25} />
        <Audio name="Cha-ching" src={staticFile("audio/sfx/cha-ching.wav")} from={765} volume={0.45} />
        <Audio name="Pencil oval" src={staticFile("audio/sfx/scribble.wav")} from={783} volume={0.3} />
        <Audio name="Ta-dum" src={staticFile("audio/sfx/ta-dum.wav")} from={845} volume={0.55} />
        <Audio name="Finger in" src={staticFile("audio/sfx/whoosh-quick.wav")} from={965} volume={0.35} />
        <Audio name="In history pop" src={staticFile("audio/sfx/pop.wav")} from={993} volume={0.3} />
      </>

      <Audio name="Music" src={staticFile("audio/music.wav")} volume={musicVolume} />
    </>
  );
};
