import year from "year";

export default async function Footer() {
    return <footer className="w-full max-w-full min-h-16 flex items-center justify-around flex-wrap px-5 bg-eerie-black text-slate-50"><div>{`© ${year("yyyy")} DoIt`}</div><div>Terms and conditions</div></footer>
}