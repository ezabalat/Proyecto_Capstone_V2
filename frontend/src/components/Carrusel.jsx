import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Carrusel() {
  const slides = [
    {
      imagen:
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200",
      titulo: "Los Mejores Conciertos",
      subtitulo: "Vive la experiencia musical del año",
      cta: "Ver Eventos",
    },
    {
      imagen:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200",
      titulo: "Festivales Increíbles",
      subtitulo: "Disfruta con tus artistas favoritos",
      cta: "Descubrir Más",
    },
    {
      imagen:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200",
      titulo: "Eventos Exclusivos",
      subtitulo: "No te pierdas las mejores presentaciones",
      cta: "Comprar Ahora",
    },
  ];

  return (
    <div className="mb-16 -mt-8">
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        transitionTime={600}
        className="rounded-lg overflow-hidden shadow-2xl"
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative h-96 md:h-[500px]">
            <img
              src={slide.imagen}
              alt={slide.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-4 animate-fade-in">
                <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                  {slide.titulo}
                </h2>
                <p className="text-xl md:text-2xl mb-8 drop-shadow-lg">
                  {slide.subtitulo}
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Carrusel;
