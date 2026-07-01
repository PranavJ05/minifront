export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
