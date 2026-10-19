function NutritionCard({
  title,
  value,
  unit
}) {
  return (
    <div className="card shadow-sm">

      <div className="card-body">

        <h6>{title}</h6>

        <h3>
          {value}
          {unit}
        </h3>

      </div>

    </div>
  );
}

export default NutritionCard;