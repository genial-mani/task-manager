export default function NotFound({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="z-5 flex w-3/4 h-24 overflow-hidden bg-white shadow-lg max-w-96 rounded-xl">
      <svg width="16" height="96" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 8 0 
                 Q 4 4.8, 8 9.6 
                 T 8 19.2 
                 Q 4 24, 8 28.8 
                 T 8 38.4 
                 Q 4 43.2, 8 48 
                 T 8 57.6 
                 Q 4 62.4, 8 67.2 
                 T 8 76.8 
                 Q 4 81.6, 8 86.4 
                 T 8 96 
                 L 0 96 
                 L 0 0 
                 Z"
          fill="black"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
      </svg>
      <div className="mx-2.5 overflow-hidden w-full">
        <p className="mt-1.5 text-xl font-bold text-[#a855f7] leading-8 mr-3 overflow-hidden text-ellipsis whitespace-nowrap">
          Notice !
        </p>
        <p className="overflow-hidden leading-5 break-all text-zinc-400 max-h-10">
          {title}!
          <br />
          {desc}
        </p>
      </div>
    </div>
  );
}
