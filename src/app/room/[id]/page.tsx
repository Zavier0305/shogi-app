import ShogiBoard from '@/components/ShogiBoard';

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-start py-4 sm:py-10 px-2 sm:px-4">
      <div className="w-full max-w-full flex justify-center overflow-x-hidden">
        <ShogiBoard roomId={id} />
      </div>
    </div>
  );
}
