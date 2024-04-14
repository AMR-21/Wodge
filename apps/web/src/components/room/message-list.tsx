import { Message } from "./message";

export interface Message {
  sender: string;
  content: string;
  date: string;
  id: string;
}

const messages: Message[] = [
  {
    sender: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: "Hello, world!",
    date: "2021-10-11T14:48:00.000Z",
    id: "1",
  },
  {
    sender: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: "How are you?",
    date: "2021-10-11T14:48:00.000Z",
    id: "2",
  },
];

export function MessageList() {
  return (
    <div className="flex flex-col gap-2 pb-2 pt-4">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
}
