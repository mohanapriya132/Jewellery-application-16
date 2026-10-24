const API_URL = import.meta.env.VITE_API_URL;

/**
 * Dynamically loads a script into the document body
 * @param {string} src - The URL of the script to load
 * @returns {Promise<boolean>} - Resolves to true if loaded, false otherwise
 */
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Handles the complete Razorpay payment flow
 * @param {Object} orderDetails - The details of the order
 * @param {number} orderDetails.amount - Amount in INR (e.g., 500 for Rs 500)
 * @param {Object} userDetails - The user's details for the payment form
 * @param {string} userDetails.name - User's full name
 * @param {string} userDetails.email - User's email address
 * @param {string} userDetails.contact - User's phone number
 * @param {Function} onSuccess - Callback for successful payment
 * @param {Function} onFailure - Callback for failed payment
 */
export const initiateRazorpayPayment = async (orderDetails, userDetails, onSuccess, onFailure) => {
  try {
    // 1. Load Razorpay script
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      onFailure(new Error('SDK failed to load'));
      return;
    }

    // 2. Call backend to create the order
    const orderResponse = await fetch(`${API_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: orderDetails.amount, currency: 'INR' }),
    });

    const orderData = await orderResponse.json();

    if (!orderData.success) {
      alert(orderData.message || 'Server error. Are you online?');
      onFailure(new Error('Order creation failed'));
      return;
    }

    // 3. Setup Razorpay options
    const options = {
      key: orderData.key_id, // Key ID generated from backend
      amount: orderData.amount, // Amount in paise
      currency: orderData.currency,
      name: 'Aurelia Fine Jewellery',
      description: 'Test Transaction',
      image: 'https://cdn-icons-png.flaticon.com/512/3665/3665989.png', // Logo placeholder
      order_id: orderData.order_id, // Order ID from backend
      handler: async function (response) {
        try {
          // 4. Verify payment signature with backend
          const verifyResponse = await fetch(`${API_URL}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              // Pass customer details so backend can save them to Supabase
              customer_name: userDetails.name,
              customer_email: userDetails.email,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            onSuccess(verifyData);
          } else {
            alert('Payment verification failed.');
            onFailure(new Error('Verification failed'));
          }
        } catch (error) {
          console.error('Error during verification:', error);
          alert('Error during payment verification.');
          onFailure(error);
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.contact,
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#0D0D0D', // Obsidian color from theme
      },
    };

    // 5. Open Razorpay Checkout modal
    const paymentObject = new window.Razorpay(options);
    
    paymentObject.on('payment.failed', function (response) {
      console.error('Payment Failed:', response.error);
      alert(`Payment failed: ${response.error.description}`);
      onFailure(response.error);
    });

    paymentObject.open();
  } catch (error) {
    console.error('Payment initialization error:', error);
    onFailure(error);
  }
};
