import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Upload, 
  FileText, 
  Languages, 
  Brain, 
  Briefcase, 
  Users, 
  Building2, 
  CheckCircle,
  ArrowRight,
  BarChart3,
  UserCheck,
  MessageSquare,
  Award,
  Target
} from "lucide-react";
import LiquidEther from "../components/LiquidEther";

export function RecruitingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"candidate" | "company" | "hr">("candidate");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* === HERO SECTION === */}
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/70 pointer-events-none" />
        <div className="relative z-[2] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight text-white tracking-tight">
              {t("recruiting_hero_title", "Smart Candidate Recruitment")}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t("recruiting_hero_subtitle", "Comprehensive candidate assessment platform. Language testing, professional skills evaluation, psychological diagnostics, and AI-powered matching for companies.")}
            </p>
            
            {/* Tab Switcher */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveTab("candidate")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "candidate"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                <FileText className="inline mr-2" size={18} />
                {t("for_candidates", "For Candidates")}
              </button>
              <button
                onClick={() => setActiveTab("company")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "company"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                <Building2 className="inline mr-2" size={18} />
                {t("for_companies", "For Companies")}
              </button>
              <button
                onClick={() => setActiveTab("hr")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "hr"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                <UserCheck className="inline mr-2" size={18} />
                {t("for_hr_psychologists", "For HR & Psychologists")}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* === CANDIDATE SECTION === */}
      {activeTab === "candidate" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {t("candidate_section_title", "Complete Your Profile")}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t("candidate_section_desc", "Upload your resume, take comprehensive tests, and get matched with top companies.")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Resume Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <Upload size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("upload_resume", "Upload Resume")}
              </h3>
              <p className="text-slate-400 mb-4">
                {t("upload_resume_desc", "Upload your CV in PDF or DOCX format. Our AI will automatically extract your skills, experience, and education.")}
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
                {t("upload", "Upload")}
              </button>
            </motion.div>

            {/* Language Testing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <Languages size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("language_testing", "Language Testing")}
              </h3>
              <p className="text-slate-400 mb-4">
                {t("language_testing_desc", "Test your proficiency in English, Kazakh, and Russian. Automated assessment with detailed results.")}
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
                {t("start_test", "Start Test")}
              </button>
            </motion.div>

            {/* Professional Tests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <Briefcase size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("professional_tests", "Professional Tests")}
              </h3>
              <p className="text-slate-400 mb-4">
                {t("professional_tests_desc", "Answer industry-specific questions and solve real-world case studies relevant to your field.")}
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
                {t("take_test", "Take Test")}
              </button>
            </motion.div>
          </div>

          {/* Additional Tests */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <Brain size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("psychological_diagnostics", "Psychological Diagnostics")}
              </h3>
              <p className="text-slate-400 mb-4">
                {t("psychological_diagnostics_desc", "Comprehensive psychological assessment to understand your work style, communication preferences, and team fit.")}
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition">
                {t("start_diagnosis", "Start Diagnosis")}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                <BarChart3 size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("detailed_profile", "Detailed Profile")}
              </h3>
              <p className="text-slate-400 mb-4">
                {t("detailed_profile_desc", "View your complete assessment profile with scores, recommendations, and match potential with companies.")}
              </p>
              <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition">
                {t("view_profile", "View Profile")}
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* === COMPANY SECTION === */}
      {activeTab === "company" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {t("company_section_title", "Find the Right Talent")}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t("company_section_desc", "Set job requirements, browse pre-screened candidates, and send invitations to the best matches.")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <Target size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("set_requirements", "Set Requirements")}
              </h3>
              <p className="text-slate-400 mb-4">
                {t("set_requirements_desc", "Define job requirements, skills, language levels, and experience needed for your position.")}
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
                {t("create_job", "Create Job")}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <Users size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("browse_candidates", "Browse Candidates")}
              </h3>
              <p className="text-slate-400 mb-4">
                {t("browse_candidates_desc", "View pre-screened candidates ranked by match score. See detailed profiles with all test results.")}
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
                {t("view_candidates", "View Candidates")}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <MessageSquare size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("send_invitations", "Send Invitations")}
              </h3>
              <p className="text-slate-400 mb-4">
                {t("send_invitations_desc", "Send personalized invitations to top candidates. Track responses and manage your recruitment pipeline.")}
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
                {t("invite_candidate", "Invite Candidate")}
              </button>
            </motion.div>
          </div>

          {/* Ranking Algorithm */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-8"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
                <Award size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {t("ranking_algorithm", "AI-Powered Ranking Algorithm")}
                </h3>
                <p className="text-slate-400 mb-4">
                  {t("ranking_algorithm_desc", "Our algorithm ranks candidates based on multiple factors: skill match, language proficiency, test scores, psychological fit, and experience relevance. Get the best candidates at the top of your list.")}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">{t("skill_matching", "Skill Matching")}</h4>
                      <p className="text-slate-400 text-sm">{t("skill_matching_desc", "Weighted scoring based on required vs. demonstrated skills")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">{t("language_proficiency", "Language Proficiency")}</h4>
                      <p className="text-slate-400 text-sm">{t("language_proficiency_desc", "Automated assessment results for EN, KZ, RU")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">{t("test_scores", "Test Scores")}</h4>
                      <p className="text-slate-400 text-sm">{t("test_scores_desc", "Professional and psychological test results")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">{t("experience_relevance", "Experience Relevance")}</h4>
                      <p className="text-slate-400 text-sm">{t("experience_relevance_desc", "Years of experience and project relevance")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* === HR & PSYCHOLOGISTS SECTION === */}
      {activeTab === "hr" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {t("hr_section_title", "Professional Assessment Tools")}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t("hr_section_desc", "Access detailed candidate reports, provide expert recommendations, and collaborate with companies on hiring decisions.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <FileText size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("detailed_reports", "Detailed Reports")}
              </h3>
              <p className="text-slate-400 mb-4">
                {t("detailed_reports_desc", "View comprehensive candidate assessment reports including all test results, language scores, psychological profiles, and recommendations.")}
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
                {t("view_reports", "View Reports")}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <UserCheck size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("expert_recommendations", "Expert Recommendations")}
              </h3>
              <p className="text-slate-400 mb-4">
                {t("expert_recommendations_desc", "Provide your professional recommendations on candidates. Add notes, ratings, and final hiring decisions for companies.")}
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition">
                {t("add_recommendation", "Add Recommendation")}
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* === CTA SECTION === */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {t("recruiting_cta_title", "Ready to Get Started?")}
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            {t("recruiting_cta_desc", "Join our platform and discover how comprehensive assessment can transform your recruitment process.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30">
              {t("get_started", "Get Started")}
            </button>
            <Link
              to="/events"
              className="px-8 py-4 bg-transparent border-2 border-blue-500/50 hover:border-blue-400/70 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              {t("back_to_events", "Back to Events")} <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

