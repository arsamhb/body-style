import type { LucideProps } from 'lucide-react';
import { forwardRef } from 'react';
import {
  Anchor,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Bike,
  Box,
  Briefcase,
  Building,
  Building2,
  Calendar,
  Car,
  ChartBar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Clock,
  Cog,
  Coins,
  Compass,
  Copy,
  Cpu,
  Download,
  Droplet,
  ExternalLink,
  Eye,
  EyeOff,
  Factory,
  FileBadge,
  FileText,
  Filter,
  Flame,
  Folder,
  Gauge,
  Globe,
  GraduationCap,
  Hammer,
  Handshake,
  Headset,
  Heart,
  House,
  Image,
  Inbox,
  Info,
  Key,
  Languages,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  Leaf,
  LifeBuoy,
  Lightbulb,
  Link,
  List,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Medal,
  Menu,
  MessageCircle,
  MessageSquare,
  Minus,
  Monitor,
  Moon,
  Package,
  Palette,
  Pencil,
  Percent,
  Phone,
  Plane,
  Plus,
  Quote,
  RefreshCw,
  Rocket,
  Ruler,
  Scale,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Ship,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Sun,
  Tag,
  Target,
  Thermometer,
  Ticket,
  Trash2,
  Trophy,
  Truck,
  Upload,
  User,
  Users,
  Weight,
  Wind,
  Wrench,
  X,
  Zap,
} from 'lucide-react';

/** Lucide ships no brand icons; Instagram is drawn inline with the same props contract. */
const Instagram = forwardRef<SVGSVGElement, LucideProps>(function Instagram(
  { size = 24, strokeWidth = 2, absoluteStrokeWidth, color = 'currentColor', ...rest },
  ref
) {
  void absoluteStrokeWidth;
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
});

/**
 * Whitelist of icons the CMS may reference by name. Content stores the kebab-case key; rendering
 * goes through this map so arbitrary strings from the database can never resolve to code.
 * Extend the map to expose more icons to the panel's icon picker.
 */
export const ICONS = {
  anchor: Anchor,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-up-right': ArrowUpRight,
  award: Award,
  'badge-check': BadgeCheck,
  bike: Bike,
  box: Box,
  briefcase: Briefcase,
  building: Building,
  'building-2': Building2,
  calendar: Calendar,
  car: Car,
  'chart-bar': ChartBar,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-alert': CircleAlert,
  'circle-check': CircleCheck,
  'circle-help': CircleHelp,
  clock: Clock,
  cog: Cog,
  coins: Coins,
  compass: Compass,
  copy: Copy,
  cpu: Cpu,
  download: Download,
  droplet: Droplet,
  'external-link': ExternalLink,
  eye: Eye,
  'eye-off': EyeOff,
  factory: Factory,
  'file-badge': FileBadge,
  'file-text': FileText,
  filter: Filter,
  flame: Flame,
  folder: Folder,
  gauge: Gauge,
  globe: Globe,
  'graduation-cap': GraduationCap,
  hammer: Hammer,
  handshake: Handshake,
  headset: Headset,
  heart: Heart,
  house: House,
  image: Image,
  inbox: Inbox,
  info: Info,
  instagram: Instagram,
  key: Key,
  languages: Languages,
  'layout-dashboard': LayoutDashboard,
  'layout-grid': LayoutGrid,
  layers: Layers,
  leaf: Leaf,
  'life-buoy': LifeBuoy,
  lightbulb: Lightbulb,
  link: Link,
  list: List,
  lock: Lock,
  'log-out': LogOut,
  mail: Mail,
  'map-pin': MapPin,
  medal: Medal,
  menu: Menu,
  'message-circle': MessageCircle,
  'message-square': MessageSquare,
  minus: Minus,
  monitor: Monitor,
  moon: Moon,
  package: Package,
  palette: Palette,
  pencil: Pencil,
  percent: Percent,
  phone: Phone,
  plane: Plane,
  plus: Plus,
  quote: Quote,
  'refresh-cw': RefreshCw,
  rocket: Rocket,
  ruler: Ruler,
  scale: Scale,
  search: Search,
  send: Send,
  settings: Settings,
  shield: Shield,
  'shield-check': ShieldCheck,
  ship: Ship,
  'sliders-horizontal': SlidersHorizontal,
  smartphone: Smartphone,
  sparkles: Sparkles,
  star: Star,
  store: Store,
  sun: Sun,
  tag: Tag,
  target: Target,
  thermometer: Thermometer,
  ticket: Ticket,
  'trash-2': Trash2,
  trophy: Trophy,
  truck: Truck,
  upload: Upload,
  user: User,
  users: Users,
  weight: Weight,
  wind: Wind,
  wrench: Wrench,
  x: X,
  zap: Zap,
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export const isIconName = (name: unknown): name is IconName =>
  typeof name === 'string' && Object.prototype.hasOwnProperty.call(ICONS, name);

export interface IconByNameProps extends LucideProps {
  name: string;
  /** Rendered when `name` is not in the whitelist. Defaults to `sparkles`. */
  fallback?: IconName;
}

const IconByName = ({ name, fallback = 'sparkles', ...rest }: IconByNameProps) => {
  const Icon = isIconName(name) ? ICONS[name] : ICONS[fallback];
  return <Icon aria-hidden="true" focusable="false" {...rest} />;
};

export default IconByName;
