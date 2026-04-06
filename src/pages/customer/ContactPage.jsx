export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title text-center">📞 Contact Us</h1>
        <p className="section-subtitle text-center">Get in touch for orders, inquiries, or partnerships</p>

        <div className="contact-cards">
          <div className="contact-card">
            <div className="icon">📍</div>
            <h3>Visit Us</h3>
            <p>VVS Banana Cold Store<br/>Mhow-Neemuch Road<br/>Indore, Madhya Pradesh 452001</p>
          </div>
          <div className="contact-card">
            <div className="icon">📞</div>
            <h3>Call Us</h3>
            <p>+91 9111919979<br/>+91 9111919979<br/>Mon-Sat: 6 AM - 10 PM</p>
          </div>
          <div className="contact-card">
            <div className="icon">📧</div>
            <h3>Email Us</h3>
            <p>vvsbananasupply@gmail.com<br/>orders@vvsbanana.com</p>
          </div>
          <div className="contact-card">
            <div className="icon">💬</div>
            <h3>WhatsApp</h3>
            <p>
              Quick orders via WhatsApp<br/>
              <a href="https://wa.me/919111919979" target="_blank" rel="noopener" style={{color: '#25D366', fontWeight: 600}}>
                Click to Chat →
              </a>
            </p>
          </div>
        </div>

        {/* Map / Business Info */}
        <div className="card" style={{marginTop: 48, overflow: 'hidden'}}>
          <div className="card-body" style={{padding: 0}}>
            <div className="grid" style={{gridTemplateColumns: '1fr 1fr'}}>
              <div style={{padding: 48, background: 'linear-gradient(135deg, var(--green-700), var(--green-900))', color: 'white'}}>
                <h2 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: 24}}>🍌 VVS Banana Cold Store</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                  <div>
                    <h4 style={{fontWeight: 600, marginBottom: 4}}>Wholesale Inquiries</h4>
                    <p style={{opacity: 0.8}}>Minimum order: 50 kg<br/>Volume discounts available<br/>Credit facility for regular buyers</p>
                  </div>
                  <div>
                    <h4 style={{fontWeight: 600, marginBottom: 4}}>Retail Sales</h4>
                    <p style={{opacity: 0.8}}>Walk-in or delivery<br/>Minimum order: 1 kg<br/>Same day delivery in Indore</p>
                  </div>
                  <div>
                    <h4 style={{fontWeight: 600, marginBottom: 4}}>Business Hours</h4>
                    <p style={{opacity: 0.8}}>Monday – Saturday: 6:00 AM – 10:00 PM<br/>Sunday: 7:00 AM – 2:00 PM</p>
                  </div>
                </div>
              </div>
              <div style={{padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--gray-50)'}}>
                <div style={{fontSize: '6rem', marginBottom: 16}}>🗺️</div>
                <h3 style={{fontWeight: 700, marginBottom: 8}}>We're on Google Maps</h3>
                <p style={{color: 'var(--gray-500)', textAlign: 'center', marginBottom: 16}}>Find us easily on Mhow-Neemuch Road, Indore</p>
                <a
                  href="https://maps.google.com/?q=Indore+Mandi+Banana+Market"
                  target="_blank"
                  rel="noopener"
                  className="btn btn-primary"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
