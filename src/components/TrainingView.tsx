import React, { useState } from 'react';
import { 
  GraduationCap, 
  Play, 
  CheckCircle2, 
  Clock, 
  Award, 
  BookOpen, 
  Video, 
  ExternalLink 
} from 'lucide-react';
import { LanguageCode } from '../types';

interface TrainingViewProps {
  currentLanguage: LanguageCode;
  isDarkMode?: boolean;
}

export const TrainingView: React.FC<TrainingViewProps> = ({
  currentLanguage,
  isDarkMode = false,
}) => {
  const [completedModules, setCompletedModules] = useState<number[]>([1]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const modules = [
    {
      id: 1,
      title: 'Mobile Phone Craft Photography in Rural Workshops',
      duration: '8 mins',
      category: 'Photography',
      thumbnail: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80',
      description: 'Learn how to utilize morning courtyard sunlight, white bedsheet diffusers, and mobile gridlines.',
    },
    {
      id: 2,
      title: 'Zero-Breakage Honeycomb Eco-Packaging for Global Cargo',
      duration: '12 mins',
      category: 'Logistics',
      thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
      description: 'Step-by-step guide to wrapping delicate terracotta and glazed ceramics using shredded coconut coir and paper honeycomb.',
    },
    {
      id: 3,
      title: 'How to Obtain Govt of India GI Tag Verification',
      duration: '15 mins',
      category: 'Legal & Heritage',
      thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
      description: 'Documentation required from your village panchayat and craft guild to register under the Geographical Indications Act.',
    },
    {
      id: 4,
      title: 'Direct UPI Settlements & PM Vishwakarma Credit Access',
      duration: '10 mins',
      category: 'Finance',
      thumbnail: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80',
      description: 'How to monitor instant UPI bank credits and unlock collateral-free working capital loans at 5% subsidized interest.',
    },
  ];

  const toggleComplete = (id: number) => {
    if (completedModules.includes(id)) {
      setCompletedModules(completedModules.filter(m => m !== id));
    } else {
      setCompletedModules([...completedModules, id]);
    }
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
              <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-slate-100">
              Artisan Skill & Digital Academy
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Free video masterclasses in Hindi and regional languages on digital sales, photography, export packaging, and credit schemes.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center gap-3 self-start sm:self-auto">
          <Award className="w-6 h-6 text-teal-600" />
          <div className="text-xs">
            <span className="font-bold text-teal-950 dark:text-teal-200 block">Master Academy Badge</span>
            <span className="text-slate-500 dark:text-slate-400">{completedModules.length} of {modules.length} Modules Completed</span>
          </div>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => {
          const isDone = completedModules.includes(mod.id);

          return (
            <div
              key={mod.id}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div className="relative aspect-16/9 bg-slate-900 overflow-hidden group">
                <img
                  src={mod.thumbnail}
                  alt={mod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                />
                
                <button
                  onClick={() => setActiveVideo(mod.title)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-teal-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>

                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mod.duration}
                </span>

                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-teal-700 text-white text-[10px] font-bold">
                  {mod.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {mod.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <button
                    onClick={() => toggleComplete(mod.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Completed' : 'Mark as Watched'}</span>
                  </button>

                  <button
                    onClick={() => setActiveVideo(mod.title)}
                    className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <span>Watch Video</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Playing Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-4 gradient-border-organic border-0 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Playing: {activeVideo}
              </h3>
              <button 
                onClick={() => setActiveVideo(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Close
              </button>
            </div>
            <div className="aspect-16/9 bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-white space-y-2 p-6 text-center">
              <Video className="w-10 h-10 text-teal-400" />
              <p className="text-xs font-semibold">Video Streaming (HD 1080p Regional Audio)</p>
              <p className="text-[11px] text-slate-400">Hindi, Awadhi, Bengali & Tamil audio streams available.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
