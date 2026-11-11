import { useEffect, useMemo, useReducer, useState } from "react";
import Header from "./components/Header.jsx";
import Cart from "./pages/Cart.jsx";
import Home from "./pages/Home.jsx";
import uz from "./components/locales/uz.json";
import eng from "./components/locales/eng.json";
import chin from "./components/locales/chin.json";

const API_URL = "https://fakestoreapi.com/products";
const translations = { uz, eng, chin };
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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

function readSavedCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("shop-cart") || "[]");
    return Array.isArray(savedCart) ? savedCart : [];
  } catch {
    return [];
  }
}

function readSavedLanguage() {
  try {
    const savedLanguage = localStorage.getItem("shop-language");
    return Object.prototype.hasOwnProperty.call(translations, savedLanguage)
      ? savedLanguage
      : "uz";
  } catch {
    return "uz";
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_PRODUCTS":
      return { ...state, products: action.products, loading: false, error: false };
    case "LOAD_FALLBACK":
      return { ...state, products: fallbackProducts, loading: false, error: true };
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

function App() {
  const [page, setPage] = useState(() =>
    window.location.hash === "#cart" ? "cart" : "home",
  );
  const [state, dispatch] = useReducer(reducer, {
    products: [],
    cart: readSavedCart(),
    loading: true,
    error: false,
  });
  const [language, setLanguage] = useState(readSavedLanguage);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [notice, setNotice] = useState("");
  const t = translations[language];

  useEffect(() => {
    function syncPageWithLocation() {
      setPage(window.location.hash === "#cart" ? "cart" : "home");
    }

    window.addEventListener("popstate", syncPageWithLocation);
    return () => window.removeEventListener("popstate", syncPageWithLocation);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Product API error: ${response.status}`);
        }
        const products = await response.json();
        if (!Array.isArray(products) || products.length === 0) {
          throw new Error("The product list is empty.");
        }
        dispatch({ type: "LOAD_PRODUCTS", products });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Could not load products:", error);
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

  useEffect(() => {
    localStorage.setItem("shop-language", language);
    document.documentElement.lang =
      language === "uz" ? "uz" : language === "eng" ? "en" : "zh";
  }, [language]);

  const categories = useMemo(
    () => ["all", ...new Set(state.products.map((product) => product.category))],
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

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function addToCart(product) {
    dispatch({ type: "ADD_TO_CART", product });
    showNotice(t.addedToCart);
  }

  function placeOrder() {
    dispatch({ type: "CLEAR_CART" });
    showNotice(t.orderSuccess);
  }

  function navigateTo(nextPage) {
    const hash = nextPage === "cart" ? "#cart" : "#home";
    if (window.location.hash !== hash) {
      window.history.pushState({ page: nextPage }, "", hash);
    }
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header
        itemCount={itemCount}
        language={language}
        onNavigate={navigateTo}
        onLanguageChange={setLanguage}
        page={page}
        t={t}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-9">
        {page === "cart" ? (
          <Cart
            cart={state.cart}
            cartTotal={cartTotal}
            currency={currency}
            dispatch={dispatch}
            itemCount={itemCount}
            onPlaceOrder={placeOrder}
            t={t}
          />
        ) : (
          <Home
            categories={categories}
            category={category}
            error={state.error}
            loading={state.loading}
            onAddToCart={addToCart}
            onCategoryChange={setCategory}
            onSearchChange={setSearch}
            products={visibleProducts}
            search={search}
            t={t}
          />
        )}
      </main>
      <footer className="border-t border-slate-100 bg-white px-4 py-5 text-[11px] text-slate-400">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a className="font-bold tracking-tight text-slate-800" href="#">
            Luna<span className="font-medium text-violet-600">store</span>
          </a>
          <span className="hidden sm:block">{t.footerTagline}</span>
          <span>© {new Date().getFullYear()} Luna store</span>
        </div>
      </footer>
      {notice && (
        <div
          className="fixed bottom-6 right-6 z-50 max-w-[calc(100%-3rem)] rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-xl shadow-slate-900/10"
          role="status"
        >
          {notice}
        </div>
      )}
    </div>
  );
}

export default App;
