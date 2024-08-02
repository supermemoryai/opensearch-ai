/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DOMPurify from 'dompurify';

export default function WebReferences({
  searchResults,
}: {
  searchResults: any;
}) {
  return (
    <>
      <Dialog>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex flex-row gap-4 overflow-x-auto mt-4">
            {searchResults?.web.results.slice(0, 6).map((item, index) => (
              <div
                key={`SearchResults-${index}`}
                className="bg-white border border-neutral-400 backdrop-blur-md rounded-xl bg-opacity-30 w-96 flex flex-col gap-4 p-2"
              >
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
                    <p
                      className="text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(item.description),
                      }}
                    ></p>
                  </div>
                </a>
              </div>
            ))}

            {searchResults.web.results.length > 6 && (
              <DialogTrigger className="bg-white backdrop-blur-md rounded-xl bg-opacity-50 w-96 flex flex-col gap-4 p-4 h-32 cursor-pointer">
                <div className="flex flex-col gap-4 p-4">
                  <h2 className="font-semibold">
                    {searchResults.web.results.length - 6} more results
                  </h2>
                </div>
              </DialogTrigger>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto mt-4">
            {searchResults?.web.results.slice(0, 6).map((item: any) => {
              const src = item.thumbnail?.src;

              if (!src) return null;

              return (
                <img
                  key={item.url}
                  src={src}
                  alt={item.description}
                  className="w-24 h-24 object-cover rounded"
                />
              );
            })}
            {searchResults.web.results.length > 4 && (
              <div className="relative w-24 h-24">
                <img
                  src="/placeholder.svg"
                  className="w-full h-full object-cover rounded"
                  alt="placeholder"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                  <span className="text-white text-xl font-bold">
                    +{searchResults.web.results.length - 4}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogContent className="max-h-[80vh] overflow-y-auto max-w-[70vw]">
          <DialogHeader>
            <DialogTitle>References</DialogTitle>
            <DialogDescription>Search results from the web</DialogDescription>
          </DialogHeader>
          <div>
            {searchResults?.web.results.map((item: any) => (
              <div key={item.url} className="flex flex-col gap-4 p-4">
                <div className="flex gap-2 items-center">
                  <img
                    src={item.meta_url.favicon}
                    alt={item.description}
                    className="w-4 h-4 object-cover rounded"
                  />
                  <h2 className="font-semibold line-clamp-2 text-lg">
                    {item.title}
                  </h2>
                </div>
                <p
                  className="text-sm line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(item.description),
                  }}
                ></p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {item.url}
                </a>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
