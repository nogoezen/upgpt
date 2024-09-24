import Chat from './components/Chat';
import { ThemeToggle } from './components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-2xl font-bold mb-4">AI Chat</h1>
        <ThemeToggle />
        <Chat />
      </main>
    </div>
  );
}
