import { useEffect } from 'react';

export default function LegalPage({ type }: { type: 'terms' | 'privacy' | 'dmca' }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const content = {
    terms: {
      title: "Terms of Service",
      body: (
        <>
          <h3 style={{marginTop: "1.5rem", marginBottom: "0.5rem", color: "#fff"}}>1. Acceptance of Terms</h3>
          <p>By accessing or using Kaizoku, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our service.</p>
          <h3 style={{marginTop: "1.5rem", marginBottom: "0.5rem", color: "#fff"}}>2. Description of Service</h3>
          <p>Kaizoku provides an index and links to anime content available on the internet. We do not host any media files on our own servers. All content is provided by non-affiliated third parties.</p>
          <h3 style={{marginTop: "1.5rem", marginBottom: "0.5rem", color: "#fff"}}>3. User Conduct</h3>
          <p>You agree to use Kaizoku only for lawful purposes. You are prohibited from violating or attempting to violate the security of the website.</p>
          <h3 style={{marginTop: "1.5rem", marginBottom: "0.5rem", color: "#fff"}}>4. Changes to Terms</h3>
          <p>We reserve the right to modify these terms at any time. Your continued use of the site after such changes constitutes your acceptance of the new terms.</p>
        </>
      )
    },
    privacy: {
      title: "Privacy Policy",
      body: (
        <>
          <h3 style={{marginTop: "1.5rem", marginBottom: "0.5rem", color: "#fff"}}>1. Information We Collect</h3>
          <p>We do not collect personally identifiable information unless you explicitly provide it (e.g., through account registration). We may collect anonymous usage data to improve our services.</p>
          <h3 style={{marginTop: "1.5rem", marginBottom: "0.5rem", color: "#fff"}}>2. Cookies and Local Storage</h3>
          <p>We use local storage strictly to save your watch history locally on your device. We do not use third-party tracking cookies.</p>
          <h3 style={{marginTop: "1.5rem", marginBottom: "0.5rem", color: "#fff"}}>3. Third-Party Links</h3>
          <p>Our site contains links to other websites and third-party media players. We are not responsible for the privacy practices or content of these third parties.</p>
          <h3 style={{marginTop: "1.5rem", marginBottom: "0.5rem", color: "#fff"}}>4. Data Security</h3>
          <p>We implement basic security measures to maintain the safety of the site, but no method of transmission over the internet is completely secure.</p>
        </>
      )
    },
    dmca: {
      title: "DMCA Notice",
      body: (
        <>
          <p>Kaizoku operates as an index and database of anime content found publicly on the internet, in principle similar to a search engine. We strongly believe in the protection of intellectual property and would be willing to assist when possible and applicable.</p>
          <h3 style={{marginTop: "1.5rem", marginBottom: "0.5rem", color: "#fff"}}>No Hosted Content</h3>
          <p>We do not host any video, media, or files on our own servers or network. All streaming links are directly embedded from third-party services and are completely outside of our control.</p>
          <h3 style={{marginTop: "1.5rem", marginBottom: "0.5rem", color: "#fff"}}>Take-Down Requests</h3>
          <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible via this site, you must contact the third-party providers who are actually hosting the files. Taking down links on Kaizoku will not remove the files from the internet. Please send copyright infringement notices to the actual media hosts.</p>
        </>
      )
    }
  };

  const current = content[type];

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "120px", paddingBottom: "80px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "var(--color-accent)" }}>{current.title}</h1>
      <div className="legal-content-body" style={{ lineHeight: "1.8", color: "var(--color-text-secondary)", fontSize: "1.1rem" }}>
        {current.body}
      </div>
    </div>
  );
}
