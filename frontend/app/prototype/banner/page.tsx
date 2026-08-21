import Image from "next/image";
import Link from "next/link";
import { business } from "@/data/business";
import { BannerPrototypeSwitcher } from "@/components/prototype/BannerPrototypeSwitcher";

type BannerVariant = "A" | "B" | "C";

function HeroCopy({ dark = true }: { dark?: boolean }) {
  return (
    <>
      <p
        className={`text-xs font-extrabold uppercase tracking-[0.2em] ${dark ? "text-red-100" : "text-brand-dark"}`}
      >
        Whampoa · Since {business.since}
      </p>
      <h1 className="mt-3 max-w-xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-6xl">
        Chicken rice, ready for pickup.
      </h1>
      <p
        className={`mt-5 max-w-lg text-base font-medium leading-7 sm:text-lg ${dark ? "text-stone-100" : "text-stone-700"}`}
      >
        Tender chicken, fragrant rice, and our signature dry laksa from Stall{" "}
        {business.stallUnit}.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href="/menu" className="btn-primary min-h-12 px-6">
          Order now <span aria-hidden="true">→</span>
        </Link>
        <Link
          href="/#pickup"
          className={
            dark
              ? "inline-flex min-h-12 items-center border border-white/70 px-5 font-semibold text-white outline-none hover:bg-white hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-white"
              : "btn-secondary min-h-12"
          }
        >
          Choose pickup time
        </Link>
      </div>
    </>
  );
}

function Continuation() {
  return (
    <section className="border-b border-stone-900/10 py-10 sm:py-14">
      <p className="page-kicker">Pickup</p>
      <h2 className="section-title text-3xl sm:text-[2.5rem]">
        Choose a pickup time
      </h2>
      <p className="mt-3 text-base font-medium text-stone-700">
        Please order at least 6 hours ahead.
      </p>
    </section>
  );
}

function VariantA() {
  return (
    <div className="-mt-6 sm:-mt-8">
      <section className="relative left-1/2 min-h-[36rem] w-screen -translate-x-1/2 overflow-hidden bg-stone-950 text-white lg:min-h-[42rem]">
        <Image
          src="/images/landing-chicken-rice-hero.jpg"
          alt="Hainanese chicken rice with cucumber, chilli and dark soy sauce"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-stone-950/25" />
        <div className="relative mx-auto flex min-h-[36rem] w-full max-w-7xl flex-col justify-end px-5 py-10 sm:px-10 lg:min-h-[42rem] lg:px-8 lg:py-16">
          <HeroCopy />
        </div>
      </section>
      <Continuation />
    </div>
  );
}

function VariantB() {
  return (
    <div className="-mt-6 sm:-mt-8">
      <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#3b1e16] text-white">
        <div className="mx-auto grid min-h-[38rem] max-w-7xl lg:grid-cols-[minmax(24rem,0.82fr)_minmax(0,1.18fr)]">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-8">
            <HeroCopy />
          </div>
          <div className="relative min-h-[24rem] overflow-hidden lg:min-h-full">
            <Image
              src="/images/landing-chicken-rice-hero.jpg"
              alt="Hainanese chicken rice with cucumber, chilli and dark soy sauce"
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover object-[66%_center]"
            />
          </div>
        </div>
      </section>
      <Continuation />
    </div>
  );
}

function VariantC() {
  return (
    <div className="-mt-2 sm:-mt-3">
      <section className="grid min-h-[35rem] overflow-hidden border-y border-stone-900/10 bg-surface lg:grid-cols-[minmax(22rem,0.78fr)_minmax(0,1.22fr)]">
        <div className="flex flex-col justify-center px-6 py-12 text-stone-950 sm:px-10 lg:px-12">
          <HeroCopy dark={false} />
        </div>
        <div className="relative min-h-[25rem] bg-paper lg:min-h-full">
          <Image
            src="/images/landing-chicken-rice-hero.jpg"
            alt="Hainanese chicken rice with cucumber, chilli and dark soy sauce"
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-[66%_center]"
          />
        </div>
      </section>
      <Continuation />
    </div>
  );
}

/** Three throwaway banner directions, switchable via ?variant=A|B|C. */
export default async function BannerPrototypePage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>;
}) {
  const requested = (await searchParams).variant?.toUpperCase();
  const variant: BannerVariant =
    requested === "B" || requested === "C" ? requested : "A";

  return (
    <>
      {variant === "A" ? <VariantA /> : null}
      {variant === "B" ? <VariantB /> : null}
      {variant === "C" ? <VariantC /> : null}
      <BannerPrototypeSwitcher current={variant} />
    </>
  );
}
