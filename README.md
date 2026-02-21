# URL → Image Generator

Turn any website into a beautiful image using modern AI. Open‑source and self‑hostable.

## Technologies

- **Firecrawl**: Website content extraction
- **Google Gemini 2.5 Flash**: AI prompt generation (streaming)
- **Google Imagen 4**: Image generation via Fal.ai
- **NextAuth + Resend**: Passwordless email sign‑in
- **Upstash Redis**: Auth adapter + rate limiting

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcodeme-ne%2FGemini-Image-und-Prompt&env=FIRECRAWL_API_KEY,GEMINI_API_KEY,FAL_KEY,UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN,AUTH_RESEND_KEY,EMAIL_FROM,STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,STRIPE_PRICE_STARTER,STRIPE_PRICE_CREATOR,STRIPE_PRICE_PRO&envDescription=API%20keys%20required%20to%20run%20this%20application)

## Setup

### Required Environment Variables

| Service | Purpose | Env | Get Key |
|---------|---------|-----|---------|
| Firecrawl | Website content extraction | `FIRECRAWL_API_KEY` | https://www.firecrawl.dev/app/api-keys |
| Google Gemini | Prompt generation | `GEMINI_API_KEY` or `GOOGLE_API_KEY` | https://aistudio.google.com/apikey |
| Fal.ai | Imagen 4 access | `FAL_KEY` | https://fal.ai/dashboard/keys |
| Upstash Redis | Auth adapter + rate limiting | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | https://upstash.com |
| Resend | Email provider for NextAuth | `AUTH_RESEND_KEY`, `EMAIL_FROM` | https://resend.com |
| Stripe | Credit packs + webhook | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` | https://dashboard.stripe.com/apikeys |

### Quick Start

1. Clone this repository
2. Create a `.env.local` file with your environment variables:
   ```
   FIRECRAWL_API_KEY=your_firecrawl_key
   GEMINI_API_KEY=your_gemini_key
   FAL_KEY=your_fal_key

   # For production - enables rate limiting (50 req/IP/day per endpoint)
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token

   # Authentication (NextAuth + Resend)
   AUTH_RESEND_KEY=re_...
   EMAIL_FROM=hello@example.com
   # For production URLs
   # NEXTAUTH_URL=https://your-domain.com

   # Stripe (credit packs + webhook)
   STRIPE_SECRET_KEY=sk_live_or_test
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_STARTER=price_...
   STRIPE_PRICE_CREATOR=price_...
   STRIPE_PRICE_PRO=price_...
   # Optional: override default credits per pack
   # CREDITS_STARTER=20
   # CREDITS_CREATOR=60
   # CREDITS_PRO=200
   ```
3. Install dependencies: `npm install` or `yarn install`
4. Run the development server: `npm run dev` or `yarn dev`

## Security & Usage Limits

- **Rate limiting**: 50 requests/IP/day per endpoint (production, Upstash)
- **Credits**: 1 credit = 1 image; first‑time users get 1 free credit
- **Daily cap**: 100 images per user per day

## Billing & Credits

- Stripe Checkout for one‑time credit packs (Starter, Creator, Pro)
- Stripe webhook credits the user after `checkout.session.completed`
- Up to 3 regenerations per prompt (1 initial + 3)

## How It Works

Enter a website URL → Extract content with Firecrawl → Generate prompt with Gemini 2.5 Flash → Select style → Create image with Imagen 4 → Download

### Built-in Image Styles

The app ships with several preset style prompts (click “View Prompt” in Step 2):

- GHIBLI
- LEGO
- CLAYMATION
- Clean vector art illustration Logo
- Whimsical illustration
- traditional Sumi-e ink wash style

## Open Source

This project is open-source: https://github.com/codeme-ne/Gemini-Image-und-Prompt

## License

MIT
