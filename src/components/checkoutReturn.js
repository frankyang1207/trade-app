import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { HStack } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { clearCart } from "../features/cartSlice";
import { useAuthContext } from "../context/authContext";

const CheckoutReturn = ({ changePage }) => {
  const [status, setStatus] = useState(null); // 'open' | 'complete'
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const dispatch = useDispatch();
  const { accessToken } = useAuthContext();

  // Fetch Stripe session status
  useEffect(() => {
    const sessionId = localStorage.getItem("session-id");
    if (!sessionId) return;

    fetch(process.env.REACT_APP_API + `/session-status?session_id=${sessionId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch((err) => console.log(err.message));
  }, [accessToken]);

  // Confirm order in backend (DB insert) AFTER payment complete
  const confirmOrder = async () => {
    const sessionId = localStorage.getItem("session-id");
    if (!sessionId) throw new Error("Missing session-id");

    if (!accessToken) throw new Error("Missing access token");

    const res = await fetch(process.env.REACT_APP_API + "/api/v1/orders/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        sessionId,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Order confirmation failed");
    return data; // { success: true, order_id: ... }
  };

  // React to status changes
  useEffect(() => {
    if (status === "open") {
      changePage("checkoutFormPage");
      return;
    }

    if (status === "complete") {
      (async () => {
        try {
          setConfirming(true);
          setConfirmError("");

          await confirmOrder(); // actually call it

          // only clear AFTER confirm succeeds
          localStorage.removeItem("cartItems");
          localStorage.removeItem("pending-cart");
          localStorage.removeItem("session-id");
          dispatch(clearCart());
        } catch (e) {
          console.error(e);
          setConfirmError(e.message || "Failed to confirm order");
        } finally {
          setConfirming(false);
        }
      })();
    }
  }, [status, dispatch, changePage]); 

  if (status === "complete") {
    return (
      <section style={{ marginTop: "160px" }}>
        <h1 style={{ fontSize: "56px" }}>Thank you.</h1>

        {confirming ? (
          <h3>Finalizing your order…</h3>
        ) : confirmError ? (
          <>
            <h3>Payment succeeded, but we couldn’t save your order.</h3>
            <p style={{ color: "crimson" }}>{confirmError}</p>
            <p
              onClick={() => changePage("checkoutFormPage")}
              style={{ color: "teal", cursor: "pointer" }}
            >
              Try again
            </p>
          </>
        ) : (
          <>
            <h3>Your order was completed successfully.</h3>
            <HStack w="600px" alignContent="center" m="60px auto 30px" spacing={8}>
              <FontAwesomeIcon icon={faTruckFast} color="teal" size="3x" />
              <p>
                Your payment was successful and your order has been saved. Please keep
                your Stripe receipt for your records.
              </p>
            </HStack>
            <p
              onClick={() => changePage("productsSectionPage")}
              style={{ color: "teal", cursor: "pointer" }}
            >
              continue shopping
            </p>
          </>
        )}
      </section>
    );
  }

  return null;
};

export default CheckoutReturn;
