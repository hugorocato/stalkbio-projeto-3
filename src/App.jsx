import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Lock, Search, ArrowDown, Smartphone, MapPin, Eye, 
  CheckCircle2, ShieldCheck, ChevronDown, ChevronUp, ArrowRight, 
  MessageCircle, Phone, Video, Info, AlertTriangle, Heart, Send,
  ChevronLeft, Edit, Camera, Play // Ícones novos importados para a DM
} from 'lucide-react';
import './App.css';

// Componente de efeito de digitação
const TypingEffect = ({ text, speed = 50, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout;
    let charIndex = 0;

    const startTyping = () => {
      const interval = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayedText(text.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(interval);
    };

    if (delay > 0) {
      timeout = setTimeout(startTyping, delay);
    } else {
      return startTyping();
    }

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return <>{displayedText}</>;
};

const MatrixBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const columns = Math.floor(width / 20);
    const drops = Array(columns).fill(1);
    const matrixColors = ['#8B00FF', '#F5DD00']; 
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const draw = () => {
      ctx.fillStyle = 'rgba(13, 13, 13, 0.1)'; 
      ctx.fillRect(0, 0, width, height);
      ctx.font = '15px monospace';
      for (let i = 0; i < drops.length; i++) {
        ctx.fillStyle = matrixColors[Math.floor(Math.random() * matrixColors.length)];
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 20, drops[i] * 20);
        if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 50);
    const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);
  return ( <><canvas ref={canvasRef} className="matrix-canvas" /><div className="bg-overlay"></div></> );
};

const LiveCounter = () => {
  const [count, setCount] = useState(8493);
  useEffect(() => {
    const interval = setInterval(() => { setCount(prev => prev + Math.floor(Math.random() * 3) + 1); }, 1500);
    return () => clearInterval(interval);
  }, []);
  return (<div className="footer-info"><div className="status-dot"></div>+{count.toLocaleString('pt-BR')} perfis analisados hoje</div>);
};

const CountdownTimer = () => {
  const [time, setTime] = useState(279);
  useEffect(() => { 
    const timer = setInterval(() => setTime(t => t > 0 ? t - 1 : 279), 1000); 
    return () => clearInterval(timer); 
  }, []);
  const format = (s) => `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`;
  return <span>{format(time)}</span>;
};

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-box">
      <button onClick={() => setIsOpen(!isOpen)} className="faq-trigger">{question} {isOpen ? <ChevronUp size={18} color="#666"/> : <ChevronDown size={18} color="#666"/>}</button>
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

/* --- ANÁLISE DE PERFIL (Com correção anti-bug de timer) --- */
const ProfileAnalyzer = ({ target, onComplete }) => {
  const [password, setPassword] = useState('');
  const [statusTitle, setStatusTitle] = useState('Quebrando criptografia da conta');
  const [statusText, setStatusText] = useState('testando combinações de senha...');
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    let isMounted = true; // Impede que o timer continue após fechar o componente
    
    let interval = setInterval(() => {
        setPassword(prev => prev.length > 20 ? '*' : prev + '*');
    }, 15);

    let timeout2;
    let timeout1 = setTimeout(() => {
        clearInterval(interval);
        if (isMounted) {
          setIsSuccess(true);
          setPassword('********');
          setStatusTitle('SUCESSO');
          setStatusText('Conta acessada com sucesso!');
          
          timeout2 = setTimeout(() => {
             if (isMounted) onComplete();
          }, 2000);
        }
    }, 4500);

    return () => {
        isMounted = false;
        clearInterval(interval);
        clearTimeout(timeout1);
        if (timeout2) clearTimeout(timeout2);
    };
  }, []);

  return (
    <div className="analysis-screen">
      <div className="insta-login-wrapper">
        <h1 className="insta-logo-text" style={{color: 'white'}}>Instagram</h1>
        
        <input type="text" className="insta-input" value={target} readOnly />
        <input 
            type="password" 
            className="insta-input" 
            value={password} 
            readOnly 
            style={isSuccess ? {filter: 'blur(2px)', borderColor: '#00FF81', color: '#00FF81'} : {}}
        />
        
        <div className="analysis-status-inline">
            <div className="analysis-title" style={{color: isSuccess ? '#00FF81' : '#FF007A'}}>{statusTitle}</div>
            <div style={{fontSize: 12, color: '#ccc'}}>{statusText}</div>
            {!isSuccess && (
                <div className="analysis-loader"><div className="analysis-bar"></div></div>
            )}
        </div>

        <button className="insta-btn" disabled>Entrar</button>
        
        <div className="insta-divider">
            <div className="insta-line"></div>
            <div className="insta-or">OU</div>
            <div className="insta-line"></div>
        </div>
        
        <div className="insta-fb"><span style={{fontWeight:'bold'}}>Entrar com o Facebook</span></div>
        <div className="insta-forgot">Esqueceu a senha?</div>
        <div className="insta-signup">Não tem uma conta? <span style={{color: '#0095F6', fontWeight: 'bold'}}>Cadastre-se</span></div>
      </div>
    </div>
  );
};

