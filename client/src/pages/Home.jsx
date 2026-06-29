import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaMapMarkedAlt,
  FaRobot,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B17] text-white">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[150px]"></div>

      {/* Navbar */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          CivicLens AI
        </h1>

        <div className="hidden gap-8 text-gray-300 md:flex">

          <Link className="hover:text-white transition" to="/">
            Home
          </Link>

          <Link className="hover:text-white transition" to="/report">
            Report Issue
          </Link>

          <Link className="hover:text-white transition" to="/map">
            Map
          </Link>

          <Link className="hover:text-white transition" to="/dashboard">
            Dashboard
          </Link>

        </div>

      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 px-8 py-16 lg:flex-row">

        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-cyan-300">
            🤖 AI Powered Community Platform
          </div>

          <h1 className="text-6xl font-extrabold leading-tight">

            Report.

            <br />

            Verify.

            <br />

            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Resolve.
            </span>

          </h1>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            CivicLens AI helps citizens report potholes, garbage,
            water leakage, broken streetlights and other civic issues
            using AI-powered image analysis and community collaboration.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              to="/report"
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 font-semibold transition hover:scale-105"
            >
              Report Issue
              <FaArrowRight />
            </Link>

            <Link
              to="/map"
              className="flex items-center gap-3 rounded-xl border border-cyan-500/40 px-7 py-4 font-semibold transition hover:bg-cyan-500/10"
            >
              <FaMapMarkedAlt />
              Explore Map
            </Link>

          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-5">

            <div className="rounded-2xl bg-white/5 p-5 backdrop-blur-lg border border-white/10">
              <FaRobot className="mb-3 text-3xl text-cyan-400" />
              <h2 className="text-3xl font-bold">98%</h2>
              <p className="text-gray-400 text-sm">
                AI Accuracy
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5 backdrop-blur-lg border border-white/10">
              <FaUsers className="mb-3 text-3xl text-blue-400" />
              <h2 className="text-3xl font-bold">2500+</h2>
              <p className="text-gray-400 text-sm">
                Citizens
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5 backdrop-blur-lg border border-white/10">
              <FaCheckCircle className="mb-3 text-3xl text-green-400" />
              <h2 className="text-3xl font-bold">1200+</h2>
              <p className="text-gray-400 text-sm">
                Resolved
              </p>
            </div>

          </div>

        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
        >

          <h2 className="mb-8 text-2xl font-bold">
            Live Community Dashboard
          </h2>

          <div className="space-y-5">

            <div className="rounded-xl bg-slate-900 p-5">
              <p className="text-gray-400">Total Reports</p>
              <h3 className="mt-2 text-4xl font-bold text-cyan-400">
                2,584
              </h3>
            </div>

            <div className="rounded-xl bg-slate-900 p-5">
              <p className="text-gray-400">Resolved Issues</p>
              <h3 className="mt-2 text-4xl font-bold text-green-400">
                1,967
              </h3>
            </div>

            <div className="rounded-xl bg-slate-900 p-5">
              <p className="text-gray-400">Pending Issues</p>
              <h3 className="mt-2 text-4xl font-bold text-yellow-400">
                617
              </h3>
            </div>

          </div>

        </motion.div>

      </section>

    </div>
  );
}

export default Home;