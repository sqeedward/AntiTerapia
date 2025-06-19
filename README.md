# 🔥 RoastMyLife

A savage AI-powered web app that roasts your life stories with humor, memes, and audio responses. Built with React, Vite, and Tailwind CSS.

## ✨ Features

- **🎤 Audio Recording**: Record audio directly from your microphone
- **📸 Photo Upload**: Upload photos for visual roasting
- **📝 Text Input**: Share your life stories for roasting
- **🔥 Roast Levels**: Choose from Light, Medium, or Brutal roasting intensity
- **🎭 Meme Generation**: Get contextual memes based on your input
- **📚 Conversation History**: Track your roasting sessions
- **🚫 No-Go Topics**: Specify topics to avoid in roasts
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with microphone access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/roastmylife.git
   cd roastmylife
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 How to Use

### Getting Roasted

1. **Tell Your Story**: Type your life story in the text area
2. **Upload Media**: Add photos or record audio for enhanced roasting
3. **Choose Intensity**: Select Light, Medium, or Brutal roast level
4. **Set Boundaries**: Specify any no-go topics (optional)
5. **Get Roasted**: Click "🔥 Get Roasted!" and enjoy the savagery

### Audio Recording

- Click "🎤 Start Recording" to begin audio capture
- Speak your story or thoughts
- Click "⏹️ Stop Recording" when done
- Preview your recording before submitting

### Roast Levels

- **😊 Light**: Gentle, playful roasts
- **🔥 Medium**: More pointed but still fun
- **💀 Brutal**: Savage, no-holds-barred roasts

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Audio**: Web Audio API, MediaRecorder
- **AI**: Firebase AI Logic SDK (planned), Gemini API (planned)
- **Storage**: localStorage for conversation history

## 📁 Project Structure

```
roastmylife/
├── src/
│   ├── components/
│   │   ├── InputForm.jsx      # Main input form with audio recording
│   │   ├── RoastOutput.jsx    # Displays roast results
│   │   ├── MemeDisplay.jsx    # Shows generated memes
│   │   └── HistoryView.jsx    # Conversation history
│   ├── utils/
│   │   ├── geminiApi.js       # AI integration (mock for now)
│   │   ├── audioProcessor.js  # Audio processing utilities
│   │   └── memeGenerator.js   # Meme generation (placeholder)
│   ├── styles/
│   │   └── tailwind.css       # Custom styles
│   ├── App.jsx                # Main app component
│   └── main.jsx               # App entry point
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## 🔧 Configuration

### Firebase Setup (Future)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firebase AI Logic and Gemini Developer API
3. Get your API key from [Google AI Studio](https://aistudio.google.com)
4. Add Firebase config to `src/utils/geminiApi.js`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 🎨 Customization

### Adding New Roast Types

Edit `src/utils/geminiApi.js` to add new roast categories:

```javascript
const mockRoasts = {
  Light: {
    text: ["Your new roast here"],
    photo: ["Photo-specific roast"],
    audio: ["Audio-specific roast"]
  }
  // ... more levels
};
```

### Styling

- Modify `src/styles/tailwind.css` for custom styles
- Update component classes in individual `.jsx` files
- Use Tailwind CSS utilities for rapid styling

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 TODO

- [ ] Integrate real Gemini API via Firebase AI Logic
- [ ] Add real meme generation API
- [ ] Implement text-to-speech for audio roasts
- [ ] Add user authentication
- [ ] Implement cloud storage for media files
- [ ] Add more roast categories and templates
- [ ] Create mobile app version

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Google Hackathon
- Inspired by the art of roasting
- Powered by modern web technologies

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Warning**: This app is for entertainment purposes only. Roasts are generated for humor and should not be taken personally. Use responsibly! 😄 