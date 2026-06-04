import { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpenText,
  FileText,
  MessageSquareText,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Trash2,
  Cpu,
  RefreshCw,
  Clock,
  ExternalLink,
  BookOpen,
  CornerDownRight,
  ShieldAlert
} from 'lucide-react';

const regulation = [
  {
    section: 'Horarios',
    article: 'Art. 12',
    title: 'Jornada ordinaria de planta y oficinas',
    tags: ['horario', 'turno', 'entrada', 'salida', 'jornada', 'refrigerio'],
    content:
      'La jornada ordinaria es de 48 horas semanales. Personal administrativo labora de lunes a viernes de 8:00 a 17:30 con 45 minutos de refrigerio. Personal de planta opera en turnos rotativos de 6:00 a 14:00, 14:00 a 22:00 y 22:00 a 6:00, segun programacion publicada cada viernes.',
  },
  {
    section: 'Permisos',
    article: 'Art. 19',
    title: 'Permisos personales y tramites urgentes',
    tags: ['permiso', 'tramite', 'personal', 'urgencia', 'salida'],
    content:
      'Los permisos personales deben solicitarse con al menos 24 horas de anticipacion mediante el portal interno y aprobacion del jefe directo. Para emergencias familiares, la comunicacion puede realizarse por telefono, pero la regularizacion documentaria debe completarse dentro de las 48 horas siguientes.',
  },
  {
    section: 'Sanciones',
    article: 'Art. 27',
    title: 'Escala progresiva de medidas disciplinarias',
    tags: ['sancion', 'disciplina', 'amonestacion', 'falta', 'suspension'],
    content:
      'Las faltas leves se sancionan con llamada de atencion verbal o escrita. Las faltas reiteradas o graves pueden implicar suspension sin goce hasta por 3 dias. Toda medida debe quedar sustentada en acta y permitir descargos del trabajador antes de su cierre administrativo.',
  },
  {
    section: 'Beneficios',
    article: 'Art. 33',
    title: 'Beneficios corporativos y sociales',
    tags: ['beneficio', 'seguro', 'movilidad', 'comedor', 'bono'],
    content:
      'Forja Norte otorga seguro de salud complementario, servicio de comedor subvencionado en planta, movilidad en rutas definidas y bono trimestral por cumplimiento de seguridad y productividad cuando el area alcanza sus metas integradas.',
  },
  {
    section: 'Seguridad',
    article: 'Art. 41',
    title: 'Uso obligatorio de equipos de proteccion personal',
    tags: ['seguridad', 'epp', 'casco', 'lentes', 'riesgo', 'incidente'],
    content:
      'Es obligatorio utilizar casco, lentes, guantes, proteccion auditiva y calzado de seguridad en las zonas definidas por matriz de riesgo. El incumplimiento detiene la actividad y genera reporte inmediato al supervisor y al area HSE.',
  },
  {
    section: 'Asistencia',
    article: 'Art. 16',
    title: 'Registro de asistencia y tardanzas',
    tags: ['asistencia', 'tardanza', 'marcacion', 'falta', 'retraso'],
    content:
      'La marcacion de ingreso y salida es obligatoria. Tres tardanzas injustificadas en un periodo de 30 dias se consideran falta leve acumulada. Toda omision de marcacion debe reportarse el mismo dia al analista de relaciones laborales.',
  },
  {
    section: 'Conducta',
    article: 'Art. 29',
    title: 'Convivencia, respeto y uso de canales internos',
    tags: ['conducta', 'respeto', 'hostigamiento', 'lenguaje', 'canales'],
    content:
      'Se espera una conducta respetuosa y profesional en planta, oficinas y canales digitales. Queda prohibido el hostigamiento, lenguaje ofensivo, difusion de informacion sensible y cualquier represalia ante reportes realizados de buena fe.',
  },
  {
    section: 'Licencias',
    article: 'Art. 22',
    title: 'Licencias por maternidad, paternidad y salud',
    tags: ['licencia', 'maternidad', 'paternidad', 'salud', 'descanso medico'],
    content:
      'Las licencias se otorgan conforme a ley y protocolos internos. El descanso medico debe presentarse dentro de las 48 horas de emitido. Talento y Relaciones Laborales orientaran la continuidad de pagos, subsidios y reemplazos temporales cuando aplique.',
  },
  {
    section: 'Denuncia',
    article: 'Art. 36',
    title: 'Canal de denuncia confidencial',
    tags: ['denuncia', 'confidencial', 'etica', 'comite', 'reporte'],
    content:
      'La empresa dispone de un canal confidencial web y telefonico para reportar actos unsafe, fraude, acoso o incumplimientos eticos. El Comite de Integridad debe acusar recibo en un maximo de 2 dias habiles y preservar reserva de identidad cuando corresponda.',
  },
  {
    section: 'Procedimientos',
    article: 'Art. 45',
    title: 'Procedimiento ante incidentes operativos',
    tags: ['procedimiento', 'incidente', 'reporte', 'parada', 'investigacion'],
    content:
      'Ante un incidente operativo, el trabajador debe detener la actividad si existe riesgo, reportar al lider inmediato, aislar el area cuando proceda y completar el registro preliminar antes de finalizar el turno. La investigacion se inicia dentro de las siguientes 24 horas.',
  },
];

