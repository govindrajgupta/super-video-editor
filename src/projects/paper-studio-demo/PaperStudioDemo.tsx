import { Audio } from "@remotion/media";
import type React from "react";
import { Img, Interactive, staticFile, Track, useVideoConfig } from "remotion";
import { condensed, grotesk, hand } from "../../library/engine/fonts";
import { PAPER, PaperStudioLook } from "../../library/looks/PaperStudio";
import { DropIn, OrbitRings, PopOutCard, PortalWindow, TileGrid } from "../../library/techniques/Objects";
import { BlockWipe, Whip, ZoomReveal } from "../../library/techniques/Transitions";
import { GlowWord, KineticSlam, NeonWrite, ReflectedWord, Tilt3D, WordBuild } from "../../library/techniques/Typography";
import timeline from "./data/timeline.json";

// Built from lesson 02 (paper studio). Music-driven, a new idea every 1.5-3 seconds,
// every change a whip or a wipe.
const S = timeline.scenes;

const impact: React.CSSProperties = { fontFamily: condensed, color: PAPER.red, lineHeight: 0.9, letterSpacing: 1 };
const line: React.CSSProperties = { fontFamily: grotesk, fontWeight: 800, color: PAPER.ink, letterSpacing: -1.5 };
const center: React.CSSProperties = { left: 0, right: 0, textAlign: "center" };

const Floor: React.FC<{ readonly top?: number }> = ({ top = 1400 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top,
      bottom: 0,
      backgroundColor: PAPER.green,
      boxShadow: "0 -2px 0 rgba(255,255,255,0.25), inset 0 40px 80px rgba(0,0,0,0.25)",
    }}
  />
);

/** Scene wrapper: whips in from below and out to the top, like the reference. */
const Whipped: React.FC<{ readonly children: React.ReactNode; readonly dark?: boolean; readonly enter?: boolean }> = ({
  children,
  dark,
  enter = true,
}) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <PaperStudioLook dark={dark}>
      <Whip direction="up" inAt={enter ? 0 : undefined} outAt={durationInFrames - 8}>
        {children}
      </Whip>
    </PaperStudioLook>
  );
};

const EverWonder: React.FC = () => (
  <Whipped enter={false}>
    <OrbitRings at={2} size={300} style={{ left: 540, top: 980 }}>
      <Img src={staticFile("library/objects/brain.png")} style={{ width: 300 }} />
    </OrbitRings>
    <WordBuild text="EVER WONDER?" at={6} gap={6} style={{ ...impact, ...center, top: 520, fontSize: 190 }} />
  </Whipped>
);

const SomeReels: React.FC = () => (
  <Whipped>
    <TileGrid
      at={2}
      tile={330}
      style={{ left: 175, top: 380 }}
      labelStyle={{ fontFamily: grotesk, fontWeight: 800, fontSize: 34, color: "#ffffff", letterSpacing: 4 }}
      items={[
        { src: "library/objects/polaroid-camera.png", label: "SHOOT" },
        { src: "library/objects/headphones.png", label: "SOUND" },
        { src: "library/objects/clapperboard.png", label: "CUT" },
        { src: "library/objects/smartphone.png", label: "SHARE" },
      ]}
    />
    <WordBuild text="SOME REELS" at={12} gap={5} style={{ ...impact, ...center, top: 1230, fontSize: 210 }} />
  </Whipped>
);

const Stick: React.FC = () => (
  <Whipped>
    <Tilt3D at={14} frames={30} from={[0, 0]} to={[14, -24]}>
      <div style={{ position: "absolute", ...center, top: 700 }}>
        <div style={{ ...line, fontSize: 110 }}>Stick in</div>
        <div style={{ ...line, fontSize: 120, color: PAPER.green }}>your head?</div>
      </div>
      <Img
        src={staticFile("library/objects/brain.png")}
        style={{ position: "absolute", left: 360, top: 980, width: 360, filter: "drop-shadow(20px 30px 24px rgba(0,0,0,0.3))" }}
      />
    </Tilt3D>
  </Whipped>
);

const Magic: React.FC = () => (
  <Whipped dark>
    <WordBuild text="it's not" at={4} style={{ ...line, ...center, color: "#ffffff", top: 760, fontSize: 96 }} />
    <GlowWord at={14} style={{ ...center, top: 860 }}>
      Magic
    </GlowWord>
  </Whipped>
);

