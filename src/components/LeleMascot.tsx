// Components/Weather/LeleMascot.tsx
// Mascote Lele - Uma menina morena clara de cabelo cacheado
// Inspirada no sapinho do Google Weather

import React from 'react';
import { WeatherIconType } from '../types/weather';

interface LeleMascotProps {
    weather: WeatherIconType;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Cores base da Lele
const SKIN_COLOR = '#D4A574'; // Morena clara
// const SKIN_SHADOW = '#C4956A'; // Reservado para futuras sombras
const HAIR_COLOR = '#3D2314'; // Cabelo castanho escuro
const HAIR_HIGHLIGHT = '#5D3A24';
const CHEEK_COLOR = '#E8A0A0';
const EYE_COLOR = '#2D1810';
const DRESS_PRIMARY = '#FF6B9D'; // Rosa
const DRESS_SECONDARY = '#FF8FB1';

// Lele Ensolarada - Feliz com óculos de sol e sorvete
const LeleSunny: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sol de fundo */}
        <circle cx="160" cy="40" r="30" fill="#FFD93D" opacity="0.3"/>
        <circle cx="160" cy="40" r="20" fill="#FFD93D"/>
        
        {/* Cabelo cacheado grande e volumoso - cachos caídos */}
        <ellipse cx="100" cy="85" rx="58" ry="55" fill={HAIR_COLOR}/>
        {/* Cachos laterais caídos - esquerda */}
        <ellipse cx="45" cy="90" rx="18" ry="25" fill={HAIR_COLOR}/>
        <ellipse cx="42" cy="115" rx="15" ry="20" fill={HAIR_COLOR}/>
        <ellipse cx="48" cy="135" rx="12" ry="15" fill={HAIR_HIGHLIGHT}/>
        {/* Cachos laterais caídos - direita */}
        <ellipse cx="155" cy="90" rx="18" ry="25" fill={HAIR_COLOR}/>
        <ellipse cx="158" cy="115" rx="15" ry="20" fill={HAIR_COLOR}/>
        <ellipse cx="152" cy="135" rx="12" ry="15" fill={HAIR_HIGHLIGHT}/>
        {/* Cachos no topo */}
        <ellipse cx="70" cy="50" rx="18" ry="15" fill={HAIR_COLOR}/>
        <ellipse cx="100" cy="42" rx="20" ry="16" fill={HAIR_COLOR}/>
        <ellipse cx="130" cy="50" rx="18" ry="15" fill={HAIR_COLOR}/>
        {/* Detalhes de brilho nos cachos */}
        <ellipse cx="65" cy="55" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="135" cy="55" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="50" cy="100" rx="6" ry="8" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="150" cy="100" rx="6" ry="8" fill={HAIR_HIGHLIGHT}/>
        
        {/* Rosto */}
        <ellipse cx="100" cy="100" rx="40" ry="42" fill={SKIN_COLOR}/>
        
        {/* Bochechas */}
        <ellipse cx="70" cy="110" rx="8" ry="5" fill={CHEEK_COLOR} opacity="0.6"/>
        <ellipse cx="130" cy="110" rx="8" ry="5" fill={CHEEK_COLOR} opacity="0.6"/>
        
        {/* Óculos de sol */}
        <rect x="62" y="90" width="25" height="18" rx="4" fill="#1a1a1a"/>
        <rect x="113" y="90" width="25" height="18" rx="4" fill="#1a1a1a"/>
        <line x1="87" y1="97" x2="113" y2="97" stroke="#1a1a1a" strokeWidth="3"/>
        <line x1="62" y1="97" x2="55" y2="93" stroke="#1a1a1a" strokeWidth="2"/>
        <line x1="138" y1="97" x2="145" y2="93" stroke="#1a1a1a" strokeWidth="2"/>
        {/* Reflexo nos óculos */}
        <rect x="65" y="93" width="8" height="3" rx="1" fill="white" opacity="0.3"/>
        <rect x="116" y="93" width="8" height="3" rx="1" fill="white" opacity="0.3"/>
        
        {/* Sorriso grande */}
        <path d="M 80 120 Q 100 140 120 120" stroke={EYE_COLOR} strokeWidth="3" fill="none" strokeLinecap="round"/>
        
        {/* Corpo/Vestido */}
        <path d="M 70 140 Q 60 155 55 185 L 65 190 Q 100 175 135 190 L 145 185 Q 140 155 130 140 Z" fill={DRESS_PRIMARY}/>
        <path d="M 75 150 Q 100 160 125 150" stroke={DRESS_SECONDARY} strokeWidth="2" fill="none"/>
        
        {/* Braço com sorvete */}
        <ellipse cx="150" cy="155" rx="12" ry="10" fill={SKIN_COLOR}/>
        {/* Sorvete */}
        <polygon points="145,170 155,170 150,190" fill="#F5D6BA"/>
        <circle cx="150" cy="163" r="12" fill="#FFB6C1"/>
        <circle cx="150" cy="153" r="10" fill="#87CEEB"/>
        <circle cx="150" cy="145" r="8" fill="#98FB98"/>
        
        {/* Cachos frontais caindo na testa */}
        <ellipse cx="75" cy="72" rx="10" ry="8" fill={HAIR_COLOR}/>
        <ellipse cx="125" cy="72" rx="10" ry="8" fill={HAIR_COLOR}/>
        <ellipse cx="90" cy="68" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="110" cy="68" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
    </svg>
);

