"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Music, Gift, CheckCircle, CreditCard, Plus, Trash2, ChevronLeft, ChevronRight, Camera, Shirt } from "lucide-react";
import { motion } from "framer-motion";


export default function BirthdayInvitation() {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [playlistSong, setPlaylistSong] = useState("");
  const [playlistLink, setPlaylistLink] = useState("");
  const [playlistSuggestions, setPlaylistSuggestions] = useState<{song: string, link: string}[]>([]);
  const [attendees, setAttendees] = useState([{name: "", attendance: "si" as "si" | "no"}]);
  const [submitted, setSubmitted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const invitationData = {
    name: "Agustina",
    date: "7 de marzo del 2026",
    time: "21:00 horas",
    location: "Corrientes 1198, Rosario, Santa Fe",
    details: "¡Trae tu mejor sonrisa y ganas de bailar!",
    mercadoPago: "agustinaxv.cumple.mp",
    dressCode: "Formal - Elegante y sofisticado",
    closingMessage: "¡Espero verte en este día tan especial para compartir juntas este momento único!"
  };

  // Mock images for the carousel (in a real app, these would be actual image URLs)
const images = [
  { id: 1, src: "/fotos/img1.jpg", alt: "Foto de Agustina 1" },
  { id: 2, src: "/fotos/img2.jpg", alt: "Foto de Agustina 2" },
  { id: 3, src: "/fotos/img3.jpg", alt: "Foto de Agustina 3" },
  { id: 4, src: "/fotos/img4.jpg", alt: "Foto de Agustina 4" },
  { id: 5, src: "/fotos/img5.jpg", alt: "Foto de Agustina 5" },
  { id: 6, src: "/fotos/img6.jpg", alt: "Foto de Agustina 6" }
];

  // Set the target date (March 7, 2026 at 21:00)
  const targetDate = new Date(2026, 2, 7, 21, 0, 0).getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const copyToClipboard = () => {
    const text = `¡Estás invitada al XV de ${invitationData.name}!\n\nFecha: ${invitationData.date}\nHora: ${invitationData.time}\nLugar: ${invitationData.location}\n\n${invitationData.details}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openMaps = () => {
    window.open("https://www.google.com/maps/search/?api=1&query=Corrientes+1198,+Rosario,+Santa+Fe", "_blank");
  };

  /*const addPlaylistSuggestion = () => {
    if (playlistSong.trim() && playlistLink.trim()) {
      setPlaylistSuggestions([...playlistSuggestions, {song: playlistSong, link: playlistLink}]);
      setPlaylistSong("");
      setPlaylistLink("");
    }
  };*/
  const addPlaylistSuggestion = async () => {
  if (playlistSong.trim() && playlistLink.trim()) {
    const nuevaSugerencia = { song: playlistSong, link: playlistLink };

    // Actualiza el estado en el cliente
    setPlaylistSuggestions([...playlistSuggestions, nuevaSugerencia]);
    setPlaylistSong("");
    setPlaylistLink("");

    // Envía al servidor para guardar en el archivo
    try {
      const response = await fetch("/api/guardar-sugerencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaSugerencia),
      });

     const result = await response.json();
      if (!result.success) {
        console.error("❌ No se pudo guardar:", result.message);
      } else {
        console.log("✅", result.message);
      }
    } catch (error) {
      console.error("Error al enviar sugerencia:", error);
    }
  }
};
useEffect(() => {
  const fetchSuggestions = async () => {
    try {
      const res = await fetch("/data/playlist.json");
      if (res.ok) {
        const data = await res.json();
        setPlaylistSuggestions(data);
      }
    } catch (err) {
      console.error("Error al cargar sugerencias previas:", err);
    }
  };
  fetchSuggestions();
}, []);

  const removePlaylistSuggestion = (index: number) => {
    setPlaylistSuggestions(playlistSuggestions.filter((_, i) => i !== index));
  };

  const addAttendee = () => {
    setAttendees([...attendees, {name: "", attendance: "si"}]);
  };

  const updateAttendee = (index: number, field: string, value: string) => {
    const updated = [...attendees];
    if (field === "name") updated[index].name = value;
    if (field === "attendance") updated[index].attendance = value as "si" | "no";
    setAttendees(updated);
  };

  const removeAttendee = (index: number) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter((_, i) => i !== index));
    }
  };

  const confirmAttendance = () => {
    const validAttendees = attendees.filter(attendee => attendee.name.trim() !== "");
    if (validAttendees.length > 0) {
      // In a real app, you would send this data to a server
      console.log("Confirmations:", validAttendees);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const copyPaymentInfo = () => {
    navigator.clipboard.writeText(invitationData.mercadoPago);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Subtle wavy divider component
  const SubtleWavyDivider = () => (
    <div className="relative my-8 overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-purple-200"></div>
      </div>
      <div className="relative flex justify-center">
        <svg 
          className="w-full h-8 text-purple-200" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".5" 
            fill="currentColor"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );

 /* const handleConfirmarAsistencia = async () => {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitados: listaInvitados }) // listaInvitados = ['Juan', 'María']
    });

    const result = await response.json();

    if (result.ok) {
      alert("🎉 Confirmación enviada con éxito!");
    } else {
      alert("❌ Hubo un error al enviar el correo.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ No se pudo conectar con el servidor.");
  }
};

al boton 
<Button onClick={handleConfirmarAsistencia}>
  Confirmar asistencia
</Button>
En tu raíz del proyecto, creá o editá el archivo .env.local:

EMAIL_USER=tuusuario@gmail.com
EMAIL_PASS=tu_app_password


 Si usás Gmail, debés crear una App Password (no tu contraseña normal).
Podés hacerlo desde:
 https://myaccount.google.com/apppasswords
*/
// 🌟 Componente decorativo de estrellas

 const StarBackground = () => {
  const [stars, setStars] = useState<
    { id: number; size: number; top: number; left: number; duration: number }[]
  >([]);

  useEffect(() => {
    // Generar estrellas
    const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 1.5, // un poco más grandes
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 6 + 6, // movimiento más lento (6–12s)
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute bg-white rounded-full shadow-md"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.top}%`,
            left: `${star.left}%`,
            opacity: 0.9, // más brillantes
            filter: "blur(0.5px)", // leve difuminado
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            y: [0, -2, 2, 0], // movimiento más suave
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

  return (
    <div className="relative min-h-screen bg-[#7F00FF] flex items-center justify-center p-4 overflow-hidden">
      {/* ✨ Fondo animado de estrellas */}
      <StarBackground />
      <div className="relative w-full max-w-2xl">
        {/* Decorative floral elements */}
        {/* <div className="absolute -top-12 -left-12">
          <div className="w-32 h-32 relative">
            <div className="absolute inset-0 rounded-full bg-purple-400 opacity-20"></div>
            <div className="absolute inset-4 rounded-full bg-purple-300 opacity-30"></div>
            <div className="absolute inset-8 rounded-full bg-purple-200 opacity-40"></div>
          </div>
        </div>
        
        <div className="absolute -bottom-12 -right-12">
          <div className="w-32 h-32 relative">
            <div className="absolute inset-0 rounded-full bg-purple-400 opacity-20 transform rotate-45"></div>
            <div className="absolute inset-4 rounded-full bg-purple-300 opacity-30 transform rotate-45"></div>
            <div className="absolute inset-8 rounded-full bg-purple-200 opacity-40 transform rotate-45"></div>
          </div>
        </div>
        
        <div className="absolute top-1/4 -right-6">
          <div className="w-20 h-20 relative">
            <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-purple-300 opacity-60"></div>
            <div className="absolute top-3 right-0 w-8 h-8 rounded-full bg-purple-200 opacity-70"></div>
            <div className="absolute bottom-0 left-3 w-7 h-7 rounded-full bg-purple-100 opacity-80"></div>
          </div>
        </div>
        
        <div className="absolute bottom-1/3 -left-6">
          <div className="w-20 h-20 relative">
            <div className="absolute top-0 right-0 w-9 h-9 rounded-full bg-purple-300 opacity-60"></div>
            <div className="absolute top-4 left-0 w-7 h-7 rounded-full bg-purple-200 opacity-70"></div>
            <div className="absolute bottom-0 right-3 w-8 h-8 rounded-full bg-purple-100 opacity-80"></div>
          </div>
        </div>
        
        {/* Envelope Card */}
        <Card 
          className={`relative bg-gradient-to-br from-purple-50 to-violet-100 backdrop-blur-sm border-purple-200 shadow-2xl overflow-hidden transition-all duration-500 ${isOpen ? 'h-auto' : 'h-96'}`}
        >
          {/* Envelope flap */}
          {!isOpen && (
            <div 
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-purple-700 to-purple-800 cursor-pointer z-10 flex items-center justify-center"
              onClick={() => setIsOpen(true)}
            >
              <motion.div
                className="text-white text-center p-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <h2 className="text-2xl font-bold mb-2">Invitación Especial</h2>
                <p className="mb-4">Haz clic para abrir</p>
                <div className="mx-auto w-12 h-12">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path 
                      d="M20 4L12 12L4 4" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Envelope body */}
          {/* 🌸 Imagen decorativa visible solo al abrir la tarjeta */}
         {isOpen && (
          <>
            {/* 🌸 Esquina superior izquierda */}
            <motion.img
              src="/decoracion/izquierdasuperior.png"
              alt="Decoración floral superior izquierda"
              className="absolute top-0 left-0 w-40 opacity-90 pointer-events-none select-none"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            />

            {/* 🌸 Esquina superior derecha */}
            <motion.img
              src="/decoracion/derechasuperior.png"
              alt="Decoración floral superior derecha"
              className="absolute top-0 right-0 w-40 opacity-90 pointer-events-none select-none"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            />

           {/* ?? Esquina inferior izquierda */}
            <motion.img
              src="/decoracion/izquierdainferior.png"
              alt="Decoración floral inferior izquierda"
              className="absolute bottom-0 left-0 w-40 opacity-90 pointer-events-none select-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3 }}
            />

            {/* ?? Esquina inferior derecha */}
            <motion.img
              src="/decoracion/derechainferior.png"
              alt="Decoración floral inferior derecha"
              className="absolute bottom-0 right-0 w-40 opacity-90 pointer-events-none select-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4 }}
            />

          </>
        )}
        
          <div className={`transition-all duration-500 ${isOpen ? 'pt-48' : 'pt-48'}`}>
            <CardHeader className="text-center pb-6">
              <h1 className="text-6xl font-['Rosaline'] font-bold text-purple-900 mb-2">{invitationData.name}</h1>
              <h2 className="text-3xl font-serif font-medium text-purple-800">Mis 15 años</h2>
            </CardHeader>
            
            <CardContent className="space-y-12">
              {/* Countdown Timer - only visible when open */}
              {isOpen && (
                <div className="bg-purple-100 rounded-xl p-6 border border-purple-200 mt-8">
                  <h3 className="text-center text-purple-900 font-semibold mb-4">Faltan</h3>
                  <div className="flex justify-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-purple-700 rounded-lg flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{timeLeft.days}</span>
                      </div>
                      <span className="text-purple-800 mt-2">Días</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-purple-700 rounded-lg flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{timeLeft.hours}</span>
                      </div>
                      <span className="text-purple-800 mt-2">Horas</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-purple-700 rounded-lg flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{timeLeft.minutes}</span>
                      </div>
                      <span className="text-purple-800 mt-2">Minutos</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-purple-700 rounded-lg flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{timeLeft.seconds}</span>
                      </div>
                      <span className="text-purple-800 mt-2">Segundos</span>
                    </div>
                  </div>
                </div>
              )}

              
              
              {/* Event details */}
              <div className="space-y-8 pt-8">
                <div className="flex items-center justify-center">
                  <Calendar className="text-purple-700 mr-3" />
                  <p className="text-lg text-purple-900">{invitationData.date}</p>
                </div>
                
                <div className="flex items-center justify-center">
                  <Clock className="text-purple-700 mr-3" />
                  <p className="text-lg text-purple-900">{invitationData.time}</p>
                </div>
                
                <div className="flex items-start justify-center">
                  <MapPin className="text-purple-700 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-lg text-purple-900 text-left">{invitationData.location}</p>
                </div>
                
                <div className="flex justify-center gap-4 mt-6">
                  <Button 
                    onClick={openMaps}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Ver cómo llegar
                  </Button>
                  <Button 
                    onClick={copyToClipboard}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {copied ? "¡Copiado!" : "Copiar datos"}
                  </Button>
                </div>
              </div>
              
              {/* Additional details */}
              <div className="text-center pt-4">
                <p className="text-purple-800 italic text-lg">
                  {invitationData.details}
                </p>
              </div>
              
              {/* Subtle wavy divider */}
              <SubtleWavyDivider />
              
              {/* 15 Years Journey */}
              <div>
                <div className="flex items-center justify-center mb-6">
                  <Camera className="text-purple-700 mr-2" />
                  <h3 className="text-xl font-semibold text-purple-900">Un recorrido de estos 15 años</h3>
                </div>
                
                <p className="text-center text-purple-800 mb-8">
                  Junto a personas que son muy importantes en mi vida
                </p>
                
               {/* Image Carousel */}
                <div className="relative bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl">
                      <img
                        src={images[currentImageIndex].src}
                        alt={images[currentImageIndex].alt}
                        className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button 
                      onClick={goToPreviousImage}
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    
                    <div className="flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentImageIndex ? 'bg-purple-700 scale-125' : 'bg-purple-300'
                          }`}
                          aria-label={`Ir a la imagen ${index + 1}`}
                        />
                      ))}
                    </div>
                    
                    <Button 
                      onClick={goToNextImage}
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Subtle wavy divider */}
              <SubtleWavyDivider />
              
              {/* Dress Code */}
              <div>
                <div className="flex items-center justify-center mb-6">
                  <Shirt className="text-purple-700 mr-2" />
                  <h3 className="text-xl font-semibold text-purple-900">Dress Code</h3>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200 text-center">
                  <p className="text-purple-900 font-medium text-lg">{invitationData.dressCode}</p>
                  <p className="text-purple-800 mt-3">¡Viste tu mejor outfit para celebrar este día especial!</p>
                </div>
              </div>
              
              {/* Subtle wavy divider */}
              <SubtleWavyDivider />
              
              {/* Playlist section */}
              <div>
                <div className="flex items-center justify-center mb-6">
                  <Music className="text-purple-700 mr-2" />
                  <h3 className="text-xl font-semibold text-purple-900">Sugerencias para la playlist</h3>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="song" className="text-purple-800">Nombre de la canción</Label>
                    <Input 
                      id="song"
                      value={playlistSong}
                      onChange={(e) => setPlaylistSong(e.target.value)}
                      placeholder="Nombre de la canción"
                      className="mt-2 border-purple-300"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="link" className="text-purple-800">Link (YouTube, Spotify, etc.)</Label>
                    <Input 
                      id="link"
                      value={playlistLink}
                      onChange={(e) => setPlaylistLink(e.target.value)}
                      placeholder="https://..."
                      className="mt-2 border-purple-300"
                    />
                  </div>
                  
                  <Button 
                    onClick={addPlaylistSuggestion}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!playlistSong.trim() || !playlistLink.trim()}
                  >
                    Agregar canción
                  </Button>
                </div>
                
                {playlistSuggestions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-purple-900 mb-3">Sugerencias agregadas:</h4>
                    <ul className="bg-purple-50 rounded-lg p-4 max-h-52 overflow-y-auto border border-purple-200">
                      {playlistSuggestions.map((suggestion, index) => (
                        <li key={index} className="py-3 border-b border-purple-100 last:border-0 flex justify-between items-center">
                          <div>
                            <p className="text-purple-900 font-medium">{suggestion.song}</p>
                            <a 
                              href={suggestion.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-700 text-sm hover:underline truncate block max-w-xs"
                            >
                              {suggestion.link}
                            </a>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removePlaylistSuggestion(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Subtle wavy divider */}
              <SubtleWavyDivider />
              
              {/* Confirmation section */}
              <div>
                <div className="flex items-center justify-center mb-6">
                  <CheckCircle className="text-purple-700 mr-2" />
                  <h3 className="text-xl font-semibold text-purple-900">Confirmar asistencia</h3>
                </div>
                
                <div className="space-y-5">
                  {attendees.map((attendee, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-6">
                        <Label htmlFor={`name-${index}`} className="text-purple-800">Nombre completo</Label>
                        <Input 
                          id={`name-${index}`}
                          value={attendee.name}
                          onChange={(e) => updateAttendee(index, "name", e.target.value)}
                          placeholder="Nombre completo"
                          className="mt-2 border-purple-300"
                        />
                      </div>
                      
                      <div className="md:col-span-4">
                        <Label className="text-purple-800">¿Asistirá?</Label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center text-purple-900">
                            <input
                              type="radio"
                              name={`attendance-${index}`}
                              checked={attendee.attendance === "si"}
                              onChange={() => updateAttendee(index, "attendance", "si")}
                              className="mr-1"
                            />
                            Sí
                          </label>
                          <label className="flex items-center text-purple-900">
                            <input
                              type="radio"
                              name={`attendance-${index}`}
                              checked={attendee.attendance === "no"}
                              onChange={() => updateAttendee(index, "attendance", "no")}
                              className="mr-1"
                            />
                            No
                          </label>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        {attendees.length > 1 && (
                          <Button 
                            variant="ghost"
                            onClick={() => removeAttendee(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={addAttendee}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar otra persona
                  </Button>
                  
                  <Button 
                    onClick={confirmAttendance}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={attendees.every(attendee => !attendee.name.trim())}
                  >
                    Confirmar asistencia
                  </Button>
                </div>
              </div>
              
              {/* Subtle wavy divider */}
              <SubtleWavyDivider />
              
              {/* Gift section */}
              <div>
                <div className="flex items-center justify-center mb-6">
                  <Gift className="text-purple-700 mr-2" />
                  <h3 className="text-xl font-semibold text-purple-900">Regalo</h3>
                </div>
                
                <div className="space-y-5">
                  <p className="text-purple-800 text-center">
                    ¡Tu presencia es el mejor regalo! Pero si deseas obsequiarme algo, 
                    podrás dejarlo en el salón el día de la fiesta.
                  </p>
                  
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center justify-center mb-4">
                      <CreditCard className="text-purple-700 mr-2" />
                      <h4 className="font-semibold text-purple-900">Transferencia Mercado Pago</h4>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="flex-1 bg-white p-4 rounded border border-purple-300 text-center">
                        <p className="text-purple-900 font-mono">{invitationData.mercadoPago}</p>
                      </div>
                      <Button 
                        onClick={copyPaymentInfo}
                        className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap"
                      >
                        {copied ? "¡Copiado!" : "Copiar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subtle wavy divider */}
              <SubtleWavyDivider />
              
              {/* Closing message */}
              <div className="text-center py-6">
                <p className="text-purple-900 text-lg font-medium italic">
                  {invitationData.closingMessage}
                </p>
              </div>
              
              {/* Success message */}
              {submitted && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="bg-white p-8 rounded-lg shadow-xl border border-purple-300 max-w-sm w-full mx-4">
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold text-purple-900 mb-3">¡Gracias!</h3>
                      <p className="text-purple-800">Tu información ha sido enviada correctamente.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}