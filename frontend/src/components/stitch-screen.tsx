'use client';

import React from 'react';
import { StitchActionModal } from '@/components/stitch-action-modal';
import { wireStitchDom } from '@/lib/stitch-interactions';
import { useStitchClickHandler } from '@/lib/use-stitch-click-handler';

interface StitchHtmlProps {
  slug: string;
  className?: string;
  /** When true, renders inside StitchAppShell content slot (no min-h-screen). */
  contentOnly?: boolean;
}

function useStitchHtml(slug: string) {
  const [html, setHtml] = React.useState('');
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    import(`@/stitch-screens/${slug}.html`)
      .then((mod) => {
        if (!cancelled) setHtml(mod.html);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { html, error };
}

function StitchHtmlView({ slug, className = '', contentOnly = false }: StitchHtmlProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { html, error } = useStitchHtml(slug);
  const { modal, setModal, handleModalSubmit } = useStitchClickHandler(containerRef, Boolean(html));

  React.useEffect(() => {
    const root = containerRef.current;
    if (!root || !html) return;
    wireStitchDom(root);
  }, [html]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-background text-foreground ${
          contentOnly ? 'p-8' : 'min-h-screen p-8'
        }`}
      >
        <p>Stitch ekranı yüklenemedi: {slug}</p>
      </div>
    );
  }

  if (!html) {
    return (
      <div
        className={contentOnly ? 'p-8 min-h-[200px]' : 'min-h-screen bg-background p-8'}
        aria-busy="true"
      />
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`stitch-screen ${contentOnly ? 'stitch-page-content' : ''} ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
      <StitchActionModal modal={modal} onClose={() => setModal(null)} onSubmit={handleModalSubmit} />
    </>
  );
}

/** Full-page Stitch screen (landing / marketing). Includes complete viewport layout. */
export function StitchScreen({ slug, className }: { slug: string; className?: string }) {
  return <StitchHtmlView slug={slug} className={className} contentOnly={false} />;
}

/** Dashboard content-only slice — rendered inside StitchAppShell (no duplicate sidebar/header). */
export function StitchContent({ slug, className }: { slug: string; className?: string }) {
  return <StitchHtmlView slug={slug} className={className} contentOnly />;
}
