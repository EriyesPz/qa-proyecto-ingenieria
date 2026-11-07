export const APP_ROLES = [
  "admin",
  "coordinador",
  "atencion_pacientes",
  "encargado_farmacia",
  "encargado_bodega",
  "voluntario",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrador",
  coordinador: "Coordinador",
  atencion_pacientes: "Atención de Pacientes",
  encargado_farmacia: "Encargado de Farmacia",
  encargado_bodega: "Encargado de Bodega",
  voluntario: "Voluntario",
};

export function isAppRole(value: string | null | undefined): value is AppRole {
  if (!value) return false;
  return (APP_ROLES as readonly string[]).includes(value.toLowerCase());
}

export type RoleRelation = { nombre?: string | null; es_superadmin?: boolean | null };

// Mapea los roles dinámicos de la tabla `roles` a los identificadores estáticos del código.
export function resolveAppRole(
  roleData?: RoleRelation | RoleRelation[] | string | null
): AppRole {
  if (Array.isArray(roleData)) roleData = roleData[0];
  if (!roleData) return "voluntario";
  if (typeof roleData === "string") {
    const lower = roleData.toLowerCase();
    if (isAppRole(lower)) return lower;
    if (lower === "administrador") return "admin";
    if (lower.includes("medico") || lower.includes("médico") || lower.includes("odontol")) return "atencion_pacientes";
    return "voluntario";
  }
  if (roleData.es_superadmin) return "admin";
  const name = roleData.nombre?.toLowerCase() || "";
  if (name.includes("admin")) return "admin";
  if (name.includes("coordinador")) return "coordinador";
  if (name.includes("paciente") || name.includes("medico") || name.includes("médico") || name.includes("odontol")) return "atencion_pacientes";
  if (name.includes("farmacia")) return "encargado_farmacia";
  if (name.includes("bodega") || name.includes("inventario")) return "encargado_bodega";
  return "voluntario";
}
