import { useEffect, useState } from 'react';
import { useGetSalonImage } from './useQueries';

export function useSalonImage(imageId: string | null) {
  const { data: imageData, isLoading, error } = useGetSalonImage(imageId);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageData) {
      setObjectUrl(null);
      return;
    }

    const [bytes, contentType] = imageData;
    // Convert to standard Uint8Array to ensure compatibility with Blob constructor
    const standardBytes = new Uint8Array(bytes);
    const blob = new Blob([standardBytes], { type: contentType });
    const url = URL.createObjectURL(blob);
    setObjectUrl(url);

    // Cleanup function to revoke the object URL
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageData]);

  return {
    imageUrl: objectUrl,
    isLoading,
    error
  };
}
