import { DataSource } from "typeorm";
import { Permission } from "../Entities/Permissions";
import { Role } from "../Entities/Roles";

export const PERMISSION_SEEDS: Array<Pick<Permission, "name" | "description">> = [
  { name: "product:create", description: "Create products" },
  { name: "product:update", description: "Update products" },
  { name: "product:delete", description: "Delete products" },
  { name: "product:view", description: "View products" },
  { name: "sale:create", description: "Create sales" },
  { name: "sale:view", description: "View sales" },
  { name: "user:create", description: "Create users" },
  { name: "user:view", description: "View users" },
  { name: "user:update", description: "Update users" },
  { name: "user:delete", description: "Delete users" },
  { name: "inventory:view", description: "View inventory" },
  { name: "inventory:update", description: "Update inventory" },
];

export async function seedPermissions(dataSource: DataSource): Promise<void> {
  const permissionRepository = dataSource.getRepository(Permission);
  const roleRepository = dataSource.getRepository(Role);

  await permissionRepository.upsert(PERMISSION_SEEDS, ["name"]);

  const permissions = await permissionRepository.find();
  const permissionsByName = new Map(permissions.map((permission) => [permission.name, permission]));
  const roles = await roleRepository.find({ relations: { permissions: true } });

  const rolePermissionNames: Record<string, string[]> = {
    admin: PERMISSION_SEEDS.map((permission) => permission.name),
    manager: [
      "product:create",
      "product:update",
      "product:view",
      "sale:create",
      "sale:view",
      "inventory:view",
      "inventory:update",
    ],
  };

  for (const role of roles) {
    const permissionNames = rolePermissionNames[role.name.toLowerCase()];
    if (!permissionNames) continue;

    const existingPermissions = role.permissions ?? [];
    const existingPermissionNames = new Set(existingPermissions.map((permission) => permission.name));
    const newPermissions = permissionNames
      .filter((permissionName) => !existingPermissionNames.has(permissionName))
      .map((permissionName) => permissionsByName.get(permissionName))
      .filter((permission): permission is Permission => Boolean(permission));

    if (newPermissions.length === 0) continue;

    role.permissions = [...existingPermissions, ...newPermissions];
    await roleRepository.save(role);
  }
}