// Lele Chuvosa - Com guarda-chuva e galochas
const LeleRainy: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Gotas de chuva */}
        <ellipse cx="30" cy="40" rx="3" ry="6" fill="#60A5FA" opacity="0.7"/>
        <ellipse cx="50" cy="25" rx="3" ry="6" fill="#60A5FA" opacity="0.7"/>
        <ellipse cx="170" cy="50" rx="3" ry="6" fill="#60A5FA" opacity="0.7"/>
        <ellipse cx="180" cy="30" rx="3" ry="6" fill="#60A5FA" opacity="0.7"/>
        
        {/* Guarda-chuva */}
        <path d="M 50 50 Q 100 10 150 50 Z" fill="#FF6B9D"/>
        <path d="M 60 50 Q 75 35 90 50" fill="#FF8FB1"/>
        <path d="M 110 50 Q 125 35 140 50" fill="#FF8FB1"/>
        <line x1="100" y1="50" x2="100" y2="140" stroke="#8B4513" strokeWidth="4"/>
        <path d="M 100 140 Q 95 145 90 140" stroke="#8B4513" strokeWidth="4" fill="none"/>
        
        {/* Cabelo cacheado grande - cachos caídos */}
        <ellipse cx="100" cy="100" rx="50" ry="48" fill={HAIR_COLOR}/>
        {/* Cachos laterais */}
        <ellipse cx="52" cy="105" rx="16" ry="22" fill={HAIR_COLOR}/>
        <ellipse cx="50" cy="125" rx="14" ry="18" fill={HAIR_COLOR}/>
        <ellipse cx="55" cy="140" rx="10" ry="12" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="148" cy="105" rx="16" ry="22" fill={HAIR_COLOR}/>
        <ellipse cx="150" cy="125" rx="14" ry="18" fill={HAIR_COLOR}/>
        <ellipse cx="145" cy="140" rx="10" ry="12" fill={HAIR_HIGHLIGHT}/>
        {/* Cachos no topo */}
        <ellipse cx="75" cy="65" rx="14" ry="12" fill={HAIR_COLOR}/>
        <ellipse cx="125" cy="65" rx="14" ry="12" fill={HAIR_COLOR}/>
        <ellipse cx="70" cy="72" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="130" cy="72" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        
        {/* Rosto */}
        <ellipse cx="100" cy="115" rx="35" ry="35" fill={SKIN_COLOR}/>
        
        {/* Bochechas */}
        <ellipse cx="75" cy="123" rx="7" ry="4" fill={CHEEK_COLOR} opacity="0.6"/>
        <ellipse cx="125" cy="123" rx="7" ry="4" fill={CHEEK_COLOR} opacity="0.6"/>
        
        {/* Olhos (olhando pra cima, preocupada com chuva) */}
        <ellipse cx="85" cy="110" rx="6" ry="8" fill="white"/>
        <ellipse cx="115" cy="110" rx="6" ry="8" fill="white"/>
        <circle cx="85" cy="108" r="4" fill={EYE_COLOR}/>
        <circle cx="115" cy="108" r="4" fill={EYE_COLOR}/>
        <circle cx="84" cy="107" r="1.5" fill="white"/>
        <circle cx="114" cy="107" r="1.5" fill="white"/>
        
        {/* Boca (preocupada/surpresa) */}
        <ellipse cx="100" cy="133" rx="6" ry="4" fill="#E88B8B"/>
        
        {/* Corpo com capa de chuva */}
        <path d="M 70 150 Q 60 165 55 195 L 145 195 Q 140 165 130 150 Z" fill="#FFE135"/>
        <line x1="100" y1="150" x2="100" y2="190" stroke="#E6C82E" strokeWidth="2"/>
        
        {/* Galochas */}
        <ellipse cx="75" cy="197" rx="15" ry="8" fill="#FF6B9D"/>
        <ellipse cx="125" cy="197" rx="15" ry="8" fill="#FF6B9D"/>
    </svg>
);

