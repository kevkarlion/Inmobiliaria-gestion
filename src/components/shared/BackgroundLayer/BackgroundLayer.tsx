import Image from "next/image";

export default function BackgroundLayer({ src }: { src: string }) {
  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src={src}
        alt="Background"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
