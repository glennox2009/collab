# 📝 Collaborative Editor

A real-time collaborative text editor built with Next.js, similar to Google Docs. Multiple users can edit the same document simultaneously with live updates.

![Collaborative Editor Preview](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## ✨ Features

- 🚀 **Real-time collaboration** - Multiple users can edit simultaneously
- 👥 **User presence** - See who's currently editing
- 🔄 **Auto-save** - Changes are automatically saved every 2 seconds
- 📱 **Responsive design** - Works on desktop and mobile
- 🎨 **Clean UI** - Modern, professional interface
- 🔗 **Easy sharing** - Share documents via URL
- ⚡ **Fast setup** - No database required for demo

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Real-time**: HTTP polling (Vercel-compatible)
- **Storage**: In-memory (perfect for demos)
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/collab.git
   cd collab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎯 How to Use

1. **Enter your name** on the homepage
2. **Create a new document** or **join an existing one**
3. **Share the URL** with others to collaborate
4. **Start typing** - changes sync automatically!

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── document/[id]/page.tsx   # Document editor
│   └── api/document/[id]/       # API routes
├── components/
│   ├── Button.tsx               # Reusable button component
│   ├── Card.tsx                 # Card layout components
│   ├── InputField.tsx           # Input with error handling
│   ├── CollaborativeEditor.tsx  # Main editor component
│   └── ...                      # Other UI components
```

## 🔧 Component Architecture

The project follows a clean component-based architecture:

- **UI Components**: Reusable design system components
- **Feature Components**: Domain-specific components
- **Pages**: Route-level components
- **API Routes**: Backend endpoints for document operations

## 🌐 Deployment

### Deploy to Vercel

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy with Vercel CLI**
   ```bash
   npx vercel
   ```

3. **Or connect to GitHub** and deploy via Vercel dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🎨 Design System

The project uses a custom Rhino color palette:

- **Primary**: #607ab0, #7390be
- **Background**: #f4f7fa
- **Text**: #292f42, #495884

## 🔮 Future Enhancements

- [ ] Rich text formatting (bold, italic, etc.)
- [ ] Document versioning
- [ ] User authentication
- [ ] Persistent database storage
- [ ] WebSocket implementation
- [ ] Cursor position tracking

---

Built with ❤️ for seamless collaboration