// Lele Tempestade - Assustada com raio
const LeleThunderstorm: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Nuvem escura */}
        <ellipse cx="100" cy="30" rx="50" ry="25" fill="#475569"/>
        <circle cx="60" cy="35" r="20" fill="#475569"/>
        <circle cx="140" cy="35" r="20" fill="#475569"/>
        
        {/* Raio */}
        <polygon points="120,35 100,70 115,70 90,100 110,100 85,140 130,85 105,85 125,55 110,55" fill="#FBBF24"/>
        <polygon points="115,45 105,65 115,65 100,90" fill="#FDE68A"/>
        
        {/* Cabelo cacheado grande - bagunçado pelo vento */}
        <ellipse cx="100" cy="105" rx="52" ry="48" fill={HAIR_COLOR}/>
        {/* Cachos laterais voando com o vento */}
        <ellipse cx="48" cy="100" rx="18" ry="24" fill={HAIR_COLOR}/>
        <ellipse cx="42" cy="85" rx="14" ry="18" fill={HAIR_COLOR}/>
        <path d="M 38 75 Q 25 65 20 80" stroke={HAIR_COLOR} strokeWidth="12" strokeLinecap="round"/>
        <ellipse cx="152" cy="105" rx="18" ry="24" fill={HAIR_COLOR}/>
        <ellipse cx="158" cy="90" rx="14" ry="18" fill={HAIR_COLOR}/>
        <path d="M 162 80 Q 175 70 180 85" stroke={HAIR_COLOR} strokeWidth="12" strokeLinecap="round"/>
        {/* Cachos caídos nas laterais */}
        <ellipse cx="50" cy="125" rx="12" ry="16" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="150" cy="125" rx="12" ry="16" fill={HAIR_HIGHLIGHT}/>
        {/* Cachos no topo bagunçados */}
        <ellipse cx="75" cy="70" rx="14" ry="12" fill={HAIR_COLOR}/>
        <ellipse cx="125" cy="72" rx="14" ry="12" fill={HAIR_COLOR}/>
        <ellipse cx="70" cy="78" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="130" cy="80" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        
        {/* Rosto */}
        <ellipse cx="100" cy="120" rx="35" ry="35" fill={SKIN_COLOR}/>
        
        {/* Bochechas (mais pálidas de susto) */}
        <ellipse cx="75" cy="128" rx="6" ry="4" fill={CHEEK_COLOR} opacity="0.4"/>
        <ellipse cx="125" cy="128" rx="6" ry="4" fill={CHEEK_COLOR} opacity="0.4"/>
        
        {/* Olhos arregalados de susto */}
        <ellipse cx="85" cy="115" rx="10" ry="12" fill="white"/>
        <ellipse cx="115" cy="115" rx="10" ry="12" fill="white"/>
        <circle cx="85" cy="115" r="5" fill={EYE_COLOR}/>
        <circle cx="115" cy="115" r="5" fill={EYE_COLOR}/>
        <circle cx="83" cy="113" r="2" fill="white"/>
        <circle cx="113" cy="113" r="2" fill="white"/>
        
        {/* Sobrancelhas preocupadas */}
        <path d="M 75 103 Q 82 100 90 105" stroke={HAIR_COLOR} strokeWidth="2" fill="none"/>
        <path d="M 125 103 Q 118 100 110 105" stroke={HAIR_COLOR} strokeWidth="2" fill="none"/>
        
        {/* Boca assustada */}
        <ellipse cx="100" cy="138" rx="8" ry="10" fill="#E88B8B"/>
        <ellipse cx="100" cy="135" rx="5" ry="4" fill="#1a1a1a"/>
        
        {/* Corpo encolhido */}
        <path d="M 75 155 Q 65 170 60 195 L 140 195 Q 135 170 125 155 Z" fill={DRESS_PRIMARY}/>
        
        {/* Mãos cobrindo ouvidos */}
        <ellipse cx="55" cy="120" rx="12" ry="10" fill={SKIN_COLOR}/>
        <ellipse cx="145" cy="120" rx="12" ry="10" fill={SKIN_COLOR}/>
    </svg>
);

