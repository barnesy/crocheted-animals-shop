# Crocheted Animals Shop

A simple, modern website for taking orders for handmade crocheted animals.

## Overview

This project is a lightweight, fast, and maintainable e-commerce solution built with the Jamstack architecture. It's designed to be easy to update, cost-free to host, and provide a delightful user experience for customers browsing and ordering handmade crocheted animals.

## Tech Stack

- **Frontend Framework**: [Astro](https://astro.build/) - Fast, content-focused, minimal JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Content Management**: Markdown/JSON files (git-based, simple to update)
- **Forms**: Netlify Forms or Formspree (email notifications)
- **Hosting**: Netlify or Vercel (free tier with automatic deployments)
- **Payments**: Manual invoicing initially, Stripe integration for Phase 2

## Why This Stack?

- ✅ Zero hosting costs (free hosting tiers)
- ✅ No database needed initially
- ✅ Excellent performance (static site generation)
- ✅ Easy content updates (edit markdown files, commit, auto-deploy)
- ✅ Mobile-responsive by design
- ✅ Scalable (can add database, payments, admin panel later)
- ✅ SEO-friendly
- ✅ Low maintenance

## Site Structure

```
/
├── Home
│   ├── Hero section with featured animal
│   ├── About snippet
│   └── Call-to-action buttons
├── Gallery
│   ├── Grid of all available animals
│   ├── Filters (animal type, price range)
│   └── Search functionality
├── Product Details
│   ├── Image gallery
│   ├── Description & specifications
│   ├── Pricing
│   └── Add to order form
├── Custom Orders
│   └── Form for custom requests
├── About
│   ├── Story & craftsmanship
│   └── Process overview
└── Contact
    └── General inquiries form
```

## MVP Features (Phase 1)

1. **Product Gallery**
   - Display all crocheted animals with photos
   - Filter by category (bears, bunnies, dinosaurs, etc.)
   - Filter by price range
   - Responsive grid layout

2. **Product Details**
   - High-quality images (multiple angles)
   - Detailed descriptions
   - Dimensions and materials
   - Care instructions

3. **Order Form**
   - Product selection with quantity
   - Customer information (name, email, phone)
   - Shipping address
   - Special instructions field
   - Email confirmation to customer
   - Email notification to seller

4. **Custom Order Requests**
   - Form for special requests
   - Description field
   - Color preferences
   - Size preferences

5. **Responsive Design**
   - Mobile-first approach
   - Touch-friendly interface
   - Fast loading times

6. **Image Optimization**
   - Automatic compression
   - Lazy loading
   - Responsive images

## Phase 2 Enhancements

- **Payment Integration**: Stripe for online payments
- **Order Tracking**: Customer portal to check order status
- **Admin Dashboard**: Manage orders, update inventory
- **Customer Accounts**: Save addresses, view order history
- **Inventory Management**: Track available items
- **Photo Upload**: Allow custom order photos from customers
- **Email Automation**: Order confirmations, shipping notifications
- **Analytics**: Track popular items, conversion rates

## Data Model

### Product
```json
{
  "id": "unique-id",
  "name": "Cuddly Bear",
  "slug": "cuddly-bear",
  "description": "Adorable handmade crocheted bear...",
  "price": 45.00,
  "images": [
    "/images/products/bear-1.jpg",
    "/images/products/bear-2.jpg"
  ],
  "category": "bears",
  "materials": ["100% cotton yarn", "polyester filling", "safety eyes"],
  "dimensions": {
    "height": "12 inches",
    "width": "8 inches"
  },
  "customizable": true,
  "available": true,
  "featured": false,
  "createdAt": "2025-01-15"
}
```

### Order (Future - Phase 2)
```json
{
  "id": "order-123",
  "timestamp": "2025-01-20T10:30:00Z",
  "customer": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "555-1234"
  },
  "shipping": {
    "address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62701",
    "country": "USA"
  },
  "items": [
    {
      "productId": "cuddly-bear",
      "quantity": 2,
      "price": 45.00
    }
  ],
  "total": 90.00,
  "specialInstructions": "Please use blue yarn for one bear",
  "status": "pending"
}
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/barnesy/crocheted-animals-shop.git
cd crocheted-animals-shop
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:4321`

### Adding Products

Products are stored as Markdown files in `src/content/products/`. To add a new product:

1. Create a new `.md` file in `src/content/products/`
2. Add the frontmatter with product details:

```markdown
---
name: "Your Animal Name"
price: 45.00
category: "Category Name"
featured: false
available: true
images:
  - /images/products/your-animal-1.jpg
  - /images/products/your-animal-2.jpg
materials:
  - Material 1
  - Material 2
dimensions:
  height: "12 inches"
  width: "8 inches"
customizable: true
createdAt: "2025-01-15"
---

Write your product description here in Markdown format.
```

3. Add product images to `public/images/products/`
4. Commit and push - the site will auto-deploy!

### Replacing Placeholder Images

The site currently uses placeholder SVG images. To add real product photos:

1. Take high-quality photos of your crocheted animals (multiple angles recommended)
2. Optimize images for web (recommended size: 800x800px, under 200KB each)
3. Save images to `public/images/products/` with matching filenames
4. Images will automatically appear on the site

### Customizing Content

- **About Page**: Edit `src/pages/about.astro`
- **Contact Info**: Edit `src/layouts/BaseLayout.astro` (footer section)
- **Colors/Styling**: Edit `src/styles/global.css` or Tailwind classes
- **Site Title**: Edit `src/layouts/BaseLayout.astro`

## Deployment

### Deploy to Netlify (Recommended)

1. Push your code to GitHub
2. Sign up for a free account at [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Netlify will auto-detect Astro settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

Your site will be live in minutes! Netlify will:
- Auto-deploy on every git push
- Handle form submissions via Netlify Forms
- Provide a free `.netlify.app` domain
- Support custom domains (free)

### Configure Form Notifications

After deploying to Netlify:

1. Go to Site Settings → Forms
2. Set up form notifications to receive emails when customers submit orders
3. Configure notification email address
4. Enable spam filtering

### Custom Domain (Optional)

1. In Netlify dashboard: Domain settings → Add custom domain
2. Follow DNS configuration instructions
3. Free SSL certificate included automatically

## Project Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run astro --help # Show Astro CLI help
```

## License

MIT

## Contact

For questions or custom order inquiries, please use the contact form on the website.
