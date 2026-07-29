"use client";

import React, { useState } from 'react';
import { Search, Bell, User, Upload, Settings2, Sparkles, Image as ImageIcon, Video, Grid, Hash, Cpu, Play } from 'lucide-react';

export default function PrometheusPage() {
  const [activeTab, setActiveTab] = useState('Explore');

  const navLinks = [
    { name: 'Explore', active: true },
    { name: 'Image' },
    { name: 'Video' },
    { name: 'Audio' },
    { name: 'Cinema Studio' },
    { name: 'MCP & CLI', tag: 'New' },
    { name: 'Academy', tag: 'New' },
    { name: 'Supercomputer' },
    { name: 'Community' },
    { name: 'Contests', tag: 'New' },
    { name: 'Plugins', tag: 'New' },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans selection:bg-[#d1ff00] selection:text-black">
      
      {/* 1. TOP NAVBAR (Clone from screenshots) */}
      <header className="flex items-center justify-between px-4 h-14 bg-[#141414] border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-2">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-black font-bold text-xs">
              P
            </div>
          </div>
          
          {/* Links */}
          <nav className="flex items-center gap-5 text-[13px] font-medium whitespace-nowrap">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={`#${link.name.toLowerCase()}`}
                onClick={() => setActiveTab(link.name)}
                className={`flex items-center gap-1.5 transition-colors ${link.active || activeTab === link.name ? 'text-[#d1ff00]' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                {link.name}
                {link.tag && (
                  <span className="text-[9px] bg-[#d1ff00]/20 text-[#d1ff00] px-1 rounded-sm uppercase tracking-wider font-bold">
                    {link.tag}
                  </span>
                )}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 shrink-0 pl-4">
          <button className="text-zinc-400 hover:text-white"><Search className="w-4 h-4" /></button>
          
          {/* Pricing Button */}
          <button className="relative flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-white text-[13px] px-3 py-1.5 rounded-md font-medium transition-colors">
            <div className="w-3 h-3 rotate-45 border border-white/50" /> {/* Diamond icon approx */}
            Pricing
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#ff0055] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
              61% OFF
            </span>
          </button>
          
          <button className="flex items-center gap-2 text-[13px] font-medium text-zinc-300 hover:text-white ml-2">
            <Settings2 className="w-4 h-4 text-zinc-500" /> Assets
          </button>
          
          <button className="text-zinc-400 hover:text-white"><Bell className="w-4 h-4" /></button>
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-yellow-500 border border-white/20" />
        </div>
      </header>

      {/* 2. THE HERO MONITOR (From Screenshot 2) */}
      <section className="p-4 md:p-8 max-w-[1600px] mx-auto mt-4">
        <div className="relative w-full aspect-[21/9] max-h-[70vh] bg-[#1a1a1a] rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-[8px] border-[#222] overflow-hidden flex items-center justify-center group">
          
          {/* Inner Screen Shadow / Bezel */}
          <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none z-20" />
          
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden rounded-[1.5rem]">
             <video 
                autoPlay loop muted playsInline 
                className="w-full h-full object-cover scale-105 filter brightness-75 contrast-125"
             >
                <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
             </video>
             <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* 4K Badge */}
          <div className="absolute top-8 right-8 z-30 bg-[#d1ff00] text-black font-black text-2xl px-4 py-1 skew-x-[-10deg]">
            4K
          </div>

          {/* Content */}
          <div className="relative z-30 text-center flex flex-col items-center">
            <h1 className="font-display text-7xl md:text-[8rem] font-black tracking-tighter text-[#d1ff00] uppercase leading-[0.85] mb-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" style={{ transform: 'scaleY(1.2)' }}>
              PROMETHEUS<br/>2.0
            </h1>
            <div className="inline-block border border-white/40 bg-black/40 backdrop-blur-md rounded-full px-4 py-1 text-white font-medium text-sm mb-6 mt-4 uppercase tracking-widest">
              Now in 4K
            </div>
            
            <p className="text-white font-bold text-lg md:text-2xl uppercase tracking-wide mb-8 drop-shadow-lg">
              Already available on Prometheus
            </p>
            
            <button className="bg-[#d1ff00] hover:bg-[#bce600] text-black font-bold text-base px-10 py-3 rounded-md transition-transform hover:scale-105 active:scale-95">
              Try now
            </button>
          </div>
        </div>
      </section>

      {/* 3. PROJECT GRID (Cinematic Videos) */}
      <section className="px-4 md:px-8 py-10 max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h2 className="text-[#d1ff00] font-black text-2xl md:text-3xl uppercase tracking-tight">Explore the inside of every project</h2>
          <p className="text-zinc-400 text-sm md:text-base">See all prompts, assets, and how each project was created</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
            title: 'Neon Cyberspace', 
            author: 'Prometheus Soul', 
            vid: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 
            badge: 'Public' 
          },
          { 
            title: 'Macro Ink Fluid', 
            author: 'Studio X', 
            vid: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
            badge: 'Public' 
          },
          { 
            title: 'Nala - Heads Drop', 
            author: 'CreatorOne', 
            vid: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
            badge: 'Public' 
          },
          { 
            title: 'Master AI Filmmaking', 
            author: 'Academy', 
            vid: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 
            badge: 'Public' 
          },
          { 
            title: 'KÖK BÖRÜ', 
            author: 'Fable Studios', 
            vid: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 
            badge: 'Public' 
          },
          { 
            title: 'Digital Synapse', 
            author: 'NeuroVision', 
            vid: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
            badge: 'Public' 
          },
          { 
            title: 'Seedance 2.0 4K', 
            author: 'Prometheus', 
            vid: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
            badge: 'Public' 
          },
          { 
            title: 'Night Drive', 
            author: 'Design LLC', 
            vid: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 
            badge: 'Public' 
          }
        ].map((item, i) => (
            <div key={i} className="bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer group hover:ring-2 ring-[#d1ff00]/50 transition-all flex flex-col shadow-lg">
              {/* Thumbnail Video */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <video 
                  autoPlay loop muted playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                >
                  <source src={item.vid} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              </div>
              
              {/* Bottom Info Bar */}
              <div className="flex items-center justify-between p-3 bg-[#111] border-t border-white/5 relative z-10">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-white">P</span>
                  </div>
                  <div className="truncate text-[13px]">
                    <span className="font-bold text-white mr-1">{item.title}</span>
                    <span className="text-zinc-500">by {item.author}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 ml-1 shadow-[0_0_8px_#22c55e]" />
                </div>
                <div className="bg-[#222] border border-white/10 text-zinc-300 text-[10px] uppercase font-bold px-2 py-1 rounded shrink-0">
                  {item.badge}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WORKSPACE DASHBOARD (From Screenshot 1) */}
      <section className="px-4 md:px-8 py-10 max-w-[1600px] mx-auto border-t border-white/5 mt-10">
        <div className="mb-6 flex items-center gap-6 border-b border-white/5 pb-4">
          <button className="text-white font-bold text-[15px] border-b-2 border-white pb-4 -mb-[17px]">Create Video</button>
          <button className="text-zinc-500 font-medium text-[15px] hover:text-white pb-4">Edit Video</button>
          <button className="text-zinc-500 font-medium text-[15px] hover:text-white pb-4">Motion Control</button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[600px]">
          
          {/* Left Sidebar (Controls) */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4 bg-[#141414] rounded-xl border border-white/5 p-4">
            
            {/* Active Model */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10 group cursor-pointer">
               <img src="https://images.unsplash.com/photo-1551028719-01c1eb56211d?w=800&q=80" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
               <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white rounded flex items-center gap-1"><Cpu className="w-3 h-3" /> GENERAL</div>
               <div className="absolute bottom-2 left-2 text-white font-bold">Seedance 2.0</div>
               <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white"><Settings2 className="w-3 h-3" /> Change</div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#111]">
              <div className="flex gap-2 text-zinc-500 mb-2">
                <ImageIcon className="w-5 h-5" />
                <Video className="w-5 h-5" />
                <Settings2 className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-white">Upload media</p>
              <p className="text-[11px] text-zinc-500 mt-1">Image, Video or Audio</p>
            </div>

            {/* Prompt Area */}
            <div className="flex-grow flex flex-col bg-[#111] rounded-xl border border-white/5 overflow-hidden focus-within:border-white/20 transition-colors">
              <div className="p-3">
                <p className="text-xs font-bold text-zinc-400 mb-1">Prompt</p>
                <textarea 
                  className="w-full bg-transparent text-sm text-white resize-none outline-none min-h-[100px] placeholder:text-zinc-600"
                  placeholder="Describe your scene in detail. Use @ to reference assets"
                ></textarea>
              </div>
              <div className="p-3 border-t border-white/5 flex items-center gap-3 bg-[#161616]">
                <button className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#222] hover:bg-[#333] px-2.5 py-1.5 rounded-md transition-colors"><Hash className="w-3 h-3" /> Elements</button>
                <button className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white"><div className="w-6 h-3 bg-[#d1ff00] rounded-full relative"><div className="absolute right-0.5 top-0.5 w-2 h-2 bg-black rounded-full" /></div> On</button>
              </div>
            </div>

            {/* Model Selector & Generate Button */}
            <div className="flex flex-col gap-2 mt-auto">
              <button className="flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#222] rounded-lg border border-white/5 transition-colors text-left">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold mb-0.5">Model</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">Seedance 2.0 <div className="flex gap-0.5"><div className="w-1 h-3 bg-[#d1ff00]" /><div className="w-1 h-2 bg-[#d1ff00]" /><div className="w-1 h-4 bg-[#d1ff00]" /></div></div>
                </div>
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              </button>
              
              <button className="w-full bg-[#d1ff00] hover:bg-[#bce600] text-black font-black text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_20px_rgba(209,255,0,0.15)]">
                Generate <Sparkles className="w-4 h-4" /> 96.72
              </button>
            </div>
          </div>

          {/* Right Area (Make videos in one click) */}
          <div className="flex-grow bg-[#141414] rounded-xl border border-white/5 p-8 flex flex-col justify-center">
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Make videos in one click</h2>
              <p className="text-zinc-400 text-sm md:text-base max-w-2xl">
                250+ presets for camera control, framing, and high-quality VFX - or use the general preset for manual control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="flex flex-col gap-3">
                <div className="aspect-[4/3] rounded-xl border border-white/10 bg-[#111] overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white mb-2" />
                    <span className="font-bold text-white uppercase tracking-widest text-sm">Upload Image</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide">Add Image</h3>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col gap-3">
                <div className="aspect-[4/3] rounded-xl border-2 border-[#d1ff00] bg-[#111] overflow-hidden relative cursor-pointer shadow-[0_0_15px_rgba(209,255,0,0.1)]">
                  <img src="https://images.unsplash.com/photo-1551028719-01c1eb56211d?w=800&q=80" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded text-white"><Settings2 className="w-3 h-3" /></div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide">Choose Preset</h3>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col gap-3">
                <div className="aspect-[4/3] rounded-xl border border-white/20 bg-[#111] overflow-hidden relative p-1">
                  <div className="w-full h-full rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide">Get Video</h3>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
      
    </div>
  );
}

function ChevronDown(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}
