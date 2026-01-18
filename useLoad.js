import { useCallback, useState, useEffect } from 'react';

export const useLoad = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const decompress = useCallback(async (b64) => {
    const byteArray = Uint8Array.fromBase64(b64, { alphabet: 'base64url' });
    const stream = new DecompressionStream('deflate-raw');
    const writer = stream.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    const buffer = await new Response(stream.readable).arrayBuffer();
    return new TextDecoder().decode(buffer);
  }, []);

  const load = useCallback(async (hash) => {
    if (!hash) {
      setContent('');
      setIsLoading(false);
      return;
    }

    try {
      const decompressed = await decompress(hash.slice(1));
      setContent(decompressed);
    } catch (e) {
      setContent('');
    }
    setIsLoading(false);
  }, [decompress]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      if (window.location.hash !== '') {
        await load(window.location.hash);
      } else {
        const savedHash = localStorage.getItem('hash') || '';
        await load(savedHash);
        if (savedHash && window.location.hash === '') {
          window.history.replaceState({}, '', '#' + savedHash);
        }
      }
    };

    initialize();
  }, [load]);

  useEffect(() => {
    const handleHashChange = () => {
      load(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [load]);

  return { content, setContent, isLoading };
};