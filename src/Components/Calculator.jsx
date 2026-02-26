import React, { useMemo } from "react";
import "./Calculator.css"

const Calculator = ({
  people = 1,
  includeGuide = false,
  includeFood = false,
  includeTickets = false,
  pricingData,
  margin = 0.2,
  taxRate = 0.05,
  bufferRate = 0.05,
  onResult
}) => {
    

  const result = useMemo(() => {

    if (!pricingData) return null;

    // --- Vehicle fleet ---
    const vehicles = pricingData.vehicles.map(v => ({
      name: v.vehicles,
      price: Number(v.price),
      capacity: v.vehicles === "Sedan" ? 4 : (v.vehicles === "Miniven" ? 7 : 20)
    }));

    const GUIDE_PRICE = 15000;
    const FOOD_PER_PERSON = 5000;
    const TICKET_PER_PERSON = Number(pricingData.ticket_per_person);

    // 1️⃣ Total passengers (guide takes seat)
    const passengers = people + (includeGuide ? 1 : 0);

    // 2️⃣ Choose best vehicle
    let chosenVehicle = null;
    let vehicleCount = 1;

    for (let vehicle of vehicles) {
      if (passengers <= vehicle.capacity) {
        chosenVehicle = vehicle;
        vehicleCount = 1;
        break;
      }
    }

    // 3️⃣ If no single vehicle fits
    if (!chosenVehicle) {
      const largestVehicle = vehicles[vehicles.length - 1];
      vehicleCount = Math.ceil(passengers / largestVehicle.capacity);
      chosenVehicle = largestVehicle;
    }

    const transportCost = chosenVehicle.price * vehicleCount;

    // 4️⃣ Guide cost
    const guideCost = includeGuide ? GUIDE_PRICE : 0;

    // 5️⃣ Extra costs
    let extraCost = 0;

    if (includeFood) {
      extraCost += FOOD_PER_PERSON * people;
    }

    if (includeTickets) {
      extraCost += TICKET_PER_PERSON * people;
    }

    // 6️⃣ Base cost
    const costBeforeBuffer = transportCost + guideCost + extraCost;
    const buffer = costBeforeBuffer * bufferRate;
    const totalCost = costBeforeBuffer + buffer;

    // 7️⃣ Apply margin
    const priceWithoutTax = totalCost / (1 - margin);

    // 8️⃣ Add tax
    const tax = priceWithoutTax * taxRate;
    const finalPrice = priceWithoutTax + tax;

    // 9️⃣ Clean profit
    const cleanProfit = priceWithoutTax - totalCost;

    return {
      vehicleType: chosenVehicle.name,
      vehicleCount,
      passengers,
      transportCost: Math.round(transportCost),
      guideCost,
      extraCost,
      totalCostWithBuffer: Math.round(totalCost),
      priceBeforeTax: Math.round(priceWithoutTax),
      tax: Math.round(tax),
      finalPrice: Math.round(finalPrice),
      cleanProfit: Math.round(cleanProfit)
    };

  }, [
    people,
    includeGuide,
    includeFood,
    includeTickets,
    margin,
    taxRate,
    bufferRate,
    pricingData
  ]);

  // Send result to parent (BookForm)
  React.useEffect(() => {
    if (onResult) {
      onResult(result);
    }
  }, [result, onResult]);

  return null; // No UI — logic only
};

export default Calculator;