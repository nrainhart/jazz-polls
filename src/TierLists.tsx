import { useAccount } from "jazz-tools/react";
import { JazzAccount } from "./schema.ts";

export function TierLists() {
  const { me } = useAccount(JazzAccount, {
    resolve: { root: { tierlists: true } },
  });

  console.log(me?.root.tierlists);

  return (
    <>
      <section className="space-y-5">
        <a
          href={`/#/order`}
          className="block relative p-3 bg-white border border-stone-200 text-center rounded-md dark:bg-stone-900 dark:border-stone-900"
        >
          <strong>Add new order</strong>
        </a>

        <div className="space-y-3">
          <h1 className="text-lg pb-2 border-b mb-3 border-stone-200 dark:border-stone-700">
            <strong>Your tierlists: </strong>
          </h1>

          <p>You have no orders yet.</p>
        </div>
      </section>
    </>
  );
}
