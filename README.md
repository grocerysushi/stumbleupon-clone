# StumbleClone - Discover the Web

A modern clone of StumbleUpon built with Next.js, TypeScript, and PostgreSQL. Discover interesting content from around the web with personalized recommendations and smart ranking algorithms.

## Features

- 🎯 **Smart Discovery**: Epsilon-greedy algorithm with personalized recommendations
- 📊 **Topic-Based Filtering**: Organize content by interests and topics
- 👍 **Feedback System**: Like, dislike, skip, and save functionality
- 📈 **Ranking Algorithm**: CTR-based scoring with recency decay
- 🔒 **Moderation**: Admin approval system and content flagging
- 📱 **Responsive Design**: Works on desktop and mobile
- 🚀 **Performance**: Built with Next.js and optimized for speed

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js (ready for OAuth)
- **Deployment**: Vercel-ready

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API endpoints
│   │   │   ├── stumble/    # Core discovery endpoint
│   │   │   ├── feedback/   # User feedback handling
│   │   │   ├── links/      # Link submission & management
│   │   │   └── topics/     # Topic management
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page with stumble UI
│   ├── components/         # Reusable React components
│   ├── lib/               # Utilities and database client
│   ├── types/             # TypeScript type definitions
│   └── styles/            # Global styles
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Sample data seeder
└── public/                # Static assets
```

## Database Schema

The app uses a PostgreSQL database with the following main entities:

- **Users**: User accounts and preferences
- **Links**: Submitted URLs with metadata and stats
- **Topics**: Categories for organizing content
- **Events**: User interactions (views, likes, etc.)
- **Collections**: User-created link collections

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone and Install

```bash
git clone https://github.com/grocerysushi/stumbleupon-clone.git
cd stumbleupon-clone
npm install
```

### 2. Database Setup

**✅ Already configured with Supabase!**

Your project is pre-configured with:
- **Supabase Project**: `https://afmxxuatqmnlaussywzh.supabase.co`
- **OpenAI API**: Ready for enhanced content processing
- **Vercel Deployment**: `stumbleupon-clone` project

Just copy `.env.example` to `.env.local` and set your Supabase database password:

```bash
cp .env.example .env.local
# Edit .env.local and replace YOUR_PASSWORD with your Supabase database password
```

### 3. One-Command Setup

```bash
npm run setup
```

This will:
- Install dependencies
- Generate Prisma client
- Test database connection
- Push schema to Supabase
- Seed with sample data

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your StumbleClone in action!

## 🚀 Quick Deploy to Vercel

Your project is ready for one-click deployment:

1. **Set Supabase password** (see DEPLOYMENT.md)
2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```
3. **Deploy automatically** via Vercel GitHub integration

Detailed deployment instructions in [DEPLOYMENT.md](DEPLOYMENT.md).

## API Endpoints

### Core Discovery

- `GET /api/stumble` - Get next link recommendation
  - Query params: `userId`, `topics` (comma-separated)
  - Returns: Single link with metadata and topics

### User Feedback

- `POST /api/feedback` - Record user interaction
  - Body: `{userId, linkId, action}`
  - Actions: `LIKE`, `DISLIKE`, `SKIP`, `SAVE`, `SHARE`

### Link Management

- `POST /api/links` - Submit new link
  - Body: `{url, userId, topics}`
  - Automatically fetches Open Graph metadata
- `GET /api/links` - List links (with filters)

### Topics

- `GET /api/topics` - List all topics
- `POST /api/topics` - Create new topic

## Ranking Algorithm

The discovery system uses a multi-factor scoring approach:

1. **Global CTR**: `likeCount / viewCount`
2. **Recency Decay**: 7-day exponential decay
3. **Domain Diversity**: Bonus for varied domains
4. **Epsilon-Greedy**: 85% exploit best, 15% explore random

```typescript
score = globalCtr * 0.4 + recencyScore * 0.3 + diversityBonus * 0.3
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Set up PostgreSQL (Neon, PlanetScale, or Supabase)
3. Configure environment variables
4. Deploy!

### Environment Variables

```env
DATABASE_URL=              # PostgreSQL connection string
NEXTAUTH_SECRET=           # Random secret for sessions
NEXTAUTH_URL=              # Your app URL
GOOGLE_CLIENT_ID=          # Optional: OAuth
GOOGLE_CLIENT_SECRET=      # Optional: OAuth
SAFE_BROWSING_API_KEY=     # Optional: Safety checks
```

## Development

### Database Operations

```bash
# View data in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Apply schema changes
npx prisma db push
```

### Adding New Features

1. **New API endpoint**: Create in `src/app/api/[name]/route.ts`
2. **Database changes**: Update `prisma/schema.prisma` and run `npx prisma db push`
3. **Frontend components**: Add to `src/components/`
4. **Types**: Define in `src/types/index.ts`

## Customization

### Ranking Algorithm

Modify the scoring weights in `src/app/api/stumble/route.ts`:

```typescript
const score = globalCtr * 0.4 + recencyScore * 0.3 + diversityBonus * 0.3
```

### UI Themes

Update colors in `tailwind.config.js`:

```javascript
colors: {
  stumble: {
    orange: '#eb6100',
    green: '#74ac00',
  }
}
```

### Topics

Add new topics via the API or directly in the seed file.

## Browser Extension

The project is ready for browser extension development:

```javascript
// Basic extension structure
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: 'https://yourdomain.com/api/stumble'
  });
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run typecheck`
5. Submit a pull request

## License

MIT License - feel free to use this project as a starting point for your own StumbleUpon-style discovery platform.

## Roadmap

- [ ] User authentication with OAuth
- [ ] Advanced personalization with embeddings
- [ ] Browser extension
- [ ] Mobile app with React Native
- [ ] Admin dashboard
- [ ] Content moderation tools
- [ ] A/B testing framework
- [ ] Analytics and metrics
- [ ] API rate limiting
- [ ] Caching layer (Redis)

## Support

- Check the GitHub issues for common problems
- Review the API documentation in the code comments
- Join our community discussions

---

Built with ❤️ for the open web. Happy stumbling!