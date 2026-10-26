// Generates the three decorative Lottie animations used on the site.
// Run with: node scripts/make-lottie.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const out = resolve("public/lottie");
mkdirSync(out, { recursive: true });

const LIME = [0.847, 1, 0.4, 1];
const TEAL = [0.208, 0.878, 0.961, 1];
const VIOLET = [0.486, 0.361, 1, 1];

const stat = (k) => ({ a: 0, k });
const anim = (keys) => ({ a: 1, k: keys });
const ease = { i: { x: [0.33], y: [1] }, o: { x: [0.66], y: [0] } };

const transform = (extra = {}) => ({
  ty: "tr",
  p: stat([0, 0]),
  a: stat([0, 0]),
  s: stat([100, 100]),
  r: stat(0),
  o: stat(100),
  sk: stat(0),
  sa: stat(0),
  nm: "transform",
  ...extra,
});

const ellipse = (size, pos = [0, 0]) => ({
  ty: "el",
  d: 1,
  s: stat([size, size]),
  p: stat(pos),
  nm: "ellipse",
});

const rect = (size, pos = [0, 0], radius = 7) => ({
  ty: "rc",
  d: 1,
  s: stat(size),
  p: stat(pos),
  r: stat(radius),
  nm: "rect",
});

const stroke = (color, width = 2) => ({
  ty: "st",
  c: stat(color),
  o: stat(100),
  w: stat(width),
  lc: 2,
  lj: 2,
  ml: 4,
  bm: 0,
  nm: "stroke",
});

const fill = (color) => ({
  ty: "fl",
  c: stat(color),
  o: stat(100),
  r: 1,
  bm: 0,
  nm: "fill",
});

const shapeLayer = ({ ind, name, shapes, ks, ip = 0, op }) => ({
  ddd: 0,
  ind,
  ty: 4,
  nm: name,
  sr: 1,
  ks,
  ao: 0,
  shapes,
  ip,
  op,
  st: 0,
  bm: 0,
});

const baseKs = (position = [0, 0]) => ({
  o: stat(100),
  r: stat(0),
  p: stat([position[0], position[1], 0]),
  a: stat([0, 0, 0]),
  s: stat([100, 100, 100]),
});

const document = ({ name, w, h, op, fr = 30, layers }) => ({
  v: "5.13.0",
  fr,
  ip: 0,
  op,
  w,
  h,
  nm: name,
  ddd: 0,
  assets: [],
  layers,
  markers: [],
});

/* ------------------------------------------------------------------ orbit */
// A thin ring with three dots orbiting it — used in the About profile card.
const orbit = document({
  name: "orbit",
  w: 240,
  h: 240,
  op: 150,
  layers: [
    shapeLayer({
      ind: 1,
      name: "ring",
      op: 150,
      ks: baseKs([120, 120]),
      shapes: [
        {
          ty: "gr",
          nm: "ringGroup",
          it: [
            ellipse(148),
            stroke(LIME, 1.4),
            transform(),
          ],
        },
      ],
    }),
    shapeLayer({
      ind: 2,
      name: "dots",
      op: 150,
      ks: {
        ...baseKs([120, 120]),
        r: anim([
          { t: 0, s: [0], ...ease },
          { t: 150, s: [360] },
        ]),
      },
      shapes: [
        {
          ty: "gr",
          nm: "dotTop",
          it: [ellipse(11, [0, -74]), fill(LIME), transform()],
        },
        {
          ty: "gr",
          nm: "dotRight",
          it: [ellipse(8, [64, 37]), fill(TEAL), transform()],
        },
        {
          ty: "gr",
          nm: "dotLeft",
          it: [ellipse(6, [-64, 37]), fill(VIOLET), transform()],
        },
      ],
    }),
    shapeLayer({
      ind: 3,
      name: "core",
      op: 150,
      ks: {
        ...baseKs([120, 120]),
        s: anim([
          { t: 0, s: [92, 92, 100], ...ease },
          { t: 75, s: [108, 108, 100], ...ease },
          { t: 150, s: [92, 92, 100] },
        ]),
      },
      shapes: [
        {
          ty: "gr",
          nm: "coreGroup",
          it: [ellipse(22), fill(LIME), transform({ o: stat(22) })],
        },
      ],
    }),
  ],
});

/* ------------------------------------------------------------------ pulse */
// Three staggered rings expanding outward — used in Contact.
const rippleRing = (ind, delay, color) =>
  shapeLayer({
    ind,
    name: `ripple-${ind}`,
    op: 140,
    ks: {
      ...baseKs([120, 120]),
      s: anim([
        { t: 0, s: [60, 60, 100] },
        { t: delay, s: [60, 60, 100], ...ease },
        { t: delay + 84, s: [158, 158, 100] },
      ]),
      o: anim([
        { t: 0, s: [0] },
        { t: delay, s: [66], ...ease },
        { t: delay + 84, s: [0] },
      ]),
    },
    shapes: [
      {
        ty: "gr",
        nm: "rippleGroup",
        it: [ellipse(120), stroke(color, 1.6), transform()],
      },
    ],
  });

const pulse = document({
  name: "pulse",
  w: 240,
  h: 240,
  op: 140,
  layers: [
    rippleRing(1, 0, LIME),
    rippleRing(2, 28, TEAL),
    rippleRing(3, 56, VIOLET),
    shapeLayer({
      ind: 4,
      name: "core",
      op: 140,
      ks: baseKs([120, 120]),
      shapes: [
        {
          ty: "gr",
          nm: "coreGroup",
          it: [ellipse(10), fill(LIME), transform()],
        },
      ],
    }),
  ],
});

/* ------------------------------------------------------------------- wave */
// Five bars dancing like a quiet equaliser — used in the AI skills card.
const phase = [
  [45, 100, 62, 92, 45],
  [72, 48, 96, 60, 72],
  [58, 88, 45, 100, 58],
  [96, 62, 90, 50, 96],
  [50, 92, 70, 84, 50],
];

const bars = phase.map((values, index) =>
  shapeLayer({
    ind: index + 1,
    name: `bar-${index + 1}`,
    op: 60,
    ks: {
      ...baseKs([48 + index * 36, 96]),
      a: stat([0, 30, 0]),
      s: anim([
        { t: 0, s: [100, values[0], 100], ...ease },
        { t: 15, s: [100, values[1], 100], ...ease },
        { t: 30, s: [100, values[2], 100], ...ease },
        { t: 45, s: [100, values[3], 100], ...ease },
        { t: 60, s: [100, values[4], 100] },
      ]),
    },
    shapes: [
      {
        ty: "gr",
        nm: "barGroup",
        it: [
          rect([14, 60], [0, 0], 7),
          fill([LIME, TEAL, VIOLET, TEAL, LIME][index]),
          transform(),
        ],
      },
    ],
  }),
);

const wave = document({
  name: "wave",
  w: 240,
  h: 120,
  op: 60,
  layers: bars,
});

/* ------------------------------------------------------------------ write */
const files = { "orbit.json": orbit, "pulse.json": pulse, "wave.json": wave };

for (const [file, data] of Object.entries(files)) {
  writeFileSync(resolve(out, file), `${JSON.stringify(data)}\n`);
  console.log(`wrote public/lottie/${file}`);
}
