import { useEffect, useRef } from "react";

type SwitchSoundType = "primary" | "secondary" | "commit" | "release";

function playSwitchSound(
  ctx: AudioContext | null,
  type: SwitchSoundType,
): void {
  if (!ctx) return;

  // Resume AudioContext if suspended by browser autoplay policy
  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Short high-pass filter removes muddy low-end for a crisp hardware snap
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(180, now);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  if (type === "primary") {
    // Crisp Start/Pause mechanical switch press
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1450, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.028);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.032);

    osc.start(now);
    osc.stop(now + 0.035);
  } else if (type === "secondary") {
    // Deeper Reset switch thud
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(175, now + 0.04);

    gain.gain.setValueAtTime(0.26, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === "commit") {
    // Sharp metallic relay latch for Save button
    osc.type = "square";
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.022);

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);

    osc.start(now);
    osc.stop(now + 0.03);
  } else {
    // Subtle key-up tactile spring return
    osc.type = "sine";
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.015);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    osc.start(now);
    osc.stop(now + 0.02);
  }
}

function FluidCursor(): React.ReactElement {
  const coreRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const pressedButtonRef = useRef<boolean>(false);

  useEffect(() => {
    const core = coreRef.current;
    const ring = ringRef.current;
    if (!core || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;

    const getAudioContext = (): AudioContext | null => {
      if (!audioCtxRef.current && typeof window !== "undefined") {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      return audioCtxRef.current;
    };

    const onMouseMove = (e: MouseEvent): void => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.body.classList.add("cursor-visible");

      core.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      const target = e.target instanceof Element ? e.target : null;
      if (!target) return;

      if (target.closest("button")) {
        document.body.dataset.cursor = "action";
      } else if (target.closest("input")) {
        document.body.dataset.cursor = "text";
      } else if (target.closest(".app > h1")) {
        document.body.dataset.cursor = "oled";
      } else if (target.closest(".app li")) {
        document.body.dataset.cursor = "row";
      } else {
        delete document.body.dataset.cursor;
      }
    };

    const onMouseDown = (e: MouseEvent): void => {
      document.body.dataset.cursorDown = "true";

      const target = e.target instanceof Element ? e.target : null;
      const btn = target?.closest("button");
      if (!btn) return;

      pressedButtonRef.current = true;
      const ctx = getAudioContext();

      // Match sound profile to the specific hardware switch
      if (btn.closest(".app > div")) {
        playSwitchSound(ctx, "commit"); // Save button
      } else if (btn.previousElementSibling?.tagName === "BUTTON") {
        playSwitchSound(ctx, "secondary"); // Reset button
      } else {
        playSwitchSound(ctx, "primary"); // Start / Pause button
      }
    };

    const onMouseUp = (): void => {
      delete document.body.dataset.cursorDown;

      if (pressedButtonRef.current) {
        pressedButtonRef.current = false;
        playSwitchSound(audioCtxRef.current, "release");
      }
    };

    const onMouseLeave = (): void => {
      document.body.classList.remove("cursor-visible");
    };

    const render = (): void => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;

      ringX += dx * 0.18;
      ringY += dy * 0.18;

      const velocity = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const stretch = Math.min(velocity * 0.008, 0.35);

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.5})`;

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
      void audioCtxRef.current?.close();
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={coreRef} className="cursor-core" aria-hidden="true" />
    </>
  );
}

export default FluidCursor;
