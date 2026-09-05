import { redirect } from 'next/navigation';
import ShogiBoard from '@/components/ShogiBoard';

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // 部屋IDは常に6桁の数字(createRoomAction/joinRoomAction/findRandomRoom)。
  // URLを直接手打ちされた場合、この形式チェックがないと/api/pusherへの
  // 通信が全て弾かれて「一見開けるが誰とも同期しない部屋」になってしまう。
  if (!/^\d{6}$/.test(id)) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-start py-4 sm:py-10 px-2 sm:px-4">
      <div className="w-full max-w-full flex justify-center overflow-x-hidden">
        <ShogiBoard roomId={id} />
      </div>
    </div>
  );
}
