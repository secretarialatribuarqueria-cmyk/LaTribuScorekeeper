import Image from 'next/image'

export function AppHeader({ right }: { right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-3 px-4">
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-foreground">
          <Image
            src="/logo-la-tribu.jpg"
            alt="Logo La Tribu Arquería"
            width={36}
            height={36}
            className="size-full object-contain"
            priority
          />
        </div>
        <div className="min-w-0 flex-1 leading-none">
          <h1 className="truncate font-display text-lg font-bold uppercase tracking-wide text-foreground">
            La Tribu
          </h1>
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.2em] text-primary-bright">
            ScoreKeeper
          </p>
        </div>
        {right}
      </div>
    </header>
  )
}
