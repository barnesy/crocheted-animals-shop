# Architecture & Technical Design

## Design Philosophy

**Keep It Simple, Ship Fast, Iterate Later**

This project follows a progressive enhancement approach:
1. Start with the simplest solution that works
2. Deploy quickly and get feedback
3. Add complexity only when needed
4. Prioritize maintainability over premature optimization

## Architecture Pattern: Jamstack

**Jamstack** = JavaScript + APIs + Markup

### Why Jamstack?

- **Performance**: Pre-rendered static pages serve instantly
- **Security**: No server, no database = reduced attack surface
- **Scalability**: Static files scale effortlessly via CDN
- **Developer Experience**: Modern tooling, git-based workflow
- **Cost**: Free hosting, no infrastructure to manage

## Technology Decisions

### 1. Astro vs Next.js vs Plain HTML

**Winner: Astro**

**Reasoning:**
- Content-focused (perfect for product catalog)
- Ships zero JavaScript by default (faster)
- Simpler than Next.js for static sites
- Component-based but not framework-locked
- Built-in image optimization
- Great DX with hot module reloading

**Trade-offs:**
- Less ecosystem than Next.js
- Fewer "batteries included" features
- Acceptable because we don't need SPA features

### 2. Styling: Tailwind CSS

**Reasoning:**
- Rapid prototyping with utility classes
- Smaller CSS bundle (purges unused styles)
- Responsive design made easy
- Customizable design system
- No context switching (HTML + CSS in one place)

**Alternatives Considered:**
- Plain CSS: Too slow for development
- CSS Modules: Unnecessary complexity
- Styled Components: Requires React runtime

### 3. Content Management: File-Based CMS

**Phase 1: Markdown + JSON Files**

**Structure:**
```
/src/content/
├── products/
│   ├── cuddly-bear.md
│   ├── floppy-bunny.md
│   └── ...
└── config/
    └── categories.json
```

**Example Product File:**
```markdown
---
title: "Cuddly Bear"
price: 45.00
category: "bears"
featured: true
images:
  - /images/products/bear-front.jpg
  - /images/products/bear-side.jpg
materials:
  - 100% cotton yarn
  - Polyester filling
  - Safety eyes
dimensions:
  height: "12 inches"
  width: "8 inches"
available: true
---

Handcrafted with love, this adorable bear is perfect for cuddling...
```

**Benefits:**
- Version controlled with git
- Easy to edit (just text files)
- No CMS dashboard needed
- Fast to query (Astro Content Collections)
- Can migrate to headless CMS later without changing frontend

**Phase 2: Upgrade to Sanity/Contentful (Optional)**

Only if non-technical users need to manage content.

### 4. Forms: Netlify Forms → API Routes

**Phase 1: Netlify Forms**

```html
<form name="order" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="order" />
  <!-- form fields -->
</form>
```

**Benefits:**
- Zero configuration
- Email notifications built-in
- Spam protection included
- Free tier: 100 submissions/month

**Phase 2: Custom API Route (if needed)**

```javascript
// /api/orders.js
export async function POST({ request }) {
  const data = await request.json();

  // Validate input
  // Store in Supabase
  // Send email via SendGrid/Resend
  // Return confirmation

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 5. Database: None → Supabase

**Phase 1: No Database**
- Forms send emails
- Seller manages orders manually

**Phase 2: Supabase (Postgres)**

**Why Supabase:**
- Free tier: 500MB database, 50MB file storage
- Real-time subscriptions (for order tracking)
- Built-in authentication
- Row-level security
- RESTful API + PostgreSQL
- Can self-host if needed

**Schema:**
```sql
-- Products (can still use files, or migrate to DB)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images JSONB,
  category TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Custom Order Requests
CREATE TABLE custom_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  description TEXT NOT NULL,
  preferences JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Payments: Manual → Stripe

**Phase 1: Manual Processing**
- Customer submits order via form
- Seller sends invoice via email/PayPal/Venmo
- Simple and trustworthy for handmade goods

**Phase 2: Stripe Integration**

