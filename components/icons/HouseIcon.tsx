import Svg, { Defs, LinearGradient, RadialGradient, Stop, G, Path, Circle, Ellipse, Rect, Line } from 'react-native-svg';

interface Props {
  size?: number;
}

export default function HouseIcon({ size = 92 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 400 400">
        <Defs>
          <RadialGradient id="h-skin2" cx="32%" cy="24%" r="90%">
            <Stop offset="0%" stopColor="#FFE7C7" />
            <Stop offset="55%" stopColor="#F5C795" />
            <Stop offset="100%" stopColor="#D89A61" />
          </RadialGradient>
          <RadialGradient id="h-hair2" cx="35%" cy="15%" r="100%">
            <Stop offset="0%" stopColor="#8A6C55" />
            <Stop offset="60%" stopColor="#5B4636" />
            <Stop offset="100%" stopColor="#382719" />
          </RadialGradient>
          <RadialGradient id="h-torso2" cx="28%" cy="12%" r="100%">
            <Stop offset="0%" stopColor="#7DE8DD" />
            <Stop offset="35%" stopColor="#2ABFBF" />
            <Stop offset="75%" stopColor="#1A6FD4" />
            <Stop offset="100%" stopColor="#0D4FA0" />
          </RadialGradient>
          <RadialGradient id="h-limb2" cx="30%" cy="12%" r="110%">
            <Stop offset="0%" stopColor="#9DF0E6" />
            <Stop offset="55%" stopColor="#3FD0C9" />
            <Stop offset="100%" stopColor="#1A9A9A" />
          </RadialGradient>
          <RadialGradient id="h-pants2" cx="30%" cy="8%" r="110%">
            <Stop offset="0%" stopColor="#4A8FE0" />
            <Stop offset="55%" stopColor="#164A96" />
            <Stop offset="100%" stopColor="#082C5C" />
          </RadialGradient>
          <LinearGradient id="h-broom2" x1="0" y1="0" x2="1" y2="0.3">
            <Stop offset="0%" stopColor="#EFC583" />
            <Stop offset="100%" stopColor="#A66E32" />
          </LinearGradient>
        </Defs>
        <Ellipse cx="196" cy="348" rx="140" ry="17" fill="#08132A" opacity="0.26" />
        <G>
          <Rect x="0" y="0" width="14" height="145" rx="7" fill="url(#h-broom2)" transform="translate(148 195) rotate(35)" />
          <G transform="translate(83 305) rotate(35)">
            <Ellipse cx="0" cy="30" rx="36" ry="9" fill="#08132A" opacity="0.2" />
            <Path d="M-34 0 C-34 -14 -14 -22 0 -22 C14 -22 34 -14 34 0 L30 34 C18 44 -18 44 -30 34 Z" fill="#F3D48A" />
            <Path d="M-34 0 C-34 -14 -14 -22 0 -22 C14 -22 34 -14 34 0" fill="#FCE9BC" opacity="0.6" />
            <Line x1="-26" y1="2" x2="-30" y2="34" stroke="#C9932F" strokeWidth="2.5" opacity="0.6" />
            <Line x1="-10" y1="4" x2="-11" y2="38" stroke="#C9932F" strokeWidth="2.5" opacity="0.6" />
            <Line x1="8" y1="4" x2="10" y2="38" stroke="#C9932F" strokeWidth="2.5" opacity="0.6" />
            <Line x1="24" y1="2" x2="29" y2="34" stroke="#C9932F" strokeWidth="2.5" opacity="0.6" />
            <Rect x="-16" y="-10" width="32" height="14" rx="4" fill="#5B4636" />
            <Rect x="-16" y="-10" width="32" height="5" rx="2.5" fill="#7C5A42" opacity="0.6" />
          </G>
          <Path d="M20 330 Q40 320 60 326" stroke="#B9C2D0" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.55" />
          <Path d="M14 312 Q34 302 52 308" stroke="#B9C2D0" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4" />
        </G>
        <Ellipse cx="252" cy="316" rx="22" ry="8" fill="#08132A" opacity="0.18" />
        <G transform="translate(226 254) rotate(18)">
          <Rect x="-15" y="0" width="30" height="66" rx="15" fill="url(#h-pants2)" />
        </G>
        <Ellipse cx="252" cy="322" rx="20" ry="11" fill="#1C2733" />
        <Ellipse cx="247" cy="318" rx="7" ry="3" fill="#4A5566" opacity="0.7" />
        <Ellipse cx="176" cy="324" rx="22" ry="8" fill="#08132A" opacity="0.18" />
        <G transform="translate(190 254) rotate(-10)">
          <Rect x="-15" y="0" width="30" height="70" rx="15" fill="url(#h-pants2)" />
        </G>
        <Ellipse cx="176" cy="330" rx="20" ry="11" fill="#1C2733" />
        <Ellipse cx="170" cy="326" rx="7" ry="3" fill="#4A5566" opacity="0.7" />
        <G transform="translate(238 156) rotate(18)">
          <Rect x="-14" y="0" width="28" height="66" rx="14" fill="url(#h-limb2)" />
        </G>
        <Circle cx="252" cy="216" r="15" fill="url(#h-skin2)" />
        <Ellipse cx="205" cy="258" rx="48" ry="12" fill="#08132A" opacity="0.14" />
        <Path d="M163 152 C163 138 182 126 205 126 C228 126 247 138 247 152 L250 236 C250 253 230 262 205 262 C180 262 160 253 160 236 Z" fill="url(#h-torso2)" />
        <Path d="M163 152 C163 138 182 126 205 126 C228 126 247 138 247 152" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2" />
        <Rect x="186" y="198" width="38" height="30" rx="9" fill="#EAFBF8" opacity="0.9" />
        <Path d="M186 210 h38" stroke="#1A9A9A" strokeWidth="2" opacity="0.4" />
        <Ellipse cx="240" cy="230" rx="10" ry="24" fill="#062B57" opacity="0.2" />
        <Ellipse cx="177" cy="158" rx="14" ry="8" fill="#062B57" opacity="0.25" />
        <G transform="translate(172 152) rotate(35)">
          <Rect x="-14" y="0" width="28" height="80" rx="14" fill="url(#h-limb2)" />
        </G>
        <Circle cx="148" cy="197" r="16" fill="url(#h-skin2)" />
        <Ellipse cx="205" cy="148" rx="26" ry="8" fill="#062B57" opacity="0.16" />
        <Circle cx="205" cy="110" r="37" fill="url(#h-skin2)" />
        <Path d="M168 106 C165 78 184 62 205 62 C226 62 245 80 242 108 C238 92 224 80 205 82 C188 80 174 90 168 106 Z" fill="url(#h-hair2)" />
        <Path d="M168 106 C165 78 184 62 205 62 C226 62 245 80 242 108" fill="none" stroke="#B79A7E" strokeOpacity="0.4" strokeWidth="1.5" />
        <Circle cx="192" cy="112" r="3.4" fill="#3A2A1F" />
        <Circle cx="216" cy="112" r="3.4" fill="#3A2A1F" />
        <Path d="M195 126 Q205 132 215 126" stroke="#B9713F" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
        <Ellipse cx="188" cy="120" rx="8" ry="5" fill="#F2A97E" opacity="0.6" />
        <Ellipse cx="222" cy="120" rx="8" ry="5" fill="#F2A97E" opacity="0.6" />
        <Ellipse cx="192" cy="94" rx="14" ry="9" fill="#FFF3E0" opacity="0.55" />
    </Svg>
  );
}
