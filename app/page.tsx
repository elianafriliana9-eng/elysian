import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

async function fetchLandingData() {
  try {
    const sb = await createClient();

    const [
      { data: heroStats },
      { data: marqueeItems },
      { data: processSteps },
      { data: services },
      { data: servicePoints },
      { data: portfolioProjects },
      { data: portfolioTech },
      { data: pricingPlans },
      { data: pricingFeatures },
      { data: testimonials },
      { data: siteSettings },
    ] = await Promise.all([
      sb.from("hero_stats").select("*").order("sort_order"),
      sb.from("marquee_items").select("*").eq("is_active", true).order("sort_order"),
      sb.from("process_steps").select("*").order("sort_order"),
      sb.from("services").select("*").eq("is_active", true).order("sort_order"),
      sb.from("service_points").select("*").order("sort_order"),
      sb.from("portfolio_projects").select("*").eq("is_visible", true).order("sort_order"),
      sb.from("portfolio_tech").select("*").order("sort_order"),
      sb.from("pricing_plans").select("*").order("sort_order"),
      sb.from("pricing_features").select("*").order("sort_order"),
      sb.from("testimonials").select("*").eq("is_visible", true).order("sort_order"),
      sb.from("site_settings").select("*"),
    ]);

    // Merge service points into services
    const mergedServices = (services ?? []).map((s) => ({
      ...s,
      points: (servicePoints ?? [])
        .filter((p) => p.service_id === s.id)
        .map((p) => p.text as string),
    }));

    // Merge tech into portfolio projects
    const mergedPortfolio = (portfolioProjects ?? []).map((p) => ({
      ...p,
      tech: (portfolioTech ?? [])
        .filter((t) => t.project_id === p.id)
        .map((t) => t.tech as string),
    }));

    // Merge features into pricing plans
    const mergedPlans = (pricingPlans ?? []).map((p) => ({
      ...p,
      features: (pricingFeatures ?? [])
        .filter((f) => f.plan_id === p.id)
        .map((f) => f.text as string),
    }));

    // Convert site_settings array to Record
    const settings: Record<string, string> = {};
    (siteSettings ?? []).forEach((s) => { settings[s.key] = s.value; });

    return {
      heroStats:  (heroStats ?? []).map((s) => ({ value: s.value as string, label: s.label as string })),
      marqueeItems: (marqueeItems ?? []).map((i) => i.text as string),
      processSteps: (processSteps ?? []).map((s) => ({ title: s.title as string, description: s.description as string })),
      services:   mergedServices,
      portfolio:  mergedPortfolio,
      plans:      mergedPlans,
      testimonials: testimonials ?? [],
      settings,
    };
  } catch {
    return null;
  }
}

export default async function Home() {
  const data = await fetchLandingData();

  return (
    <>
      <Navbar />
      <main>
        <Hero        stats={data?.heroStats} />
        <MarqueeStrip items={data?.marqueeItems} />
        <Services    services={data?.services} />
        <Process     steps={data?.processSteps} />
        <Portfolio   projects={data?.portfolio} />
        <Pricing     plans={data?.plans} />
        <Testimonials testimonials={data?.testimonials} />
        <Contact     settings={data?.settings} />
      </main>
      <Footer />
    </>
  );
}
