const feedbackMessages: Record<string, string> = {
  "product-saved": "Producto guardado correctamente.",
  "product-status-updated": "Estado del producto actualizado.",
  "product-duplicated": "Producto duplicado y listo para editar.",
  "order-updated": "Pedido actualizado correctamente.",
  "category-created": "Categoria creada correctamente.",
  "category-updated": "Categoria actualizada correctamente.",
  "admin-user-created": "Usuario admin creado correctamente.",
  "admin-user-updated": "Usuario admin actualizado correctamente.",
  forbidden: "No tenes permisos para acceder a ese modulo.",
  "home-block-saved": "Bloque del home guardado.",
  "home-block-toggled": "Estado del bloque actualizado.",
  "site-page-saved": "Pagina institucional guardada.",
};

export function ActionFeedback({ feedback }: { feedback?: string }) {
  if (!feedback || !feedbackMessages[feedback]) {
    return null;
  }

  return (
    <div className="mt-6 rounded-[1.35rem] border border-green-700/15 bg-green-50 px-5 py-4 text-sm text-green-800 shadow-soft">
      {feedbackMessages[feedback]}
    </div>
  );
}