// Lele Nublado - Entediada/sonolenta
const LeleCloudy: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Nuvens */}
        <ellipse cx="50" cy="35" rx="30" ry="18" fill="#94A3B8"/>
        <ellipse cx="150" cy="40" rx="35" ry="20" fill="#94A3B8"/>
        <circle cx="30" cy="40" r="15" fill="#94A3B8"/>
        <circle cx="170" cy="45" r="15" fill="#94A3B8"/>
        
        {/* Cabelo cacheado grande e volumoso */}
        <ellipse cx="100" cy="90" rx="55" ry="50" fill={HAIR_COLOR}/>
        {/* Cachos laterais caídos - esquerda */}
        <ellipse cx="48" cy="95" rx="18" ry="25" fill={HAIR_COLOR}/>
        <ellipse cx="45" cy="120" rx="15" ry="20" fill={HAIR_COLOR}/>
        <ellipse cx="50" cy="140" rx="12" ry="15" fill={HAIR_HIGHLIGHT}/>
        {/* Cachos laterais caídos - direita */}
        <ellipse cx="152" cy="95" rx="18" ry="25" fill={HAIR_COLOR}/>
        <ellipse cx="155" cy="120" rx="15" ry="20" fill={HAIR_COLOR}/>
        <ellipse cx="150" cy="140" rx="12" ry="15" fill={HAIR_HIGHLIGHT}/>
        {/* Cachos no topo */}
        <ellipse cx="70" cy="55" rx="16" ry="14" fill={HAIR_COLOR}/>
        <ellipse cx="100" cy="48" rx="18" ry="14" fill={HAIR_COLOR}/>
        <ellipse cx="130" cy="55" rx="16" ry="14" fill={HAIR_COLOR}/>
        <ellipse cx="65" cy="62" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="135" cy="62" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        
        {/* Rosto */}
        <ellipse cx="100" cy="110" rx="38" ry="40" fill={SKIN_COLOR}/>
        
        {/* Bochechas */}
        <ellipse cx="72" cy="120" rx="7" ry="4" fill={CHEEK_COLOR} opacity="0.5"/>
        <ellipse cx="128" cy="120" rx="7" ry="4" fill={CHEEK_COLOR} opacity="0.5"/>
        
        {/* Olhos sonolentos (semi-fechados) */}
        <path d="M 78 105 Q 85 110 92 105" stroke={EYE_COLOR} strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 108 105 Q 115 110 122 105" stroke={EYE_COLOR} strokeWidth="3" fill="none" strokeLinecap="round"/>
        
        {/* Boca (bocejo) */}
        <ellipse cx="100" cy="133" rx="10" ry="8" fill="#E88B8B"/>
        <ellipse cx="100" cy="131" rx="6" ry="5" fill="#1a1a1a"/>
        
        {/* Corpo relaxado */}
        <path d="M 68 150 Q 58 170 55 200 L 145 200 Q 142 170 132 150 Z" fill={DRESS_PRIMARY}/>
        
        {/* Braço apoiando queixo */}
        <ellipse cx="140" cy="135" rx="10" ry="8" fill={SKIN_COLOR}/>
        <rect x="135" y="135" width="15" height="40" rx="5" fill={SKIN_COLOR}/>
        
        {/* ZZZ dormindo */}
        <text x="155" y="90" fill="#64748B" fontSize="14" fontWeight="bold">Z</text>
        <text x="165" y="80" fill="#64748B" fontSize="12" fontWeight="bold">z</text>
        <text x="173" y="72" fill="#64748B" fontSize="10" fontWeight="bold">z</text>
    </svg>
);

