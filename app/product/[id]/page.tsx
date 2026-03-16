// app/product/[id]/page.tsx
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import SimilarProducts from "@/components/SimilarProducts";
import { getProductById, getSimilarProducts } from "@/lib/supabase";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    return {
      title: `${product.name} | Kay Candles and Craft`,
      description: product.description,
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  const similar = await getSimilarProducts(
    product.id,
    product.category,
    product.price,
  ).catch(() => []);

  return (
    <div className="min-h-screen bg-blush-50">
      <ProductDetailClient product={product} />
      <SimilarProducts products={similar} title="You Might Also Love" />
    </div>
  );
}
