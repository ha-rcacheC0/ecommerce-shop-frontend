import { createFileRoute } from "@tanstack/react-router";
import { TProduct } from "../../types";
import { ProductCard } from "../../components/product-card";

import { getAllProductsQueryOptions } from "../../api/productsQueries";
import { useSuspenseQuery } from "@tanstack/react-query";

const page = 1;
const limit = 25;
export const Route = createFileRoute("/products")({
  component: () => <Products />,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getAllProductsQueryOptions({ page, limit }));
  },
});

function Products() {
  const sq = useSuspenseQuery(getAllProductsQueryOptions({ page, limit }));
  const products = sq.data;
  console.log(products);
  const tempProducts: TProduct[] = [
    {
      key: "4157",
      title: "Fireworks 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quia vero, recusandae asperiores maiores officiis!",
      price: "$420.69",
    },
    {
      key: "4153",
      title: "Fireworks 2",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quia vero, recusandae asperiores maiores officiis!",
      price: "$420.69",
    },
    {
      key: "4155",
      title: "Fireworks 3",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quia vero, recusandae asperiores maiores officiis!",
      price: "$420.69",
    },
    {
      key: "4154",
      title: "Fireworks 4",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quia vero, recusandae asperiores maiores officiis!",
      price: "$420.69",
    },
    {
      key: "41576",
      title: "Fireworks 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quia vero, recusandae asperiores maiores officiis!",
      price: "$420.69",
    },
    {
      key: "41553",
      title: "Fireworks 2",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quia vero, recusandae asperiores maiores officiis!",
      price: "$420.69",
    },
    {
      key: "4165",
      title: "Fireworks 3",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quia vero, recusandae asperiores maiores officiis!",
      price: "$420.69",
    },
    {
      key: "4158",
      title: "Fireworks 4",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quia vero, recusandae asperiores maiores officiis!",
      price: "$420.69",
    },
  ];

  return (
    <div className="flex  flex-wrap gap-4 p-6 h-svh justify-center bg-primary">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
