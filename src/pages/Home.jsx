import { useState } from "react";

export function ProductImage({ product, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed || !product.image) {
    return (
      <div
        className={`grid place-items-center bg-violet-100 font-bold text-violet-700 ${className}`}
        role="img"
        aria-label={product.title}
      >
        {product.title.slice(0, 1)}
      </div>
    );
  }

  return (
    <img
      className={className}
      src={product.image}
      alt={product.title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

const categoryTranslationKeys = {
  all: "allCategories",
  "men's clothing": "mensClothing",
  "women's clothing": "womensClothing",
  jewelery: "jewelry",
  electronics: "electronics",
};

function Home({
  categories,
  category,
  error,
  loading,
  onAddToCart,
  onCategoryChange,
  onSearchChange,
  products,
  search,
  t,
}) {
  function getCategoryLabel(value) {
    const key = categoryTranslationKeys[value];
    return key ? t[key] : value;
  }

  return (
    <>
      <section
        className="relative flex min-h-64 scroll-mt-24 items-center overflow-hidden rounded-3xl bg-violet-100 px-6 py-9 sm:px-10 lg:min-h-72 lg:px-16"
        id="home"
      >
        <div className="relative z-10 max-w-xl">
          <span className="text-[10px] font-bold tracking-[0.18em] text-violet-700">
            {t.heroEyebrow}
          </span>
          <h1 className="mb-2 mt-3 max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            {t.heroTitle}
          </h1>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            {t.heroDescription}
          </p>
          <a
            className="mt-5 inline-flex items-center gap-3 text-sm font-bold text-violet-700 hover:text-violet-900"
            href="#products"
          >
            {t.viewProducts} <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div
          className="absolute -bottom-10 -right-10 grid h-48 w-48 place-items-center rounded-full bg-violet-200/80 sm:right-6 sm:h-56 sm:w-56 lg:right-16 lg:h-64 lg:w-64"
          aria-hidden="true"
        >
          <div className="relative grid h-36 w-36 place-items-center rounded-full border border-violet-300 bg-violet-300/70 sm:h-44 sm:w-44">
            <span className="absolute right-5 top-3 text-3xl text-violet-500">
              ✳
            </span>
            <span className="relative grid h-20 w-20 place-items-center rounded-2xl bg-violet-600 text-3xl font-extrabold text-white shadow-xl shadow-violet-900/20 before:absolute before:-top-3 before:h-5 before:w-8 before:rounded-t-full before:border-4 before:border-b-0 before:border-violet-600">
              L
            </span>
            <span className="absolute -bottom-5 text-[8px] font-bold tracking-[0.2em] text-violet-700">
              GOOD THINGS, EVERY DAY
            </span>
          </div>
        </div>
      </section>

      <section className="mt-12 scroll-mt-24" id="products">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.16em] text-violet-700">
              {t.productsEyebrow}
            </span>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {t.products}
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {products.length} {t.productsCount}
          </span>
        </div>

        <div className="mb-5 flex flex-col gap-3">
          <label className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-400 sm:max-w-sm">
            <span aria-hidden="true" className="text-2xl leading-none">
              ⌕
            </span>
            <input
              className="w-full border-0 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
              type="search"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              aria-label={t.searchProducts}
            />
          </label>
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1"
            aria-label={t.productCategories}
          >
            {categories.map((item) => (
              <button
                type="button"
                className={`shrink-0 rounded-full border px-3 py-2 text-[11px] capitalize transition ${
                  category === item
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-700"
                }`}
                key={item}
                onClick={() => onCategoryChange(item)}
              >
                {getCategoryLabel(item)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-800"
            role="status"
          >
            {t.loadError}
          </div>
        )}
        {loading ? (
          <div
            className="flex min-h-60 flex-col items-center justify-center text-sm text-slate-500"
            role="status"
          >
            <span className="mb-3 h-8 w-8 animate-spin rounded-full border-[3px] border-violet-100 border-t-violet-600" />
            {t.loading}
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center text-center">
            <span aria-hidden="true" className="text-4xl text-slate-300">
              ⌕
            </span>
            <h3 className="mb-1 mt-3 text-sm font-bold text-slate-800">
              {t.noProducts}
            </h3>
            <p className="text-xs text-slate-500">{t.searchAgain}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <article
                className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5"
                key={product.id}
              >
                <div className="grid h-40 place-items-center bg-slate-50 p-5 sm:h-48 lg:h-52">
                  <ProductImage
                    product={product}
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex min-h-6 items-center justify-between gap-2">
                    <span className="rounded-full bg-violet-50 px-2 py-1 text-[9px] font-semibold capitalize text-violet-700">
                      {getCategoryLabel(product.category)}
                    </span>
                    {product.rating && (
                      <span className="shrink-0 text-[10px] font-semibold text-amber-600">
                        ★ {product.rating.rate}
                        <span className="ml-1 font-normal text-slate-400">
                          ({product.rating.count})
                        </span>
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 line-clamp-2 min-h-10 text-xs font-bold leading-5 text-slate-800 sm:text-sm">
                    {product.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 min-h-8 text-[10px] leading-4 text-slate-500">
                    {product.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 max-[430px]:flex-col max-[430px]:items-stretch">
                    <strong className="text-sm font-extrabold text-violet-700">
                      ${product.price.toFixed(2)}
                    </strong>
                    <button
                      type="button"
                      className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg border border-violet-100 bg-violet-50 px-2.5 text-[10px] font-bold text-violet-700 transition hover:border-violet-600 hover:bg-violet-600 hover:text-white"
                      onClick={() => onAddToCart(product)}
                    >
                      <span>+</span> {t.addToCart}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;