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
  const packageString = product.data?.package?.join("/");
  const productPackageString = product.data?.UnitProduct?.package?.join("/");
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
          {/* TODO:Create a util function to make these values look more human readable */}
          <h2>Category: {product.data?.Categories.name}</h2>
          <h2>Brand: {product.data?.Brands.name}</h2>
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
            <h2>Category: {product.data?.Categories.name}</h2>
            <h2>Brand: {product.data?.Brands.name}</h2>
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
                <p>Please sign-in to add product to cart</p>
              )}
            </div>
            <div className="flex flex-col justify-around items-start w-full h-[150px]">
              <p className="badge badge-secondary p-3">
                Unit Pkg: {productPackageString}
              </p>
              <h2 className="text-xl text-center badge badge-primary p-6">
                Unit: $
                {product.data?.UnitProduct
                  ? `${parseFloat(product.data?.UnitProduct.unitPrice).toFixed(2)}`
                  : " Case only"}
              </h2>
              {authState === "authenticated" ? (
                <>
                  {product.data?.UnitProduct && (
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
                  )}
                </>
              ) : (
                <p>Please sign-in to add product to cart</p>
              )}
            </div>
          </div>
          <iframe src={"www.youtube.com/embed/8Fe2-y-MQzs"}></iframe>
          <p className="text-base-content">
            Description:
            <br /> {product.data?.description}
          </p>
          <div className="flex justify-around text-base-content">
            <div className="w-1/2">
              <h2 className="text-xl underline">Colors:</h2>
              <ul className="flex flex-wrap gap-1">
                {product.data?.ColorStrings?.map(
                  (color: { name: string; id: string }) => (
                    <li key={color.id}>{color.name}</li>
                  )
                )}
              </ul>
            </div>
            <div className="w-1/2">
              <h2 className="text-xl underline">Effects:</h2>
              <ul className="flex flex-wrap gap-1">
                {product.data?.EffectStrings?.map(
                  (effect: { name: string; id: string }) => (
                    <li key={effect.id}>{effect.name}</li>
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
