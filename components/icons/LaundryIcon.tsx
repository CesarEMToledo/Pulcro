import Svg, { Defs, LinearGradient, RadialGradient, Stop, ClipPath, G, Path, Circle, Ellipse, Rect } from 'react-native-svg';

interface Props {
  size?: number;
}

export default function LaundryIcon({ size = 92 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 400 400">
        <Defs>
          <RadialGradient id="lb-body" cx="28%" cy="22%" r="90%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="50%" stopColor="#F2F6FB" />
            <Stop offset="100%" stopColor="#C7D2E1" />
          </RadialGradient>
          <LinearGradient id="lb-ring" x1="0.1" y1="0.05" x2="0.95" y2="1">
            <Stop offset="0%" stopColor="#6FB1F7" />
            <Stop offset="45%" stopColor="#1A6FD4" />
            <Stop offset="100%" stopColor="#082C5C" />
          </LinearGradient>
          <RadialGradient id="lb-glass" cx="34%" cy="30%" r="80%">
            <Stop offset="0%" stopColor="#EAF6FF" />
            <Stop offset="35%" stopColor="#8FC3F5" />
            <Stop offset="75%" stopColor="#2E7FDE" />
            <Stop offset="100%" stopColor="#0E4A96" />
          </RadialGradient>
          <RadialGradient id="lb-basket" cx="30%" cy="14%" r="100%">
            <Stop offset="0%" stopColor="#8CF3E8" />
            <Stop offset="45%" stopColor="#22B8AF" />
            <Stop offset="100%" stopColor="#0B6663" />
          </RadialGradient>
          <LinearGradient id="lb-basket-rim" x1="0" y1="0" x2="1" y2="0.4">
            <Stop offset="0%" stopColor="#B4FBF2" />
            <Stop offset="100%" stopColor="#39C9BE" />
          </LinearGradient>
          <RadialGradient id="lb-cloth-w" cx="32%" cy="28%" r="85%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#C9D3E0" />
          </RadialGradient>
          <RadialGradient id="lb-cloth-o" cx="32%" cy="28%" r="85%">
            <Stop offset="0%" stopColor="#FFD37A" />
            <Stop offset="100%" stopColor="#E8930E" />
          </RadialGradient>
          <RadialGradient id="lb-cloth-b" cx="32%" cy="28%" r="85%">
            <Stop offset="0%" stopColor="#6FB1F7" />
            <Stop offset="100%" stopColor="#0D4FA0" />
          </RadialGradient>
          <ClipPath id="clip-glass2">
            <Circle cx="163" cy="216" r="62" />
          </ClipPath>
        </Defs>
        <Ellipse cx="205" cy="358" rx="150" ry="20" fill="#08132A" opacity="0.28" />
        <G>
          <Ellipse cx="313" cy="340" rx="58" ry="10" fill="#08132A" opacity="0.22" />
          <Path d="M256 246 L370 246 L353 336 Q311 349 268 336 Z" fill="url(#lb-basket)" />
          <Path d="M264 260 Q311 271 362 260" stroke="#DFFBF7" strokeOpacity="0.4" strokeWidth="3" fill="none" />
          <Path d="M261 282 Q311 294 365 282" stroke="#053E3C" strokeOpacity="0.28" strokeWidth="3" fill="none" />
          <Path d="M265 305 Q311 316 361 305" stroke="#DFFBF7" strokeOpacity="0.3" strokeWidth="3" fill="none" />
          <Ellipse cx="313" cy="247" rx="57" ry="14" fill="url(#lb-basket-rim)" />
          <Ellipse cx="313" cy="247" rx="57" ry="14" fill="none" stroke="#0B6663" strokeOpacity="0.35" strokeWidth="2" />
          <Ellipse cx="295" cy="242" rx="16" ry="5" fill="#FFFFFF" opacity="0.55" />
        </G>
        <G>
          <Ellipse cx="333" cy="240" rx="10" ry="14" fill="#08132A" opacity="0.18" />
          <Path d="M270 244 Q283 208 322 220 Q336 227 324 249 Q296 263 270 244 Z" fill="url(#lb-cloth-w)" />
          <Path d="M313 236 Q331 204 359 222 Q370 231 357 250 Q332 260 313 236 Z" fill="url(#lb-cloth-o)" />
          <Path d="M284 230 Q298 204 322 213 Q329 220 320 233 Q300 240 284 230 Z" fill="url(#lb-cloth-b)" />
          <Ellipse cx="288" cy="222" rx="8" ry="4" fill="#FFFFFF" opacity="0.5" />
        </G>
        <Rect x="83" y="290" width="17" height="17" rx="4" fill="#AEB9C9" />
        <Rect x="242" y="290" width="17" height="17" rx="4" fill="#AEB9C9" />
        <Ellipse cx="91" cy="309" rx="12" ry="4" fill="#08132A" opacity="0.2" />
        <Ellipse cx="250" cy="309" rx="12" ry="4" fill="#08132A" opacity="0.2" />
        <Rect x="56" y="64" width="208" height="232" rx="34" fill="url(#lb-body)" />
        <Rect x="56" y="64" width="208" height="232" rx="34" fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2" />
        <Path d="M62 280 L62 110 C62 90 78 76 96 72" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.55" fill="none" />
        <Path d="M258 100 L258 270" stroke="#9AA9C0" strokeWidth="10" strokeLinecap="round" opacity="0.25" fill="none" />
        <Rect x="80" y="86" width="164" height="30" rx="15" fill="#EDF1F7" />
        <Rect x="80" y="86" width="164" height="30" rx="15" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7" />
        <Circle cx="109" cy="101" r="9" fill="#1A6FD4" />
        <Circle cx="109" cy="98" r="3" fill="#FFFFFF" opacity="0.7" />
        <Circle cx="139" cy="101" r="9" fill="#2ABFBF" />
        <Circle cx="139" cy="98" r="3" fill="#FFFFFF" opacity="0.7" />
        <Circle cx="169" cy="101" r="9" fill="#00D4AA" />
        <Circle cx="169" cy="98" r="3" fill="#FFFFFF" opacity="0.7" />
        <Rect x="192" y="93" width="42" height="15" rx="7.5" fill="#D8E0EC" />
        <Ellipse cx="163" cy="290" rx="66" ry="14" fill="#08132A" opacity="0.15" />
        <Circle cx="163" cy="216" r="86" fill="url(#lb-ring)" />
        <Circle cx="163" cy="216" r="86" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2" />
        <Circle cx="163" cy="216" r="72" fill="#EEF2F7" />
        <Circle cx="163" cy="216" r="62" fill="url(#lb-glass)" />
        <G clipPath="url(#clip-glass2)" opacity="0.92">
          <Ellipse cx="140" cy="234" rx="28" ry="17" fill="#FFFFFF" opacity="0.5" transform="rotate(-18 140 234)" />
          <Ellipse cx="184" cy="208" rx="22" ry="13" fill="#FFC24D" opacity="0.6" transform="rotate(12 184 208)" />
          <Ellipse cx="172" cy="248" rx="19" ry="12" fill="#00D4AA" opacity="0.55" transform="rotate(-8 172 248)" />
          <Ellipse cx="200" cy="220" rx="14" ry="9" fill="#F25C7A" opacity="0.45" transform="rotate(20 200 220)" />
        </G>
        <G clipPath="url(#clip-glass2)">
          <Ellipse cx="132" cy="185" rx="40" ry="24" fill="#FFFFFF" opacity="0.55" transform="rotate(-28 132 185)" />
          <Ellipse cx="205" cy="255" rx="26" ry="14" fill="#062B57" opacity="0.35" transform="rotate(-20 205 255)" />
        </G>
        <Circle cx="163" cy="216" r="62" fill="none" stroke="#0A3D80" strokeOpacity="0.4" strokeWidth="3" />
        <Path d="M110 175 A72 72 0 0 1 210 155" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.45" fill="none" />
    </Svg>
  );
}
