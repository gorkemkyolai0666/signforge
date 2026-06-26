'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { StitchActionModal } from '@/components/stitch-action-modal';
import { applyStitchNavActiveState, wireStitchDom } from '@/lib/stitch-interactions';
import { useStitchClickHandler } from '@/lib/use-stitch-click-handler';

/**
 * Unified Stitch shell (sidebar + top nav) extracted once from the Workspace screen.
 * Dashboard route pages render ONLY their content inside the slot below — no layout drift.
 */
export function StitchAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shellRef = React.useRef<HTMLDivElement>(null);
  const [shellHtml, setShellHtml] = React.useState('');
  const { modal, setModal, handleModalSubmit } = useStitchClickHandler(shellRef, Boolean(shellHtml));

  React.useEffect(() => {
    import('@/stitch-screens/stitch-shell.html')
      .then((mod) => setShellHtml(mod.html))
      .catch(() => setShellHtml(''));
  }, []);

  React.useEffect(() => {
    const root = shellRef.current;
    if (!root || !shellHtml) return;
    wireStitchDom(root);
    applyStitchNavActiveState(root, pathname);
  }, [shellHtml, pathname]);

  if (!shellHtml) {
    return <div className="min-h-screen bg-background p-8" aria-busy="true" />;
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div
          ref={shellRef}
          className="stitch-shell"
          dangerouslySetInnerHTML={{ __html: shellHtml }}
          suppressHydrationWarning
        />
        <div className="ml-64 mt-16 min-h-[calc(100vh-4rem)] overflow-y-auto p-8">
          {children}
        </div>
      </div>
      <StitchActionModal modal={modal} onClose={() => setModal(null)} onSubmit={handleModalSubmit} />
    </>
  );
}
