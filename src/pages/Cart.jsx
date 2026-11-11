import { useState } from "react";
import { ProductImage } from "./Home.jsx";

function Cart({ cart, cartTotal, currency, dispatch, itemCount, onPlaceOrder, t }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  function submitOrder(event) {
    event.preventDefault();
    setCheckoutOpen(false);
    onPlaceOrder();
  }

  return (
    <>
      <section
        className="mt-8 scroll-mt-24 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"
        id="cart"
      >
        <div className="flex items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-[10px] font-bold tracking-[0.16em] text-violet-700">
              {t.cartEyebrow}
            </span>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {t.cart}
            </h2>
          </div>
          <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700">
            {itemCount} {t.items}
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center text-center">
            <div
              className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-2xl text-violet-600"
              aria-hidden="true"
            >
              ♡
            </div>
            <h3 className="mb-1 mt-3 text-sm font-extrabold text-slate-800">
              {t.emptyCart}
            </h3>
            <p className="text-xs text-slate-500">{t.emptyCartHint}</p>
            <a
              href="#products"
              className="mt-3 text-xs font-bold text-violet-700 hover:text-violet-900"
            >
              {t.viewProducts} <span>→</span>
            </a>
          </div>
        ) : (
          <>
            <div className="grid gap-2.5 pt-4">
              {cart.map((item) => (
                <article
                  className="flex min-h-20 items-center gap-3 rounded-xl border border-slate-100 p-2.5 sm:gap-4 sm:p-3"
                  key={item.id}
                >
                  <ProductImage
                    product={item}
                    className="h-14 w-14 shrink-0 rounded-lg bg-slate-50 object-contain p-1.5 sm:h-16 sm:w-16"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold capitalize text-slate-400">
                      {item.category}
                    </span>
                    <h3 className="my-1 truncate text-xs font-bold text-slate-800 sm:text-sm">
                      {item.title}
                    </h3>
                    <strong className="text-xs text-violet-700">
                      {currency.format(item.price)}
                    </strong>
                  </div>
                  <div
                    className="flex h-8 items-center rounded-lg border border-slate-200"
                    aria-label={`${item.title}: ${t.quantity}`}
                  >
                    <button
                      type="button"
                      className="h-8 w-7 border-0 bg-transparent text-lg text-slate-600 hover:text-violet-700"
                      aria-label={t.decreaseQuantity}
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
                    <span className="min-w-6 text-center text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      className="h-8 w-7 border-0 bg-transparent text-lg text-slate-600 hover:text-violet-700"
                      type="button"
                      aria-label={t.increaseQuantity}
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
                    aria-label={`${item.title} — ${t.remove}`}
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
              <span>{t.total}</span>
              <strong className="text-xl font-extrabold text-violet-700">
                {currency.format(cartTotal)}
              </strong>
            </div>
            <button
              className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
              type="button"
              onClick={() => setCheckoutOpen(true)}
            >
              {t.checkout} <span>→</span>
            </button>
          </>
        )}
      </section>

      {checkoutOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCheckoutOpen(false);
          }}
        >
          <form
            className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8"
            onSubmit={submitOrder}
          >
            <button
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
              type="button"
              onClick={() => setCheckoutOpen(false)}
              aria-label={t.close}
            >
              ×
            </button>
            <span className="text-[10px] font-bold tracking-[0.16em] text-violet-700">
              {t.lastStep}
            </span>
            <h2 className="mb-2 mt-2 text-xl font-extrabold tracking-tight text-slate-900">
              {t.checkout}
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              {t.paymentTotal} <strong>{currency.format(cartTotal)}</strong>
            </p>
            <label className="mt-3 grid gap-1.5 text-xs font-bold text-slate-600">
              {t.fullName}
              <input
                className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                name="name"
                type="text"
                placeholder={t.namePlaceholder}
                required
              />
            </label>
            <label className="mt-3 grid gap-1.5 text-xs font-bold text-slate-600">
              {t.phone}
              <input
                className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                name="phone"
                type="tel"
                placeholder="+998 90 123 45 67"
                required
              />
            </label>
            <label className="mt-3 grid gap-1.5 text-xs font-bold text-slate-600">
              {t.address}
              <textarea
                className="resize-y rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                name="address"
                placeholder={t.addressPlaceholder}
                rows="3"
                required
              />
            </label>
            <button
              className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700"
              type="submit"
            >
              {t.confirmOrder} <span>→</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Cart;