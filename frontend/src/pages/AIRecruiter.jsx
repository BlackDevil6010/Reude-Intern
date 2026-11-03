import React, { useState, useEffect } from 'react';
import { db } from '../db';
import Section from '../components/Section';
import { 
  Sparkles, Bot, FileText, CheckCircle2, XCircle, ArrowRight, 
  ExternalLink, Search, Star, Award, HelpCircle, UserPlus, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIRecruiter() {
  const [jds, setJds] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interns, setInterns] = useState([]);
  const [selectedJdId, setSelectedJdId] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const allJds = db.getJobDescriptions();
    const allCands = db.getCandidates();
    const allInts = db.getInterns();
    setJds(allJds);
    setCandidates(allCands);
    setInterns(allInts);
    if (allJds.length > 0) setSelectedJdId(allJds[0].id);
  }, []);

  const activeJD = jds.find(j => j.id === selectedJdId) || jds[0];

  // Combined pool of candidates and interns to analyze against JD
  const talentPool = [
    ...candidates.map(c => ({
      id: `cand-${c.id}`,
      name: c.name,
      email: c.email,
      role: c.role,
      department: c.department,
      type: 'Applicant',
      skills: (c.role.includes('Avionics') || c.role.includes('Propulsion')) 
        ? ['SolidWorks', 'Catia', 'AutoCAD', 'Drone Pilot', 'UAV', 'CFD']
        : ['React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'Git', 'AI/ML']
    })),
    ...interns.map(i => ({
      id: `int-${i.id}`,
      name: i.name,
      email: i.email,
      role: i.department,
      department: 'Engineering / Software',
      type: 'Active Intern',
      skills: (i.skills || 'React.js, HTML, Git').split(',').map(s => s.trim())
    }))
  ];

  // Compute AI match score for candidate against activeJD
  const scoredTalent = talentPool.map(talent => {
    const reqSkills = activeJD?.required_skills || [];
    const talentSkillsLower = (talent.skills || []).map(s => s.toLowerCase());
    
    const matchedSkills = reqSkills.filter(req => 
      talentSkillsLower.some(ts => ts.includes(req.toLowerCase()) || req.toLowerCase().includes(ts))
    );
    const missingSkills = reqSkills.filter(req => !matchedSkills.includes(req));

    const score = reqSkills.length > 0 
      ? Math.round((matchedSkills.length / reqSkills.length) * 100) 
      : 75;

    return {
      ...talent,
      matchedSkills,
      missingSkills,
      score: Math.max(45, score) // realistic spread
    };
  }).sort((a, b) => b.score - a.score);

  const activeCandidate = selectedCandidate || scoredTalent[0];

  // Generate tailored questions based on missing or matched skills
  const getInterviewQuestions = (cand) => {
    if (!cand) return [];
    const missing = cand.missingSkills || [];
    return [
      `How have you applied ${cand.matchedSkills?.[0] || 'your core skills'} in complex real-world engineering environments?`,
      missing.length > 0 
        ? `We noticed your background focuses on ${cand.matchedSkills?.join(', ')}. How quickly can you bridge knowledge in ${missing[0]}?`
        : `Can you walk us through an optimization or failure debugging scenario you personally resolved?`,
      `Describe your workflow for validating mission-critical safety and specifications in ${activeJD?.department}.`,
      `How do you collaborate with interdisciplinary teams (e.g. Avionics, CAD modeling, and Software pipelines)?`
    ];
  };

  return (
    <Section 
      title="AI Recruiter & Talent Match Intelligence" 
      subtitle="Automated resume screening, JD requirement scoring, skill gap detection, and interview question synthesis."
      action={
        <a 
          href="https://recrulyn.reude.tech/" 
          target="_blank" 
          rel="noreferrer"
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2 hover:-translate-y-0.5 transition-all"
        >
          <Sparkles size={14} /> Open Live RECRULYN AI <ExternalLink size={12} />
        </a>
      }
    >
      {/* 1. Job Description Selection Banner */}
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2.5rem] shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-reude text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20 shrink-0">
            <Bot size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block">Target Role Benchmark</span>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">{activeJD?.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeJD?.description} (Req. Experience: {activeJD?.experience})</p>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 whitespace-nowrap">Switch JD:</label>
          <select 
            value={selectedJdId} 
            onChange={e => {
              setSelectedJdId(e.target.value);
              setSelectedCandidate(null);
            }} 
            className="input text-xs font-bold"
          >
            {jds.map(j => (
              <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Candidate Match Ranking List */}
        <div className="lg:col-span-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-6 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-orange-500" /> AI Ranked Applicants ({scoredTalent.length})
            </h4>
            <span className="text-[11px] text-slate-400 font-semibold">Click to inspect</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {scoredTalent.map((cand, idx) => {
              const isSelected = activeCandidate?.id === cand.id;
              return (
                <div 
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-500/40 shadow-md' 
                      : 'bg-white dark:bg-slate-800/80 border-slate-100 dark:border-white/5 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <h5 className="font-black text-slate-800 dark:text-white text-sm">{cand.name}</h5>
                    </div>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      cand.score >= 85 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      cand.score >= 65 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-700'
                    }`}>
                      {cand.score}% Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{cand.type} · {cand.role}</span>
                    <span className="text-emerald-600 font-semibold">{cand.matchedSkills.length} matches</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Deep-Dive Candidate Inspection & Questions Card */}
        <div className="lg:col-span-7 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl space-y-6">
          {activeCandidate && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
                <div>
                  <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">{activeCandidate.type} Evaluation</span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">{activeCandidate.name}</h3>
                  <p className="text-xs text-slate-400">{activeCandidate.email} · {activeCandidate.department}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold uppercase">Overall JD Match</span>
                  <div className="text-3xl font-black text-emerald-600">{activeCandidate.score}%</div>
                </div>
              </div>

              {/* Skills Gap Matrix */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Verified Matching Competencies ({activeCandidate.matchedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeCandidate.matchedSkills.map(s => (
                      <span key={s} className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 size={13} /> {s}
                      </span>
                    ))}
                    {activeCandidate.matchedSkills.length === 0 && (
                      <span className="text-xs text-slate-400 italic">No exact keyword overlap</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Missing JD Requirements / Skill Gaps ({activeCandidate.missingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeCandidate.missingSkills.map(s => (
                      <span key={s} className="px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 border border-rose-200 dark:border-rose-800">
                        <XCircle size={13} /> {s}
                      </span>
                    ))}
                    {activeCandidate.missingSkills.length === 0 && (
                      <span className="text-xs text-emerald-600 font-bold">100% requirement coverage!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Generated Technical Interview Questions */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <HelpCircle size={16} className="text-orange-500" /> AI Synthesized Technical Interview Questions
                </h4>
                <div className="space-y-2.5">
                  {getInterviewQuestions(activeCandidate).map((q, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      <span className="font-bold text-orange-500 mr-2">Q{idx + 1}.</span> {q}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => alert(`Interview scheduled with ${activeCandidate.name} for ${activeJD?.title}. Invitation queued.`)}
                  className="btn-primary flex-1 py-3 text-xs"
                >
                  Schedule Technical Interview
                </button>
                <button 
                  onClick={() => alert(`${activeCandidate.name} added to Recommended Shortlist.`)}
                  className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  Shortlist Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
