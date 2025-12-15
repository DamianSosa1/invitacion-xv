"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CalendarCheck, 
  Clock, 
  MapPin, 
  Buildings,
  MusicNotes, 
  Gift, 
  CheckCircle, 
  CreditCard, 
  Plus, 
  Trash, 
  Camera, 
  TShirt, 
  Heart, 
  ForkKnife, 
  Sparkle 
} from "@phosphor-icons/react"; 

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Great_Vibes, Playfair_Display } from "next/font/google"; 

const greatVibes = Great_Vibes({ 
  subsets: ["latin"], 
  weight: "400",
  display: 'swap', 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  display: 'swap',
});

export default function BirthdayInvitation() {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [playlistSong, setPlaylistSong] = useState("");
  const [playlistLink, setPlaylistLink] = useState("");
  const [playlistSuggestions, setPlaylistSuggestions] = useState<{song: string, link: string}[]>([]);
  
  const [attendees, setAttendees] = useState([
    {name: "", attendance: "si" as "si" | "no", dietaryRestrictions: ""}
  ]);
  
  const [submitted, setSubmitted] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(100);

  const invitationData = {
    name: "Agustina",
    date: "7 de marzo del 2026",
    time: "21:00 horas",
    location: "Av. Pellegrini 3135, S2002QDJ Rosario, Santa Fe",
    venueName: "Salón Stylo",
    details: "¡Trae tu mejor sonrisa y ganas de bailar!",
    mercadoPago: {
      alias: "agustinaxv.cumple.mp",
      cvu: "0000003100068690326325",
      nombre: "Natalia Daniela Herrera"
    },
    dressCode: "Formal - Elegante y sofisticado",
    dressCodeNote: "No se permite blanco o violeta",
    closingMessage: "¡Espero verte en este día tan especial para compartir juntos este momento único!"
  };

  const images = [
    { id: 1, src: "/fotos/img1.jpg", alt: "Foto de Agustina 1" },
    { id: 2, src: "/fotos/img2.jpg", alt: "Foto de Agustina 2" },
    { id: 3, src: "/fotos/img3.jpg", alt: "Foto de Agustina 3" },
    { id: 4, src: "/fotos/img4.jpg", alt: "Foto de Agustina 4" },
    { id: 5, src: "/fotos/img5.jpg", alt: "Foto de Agustina 5" },
    { id: 6, src: "/fotos/img6.jpg", alt: "Foto de Agustina 6" }
  ];

  const targetDate = new Date(2026, 2, 7, 21, 0, 0).getTime();
  const startDate = new Date(2025, 2, 7, 21, 0, 0).getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      const totalDuration = targetDate - startDate;
      const timeElapsed = now - startDate;
      const percentageRemaining = Math.max(0, Math.min(100, 100 - (timeElapsed / totalDuration) * 100));
      setProgress(percentageRemaining);

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setProgress(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, startDate]);

  const copyToClipboard = () => {
    const text = `¡Estás invitada al XV de ${invitationData.name}!\n\nFecha: ${invitationData.date}\nHora: ${invitationData.time}\nLugar: ${invitationData.venueName} (${invitationData.location})\n\n${invitationData.details}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openMaps = () => window.open("https://www.google.com/maps/search/?api=1&query=Corrientes+1198,+Rosario,+Santa+Fe", "_blank");

  const addPlaylistSuggestion = async () => {
    if (playlistSong.trim() && playlistLink.trim()) {
      const nuevaSugerencia = { song: playlistSong, link: playlistLink };
      setPlaylistSuggestions([...playlistSuggestions, nuevaSugerencia]);
      setPlaylistSong("");
      setPlaylistLink("");
      try {
        await fetch("/api/guardar-sugerencia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaSugerencia),
        });
      } catch (error) { console.error(error); }
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("/data/playlist.json");
        if (res.ok) setPlaylistSuggestions(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchSuggestions();
  }, []);

  const removePlaylistSuggestion = (index: number) => {
    setPlaylistSuggestions(playlistSuggestions.filter((_, i) => i !== index));
  };

  const addAttendee = () => {
    setAttendees([...attendees, {name: "", attendance: "si", dietaryRestrictions: ""}]);
  };

  const updateAttendee = (index: number, field: string, value: string) => {
    const updated = [...attendees];
    if (field === "name") updated[index].name = value;
    if (field === "attendance") updated[index].attendance = value as "si" | "no";
    if (field === "dietaryRestrictions") updated[index].dietaryRestrictions = value;
    setAttendees(updated);
  };

  const removeAttendee = (index: number) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter((_, i) => i !== index));
    }
  };

  const confirmAttendance = async () => {
    const validAttendees = attendees.filter(attendee => attendee.name.trim() !== "");
    
    if (validAttendees.length > 0) {
      try {
        console.log("Enviando datos...", validAttendees);

        const response = await fetch('/api/confirmar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ attendees: validAttendees }),
        });

        const textResponse = await response.text();
        
        if (!textResponse) throw new Error("El servidor devolvió una respuesta vacía.");

        let result;
        try {
          result = JSON.parse(textResponse);
        } catch (e) {
          throw new Error("Respuesta no válida del servidor.");
        }

        if (response.ok && result.success) {
          console.log("✅ Confirmación exitosa");
          setSubmitted(true); 
          setTimeout(() => setSubmitted(false), 5000);
        } else {
          console.error("❌ Error lógico:", result);
          alert(`Hubo un error: ${result.message || 'Desconocido'}`);
        }

      } catch (error: any) {
        console.error("❌ Error de red o parsing:", error);
        alert(`Error al enviar: ${error.message}`);
      }
    } else {
      alert("Por favor ingresa al menos un nombre.");
    }
  };

  const copyPaymentInfo = () => {
    navigator.clipboard.writeText(invitationData.mercadoPago.alias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SparkleDivider = () => (
    <div className="relative my-12 flex items-center justify-center px-8">
      <div className="h-px w-full max-w-[150px] bg-gradient-to-r from-transparent to-purple-300"></div>
      <div className="mx-4 text-purple-400">
        <Sparkle size={24} weight="light" />
      </div>
      <div className="h-px w-full max-w-[150px] bg-gradient-to-l from-transparent to-purple-300"></div>
    </div>
  );

  const center = 400; const svgViewBox = "0 0 800 800"; const radiusTime = 290; const circumference = 2 * Math.PI * radiusTime; const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    // 1. FONDO OPTIMIZADO (Sin StarBackground, solo degradado CSS)
    <div className={`relative min-h-screen bg-gradient-to-br from-[#7F00FF] to-purple-900 flex items-center justify-center p-4 overflow-hidden ${playfair.className}`}>
      
      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev { color: #7e22ce !important; background-color: rgba(255, 255, 255, 0.65); width: 40px; height: 40px; border-radius: 12px; backdrop-filter: blur(4px); box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }
        .swiper-button-next::after, .swiper-button-prev::after { font-size: 12px !important; }
        .swiper-button-next:hover, .swiper-button-prev:hover { background-color: rgba(255, 255, 255, 0.85); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .swiper-pagination-bullet-active { background-color: #7e22ce !important; }
        .swiper { padding-top: 20px; padding-bottom: 40px; }
      `}</style>

      {/* Eliminado <StarBackground /> para mejor rendimiento */}

      <div className="relative w-full max-w-2xl">
        <Card className={`relative bg-gradient-to-br from-purple-50 to-violet-100 backdrop-blur-sm border-purple-200 shadow-2xl overflow-hidden ${isOpen ? 'h-auto' : 'h-96'}`}>
          {!isOpen && (
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-purple-700 to-purple-800 cursor-pointer z-10 flex items-center justify-center" onClick={() => setIsOpen(true)}>
              <motion.div className="text-white text-center p-4" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}>
                <h2 className={`text-4xl mb-2 ${greatVibes.className}`}>Invitación Especial</h2>
                <p className="mb-4 font-sans text-lg">Haz clic para abrir</p>
                <div className="mx-auto w-12 h-12">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><path d="M20 4L12 12L4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </motion.div>
            </div>
          )}
          
          {isOpen && (
            <>
              <motion.img src="/decoracion/izquierdasuperior.png" alt="Decoración" className="absolute top-0 left-0 w-40 opacity-90 pointer-events-none select-none" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} />
              <motion.img src="/decoracion/derechasuperior.png" alt="Decoración" className="absolute top-0 right-0 w-40 opacity-90 pointer-events-none select-none" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} />
              <motion.img src="/decoracion/izquierdainferior.png" alt="Decoración" className="absolute bottom-0 left-0 w-40 opacity-90 pointer-events-none select-none" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3 }} />
              <motion.img src="/decoracion/derechainferior.png" alt="Decoración" className="absolute bottom-0 right-0 w-40 opacity-90 pointer-events-none select-none" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4 }} />
            </>
          )}
        
          <div className={`transition-all duration-500 ${isOpen ? 'pt-20' : 'pt-48'}`}>
            <CardHeader className="text-center pb-8 pt-0"> 
              <h1 className={`text-7xl md:text-8xl text-purple-900 mb-4 leading-normal ${greatVibes.className}`}>{invitationData.name}</h1>
              <h2 className={`text-4xl md:text-5xl text-purple-800 ${greatVibes.className}`}>Mis 15 años</h2>
            </CardHeader>
            
            <CardContent className="space-y-12">
              
              {isOpen && (
                <div className="flex justify-center items-center py-12">
                  <div className="relative flex justify-center items-center">
                    <svg className="absolute w-[24rem] h-[24rem] md:w-[29rem] md:h-[29rem] -rotate-90 z-0 pointer-events-none" viewBox="0 0 400 400">
                      <circle cx="200" cy="200" r="180" stroke="#e9d5ff" strokeWidth="8" fill="none" />
                      <circle cx="200" cy="200" r="180" stroke="#9333ea" strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
                    </svg>
                    <div className="relative w-[22rem] h-[22rem] md:w-[26rem] md:h-[26rem] bg-white rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center z-10 px-4 m-4">
                      <span className={`text-2xl md:text-3xl text-purple-900 mb-2 font-bold tracking-widest uppercase ${playfair.className}`}>FALTAN</span>
                      <div className="flex items-center justify-center gap-2 text-purple-900 mb-4">
                        <div className="flex flex-col items-center w-20 md:w-24"> <span className="text-5xl md:text-6xl font-bold leading-none">{timeLeft.days}</span> <span className="text-xs md:text-sm text-gray-400 mt-3 font-semibold tracking-widest uppercase">DÍAS</span> </div>
                        <div className="h-16 md:h-20 w-[1px] bg-gray-200"></div>
                        <div className="flex flex-col items-center w-20 md:w-24"> <span className="text-5xl md:text-6xl font-bold leading-none">{timeLeft.hours}</span> <span className="text-xs md:text-sm text-gray-400 mt-3 font-semibold tracking-widest uppercase">HS</span> </div>
                        <div className="h-16 md:h-20 w-[1px] bg-gray-200"></div>
                        <div className="flex flex-col items-center w-20 md:w-24"> <span className="text-5xl md:text-6xl font-bold leading-none">{timeLeft.minutes}</span> <span className="text-xs md:text-sm text-gray-400 mt-3 font-semibold tracking-widest uppercase">MIN</span> </div>
                        <div className="h-16 md:h-20 w-[1px] bg-gray-200"></div>
                        <div className="flex flex-col items-center w-20 md:w-24"> <span className="text-5xl md:text-6xl font-bold leading-none min-w-[4rem] text-center">{timeLeft.seconds}</span> <span className="text-xs md:text-sm text-gray-400 mt-3 font-semibold tracking-widest uppercase">SEG</span> </div>
                      </div>
                      <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} className="mt-2">
                         <Heart size={48} weight="fill" className="text-purple-600" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              <SparkleDivider />

              <div className="space-y-8 pt-2 text-lg">
                <div className="flex items-center justify-center">
                  <CalendarCheck size={28} weight="light" className="text-purple-700 mr-3" />
                  <p className="text-purple-900">{invitationData.date}</p>
                </div>
                <div className="flex items-center justify-center">
                  <Clock size={28} weight="light" className="text-purple-700 mr-3" />
                  <p className="text-purple-900">{invitationData.time}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Buildings size={28} weight="light" className="text-purple-700 mr-3 flex-shrink-0" />
                    <p className="text-purple-900 font-semibold text-xl">{invitationData.venueName}</p>
                  </div>
                  <div className="flex items-start justify-center">
                    <MapPin size={28} weight="light" className="text-purple-700 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-purple-900 text-left">{invitationData.location}</p>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <Button onClick={openMaps} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 text-lg">Ver cómo llegar</Button>
                  <Button onClick={copyToClipboard} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 text-lg">{copied ? "¡Copiado!" : "Copiar datos"}</Button>
                </div>
              </div>
              
              <div className="text-center pt-6">
                <p className="text-purple-800 italic text-xl">{invitationData.details}</p>
              </div>
              
              <SparkleDivider />
              
              <div className="overflow-hidden"> 
                <div className="flex items-center justify-center mb-6">
                  <Camera size={32} weight="light" className="text-purple-700 mr-3" />
                  <h3 className={`text-3xl text-purple-900 ${greatVibes.className}`}>Un recorrido de estos 15 años</h3>
                </div>
                
                <Swiper effect={'coverflow'} grabCursor={true} centeredSlides={true} slidesPerView={'auto'} loop={true} autoplay={{ delay: 10000, disableOnInteraction: false, pauseOnMouseEnter: true }} coverflowEffect={{ rotate: 0, stretch: 0, depth: 200, modifier: 1.5, slideShadows: false, }} pagination={{ clickable: true }} navigation={true} modules={[EffectCoverflow, Pagination, Navigation, Autoplay]} className="mySwiper !pb-14">
                  {images.map((image) => (
                    <SwiperSlide key={image.id} className="!w-72 !h-72 md:!w-96 md:!h-96 rounded-2xl overflow-hidden shadow-lg">
                      <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              
              <SparkleDivider />
              
              <div>
                <div className="flex items-center justify-center mb-6">
                  <TShirt size={32} weight="light" className="text-purple-700 mr-3" />
                  <h3 className={`text-3xl text-purple-900 ${greatVibes.className}`}>Dress Code</h3>
                </div>
                <div className="bg-purple-50 rounded-lg p-8 border border-purple-200 text-center">
                  <p className="text-purple-900 font-bold text-2xl mb-2">{invitationData.dressCode}</p>
                  <p className="text-purple-800 text-xl">¡Viste tu mejor outfit para celebrar este día especial!</p>
                  <p className="text-purple-700 text-lg mt-4 font-medium italic border-t border-purple-200 pt-4 inline-block px-4">
                    {invitationData.dressCodeNote}
                  </p>
                </div>
              </div>
              
              <SparkleDivider />
              
              <div>
                <div className="flex items-center justify-center mb-6">
                  <MusicNotes size={32} weight="light" className="text-purple-700 mr-3" />
                  <h3 className={`text-3xl text-purple-900 ${greatVibes.className}`}>Sugerencias para la playlist</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="song" className="text-purple-900 text-lg">Nombre de la canción</Label>
                    <Input id="song" value={playlistSong} onChange={(e) => setPlaylistSong(e.target.value)} placeholder="Nombre de la canción" className="mt-2 border-purple-300 text-lg p-6" />
                  </div>
                  <div>
                    <Label htmlFor="link" className="text-purple-900 text-lg">Link (YouTube, Spotify, etc.)</Label>
                    <Input id="link" value={playlistLink} onChange={(e) => setPlaylistLink(e.target.value)} placeholder="https://..." className="mt-2 border-purple-300 text-lg p-6" />
                  </div>
                  <Button onClick={addPlaylistSuggestion} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6" disabled={!playlistSong.trim() || !playlistLink.trim()}>Agregar canción</Button>
                </div>
                {playlistSuggestions.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-bold text-purple-900 mb-4 text-xl">Sugerencias agregadas:</h4>
                    <ul className="bg-purple-50 rounded-lg p-6 max-h-64 overflow-y-auto border border-purple-200">
                      {playlistSuggestions.map((suggestion, index) => (
                        <li key={index} className="py-4 border-b border-purple-100 last:border-0 flex justify-between items-center">
                          <div>
                            <p className="text-purple-900 font-bold text-lg">{suggestion.song}</p>
                            <a href={suggestion.link} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline truncate block max-w-xs">{suggestion.link}</a>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removePlaylistSuggestion(index)} className="text-red-500 hover:text-red-700"><Trash size={20} weight="light" /></Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <SparkleDivider />
              
              <div>
                <div className="flex items-center justify-center mb-6">
                  <CheckCircle size={32} weight="light" className="text-purple-700 mr-3" />
                  <h3 className={`text-3xl text-purple-900 ${greatVibes.className}`}>Confirmar asistencia</h3>
                </div>
                <div className="space-y-6">
                  {attendees.map((attendee, index) => (
                    <div key={index} className="bg-purple-50 p-6 rounded-xl border border-purple-100 mb-6 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-6">
                          <Label htmlFor={`name-${index}`} className="text-purple-900 text-lg">Nombre completo</Label>
                          <Input id={`name-${index}`} value={attendee.name} onChange={(e) => updateAttendee(index, "name", e.target.value)} placeholder="Nombre completo" className="mt-2 border-purple-300 text-lg p-6 bg-white" />
                        </div>
                        <div className="md:col-span-4">
                          <Label className="text-purple-900 text-lg">¿Asistirá?</Label>
                          <div className="flex gap-6 mt-3">
                            <label className="flex items-center text-purple-900 text-lg cursor-pointer">
                              <input type="radio" name={`attendance-${index}`} checked={attendee.attendance === "si"} onChange={() => updateAttendee(index, "attendance", "si")} className="mr-2 w-5 h-5 accent-purple-600" /> Sí
                            </label>
                            <label className="flex items-center text-purple-900 text-lg cursor-pointer">
                              <input type="radio" name={`attendance-${index}`} checked={attendee.attendance === "no"} onChange={() => updateAttendee(index, "attendance", "no")} className="mr-2 w-5 h-5 accent-purple-600" /> No
                            </label>
                          </div>
                        </div>
                        <div className="md:col-span-2 flex justify-end md:mt-8">
                          {attendees.length > 1 && (
                            <Button variant="ghost" onClick={() => removeAttendee(index)} className="text-red-500 hover:text-red-700 p-4"><Trash size={24} weight="light" /></Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Label htmlFor={`diet-${index}`} className="text-purple-900 text-lg flex items-center mb-2">
                          <ForkKnife size={24} weight="light" className="mr-2 text-purple-600" /> Restricciones alimentarias (Opcional)
                        </Label>
                        <Input 
                          id={`diet-${index}`} 
                          value={attendee.dietaryRestrictions} 
                          onChange={(e) => updateAttendee(index, "dietaryRestrictions", e.target.value)} 
                          placeholder="Ej: Soy vegetariano, celíaco, alérgico a..." 
                          className="mt-2 border-purple-300 text-lg p-6 bg-white placeholder:text-gray-400" 
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex flex-col gap-4">
                    {/* 2. CORRECCIÓN: Botón "Agregar" con z-index alto, relative y type="button" */}
                    <Button 
                      onClick={addAttendee} 
                      type="button" 
                      variant="outline" 
                      className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 text-lg py-6 relative z-20 cursor-pointer active:scale-95 transition-transform"
                    >
                      <Plus size={20} weight="light" className="mr-2" /> Agregar otra persona
                    </Button>
                    
                    <Button onClick={confirmAttendance} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 relative z-20" disabled={attendees.every(attendee => !attendee.name.trim())}>
                      Confirmar asistencia
                    </Button>
                  </div>
                </div>
              </div>
              
              <SparkleDivider />
              
              <div>
                <div className="flex items-center justify-center mb-6">
                  <Gift size={32} weight="light" className="text-purple-700 mr-3" />
                  <h3 className={`text-3xl text-purple-900 ${greatVibes.className}`}>Regalo</h3>
                </div>
                <div className="space-y-6">
                  <p className="text-purple-800 text-center text-xl">¡Tu presencia es el mejor regalo! Pero si deseas obsequiarme algo, podrás dejarlo en el salón el día de la fiesta.</p>
                  <div className="bg-purple-50 rounded-lg p-8 border border-purple-200">
                    <div className="flex items-center justify-center mb-6">
                      <CreditCard size={32} weight="light" className="text-purple-700 mr-3" />
                      <h4 className="font-bold text-purple-900 text-2xl">Transferencia Mercado Pago</h4>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      <div className="flex-1 bg-white p-6 rounded border border-purple-300 text-left space-y-2 w-full">
                        <p className="text-purple-900 text-lg font-mono break-all"><span className="font-bold font-sans">Alias:</span> {invitationData.mercadoPago.alias}</p>
                        <p className="text-purple-900 text-lg font-mono break-all"><span className="font-bold font-sans">CVU:</span> {invitationData.mercadoPago.cvu}</p>
                        <p className="text-purple-900 text-lg font-mono"><span className="font-bold font-sans">Nombre:</span> {invitationData.mercadoPago.nombre}</p>
                      </div>
                      <Button onClick={copyPaymentInfo} className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap text-lg px-8 py-6">{copied ? "¡Copiado!" : "Copiar Alias"}</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <SparkleDivider />
              
              <div className="text-center py-10">
                <p className={`text-purple-900 text-2xl font-medium italic ${playfair.className}`}>{invitationData.closingMessage}</p>
              </div>
              
            </CardContent>
          </div>
        </Card>
      </div>

      {submitted && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl border-2 border-purple-200 max-w-sm w-full mx-auto relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <div className="text-center relative z-10">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={48} weight="fill" className="text-green-600" />
              </div>
              <h3 className={`text-3xl font-bold text-purple-900 mb-3 ${playfair.className}`}>¡Confirmado!</h3>
              <p className="text-purple-700 text-lg mb-6">
                Muchas gracias por confirmar tu asistencia. <br/>
                ¡Nos vemos en la fiesta!
              </p>
              <Button onClick={() => setSubmitted(false)} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 rounded-xl">
                Cerrar
              </Button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}