import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, ShoppingBag, MessageCircle, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { LumiereHeader } from "../components/lumiere/LumiereHeader";
import { LumiereHero } from "../components/lumiere/LumiereHero";
import { LumiereWhyItMatters } from "../components/lumiere/LumiereWhyItMatters";
import { LumiereBentoGrid } from "../components/lumiere/LumiereBentoGrid";
import { LumiereAIStylist } from "../components/lumiere/LumiereAIStylist";
import { LumiereHowItWorks } from "../components/lumiere/LumiereHowItWorks";
import { LumiereFooter } from "../components/lumiere/LumiereFooter";

export function LumierePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <LumiereHeader />
      <LumiereHero />
      <LumiereWhyItMatters />
      <LumiereBentoGrid />
      <LumiereAIStylist />
      <LumiereHowItWorks />
      <LumiereFooter />
    </div>
  );
}

