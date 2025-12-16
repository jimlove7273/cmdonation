import { redirect } from 'next/navigation';

// This is a server component that checks for authentication server-side
export default function Home() {
  // In a real app, you would check for a session token in cookies
  // For now, we'll redirect to the login page to ensure proper authentication
  redirect('/login');
}
