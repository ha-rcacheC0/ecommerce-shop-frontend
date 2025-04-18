import { Link } from "@tanstack/react-router";
import { ShowProduct, ShowWithProducts } from "../types";

interface ShowCardProps {
  show: ShowWithProducts;
}

export const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
  const totalProducts = show.ShowProducts.reduce(
    (sum: number, product: ShowProduct) => sum + product.quantity,
    0
  );

  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
      <figure>
        <img
          src={show.image}
          alt={show.title}
          className="h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">{show.title}</h2>
          <div className="badge badge-secondary">{show.ShowType.name}</div>
        </div>
        <p className="text-md font-semibold text-primary">
          ${parseFloat(show.price).toFixed(2)}
        </p>
        <p className="text-sm">
          {show.description && show.description?.length > 100
            ? `${show.description.substring(0, 100)}...`
            : show.description}
        </p>
        <div className="text-sm text-gray-600 mt-2">
          {totalProducts} {totalProducts === 1 ? "product" : "products"}{" "}
          included
        </div>
        <div className="card-actions justify-end mt-4">
          <Link
            to="/shows/$showId"
            params={{ showId: show.id }}
            className="btn btn-primary btn-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
