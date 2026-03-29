import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scissors,
  Calendar,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Clock,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Star,
  Quote
} from 'lucide-react';
import { InlineWidget } from 'react-calendly';
import { cn } from './lib/utils';
import { Service } from './data/services';
import Papa from 'papaparse';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRkUsenx0fR1F79g5Dx4eH4CEoJCDsAxZVneVM2G-rtlvVHqM_WFRwhDg5LQc4zRTlLvAk6wXMsoPp8/pub?output=csv';

// --- Constants & Data ---
const GALLERY = [
  '/fotos/foto1.jpg',
  '/fotos/foto2.jpg',
  '/fotos/foto3.jpg',
  '/fotos/foto4.jpg',
  '/fotos/foto5.jpg',
  '/fotos/foto6.jpg',
];

const DEFAULT_IMAGES = {
  hero: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1920&auto=format&fit=crop",
  gallery: [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop",
    "https://www.kokorobelleza.com/images/imagenes/003-servicios/corte-de-pelo-hombre-2022/peluqueria-de-hombre-valladolid-tendencia2022-Fade.jpg",
    "https://images.unsplash.com/photo-1599351431247-f13b3828e239?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512690196252-741d2fd36ad2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1634449507606-5704d7013bd2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593702295094-272a9f01f61e?q=80&w=800&auto=format&fit=crop"
  ]
};

const TESTIMONIALS = [
  {
    name: "Elena García",
    text: "El mejor corte que me han hecho en años. La atención es impecable y el ambiente muy relajante.",
    stars: 5,
    role: "Cliente habitual"
  },
  {
    name: "Marcos Ruiz",
    text: "Grandes profesionales. Me asesoraron con el color y el resultado superó mis expectativas.",
    stars: 5,
    role: "Nuevo cliente"
  },
  {
    name: "Sofía Martínez",
    text: "Excelente servicio de balayage. Muy detallistas y amables. ¡Totalmente recomendado!",
    stars: 4,
    role: "Cliente fiel"
  },
  {
    name: "Javier López",
    text: "Ambiente moderno y trato cercano. El afeitado con toalla caliente es una experiencia de diez.",
    stars: 5,
    role: "Cliente habitual"
  }
];

const GENERAL_BOOKING_SERVICE: Service = {
  name: "Cita General",
  price: "",
  duration: "",
  description: "Reserva una cita general con nosotros.",
  calendlyUrl: "https://cal.com/lucas-rodriguez-moreno-vw1teb/reservar-cita"
};

// --- Components ---