// Lele Parcialmente Nublado - Normal/contente
const LelePartlyCloudy: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sol parcial */}
        <circle cx="160" cy="35" r="25" fill="#FFD93D"/>
        <g stroke="#FFD93D" strokeWidth="3" strokeLinecap="round">
            <line x1="160" y1="5" x2="160" y2="12"/>
            <line x1="185" y1="35" x2="192" y2="35"/>
            <line x1="180" y1="15" x2="185" y2="10"/>
            <line x1="180" y1="55" x2="185" y2="60"/>
        </g>
        
        {/* Nuvem cobrindo parte do sol */}
        <ellipse cx="140" cy="50" rx="35" ry="22" fill="#E2E8F0"/>
        <circle cx="115" cy="55" r="18" fill="#E2E8F0"/>
        
        {/* Cabelo cacheado grande e volumoso */}
        <ellipse cx="100" cy="95" rx="55" ry="50" fill={HAIR_COLOR}/>
        {/* Cachos laterais caídos - esquerda */}
        <ellipse cx="48" cy="100" rx="18" ry="25" fill={HAIR_COLOR}/>
        <ellipse cx="45" cy="125" rx="15" ry="20" fill={HAIR_COLOR}/>
        <ellipse cx="50" cy="145" rx="12" ry="15" fill={HAIR_HIGHLIGHT}/>
        {/* Cachos laterais caídos - direita */}
        <ellipse cx="152" cy="100" rx="18" ry="25" fill={HAIR_COLOR}/>
        <ellipse cx="155" cy="125" rx="15" ry="20" fill={HAIR_COLOR}/>
        <ellipse cx="150" cy="145" rx="12" ry="15" fill={HAIR_HIGHLIGHT}/>
        {/* Cachos no topo */}
        <ellipse cx="70" cy="58" rx="16" ry="14" fill={HAIR_COLOR}/>
        <ellipse cx="100" cy="50" rx="18" ry="14" fill={HAIR_COLOR}/>
        <ellipse cx="130" cy="58" rx="16" ry="14" fill={HAIR_COLOR}/>
        <ellipse cx="65" cy="65" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="135" cy="65" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        
        {/* Rosto */}
        <ellipse cx="100" cy="113" rx="36" ry="38" fill={SKIN_COLOR}/>
        
        {/* Bochechas */}
        <ellipse cx="73" cy="123" rx="7" ry="4" fill={CHEEK_COLOR} opacity="0.6"/>
        <ellipse cx="127" cy="123" rx="7" ry="4" fill={CHEEK_COLOR} opacity="0.6"/>
        
        {/* Olhos normais felizes */}
        <ellipse cx="85" cy="110" rx="6" ry="7" fill="white"/>
        <ellipse cx="115" cy="110" rx="6" ry="7" fill="white"/>
        <circle cx="86" cy="111" r="4" fill={EYE_COLOR}/>
        <circle cx="116" cy="111" r="4" fill={EYE_COLOR}/>
        <circle cx="85" cy="109" r="1.5" fill="white"/>
        <circle cx="115" cy="109" r="1.5" fill="white"/>
        
        {/* Sorriso gentil */}
        <path d="M 88 130 Q 100 138 112 130" stroke={EYE_COLOR} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        
        {/* Corpo */}
        <path d="M 70 150 Q 60 170 55 200 L 145 200 Q 140 170 130 150 Z" fill={DRESS_PRIMARY}/>
        <path d="M 80 160 Q 100 167 120 160" stroke={DRESS_SECONDARY} strokeWidth="2" fill="none"/>
        
        {/* Mãos juntas */}
        <ellipse cx="100" cy="175" rx="15" ry="10" fill={SKIN_COLOR}/>
    </svg>
);

