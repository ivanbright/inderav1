# Firebase Setup Instructions for Indera V1

## Current Status
✅ Firebase project configured: `indera-574de`
✅ Firebase SDK integrated
✅ Demo data seeding ready
❌ Firebase Console services need to be enabled

## Required Firebase Console Setup

### 1. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/project/indera-574de)
2. Navigate to **Authentication** → **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
   - Click on **Email/Password**
   - Toggle **Enable**
   - Click **Save**

### 2. Enable Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for now)
4. Select your preferred location (us-central1 recommended)
5. Click **Done**

### 3. Configure Firestore Security Rules (Optional for Testing)
In Firestore → Rules, use these permissive rules for testing:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Testing the Setup

### Method 1: Use the Debug Panel
1. Start the app: `npm start`
2. The login screen now includes a Firebase Debug Panel
3. Click **"Create Demo Users"** to set up test accounts
4. Click **"Seed Demo Data"** to populate the database
5. Use the demo login buttons to test different roles

### Method 2: Manual Testing
Try logging in with these credentials:
- **Parent**: `parent@demo.com` / `demo123`
- **Teacher**: `teacher@demo.com` / `demo123`  
- **Admin**: `admin@demo.com` / `demo123`

## Troubleshooting

### "Authentication failed" overlay
This means Firebase Auth is not enabled in the console. Follow step 1 above.

### "Permission denied" errors
This means Firestore security rules are too restrictive. Follow step 3 above.

### AsyncStorage warnings
These are just warnings and can be ignored. The app will work correctly.

## Demo Data Structure
Once seeded, your Firebase project will contain:

**Collections created:**
- `schools` - School information
- `users` - User profiles (parent, teacher, admin)
- `students` - Student records
- `parents` - Parent information with children links
- `teachers` - Teacher profiles with class assignments
- `classes` - Class information
- `subjects` - Subject definitions
- `assessments` - Quiz/test definitions
- `assessmentResults` - Student grades
- `attendance` - Daily attendance records
- `behaviorReports` - Student behavior tracking
- `announcements` - School announcements
- `calendarEvents` - School calendar
- `notifications` - User notifications

**Demo accounts will have:**
- Parent with 2 children (Amahle and Thabo Mbeki)
- Teacher (Sarah Johnson) assigned to Grade 8A
- Admin (Principal Mokoena) with full access
- Sample assessments, attendance, and behavior data

## Next Steps After Setup

1. ✅ Enable Firebase Authentication (Email/Password)
2. ✅ Create Firestore Database
3. ✅ Run the app and use debug panel to create demo users
4. ✅ Test login with demo credentials
5. ✅ Verify all screens work with real Firebase data

## Production Considerations

For production deployment, you'll need:
- Proper Firestore security rules
- Firebase Cloud Functions for backend logic
- Push notifications setup
- File storage configuration
- Backup strategies

The current setup is perfect for development and demo purposes.