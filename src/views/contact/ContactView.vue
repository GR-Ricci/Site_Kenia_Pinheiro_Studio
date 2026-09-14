import { useState } from "react";
import heroImg from "@/imports/ChatGPT_Image_21_de_ago._de_2026__21_03_57.png";
import {
  ChevronLeft, ChevronRight, ChevronDown, X,
  MapPin, Phone, MessageCircle, Mail, Instagram,
  Clock, Menu, ArrowRight,
} from "lucide-react";
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, isSameDay, isBefore, startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "home" | "servicos" | "sobre" | "contato" | "galeria";
interface SubService { id: string; name: string; price: string; description: string; }
interface ServiceCategory {
  id: string; name: string; description: string;
  price: string; img: string; subServices: SubService[];
}
interface BookableItem { name: string; price: string; }


// ─── Contato Page ─────────────────────────────────────────────────────────────

function ContatoPage() {
  const rows=[
    {icon:Phone,       label:"(16) 99206-8812",                  desc:"Telefone",  href:"tel:+5516992068812"},
    {icon:MessageCircle,label:"WhatsApp",                        desc:"(16) 99206-8812",href:"https://wa.me/5516992068812"},
    {icon:Mail,        label:"keniapinheirostudio@gmail.com",     desc:"E-mail",    href:"mailto:keniapinheirostudio@gmail.com"},
    {icon:Instagram,   label:"@keniapinheirostudio",             desc:"Instagram", href:"https://instagram.com/keniapinheirostudio"},
    {icon:MapPin,      label:"Rua Expedicionário Lellis, 1703 — Centro, Sertãozinho SP",desc:"Endereço",href:"https://maps.google.com"},
  ];
  return (
    <div className="min-h-screen" style={{background:C.bg}}>
      <div className="py-14 px-4 text-center" style={{background:C.mahog,borderBottom:`2px solid ${C.gold}`}}>
        <SectionEyebrow>Estamos aqui para você</SectionEyebrow>
        <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(1.8rem,4vw,2.4rem)",color:C.creme}}>Entre em Contato</h1>
        <p className="text-sm mt-3 max-w-sm mx-auto" style={{fontFamily:"var(--font-body)",color:"rgba(245,235,221,0.55)"}}>
          Agende pelo WhatsApp, ligue ou venha nos visitar.
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="rounded-xl overflow-hidden shadow-md" style={{border:`1px solid ${C.goldBorder}`}}>
          {rows.map((r,i)=>(
          **  <a key={i} href={r.href} target="_blank" rel="noreferrer"
              className="flex items-center gap-4 px-6 py-4 group transition-colors"
              style={{background:i%2===0?C.cardBg:"rgba(250,247,242,0.7)",borderBottom:i<rows.length-1?`1px solid ${C.goldBorder}`:"none"}}
              onMouseEnter={e=>(e.currentTarget.style.background="#FFF8F0")}
              onMouseLeave={e=>(e.currentTarget.style.background=i%2===0?C.cardBg:"rgba(250,247,242,0.7)")}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{background:`${C.vinho}12`}}>
                <r.icon size={17} style={{color:C.vinho}}/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs" style={{fontFamily:"var(--font-body)",color:C.textSoft}}>{r.desc}</p>
                <p className="text-sm font-medium truncate" style={{fontFamily:"var(--font-body)",color:C.text}}>{r.label}</p>
              </div>
              <ArrowRight size={15} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{color:C.gold}}/>
            </a>
          ))}
        </div>
        <div className="text-right mt-8">
          <span style={{fontFamily:"var(--font-script)",fontSize:"2rem",color:C.gold}}>Kp</span>
        </div>
      </div>
    </div>
  );
}

// ─── Galeria Page ─────────────────────────────────────────────────────────────

