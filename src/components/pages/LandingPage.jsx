import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      <nav className="border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-auto lg:h-16 flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-0 gap-4 lg:gap-0">
          <Link className="flex items-center gap-2 group mx-auto lg:mx-0" to="/">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black italic text-lg">J</div>
            <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">JobConnect</span>
          </Link>
          <div className="flex items-center gap-6 mx-auto lg:mx-0">
            <Link className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors" to="/login">Login</Link>
            <Link className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all" to="/register">Register</Link>
          </div>
        </div>
      </nav>

      <header className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
            Connect with your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Future Career</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The modern platform for connecting top talent with the world's most innovative employers. Find jobs, internships, and growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-cyan-50 transition-all shadow-xl">Get Started</Link>
            <Link to="/login" className="w-full sm:w-auto border border-gray-700 bg-gray-800/40 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg hover:border-cyan-500/30 transition-all">View Demo</Link>
          </div>
        </div>
      </header>

      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <p className="text-cyan-400 font-bold tracking-widest uppercase text-xs sm:text-sm lg:text-base mb-3">Workflow</p>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">How it works</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              { title: 'Employers', desc: 'Post jobs and review applications with our streamlined hiring dashboard.', icon: '🏢' },
              { title: 'Job Seekers', desc: 'Search, filter, and apply for jobs or internships with a single click.', icon: '🚀' },
              { title: 'Fast Match', desc: 'Intelligent filtering helps you discover relevant opportunities instantly.', icon: '⚡' }
            ].map((item, idx) => (
              <div key={idx} className="w-full min-h-[320px] bg-gray-800/30 backdrop-blur-md p-8 rounded-[2rem] border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group flex flex-col">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h5 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 truncate">{item.title}</h5>
                <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed line-clamp-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800/50 py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} JobConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
