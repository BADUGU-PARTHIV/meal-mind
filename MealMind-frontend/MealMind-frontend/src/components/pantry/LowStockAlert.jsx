function LowStockAlert({
  items
}) {

  const lowStock =

    items.filter(
      item =>
        Number(item.quantity)
        <=
        Number(item.low_stock_threshold)
    );

  if (
    lowStock.length === 0
  ) {

    return null;

  }

  return (

    <div
      className="alert alert-warning"
    >

      <strong>
        Low Stock:
      </strong>

      <ul>

        {

          lowStock.map(
            item => (

              <li
                key={item.id}
              >

                {item.item_name}

              </li>

            )
          )

        }

      </ul>

    </div>

  );

}

export default LowStockAlert;