function GaleriaPage() {
  const [tab,setTab] = useState("Coloração");
  const photos = GALLERY[tab]??[];
  return (
    <div className="min-h-screen py-12 px-4" style={{background:C.bg}}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionEyebrow>Nossos trabalhos</SectionEyebrow>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(1.8rem,4vw,2.4rem)",color:C.vinho,fontWeight:600}}>Galeria</h1>
          <div className="max-w-xs mx-auto mt-4"><GoldRule/></div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {GALLERY_CATS.map(cat=>(
            <button key={cat} onClick={()=>setTab(cat)}
              className="flex-shrink-0 text-xs px-4 py-2 rounded-full whitespace-nowrap transition-all"
              style={{fontFamily:"var(--font-body)",background:tab===cat?C.vinho:C.cardBg,color:tab===cat?C.creme:C.textMid,border:`1px solid ${tab===cat?C.vinho:C.goldBorder}`}}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {photos.map((url,i)=>(
            <div key={i} className="aspect-square overflow-hidden rounded-xl" style={{border:`1px solid ${C.goldBorder}`}}>
              <img src={url} alt={`${tab} ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({setPage}:{setPage:(p:Page)=>void}) {
  return (
    <footer style={{background:C.mahog,borderTop:`1px solid rgba(201,166,107,0.18)`}}>
      <div className="max-w-5xl mx-auto px-6 py-7 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Brand */}
        <div>
          <button onClick={()=>setPage("home")} className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{background:C.vinho,border:`1.5px solid rgba(201,166,107,0.5)`}}>
              <span style={{fontFamily:"var(--font-script)",fontSize:"1.25rem",color:C.creme,lineHeight:1}}>K</span>
            </div>
            <span style={{fontFamily:"var(--font-display)",color:C.creme,fontSize:"0.85rem",fontWeight:600,letterSpacing:"0.06em"}}>KP Studio</span>
          </button>
          <p style={{fontFamily:"var(--font-body)",fontSize:"0.7rem",color:"rgba(245,235,221,0.38)",lineHeight:1.6}}>
            Sertãozinho, SP · Hora marcada
          </p>
        </div>

        {/* Nav links */}
        <div>
          <p className="mb-3" style={{fontFamily:"var(--font-body)",fontSize:"0.58rem",letterSpacing:"0.2em",textTransform:"uppercase",color:C.gold}}>
            Navegação
          </p>
          <div className="space-y-1.5">
            {NAV_LINKS.map(item=>(
              <button key={item.key} onClick={()=>setPage(item.key)}
                className="block text-xs transition-opacity hover:opacity-70"
                style={{fontFamily:"var(--font-body)",color:"rgba(245,235,221,0.52)"}}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Instagram + CTA */}
        <div>
          <p className="mb-3" style={{fontFamily:"var(--font-body)",fontSize:"0.58rem",letterSpacing:"0.2em",textTransform:"uppercase",color:C.gold}}>
            Nos siga
          </p>
          <a href="https://instagram.com/keniapinheirostudio" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 mb-4 transition-opacity hover:opacity-70"
            style={{fontFamily:"var(--font-display)",color:C.creme,fontStyle:"italic",fontSize:"0.88rem"}}>
            <Instagram size={13} style={{color:C.gold}}/>
            @keniapinheirostudio
          </a>
          <a href={`https://wa.me/5516992068812?text=${encodeURIComponent("Olá! Gostaria de agendar um horário no KP Studio.")}`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium transition-opacity hover:opacity-85"
            style={{background:C.vinho,color:C.creme,fontFamily:"var(--font-body)",border:`1px solid rgba(201,166,107,0.3)`}}>
            <MessageCircle size={11}/>
            Agendar pelo WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{borderTop:"1px solid rgba(201,166,107,0.1)"}} className="px-6 py-2.5">
        <p className="text-center" style={{fontFamily:"var(--font-body)",fontSize:"0.62rem",color:"rgba(245,235,221,0.22)"}}>
          © {new Date().getFullYear()} KP Studio · Sertãozinho, SP · Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}

