import Head from "next/head";
import { Emblema_One, IBM_Plex_Mono, Racing_Sans_One } from "next/font/google";
import PhoneMock from "./PhoneMock";
import styles from "./notch.module.css";

/* Notch's own faces, loaded here rather than in lib/fonts.ts: _app imports
   that module, so anything added to it ships on every route of the site. */
const emblema = Emblema_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-notch-emblema",
  preload: false,
});

const racing = Racing_Sans_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-notch-racing",
  preload: false,
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-notch-mono",
  preload: false,
});

const metadata = {
  title: "Notch — an intelligent tracker for Functional Fitness workouts",
  description:
    "A product and engineering showcase for Notch: whiteboard capture, per-movement scaling intelligence, automatic personal records and pose-estimated lift analysis.",
  url: "https://www.newtinteractive.com/decks/notch",
};

const Wordmark = () => (
  <span className="wordmark">
    <span className="n">n</span>
    <span className="otch">otch</span>
  </span>
);

export default function NotchDeck() {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Unlisted: no catalogue row, so nothing on the site links here. */}
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={metadata.url} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div
        className={`${styles.deck} ${emblema.variable} ${racing.variable} ${mono.variable}`}
      >
        <section className="hero">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <h1>
                  <Wordmark />
                </h1>
                <p className="hero-tag">
                  An intelligent tracker for Functional Fitness workouts.
                </p>
                <p className="hero-sub">
                  It reads your gym&rsquo;s whiteboard, understands how you
                  actually scaled the workout from a sentence you&rsquo;d type
                  anyway, and tells you what changed since last time.
                </p>
                <div className="disciplines">
                  <div>CrossFit</div>
                  <div>Hyrox</div>
                  <div>Olympic Lifting</div>
                </div>
              </div>

              <div className="show-media">
                <PhoneMock
                  src="/decks/notch/hero.mp4"
                  poster="/decks/notch/hero.webp"
                  label="Notch onboarding walkthrough"
                />
              </div>
            </div>

            <dl className="spec">
              <div>
                <dt>Platform</dt>
                <dd>iOS, React Native</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>1.24.0</dd>
              </div>
              <div>
                <dt>Distribution</dt>
                <dd>TestFlight</dd>
              </div>
              <div>
                <dt>Codebase</dt>
                <dd>93,000 lines</dd>
              </div>
              <div>
                <dt>Built by</dt>
                <dd>One engineer</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>13 months</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="sunk">
          <div className="wrap">
            <p className="label">The gap</p>
            <h2>
              Every fitness app is a logbook. None of them understand the{" "}
              <span className="racing">log</span>.
            </h2>
            <p className="lede" style={{ marginTop: 26 }}>
              Athletes scale workouts constantly, with a lighter bar, a band on
              the pull-up, a box instead of the rings. That is the entire story
              of getting better, and every existing tracker throws it away,
              storing one flat Rx-or-Scaled flag and a number.
            </p>
            <p className="lede">
              So the questions that actually matter go unanswered. Am I scaling
              less than I was? Was that my heaviest ever? Is this the first time
              I did it as written? Notch answers exactly those, automatically.
            </p>

            <div className="thesis" style={{ marginTop: 52 }}>
              <div className="board">
                <div className="board-h">Friday, Metcon</div>
                <div className="board-t">21-15-9</div>
                <div className="board-s">For time, cap 12:00</div>
                <div className="board-l">
                  <div>
                    Thrusters <span className="w">95 lb</span>
                  </div>
                  <div>
                    Pull-ups <span className="w">&mdash;</span>
                  </div>
                </div>
                <div className="board-note">
                  <b>What you type</b>
                  &ldquo;thrusters at 65, banded pull-ups, 8:42&rdquo;
                </div>
              </div>

              <div className="readout">
                <div className="chip sc">
                  <span className="chip-k">Thrusters</span>
                  <span className="chip-v">Weight reduction</span>
                  <span className="chip-m">65 lb, 68% of prescribed</span>
                </div>
                <div className="chip sc">
                  <span className="chip-k">Pull-ups</span>
                  <span className="chip-v">Assistance</span>
                  <span className="chip-m">band</span>
                </div>
                <div className="chip rx">
                  <span className="chip-k">Insight, first Rx</span>
                  <span className="chip-v">Heaviest thrusters yet</span>
                  <span className="chip-m">up from 55 lb in March</span>
                </div>
                <div className="chip">
                  <span className="chip-k">Insight, benchmark PR</span>
                  <span className="chip-v">Fran, scaled</span>
                  <span className="chip-m">1:04 faster than your last</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <p className="label">The product</p>
            <h2 style={{ marginBottom: 8 }}>
              One decision, and everything{" "}
              <span className="racing">downstream</span> of it.
            </h2>

            <div className="act">
              <p className="label">Getting it in</p>
              <p className="lede">
                Two steps, both of them things you&rsquo;d do anyway. Point a
                camera at the board, then say how it went.
              </p>
            </div>

            <div className="show">
              <div className="show-copy">
                <span className="show-index">01 &mdash; Capture</span>
                <h3>
                  Photograph the whiteboard. Get a structured{" "}
                  <span className="racing">workout</span>.
                </h3>
                <p>
                  Point the camera at your gym&rsquo;s whiteboard, or hand it a
                  shot from your library. A vision model lifts the text off the
                  photo, then a second model parses it into real structure, with
                  sections, movements, rep schemes, prescribed loads split by
                  gender, and time caps.
                </p>
                <p>
                  The extracted text is yours to correct before anything is
                  created, and what the parse genuinely couldn&rsquo;t infer
                  comes back as a question rather than a guess.
                </p>
                <ul className="caps">
                  <li>Photo, text or gym programming as input</li>
                  <li>GPT-5-mini vision OCR, then GPT-4.1 structured parse</li>
                  <li>Extraction editable before the workout exists</li>
                  <li>Unknown movements flagged for review</li>
                </ul>
              </div>
              <div className="show-media">
                <PhoneMock
                  src="/decks/notch/capture.mp4"
                  poster="/decks/notch/capture.webp"
                  label="A whiteboard photo parsed into a structured workout"
                />
              </div>
            </div>

            <div className="show flip">
              <div className="show-copy">
                <span className="show-index">
                  02 &mdash; Scaling intelligence
                </span>
                <h3>
                  The feature nobody else <span className="racing">has</span>.
                </h3>
                <p>
                  You write how it went, in your own words. A structured
                  extraction maps that sentence onto the workout&rsquo;s actual
                  movement list and classifies each one across six kinds of
                  scaling, covering weight, assistance, substitution, range of
                  motion, reps and height, with a confidence score attached to
                  every call.
                </p>
                <p>
                  The output isn&rsquo;t a paragraph of text. It&rsquo;s typed,
                  per-movement, queryable data, and that&rsquo;s what makes
                  every other feature here possible.
                </p>
                <ul className="caps">
                  <li>Six scaling types, classified per movement</li>
                  <li>Confidence scored, and correctable by you</li>
                  <li>Feeds PRs, goals, stats and insights</li>
                </ul>
              </div>
              <div className="show-media">
                <PhoneMock
                  src="/decks/notch/scaling.webp"
                  label="A result showing Clean and Jerk scaled from Rx 135/95"
                />
              </div>
            </div>

            <div className="act">
              <p className="label">What that unlocks</p>
              <p className="lede">
                Everything below reads the same typed rows. None of it is
                possible while scaling is a boolean.
              </p>
            </div>

            <div className="show">
              <div className="show-copy">
                <span className="show-index">03 &mdash; Insights</span>
                <h3>
                  The <span className="racing">so what</span>, right after you
                  log.
                </h3>
                <p>
                  Every result runs through a detection pipeline that surfaces
                  five kinds of insight, computed server-side the moment you
                  save, so the payoff lands while you&rsquo;re still standing in
                  the gym.
                </p>
                <ul className="caps">
                  <li>A new personal record</li>
                  <li>A benchmark PR, compared within its own variant</li>
                  <li>Movement toward a goal you set</li>
                  <li>
                    The first time you&rsquo;ve done something fully as
                    prescribed
                  </li>
                  <li>A plain-language summary of how you scaled</li>
                </ul>
              </div>
              <div className="show-media">
                <PhoneMock label={"Result modal\ninsights landing"} />
              </div>
            </div>

            <div className="show flip">
              <div className="show-copy">
                <span className="show-index">04 &mdash; Volume</span>
                <h3>
                  Every rep you&rsquo;ve done, split by how you{" "}
                  <span className="racing">did</span> it.
                </h3>
                <p>
                  Volume by movement over thirty days, ninety, or all time, with
                  the Rx count and the scaled count carried separately. Two
                  hundred and sixty single-unders, every one of them scaled, is
                  a different fact from sixty-two front squats, every one of
                  them as prescribed, and the two never collapse into a single
                  number.
                </p>
                <ul className="caps">
                  <li>Thirty day, ninety day and all-time windows</li>
                  <li>Rx and scaled counted apart, never merged</li>
                  <li>Any movement drills into its own history</li>
                </ul>
              </div>
              <div className="show-media">
                <PhoneMock label={"Stats\nvolume by movement"} />
              </div>
            </div>

            <div className="show">
              <div className="show-copy">
                <span className="show-index">05 &mdash; Records and goals</span>
                <h3>
                  Eleven kinds of personal{" "}
                  <span className="racing">record</span>, tracked without being
                  asked.
                </h3>
                <p>
                  One-rep max through twenty-rep max, max reps, fastest time,
                  longest distance, most calories. PRs are detected from
                  ordinary logged results rather than a separate ritual, and
                  every number is computed on the server from a dedicated
                  movement-history table, so the figure on the home screen and
                  the profile can never disagree.
                </p>
                <p>
                  Every movement opens onto its own history, where each rep
                  max is a separate series, the goal you set is projected onto
                  the same axes, and multi-rep lifts can be re-read as estimated
                  one-rep maxes to make years of mixed training comparable.
                </p>
                <p>
                  A goal is set against a movement and drawn onto that same
                  chart. Each one caches the movements related to its target, so
                  work on a progression counts toward the thing you&rsquo;re
                  chasing and banded pull-ups move a strict pull-up goal.
                </p>
                <ul className="caps">
                  <li>Eleven PR types detected automatically</li>
                  <li>Every rep max charted as its own series</li>
                  <li>Goals projected onto the movement&rsquo;s own axes</li>
                  <li>Multi-rep lifts convertible to an estimated 1RM</li>
                  <li>Backed by a movement relationship graph</li>
                </ul>
              </div>
              <div className="show-media">
                <PhoneMock
                  src="/decks/notch/records.mp4"
                  poster="/decks/notch/records.webp"
                  label="Clean and jerk history, charted with a goal projection"
                />
              </div>
            </div>

            <div className="bench">
              <span className="show-index">
                06 &mdash; Benchmarks and the Open
              </span>
              <h3>
                Fran, Murph and the <span className="racing">Open</span>, as
                first-class objects.
              </h3>
              <p>
                A scaled Fran is only meaningful next to other scaled Frans, so
                every named benchmark carries a canonical definition and its
                variants are scored apart from one another. That comparison is
                the same typed scaling data, pointed at a workout the whole
                sport already agrees on.
              </p>
              <dl className="stack">
                <dt>Library</dt>
                <dd>
                  <ul>
                    <li>
                      <b>Twenty-plus</b> Girls and Heroes
                    </li>
                    <li>Open 26.1 through 26.3</li>
                  </ul>
                </dd>

                <dt>Variants</dt>
                <dd>
                  <ul>
                    <li>Rx</li>
                    <li>Scaled</li>
                    <li>Foundations</li>
                    <li>Compared only within variant</li>
                  </ul>
                </dd>

                <dt>Definitions</dt>
                <dd>
                  <ul>
                    <li>Exact movements and rep schemes</li>
                    <li>Loads by gender</li>
                    <li>Tiebreak checkpoints</li>
                    <li>Time caps</li>
                  </ul>
                </dd>
              </dl>
            </div>

            <div className="act">
              <p className="label">Beyond the loop</p>
              <p className="lede">
                Two things that sit outside the logging cycle altogether.
              </p>
            </div>

            <div className="show flip">
              <div className="show-copy">
                <span className="show-index">07 &mdash; Lift analysis</span>
                <h3>
                  Film a lift. Watch the{" "}
                  <span className="racing">skeleton</span> move.
                </h3>
                <p>
                  Record a snatch or a clean and the video goes to a GPU worker
                  running MoveNet, which returns seventeen body keypoints for
                  every frame at ten frames a second. The app plays it back as a
                  skeleton overlaid on your video, with a scrubbable filmstrip
                  for picking apart the catch position.
                </p>
                <p>
                  Because the GPU is serverless it costs a few cents per
                  analysis and nothing at all when nobody is lifting.
                </p>
                <ul className="caps">
                  <li>MoveNet Lightning on a serverless T4 GPU</li>
                  <li>Seventeen keypoints at ten frames per second</li>
                  <li>Skeleton overlay rendered with Skia</li>
                  <li>Scrubbable filmstrip playback</li>
                </ul>
              </div>
              <div className="show-media">
                <PhoneMock
                  src="/decks/notch/lift.mp4"
                  poster="/decks/notch/lift.webp"
                  label="A hang power snatch replayed under a pose skeleton"
                />
              </div>
            </div>

            <div className="show">
              <div className="show-copy">
                <span className="show-index">
                  08 &mdash; The daily surface
                </span>
                <h3>
                  What you actually <span className="racing">open</span> the app
                  to.
                </h3>
                <p>
                  A week strip with your training days filled in, a streak
                  counted in weeks rather than days because that is how training
                  actually goes, and a plain-language line telling you what
                  you&rsquo;ve done since Monday, assembled from the same
                  movement history everything else reads.
                </p>
                <p>
                  Below it, the last thing you logged, whatever is on today,
                  including the Open while it&rsquo;s running, and the habits
                  you&rsquo;re keeping. The calendar underneath is gesture-driven
                  and written from scratch: swipe between weeks, pull to expand
                  to a month.
                </p>
                <ul className="caps">
                  <li>Weekly summary composed from movement history</li>
                  <li>Creatine and protein against daily targets</li>
                  <li>Custom swipeable calendar</li>
                  <li>Three.js avatar through expo-gl</li>
                </ul>
              </div>
              <div className="show-media">
                <PhoneMock label={"Home\nstreak, today and habits"} />
              </div>
            </div>
          </div>
        </section>

        <section className="sunk">
          <div className="wrap">
            <p className="label">Under the hood</p>
            <h2>
              How it&rsquo;s put <span className="racing">together</span>.
            </h2>
            <p className="lede" style={{ margin: "26px 0 40px" }}>
              Two repositories, four runtimes. The client is deliberately thin,
              rendering and collecting input. Every number a user sees is
              computed on the server, so there is exactly one place a statistic
              can be wrong.
            </p>

            <div className="arch">
              <div className="tier">
                <div className="tier-h">Client, iOS</div>
                <div className="tier-row">
                  <span className="node hi">React Native 0.81</span>
                  <span className="node">Expo SDK 54</span>
                  <span className="node">Expo Router</span>
                  <span className="node">New Architecture</span>
                  <span className="node">Reanimated 4</span>
                  <span className="node">Skia</span>
                  <span className="node">Three.js</span>
                  <span className="node">HeroUI Native</span>
                </div>
                <p className="tier-note">
                  Eleven React context providers own all server state, keeping
                  screens presentational.
                </p>
              </div>

              <div className="flow">REST over HTTPS, bearer auth</div>

              <div className="tier">
                <div className="tier-h">API, Railway</div>
                <div className="tier-row">
                  <span className="node hi">Express</span>
                  <span className="node">TypeScript</span>
                  <span className="node">Prisma 7</span>
                  <span className="node">Zod</span>
                  <span className="node">Pino</span>
                  <span className="node">Rate limiting</span>
                  <span className="node">Jest</span>
                </div>
                <p className="tier-note">
                  Config-as-code deploys. Migrations and an idempotent seed run
                  automatically on every push.
                </p>
              </div>

              <div className="flow">Data and inference</div>

              <div className="tier">
                <div className="tier-h">Persistence and models</div>
                <div className="tier-row">
                  <span className="node hi">Postgres on Supabase</span>
                  <span className="node">Supabase Auth</span>
                  <span className="node">Supabase Storage</span>
                  <span className="node hi">Modal T4 GPU</span>
                  <span className="node">OpenAI</span>
                </div>
                <p className="tier-note">
                  Twenty-four models across forty-five migrations. Pose
                  inference is a separate Python service that scales to zero.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <p className="label">Decisions worth defending</p>
            <h2 style={{ marginBottom: 36 }}>
              Problems that took real <span className="racing">thought</span>.
            </h2>
            <div className="notes">
              <div className="note">
                <h4>Making a language model produce data, not prose</h4>
                <p>
                  Scaling extraction can&rsquo;t return a paragraph, because
                  downstream features need to filter and aggregate it. The model
                  is constrained to a typed schema, handed the workout&rsquo;s
                  real movement list, forbidden from inventing identifiers, and
                  every extraction carries a confidence level so weak calls
                  surface for correction instead of being trusted blindly.
                </p>
              </div>
              <div className="note">
                <h4>One source of truth for every number</h4>
                <p>
                  PRs, stats and goal progress are all computed server-side
                  against a dedicated movement-history table. Earlier versions
                  calculated them on the client and the same figure disagreed
                  across three screens. Moving it to the server made that class
                  of bug impossible rather than merely fixed.
                </p>
              </div>
              <div className="note">
                <h4>Migrations that deadlock on a connection pooler</h4>
                <p>
                  Prisma migrations hang against Supabase&rsquo;s transaction
                  pooler. The deploy pipeline overrides the connection string to
                  session mode for the migrate and seed steps, then hands back
                  to the pooler for serving traffic.
                </p>
              </div>
              <div className="note">
                <h4>Backfills that can&rsquo;t quietly wreck production</h4>
                <p>
                  Twenty-odd data-migration scripts back the schema&rsquo;s
                  evolution. Any script pointed at production defaults to a dry
                  run and refuses to write without an explicit force flag, so
                  the safe path is the one you get by accident.
                </p>
              </div>
              <div className="note">
                <h4>Never blocking on the network</h4>
                <p>
                  Parsing a workout photo and analysing a lift both take real
                  seconds. Both run through a background task context with
                  staged progress, so you can navigate away mid-upload and
                  collect the result when it lands.
                </p>
              </div>
              <div className="note">
                <h4>A movement vocabulary that stays clean</h4>
                <p>
                  A hundred and fifty-three movements, normalised to snake case,
                  grouped into families and progressions, with a relationship
                  graph that lets a goal understand which other movements count
                  toward it. Anything unrecognised becomes a review alert rather
                  than a new row.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="sunk">
          <div className="wrap">
            <p className="label">Stack</p>
            <h2 style={{ marginBottom: 36 }}>
              Everything in the <span className="racing">build</span>.
            </h2>
            <dl className="stack">
              <dt>Mobile</dt>
              <dd>
                <ul>
                  <li>
                    <b>React Native 0.81</b>
                  </li>
                  <li>
                    <b>Expo SDK 54</b>
                  </li>
                  <li>New Architecture</li>
                  <li>Expo Router</li>
                  <li>TypeScript</li>
                  <li>Reanimated 4</li>
                  <li>Gesture Handler</li>
                  <li>Skia</li>
                  <li>React Three Fiber</li>
                  <li>Victory Native</li>
                  <li>HeroUI Native</li>
                  <li>Tailwind via Uniwind</li>
                </ul>
              </dd>

              <dt>Backend</dt>
              <dd>
                <ul>
                  <li>
                    <b>Node</b>
                  </li>
                  <li>
                    <b>Express</b>
                  </li>
                  <li>TypeScript</li>
                  <li>Prisma 7</li>
                  <li>PostgreSQL</li>
                  <li>Zod</li>
                  <li>Pino</li>
                  <li>Jest</li>
                </ul>
              </dd>

              <dt>AI and ML</dt>
              <dd>
                <ul>
                  <li>
                    <b>GPT-4.1</b> workout parsing
                  </li>
                  <li>
                    <b>GPT-5-mini</b> scaling extraction and OCR
                  </li>
                  <li>
                    <b>MoveNet Lightning</b> pose estimation
                  </li>
                  <li>TensorFlow</li>
                </ul>
              </dd>

              <dt>Infrastructure</dt>
              <dd>
                <ul>
                  <li>
                    <b>Railway</b> API hosting
                  </li>
                  <li>
                    <b>Supabase</b> Postgres, auth and storage
                  </li>
                  <li>
                    <b>Modal</b> serverless GPU
                  </li>
                  <li>
                    <b>EAS</b> builds and App Store submission
                  </li>
                </ul>
              </dd>

              <dt>Platform</dt>
              <dd>
                <ul>
                  <li>iOS</li>
                  <li>Sign in with Apple</li>
                  <li>Push and local notifications</li>
                  <li>Typed file-based routing</li>
                </ul>
              </dd>
            </dl>
          </div>
        </section>

        <section>
          <div className="wrap">
            <p className="label">Where it stands</p>
            <h2 style={{ marginBottom: 36 }}>
              Shipped and <span className="racing">running</span>.
            </h2>
            <div className="status">
              <div className="card">
                <div className="card-k">Application</div>
                <div className="card-v">Version 1.24.0 on TestFlight</div>
                <div className="card-s">
                  Distributed through EAS with automatic App Store submission.
                </div>
              </div>
              <div className="card">
                <div className="card-k">API</div>
                <div className="card-v">
                  <span className="dot live" />
                  Live on Railway
                </div>
                <div className="card-s">
                  Health-checked and rate-limited, with migrations on every
                  deploy.
                </div>
              </div>
              <div className="card">
                <div className="card-k">Database</div>
                <div className="card-v">
                  <span className="dot live" />
                  Postgres on Supabase
                </div>
                <div className="card-s">
                  Twenty-four models, seeded with the movement and benchmark
                  library.
                </div>
              </div>
              <div className="card">
                <div className="card-k">Next</div>
                <div className="card-v">Gym platform integration</div>
                <div className="card-s">
                  Pulling daily programming from Wodify and SugarWOD to remove
                  manual entry.
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <div className="wrap">
            <div className="foot">
              <Wordmark />
              <span>
                An intelligent tracker for Functional Fitness workouts
              </span>
              <span>Designed, built and deployed solo</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
