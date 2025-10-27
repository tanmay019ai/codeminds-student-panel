# 🚀 CodeMinds Student Panel

The **CodeMinds Student Panel** is a web platform for CodeMinds members to manage their project progress.  
Each student can log in, enter their **GitHub ID (one-time)**, view assigned projects, and mark them as completed.  
Once a student marks a project as completed, the system notifies the tech leads (admins) and the status changes to **Under Review**, which is later updated from the **Admin Panel**.

---

## 🧩 Features

### 🎓 Student Panel
- Built using **Next.js + Tailwind CSS**.
- **Login page** for each student (with pre-created credentials).
- **One-time GitHub ID input**, saved permanently in the backend.
- Displays assigned **project details** (title, description, and deadline).
- **“YES, I have completed”** button to notify the tech leads.
- After ticking YES:
  - Button becomes **locked** (cannot be clicked again).
  - Status changes to **Under Review** automatically.
- Once reviewed by the admin, status updates to:
  - ✅ **Reviewed**
  - 🟡 **Under Review**
  - ⚫ **Not Reviewed**

---

## 🧠 Project Flow

### **Student Side**
1. Student logs in with given credentials.  
2. Searches or selects their name.  
3. If GitHub ID not entered → inputs once and saves.  
4. Views assigned project from backend.  
5. Clicks “YES” when project completed.  
6. Status changes to **Under Review**.  
7. After admin review → sees **Reviewed ✅**.

### **Admin Side (Separate Project)**
- Admin uploads or edits student details and tasks.  
- Reviews projects submitted by students.  
- Updates status → data syncs automatically to student panel.  

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Next.js (App Router) |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | Basic login system |
| Deployment | Vercel (Frontend) + Render/Heroku (Backend) |

---
