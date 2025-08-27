import { useIframeHashRouter } from "hash-slash";
import { TierLists } from "./TierLists.tsx";

function App() {
  const router = useIframeHashRouter();

  return (
    <>
      <main className="max-w-xl mx-auto px-3 py-8 space-y-8">
        {router.route({
          "/": () => <TierLists />,
        })}
      </main>
    </>
  );
}

export default App;
