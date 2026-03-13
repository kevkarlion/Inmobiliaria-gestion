import { seedClients } from "./clients.seed";
import { seedRequirements } from "./requirements.seed";

export async function runAllSeeds() {
  await seedClients();
  await seedRequirements();
}