const quickPrompts = [
  '¿Cuál es el horario del personal de planta?',
  '¿Cómo se pide un permiso personal?',
  '¿Qué pasa si no utilizo mis EPP?',
  '¿Hay canal confidencial de denuncias?',
  '¿Qué beneficios corporativos existen?',
];

const initialMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Hola. Soy la terminal inteligente de consultas reglamentarias de Forja Norte. Formulo respuestas exactas basadas únicamente en los artículos aprobados de nuestro reglamento laboral interno. ¿Qué directiva deseas verificar hoy?',
    sources: [],
  },
];

function scoreArticle(question, item) {
  const normalized = question.toLowerCase();
  const keywords = new Set(normalized.match(/[a-záéíóúñ]+/gi) || []);
  let score = 0;

  item.tags.forEach((tag) => {
    if (normalized.includes(tag)) score += 4;
  });

  item.title.toLowerCase().split(/\s+/).forEach((word) => {
    if (keywords.has(word)) score += 2;
  });

  item.content.toLowerCase().split(/\W+/).forEach((word) => {
    if (keywords.has(word)) score += 0.5;
  });

  return score;
}

function buildAnswer(question) {
  const matches = regulation
    .map((item) => ({ ...item, score: scoreArticle(question, item) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (matches.length === 0) {
    return {
      content:
        'No encuentro una base suficiente en el reglamento actual para responder a tu consulta. Por favor, intenta reformular usando términos específicos como horarios, marcación, licencias, EPP, sanciones o denuncias.',
      sources: [],
    };
  }

  const content = matches
    .map((item) => `${item.article} - ${item.title}: ${item.content}`)
    .join('\n\n');

  return {
    content,
    sources: matches.map((item) => ({
      article: item.article,
      title: item.title,
      snippet: item.content
    })),
  };
}

function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('forja-chat-history');
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });
  const [question, setQuestion] = useState('');
  const [activeSection, setActiveSection] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('forja-chat-history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sections = ['Todos', ...new Set(regulation.map((item) => item.section))];

  const filteredFaq = useMemo(() => {
    return regulation.filter((item) => {
      const matchesSection = activeSection === 'Todos' || item.section === activeSection;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.article.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSection && matchesSearch;
    });
  }, [activeSection, searchQuery]);

  const askQuestion = (text) => {
    if (!text.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: text,
      sources: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((current) => [...current, userMessage]);
    setQuestion('');
    setIsTyping(true);

    // Simulate CNC telemetry scanner delay
    setTimeout(() => {
      const answer = buildAnswer(text);
      const assistantMessage = {
        id: Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        ...answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((current) => [...current, assistantMessage]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col font-sans">
      {/* Heavy Industrial Header */}
      <header className="border-b-2 border-zinc-800 bg-zinc-950 px-6 py-4 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-600 to-zinc-900 border border-orange-500/30 flex items-center justify-center shadow-lg shadow-orange-950/20 group">
              <Cpu className="h-6 w-6 text-orange-400 group-hover:rotate-90 transition-all duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-black tracking-wider text-white uppercase">FORJA NORTE</p>
                <span className="text-[10px] tracking-widest uppercase font-mono font-bold bg-orange-950 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                  REGLAMENTO V2.1
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">Consola Técnica e Instructivos de Relaciones Laborales</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Encriptación Local & Verificación Interna</span>
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[340px_1fr] flex-1">
        
        {/* SIDEBAR: MAPA DEL REGLAMENTO */}
        <aside className="panel rounded-2xl p-5 flex flex-col gap-5 max-h-[calc(100vh-140px)] border-zinc-800 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-orange-500 font-bold">
              <BookOpenText className="h-5 w-5" />
              <span className="text-sm font-black uppercase tracking-wider">Base de Consulta</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">{regulation.length} Artículos</span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar artículo o palabra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
            />
          </div>

          {/* Sections filter buttons */}
          <div className="flex flex-wrap gap-1.5 border-b border-zinc-800/60 pb-4">
            {sections.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                  activeSection === section
                    ? 'bg-orange-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Articles list */}
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {filteredFaq.length === 0 ? (
              <div className="py-6 text-center text-zinc-600 text-xs font-mono">
                Sin resultados para la búsqueda.
              </div>
            ) : (
              filteredFaq.map((item) => (
                <button
                  key={item.article}
                  type="button"
                  onClick={() => askQuestion(item.title)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 text-left transition hover:border-orange-500/30 hover:bg-orange-500/5 group flex flex-col gap-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-orange-400/80">
                      {item.section}
                    </span>
                    <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-bold group-hover:bg-orange-950 group-hover:text-orange-400 border border-transparent group-hover:border-orange-500/10">
                      {item.article}
                    </span>
                  </div>
                  <p className="font-bold text-zinc-200 text-xs leading-normal group-hover:text-white transition-colors">
                    {item.title}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* CHAT INTERACTIVE PANEL */}
        <section className="panel rounded-2xl p-5 md:p-6 flex flex-col justify-between border-zinc-800 relative max-h-[calc(100vh-140px)] overflow-hidden">
          
          {/* Active Chat Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 uppercase">
                  Asistente de Consulta Laboral
                </h1>
                <p className="text-xs text-zinc-400 font-mono">Lectura local y auditoría de directivas</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMessages(initialMessages)}
              className="rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950 px-3.5 py-2 text-xs font-bold text-zinc-400 hover:text-white transition flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reiniciar terminal
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.article
                  key={message.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-2xl border p-4 max-w-[85%] flex flex-col gap-3 relative ${
                    message.role === 'assistant'
                      ? 'border-zinc-800 bg-zinc-900/40 mr-auto'
                      : 'border-orange-500/20 bg-orange-500/5 ml-auto text-right items-end'
                  }`}
                >
                  {/* Meta metadata row */}
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500">
                    {message.role === 'assistant' ? (
                      <>
                        <Cpu className="h-3.5 w-3.5 text-orange-500" />
                        <span>FORJA_BOT // SYSTEM_OUTPUT</span>
                      </>
                    ) : (
                      <>
                        <span>USER_INPUT // OPERARIO_ACTIVO</span>
                        <Clock className="h-3.5 w-3.5 text-orange-400" />
                      </>
                    )}
                  </div>

                  {/* Body text */}
                  <p className={`text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap ${
                    message.role === 'assistant' ? 'text-left font-mono' : 'text-right font-semibold'
                  }`}>
                    {message.content}
                  </p>

                  {/* Cites and Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 text-left border-t border-zinc-800 pt-3 w-full">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1.5 mb-2">
                        <BookOpen className="h-3.5 w-3.5" /> Artículos vinculados:
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {message.sources.map((source, i) => (
                          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs flex flex-col gap-1">
                            <span className="font-mono font-bold text-orange-400 text-[10px] tracking-wider uppercase">
                              {source.article} // {source.title}
                            </span>
                            <span className="text-zinc-500 font-mono text-[11px] leading-relaxed italic">
                              "{source.snippet}"
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {message.role === 'assistant' && message.sources?.length === 0 && message.id !== 'welcome' && (
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[10px] font-mono text-amber-300 self-start">
                      <TriangleAlert className="h-3.5 w-3.5" />
                      <span>Sin coincidencias en base legal</span>
                    </div>
                  )}
                </motion.article>
              ))}

              {/* Typings Simulator Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 max-w-[200px] flex items-center gap-3 font-mono text-xs text-zinc-500"
                >
                  <Cpu className="h-4 w-4 animate-spin text-orange-400" />
                  <span>Escaneando matriz...</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Quick recommendations on empty chat history */}
          {messages.length <= 1 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-6 text-center z-10 pointers-events-none">
              <div className="glass border-zinc-800 bg-zinc-950/80 rounded-2xl p-6 shadow-2xl">
                <Sparkles className="mx-auto h-8 w-8 text-orange-500 mb-3" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Consultas Frecuentes</h3>
                <p className="mt-1.5 text-xs text-zinc-400 font-mono">Haz clic en una directiva para iniciar el diagnóstico:</p>
                <div className="mt-4 flex flex-col gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => askQuestion(prompt)}
                      className="w-full text-left rounded-xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 px-3.5 py-2.5 text-xs text-zinc-300 hover:text-white transition flex items-center justify-between group"
                    >
                      <span className="font-semibold">{prompt}</span>
                      <CornerDownRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form input console */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              askQuestion(question);
            }}
            className="border-t border-zinc-800 pt-4"
          >
            <div className="relative rounded-2xl border-2 border-zinc-800 bg-zinc-950 p-2 flex items-center gap-2 focus-within:border-orange-500/50 transition-colors">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Escribe tu duda (ej. cuáles son los turnos de planta?)"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none font-mono"
              />
              <button
                type="submit"
                disabled={!question.trim() || isTyping}
                className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold p-3 text-sm transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-orange-950/20"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-zinc-600 mt-2 font-mono">
              Las consultas quedan registradas localmente en la memoria del navegador.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
