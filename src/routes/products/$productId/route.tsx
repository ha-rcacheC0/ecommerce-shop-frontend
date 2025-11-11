import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useParams,
  Link,
  useSearch,
} from "@tanstack/react-router";
import { getOneProductQuery } from "@api/products/products";
import { getOneProductQueryOptions } from "@api/products/productsQueries";
import { useAuth } from "@providers/auth.provider";
import { useAddItemToCartMutation } from "@api/cart/cartQueries";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";

const SingleProductPage = () => {
  const { productId } = useParams({ from: "/products/$productId" });
  const { user, authState } = useAuth();
  const search = useSearch({ from: "/products/$productId" });

  const product = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getOneProductQuery({ id: productId }),
  });

  const userCartId = user?.userInfo?.cart!.id;
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
  const packageString = product.data?.package?.join("/");
  const productPackageString = product.data?.unitProduct?.package?.join("/");
  return (
    <>
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
        className="btn btn-outline btn-sm m-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to Products
      </Link>

      <div className="p-10 w-full flex items-center justify-around bg-base-100 max-lg:flex-col">
        <div className="flex gap-4 w-full justify-between text-base-content lg:hidden">
          <h2>Category: {product.data?.category.name}</h2>
          <h2>Brand: {product.data?.brand.name}</h2>
        </div>
        <h1 className="text-3xl font-bold text-base-content underline lg:hidden">
          {product.data?.title}
        </h1>
        <div>
          <img
            className="max-w-[520px] w-full h-[520px] object-center object-contain"
            src={product.data?.image}
            alt={product.data?.title}
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-base-content underline max-lg:hidden">
            {product.data?.title}
          </h1>
          <div className="flex gap-4 w-full justify-between text-base-content max-lg:hidden">
            <h2>Category: {product.data?.category.name}</h2>
            <h2>Brand: {product.data?.brand.name}</h2>
          </div>

          <div className="flex gap-4 w-full justify-center">
            <div className="flex flex-col justify-around items-start w-full h-[150px]">
              <p className="badge badge-secondary p-3">
                Case Pkg: {packageString}
              </p>
              <h2 className="text-xl text-center badge badge-primary p-6">
                Case: ${parseFloat(product.data!.casePrice).toFixed(2)}
              </h2>
              {authState === "authenticated" ? (
                product.data?.inStock ? (
                  <button
                    className="btn lg:btn-wide btn-secondary"
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
                ) : (
                  <div className="text-error font-bold">
                    Item is out of stock
                  </div>
                )
              ) : (
                <p>Please sign-in to add product to cart</p>
              )}
            </div>
            <div className="flex flex-col justify-around items-start w-full h-[150px]">
              <p className="badge badge-secondary p-3">
                Unit Pkg: {productPackageString}
              </p>
              <h2 className="text-xl text-center badge badge-primary p-6">
                Unit: $
                {product.data?.unitProduct
                  ? `${parseFloat(product.data?.unitProduct.unitPrice).toFixed(2)}`
                  : " Case only"}
              </h2>
              {authState === "authenticated" ? (
                <>
                  {product.data?.unitProduct ? (
                    product.data?.inStock ? (
                      <button
                        className="btn lg:btn-wide btn-secondary"
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
                    ) : (
                      <div className="text-error font-bold">
                        Item is out of stock
                      </div>
                    )
                  ) : null}
                </>
              ) : (
                <p>Please sign-in to add product to cart</p>
              )}
            </div>
          </div>
          {product.data?.videoURL && (
            <iframe
              src={product.data.videoURL.replace("watch?v=", "embed/")}
              className="w-full aspect-video"
              title={`${product.data.title} video`}
              allowFullScreen
            ></iframe>
          )}
          <p className="text-base-content">
            Description:
            <br /> {product.data?.description}
          </p>
          <div className="flex justify-around text-base-content">
            <div className="w-1/2">
              <h2 className="text-xl underline">Colors:</h2>
              <ul className="flex flex-wrap gap-1">
                {product.data?.colors?.map(
                  (color: { id: string; name: string }) => (
                    <li key={color.id} className="badge badge-outline mr-1">
                      {color.name}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="w-1/2">
              <h2 className="text-xl underline">Effects:</h2>
              <ul className="flex flex-wrap gap-1">
                {product.data?.effects?.map(
                  (effect: { id: string; name: string }) => (
                    <li key={effect.id} className="badge badge-outline mr-1">
                      {effect.name}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute("/products/$productId")({
  component: () => <SingleProductPage />,
  validateSearch: z.object({
    page: z.coerce.number(),
    pageSize: z.coerce.number(),
    brands: z.union([z.string(), z.array(z.string())]).optional(),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    colors: z.union([z.string(), z.array(z.string())]).optional(),
    effects: z.union([z.string(), z.array(z.string())]).optional(),
    searchTitle: z.string().optional(),
  }),
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.ensureQueryData(getOneProductQueryOptions({ id: productId }));
  },
});
