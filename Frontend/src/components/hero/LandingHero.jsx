import { Warp } from '@paper-design/shaders-react';

export default function LandingHero({ onStart }) {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0">
        <Warp
          style={{ height: '100%', width: '100%' }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={1}
          colors={[
            'hsl(200, 100%, 20%)',
            'hsl(160, 100%, 75%)',
            'hsl(180, 90%, 30%)',
            'hsl(170, 100%, 80%)',
          ]}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="max-w-4xl text-center space-y-7">
          <p className="text-white uppercase tracking-[0.6em] text-sm">
            Mi Playlist
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight">
            Crea y comparti tu playlist de videos favorita
          </h1>
          <p className="text-white/80 text-xl md:text-2xl font-light leading-relaxed">
            Busca videos en YouTube, guardalos en tu libreria y miralos en un
            visualizador elegante.
          </p>
          <div className="flex justify-center pt-6">
            <button
              onClick={onStart}
              className="px-8 py-4 rounded-full bg-white text-gray-900 font-semibold text-lg shadow-xl hover:scale-105 transition-transform duration-300"
            >
              Comenzar ahora
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
