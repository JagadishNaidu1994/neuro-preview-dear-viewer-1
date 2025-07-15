import React, { createContext, useContext, useState, useEffect } from "react";

interface CouponContextType {
  appliedCoupon: any;
  setAppliedCoupon: (coupon: any) => void;
  pointsToUse: number;
  setPointsToUse: (points: number) => void;
  discount: number;
  setDiscount: (discount: number) => void;
}

const CouponContext = createContext<CouponContextType>({
  appliedCoupon: null,
  setAppliedCoupon: () => {},
  pointsToUse: 0,
  setPointsToUse: () => {},
  discount: 0,
  setDiscount: () => {},
});

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [pointsToUse, setPointsToUse] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  // Persist to localStorage
  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon');
    const savedPoints = localStorage.getItem('pointsToUse');
    const savedDiscount = localStorage.getItem('discount');

    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (error) {
        console.error('Error parsing saved coupon:', error);
      }
    }
    if (savedPoints) {
      setPointsToUse(parseInt(savedPoints));
    }
    if (savedDiscount) {
      setDiscount(parseFloat(savedDiscount));
    }
  }, []);

  const updateAppliedCoupon = (coupon: any) => {
    setAppliedCoupon(coupon);
    if (coupon) {
      localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('appliedCoupon');
    }
  };

  const updatePointsToUse = (points: number) => {
    setPointsToUse(points);
    localStorage.setItem('pointsToUse', points.toString());
  };

  const updateDiscount = (discountAmount: number) => {
    setDiscount(discountAmount);
    localStorage.setItem('discount', discountAmount.toString());
  };

  return (
    <CouponContext.Provider
      value={{
        appliedCoupon,
        setAppliedCoupon: updateAppliedCoupon,
        pointsToUse,
        setPointsToUse: updatePointsToUse,
        discount,
        setDiscount: updateDiscount,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCouponContext must be used within a CouponProvider');
  }
  return context;
};