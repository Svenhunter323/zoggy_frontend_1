import React, { useEffect, useRef, useState } from "react";
import { Application, Assets } from "pixi.js";
import { Spine } from "@pixi-spine/runtime-3.8";
import "@pixi-spine/loader-3.8";
import { Howl } from "howler";

const JSON_URL  = "/chest/proj_1_zoggy_chest_PS_V2.json";
const ATLAS_URL = "/chest/proj_1_zoggy_chest_PS_V2.atlas.txt";
const PNG_URL   = "/chest/proj_1_zoggy_chest_PS_V2.png";

export default function ChestSpine({
  initial = "open",       // animations in your JSON: open, open_idle, reveal
  autoChain = "open_idle",// what to loop after "open" completes (set null to disable)
  fitScale = 0.75,
  bg = "#0b0f17",
}) {
  const hostRef = useRef(null);
  const appRef = useRef(null);
  const spineRef = useRef(null);
  const [anims, setAnims] = useState([]);
  const [playing, setPlaying] = useState(initial);

  useEffect(() => {
    let destroyed = false;

    (async () => {
      const host = hostRef.current;
      if (!host) return;

      // PIXI v8: async init + use canvas property
      const app = new Application();
      await app.init({ resizeTo: host, antialias: true });
      if (destroyed) { app.destroy(); return; }

      host.style.background = bg;
      host.appendChild(app.canvas);
      appRef.current = app;

      // Optional SFX (no events in your JSON, so we trigger on animation start)
      const sfxOpen   = new Howl({ src: ["/chest/sfx_open.wav"],   volume: 0.9 });
      const sfxReveal = new Howl({ src: ["/chest/sfx_reveal.wav"], volume: 0.9 });

      // Tell the loader which atlas belongs to the JSON
      Assets.add({ alias: "chest", src: JSON_URL, data: { metadata: { spineAtlasFile: ATLAS_URL } } });
      Assets.add({ alias: "chestPng", src: PNG_URL }); // preload texture referenced by the atlas

      const [parsed] = await Assets.load(["chest", "chestPng"]);
      if (destroyed) { app.destroy(); return; }

      const spineData = parsed.spineData ?? parsed;
      const s = new Spine(spineData);
      spineRef.current = s;
      app.stage.addChild(s);

      // List animations (open, open_idle, reveal)
      const names = s.spineData.animations.map(a => a.name);
      setAnims(names);

      // Fit to view
      const fitToView = () => {
        const { width, height } = app.renderer;
        s.skeleton.setToSetupPose();
        s.update(0);
        const b = s.getBounds();
        const scale = Math.min(width / b.width, height / b.height) * fitScale;
        s.scale.set(scale);
        s.position.set(
          width / 2 - (b.x + b.width / 2) * scale,
          height / 2 - (b.y + b.height / 2) * scale
        );
      };
      fitToView();
      const ro = new ResizeObserver(fitToView);
      ro.observe(host);

      // Simple audio + chaining (since there are no Spine event keys)
      s.state.addListener({
        start: (entry) => {
          const n = entry?.animation?.name;
          if (n === "open") sfxOpen.play();
          if (n === "reveal") sfxReveal.play();
        },
        complete: (entry) => {
          if (entry?.animation?.name === "open" && autoChain && names.includes(autoChain)) {
            s.state.setAnimation(0, autoChain, true);
            setPlaying(autoChain);
          }
        },
      });

      // Start
      const start = names.includes(playing) ? playing : names[0];
      if (start) s.state.setAnimation(0, start, start !== "open");

      // External switcher
      const handler = (e) => {
        const next = e?.detail?.name;
        if (next && names.includes(next)) {
          s.state.setAnimation(0, next, next !== "open");
          setPlaying(next);
        }
      };
      window.addEventListener("spine:play", handler);

      // local cleanup for this async block
      return () => {
        window.removeEventListener("spine:play", handler);
        ro.disconnect();
      };
    })();

    return () => {
      destroyed = true;
      const app = appRef.current;
      try { app?.destroy(); } catch {}
      const host = hostRef.current;
      if (app?.canvas && host?.contains(app.canvas)) host.removeChild(app.canvas);
    };
  }, [bg, fitScale, initial, autoChain, playing]);

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden ring-1 ring-white/10">
      <div ref={hostRef} className="w-full h-full" />
      {anims.length > 0 && (
        <div className="absolute left-3 bottom-3 flex flex-wrap gap-2 bg-black/40 text-white p-2 rounded-lg">
          {anims.map((name) => (
            <button
              key={name}
              onClick={() => window.dispatchEvent(new CustomEvent("spine:play", { detail: { name } }))}
              className={`px-2 py-1 text-sm rounded border border-white/20 ${
                playing === name ? "bg-white/20" : "bg-transparent"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
