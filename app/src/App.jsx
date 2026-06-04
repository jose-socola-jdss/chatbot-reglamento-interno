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
  ShieldAlert,
  ChevronLeft,
  Menu,
  Terminal,
  Database,
  Layers,
  X,
} from 'lucide-react';

const regulation = [
  {
    section: 'Horarios',
    article: 'Art. 12',
    title: 'Jornada ordinaria de planta y oficinas',
    tags: ['horario', 'turno', 'entrada', 'salida', 'jornada', 'refrigerio'],
    content:
      'La jornada ordinaria es de 48 horas semanales. Personal administrativo labora de lunes a viernes de 8:00 a 17:30 con 45 minutos de refrigerio. Personal de planta opera en turnos rotativos de 6:00 a 14:00, 14:00 a 22:00 y 22:00 a 6:00, segun programacion publicada cada viernes.',
    friendlyResponse: 'En Forja Norte, la jornada laboral ordinaria es de 48 horas a la semana. Si eres del área administrativa, tu horario de trabajo es de lunes a viernes de 8:00 a 17:30, y tienes 45 minutos libres para tomar tu refrigerio. Si estás en planta, trabajamos con tres turnos rotativos: de mañana (6:00 a 14:00), de tarde (14:00 a 22:00) y de noche (22:00 a 6:00). Recuerda que la programación de los turnos se publica todos los viernes.'
  },
  {
    section: 'Permisos',
    article: 'Art. 19',
    title: 'Permisos personales y tramites urgentes',
    tags: ['permiso', 'tramite', 'personal', 'urgencia', 'salida'],
    content:
      'Los permisos personales deben solicitarse con al menos 24 horas de anticipacion mediante el portal interno y aprobacion del jefe directo. Para emergencias familiares, la comunicacion puede realizarse por telefono, pero la regularizacion documentaria debe completarse dentro de las 48 horas siguientes.',
    friendlyResponse: 'Si necesitas pedir un permiso personal para realizar algún trámite, recuerda que debes solicitarlo a través de nuestro portal interno con al menos 24 horas de anticipación para que tu jefe directo pueda aprobarlo. En caso de una emergencia familiar o de fuerza mayor, puedes comunicarte por teléfono inmediatamente con tu supervisor, pero no olvides que tienes un plazo de 48 horas para formalizar y regularizar el trámite en el sistema.'
  },
  {
    section: 'Sanciones',
    article: 'Art. 27',
    title: 'Escala progresiva de medidas disciplinarias',
    tags: ['sancion', 'disciplina', 'amonestacion', 'falta', 'suspension'],
    content:
      'Las faltas leves se sancionan con llamada de atencion verbal o escrita. Las faltas reiteradas o graves pueden implicar suspension sin goce hasta por 3 dias. Toda medida debe quedar sustentada en acta y permitir descargos del trabajador antes de su cierre administrativo.',
    friendlyResponse: 'Para mantener el orden y la seguridad en la planta, en Forja Norte aplicamos una escala progresiva en las medidas disciplinarias. Las faltas leves inician con una llamada de atención verbal o escrita. Si las faltas se repiten o son de gravedad, pueden conllevar una suspensión sin goce de haber por un periodo de hasta 3 días. Toda sanción debe quedar registrada en una minuta formal y tienes derecho a presentar tus descargos ante Relaciones Laborales antes de que se cierre el caso.'
  },
  {
    section: 'Beneficios',
    article: 'Art. 33',
    title: 'Beneficios corporativos y sociales',
    tags: ['beneficio', 'seguro', 'movilidad', 'comedor', 'bono'],
    content:
      'Forja Norte otorga seguro de salud complementario, servicio de comedor subvencionado en planta, movilidad en rutas definidas y bono trimestral por cumplimiento de seguridad y productividad cuando el area alcanza sus metas integradas.',
    friendlyResponse: '¡Claro! En Forja Norte contamos con varios beneficios para todo el equipo. Ofrecemos un seguro de salud complementario (EPS), servicio de comedor subvencionado directamente en nuestra planta y rutas de movilidad corporativa definidas para tu traslado diario. Adicionalmente, tenemos un bono trimestral de productividad y seguridad que se activa cuando tu área alcanza las metas integradas establecidas.'
  },
  {
    section: 'Seguridad',
    article: 'Art. 41',
    title: 'Uso obligatorio de equipos de proteccion personal',
    tags: ['seguridad', 'epp', 'casco', 'lentes', 'riesgo', 'incidente'],
    content:
      'Es obligatorio utilizar casco, lentes, guantes, proteccion auditiva y calzado de seguridad en las zonas definidas por matriz de riesgo. El incumplimiento detiene la actividad y genera reporte inmediato al supervisor y al area HSE.',
    friendlyResponse: 'La seguridad es nuestro pilar fundamental. En todas las zonas operativas definidas en la matriz de riesgos, es obligatorio el uso de tu equipo de protección personal (EPP), que incluye casco, lentes con filtro, guantes, protectores auditivos y calzado de seguridad. Si se detecta que no estás usando tu equipo, se detendrá de inmediato tu labor y se enviará un reporte formal de desvío al área de Seguridad Industrial (HSE).'
  },
  {
    section: 'Asistencia',
    article: 'Art. 16',
    title: 'Registro de asistencia y tardanzas',
    tags: ['asistencia', 'tardanza', 'marcacion', 'falta', 'retraso'],
    content:
      'La marcacion de ingreso y salida es obligatoria. Tres tardanzas injustificadas en un periodo de 30 dias se consideran falta leve acumulada. Toda omision de marcacion debe reportarse el mismo dia al analista de relaciones laborales.',
    friendlyResponse: 'El control de tiempo es clave para la organización. Marcar tu asistencia al ingresar y al salir de tu jornada es obligatorio. Si acumulas tres tardanzas injustificadas dentro de un periodo de 30 días, esto se registrará como una falta leve acumulada. En caso de que olvides realizar tu marcación, por favor repórtalo ese mismo día al analista de relaciones laborales para evitar problemas con tu registro.'
  },
  {
    section: 'Conducta',
    article: 'Art. 29',
    title: 'Convivencia, respeto y uso de canales internos',
    tags: ['conducta', 'respeto', 'hostigamiento', 'lenguaje', 'canales'],
    content:
      'Se espera una conducta respetuosa y profesional en planta, oficinas y canales digitales. Queda prohibido el hostigamiento, lenguaje ofensivo, difusion de informacion sensible y cualquier represalia ante reportes realizados de buena fe.',
    friendlyResponse: 'Promovemos un ambiente de trabajo seguro y respetuoso. Esperamos que todos mantengamos un comportamiento profesional y ético tanto en las oficinas como en la planta y los medios digitales. Está terminantemente prohibido cualquier tipo de hostigamiento, lenguaje inadecuado o divulgación de información confidencial. Además, garantizamos que no habrá ninguna represalia si realizas un reporte de buena fe sobre alguna conducta indebida.'
  },
  {
    section: 'Licencias',
    article: 'Art. 22',
    title: 'Licencias por maternidad, paternidad y salud',
    tags: ['licencia', 'maternidad', 'paternidad', 'salud', 'descanso medico'],
    content:
      'Las licencias se otorgan conforme a ley y protocolos internos. El descanso medico debe presentarse dentro de las 48 horas de emitido. Talento y Relaciones Laborales orientaran la continuidad de pagos, subsidios y reemplazos temporales cuando aplique.',
    friendlyResponse: 'Para las licencias de salud o familiares, nos alineamos estrictamente con las normativas legales y los procesos internos. Si tienes un descanso médico certificado, recuerda entregarlo a tu supervisor o a Talento Humano dentro de las 48 horas de haber sido emitido. Nuestro equipo te guiará con la continuidad de tus pagos y los trámites de subsidios correspondientes.'
  },
  {
    section: 'Denuncia',
    article: 'Art. 36',
    title: 'Canal de denuncia confidencial',
    tags: ['denuncia', 'confidencial', 'etica', 'comite', 'reporte'],
    content:
      'La empresa dispone de un canal confidencial web y telefonico para reportar actos unsafe, fraude, acoso o incumplimientos eticos. El Comite de Integridad debe acusar recibo en un maximo de 2 dias habiles y preservar reserva de identidad cuando corresponda.',
    friendlyResponse: 'Contamos con una línea ética dedicada para tu tranquilidad. Si observas alguna irregularidad, fraude, acoso laboral o condiciones de riesgo extremo, puedes denunciarlo confidencialmente a través de nuestra web o línea telefónica. El Comité de Integridad recibirá el reporte, te enviará un acuse de recibo en menos de 2 días hábiles y mantendrá tu identidad en estricta reserva durante la investigación.'
  },
  {
    section: 'Procedimientos',
    article: 'Art. 45',
    title: 'Procedimiento ante incidentes operativos',
    tags: ['procedimiento', 'incidente', 'reporte', 'parada', 'investigacion'],
    content:
      'Ante un incidente operativo, el trabajador debe detener la actividad si existe riesgo, reportar al lider inmediato, aislar el area cuando proceda y completar el registro preliminar antes de finalizar el turno. La investigacion se inicia dentro de las siguientes 24 horas.',
    friendlyResponse: 'Si ocurre alguna falla o incidente operativo, lo primordial es tu seguridad. Detén las labores si existe algún riesgo para ti o tu equipo, avisa a tu supervisor inmediato, aísla el área de ser necesario y ayúdanos a llenar la minuta de reporte preliminar antes de que acabe tu turno. El equipo de HSE iniciará la investigación formal en un plazo máximo de 24 horas.'
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
    content: '¡Hola! Bienvenido a tu asistente virtual de relaciones laborales de Forja Norte. Estoy aquí para resolver cualquier duda que tengas sobre nuestro reglamento interno, horarios, permisos, EPP o beneficios corporativos. ¿En qué puedo ayudarte hoy?',
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
        'Disculpa, no encontré una regla específica en el reglamento interno que responda a esa pregunta. ¿Podrías intentar reformular tu consulta con palabras clave como horarios, permisos, EPP o licencias? Con gusto te ayudaré.',
      sources: [],
    };
  }

  const content = matches
    .map((item) => item.friendlyResponse)
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQuickOverlay, setShowQuickOverlay] = useState(true);
  const [showArticles, setShowArticles] = useState(false);
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

    // Simulate chat delay
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* ═══ TERMINAL HEADER BAR ═══ */}
      <header className="terminal-header">
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Mobile sidebar toggle */}
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu style={{ width: 18, height: 18 }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, userSelect: 'none' }}>
              <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v3L14 9v6l3 2v3H7v-3l3-2V9L4 7V4z" stroke="var(--acero)" fill="rgba(74, 111, 165, 0.15)" />
                <path d="M12 4v16" stroke="var(--amber)" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontStyle: 'normal', fontWeight: 800, letterSpacing: '0.12em', color: '#e8e8e8', textTransform: 'uppercase' }}>
                    FORJA NORTE
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(232,168,56,0.12)', color: '#e8a838', padding: '3px 8px', borderRadius: 3, border: '1px solid rgba(232,168,56,0.25)' }}>
                    SIDERURGIA
                  </span>
                </div>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#6b7280', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Consola de Directivas y Relaciones Laborales
                </p>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#6b7280', background: '#1e1e32', border: '1px solid #2a2a44', borderRadius: 4, padding: '6px 14px' }}>
            <ShieldCheck style={{ width: 14, height: 14, color: '#4a6fa5' }} />
            <span>Encriptación Local & Verificación Interna</span>
          </div>
        </div>
      </header>

      {/* ═══ APP SHELL: SIDEBAR + CHAT ═══ */}
      <div className="app-shell">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── SIDEBAR: REGULATION INDEX ─── */}
        <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="sidebar-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database style={{ width: 16, height: 16, color: '#4a6fa5' }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#e8e8e8' }}>
                Base de Consulta
              </span>
            </div>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#6b7280' }}>
              {regulation.length} Artículos
            </span>
          </div>

          {/* Accordion toggle button */}
          <div className="sidebar-accordion-trigger">
            <button
              type="button"
              onClick={() => setShowArticles(!showArticles)}
              className={`accordion-toggle-btn ${showArticles ? 'expanded' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen style={{ width: 16, height: 16, color: 'var(--whatsapp-green, #00a884)' }} />
                <span>Ver Reglamento Interno ({regulation.length})</span>
              </div>
              <span className="arrow-indicator">{showArticles ? '▲' : '▼'}</span>
            </button>
          </div>

          <AnimatePresence>
            {showArticles && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                {/* Search */}
                <div className="sidebar-search" style={{ position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: 28, top: 22, width: 14, height: 14, color: '#6b7280', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    placeholder="Buscar artículo o palabra..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Section filters */}
                <div className="sidebar-filters">
                  {sections.map((section) => (
                    <button
                      key={section}
                      type="button"
                      onClick={() => setActiveSection(section)}
                      className={`filter-btn ${activeSection === section ? 'active' : ''}`}
                    >
                      {section}
                    </button>
                  ))}
                </div>

                {/* Articles list */}
                <div className="sidebar-articles">
                  {filteredFaq.length === 0 ? (
                    <div className="empty-sidebar">
                      Sin resultados para la búsqueda.
                    </div>
                  ) : (
                    filteredFaq.map((item) => (
                      <button
                        key={item.article}
                        type="button"
                        onClick={() => askQuestion(item.title)}
                        className="article-card"
                      >
                        <div className="article-card-meta">
                          <span className="article-section-tag">{item.section}</span>
                          <span className="article-number-tag">{item.article}</span>
                        </div>
                        <span className="article-card-title">{item.title}</span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--carbon-deep)', fontSize: '11px', color: 'var(--gris)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <span>&copy; {new Date().getFullYear()} Forja Norte Siderurgia.</span>
            <div className="footer-dev">
              <span style={{ fontSize: '10px' }}>Desarrollado por</span>
              <a href="https://jose-socola-jdss.github.io/blyp/" className="footer-logo-link" aria-label="Ir a Blyp">
                <img src="./blyp_logotipo.svg" alt="Blyp Logo" className="footer-logo" style={{ filter: 'brightness(0) invert(1)', height: 20 }} />
              </a>
            </div>
          </div>
        </aside>

        {/* ─── MAIN CHAT PANEL ─── */}
        <section className="chat-panel" style={{ position: 'relative' }}>

          {/* Chat Header (WhatsApp style) */}
          <div className="chat-header">
            <div className="chat-header-left">
              <button
                type="button"
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <ChevronLeft style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
              </button>
              
              {/* WhatsApp circular avatar */}
              <div className="whatsapp-avatar">
                <span className="avatar-letter">F</span>
                <span className="whatsapp-online-badge" />
              </div>

              <div>
                <h1 className="whatsapp-title">
                  ForjaBot · Relaciones Laborales
                </h1>
                <p className="whatsapp-subtitle">
                  en línea
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMessages(initialMessages)}
              className="reset-btn"
              title="Reiniciar chat"
            >
              <RefreshCw style={{ width: 13, height: 13 }} />
              <span>Reiniciar terminal</span>
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="messages-area">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.article
                  key={message.id}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`msg ${message.role === 'assistant' ? 'msg-bot' : 'msg-user'}`}
                >
                  {/* Body text */}
                  <div className="msg-body">
                    {message.content}
                  </div>

                  {/* Sources collapsed inside summary */}
                  {message.sources && message.sources.length > 0 && (
                    <details className="sources-details">
                      <summary className="sources-summary">
                        <BookOpen style={{ width: 12, height: 12, marginRight: 4, display: 'inline-block' }} />
                        <span>Ver base legal del reglamento ({message.sources.length})</span>
                      </summary>
                      <div className="sources-content">
                        {message.sources.map((source, i) => (
                          <div key={i} className="source-item">
                            <div className="source-item-id">
                              {source.article} · {source.title}
                            </div>
                            <details style={{ marginTop: 4 }}>
                              <summary style={{ cursor: 'pointer', fontSize: '10px', color: 'var(--gris-light)', fontWeight: 650, listStyle: 'none' }}>
                                ▸ Mostrar cita del documento
                              </summary>
                              <div className="source-item-snippet" style={{ marginTop: 4 }}>
                                "{source.snippet}"
                              </div>
                            </details>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {/* No-match warning */}
                  {message.role === 'assistant' && message.sources?.length === 0 && message.id !== 'welcome' && (
                    <div className="no-match-badge">
                      <TriangleAlert style={{ width: 12, height: 12 }} />
                      <span>Consulta libre de base legal</span>
                    </div>
                  )}

                  {/* Timestamp & checkmarks (WhatsApp style) */}
                  <div className="msg-meta-row">
                    <span className="msg-time">{message.timestamp || '11:21'}</span>
                    {message.role === 'user' && (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="whatsapp-check">
                        <path d="M2 12l5.25 5 2.625-3M8 12l5.25 5L22 7" />
                      </svg>
                    )}
                  </div>
                </motion.article>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="typing-indicator"
                >
                  <div className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span>ForjaBot está escribiendo...</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Overlay — when chat is fresh */}
          {messages.length <= 1 && showQuickOverlay && (
            <div className="quick-overlay">
              <div className="quick-panel" style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowQuickOverlay(false)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: 14,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--gris)',
                  }}
                  className="hover:text-gray-900 transition-colors"
                  aria-label="Cerrar"
                >
                  <X style={{ width: 15, height: 15 }} />
                </button>
                <Layers style={{ width: 28, height: 28, color: '#00a884', margin: '0 auto' }} />
                <h3>Consultas Frecuentes</h3>
                <p>Haz clic en una directiva para iniciar el diagnóstico:</p>
                <div>
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => askQuestion(prompt)}
                      className="quick-btn"
                    >
                      <span style={{ fontWeight: 500 }}>{prompt}</span>
                      <CornerDownRight className="quick-btn-arrow" style={{ width: 14, height: 14 }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input Console */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              askQuestion(question);
            }}
            className="input-console"
          >
            <div className="input-row">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Escribe un mensaje"
              />
              <button
                type="submit"
                disabled={!question.trim() || isTyping}
                className="send-btn"
              >
                <Send style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <p className="input-footnote">
              Las consultas quedan registradas localmente en la memoria del navegador.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default App;
