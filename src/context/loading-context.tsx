'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

interface LoadingContextType {
  isLoading: boolean;
  message: string | null;
  startLoading: (msg?: string) => void;
  stopLoading: () => void;
  startTransitionLoading: (callback: () => void | Promise<void>, msg?: string) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  message: null,
  startLoading: () => {},
  stopLoading: () => {},
  startTransitionLoading: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const startLoading = useCallback((msg?: string) => {
    setMessage(msg || null);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setMessage(null);
  }, []);

  const startTransitionLoading = useCallback((callback: () => void | Promise<void>, msg?: string) => {
    startLoading(msg);
    startTransition(async () => {
      try {
        await callback();
      } finally {
        stopLoading();
      }
    });
  }, [startLoading, stopLoading]);

  // Hide loading when route changes finish
  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  // Global listener for link clicks to show blur loading during navigation
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        targetAttr !== '_blank' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        // Check if href is different from current pathname
        const currentUrl = window.location.pathname;
        if (href !== currentUrl) {
          startLoading('جاري الانتقال للصفحة...');
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [startLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading: isLoading || isPending, message, startLoading, stopLoading, startTransitionLoading }}>
      {children}
      <LoadingOverlay isVisible={isLoading || isPending} message={message} />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
