export function Button({ children, variant = "primary", onClick, type = "button", className = "" }) {
  const variants = {
    primary: "flex items-center !gap-2 !px-6 !py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/40 transition-all duration-300",
    cancel:  "flex items-center gap-2 !px-7 !py-2 rounded-xl bg-slate-400 text-white font-bold hover:bg-slate-600 transition-all duration-200",
    edit:    "w-10 h-10 rounded-xl inline-flex items-center justify-center bg-blue-500/15 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110 transition-all duration-200",
    delete:  "w-10 h-10 rounded-xl inline-flex items-center justify-center bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 transition-all duration-200",
  };

  return (
    <button type={type} onClick={onClick} className={`${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}