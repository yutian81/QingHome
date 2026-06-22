import { useSite } from '../context/SiteContext.jsx';
import Section from './Section.jsx';
import FaIcon from './Icons.jsx';

export default function Blog() {
  const { config } = useSite();
  const posts = config?.blogPosts || [];

  return (
    <Section id="blog" title="博客" icon="fa-solid fa-feather">
      <div className="card-grid">
        {posts.map((post, i) => (
          <a key={i} href={post.url} className="card blog-card" target="_blank" rel="noopener noreferrer">
            <div className="card-body">
              <div className="blog-meta">
                <span className="blog-date">{post.date}</span>
                {post.tags && post.tags.split(',').map((tag, j) => (
                  <span key={j} className="card-tag">{tag.trim()}</span>
                ))}
              </div>
              <h3 className="card-title">{post.title}</h3>
              <p className="card-desc">{post.excerpt}</p>
            </div>
            <div className="card-arrow"><FaIcon icon="fa-solid fa-arrow-right" /></div>
          </a>
        ))}
      </div>
    </Section>
  );
}