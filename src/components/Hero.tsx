import heroImage from "../assets/hero-reform-green.png";

type HeroProps = {
  title: string;
  subtitle?: string;
  kicker?: string;
};

export default function Hero({ title, subtitle, kicker }: HeroProps) {
  return (
    <section
      className="hero"
      role="banner"
      aria-label="Site introduction"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero__overlay" />
      <div className="hero__content container">
        {kicker ? <div className="hero__kicker">{kicker}</div> : null}
        <h1>{title}</h1>
        {subtitle ? <p className="hero__subtitle">{subtitle}</p> : null}
      </div>
    </section>
  );
}
