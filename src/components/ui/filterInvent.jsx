export function FilterInvent({ search, movimiento, usuario, fecha, right }) {
  return (
    <div
      className="
        flex
        justify-between
        items-center
        flex-wrap
        gap-4
        bg-white/80
        backdrop-blur
        !px-10
        !py-5
        rounded-2xl
        !mb-8
        shadow-sm
        border
        border-slate-200
      "
    >
      {/* Search */}
      <div
        className="
          flex
          items-center
          border-b
          border-slate-300
          h-[46px]
          overflow-hidden
          flex-1
         max-w-md w-full
        "
      >
        {search}
      </div>

      {/* Tipo movimiento */}
      <div
        className="
          flex
          items-center
          border-b
          border-slate-300
          h-[46px]
          min-w-[220px]
        "
      >
        {movimiento}
      </div>

      {/* Usuario */}
      <div
        className="
          flex
          items-center
          border-b
          border-slate-300
          h-[46px]
          min-w-[220px]
        "
      >
        {fecha}
      </div>

      {/* Botones */}
      <div className="flex gap-2 items-center flex-wrap">{right}</div>
    </div>
  );
}
