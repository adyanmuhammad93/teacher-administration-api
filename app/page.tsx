export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="max-w-xl space-y-4 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Teacher Administration API - Dev Assessment</p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight">Node.js + MySQL API ready to run.</h1>
        <p className="text-pretty leading-7 text-muted-foreground">Use the documented route handlers under <code>/api</code> to register students, find common classes, suspend students, and retrieve notification recipients.</p>
      </section>
    </main>
  )
}
