'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HabitSchema, type HabitInput } from '@/lib/schemas';
import { createHabit } from '@/actions/habits';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Loader2,
  Plus,
  // Health & Fitness
  Dumbbell,
  Heart,
  Activity,
  Footprints,
  Bike,
  Apple,
  Moon,
  // Food & Drink
  Coffee,
  Utensils,
  GlassWater,
  Beer,
  Pizza,
  Carrot,
  // Productivity
  Zap,
  Target,
  CheckCircle,
  Clock,
  Calendar,
  BookOpen,
  Crosshair,
  // Tech & Work
  Laptop,
  Code,
  Briefcase,
  Wifi,
  Monitor,
  Keyboard,
  Smartphone,
  Server,
  // Finance
  DollarSign,
  CreditCard,
  PiggyBank,
  Wallet,
  TrendingUp,
  BarChart,
  // Creativity
  Palette,
  Music,
  Camera,
  PenTool,
  Lightbulb,
  Image,
  // Social & Family
  Users,
  MessageCircle,
  Phone,
  Home,
  Gift,
  // Nature & Travel
  Sun,
  Cloud,
  Plane,
  Map,
  Mountain,
  Trees,
  Umbrella,
  // Home & Lifestyle
  Bed,
  Bath,
  Sofa,
  ShoppingCart,
  Tag,
  // Other
  Star,
  Flag,
  Smile,
  Ghost,
  Skull,
  Trophy,
  LucideIcon,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Helper to flatten icons for easy lookup
const ALL_ICONS: Record<string, LucideIcon> = {
  // Health
  dumbbell: Dumbbell,
  heart: Heart,
  activity: Activity,
  footprints: Footprints,
  bike: Bike,
  apple: Apple,
  moon: Moon,
  // Food
  coffee: Coffee,
  utensils: Utensils,
  glasswater: GlassWater,
  beer: Beer,
  pizza: Pizza,
  carrot: Carrot,
  // Productivity
  zap: Zap,
  target: Target,
  checkcircle: CheckCircle,
  clock: Clock,
  calendar: Calendar,
  bookopen: BookOpen,
  crosshair: Crosshair,
  // Tech
  laptop: Laptop,
  code: Code,
  briefcase: Briefcase,
  wifi: Wifi,
  monitor: Monitor,
  keyboard: Keyboard,
  smartphone: Smartphone,
  server: Server,
  // Finance
  dollarsign: DollarSign,
  creditcard: CreditCard,
  piggybank: PiggyBank,
  wallet: Wallet,
  trendingup: TrendingUp,
  barchart: BarChart,
  // Creativity
  palette: Palette,
  music: Music,
  camera: Camera,
  pentool: PenTool,
  lightbulb: Lightbulb,
  image: Image,
  // Social
  users: Users,
  messagecircle: MessageCircle,
  phone: Phone,
  home: Home,
  gift: Gift,
  // Nature
  sun: Sun,
  cloud: Cloud,
  plane: Plane,
  map: Map,
  mountain: Mountain,
  trees: Trees,
  umbrella: Umbrella,
  // Home
  bed: Bed,
  bath: Bath,
  sofa: Sofa,
  shoppingcart: ShoppingCart,
  tag: Tag,
  // Other
  star: Star,
  flag: Flag,
  smile: Smile,
  ghost: Ghost,
  skull: Skull,
  trophy: Trophy,
};

const ICON_CATEGORIES = [
  {
    name: 'Health & Fitness',
    icons: [
      'dumbbell',
      'heart',
      'activity',
      'footprints',
      'bike',
      'apple',
      'moon',
    ],
  },
  {
    name: 'Food & Drink',
    icons: ['coffee', 'utensils', 'glasswater', 'beer', 'pizza', 'carrot'],
  },
  {
    name: 'Productivity',
    icons: [
      'zap',
      'target',
      'checkcircle',
      'clock',
      'calendar',
      'bookopen',
      'crosshair',
    ],
  },
  {
    name: 'Tech & Work',
    icons: [
      'laptop',
      'code',
      'briefcase',
      'wifi',
      'monitor',
      'keyboard',
      'smartphone',
      'server',
    ],
  },
  {
    name: 'Finance',
    icons: [
      'dollarsign',
      'creditcard',
      'piggybank',
      'wallet',
      'trendingup',
      'barchart',
    ],
  },
  {
    name: 'Creativity',
    icons: ['palette', 'music', 'camera', 'pentool', 'lightbulb', 'image'],
  },
  {
    name: 'Social & Family',
    icons: ['users', 'heart', 'messagecircle', 'phone', 'home', 'gift'],
  },
  {
    name: 'Nature & Travel',
    icons: ['sun', 'cloud', 'plane', 'map', 'mountain', 'trees', 'umbrella'],
  },
  {
    name: 'Home & Lifestyle',
    icons: ['home', 'bed', 'bath', 'sofa', 'shoppingcart', 'tag'],
  },
  {
    name: 'Other',
    icons: ['star', 'flag', 'smile', 'ghost', 'skull', 'trophy'],
  },
];

const COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
];

interface CreateHabitDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateHabitDialog({
  children,
  open,
  onOpenChange,
}: CreateHabitDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Handle controlled vs uncontrolled state
  const show = open !== undefined ? open : isOpen;
  const setShow = onOpenChange || setIsOpen;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HabitInput>({
    resolver: zodResolver(HabitSchema),
    defaultValues: {
      frequency: 'Daily',
      icon: 'zap',
      color: 'bg-indigo-500',
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  const onSubmit = async (data: HabitInput) => {
    try {
      await createHabit(data);
      toast.success('Habit created successfully');
      setShow(false);
      reset();
    } catch (error) {
      toast.error('Failed to create habit');
      console.error(error);
    }
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant='indigo'
            size='sm'
            className='gap-2'
            suppressHydrationWarning
          >
            <Plus className='h-4 w-4' />
            New Habit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>
            Build a new habit and track your consistency.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              placeholder='e.g. Read 30 mins'
              {...register('title')}
            />
            {errors.title && (
              <p className='text-xs text-red-500'>{errors.title.message}</p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='description'>Description (Optional)</Label>
            <Textarea
              id='description'
              placeholder='Add details about your habit...'
              {...register('description')}
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='frequency'>Frequency</Label>
            <Select
              onValueChange={(val) =>
                setValue('frequency', val as 'Daily' | 'Weekly' | 'Monthly')
              }
              defaultValue='Daily'
            >
              <SelectTrigger>
                <SelectValue placeholder='Select frequency' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Daily'>Daily</SelectItem>
                <SelectItem value='Weekly'>Weekly</SelectItem>
                <SelectItem value='Monthly'>Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label>Icon</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full justify-start gap-2 h-10 px-3'
                  >
                    {(() => {
                      const iconKey = selectedIcon?.toLowerCase() || 'zap';
                      const IconComp = ALL_ICONS[iconKey] || Zap;
                      return <IconComp className='h-4 w-4' />;
                    })()}
                    <span className='capitalize'>{selectedIcon}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[340px] p-0' align='start'>
                  <ScrollArea className='h-[300px] p-4'>
                    <div className='space-y-4'>
                      {ICON_CATEGORIES.map((category) => (
                        <div key={category.name}>
                          <h4 className='text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2'>
                            {category.name}
                          </h4>
                          <div className='grid grid-cols-6 gap-2'>
                            {category.icons.map((iconName) => {
                              const Icon = ALL_ICONS[iconName];
                              if (!Icon) return null;
                              return (
                                <Button
                                  key={iconName}
                                  type='button'
                                  variant={
                                    selectedIcon === iconName
                                      ? 'default'
                                      : 'ghost'
                                  }
                                  size='icon'
                                  className='h-9 w-9'
                                  onClick={() => setValue('icon', iconName)}
                                  title={iconName}
                                >
                                  <Icon className='h-4 w-4' />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>

            <div className='grid gap-2'>
              <Label>Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full justify-start gap-2 h-10 px-3'
                  >
                    <div
                      className={cn('h-4 w-4 rounded-full', selectedColor)}
                    />
                    <span>Theme</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-64 p-2'>
                  <div className='grid grid-cols-5 gap-2'>
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type='button'
                        className={cn(
                          'h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none ring-2 ring-transparent focus:ring-offset-2 focus:ring-zinc-400',
                          c,
                          selectedColor === c && 'ring-zinc-900 ring-offset-2'
                        )}
                        onClick={() => setValue('color', c)}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type='submit' disabled={isSubmitting} variant='indigo'>
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Create Habit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