const SafeImage = ({ src, fallback, alt, className, ...props }: any) => {
  const [hasError, setHasError] = useState(false);

  return (
    <img
      {...props}
      src={hasError ? fallback : src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
};

const BookingModal = ({ isOpen, onClose, service }: { isOpen: boolean, onClose: () => void, service: Service | null }) => {
  const calendlyUrl = service?.calendlyUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-[#1a1a1a] w-full max-w-4xl rounded-3xl overflow-hidden relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 pb-0">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Reservar: {service?.name}
              </h3>
              <div className="w-12 h-1 bg-white/20 mb-4" />
            </div>

            <div className="min-h-[600px] bg-[#1a1a1a]">
              {calendlyUrl ? (
                <div key={calendlyUrl}>
                  <InlineWidget
                    url={calendlyUrl}
                    styles={{ height: '600px', width: '100%' }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px] text-center px-6">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Calendar className="w-8 h-8 text-white/40" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Reserva Online no disponible</h4>
                  <p className="text-neutral-400 max-w-sm">
                    Lo sentimos, el servicio de <strong>{service?.name}</strong> aún no está disponible para reserva online.
                    Por favor, llámanos al <span className="text-white">+34 912 345 678</span> para agendar tu cita.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ onGeneralBooking }: { onGeneralBooking: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Galería', href: '#galeria' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between",
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
    )}>
      <div className="flex items-center gap-2">
        <Scissors className={cn("w-8 h-8", isScrolled ? "text-neutral-900" : "text-white")} />
        <span className={cn(
          "text-2xl font-serif font-bold tracking-tighter",
          isScrolled ? "text-neutral-900" : "text-white"
        )}>
          ESTILO & TIJERA
        </span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={cn(
              "text-sm font-medium uppercase tracking-widest hover:opacity-70 transition-opacity",
              isScrolled ? "text-neutral-900" : "text-white"
            )}
          >
            {link.name}
          </a>
        ))}
        <button
          onClick={onGeneralBooking}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-bold transition-all",
            isScrolled
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "bg-white text-neutral-900 hover:bg-neutral-100"
          )}
        >
          RESERVAR CITA
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className={cn("w-8 h-8", isScrolled ? "text-neutral-900" : "text-white")} />
        ) : (
          <Menu className={cn("w-8 h-8", isScrolled ? "text-neutral-900" : "text-white")} />
        )}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-neutral-900 border-b border-neutral-100 pb-2"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onGeneralBooking();
              }}
              className="bg-neutral-900 text-white text-center py-3 rounded-xl font-bold"
            >
              RESERVAR CITA
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onGeneralBooking }: { onGeneralBooking: () => void }) => {
  return (
    <section id="inicio" data-theme="dark" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src="/fotos/hero.jpg"
          fallback={DEFAULT_IMAGES.hero}
          alt="Barber Shop Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-white/80 uppercase tracking-[0.3em] text-sm font-medium mb-4 block">
            Arte & Precisión en cada corte
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-white font-bold leading-tight mb-8">
            Tu estilo, <br />
            <span className="italic text-neutral-300">nuestra pasión.</span>
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGeneralBooking}
              className="w-full sm:w-auto px-10 py-4 bg-white text-neutral-900 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              RESERVAR AHORA
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

const Services = ({
  services,
  isLoading,
  onSelectService
}: {
  services: Service[],
  isLoading: boolean,
  onSelectService: (service: Service) => void
}) => {
  return (
    <section id="servicios" className="pt-24 pb-12 bg-neutral-50 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">Nuestros Servicios</h2>
          <div className="w-20 h-1 bg-neutral-900 mx-auto mb-6" />
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios de peluquería y barbería, utilizando siempre los mejores productos del mercado.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-neutral-900">{service.name}</h3>
                  <span className="text-xl font-serif font-bold text-neutral-900">{service.price}</span>
                </div>
                <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                  <span className="text-xs text-neutral-400 flex items-center gap-1 uppercase tracking-wider">
                    <Clock className="w-3 h-3" /> {service.duration}
                  </span>
                  <button
                    onClick={() => onSelectService(service)}
                    className="text-neutral-900 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Reservar <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Gallery = () => {
  return (
    <section id="galeria" className="pt-12 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">Nuestro Trabajo</h2>
            <p className="text-neutral-600">Echa un vistazo a algunos de nuestros últimos estilos.</p>
          </div>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-900 font-bold hover:opacity-70 transition-opacity">
            <Instagram className="w-5 h-5" /> SÍGUENOS EN INSTAGRAM
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px] max-w-6xl mx-auto">
          {GALLERY.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, rotate: i % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
              viewport={{ once: true, margin: "-50px" }}
              className={cn(
                "overflow-hidden rounded-3xl shadow-xl transition-all duration-500 bg-neutral-100",
                i % 4 === 0 ? "md:row-span-2" : "md:row-span-1"
              )}
            >
              <SafeImage
                src={img}
                fallback={DEFAULT_IMAGES.gallery[i]}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="resenas" data-theme="dark" className="py-12 bg-neutral-900 text-white overflow-hidden border-b border-white/10">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Reseñas</h2>
        <div className="w-16 h-1 bg-white/20 mx-auto mb-8" />

        <div className="relative h-[180px] md:h-[140px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < TESTIMONIALS[index].stars ? "fill-yellow-400 text-yellow-400" : "text-white/20"
                    )}
                  />
                ))}
              </div>
              <p className="text-lg md:text-xl font-serif italic mb-4 leading-relaxed">
                "{TESTIMONIALS[index].text}"
              </p>
              <div>
                <span className="block font-bold text-base">{TESTIMONIALS[index].name}</span>
                <span className="text-xs text-white/50 uppercase tracking-widest">{TESTIMONIALS[index].role}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prevTestimonial}
            className="p-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex justify-center gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === index ? "bg-white w-4" : "bg-white/20"
                )}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="p-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

