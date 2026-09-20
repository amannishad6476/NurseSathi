import { useEffect, useState } from 'react';

const initialPosts = [
  {
    id: 1,
    author: {
      name: 'Maya Chen',
      headline: 'Clinical Operations Lead',
      avatar: 'MC',
      accent: 'linear-gradient(135deg, #0b66c2, #3c7ad9)'
    },
    time: '12 min ago',
    content:
      'Our new patient-first workflow reduced wait times by 18% this quarter. The best improvements came from small coaching loops and better cross-team communication. I am excited to share a few practical ideas with other healthcare leaders who are refining their day-to-day operations.',
    type: 'text',
    likes: 214,
    comments: 36,
    shares: 12,
    liked: false,
    saved: false,
    expanded: false,
    hashtags: ['#HealthcareLeadership', '#PatientExperience', '#OperationalExcellence']
  },
  {
    id: 2,
    author: {
      name: 'Daniel Ortiz',
      headline: 'Senior ICU Nurse',
      avatar: 'DO',
      accent: 'linear-gradient(135deg, #14532d, #22c55e)'
    },
    time: '45 min ago',
    content: 'A calm handoff routine can transform the entire shift.',
    type: 'image',
    media:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    likes: 182,
    comments: 28,
    shares: 9,
    liked: true,
    saved: false,
    expanded: false,
    hashtags: ['#CriticalCare', '#NursingExcellence', '#Teamwork']
  },
  {
    id: 3,
    author: {
      name: 'Aisha Rahman',
      headline: 'Recruitment Partner',
      avatar: 'AR',
      accent: 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
    },
    time: '1 hr ago',
    content:
      'We are hiring professionals who want to build meaningful careers in modern healthcare. If you enjoy mentoring, problem-solving, and creating strong patient outcomes, this is the right moment to connect. The best teams are built with empathy and clarity.',
    type: 'video',
    media: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
    likes: 143,
    comments: 19,
    shares: 7,
    liked: false,
    saved: true,
    expanded: false,
    hashtags: ['#HiringNow', '#NursingCareers', '#TalentGrowth']
  }
];

const Home = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [visibleCount, setVisibleCount] = useState(3);
  const [draft, setDraft] = useState({ content: '', type: 'text', media: '' });

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 400;
      if (nearBottom) {
        setVisibleCount((prev) => Math.min(prev + 2, posts.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [posts.length]);

  const visiblePosts = posts.slice(0, visibleCount);

  const toggleExpanded = (id) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, expanded: !post.expanded } : post)));
  };

  const toggleReaction = (id, field) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;

        if (field === 'liked') {
          return { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) };
        }

        if (field === 'saved') {
          return { ...post, saved: !post.saved };
        }

        return post;
      })
    );
  };

  const createPost = (event) => {
    event.preventDefault();
    if (!draft.content.trim()) return;

    const newPost = {
      id: Date.now(),
      author: {
        name: 'You',
        headline: 'Professional Community Member',
        avatar: 'YO',
        accent: 'linear-gradient(135deg, #0b66c2, #2563eb)'
      },
      time: 'Just now',
      content: draft.content.trim(),
      type: draft.type,
      media:
        draft.type === 'image'
          ? draft.media || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
          : draft.type === 'video'
            ? draft.media || 'https://www.w3schools.com/html/mov_bbb.mp4'
            : '',
      poster:
        draft.type === 'video'
          ? 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80'
          : '',
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      saved: false,
      expanded: false,
      hashtags: draft.content.match(/#\w+/g) || ['#NewPost']
    };

    setPosts((prev) => [newPost, ...prev]);
    setVisibleCount((prev) => Math.min(prev + 1, posts.length + 1));
    setDraft({ content: '', type: 'text', media: '' });
  };

  return (
    <section className="home-shell">
      <aside className="left-rail">
        <div className="card profile-card">
          <div className="profile-hero" />
          <div className="profile-meta">
            <div className="avatar avatar-lg">AY</div>
            <h2>Alicia Young</h2>
            <p>Healthcare Strategy & Talent Growth</p>
          </div>
          <div className="profile-stats">
            <div>
              <strong>1.2k</strong>
              <span>Followers</span>
            </div>
            <div>
              <strong>84</strong>
              <span>Posts</span>
            </div>
          </div>
        </div>

        <div className="card trending-card">
          <h3>Trending topics</h3>
          <ul>
            <li>#NurseLeadership</li>
            <li>#CareDelivery</li>
            <li>#DigitalHealth</li>
            <li>#PatientSafety</li>
          </ul>
        </div>
      </aside>

      <div className="feed-column">
        <form className="card composer" onSubmit={createPost}>
          <div className="composer-header">
            <div className="avatar">AY</div>
            <div>
              <h3>Share an update</h3>
              <p>Professional insight, opportunity, or milestone</p>
            </div>
          </div>

          <textarea
            className="composer-textarea"
            placeholder="What would you like to share with your network?"
            value={draft.content}
            onChange={(event) => setDraft((prev) => ({ ...prev, content: event.target.value }))}
          />

          <div className="composer-toolbar">
            <div className="type-switcher">
              {['text', 'image', 'video'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`type-pill ${draft.type === type ? 'active' : ''}`}
                  onClick={() => setDraft((prev) => ({ ...prev, type }))}
                >
                  {type === 'text' ? 'Text' : type === 'image' ? 'Image' : 'Video'}
                </button>
              ))}
            </div>
            <button type="submit" className="btn primary">Publish</button>
          </div>

          {(draft.type === 'image' || draft.type === 'video') && (
            <input
              className="composer-input"
              type="url"
              placeholder={draft.type === 'image' ? 'Paste an image URL' : 'Paste a video URL'}
              value={draft.media}
              onChange={(event) => setDraft((prev) => ({ ...prev, media: event.target.value }))}
            />
          )}
        </form>

        {visiblePosts.map((post) => {
          const preview = post.content.length > 220 && !post.expanded ? `${post.content.slice(0, 220)}...` : post.content;

          return (
            <article key={post.id} className="card post-card">
              <div className="post-header">
                <div className="post-author">
                  <div className="avatar" style={{ background: post.author.accent }}>
                    {post.author.avatar}
                  </div>
                  <div>
                    <h4>{post.author.name}</h4>
                    <p>{post.author.headline}</p>
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>

              <div className="post-body">
                <p>{preview}</p>
                {post.content.length > 220 && (
                  <button type="button" className="text-link" onClick={() => toggleExpanded(post.id)}>
                    {post.expanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>

              {post.type !== 'text' && post.media && (
                <div className="post-media">
                  {post.type === 'image' ? (
                    <img src={post.media} alt="Post media" />
                  ) : (
                    <video controls poster={post.poster}>
                      <source src={post.media} type="video/mp4" />
                    </video>
                  )}
                </div>
              )}

              <div className="tag-row">
                {post.hashtags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="post-actions">
                <button type="button" className={`action-btn ${post.liked ? 'active' : ''}`} onClick={() => toggleReaction(post.id, 'liked')}>
                  ♥ {post.likes}
                </button>
                <button type="button" className="action-btn">💬 {post.comments}</button>
                <button type="button" className="action-btn">↗ {post.shares}</button>
                <button type="button" className={`action-btn ${post.saved ? 'active' : ''}`} onClick={() => toggleReaction(post.id, 'saved')}>
                  🔖 {post.saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="right-rail">
        <div className="card insight-card">
          <h3>Professional pulse</h3>
          <p>Thoughtful updates and concise leadership notes are driving stronger engagement this week.</p>
          <div className="insight-metric">
            <strong>+24%</strong>
            <span>engagement growth</span>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default Home;
