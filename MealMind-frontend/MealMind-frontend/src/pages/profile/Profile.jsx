import {useState,useEffect} from "react";
import {updateProfile,getProfile,resetProfile}
from "../../api/profileApi";
import { useNavigate }
from "react-router-dom";
import {
  getImageUrl
} from "../../utils/imageUrl";

function Profile() {

  const navigate =
    useNavigate();

  const [profile,
    setProfile] =
    useState({

      age: "",

      gender: "",

      height: "",

      weight: "",

      bodyFat: "",

      goalWeight: "",

      goalBodyFat: "",

      goal: "Bulk",

      dietType: "Non-Veg",

      allergy: "",

      profileImageUrl: "",

      profileImageData: "",

      activityLevel: "Moderate",

      mealsPerDay: 4

    });

  const emptyProfile = {

      age: "",

      gender: "",

      height: "",

      weight: "",

      bodyFat: "",

      goalWeight: "",

      goalBodyFat: "",

      goal: "",

      dietType: "",

      allergy: "",

      profileImageUrl: "",

      profileImageData: "",

      activityLevel: "",

      mealsPerDay: 0

    };

  const handleChange =
    (e) => {

      setProfile({

        ...profile,

        [e.target.name]:
          e.target.value

      });

    };

  const handleProfileImage =
    (event) => {

      const file =
        event.target.files?.[0];

      if (!file) {

        return;

      }

      if (!file.type.startsWith("image/")) {

        alert(
          "Please choose a valid image file."
        );

        return;

      }

      const reader =
        new FileReader();

      reader.onload = () => {

        setProfile(prev => ({

          ...prev,

          profileImageData:
            reader.result,

          profileImageUrl:
            reader.result

        }));

      };

      reader.readAsDataURL(file);

    };

  const loadProfile =
  async () => {

    try {

      const response =
        await getProfile();

      const data =
        response.data;

      setProfile({

        age:
          data.age || "",

        gender:
          data.gender || "",

        height:
          data.height || "",

        weight:
          data.weight || "",

        bodyFat:
          data.body_fat_percentage || "",

        goalWeight:
          data.target_weight || "",


        goalBodyFat:
          data.goal_body_fat_percentage || "",

        goal:
          data.goal || "Bulk",

        dietType:
          data.diet_type || "Non-Veg",

        allergy:
          data.allergy || "",

        profileImageUrl:
          data.profile_image_url || "",

        profileImageData: "",

        activityLevel:
          data.activity_level || "Moderate",

        mealsPerDay:
          data.meals_per_day || 4

      });

    }

    catch (error) {

      console.log(
        "Profile Load Error",
        error
      );

    }

};

useEffect(() => {

  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadProfile();

}, []);

const saveProfile = async () => {

  const payload = {

    age: Number(profile.age),
    gender: profile.gender,
    height: Number(profile.height),
    weight: Number(profile.weight),

    body_fat_percentage:
      Number(profile.bodyFat || 0),

    goal_body_fat_percentage:
      Number(profile.goalBodyFat || 0),

    goal: profile.goal,

    diet_type:
      profile.dietType,

    gym_status: "Yes",

    activity_level:
      profile.activityLevel,

    target_weight:
      Number(profile.goalWeight || 0),

    allergy:
      profile.allergy || null,

    deficiency: null,

    meals_per_day:
      Number(profile.mealsPerDay),

    profile_image_data:
      profile.profileImageData || null,

    profile_image_url:
      profile.profileImageData
        ? null
        : profile.profileImageUrl || null

  };

  try {

    const response =
      await updateProfile(payload);

    const savedImage =
      response.data.profile_image_url ||
      profile.profileImageUrl;

    setProfile(prev => ({

      ...prev,

      profileImageUrl:
        savedImage,

      profileImageData: ""

    }));

    window.dispatchEvent(
      new CustomEvent(
        "profile-updated",
        {
          detail: {
            profileImageUrl:
              savedImage
          }
        }
      )
    );

    alert(
      "Profile Saved Successfully"
    );

  }

  catch {

    alert(
      "Profile Save Failed"
    );

  }

};

const handleLogout = () => {

  localStorage.removeItem(
    "token"
  );

  navigate(
    "/login"
  );

};

const handleResetProfile = async () => {

  const confirmed =
    window.confirm(
      "Are you sure you want to reset your profile? Your age, height, weight, goals, diet type, activity level, meals per day, and saved nutrition targets will be cleared. Your login account will remain safe."
    );

  if (!confirmed) {

    return;

  }

  try {

    await resetProfile();

    setProfile(
      emptyProfile
    );

    alert(
      "Profile reset successfully. Your login data is still safe."
    );

  }

  catch {

    alert(
      "Unable to reset profile. Please try again."
    );

  }

};

  const generatePlan = async (e) => {

  e.preventDefault();

  if (
    !profile.age ||
    !profile.gender ||
    !profile.height ||
    !profile.weight
  ) {

    alert(
      "Please fill Age, Gender, Height and Weight"
    );

    return;

  }

  if (
    Number(profile.height) < 100 ||
    Number(profile.height) > 250
  ) {

    alert(
      "Height must be in cm (100 - 250)"
    );

    return;

  }

  const payload = {

    age:
      Number(profile.age),

    gender:
      profile.gender,

    height:
      Number(profile.height),

    weight:
      Number(profile.weight),

    body_fat_percentage:
      Number(profile.bodyFat || 0),

    goal_body_fat_percentage:
      Number(profile.goalBodyFat || 0),

    goal:
      profile.goal,

    diet_type:
      profile.dietType,

    gym_status:
      "Yes",

    activity_level:
      profile.activityLevel,

    target_weight:
      Number(
        profile.goalWeight || 0
      ),

    allergy:
      profile.allergy || null,

    deficiency:
      null,

    meals_per_day:
      Number(profile.mealsPerDay),

    profile_image_data:
      profile.profileImageData || null,

    profile_image_url:
      profile.profileImageData
        ? null
        : profile.profileImageUrl || null

  };

  try {

    console.log(
      "Sending Payload:",
      payload
    );

    const response =
    await updateProfile(
      payload
    );

    const savedImage =
      response.data.profile_image_url ||
      profile.profileImageUrl;

    window.dispatchEvent(
      new CustomEvent(
        "profile-updated",
        {
          detail: {
            profileImageUrl:
              savedImage
          }
        }
      )
    );

    navigate("/diet-plan");

  }

  catch (error) {

    console.log(error);

    alert(

      error?.response?.data?.message ||

      "Profile Save Failed"

    );

  }

};

  return (

    <div className="container mt-4">

  <div
    className="card shadow border-0"
    style={{
      borderRadius: "20px"
    }}
  >
<div className="card-body p-4">

  <div className="text-center mb-4">

    <h2 className="fw-bold">

      👤 Profile Setup

    </h2>

    <p className="text-muted">

      Personalize your nutrition plan

    </p>

  </div>

  <form
    onSubmit={generatePlan}
  >

    <div className="text-center mb-4">

      <div
        className="mx-auto mb-3 profile-photo-preview"
      >

        {
          profile.profileImageUrl ?

          <img
            src={getImageUrl(profile.profileImageUrl)}
            alt="Profile"
          />

          :

          <span>
            Me
          </span>

        }

      </div>

      <label className="fw-bold">
        Profile Photo
      </label>

      <input
        type="file"
        accept="image/*"
        className="form-control mt-2"
        onChange={handleProfileImage}
      />

      <small className="text-muted d-block mt-2">
        Upload a photo to show it in the top-right profile circle.
      </small>

    </div>

    <div className="row mb-4">

      <div className="col-md-4">

        <div className="card border-0 bg-light">

          <div className="card-body text-center">

            <h6>
              Current Weight
            </h6>

            <h3>

              {profile.weight || 0} kg

            </h3>

          </div>

        </div>

      </div>

      <div className="col-md-4">

        <div className="card border-0 bg-light">

          <div className="card-body text-center">

            <h6>
              Goal Weight
            </h6>

            <h3>

              {profile.goalWeight || 0} kg

            </h3>

          </div>

        </div>

      </div>

      <div className="col-md-4">

        <div className="card border-0 bg-light">

          <div className="card-body text-center">

            <h6>
              Daily Meals
            </h6>

            <h3>

              {profile.mealsPerDay}

            </h3>

          </div>

        </div>

      </div>

    </div>

    <div className="row">

      <div className="col-md-6">

        <label className="fw-bold">
          Age
        </label>

        <input
          type="number"
          name="age"
          className="form-control mb-3"
          value={profile.age}
          onChange={handleChange}
        />

      </div>

      <div className="col-md-6">

        <label className="fw-bold">
          Gender
        </label>

        <select
          name="gender"
          className="form-select mb-3"
          value={profile.gender}
          onChange={handleChange}
        >

          <option value="">
            Select Gender
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>

        </select>

      </div>

    </div>

    <div className="row">

      <div className="col-md-6">

        <label className="fw-bold">
          Height (cm)
        </label>

        <input
          type="number"
          name="height"
          className="form-control mb-3"
          value={profile.height}
          onChange={handleChange}
        />

      </div>

      <div className="col-md-6">

        <label className="fw-bold">
          Current Weight (kg)
        </label>

        <input
          type="number"
          name="weight"
          className="form-control mb-3"
          value={profile.weight}
          onChange={handleChange}
        />

      </div>

    </div>

    <div className="row">

      <div className="col-md-6">

        <label className="fw-bold">
          Body Fat %
        </label>

        <input
          type="number"
          name="bodyFat"
          className="form-control mb-3"
          value={profile.bodyFat}
          onChange={handleChange}
        />

      </div>

      <div className="col-md-6">

        <label className="fw-bold">
          Goal Body Fat %
        </label>

        <input
          type="number"
          name="goalBodyFat"
          className="form-control mb-3"
          value={profile.goalBodyFat}
          onChange={handleChange}
        />

      </div>

    </div>

    <div className="row">

      <div className="col-md-6">

        <label className="fw-bold">
          Goal Weight
        </label>

        <input
          type="number"
          name="goalWeight"
          className="form-control mb-3"
          value={profile.goalWeight}
          onChange={handleChange}
        />

      </div>

      <div className="col-md-6">

        <label className="fw-bold">
          Goal
        </label>

        <select
          name="goal"
          className="form-select mb-3"
          value={profile.goal}
          onChange={handleChange}
        >

          <option value="">
            Select Goal
          </option>

          <option>
            Bulk
          </option>

          <option>
            Maintain
          </option>

          <option>
            Cut
          </option>

        </select>

      </div>

    </div>

    <div className="row">

      <div className="col-md-6">

        <label className="fw-bold">
          Diet Type
        </label>

        <select
          name="dietType"
          className="form-select mb-3"
          value={profile.dietType}
          onChange={handleChange}
        >

          <option value="">
            Select Diet Type
          </option>

          <option>
            Non-Veg
          </option>

          <option>
            Veg
          </option>

          <option>
            Vegan
          </option>

        </select>

      </div>

      <div className="col-md-6">

        <label className="fw-bold">
          Activity Level
        </label>

        <select
          name="activityLevel"
          className="form-select mb-3"
          value={profile.activityLevel}
          onChange={handleChange}
        >

          <option value="">
            Select Activity Level
          </option>

          <option>
            Sedentary
          </option>

          <option>
            Moderate
          </option>

          <option>
            Active
          </option>

        </select>

      </div>

    </div>

    <div className="row">

      <div className="col-md-12">

        <label className="fw-bold">
          Allergy
        </label>

        <input
          name="allergy"
          className="form-control mb-3"
          value={profile.allergy}
          onChange={handleChange}
          placeholder="Example: Milk, Peanut, Egg"
        />

        <small className="text-muted d-block mb-3">
          Add one or more allergies separated by commas. MealMind will avoid these in your recipes and meal planner.
        </small>

      </div>

    </div>

    <label className="fw-bold">
      Meals Per Day
    </label>

    <select
      name="mealsPerDay"
      className="form-select mb-4"
      value={profile.mealsPerDay}
      onChange={handleChange}
    >

      <option value="3">
        3 Meals
      </option>

      <option value="4">
        4 Meals
      </option>

      <option value="5">
        5 Meals
      </option>

      <option value="6">
        6 Meals
      </option>

    </select>

    <button
  type="button"
  className="btn btn-primary btn-lg w-100 mb-3"
  onClick={saveProfile}
>
  💾 Save Profile
</button>

    <button
      className="btn btn-success btn-lg w-100"
    >

      🚀 Generate Monthly Nutrition Plan

    </button>

    <button
      type="button"
      className="btn btn-outline-warning btn-lg w-100 mt-3"
      onClick={handleResetProfile}
    >

      🔄 Reset Profile

    </button>

    <button
      type="button"
      className="btn btn-outline-danger btn-lg w-100 mt-3"
      onClick={handleLogout}
    >

      🚪 Logout

    </button>

  </form>

</div>

  </div>

</div>


  );

}

export default Profile;
