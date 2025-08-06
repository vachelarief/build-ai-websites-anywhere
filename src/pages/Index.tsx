import { Generator } from "@/components/Generator";
import { builderJsonLd } from "@/seo/jsonld";

const Index = () => {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <section aria-label="Hero AI Website Builder" className="container mx-auto py-20 md:py-28 flex flex-col items-center text-center gap-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
          AI Website Builder untuk Laravel, CodeIgniter, React, Node.js, dan Go
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
          Bangun proyek cepat dengan pilihan framework dan database. Generate boilerplate dan unduh paket siap pakai dalam hitungan detik.
        </p>
        <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-500">
          <Generator />
        </div>
        <p className="text-sm text-muted-foreground">Mendukung MySQL, PostgreSQL, SQLite, dan MongoDB</p>
      </section>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(builderJsonLd) }}
      />
    </main>
  );
};

export default Index;
