import { DataSource } from "typeorm";
import { Permission } from "../Entities/Permissions";
import { Role } from "../Entities/Roles";

export const PERMISSION_SEEDS: Array<Pick<Permission, "name" | "description">> = [
  { name: "product:create",    description: "Create products"    },
  { name: "product:update",    description: "Update products"    },
  { name: "product:delete",    description: "Delete products"    },
  { name: "product:view",      description: "View products"      },
  { name: "sale:create",       description: "Create sales"       },
  { name: "sale:view",         description: "View sales"         },
  { name: "user:create",       description: "Create users"       },
  { name: "user:view",         description: "View users"         },
  { name: "user:update",       description: "Update users"       },
  { name: "user:delete",       description: "Delete users"       },
  { name: "inventory:view",    description: "View inventory"     },
  { name: "inventory:update",  description: "Update inventory"   },
];

const ROLE_PERMISSION_NAMES: Record<string, string[]> = {
  admin: PERMISSION_SEEDS.map((p) => p.name),
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

export async function seedPermissions(dataSource: DataSource): Promise<void> {
  const permissionRepository = dataSource.getRepository(Permission);
  const roleRepository = dataSource.getRepository(Role);

  await permissionRepository.upsert(PERMISSION_SEEDS, ["name"]);

  const permissions = await permissionRepository.find();
  const byName = new Map(permissions.map((p) => [p.name, p]));
  const roles = await roleRepository.find({ relations: { permissions: true } });

  for (const role of roles) {
    const permissionNames = ROLE_PERMISSION_NAMES[role.name.toLowerCase()];
    if (!permissionNames) continue;

    const existing = new Set((role.permissions ?? []).map((p) => p.name));
    const toAdd = permissionNames
      .filter((name) => !existing.has(name))
      .map((name) => byName.get(name))
      .filter((p): p is Permission => Boolean(p));

    if (toAdd.length === 0) continue;

    role.permissions = [...(role.permissions ?? []), ...toAdd];
    await roleRepository.save(role);
  }
}

export default seedPermissions;