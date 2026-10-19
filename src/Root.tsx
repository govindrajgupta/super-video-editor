import { Composition, Folder } from "remotion";
import { EditorialPosterDemo } from "./projects/editorial-poster-demo/EditorialPosterDemo";
import editorialTimeline from "./projects/editorial-poster-demo/data/timeline.json";
import { NetflixReel } from "./projects/netflix-vs-blockbuster/NetflixReel";
import { PaperStudioDemo } from "./projects/paper-studio-demo/PaperStudioDemo";
import paperTimeline from "./projects/paper-studio-demo/data/timeline.json";
import { Scene1Opener } from "./projects/netflix-vs-blockbuster/scenes/Scene1Opener";
import { Scene2Rejection } from "./projects/netflix-vs-blockbuster/scenes/Scene2Rejection";
import { Scene3Opposite } from "./projects/netflix-vs-blockbuster/scenes/Scene3Opposite";
import { Scene4Fall } from "./projects/netflix-vs-blockbuster/scenes/Scene4Fall";
import { Scene5Payoff } from "./projects/netflix-vs-blockbuster/scenes/Scene5Payoff";
import { Scene6No } from "./projects/netflix-vs-blockbuster/scenes/Scene6No";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NetflixReel"
        component={NetflixReel}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={1057}
      />
      <Composition
        id="PaperStudioDemo"
        component={PaperStudioDemo}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={paperTimeline.durationInFrames}
      />
      <Composition
        id="EditorialPosterDemo"
        component={EditorialPosterDemo}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={editorialTimeline.durationInFrames}
      />
      <Folder name="NetflixScenes">
        <Composition
          id="Scene1Opener"
          component={Scene1Opener}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={183}
          defaultProps={{
            plaque: "In 2000",
            line1: "a tiny startup",
            line2: "called Netflix",
            line3: "offered to sell itself",
            line4: "to Blockbuster.",
          }}
        />
        <Composition
          id="Scene2Rejection"
          component={Scene2Rejection}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={150}
          defaultProps={{
            word1: "laughed",
            word2: "them out",
            sunburst: "#a01218",
          }}
        />
        <Composition
          id="Scene3Opposite"
          component={Scene3Opposite}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={171}
          defaultProps={{
            caption: "built the opposite.",
          }}
        />
        <Composition
          id="Scene4Fall"
          component={Scene4Fall}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={195}
          defaultProps={{
            punchScale: 1.7,
            shadowSkew: -53,
            shadowOpacity: 0.55,
            bgZoom: 1.12,
            lead: "Ten years later,",
            verdict: "bankruptcy.",
          }}
        />
        <Composition
          id="Scene5Payoff"
          component={Scene5Payoff}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={228}
          defaultProps={{
            line1: "Forty five",
            line2: "billion",
            line3: "dollars a year",
            identLine1: "the biggest paid streaming",
            identLine2: "service on Earth.",
          }}
        />
        <Composition
          id="Scene6No"
          component={Scene6No}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={130}
          defaultProps={{
            punchScale: 1.7,
            line1: "The most",
            line2: "expensive",
            line3: "in history.",
          }}
        />
      </Folder>
    </>
  );
};