const Neon: React.FC = () => (
  <Whipped dark>
    <div
      style={{
        ...impact,
        position: "absolute",
        ...center,
        top: 700,
        fontSize: 170,
        color: "#ff2d3d",
        textShadow: "0 0 24px rgba(255,45,61,0.8)",
      }}
    >
      MOTION
    </div>
    <NeonWrite at={6} frames={26} text="Design" fontFamily={hand} fontSize={210} width={1080} height={260} style={{ left: 0, top: 850 }} />
  </Whipped>
);

const TvReveal: React.FC = () => {
  // The TV cut-out is 404x648; its screen spans about x 12-72% and y 6-33%.
  const tvH = 760;
  const tvW = (tvH * 404) / 648;
  const tvLeft = (1080 - tvW) / 2;
  const tvTop = 1460 - tvH * 0.92;
  return (
    <PaperStudioLook>
      <ZoomReveal at={0} frames={18} from={4.2} focus={`540px ${tvTop + tvH * 0.2}px`}>
        <Floor top={1300} />
        <Img
          src={staticFile("library/objects/retro-tv.png")}
          style={{ position: "absolute", left: tvLeft, top: tvTop, height: tvH, filter: "drop-shadow(30px 40px 30px rgba(0,0,0,0.35))" }}
        />
        <div
          style={{
            position: "absolute",
            left: tvLeft + tvW * 0.13,
            top: tvTop + tvH * 0.07,
            width: tvW * 0.58,
            height: tvH * 0.25,
            borderRadius: 18,
            backgroundColor: "#f3efe6",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 26,
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ ...line, fontSize: 46, lineHeight: 1 }}>Motion</div>
          <div style={{ ...line, fontSize: 62, lineHeight: 1, color: PAPER.red }}>Design</div>
        </div>
      </ZoomReveal>
      <BlockWipe at={50} />
    </PaperStudioLook>
  );
};

const Kinetic: React.FC = () => (
  <Whipped enter={false}>
    <KineticSlam
      at={4}
      style={{ ...center, top: 760 }}
      top={<div style={{ fontFamily: condensed, fontSize: 230, color: PAPER.green, lineHeight: 0.9 }}>KINETIC</div>}
      bottom={<div style={{ fontFamily: hand, fontWeight: 500, fontSize: 170, color: PAPER.ink, lineHeight: 0.9 }}>text</div>}
    />
  </Whipped>
);

const Attention: React.FC = () => (
  <Whipped>
    <PopOutCard at={2} width={560} height={560} style={{ left: 300, top: 560 }} object={{ src: "library/objects/eyeball.png", left: -170, top: 120, width: 330 }}>
      <div style={{ ...line, fontSize: 92, color: PAPER.red, lineHeight: 1 }}>grabs</div>
      <div style={{ fontFamily: hand, fontWeight: 500, fontSize: 100, color: "#ffffff", lineHeight: 0.9 }}>attention</div>
    </PopOutCard>
    <WordBuild text="in two seconds" at={30} gap={7} style={{ ...line, ...center, top: 1250, fontSize: 84 }} />
  </Whipped>
);

