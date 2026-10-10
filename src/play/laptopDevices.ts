export type LaptopFamily = 'PacBook' | 'Hell' | 'TankPad';

const pacBookRoles = new Set(['frontend', 'mobile', 'designer', 'product', 'ux-research', 'ux']);
const tankPadRoles = new Set(['backend', 'devops', 'sre', 'sysadmin', 'security', 'architect', 'solution-architect', 'data-engineer', 'dba']);

/** Device identity follows the current hero, including careers continued after reload. */
export function laptopFamily(profession: string): LaptopFamily {
    if (pacBookRoles.has(profession)) return 'PacBook';
    if (tankPadRoles.has(profession)) return 'TankPad';
    return 'Hell';
}
