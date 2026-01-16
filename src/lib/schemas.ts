import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;

export const BoardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(50, 'Name is too long'),
});
export type BoardInput = z.infer<typeof BoardSchema>;

export const ColumnSchema = z.object({
  title: z
    .string()
    .min(1, 'Column title is required')
    .max(50, 'Title is too long'),
});
export type ColumnInput = z.infer<typeof ColumnSchema>;

export const TaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(255, 'Title is too long'),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
});
export type TaskInput = z.infer<typeof TaskSchema>;

export const EventSchema = z.object({
  title: z
    .string()
    .min(1, 'Event title is required')
    .max(100, 'Title is too long'),
  description: z.string().optional(),
  location: z.string().optional(),
  time: z.string().optional(), // We'll validate date logic separately or refine this
  allDay: z.boolean().optional(),
});
export type EventInput = z.infer<typeof EventSchema>;
