import { useEffect, useMemo, useReducer, useState } from "react";

const API_URL = "https://fakestoreapi.com/products";

const fallbackProducts = [
  {
    id: 101,
    title: "Classic everyday backpack",
    price: 49.99,
    description:
      "A practical, lightweight backpack for work, school, and everyday adventures.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    rating: { rate: 4.6, count: 120 },
  },
  {
    id: 102,
    title: "Soft cotton casual shirt",
    price: 29.5,
    description:
      "A comfortable cotton shirt with a relaxed fit for all-day wear.",
    category: "men's clothing",
    image:
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
    rating: { rate: 4.4, count: 85 },
  },
  {
    id: 103,
    title: "Minimal gold-tone earrings",
    price: 18.99,
    description:
      "An elegant, simple accessory that adds a polished touch to any outfit.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 4.8, count: 210 },
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function readSavedCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("shop-cart") || "[]");
    return Array.isArray(savedCart) ? savedCart : [];
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_PRODUCTS":
      return { ...state, products: action.products, loading: false, error: "" };
    case "LOAD_FALLBACK":
      return {
        ...state,
        products: fallbackProducts,
        loading: false,
        error:
          "Mahsulotlar zaxira roʻyxatidan koʻrsatilyapti. Internet ulanishini tekshiring.",
      };
    case "ADD_TO_CART": {
      const existingItem = state.cart.find(
        (item) => item.id === action.product.id,
      );
      const cart = existingItem
        ? state.cart.map((item) =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...state.cart, { ...action.product, quantity: 1 }];
      return { ...state, cart };
    }
    case "CHANGE_QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.id === action.id
              ? { ...item, quantity: item.quantity + action.amount }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.id),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    default:
      return state;
  }
}

