import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">drip</div>
      <p className="footer-text">
        © {new Date().getFullYear()} Drip · Built with TMDb &amp; VidSrc
        
      </p>
      <p className="footer-disclaimer">
        Drip does not host or store any media content. All streams are sourced via third-party embed providers. Movie data &amp; images provided by TMDb.
      </p>
    </footer>
  );
}
