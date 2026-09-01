import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Icon } from "@/components/ui/Icon";
import { img } from "@/utils/images";

const CRAFT_STEPS = [
  {
    no: "01",
    title: "The stone is chosen",
    body: "Every gemstone is hand-selected by our gemologists for colour, clarity and light.",
  },
  {
    no: "02",
    title: "The setting is drawn",
    body: "Each piece begins as a drawing, then a wax model, refined over weeks.",
  },
  {
    no: "03",
    title: "Hands finish the story",
    body: "Setting, polishing and finishing are completed by hand in our atelier.",
  },
];

const STATS = [
  { value: "120+", label: "Hours per bridal piece" },
  { value: "36", label: "Master artisans" },
  { value: "94%", label: "Responsibly sourced metal" },
];

export function Craftsmanship() {
  return (
    <section className="bg-ivory-deep/60">
      <div className="container-jwel grid grid-cols-1 gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        {/* Image collage */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden bg-sand"
          >
            <ImageWithFallback
              src={img("ringCloseup", { w: 900, h: 1100 })}
              alt="A jeweller setting a diamond by hand"
              className="aspect-[4/5] w-full object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="absolute -bottom-10 -right-4 hidden w-48 overflow-hidden border-[6px] border-ivory-deep bg-sand sm:block lg:-right-10 lg:w-64"
          >
            <ImageWithFallback
              src={img("goldRingPair", { w: 500, h: 400 })}
              alt="Hand-finished gold bands"
              className="aspect-[5/4] w-full object-cover"
            />
          </motion.div>
        </div>

        {/* Text */}
        <div className="lg:py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.3em] text-gold-deep">
              The atelier
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-charcoal sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]">
              Craftsmanship is not a stage.
              <br />
              It is an obsession.
            </h2>
          </motion.div>

          <div className="mt-10 space-y-8">
            {CRAFT_STEPS.map((step, i) => (
              <motion.div
                key={step.no}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex gap-5"
              >
                <span className="font-display text-2xl font-light text-gold-deep/70">{step.no}</span>
                <div>
                  <h3 className="font-display text-xl font-medium text-charcoal">{step.title}</h3>
                  <p className="mt-1.5 font-body text-[0.88rem] font-light leading-relaxed text-stone">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-charcoal/10 pt-8"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-medium text-charcoal sm:text-3xl">{stat.value}</p>
                <p className="mt-1 font-body text-[0.68rem] font-light leading-snug text-stone">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 inline-flex items-center gap-2 font-body text-xs font-light text-stone"
          >
            <Icon name="check" size={14} className="text-gold-deep" />
            Hallmarked &amp; certified in-house
          </motion.p>
        </div>
      </div>
    </section>
  );
}