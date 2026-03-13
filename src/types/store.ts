export type Money = number;

export type ProductLine = "RESINA_EPOXI" | "JOYERIA";

export type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  regularPrice: Money;
  transferPrice: Money;
  stock: number;
  material?: string;
  devotion?: string;
  sizeLabel?: string;
  finishLabel?: string;
  isDefault?: boolean;
};

export type ProductImage = {
  url: string;
  alt: string;
  isPrimary?: boolean;
};

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description: string;
  line: ProductLine;
  sku: string;
  regularPrice: Money;
  transferPrice: Money;
  stock: number;
  installmentsText?: string;
  dimensions?: string;
  weightGrams?: number;
  careInstructions?: string;
  categories: string[];
  collections: string[];
  materials: string[];
  devotions: string[];
  featured?: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  tags?: string[];
};

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type StoreCollection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  featured?: boolean;
};

export type CartItem = {
  productSlug: string;
  variantId?: string;
  quantity: number;
};

export type CartDetailedItem = {
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string;
  imageAlt: string;
  sku: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  regularPrice: number;
  transferPrice: number;
  availableStock: number;
  lineRegularTotal: number;
  lineTransferTotal: number;
};
