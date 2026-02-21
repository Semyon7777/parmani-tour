import React from "react";

const TourCalculator = ({
  tour,
  peopleCount,
  hasGuide,
  food,
  tickets
}) => {

  const calculatePrice = () => {
    if (!tour?.pricing || !peopleCount) return 0;

    const type = hasGuide ? "transfer_guide" : "transfer_only";
    const ranges = tour.pricing[type];

    const matched = ranges.find(
      (r) => peopleCount >= r.min && peopleCount <= r.max
    );

    if (!matched) return 0;

    let total = matched.price;

    if (food) {
      total += tour.pricing.food_per_person * peopleCount;
    }

    if (tickets) {
      total += tour.pricing.ticket_per_person * peopleCount;
    }

    return total;
  };

  return (
    <div className="mt-3 fw-bold">
      Total: {calculatePrice()} ֏
    </div>
  );
};

export default TourCalculator;
