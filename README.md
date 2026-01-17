# Focus

Focus is a refined, premium personal productivity dashboard crafted to bring clarity and momentum to your life. Combining the best principles of task management, habit tracking, and focused work sessions into a single, cohesive experience, Focus helps you stay organized and achieve your goals.

## Core Features

### 📊 Dashboard

A centralized command center for your day.

- **Unified Overview**: See your schedule, top tasks, and habit streaks in one glance.
- **Quick Actions**: Start a Pomodoro timer or jot down a journal entry instantly without context switching.

### 📋 Kanban Board

Visualize your workflow with a powerful, flexible board.

- **Drag & Drop**: Smooth, intuitive task management powered by `@dnd-kit`.
- **Customizable Columns**: Create workflows that fit your style (e.g., "To Do," "In Progress," "Review").
- **Priorities & Tags**: Organize tasks with "Low," "Medium," and "High" priority labels.

### 🔄 Habit Tracker **(New!)**

Build lasting consistency with a dedicated habits system.

- **Flexible Scheduling**: Track Daily, Weekly, or Monthly habits.
- **Visual Progress**: Beautiful 7-day micro-heatmaps on every card.
- **Celebratory Logic**: Reward your consistency with delightful confetti animations upon completion.
- **Atomic Reliability**: Robust data integrity ensuring you never lose a streak.
- **Rich Customization**: Choose from diverse color themes and icons (`lucide-react`).

### 🍅 Focus Timer (Pomodoro)

Master your attention span.

- **Customizable Intervals**: Default 25m Focus / 5m Break, fully adjustable.
- **Task Association**: Link sessions directly to specific Kanban tasks.
- **Audio Cues**: Gentle sounds to guide your flow states.

### 📅 Schedule

Plan your time effectively.

- **Calendar View**: A clear monthly grid to visualize deadlines and events.
- **Event Management**: Create, edit, and categorize appointments effortlessly.

### 📔 Journal

Capture your thoughts and reflections.

- **Markdown Support**: Write freely with rich text formatting.
- **Auto-Save**: Focus on writing; we handle the saving.

---

## Technical Stack

Built with a modern, type-safe stack designed for performance and developer experience.

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) - React Server Components & Server Actions.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - End-to-end type safety.
- **Database**: [PostgreSQL (Neon)](https://neon.tech/) - Serverless Postgres.
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - Lightweight and type-safe data access.
- **Auth**: [NextAuth.js (v5)](https://authjs.dev/) - Secure authentication with Google, GitHub, and Credentials.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS for rapid UI development.
- **Validation**: [Zod](https://zod.dev/) - Schema validation for reliable data handling.
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/).
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti).

---

## Workflow & Deployment

### GitHub Workflow

We utilize a feature-branch workflow to maintain code quality and stability.

1.  **Branching**: New features/fixes are developed on separate branches (e.g., `feature/habits-implementation`, `fix/login-bug`).
2.  **Commits**: We use semantic commit messages (e.g., `feat: add habit tracking`, `fix: resolve race condition`).
3.  **PR & Review**: Changes are pushed to GitHub and merged into `main` after verification.

### Deployment

The application is optimized for deployment on Vercel.

1.  **Push to Main**: Merging code into the `main` branch triggers an automatic production build.
2.  **Database Migrations**: Schema changes are managed via Drizzle Kit (`drizzle-kit push` or `migrate`).
3.  **Environment Variables**: Secure keys (`DATABASE_URL`, `AUTH_SECRET`, etc.) are managed in Vercel's project settings.

---

### Local Development

To run Focus locally:

1.  **Clone the repo**:

    ```bash
    git clone https://github.com/UnbiasedEagle/focus.git
    cd focus
    ```

2.  **Install Dependencies**:

    ```bash
    npm install
    ```

3.  **Setup Environment**:
    Create a `.env` file with your credentials (see `.env.example`).

4.  **Run Development Server**:

    ```bash
    npm run dev
    ```

5.  **View App**: Open [http://localhost:3000](http://localhost:3000).
