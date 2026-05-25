import { subscribe } from "../../../lib/sse";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const send = (data) => {
        if (closed) return;

        try {
          controller.enqueue(
            `data: ${JSON.stringify(data)}\n\n`
          );
        } catch (err) {
          closed = true;
          unsubscribe();
        }
      };

      const unsubscribe = subscribe(send);

      return () => {
        closed = true;
        unsubscribe();
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    },
  });
}