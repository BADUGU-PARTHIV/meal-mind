import {
  useEffect,
  useState
} from "react";
import {
  Link
} from "react-router-dom";

import {
  deleteFavorite,
  getFavorites
} from "../../api/favoriteApi";
import {
  getImageUrl
} from "../../utils/imageUrl";

function Favorites() {

  const [favorites, setFavorites] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const loadFavorites =
    async () => {

      try {

        const response =
          await getFavorites();

        setFavorites(
          response.data
        );

      }

      catch (error) {

        console.log(error);

      }

      finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFavorites();

  }, []);

  const remove =
    async (id) => {

      try {

        await deleteFavorite(
          id
        );

        loadFavorites();

      }

      catch (error) {

        console.log(error);

      }

    };

  return (

    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          Favorite Recipes
        </h2>
        <Link
          to="/recipes"
          className="btn btn-outline-success"
        >
          Browse Recipes
        </Link>
      </div>

      {loading ? (
        <div className="alert alert-info">
          Loading favorites...
        </div>
      ) : (
        <div className="row g-4">

          {favorites.length > 0 ? (
            favorites.map(item => (

              <div
                className="col-md-4"
                key={item.id}
              >

                <div className="card h-100 shadow border-0">

                  {item.recipe_image ? (
                    <img
                      src={getImageUrl(item.recipe_image)}
                      alt={item.recipe_name}
                      className="card-img-top"
                      style={{
                        height: "210px",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center text-white"
                      style={{
                        height: "210px",
                        background:
                          "linear-gradient(135deg,#16a34a,#166534)"
                      }}
                    >
                      <h5>
                        Favorite
                      </h5>
                    </div>
                  )}

                  <div className="card-body d-flex flex-column">

                    <h5>
                      {item.recipe_name}
                    </h5>

                    <div className="d-flex gap-2 mt-auto">

                      <Link
                        to={`/recipe/${item.recipe_id}`}
                        className="btn btn-success w-100"
                      >
                        Open
                      </Link>

                      <button
                        className="btn btn-outline-danger"
                        onClick={() =>
                          remove(item.id)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info">
                No favorite recipes yet.
              </div>
            </div>
          )}

        </div>
      )}

    </div>

  );

}

export default Favorites;
