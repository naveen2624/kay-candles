import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';
import SimilarProducts from '@/components/SimilarProducts';
import { getMockProductById, getMockSimilarProducts } from '@/utils/mockData';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const product = getMockProductById(params.id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} | Kay Candles and Craft`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  // In production: const product = await getProductById(params.id);
  const product = getMockProductById(params.id);
  
  if (!product) notFound();

  // In production: const similar = await getSimilarProducts(product.id, product.category, product.price);
  const similar = getMockSimilarProducts(product.id, product.category, product.price);

  return (
    <div className="min-h-screen bg-blush-50">
      <ProductDetailClient product={product} />
      <SimilarProducts products={similar} title="You Might Also Love" />
    </div>
  );
}
