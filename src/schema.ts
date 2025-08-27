import { co, z } from "jazz-tools";

export const TierList = co.map({
  name: z.string(),
  description: z.string(),
  items: co.list(z.string()),
});
export type TierList = co.loaded<typeof TierList>;

/** The root is an app-specific per-user private `CoMap`
 *  where you can store top-level objects for that user */
export const AccountRoot = co.map({
  tierlists: co.list(TierList),
});

export const JazzAccount = co
  .account({
    root: AccountRoot,
    profile: co.profile(),
  })
  .withMigration((account) => {
    if (!account.root) {
      account.root = AccountRoot.create({ tierlists: [] }, account);
    }
  });
