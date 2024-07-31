import { auth } from '@/server/auth';
import ChatPage from './chatpage';

export const runtime = 'edge';

export default async function Home() {
  const user = await auth();
  return <ChatPage user={user} />;
}
