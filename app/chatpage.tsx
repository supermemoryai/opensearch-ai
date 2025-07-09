/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useRef, useState, FormEvent } from 'react';
import Blobs from './Blobs';
import Globe from './Globe';
import Image from 'next/image';
import logo from './assets/logo.svg';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useMemories, useDeleteMemory, useCreateMemory } from './hooks/useMemories';
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
import WebReferences from "@/components/web-references";
import { getSearchResultsFromMemory } from './actions';

function ChatPage({ user }: { user: Session | null }) {
  const [searchResultsData, setSearchResultsData] =
    useState<BingResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    setInput,
    isLoading: isChatLoading,
  } = useChat();

  const [customUserMemory, setCustomUserMemory] = useState<string | null>(null);
  const [isMemoriesModalOpen, setIsMemoriesModalOpen] = useState(false);
  const [showMemoryDisclaimer, setShowMemoryDisclaimer] = useState(false);
  const [showDeletionDisclaimer, setShowDeletionDisclaimer] = useState(false);

  // React Query hooks
  const { data: userMemories = [], refetch: refetchMemories, isLoading: isLoadingMemories } = useMemories(user);
  const deleteMemoryMutation = useDeleteMemory(user);
  const createMemoryMutation = useCreateMemory(user);

  // Handling Memory Submit
  const handleMemorySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customUserMemory) return;

    createMemoryMutation.mutate(customUserMemory, {
      onSuccess: () => {
        setCustomUserMemory(null);
        setShowDeletionDisclaimer(false); // Hide deletion disclaimer if showing
        setShowMemoryDisclaimer(true);
        // Hide disclaimer after 10 seconds
        setTimeout(() => {
          setShowMemoryDisclaimer(false);
        }, 10000);
      },
      onError: (error) => {
        console.error('Error creating memory:', error);
      }
    });
  };

  const handleDeleteMemory = (memoryId: string) => {
    deleteMemoryMutation.mutate(memoryId, {
      onSuccess: () => {
        setShowMemoryDisclaimer(false); // Hide add disclaimer if showing
        setShowDeletionDisclaimer(true);
        // Hide disclaimer after 10 seconds
        setTimeout(() => {
          setShowDeletionDisclaimer(false);
        }, 10000);
      }
    });
  };

  const fetchSearch = async (
    query: string,
    e?: React.FormEvent<HTMLElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e?.preventDefault();
    e?.type === "keydown" && e.stopPropagation();

    setIsSearching(true);

    try {
      // For search, we'll still use the server action directly since it needs to be called on form submit
      // and we want to handle the chat flow
      const data = await getSearchResultsFromMemory(query, user);
      if (!data) {
        setIsSearching(false);
        return;
      }

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
    } catch (error) {
      console.error('Search error:', error);
      setIsSearching(false);
    }

    return searchResultsData;
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

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className="relative h-screen">
      <div className="absolute flex max-h-screen h-full overflow-hidden items-center justify-center w-full -z-10 blur-xl">
        <Blobs />
      </div>
      <main className="min-h-screen flex flex-col items-center p-8  md:pt-16 md:px-16">
        <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
          <div className="flex gap-4 w-full flex-row items-center justify-between">
            {
              searchResultsData ? (
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Home
                </button>
              ) : (
                <div className="flex flex-col gap-4 justify-center">
                  <a
                    className="pointer-events-none flex items-center gap-2 lg:pointer-events-auto text-lg"
                    href="https://supermemory.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className='-mt-1 pr-1'>
                      <Image
                        src={logo}
                        alt="Supermemory Logo"
                        className="invert dark:invert-0"
                        width={48}
                        height={48}
                        priority
                      />
                    </div>
                    <div className='space-y-0.5 '>
                      <h1 className='text-3xl font-light leading-none whitespace-nowrap'>Open Search</h1>
                      <h1 className='text-sm ml-0.5 tracking-widest font-light font-sans leading-none text-muted-foreground'>by Supermemory</h1>
                    </div>
                  </a>

                </div>
              )
            }


            <div className='flex gap-4 items-center'>
              {user?.user && (
                <Credenza open={isMemoriesModalOpen} onOpenChange={(open) => {
                  setIsMemoriesModalOpen(open);
                  if (!open) {
                    setShowMemoryDisclaimer(false);
                    setShowDeletionDisclaimer(false);
                  }
                }}>
                  <CredenzaTrigger asChild>
                    <button
                      onClick={() => {
                        refetchMemories();
                        setIsMemoriesModalOpen(true);
                      }}
                      className="p-4 w-fit text-left lg:w-auto"
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
                        Memories collected from your searches and custom notes
                      </CredenzaDescription>
                    </CredenzaHeader>
                    <CredenzaBody>
                      <ul className="list-disc max-h-96 overflow-y-auto flex flex-col gap-2">
                        {showMemoryDisclaimer && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-2 text-sm text-blue-700">
                            <p className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                              </svg>
                              Memories may take up to a minute to be fully processed.
                            </p>
                          </div>
                        )}
                        {showDeletionDisclaimer && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2 text-sm text-yellow-700">
                            <p className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                              Deletions may take up to 30 seconds to process.
                            </p>
                          </div>
                        )}
                        {isLoadingMemories ? (
                          <div className="flex items-center justify-center py-8">
                            <LoadingSpinner />
                            <span className="ml-2">Loading memories...</span>
                          </div>
                        ) : userMemories?.length === 0 ? (
                          <li className="text-center py-4">
                            Nothing here... Yet! Just start browsing and asking
                            questions. I&apos;ll remember it.
                          </li>
                        ) : (
                          userMemories?.map((memory) => (
                            <li
                              key={memory.id}
                              className="text-sm border rounded-md p-2 flex gap-2 justify-between"
                            >
                              <span>{memory.memory}</span>
                              <button
                                onClick={() => handleDeleteMemory(memory.id)}
                                disabled={deleteMemoryMutation.isPending}
                                className={deleteMemoryMutation.isPending ? 'opacity-50' : ''}
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
                          ))
                        )}
                        <form
                          onSubmit={handleMemorySubmit}
                          className="flex justify-between items-center gap-2"
                        >
                          <input
                            value={customUserMemory ?? ''}
                            onChange={(e) => setCustomUserMemory(e.target.value)}
                            className="rounded-md border p-2 w-full"
                            placeholder="Type something here to add it to memory"
                            disabled={createMemoryMutation.isPending}
                          />
                          <button
                            className="p-2 rounded-md bg-black text-white disabled:opacity-50"
                            type="submit"
                            disabled={createMemoryMutation.isPending}
                          >
                            {createMemoryMutation.isPending ? 'Adding...' : 'Add'}
                          </button>
                        </form>
                      </ul>
                    </CredenzaBody>
                  </CredenzaContent>
                </Credenza>
              )}
              <a
                href="https://github.com/supermemoryai/opensearch-ai"
                className="flex max-lg:hidden items-center gap-4
                 py-4 lg:static lg:w-auto"
              >
                <span>Github</span>
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
            </div>


          </div>
        </div>
        <div className="h-full flex-grow flex flex-col items-center justify-center w-full">
          {searchResultsData ? (
            <div className="flex flex-col gap-4 items-start max-w-3xl w-full mt-8">
              {messages.map((message, i) => (
                <div key={`message-${i}`} className="w-full max-w-3xl flex flex-col gap-2">
                  {message.role === 'user' ? (
                    <div className="flex gap-4 font-bold text-2xl">
                      <img
                        src={user?.user?.image ?? '/user-placeholder.svg'}
                        className="rounded-full w-10 h-10 border-2 border-primary-foreground"
                        alt="User profile picture"
                      />
                      <span>{message.content}</span>
                    </div>
                  ) : (
                    <div>
                      <WebReferences searchResults={searchResultsData} />
                      <div className="prose lg:prose-xl" key={message.id}>
                        <Markdown>{message.content}</Markdown>
                      </div>

                    </div>
                  )}
                </div>
              ))}

              {messages.length > 0 && messages[messages.length - 1].role === 'user' && isChatLoading && (
                <div className="w-full max-w-3xl">
                  <WebReferences searchResults={searchResultsData} />
                  <div className="flex items-center gap-2 text-lg">
                    <LoadingSpinner />

                    <span>Generating...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full items-center justify-center -mt-40">
              <Globe />
              <div className="text-4xl md:text-6xl">Open Search</div>

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
                    className={`rounded-xl font-sans max-w-xl w-full border border-blue-500/50 p-4 bg-white bg-opacity-30 backdrop-blur-xl min-h-20 ${isSearching ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    disabled={isSearching}
                    //   keydown listener to submit form on enter
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !isSearching) {
                        await fetchSearch(input, e);
                      }
                    }}
                  />

                  <button
                    type="submit"
                    className="absolute top-4 right-4 rounded-lg bg-black text-white p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <LoadingSpinner />
                    ) : (
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
                    )}
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
          )}</div>
        <a
          href="https://github.com/supermemoryai/opensearch-ai"
          className="flex items-center gap-2 lg:hidden mt-24"
        >
          <span>Github</span>
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
      </main>
    </div>
  );
}

export default ChatPage;
