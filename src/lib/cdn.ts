/**
 * Помошник за оптимизирани слики.
 * Shopify CDN поддржува „?width=...“ — мали слики за картички/минијатури,
 * големи само кога ќе се отвори модалот/зумот (се вчитуваат на барање).
 */
export const shopifyImg = (url: string, width = 800): string => {
  if (!url) return url;
  if (url.includes('cdn.shopify.com')) {
    return `${url}${url.includes('?') ? '&' : '?'}width=${width}`;
  }
  return url;
};
