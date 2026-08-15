import { ProductImage } from "@/components/ui/ProductImage";
import { glassPrototypeBusiness, glassPrototypeProducts, GlassPrototypeFrame } from "@/components/prototype/glass/GlassPrototypeFrame";
import { mockOrders } from "@/data/mockOrders";
import { categories, products } from "@/data/products";
import { formatCents } from "@/lib/currency";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";

function productPrice(product: Product): string {
  if (product.priceCents != null) return formatCents(product.priceCents);

  const prices = product.options?.sizes?.map((size) => size.priceCents) ?? [];
  return prices.length > 0
    ? `From ${formatCents(Math.min(...prices))}`
    : "View options";
}

function availabilityLabel(product: Product): string {
  if (product.availability === "available") return "Available today";
  if (product.availability === "sold_out") return "Sold out";
  return "Temporarily unavailable";
}

const statusTone: Record<OrderStatus, string> = {
  awaiting_payment: "border-amber-900/15 bg-amber-50 text-amber-900",
  confirmed: "border-emerald-900/15 bg-emerald-50 text-emerald-900",
  cancelled: "border-stone-300 bg-stone-100 text-stone-600",
};

function MenuProductCard({ product }: { product: Product }) {
  return (
    <article className="gp-solid flex min-w-0 flex-col overflow-hidden p-3 sm:p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#f0e7d8]">
        <ProductImage
          src={product.image}
          alt={`${product.name}, a menu item from ${glassPrototypeBusiness.name}`}
          width={product.imageWidth ?? 400}
          height={product.imageHeight ?? 300}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 30vw"
          className="h-full w-full object-contain p-3 sm:p-4"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-1 pt-4">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h3 className="min-w-0 text-lg font-semibold tracking-tight text-stone-950">
            {product.name}
          </h3>
          {product.nameZh ? (
            <p className="text-sm text-stone-500">{product.nameZh}</p>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
          {product.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <div>
            <p className="text-sm font-bold tabular-nums text-[#7b2c27]">
              {productPrice(product)}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              {availabilityLabel(product)}
            </p>
          </div>
          <button
            type="button"
            disabled
            aria-label={`Preview ${product.name} order flow`}
            className="gp-primary min-h-11 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-65"
          >
            Choose
          </button>
        </div>
      </div>
    </article>
  );
}

function FeaturedDish({ product }: { product: Product }) {
  return (
    <li className="gp-solid flex min-w-0 items-center gap-3 p-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#f0e7d8] sm:size-[4.5rem]">
        <ProductImage
          src={product.image}
          alt={`${product.name}, featured dish`}
          width={product.imageWidth ?? 400}
          height={product.imageHeight ?? 300}
          fill
          sizes="72px"
          className="h-full w-full object-contain p-1.5"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-stone-950">
          {product.name}
        </p>
        <p className="mt-1 text-xs text-stone-500">{productPrice(product)}</p>
      </div>
      <button
        type="button"
        disabled
        aria-label={`Preview ${product.name}`}
        className="gp-secondary min-h-11 shrink-0 px-3 text-xs disabled:cursor-not-allowed disabled:opacity-65"
      >
        View
      </button>
    </li>
  );
}

function CartLinePreview({ product }: { product: Product }) {
  const unitPriceCents = product.priceCents ?? 0;

  return (
    <li className="grid min-w-0 grid-cols-[4.25rem_minmax(0,1fr)_auto] items-center gap-3 py-4 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:gap-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f0e7d8]">
        <ProductImage
          src={product.image}
          alt={`${product.name}, selected cart item`}
          width={product.imageWidth ?? 400}
          height={product.imageHeight ?? 300}
          fill
          sizes="80px"
          className="h-full w-full object-contain p-1.5"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-stone-950">
          {product.name}
        </p>
        <p className="mt-1 text-xs text-stone-500">
          1 × {formatCents(unitPriceCents)}
        </p>
      </div>
      <p className="text-right text-sm font-bold tabular-nums text-stone-950">
        {formatCents(unitPriceCents)}
      </p>
    </li>
  );
}

function AdminOrderRow({ order }: { order: (typeof mockOrders)[number] }) {
  return (
    <li className="grid min-w-0 gap-3 border-t border-stone-900/10 py-4 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-stone-950">{order.id}</p>
          <span
            className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-semibold ${statusTone[order.status]}`}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
        <p className="mt-1 text-sm text-stone-600">
          {order.customer.name} · Pickup {order.pickupDate} at {order.pickupTime}
        </p>
        <p className="mt-1 line-clamp-1 text-xs text-stone-500">
          {order.lines
            .map((line) => `${line.quantity} × ${line.productName}`)
            .join(" · ")}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <p className="text-sm font-bold tabular-nums text-stone-950">
          {formatCents(order.subtotalCents)}
        </p>
        <button
          type="button"
          disabled
          className="gp-secondary min-h-11 px-3 text-xs disabled:cursor-not-allowed disabled:opacity-65"
        >
          View details
        </button>
      </div>
    </li>
  );
}

/**
 * PROTOTYPE ONLY — a single frosted app frame containing four read-only
 * snapshots. Food and operational content stay on warm solid surfaces while
 * navigation, filters, summaries, and rails carry the glass material.
 */
export function GlassVariantA() {
  const heroProduct = glassPrototypeProducts[0] ?? products[0];
  const cartProducts = products
    .filter((product) => product.priceCents != null)
    .slice(0, 2);
  const cartSubtotalCents = cartProducts.reduce(
    (total, product) => total + (product.priceCents ?? 0),
    0,
  );
  const adminProduct =
    products.find((product) => product.slug === "chicken-rice") ?? products[0];
  const adminCategory =
    categories.find((category) => category.slug === adminProduct.category)?.name ??
    adminProduct.category;

  return (
    <GlassPrototypeFrame
      variant="A · Frosted Frame"
      summary="One calm translucent app frame keeps navigation, filters, cart totals, and owner rails light, while the food, orders, and editing surfaces stay solid and easy to scan."
    >
      <article
        aria-label={`${glassPrototypeBusiness.name} frosted app frame`}
        className="gp-glass mt-7 min-w-0 overflow-hidden rounded-[2rem] p-2 sm:p-3"
      >
        <header className="gp-glass-strong flex min-w-0 flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-stone-950 text-xs font-bold tracking-[0.12em] text-[#fff8ed]"
            >
              NX
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-stone-950 sm:text-base">
                {glassPrototypeBusiness.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-stone-500">
                Since {glassPrototypeBusiness.since} · Stall {glassPrototypeBusiness.stallUnit}
              </p>
            </div>
          </div>

          <nav
            aria-label="Prototype app navigation"
            className="gp-glass flex min-w-0 flex-wrap items-center gap-1 p-1"
          >
            {(["Home", "Menu", "Cart", "Admin"] as const).map((label) => (
              <button
                key={label}
                type="button"
                aria-current={label === "Home" ? "page" : undefined}
                className={`gp-chip min-h-11 px-3 text-xs sm:px-4 ${label === "Home" ? "bg-stone-900 text-white" : ""}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <span className="gp-chip min-h-11 shrink-0 self-start px-3 text-xs sm:self-auto">
            Read-only study
          </span>
        </header>

        <div className="min-w-0 divide-y divide-stone-900/10">
          <section
            aria-labelledby="glass-a-home-heading"
            className="min-w-0 px-3 py-8 sm:px-6 sm:py-10 lg:px-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="gp-kicker">01 · Home</p>
                <h2
                  id="glass-a-home-heading"
                  className="gp-display max-w-2xl text-3xl text-stone-950 sm:text-4xl"
                >
                  Familiar favourites, held in one quiet frame.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                  {glassPrototypeBusiness.heritage}
                </p>
              </div>
              <aside className="gp-glass min-w-0 p-3 sm:max-w-[15rem]">
                <p className="gp-kicker">At a glance</p>
                <p className="text-sm font-semibold text-stone-950">
                  Self-pickup at stall {glassPrototypeBusiness.stallUnit}
                </p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Guest checkout · {glassPrototypeBusiness.paymentsAccepted[0]}
                </p>
              </aside>
            </div>

            <div className="mt-7 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.85fr)]">
              <article className="gp-solid grid min-w-0 gap-5 p-4 sm:grid-cols-[minmax(9rem,0.7fr)_minmax(0,1.3fr)] sm:items-center sm:p-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[#f0e7d8]">
                  <ProductImage
                    src={heroProduct.image}
                    alt={`${heroProduct.name}, the featured dish in the home snapshot`}
                    width={heroProduct.imageWidth ?? 400}
                    height={heroProduct.imageHeight ?? 300}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 45vw, 35vw"
                    className="h-full w-full object-contain p-4"
                  />
                </div>
                <div className="min-w-0">
                  <p className="gp-kicker">Start with a classic</p>
                  <h3 className="gp-display text-2xl text-stone-950 sm:text-3xl">
                    {heroProduct.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {heroProduct.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold tabular-nums text-[#7b2c27]">
                      {productPrice(heroProduct)}
                    </span>
                    <button
                      type="button"
                      disabled
                      className="gp-primary min-h-11 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      Order for pickup
                    </button>
                  </div>
                </div>
              </article>

              <aside className="gp-glass flex min-w-0 flex-col p-4 sm:p-5">
                <p className="gp-kicker">The frame</p>
                <h3 className="gp-display text-2xl text-stone-950">
                  Glass where orientation helps.
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  A light navigation rail and a quiet pickup note create a
                  sense of place without putting a translucent layer between a
                  guest and the food.
                </p>
                <button
                  type="button"
                  disabled
                  className="gp-secondary mt-5 w-full px-4 text-sm disabled:cursor-not-allowed disabled:opacity-65"
                >
                  View pickup details
                </button>
              </aside>
            </div>

            <div className="mt-7">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="gp-kicker">Popular dishes</p>
                  <h3 className="gp-display text-2xl text-stone-950">
                    A short list to begin.
                  </h3>
                </div>
                <span className="gp-chip min-h-11 px-3 text-xs">
                  {glassPrototypeProducts.length} featured
                </span>
              </div>
              <ul className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {glassPrototypeProducts.map((product) => (
                  <FeaturedDish key={product.slug} product={product} />
                ))}
              </ul>
            </div>
          </section>

          <section
            aria-labelledby="glass-a-menu-heading"
            className="min-w-0 px-3 py-8 sm:px-6 sm:py-10 lg:px-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="gp-kicker">02 · Menu</p>
                <h2
                  id="glass-a-menu-heading"
                  className="gp-display text-3xl text-stone-950 sm:text-4xl"
                >
                  Browse the menu without leaving the frame.
                </h2>
              </div>
              <span className="gp-chip min-h-11 shrink-0 px-3 text-xs">
                {products.length} dishes · {categories.length} categories
              </span>
            </div>

            <div className="gp-glass mt-6 flex min-w-0 flex-wrap items-center gap-2 p-3">
              <span className="mr-1 text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                Filter
              </span>
              <button
                type="button"
                aria-pressed="true"
                className="gp-chip min-h-11 bg-stone-900 px-3 text-xs text-white"
              >
                All dishes
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  aria-pressed="false"
                  className="gp-chip min-h-11 px-3 text-xs"
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <MenuProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>

          <section
            aria-labelledby="glass-a-cart-heading"
            className="min-w-0 px-3 py-8 sm:px-6 sm:py-10 lg:px-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="gp-kicker">03 · Cart</p>
                <h2
                  id="glass-a-cart-heading"
                  className="gp-display text-3xl text-stone-950 sm:text-4xl"
                >
                  Keep the handoff obvious.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                  Solid order rows carry the meal details; a translucent summary
                  rail keeps the next step visible.
                </p>
              </div>
              <div className="gp-glass flex min-h-11 items-center gap-3 px-3 text-xs">
                <span className="font-semibold text-stone-600">
                  {cartProducts.length} items
                </span>
                <span aria-hidden="true" className="h-4 w-px bg-stone-900/15" />
                <span className="font-bold tabular-nums text-stone-950">
                  {formatCents(cartSubtotalCents)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(15rem,0.9fr)]">
              <div className="min-w-0">
                <div className="gp-solid min-w-0 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-stone-950">
                      Selected dishes
                    </h3>
                    <span className="gp-chip min-h-11 px-3 text-xs">
                      Read-only cart
                    </span>
                  </div>
                  <ul className="mt-2 divide-y divide-stone-900/10">
                    {cartProducts.map((product) => (
                      <CartLinePreview key={product.slug} product={product} />
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-900/10 pt-4">
                    <button
                      type="button"
                      disabled
                      className="gp-secondary min-h-11 px-3 text-xs disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      Adjust quantity
                    </button>
                    <p className="text-sm font-bold tabular-nums text-stone-950">
                      Subtotal {formatCents(cartSubtotalCents)}
                    </p>
                  </div>
                </div>

                <div className="gp-solid mt-5 min-w-0 p-4 sm:p-5">
                  <div>
                    <p className="gp-kicker">Form preview</p>
                    <h3 className="text-lg font-semibold text-stone-950">
                      Guest checkout details
                    </h3>
                  </div>
                  <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
                    <label className="block min-w-0 text-sm font-semibold text-stone-700" htmlFor="glass-a-guest-name">
                      Name
                      <input
                        id="glass-a-guest-name"
                        type="text"
                        readOnly
                        placeholder="Choose at checkout"
                        className="input mt-1"
                      />
                    </label>
                    <label className="block min-w-0 text-sm font-semibold text-stone-700" htmlFor="glass-a-pickup-slot">
                      Pickup slot
                      <input
                        id="glass-a-pickup-slot"
                        type="text"
                        readOnly
                        placeholder="Choose at checkout"
                        className="input mt-1"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <aside className="gp-glass-strong flex min-w-0 flex-col p-4 sm:p-5">
                <p className="gp-kicker">Cart summary</p>
                <h3 className="gp-display text-2xl text-stone-950">
                  Ready for the next step.
                </h3>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-stone-600">Subtotal</dt>
                    <dd className="font-bold tabular-nums text-stone-950">
                      {formatCents(cartSubtotalCents)}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-stone-600">Pickup</dt>
                    <dd className="text-right font-semibold text-stone-950">
                      Stall {glassPrototypeBusiness.stallUnit}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-t border-stone-900/10 pt-3">
                    <dt className="text-stone-600">Payment</dt>
                    <dd className="max-w-[10rem] text-right font-semibold text-stone-950">
                      {glassPrototypeBusiness.paymentsAccepted[0]}
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  disabled
                  className="gp-primary mt-6 min-h-11 w-full px-4 text-sm disabled:cursor-not-allowed disabled:opacity-65"
                >
                  Continue to checkout
                </button>
                <p className="mt-3 text-center text-xs leading-5 text-stone-500">
                  Preview only · guest checkout remains unchanged in the live app.
                </p>
              </aside>
            </div>
          </section>

          <section
            aria-labelledby="glass-a-admin-heading"
            className="min-w-0 px-3 py-8 sm:px-6 sm:py-10 lg:px-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="gp-kicker">04 · Admin</p>
                <h2
                  id="glass-a-admin-heading"
                  className="gp-display text-3xl text-stone-950 sm:text-4xl"
                >
                  Keep the owner rail close, not loud.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                  A narrow glass admin rail orients the workspace while order
                  rows and product editing remain opaque and operational.
                </p>
              </div>
              <span className="gp-chip min-h-11 shrink-0 px-3 text-xs">
                Demo workspace
              </span>
            </div>

            <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[minmax(10rem,0.7fr)_minmax(0,1.3fr)]">
              <aside className="gp-glass min-w-0 p-3 sm:p-4">
                <p className="gp-kicker px-1">Workspace</p>
                <nav aria-label="Prototype admin navigation" className="mt-2 grid gap-2">
                  {(["Overview", "Orders", "Products"] as const).map((label) => (
                    <button
                      key={label}
                      type="button"
                      aria-current={label === "Overview" ? "page" : undefined}
                      className={`gp-chip min-h-11 w-full justify-start px-3 text-sm ${label === "Overview" ? "bg-stone-900 text-white" : ""}`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
                <div className="mt-4 border-t border-stone-900/10 pt-4">
                  <p className="px-1 text-xs leading-5 text-stone-500">
                    Menu data stays shared with the customer-facing frame.
                  </p>
                </div>
              </aside>

              <div className="min-w-0 space-y-5">
                <div className="grid min-w-0 gap-3 sm:grid-cols-3">
                  {[
                    { label: "Menu items", value: products.length },
                    { label: "Categories", value: categories.length },
                    { label: "Demo orders", value: mockOrders.length },
                  ].map((stat) => (
                    <div key={stat.label} className="gp-solid min-w-0 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 font-display text-3xl text-stone-950">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <section className="gp-solid min-w-0 p-4 sm:p-5" aria-labelledby="glass-a-orders-heading">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="gp-kicker">Orders</p>
                      <h3 id="glass-a-orders-heading" className="text-lg font-semibold text-stone-950">
                        Pickup queue
                      </h3>
                    </div>
                    <span className="gp-chip min-h-11 px-3 text-xs">Sample rows</span>
                  </div>
                  <ul className="mt-2">
                    {mockOrders.map((order) => (
                      <AdminOrderRow key={order.id} order={order} />
                    ))}
                  </ul>
                </section>

                <section className="gp-solid min-w-0 p-4 sm:p-5" aria-labelledby="glass-a-editor-heading">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="gp-kicker">Products</p>
                      <h3 id="glass-a-editor-heading" className="text-lg font-semibold text-stone-950">
                        Edit menu item
                      </h3>
                    </div>
                    <span className="gp-chip min-h-11 px-3 text-xs">Read-only fields</span>
                  </div>
                  <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
                    <label className="block min-w-0 text-sm font-semibold text-stone-700" htmlFor="glass-a-product-name">
                      Name
                      <input
                        id="glass-a-product-name"
                        type="text"
                        readOnly
                        value={adminProduct.name}
                        className="input mt-1"
                      />
                    </label>
                    <label className="block min-w-0 text-sm font-semibold text-stone-700" htmlFor="glass-a-product-price">
                      Price
                      <input
                        id="glass-a-product-price"
                        type="text"
                        readOnly
                        value={productPrice(adminProduct)}
                        className="input mt-1"
                      />
                    </label>
                    <label className="block min-w-0 text-sm font-semibold text-stone-700 sm:col-span-2" htmlFor="glass-a-product-category">
                      Category
                      <select
                        id="glass-a-product-category"
                        disabled
                        defaultValue={adminProduct.category}
                        className="input mt-1 disabled:cursor-not-allowed disabled:opacity-75"
                      >
                        <option value={adminProduct.category}>{adminCategory}</option>
                      </select>
                    </label>
                    <label className="block min-w-0 text-sm font-semibold text-stone-700 sm:col-span-2" htmlFor="glass-a-product-description">
                      Description
                      <textarea
                        id="glass-a-product-description"
                        readOnly
                        defaultValue={adminProduct.description}
                        rows={3}
                        className="input mt-1 min-h-24 resize-none py-3"
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-900/10 pt-4">
                    <p className="text-xs leading-5 text-stone-500">
                      Prototype fields mirror the current product data.
                    </p>
                    <button
                      type="button"
                      disabled
                      className="gp-primary min-h-11 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      Save changes
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </article>
    </GlassPrototypeFrame>
  );
}
