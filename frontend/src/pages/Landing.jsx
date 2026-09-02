import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, ClipboardList, Key, Settings2, ChevronDown, CheckCircle2,
  ArrowRight, Bed, Ruler, MapPin,
} from "lucide-react";
import HeroNavbar from "../components/HeroNavbar";
import { getAllProperties } from "../api/properties";
import { getAllUnits } from "../api/units";

const C = {
  teal: "#0D5C58",
  dark: "#163B3A",
  bg: "#FAF9F6",
  sage: "#E8F0EA",
  softBlue: "#EDF5F5",
  beige: "#F3EDE3",
  gold: "#C89B5B",
  secondary: "#536563",
  footer: "#092F2E",
};

/* ---------------------------- Hero ---------------------------- */

function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
      <img
        src="/hero-neighborhood.jpg"
        alt="A quiet residential neighborhood street"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(9,30,30,0.16) 0%, rgba(9,30,30,0.02) 30%, rgba(9,30,30,0.04) 68%, rgba(9,30,30,0.32) 100%)" }}
      />

      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-14">
        <div className="absolute top-[24%] right-6 md:right-14 max-w-md text-right">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.0] text-white"
            style={{ textShadow: "0 2px 24px rgba(9,30,30,0.35)" }}
          >
            Home is where
            <br /> our story begins.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90" style={{ textShadow: "0 1px 12px rgba(9,30,30,0.3)" }}>
            Find a place to call home.
          </p>
          <div className="mt-8 flex justify-end items-center gap-5 flex-wrap">
            <a href="#how-it-works" className="text-sm font-medium text-white/85 hover:text-white transition-colors">
              How Rentora Works
            </a>
            <Link
              to="/properties"
              className="px-7 py-3.5 text-sm font-medium transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: C.teal, color: "#fff", borderRadius: "10px" }}
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 text-white/85">
        <span className="text-xs tracking-[0.2em] uppercase">Scroll to explore</span>
        <ChevronDown size={18} className="animate-bounce" />
      </div>
    </section>
  );
}

/* -------------------------- Intro / journey -------------------------- */

