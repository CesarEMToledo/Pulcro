import Svg, { Defs, LinearGradient, RadialGradient, Stop, G, Path, Ellipse, Rect } from 'react-native-svg';

interface Props {
  size?: number;
}

export default function GarmentsIcon({ size = 92 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 400 400">
        <Defs>
          <RadialGradient id="g-brim2" cx="30%" cy="15%" r="100%">
            <Stop offset="0%" stopColor="#F3D19C" />
            <Stop offset="45%" stopColor="#DDA35C" />
            <Stop offset="100%" stopColor="#9C6A32" />
          </RadialGradient>
          <RadialGradient id="g-crown2" cx="32%" cy="18%" r="95%">
            <Stop offset="0%" stopColor="#F0CE96" />
            <Stop offset="50%" stopColor="#D19A55" />
            <Stop offset="100%" stopColor="#8A5D2C" />
          </RadialGradient>
          <LinearGradient id="g-band2" x1="0" y1="0" x2="1" y2="0.3">
            <Stop offset="0%" stopColor="#7CF2E6" />
            <Stop offset="100%" stopColor="#189690" />
          </LinearGradient>
          <RadialGradient id="g-sole2" cx="30%" cy="15%" r="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="60%" stopColor="#E2E8F0" />
            <Stop offset="100%" stopColor="#AAB6C6" />
          </RadialGradient>
          <RadialGradient id="g-upper2" cx="28%" cy="18%" r="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="55%" stopColor="#EAEFF5" />
            <Stop offset="100%" stopColor="#B9C4D3" />
          </RadialGradient>
          <LinearGradient id="g-swoosh2" x1="0" y1="0" x2="1" y2="0.4">
            <Stop offset="0%" stopColor="#5CEBDD" />
            <Stop offset="100%" stopColor="#159A90" />
          </LinearGradient>
        </Defs>
        <Ellipse cx="205" cy="335" rx="152" ry="18" fill="#08132A" opacity="0.25" />
        <G transform="rotate(-6 300 275)">
          <Ellipse cx="300" cy="308" rx="70" ry="10" fill="#08132A" opacity="0.15" />
          <Path d="M238 298 C238 308 246 314 258 314 L346 314 C362 314 372 308 372 298 C372 291 366 287 356 286 L250 286 C242 287 238 291 238 298 Z" fill="url(#g-sole2)" stroke="#9AA9C0" strokeWidth="1.5" />
          <Path d="M244 300 L366 300" stroke="#8695AC" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          <Path d="M242 288 C238 264 250 246 270 240 L302 232 C320 228 336 234 346 248 C356 260 364 272 366 284 C367 289 363 292 356 292 L252 292 C246 292 243 291 242 288 Z" fill="url(#g-upper2)" stroke="#CBD5E1" strokeWidth="1.5" />
          <Path d="M330 240 C346 246 358 262 363 280 C364 285 362 289 357 290 L322 290 C320 275 322 254 330 240 Z" fill="#B9C4D3" opacity="0.55" />
          <Path d="M276 240 L302 235 C308 248 309 262 305 274 L280 278 C278 264 276 251 276 240 Z" fill="#F8FAFC" stroke="#D7DEE8" strokeWidth="1.5" />
          <Path d="M281 245 L303 240" stroke="#159A90" strokeWidth="3.5" strokeLinecap="round" />
          <Path d="M279 255 L303 250" stroke="#159A90" strokeWidth="3.5" strokeLinecap="round" />
          <Path d="M279 265 L301 261" stroke="#159A90" strokeWidth="3.5" strokeLinecap="round" />
          <Path d="M248 282 C252 266 262 252 278 246" stroke="url(#g-swoosh2)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <Path d="M270 240 C282 236 296 234 302 232" stroke="#C3CEDC" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
          <Ellipse cx="260" cy="252" rx="16" ry="9" fill="#FFFFFF" opacity="0.6" transform="rotate(-25 260 252)" />
        </G>
        <G transform="rotate(-4 170 210)">
          <Ellipse cx="170" cy="248" rx="118" ry="18" fill="#08132A" opacity="0.16" />
          <Ellipse cx="170" cy="230" rx="114" ry="31" fill="url(#g-brim2)" />
          <Ellipse cx="170" cy="230" rx="114" ry="31" fill="none" stroke="#7A4F22" strokeOpacity="0.3" strokeWidth="1.5" />
          <Ellipse cx="150" cy="221" rx="70" ry="14" fill="#FBE6C4" opacity="0.55" />
          <Path d="M108 214 C104 220 106 226 118 226 C132 226 150 218 170 218 C190 218 208 226 222 226 C234 226 236 220 232 214 C227 172 210 138 170 138 C130 138 113 172 108 214 Z" fill="url(#g-crown2)" />
          <Path d="M108 214 C104 220 106 226 118 226 C132 226 150 218 170 218 C190 218 208 226 222 226 C234 226 236 220 232 214" fill="none" stroke="#6E481F" strokeOpacity="0.4" strokeWidth="1.5" />
          <Path d="M170 142 C167 156 175 164 174 176 C173 186 165 190 165 200 C165 208 171 214 170 220" stroke="#7A4F22" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" fill="none" />
          <Path d="M150 148 C144 164 140 180 140 196" stroke="#7A4F22" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" fill="none" />
          <Ellipse cx="140" cy="163" rx="20" ry="30" fill="#FBE6C4" opacity="0.5" />
          <Path d="M114 210 Q170 228 226 210 L226 199 Q170 217 114 199 Z" fill="url(#g-band2)" />
          <Path d="M114 210 Q170 228 226 210" fill="none" stroke="#0E5B56" strokeOpacity="0.3" strokeWidth="1.5" />
          <Rect x="157" y="195" width="26" height="19" rx="4" fill="#F5D98A" stroke="#B9803C" strokeWidth="1.5" />
          <Rect x="159" y="197" width="10" height="6" rx="2" fill="#FFFFFF" opacity="0.5" />
        </G>
    </Svg>
  );
}
