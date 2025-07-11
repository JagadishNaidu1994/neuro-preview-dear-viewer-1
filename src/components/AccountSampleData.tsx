
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";

const AccountSampleData = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      createSampleData();
    }
  }, [user]);

  const createSampleData = async () => {
    if (!user) return;

    try {
      // Check if sample data already exists for addresses
      const { data: existingAddresses } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      if (existingAddresses && existingAddresses.length > 0) {
        console.log("Sample data already exists");
        return;
      }

      // Create sample addresses
      const sampleAddresses = [
        {
          user_id: user.id,
          name: "John Doe",
          phone: "+1 (555) 123-4567",
          address_line_1: "123 Main Street",
          address_line_2: "Apt 4B",
          city: "New York",
          state: "NY",
          pincode: "10001",
          is_default: true,
        },
        {
          user_id: user.id,
          name: "John Doe",
          phone: "+1 (555) 987-6543",
          address_line_1: "456 Oak Avenue",
          city: "Los Angeles",
          state: "CA",
          pincode: "90210",
          is_default: false,
        },
      ];

      const { error: addressError } = await supabase
        .from("user_addresses")
        .insert(sampleAddresses);

      if (addressError) throw addressError;

      // Create sample payment methods
      const samplePaymentMethods = [
        {
          user_id: user.id,
          card_type: "Visa",
          card_last_four: "4532",
          card_holder_name: "John Doe",
          expiry_month: 12,
          expiry_year: 2026,
          is_default: true,
        },
        {
          user_id: user.id,
          card_type: "MasterCard",
          card_last_four: "8901",
          card_holder_name: "John Doe",
          expiry_month: 8,
          expiry_year: 2025,
          is_default: false,
        },
      ];

      const { error: paymentError } = await supabase
        .from("user_payment_methods")
        .insert(samplePaymentMethods);

      if (paymentError) throw paymentError;

      // Create sample user rewards
      const { error: rewardsError } = await supabase
        .from("user_rewards")
        .insert({
          user_id: user.id,
          points_balance: 250,
          total_earned: 400,
          total_redeemed: 150,
        });

      if (rewardsError && rewardsError.code !== '23505') throw rewardsError; // Ignore duplicate key errors

      console.log("Sample data created successfully (addresses, payment methods, and rewards only)");
    } catch (error) {
      console.error("Error creating sample data:", error);
    }
  };

  return null;
};

export default AccountSampleData;