function ProductImage({ product, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed || !product.image) {
    return (
      <div
        className={`grid place-items-center bg-violet-100 font-extrabold text-violet-700 ${className}`}
        aria-label="Rasm mavjud emas"
      >
        <span>{product.title.slice(0, 1)}</span>
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

function App() {
  const [state, dispatch] = useReducer(reducer, {
    products: [],
    cart: readSavedCart(),
    loading: true,
    error: "",
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [notice, setNotice] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Mahsulotlar API xatosi: ${response.status}`);
        }
        const products = await response.json();
        if (!Array.isArray(products) || products.length === 0) {
          throw new Error("Mahsulotlar roʻyxati boʻsh.");
        }
        dispatch({ type: "LOAD_PRODUCTS", products });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Mahsulotlarni yuklab boʻlmadi:", error);
          dispatch({ type: "LOAD_FALLBACK" });
        }
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    localStorage.setItem("shop-cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const categories = useMemo(
    () => [
      "all",
      ...new Set(state.products.map((product) => product.category)),
    ],
    [state.products],
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return state.products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;
      const matchesSearch =
        !query ||
        `${product.title} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, search, state.products]);

  const itemCount = state.cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const cartTotal = state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  function addToCart(product) {
    dispatch({ type: "ADD_TO_CART", product });
    setNotice(`${product.title} savatga qoʻshildi`);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function placeOrder(event) {
    event.preventDefault();
    dispatch({ type: "CLEAR_CART" });
    setCheckoutOpen(false);
    setNotice("Buyurtmangiz qabul qilindi. Rahmat!");
    window.setTimeout(() => setNotice(""), 3500);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="border-b border-slate-100 bg-white/95 px-4 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
          <a className="flex items-center gap-2.5 font-bold tracking-tight" href="#" aria-label="Luna do'koni bosh sahifasi">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-lg text-white">L</span>
            <span className="text-lg">Luna<span className="font-medium text-violet-600">store</span></span>
          </a>
          <div className="hidden text-sm text-slate-500 sm:block">Har kun uchun yoqimli xaridlar</div>
          <a className="flex items-center gap-2 text-sm font-bold text-slate-700" href="#cart">
            <span aria-hidden="true" className="text-lg text-violet-600">▣</span>
            Savat
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-violet-100 px-2 text-xs text-violet-700">{itemCount}</span>
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-9">
        <section className="relative flex min-h-64 items-center overflow-hidden rounded-3xl bg-violet-100 px-6 py-9 sm:px-10 lg:min-h-72 lg:px-16">
          <div className="relative z-10 max-w-xl">
            <span className="text-[10px] font-bold tracking-[0.18em] text-violet-700">YANGI MAVSUM · YANGI TANLOV</span>
            <h1 className="mb-2 mt-3 max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">Oʻzingizga yoqqanini toping.</h1>
            <p className="max-w-md text-sm leading-6 text-slate-600">Sifatli mahsulotlar, qulay narxlar va sodda xarid tajribasi — barchasi bir joyda.</p>
            <a className="mt-5 inline-flex items-center gap-3 text-sm font-bold text-violet-700 hover:text-violet-900" href="#products">
              Mahsulotlarni ko‘rish <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="absolute -bottom-10 -right-10 grid h-48 w-48 place-items-center rounded-full bg-violet-200/80 sm:right-6 sm:h-56 sm:w-56 lg:right-16 lg:h-64 lg:w-64" aria-hidden="true">
            <div className="relative grid h-36 w-36 place-items-center rounded-full border border-violet-300 bg-violet-300/70 sm:h-44 sm:w-44">
              <span className="absolute right-5 top-3 text-3xl text-violet-500">✳</span>
              <span className="relative grid h-20 w-20 place-items-center rounded-2xl bg-violet-600 text-3xl font-extrabold text-white shadow-xl shadow-violet-900/20 before:absolute before:-top-3 before:h-5 before:w-8 before:rounded-t-full before:border-4 before:border-b-0 before:border-violet-600">L</span>
              <span className="absolute -bottom-5 text-[8px] font-bold tracking-[0.2em] text-violet-700">GOOD THINGS, EVERY DAY</span>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7" id="cart">
          <div className="flex items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[10px] font-bold tracking-[0.16em] text-violet-700">SIZNING TANLOVINGIZ</span>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Xarid savati</h2>
            </div>
            <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700">{itemCount} ta mahsulot</span>
          </div>

          {state.cart.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-2xl text-violet-600" aria-hidden="true">
                ♡
              </div>
              <h3 className="mb-1 mt-3 text-sm font-extrabold text-slate-800">Savatingiz hozircha bo‘sh</h3>
              <p className="text-xs text-slate-500">Yoqtirgan mahsulotlaringizni savatga qo‘shing.</p>
              <a href="#products" className="mt-3 text-xs font-bold text-violet-700 hover:text-violet-900">
                Mahsulotlarni ko‘rish <span>→</span>
              </a>
            </div>
          ) : (
            <>
              <div className="grid gap-2.5 pt-4">
                {state.cart.map((item) => (
                  <article className="flex min-h-20 items-center gap-3 rounded-xl border border-slate-100 p-2.5 sm:gap-4 sm:p-3" key={item.id}>
                    <ProductImage product={item} className="h-14 w-14 shrink-0 rounded-lg bg-slate-50 object-contain p-1.5 sm:h-16 sm:w-16" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold capitalize text-slate-400">{item.category}</span>
                      <h3 className="my-1 truncate text-xs font-bold text-slate-800 sm:text-sm">{item.title}</h3>
                      <strong className="text-xs text-violet-700">{currency.format(item.price)}</strong>
                    </div>
                    <div
                      className="flex h-8 items-center rounded-lg border border-slate-200"
                      aria-label={`${item.title} miqdori`}
                    >
                      <button
                        type="button"
                        className="h-8 w-7 border-0 bg-transparent text-lg text-slate-600 hover:text-violet-700"
                        aria-label="Miqdorni kamaytirish"
                        onClick={() =>
                          dispatch({
                            type: "CHANGE_QUANTITY",
                            id: item.id,
                            amount: -1,
                          })
                        }
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        className="h-8 w-7 border-0 bg-transparent text-lg text-slate-600 hover:text-violet-700"
                        type="button"
                        aria-label="Miqdorni oshirish"
                        onClick={() =>
                          dispatch({
                            type: "CHANGE_QUANTITY",
                            id: item.id,
                            amount: 1,
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="grid h-7 w-7 place-items-center rounded-lg text-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      type="button"
                      aria-label={`${item.title}ni savatdan olib tashlash`}
                      onClick={() =>
                        dispatch({ type: "REMOVE_FROM_CART", id: item.id })
                      }
                    >
                      ×
                    </button>
                  </article>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                <span>Jami summa</span>
                <strong className="text-xl font-extrabold text-violet-700">{currency.format(cartTotal)}</strong>
              </div>
              <button
                className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
                type="button"
                onClick={() => setCheckoutOpen(true)}
              >
                Buyurtmani rasmiylashtirish <span>→</span>
              </button>
            </>
          )}
        </section>

        <section className="mt-12" id="products">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.16em] text-violet-700">SIZ UCHUN SARALANDI</span>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Mahsulotlar</h2>
            </div>
            <span className="text-xs text-slate-500">
              {visibleProducts.length} ta mahsulot
            </span>
          </div>

          <div className="mb-5 flex flex-col gap-3">
            <label className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-400 sm:max-w-sm">
              <span aria-hidden="true" className="text-2xl leading-none">⌕</span>
              <input
                className="w-full border-0 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
                type="search"
                placeholder="Mahsulot qidirish..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Mahsulot qidirish"
              />
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1" aria-label="Mahsulot kategoriyalari">
              {categories.map((item) => (
                <button
                  type="button"
                  className={`shrink-0 rounded-full border px-3 py-2 text-[11px] capitalize transition ${
                    category === item
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-700"
                  }`}
                  key={item}
                  onClick={() => setCategory(item)}
                >
                  {item === "all" ? "Barchasi" : item}
                </button>
              ))}
            </div>
          </div>

          {state.error && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-800" role="status">
              {state.error}
            </div>
          )}

          {state.loading ? (
            <div className="flex min-h-60 flex-col items-center justify-center text-sm text-slate-500" role="status">
              <span className="mb-3 h-8 w-8 animate-spin rounded-full border-[3px] border-violet-100 border-t-violet-600" />
              Mahsulotlar yuklanmoqda...
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center text-center">
              <span aria-hidden="true" className="text-4xl text-slate-300">⌕</span>
              <h3 className="mb-1 mt-3 text-sm font-bold text-slate-800">Mahsulot topilmadi</h3>
              <p className="text-xs text-slate-500">Boshqa soʻz bilan qidirib koʻring.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5" key={product.id}>
                  <div className="grid h-40 place-items-center bg-slate-50 p-5 sm:h-48 lg:h-52">
                    <ProductImage product={product} className="h-full w-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex min-h-6 items-center justify-between gap-2">
                      <span className="rounded-full bg-violet-50 px-2 py-1 text-[9px] font-semibold capitalize text-violet-700">{product.category}</span>
                      {product.rating && (
                        <span className="shrink-0 text-[10px] font-semibold text-amber-600">
                          ★ {product.rating.rate}
                          <span className="ml-1 font-normal text-slate-400">({product.rating.count})</span>
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 line-clamp-2 min-h-10 text-xs font-bold leading-5 text-slate-800 sm:text-sm">{product.title}</h3>
                    <p className="mt-1 line-clamp-2 min-h-8 text-[10px] leading-4 text-slate-500">{product.description}</p>
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 max-[430px]:flex-col max-[430px]:items-stretch">
                      <strong className="text-sm font-extrabold text-violet-700">{currency.format(product.price)}</strong>
                      <button
                        type="button"
                        className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg border border-violet-100 bg-violet-50 px-2.5 text-[10px] font-bold text-violet-700 transition hover:border-violet-600 hover:bg-violet-600 hover:text-white"
                        onClick={() => addToCart(product)}
                      >
                        <span>+</span> Savatga
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-100 bg-white px-4 py-5 text-[11px] text-slate-400">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a className="flex items-center gap-2 font-bold tracking-tight text-slate-800" href="#">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-600 text-sm text-white">L</span>
            <span className="text-base">Luna<span className="font-medium text-violet-600">store</span></span>
          </a>
          <span className="hidden sm:block">Yaxshi tanlovlar, har kuni.</span>
          <span>© {new Date().getFullYear()} Luna store</span>
        </div>
      </footer>

      {notice && (
        <div className="fixed bottom-6 right-6 z-50 max-w-[calc(100%-3rem)] rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-xl shadow-slate-900/10" role="status">
          {notice}
        </div>
      )}

      {checkoutOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCheckoutOpen(false);
          }}
        >
          <form className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8" onSubmit={placeOrder}>
            <button
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
              type="button"
              onClick={() => setCheckoutOpen(false)}
              aria-label="Yopish"
            >
              ×
            </button>
            <span className="text-[10px] font-bold tracking-[0.16em] text-violet-700">OXIRGI QADAM</span>
            <h2 className="mb-2 mt-2 text-xl font-extrabold tracking-tight text-slate-900">Buyurtmani rasmiylashtirish</h2>
            <p className="mb-5 text-sm text-slate-500">
              To‘lov summasi: <strong>{currency.format(cartTotal)}</strong>
            </p>
            <label className="mt-3 grid gap-1.5 text-xs font-bold text-slate-600">
              Ism va familiya
              <input className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100" name="name" type="text" placeholder="Ismingiz" required />
            </label>
            <label className="mt-3 grid gap-1.5 text-xs font-bold text-slate-600">
              Telefon raqam
              <input
                className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                name="phone"
                type="tel"
                placeholder="+998 90 123 45 67"
                required
              />
            </label>
            <label className="mt-3 grid gap-1.5 text-xs font-bold text-slate-600">
              Yetkazib berish manzili
              <textarea
                className="resize-y rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                name="address"
                placeholder="Shahar, ko‘cha, uy"
                rows="3"
                required
              />
            </label>
            <button className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700" type="submit">
              Buyurtmani tasdiqlash <span>→</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
