import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import ProductCard from '../components/shop/ProductCard';
import { Icon } from '../components/common/Icons';
import HeroImage from '../assets/herosection1.jpg';
import Logo from '../assets/logo.png';
import Icon2 from '../assets/icon.png';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [signature, setSignature] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [freshFlowers, setFreshFlowers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    productService.getAll({ available: true })
      .then(res => {
        const all = res.data;

        // Featured Blooms
        const f = all.filter(p => p.isFeatured).slice(0, 4);
        setFeatured(f.length >= 4 ? f : all.slice(0, 4));

        // Signature Collection
        const sigCats = ['30-bouquets', '50-bouquets', '100-bouquets', '1000-bouquets'];
        setSignature(all.filter(p => sigCats.includes(p.category)).slice(0, 4));

        // Events & Occasional Collection
        const eventCats = ['weddings', 'birthdays', 'anniversaries', 'proposals', 'graduations', 'baby-showers', 'festive-events', 'corporate-events'];
        setOccasions(all.filter(p => eventCats.includes(p.category)).slice(0, 4));

        // Fresh Flowers
        setFreshFlowers(all.filter(p => p.category === 'fresh-flowers').slice(0, 4));
      }).catch(() => { });
  }, []);

  useEffect(() => {
    // Scroll Reveal Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, [featured, signature, occasions, freshFlowers]);

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div
          className="hero-bg-animate"
          style={{ backgroundImage: `url(${HeroImage})` }}
        ></div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <h1 className="hero-title fade-in">
                Every Petal<br />Tells a Story
              </h1>
              <p className="hero-subtitle fade-in" style={{ animationDelay: '0.2s' }}>
                Handcrafted bouquets, fresh flowers, and custom arrangements to celebrate life's most beautiful moments.
              </p>
              <div className="d-flex flex-wrap gap-3 fade-in" style={{ animationDelay: '0.4s' }}>
                <Link to="/shop" className="btn btn-primary btn-lg d-flex align-items-center gap-2">
                  <Icon.Flower size={20} color="white" />
                  Shop Now
                </Link>
                <Link to="/custom-bouquet" className="btn btn-outline-light btn-lg d-flex align-items-center gap-2" style={{ borderRadius: '50px', fontWeight: 500, padding: '0.6rem 1.4rem' }}>
                  {/* <Icon.Palette size={20} color="white" /> */}
                  <img src={Icon2} alt="Build Your Dream Bouquet Logo" style={{ height: '20px', width: 'auto', color: 'white' }} />
                  Create Bouquet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-5 reveal" style={{ background: 'var(--white)' }}>
          <div className="container">
            <div className="section-header">
              <h2>Featured Blooms</h2>
              <p>Our most-loved arrangements, curated with love</p>
              <div className="section-divider"></div>
            </div>
            <div className="row g-4">
              {featured.map((product, i) => (
                <div key={product._id} className={`col-6 col-md-4 col-lg-3 reveal reveal-delay-${i + 1}`}>
                  <ProductCard product={product} onPreview={setPreviewImage} />
                </div>
              ))}
            </div>
            <div className="text-center mt-4 reveal">
              <Link to="/shop" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
                View All Products
                <Icon.ArrowRight size={16} color="var(--rose)" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Signature Collection */}
      {signature.length > 0 && (
        <section className="py-5 reveal" style={{ background: 'var(--ivory)' }}>
          <div className="container">
            <div className="section-header">
              <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Our Signature Bouquet Collection</h2>
              <p>Exquisite designs ranging from 30 to 1000 blooms</p>
              <div className="section-divider"></div>
            </div>
            <div className="row g-4">
              {signature.map((product, i) => (
                <div key={product._id} className={`col-6 col-md-4 col-lg-3 reveal reveal-delay-${i + 1}`}>
                  <ProductCard product={product} onPreview={setPreviewImage} />
                </div>
              ))}
            </div>
            <div className="text-center mt-4 reveal">
              <Link to="/shop" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
                Explore Signature Series
                <Icon.ArrowRight size={16} color="var(--rose)" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Events Collection */}
      {occasions.length > 0 && (
        <section className="py-5 reveal" style={{ background: 'var(--ivory)' }}>
          <div className="container">
            <div className="section-header">
              <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Events & Occasional Bouquet Collection</h2>
              <p>Perfectly curated for weddings, anniversaries, and more</p>
              <div className="section-divider"></div>
            </div>
            <div className="row g-4">
              {occasions.map((product, i) => (
                <div key={product._id} className={`col-6 col-md-4 col-lg-3 reveal reveal-delay-${i + 1}`}>
                  <ProductCard product={product} onPreview={setPreviewImage} />
                </div>
              ))}
            </div>
            <div className="text-center mt-4 reveal">
              <Link to="/shop" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
                Shop by Occasion
                <Icon.ArrowRight size={16} color="var(--rose)" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-5 reveal" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Bloom & Petal</h2>
            <p>We combine passion with the freshest blooms to create magic</p>
            <div className="section-divider"></div>
          </div>
          <div className="row g-4 mt-2">
            {[
              { icon: <Icon.Flower size={32} color="var(--rose)" />, title: 'Premium Quality', desc: 'Hand-picked daily from sustainable farms to ensure lasting freshness.' },
              { icon: <Icon.Palette size={32} color="var(--rose)" />, title: 'Expert Artistry', desc: 'Each bouquet is a unique masterpiece, crafted by award-winning florists.' },
              { icon: <Icon.Clock size={32} color="var(--rose)" />, title: 'Fast Delivery', desc: 'Reliable same-day delivery to keep your surprises perfectly timed.' },
              { icon: <Icon.PersonCircle size={32} color="var(--rose)" />, title: 'Personalized Care', desc: 'Tailor your gifts with custom messages and unique floral choices.' },
            ].map((feature, i) => (
              <div key={i} className={`col-6 col-md-3 reveal reveal-delay-${i + 1}`}>
                <div className="bloom-card p-4 h-100 d-flex flex-column align-items-center text-center">
                  <div style={{ background: 'var(--blush-light)', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                    {feature.icon}
                  </div>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.6rem' }}>{feature.title}</h5>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-mid)', margin: 0 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Bouquet CTA */}
      <section className="py-5 reveal fade-in-scale" style={{ background: 'linear-gradient(135deg, var(--blush-light), var(--champagne))' }}>
        <div className="container text-center">
          {/* <Icon.Custom size={100} style={{ margin: '0 auto 1rem' }} /> */}
          <img src={Icon2} alt="Build Your Dream Bouquet Logo" style={{ height: '100px', width: 'auto', margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.8rem' }}>Build Your Dream Bouquet</h2>
          <p style={{ color: 'var(--text-mid)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            Choose your favourite flowers, pick a wrapper, and we'll craft it exactly how you envision it.
          </p>
          <div className="reveal reveal-delay-2">
            <Link to="/custom-bouquet" className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2">
              <Icon.Palette size={20} color="white" />
              Start Creating
            </Link>
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-content" onClick={e => e.stopPropagation()}>
            <button className="image-preview-close" onClick={() => setPreviewImage(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <img src={previewImage} alt="Preview" />
          </div>
        </div>
      )}
    </>
  );
}
