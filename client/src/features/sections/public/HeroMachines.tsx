const LegExtension = () => (
  <svg viewBox="0 0 360 360" className="hero-machine hero-machine--extension" aria-hidden="true">
    <g className="hero-machine__glow">
      <path d="M48 316h257M66 316V77q0-24 24-24h73q24 0 24 24v135" />
      <path d="M83 296V82q0-11 11-11h56q12 0 12 12v126" />
      <path d="M105 72v132M126 72v132M147 72v132" className="hero-machine__detail" />
      <path d="M68 296h115v20H68z" />
      <path d="M79 259h73v37H79zM84 246h63v13M90 233h51v13M96 220h39v13" />

      <path d="M154 208h89q12 0 12 12v15H143v-16q0-11 11-11Z" className="hero-machine__surface" />
      <path d="m174 208 21-117q3-17 20-14l27 5q15 3 12 19l-22 107" />
      <path d="M259 107h25v111M272 124h24M272 142h24" />
      <path d="M245 235h43v81M221 316h91" />

      <circle cx="175" cy="239" r="18" className="hero-machine__joint" />
      <circle cx="175" cy="239" r="6" />
      <g className="hero-machine__leg-arm">
        <path d="M175 239 138 287" />
        <path
          d="M110 274h53q10 0 10 10v17q0 10-10 10h-53q-10 0-10-10v-17q0-10 10-10Z"
          className="hero-machine__surface"
        />
        <path d="M128 311v12M104 323h51" />
      </g>
    </g>
    <circle cx="175" cy="239" r="28" className="hero-machine__pulse" />
  </svg>
);

const BenchPress = () => (
  <svg viewBox="0 0 330 255" className="hero-machine hero-machine--press" aria-hidden="true">
    <g className="hero-machine__glow">
      <path d="m80 218 38-126M250 218 212 92M57 218h72M218 218h70" />
      <path d="m109 125 22 17 82-1 18-16" />
      <path d="m119 142 86-1 18 30-114 1Z" className="hero-machine__surface hero-machine__detail" />
      <path d="M88 119h40M202 119h40M101 104h18M211 104h18" />
      <g className="hero-machine__press-bar">
        <path d="M54 76h221" />
        <path d="M40 68v16M54 58v36M72 51v50M258 51v50M276 58v36M290 68v16" />
        <circle cx="101" cy="76" r="9" className="hero-machine__joint" />
        <circle cx="229" cy="76" r="9" className="hero-machine__joint" />
      </g>
    </g>
  </svg>
);

const CableMachine = () => (
  <svg viewBox="0 0 270 300" className="hero-machine hero-machine--cable" aria-hidden="true">
    <g className="hero-machine__glow">
      <path d="M42 267h196M58 267V57q0-18 18-18h71q18 0 18 18v210M76 246V63q0-8 8-8h55q8 0 8 8v183" />
      <path d="M94 56v130M112 56v130M130 56v130" className="hero-machine__detail" />
      <path d="M80 246h76" />
      <g className="hero-machine__weight-stack">
        <path d="M87 229h63v17H87zM91 212h55v17H91zM95 195h47v17H95z" />
        <circle cx="135" cy="220" r="3" className="hero-machine__pin" />
      </g>
      <path d="M165 91h47M212 91v176M197 267h52" />
      <circle cx="187" cy="91" r="9" className="hero-machine__joint" />
      <path d="M187 91v66" className="hero-machine__cable-line" />
      <g className="hero-machine__handle">
        <path d="M187 157v19M166 176h42" />
        <path d="m166 176-8 13M208 176l8 13" />
      </g>
      <path d="M177 215h42v14h-42zM198 229v38" className="hero-machine__detail" />
    </g>
  </svg>
);

const HeroMachines = () => (
  <div className="hero-machines" aria-hidden="true">
    <div className="hero-machines__halo" />
    <div className="hero-machines__orbit hero-machines__orbit--one" />
    <div className="hero-machines__orbit hero-machines__orbit--two" />
    <div className="hero-machines__platform" />
    <LegExtension />
    <BenchPress />
    <CableMachine />
    <span className="hero-machines__spark hero-machines__spark--one" />
    <span className="hero-machines__spark hero-machines__spark--two" />
    <span className="hero-machines__spark hero-machines__spark--three" />
    <span className="hero-machines__readout">03 / ACTIVE</span>
  </div>
);

export default HeroMachines;
