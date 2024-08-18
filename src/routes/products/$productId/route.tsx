import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useParams,
  Link,
  useSearch,
} from "@tanstack/react-router";
import { getOneProductQuery } from "../../../api/products/products";
import { getOneProductQueryOptions } from "../../../api/products/productsQueries";
import { useAuth } from "../../../providers/auth.provider";
import { useAddItemToCartMutation } from "../../../api/cart/cartQueries";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";
import { Brand, Category, Colors, Effects } from "../../../types";

const SingleProductPage = () => {
  const { productId } = useParams({ from: "/products/$productId" });
  const { user, authState } = useAuth();
  const search = useSearch({ from: "/products/$productId" });

  const product = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getOneProductQuery({ id: productId }),
  });

  const userCartId = user?.userInfo?.Cart.id;
  const addItem = useAddItemToCartMutation(
    userCartId!,

    () => {
      toast.success(`${product.data?.title} added to cart!`, {
        position: "bottom-right",
      });
    },
    () => {
      toast.error("Failed to add product to cart", {
        position: "bottom-right",
      });
    }
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
  const packageString = product.data?.package?.join(", ");
  return (
    <div className="container p-10 h-svh flex flex-col mx-auto gap-4">
      <Link
        to="/products"
        search={{
          page: search.page ? Number(search.page) : 1,
          pageSize: search.pageSize ? Number(search.pageSize) : 25,
          brands: search.brands,
          categories: search.categories,
          colors: search.colors,
          effects: search.effects,
          searchTitle: search.searchTitle,
        }}
        className="btn btn-outline btn-sm self-start mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to Products
      </Link>
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
        <div className="flex gap-4 w-full justify-center pt-8 flex-col">
          <h2 className="text-2xl">
            Case Price : ${parseFloat(product.data!.casePrice).toFixed(2)}
          </h2>
          <h2 className="text-2xl">
            {product.data?.UnitProduct
              ? `Unit Price : $${parseFloat(product.data?.UnitProduct.unitPrice).toFixed(2)}`
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
              {product.data?.EffectStrings?.map(
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
                  productId: productId,
                  cartId: userCartId!,
                  isUnit: false,
                })
              }
            >
              Add Case <FontAwesomeIcon icon={faCartPlus} />
            </button>
            {product.data?.UnitProduct && (
              <button
                className="btn btn-wide btn-primary"
                onClick={() =>
                  addItem.mutate({
                    productId: product.data.id,
                    cartId: userCartId!,
                    isUnit: true,
                  })
                }
              >
                Add Unit <FontAwesomeIcon icon={faCartPlus} />
              </button>
            )}
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
  validateSearch: z.object({
    page: z.coerce.number(),
    pageSize: z.coerce.number(),
    brands: z.union([z.string(), z.array(z.nativeEnum(Brand))]).optional(),
    categories: z
      .union([z.string(), z.array(z.nativeEnum(Category))])
      .optional(),
    colors: z.union([z.string(), z.array(z.nativeEnum(Colors))]).optional(),
    effects: z.union([z.string(), z.array(z.nativeEnum(Effects))]).optional(),
    searchTitle: z.string().optional(),
  }),
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.ensureQueryData(getOneProductQueryOptions({ id: productId }));
  },
});
