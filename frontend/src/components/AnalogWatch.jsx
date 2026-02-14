import { useEffect, useRef } from "react";

const AnalogWatch = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  const SIZE = 56;
  const CENTER = SIZE / 2;
  const DIAL_RADIUS = 22;

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const s = now.getSeconds();
      const m = now.getMinutes();
      const h = now.getHours() % 12;

      secondRef.current.style.transform = `rotate(${s * 6}deg)`;
      minuteRef.current.style.transform = `rotate(${m * 6 + s * 0.1}deg)`;
      hourRef.current.style.transform = `rotate(${h * 30 + m * 0.5}deg)`;
    };

    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const pos = (angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      left: CENTER + DIAL_RADIUS * Math.sin(rad),
      top: CENTER - DIAL_RADIUS * Math.cos(rad),
    };
  };

  return (
    <div className="w-14 h-14 flex items-center justify-center">
      <div className="
        relative w-full h-full rounded-full
        bg-gradient-to-br from-neutral-900 via-black to-neutral-800
        border border-neutral-700
        shadow-[0_6px_14px_rgba(0,0,0,0.6)]
        ring-1 ring-white/10
      ">

        {/* GLASS SHINE */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

        {/* DIGITS */}
        {[12, 3, 6, 9].map((n) => {
          const angle = n === 12 ? 0 : n === 3 ? 90 : n === 6 ? 180 : 270;
          const { left, top } = pos(angle);

          return (
            <div
              key={n}
              className="absolute text-[9px] font-semibold text-slate-200"
              style={{
                left,
                top,
                transform: "translate(-50%, -50%)",
              }}
            >
              {n}
            </div>
          );
        })}

        {/* DASH MARKERS */}
        {[...Array(12)].map((_, i) => {
          if ([0, 3, 6, 9].includes(i)) return null;

          const angle = i * 30;
          const { left, top } = pos(angle);

          return (
            <div
              key={i}
              className="absolute w-[6px] h-[1px] bg-slate-500"
              style={{
                left,
                top,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              }}
            />
          );
        })}

        {/* HANDS */}
        <div
          ref={hourRef}
          className="absolute left-1/2 top-1/2 h-4 w-[3px]
                     bg-slate-100 origin-bottom
                     -translate-x-1/2 -translate-y-full
                     rounded-full shadow-sm"
        />
        <div
          ref={minuteRef}
          className="absolute left-1/2 top-1/2 h-5 w-[2px]
                     bg-indigo-300 origin-bottom
                     -translate-x-1/2 -translate-y-full
                     rounded-full shadow-sm"
        />
        <div
          ref={secondRef}
          className="absolute left-1/2 top-1/2 h-6 w-[1.5px]
                     bg-amber-400 origin-bottom
                     -translate-x-1/2 -translate-y-full"
        />

        {/* CENTER PIN */}
        <div className="
          absolute left-1/2 top-1/2
          w-2 h-2 rounded-full
          bg-amber-400
          shadow-[0_0_6px_rgba(251,191,36,0.8)]
          -translate-x-1/2 -translate-y-1/2
        " />
      </div>
    </div>
  );
};

export default AnalogWatch;
