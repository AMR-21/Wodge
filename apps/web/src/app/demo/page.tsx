import { GoBtn } from "./go-btn";

function DemoPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 overflow-y-auto bg-background">
      <p className="text-2xl font-bold">Wodge's demo video (1.25x)</p>
      <video
        className="h-1/2"
        src="https://pub-7269b27ed55b45589b91a3b2611c0756.r2.dev/demo.mp4"
        controls
      />

      <GoBtn />
    </div>
  );
}

export default DemoPage;
