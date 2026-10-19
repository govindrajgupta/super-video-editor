import { Audio } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Interactive, interpolate, staticFile, Track, useCurrentFrame } from "remotion";
import { EditorialPosterLook } from "../../library/looks/EditorialPoster";
import {
  CtaCard,
  HeroCutout,
  PhoneMockup,
  SelectionBox,
  TimelineStream,
  timeSegments,
  WordReveal,
} from "../../library/techniques/Editorial";
import timeline from "./data/timeline.json";

// Built from lesson 03 (editorial poster). Every scene is one voiceover line, cut hard on its start.
// Timing comes from data/timeline.json (tools/timeline.py builds it from the voiceover).
const LEAD_IN = timeline.scenes[0].voAt - timeline.scenes[0].from;
const lineFrames = timeline.scenes.map((s) => s.voFrames);
const sceneFrames = timeline.scenes.map((s) => s.durationInFrames);
const sceneStarts = timeline.scenes.map((s) => s.from);

const Premium: React.FC = () => (
  <EditorialPosterLook seed="s1">
    {/* The bust photo is cut flat at the chest: keep that edge below the frame. */}
    <HeroCutout src="library/people/david-bust.png" height={1150} left={170} bottom={-60} />
    <SelectionBox at={8} x={240} y={880} width={620} height={760} />
    <WordReveal
      style={{ left: 0, right: 0, top: 230 }}
      segments={timeSegments(LEAD_IN, lineFrames[0], [
        { text: "you know what makes", style: "lead" },
        { text: "A REEL", style: "key" },
        { text: "feel premium?", style: "script" },
      ])}
    />
  </EditorialPosterLook>
);

const Timeline: React.FC = () => (
  <EditorialPosterLook seed="s2">
    <TimelineStream at={10} x={640} y={1180} />
    <HeroCutout src="library/objects/retro-tv.png" height={760} left={300} bottom={420} cloud={false} />
    <WordReveal
      style={{ left: 0, right: 0, top: 230 }}
      segments={timeSegments(LEAD_IN, lineFrames[1], [
        { text: "it's the moment an editor opens", style: "lead" },
        { text: "THE TIMELINE", style: "key" },
        { text: "and everything clicks", style: "script" },
      ])}
    />
  </EditorialPosterLook>
);

const MessyClips: React.FC = () => (
  <EditorialPosterLook seed="s3">
    <PhoneMockup at={0} src="projects/editorial-poster-demo/phone-screen.jpg" width={420} style={{ left: 200, top: 520 }} />
    <WordReveal
      style={{ left: 0, right: 0, top: 230 }}
      segments={timeSegments(LEAD_IN, lineFrames[2], [
        { text: "messy clips", style: "key" },
        { text: "suddenly start", style: "lead" },
        { text: "making sense.", style: "script" },
      ])}
    />
  </EditorialPosterLook>
);

const Flow: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <EditorialPosterLook dark seed="s4">
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 90], [1.04, 1])) }}>
        <HeroCutout src="library/people/exec-full.png" height={1500} left={230} bottom={-380} cloud={false} gray />
      </AbsoluteFill>
      <WordReveal
        dark
        style={{ left: 0, right: 0, top: 1240 }}
        segments={timeSegments(LEAD_IN, lineFrames[3], [
          { text: "and the feeling flows,", style: "lead" },
          { text: "without forcing it", style: "key" },
        ])}
      />
    </EditorialPosterLook>
  );
};

const Cta: React.FC = () => (
  <AbsoluteFill>
    <CtaCard at={LEAD_IN} lead="comment" keyword="REEL" />
    <WordReveal
      dark
      style={{ left: 0, right: 0, top: 1000 }}
      segments={[{ text: "for the project file", style: "small", at: LEAD_IN + 30 }]}
    />
  </AbsoluteFill>
);

const S1 = Interactive.create({ Component: Premium, layout: "absolute-fill" });
const S2 = Interactive.create({ Component: Timeline, layout: "absolute-fill" });
const S3 = Interactive.create({ Component: MessyClips, layout: "absolute-fill" });
const S4 = Interactive.create({ Component: Flow, layout: "absolute-fill" });
const S5 = Interactive.create({ Component: Cta, layout: "absolute-fill" });

export const EditorialPosterDemo: React.FC = () => (
  <>
    <Track name="Scenes">
      <S1 name="1 Premium" from={sceneStarts[0]} durationInFrames={sceneFrames[0]} />
      <S2 name="2 Timeline" from={sceneStarts[1]} durationInFrames={sceneFrames[1]} />
      <S3 name="3 Messy clips" from={sceneStarts[2]} durationInFrames={sceneFrames[2]} />
      <S4 name="4 Flow" from={sceneStarts[3]} durationInFrames={sceneFrames[3]} />
      <S5 name="5 Call to action" from={sceneStarts[4]} durationInFrames={sceneFrames[4]} />
    </Track>
    <Track name="Voiceover">
      <Audio name="VO 1" src={staticFile("projects/editorial-poster-demo/vo-1.wav")} from={sceneStarts[0] + LEAD_IN} volume={0.8} />
      <Audio name="VO 2" src={staticFile("projects/editorial-poster-demo/vo-2.wav")} from={sceneStarts[1] + LEAD_IN} volume={0.8} />
      <Audio name="VO 3" src={staticFile("projects/editorial-poster-demo/vo-3.wav")} from={sceneStarts[2] + LEAD_IN} volume={0.8} />
      <Audio name="VO 4" src={staticFile("projects/editorial-poster-demo/vo-4.wav")} from={sceneStarts[3] + LEAD_IN} volume={0.8} />
      <Audio name="VO 5" src={staticFile("projects/editorial-poster-demo/vo-5.wav")} from={sceneStarts[4] + LEAD_IN} volume={0.8} />
    </Track>
    <>
      <Audio name="Cut 2" src={staticFile("library/sfx/whoosh-quick.wav")} from={sceneStarts[1] - 4} volume={0.25} />
      <Audio name="Cut 3" src={staticFile("library/sfx/whoosh-quick.wav")} from={sceneStarts[2] - 4} volume={0.25} />
      <Audio name="Dark chapter" src={staticFile("library/sfx/boom.wav")} from={sceneStarts[3]} volume={0.35} />
      <Audio name="CTA" src={staticFile("library/sfx/ta-dum.wav")} from={sceneStarts[4]} volume={0.3} />
    </>
    <Audio name="Music" src={staticFile("projects/editorial-poster-demo/music.wav")} volume={0.18} />
  </>
);
