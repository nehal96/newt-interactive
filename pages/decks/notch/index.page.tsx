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
  title: "Notch — an intelligent tracker for functional fitness",
  description:
    "Add your workout by photograph, screenshot or typing, put in your result and notes, and Notch uses both to track your progress: a new PR, scaling progressions, volume calculations.",
  url: "https://www.newtinteractive.com/decks/notch",
};

const Wordmark = () => (
  <span className="wordmark">
    <span className="n">n</span>
    <span className="otch">otch</span>
  </span>
);

const DIAGRAM_ALT =
  "On the left, a whiteboard workout — 10 minute AMRAP, 5 power snatch at 105/155, 10 toes to bar — and the result logged under it: 6 rounds, 0 reps, with the note 95 lbs, knees to chest. On the right, what Notch derives. The structured workout carries the type, each movement, its reps and its loads by gender. The structured result carries the score, and for each movement the scaling type, the weight used, the scaling percentage and the volume: power snatch scaled by weight reduction to 95 lbs, 61.3 percent, 30 reps of volume; toes to bar substituted with knees to chest, 60 reps of volume.";

/* Parser-blocking where it sits, so the palette is resolved before the deck
   below it paints. Every theme rule keys off the attribute it sets. */
const THEME_BOOTSTRAP = `try{document.documentElement.dataset.notchTheme=localStorage.getItem("notch-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}`;

const SunIcon = () => (
  <svg
    className="when-dark"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.2M12 19.3v2.2M4.4 4.4l1.5 1.5M18.1 18.1l1.5 1.5M2.5 12h2.2M19.3 12h2.2M4.4 19.6l1.5-1.5M18.1 5.9l1.5-1.5" />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="when-light"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.6 14.7A8.7 8.7 0 0 1 9.3 3.4a8.7 8.7 0 1 0 11.3 11.3Z" />
  </svg>
);

