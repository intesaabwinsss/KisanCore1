import React, { useState } from 'react';
import { 
  Users, 
  Camera, 
  Globe, 
  FileText, 
  Box, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Send, 
  Award, 
  Filter,
  Check
} from 'lucide-react';
import { VolunteerTask, LanguageCode } from '../types';
import { VOLUNTEER_TASKS } from '../data/artisanData';

interface VolunteerHubProps {
  currentLanguage: LanguageCode;
  isDarkMode?: boolean;
}

export const VolunteerHub: React.FC<VolunteerHubProps> = ({
  currentLanguage,
  isDarkMode = false,
}) => {
  const [tasks, setTasks] = useState<VolunteerTask[]>(VOLUNTEER_TASKS);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [claimedTaskIds, setClaimedTaskIds] = useState<string[]>([]);

  // Form State for Requesting Help
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<VolunteerTask['category']>('Photography Retouching');
  const [newDescription, setNewDescription] = useState('');
  const [newUrgency, setNewUrgency] = useState<VolunteerTask['urgency']>('Medium');

  const handleClaimTask = (taskId: string) => {
    setClaimedTaskIds([...claimedTaskIds, taskId]);
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'In Progress' } : t));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: VolunteerTask = {
      id: `vol-${Date.now()}`,
      title: newTitle,
      artisanName: 'Arjun Prajapati',
      craftCluster: 'Gorakhpur & Pali Terracotta',
      category: newCategory,
      urgency: newUrgency,
      status: 'Open',
      timeEstimate: '1-2 hours',
      description: newDescription || 'Need volunteer assistance for artisanal catalog enhancement.',
      artisanAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      tags: ['Terracotta', 'Community'],
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewDescription('');
    setShowNewTaskModal(false);
  };

  const filteredTasks = activeCategoryFilter === 'All'
    ? tasks
    : tasks.filter(t => t.category === activeCategoryFilter);

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
              <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-slate-100">
              Volunteer Community Hub
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect traditional artisans with skilled design, linguistic, and marketing volunteers worldwide.
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Request Volunteer Help</span>
        </button>
      </div>

      {/* Impact Banner */}
      <div className="p-5 rounded-2xl bg-teal-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Active Civic Impact</span>
          <p className="text-sm sm:text-base font-semibold">
            1,240+ Volunteer hours logged this month supporting 340 artisan families.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-300" />
            <span>94% Task Completion</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-300" />
            <span>UN SDG Certified</span>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {['All', 'Photography Retouching', 'English Translation', 'Storytelling & Copy'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategoryFilter === cat
                ? 'bg-teal-600 text-white'
                : isDarkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.map((task) => {
          const isClaimed = claimedTaskIds.includes(task.id) || task.status === 'In Progress';

          return (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isDarkMode 
                  ? 'bg-slate-800/80 border-slate-700' 
                  : 'bg-white border-slate-200 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className="space-y-3">
                {/* Badge & Urgency */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-mono border border-teal-200 dark:border-teal-800">
                    {task.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    task.urgency === 'High' 
                      ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300' 
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                  }`}>
                    {task.urgency} Urgency
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {task.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {task.description}
                </p>

                {/* Artisan Info */}
                <div className="pt-2 flex items-center gap-2.5 border-t border-slate-100 dark:border-slate-700/80">
                  <img
                    src={task.artisanAvatar}
                    alt={task.artisanName}
                    className="w-7 h-7 rounded-full object-cover border border-teal-500"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {task.artisanName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {task.craftCluster}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {task.timeEstimate}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-700/80">
                <button
                  onClick={() => handleClaimTask(task.id)}
                  disabled={isClaimed}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    isClaimed
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-2xs'
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Task Claimed (In Progress)</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Accept Volunteer Assignment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Request Volunteer Help */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 gradient-border-organic border-0 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100">
              Request Volunteer Assistance
            </h3>
            
            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  What do you need help with?
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Touch up lighting on 5 blue pottery vases"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Photography Retouching">Photography Retouching</option>
                    <option value="English Translation">English Translation</option>
                    <option value="Storytelling & Copy">Storytelling & Copy</option>
                    <option value="Packaging & Shipping">Packaging & Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Urgency</label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Task Details & Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your craft, what files you have, and what guidance you need..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Post Task to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
