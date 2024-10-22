import { auth } from '@/server/auth';
import ChatPage from './chatpage';
import { useTranslations } from 'next-intl';

export const runtime = 'edge';

export default async function Home() {
  const user = await auth();

  return <ChatPage user={user} />;
}
