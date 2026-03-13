import { getAdminOrders } from "@/lib/admin";
import { formatCurrency } from "@/lib/utils";
import { updateOrderAction } from "@/app/admin/productos/actions";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Pedidos</p>
      <h1 className="mt-4 font-serif text-5xl text-brand-900">Gestion comercial y operativa</h1>
      <div className="mt-8 grid gap-4">
        {orders.map((order) => (
          <article key={order.orderNumber} className="rounded-[1.5rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-serif text-3xl text-brand-900">{order.orderNumber}</p>
                <p className="mt-2 text-sm text-brand-900/68">{order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : order.email}</p>
                <p className="mt-2 text-sm text-brand-900/58">{order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.province}` : "Sin direccion"}</p>
              </div>
              <div className="grid gap-2 text-sm text-brand-900/72 md:text-right">
                <p>Total: {formatCurrency(order.total)}</p>
                <p>Pago: {order.paymentStatus.toLowerCase()}</p>
                <p>Envio: {order.shippingStatus.toLowerCase()}</p>
              </div>
            </div>
            <form action={updateOrderAction} className="mt-5 grid gap-4 rounded-[1.25rem] border border-brand-900/10 bg-white p-4 md:grid-cols-4">
              <input type="hidden" name="orderId" value={order.id} />
              <Select name="status" label="Pedido" defaultValue={order.status} options={["PENDING","CONFIRMED","IN_PREPARATION","SHIPPED","DELIVERED","CANCELLED"]} />
              <Select name="paymentStatus" label="Pago" defaultValue={order.paymentStatus} options={["PENDING","PAID","REJECTED","EXPIRED","MANUAL_REVIEW","REFUNDED"]} />
              <Select name="shippingStatus" label="Envio" defaultValue={order.shippingStatus} options={["PENDING","QUOTED","READY","SHIPPED","DELIVERED","FAILED"]} />
              <label>
                <span className="mb-2 block text-sm text-brand-900/75">Tracking</span>
                <input name="trackingCode" defaultValue={order.shipments[0]?.trackingCode ?? ""} className="w-full rounded-[0.9rem] border border-brand-900/12 px-3 py-2 text-sm" />
              </label>
              <button type="submit" className="md:col-span-4 inline-flex items-center justify-center rounded-full bg-brand-900 px-4 py-2 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-brand-700">Guardar cambios</button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}

function Select({ name, label, defaultValue, options }: { name: string; label: string; defaultValue: string; options: string[] }) {
  return (
    <label>
      <span className="mb-2 block text-sm text-brand-900/75">{label}</span>
      <select name={name} defaultValue={defaultValue} className="w-full rounded-[0.9rem] border border-brand-900/12 px-3 py-2 text-sm">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
