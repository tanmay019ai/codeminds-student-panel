🚀 CodeMinds Student Panel

The CodeMinds Student Panel is a web platform for students in the CodeMinds core team to manage their project progress.
Each student can log in, enter their GitHub ID (one-time), view assigned projects, and mark them as completed.
After marking completion, the project status changes to Under Review, which is later updated by the admin through the CodeMinds Admin Panel.

🧩 Features
🎓 Student Panel

Clean and modern Next.js + Tailwind CSS frontend.

Login page for each student (with pre-given credentials).

One-time GitHub ID input, saved permanently in the backend.

Displays assigned project details (title, description, and deadline).

“YES, I have completed” button to notify the tech leads.

Button gets locked after clicking, changing status to Under Review.

Once reviewed by admin, student sees:

✅ Reviewed

🟡 Under Review

⚫ Pending

🧠 Project Flow
Student Side

Login using given credentials.

Search/select your name.

If GitHub ID not entered → input and save.

View assigned project (fetched from backend).

Tick “YES” after completion → status changes to Under Review.

After admin review → status updates to Reviewed ✅.

Admin Side (Separate Project)

Admin uploads students and assigns tasks.

Reviews project submissions.

Updates project status → synced automatically to Student Panel.

🏗️ Tech Stack
Layer	Technology
Frontend	Next.js (App Router)
Styling	Tailwind CSS
Backend	Node.js + Express.js
Database	MongoDB (Mongoose ORM)
Auth	Basic login (to be integrated)
Deployment	Vercel (Frontend) + Render/Heroku (Backend)
📁 Folder Structure
codeminds-student-panel/
│
├── app/
│   ├── layout.js               # Global layout
│   ├── page.js                 # Landing / Loading page
│   ├── login/page.js           # Login page
│   ├── dashboard/page.js       # Main dashboard
│
├── components/
│   ├── GithubInput.js          # One-time GitHub ID input component
│   ├── ProjectCard.js          # Project display and status
│
├── styles/
│   └── globals.css             # Tailwind setup
│
├── package.json
└── README.md

⚙️ Setup Instructions
1. Clone the Repository
git clone https://github.com/<your-username>/codeminds-student-panel.git
cd codeminds-student-panel

2. Install Dependencies
npm install

3. Run the Development Server
npm run dev


Then open http://localhost:3000
 in your browse
