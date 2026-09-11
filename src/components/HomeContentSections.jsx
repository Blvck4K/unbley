import React from 'react';

const sectionStyle = {
  padding: '80px 0',
  backgroundColor: 'var(--bg-white)',
  borderBottom: '1px solid var(--border-color)'
};

const points = [
  ['Own Your Store', 'Build a digital home for your brand instead of depending entirely on social media platforms.'],
  ['Look More Professional', 'Give customers a dedicated shopping experience designed around your brand.'],
  ['Turn Attention Into Sales', 'Move customers from seeing your products to actually browsing, ordering and paying.']
];

const categories = [
  'Fashion & Clothing', 'Beauty & Cosmetics', 'Electronics & Gadgets', 'Food & Beverages',
  'Digital Products', 'Services & More'
];

const experienceBenefits = [
  ['Easy Product Discovery', 'Customers can browse your products in one organized place.'],
  ['Simple Checkout', 'Make the buying process clearer and easier for your customers.'],
  ['Professional Experience', 'Build trust with a storefront that feels like a real business.'],
  ['Available Anytime', "Your store can be accessed by customers whenever they're ready to shop."]
];

export default function HomeContentSections() {
  return (
    <>
      <section style={sectionStyle}>
        <div className="container">
          <div className="section-head">
            <h2>Your Business Deserves More Than an Instagram Page</h2>
            <p className="text-secondary">Social media is great for attracting attention, but your business needs a home you control. Unbley gives your brand a professional online storefront where customers can discover your products, place orders and buy with confidence.</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {points.map(([title, description]) => (
              <div className="feature-card" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...sectionStyle, backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <div className="section-head">
            <h2>Sell What Your Business Offers</h2>
            <p className="text-secondary">Whether you sell physical products, digital products, services, or run a growing brand, Unbley gives you a professional online storefront to reach your customers.</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {categories.map((category) => <div className="feature-card" key={category}><h3>{category}</h3></div>)}
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <div className="container">
          <div className="section-head">
            <h2>Everything in One Place</h2>
            <p className="text-secondary">Stop piecing your online business together with different tools. Unbley brings your storefront, products, orders, customers and payments together in one platform.</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {['Your Store', 'Your Products', 'Your Customers', 'Your Orders', 'Your Payments', 'Your Brand'].map((item) => <div className="feature-card" key={item}><h3>{item}</h3></div>)}
          </div>
          <p className="text-center" style={{ marginTop: '32px', fontWeight: '700' }}>One platform. One dashboard. One place to grow your business online.</p>
        </div>
      </section>

      <section style={{ ...sectionStyle, backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <div className="section-head">
            <h2>Give Your Customers a Better Way to Shop</h2>
            <p className="text-secondary">Your customers shouldn't have to search through messages, screenshots and social media posts to place an order. Give them a proper storefront where they can discover your products and shop with confidence.</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {experienceBenefits.map(([title, description]) => <div className="feature-card" key={title}><h3>{title}</h3><p>{description}</p></div>)}
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <div className="container">
          <div className="section-head">
            <h2>Social Media Gets Attention. Your Store Closes the Sale.</h2>
            <p className="text-secondary">Use social media to bring people to your brand. Use your Unbley store to give them a place to shop.</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="feature-card"><h3>Social Media</h3><p>Great for discovery and engagement.</p></div>
            <div className="feature-card"><h3>Your Unbley Store</h3><p>Built for showcasing products, taking orders and creating a professional buying experience.</p></div>
          </div>
          <p className="text-center" style={{ marginTop: '32px', fontWeight: '700' }}>Use both. Let each one do what it does best.</p>
        </div>
      </section>
    </>
  );
}