// Lele Garoa - Com capuz e expressão "meh"
const LeleDrizzle: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Gotinhas pequenas */}
        <circle cx="35" cy="30" r="3" fill="#60A5FA" opacity="0.5"/>
        <circle cx="55" cy="45" r="2" fill="#60A5FA" opacity="0.5"/>
        <circle cx="160" cy="35" r="3" fill="#60A5FA" opacity="0.5"/>
        <circle cx="175" cy="50" r="2" fill="#60A5FA" opacity="0.5"/>
        <circle cx="25" cy="55" r="2" fill="#60A5FA" opacity="0.5"/>
        
        {/* Capuz */}
        <path d="M 45 70 Q 40 40 100 35 Q 160 40 155 70 Q 155 110 145 130 L 55 130 Q 45 110 45 70" fill="#87CEEB"/>
        <path d="M 55 60 Q 100 50 145 60" stroke="#6CB4D9" strokeWidth="2" fill="none"/>
        
        {/* Cabelo cacheado saindo do capuz - cachos caídos nas laterais */}
        <ellipse cx="55" cy="130" rx="14" ry="18" fill={HAIR_COLOR}/>
        <ellipse cx="52" cy="148" rx="12" ry="15" fill={HAIR_COLOR}/>
        <ellipse cx="58" cy="160" rx="10" ry="12" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="145" cy="130" rx="14" ry="18" fill={HAIR_COLOR}/>
        <ellipse cx="148" cy="148" rx="12" ry="15" fill={HAIR_COLOR}/>
        <ellipse cx="142" cy="160" rx="10" ry="12" fill={HAIR_HIGHLIGHT}/>
        
        {/* Rosto dentro do capuz */}
        <ellipse cx="100" cy="100" rx="35" ry="35" fill={SKIN_COLOR}/>
        
        {/* Bochechas */}
        <ellipse cx="75" cy="108" rx="6" ry="4" fill={CHEEK_COLOR} opacity="0.5"/>
        <ellipse cx="125" cy="108" rx="6" ry="4" fill={CHEEK_COLOR} opacity="0.5"/>
        
        {/* Olhos (expressão neutra/meh) */}
        <ellipse cx="85" cy="95" rx="5" ry="6" fill="white"/>
        <ellipse cx="115" cy="95" rx="5" ry="6" fill="white"/>
        <circle cx="85" cy="96" r="3" fill={EYE_COLOR}/>
        <circle cx="115" cy="96" r="3" fill={EYE_COLOR}/>
        
        {/* Boca reta (expressão meh) */}
        <line x1="90" y1="118" x2="110" y2="118" stroke={EYE_COLOR} strokeWidth="2.5" strokeLinecap="round"/>
        
        {/* Corpo com moletom */}
        <path d="M 60 130 Q 50 155 50 195 L 150 195 Q 150 155 140 130 Z" fill="#87CEEB"/>
        <ellipse cx="100" cy="160" rx="20" ry="12" fill="#6CB4D9"/>
        
        {/* Mãos no bolso do moletom */}
        <ellipse cx="80" cy="165" rx="8" ry="6" fill={SKIN_COLOR}/>
        <ellipse cx="120" cy="165" rx="8" ry="6" fill={SKIN_COLOR}/>
    </svg>
);