```javascript
// /api/create-checkout.js
import Stripe from 'stripe';

export async function POST({ request }) {
  const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
  const { items } = await request.json();

  const session = await stripe.checkout.sessions.create({
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${import.meta.env.PUBLIC_URL}/success`,
    cancel_url: `${import.meta.env.PUBLIC_URL}/cancel`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

**Benefits:**
- Industry standard
- Built-in fraud protection
- Supports multiple payment methods
- Handles taxes and invoicing

### 7. Hosting: Netlify or Vercel

Both excellent, slight differences:

**Netlify:**
- Better for form handling (built-in)
- Netlify Functions for serverless
- Generous free tier

**Vercel:**
- Faster edge network
- Better Next.js integration (not relevant here)
- Vercel Functions for serverless

**Winner: Netlify** (due to built-in forms for Phase 1)

## Project Structure

```
crocheted-animals-shop/
├── src/
│   ├── components/
│   │   ├── ProductCard.astro
│   │   ├── ProductGrid.astro
│   │   ├── OrderForm.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ...
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ProductLayout.astro
│   ├── pages/
│   │   ├── index.astro (Home)
│   │   ├── gallery.astro
│   │   ├── products/
│   │   │   └── [slug].astro
│   │   ├── custom-order.astro
│   │   ├── about.astro
│   │   └── contact.astro
│   ├── content/
│   │   ├── products/
│   │   │   ├── cuddly-bear.md
│   │   │   └── ...
│   │   └── config.ts
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       ├── formatPrice.ts
│       └── validators.ts
├── public/
│   ├── images/
│   │   ├── products/
│   │   └── hero/
│   └── favicon.ico
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── README.md
```

## Performance Targets

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: < 200KB (JS + CSS)
- **Image Optimization**: WebP format, lazy loading

## Security Considerations

1. **Input Validation**
   - Sanitize all form inputs
   - Use schema validation (Zod)
   - Rate limiting on API routes

2. **XSS Prevention**
   - Astro escapes HTML by default
   - Never use `dangerouslySetInnerHTML` equivalent

3. **HTTPS Only**
   - Enforced by Netlify/Vercel
   - HSTS headers

4. **Environment Variables**
   - Never commit secrets
   - Use `.env.local` (gitignored)
   - Access via `import.meta.env`

5. **GDPR Compliance**
   - Privacy policy
   - Cookie consent (if using analytics)
   - Data retention policy
   - Right to deletion

## Accessibility (a11y)

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus indicators
- Color contrast ratios (WCAG AA)
- Alt text for all images
- Screen reader testing

## SEO Strategy

- Static generation = SEO-friendly by default
- Meta tags (title, description, OG tags)
- Sitemap generation
- Robots.txt
- Structured data (JSON-LD for products)
- Fast load times (ranking factor)

## Development Workflow

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy
git push origin main  # Auto-deploys via Netlify/Vercel
```

## Migration Path (Future)

If the business grows significantly:

1. **Phase 1** (Current): Static site + forms
2. **Phase 2**: Add Supabase for order management
3. **Phase 3**: Add Stripe for payments
4. **Phase 4**: Add authentication for customer accounts
5. **Phase 5**: Admin dashboard for inventory management
6. **Phase 6**: Consider custom backend if needs exceed Jamstack

Each phase is optional and triggered by actual business needs, not speculation.

## Key Principles

1. **Progressive Enhancement**: Site works without JavaScript
2. **Mobile-First**: Design for small screens, enhance for desktop
3. **Performance Budget**: Monitor and optimize continuously
4. **Accessibility First**: Build for everyone
5. **Data Ownership**: Keep data portable and platform-agnostic
6. **Cost-Conscious**: Optimize for free/cheap tiers

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| High order volume exceeds form limits | Medium | Upgrade to API + database early |
| Payment fraud | High | Use Stripe's built-in fraud detection |
| Image storage costs | Low | Optimize images, use Cloudinary free tier |
| Site performance degrades | Medium | Implement monitoring, set budgets |
| Manual order management becomes overwhelming | High | Build admin dashboard in Phase 2 |

## Conclusion

This architecture balances simplicity, cost-effectiveness, and scalability. It allows for rapid deployment and iteration while maintaining a clear path for growth. The key is to resist over-engineering and add complexity only when justified by real user needs.
