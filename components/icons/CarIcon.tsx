import Svg, { Defs, LinearGradient, RadialGradient, Stop, G, Path, Circle, Ellipse, Rect } from 'react-native-svg';

interface Props {
  size?: number;
}

export default function CarIcon({ size = 92 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 400 400">
        <Defs>
          <RadialGradient id="c-skin2" cx="32%" cy="24%" r="90%">
            <Stop offset="0%" stopColor="#FFE7C7" />
            <Stop offset="55%" stopColor="#F5C795" />
            <Stop offset="100%" stopColor="#D89A61" />
          </RadialGradient>
          <RadialGradient id="c-hair2" cx="35%" cy="15%" r="100%">
            <Stop offset="0%" stopColor="#8A6C55" />
            <Stop offset="60%" stopColor="#5B4636" />
            <Stop offset="100%" stopColor="#382719" />
          </RadialGradient>
          <RadialGradient id="c-torso2" cx="28%" cy="12%" r="100%">
            <Stop offset="0%" stopColor="#8FC4F5" />
            <Stop offset="40%" stopColor="#4A90E2" />
            <Stop offset="80%" stopColor="#1A6FD4" />
            <Stop offset="100%" stopColor="#0D4FA0" />
          </RadialGradient>
          <RadialGradient id="c-limb2" cx="30%" cy="12%" r="110%">
            <Stop offset="0%" stopColor="#B7D9F7" />
            <Stop offset="55%" stopColor="#6FA8EA" />
            <Stop offset="100%" stopColor="#3A7BCE" />
          </RadialGradient>
          <RadialGradient id="c-pants2" cx="30%" cy="8%" r="110%">
            <Stop offset="0%" stopColor="#4A8FE0" />
            <Stop offset="55%" stopColor="#164A96" />
            <Stop offset="100%" stopColor="#082C5C" />
          </RadialGradient>
          <RadialGradient id="c-body2" cx="30%" cy="15%" r="100%">
            <Stop offset="0%" stopColor="#A9D0FA" />
            <Stop offset="35%" stopColor="#5BA0EA" />
            <Stop offset="75%" stopColor="#1A6FD4" />
            <Stop offset="100%" stopColor="#0A3D80" />
          </RadialGradient>
          <LinearGradient id="c-glass2" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F5FAFF" />
            <Stop offset="100%" stopColor="#A9D0FA" />
          </LinearGradient>
          <RadialGradient id="c-wheel2" cx="34%" cy="30%" r="75%">
            <Stop offset="0%" stopColor="#5C6B80" />
            <Stop offset="60%" stopColor="#2E3846" />
            <Stop offset="100%" stopColor="#12161D" />
          </RadialGradient>
          <RadialGradient id="c-sponge2" cx="30%" cy="20%" r="100%">
            <Stop offset="0%" stopColor="#FEF0BE" />
            <Stop offset="60%" stopColor="#F9D25A" />
            <Stop offset="100%" stopColor="#E0A420" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="230" cy="336" rx="180" ry="18" fill="#08132A" opacity="0.25" />
        <Path d="M136 262 L136 233 C136 218 149 209 167 206 L204 182 C219 172 239 167 259 167 L326 167 C341 167 353 174 361 186 L374 207 C388 210 397 218 397 231 L397 262 Z" fill="url(#c-body2)" />
        <Path d="M136 262 L136 233 C136 218 149 209 167 206 L204 182 C219 172 239 167 259 167" fill="none" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2.5" />
        <Path d="M397 231 L397 262 L360 262 C368 248 375 232 374 207" fill="#062B57" opacity="0.18" />
        <Path d="M175 204 L208 186 C221 177 238 172 255 172 L257 205 Z" fill="url(#c-glass2)" />
        <Path d="M263 172 L322 172 C334 172 344 178 350 188 L361 205 L263 205 Z" fill="url(#c-glass2)" />
        <Rect x="257" y="172" width="6" height="33" fill="#0A3D80" opacity="0.4" />
        <Path d="M180 202 L206 188" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        <Path d="M259 207 L259 262" stroke="#0A3D80" strokeWidth="2" opacity="0.3" />
        <Rect x="284" y="222" width="20" height="7" rx="3.5" fill="#EAF4FF" opacity="0.9" />
        <Ellipse cx="386" cy="224" rx="9" ry="12" fill="#FFF6DD" />
        <Ellipse cx="384" cy="221" rx="4" ry="5" fill="#FFFFFF" opacity="0.8" />
        <Rect x="136" y="252" width="261" height="10" fill="#062B57" opacity="0.22" />
        <Ellipse cx="178" cy="290" rx="30" ry="8" fill="#08132A" opacity="0.2" />
        <Ellipse cx="356" cy="290" rx="30" ry="8" fill="#08132A" opacity="0.2" />
        <Circle cx="178" cy="264" r="28" fill="url(#c-wheel2)" />
        <Circle cx="178" cy="264" r="13" fill="#C6CFDC" />
        <Circle cx="178" cy="264" r="4" fill="#6B7686" />
        <Circle cx="170" cy="256" r="5" fill="#FFFFFF" opacity="0.35" />
        <Circle cx="356" cy="264" r="28" fill="url(#c-wheel2)" />
        <Circle cx="356" cy="264" r="13" fill="#C6CFDC" />
        <Circle cx="356" cy="264" r="4" fill="#6B7686" />
        <Circle cx="348" cy="256" r="5" fill="#FFFFFF" opacity="0.35" />
        <Circle cx="205" cy="230" r="12" fill="#FFFFFF" opacity="0.8" />
        <Circle cx="222" cy="215" r="7" fill="#FFFFFF" opacity="0.7" />
        <Circle cx="190" cy="212" r="6" fill="#FFFFFF" opacity="0.65" />
        <Circle cx="215" cy="243" r="5" fill="#FFFFFF" opacity="0.6" />
        <Circle cx="201" cy="226" r="4" fill="#DCEFFF" opacity="0.9" />
        <Ellipse cx="118" cy="318" rx="21" ry="7" fill="#08132A" opacity="0.16" />
        <G transform="translate(108 258) rotate(10)">
          <Rect x="-14" y="0" width="28" height="62" rx="14" fill="url(#c-pants2)" />
        </G>
        <Ellipse cx="118" cy="322" rx="19" ry="10" fill="#1C2733" />
        <Ellipse cx="60" cy="320" rx="21" ry="7" fill="#08132A" opacity="0.16" />
        <G transform="translate(76 258) rotate(-8)">
          <Rect x="-14" y="0" width="28" height="64" rx="14" fill="url(#c-pants2)" />
        </G>
        <Ellipse cx="60" cy="324" rx="19" ry="10" fill="#1C2733" />
        <G transform="translate(62 160) rotate(-14)">
          <Rect x="-13" y="0" width="26" height="56" rx="13" fill="url(#c-limb2)" />
        </G>
        <Circle cx="52" cy="210" r="14" fill="url(#c-skin2)" />
        <Ellipse cx="90" cy="256" rx="44" ry="11" fill="#08132A" opacity="0.14" />
        <Path d="M50 156 C50 143 68 132 90 132 C112 132 130 143 130 156 L133 234 C133 250 114 258 90 258 C66 258 47 250 47 234 Z" fill="url(#c-torso2)" />
        <Path d="M50 156 C50 143 68 132 90 132 C112 132 130 143 130 156" fill="none" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="2" />
        <Rect x="72" y="200" width="36" height="28" rx="8" fill="#EAF4FF" opacity="0.85" />
        <G transform="translate(120 165) rotate(28)">
          <Rect x="-13" y="0" width="26" height="72" rx="13" fill="url(#c-limb2)" />
        </G>
        <Circle cx="171" cy="222" r="14" fill="url(#c-skin2)" />
        <G transform="translate(184 220) rotate(20)">
          <Ellipse cx="0" cy="18" rx="22" ry="6" fill="#08132A" opacity="0.15" />
          <Rect x="-20" y="-14" width="40" height="28" rx="10" fill="url(#c-sponge2)" stroke="#C98A16" strokeWidth="1.5" />
          <Path d="M-12 -6 h24 M-12 0 h24 M-12 6 h24" stroke="#C98A16" strokeWidth="2" opacity="0.5" />
          <Ellipse cx="-8" cy="-8" rx="7" ry="4" fill="#FFFFFF" opacity="0.5" />
        </G>
        <Ellipse cx="90" cy="154" rx="24" ry="7" fill="#062B57" opacity="0.14" />
        <Circle cx="90" cy="116" r="36" fill="url(#c-skin2)" />
        <Path d="M55 112 C52 85 71 68 90 68 C111 68 129 86 126 113 C122 97 109 86 90 88 C74 86 61 96 55 112 Z" fill="url(#c-hair2)" />
        <Path d="M55 112 C52 85 71 68 90 68 C111 68 129 86 126 113" fill="none" stroke="#B79A7E" strokeOpacity="0.4" strokeWidth="1.5" />
        <Circle cx="78" cy="118" r="3.3" fill="#3A2A1F" />
        <Circle cx="101" cy="118" r="3.3" fill="#3A2A1F" />
        <Path d="M81 132 Q90 138 99 132" stroke="#B9713F" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
        <Ellipse cx="74" cy="126" rx="7" ry="4.5" fill="#F2A97E" opacity="0.6" />
        <Ellipse cx="106" cy="126" rx="7" ry="4.5" fill="#F2A97E" opacity="0.6" />
        <Ellipse cx="78" cy="100" rx="13" ry="8" fill="#FFF3E0" opacity="0.55" />
    </Svg>
  );
}