function Introduction() {
  const steps = [
    { icon: Search, label: "Discover" },
    { icon: ClipboardList, label: "Apply" },
    { icon: Key, label: "Rent" },
    { icon: Settings2, label: "Manage" },
  ];
  return (
    <section id="how-it-works" className="py-28 md:py-36" style={{ backgroundColor: C.bg }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-xs font-medium tracking-[0.15em] uppercase" style={{ color: C.gold }}>The Rental Journey</span>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold" style={{ color: C.dark }}>A better way to rent.</h2>
        <p className="mt-5 text-lg max-w-2xl mx-auto" style={{ color: C.secondary }}>
          From finding your next home to managing everything that comes after, Rentora keeps
          the rental journey simple and connected.
        </p>

        <div className="mt-16 flex items-center justify-center gap-2 md:gap-4">
          {steps.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-3">
                <div
                  className="h-14 w-14 rounded-full flex items-center justify-center"
                  style={{ border: `1.5px solid ${C.teal}`, color: C.teal }}
                >
                  <s.icon size={20} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium" style={{ color: C.dark }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-10 md:w-16 h-px" style={{ backgroundColor: "#D8E2DD" }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Product UI mockups -------------------------- */

function MockDiscoveryUI() {
  return (
    <div className="rounded-2xl p-5 w-full max-w-md" style={{ backgroundColor: "#fff", boxShadow: "0 24px 48px -24px rgba(22,59,58,0.28)" }}>
      <div className="h-9 rounded-lg mb-3 flex items-center px-3 text-xs" style={{ backgroundColor: C.bg, color: C.secondary, border: "1px solid #E5E1D6" }}>
        <Search size={13} className="mr-2" /> Search by location or property name
      </div>
      {[
        { name: "Sunrise Residences", loc: "Bangalore", spec: "2 BHK · 2 Bath", price: "₹18,000" },
        { name: "Green Heights", loc: "Bangalore", spec: "1 BHK · 1 Bath", price: "₹14,500" },
      ].map((p) => (
        <div key={p.name} className="flex items-center justify-between rounded-xl p-3 mb-2" style={{ backgroundColor: C.bg }}>
          <div className="h-11 w-11 rounded-lg shrink-0" style={{ background: `linear-gradient(135deg, ${C.softBlue}, ${C.sage})` }} />
          <div className="flex-1 min-w-0 px-3">
            <p className="text-xs font-semibold truncate" style={{ color: C.dark }}>{p.name}</p>
            <p className="text-[11px]" style={{ color: C.secondary }}>{p.loc} · {p.spec}</p>
          </div>
          <span className="text-xs font-medium shrink-0" style={{ color: C.teal }}>{p.price}</span>
        </div>
      ))}
    </div>
  );
}

function MockApplicationUI() {
  return (
    <div className="rounded-2xl p-5 w-full max-w-md" style={{ backgroundColor: "#fff", boxShadow: "0 24px 48px -24px rgba(22,59,58,0.28)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold" style={{ color: C.dark }}>Sunrise Residences — Unit 302</p>
          <p className="text-xs mt-0.5" style={{ color: C.secondary }}>Monthly rent ₹18,000</p>
        </div>
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#FDF3E3", color: "#A9761F" }}>PENDING</span>
      </div>
      <div className="space-y-4 mt-5">
        {["Application submitted", "Under review", "Approved"].map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: i < 1 ? C.teal : "#D8E2DD" }}
            />
            <span className="text-xs" style={{ color: i < 1 ? C.dark : C.secondary }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockTenantDashboardUI() {
  return (
    <div className="rounded-2xl p-5 w-full max-w-md" style={{ backgroundColor: "#fff", boxShadow: "0 24px 48px -24px rgba(22,59,58,0.28)" }}>
      <p className="text-xs font-medium mb-4" style={{ color: C.secondary }}>My Home</p>
      <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: C.bg }}>
        <div className="flex justify-between text-xs"><span style={{ color: C.secondary }}>Monthly Rent</span><span style={{ color: C.dark }} className="font-medium">₹18,000</span></div>
        <div className="flex justify-between text-xs mt-2"><span style={{ color: C.secondary }}>Next Payment</span><span style={{ color: C.dark }} className="font-medium">Sep 5</span></div>
      </div>
      <p className="text-xs font-medium mt-4 mb-2" style={{ color: C.secondary }}>Recent Payments</p>
      {["Aug 2026", "Jul 2026"].map((m) => (
        <div key={m} className="flex items-center justify-between text-xs py-1.5">
          <span style={{ color: C.dark }}>{m}</span>
          <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#E6F3EC", color: "#1E7A4C" }}>Paid</span>
        </div>
      ))}
    </div>
  );
}

function MockMaintenanceUI() {
  return (
    <div className="rounded-2xl p-5 w-full max-w-md" style={{ backgroundColor: "#fff", boxShadow: "0 24px 48px -24px rgba(22,59,58,0.28)" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold" style={{ color: C.dark }}>Air conditioning issue</p>
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#FDF3E3", color: "#A9761F" }}>MEDIUM</span>
      </div>
      <p className="text-xs mb-4" style={{ color: C.secondary }}>Unit 302 · Status: IN PROGRESS</p>
      <div className="space-y-4">
        {["Request created", "Owner started request", "Resolved"].map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: i < 2 ? C.teal : "#D8E2DD" }} />
            <span className="text-xs" style={{ color: i < 2 ? C.dark : C.secondary }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------- Why Rentora -------------------------- */

function FeatureRow({ number, title, description, visual, reverse }) {
  const textBlock = (
    <div className="flex-1 max-w-md">
      <span className="text-sm font-medium" style={{ color: C.gold }}>{number}</span>
      <h3 className="mt-2 text-3xl md:text-4xl font-semibold leading-tight" style={{ color: C.dark }}>{title}</h3>
      <p className="mt-4 text-base md:text-lg leading-relaxed" style={{ color: C.secondary }}>{description}</p>
    </div>
  );
  const visualBlock = <div className="flex-1 flex justify-center">{visual}</div>;

  return (
    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 py-16 md:py-20">
      {reverse ? (<>{visualBlock}{textBlock}</>) : (<>{textBlock}{visualBlock}</>)}
    </div>
  );
}

function WhyRentora() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: C.bg }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-6">
          <span className="text-xs font-medium tracking-[0.15em] uppercase" style={{ color: C.gold }}>Why Rentora</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold max-w-2xl mx-auto" style={{ color: C.dark }}>
            Everything you need for a simpler rental journey.
          </h2>
        </div>

        <div className="divide-y" style={{ borderColor: "#E5E1D6" }}>
          <FeatureRow
            number="01"
            title="Find a place that feels like home."
            description="Explore properties and available units with the details you need to make a confident rental decision."
            visual={<MockDiscoveryUI />}
          />
          <FeatureRow
            number="02" reverse
            title="Rent without the hassle."
            description="Apply for a unit digitally and follow your application from submission to approval."
            visual={<MockApplicationUI />}
          />
          <FeatureRow
            number="03"
            title="Everything in one place."
            description="Keep your rental agreement, payment history and important rental information organized in one place."
            visual={<MockTenantDashboardUI />}
          />
          <FeatureRow
            number="04" reverse
            title="Help when you need it."
            description="Raise maintenance requests and follow their progress without having to manage everything manually."
            visual={<MockMaintenanceUI />}
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------- For Owners -------------------------- */

function ForOwners() {
  const capabilities = [
    "Manage properties and units", "Review rental applications",
    "Manage rental agreements", "Track rental payments", "Handle maintenance requests",
  ];
  return (
    <section id="for-owners" className="py-24 md:py-32" style={{ backgroundColor: C.sage }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-medium tracking-[0.15em] uppercase" style={{ color: C.gold }}>For Owners</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight" style={{ color: C.dark }}>
            Manage your properties with ease.
          </h2>
          <p className="mt-5 text-base md:text-lg leading-relaxed" style={{ color: C.secondary }}>
            From properties and units to tenants, payments and maintenance, Rentora gives
            property owners one place to manage their rentals.
          </p>
          <div className="mt-7 space-y-2.5">
            {capabilities.map((c) => (
              <div key={c} className="flex items-center gap-2.5 text-sm" style={{ color: C.dark }}>
                <CheckCircle2 size={16} style={{ color: C.teal }} />
                {c}
              </div>
            ))}
          </div>
          <div className="mt-9 flex items-center gap-5">
            <Link to="/register" className="px-6 py-3 text-sm font-medium text-white" style={{ backgroundColor: C.teal, borderRadius: "10px" }}>
              Manage Your Properties
            </Link>
            <Link to="/login" className="text-sm font-medium" style={{ color: C.teal }}>Already using Rentora? Login</Link>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: "#fff", boxShadow: "0 30px 60px -30px rgba(22,59,58,0.3)" }}>
          <p className="text-xs font-medium mb-4" style={{ color: C.secondary }}>Owner Dashboard — Good morning, Alex.</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[["Properties", "8"], ["Units", "32"], ["Occupied", "27"], ["Available", "5"]].map(([l, v]) => (
              <div key={l} className="rounded-xl p-2.5" style={{ backgroundColor: C.bg }}>
                <p className="text-[9px]" style={{ color: C.secondary }}>{l}</p>
                <p className="text-base font-semibold mt-1" style={{ color: C.dark }}>{v}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[["Expected Rent", "₹4.8L"], ["Collected", "₹4.2L"], ["Pending", "₹60K"]].map(([l, v]) => (
              <div key={l} className="rounded-xl p-2.5" style={{ backgroundColor: C.bg }}>
                <p className="text-[9px]" style={{ color: C.secondary }}>{l}</p>
                <p className="text-sm font-semibold mt-1" style={{ color: C.dark }}>{v}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-3" style={{ backgroundColor: C.bg }}>
            <p className="text-[11px] mb-2" style={{ color: C.secondary }}>Recent Applications</p>
            {["Rahul Sharma — Sunrise Apartments", "Priya Nair — Green Heights"].map((a) => (
              <div key={a} className="flex justify-between text-[11px] py-1">
                <span style={{ color: C.dark }}>{a}</span>
                <span style={{ color: C.gold }}>Pending</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Featured Properties -------------------------- */

function FeaturedProperties() {
  const [properties, setProperties] = useState(null);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    Promise.all([getAllProperties(), getAllUnits()])
      .then(([p, u]) => { setProperties(p.slice(0, 3)); setUnits(u); })
      .catch(() => setProperties([]));
  }, []);

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: C.bg }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-semibold" style={{ color: C.dark }}>Find your next home.</h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: C.secondary }}>
            Explore available properties and discover a place that feels right for you.
          </p>
        </div>

        {properties === null ? (
          <p className="text-center text-sm" style={{ color: C.secondary }}>Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-sm" style={{ color: C.secondary }}>No properties listed yet — check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {properties.map((p) => {
              const propUnits = units.filter((u) => u.propertyId === p.id);
              const available = propUnits.filter((u) => u.status === "AVAILABLE").length;
              const minRent = propUnits.length ? Math.min(...propUnits.map((u) => Number(u.monthlyRent))) : null;
              return (
                <Link key={p.id} to={`/properties/${p.id}`} className="group">
                  <div className="rounded-2xl overflow-hidden transition-transform group-hover:-translate-y-1" style={{ backgroundColor: "#fff", boxShadow: "0 20px 40px -28px rgba(22,59,58,0.3)" }}>
                    <div className="h-44 overflow-hidden">
                      <div className="w-full h-full transition-transform duration-500 group-hover:scale-105" style={{ background: `linear-gradient(135deg, ${C.softBlue}, ${C.beige})` }} />
                    </div>
                    <div className="p-5">
                      <p className="text-base font-semibold" style={{ color: C.dark }}>{p.title}</p>
                      <p className="text-xs mt-1 flex items-center gap-1" style={{ color: C.secondary }}>
                        <MapPin size={11} /> {p.city}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: C.secondary }}>
                        {propUnits[0] && (
                          <>
                            <span className="flex items-center gap-1"><Bed size={12} /> {propUnits.length} units</span>
                            <span className="flex items-center gap-1"><Ruler size={12} /> {available} available</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-end justify-between mt-4">
                        {minRent !== null ? (
                          <div>
                            <span className="text-xl font-semibold" style={{ color: C.dark }}>₹{minRent.toLocaleString("en-IN")}</span>
                            <span className="text-xs" style={{ color: C.secondary }}>/month</span>
                          </div>
                        ) : <span />}
                        <span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: C.sage, color: C.teal }}>View Details</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium"
            style={{ border: `1.5px solid ${C.teal}`, color: C.teal, borderRadius: "10px" }}
          >
            Explore All Properties <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Final CTA + Footer -------------------------- */

function FinalCta() {
  return (
    <section className="py-20 md:py-24" style={{ backgroundColor: C.softBlue }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold" style={{ color: C.dark }}>Your next chapter starts here.</h2>
        <p className="mt-4 text-base md:text-lg" style={{ color: C.secondary }}>
          Whether you're looking for a place to call home or managing one, Rentora keeps the rental journey simple.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <Link to="/properties" className="px-6 py-3 text-sm font-medium text-white" style={{ backgroundColor: C.teal, borderRadius: "10px" }}>
            Explore Properties
          </Link>
          <Link to="/register" className="px-6 py-3 text-sm font-medium" style={{ border: `1.5px solid ${C.teal}`, color: C.teal, borderRadius: "10px" }}>
            Manage Your Property
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pt-16 pb-8" style={{ backgroundColor: C.footer }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <span className="text-lg font-semibold text-white tracking-wide">RENTORA</span>
          <p className="text-sm text-white/60 mt-3 max-w-xs">Making renting simpler for everyone. Find, manage and enjoy your home with Rentora.</p>
        </div>
        {[
          { h: "Explore", items: ["Properties", "Available Units"] },
          { h: "For Owners", items: ["Manage Properties", "How Rentora Works"] },
          { h: "Company", items: ["About", "Contact"] },
        ].map((col) => (
          <div key={col.h}>
            <p className="text-xs font-medium tracking-wide text-white/50 uppercase">{col.h}</p>
            <div className="mt-3 space-y-2">
              {col.items.map((i) => <p key={i} className="text-sm text-white/70">{i}</p>)}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 text-xs text-white/40" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        © 2026 Rentora. All rights reserved.
      </div>
    </footer>
  );
}

/* -------------------------- Root -------------------------- */

export default function Landing() {
  return (
    <div style={{ backgroundColor: C.bg }}>
      <HeroNavbar />
      <Hero />
      <Introduction />
      <WhyRentora />
      <ForOwners />
      <FeaturedProperties />
      <FinalCta />
      <Footer />
    </div>
  );
}
