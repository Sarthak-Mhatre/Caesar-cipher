# 🔐 Caesar Cipher App

An interactive educational tool for learning mono-alphabetic substitution ciphers, built with React and Vite.

## ⚠️ Educational Purpose Only
**This application is designed for learning purposes only. Caesar ciphers are not secure for protecting real sensitive information.**

## 🚀 Live Demo
[[View Live App](https://caesar-cipher-lovat.vercel.app/)

## 📖 What is this?
This app demonstrates how Caesar ciphers work using a simple analogy: imagine letters sitting in a toy train, and we move each letter a certain number of seats forward. The app:

- Encrypts messages in real-time as you type
- Uses a password to determine the "shift" amount
- Shows both encrypted and decrypted text
- Preserves spaces, punctuation, and case

## ✨ Features
- **Real-time encryption**: See results as you type
- **Password-based shifts**: Different passwords create different encryptions
- **Copy to clipboard**: Easy sharing of encrypted messages
- **Responsive design**: Works on desktop and mobile
- **Educational focus**: Clear explanations and warnings

## 🛠️ Tech Stack
- **React 18** with hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Modern JavaScript** (ES6+)

## 🏃‍♂️ Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/caesar-cipher-app.git

# Navigate to project directory
cd caesar-cipher-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 🏗️ Building for Production
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📚 How It Works
1. **Input**: Type your message in the left panel
2. **Password**: Enter a password to generate a unique shift
3. **Encryption**: The app automatically encrypts using the Caesar cipher
4. **Decryption**: Enter the same password to decrypt messages

### Algorithm
- Each letter is shifted by N positions in the alphabet
- Shift amount is derived from the password (sum of character codes % 26)
- Non-alphabetic characters remain unchanged
- Case is preserved

## 🧪 Running Tests
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment
This project is optimized for deployment on:
- **Netlify** (recommended for static sites)
- **Vercel** (great for React apps)
- **GitHub Pages**

## 🤝 Contributing
This is an educational project. Contributions that improve the learning experience are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License
This project is open source and available under the [MIT License](LICENSE).

## 🔗 Resources
- [Caesar Cipher on Wikipedia](https://en.wikipedia.org/wiki/Caesar_cipher)
- [Cryptography Basics](https://www.khanacademy.org/computing/computer-science/cryptography)

---
**Remember**: This is for educational purposes only. Never use simple ciphers for real security needs!
