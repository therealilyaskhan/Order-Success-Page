async function fetchData() {
  // Extract the session_id from the query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("session_id");

  if (!sessionId) {
    console.error("No session_id found in query parameters");
    return;
  }

  try {
    // Make the GET request to your endpoint
    const response = await fetch(
      `https://session-retriev-git-3342f5-therealilyaskhanhotmailcoms-projects.vercel.app/order/success?session_id=${sessionId}`
    );

    // Check if the response is okay (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // Parse the JSON data
    const data = await response.json();
    const amount = (data.amount_subtotal / 100).toFixed(2); // Assuming the amount is in cents or a smaller unit
    // Trigger the Facebook Pixel Purchase event with the fetched data
    console.log(data.currency.toUpperCase());
    // Check if Facebook Pixel is initialized
    if (typeof fbq === "function") {
      fbq("track", "Purchase", {
        currency: data.currency.toUpperCase(),
        value: amount,
      });
    } else {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );
      fbq("init", "536006748934294");
      fbq("track", "Purchase", {
        currency: data.currency.toUpperCase(),
        value: amount,
      });
    }
    // display the order details container as soon as the data is fetched:
    document.getElementById("order-details-container").classList.add("visible");
    // Populate the customer email and name
    document.getElementById("order-details-email").textContent =
      data.customer_details.email;
    document.getElementById("order-details-name").textContent =
      data.customer_details.name;
    document.getElementById("order-success-customer-name").textContent =
      ", " + data.customer_details.name;

    // Populate the shipping address details
    document.getElementById("order-details-line-1").textContent =
      data.shipping_details.address.line1;
    document.getElementById("order-details-line-2").textContent =
      data.shipping_details.address.line2;
    document.getElementById(
      "order-details-city-postal"
    ).textContent = `${data.shipping_details.address.city}, ${data.shipping_details.address.postal_code}`;
    document.getElementById("order-details-country").textContent =
      data.shipping_details.address.country;

    // Populate the payment details
    document.getElementById(
      "order-details-amount-currency"
    ).textContent = `${amount} ${data.currency.toUpperCase()}`;

    // Populate the shipping method or payment status (as needed)
    document.getElementById("order-details-payment-status").textContent =
      data.payment_status;

    // Process the JSON data here
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call the async function
fetchData();
