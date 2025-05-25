import { serve } from "inngest/next";
import { inngest } from "./../../../inngest/client";
import { createVoice } from "./../../../inngest/functions/createVoice";

// Configurar o Inngest com as funções necessárias
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [createVoice]
});


