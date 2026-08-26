export function FilterBar({ search, categoria, disponibilidad, right }) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4 bg-white/80 backdrop-blur !px-10 !py-5 rounded-2xl !mb-8 shadow-sm border border-slate-200">
      <div className="flex items-center border-b  border-slate-200 h-[46px] overflow-hidden flex-1 max-w-md w-full">
        {search}
      </div>

      <div className="flex items-center border-b  border-slate-200 h-[46px] overflow-hidden flex-1 max-w-md w-full">
        {categoria}
      </div>

      <div className="flex items-center border-b  border-slate-200 h-[46px] overflow-hidden flex-1 max-w-md w-full">
        {disponibilidad}
      </div>

      <div className="flex gap-2 items-center flex-wrap">{right}</div>
    </div>
  );
}