// Lele Nevada - Toda agasalhada com cachecol
const LeleSnowy: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Flocos de neve */}
        <text x="30" y="40" fill="#E2E8F0" fontSize="16">❄</text>
        <text x="160" y="35" fill="#E2E8F0" fontSize="14">❄</text>
        <text x="50" y="60" fill="#E2E8F0" fontSize="12">❄</text>
        <text x="170" y="55" fill="#E2E8F0" fontSize="10">❄</text>
        <text x="25" y="70" fill="#E2E8F0" fontSize="10">❄</text>
        
        {/* Gorro */}
        <ellipse cx="100" cy="45" rx="40" ry="25" fill="#FF6B9D"/>
        <ellipse cx="100" cy="60" rx="45" ry="12" fill="#FF8FB1"/>
        <circle cx="100" cy="25" r="12" fill="white"/>
        
        {/* Cabelo cacheado saindo do gorro - cachos caídos nas laterais */}
        <ellipse cx="55" cy="78" rx="16" ry="20" fill={HAIR_COLOR}/>
        <ellipse cx="52" cy="98" rx="14" ry="18" fill={HAIR_COLOR}/>
        <ellipse cx="58" cy="115" rx="11" ry="14" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="145" cy="78" rx="16" ry="20" fill={HAIR_COLOR}/>
        <ellipse cx="148" cy="98" rx="14" ry="18" fill={HAIR_COLOR}/>
        <ellipse cx="142" cy="115" rx="11" ry="14" fill={HAIR_HIGHLIGHT}/>
        
        {/* Rosto */}
        <ellipse cx="100" cy="100" rx="35" ry="35" fill={SKIN_COLOR}/>
        
        {/* Nariz vermelho de frio */}
        <circle cx="100" cy="105" r="5" fill="#E88B8B"/>
        
        {/* Bochechas rosadas */}
        <ellipse cx="75" cy="108" rx="8" ry="5" fill={CHEEK_COLOR} opacity="0.7"/>
        <ellipse cx="125" cy="108" rx="8" ry="5" fill={CHEEK_COLOR} opacity="0.7"/>
        
        {/* Olhos felizes (curtindo a neve) */}
        <path d="M 80 95 Q 85 88 90 95" stroke={EYE_COLOR} strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 110 95 Q 115 88 120 95" stroke={EYE_COLOR} strokeWidth="3" fill="none" strokeLinecap="round"/>
        
        {/* Sorriso */}
        <path d="M 88 120 Q 100 130 112 120" stroke={EYE_COLOR} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        
        {/* Cachecol */}
        <path d="M 55 125 Q 75 140 100 135 Q 125 140 145 125" fill="#98FB98"/>
        <rect x="130" y="130" width="15" height="50" rx="5" fill="#98FB98"/>
        <line x1="132" y1="140" x2="143" y2="140" stroke="#7DD87D" strokeWidth="2"/>
        <line x1="132" y1="150" x2="143" y2="150" stroke="#7DD87D" strokeWidth="2"/>
        <line x1="132" y1="160" x2="143" y2="160" stroke="#7DD87D" strokeWidth="2"/>
        
        {/* Corpo com casaco */}
        <path d="M 60 140 Q 50 165 50 195 L 150 195 Q 150 165 140 140 Z" fill="#4A90A4"/>
        <line x1="100" y1="140" x2="100" y2="190" stroke="#3D7A8C" strokeWidth="2"/>
        <circle cx="100" cy="155" r="4" fill="#FFD93D"/>
        <circle cx="100" cy="175" r="4" fill="#FFD93D"/>
    </svg>
);

