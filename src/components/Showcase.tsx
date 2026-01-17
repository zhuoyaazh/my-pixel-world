'use client';

import { useState } from 'react';
import RetroCard from './RetroCard';

type ShowcaseTab = 'projects' | 'blog' | 'gallery';

type ShowcaseProps = {
  title?: string;
  labels?: {
    projects: string;
    blog: string;
    gallery: string;
  };
  searchQuery?: string;
};

export default function Showcase({ title = 'Showcase', labels, searchQuery = '' }: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('projects');
  const tabLabels = labels ?? {
    projects: '💼 PROJECTS',
    blog: '📝 BLOG',
    gallery: '🖼️ GALLERY',
  };

  const query = searchQuery.trim().toLowerCase();
  const matches = (text?: string) => (text || '').toLowerCase().includes(query);

  const projectItems = [
    {
      title: 'Project Title 1',
      description: 'Short description of the project goes here. Add your real projects later!',
      tags: ['React', 'TypeScript'],
    },
    {
      title: 'Project Title 2',
      description: 'Another amazing project description. Showcase your best work!',
      tags: ['Next.js', 'Design'],
    },
    {
      title: 'Coming Soon...',
      description: 'More projects will be added here. Stay tuned! ✨',
      tags: [],
    },
  ];

  const blogItems = [
    {
      title: 'Blog Post Title 1',
      date: 'Jan 15, 2026',
      excerpt:
        "This is a preview of your blog post. Write about physics, psychology, Chinese culture, or anything you're passionate about!",
    },
    {
      title: 'Blog Post Title 2',
      date: 'Jan 10, 2026',
      excerpt: 'Another interesting article preview. Share your thoughts and insights with the world!',
    },
    {
      title: 'Blog coming soon',
      date: '',
      excerpt: '📝 Blog coming soon! Stay tuned for articles and thoughts.',
    },
  ];

  const galleryItems = [
    { title: '🎨', description: 'Palette' },
    { title: '🖼️', description: 'Frame' },
    { title: '✨', description: 'Sparkle' },
    { title: '🌸', description: 'Bloom' },
    { title: '🎭', description: 'Mask' },
    { title: '🌈', description: 'Rainbow' },
  ];

  const filteredProjects = query
    ? projectItems.filter(
        (item) => matches(item.title) || matches(item.description) || item.tags.some((tag) => matches(tag))
      )
    : projectItems;

  const filteredBlogs = query
    ? blogItems.filter((item) => matches(item.title) || matches(item.excerpt) || matches(item.date))
    : blogItems;

  const filteredGallery = query ? galleryItems.filter((item) => matches(item.title) || matches(item.description)) : galleryItems;

  return (
    <RetroCard title={title} className="lg:col-span-3">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 sm:mb-6 border-b-2 border-retro-border/30 overflow-x-auto">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-3 py-2 font-press text-[8px] sm:text-xs transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'projects'
              ? 'border-b-pastel-yellow text-pastel-yellow'
              : 'border-b-transparent text-retro-text/50 hover:text-retro-text'
          }`}
        >
          {tabLabels.projects}
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-3 py-2 font-press text-[8px] sm:text-xs transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'blog'
              ? 'border-b-pastel-yellow text-pastel-yellow'
              : 'border-b-transparent text-retro-text/50 hover:text-retro-text'
          }`}
        >
          {tabLabels.blog}
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-3 py-2 font-press text-[8px] sm:text-xs transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'gallery'
              ? 'border-b-pastel-yellow text-pastel-yellow'
              : 'border-b-transparent text-retro-text/50 hover:text-retro-text'
          }`}
        >
          {tabLabels.gallery}
        </button>
      </div>

      {/* Content */}
      <div className="min-h-50 w-full">
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className={`p-4 border-2 space-y-2 ${
                  index === 0
                    ? 'border-pastel-purple bg-pastel-pink/20'
                    : index === 1
                      ? 'border-pastel-blue bg-pastel-blue/20'
                      : 'border-pastel-mint bg-pastel-mint/20'
                }`}
              >
                <h4 className="font-bold text-[10px] sm:text-xs text-pastel-purple">{item.title}</h4>
                <p className="text-[8px] sm:text-[9px] text-gray-700">{item.description}</p>
                {item.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-pastel-blue text-[7px] sm:text-[8px] border border-black">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="col-span-full text-center text-[9px] sm:text-xs text-gray-500 font-bold">
                No matching projects.
              </div>
            )}
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-4">
            {filteredBlogs.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className={`p-4 bg-white space-y-2 border-l-4 ${
                  index === 0 ? 'border-pastel-purple' : index === 1 ? 'border-pastel-blue' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className={`font-bold text-[10px] sm:text-xs ${index === 0 ? 'text-pastel-purple' : 'text-pastel-blue'}`}>
                    {item.title}
                  </h4>
                  {item.date && <span className="text-[7px] sm:text-[8px] text-gray-500">{item.date}</span>}
                </div>
                <p className="text-[8px] sm:text-[9px] text-gray-700">{item.excerpt}</p>
                <button className="text-[7px] sm:text-[8px] text-pastel-blue font-bold hover:underline">
                  Read more →
                </button>
              </div>
            ))}

            {filteredBlogs.length === 0 && (
              <div className="text-center text-[9px] sm:text-xs text-gray-500 font-bold">
                No matching posts.
              </div>
            )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredGallery.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className="aspect-square border-2 border-pastel-purple bg-linear-to-br from-pastel-pink to-pastel-blue flex items-center justify-center text-4xl"
                title={item.description}
              >
                {item.title}
              </div>
            ))}

            {filteredGallery.length === 0 && (
              <div className="col-span-full text-center text-[9px] sm:text-xs text-gray-500 font-bold">
                No matching gallery items.
              </div>
            )}

            <div className="aspect-square border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-[8px] sm:text-[9px] text-gray-400 font-bold">+ Add</span>
            </div>
          </div>
        )}
      </div>
    </RetroCard>
  );
}
