import { useSite } from '../context/SiteContext.jsx';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Blog from '../components/Blog.jsx';
import Projects from '../components/Projects.jsx';
import Resources from '../components/Resources.jsx';
import Social from '../components/Social.jsx';
import Footer from '../components/Footer.jsx';

export default function Home() {
  const { config, loading, error } = useSite();

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>加载失败，请刷新页面</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Blog />
        <Projects />
        <Resources />
        <Social />
      </main>
      <Footer />
    </>
  );
}