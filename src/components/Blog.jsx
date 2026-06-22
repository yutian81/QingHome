import { useSite } from '../context/SiteContext.jsx';
import Section from './Section.jsx';
import { IconArrow, IconExternal } from './Icons.jsx';

export default function Blog() {
  const { config } = useSite();
  const posts = config?.blogPosts || [];

  return (
    <Section
      id="blog"
      eyebrow="Blog"
      title="博客文章"
      subtitle="把踩过的坑、想清楚的道理写下来"
      icon="fa-solid fa-feather"
      action={
        <a className="section__link" href="https://blog.notett.com" target="_blank" rel="noreferrer">
          访问我的博客 <IconExternal size={14} />
        </a>
      }
    >
      <div className="blog">
        {posts.map((post, i) => (
          <a className="blog__item" href={post.url} key={i} target="_blank" rel="noreferrer">
            <div className="blog__meta">
              <span className="blog__date">{post.date}</span>
              {post.tags && post.tags.split(',').map((tag, j) => (
                <span className="blog__tag" key={j}>{tag.trim()}</span>
              ))}
            </div>
            <h3 className="blog__title">{post.title}</h3>
            <p className="blog__excerpt">{post.excerpt}</p>
            <span className="blog__more">
              阅读全文 <IconArrow size={14} />
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}