const ThemeToggle = () => (
  <div className="topbar">
    <div className="wrap">
      <button
        type="button"
        className="theme-toggle"
        aria-label="Switch between light and dark mode"
        onClick={() => {
          const root = document.documentElement;
          const next = root.dataset.notchTheme === "dark" ? "light" : "dark";
          root.dataset.notchTheme = next;
          try {
            localStorage.setItem("notch-theme", next);
          } catch (e) {}
        }}
      >
        <SunIcon />
        <MoonIcon />
      </button>
    </div>
  </div>
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
        {/* The canvas past the deck's own box. Must equal --bg in
            notch.module.css, or the overscroll gutter shows a band. */}
        {/* Unquoted attribute value on purpose: next/head serialises this text
            as HTML, so quotes come back as &quot; and the selector never
            matches. */}
        <style key="notch-canvas">{`
          html { background: #ffffff; }
          html[data-notch-theme=dark] { background: #000832; }
        `}</style>
      </Head>

      <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />

      <div
        className={`${styles.deck} ${emblema.variable} ${racing.variable} ${mono.variable}`}
      >
        <ThemeToggle />

        <section className="hero">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <h1>
                  <Wordmark />
                </h1>
                <p className="hero-tag">
                  The intelligent tracker for functional fitness workouts.
                </p>
                <p className="hero-sub">
                  Add your workout &mdash; photograph it, screenshot it, or type
                  it out. Put in your result and your notes. Notch uses{" "}
                  <em>both</em> to track your progress: a new PR, scaling
                  progressions, volume calculations.
                </p>
                <div className="disciplines">
                  <span className="plat">iOS</span>
                  <span className="sep" aria-hidden="true" />
                  <span>CrossFit</span>
                  <span>Hyrox</span>
                  <span>Olympic Lifting</span>
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
                <dt>Movements</dt>
                <dd>153, mapped by progression</dd>
              </div>
              <div>
                <dt>Benchmarks</dt>
                <dd>20+ Girls and Heroes, plus the Open</dd>
              </div>
              <div>
                <dt>Records</dt>
                <dd>11 kinds, detected automatically</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="sunk">
          <div className="wrap wide">
            <p className="label">Why I built it</p>
            <p className="lede">
              After every workout I&rsquo;d put my score and notes into Wodify.
              It works fine for the gym &mdash; membership, scheduling, payments
              &mdash; but not for the athlete. Over time I felt it wasn&rsquo;t
              really tracking my progress at all.
            </p>
            <p className="lede">
              There&rsquo;s a reason no app does. A regular gym workout is easy:
              3 sets of 10 shoulder press, 3 sets of 12 lat pull-downs. CrossFit
              has AMRAPs, metcons and intervals, Rx and scaled, a lot of
              complicated movements, and scaling that can mean a lighter weight
              or a different movement altogether. It&rsquo;s a nightmare to
              track conventionally, so everyone settles for a score box and
              notes. Athletes end up with a rough sense of their progress and
              nowhere they can actually check it.
            </p>
            <p className="lede">
              And athletes put a lot into those notes &mdash; it just sits there
              unused. What if you read it? If you turned every workout, every
              result and every note into structured data, you could measure
              scaling progressions, volume, all the increments nobody could
              measure before. And then build on it. Turns out, a lot.
            </p>
          </div>
        </section>

        <section>
          <div className="wrap">
            <p className="label">How it works</p>

            <p className="lede">
              How workout notes get converted into structured progress data.
            </p>

            <figure className="diagram">
              <img
                className="when-light"
                src="/decks/notch/diagram.webp"
                width={1600}
                height={1030}
                alt={DIAGRAM_ALT}
              />
              <img
                className="when-dark"
                src="/decks/notch/diagram-dark.webp"
                width={1600}
                height={1030}
                alt={DIAGRAM_ALT}
              />
            </figure>

            <p className="lede">
              Getting this information enables a lot of cool features, like per
              workout insights and volume statistics.
            </p>

            <div className="show">
              <div className="show-copy">
                <span className="show-index">01 &mdash; Capture</span>
                <h3>
                  Add workouts{" "}
                  <span className="racing">seamlessly</span>.
                </h3>
                <p>
                  Point the camera at the whiteboard, screenshot the programming
                  your gym posted, or type it out yourself. Notch pulls out the
                  sections, the movements, the reps, the weights for men and
                  women and the time cap, and fills them in for you.
                </p>
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
                <span className="show-index">02 &mdash; Results</span>
                <h3>
                  Put in your scores and notes, and get instant{" "}
                  <span className="racing">insights</span>.
                </h3>
                <p>
                  Keep writing notes like you always did. But this time, Notch will work out what it means and track it for you.
                </p>
                <p>
                It can record if you scaled some movement
                &mdash; used a lighter weight, a band, fewer reps, changed the movement. It can also calculate how far you got, whether that's part-way through a chipper, a
                  part-finished round in a ladder, total reps across an AMRAP,
                  your share of a partner workout. If you type &ldquo;85x3, 95x2, then
                  105x5&rdquo; it will understand that 105 is your working set, and the
                  first two were warmups.
                </p>
                <p>It can also compare your performance to before, so you can even see progress within scaled workouts, like using a heavier weight than last time, or finishing faster.</p>
              </div>
              <div className="show-media">
                <PhoneMock
                  src="/decks/notch/scaling.webp"
                  label="A result showing Clean and Jerk scaled from Rx 135/95"
                />
              </div>
            </div>

            <div className="show">
              <div className="show-copy">
                <span className="show-index">03 &mdash; Goals and PRs</span>
                <h3>
                  Set a goal, and every result after it counts{" "}
                  <span className="racing">toward</span> it.
                </h3>
                <p>
                  There are two types of goals: learning a movement and hitting a weight target. Whichever you pick, everytime it shows up in a workout, you'll see your progress, automatically.
                </p>
                <p>
                  You never type a record in. Notch finds them: one-rep max
                  through twenty-rep max, most reps, fastest time, longest
                  distance, most calories &mdash; eleven kinds.
                </p>
                <p>
                  Tap a movement anywhere in the app and you see every time you
                  have done it. See your progress in beautiful stats and charts.
                </p>
              </div>
              <div className="show-media">
                <PhoneMock
                  src="/decks/notch/records.mp4"
                  poster="/decks/notch/records.webp"
                  label="Clean and jerk history, charted with a goal projection"
                />
              </div>
            </div>

            <div className="show flip">
              <div className="show-copy">
                <span className="show-index">04 &mdash; Stats</span>
                <h3>
                  Count <span className="racing">every</span> rep you've done.
                </h3>
                <p>
                  See how many reps of each movement you have done in the last thirty
                  days, the last ninety, or ever. See which ones you scaled and which you did as prescribed.
                </p>
                <p>At the end of the year, get a Wrapped, showing you everything you did, in one place.</p>
              </div>
              <div className="show-media">
                <PhoneMock
                  src="/decks/notch/volume.webp"
                  label="Volume by movement over thirty days, Rx beside scaled"
                />
              </div>
            </div>

            <div className="show open-show">
              <div className="show-copy">
                <span className="show-index">
                  05 &mdash; Benchmarks and the Open
                </span>
                <h3>
                  Special workouts get the <span className="racing">special</span> treatment.
                </h3>
                <p>
                  Benchmarks are automatically detected and tracked as your gym does them, so you can see your progress in one place.
                </p>
                <p>
                  The Open looks different in the app. Three weeks a year everyone
                  does the same workout, so each week gets its own custom design.
                </p>
                <p>
                  When you finish, photograph your scorecard. Notch reads your
                  score off it and, because it already knows 26.1 is a
                  twelve-minute workout of three hundred and fifty-four reps, it
                  saves your score as an Rx or Scaled attempt at that workout
                  rather than a number on its own.
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
              <div className="show-media">
                <PhoneMock
                  src="/decks/notch/open.webp"
                  label="Open 26.1 laid out as a chipper, Rx beside Scaled"
                />
              </div>
            </div>

            <div className="show">
              <div className="show-copy">
                <span className="show-index">06 &mdash; Lift analysis</span>
                <h3>
                  Film a lift. Get an analysis.
                </h3>
                <p>
                  Record a snatch or a clean and Notch gives it back with
                  seventeen points on your body tracked in every frame, drawn as
                  a skeleton over your own video. You can step through it frame
                  by frame to look at the catch.
                </p>
              </div>
              <div className="show-media">
                <PhoneMock
                  src="/decks/notch/lift.mp4"
                  poster="/decks/notch/lift.webp"
                  label="A hang power snatch replayed under a pose skeleton"
                />
              </div>
            </div>

            <div className="show flip">
              <div className="show-copy">
                <span className="show-index">
                  07 &mdash; The daily surface
                </span>
                <h3>
                  Everything summarized in a <span className="racing">beautiful</span> home screen.
                </h3>
                <p>
                  A row of the week with your training days filled in, a streak
                  counted in weeks, and a sentence telling you what you have done since
                  Monday. All your progress easily visible and accessible. Makes you want to keep going, doesn't it?
                </p>
              </div>
              <div className="show-media">
                <PhoneMock
                  src="/decks/notch/home.webp"
                  label="The home screen: streak, this week, today and habits"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="sunk">
          <div className="wrap">
            <p className="label">Where it could go</p>
            <h2>
              Alongside your gym&rsquo;s app, more social, every kind of{" "}
              <span className="racing">training</span>.
            </h2>
            <p className="lede" style={{ margin: "26px 0 40px" }}>
              Three directions I'm interested in.
            </p>
            <div className="notes">
              <div className="note">
                <h4>Alongside the software you already run</h4>
                <p>
                  Notch reads the day&rsquo;s programming out of Wodify or
                  SugarWOD, so nothing changes for your staff, and Notch only
                  tracks the part those apps can&rsquo;t: how each member
                  actually scaled, movement by movement.
                </p>
              </div>
              <div className="note">
                <h4>The social layer</h4>
                <p>
                  The moments Notch already detects &mdash; a PR, a first Rx, a
                  benchmark falling &mdash; are exactly what members post to the
                  gym group chat themselves. There is an obvious version of this
                  with training partners and a gym feed. The question is what
                  should be visible and what stays private.
                </p>
              </div>
              <div className="note">
                <h4>One history for everything</h4>
                <p>
                  Nobody only does CrossFit. They run, they lift, they take a
                  Hyrox block, and their training history ends up scattered
                  across four apps. Notch was built from the start to hold all of
                  it in one place.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap wide">
            <p className="label">What I&rsquo;m building</p>
            <p className="lede">
              I wanted Notch to be beautiful, sleek, intuitive and powerful,
              focused on the athlete and on the functional fitness community.
            </p>
            <p className="lede">
              I understand there&rsquo;s often an aversion to AI in fitness.
              There are plenty of haughty claims about apps replacing coaches or
              nutritionists, or both. I&rsquo;m not building that. AI is a tool,
              and used correctly it can augment the role of coaches. I believe in
              the community aspect too &mdash; it&rsquo;s a crucial part of what
              makes functional fitness so great. Everything here is designed to
              help the athlete <i>track{" "}</i> what they&rsquo;re already doing, not
              to give them coaching tips.
            </p>
          </div>
        </section>

        <footer>
          <div className="wrap">
            <div className="foot">
              <Wordmark />
              <span className="foot-m">
                An intelligent tracker for functional fitness
              </span>
              <span className="foot-m">By Nehal Udyavar</span>
              <span className="foot-m">
                <a href="mailto:nehaludyavar@gmail.com">Get in touch</a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
