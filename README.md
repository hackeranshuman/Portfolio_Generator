# 📄 Inkfolio

### AI-Powered Resume Builder for Developers & Professionals

**Inkfolio** is a modern, interactive resume builder designed to help developers and professionals create polished, professional resumes in minutes.

Create your resume, customize its appearance, enhance your content with **Google Gemini AI**, preview changes in real time, and export your final resume in multiple formats.

<p align="center">
  <strong>✨ Build. Customize. Enhance. Export.</strong>
</p>

---

## 🚀 Features

| Feature                        | Description                                                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| 👤 **Dynamic User Experience** | Personalizes the workspace based on the signed-in user and automatically adapts greetings and default templates. |
| 🎨 **Live Customization**      | Switch between modern, classic, and minimal layouts with real-time accent color customization.                   |
| 💾 **Autosave & Persistence**  | Automatically saves resume data locally so you can continue working without losing progress.                     |
| 📸 **Profile Photo Upload**    | Add a profile picture to your resume with persistent Base64 Data URL storage.                                    |
| 🤖 **Gemini AI Enhancement**   | Improve professional summaries, work experience, and project descriptions with AI-powered suggestions.           |
| 📄 **Multiple Export Formats** | Export your resume as PDF, PNG, TXT, or JSON backup data.                                                        |
| 👀 **Live Resume Preview**     | See your resume update instantly while editing your information.                                                 |
| 📱 **Responsive Interface**    | Designed to provide a smooth experience across different screen sizes.                                           |

---

## 🤖 AI-Powered Resume Enhancement

Inkfolio integrates **Google Gemini AI** to help transform basic resume content into more professional and impactful descriptions.

### AI can help with:

* ✨ Professional summaries
* 💼 Work experience descriptions
* 🚀 Project descriptions
* 📝 Resume content polishing
* 💡 Smart content suggestions

Instead of staring at a blank text box, let AI help you turn your experience into stronger resume content.

---

## 🎨 Resume Customization

Make your resume match your personality and career goals.

### Available customization options

* 🖼️ Multiple resume layouts
* 🎨 Custom accent colors
* 👀 Real-time preview
* 📸 Profile photo support
* ✏️ Editable resume sections
* 💾 Automatic local persistence

---

## 📤 Export Your Resume

Once your resume is ready, Inkfolio lets you take it with you in multiple formats.

**Supported formats:**

```text
📄 PDF      → Print-ready professional resume
🖼️ PNG      → High-quality resume image
📝 TXT      → Plain-text version
🗂️ JSON     → Resume data backup
```

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ **React 18+**
* ⚡ **Vite**
* 🎨 **Tailwind CSS**
* 🧭 **React Router**
* 🎯 **Lucide React Icons**

### AI

* 🤖 **Google Gemini API**

### Browser Storage

* 💾 **LocalStorage**

---

## 📁 Project Structure

```text
Inkfolio/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── ...
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## ⚙️ Getting Started

Follow these steps to run Inkfolio locally.

### 1️⃣ Clone the repository

```bash
git clone https://github.com/hackeranshuman/Portfolio-Generator.git
```

### 2️⃣ Navigate to the project

```bash
cd Portfolio-Generator
```

### 3️⃣ Install dependencies

```bash
npm install
```

### 4️⃣ Configure environment variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Never commit your `.env` file to GitHub.**
>
> Make sure `.env` is included in your `.gitignore`.

### 5️⃣ Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

Inkfolio currently uses the following environment variable:

| Variable              | Description                                |
| --------------------- | ------------------------------------------ |
| `VITE_GEMINI_API_KEY` | API key used for Google Gemini AI features |

### Example

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**Important:** Keep your API keys private and never upload them to a public repository.

---

## 💡 Why Inkfolio?

Creating a professional resume shouldn't require spending hours formatting documents.

Inkfolio combines:

**Resume Builder + Live Preview + Customization + AI Assistance + Multi-format Export**

into a single web application.

Whether you're a student applying for internships, a developer looking for a new role, or a professional updating an existing resume, Inkfolio helps you create a polished resume faster.

---

## 🗺️ Future Improvements

Some features that can be added in future versions:

* [ ] ☁️ Cloud-based resume storage
* [ ] 🔐 Full authentication system
* [ ] 📊 Resume ATS score
* [ ] 🧠 AI-powered ATS optimization
* [ ] 🎯 Job-description-based resume customization
* [ ] 📑 More professional templates
* [ ] 🌐 Public resume sharing
* [ ] 🔗 Custom resume URLs
* [ ] 📈 Resume analytics
* [ ] 📱 Improved mobile editing experience

---

## 👨‍💻 Author

### Anshuman Singh

Built with ❤️ using **React, Vite, Tailwind CSS, and Google Gemini AI**.

---

## ⭐ Support

If you find **Inkfolio** useful, consider giving the repository a ⭐ on GitHub.

Every star helps support the project! 🚀

---

## 📜 License

This project is open-source and available under the **MIT License**.

---