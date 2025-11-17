import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) {
      setError('Ingresa un termino para buscar');
      return;
    }
    setError('');
    onSearch?.(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-3xl border border-white/20 bg-white/5 p-4 backdrop-blur"
    >
      <div className="flex flex-col gap-3">
        <label className="text-sm uppercase tracking-[0.55em] text-brand/80">
          Buscar en YouTube
        </label>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
              <Search size={18} />
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-base text-white outline-none transition focus:border-brand focus:bg-black/40"
              placeholder="Ej: Lo-fi beats, Messi highlights, speedrun Zelda..."
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-900 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                Buscando...
              </>
            ) : (
              'Buscar'
            )}
          </button>
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
      </div>
    </form>
  );
}
