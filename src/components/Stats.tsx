const Stats = () => {
  return (
    <section className="relative overflow-hidden px-4 py-20" aria-labelledby="methodology-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-background" aria-hidden="true" />
      <div className="container relative z-10 mx-auto">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/80 p-8 text-center shadow-sm backdrop-blur-sm">
          <h2 id="methodology-heading" className="mb-4 text-2xl font-bold md:text-3xl">
            Treat every projection as a planning estimate
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            BizRadar helps organize business ideas and compare planning scenarios. Some market values,
            scores, and forecasts are generated estimates and may not reflect verified, current
            conditions in a specific locality.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Validate demand, costs, regulations, and competitor information with local research
            and reliable sources before making financial or investment decisions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
