import { getAdminOrders } from "@/lib/admin";
import { ActionFeedback } from "@/components/admin/action-feedback";
import { formatCurrency } from "@/lib/utils";
import { updateOrderAction } from "@/app/admin/productos/actions";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    payment?: string;
    feedback?: string;
  }>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const orders = await getAdminOrders();
  const query = (params.q ?? "").trim().toLowerCase();
  const status = params.status ?? "all";
  const payment = params.payment ?? "all";

  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer ? `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase() : "";
    const matchesQuery =
      query.length === 0 ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query) ||
      customerName.includes(query) ||
      (order.shipments[0]?.trackingCode ?? "").toLowerCase().includes(query);

    const matchesStatus = status === "all" || order.status === status;
    const matchesPayment = payment === "all" || order.paymentStatus === payment;

    return matchesQuery && matchesStatus && matchesPayment;
  });

  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID").length;
  const shippedOrders = orders.filter((order) => order.shippingStatus === "SHIPPED").length;

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Pedidos</p>
      <h1 className="mt-4 font-serif text-5xl text-brand-900">Gestion comercial y operativa</h1>
      <ActionFeedback feedback={params.feedback} />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Pendientes" value={String(pendingOrders)} description="Ordenes esperando confirmacion inicial." />
        <MetricCard label="Pagados" value={String(paidOrders)} description="Pedidos con pago ya acreditado." />
        <MetricCard label="Despachados" value={String(shippedOrders)} description="Envios ya marcados como en camino." />
      </div>
      <div className="mt-8 rounded-[1.75rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
        <form className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto] lg:items-end">
          <label>
            <span className="mb-2 block text-sm text-brand-900/75">Buscar por pedido, cliente, email o tracking</span>
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Ej. AM-1001, clara@email.com o tracking"
              className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 placeholder:text-brand-900/35 focus:ring-2"
            />
          </label>
          <SelectField
            name="status"
            label="Estado pedido"
            defaultValue={status}
            options={[
              { value: "all", label: "Todos" },
              { value: "PENDING", label: "Pendiente" },
              { value: "CONFIRMED", label: "Confirmado" },
              { value: "IN_PREPARATION", label: "En preparacion" },
              { value: "SHIPPED", label: "Despachado" },
              { value: "DELIVERED", label: "Entregado" },
              { value: "CANCELLED", label: "Cancelado" },
            ]}
          />
          <SelectField
            name="payment"
            label="Estado pago"
            defaultValue={payment}
            options={[
              { value: "all", label: "Todos" },
              { value: "PENDING", label: "Pendiente" },
              { value: "PAID", label: "Pagado" },
              { value: "REJECTED", label: "Rechazado" },
              { value: "EXPIRED", label: "Expirado" },
              { value: "MANUAL_REVIEW", label: "Revision manual" },
              { value: "REFUNDED", label: "Reintegrado" },
            ]}
          />
          <div className="flex gap-3 lg:justify-end">
            <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand-900 px-4 py-3 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-brand-700">
              Aplicar
            </button>
            <a href="/admin/pedidos" className="inline-flex items-center justify-center rounded-full border border-brand-900/10 px-4 py-3 text-sm text-brand-900/78 transition hover:bg-brand-900/5">
              Limpiar
            </a>
          </div>
        </form>
        <div className="mt-5 text-sm text-brand-900/64">
          <span className="font-serif text-2xl text-brand-900">{filteredOrders.length}</span> pedidos visibles en esta vista.
        </div>
      </div>
      <div className="mt-8 grid gap-4">
        {filteredOrders.map((order) => (
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
        {filteredOrders.length === 0 ? (
          <article className="rounded-[1.5rem] border border-brand-900/10 bg-paper p-8 text-center text-brand-900/60 shadow-soft">
            No hay pedidos que coincidan con la busqueda o filtros activos.
          </article>
        ) : null}
      </div>
    </section>
  );
}

function MetricCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <article className="rounded-[1.5rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
      <p className="text-xs uppercase tracking-[0.22em] text-brand-700">{label}</p>
      <p className="mt-3 font-serif text-4xl text-brand-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-brand-900/64">{description}</p>
    </article>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm text-brand-900/75">{label}</span>
      <select name={name} defaultValue={defaultValue} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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