const Location = () => {
  return (
    <section id="ubicacion" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Mapa a la izquierda */}
          <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2308.231627867672!2d-5.988591925684116!3d37.36054923591551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd126c2b211306c9%3A0xb91586f496c44812!2sPeluquer%C3%ADa%20Reina%20Mercedes!5e1!3m2!1ses!2ses!4v1774729914483!5m2!1ses!2ses"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Información a la derecha */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-serif font-bold text-neutral-900 mb-4 tracking-tight">Encuéntranos</h2>
              <div className="w-12 h-1 bg-neutral-900/10 mb-6" />
              <p className="text-neutral-600 leading-relaxed text-lg">
                Visítanos en nuestra ubicación en Sevilla. Ofrecemos un ambiente acogedor y profesional para que te sientas como en casa mientras cuidamos de tu imagen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-100 rounded-2xl text-neutral-900">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">Dirección</h4>
                  <p className="text-sm text-neutral-500">C. Tarfia, 4, 41012 Sevilla</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-100 rounded-2xl text-neutral-900">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">Teléfono</h4>
                  <p className="text-sm text-neutral-500">+34 954 61 54 54</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-100 rounded-2xl text-neutral-900">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">Horario</h4>
                  <p className="text-sm text-neutral-500">L-V: 09:30 - 20:30<br />S: 09:30 - 14:30</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-100 rounded-2xl text-neutral-900">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">Síguenos</h4>
                  <p className="text-sm text-neutral-500">@peluqueria_reinamercedes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contacto" className="bg-neutral-50 py-12 px-6 border-t border-neutral-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-neutral-900" />
            <span className="text-xl font-serif font-bold tracking-tighter text-neutral-900">
              ESTILO & TIJERA
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-900" />
              <span>C. Tarfia, 4, 41012 Sevilla</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-900" />
              <span>+34 954 61 54 54</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-900" />
              <span>L-V: 09:30-20:30 | S: 09:30-14:30</span>
            </div>
          </div>

          <div className="flex gap-4">
            <a href="#" className="text-neutral-900 hover:opacity-50 transition-opacity">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-neutral-900 hover:opacity-50 transition-opacity">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 text-center text-neutral-400 text-xs">
          <p>© {new Date().getFullYear()} Estilo & Tijera. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          complete: (results) => {
            const parsedServices: Service[] = results.data.map((row: any) => {
              // Clean up values to remove whitespace
              const cleanRow: any = {};
              Object.keys(row).forEach(key => {
                cleanRow[key] = typeof row[key] === 'string' ? row[key].trim() : row[key];
              });

              return {
                name: cleanRow.NOMBRE || cleanRow.name || '',
                price: cleanRow.PRECIO || cleanRow.price || '',
                duration: cleanRow.DURACIÓN || cleanRow.duration || '',
                description: cleanRow.DECRIPCION || cleanRow.DESCRIPCION || cleanRow.description || '',
                calendlyUrl: cleanRow.CALENDLY_URL || cleanRow.calendlyUrl || undefined,
              };
            }).filter((s: Service) => s.name); // Filter out empty rows
            setServices(parsedServices);
            setIsLoading(false);
          },
          error: (error: any) => {
            console.error("Error parsing CSV:", error);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching services:", error);
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleSelectService = (service: Service) => {
    // Check if calendlyUrl exists and is a valid non-empty string
    const url = service.calendlyUrl;
    if (url && typeof url === 'string' && url.trim().startsWith('http')) {
      setSelectedService(service);
      setIsModalOpen(true);
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleGeneralBooking = () => {
    setSelectedService(GENERAL_BOOKING_SERVICE);
    setIsModalOpen(true);
  };

  return (
    <div className="font-sans text-neutral-900 bg-white selection:bg-neutral-900 selection:text-white">
      <Navbar onGeneralBooking={handleGeneralBooking} />
      <main>
        <Hero onGeneralBooking={handleGeneralBooking} />
        <Services
          services={services}
          isLoading={isLoading}
          onSelectService={handleSelectService}
        />
        <Gallery />
        <Testimonials />
        <Location />
      </main>
      <Footer />

      {/* Floating Action Button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20, x: '-50%' }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, 10, 0],
              x: '-50%'
            }}
            exit={{ opacity: 0, scale: 0.5, y: 20, x: '-50%' }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 }
            }}
            className="fixed bottom-8 left-1/2 z-[60]"
          >
            <button
              onClick={handleGeneralBooking}
              className="flex items-center gap-3 px-8 py-4 rounded-full font-bold shadow-2xl transition-all duration-500 group bg-neutral-900 text-white hover:bg-neutral-800"
            >
              <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">RESERVAR AHORA</span>
              <span className="sm:hidden">RESERVAR</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />

      {/* Elegant Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[200] bg-neutral-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-md"
          >
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Reserva online no disponible</p>
              <p className="text-xs text-white/60">Llámanos para agendar este servicio.</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
