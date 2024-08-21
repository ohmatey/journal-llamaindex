"use server";

import { createStreamableUI } from "ai/rsc";
import { 
  OpenAIAgent, 
  Document, 
  VectorStoreIndex, 
  FunctionTool
} from "llamaindex";
import type { ChatMessage } from "llamaindex/llm/types";

import getJournalData from "./utils/getJournalData";

const getJournalDataTool = FunctionTool.from(
  async ({ query }: { query: string }): Promise<string> => {
    const filesData = await getJournalData();

    const fileDocuments = filesData?.map((file) => {
      if (!file || !file.content) {
        return null
      }

      const document = new Document({ text: file.content });

      return { document, name: file.name };
    });

    const documents = fileDocuments.map((file) => file.document).filter(Boolean);

    // Split text and create embeddings. Store them in a VectorStoreIndex
    const index = await VectorStoreIndex.fromDocuments(documents);

    const queryEngine = index.asQueryEngine();

    const response = await queryEngine.query({
      query,
    });

    return response.toString();
  },
  {
    name: "getJournalDataTool",
    description: "Retrieve data from journal based on a query. Returns content of the journal.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The query to search for in the journal",
        },
      },
      required: ["query"],
    },
  },
);

const systemPrompt: string = `
  You are a personal assistant to a busy executive.
  They are looking for a way to manage their time more effectively to deliver better outcomes.

  You have access to their journal that contains everything you need to know about them.
  Always use getJournalDataTool tool for any information you need from the journal.
  Always return the information in a human-readable format with no markdown or HTML tags.
`;

export async function chatWithAgent(
  question: string,
  prevMessages: ChatMessage[] = [],
) {
  const agent = new OpenAIAgent({
    tools: [
      getJournalDataTool,
    ],
    systemPrompt
  });
  
  const responseStream = await agent.chat({
    stream: true,
    message: question,
    chatHistory: prevMessages,
  });
  
  const uiStream = createStreamableUI(
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" stroke="#1E1E1E" stroke-width="5" fill="none" opacity="0.3" />
      
      <circle cx="50" cy="50" r="45" stroke="#1E90FF" stroke-width="5" fill="none" stroke-dasharray="282" stroke-dashoffset="75">
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from="0 50 50" 
          to="360 50 50" 
          dur="2s" 
          repeatCount="indefinite"/>
      </circle>
      
      <circle cx="50" cy="50" r="5" fill="#FFD700">
        <animateTransform 
          attributeName="transform" 
          type="scale" 
          values="1;1.5;1" 
          dur="1s" 
          repeatCount="indefinite"/>
      </circle>
    </svg>

  );
  
  responseStream
    .pipeTo(
      new WritableStream({
        start: () => {
          uiStream.update("");
        },
        write: async (message) => {
          uiStream.append(<>{message.message.content}</>);
        },
        close: () => {
          // uiStream.append(<div>chat ended</div>);

          uiStream.done();
        },
      }),
    )
    .catch(console.error);
  
    return uiStream.value;
}