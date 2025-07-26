# OCR to Markdown

A Next.js application that converts images to Markdown using AI-powered OCR through Together.ai.

## Features

- 🖼️ Upload images with text content
- 🤖 AI-powered OCR using Together.ai's vision models
- 📝 Convert extracted text to clean Markdown
- 💾 Save OCR history (authenticated users)
- 📱 Responsive design with Tailwind CSS
- 🔐 Authentication with Clerk
- 📊 File uploads with UploadThing

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma
- **OCR**: Together.ai (Llama Vision)
- **File Upload**: UploadThing
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret key
- `TOGETHER_API_KEY`: Together.ai API key
- `UPLOADTHING_SECRET`: UploadThing secret
- `UPLOADTHING_APP_ID`: UploadThing app ID

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## API Endpoints

- `POST /api/ocr` - Process image and extract text
- `POST /api/save` - Save OCR result to database
- `GET /api/history` - Get user's OCR history
- `POST /api/uploadthing` - Handle file uploads

## Usage

1. **Upload Image**: Go to `/upload` and upload an image containing text
2. **AI Processing**: The image is processed using Together.ai's vision model
3. **Get Markdown**: Download or copy the extracted Markdown text
4. **View History**: Authenticated users can view their OCR history at `/dashboard`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- Database URL (use Neon, Supabase, or similar)
- Clerk keys
- Together.ai API key
- UploadThing credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.