const Portal: React.FC = () => (
  <Whipped>
    <div style={{ position: "absolute", ...center, top: 250 }}>
      <div style={{ ...line, fontSize: 150, color: PAPER.green, lineHeight: 0.95 }}>Visual</div>
      <div style={{ ...line, fontSize: 70, lineHeight: 1 }}>metaphors</div>
    </div>
    <PortalWindow at={6} width={560} height={800} style={{ left: 260, top: 560 }}>
      <Img src={staticFile("library/places/jellyfish-dark.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </PortalWindow>
    <WordBuild
      text="explain big ideas"
      at={30}
      gap={6}
      style={{ ...line, ...center, top: 1420, fontSize: 64, color: PAPER.red }}
    />
  </Whipped>
);

const Word: React.FC = () => (
  <Whipped>
    <WordBuild text="without a single" at={2} gap={5} style={{ ...line, ...center, top: 700, fontSize: 70 }} />
    <ReflectedWord at={14} style={{ ...center, top: 790 }}>
      <div style={{ ...impact, fontSize: 360 }}>WORD</div>
    </ReflectedWord>
  </Whipped>
);

/** Lesson 02 rule: a near-empty beat before the payoff, so the payoff lands by contrast. */
const ItsNot: React.FC = () => (
  <PaperStudioLook>
    <WordBuild text="it's not" at={2} gap={5} style={{ ...line, ...center, top: 900, fontSize: 92 }} />
  </PaperStudioLook>
);

const Strategy: React.FC = () => (
  <PaperStudioLook>
    <Whip direction="left" inAt={0}>
      <Floor top={1420} />
      <WordBuild text="it's strategy" at={6} gap={6} style={{ ...line, left: 110, top: 760, fontSize: 92 }} />
      <WordBuild
        text="that moves."
        at={18}
        gap={6}
        style={{ ...line, left: 110, top: 870, fontSize: 116, color: PAPER.red }}
      />
      <DropIn at={22} src="library/objects/chess-queen.png" width={300} left={640} floorY={1480} />
    </Whip>
  </PaperStudioLook>
);

const s = (C: React.FC) => Interactive.create({ Component: C, layout: "absolute-fill" });
const Scenes = [EverWonder, SomeReels, Stick, Magic, Neon, TvReveal, Kinetic, Attention, Portal, Word, ItsNot, Strategy].map(s);

export const PaperStudioDemo: React.FC = () => {
  const [A, B, C, D, E, F, G, H, I, J, K, L] = Scenes;
  return (
    <>
      <Track name="Scenes">
        <A name={S[0].id} from={S[0].from} durationInFrames={S[0].durationInFrames} />
        <B name={S[1].id} from={S[1].from} durationInFrames={S[1].durationInFrames} />
        <C name={S[2].id} from={S[2].from} durationInFrames={S[2].durationInFrames} />
        <D name={S[3].id} from={S[3].from} durationInFrames={S[3].durationInFrames} />
        <E name={S[4].id} from={S[4].from} durationInFrames={S[4].durationInFrames} />
        <F name={S[5].id} from={S[5].from} durationInFrames={S[5].durationInFrames} />
        <G name={S[6].id} from={S[6].from} durationInFrames={S[6].durationInFrames} />
        <H name={S[7].id} from={S[7].from} durationInFrames={S[7].durationInFrames} />
        <I name={S[8].id} from={S[8].from} durationInFrames={S[8].durationInFrames} />
        <J name={S[9].id} from={S[9].from} durationInFrames={S[9].durationInFrames} />
        <K name={S[10].id} from={S[10].from} durationInFrames={S[10].durationInFrames} />
        <L name={S[11].id} from={S[11].from} durationInFrames={S[11].durationInFrames} />
      </Track>
      <>
        <Audio name="Whip 1" src={staticFile("library/sfx/whoosh-quick.wav")} from={S[1].from - 6} volume={0.3} />
        <Audio name="Tiles pop" src={staticFile("library/sfx/pop.wav")} from={S[1].from + 2} volume={0.35} />
        <Audio name="Whip 2" src={staticFile("library/sfx/whoosh-quick.wav")} from={S[2].from - 6} volume={0.3} />
        <Audio name="Whip 3" src={staticFile("library/sfx/whoosh-quick.wav")} from={S[3].from - 6} volume={0.3} />
        <Audio name="Magic" src={staticFile("library/sfx/neon-buzz.wav")} from={S[3].from + 12} volume={0.2} />
        <Audio name="Neon write" src={staticFile("library/sfx/scribble.wav")} from={S[4].from + 8} volume={0.35} />
        <Audio name="TV reveal" src={staticFile("library/sfx/whoosh-long.wav")} from={S[5].from - 10} volume={0.4} />
        <Audio name="Block wipe" src={staticFile("library/sfx/whoosh-entrance.wav")} from={S[5].from + 48} volume={0.35} />
        <Audio name="Slam" src={staticFile("library/sfx/boom.wav")} from={S[6].from + 4} volume={0.35} />
        <Audio name="Whip 4" src={staticFile("library/sfx/whoosh-quick.wav")} from={S[7].from - 6} volume={0.3} />
        <Audio name="Eye pop" src={staticFile("library/sfx/pop.wav")} from={S[7].from + 10} volume={0.4} />
        <Audio name="Whip 5" src={staticFile("library/sfx/whoosh-quick.wav")} from={S[8].from - 6} volume={0.3} />
        <Audio name="Whip 6" src={staticFile("library/sfx/whoosh-quick.wav")} from={S[9].from - 6} volume={0.3} />
        <Audio name="Whip 7" src={staticFile("library/sfx/whoosh-quick.wav")} from={S[11].from - 6} volume={0.3} />
        <Audio name="Queen lands" src={staticFile("library/sfx/paper-slap.wav")} from={S[11].from + 30} volume={0.5} />
      </>
      <Audio name="Music" src={staticFile("projects/paper-studio-demo/music.wav")} volume={0.5} />
    </>
  );
};
