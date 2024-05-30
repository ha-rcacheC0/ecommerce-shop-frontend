import { TProduct } from "../types";

export const ProductCard = ({ product }: { product: TProduct }) => {
  console.log("Image for " + product.title, product.image);
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
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
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};
