
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
      // Check if sample data already exists
      const { data: existingOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      if (existingOrders && existingOrders.length > 0) {
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

      const { data: addressData, error: addressError } = await supabase
        .from("user_addresses")
        .insert(sampleAddresses)
        .select();

      if (addressError) throw addressError;

      // Create sample products if they don't exist
      const { data: existingProducts } = await supabase
        .from("products")
        .select("*")
        .limit(1);

      let productIds = [];

      if (!existingProducts || existingProducts.length === 0) {
        const sampleProducts = [
          {
            
          },
        ];

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select();

        if (productError) throw productError;
        productIds = productData.map(p => p.id);
      } else {
        const { data: allProducts } = await supabase
          .from("products")
          .select("id")
          .limit(3);
        productIds = allProducts?.map(p => p.id) || [];
      }

      // Create sample orders
      const sampleOrders = [
        {
          user_id: user.id,
          total_amount: 64.00,
          status: "delivered",
          shipping_address: addressData?.[0] || sampleAddresses[0],
        },
        {
          user_id: user.id,
          total_amount: 32.00,
          status: "shipped",
          shipping_address: addressData?.[0] || sampleAddresses[0],
        },
        {
          user_id: user.id,
          total_amount: 96.00,
          status: "processing",
          shipping_address: addressData?.[1] || sampleAddresses[1],
        },
      ];

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert(sampleOrders)
        .select();

      if (orderError) throw orderError;

      // Create sample order items
      if (orderData && productIds.length > 0) {
        const sampleOrderItems = [
          // Order 1 items
          {
            order_id: orderData[0].id,
            product_id: productIds[0],
            quantity: 2,
            price: 32.00,
          },
          // Order 2 items
          {
            order_id: orderData[1].id,
            product_id: productIds[1],
            quantity: 1,
            price: 32.00,
          },
          // Order 3 items
          {
            order_id: orderData[2].id,
            product_id: productIds[0],
            quantity: 1,
            price: 32.00,
          },
          {
            order_id: orderData[2].id,
            product_id: productIds[2],
            quantity: 2,
            price: 32.00,
          },
        ];

        const { error: orderItemsError } = await supabase
          .from("order_items")
          .insert(sampleOrderItems);

        if (orderItemsError) throw orderItemsError;
      }

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

      console.log("Sample data created successfully");
    } catch (error) {
      console.error("Error creating sample data:", error);
    }
  };

  return null;
};

