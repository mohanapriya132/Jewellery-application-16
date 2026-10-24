export function formatPrice(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function parsePriceString(priceStr) {
  return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
}
