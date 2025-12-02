import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Users, Calendar, Zap, CheckCircle, ArrowRight, MessageCircle, FileText, Sparkles } from "lucide-react";
import LiquidEther from "../components/LiquidEther";
import { LoginModal } from "../components/LoginModal";

export function HomePage() {
  const { t } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isAuthenticated = () => {
    return !!localStorage.getItem("access_token");
  };

  const handleFindTeammate = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      setShowLoginModal(true);
    } else {
      window.location.href = "/talents";
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* === 1. HERO SECTION === */}
      <div className="relative overflow-hidden border-b border-slate-800 min-h-screen flex items-center">
        {/* Liquid Ether Background */}
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        {/* Gradient overlay для лучшей читаемости текста */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/70 pointer-events-none" />
        <div className="relative z-[2] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight text-white tracking-tight">
              {t("hero_title", "Don't build alone.")}
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t("hero_subtitle", "The central platform for Kazakhstan's tech ecosystem. We aggregate every hackathon from Astana Hub, NU, and KBTU, and match you with top talent to form successful teams.")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/events"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-lg"
              >
                <Calendar size={20} />
                {t("browse_active_events", "Browse 42 Active Events")}
              </Link>
              <button
                onClick={handleFindTeammate}
                className="px-8 py-4 bg-transparent border-2 border-blue-500/50 hover:border-blue-400/70 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg backdrop-blur-sm"
              >
                <Users size={20} />
                {t("find_teammate", "Find a Teammate")}
              </button>
            </div>

            {/* Trust Badge */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-base md:text-lg text-slate-400">
                {t("used_by_students", "Used by students from")}
              </p>
              <div className="flex items-center gap-6 opacity-70">
                <div className="text-base md:text-lg font-semibold text-slate-300">NU</div>
                <div className="w-px h-5 bg-slate-700"></div>
                <div className="text-base md:text-lg font-semibold text-slate-300">AITU</div>
                <div className="w-px h-5 bg-slate-700"></div>
                <div className="text-base md:text-lg font-semibold text-slate-300">KBTU</div>
                <div className="w-px h-5 bg-slate-700"></div>
                <div className="text-base md:text-lg font-semibold text-slate-300">IITU</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* === 2. WHAT IS EVENTHUB === */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center tracking-tight">
          {t("what_is_eventhub", "What is EventHub?")}
        </h2>
        <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
          <p>
            {t("what_is_eventhub_p1", "EventHub solves a real problem: students and developers in Kazakhstan spend hours scrolling through dozens of Telegram channels, trying to find hackathons, teammates, and opportunities. Information is scattered, deadlines are missed, and great teams never form.")}
          </p>
          <p>
            {t("what_is_eventhub_p2", "We aggregate every tech event from Astana Hub, university portals, and community channels into one clean feed. Then, we use AI to match you with teammates who have complementary skills, similar interests, and the right vibe. No more cold DMs. No more \"looking for a dev\" posts that go unanswered.")}
          </p>
          <p>
            {t("what_is_eventhub_p3", "EventHub is the bridge between Kazakhstan's tech youth and real opportunities. Whether you're a student looking for your first hackathon team or a founder recruiting for a startup, we make it happen in minutes, not weeks.")}
          </p>
        </div>
      </section>

      {/* === 3. HOW IT WORKS === */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center tracking-tight">
            {t("how_it_works_title", "How it works")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                <FileText size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t("step1_how_title", "Tell us about yourself")}</h3>
              <p className="text-slate-400 leading-relaxed">
                {t("step1_how_desc", "Upload your resume, tag your skills, and share your interests. We parse your experience automatically and build your profile in seconds.")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t("step2_how_title", "We match you")}</h3>
              <p className="text-slate-400 leading-relaxed">
                {t("step2_how_desc", "Our AI analyzes skills, interests, experience levels, and psychotype to find teammates who complement you. See compatibility scores for every match.")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                <Zap size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t("step3_how_title", "Ship and win")}</h3>
              <p className="text-slate-400 leading-relaxed">
                {t("step3_how_desc", "Join a team, discover hackathons, and build something real. From idea to MVP in one weekend. From solo to squad in one click.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === 4. TEAM MATCHING === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              {t("smart_matching_title", "Smart team matching")}
            </h2>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              {t("smart_matching_desc", "We don't just match keywords. We match people. Our algorithm analyzes skills, interests, experience levels, and even communication styles to find teammates who actually work well together.")}
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">{t("compatibility_scoring", "Compatibility scoring")}</h4>
                  <p className="text-slate-400 text-sm">{t("compatibility_scoring_desc", "See a percentage match based on skills overlap, role complement, and interest alignment.")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">{t("ai_suggestions", "AI-powered suggestions")}</h4>
                  <p className="text-slate-400 text-sm">{t("ai_suggestions_desc", "Get personalized recommendations for teammates who fit your project goals and working style.")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">{t("instant_connections", "Instant connections")}</h4>
                  <p className="text-slate-400 text-sm">{t("instant_connections_desc", "Chat directly, share profiles, and form teams without leaving the platform.")}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div>
                  <h3 className="text-white font-bold">Aliya S.</h3>
                  <p className="text-slate-400 text-sm">AITU '25</p>
                </div>
              </div>
              <div className="text-sm font-bold text-green-400">94% Match</div>
            </div>
            <div className="mb-4">
              <span className="inline-block px-2 py-1 bg-slate-800 rounded text-xs text-white font-medium mb-3">
                Product Designer
              </span>
              <p className="text-slate-300 text-sm mb-4">Looking for a teammate for Forte Bank hackathon. Need a backend developer.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded">Figma</span>
                <span className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded">UX Research</span>
                <span className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded">Blender</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                <MessageCircle size={16} /> {t("chat", "Chat")}
              </button>
              <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-lg text-sm font-semibold transition border border-slate-700">
                {t("profile", "Profile")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* === 5. EVENTS CATALOG === */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {t("events_catalog_title", "Events catalog")}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t("events_catalog_desc", "We automatically parse events from universities and tech hubs. No more scrolling Telegram channels.")}
            </p>
          </div>
          <div className="grid gap-4 max-w-4xl mx-auto">
            <div className="group flex flex-col md:flex-row bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition">
              <div className="bg-slate-800 w-full md:w-32 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-700">
                <Calendar className="text-blue-400 mb-2" size={24} />
                <span className="text-white font-bold text-sm">Apr 15-17</span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-1 block">
                      Hackathon • NU
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition mb-2">
                      HackNU 2025
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">Nazarbayev University • Astana • Offline</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">AI</span>
                      <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">HealthTech</span>
                      <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">Student</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 flex items-center justify-center bg-slate-900/50">
                <button className="px-4 py-2 bg-white text-slate-900 font-semibold rounded-lg hover:bg-blue-50 transition w-full md:w-auto">
                  {t("find_team", "Find Team")}
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              {t("view_all_events", "View all events")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* === 6. TEAMS & OPEN POSITIONS === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {t("teams_positions_title", "Teams & open positions")}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t("teams_positions_desc", "Teams post openings. You apply with one click. See your compatibility score before you commit.")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Frontend Developer</h3>
                <p className="text-sm text-slate-400 mb-3">Astana Hub Hackathon Team</p>
                <p className="text-slate-300 text-sm">Building an AI-powered queue system. Need React expertise.</p>
              </div>
              <div className="text-sm font-bold text-blue-400">Good Match</div>
            </div>
            <div className="flex gap-2 mb-4">
              <span className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded">React</span>
              <span className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded">TypeScript</span>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
              {t("apply_now", "Apply Now")}
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">UI/UX Designer</h3>
                <p className="text-sm text-slate-400 mb-3">AI Mini-Project</p>
                <p className="text-slate-300 text-sm">Weekend sprint. Looking for someone who knows Figma.</p>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <span className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded">Figma</span>
              <span className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded">Design Systems</span>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
              {t("apply_now", "Apply Now")}
            </button>
          </div>
        </div>
      </section>

      {/* === 8. WHY EVENTHUB MATTERS === */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center tracking-tight">
          {t("why_matters_title", "Why EventHub matters for Kazakhstan")}
        </h2>
        <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
          <p>
            {t("why_matters_p1", "Kazakhstan's tech ecosystem is growing fast, but it's fragmented. Students at NU don't know about hackathons at AITU. Developers in Almaty miss opportunities in Astana. Great ideas die because teams never form.")}
          </p>
          <p>
            {t("why_matters_p2", "EventHub connects the dots. We unite tech youth across universities, cities, and communities. We support hackathon culture by making it easier to find teams and events. We help colleges build stronger tech communities by giving students a platform to collaborate, not just compete.")}
          </p>
          <p>
            {t("why_matters_p3", "Most importantly, we reduce friction. Creating a team should take minutes, not weeks. Finding a hackathon should be one search, not fifty Telegram channels. EventHub makes Kazakhstan's tech ecosystem accessible, connected, and ready to build.")}
          </p>
        </div>
      </section>

      {/* === 10. FAQ === */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center tracking-tight">
          {t("faq_title", "Frequently asked questions")}
        </h2>
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-6">
            <h3 className="text-xl font-bold text-white mb-2">{t("faq_matching", "How does matching work?")}</h3>
            <p className="text-slate-400">
              {t("faq_matching_answer", "We analyze your skills, interests, experience level, and communication style. The algorithm calculates a compatibility score (0-100%) based on skill overlap, role complement, and interest alignment. Higher scores mean better team fit.")}
            </p>
          </div>
          <div className="border-b border-slate-800 pb-6">
            <h3 className="text-xl font-bold text-white mb-2">{t("faq_parsing", "How are events parsed?")}</h3>
            <p className="text-slate-400">
              {t("faq_parsing_answer", "We use automated scrapers that run every 6 hours to check university portals, Astana Hub, and community channels. Events are deduplicated, cleaned, and organized automatically. If we miss something, organizers can submit events manually.")}
            </p>
          </div>
          <div className="border-b border-slate-800 pb-6">
            <h3 className="text-xl font-bold text-white mb-2">{t("faq_privacy", "Is my data private?")}</h3>
            <p className="text-slate-400">
              {t("faq_privacy_answer", "Yes. Your resume and personal information are only visible to users you connect with. We never share your data with third parties. You control what's public on your profile.")}
            </p>
          </div>
          <div className="border-b border-slate-800 pb-6">
            <h3 className="text-xl font-bold text-white mb-2">{t("faq_resume", "How does resume analysis work?")}</h3>
            <p className="text-slate-400">
              {t("faq_resume_answer", "Upload a PDF or link your LinkedIn. Our system extracts skills, experience, and education automatically. You can edit or add tags manually. The more complete your profile, the better your matches.")}
            </p>
          </div>
          <div className="border-b border-slate-800 pb-6">
            <h3 className="text-xl font-bold text-white mb-2">{t("faq_join", "How do I join a team?")}</h3>
            <p className="text-slate-400">
              {t("faq_join_answer", "Browse open positions or get matched with teammates. Click \"Apply\" or \"Chat\" to start a conversation. Teams can approve or reject applications. Once approved, you're in.")}
            </p>
          </div>
          <div className="pb-6">
            <h3 className="text-xl font-bold text-white mb-2">{t("faq_languages", "What languages are supported?")}</h3>
            <p className="text-slate-400">
              {t("faq_languages_answer", "The platform interface is available in English, Russian, and Kazakh. User-generated content (profiles, event descriptions) can be in any language. Our matching works across all languages.")}
            </p>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          // После успешного входа/регистрации перенаправляем на страницу талантов
          window.location.href = "/talents";
        }}
      />
    </div>
  );
}