/* --- FAKE HOME (Feed Censurado Blue Box + DMs) --- */
const FakeHome = ({ data, userCity, onComplete }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('default'); // NOVO: Controla o texto do aviso
  const [showDMs, setShowDMs] = useState(false);
  const notificationTimeout = useRef(null);

  const getTwoDaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 2);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };
  const dateStr = getTwoDaysAgo();

  const posts = [
    { name: "m****", loc: userCity, likes: 124, comments: 12, shares: 5, isCloseFriends: true, commentText: "lorem ipsum dolor sit", emojis: "🔥❤️" },
    { name: "l******", loc: "Local oculto", likes: 89, comments: 8, shares: 2, isCloseFriends: false, commentText: "muito legal isso", emojis: "😍👏" },
    { name: "j****", loc: userCity, likes: 256, comments: 34, shares: 15, isCloseFriends: true, commentText: "nao acredito nisso", emojis: "👀🔥" },
    { name: "a*********", loc: "Local oculto", likes: 45, comments: 3, shares: 0, isCloseFriends: false, commentText: "perfeito demais", emojis: "💖🥰" }
  ];

  // NOVA LISTA ATUALIZADA: 3 DMs legíveis no topo + restantes embaçadas para dar o efeito de scroll
  const fakeDMs = [
    { id: 1, name: "usuario_1", text: "Chamada de vídeo encerrada • 37:04 min", time: "1h", unread: true, avatar: "https://i.pravatar.cc/150?img=47", blurMessage: false },
    { id: 2, name: "usuario_2", text: "você vem me ver essa semana de novo?", time: "3h", unread: true, avatar: "https://i.pravatar.cc/150?img=2", blurMessage: false },
    { id: 3, name: "usuario_3", text: "só abre essa fotinho quando estiver sozinho 🤫", time: "5h", unread: true, avatar: "https://i.pravatar.cc/150?img=5", blurMessage: false },
    { id: 4, name: "usuario_4", text: "Reagiu à sua mensagem", time: "1d", unread: false, avatar: "https://i.pravatar.cc/150?img=12", blurMessage: true },
    { id: 5, name: "usuario_5", text: "Mensagem de voz", time: "1d", unread: false, avatar: "https://i.pravatar.cc/150?img=9", blurMessage: true },
    { id: 6, name: "usuario_6", text: "Curtiu uma mensagem", time: "2d", unread: false, avatar: "https://i.pravatar.cc/150?img=15", blurMessage: true },
    { id: 7, name: "usuario_7", text: "Oculto para sua segurança", time: "1 sem", unread: false, avatar: "https://i.pravatar.cc/150?img=20", blurMessage: true },
    { id: 8, name: "usuario_8", text: "Visualizou o vídeo", time: "2 sem", unread: false, avatar: "https://i.pravatar.cc/150?img=32", blurMessage: true },
    { id: 9, name: "usuario_9", text: "Mensagem apagada", time: "3 sem", unread: false, avatar: "https://i.pravatar.cc/150?img=68", blurMessage: true },
  ];

  // MOCK DAS NOTAS (Instagram Notes)
  const fakeNotes = [
    { id: 1, note: "Tédio...", img: "https://i.pravatar.cc/150?img=1" },
    { id: 2, note: "Alguém?", img: "https://i.pravatar.cc/150?img=11" },
    { id: 3, note: "Gym 💪", img: "https://i.pravatar.cc/150?img=3" },
    { id: 4, note: "😴", img: "https://i.pravatar.cc/150?img=4" },
    { id: 5, note: "Fome", img: "https://i.pravatar.cc/150?img=6" },
  ];

  const handleInteract = (e, type = 'default') => {
    // Impede que o clique dispare duas vezes (no botão e no fundo ao mesmo tempo)
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    
    setNotificationType(type); // Define qual texto aparece no pop-up

    if (showNotification) {
      // Se o pop-up JÁ ESTIVER na tela, fecha o aviso
      setShowNotification(false);
      if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
    } else {
      // Se NÃO ESTIVER na tela, mostra o aviso e começa a contar os 6s
      setShowNotification(true);
      if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
      notificationTimeout.current = setTimeout(() => {
          setShowNotification(false);
      }, 6000);
    }
  };

  useEffect(() => {
      return () => {
          if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
      }
  }, []);

  return (
    <>
    <div 
      className="fake-home" 
      onClick={(e) => handleInteract(e, 'default')} 
      style={{ 
        overflow: showDMs ? 'hidden' : 'auto', 
        height: showDMs ? '100vh' : 'auto'
      }}
    >
      {showNotification && (
        <div className="notification-overlay">
          <div className="notification-box" onClick={(e) => e.stopPropagation()}>
            <Lock size={32} style={{marginBottom: 8}}/>
            <h3 style={{fontWeight:'800', fontSize:16, marginBottom:5, lineHeight:1.2}}>
              {notificationType === 'dm' ? 'Mensagens Privadas' : 'Ação bloqueada.'}
            </h3>
            <p style={{fontSize:13, opacity:0.95}}>
              {notificationType === 'dm' 
                ? 'Com o acesso VIP você vai liberar acesso total à DM e revelar todas as conversas e mídias ocultas.' 
                : 'Seja um membro VIP do Stalkbio para ter acesso completo.'}
            </p>
            <button className="btn-unlock-small" onClick={(e) => { 
                e.stopPropagation(); 
                onComplete(); 
            }}>
              Adquirir Acesso VIP
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY DAS DMs COM ANIMAÇÃO DESLIZANTE */}
      <div 
        className={`dm-screen-wrapper ${showDMs ? 'open' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Container fixo da DM */}
        <div className="dm-screen" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Header Fixo da DM */}
          <div className="dm-header" style={{ flexShrink: 0 }}>
            <div className="dm-header-left">
              <ChevronLeft size={32} onClick={() => setShowDMs(false)} style={{cursor: 'pointer', marginLeft: '-8px'}} />
              <div className="dm-header-title">
                {data.username} <ChevronDown size={16} color="#888" />
              </div>
            </div>
            <Edit size={24} />
          </div>

          {/* Área de Scroll Exclusiva da DM */}
          <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', paddingBottom: '40px' }}>
            
            <div className="dm-search-container">
              <div className="dm-search-bar">
                <Search size={16} color="#888" />
                <input type="text" placeholder="Pesquisar" disabled />
              </div>
            </div>

            {/* SEÇÃO DE NOTAS (Instagram Notes) */}
            <div className="dm-notes-container" style={{display: 'flex', gap: '16px', padding: '10px 16px', overflowX: 'auto', borderBottom: '1px solid #262626'}}>
              {fakeNotes.map(note => (
                <div key={note.id} onClick={(e) => handleInteract(e, 'dm')} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', minWidth: '66px', cursor: 'pointer'}}>
                  {/* Balãozinho de nota */}
                  <div style={{position: 'absolute', top: '-15px', background: '#333', color: '#fff', padding: '5px 10px', borderRadius: '14px', fontSize: '11px', whiteSpace: 'nowrap', zIndex: 2, boxShadow: '0 2px 5px rgba(0,0,0,0.5)'}}>
                    {note.note}
                  </div>
                  <img src={note.img} style={{width: '66px', height: '66px', borderRadius: '50%', objectFit: 'cover', filter: 'blur(5px)', border: '2px solid transparent'}} alt="Note" />
                  <span style={{fontSize: '11px', marginTop: '6px', color: '#888', filter: 'blur(3px)'}}>usuario</span>
                </div>
              ))}
            </div>

            <div className="dm-tabs" style={{paddingTop: '10px'}}>
              <div className="dm-tab active">Mensagens</div>
              <div className="dm-tab inactive">Solicitações <span className="dm-req-badge">2</span></div>
            </div>

            <div className="dm-list" style={{ overflowY: 'visible', flex: 'none' }}>
              {fakeDMs.map(dm => (
                <div key={dm.id} className="dm-item" onClick={(e) => handleInteract(e, 'dm')}>
                   <img src={dm.avatar} className="dm-avatar" alt="Avatar" style={{filter: 'blur(5px)'}} />
                   <div className="dm-info">
                     {/* Nome embaçado */}
                     <div className={`dm-name ${dm.unread ? 'unread' : ''}`} style={{filter: 'blur(4px)', color: '#fff'}}>{dm.name}</div>
                     {/* Mensagem visível nas 3 primeiras, embaçada nas outras */}
                     <div className={`dm-text-preview ${dm.unread ? 'unread' : ''}`} style={{filter: dm.blurMessage ? 'blur(4px)' : 'none', color: dm.unread ? '#fff' : '#888'}}>
                       {dm.text} {dm.time && `• ${dm.time}`}
                     </div>
                   </div>
                   <div className="dm-right-actions">
                     {dm.unread && <div className="dm-unread-dot"></div>}
                     {/* Condição: Ícone Play azul na conversa 3, Câmera cinza nas outras */}
                     {dm.id === 3 ? (
                       <div style={{width: '26px', height: '26px', background: '#0095F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                         <Play size={12} fill="#fff" color="#fff" style={{marginLeft: '2px'}} />
                       </div>
                     ) : (
                       <Camera size={24} color="#888" />
                     )}
                   </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      {/* FIM DO OVERLAY DAS DMs */}

      <div className="fake-header">
        <div style={{fontWeight:'bold', fontSize:18}}>Instagram</div>
        {!showDMs && (
          <div style={{display:'flex', gap:20, alignItems: 'center'}}>
            <div className="header-icon-container">
              <Heart size={24} />
              <div className="badge-dot"></div>
            </div>
            <div className="header-icon-container" onClick={(e) => { e.stopPropagation(); setShowDMs(true); }} style={{cursor: 'pointer'}}>
              <Send size={24} style={{transform: 'rotate(-15deg)', marginBottom: '4px'}} />
              <div className="badge-count">4</div>
            </div>
          </div>
        )}
      </div>

         <div className="stories-bar">
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:5, minWidth:66}}>
            <div className="story-ring">
                <img src={data.profilePicUrl || 'https://via.placeholder.com/150'} className="story-img" />
            </div>
            <span style={{fontSize:11}}>{data.username.substring(0,8)}...</span>
        </div>
        {[1,2,3,4].map(i => {
          const isGreen = i % 2 === 0; 
          
          // --- CONTROLE INTELIGENTE DE IMAGENS ---
          // Define a imagem aleatória como padrão (vai ser usada na 2 e 4)
          let imgSrc = `https://i.pravatar.cc/150?img=${i+10}`; 
          
          // Se for a imagem 1 ou 3, substitui pelo SEU link:
          if (i === 1) imgSrc = "https://imgur.com/hyO7kYb.png"; // <--- ALTERE O LINK DA IMAGEM 1 AQUI
          if (i === 3) imgSrc = "https://imgur.com/DGQygHl.png"; // <--- ALTERE O LINK DA IMAGEM 3 AQUI

          return (
            <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:5, minWidth:66}}>
                <div className={`story-ring ${isGreen ? 'story-ring-green' : 'story-ring-locked'}`}>
                    <img 
                      src={imgSrc} 
                      className="story-img" 
                    />
                    <Lock size={16} color="white" className="story-lock-icon"/>
                </div>
                <div style={{width:40, height:6, background:'#333', borderRadius:3}}></div>
            </div>
          );
        })}
      </div>

      <div style={{paddingBottom: 20}}>
        {posts.map((post, i) => (
          <div key={i} style={{marginBottom: 15}}>
            <div className="post-header">
               <div style={{display:'flex', alignItems:'center'}}>
                   <div className="post-avatar-container"><div className="post-avatar-blur"></div><Lock className="post-avatar-lock" /></div>
                   <div><div style={{fontWeight:'bold', fontSize:13}}>{post.name}</div><div style={{fontSize:11, color:'#888'}}>{post.loc}</div></div>
               </div>
               <div style={{fontWeight:'bold'}}>...</div>
            </div>
            <div className="post-content-restricted"><Lock size={40} color="#64748B" /><span>Conteúdo Restrito</span></div>
            <div className="post-actions">
               <div className="action-item"><Heart size={24} /> {post.likes}</div>
               <div className="action-item"><MessageCircle size={24} /> {post.comments}</div>
               <div className="action-item"><ArrowRight size={24} style={{transform:'rotate(-45deg)'}} /> {post.shares}</div>
            </div>
            <div className="post-comment"><span style={{fontWeight:'bold', marginRight:5}}>{data.username}</span><span className="blurred-text">{post.commentText}</span><span style={{filter:'none'}}>{post.emojis}</span></div>
            <div className="post-date">{dateStr}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="vip-floating-card" role="button" tabIndex={0} onClick={() => onComplete()} style={{cursor: 'pointer'}}>
      <div className="vip-content">
        <div className="vip-header">
          <h3 className="vip-title">Prévia disponível por <CountdownTimer /></h3>
          <span className="vip-badge">Tornar-se VIP</span>
        </div>
        <p className="vip-text">Você ganhou 5 minutos para testar gratuitamente nossa ferramenta, mas para liberar todas as funcionalidades e ter acesso permanente é necessário ser um membro VIP.</p>
      </div>
    </div>
    </>
  );
};

/* --- APP PRINCIPAL --- */
export default function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [searchStep, setSearchStep] = useState(1);
  const [userCity, setUserCity] = useState('sua região');
  const [flowStep, setFlowStep] = useState('SEARCH'); 

  // Função central de Tracking de UTMs
  const getCheckoutLink = (baseUrl) => {
    try {
      const checkoutUrl = new URL(baseUrl);
      const siteParams = new URLSearchParams(window.location.search);
      
      const utmSource = siteParams.get('utm_source');
      const utmCampaign = siteParams.get('utm_campaign');
      
      if (utmSource) checkoutUrl.searchParams.set('utm_source', utmSource);
      if (utmCampaign) checkoutUrl.searchParams.set('utm_campaign', utmCampaign);
      
      return checkoutUrl.toString();
    } catch (error) {
      return baseUrl; 
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [flowStep]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const dt = await response.json();
        if (dt.city) setUserCity(dt.city);
      } catch (e) {}
    };
    fetchLocation();

    const savedTarget = localStorage.getItem('user_target');
    if (savedTarget) {
      try {
        const parsed = JSON.parse(savedTarget);
        if(parsed && parsed.username) {
           setData(parsed);
        }
      } catch(e) { localStorage.removeItem('user_target'); }
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username) return;

    const savedTarget = localStorage.getItem('user_target');
    if (savedTarget) {
      setData(JSON.parse(savedTarget));
      setFlowStep('CONFIRM');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/puxar-dados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.replace('@', '') })
      });
      const result = await response.json();
      if (!response.ok) throw new Error('Erro');
      setData(result);
      setFlowStep('CONFIRM');
    } catch (err) {
      setData({
        username: username.replace('@', ''),
        fullName: username.replace('@', '').toUpperCase(),
        biography: "⚠️ Perfil carregado em modo de teste.",
        followersCount: 12450,
        followsCount: 320,
        postsCount: 45,
        profilePicUrl: null, 
        isPrivate: true
      });
      setFlowStep('CONFIRM');
    } finally {
      setLoading(false);
    }
  };

  const confirmTarget = () => {
    if (data) {
      localStorage.setItem('user_target', JSON.stringify(data));
      setFlowStep('ANALYZING');
    }
  };

  const resetSearch = () => {
    const savedTarget = localStorage.getItem('user_target');
    if (savedTarget) {
        alert("Acesso vinculado a este dispositivo. Não é possível trocar de alvo.");
        return;
    }
    setData(null);
    setFlowStep('SEARCH');
    setSearchStep(1);
    setUsername('');
  };

  if (flowStep === 'SEARCH') {
    return (
      <div className="app-container center-screen">
        <MatrixBackground />
        <div className="search-container">
          <div className="search-card">
            <div className="logo-center"><img src="https://imgur.com/x3GUjZC.png" alt="Stalkbio" className="logo-large" /></div>
            <h1 className="title-hero"><TypingEffect text="O que seu Cônjuge faz quando está no Instagram??" speed={80} delay={0} /></h1>
            <p className="subtitle"><TypingEffect text="Descubra a verdade sobre qualquer pessoa, acessando o instagram dela." speed={60} delay={2500} /></p>
            {searchStep === 1 ? (
              <div style={{animation: 'fadeIn 0.5s ease-in', animationDelay: '5.5s', animationFillMode: 'both'}}>
                <button onClick={() => setSearchStep(2)} className="btn-gradient"><Eye size={24} /> Espionar Agora</button>
              </div>
            ) : (
              <div style={{animation: 'fadeIn 0.5s ease-in', animationDelay: '5.5s', animationFillMode: 'both'}}>
                <form onSubmit={handleSearch} className="input-wrapper">
                  <span className="at-symbol">@</span>
                  <input autoFocus className="input-field" placeholder="digite o @ da pessoa" value={username} onChange={e => setUsername(e.target.value)} disabled={loading} />
                  <button type="submit" disabled={loading || !username} className="btn-arrow">
                    {loading ? <div className="radar-spinner"></div> : <ArrowRight size={24} strokeWidth={3} />}
                  </button>
                </form>
              </div>
            )}
            <div className="security-text" style={{animation: 'fadeIn 0.5s ease-in', animationDelay: '6.5s', animationFillMode: 'both', display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'center', fontSize: '12px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Lock size={12} color="#FF2D78" /><span>100% anônimo</span></div>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Lock size={12} color="#FF2D78" /><span>sem senha</span></div>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Lock size={12} color="#FF2D78" /><span>teste grátis</span></div>
            </div>
          </div>
          <LiveCounter />
        </div>
      </div>
    );
  }

  if (flowStep === 'CONFIRM') {
    return (
      <div className="app-container center-screen">
        <MatrixBackground />
        <div className="search-container">
          <div className="search-card">
            <h2 className="confirm-title" style={{marginBottom:10, fontSize:22}}>Confirmar pesquisa</h2>
            <p className="subtitle" style={{marginBottom:25, fontSize:16, color:'#fff'}}>você deseja espionar o perfil <span style={{color:'#FF007A', fontWeight:'bold'}}>@{data.username}</span>?</p>
            <img src={data.profilePicUrl || 'https://via.placeholder.com/150'} className="confirm-avatar" onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150/0d0d0d/ffffff?text=?'}} />
            <h3 style={{fontSize:20, fontWeight:'bold', marginBottom:5}}>{data.fullName || data.username}</h3>
            <span style={{color:'#B7BCCD', fontFamily:'monospace', display:'block', marginBottom:20}}>@{data.username}</span>
            
            {/* NOVAS INFORMAÇÕES ADICIONADAS AQUI */}
            <div className="stats-row" style={{justifyContent: 'center', marginBottom: '15px'}}>
              <span><strong>{data.postsCount}</strong> posts</span>
              <span><strong>{data.followersCount}</strong> seg...</span>
              <span><strong>{data.followsCount}</strong> seg...</span>
            </div>
            
            <div className="bio-text" style={{textAlign: 'left', marginBottom: '30px'}}>
              {data.biography ? <p>{data.biography}</p> : <p>Biografia oculta ou inexistente.</p>}
            </div>
            {/* FIM DAS NOVAS INFORMAÇÕES */}

            <div className="confirm-actions">
              <button onClick={resetSearch} className="btn-confirm-no">Não</button>
              <button onClick={confirmTarget} className="btn-confirm-yes">Sim, confirmar</button>
            </div>
            <div className="confirm-warning">Nossa plataforma libera somente uma pesquisa por pessoa, então confirme se realmente deseja espionar.</div>
          </div>
        </div>
      </div>
    );
  }

  if (flowStep === 'ANALYZING') return <ProfileAnalyzer target={data.username} onComplete={() => setFlowStep('FAKE_HOME')} />;

  if (flowStep === 'FAKE_HOME') return <FakeHome data={data} userCity={userCity} onComplete={() => setFlowStep('SALES')} />;

  if (flowStep === 'SALES') {
    return (
      <div className="app-container">
        <MatrixBackground />
        <div className="bg-overlay"></div>
        {/* BARRA DE TOPO REMOVIDA DAQUI (Agora só na FakeHome) */}
        
        <main className="main-content">
          <div className="content-padding">
            <div className="header-section">
              <img src="https://imgur.com/x3GUjZC.png" alt="Stalkbio" className="logo-medium" />
              <h2 className="header-title">A maior ferramenta de stalkear do Brasil</h2>
            </div>
            
            <div className="profile-card">
              <p className="profile-header-text">Acesso completo ao perfil de:</p>
              <div className="logo-center"><span className="username-badge">@{data.username}</span></div>
              <div className="profile-content">
                <img src={data.profilePicUrl || 'https://via.placeholder.com/150'} alt={data.username} referrerPolicy="no-referrer" className="profile-avatar" onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150/0d0d0d/ffffff?text=?'}} />
                <div className="profile-details"><p>{data.fullName || data.username}</p><div className="stats-row"><span><strong>{data.postsCount}</strong> posts</span><span><strong>{data.followersCount}</strong> seg...</span><span><strong>{data.followsCount}</strong> seg...</span></div></div>
              </div>
              <div className="bio-text">{data.biography ? <p>{data.biography}</p> : <p>Biografia oculta ou inexistente.</p>}</div>
              <div className="btn-buy btn-green-spotify">Sem precisar de senha. Sem deixar rastros. Sem que a pessoa saiba.</div>
            </div>

            <div className="logo-center animate-bounce"><ArrowDown size={32} color="rgba(255,255,255,0.5)" /></div>

            <div className="section-card">
              <div className="section-header"><div className="icon-circle"><Smartphone color="#FF007A" /></div><h3 className="header-title" style={{marginBottom: '5px'}}>Todas as mídias recebidas e enviadas por @{data.username}</h3><p className="section-subtitle">Incluindo arquivos ocultos que não estão ‘visíveis pra todos’.</p></div>
              <div className="media-grid">{[1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="media-box"><Lock size={20} color="rgba(255,255,255,0.3)" /></div>))}</div>
            </div>

            <div className="section-card">
               <div className="section-header"><MapPin size={36} color="#FFD43B" style={{marginBottom:10}} /><h3 className="header-title" style={{marginBottom: '5px'}}>Localização em tempo real de @{data.username}</h3><p className="section-subtitle">Veja onde a pessoa está agora e por onde passou nas últimas horas.</p></div>
               <div className="map-container">
                  <div className="map-background" style={{backgroundImage: 'url(https://imgur.com/3TtXRhd.png)'}}></div>
                  <div className="map-footer"><div><p style={{fontWeight:'bold', fontSize:14}}>Localização atual</p><p style={{color:'#00FF81', fontSize:12}}>@{data.username} está compartilhando</p></div><button className="btn-small">Ver</button></div>
               </div>
            </div>

            <div className="section-card">
               <div className="section-header"><Eye size={36} color="#8B00FF" style={{marginBottom:10}} /><h3 className="header-title" style={{marginBottom: '5px'}}>Stories e posts ocultos</h3><p className="section-subtitle" style={{maxWidth: '80%', margin: '0 auto'}}>Aqueles postados pra ‘Melhores Amigos’ ou ocultados de você.<br /><strong style={{color:'white', display: 'block', marginTop: '5px'}}>Você verá mesmo se o perfil for privado.</strong></p></div>
               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, maxWidth: '400px', margin: '0 auto'}}>
                  <div className="media-box" style={{height: 120, flexDirection:'column', gap:5}}><Lock color="#FF007A" /><span style={{fontSize:11, color:'#666'}}>Conteúdo restrito</span></div>
                  <div className="media-box" style={{height: 120, flexDirection:'column', gap:5}}><Lock color="#FF007A" /><span style={{fontSize:11, color:'#666'}}>Conteúdo restrito</span></div>
               </div>
            </div>

            <div className="section-card" style={{background:'#0F1115'}}>
              <div style={{marginBottom: 20}}><div style={{display:'flex', alignItems:'center', gap:10, marginBottom:5}}><MessageCircle color="#00C2FF" /><h3 className="section-title" style={{fontSize:16}}>Mensagens privadas (Directs)</h3></div><p className="section-subtitle" style={{textAlign:'left', maxWidth:'100%'}}>Veja o que @{data.username} fala no privado. Conversas, fotos, vídeos...</p></div>
              <div className="chat-window">
                <div className="chat-top"><div className="chat-user"><div className="chat-avatar"></div><div><div style={{fontSize:12, fontWeight:'bold'}}>@{data.username}</div><div style={{fontSize:10, color:'#22C55E'}}>online</div></div></div><div style={{display:'flex', gap:10}}><Phone size={16} color="#666" /><Video size={16} color="#666" /><Info size={16} color="#666" /></div></div>
                <div className="chat-bubble bubble-left"><p>Ligação de vídeo</p><span style={{fontSize:10, opacity:0.5}}>0:47</span></div>
                <div className="chat-bubble bubble-right"></div>
                <div className="chat-bubble bubble-right" style={{width: 100}}></div>
              </div>
            </div>

            <div className="explanation-card">
              <div className="logo-center"><img src="https://imgur.com/x3GUjZC.png" alt="Stalkbio Logo" className="logo-small" /></div>
              <h3 className="section-title" style={{textAlign:'center', lineHeight:1.3}}>Além do acesso ao perfil de @{data.username} você poderá ter acesso a ferramenta do Stalkbio</h3>
              <p className="section-subtitle" style={{textAlign:'center', marginTop:10, maxWidth:'100%'}}>De forma completa e vitalícia, ou seja, stalkear quantos perfis quiser, quando quiser pra sempre.</p>
              <div className="benefit-list">{["Pesquisar quantos perfis quiser.", "Visualizar todos os dados com apenas um clique.", "Ter acesso vitalício sem pagar mensalidade.", "Sem instalar nada, serviço funciona na nuvem."].map((item, i) => (<div key={i} className="benefit-item"><CheckCircle2 color="#00FF88" size={18} style={{minWidth:18}} /><span>{item}</span></div>))}</div>
              <div className="red-alert"><h4 className="red-title">SEM O STALKBIO, VOCÊ NÃO VÊ NADA</h4><p className="red-text">É ele quem desbloqueia os dados de <strong>@{data.username}</strong> de forma invisível</p></div>
            </div>

            <div style={{marginBottom: 50}}>
               <h2 className="header-title" style={{marginBottom:30}}>Tenha o controle de qualquer perfil em suas mãos!</h2>
               <div className="main-benefits" style={{maxWidth: '400px', margin: '0 auto'}}>
                  {[{ icon: '💔', t: 'Descobrir uma traição antes dela acontecer.' }, { icon: '🤫', t: 'Explorar quem você ama em silêncio.' }, { icon: '💬', t: 'Ver as conversas dela com você e outras pessoas.' }, { icon: '🛡️', t: 'Proteger sua família, seu relacionamento, sua empresa.' }].map((item, index) => (<div key={index} className="benefit-row"><span className="benefit-icon">{item.icon}</span><span className="benefit-text">{item.t}</span></div>))}
               </div>
            </div>

            <div style={{background:'#0F1013', border:'1px solid rgba(248, 113, 113, 0.3)', borderRadius:16, padding:20, marginBottom:50, textAlign:'center'}}>
               <p style={{color:'#F87171', fontSize:13, lineHeight:1.5}}><strong>Atenção: Uso com consentimento</strong><br/>Esta ferramenta não viola leis nem dados privados, apenas acessa informações disponíveis via inteligência.</p>
            </div>

            <div style={{marginBottom: 50}}>
               <h2 className="header-title" style={{marginBottom:30}}>Veja o que falam as pessoas que usam o Stalkbio:</h2>
               <div>{[{ name: 'Ricardo M.', text: 'Eu tava desconfiando, mas não tinha certeza… Quando paguei e vi as mensagens escondidas, chorei por horas. Ele não sabia que eu via tudo.', img: "https://imgur.com/GnMNOz0.png" }, { name: 'Lucas S.', text: 'Usei na conta de uma ficante minha e vi que ela tava com outro há meses. A ferramenta me deu paz.', img: "https://imgur.com/FQvhfTc.png" }, { name: 'Ana P.', text: 'É bizarro de tão real. Parece coisa de filme. Mas funciona.', img: "https://imgur.com/GnMNOz0.png" }, { name: 'Marcos V.', text: 'não vivo sem essa ferramenta, conheci ela uns meses atrás no tiktok e até hoje uso em alguns perfis que to desconfiado', img: "https://imgur.com/FQvhfTc.png" }, { name: 'Juliana R.', text: 'a função de ver a localização em tempo real é muito bom kkkkk', img: "https://imgur.com/GnMNOz0.png" }, { name: 'Pedro H.', text: 'Não recomendo pra quem não quer ver a verdade.', img: "https://imgur.com/FQvhfTc.png" }].map((dep, idx) => (<div key={idx} className="testimonial-card"><div className="user-row"><img src={dep.img} alt="User" className="user-pic" /><span className="user-name">{dep.name}</span></div><p className="user-comment">"{dep.text}"</p></div>))}</div>
               <p style={{color:'#D72626', textAlign:'center', fontWeight:'bold', fontSize:13, marginTop:30, textTransform:'uppercase', letterSpacing:1}}>Essa é a verdade crua. Você decide se quer ver.</p>
            </div>

            <div className="scarcity-section">
               <p style={{fontSize:18, fontWeight:500, marginBottom:15}}>Quando você teria acesso a essa ferramenta poderosa de forma vitalícia?</p>
               <div className="badge-bf">BLACK FRIDAY LIMITADA</div>
               <h2 style={{color:'#00FF81', fontSize:32, fontWeight:800, lineHeight:1}}>ESCOLHA SEU PLANO</h2>
               <p style={{opacity:0.8, fontSize:14}}>por tempo limitado</p>
            </div>

            <div style={{marginBottom: 50}}>
               <div className="plan-card">
                  <h3 style={{fontSize:20, fontWeight:'bold'}}>Apenas acesso ao perfil</h3>
                  <p style={{fontSize:12, color:'#B7BCCD', marginBottom:15}}>Acesso ao perfil de: @{data.username}</p>
                  <div className="price-tag" style={{color:'#fff', fontSize:28}}>R$ 29,90</div>
                  <div className="check-list">{[`Acesso ao perfil de @${data.username}`, 'Directs em tempo real', 'Fotos ocultas', 'Stories ocultos', 'Localização em tempo real', 'Acesso limitado'].map((feat, i) => (<div key={i} className="check-item"><CheckCircle2 size={18} color="#00FF81" />{feat}</div>))}</div>
                  <a href={getCheckoutLink("https://ggcheckout.app/checkout/v5/ZyybfDAvTX26Dw2mYHUn")} target="_blank" rel="noreferrer" className="btn-buy btn-white">Escolher Plano</a>
               </div>
               <div className="plan-card plan-highlight">
                  <div className="best-tag">Mais Escolhido</div>
                  <h3 style={{fontSize:20, fontWeight:'bold', marginTop:10}}>Acesso ao perfil de @{data.username} + Ferramenta completa do Stalkbio</h3>
                  <div style={{display:'flex', flexDirection: 'column', alignItems:'center', margin: '20px 0'}}>
                     <span className="old-price" style={{textDecoration: 'line-through', color: '#EF4444', fontSize: '14px', marginBottom: '5px'}}>R$ 197,90</span>
                     <span className="price-tag" style={{fontSize: '36px', color: '#22C55E', fontWeight: 'bold', lineHeight: '1'}}>R$ 39,90</span>
                  </div>
                  <div className="check-list">{['Acesso completo ao perfil', 'Directs em tempo real', 'Stories ocultos dos últimos 30 dias', 'Fotos ocultas', 'Vídeos privados','Mensagens apagadas', 'Localização em tempo real com histórico', 'Notificações em tempo real de tudo que a pessoa faz', 'Relatórios detalhados de comportamento', 'Stalker quântico (efeito visual apenas)', 'Acesso vitalício'].map((feat, i) => (<div key={i} className="check-item"><CheckCircle2 size={18} color="#22C55E" />{feat}</div>))}</div>
                  <a href={getCheckoutLink("https://ggcheckout.app/checkout/v5/2FCt9x6VxahUFVR2aZYW")} target="_blank" rel="noreferrer" className="btn-buy btn-green">Escolher Plano</a>
               </div>
            </div>

            <div className="trust-footer">
               <div className="trust-item"><ShieldCheck size={14} /> Acesso Vitalício</div>
               <div className="trust-item"><CheckCircle2 size={14} /> Suporte 24h</div>
               <div className="trust-item"><Lock size={14} /> Compra 100% Segura • SSL</div>
            </div>

            <div style={{background:'rgba(34, 197, 94, 0.1)', border:'1px solid rgba(34, 197, 94, 0.3)', borderRadius:20, padding:25, textAlign:'center', marginBottom:50}}>
               <h3 style={{fontWeight:'bold', fontSize:18, marginBottom:5}}>Garantia de 30 Dias</h3>
               <p style={{fontSize:14, color:'#B7BCCD'}}>Se não gostar, devolvemos 100% do seu dinheiro.</p>
            </div>

            <div className="faq-container">
               <h2 className="header-title" style={{marginBottom:30}}>Perguntas Frequentes</h2>
               <FaqItem question="A ferramenta realmente funciona?" answer="Sim! Nossa ferramenta acessa dados públicos e privados de perfis do Instagram de forma 100% invisível. Milhares de pessoas já usaram e descobriram a verdade." />
               <FaqItem question="A pessoa vai saber que eu stalkiei o perfil dela?" answer="Não! Nosso sistema é completamente invisível. Não deixamos rastros e a pessoa nunca vai saber que você viu o perfil dela." />
               <FaqItem question="Funciona em perfis privados?" answer="Sim! Nossa tecnologia consegue acessar informações de perfis privados, incluindo stories ocultos, mensagens e localização." />
               <FaqItem question="Preciso instalar alguma coisa?" answer="Não! A ferramenta funciona 100% na nuvem. Você só precisa ter acesso à internet e pode usar de qualquer dispositivo." />
               <FaqItem question="Como funciona a garantia?" answer="Você tem 30 dias para testar. Se não gostar, devolvemos 100% do seu dinheiro sem perguntas." />
               <FaqItem question="Quanto tempo tenho acesso?" answer="Com o Plano Stalkbio, você tem acesso VITALÍCIO! Pague uma vez e use para sempre, sem mensalidades." />
            </div>

            <div style={{textAlign:'center', fontSize:12, color:'#333', paddingBottom:30}}>© 2025 Stalkbio Inc. Todos os direitos reservados.</div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}