import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { getOneProductQuery } from "../../../api/products/products";
import { getOneProductQueryOptions } from "../../../api/products/productsQueries";
import { useAuth } from "../../../providers/auth.provider";
import { useAddItemToCartMutation } from "../../../api/cart/cartQueries";

const SingleProductPage = () => {
  const { productId } = useParams({ from: "/products/$productId" });
  const { user, authState } = useAuth();
  const product = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getOneProductQuery({ id: +productId }),
  });

  const userCartId = user?.userInfo?.Cart.id;
  const addItem = useAddItemToCartMutation(
    userCartId!,
    () => {},
    () => {}
  );

  if (product.isFetching)
    return (
      <div className="container p-10 h-svh flex mx-auto gap-4 justify-around ">
        <div className="skeleton w-[620px] h-[620px] "></div>

        <div className="flex flex-col gap-4 w-1/3">
          <div className="flex gap-4 w-full justify-center pt-8">
            <div className="skeleton h-16 w-1/2"></div>
            <div className="skeleton h-16 w-1/2"></div>
          </div>
          <div className="skeleton h-12 w-full"></div>
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-full"></div>

          <div className="flex gap-4 w-full justify-center pt-8">
            <div className="skeleton h-16 w-1/2"></div>
            <div className="skeleton h-16 w-1/2"></div>
          </div>
        </div>
      </div>
    );
  const packageString = product.data?.package.join(", ");
  return (
    <div className="container p-10 h-svh flex mx-auto gap-4 justify-around ">
      <div className=" w-[620px] h-[620px] ">
        <img src={product.data?.image} alt={product.data?.title} />
      </div>

      <div className="flex flex-col gap-4 w-1/3">
        <h1 className="text-3xl">{product.data?.title}</h1>
        <div className="flex gap-4 w-full justify-between">
          {/* TODO:Create a util function to make these values look more human readable */}
          <h2>{product.data?.Categories.name}</h2>
          <h2>{product.data?.Brands.name}</h2>
        </div>
        <p>Packaged : {packageString}</p>
        <div className="flex gap-4 w-full justify-center pt-8">
          <h2 className="text-2xl">Case Price : ${product.data?.casePrice}</h2>
          <h2 className="text-2xl">
            {product.data?.unitPrice
              ? `Unit Price :${product.data?.unitPrice}`
              : "Cannot be sold individually"}
          </h2>
        </div>
        <p>{product.data?.description}</p>
        <div className="flex justify-around">
          <div className="w-1/2">
            <h2 className="text-2xl underline ">Colors</h2>
            <ul>
              {product.data?.ColorStrings?.map(
                (color: { name: string; id: string }) => (
                  <li key={color.id}>{color.name}</li>
                )
              )}
            </ul>
          </div>
          <div className="w-1/2">
            <h2 className="text-2xl underline ">Effects</h2>
            <ul>
              {product.data?.effects?.map(
                (effect: { name: string; id: string }) => (
                  <li key={effect.id}>{effect.name}</li>
                )
              )}
            </ul>
          </div>
        </div>
        {authState === "authenticated" ? (
          <div className="flex gap-4 w-full justify-center pt-8">
            <button
              className="btn btn-wide btn-primary"
              onClick={() =>
                addItem.mutate({
                  productId: +productId,
                  cartId: userCartId!,
                })
              }
            >
              Add to Cart
            </button>
            <button className="btn btn-wide btn-secondary">Buy Now</button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/products/$productId")({
  component: () => <SingleProductPage />,
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.ensureQueryData(getOneProductQueryOptions({ id: +productId }));
  },
});
