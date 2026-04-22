import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Domain' };

export default function DomainDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 capitalize gradient-text">{params.slug}</h1>
        <p className="text-slate-400 mb-8">Explore consultants and resources in this domain.</p>
        <div className="card text-center py-16 text-slate-400">
          <p>Consultants in this domain will appear here.</p>
        </div>
      </div>
    </div>
  );
}
