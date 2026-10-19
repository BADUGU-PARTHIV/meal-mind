import {
  useEffect,
  useState
} from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";
import {
  getProfile
} from "../../api/profileApi";
import {
  getImageUrl
} from "../../utils/imageUrl";

import "../../styles/navbar.css";

function Navbar() {

  const [open, setOpen] =
    useState(false);
  const [theme, setTheme] =
    useState(() => {
      const savedTheme =
        localStorage.getItem("theme");

      if (savedTheme) {
        return savedTheme;
      }

      return window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    });
  const [profileImageUrl, setProfileImageUrl] =
    useState("");

  const navigate =
    useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "theme",
      theme
    );
  }, [theme]);

  useEffect(() => {

    const loadProfileImage =
      async () => {

        try {

          const response =
            await getProfile();

          setProfileImageUrl(
            response.data.profile_image_url || ""
          );

        }

        catch (error) {

          console.log(error);

        }

      };

    const handleProfileUpdated =
      (event) => {

        setProfileImageUrl(
          event.detail?.profileImageUrl || ""
        );

      };

    loadProfileImage();

    window.addEventListener(
      "profile-updated",
      handleProfileUpdated
    );

    return () => {

      window.removeEventListener(
        "profile-updated",
        handleProfileUpdated
      );

    };

  }, []);

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    navigate(
      "/login"
    );

  };

  return (

    <div className="navbar">

      <div>

        <h3>
          Welcome Back 👋
        </h3>

        <p>
          Track nutrition and stay healthy
        </p>

      </div>

      <div className="navbar-actions">

        <button
          type="button"
          className={`theme-switch ${
            theme === "dark"
              ? "dark"
              : "light"
          }`}
          onClick={() =>
            setTheme(prev =>
              prev === "dark"
                ? "light"
                : "dark"
            )
          }
          aria-label="Toggle dark and light mode"
        >
          <span>
            Light
          </span>

          <span>
            Dark
          </span>

          <span className="theme-switch-thumb" />
        </button>

      <div className="profile-menu">

        <button
          type="button"
          className="profile-circle"
          onClick={() =>
            setOpen(prev => !prev)
          }
        >
          {
            profileImageUrl ?

            <img
              src={getImageUrl(profileImageUrl)}
              alt="Profile"
            />

            :

            "Me"

          }
        </button>

        {open && (
          <div className="profile-dropdown shadow">

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
            >
              👤 Profile
            </Link>

            <Link
              to="/diet-plan"
              onClick={() => setOpen(false)}
            >
              🥗 Nutrition Plan
            </Link>

            <button
              type="button"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>

          </div>
        )}

      </div>

      </div>

    </div>

  );

}

export default Navbar;
