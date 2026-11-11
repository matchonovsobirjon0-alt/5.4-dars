const languages = [
  { code: "uz", label: "UZ", name: "Oʻzbekcha" },
  { code: "eng", label: "EN", name: "English" },
  { code: "chin", label: "👲 中文", name: "中文" },
];

function Header({ itemCount, language, onLanguageChange, onNavigate, page, t }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 px-4 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3">
        <a
          className="flex shrink-0 items-center gap-2 font-bold tracking-tight"
          href="#home"
          aria-label={t.home}
          onClick={(event) => {
            event.preventDefault();
            onNavigate("home");
          }}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-lg text-white">
            L
          </span>
          <span className="text-lg">
            Luna<span className="font-medium text-violet-600">store</span>
          </span>
        </a>
        <nav className="flex items-center gap-2 sm:gap-5" aria-label={t.navigation}>
          <a
            className="hidden text-xs font-semibold text-violet-700 hover:text-violet-900 sm:inline"
            href="#home"
            aria-current={page === "home" ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault();
              onNavigate("home");
            }}
          >
            {t.home}
          </a>
          <a
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-violet-700 sm:text-sm"
            href="#cart"
            aria-current={page === "cart" ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault();
              onNavigate("cart");
            }}
          >
            {t.cart}
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-violet-600 px-2 text-xs text-white">
              {itemCount}
            </span>
          </a>
          <div className="flex items-center gap-1" aria-label={t.selectLanguage}>
            {languages.map((item) => (
              <button
                aria-label={item.name}
                aria-pressed={language === item.code}
                className={`min-h-8 rounded-lg px-2 text-[11px] font-bold transition ${
                  language === item.code
                    ? "bg-violet-600 text-white"
                    : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                }`}
                key={item.code}
                onClick={() => onLanguageChange(item.code)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;