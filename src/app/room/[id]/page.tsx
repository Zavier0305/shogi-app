import ShogiBoard from '@/components/ShogiBoard';

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center py-10 px-4">
      <div className="max-w-7xl w-full flex justify-center">
        <ShogiBoard roomId={id} />
      </div>
    </div>
  );
}
