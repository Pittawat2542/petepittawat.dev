export const displayName = 'Pittawat Taveekitworachai';

export const englishIntro = 'I study how language models acquire and express behavior.';
export const thaiIntro = 'ผมศึกษาว่าโมเดลภาษาเรียนรู้และแสดงพฤติกรรมออกมาอย่างไร';

export type IntroVariant = 'en' | 'th' | 'plain';

export function getIntroVariant(intro: string): IntroVariant {
  return intro === englishIntro ? 'en' : intro === thaiIntro ? 'th' : 'plain';
}

export const orbitAspects = [
  {
    label: 'Research',
    detail: 'Behavior, reasoning, and evaluation',
    tone: 'cyan',
    style:
      '--orbit-radius: clamp(8.8rem, 20vw, 15.2rem); --orbit-start: 222deg; --orbit-end: 236deg; --orbit-start-inverse: -222deg; --orbit-end-inverse: -236deg; --orbit-duration: 7.6s; --label-x: -8%; --label-y: -116%; --twinkle-delay: 80ms; --twinkle-duration: 3.8s; --glint-delay: 340ms;',
  },
  {
    label: 'Engineering',
    detail: 'Systems, tooling, and deployment paths',
    tone: 'amber',
    style:
      '--orbit-radius: clamp(10.2rem, 24vw, 18.4rem); --orbit-start: 350deg; --orbit-end: 366deg; --orbit-start-inverse: -350deg; --orbit-end-inverse: -366deg; --orbit-duration: 8.4s; --label-x: -78%; --label-y: -116%; --twinkle-delay: 860ms; --twinkle-duration: 4.4s; --glint-delay: 1220ms;',
  },
  {
    label: 'Design',
    detail: 'Readable interfaces for complex AI behavior',
    tone: 'violet',
    style:
      '--orbit-radius: clamp(10.8rem, 26vw, 16.4rem); --orbit-start: 150deg; --orbit-end: 166deg; --orbit-start-inverse: -150deg; --orbit-end-inverse: -166deg; --orbit-duration: 9.2s; --label-x: 10%; --label-y: 36%; --twinkle-delay: 1460ms; --twinkle-duration: 4.1s; --glint-delay: 1860ms;',
  },
] as const;

export const galaxyStars = [
  {
    className: 'hero-galaxy__star',
    style:
      '--x: 10%; --y: 28%; --size: 0.22rem; --delay: 30ms; --drift-x: -0.8rem; --drift-y: -0.9rem;',
  },
  {
    className: 'hero-galaxy__star',
    style:
      '--x: 20%; --y: 9%; --size: 0.34rem; --delay: 90ms; --drift-x: -0.35rem; --drift-y: -1.15rem;',
  },
  {
    className: 'hero-galaxy__star',
    style:
      '--x: 45%; --y: 2%; --size: 0.18rem; --delay: 140ms; --drift-x: 0rem; --drift-y: -1.2rem;',
  },
  {
    className: 'hero-galaxy__star',
    style:
      '--x: 77%; --y: 13%; --size: 0.26rem; --delay: 60ms; --drift-x: 0.8rem; --drift-y: -0.95rem;',
  },
  {
    className: 'hero-galaxy__star',
    style:
      '--x: 92%; --y: 39%; --size: 0.2rem; --delay: 170ms; --drift-x: 1.1rem; --drift-y: -0.25rem;',
  },
  {
    className: 'hero-galaxy__star',
    style:
      '--x: 84%; --y: 70%; --size: 0.32rem; --delay: 120ms; --drift-x: 0.95rem; --drift-y: 0.85rem;',
  },
  {
    className: 'hero-galaxy__star',
    style:
      '--x: 61%; --y: 93%; --size: 0.2rem; --delay: 220ms; --drift-x: 0.35rem; --drift-y: 1.2rem;',
  },
  {
    className: 'hero-galaxy__star',
    style:
      '--x: 28%; --y: 88%; --size: 0.26rem; --delay: 160ms; --drift-x: -0.65rem; --drift-y: 1rem;',
  },
  {
    className: 'hero-galaxy__star',
    style:
      '--x: 4%; --y: 61%; --size: 0.18rem; --delay: 200ms; --drift-x: -1.05rem; --drift-y: 0.42rem;',
  },
  {
    className: 'hero-galaxy__star hero-galaxy__star--warm',
    style:
      '--x: 17%; --y: 72%; --size: 0.24rem; --delay: 260ms; --drift-x: -0.9rem; --drift-y: 0.9rem;',
  },
  {
    className: 'hero-galaxy__star hero-galaxy__star--warm',
    style:
      '--x: 87%; --y: 52%; --size: 0.16rem; --delay: 240ms; --drift-x: 1.15rem; --drift-y: 0.15rem;',
  },
] as const;

export const galaxyComets = [
  {
    className: 'hero-galaxy__comet hero-galaxy__comet--north',
    style:
      '--delay: 60ms; --angle: -24deg; --start-x: -1.7rem; --start-y: 0.2rem; --end-x: 1.5rem; --end-y: -0.55rem;',
  },
  {
    className: 'hero-galaxy__comet hero-galaxy__comet--south',
    style:
      '--delay: 180ms; --angle: 152deg; --start-x: 1.5rem; --start-y: -0.2rem; --end-x: -1.4rem; --end-y: 0.5rem;',
  },
] as const;