// Lele Neblina - Misteriosa/curiosa
const LeleFoggy: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Neblina */}
        <rect x="0" y="20" width="200" height="15" rx="7" fill="#CBD5E1" opacity="0.4"/>
        <rect x="10" y="45" width="180" height="12" rx="6" fill="#CBD5E1" opacity="0.3"/>
        <rect x="5" y="65" width="190" height="10" rx="5" fill="#CBD5E1" opacity="0.2"/>
        
        {/* Cabelo cacheado grande e volumoso */}
        <ellipse cx="100" cy="95" rx="55" ry="50" fill={HAIR_COLOR}/>
        {/* Cachos laterais caídos - esquerda */}
        <ellipse cx="48" cy="100" rx="18" ry="25" fill={HAIR_COLOR}/>
        <ellipse cx="45" cy="125" rx="15" ry="20" fill={HAIR_COLOR}/>
        <ellipse cx="50" cy="145" rx="12" ry="15" fill={HAIR_HIGHLIGHT}/>
        {/* Cachos laterais caídos - direita */}
        <ellipse cx="152" cy="100" rx="18" ry="25" fill={HAIR_COLOR}/>
        <ellipse cx="155" cy="125" rx="15" ry="20" fill={HAIR_COLOR}/>
        <ellipse cx="150" cy="145" rx="12" ry="15" fill={HAIR_HIGHLIGHT}/>
        {/* Cachos no topo */}
        <ellipse cx="70" cy="58" rx="16" ry="14" fill={HAIR_COLOR}/>
        <ellipse cx="100" cy="50" rx="18" ry="14" fill={HAIR_COLOR}/>
        <ellipse cx="130" cy="58" rx="16" ry="14" fill={HAIR_COLOR}/>
        <ellipse cx="65" cy="65" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        <ellipse cx="135" cy="65" rx="8" ry="6" fill={HAIR_HIGHLIGHT}/>
        
        {/* Rosto */}
        <ellipse cx="100" cy="113" rx="36" ry="38" fill={SKIN_COLOR}/>
        
        {/* Bochechas */}
        <ellipse cx="73" cy="123" rx="6" ry="4" fill={CHEEK_COLOR} opacity="0.5"/>
        <ellipse cx="127" cy="123" rx="6" ry="4" fill={CHEEK_COLOR} opacity="0.5"/>
        
        {/* Olhos curiosos (olhando pro lado) */}
        <ellipse cx="85" cy="110" rx="7" ry="8" fill="white"/>
        <ellipse cx="115" cy="110" rx="7" ry="8" fill="white"/>
        <circle cx="88" cy="110" r="4" fill={EYE_COLOR}/>
        <circle cx="118" cy="110" r="4" fill={EYE_COLOR}/>
        <circle cx="87" cy="108" r="1.5" fill="white"/>
        <circle cx="117" cy="108" r="1.5" fill="white"/>
        
        {/* Sobrancelha levantada (curiosa) */}
        <path d="M 108 100 Q 115 97 122 101" stroke={HAIR_COLOR} strokeWidth="2" fill="none"/>
        
        {/* Boca (pensativa) */}
        <path d="M 95 130 Q 100 128 105 130" stroke={EYE_COLOR} strokeWidth="2" fill="none" strokeLinecap="round"/>
        
        {/* Corpo */}
        <path d="M 70 150 Q 60 170 55 200 L 145 200 Q 140 170 130 150 Z" fill={DRESS_PRIMARY}/>
        
        {/* Mão na frente tentando ver */}
        <ellipse cx="55" cy="125" rx="12" ry="10" fill={SKIN_COLOR}/>
        <path d="M 50 120 L 35 110" stroke={SKIN_COLOR} strokeWidth="8" strokeLinecap="round"/>
        
        {/* Mais neblina na frente */}
        <rect x="0" y="175" width="200" height="15" rx="7" fill="#CBD5E1" opacity="0.3"/>
        <rect x="15" y="190" width="170" height="10" rx="5" fill="#CBD5E1" opacity="0.2"/>
    </svg>
);

// Mapa de componentes
const leleMascotMap: Record<WeatherIconType, React.FC<{ className?: string }>> = {
    sunny: LeleSunny,
    cloudy: LeleCloudy,
    rainy: LeleRainy,
    thunderstorm: LeleThunderstorm,
    partlyCloudy: LelePartlyCloudy,
    drizzle: LeleDrizzle,
    snowy: LeleSnowy,
    foggy: LeleFoggy,
};

// Tamanhos
const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
};

// Componente principal
export const LeleMascot: React.FC<LeleMascotProps> = ({ 
    weather, 
    className = '',
    size = 'lg'
}) => {
    const MascotComponent = leleMascotMap[weather] || LelePartlyCloudy;
    const sizeClass = sizeMap[size];
    
    return (
        <div className={`${sizeClass} ${className} transition-all duration-500 ease-in-out`}>
            <MascotComponent className="w-full h-full drop-shadow-lg" />
        </div>
    );
};

// Componente com animação
export const LeleMascotAnimated: React.FC<LeleMascotProps> = (props) => {
    return (
        <div className="animate-bounce-slow">
            <LeleMascot {...props} />
            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default LeleMascot;
