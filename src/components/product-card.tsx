import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TProduct } from "../types";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

export const ProductCard = ({ product }: { product: TProduct }) => {
  console.log(product.package);
  const packageString = product.package.join(", ");
  return (
    <div className="card w-96 bg-base-100 shadow-xl max-h-96">
      <figure>
        <img src={product.image} alt={`image for ${product.title}`} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.title}
          <div className="badge badge-secondary">{product.casePrice}</div>
        </h2>
        <p>{product.description}</p>
        <div className="card-actions justify-end">
          <div className="mr-auto flex flex-col gap-3">
            <div className="badge badge-accent "> SKU {product.id}</div>
            <div className="badge badge-accent mr-auto">
              Packaged: {packageString}
            </div>
          </div>
          <button className="btn btn-primary">
            Add To Cart <FontAwesomeIcon icon={faCartPlus} />
          </button>
        </div>
      </div>
    </div>
  );
};
