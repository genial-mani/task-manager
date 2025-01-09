export default function MaxWidthProvider({children}: Readonly<{children: React.ReactNode}>) {
    return <div className="w-full max-w-full min-h-full p-5">{children}</div>
}