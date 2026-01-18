import { useCallback, useRef } from 'react';

export const useSave = (content) => {
  const debounceTimerRef = useRef(null);

  const compress = useCallback(async (string) => {
    const byteArray = new TextEncoder().encode(string);
    const stream = new CompressionStream('deflate-raw');
    const writer = stream.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    const buffer = await new Response(stream.readable).arrayBuffer();
    return new Uint8Array(buffer).toBase64({ alphabet: 'base64url' });
  }, []);

  const save = useCallback(async () => {
    const hash = '#' + await compress(content);
    
    // Update URL
    if (window.location.hash !== hash) {
      window.history.replaceState({}, '', hash);
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('hash', hash);
    } catch (e) {
      // Silently fail
    }
  }, [content, compress]);

  const debouncedSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(save, 500);
  }, [save]);

  return { save, debouncedSave };
};