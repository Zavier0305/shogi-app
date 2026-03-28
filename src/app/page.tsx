import { redirect } from 'next/navigation';

export default function Home() {
  async function createRoom() {
    'use server';
    const roomId = Math.floor(100000 + Math.random() * 900000).toString();
    redirect(`/room/${roomId}`);
  }

  async function joinRoom(formData: FormData) {
    'use server';
    const roomId = formData.get('roomId') as string;
    if (roomId && roomId.length === 6 && !isNaN(Number(roomId))) {
      redirect(`/room/${roomId}`);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-[#333]">
      <div className="max-w-sm w-full bg-white p-8 sm:p-12 shadow-sm border border-stone-200 rounded-sm">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-2xl tracking-[0.3em] text-[#7a0000] font-bold mb-3">
            将棋
          </h1>
          <div className="w-8 h-px bg-[#7a0000] mb-3"></div>
          <p className="text-stone-500 text-xs tracking-widest text-center leading-relaxed">
            シンプルで、心地よい<br/>オンライン対局。
          </p>
        </div>

        <div className="space-y-8">
          <form action={createRoom}>
            <button 
              type="submit" 
              className="w-full bg-[#7a0000] hover:bg-[#660000] text-white py-3.5 px-6 transition duration-300 tracking-[0.2em] text-sm shadow-sm"
            >
              新しく始める
            </button>
          </form>

          <form action={joinRoom} className="space-y-3">
            <div>
              <input 
                type="text" 
                name="roomId"
                placeholder="ルームID (6桁)" 
                maxLength={6}
                pattern="\d{6}"
                required
                className="w-full bg-stone-50 border border-stone-200 focus:border-[#7a0000] focus:bg-white focus:ring-0 px-4 py-3.5 text-center tracking-[0.2em] text-[#333] placeholder-stone-400 outline-none transition"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-white hover:bg-stone-50 border border-stone-300 text-[#333] py-3.5 px-6 transition duration-300 tracking-[0.2em] text-sm"
            >
              参加する
            </button>
          </form>
        </div>
      </div>
      
      <p className="text-stone-400 text-[10px] mt-12 tracking-widest">わけあって、将棋。</p>
    </main>
  );
}
