/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useRef, useState } from "react";
import Blobs from "./Blobs";
import Globe from "./Globe";
import Image from "next/image";
import mem0Logo from "./assets/logo.png";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import {
  createCustomMemory,
  deleteMemory,
  getMem0Memories,
  getSearchResultsFromMemory,
} from "./actions";
import { BingResults } from "./types";
import { useChat } from "ai/react";
import Markdown from "react-markdown";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { useSearchParams } from "next/navigation";

function ChatPage({ user }: { user: Session | null }) {
  const [searchResultsData, setSearchResultsData] =
    useState<BingResults | null>(null);

  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    setInput,
  } = useChat();

  const [customUserMemory, setCustomUserMemory] = useState<string | null>(null);

  const [userMemories, setUserMemories] = useState<
    { memory: string; id: string }[]
  >([]);

  const fetchSearch = async (
    query: string,
    e?: React.FormEvent<HTMLElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e?.preventDefault();
    e?.type === "keydown" && e.stopPropagation();

    const data = await getSearchResultsFromMemory(query, user);
    if (!data) return;

    setSearchResultsData(data);

    if (!e) {
      append({
        role: "user",
        content: query,
      }, {
        body: {
          data,
          input: query
        }
      })
    }

    handleSubmit(e, { body: { data, input: query } });

    return data;
  };

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (initialQuery) {
        setInput(initialQuery);
        fetchSearch(initialQuery);
      }
    }
  }, [initialQuery]);

  return (
    <div className="relative h-screen">
      <div className="absolute flex max-h-screen h-full overflow-hidden items-center justify-center w-full -z-10 blur-xl">
        <Blobs />
      </div>
      {!searchResultsData && (
        <div className="absolute flex min-h-screen items-start justify-center w-full -z-10">
          <Globe />
        </div>
      )}

      <main className="min-h-screen flex flex-col items-center justify-between p-4 md:p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <div className="flex flex-row gap-4">
            <a
              href="https://github.com/supermemoryai/opensearch-ai"
              className="fixed flex items-center justify-between gap-4 left-0 top-0 w-full border-b border-gray-300 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:p-4 bg-white px-2 md:px-0"
            >
              Open source{" "}
              <svg
                viewBox="0 0 256 250"
                width="20"
                height="20"
                fill="#000"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z" />
              </svg>
            </a>

            {user?.user && (
              <Credenza>
                <CredenzaTrigger asChild>
                  <button
                    onClick={async () => {
                      const mems = await getMem0Memories(user);
                      setUserMemories(mems ?? []);
                    }}
                    className="p-4"
                  >
                    Saved memories
                  </button>
                </CredenzaTrigger>
                <CredenzaContent>
                  <CredenzaHeader>
                    <CredenzaTitle className="text-lg font-bold">
                      Your Memories
                    </CredenzaTitle>
                    <CredenzaDescription>
                      Information automatically collected about you by mem0.ai
                    </CredenzaDescription>
                  </CredenzaHeader>
                  <CredenzaBody>
                    <ul className="list-disc max-h-96 overflow-y-auto flex flex-col gap-2">
                      {userMemories.length === 0 && (
                        <li>
                          Nothing here... Yet! Just start browsing and asking
                          questions. I&apos;ll remember it.
                        </li>
                      )}
                      {userMemories.map((memory) => (
                        <li
                          key={memory.id}
                          className="text-sm border rounded-md p-2 flex gap-2 justify-between"
                        >
                          <span>{memory.memory}</span>
                          <button
                            onClick={async () => deleteMemory(memory.id, user)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="size-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </li>
                      ))}
                      <form
                        onSubmit={async () => {
                          if (!customUserMemory) return;
                          const memory = await createCustomMemory(
                            customUserMemory,
                            user
                          );
                          // @ts-ignore
                          setUserMemories([...userMemories, memory]);
                        }}
                        className="flex justify-between items-center gap-2"
                      >
                        <input
                          value={customUserMemory ?? ""}
                          onChange={(e) => setCustomUserMemory(e.target.value)}
                          className="rounded-md border p-2 w-full"
                          placeholder="Type something here to add it to memory"
                        />
                        <button
                          className="p-2 rounded-md bg-black text-white"
                          type="submit"
                        >
                          Add
                        </button>
                      </form>
                    </ul>
                  </CredenzaBody>
                </CredenzaContent>
              </Credenza>
            )}
          </div>

          {searchResultsData && (
            <button
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Home
            </button>
          )}

          {!searchResultsData && (
            <div className="fixed bottom-0 left-0 flex flex-col gap-4 h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
              <a
                className="pointer-events-none flex place-items-center items-center justify-center gap-2 p-8 lg:pointer-events-auto lg:p-0 font-sans text-lg"
                href="https://supermemory.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                Built by{""}
                <Image
                  src={"https://supermemory.ai/logo.svg"}
                  alt="Supermemory Logo"
                  className="invert dark:invert-0"
                  width={30}
                  height={30}
                  priority
                />{" "}
                Supermemory.ai
              </a>
              <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://mem0.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                Personalization by{" "}
                <Image
                  src={mem0Logo}
                  alt="Mem0 Logo"
                  className="dark:invert"
                  width={100}
                  height={24}
                  priority
                />
              </a>
            </div>
          )}
        </div>

        {searchResultsData ? (
          <div className="flex flex-col gap-4 items-start max-w-3xl w-full mt-32 md:mt-8">
            {messages.map((message) => (
              <div key={message.id} className="w-full max-w-3xl flex flex-col gap-2">
                {message.role === "user" ? (
                  <div className="flex gap-4 font-bold text-2xl">
                    <img
                      src={user?.user?.image ?? "/user-placeholder.svg"}
                      className="rounded-full w-10 h-10 border-2 border-primary-foreground"
                      alt="User profile picture"
                    />
                    <span>{message.content}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex flex-row gap-4 overflow-x-auto mt-4">
                        {searchResultsData?.web.results
                          .slice(0, 6)
                          .map((item, index) => (
                            <div key={`SearchResults-${message.id}-${index}`} className="bg-white border border-neutral-400 backdrop-blur-md rounded-xl bg-opacity-30 w-96 flex flex-col gap-4 p-2">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-4 p-4 items-center"
                              >
                                <div className="flex flex-col gap-2">
                                  <div className="flex gap-2 items-center">
                                    <img
                                      src={item.meta_url.favicon}
                                      alt={item.description}
                                      className="w-4 h-4 object-cover rounded"
                                    />
                                    <h2 className="font-semibold line-clamp-2 text-sm text-neutral-500">
                                      {item.title}
                                    </h2>
                                  </div>
                                  <p className="text-sm line-clamp-3">
                                    {item.description}
                                  </p>
                                </div>
                              </a>
                            </div>
                          ))}

                        {searchResultsData.web.results.length > 6 && (
                          <div className="bg-white backdrop-blur-md rounded-xl bg-opacity-50 w-96 flex flex-col gap-4 p-4 h-32">
                            <div className="flex flex-col gap-4 p-4">
                              <h2 className="font-semibold">
                                {searchResultsData.web.results.length - 6} more
                                results
                              </h2>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 overflow-x-auto mt-4">
                        {searchResultsData?.web.results
                          .slice(0, 6)
                          .map((item, key) => {
                            const src = item.thumbnail?.src;

                            if (!src) return null;

                            return (
                              <img
                                key={item.url}
                                src={src}
                                alt={item.description}
                                className="w-24 h-24 object-cover rounded"
                                key={key}
                              />
                            );
                          })}
                        {searchResultsData.web.results.length > 4 && (
                          <div className="relative w-24 h-24">
                            <img
                              src="/placeholder.svg"
                              className="w-full h-full object-cover rounded"
                              alt="placeholder"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                              <span className="text-white text-xl font-bold">
                                +{searchResultsData.web.results.length - 4}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="prose lg:prose-xl" key={message.id}>
                      <Markdown>{message.content}</Markdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full items-center justify-center">
            <div className="text-4xl md:text-6xl mt-20">Open Search GPT</div>

            {user && user.user ? (
              <form
                id="search-form"
                onSubmit={async (e) => {
                  await fetchSearch(input, e);
                }}
                className="flex relative gap-2 max-w-xl w-full"
              >
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  name="query"
                  cols={2}
                  placeholder="What are you looking for?"
                  className="rounded-xl font-sans max-w-xl w-full border border-blue-500/50 p-4 bg-white bg-opacity-30 backdrop-blur-xl min-h-20"
                  //   keydown listener to submit form on enter
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      await fetchSearch(input, e);
                    }
                  }}
                />

                <button
                  type="submit"
                  className="absolute top-4 right-4 rounded-lg bg-black text-white p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="px-4 py-2 rounded-full bg-black text-white flex gap-2 justify-between items-center"
              >
                <img
                  src={'./google.png'}
                  width={20}
                  height={20}
                  alt="google logo"
                />
                <p className="text-center mt-1">Sign in with Google</p>
              </button>
            )}
          </div>
        )}

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"></div>
      </main>
    </div>
  );
}

export default ChatPage;
