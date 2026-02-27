import React, { useMemo, useEffect } from "react";

const Calculator = ({
  people = 1,
  includeGuide = false,
  includeFood = false,
  includeTickets = false,
  pricingData,
  bufferRate = 0.05, // Оставляем буфер 5%
  onResult
}) => {
  
  const result = useMemo(() => {
    if (!pricingData) return null;

    // --- 1. ПАРСИНГ ТРАНСПОРТА ---
    const vehicles = pricingData.vehicles.map(v => ({
      name: v.vehicles,
      price: Number(v.price),
      capacity: v.vehicles === "Sedan" ? 4 : (v.vehicles === "Miniven" ? 7 : 20)
    }));

    const GUIDE_PRICE = 15000;
    const FOOD_PER_PERSON = 5000;
    const TICKET_PER_PERSON = Number(pricingData.ticket_per_person) || 0;

    // --- 2. ЛОГИКА ТРАНСПОРТА ---
    const totalSeatsNeeded = people + (includeGuide ? 1 : 0);
    let chosenVehicle = null;
    let vehicleCount = 1;

    // Поиск подходящего авто
    for (let vehicle of vehicles) {
      if (totalSeatsNeeded <= vehicle.capacity) {
        chosenVehicle = vehicle;
        vehicleCount = 1;
        break;
      }
    }

    // Если не влезли в самый большой — берем несколько самых больших
    if (!chosenVehicle) {
      const largestVehicle = vehicles[vehicles.length - 1];
      vehicleCount = Math.ceil(totalSeatsNeeded / largestVehicle.capacity);
      chosenVehicle = largestVehicle;
    }

    const transportCost = chosenVehicle.price * vehicleCount;

    // --- 3. РАСЧЕТ СЕБЕСТОИМОСТИ (x) ---
    const guideCost = includeGuide ? GUIDE_PRICE : 0;
    let extraCost = 0;

    if (includeFood) extraCost += FOOD_PER_PERSON * people;
    if (includeTickets) extraCost += TICKET_PER_PERSON * people;

    // Базовая стоимость + буфер (x)
    const baseCost = transportCost + guideCost + extraCost;
    const x = baseCost * (1 + bufferRate);

    // --- 4. ПРИМЕНЕНИЕ ФОРМУЛЫ (k) ---
    // Формула: k = (1.1 * x) / 0.78
    const finalPriceK = (1.1 * x) / 0.78;

    // --- 5. ДЕТАЛИЗАЦИЯ (Для отчетов или отображения) ---
    const turnoverTax = 0.10 * x;            // 10% от x
    const cleanProfit = 0.20 * finalPriceK;  // 20% от k
    const corporateTax = cleanProfit * 0.10; // 10% от прибыли

    return {
      vehicleType: chosenVehicle.name,
      vehicleCount,
      passengers: totalSeatsNeeded,
      transportCost: Math.round(transportCost),
      guideCost,
      extraCost,
      costPriceX: Math.round(x),
      turnoverTax: Math.round(turnoverTax),
      corporateTax: Math.round(corporateTax),
      cleanProfit: Math.round(cleanProfit),
      finalPrice: Math.round(finalPriceK),
      checkSum: Math.round(x + turnoverTax + cleanProfit + corporateTax)
    };

  }, [
    people,
    includeGuide,
    includeFood,
    includeTickets,
    bufferRate,
    pricingData
  ]);

  // Передача результата родителю
  useEffect(() => {
    if (onResult && result) {
      onResult(result);
    }
  }, [result, onResult]);

  return null; // Компонент не рендерит UI
};

export default Calculator;