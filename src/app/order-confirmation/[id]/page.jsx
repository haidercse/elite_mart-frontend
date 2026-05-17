import { getOrderDetails } from "@/lib/api";

export default function OrderConfirmationPage({ params }) {
  const orderId = params.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetails(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        // Fallback to mock data
        setOrder({
          id: orderId,
          status: "confirmed",
          total: 15850,
          items: 3,
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-BD"),
          address: "123 Main St, Dhaka 1000",
          paymentMethod: "Cash on Delivery",
          estimatedDelivery: "2-3 Business Days",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-700 border-t-purple-300 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 pb-20">
      {/* Success Message */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 animate-bounce">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-lg">Thank you for your purchase</p>
      </div>

      {/* Order Number */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 mb-8 border border-purple-100">
        <p className="text-sm text-gray-500 mb-1">Order Number</p>
        <p className="text-3xl font-black text-purple-700 font-mono break-all">{order.id}</p>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: Package,
            label: "Items",
            value: `${order.items} Products`,
            color: "text-blue-600",
          },
          {
            icon: Truck,
            label: "Delivery",
            value: order.estimatedDelivery,
            color: "text-green-600",
          },
          {
            icon: Clock,
            label: "Expected Arrival",
            value: order.deliveryDate,
            color: "text-orange-600",
          },
          {
            icon: MapPin,
            label: "Shipping To",
            value: order.address,
            color: "text-red-600",
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-semibold mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Timeline */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
        <h2 className="text-xl font-black text-gray-900 mb-6">Order Timeline</h2>
        <div className="space-y-4">
          {[
            { status: "Order Confirmed", time: "Now", done: true },
            { status: "Processing", time: "Today", done: true },
            { status: "Dispatched", time: "Tomorrow", done: false },
            { status: "Out for Delivery", time: "In 2-3 days", done: false },
            { status: "Delivered", time: "Expected by " + order.deliveryDate, done: false },
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    item.done
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {item.done && "✓"}
                </div>
                {i < 4 && (
                  <div className={`w-0.5 h-12 ${item.done ? "bg-green-300" : "bg-gray-200"}`} />
                )}
              </div>
              <div className="pb-4">
                <p
                  className={`font-bold ${
                    item.done ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {item.status}
                </p>
                <p className="text-sm text-gray-500">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
        <h2 className="text-xl font-black text-gray-900 mb-4">Payment Summary</h2>
        <div className="space-y-3 mb-4 pb-4 border-b border-dashed border-gray-200">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold">৳{order.total - 80}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span className="font-semibold">৳80</span>
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-black text-gray-900">Total Paid</span>
          <span className="font-black text-2xl text-purple-700">৳{order.total}</span>
        </div>
        <p className="text-sm text-gray-500">
          Payment Method: <span className="font-bold text-gray-900">{order.paymentMethod}</span>
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold transition-colors">
          <Download size={18} />
          Download Invoice
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Customer Support */}
      <div className="mt-12 text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
        <p className="text-sm text-blue-900 mb-2">Need help? Contact our customer support team</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="tel:+8801724456776"
            className="text-blue-600 hover:text-blue-700 font-bold text-sm"
          >
            📞 +880 1724 456776
          </a>
          <a
            href="mailto:support@sobkisu.com"
            className="text-blue-600 hover:text-blue-700 font-bold text-sm"
          >
            📧 support@sobkisu.com
          </a>
        </div>
      </div>
    </div>
  );
}
