const images = [
  "/examples/1.webp", "/examples/2.webp", "/examples/3.webp", 
  "/examples/4.webp", "/examples/5.webp", "/examples/6.webp"
];

type GallerySectionProps = {
  title: string
}

export const GallerySection = ({ title }: GallerySectionProps) => (
  <div className="gallery-section">
    <h2 className="gallery-title">{title}</h2>
    <div className="carousel-container">
      <div className="carousel-track">
        {[...images, ...images].map((src, i) => (
          <div key={i} className="carousel-item">
            <img src={src} alt="Work example" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
