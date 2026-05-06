export const imageCache: Record<string, HTMLImageElement> = {};

export function getCachedImage(url: string, callback: (img: HTMLImageElement) => void) {
  if (!url) return;
  
  if (imageCache[url]) {
    callback(imageCache[url]);
    return;
  }

  const img = new window.Image();
  img.src = url;
  img.onload = () => {
    if (img.width > 0 && img.height > 0) {
      imageCache[url] = img;
      callback(img);
    }
  };
}
